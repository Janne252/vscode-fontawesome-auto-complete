import { getOrDefault } from "./config";

/** Converts a glob pattern to a RegExp pattern. */
export function globPatternToRegExp(pattern: string, options?: {flags?: string}) {
    // Unline glob-to-regexp package, this one:
    // - makes directory separators universal and optional (/ or \ turns into \?|/?) 
    const rules: [RegExp, string][] = [
        [/\*/g, '.*'],
        [/\*\*/g, '.*'],
        [/\\|\//g, '\\?|\/?'],
    ];

    for (const rule of rules) {
        const [find, replace] = rule;
        pattern = pattern.replace(find, replace);
    }

    return new RegExp(
        `^${pattern}$`,
        getOrDefault(options, 'flags', 'gi')
    );
}
