/**
 * 
 * @param obj The object to get the property from. Can be an object or an array.
 * @param key The key of the property.
 * @param defaultValue Default value used if the obj is null or if the key doesn't exist in the object.
 */
export function getOrDefault<T = string, TObj = Object | Array<T>>(obj: TObj, key: PropertyKey, defaultValue?: T): T {
    if (obj == null || key in (obj as Record<any, any>) === false) {
        return defaultValue as T;
    } 

    return obj[key as keyof TObj] as any;
}
