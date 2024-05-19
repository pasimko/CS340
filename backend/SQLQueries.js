export function GetInsertQueryString(tableName, keyValues)
{
    const keyStrings = Object.keys(keyValues).join(', ');

    const valueStrings = Object.keys(keyValues).map(function(item){
        return '\'' + keyValues[item].toString() + '\'';
    }).join(', ');

    return `INSERT INTO ${tableName} (${keyStrings}) VALUES (${valueStrings})`;

}