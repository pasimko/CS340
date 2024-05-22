
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
            console.log(entry);
            primaryKeyDictionary[entry.TABLE_NAME] = entry.COLUMN_NAME
        }

    return primaryKeyDictionary;
};