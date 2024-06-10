export function GetPrimaryKeyDictionary(sqlReturnValue)
{
    let primaryKeyDictionary = {};
    for (let i = 0; i < sqlReturnValue[0].length; i++)
        {
            let entry = sqlReturnValue[0][i];
            primaryKeyDictionary[entry.TABLE_NAME] = entry.COLUMN_NAME
        }

    return primaryKeyDictionary;
};

export function GetFKDictionary(entries, tableName, pkNameColumn, displayNameColumn)
{
    let optionsDictionary = {};
    const table = entries[tableName];

    for(let i = 0; i < table.length; i++)
        {
            const entry = table[i];
            optionsDictionary[entry[pkNameColumn]] = entry[displayNameColumn];
        }
    return optionsDictionary;   
}

export function GetPageTitle(title)
{
    const noUnderscores = title.replace(`_`, ` `);
    const words = noUnderscores.split(` `);
    const capitalizedWords = words.map(word => word[0].toUpperCase() + word.substring(1));
    const capitalizedPhrase = capitalizedWords.join(' ');
    return capitalizedPhrase;
}
