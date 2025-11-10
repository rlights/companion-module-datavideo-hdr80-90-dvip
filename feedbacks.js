import { combineRgb } from '@companion-module/base'
import { CHOICES } from './constants.js'

export function getFeedbacks(instance) {
	const state = instance.state
	const C_RED = combineRgb(255, 0, 0)
	const C_GREEN = combineRgb(0, 255, 0)
	const C_ORANGE = combineRgb(255, 102, 0)
	const C_BLACK = combineRgb(0, 0, 0)

	return {
		transport_status: {
			type: 'boolean',
			name: 'Transport Status',
			description: 'Change style based on transport status',
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'status',
					default: 'play',
					choices: [
						...CHOICES.TRANSPORT_CONTROL,
						{ id: 'still', label: 'Still / Pause' },
						{ id: 'jog', label: 'Jog' },
						{ id: 'variable', label: 'Variable' },
						{ id: 'shuttle', label: 'Shuttle' },
					],
				},
			],
			defaultStyle: {
				color: C_BLACK,
				bgcolor: C_GREEN,
			},
			callback: (feedback) => {
				const byte1 = state.statusBytes[1]
				const byte2 = state.statusBytes[2]
				switch (feedback.options.status) {
					case 'stop':
						return (byte1 & 0x20) > 0
					case 'play':
						return (byte1 & 0x01) > 0
					case 'record':
						return (byte1 & 0x02) > 0
					case 'ff':
						return (byte1 & 0x08) > 0
					case 'rew':
						return (byte1 & 0x10) > 0
					case 'still':
						return (byte2 & 0x02) > 0
					case 'jog':
						return (byte2 & 0x20) > 0
					case 'variable':
						return (byte2 & 0x10) > 0
					case 'shuttle':
						return (byte2 & 0x40) > 0
				}
				return false
			},
		},
		ssd_status: {
			type: 'boolean',
			name: 'SSD Status',
			description: 'Change style based on SSD status',
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'status',
					default: 'ssd1_mounted',
					choices: [
						{ id: 'ssd1_mounted', label: 'SSD1 Mounted' },
						{ id: 'ssd2_mounted', label: 'SSD2 Mounted' },
						{ id: 'busy', label: 'Media Busy (Loading)' },
					],
				},
			],
			defaultStyle: {
				color: C_BLACK,
				bgcolor: C_GREEN,
			},
			callback: (feedback) => {
				const byte12 = state.statusBytes[12]
				switch (feedback.options.status) {
					case 'ssd1_mounted':
						return (byte12 & 0x01) > 0
					case 'ssd2_mounted':
						return (byte12 & 0x02) > 0
					case 'busy':
						return (byte12 & 0x10) > 0 // "Loading not done"
				}
				return false
			},
		},
		selected_ssd: {
			type: 'boolean',
			name: 'Selected Primary SSD',
			description: 'Change style based on selected SSD',
			options: [
				{
					type: 'dropdown',
					label: 'SSD',
					id: 'ssd',
					default: 0x01,
					choices: CHOICES.PRIMARY_SSD,
				},
			],
			defaultStyle: {
				color: C_BLACK,
				bgcolor: C_GREEN,
			},
			callback: (feedback) => {
				const selected = state.statusBytes[11] & 0x03
				return selected == feedback.options.ssd
			},
		},
		selected_output: {
			type: 'boolean',
			name: 'Selected Output Source',
			description: 'Change style based on selected output channel (in record)',
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 0x00,
					choices: CHOICES.OUTPUT_SOURCE,
				},
			],
			defaultStyle: {
				color: C_BLACK,
				bgcolor: C_GREEN,
			},
			callback: (feedback) => {
				const selected = (state.statusBytes[11] >> 2) & 0x03
				return selected == feedback.options.channel
			},
		},
		prores_quality: {
			type: 'boolean',
			name: 'ProRes Quality',
			description: 'Change style based on ProRes quality',
			options: [
				{
					type: 'dropdown',
					label: 'Quality',
					id: 'quality',
					default: 0x02,
					choices: CHOICES.PRORES_QUALITY,
				},
			],
			defaultStyle: {
				color: C_BLACK,
				bgcolor: C_GREEN,
			},
			callback: (feedback) => {
				const quality = state.configBytes[0] & 0x03
				return quality == feedback.options.quality
			},
		},
		audio_source: {
			type: 'boolean',
			name: 'Audio Source',
			description: 'Change style based on audio source',
			options: [
				{
					type: 'dropdown',
					label: 'Source',
					id: 'source',
					default: 0x00,
					choices: CHOICES.AUDIO_SOURCE,
				},
			],
			defaultStyle: {
				color: C_BLACK,
				bgcolor: C_GREEN,
			},
			callback: (feedback) => {
				const source = state.configBytes[1] & 0x03
				return source == feedback.options.source
			},
		},
		timecode_mode: {
			type: 'boolean',
			name: 'Timecode Mode',
			description: 'Change style based on timecode mode',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					default: 0x00,
					choices: CHOICES.TIMECODE_MODE,
				},
			],
			defaultStyle: {
				color: C_BLACK,
				bgcolor: C_GREEN,
			},
			callback: (feedback) => {
				const mode = (state.configBytes[0] >> 6) & 0x03
				return mode == feedback.options.mode
			},
		},
		genlock_status: {
			type: 'boolean',
			name: 'Genlock Status',
			description: 'Change style based on genlock status',
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'status',
					default: 'locked',
					choices: [
						{ id: 'enabled', label: 'Enabled' },
						{ id: 'disabled', label: 'Disabled' },
						{ id: 'locked', label: 'Locked' },
					],
				},
			],
			defaultStyle: {
				color: C_BLACK,
				bgcolor: C_GREEN,
			},
			callback: (feedback) => {
				const isEnabled = (state.configBytes[1] & 0x10) > 0
				const isLocked = (state.statusBytes[12] & 0x80) > 0
				switch (feedback.options.status) {
					case 'enabled':
						return isEnabled
					case 'disabled':
						return !isEnabled
					case 'locked':
						return isLocked
				}
				return false
			},
		},
		loop_play_status: {
			type: 'boolean',
			name: 'Loop Play Status',
			description: 'Change style based on loop play status',
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'status',
					default: 0x01,
					choices: CHOICES.ENABLE_DISABLE,
				},
			],
			defaultStyle: {
				color: C_BLACK,
				bgcolor: C_GREEN,
			},
			callback: (feedback) => {
				const isEnabled = (state.configBytes[1] & 0x80) > 0
				return isEnabled == feedback.options.status
			},
		},
		tc_trigger_status: {
			type: 'boolean',
			name: 'TC Trigger Status',
			description: 'Change style based on TC Trigger status',
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'status',
					default: 0x01,
					choices: CHOICES.ENABLE_DISABLE,
				},
			],
			defaultStyle: {
				color: C_BLACK,
				bgcolor: C_GREEN,
			},
			callback: (feedback) => {
				const isEnabled = (state.configBytes[1] & 0x20) > 0
				return isEnabled == feedback.options.status
			},
		},
		secure_stop_status: {
			type: 'boolean',
			name: 'Secure Stop Status',
			description: 'Change style based on Secure Stop status',
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'status',
					default: 0x01,
					choices: CHOICES.ENABLE_DISABLE,
				},
			],
			defaultStyle: {
				color: C_BLACK,
				bgcolor: C_GREEN,
			},
			callback: (feedback) => {
				const isEnabled = (state.configBytes[1] & 0x40) > 0
				return isEnabled == feedback.options.status
			},
		},
		local_control_status: {
			type: 'boolean',
			name: 'Local Control Status',
			description: 'Change style based on local control (lockout) status',
			options: [
				{
					type: 'dropdown',
					label: 'Status',
					id: 'status',
					default: 'enabled',
					choices: CHOICES.LOCAL_CONTROL,
				},
			],
			defaultStyle: {
				color: C_BLACK,
				bgcolor: C_ORANGE,
			},
			callback: (feedback) => {
				const isEnabled = (state.statusBytes[0] & 0x04) > 0
				return (feedback.options.status === 'enable' && isEnabled) || (feedback.options.status === 'disable' && !isEnabled)
			},
		},
		error_status: {
			type: 'boolean',
			name: 'Error Status',
			description: 'Change style if an error is active',
			options: [
				{
					type: 'dropdown',
					label: 'Error',
					id: 'error',
					default: 'hw_error',
					choices: [
						{ id: 'hw_error', label: 'Hardware Error' },
						{ id: 'sys_alarm', label: 'System Alarm' },
						{ id: 'rec_inhibit', label: 'Record Inhibit' },
						{ id: 'abort', label: 'Function Abort' },
					],
				},
			],
			defaultStyle: {
				color: C_BLACK,
				bgcolor: C_RED,
			},
			callback: (feedback) => {
				const byte0 = state.statusBytes[0]
				const byte8 = state.statusBytes[8]
				const byte9 = state.statusBytes[9]
				switch (feedback.options.error) {
					case 'hw_error':
						return (byte0 & 0x08) > 0
					case 'sys_alarm':
						return (byte8 & 0x02) > 0
					case 'rec_inhibit':
						return (byte8 & 0x01) > 0
					case 'abort':
						return (byte9 & 0x80) > 0
				}
				return false
			},
		},
	}
}