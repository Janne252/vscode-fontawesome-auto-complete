import * as vscode from 'vscode';
import { IconEntry, IconStylePrefix, IconStyle, Version } from ".";
import Documentation from './documentation';

/** Represents an icon that can be used as the source of Hover or Completion item. */
export default class Icon
{
    /** Documentation in Markdown format. */
    readonly documentation: vscode.MarkdownString;
    /** Full CSS name of the icon, e.g. fas fa-user */
    readonly fullCssName: string;

    constructor(documentation: Documentation, name: string, style: IconStyle, entry: IconEntry)
    {
        let prefix = IconStylePrefix[style];
        let unicode = entry.unicode;

        this.fullCssName = `${prefix} fa-${name}`;
        let svgPath = entry.svg[style].path;
        let viewbox = entry.svg[style].viewBox;
        let onlineUrl = '';

        // Version migrations
        switch(documentation.version)
        {
            case Version.v4:
                onlineUrl = `fontawesome.com/v4.7.0/icon/${name}/`;
                break;
            case Version.V5:
                onlineUrl = `fontawesome.com/icons/${name}?style=${style}`;
                break;                             
        }

        let previewSvg = `
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="${viewbox.join(' ')}"
            style="background-color: ${documentation.previewStyle.backgroundColor};transform: scale(0.75);padding:8px;"
        >
            <path fill="${documentation.previewStyle.foregroundColor}" d="${svgPath}"/>
        </svg>
        `;
        

        let changes = entry.changes.map(o => `\`${o}\``).join(', ');
        let iconBase64String = this.svgXmlStringToBase64DataUri(previewSvg);
        let iconSize = {
            width: 64, height: 64
        };
        let iconMarkdownAttributes = this.encodeSpaces(
            ` | width=${iconSize.width} height=${iconSize.height}`
        );

        this.documentation = new vscode.MarkdownString([
            `![](${iconBase64String}${iconMarkdownAttributes})`,
            '',
            `| &nbsp;                       |                                                         |`,
            `|------------------------------|---------------------------------------------------------|`,
            `| **Icon**                     | ${entry.label} &nbsp; &nbsp; \`free\` \`${style}\`      |`,
            `| **Unicode**                  | \`${unicode}\`                                          |`,
            `| **Changes**                  | ${changes}                                              |`,
            `| **Reference &nbsp; &nbsp;**  | [${onlineUrl}](https://${onlineUrl})                    |`,
            '',
            documentation.title
        ].join('\n'));
    }

    private svgXmlStringToBase64DataUri(svg: string)
    {
        return 'data:image/svg+xml;utf8;base64,' + Buffer.from(svg).toString('base64');
    }

    private encodeSpaces(content: string)
    {
        return content.replace(/ /g, '%20');
    }
}
