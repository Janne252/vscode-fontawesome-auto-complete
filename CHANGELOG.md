# Change Log
## [0.1.7] - 2018-04-10
- Improved VS Code Extension Marketplace integration

## [0.1.6] - 2018-04-10
- Auto-completion trigger character is now based on the last character of the trigger word.
   - See [Configuration in README.md](README.md#configuration) for more info.
- Fixed an issue where auto-completing an icon class name resulted in inconsistent behavior in different language modes (e.g. `html` vs `javascript`)
  - Fixed by introducing a new configuration option for the extension: `disableTriggerWordAutoClearPatterns`
  - This configuration option is a list of glob patterns that automatically remove the trigger word when a completion item is selected. Defaults to `**/*.html`. If you spot a language that supports it (i.e. when auto-completing a class name with this extension, the output is malformed), please open an issue!
- Improved version migration (from extension version 0.1.4)

## [0.1.5] - 2018-09-29
- Fixed an issue where a warning for deprecated setting was displayed to the user even after removing the setting.

## [0.1.4] - 2018-09-29
- Updated to Font Awesome 5.3.1 (web)
- Auto completion item list no longer contains Font Awesome icons by default.
   - Instead a trigger word (defaults to "`fa-`") is used to determine when the list is included.
   - Implemented by replacing the setting **`fontAwesomeAutocomplete`.`triggerCharacters`** with **`fontAwesomeAutocomplete`.`triggerWord`**.
   - See [Configuration in README.md](README.md#configuration) for more info.
- Added list of categories to icon documentation (Font Awesome 5 only for now)
- Moved documentation link to the icon name (to save vertical space) 

## [0.1.3] - 2018-06-07
- Updated to Font Awesome 5.2.0 (web)

## [0.1.2] - 2018-06-07
- Fixed broken icon preview (appeared in vscode 1.24.0)

## [0.1.1] - 2018-05-11
- Added "Changes" display to the documentation
- Fixed Font Awesome 4.7.0 "changes" version display for major versions ("1" -> "1.0", etc.)

## [0.1.0] - 2018-05-11
- Added support for Font Awesome 4.7.0
- Added configuration option to select the Font Awesome version (4 or 5)
- **Breaking changes**
  - See migrating from [0.0.5 to 0.1.0](https://github.com/Janne252/vscode-fontawesome-auto-complete/blob/master/migrations/v0.0.5-to-0.1.0.md)

## [0.0.5] - 2018-05-09
- Improved icon preview by adding a background color (configurable)
- Added settings.json entries for icon preview background and foreground colors

## [0.0.4] - 2018-05-05
- Improved documentation formatting
- Added a mouse-over popup that displays the same documentation as the autocomplete

##  [0.0.3] - 2018-05-05
- Fix typos in readme, adjust manifest

##  [0.0.2] - 2018-05-05
- Fix typos in readme, adjust manifest

##  [0.0.1] - 2018-05-05
- Initial release in the VS Code Extension Marketplace
