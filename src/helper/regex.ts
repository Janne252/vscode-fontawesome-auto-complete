export function test(input: string, regex: RegExp) {
    const result = regex.test(input);
    // Allows re-using the regex in ase the regex contains g flag
    /** @see https://stackoverflow.com/a/1520853 */
    regex.lastIndex = 0;
    return result;
}

/** @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping */
export function escape(string: string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
