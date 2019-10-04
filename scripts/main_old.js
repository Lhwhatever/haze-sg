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

/*
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
*/