var highlight = {
    "nearest": "",
    "pm25_1h": "",
    "psi_24h": "",
    "get": function (indicator) {
        if (this[indicator]) return this[indicator];

        if (this.nearest) return this.nearest;
        if (indicator == 'pm25_1h') return "central";
        else return "national";
    },
    "set": function (indicator, newValue) {
        this[indicator] = newValue;
    },
    "unset": function (indicator) {
        this[indicator] = "";
    }
}

var lastUpdate;

$(document).ready(function () {
    console.log("started!");
    populateIndicators();
    lastUpdate = new Date(0);
    tick();
    setInterval(tick, 60000);
});

formatDate = function (date) {
    return date.getFullYear() + '-'
        + (date.getMonth() + 1).toString().padStart(2, '0') + '-'
        + date.getDate().toString().padStart(2, '0') + 'T'
        + date.getHours().toString().padStart(2, '0') + ':'
        + date.getMinutes().toString().padStart(2, '0') + ':'
        + date.getSeconds().toString().padStart(2, '0');
}

formatDistance = function (distInKm) {
    if (distInKm < 1) return Math.round(distInKm * 1000) + " m";
    return Math.round(distInKm * 10) / 10 + " km";
}

tick = function () {
    var now = new Date();
    indicators.forEach(indicator => loadData(indicator, now));

    getNeighbour(region => {
        highlight.set("nearest", region.label);
        $("#location-nearest").attr(
            "placeholder",
            region.label.charAt(0).toUpperCase() + region.label.slice(1)
            + " (" + formatDistance(region.dist * 6371) + " away)"
        );
    })
}

loadData = function (indicator, date) {
    $.get(indicator.url, { "datetime": formatDate(date) },
        (data, status, jqXHR) => {
            indicator.data = data;
            populateData(indicator)
        },
        "json"
    );
}

formatStr = function (str, formats) {
    Object.entries(formats).forEach(entry => {
        str = str.replace(new RegExp("{{ " + entry[0] + " }}", "g"), entry[1]);
    })
    return str;
}

populateData = function (indicator) {
    var data = indicator.data;
    var sel = "#indicators #" + indicator.label;

    $(sel + " .time-descr > .time").text(new Date(data.items[0].timestamp).toLocaleString("en-SG"));

    regions.forEach(region => {
        var regionDivSel = sel + " .region-" + region;
        var reading = data.items[0].readings[indicator.key][region];
        var band = indicator.judge(reading);
        $(regionDivSel + " .reading").text(reading)
            .removeClass(indicator.classes).addClass(band.class);
        $(regionDivSel + " .band").text(band.descriptor)
            .removeClass(indicator.classes).addClass(band.class);
    });

    var hlRegion = highlight.get(indicator.label);
    var hlReading = data.items[0].readings[indicator.key][hlRegion];
    var hlBand = indicator.judge(hlReading);

    $(sel + " .highlight .reading").text(hlReading)
        .removeClass(indicator.classes).addClass(hlBand.class);
    $(sel + " .highlight .region").text(hlRegion);
    $(sel + " .highlight .band").text(indicator.judge(hlReading).descriptor)
        .removeClass(indicator.classes).addClass(hlBand.class);

    $(".card#" + indicator.label)
        .removeClass(indicator.classes).addClass(hlBand.class);

    lastUpdate = Math.max(lastUpdate, new Date(data.items[0].update_timestamp));
    $(".time-descr.last-update > .time").text(new Date(lastUpdate).toLocaleString("en-SG"));
}
