import * as vscode from 'vscode';
import { IconEntry, IconStyle, iconStylePrefix, FontAwesomeVersion, CategoryEntry, prefix } from ".";

/** Represents an icon that can be used as the source of Hover or Completion item. */
export default class Icon {
    /** Documentation in Markdown format. */
    public readonly documentation: vscode.MarkdownString;
    /** Full CSS name of the icon, e.g. fas fa-user */
    public readonly fullCssName: string;

    /** Short style of the icon, e.g. fab, far */
    public readonly style: string;
    /** Style name of the icon, e.g. brands, regular */
    public readonly styleName: string;
    public readonly name: string;
    public readonly prefix: string;

    constructor(
        documentation: PartialDocumentation, 
        name: string, 
        style: IconStyle, 
        entry: PartialIconEntry, 
        categories: CategoryEntry[]
    ) {
        this.style = iconStylePrefix[style];
        this.styleName = style;
        this.name = name;
        this.prefix = prefix;

        const unicode = entry.unicode;
        const svgPath = entry.svg[style].path;
        const viewbox = entry.svg[style].viewBox;

        let onlineUrl = '';
        this.fullCssName = `${this.style} ${this.prefix}${name}`;

        // Version migrations
        switch (documentation.config.version) {
            case FontAwesomeVersion.v4:
                onlineUrl = `fontawesome.com/v4.7.0/icon/${name}/`;
                break;
            case FontAwesomeVersion.V5:
                onlineUrl = `fontawesome.com/icons/${name}?style=${style}`;
                break;
        }

        const previewSvg = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="${viewbox.join(' ')}"
            style="background-color: ${documentation.config.previewStyle.backgroundColor};transform: scale(0.9);"
        >
            <path fill="${documentation.config.previewStyle.foregroundColor}" d="${svgPath}"/>
        </svg>
        `;

        const changes = entry.changes.map(o => `\`${o}\``).join(', ');
        const iconBase64String = this.svgXmlStringToBase64DataUri(previewSvg);
        const iconSize: {width: number; height: number; } = {
            width: 64, height: 64,
        };
        const iconMarkdownAttributes = this.encodeSpaces(
            ` | width=${iconSize.width} height=${iconSize.height}`
        );

        this.documentation = new vscode.MarkdownString([
            `![](${iconBase64String}${iconMarkdownAttributes})`,
            '',
            `| &nbsp;                       |                                                                               |`,
            `|------------------------------|---------------------------------------------------------                      |`,
            `| **Icon**                     | [${entry.label}](https://${onlineUrl})    &nbsp; &nbsp; \`free\` \`${style}\` |`,
            `| **Categories**               | ${categories.map(o => `\`${o.label}\``).join(', ') || '&nbsp;_N/A_'}          |`,
            `| **Unicode**                  | \`${unicode}\`                                                                |`,
            `| **Changes**                  | ${changes}                                                                    |`,
            '',
            `[${documentation.title}](${documentation.metadata.url})`,
        ].join('\n'));
    }

    private svgXmlStringToBase64DataUri(svg: string) {
        return 'data:image/svg+xml;utf8;base64,' + Buffer.from(svg).toString('base64');
    }

    private encodeSpaces(content: string) {
        return content.replace(/ /g, '%20');
    }
}

export interface PartialDocumentation {
    title: string;
    metadata: {version: string, url: string};
    config: {version: FontAwesomeVersion, previewStyle: {backgroundColor: string, foregroundColor: string}};
}

export interface PartialIconEntry {
    unicode: string;
    svg: IconEntry['svg'];
    changes: string[];
    label: string;
}