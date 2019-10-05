var listOfMMMs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];

getDate = function (datetime) {
    datetime = new Date(datetime);
    datetime.setHours(0, 0, 0, 0);
    return datetime;
}

getDayDiff = function (dateA, dateB) {
    return (getDate(dateA) - getDate(dateB)) / 86400000;
}

getOrdinal = function (num) {
    num = num % 100;
    if (num > 10 && num < 13) return num.toString() + 'th';
    switch (num % 10) {
        case 1:
            return num.toString() + 'st';
        case 2:
            return num.toString() + 'nd';
        case 3:
            return num.toString() + 'rd';
        default:
            return num.toString() + 'th';
    }
}

formatDate = function (datetime) {
    return getOrdinal(datetime.getDay()) + ' '
        + listOfMMMs[datetime.getMonth()] + ' '
        + datetime.getFullYear();
}

formatTime = function (datetime) {
    return datetime.getHours().toString().padStart(2, '0') + ':'
        + datetime.getMinutes().toString().padStart(2, '0');
}