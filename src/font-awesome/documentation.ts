import * as fs from 'fs';
import {CompletionItem, CompletionItemKind, Hover} from 'vscode';
import { IconEntry, PreviewStyle, Version } from './';
import Icon from './icon';

export interface IconEntryCollection {[key: string]: IconEntry; }

/** Represents Font Awesome icon documentation (collection of icon entries) */
export default class Documentation {
    private _title: string;
    public get title() { return this._title; }

    private _icons: Icon[];
    public get icons() { return this._icons; }

    private _mappedIcons: {[key: string]: Icon};
    public get mappedIcons() { return this._mappedIcons; }

    public readonly iconEntries: IconEntryCollection;
    public readonly version: Version;
    public readonly rootPath: string;
    public readonly previewStyle: PreviewStyle;

    constructor(rootPath: string, previewStyle: PreviewStyle, version: Version) {
        this.rootPath = rootPath;
        this.iconEntries = require(`${rootPath}/metadata/icons`) as {[key: string]: IconEntry};
        const readmeLines = fs.readFileSync(`${rootPath}/README.md`, 'utf8').split('\n');
        this.previewStyle = previewStyle;
        this.version = version;

        this._title = readmeLines[0].substring('# '.length);

        // Version migrations
        switch (version) {
            case Version.v4:
                this._title = this._title.substring(this._title.indexOf('[') + 1, this._title.lastIndexOf(']'));
                break;
            case Version.V5:
                break;
        }

        this.generateIcons();
    }

    private generateIcons() {
        this._icons = [];
        this._mappedIcons = {};

        for (const name in this.iconEntries) {
            const entry = this.iconEntries[name];

            for (const style of entry.styles) {
                const icon = new Icon(this, name, style, entry);
                this.icons.push(icon);
                this.mappedIcons[icon.fullCssName] = icon;
            }
        }
    }

    public asCompletionItem(icon: Icon): CompletionItem {
        return {
            documentation: icon.documentation,
            kind: CompletionItemKind.Reference,
            label: icon.fullCssName,
        };
    }

    public asHoverItem(icon: Icon): Hover {
        return {
            contents: [icon.documentation],
        };
    }
}
