import { CancellationToken, CompletionContext, CompletionItemProvider, Position, TextDocument, Range, TextEdit, languages } from "vscode";
import Documentation, { FontAwesomeCompletionItem } from './documentation';
import { globPatternToRegExp } from "../helper/glob";

export default class CompletionProvider implements CompletionItemProvider {
    /** List of generated completion items. */
    private readonly completionItems: FontAwesomeCompletionItem[] = [];
    /** A word that triggers the auto completion of Font Awesome icons. */
    private readonly triggerWord: string;
    /** Pattern used to narrow down the document word range on auto completion. */
    private readonly triggerWordRegexp: RegExp;
    /** A list of glob patterns for which the extension should NOT auto-remove the trigger word when a font class name is inserted from the auto completion list. */
    private readonly disableTriggerWordAutoClearPatterns: string[];
    /** Same as disableTriggerWordAutoClearPatterns but as RegExp instances. */
    private readonly disableTriggerWordAutoClearRegexp: RegExp[];

    constructor(documentation: Documentation, triggerWord: string, disableTriggerWordAutoClearPatterns: string[]) {
        for (const icon of documentation.icons) {
            this.completionItems.push(documentation.asCompletionItem(icon));
        }

        this.triggerWord = triggerWord;
        this.triggerWordRegexp = new RegExp(triggerWord);
        this.disableTriggerWordAutoClearPatterns = disableTriggerWordAutoClearPatterns;
        this.disableTriggerWordAutoClearRegexp = this.disableTriggerWordAutoClearPatterns.map(
            pattern => globPatternToRegExp(pattern)
        )
    }

    private isAutoClearTriggerWordEnabledFor(document: TextDocument) {
        return this.disableTriggerWordAutoClearRegexp.findIndex(
            pattern => pattern.test(document.fileName)
        ) == -1;
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

        if (word.startsWith(this.triggerWord)) {
            return this.completionItems.map(item => {
                // Clone so that edits don't carry over to the "raw" list
                item = {...item};
                
                // For example html in vscode natively removes the "trigger word" when an auto completion item is selected.
                // Other langauges can't do it, we'll have to remove it manually
                // If the document language id is not present in the list of languages that do it automatically, do it manually
                if (isAutoClearTriggerWordEnabled) {
                    item.additionalTextEdits = [
                        TextEdit.replace(range, ''),
                    ];
                }

                return item;
            });
        }        
    }
}
