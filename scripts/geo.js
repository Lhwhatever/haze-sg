var regionMetadata = [
    { label: "north", latitude: 1.41803, longitude: 103.82 },
    { label: "south", latitude: 1.29587, longitude: 103.82 },
    { label: "east", latitude: 1.35735, longitude: 103.94 },
    { label: "west", latitude: 1.35735, longitude: 103.7 },
    { label: "central", latitude: 1.35735, longitude: 103.82 }
]

var regions = regionMetadata.map(element => element.label);

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

getNeighbour = function (callback, error) {
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function (pos) {
        var lat = pos.coords.latitude;
        var long = pos.coords.longitude;

        callback(regionMetadata.reduce(function (acc, curr) {
            var currDist = reverseHaversine(lat, long,
                curr.latitude, curr.longitude);
            if (acc.dist <= currDist) return acc;
            return { "label": curr.label, "dist": currDist };
        }, { "label": "error", "dist": 1000 }));
    });
    else if (error) error();
}