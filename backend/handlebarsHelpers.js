export var formatDate = function (stringDate) 
{
    const jsDate = new Date(stringDate);
    return jsDate.toLocaleDateString();
}

export var formatDateTime = function(stringDateTime)
{
    const jsDate = new Date(stringDateTime);
    const date = jsDate.toLocaleDateString();
    const time = jsDate.toLocaleTimeString();
    return (date + " at " + time);
}