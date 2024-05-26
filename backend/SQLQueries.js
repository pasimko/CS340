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

export function GetPrimaryKeysQuery()
{
    return `SELECT TABLE_NAME, COLUMN_NAME
    FROM information_schema.KEY_COLUMN_USAGE 
    WHERE CONSTRAINT_NAME = 'PRIMARY'`;
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

export function GetPlantFKInformation()
{
    return `SELECT plant_id, name FROM \`plants\``;
}

export function GetActionTypeFKInformation()
{
    return `SELECT action_type_id, name FROM \`action_types\``;
}

export function GetLightCategoriesFKInformation()
{
    return `SELECT category_id, name FROM \`light_categories\``;
}

export function GetLocationFKInformation()
{
    return `SELECT location_id, name FROM \`locations\``;
}

export function GetSensorsFKInformation()
{
    return `SELECT sensor_id, name FROM \`sensors\``;
}
