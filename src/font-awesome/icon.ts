import * as path from 'path';
import * as vscode from 'vscode';
import { IconEntry, IconStylePrefix, IconStyle, PreviewStyle } from ".";

export default class Icon
{
    readonly name: string;
    readonly label: string;
    readonly prefix: string;
    readonly unicode: string;
    readonly style: string;
    readonly iconUrl: string;
    readonly fullCssName: string;
    readonly onlineUrl: string;

    readonly documentation: vscode.MarkdownString;

    private svgPath: string;
    private previewSvg: string;
    private viewbox: string[];

    constructor(name: string, style: IconStyle, entry: IconEntry, previewStyle: PreviewStyle, documentationFooter: string)
    {
        this.name = name;
        this.label = entry.label;
        this.prefix = IconStylePrefix[style];
        this.unicode = entry.unicode;
        this.style = style;
        this.iconUrl = path.join(__dirname, '../../fontawesome/advanced-options/raw-svg', this.style, `${this.name}.svg`);
        this.fullCssName = `${this.prefix} fa-${this.name}`;
        this.onlineUrl = `fontawesome.com/icons/${this.name}?style=${this.style}`;
        this.svgPath = entry.svg[style].path;
        this.viewbox = entry.svg[style].viewBox;
        
        this.previewSvg = `
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="${this.viewbox.join(' ')}"
            style="background-color: ${previewStyle.backgroundColor};transform: scale%280.75%29;padding:8px;"
        >
            <path fill="${previewStyle.foregroundColor}" d="${this.svgPath}"/>
        </svg>
        `;

        this.documentation = new vscode.MarkdownString([
            `![](data:image/svg+xml;utf8,${this.previewSvg} | width=64 height=64)`,
            '',
            `|                              |                                                         |`,
            `|------------------------------|---------------------------------------------------------|`,
            `| **Icon**                     | ${this.label} &nbsp; &nbsp; \`free\` \`${this.style}\`  |`,
            `| **Unicode**                  | \`${this.unicode}\`                                     |`,
            `| **Reference &nbsp; &nbsp; ** | [${this.onlineUrl}](https://${this.onlineUrl})          |`,
            '',
            documentationFooter
        ].join('\n'));
    }
}
