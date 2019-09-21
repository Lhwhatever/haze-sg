$(document).ready(function () {
    console.log("started!");
    populateIndicators();
    loadData();
});

formatDate = function (date) {
    return date.getFullYear() + '-'
        + (date.getMonth() + 1).toString().padStart(2, '0') + '-'
        + date.getDate().toString().padStart(2, '0') + 'T'
        + date.getHours().toString().padStart(2, '0') + ':'
        + date.getMinutes().toString().padStart(2, '0') + ':'
        + date.getSeconds().toString().padStart(2, '0');
}

loadData = function (date) {

    var options = {
        "dataType": "json",
        "data": {
            "datetime": formatDate(new Date())
        }
    }

    var j1 = $.ajax("https://api.data.gov.sg/v1/environment/psi", options);
    var j2 = $.ajax("https://api.data.gov.sg/v1/environment/pm25", options);

    $.when(j1, j2).then(function (a1, a2) {
        populateData(a1[2].responseJSON, a2[2].responseJSON)
    }, function (jqXHR, status, error) {
        var x1 = j1;
        var x2 = j2;
        if (x1.readyState != 4) x1.abort();
        if (x2.readyState != 4) x2.abort();
        console.log("Failed to load data");
    })
}

formatStr = function (str, formats) {
    Object.entries(formats).forEach(entry => {
        str = str.replace(new RegExp("{{ " + entry[0] + " }}", "g"), entry[1]);
    })
    return str;
}

populateData = function (dataPSI, dataPM25) {
    var regionMetadata = dataPSI.region_metadata.filter(e => e.name != "national");

    var data = dataPSI.items.map(function (psi, i) {
        var pm25 = dataPM25.items[i];

        var udts1 = new Date(psi.update_timestamp).getTime();
        var udts2 = new Date(pm25.update_timestamp).getTime();

        return {
            "timestamp": new Date(psi.timestamp),
            "update_timestamp": new Date(Math.max(udts1, udts2)),
            "psi_24h": psi.readings.psi_twenty_four_hourly,
            "pm25_1h": pm25.readings.pm25_one_hourly
        };
    });

    indicators.forEach(indicator => {
        var sel = ".card#" + indicator.label;
        var html = $(sel).html();

        var readingHL = data[0][indicator.label].central;
        html = formatStr(html, {
            "highlight.reading": readingHL,
            "highlight.label": "Central",
            "highlight.band": judgePM25(readingHL).descriptor
        });

        regionsL.forEach(region => {
            var reading = data[0][indicator.label][region];
            var formats = {};
            formats[region + ".reading"] = reading;
            formats[region + ".band"] = indicator.judge(reading).descriptor;
            html = formatStr(html, formats);
        })

        $(sel).html(html);
    });
}