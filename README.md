# Font Awesome 5 auto-complete

## Features
Provides Font Awesome 5.0.12 CSS class names as autocompletion items for configured the languages (ee [configuration](#configuration))

## Example usage
![](video/demo-01.gif)

## Configuration

The following options can be set in the settings to configure the behavior of the extension:
```javascript
{
    // List of glob patterns that determine where Font Awesome 5 Autocomplete will provide suggestions.
    "fontAwesome5Autocomplete.patterns": [
        "**/*.html"
    ],
    // List of characters that trigger Font Awesome 5 Autocomplete.
    "fontAwesome5Autocomplete.triggerCharacters": [
        "f"
    ]
}
```
The extension listens for changes in the settings and auto-reloads itself when necessary. 