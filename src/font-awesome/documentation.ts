import * as fs from 'fs';
import * as path from 'path';
import { IconEntry } from './';
import Icon from './icon';
import {CompletionItem, CompletionItemKind, Hover} from 'vscode';

export type IconEntryCollection = {[key: string]: IconEntry};

export default class Documentation
{
    public readonly iconEntries: IconEntryCollection;
    public readonly readmeLines: string[];
    public readonly title: string;
    public readonly icons: Icon[];
    public readonly mappedIcons: {[key: string]: Icon};

    constructor()
    {
        this.iconEntries = require(`../../fontawesome/advanced-options/metadata/icons`) as {[key: string]: IconEntry};
        this.readmeLines = fs.readFileSync(path.join(__dirname, `../../fontawesome/README.md`), 'utf8').split('\n');
        this.title = this.readmeLines[0].substring('# '.length);        
        
        this.icons = [];
        this.mappedIcons = {};

        for (let name in this.iconEntries)
        {
            let entry = this.iconEntries[name];
            
            for (let style of entry.styles)
            {
                let icon = new Icon(name, style, entry, this.title);
                this.icons.push(icon);
                this.mappedIcons[icon.fullCssName] = icon;
            }
        }
    }

    asCompletionItem(icon: Icon): CompletionItem
    {
        return {
            label: icon.fullCssName,
            documentation: icon.documentation,
            kind: CompletionItemKind.Reference
        };
    }

    asHoverItem(icon: Icon): Hover
    {
        return {
            contents: [icon.documentation]
        }
    }
}
