import { CancellationToken, CompletionContext, CompletionItemProvider, Position, TextDocument, Range } from "vscode";
import Documentation, { FontAwesomeCompletionItem } from './documentation';

export default class CompletionProvider implements CompletionItemProvider {
    /** List of generated completion items. */
    private readonly completionItems: FontAwesomeCompletionItem[] = [];
    /** A word that triggers the auto completion of Font Awesome icons. */
    private readonly triggerWord: string;
    /** Pattern used to narrow down the document word range on auto completion. */
    private readonly triggerWordRegexp: RegExp;

    constructor(documentation: Documentation, triggerWord: string) {
        for (const icon of documentation.icons) {
            this.completionItems.push(documentation.asCompletionItem(icon));
        }

        this.triggerWord = triggerWord;
        this.triggerWordRegexp = new RegExp(triggerWord);
    }

    public provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext
    ) {
        const exactRange = document.getWordRangeAtPosition(position, this.triggerWordRegexp);
        const fullRange = document.getWordRangeAtPosition(position);

        if (exactRange == null && fullRange == null) {;
            return [];
        }

        const range = (exactRange || fullRange) as Range;
        const word = document.getText(range);

        if (word.startsWith(this.triggerWord)) {
            return this.completionItems;
        }        
    }
}
