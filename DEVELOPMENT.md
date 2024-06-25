# Development

[VS Code Docs - Publishing Extensions](https://code.visualstudio.com/docs/extensions/publish-extension)
### Packaging (local .vsix file)
```bash
$ vsce package
```

## Marketplace

### Access token

Usually the previous access token has expired and thus a new one has to be created.
To acquire a personal access token:
1. sign in on [marketplace.visualstudio.com](https://marketplace.visualstudio.com). 
1. Click the profile link next to the "Sign out" link.
1. Click the available Azure DevOps Organization.
1. Click the "User settings" button in the top right corner and Select "Personal access tokens".
1. Create a new access token according to [VS Code's documentation](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token)
1. Login via vsce using the newly created access token
    ```
    vsce login <publisher name>
    ```

### Publishing

```bash
$ npm install -g vsce ovsx
$ vsce publish -p <token>
$ ovsx publish -p <token>
```