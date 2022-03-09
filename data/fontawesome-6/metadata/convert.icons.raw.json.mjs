//@ts-check
import fs from 'fs';
import deepEqual from 'deep-equal';

// Load icons from a browser module that declares them in window.___FONT_AWESOME___
import { createRequire } from 'module';

/**@type {{data: {release: {icons: {changes: string[], id: string}[]}}}} */
const {data} = JSON.parse(fs.readFileSync('./data.json', {encoding: 'utf-8'}));

//@ts-ignore
const require = createRequire(import.meta.url);
//@ts-ignore
global.window = {};
// https://fontawesome.com/download -> Free For Web -> /js/all.js
require('./all.js');

/**@type{Record<string, Record<string, [number, number, any[], string, string]>>} */
//@ts-ignore
const icons = global.window.___FONT_AWESOME___.styles;

// Some assertion-like checks to make sure the data structure known 
/**@type{{key: string, alias: string, name: string}[]} */
const knownStyles = [
    {key: 'fab', alias: 'fa-brands', name: 'brands'}, 
    {key: 'far', alias: 'fa-regular', name: 'regular'}, 
    {key: 'fas', alias: 'fa-solid', name: 'solid'}, 
    {key: 'fa', alias: 'fa-solid', name: 'solid'}
];
const faIsJustACopyOf = 'fas';

// assume that fa is just a copy of fa-solid
for (const faIcon in icons['fa']) {
    const faData = icons['fa'][faIcon];
    // Different prefix on the variable to make it more difficult to mix it with faData...
    const solidData = icons[faIsJustACopyOf][faIcon];
    
    if (!deepEqual(faData, solidData)) {
        throw new Error(`Expected icons.fa["${faIcon}"]: ${faData.length} to match icons.${faIsJustACopyOf}["${faIcon}"]: ${solidData.length}`);
    }
}

// make sure that alias matches name (no unique icons in either set)
for (const check of knownStyles) {
    const aKeys = Object.keys(icons[check.key]);
    const bKeys = Object.keys(icons[check.alias]);

    // If both collections contain same icons
    if (aKeys.length == bKeys.length && aKeys.every(a => bKeys.some(b => a == b))) {
        console.info(`${check.key} == ${check.alias} sanity check passed`);
    } else {
        throw new Error(`${check.key} != ${check.alias} sanity check failed`);
    }
}

for (const style in icons) {
    // make sure that there are no unknown styles
    if (!knownStyles.some(check => check.key == style || check.alias == style)) {
        throw new Error(`Unsupported icon style "${style}"`);
    }
}

/**@type{Record<string, {changes: string[], ligatures: unknown[], categories: string[], search: {terms: string[]}, styles: string[], unicode: string, label: string, svg: Record<string, {last_modified: number, raw: string, viewBox: string[], width: number, height: number, path: string}>}>} */
const result = {};

for (const style of knownStyles) {
    for (const key in icons[style.key]) {
        const [width, height, maybe_aliases, unicode, svg_path] = icons[style.key][key];
        if (!(key in result)) {
            result[key] = {
                // Missing data
                changes: data.release.icons.find(i => i.id == key).changes,
                // Missing data, unused
                ligatures: [],
                // Missing data
                categories: [],
                search: {
                    terms: [],
                },
                styles: [],
                unicode: unicode,
                label: key,
                svg: {

                }
            }
        }
        // Register style
        if (!result[key].styles.includes(style.name)) {
            result[key].styles.push(style.name);
        }
        // Register search terms
        if (!result[key].search.terms.includes(key)) {
            result[key].search.terms.push(key);
        }
        result[key].svg[style.name] = {
            width,
            height,
            last_modified: 0,
            path: svg_path,
            viewBox: ["0", "0", String(width), String(height)],
            raw: `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 ${width} ${height}\"><path d=\"${svg_path}\"/></svg>`
        }
    }
}

fs.writeFileSync('./icons.json', JSON.stringify(result, null, 2), {encoding: 'utf8'});
