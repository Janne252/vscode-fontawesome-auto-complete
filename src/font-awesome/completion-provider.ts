import { CancellationToken, CompletionContext, CompletionItemProvider, Position, TextDocument, Range, TextEdit } from "vscode";
import Documentation, { FontAwesomeCompletionItem } from './documentation';
import { InsertionTemplate } from "./transformation";
import { ExtensionConfiguration } from "./configuration";

export default class CompletionProvider implements CompletionItemProvider {
    /** List of generated completion items. */
    private readonly completionItems: FontAwesomeCompletionItem[] = [];
    /** A word that triggers the autocompletion of Font Awesome icons. */
    private readonly triggerWord: string;
    /** Pattern used to narrow down the document word range on autocompletion. */
    private readonly triggerWordRegexp: RegExp;

    constructor(
        documentation: Documentation, 
        private readonly config: ExtensionConfiguration
    ) {
        for (const icon of documentation.icons) {
            this.completionItems.push(documentation.asCompletionItem(icon));
        }

        this.triggerWord = this.config.triggerWord;
        // Support for alphanumeric suffix, including dashes. This ensures that the completion menu
        // provides items even after entering additional dashes, e.g.
        // fa-user (initial completion list triggered), followed by -circle (secondary completion list trigger.)
        // unfortunately the completion list is further filtered by VS Code's word separator setting, which seems to limit
        // the filter word to the closest dash, meaning the the secondary completion item list is filtered by
        // circle, not fa-user-cirlce.
        // https://github.com/Janne252/vscode-fontawesome-auto-complete/issues/6
        this.triggerWordRegexp = new RegExp(`${this.config.triggerWord}[a-zA-Z0-9-]*`);
    }

    private isAutoClearTriggerWordEnabledFor(document: TextDocument) {
        // converts a disable pattern into "enabled" rule
        for (const rule of this.config.disableTriggerWordAutoClearRules) {
            if (rule.matches(document)) {
                return false;
            }
        }

        // No pattern matched - auto clear is enabled
        return true;
    }

    private renderInsertText(template: InsertionTemplate | null, completionItem: FontAwesomeCompletionItem) {
        if (!template) {
            return completionItem.insertText;
        }

        return template.render(completionItem.icon);
    }

    public provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext
    ) {
        const exactRange = document.getWordRangeAtPosition(position, this.triggerWordRegexp);
        const fullRange = document.getWordRangeAtPosition(position);

        if (exactRange == null && fullRange == null) {
            return [];
        }

        const range = (exactRange || fullRange) as Range;
        const word = document.getText(range);
        const isAutoClearTriggerWordEnabled = this.isAutoClearTriggerWordEnabledFor(document);
        const insertionTemplate = InsertionTemplate.resolve(document, this.config.insertionTemplates);
        const additionalTextEdits: TextEdit[] = [];
        const result: FontAwesomeCompletionItem[] = [];

        // VS Code natively removes the "trigger word" when an autocompletion item is selected for some languages, for example HTML.
        // Other languages can't do it, we'll have to remove it manually
        // If the document language id is not present in the list of languages that do it automatically, do it manually
        if (isAutoClearTriggerWordEnabled) {
            additionalTextEdits.push(TextEdit.replace(range, ''));
        }

        if (word.startsWith(this.triggerWord)) {
            for (let i = 0; i < this.completionItems.length; i++) {
                const completionItem = this.completionItems[i];
                result.push(<FontAwesomeCompletionItem>{
                    ...completionItem, 
                    additionalTextEdits,
                    insertText: this.renderInsertText(insertionTemplate, completionItem)
                });
            }
        }

       return result;       
    }
}
