import {CompletionItem, CompletionItemKind, Hover} from 'vscode';
import { IconEntry, PreviewStyle, FontAwesomeVersion, CategoryEntry, ShimEntry } from './';
import Icon from './icon';

export interface IconEntryCollection {[key: string]: IconEntry; }
export interface CategoryCollection {[key: string]: CategoryEntry; }
export type ShimCollection = ShimEntry[];
/** Represents Font Awesome icon documentation (collection of icon entries) */
export default class Documentation {
    public readonly title: string;
    public readonly icons: Icon[];

    public readonly mappedIcons: {[key: string]: Icon};

    public readonly iconEntries: IconEntryCollection;
    public readonly categories: CategoryCollection;
    public readonly shims: ShimCollection;
    public readonly version: FontAwesomeVersion;
    public readonly rootPath: string;
    public readonly previewStyle: PreviewStyle;
    public readonly config: {version: string, url: string};


    constructor(rootPath: string, previewStyle: PreviewStyle, version: FontAwesomeVersion) {
        this.rootPath = rootPath;
        this.iconEntries = require(`${rootPath}/metadata/icons`);
        this.previewStyle = previewStyle;
        this.version = version;
        this.config = require(`${rootPath}/metadata/config`);
        this.title = `Font Awesome ${this.config.version}`;

        // Version support
        switch (version) {
            case FontAwesomeVersion.v4:
                this.categories = {};
                this.shims = [];
                break;
            case FontAwesomeVersion.V5:
                this.categories = require(`${rootPath}/metadata/categories`);
                this.shims = require(`${rootPath}/metadata/shims`);
                break;
        }
           
        this.icons = [];
        this.mappedIcons = {};

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
                this.mappedIcons[icon.fullCssName] = icon;
            }
        }
    }

    public asCompletionItem(icon: Icon): FontAwesomeCompletionItem {
        return new FontAwesomeCompletionItem(icon);
    }

    public asHoverItem(icon: Icon): FontAwesomeHoverItem {
        return new FontAwesomeHoverItem(icon);
    }
}

export class FontAwesomeCompletionItem extends CompletionItem {
    constructor(icon: Icon) {
        super(
            icon.fullCssName,
            CompletionItemKind.Reference
        )
        this.documentation = icon.documentation;
    }
}

export class FontAwesomeHoverItem extends Hover {
    constructor(icon: Icon) {
        super([icon.documentation])
    }
}