import { combineRgb } from '@companion-module/base'
import { CHOICES } from './constants.js'

export function getPresets(instance) {
	const C_RED = combineRgb(255, 0, 0)
	const C_GREEN = combineRgb(0, 255, 0)
	const C_BLUE = combineRgb(0, 0, 255)
	const C_WHITE = combineRgb(255, 255, 255)
	const C_BLACK = combineRgb(0, 0, 0)

	const transportPreset = (control, label, color) => ({
		type: 'button',
		category: 'Transport',
		name: label,
		style: {
			text: label,
			size: '18',
			color: C_WHITE,
			bgcolor: C_BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'transport_control',
						options: { control: control },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'transport_status',
				options: { status: control },
				style: {
					color: C_WHITE,
					bgcolor: color,
				},
			},
		],
	})

	const proresPreset = (quality, label) => ({
		type: 'button',
		category: 'Settings',
		name: label,
		style: {
			text: label,
			size: '18',
			color: C_WHITE,
			bgcolor: C_BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'set_prores_quality',
						options: { quality: quality },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'prores_quality',
				options: { quality: quality },
				style: {
					color: C_BLACK,
					bgcolor: C_GREEN,
				},
			},
		],
	})

	return {
		play: transportPreset('play', 'PLAY', C_GREEN),
		stop: transportPreset('stop', 'STOP', C_BLUE),
		record: transportPreset('record', 'REC', C_RED),
		step_fwd: transportPreset('step_fwd', 'STEP >', C_BLACK),
		step_rev: transportPreset('step_rev', '< STEP', C_BLACK),
		prores_proxy: proresPreset(CHOICES.PRORES_QUALITY[0].id, 'ProRes\nProxy'),
		prores_lt: proresPreset(CHOICES.PRORES_QUALITY[1].id, 'ProRes\nLT'),
		prores_422: proresPreset(CHOICES.PRORES_QUALITY[2].id, 'ProRes\n422'),
		prores_hq: proresPreset(CHOICES.PRORES_QUALITY[3].id, 'ProRes\nHQ'),
		timecode: {
			type: 'button',
			category: 'Display',
			name: 'Timecode',
			style: {
				text: '$(hdr-80:timecode)',
				size: '14',
				color: C_WHITE,
				bgcolor: C_BLACK,
			},
			steps: [{ down: [], up: [] }],
			feedbacks: [],
		},
		remain_time: {
			type: 'button',
			category: 'Display',
			name: 'Remaining Time',
			style: {
				text: 'Rem:\n$(hdr-80:remaining_time)',
				size: '14',
				color: C_WHITE,
				bgcolor: C_BLACK,
			},
			steps: [{ down: [], up: [] }],
			feedbacks: [],
		},
	}
}