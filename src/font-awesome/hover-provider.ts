import { Hover, HoverProvider as IHoverProvider, Position, Range, TextDocument } from 'vscode';
import { availablePrefixes } from '.';
import Documentation from './documentation';

const fullClassNamePattern = new RegExp(`(${availablePrefixes.join('|')}|fa)( fa[\\w-]+)`, 'i');

export default class HoverProvider implements IHoverProvider {
    public readonly documentation: Documentation;

    constructor(documentation: Documentation) {
        this.documentation = documentation;
    }

    public provideHover(document: TextDocument, position: Position) {
        const range = document.getWordRangeAtPosition(position, fullClassNamePattern) as Range;

        if (range == null) {
            return null;
        }

        const text = document.getText(range);

        if (text in this.documentation.mappedIcons) {
            return new Hover(this.documentation.mappedIcons[text].documentation, range);
        }
    }
}
