import * as vscode from 'vscode';
import { CompletionItemProvider } from "vscode";
import Documentation from './documentation';

export default class CompletionProvider implements CompletionItemProvider {
    /** List of generated completion items. */
    private readonly completionItems: vscode.CompletionItem[] = [];

    constructor(documentation: Documentation) {
        for (const icon of documentation.icons) {
            this.completionItems.push(documentation.asCompletionItem(icon));
        }
    }

    public provideCompletionItems() {
        return this.completionItems;
    }
}
