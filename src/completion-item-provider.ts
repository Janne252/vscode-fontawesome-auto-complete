
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { CompletionItemProvider, CompletionItemKind } from "vscode";
import { IconEntry, IconStylePrefix } from './fontawesome';

const icons = require('../fontawesome/advanced-options/metadata/icons') as {[key: string]: IconEntry};
const fontAwesomeReadmeLines = fs.readFileSync(path.join(__dirname, '../fontawesome/README.md'), 'utf8').split('\n');
const fontAwesomeTitle = fontAwesomeReadmeLines[0].substring('# '.length);

export default class FontAwesomeClassNameCompletionItemProvider implements CompletionItemProvider 
{
    /** List of generated completion items. */
    private readonly completionItems: vscode.CompletionItem[] = [];

    constructor()
    {
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
                        `|                        |                                     |`,
                        `|------------------------|-------------------------------------|`,
                        `| Unicode                | \`${icon.unicode}\`                 |`,
                        `| Full name              | \`${classDeclaration}\`             |`,
                        `| Reference &nbsp; &nbsp;| [${displayOnlineUrl}](${onlineUrl}) |`,
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
