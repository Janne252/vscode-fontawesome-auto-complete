import * as path from 'path';
import * as vscode from 'vscode';
import { Version } from './font-awesome';
import CompletionProvider from './font-awesome/completion-provider';
import Documentation from './font-awesome/documentation';
import HoverProvider from './font-awesome/hover-provider';

const configurationSection = 'fontAwesomeAutocomplete';

enum ConfigKey {
    Version = 'version',
    TriggerCharacters = 'triggerCharacters',
    PreviewBackgroundColor = 'preview.backgroundColor',
    PreviewForegroundColor = 'preview.foregroundColor',
}

export function activate(context: vscode.ExtensionContext) {
    let disposables: vscode.Disposable[] = [];

    const registerProviders = () => {
        // Load config
        const config = vscode.workspace.getConfiguration(configurationSection);
        const version = config.get(ConfigKey.Version) as Version;

        // Turn loaded glob patterns into DocumentFilters
        const patterns = (config.get('patterns') as string[])
            .map(pattern => <vscode.DocumentFilter> {
                pattern,
                scheme: 'file',
            });

        // Load trigger characters
        const triggerCharacters = config.get(ConfigKey.TriggerCharacters) as string[];
        const previewStyle = {
            backgroundColor: config.get(ConfigKey.PreviewBackgroundColor) as string,
            foregroundColor: config.get(ConfigKey.PreviewForegroundColor) as string,
        };

        // Load icon documentation
        const documentation = new Documentation(
            path.join(path.dirname(__dirname), `data/fontawesome-${version}`),
            previewStyle,
            version
        );

        const providers = {
            completion: new CompletionProvider(documentation),
            hover: new HoverProvider(documentation),
        };

        // If the providers are about to be registered again, remove previous instances first
        for (const disposable of disposables) {
            const existingIndex = context.subscriptions.indexOf(disposable);
            if (existingIndex !== -1) {
                context.subscriptions.splice(existingIndex, 1);
            }

            disposable.dispose();
        }

        disposables = [
            vscode.languages.registerCompletionItemProvider(patterns, providers.completion, ...triggerCharacters),
            vscode.languages.registerHoverProvider(patterns, providers.hover),
        ];

        disposables.forEach(o => context.subscriptions.push(o));
    };

    // Whenever the configuration changes and affects the extension, reload everything
    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration(configurationSection)) {
            registerProviders();
        }
    });

    registerProviders();
    runVersionMigrations();
}

export function deactivate() {
    //
}

function runVersionMigrations() {
    // Version 0.0.5 -> 0.0.1
    // tslint:disable-next-line
    const v0_0_5 = () => {
        const sectionName = 'fontAwesome5Autocomplete';
        const config = vscode.workspace.getConfiguration(sectionName);

        enum Action {
            Fix = 'Fix',
        }

        for (const name in ConfigKey) {
            const key = ConfigKey[name];
            const value = config.get(key);
            if (value != null) {
                vscode.window.showErrorMessage(
                    `[Font Awesome Autocomplete] settings.json entry "${sectionName}.${key}" is depricated.`,
                    Action.Fix
                ).then(action => {
                    if (action === Action.Fix) {
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

    v0_0_5();
}
