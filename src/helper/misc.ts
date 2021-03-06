/**
 * Returns false if the value is null. Returns the value otherwise.
 */
export function notNullOrFalse<T>(value: T): T | false {
    if (value == null) {
        return false;
    }

    return value;
}
