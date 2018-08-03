
export enum Version {
    v4 = '4',
    V5 = '5',
}
/**
 * Available FontAwesome icon styles.
 * @see https://fontawesome.com/how-to-use
 */
export enum IconStyle {
    solid = 'solid',
    regular = 'regular',
    light = 'light',
    brands = 'brands',
    v4 = 'v4',
}

/**
 * Available FontAwesome icon style prefixes.
 * @see https://fontawesome.com/how-to-use
 */
export const iconStylePrefix: {[style in IconStyle]: string} =  {
    [IconStyle.solid]: 'fas',
    [IconStyle.regular]: 'far',
    [IconStyle.light]: 'fal',
    [IconStyle.brands]: 'fab',
    [IconStyle.v4]: 'fa',
};

export const availablePrefixes = Object.keys(iconStylePrefix).map(key => iconStylePrefix[key as IconStyle]);

/**
 * Represents the stucture of an icon entry
 * in fontawesome/advanced-options/metadata/icons.json
 */
export interface IconEntry {
    changes: string[];
    ligatures: any[];
    search: {
        terms: string[];
    };
    styles: IconStyle[];
    unicode: string;
    label: string;
    svg: {
        [style in IconStyle]: IconEntrySvg
    };
}

export interface IconEntrySvg {
    last_modified: number;
    raw: string;
    viewBox: [string, string, string, string];
    width: number;
    height: number;
    path: string;
}

export interface PreviewStyle {
    backgroundColor: string;
    foregroundColor: string;
}
