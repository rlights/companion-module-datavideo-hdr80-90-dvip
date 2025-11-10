import { InstanceBase, InstanceStatus, TCPHelper } from '@companion-module/base'
import { getActions } from './actions.js'
import { getFeedbacks } from './feedbacks.js'
import { getPresets } from './presets.js'
import { initVariables, updateVariables } from './variables.js'
import {
	TCP_PORT,
	POLLING_INTERVAL_STATUS,
	POLLING_INTERVAL_CONFIG,
	POLLING_INTERVAL_TIME,
	COMMANDS,
	DEVICE_TYPE_RESPONSE,
} from './constants.js'

class HdrInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
		this.pollers = {}
		this.dataBuffer = Buffer.alloc(0)
		this.fw = 'Unknown'

		// Command queue and timing
		this.commandQueue = []
		this.commandInFlight = false
		this.commandTimer = null
		this.nakPauseTimer = null

		// Module state
		this.state = {
			statusBytes: Buffer.alloc(13), // From "Current Status Sense"
			configBytes: Buffer.alloc(8), // From "System Configuration Sense"
			timecode: '00:00:00:00',
			remainTime: '00:00:00',
		}
	}

	async init(config) {
		this.config = config
		this.log('debug', 'Initializing module')

		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.initTCP()
	}

	async destroy() {
		this.log('debug', 'Destroying module')
		this.stopPolling()
		this.commandQueue = []
		if (this.socket) {
			this.socket.destroy()
		}
	}

	async configUpdated(config) {
		this.config = config
		this.log('debug', 'Configuration updated')
		this.initTCP()
	}

	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Device IP',
				width: 8,
				regex: this.REGEX_IP,
			},
		]
	}

	initTCP() {
		this.stopPolling() // Clear any existing pollers
		this.commandQueue = []
		this.commandInFlight = false
		clearTimeout(this.commandTimer)
		clearTimeout(this.nakPauseTimer)

		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		if (this.config.host) {
			this.socket = new TCPHelper(this.config.host, TCP_PORT)
			this.updateStatus(InstanceStatus.Connecting)

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)
				this.stopPolling()
			})

			this.socket.on('connect', () => {
				this.updateStatus(InstanceStatus.Ok)
				this.log('info', 'Connected to ' + this.config.host)
				this.dataBuffer = Buffer.alloc(0)
				this.runInitSequence()
				this.startPolling()
			})

			this.socket.on('data', (data) => {
				this.processData(data)
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	runInitSequence() {
		this.log('debug', 'Running Init Sequence')
		// 1. Request Device Type
		this.sendCommand(COMMANDS.SENSE.DEVICE_TYPE.cmd, COMMANDS.SENSE.DEVICE_TYPE.data)
		// 2. Request Firmware Version
		this.sendCommand(COMMANDS.SENSE.FW_VERSION.cmd, COMMANDS.SENSE.FW_VERSION.data)
	}

	startPolling() {
		this.stopPolling() // Ensure no old pollers are running

		const createPoller = (key, command, data, interval) => {
			const poll = () => {
				this.sendCommand(command, data)
				this.pollers[key] = setTimeout(poll, interval)
			}
			this.pollers[key] = setTimeout(poll, interval)
		}

		createPoller('status', COMMANDS.SENSE.CURRENT_STATUS.cmd, COMMANDS.SENSE.CURRENT_STATUS.data, POLLING_INTERVAL_STATUS)
		createPoller('config', COMMANDS.SENSE.CURRENT_CONFIG.cmd, COMMANDS.SENSE.CURRENT_CONFIG.data, POLLING_INTERVAL_CONFIG)
		createPoller(
			'time',
			COMMANDS.SENSE.CURRENT_TIME.cmd,
			COMMANDS.SENSE.CURRENT_TIME.data,
			POLLING_INTERVAL_TIME
		)
		createPoller(
			'remain',
			COMMANDS.SENSE.REMAIN_TIME.cmd,
			COMMANDS.SENSE.REMAIN_TIME.data,
			POLLING_INTERVAL_TIME
		)

		this.log('debug', 'Polling started')
	}

	stopPolling() {
		Object.values(this.pollers).forEach(clearTimeout)
		this.pollers = {}
		clearTimeout(this.commandTimer)
		clearTimeout(this.nakPauseTimer)
	}

	/**
	 * Queues a command to be sent to the device.
	 * @param {Array<number>} cmd - [CMD-1, CMD-2]
	 * @param {Array<number>} data - Array of data bytes
	 */
	sendCommand(cmd, data = []) {
		// To prevent the queue from growing infinitely if the device is not responding
		if (this.commandQueue.length > 20) {
			this.log('warn', 'Command queue is full, discarding new command.')
			return
		}
		this.commandQueue.push({ cmd, data })
		this.processCommandQueue()
	}

	processCommandQueue() {
		if (this.commandInFlight || this.commandQueue.length === 0 || this.nakPauseTimer) {
			return
		}

		if (!this.socket || !this.socket.isConnected) {
			this.commandQueue = [] // Clear queue if socket is not ready
			return
		}

		this.commandInFlight = true
		const { cmd, data } = this.commandQueue.shift()

		const cmd1 = cmd[0]
		const cmd2 = cmd[1]
		const dataCount = data.length

		if (dataCount > 15) {
			this.log('warn', `Invalid command: Data count ${dataCount} exceeds 15. Dropping.`)
			this.commandInFlight = false
			this.processCommandQueue()
			return
		}

		const byte0 = (cmd1 << 4) | dataCount
		const packet = [byte0, cmd2, ...data]

		let checksum = 0
		for (const byte of packet) {
			checksum = (checksum + byte) % 256
		}
		packet.push(checksum)

		this.commandTimer = setTimeout(() => {
			this.log('warn', `Command ${cmd2.toString(16)} timed out after 10ms.`)
			this.commandInFlight = false
			this.processCommandQueue()
		}, 10)

		this.socket.write(Buffer.from(packet))
	}

	processData(data) {
		this.dataBuffer = Buffer.concat([this.dataBuffer, data])

		while (this.dataBuffer.length > 0) {
			if (this.dataBuffer.length < 3) {
				return // Not enough data for a minimal packet
			}

			const byte0 = this.dataBuffer[0]
			const dataCount = byte0 & 0x0f
			const expectedLength = 1 + 1 + dataCount + 1 // byte0, cmd2, data, checksum

			if (this.dataBuffer.length < expectedLength) {
				return // Not enough data for the full packet yet
			}

			const packet = this.dataBuffer.subarray(0, expectedLength)
			this.dataBuffer = this.dataBuffer.subarray(expectedLength)

			// A response has been received, so clear the timeout and in-flight flag
			clearTimeout(this.commandTimer)
			this.commandInFlight = false

			// Verify checksum
			const receivedChecksum = packet[packet.length - 1]
			let calculatedChecksum = 0
			for (let i = 0; i < packet.length - 1; i++) {
				calculatedChecksum = (calculatedChecksum + packet[i]) % 256
			}

			if (receivedChecksum !== calculatedChecksum) {
				this.log('warn', `Checksum mismatch. Got ${receivedChecksum}, expected ${calculatedChecksum}. Discarding packet.`)
				this.processCommandQueue() // Continue with next command
				continue // to next packet in buffer
			}

			this.parseResponse(packet)

			// Process next command in queue *after* handling the response
			this.processCommandQueue()
		}
	}

	parseResponse(packet) {
		const cmd2 = packet[1]
		const data = packet.subarray(2, packet.length - 1)

		// Check for NAK (Function Abort)
		if (cmd2 === 0x20 && data.length > 9 && (data[9] & 0x80) > 0) {
			this.log('warn', 'NAK received (Function Abort). Pausing transmission for 10ms.')
			clearTimeout(this.nakPauseTimer) // Clear any existing pause
			this.nakPauseTimer = setTimeout(() => {
				this.nakPauseTimer = null
				this.processCommandQueue()
			}, 10)
			return // Stop processing this packet further as a normal status update
		}

		switch (cmd2) {
			case 0x11: // Device Type Response
				if (data.equals(Buffer.from(DEVICE_TYPE_RESPONSE))) {
					this.log('info', 'Device type HDR-80/90 confirmed.')
				} else {
					this.log('warn', `Unknown device type: ${data.toString('hex')}`)
					this.updateStatus(InstanceStatus.ConnectionFailure, 'Wrong device type')
					this.socket.destroy()
				}
				break

			case 0xf2: // FW Version Response
				if (data.length >= 4) {
					const sdk_major = data[0]
					const sdk_minor = data[1]
					const ui_major = data[2]
					const ui_minor = data[3]
					this.fw = `SDK: ${sdk_major}.${sdk_minor}, UI: ${ui_major}.${ui_minor}`
					this.setVariableValues({ firmware: this.fw })
				}
				break

			case 0x20: // Current Status Sense Response
				data.copy(this.state.statusBytes)
				this.checkFeedbacks(
					'transport_status',
					'ssd_status',
					'selected_ssd',
					'selected_output',
					'local_control_status',
					'error_status'
				)
				updateVariables(this)
				break

			case 0x22: // System Configuration Sense Response
				data.copy(this.state.configBytes)
				this.checkFeedbacks(
					'prores_quality',
					'audio_source',
					'timecode_mode',
					'genlock_status',
					'loop_play_status',
					'tc_trigger_status',
					'secure_stop_status'
				)
				updateVariables(this)
				break

			case 0x0c: // Current Time Sense Response
			case 0x2b: // Remain Time Sense Response
				if (data.length >= 4) {
					// Format: FF SS MM HH (Byte 0 is frames/flags)
					const ss = data[1].toString().padStart(2, '0')
					const mm = data[2].toString().padStart(2, '0')
					const hh = data[3].toString().padStart(2, '0')

					if (cmd2 === 0x0c) {
						// Timecode has frames
						const ff = data[0].toString().padStart(2, '0')
						this.state.timecode = `${hh}:${mm}:${ss}:${ff}`
						this.setVariableValues({ timecode: this.state.timecode })
					} else {
						// Remaining time has no frames
						this.state.remainTime = `${hh}:${mm}:${ss}`
						this.setVariableValues({ remaining_time: this.state.remainTime })
					}
				}
				break
		}
	}

	initActions() {
		this.setActionDefinitions(getActions(this))
	}
	initFeedbacks() {
		this.setFeedbackDefinitions(getFeedbacks(this))
	}
	initVariables() {
		initVariables(this)
	}
	initPresets() {
		this.setPresetDefinitions(getPresets(this))
	}
}

export default HdrInstance