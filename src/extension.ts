'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CompletionItemProvider, CompletionItemKind } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { IconEntry, IconStylePrefix } from './fontawesome';

const icons = require('../fontawesome/advanced-options/metadata/icons') as {[key: string]: IconEntry};
const fontAwesomeReadmeLines = fs.readFileSync(path.join(__dirname, '../fontawesome/README.md'), 'utf8').split('\n');

class FontAwesomeClassNameCompletionItemProvider implements CompletionItemProvider 
{
    /** List of generated completion items. */
    private readonly completionItems: vscode.CompletionItem[] = [];

    constructor()
    {
        const fontAwesomeTitle = fontAwesomeReadmeLines[0].substring('# '.length);

        for (let name in icons)
        {
            let icon = icons[name];
            
            for (let style of icon.styles)
            {
                let prefix = IconStylePrefix[style];
                let imagePath = path.join(__dirname, '../fontawesome/advanced-options/raw-svg', style, `${name}.svg`);
                let onlineUrl = `https://fontawesome.com/icons/${name}?style=${style}`;
                let displayOnlineUrl = onlineUrl.replace('https://', '');
                let classDeclaration = `${prefix} fa-${name}`;

                this.completionItems.push({
                    label: classDeclaration,
                    insertText: classDeclaration,
                    detail: `${icon.label} [Free] [${style}]`,
                    documentation: new vscode.MarkdownString([
                        `![](${imagePath} | width=48 height=48)`,
                        '',
                        `|      |      |`,
                        `|------|------|`,
                        `| Unicode    |  \`${icon.unicode}\`    |`,
                        `| Full name    |  \`${classDeclaration}\`    |`,
                        `| Reference &nbsp; &nbsp;| [${displayOnlineUrl}](${onlineUrl})   |`,
                        '',  
                        fontAwesomeTitle,  
                    ].join('\n')),
                    kind: CompletionItemKind.Reference
                });
            }
        }
    }

    provideCompletionItems()
    {
        return this.completionItems;
    }
}
export function activate(context: vscode.ExtensionContext) 
{

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider({
                scheme: 'file', 
                language: '*'
            }, 
            new FontAwesomeClassNameCompletionItemProvider(),
            ...['f']
        )
    );
}

export function deactivate() 
{

}