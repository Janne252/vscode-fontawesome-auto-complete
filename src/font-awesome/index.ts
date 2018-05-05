
/** 
 * Available FontAwesome icon styles. 
 * @see https://fontawesome.com/how-to-use
 */
export enum IconStyle
{
    solid = 'solid',
    regular = 'regular',
    light = 'light',
    brands = 'brands',
}

/**
 * Available FontAwesome icon style prefixes.
 * @see https://fontawesome.com/how-to-use
 */
export const IconStylePrefix: {[style in IconStyle]: string} = 
{
    [IconStyle.solid]: 'fas',
    [IconStyle.regular]: 'far',
    [IconStyle.light]: 'fal',
    [IconStyle.brands]: 'fab',
};

export const AvailablePrefixes = Object.keys(IconStylePrefix).map(key => IconStylePrefix[key as IconStyle]);

/**
 * Represents the stucture of an icon entry
 * in fontawesome/advanced-options/metadata/icons.json
 */
export interface IconEntry
{
    changes: string[];
    ligatures: any[];
    search: {
        terms: string[];
    };
    styles: IconStyle[];
    unicode: string;
    label: string;
    svg: {
        [style in IconStyle]: {
            last_modified: number,
            raw: string;
            viewbox: [string, string, string, string];
            width: number;
            height: number;
            path: string;
        }
    }
}