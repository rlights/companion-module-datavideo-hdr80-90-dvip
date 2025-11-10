/**
 * Datavideo HDR-80/90 Companion Module
 * Constants
 */

export const TCP_PORT = 5002
export const POLLING_INTERVAL_STATUS = 1000 // Poll status every 1s
export const POLLING_INTERVAL_CONFIG = 5000 // Poll config every 5s
export const POLLING_INTERVAL_TIME = 500 // Poll time every 500ms

// The exact device type response we expect
export const DEVICE_TYPE_RESPONSE = [0x00, 0x02]

// Dropdown Choices
export const CHOICES = {
	LOCAL_CONTROL: [
		{ id: 'disable', label: 'Disable' },
		{ id: 'enable', label: 'Enable' },
	],
	AUDIO_SOURCE: [
		{ id: 0x00, label: 'Embedded' },
		{ id: 0x01, label: 'XLR' },
	],
	PRORES_QUALITY: [
		{ id: 0x00, label: 'Proxy' },
		{ id: 0x01, label: 'LT' },
		{ id: 0x02, label: '422' },
		{ id: 0x03, label: 'HQ' },
	],
	VIDEO_INPUT_MODE: [
		{ id: 0x00, label: 'SDI x4' },
		{ id: 0x01, label: 'HDMI x1 + SDI x3' },
		{ id: 0x02, label: 'HDMI x2 + SDI x2' },
	],
	TIMECODE_MODE: [
		{ id: 0x00, label: 'Record Run' },
		{ id: 0x01, label: 'Free Run' },
		{ id: 0x02, label: 'SDI Embedded' },
		{ id: 0x03, label: 'LTC' },
	],
	GPI_MODE: [
		{ id: 0x00, label: 'Edge' },
		{ id: 0x01, label: 'Level' },
	],
	ENABLE_DISABLE: [
		{ id: 0x01, label: 'Enable' },
		{ id: 0x00, label: 'Disable' },
	],
	PRIMARY_SSD: [
		{ id: 0x01, label: 'SSD1' },
		{ id: 0x02, label: 'SSD2' },
	],
	OUTPUT_SOURCE: [
		{ id: 0x00, label: 'CH-1' },
		{ id: 0x01, label: 'CH-2' },
		{ id: 0x02, label: 'CH-3' },
		{ id: 0x03, label: 'CH-4' },
	],
	FORMAT_SSD: [
		{ id: 0x01, label: 'Format SSD1' },
		{ id: 0x02, label: 'Format SSD2' },
	],
	TRANSPORT_CONTROL: [
		{ id: 'stop', label: 'Stop' },
		{ id: 'play', label: 'Play' },
		{ id: 'record', label: 'Record' },
		{ id: 'play_pause', label: 'Play Pause' },
		{ id: 'ff', label: 'Fast Forward (x32)' },
		{ id: 'rew', label: 'Fast Rewind (x32)' },
		{ id: 'step_fwd', label: 'Frame Step Fwd' },
		{ id: 'step_rev', label: 'Frame Step Rev' },
	],
	SPEED_CHOICES: [
		{ id: 0x00, label: 'Pause/Still (0x00)' },
		{ id: 0x2a, label: '0.2x (0x2A)' },
		{ id: 0x3a, label: '0.64x (0x3A)' },
		{ id: 0x40, label: '1.0x (0x40)' },
		{ id: 0x54, label: '4x (0x54)' },
		{ id: 0x5d, label: '8x (0x5D)' },
		{ id: 0x67, label: '16x (0x67)' },
	],
}

// Commands
// Structure: [CMD-1, CMD-2]
export const COMMANDS = {
	SYSTEM: {
		LOCAL_DISABLE: { cmd: [0x0, 0x0c], data: [] },
		LOCAL_ENABLE: { cmd: [0x0, 0x1d], data: [] },
		AUDIO_SOURCE: { cmd: [0x0, 0xf3], dataPrefix: [0x04] }, // data: [0x04, val]
		PRORES_QUALITY: { cmd: [0x0, 0xf3], dataPrefix: [0x0b] }, // data: [0x0b, val]
		VIDEO_INPUT: { cmd: [0x0, 0xf3], dataPrefix: [0x0c] }, // data: [0x0c, val]
		TIMECODE_MODE: { cmd: [0x0, 0xf3], dataPrefix: [0x0e] }, // data: [0x0e, val]
		GPI_MODE: { cmd: [0x0, 0xf3], dataPrefix: [0x0f] }, // data: [0x0f, val]
		GENLOCK: { cmd: [0x0, 0xf3], dataPrefix: [0x11] }, // data: [0x11, val]
		SECURE_STOP: { cmd: [0x0, 0xf3], dataPrefix: [0x12] }, // data: [0x12, val]
		TC_TRIGGER: { cmd: [0x0, 0xf3], dataPrefix: [0x13] }, // data: [0x13, val]
		LOOP_PLAY: { cmd: [0x0, 0xf5], dataPrefix: [0x08] }, // data: [0x08, val]
		PRIMARY_SSD: { cmd: [0x0, 0xf3], dataPrefix: [0x14] }, // data: [0x14, val]
		OUTPUT_SOURCE: { cmd: [0x0, 0xf3], dataPrefix: [0x15] }, // data: [0x15, val]
		FORMAT_SSD: { cmd: [0x0, 0xf8], dataPrefix: [] }, // data: [val]
	},
	TRANSPORT: {
		STOP: { cmd: [0x2, 0x00], data: [] },
		PLAY: { cmd: [0x2, 0x01], data: [] },
		RECORD: { cmd: [0x2, 0x02], data: [] },
		PLAY_PAUSE: { cmd: [0x2, 0x06], data: [] },
		FF: { cmd: [0x2, 0x10], data: [] },
		REW: { cmd: [0x2, 0x20], data: [] },
		STEP_FWD: { cmd: [0x2, 0x14], data: [] },
		STEP_REV: { cmd: [0x2, 0x24], data: [] },
		JOG_FWD: { cmd: [0x2, 0x11], dataPrefix: [] }, // data: [val]
		JOG_REV: { cmd: [0x2, 0x21], dataPrefix: [] }, // data: [val]
		VAR_FWD: { cmd: [0x2, 0x12], dataPrefix: [] }, // data: [val]
		VAR_REV: { cmd: [0x2, 0x22], dataPrefix: [] }, // data: [val]
		SHUTTLE_FWD: { cmd: [0x2, 0x13], dataPrefix: [] }, // data: [val]
		SHUTTLE_REV: { cmd: [0x2, 0x23], dataPrefix: [] }, // data: [val]
	},
	SENSE: {
		DEVICE_TYPE: { cmd: [0x0, 0x11], data: [] },
		FW_VERSION: { cmd: [0x6, 0xf2], data: [0x05, 0x00] },
		CURRENT_TIME: { cmd: [0x6, 0x0c], data: [0x03] }, // LTC or VITC
		CURRENT_STATUS: { cmd: [0x6, 0x20], data: [0x00] }, // data [0x00] seems implied by table, 60 20
		CURRENT_CONFIG: { cmd: [0x6, 0x22], data: [] },
		REMAIN_TIME: { cmd: [0x6, 0x2b], data: [] },
	},
}