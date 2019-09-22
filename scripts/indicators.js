
var pm25bands = [
    { "max": 55, "band": "I", "descriptor": "Normal" },
    { "max": 150, "band": "II", "descriptor": "Elevated", "class": "elevated" },
    { "max": 249, "band": "III", "descriptor": "High", "class": "high" },
    { "band": "IV", "descriptor": "Very High", "class": "v_high" },
];

var pm25Classes = "normal elevated high v_high";

judgePM25 = function (pm25) {

    for (var i = 0, size = pm25bands.length; i < size; ++i) {
        var band = pm25bands[i];
        if (!band.max || pm25 <= band.max) return band;
    }

}

var psiBands = [
    { "max": 50, "descriptor": "Good", "class": "good" },
    { "max": 100, "descriptor": "Moderate", "class": "moderate" },
    { "max": 200, "descriptor": "Unhealthy", "class": "unhealthy" },
    { "max": 300, "descriptor": "Very Unhealthy", "class": "v_unhealthy" },
    { "descriptor": "Hazardous", "class": "hazardous" },
];

var psiClasses = "good moderate unhealthy v_unhealthy hazardous";

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
        "judge": judgePM25,
        "key": "pm25_one_hourly",
        "url": "https://api.data.gov.sg/v1/environment/pm25",
        "classes": pm25Classes,
        "data": {}
    },
    {
        "label": "psi_24h",
        "title": "PSI",
        "subtitle": "(24-hour average)",
        "judge": judgePSI,
        "key": "psi_twenty_four_hourly",
        "url": "https://api.data.gov.sg/v1/environment/psi",
        "classes": psiClasses,
        "data": {}
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

            regions.forEach(region => {
                $("#indicators #" + indicator.label + " .reading-grp.region-" + region).click(function () {
                    if (highlight[indicator.label] == region) {
                        highlight.unset(indicator.label);
                    } else highlight.set(indicator.label, region);
                    populateData(indicator);
                });
            });
        });
    }, "html")
}
