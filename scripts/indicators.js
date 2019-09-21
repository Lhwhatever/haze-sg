
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

var psiBands = [
    { "max": 50, "descriptor": "Normal" },
    { "max": 100, "descriptor": "Moderate" },
    { "max": 200, "descriptor": "Unhealthy" },
    { "max": 300, "descriptor": "Very Unhealthy" },
    { "descriptor": "Hazardous" },
];

judgePSI = function (psi) {

    for (var i = 0, size = psiBands.length; i < size; ++i) {
        var band = psiBands[i];
        if (!band.max || psi <= band.max) return band;
    }

}

var indicators = [
    {
        "label": "pm25_1h",
        "title": "PM<sub>2.5</sub>",
        "subtitle": "(1-hour average)",
        "judge": judgePM25
    },
    {
        "label": "psi_24h",
        "title": "PSI",
        "subtitle": "(24-hour average)",
        "judge": judgePSI
    }
];

populateIndicators = function () {
    $.get("templates/indicator.html", (html, status, jqXHR) => {
        indicators.forEach(indicator => {
            $(formatStr(html, {
                "indicator": indicator.label,
                "title": indicator.title,
                "subtitle": indicator.subtitle
            })).appendTo("#indicators");
        });
    }, "html")
}
