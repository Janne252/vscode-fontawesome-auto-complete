import { globPatternToRegExp } from "../helper/glob";
import * as RegexpHelpers from '../helper/regex';
import { availablePrefixes, prefix } from ".";
import { TextDocument } from "vscode";
import Icon from "./icon";

export class InsertionTemplate {
    public readonly alias: string;
    public readonly pattern: RegExp;
    public readonly template: string;
    /** Template string converted to a regular expression.  */
    public readonly templatePattern: RegExp;

    constructor(pattern: string, template: string) {
        this.alias = pattern;
        this.pattern = globPatternToRegExp(pattern);
        this.template = template;
        this.templatePattern = new RegExp(
            RegexpHelpers.escape(template)
            .replace(/\\{style\\}/g, `(${availablePrefixes.join('|')})`)
            .replace(/\\{prefix\\}/g, prefix)
            .replace(/\\{name\\}/g, '[\\w-]+')
        );
    }
    
    /**
     * Checks whether or not the insertion template is configured to be used with the document.
     * @param document
     */
    public matches(document: TextDocument) {
        return RegexpHelpers.test(document.fileName, this.pattern);
    }

    /**
     * Renders an icon with the template by replacing all placeholders.
     * @param icon 
     */
    public render(icon: Icon) {
        return this.template
            .replace(/{style}/g, icon.style)
            .replace(/{prefix}/g, icon.prefix)
            .replace(/{name}/g, icon.name)
        ;
    }

    /**
     * Finds the first insertion template from a list that matches the document.
     * @param document 
     * @param templates 
     */
    public static resolve(document: TextDocument, templates: InsertionTemplate[]) {
        for (const template of templates) {
            if (template.matches(document)) {
                return template;
            }
        }

        return null;
    }
}
