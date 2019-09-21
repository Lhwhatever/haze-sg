$(document).ready(function () {
    console.log("started!");
    loadData();
});

loadData = function () {
    var j1 = $.ajax("https://api.data.gov.sg/v1/environment/psi", {
        "dataType": "json",
        "data": {
            "date": "2019-09-21"
        }
    });

    var j2 = $.ajax("https://api.data.gov.sg/v1/environment/pm25", {
        "dataType": "json",
        "data": {
            "date": "2019-09-21"
        }
    });

    $.when(j1, j2).then(function (a1, a2) {
        populateTables(a1[2].responseJSON, a2[2].responseJSON)
    }, function (jqXHR, status, error) {
        var x1 = j1;
        var x2 = j2;
        if (x1.readyState != 4) x1.abort();
        if (x2.readyState != 4) x2.abort();
        console.log("Failed to load data");
    })
}

populateTables = function (dataPSI, dataPM25) {
    var regionMetadata = dataPSI.region_metadata.filter(e => e.name != "national");
    getNeighbour(regionMetadata);

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
    console.log(data);

    $("#data-tables > #data-west").load("templates/datatable.html", function (response, status, jqXHR) {

        data.reverse().forEach(element => {
            $('<th scope="col">' + element.timestamp.getHours() + ':00</th>')
                .appendTo("#data-west > table > thead > tr");
            $('<td>' + element.psi_24h.west + '</td>')
                .appendTo("#data-west > table > tbody > .psi-24");
            $('<td>' + element.pm25_1h.west + " (" + judgePM25(element.pm25_1h.west).band + ')</td>')
                .appendTo("#data-west > table > tbody > .pm25");
        });


    });
}