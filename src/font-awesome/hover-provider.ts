import { HoverProvider as IHoverProvider, Position, TextDocument, Range, Hover } from 'vscode';
import Documentation from './documentation';
import { AvailablePrefixes } from '.';

const fullClassNamePattern = new RegExp(`(${AvailablePrefixes.join('|')}|fa)( fa[\\w-]+)`, 'i');

export default class HoverProvider implements IHoverProvider 
{
    private documentation: Documentation;

    constructor(documentation: Documentation)
    {
        this.documentation = documentation;
    }

    provideHover(document: TextDocument, position: Position)
    {
        let range = document.getWordRangeAtPosition(position, fullClassNamePattern) as Range;
        
        if (range == null)
        {
            return null;
        }

        let text = document.getText(range);
        
        if (text in this.documentation.mappedIcons)
        {
            return new Hover(this.documentation.mappedIcons[text].documentation, range);
        }
    }
}