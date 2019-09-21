var pm25bands = [
    { "max": 55, "band": "I", "descriptor": "Normal" },
    { "max": 150, "band": "II", "descriptor": "Elevated" },
    { "max": 249, "band": "III", "descriptor": "High" },
    { "band": "IV", "descriptor": "Very High" },
];

judgePM25 = function (pm25) {

    for (var i = 0, size = pm25bands.length; i < size; ++i) {
        var band = pm25bands[i];
        if (!band.max || pm25 <= band.max) return band;
    }

}