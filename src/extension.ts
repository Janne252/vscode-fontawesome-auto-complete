import * as path from 'path';
import * as vscode from 'vscode';
import CompletionProvider from './font-awesome/completion-provider';
import Documentation from './font-awesome/documentation';
import HoverProvider from './font-awesome/hover-provider';
import VersionMigrations from './version-migrations';
import { loadConfiguration, configurationSection } from './font-awesome/configuration';

const disposables: vscode.Disposable[] = [];

function registerProviders(context: vscode.ExtensionContext) {
    // Load config
    const {
        version, 
        triggerWord, 
        triggerCharacter,
        disableTriggerWordAutoClearPatterns, 
        previewStyle, 
        patterns, 
        insertionTemplates,
    } = loadConfiguration();

    // Load icon documentation
    const documentation = new Documentation(
        path.join(path.dirname(__dirname), `data/fontawesome-${version}`),
        previewStyle,
        version
    );

    const providers = {
        completion: new CompletionProvider(
            documentation, 
            triggerWord, 
            disableTriggerWordAutoClearPatterns,
            insertionTemplates
        ),
        hover: new HoverProvider(documentation, insertionTemplates),
    };

    disposables.push(
        vscode.languages.registerCompletionItemProvider(patterns, providers.completion, ...[triggerCharacter]),
        vscode.languages.registerHoverProvider(patterns, providers.hover),
    );

    context.subscriptions.push(...disposables);
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

function clearAndLoadExtension(context: vscode.ExtensionContext) {
    unregisterProviders(context);
    registerProviders(context);
}

export function activate(context: vscode.ExtensionContext) {
    // Whenever the configuration changes and affects the extension, reload everything
    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration(configurationSection)) {
            clearAndLoadExtension(context);
        }
    });

    clearAndLoadExtension(context);
    VersionMigrations.RunAll();
}

export function deactivate() {

}
