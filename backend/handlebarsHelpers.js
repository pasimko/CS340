export var formatDate = function (stringDate) 
{
    const jsDate = new Date(stringDate);
    return jsDate.toDateString();
}

export var formatDateTime = function(stringDateTime)
{
    const jsDate = new Date(stringDateTime);
    const date = jsDate.toDateString();
    const time = jsDate.toLocaleTimeString();
    return (date + " at " + time);
}