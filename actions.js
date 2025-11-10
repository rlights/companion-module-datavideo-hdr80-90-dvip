import { CHOICES, COMMANDS } from './constants.js'

export function getActions(instance) {
	const sendCommand = (cmd, data = []) => instance.sendCommand(cmd, data)

	return {
		local_control: {
			name: 'Set Local Control',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: 'enable',
					choices: CHOICES.LOCAL_CONTROL,
				},
			],
			callback: (action) => {
				const cmd = action.options.mode === 'enable' ? COMMANDS.SYSTEM.LOCAL_ENABLE : COMMANDS.SYSTEM.LOCAL_DISABLE
				sendCommand(cmd.cmd, cmd.data)
			},
		},
		set_audio_source: {
			name: 'Set Audio Source',
			options: [
				{
					type: 'dropdown',
					label: 'Source',
					id: 'source',
					default: 0x00,
					choices: CHOICES.AUDIO_SOURCE,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.SYSTEM.AUDIO_SOURCE
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.source)])
			},
		},
		set_prores_quality: {
			name: 'Set ProRes Quality',
			options: [
				{
					type: 'dropdown',
					label: 'Quality',
					id: 'quality',
					default: 0x02,
					choices: CHOICES.PRORES_QUALITY,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.SYSTEM.PRORES_QUALITY
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.quality)])
			},
		},
		set_video_input: {
			name: 'Set Video Input Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: 0x00,
					choices: CHOICES.VIDEO_INPUT_MODE,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.SYSTEM.VIDEO_INPUT
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.mode)])
			},
		},
		set_timecode_mode: {
			name: 'Set Timecode Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: 0x00,
					choices: CHOICES.TIMECODE_MODE,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.SYSTEM.TIMECODE_MODE
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.mode)])
			},
		},
		set_gpi_mode: {
			name: 'Set GPI Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: 0x00,
					choices: CHOICES.GPI_MODE,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.SYSTEM.GPI_MODE
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.mode)])
			},
		},
		set_genlock: {
			name: 'Set Genlock',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: 0x01,
					choices: CHOICES.ENABLE_DISABLE,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.SYSTEM.GENLOCK
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.mode)])
			},
		},
		set_secure_stop: {
			name: 'Set Secure Stop',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: 0x00,
					choices: CHOICES.ENABLE_DISABLE,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.SYSTEM.SECURE_STOP
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.mode)])
			},
		},
		set_tc_trigger: {
			name: 'Set TC Trigger Record',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: 0x00,
					choices: CHOICES.ENABLE_DISABLE,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.SYSTEM.TC_TRIGGER
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.mode)])
			},
		},
		set_loop_play: {
			name: 'Set Loop Play',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: 0x00,
					choices: CHOICES.ENABLE_DISABLE,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.SYSTEM.LOOP_PLAY
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.mode)])
			},
		},
		set_primary_ssd: {
			name: 'Set Primary Storage',
			options: [
				{
					type: 'dropdown',
					label: 'SSD',
					id: 'ssd',
					default: 0x01,
					choices: CHOICES.PRIMARY_SSD,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.SYSTEM.PRIMARY_SSD
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.ssd)])
			},
		},
		set_output_source: {
			name: 'Set Output Source (Record)',
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 0x00,
					choices: CHOICES.OUTPUT_SOURCE,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.SYSTEM.OUTPUT_SOURCE
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.channel)])
			},
		},
		format_ssd: {
			name: 'Format SSD',
			options: [
				{
					type: 'dropdown',
					label: 'SSD',
					id: 'ssd',
					default: 0x01,
					choices: CHOICES.FORMAT_SSD,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.SYSTEM.FORMAT_SSD
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.ssd)])
			},
		},
		transport_control: {
			name: 'Transport Control',
			options: [
				{
					type: 'dropdown',
					label: 'Command',
					id: 'control',
					default: 'stop',
					choices: CHOICES.TRANSPORT_CONTROL,
				},
			],
			callback: (action) => {
				let cmd
				switch (action.options.control) {
					case 'stop':
						cmd = COMMANDS.TRANSPORT.STOP
						break
					case 'play':
						cmd = COMMANDS.TRANSPORT.PLAY
						break
					case 'record':
						cmd = COMMANDS.TRANSPORT.RECORD
						break
					case 'play_pause':
						cmd = COMMANDS.TRANSPORT.PLAY_PAUSE
						break
					case 'ff':
						cmd = COMMANDS.TRANSPORT.FF
						break
					case 'rew':
						cmd = COMMANDS.TRANSPORT.REW
						break
					case 'step_fwd':
						cmd = COMMANDS.TRANSPORT.STEP_FWD
						break
					case 'step_rev':
						cmd = COMMANDS.TRANSPORT.STEP_REV
						break
				}
				if (cmd) {
					sendCommand(cmd.cmd, cmd.data)
				}
			},
		},
		jog_fwd: {
			name: 'Jog Forward',
			options: [
				{
					type: 'dropdown',
					label: 'Speed',
					id: 'speed',
					default: 0x40,
					choices: CHOICES.SPEED_CHOICES,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.TRANSPORT.JOG_FWD
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.speed)])
			},
		},
		jog_rev: {
			name: 'Jog Reverse',
			options: [
				{
					type: 'dropdown',
					label: 'Speed',
					id: 'speed',
					default: 0x40,
					choices: CHOICES.SPEED_CHOICES,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.TRANSPORT.JOG_REV
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.speed)])
			},
		},
		var_fwd: {
			name: 'Variable Forward',
			options: [
				{
					type: 'dropdown',
					label: 'Speed',
					id: 'speed',
					default: 0x40,
					choices: CHOICES.SPEED_CHOICES,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.TRANSPORT.VAR_FWD
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.speed)])
			},
		},
		var_rev: {
			name: 'Variable Reverse',
			options: [
				{
					type: 'dropdown',
					label: 'Speed',
					id: 'speed',
					default: 0x40,
					choices: CHOICES.SPEED_CHOICES,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.TRANSPORT.VAR_REV
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.speed)])
			},
		},
		shuttle_fwd: {
			name: 'Shuttle Forward',
			options: [
				{
					type: 'dropdown',
					label: 'Speed',
					id: 'speed',
					default: 0x40,
					choices: CHOICES.SPEED_CHOICES,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.TRANSPORT.SHUTTLE_FWD
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.speed)])
			},
		},
		shuttle_rev: {
			name: 'Shuttle Reverse',
			options: [
				{
					type: 'dropdown',
					label: 'Speed',
					id: 'speed',
					default: 0x40,
					choices: CHOICES.SPEED_CHOICES,
				},
			],
			callback: (action) => {
				const cmd = COMMANDS.TRANSPORT.SHUTTLE_REV
				sendCommand(cmd.cmd, [...cmd.dataPrefix, parseInt(action.options.speed)])
			},
		},
	}
}