import {CompletionItem, CompletionItemKind, Hover} from 'vscode';
import * as YAML from 'yaml';
import * as fs from 'fs';
import { IconEntry, FontAwesomeVersion, CategoryEntry, ShimEntry } from './';
import Icon from './icon';
import { ExtensionConfiguration } from './configuration';

export interface IconEntryCollection {[key: string]: IconEntry; }
export interface CategoryCollection {[key: string]: CategoryEntry; }
export type ShimCollection = ShimEntry[];

/** Represents Font Awesome icon documentation (collection of icon entries) */
export default class Documentation {
    public readonly title: string;
    public readonly icons: Icon[];
    public readonly iconEntries: IconEntryCollection;
    public readonly categories: CategoryCollection;
    public readonly shims: ShimCollection;
    public readonly rootPath: string;
    public readonly metadata: {url: string, version: string};

    constructor(rootPath: string, public readonly config: ExtensionConfiguration) {
        this.rootPath = rootPath;
        this.iconEntries = require(`${rootPath}/metadata/icons`);
        this.metadata = require(`${rootPath}/metadata/config`);
        this.title = `Font Awesome ${this.metadata.version}`;

        // Version support
        switch (this.config.version) {
            case FontAwesomeVersion.v4:
                this.categories = {};
                this.shims = [];
                break;
            case FontAwesomeVersion.V5:
                this.categories = YAML.parse(fs.readFileSync(`${rootPath}/metadata/categories.yml`, {encoding: 'utf8'}));
                this.shims = require(`${rootPath}/metadata/shims`);
                break;
        }
           
        this.icons = [];

        this.generateIcons();
    }

    private getIconCategories(name: string) {
        const result: CategoryEntry[] = [];

        for (const categoryId in this.categories) {
            const category = this.categories[categoryId];

            if (category.icons.indexOf(name) != -1) {
                result.push(category);
            }
        }

        return result;
    }

    private generateIcons() {
        for (const name in this.iconEntries) {
            const entry = this.iconEntries[name];
            const categories = this.getIconCategories(name);
               
            for (const style of entry.styles) {
                const icon = new Icon(this, name, style, entry, categories);
                this.icons.push(icon);
            }
        }
    }

    public asCompletionItem(icon: Icon): FontAwesomeCompletionItem {
        return new FontAwesomeCompletionItem(icon, this.config);
    }

    public asHoverItem(icon: Icon): FontAwesomeHoverItem {
        return new FontAwesomeHoverItem(icon);
    }
}

export class FontAwesomeCompletionItem extends CompletionItem {
    readonly icon: Icon;

    get fullCssName() {
        return this.icon.fullCssName;
    }

    constructor(icon: Icon, config: ExtensionConfiguration) {
        super(
            icon.fullCssName,               // label
            CompletionItemKind.Text         // kind
        )
        this.icon = icon;
        this.documentation = icon.documentation;
        if (config.enableElevatedSortPriority) {
            this.sortText = '\0';
        }
    }
}

export class FontAwesomeHoverItem extends Hover {
    constructor(icon: Icon) {
        super([icon.documentation])
    }
}