const variableDefinitions = [
	{ variableId: 'timecode', name: 'Current Timecode' },
	{ variableId: 'remaining_time', name: 'Remaining Record Time' },
	{ variableId: 'firmware', name: 'Firmware Version' },
	{ variableId: 'selected_ssd', name: 'Selected Primary SSD' },
	{ variableId: 'selected_output', name: 'Selected Output Channel' },
	{ variableId: 'prores_quality', name: 'Current ProRes Quality' },
	{ variableId: 'audio_source', name: 'Current Audio Source' },
	{ variableId: 'timecode_mode', name: 'Current Timecode Mode' },
]

const PRORES_MAP = ['Proxy', 'LT', '422', 'HQ']
const AUDIO_SOURCE_MAP = ['Embedded', 'XLR']
const TC_MODE_MAP = ['Rec Run', 'Free Run', 'Embedded', 'LTC']
const SSD_MAP = { 1: 'SSD1', 2: 'SSD2' }

export function initVariables(instance) {
	instance.setVariableDefinitions(variableDefinitions)
	// Set initial empty/default values
	instance.setVariableValues({
		timecode: '00:00:00:00',
		remaining_time: '00:00:00',
		firmware: 'Unknown',
		selected_ssd: 'Unknown',
		selected_output: 'Unknown',
		prores_quality: 'Unknown',
		audio_source: 'Unknown',
		timecode_mode: 'Unknown',
	})
}

export function updateVariables(instance) {
	const state = instance.state

	const ssdValue = state.statusBytes[11] & 0x03
	const outputValue = (state.statusBytes[11] >> 2) & 0x03
	const proresValue = state.configBytes[0] & 0x03
	const audioValue = state.configBytes[1] & 0x03
	const tcModeValue = (state.configBytes[0] >> 6) & 0x03

	instance.setVariableValues({
		timecode: state.timecode,
		remaining_time: state.remainTime,
		firmware: instance.fw,
		selected_ssd: SSD_MAP[ssdValue] || 'Unknown',
		selected_output: `CH-${outputValue + 1}`,
		prores_quality: PRORES_MAP[proresValue] || 'Unknown',
		audio_source: AUDIO_SOURCE_MAP[audioValue] || 'Unknown',
		timecode_mode: TC_MODE_MAP[tcModeValue] || 'Unknown',
	})
}