
var pm25bands = [
    { "max": 55, "band": "I", "descriptor": "Normal" },
    { "max": 150, "band": "II", "descriptor": "Elevated", "class": "elevated" },
    { "max": 249, "band": "III", "descriptor": "High", "class": "high" },
    { "band": "IV", "descriptor": "Very High", "class": "v_high" },
]

judgePM25 = (pm25) => {
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
]

judgePSI = (psi) => {
    for (var i = 0, size = psiBands.length; i < size; ++i) {
        var band = psiBands[i];
        if (!band.max || psi <= band.max) return band;
    }
}

var getDefaultDataUnitObj = () => {
    return { value: '...', band: 'loading', classes: {} }
}

var getDefaultDataObj = () => {
    return {
        north: getDefaultDataUnitObj(),
        south: getDefaultDataUnitObj(),
        central: getDefaultDataUnitObj(),
        east: getDefaultDataUnitObj(),
        west: getDefaultDataUnitObj(),
        national: getDefaultDataUnitObj()
    }
};

var indicators = {
    pm25_1h: {
        title: 'PM<sub>2.5</sub>',
        subtitle: '(1-hour average)',
        url: 'https://api.data.gov.sg/v1/environment/pm25',
        key: 'pm25_one_hourly',
        time: Date(0),
        judge: judgePM25,
        data: getDefaultDataObj(),
        getData: function (zone) {
            var obj = this.data[zone];
            obj.zone = zone;
            return obj;
        }
    },
    psi_24h: {
        title: "PSI",
        subtitle: '(24-hour average)',
        url: 'https://api.data.gov.sg/v1/environment/psi',
        key: 'psi_twenty_four_hourly',
        time: Date(0),
        judge: judgePSI,
        data: getDefaultDataObj(),
        getData: function (zone) {
            var obj = this.data[zone];
            obj.zone = zone;
            return obj;
        }

    }
}

for (const key of Object.keys(indicators)) indicators[key].id = key;

updateIndicators = function (vm, ind) {
    axios.get(ind.url, {
        responseType: 'json',
        timeout: 5000
    }).then(function (response) {
        var indicator = vm.indicators[ind.id];
        var items = response.data.items;

        indicator.time = items[0].timestamp;

        for (const [zone, value] of Object.entries(items[0].readings[ind.key])) {
            indicator.data[zone].value = value;

            var band = indicator.judge(value);
            indicator.data[zone].band = band.descriptor;

            var classObj = {};
            if (band.class) classObj[band.class] = true;
            indicator.data[zone].classes = classObj;
        }
    });
}