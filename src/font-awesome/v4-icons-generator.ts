import * as fs from 'fs';
import * as path from 'path';
import { IconEntry, IconEntrySvg, IconStyle } from '../font-awesome';

/* Quick and dirty collection of code used to convert v4 data to v5 icons.json format.
    Steps used:
    1. Obtain Font Awesome 4.7.0 data: svg font and icons.yml (converted to .json with an online tool)
    2. Place generated .svg images in data/fontawesome-4/svg
    3. use font-blast to extract the individual svg images
    4. Use the generated css code to match the missed icon names to their unicode values (output to svg-filename-charcode-map as one entry per line, tab-separated, e.g. glass	f000)
    5. Use the previously generated unicode-filename map to figure out which svg file belongs to which icon in the yml file
    6. output generated json
*/
interface FontAwesome4Entry {
    name: string; id: string; unicode: string; created: number; filter: string[]; categories: string;
}

export default () => {
    const rootPath = path.dirname(path.dirname(__dirname));
    const fa4Icons = require(path.join(rootPath, 'data/fontawesome-4/raw-icons')) as FontAwesome4Entry[];
    const faFilenameCharcodeMap = fs.readFileSync(
        path.join(rootPath, 'data/fontawesome-4/svg-filename-charcode-map.txt'),
        'utf8'
    )
        .split('\r\n')
        .map(o => o.split('\t'));

    const unicodeFilenameMap: {[key: string]: string} = {};

    for (const mapEntry of faFilenameCharcodeMap) {
        unicodeFilenameMap[mapEntry[1]] = fs.readFileSync(
            path.join(rootPath, `data/fontawesome-4/svg/${mapEntry[0]}.svg`),
            'utf8'
        );
    }

    const viewBoxPattern = /viewBox="(\d+) (\d+) (\d+) (\d+)"/;
    const svgEnd = `"/></svg>`;
    const startOfPath = `<path d="`;

    const v4Icons: {[key: string]: IconEntry} = {};

    for (const icon of fa4Icons) {
        const svgData = unicodeFilenameMap[icon.unicode];
        const match = viewBoxPattern.exec(svgData) as RegExpMatchArray;

        const pathStart = svgData.indexOf(startOfPath) + startOfPath.length;

        v4Icons[icon.id] = {
            unicode: icon.unicode,
            label: icon.name,
            changes: [icon.created].map(o => {
                const change = o.toString();
                return change.length === 1 ? `${change}.0` : change;
            }),
            ligatures: [],
            search: {
                terms: icon.filter,
            },
            styles: [IconStyle.v4],
            svg: <any> {
                [IconStyle.v4]: {
                    raw: svgData,
                    width: parseInt(match[4]),
                    height: parseInt(match[3]),
                    viewBox: [match[1].toString(), match[2].toString(), match[3].toString(), match[4].toString()],
                    last_modified: 1477267200,
                    path: svgData.substring(pathStart, svgData.length - svgEnd.length),

                } as IconEntrySvg,
            },
        };
    }

    fs.writeFileSync(path.join(rootPath, 'data/fontawesome-4/icons.json'), JSON.stringify(v4Icons, null, 4));
};
