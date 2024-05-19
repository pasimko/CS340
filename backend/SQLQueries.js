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
    //Get datatypes from table
    //Query syntax taken from: https://stackoverflow.com/questions/41146316/sql-server-query-to-get-data-type-for-all-columns-in-table
    //Accessed 5/19/2024
    const queryString = `SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_KEY FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}'`;
    return queryString;
}

export function GetFullDataTableQuery(page, fkResult)
{
        // Construct the base query
        let baseQuery = `SELECT ${page}.*`;
        // Construct JOIN clauses for foreign keys
        let joinClauses = '';
        for (const fk of fkResult) {
            baseQuery += `, ${fk.REFERENCED_TABLE_NAME}.name AS ${fk.COLUMN_NAME}_name`;
            joinClauses += ` LEFT JOIN ${fk.REFERENCED_TABLE_NAME} ON ${page}.${fk.COLUMN_NAME} = ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`;
        }
    return `${baseQuery} FROM ${page}${joinClauses}`;
}