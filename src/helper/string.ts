/**
 * Sets the character case in the specified index.
 */
export function setCharacterCase(str: string, index: number, characterCase: 'upper' | 'lower'): string {
    let char = '';
    if (index < str.length) {
        switch (characterCase) {
            case 'upper':
                char = str[index].toUpperCase();
                break;
            case 'lower':
                char = str[index].toLowerCase();
                break;
        }
    }
    return `${char}${str.substring(index + 1)}`;
}