export function clone<T extends Object>(objectToClone: T): T {
    return JSON.parse(JSON.stringify(objectToClone))
}