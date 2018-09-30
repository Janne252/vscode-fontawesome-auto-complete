import * as path from 'path';
import * as vscode from 'vscode';
import { FontAwesomeVersion } from './font-awesome';
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
    const {version, triggerWord, previewStyle, patterns} = loadConfiguration();

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

    const triggerChar = triggerWord[triggerWord.length - 1];

    disposables.push(
        vscode.languages.registerCompletionItemProvider(patterns, providers.completion, ...[triggerChar]),
        vscode.languages.registerHoverProvider(patterns, providers.hover),
    );

    disposables.forEach(o => context.subscriptions.push(o));
};

/** Loads and validates the extension configuration. */
function loadConfiguration() {
    const config = vscode.workspace.getConfiguration(configurationSection);
    const version = config.get(ConfigKey.Version) as FontAwesomeVersion;
    let triggerWord = config.get(ConfigKey.TriggerWord) as string;

    const triggerWordSetting = config.inspect(ConfigKey.TriggerWord);
    let defaultTriggerWord = 'fa-';

    if (triggerWordSetting != null && triggerWordSetting.defaultValue != null) {
        defaultTriggerWord = triggerWordSetting.defaultValue as string;
    } else {
        defaultTriggerWord = 'fa-';
    }
        // Turn loaded glob patterns into DocumentFilters
        const patterns = (config.get('patterns') as string[])
        .map(pattern => <vscode.DocumentFilter> {
            pattern,
            scheme: 'file',
        });

    const previewStyle = {
        backgroundColor: config.get(ConfigKey.PreviewBackgroundColor) as string,
        foregroundColor: config.get(ConfigKey.PreviewForegroundColor) as string,
    };

    if (config.triggerWord.length == 0) {
        vscode.window.showErrorMessage(
            `Setting ${configurationSection}.${ConfigKey.TriggerWord} cannot be empty - falling back to "${defaultTriggerWord}"!`,
            'Restore'
        ).then(value => {
            if (value == 'Restore') {
                config.update(ConfigKey.TriggerWord, defaultTriggerWord);
            }
        });

        triggerWord = defaultTriggerWord;
    }

    return {
        version, triggerWord, patterns, previewStyle
    }
}

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
