import * as vscode from 'vscode';
import { ConfigKey } from './extension';

enum MigrationAction {
    Fix = 'Fix',
    Remove = 'Remove',
}

export default class VersionMigrations {
    
    static RunAll() {
        this.v0_0_5();
        this.v0_1_4();
    }

    // Version 0.1.3 -> 0.1.4
    static v0_1_4() {
        const sectionName = 'fontAwesomeAutocomplete';
        const settingName = 'triggerCharacters';

        const config = vscode.workspace.getConfiguration(sectionName);
        const value = config.inspect(settingName);

        if (
            value != null && 
            (
                value.globalValue != null ||
                value.workspaceFolderValue != null ||
                value.workspaceValue != null
            )            
        ) {
            vscode.window.showErrorMessage(
                `[Font Awesome Autocomplete] settings.json entry "${sectionName}.${settingName}" is deprecated and can be safely removed (replaced by triggerWord).`,
                MigrationAction.Remove
            ).then(action => {
                if (action === MigrationAction.Remove) {
                    Promise.all([
                        value.globalValue != null ? config.update(settingName, undefined, vscode.ConfigurationTarget.Global) : Promise.resolve(),
                        value.workspaceValue != null ? config.update(settingName, undefined, vscode.ConfigurationTarget.Workspace) : Promise.resolve(),
                        value.workspaceFolderValue != null ? config.update(settingName, undefined, vscode.ConfigurationTarget.WorkspaceFolder) : Promise.resolve()
                    ]).then(() => {
                        vscode.window.showInformationMessage('Deprecated setting removed successfully!')
                    }, (error) => {
                        vscode.window.showErrorMessage(`An error occurred while trying to remove the setting. Please try removing it manually in the settings editor. Details: \n\n${error}`)
                    });
                }
            });
        }
    }

    // Version 0.0.5 -> 0.1.0
    static v0_0_5() {
        const sectionName = 'fontAwesome5Autocomplete';
        const config = vscode.workspace.getConfiguration(sectionName);


        for (const name in ConfigKey) {
            const key = ConfigKey[name];
            const value = config.get(key);
            if (value != null) {
                vscode.window.showErrorMessage(
                    `[Font Awesome Autocomplete] settings.json entry "${sectionName}.${key}" is deprecated.`,
                    MigrationAction.Fix
                ).then(action => {
                    if (action === MigrationAction.Fix) {
                        vscode.commands.executeCommand(
                            'vscode.open',
                            vscode.Uri.parse(
                                'https://github.com/Janne252/vscode-fontawesome-auto-complete/blob/master/migrations/v0.0.5-to-0.1.0.md'
                            )
                        );
                    }
                });

                break;
            }
        }
    };

}
