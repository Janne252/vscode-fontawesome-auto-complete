import * as fs from 'fs';
import { IconEntry, PreviewStyle, Version } from './';
import Icon from './icon';
import {CompletionItem, CompletionItemKind, Hover} from 'vscode';

export type IconEntryCollection = {[key: string]: IconEntry};

/** Represents Font Awesome icon documentation (collection of icon entries) */
export default class Documentation
{
    public readonly iconEntries: IconEntryCollection;
    public readonly version: Version;
    public readonly rootPath: string;
    public readonly previewStyle: PreviewStyle;

    private _title: string;
    public get title() { return this._title; }

    private _icons: Icon[];
    public get icons() { return this._icons; }

    private _mappedIcons: {[key: string]: Icon};
    public get mappedIcons() { return this._mappedIcons; }

    constructor(rootPath: string, previewStyle: PreviewStyle, version: Version)
    {
        this.rootPath = rootPath;
        this.iconEntries = require(`${rootPath}/advanced-options/metadata/icons`) as {[key: string]: IconEntry};
        let readmeLines = fs.readFileSync(`${rootPath}/README.md`, 'utf8').split('\n');
        this.previewStyle = previewStyle;
        this.version = version;

        this._title = readmeLines[0].substring('# '.length); 
        
        // Version migrations
        switch(version)
        {
            case Version.v4:
                this._title = this._title.substring(this._title.indexOf('[') + 1, this._title.lastIndexOf(']'));
                break;
            case Version.V5:
                break;
        }

        this.generateIcons();
    }

    private generateIcons()
    {
        this._icons = [];
        this._mappedIcons = {};

        for (let name in this.iconEntries)
        {
            let entry = this.iconEntries[name];
            
            for (let style of entry.styles)
            {
                let icon = new Icon(this, name, style, entry);
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
