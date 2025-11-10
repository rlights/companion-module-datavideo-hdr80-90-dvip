# Datavideo HDR-80 / HDR-90 Recorder Control

Controls Datavideo HDR-80 or HDR-90 recorders via the DVIP protocol.

Supported only since firmware version V1.29.2.2 released April 27, 2023.
Current version as of November 2025 is V1.29.2.6.

## Configuration

- **Device IP**: The IP address of the HDR-80/90 recorder.

## Actions

The following actions are available:

- **Transport Control**: `Stop`, `Play`, `Record`, `Pause`, `Fast Forward`, `Rewind`, `Step Forward`, `Step Reverse`.
- **Jog/Shuttle/Variable**: Control playback speed forwards or backwards.
- **System Settings**:
    - Set Local Control (Lockout)
    - Set Audio Source (`Embedded`, `XLR`)
    - Set ProRes Quality (`Proxy`, `LT`, `422`, `HQ`)
    - Set Video Input Mode
    - Set Timecode Mode (`Rec Run`, `Free Run`, `Embedded`, `LTC`)
    - Set GPI Mode
    - Set Genlock (`Enable`/`Disable`)
    - Set Secure Stop (`Enable`/`Disable`)
    - Set TC Trigger Record (`Enable`/`Disable`)
    - Set Loop Play (`Enable`/`Disable`)
    - Set Primary Storage (`SSD1`/`SSD2`)
    - Set Output Source during record (`CH-1`/`CH-2`)
- **Format SSD**: Erase the contents of `SSD1` or `SSD2`.

## Feedbacks

The following feedbacks are available to change button styles based on the recorder's state:

- **Transport Status**: `Stop`, `Play`, `Record`, `Still/Pause`, `FF`, `REW`, `Jog`, `Variable`, `Shuttle`.
- **SSD Status**: `SSD1 Mounted`, `SSD2 Mounted`, `Media Busy`.
- **Selected Primary SSD**: `SSD1`, `SSD2`.
- **Selected Output Source**: `CH-1`, `CH-2`.
- **ProRes Quality**: `Proxy`, `LT`, `422`, `HQ`.
- **Audio Source**: `Embedded`, `XLR`.
- **Timecode Mode**: `Rec Run`, `Free Run`, `Embedded`, `LTC`.
- **Genlock Status**: `Enabled`, `Disabled`, `Locked`.
- **Loop Play Status**: `Enabled`, `Disabled`.
- **TC Trigger Status**: `Enabled`, `Disabled`.
- **Secure Stop Status**: `Enabled`, `Disabled`.
- **Local Control Status**: `Enabled`, `Disabled`.
- **Error Status**: `Hardware Error`, `System Alarm`, `Record Inhibit`, `Function Abort`.

## Variables

The following variables are available for use in button text:

- `$(instance_label:timecode)`: Current timecode (`HH:MM:SS:FF`).
- `$(instance_label:remaining_time)`: Remaining record time on the selected SSD (`HH:MM:SS`).
- `$(instance_label:firmware)`: Firmware version of the device.
- `$(instance_label:selected_ssd)`: The currently selected primary SSD (`SSD1`/`SSD2`).
- `$(instance_label:selected_output)`: The currently selected output channel (`CH-1`/`CH-2`).
- `$(instance_label:prores_quality)`: The current ProRes recording quality.
- `$(instance_label:audio_source)`: The current audio source.
- `$(instance_label:timecode_mode)`: The current timecode mode.