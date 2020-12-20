import * as globPatternToRegExp from 'glob-to-regexp';
import * as RegexpHelpers from '../helper/regex';
import { availablePrefixes, availableStyleNames, prefix } from ".";
import { setCharacterCase } from "../helper/string";

export enum InsertionTemplateTokenFormat {
    /** exampleOfCamelCase */
    CamelCase = 'camelCase',
    /** example-of-kebab-case */
    KebabCase = 'kebabCase',
    /** ExampleOfPascalCase */
    PascalCase = 'pascalCase',
    /** example_of_snake_case */
    SnakeCase = 'snakeCase',
}

export class InsertionTemplate {
    public readonly alias: string;
    public readonly pattern: RegExp;
    public readonly template: string;
    /** Template string converted to a regular expression.  */
    public readonly templatePattern: RegExp;

    constructor(pattern: string, template: string) {
        this.alias = pattern;
        this.pattern = globPatternToRegExp(pattern, {globstar: true});
        this.template = template;
        this.templatePattern = new RegExp(
            RegexpHelpers.escape(template)
            .replace(/\\{style\\}/g, `(${availablePrefixes.join('|')})`)
            .replace(/\\{styleName\\}/g, `(${availableStyleNames.join('|')})`)
            .replace(/\\{prefix\\}/g, prefix)
            .replace(/\\{name(:\w+)?\\}/g, '[\\w-]+')
        );
    }
    
    /**
     * Checks whether or not the insertion template is configured to be used with the document.
     * @param document
     */
    public matches(document: {fileName: string}) {
        return RegexpHelpers.testUri(document.fileName, this.pattern);
    }

    /**
     * Renders an icon with the template by replacing all placeholders.
     * @param icon 
     */
    public render(icon: {style: string, styleName: string, prefix: string, name: string}) {
        return this.template
            .replace(/{style}/g, icon.style)
            .replace(/{styleName}/g, icon.styleName)
            .replace(/{prefix}/g, icon.prefix)
            .replace(/{name}/g, icon.name)
            .replace(/{name:(?<format>\w+)}/, (substring: string, format: string) => {
                return this.format(
                    icon.name, '-',
                    (format ?? InsertionTemplateTokenFormat.KebabCase) as InsertionTemplateTokenFormat
                );
            });
        ;
    }

    private format(value: string, delimiter: string, format: InsertionTemplateTokenFormat) {
        const tokens = value.split(delimiter);
        switch (format) {
            case InsertionTemplateTokenFormat.PascalCase:
                return setCharacterCase(tokens.map(token => setCharacterCase(token, 0, 'upper')).join(''), 0, 'upper');
            case InsertionTemplateTokenFormat.CamelCase:
                return setCharacterCase(tokens.map(token => setCharacterCase(token, 0, 'upper')).join(''), 0, 'lower');
            case InsertionTemplateTokenFormat.KebabCase:
                return tokens.map(token => token.toLowerCase()).join('-');
            case InsertionTemplateTokenFormat.SnakeCase:
                return tokens.map(token => token.toLowerCase()).join('_');
            default:
                return value;
        }
    }

    /**
     * Finds the first insertion template from a list that matches the document.
     * @param document 
     * @param templates 
     */
    public static resolve(document: {fileName: string}, templates: InsertionTemplate[]) {
        for (const template of templates) {
            if (template.matches(document)) {
                return template;
            }
        }

        return null;
    }
}

export class AutoClearTriggerWordRule {
    public readonly pattern: RegExp;

    constructor(pattern: string) {
        this.pattern = globPatternToRegExp(pattern, {globstar: true});
    }

    /**
     * Checks whether or not the insertion template is configured to be used with the document.
     * @param document
     */
    public matches(document: {fileName: string}) {
        return RegexpHelpers.testUri(document.fileName, this.pattern);
    }
}