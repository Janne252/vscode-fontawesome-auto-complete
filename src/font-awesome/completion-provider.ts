import * as vscode from 'vscode';
import { CompletionItemProvider } from "vscode";
import Documentation from './documentation';


export default class CompletionProvider implements CompletionItemProvider 
{
    /** List of generated completion items. */
    private readonly completionItems: vscode.CompletionItem[] = [];

    constructor(documentation: Documentation)
    {
        for(let icon of documentation.icons)
        {
            this.completionItems.push(documentation.asCompletionItem(icon));
        }
    }

    provideCompletionItems()
    {
        return this.completionItems;
    }
}