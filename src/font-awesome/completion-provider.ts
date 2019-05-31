import { CancellationToken, CompletionContext, CompletionItemProvider, Position, TextDocument, Range, TextEdit } from "vscode";
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
        // Support for alphanumeric suffix, including dashes. This ensures that the completion menu
        // provides items even after entering additional dashes, e.g.
        // fa-user (initial completion list triggered), followed by -circle (secondary completion list trigger.)
        // unfortunately the completion list is further filtered by VS Code's word separator setting, which seems to limit
        // the filter word to the closest dash, meaning the the secondary completion item list is filtered by
        // circle, not fa-user-cirlce.
        // https://github.com/Janne252/vscode-fontawesome-auto-complete/issues/6
        this.triggerWordRegexp = new RegExp(`${triggerWord}[a-zA-Z0-9-]*`);
        this.disableTriggerWordAutoClearPatterns = disableTriggerWordAutoClearPatterns;
        this.disableTriggerWordAutoClearRegexp = this.disableTriggerWordAutoClearPatterns.map(
            pattern => globPatternToRegExp(pattern)
        )
    }

    private isAutoClearTriggerWordEnabledFor(document: TextDocument) {
        for (const pattern of this.disableTriggerWordAutoClearRegexp) {
            const isMatch = pattern.test(document.fileName);
            // Patterns with the g flag must be reset to prevent odd behavior!
            if (pattern.flags.indexOf('g') != -1) {
                // Reset lastIndex so that we can use the same RegExp pattern again
                pattern.lastIndex = 0;
            }
            if (isMatch) {
                return false;
            }
        }

        // No pattern matched - auto clear is enabled
        return true;
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
        
        console.log(word);
        
        if (word.startsWith(this.triggerWord)) {
            
            // VS Code natively removes the "trigger word" when an auto completion item is selected for some languages, for example HTML.
            // Other langauges can't do it, we'll have to remove it manually
            // If the document language id is not present in the list of languages that do it automatically, do it manually
            if (isAutoClearTriggerWordEnabled) {
                const result: FontAwesomeCompletionItem[] = [];
                const additionalTextEdits = [TextEdit.replace(range, '')];

                for (let i = 0; i < this.completionItems.length; i++) {
                    result.push(
                        {...this.completionItems[i], additionalTextEdits}
                    );
                }

                return result;
            } else {
                return this.completionItems;
            }
            return this.completionItems.map(item => {
                if (isAutoClearTriggerWordEnabled) {
                    item.additionalTextEdits = [
                        TextEdit.replace(range, ''),
                    ];
                } else {
                    delete item.additionalTextEdits; 
                }

                return item;
            });
        }        
    }
}
