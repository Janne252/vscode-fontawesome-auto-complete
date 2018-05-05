import * as path from 'path';
import * as vscode from 'vscode';
import { IconEntry, IconStylePrefix, IconStyle } from ".";

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

    constructor(name: string, style: IconStyle, entry: IconEntry, documentationFooter: string)
    {
        this.name = name;
        this.label = entry.label;
        this.prefix = IconStylePrefix[style];
        this.unicode = entry.unicode;
        this.style = style;
        this.iconUrl = path.join(__dirname, '../../fontawesome/advanced-options/raw-svg', this.style, `${this.name}.svg`);
        this.fullCssName = `${this.prefix} fa-${this.name}`;
        this.onlineUrl = `https://fontawesome.com/icons/${this.name}?style=${this.style}`;

        const protocolEnd = '://';
        let displayOnlineUrl = this.onlineUrl.substring(this.onlineUrl.indexOf(protocolEnd) + protocolEnd.length);
        
        this.documentation = new vscode.MarkdownString([
            `![](${this.iconUrl} | width=48 height=48)`,
            '',
            `|                              |                                                         |`,
            `|------------------------------|---------------------------------------------------------|`,
            `| **Icon**                     | ${this.label} &nbsp; &nbsp; \`free\` \`${this.style}\`  |`,
            `| **Unicode**                  | \`${this.unicode}\`                                     |`,
            `| **Reference &nbsp; &nbsp; ** | [${displayOnlineUrl}](${this.onlineUrl})                |`,
            '',
            documentationFooter
        ].join('\n'));
    }
}
