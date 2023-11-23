function isValidJSON(array, keys) {
    if (array.length === 0)
        return false;

    for (const item in array) {
        if (!item || typeof item !== 'object')
            return false;

        for (const key of keys) {
            if (!(key in item))
                return false;
        }
    }

    return true;
}

module.exports = isValidJSON;
