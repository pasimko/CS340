
// Data is returned in the following format:
// [
    //  [
    //    {
    //      COLUMN_NAME: 'category_id',
    //      COLUMN_TYPE: 'int',
    //      COLUMN_KEY: 'PRI'
    //    },
    //    {
    //      COLUMN_NAME: 'name',
    //      COLUMN_TYPE: 'varchar(45)',
    //      COLUMN_KEY: 'UNI'
    //    }
    //  ],
    //  [
    //    `COLUMN_NAME` VARCHAR(64),
    //    `COLUMN_TYPE` MEDIUMTEXT NOT NULL,
    //    `COLUMN_KEY` STRING(12) NOT NULL ENUM
    //  ]
    //]
    //
    //
//We instead want it to be in this format for ease of access:
// {
//  category_id: {COLUMN_TYPE: 'int'
//                COLUMN_KEY: 'PRI'}
//  name:        {COLUMN_TYPE: 'varchar(45)'
//                COLUMN_KEY: 'UNI'}
// }
export function FormatMetadataInformation(dataTables)
{
    const returnData = {};

    for (let i = 0; i < dataTables[0].length; i++)
    {
        const columnInfo = dataTables[0][i];
        returnData[columnInfo['COLUMN_NAME']] = columnInfo;
    }
    return returnData;
};

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

export function GetPlantsFKDictionary(options)
{
    let optionsDictionary = {};
    for (let i = 0; i < options[0].length; i++)
    {
        const entry = options[0][i];
        optionsDictionary[entry.plant_id] = entry.name;
    }
    return optionsDictionary;
}

export function GetSensorsFKDictionary(options)
{
    let optionsDictionary = {};
    for (let i = 0; i < options[0].length; i++)
    {
        const entry = options[0][i];
        optionsDictionary[entry.sensor_id] = entry.name;
    }
    return optionsDictionary;
}

export function GetActionsFKDictionary(options)
{
    let optionsDictionary = {};
    for (let i = 0; i < options[0].length; i++)
    {
        const entry = options[0][i];
        optionsDictionary[entry.action_id] = entry.name;
    }
    return optionsDictionary;
}

export function GetActionTypesFKDictionary(options)
{
    let optionsDictionary = {};
    for (let i = 0; i < options[0].length; i++)
    {
        const entry = options[0][i];
        optionsDictionary[entry.action_type_id] = entry.name;
    }
    return optionsDictionary;
}

export function GetLocationsFKDictionary(options)
{
    let optionsDictionary = {};
    for (let i = 0; i < options[0].length; i++)
    {
        const entry = options[0][i];
        optionsDictionary[entry.location_id] = entry.name;
    }
    return optionsDictionary;
}

export function GetLightCategoriesFKDictionary(options)
{
    let optionsDictionary = {};
    for (let i = 0; i < options[0].length; i++)
    {
        const entry = options[0][i];
        optionsDictionary[entry.category_id] = entry.name;
    }
    return optionsDictionary;
}