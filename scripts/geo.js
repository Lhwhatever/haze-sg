var DEG2RAD = Math.PI / 180;

sinSq = function (x) {
    var sine = Math.sin(x);
    return sine * sine;
}

reverseHaversine = function (lat1, long1, lat2, long2) {
    lat1 = lat1 * DEG2RAD;
    long1 = long1 * DEG2RAD;
    lat2 = lat2 * DEG2RAD;
    long2 = long2 * DEG2RAD;

    return 2 * Math.asin(Math.sqrt(sinSq((lat2 - lat1) / 2) +
        Math.cos(lat1) * Math.cos(lat2) * sinSq((long2 - long1) / 2)));
}

getNeighbour = function (regionMetadata, callback, error) {
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function (pos) {
        var lat = pos.coords.latitude;
        var long = pos.coords.longitude;

        console.log(regionMetadata);

        callback(regionMetadata.reduce(function (acc, curr) {
            var currDist = reverseHaversine(lat, long,
                curr.label_location.latitude, curr.label_location.longitude);
            if (acc.dist <= currDist) return acc;
            return { "label": curr.name, "dist": currDist };
        }, { "label": "error", "dist": 1000 }));
    });
    else if (error) error();
}