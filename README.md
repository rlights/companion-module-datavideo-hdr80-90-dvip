# Companion Module for Datavideo HDR-80 & HDR-90

This module provides control over Datavideo HDR-80 and HDR-90 recorders for Bitfocus Companion, using the DVIP protocol.

## Firmware Compatibility

This module is supported only since firmware version **V1.29.2.2** (released April 27, 2023).
The current version as of November 2025 is **V1.29.2.6**.

## Configuration

To get started, add an instance of the "Datavideo HDR-80/90" module to your Companion setup and configure the following options:

- **Device IP**: The IP address of your HDR-80 or HDR-90 recorder.

The module will connect on TCP port 5002.

## Features

### Actions

The following actions are available to control your recorder:

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

### Feedbacks

Use feedbacks to get visual confirmation of the recorder's state on your buttons:

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

### Variables

You can use the following variables in your button labels to display information from the recorder:

- `$(datavideo-hdr:timecode)`: Current timecode (`HH:MM:SS:FF`).
- `$(datavideo-hdr:remaining_time)`: Remaining record time on the selected SSD (`HH:MM:SS`).
- `$(datavideo-hdr:firmware)`: Firmware version of the device.
- `$(datavideo-hdr:selected_ssd)`: The currently selected primary SSD (`SSD1`/`SSD2`).
- `$(datavideo-hdr:selected_output)`: The currently selected output channel (`CH-1`/`CH-2`).
- `$(datavideo-hdr:prores_quality)`: The current ProRes recording quality.
- `$(datavideo-hdr:audio_source)`: The current audio source.
- `$(datavideo-hdr:timecode_mode)`: The current timecode mode.
