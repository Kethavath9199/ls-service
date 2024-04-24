
export function trimkey(key: any) {
    return key.trim().replace(/\s+/g, '').toLowerCase();
}``

export function removeWhiteSpacesFromKeys(data: any): any {
    const newData: any = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const newKey = trimkey(key); // Remove spaces from the key
            newData[newKey] = data[key]; // Create new key-value pair
        }
    }
    return newData;
}

export function transformExcelKeysWithActualKeys(data: any, keysMapping: any): { transformedKeysObject: any } {
    const transformedKeysObject: any = {};
    Object.keys(data).forEach(key => {
        if (keysMapping[trimkey(key)]) {
            transformedKeysObject[keysMapping[trimkey(key)]] = data[key].trim();
        }
        transformedKeysObject.errorExist = false;
        transformedKeysObject.error = null;
    });
    return { transformedKeysObject: transformedKeysObject };
}

export function addToMap(key: string, data: any, map: Map<any, any>): void {
    if (!map.has(key)) { //if key does not exists add new entry
        map.set(key, data)
    }
}

export function fetchValueFromMap(key: string, map: Map<any, any>): { exists: boolean, value: any } {
    if (map.has(key)) {
        return { exists: true, value: map.get(key) };
    } else {
        return { exists: false, value: {} };
    }
}

export function generateUniqueKey(keys: Array<string>) {
    return keys.join('-');
}

