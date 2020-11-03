import { Hover, HoverProvider as IHoverProvider, Position, Range, TextDocument } from 'vscode';
import { availablePrefixes, prefix } from '.';
import { ExtensionConfiguration } from './configuration';
import Documentation from './documentation';
import Icon from './icon';
import { InsertionTemplate } from './transformation';

const fullClassNamePattern = new RegExp(`(${availablePrefixes.join('|')})( ${prefix}[\\w-]+)`, 'i');

export default class HoverProvider implements IHoverProvider {
    public readonly documentation: Documentation;
    
    private readonly renderedIconInsertionMap: {[key: string]: Icon} = {};
    private readonly renderedInsertionTemplateMaps: {[key: string]: boolean} = {};

    constructor(documentation: Documentation, private readonly config: ExtensionConfiguration) {
        this.documentation = documentation;
        for (const icon of documentation.icons) {
            this.renderedIconInsertionMap[icon.fullCssName] = icon;
        }
    }

    public provideHover(document: TextDocument, position: Position) {
        let range: Range;
        const insertionTemplate = InsertionTemplate.resolve(document, this.config.insertionTemplates);

        if (insertionTemplate) {
            range = document.getWordRangeAtPosition(position, insertionTemplate.templatePattern) as Range;
        } else {
            range = document.getWordRangeAtPosition(position, fullClassNamePattern) as Range;
        }

        if (range == null) {
            return null;
        }

        const text = document.getText(range);

        // Lazy included insertion template support for hover
        if (insertionTemplate && !(insertionTemplate.alias in this.renderedInsertionTemplateMaps)) {
            this.renderedInsertionTemplateMaps[insertionTemplate.alias] = true;
            for (const icon of this.documentation.icons) {
                this.renderedIconInsertionMap[insertionTemplate.render(icon)] = icon;
            }   
        }

        if (text in this.renderedIconInsertionMap) {
            return new Hover(this.renderedIconInsertionMap[text].documentation, range);
        }
    }
}
