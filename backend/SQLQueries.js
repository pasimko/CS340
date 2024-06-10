// GetTableDataTypes:
    // Query syntax taken from: https://stackoverflow.com/questions/41146316/sql-server-query-to-get-data-type-for-all-columns-in-table
    // Accessed 5/19/2024

export function InsertQueryString(tableName, keyValues)
{
    const keyStrings = Object.keys(keyValues).join(', ');

    const valueStrings = Object.keys(keyValues).map(function(item){
        return '\'' + keyValues[item].toString() + '\'';
    }).join(', ');

    return `INSERT INTO ${tableName} (${keyStrings}) VALUES (${valueStrings})`;
}

export function GetTableDataTypes(tableName)
{
    const queryString = `SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_KEY FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`;
    return queryString;
}

export function GetPrimaryKeysQuery()
{
    return `SELECT TABLE_NAME, COLUMN_NAME
    FROM information_schema.KEY_COLUMN_USAGE 
    WHERE CONSTRAINT_NAME = 'PRIMARY'`;
}

export function GetFullDataTableQuery(page)
{
    let baseQuery = `SELECT ${page}.*`;
    return `${baseQuery} FROM ${page}`;
}

export function UpdateQueryString(tableName, keyValues, primaryKey)
{
    let keyValueStrings = [];

    for (let key in keyValues)
    {
        if( key != primaryKey)
        {
            keyValueStrings.push( `${key} = \'${keyValues[key]}\'`);
        }
    }

    const setString = keyValueStrings.join(", ");
    const updateClause = `UPDATE ${tableName} `;
    let setClause = `SET ${setString}`
    const whereClause = ` WHERE ${primaryKey} = ${keyValues[primaryKey]}`
    return updateClause + setClause + whereClause;
}

export function DeleteQueryString(tableString, keyValues, primaryKey)
{
    const stringQuery = `DELETE FROM ${tableString} WHERE  ${primaryKey} = ${keyValues['deleteId']}` ;
    return stringQuery;
}
