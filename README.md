# Font Awesome auto-complete

## Features
Provides Font Awesome 5.2.0/4.7.0 CSS class names as autocompletion items for any language (see [configuration](#configuration))

## Example usage
![](video/demo-autocomplete.gif)

## Additional features

#### Mouse-over documentation
![](image/demo-hover.png)

## Configuration
The following options can be set in the settings to configure the behavior of the extension:
```javascript
{
    // Font Awesome version to use.
    "fontAwesomeAutocomplete.version": "5",
    // List of glob patterns that determine where Font Awesome 5 Autocomplete will provide suggestions.
    "fontAwesomeAutocomplete.patterns": [
        "**/*.html"
    ],
    // List of characters that trigger Font Awesome Autocomplete.
    "fontAwesomeAutocomplete.triggerCharacters": [
        "f"
    ],
    // Background color of a Font Awesome icon preview. Supports any valid CSS color.
    "fontAwesomeAutocomplete.preview.backgroundColor": "#ffffff",
    // Foreground color of a Font Awesome icon preview. Supports any valid CSS color.
    "fontAwesomeAutocomplete.preview.foregroundColor": "#000000"
}
```
The extension listens for changes in the settings and auto-reloads itself when necessary. 

## Installation
 - [Font Awesome Autocomplete on Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=Janne252.fontawesome-autocomplete)


## Development
[VS Code Docs - Publishing Extensions](https://code.visualstudio.com/docs/extensions/publish-extension)
### Packaging (local .vsix file)
```bash
$ vsce package
```

### Publishing
```bash
$ vsce publish
```
