'use strict';

import * as vscode from 'vscode';
import FontAwesomeClassNameCompletionItemProvider from './completion-item-provider';

const configurationSection = 'fontAwesome5Autocomplete';

export function activate(context: vscode.ExtensionContext) 
{
    const provider = new FontAwesomeClassNameCompletionItemProvider();
    let disposable: vscode.Disposable;

    const registerCompletionItemProvider = () =>
    {
        // Load config
        const config = vscode.workspace.getConfiguration(configurationSection);
        
        // Turn loaded glob patterns into DocumentFilters
        let patterns = (config.get('patterns') as string[])
            .map(pattern => <vscode.DocumentFilter>{
                pattern: pattern,
                scheme: 'file'
            });
        
        // Load trigger characters
        let triggerCharacters = config.get('triggerCharacters') as string[];
        
        // If the completion item is about to be registered again, remove previous instance first
        if (disposable != null)
        {
            let existingIndex = context.subscriptions.indexOf(disposable);
            if (existingIndex != -1)
            {
                context.subscriptions.splice(existingIndex, 1);
            }

            disposable.dispose();
        }

        disposable = vscode.languages.registerCompletionItemProvider(patterns, provider, ...triggerCharacters);
        context.subscriptions.push(disposable);
    };

    vscode.workspace.onDidChangeConfiguration((e) =>
    {
        if (e.affectsConfiguration(configurationSection))
        {
            registerCompletionItemProvider();
        }
    });

    registerCompletionItemProvider();
}

export function deactivate() 
{

}