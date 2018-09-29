import * as path from 'path';
import * as vscode from 'vscode';
import { Version } from './font-awesome';
import CompletionProvider from './font-awesome/completion-provider';
import Documentation from './font-awesome/documentation';
import HoverProvider from './font-awesome/hover-provider';
import VersionMigrations from './version-migrations';

const configurationSection = 'fontAwesomeAutocomplete';
const disposables: vscode.Disposable[] = [];

export enum ConfigKey {
    Version = 'version',
    TriggerWord = 'triggerWord',
    PreviewBackgroundColor = 'preview.backgroundColor',
    PreviewForegroundColor = 'preview.foregroundColor',
}

function registerProviders(context: vscode.ExtensionContext) {
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
    const triggerWord = config.get(ConfigKey.TriggerWord) as string;
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
        completion: new CompletionProvider(documentation, triggerWord),
        hover: new HoverProvider(documentation),
    };

    unregisterProviders(context);

    disposables.push(
        vscode.languages.registerCompletionItemProvider(patterns, providers.completion, ...['-']),
        vscode.languages.registerHoverProvider(patterns, providers.hover),
    );

    disposables.forEach(o => context.subscriptions.push(o));
};

function unregisterProviders(context: vscode.ExtensionContext) {
    // If the providers are about to be registered again, remove previous instances first
    for (const disposable of disposables) {
        const existingIndex = context.subscriptions.indexOf(disposable);
        if (existingIndex !== -1) {
            context.subscriptions.splice(existingIndex, 1);
        }

        disposable.dispose();
    }
}

export function activate(context: vscode.ExtensionContext) {
    // Whenever the configuration changes and affects the extension, reload everything
    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration(configurationSection)) {
            registerProviders(context);
        }
    });

    registerProviders(context);
    runVersionMigrations();
}

export function deactivate() {

}

function runVersionMigrations() {
   VersionMigrations.v0_0_5();
   VersionMigrations.v0_1_4();
}
