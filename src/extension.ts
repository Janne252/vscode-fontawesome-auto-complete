import * as vscode from 'vscode';
import * as path from 'path';

import CompletionProvider from './font-awesome/completion-provider';
import HoverProvider from './font-awesome/hover-provider';
import Documentation from './font-awesome/documentation';
import { Version } from './font-awesome';

const configurationSection = 'fontAwesomeAutocomplete';

export function activate(context: vscode.ExtensionContext) 
{
    let disposables: vscode.Disposable[] = [];

    const registerProviders = () =>
    {
        // Load config
        const config = vscode.workspace.getConfiguration(configurationSection);
        const version = config.get('version') as Version;

        // Turn loaded glob patterns into DocumentFilters
        let patterns = (config.get('patterns') as string[])
            .map(pattern => <vscode.DocumentFilter>{
                pattern: pattern,
                scheme: 'file'
            });
        
        // Load trigger characters
        let triggerCharacters = config.get('triggerCharacters') as string[];
        let previewStyle = {
            backgroundColor: config.get('preview.backgroundColor') as string,
            foregroundColor: config.get('preview.foregroundColor') as string
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
        for (let disposable of disposables)
        {
            let existingIndex = context.subscriptions.indexOf(disposable);
            if (existingIndex != -1)
            {
                context.subscriptions.splice(existingIndex, 1);
            }

            disposable.dispose();
        }

        disposables = [
            vscode.languages.registerCompletionItemProvider(patterns, providers.completion, ...triggerCharacters),
            vscode.languages.registerHoverProvider(patterns, providers.hover)
        ];

        disposables.forEach(o => context.subscriptions.push(o));
    };

    // Whenever the configuration changes and affects the extension, reload everything
    vscode.workspace.onDidChangeConfiguration((e) =>
    {
        if (e.affectsConfiguration(configurationSection))
        {
            registerProviders();
        }
    });

    registerProviders();
}

export function deactivate() 
{

}