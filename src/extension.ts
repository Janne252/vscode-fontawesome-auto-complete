import * as vscode from 'vscode';
import CompletionProvider from './font-awesome/completion-provider';
import HoverProvider from './font-awesome/hover-provider';
import Documentation from './font-awesome/documentation';

const configurationSection = 'fontAwesome5Autocomplete';
const documentation = new Documentation();

export function activate(context: vscode.ExtensionContext) 
{
    let disposables: vscode.Disposable[] = [];

    const registerProviders = () =>
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
        
        // Load style
        documentation.previewStyle = {
            backgroundColor: config.get('preview.backgroundColor') as string,
            foregroundColor: config.get('preview.foregroundColor') as string
        };

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