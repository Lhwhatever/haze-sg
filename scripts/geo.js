var regionMetadata = {
    north: { lat: 1.41803, lng: 103.82 },
    south: { lat: 1.29587, lng: 103.82 },
    east: { lat: 1.35735, lng: 103.94 },
    west: { lat: 1.35735, lng: 103.7 },
    central: { lat: 1.35735, lng: 103.82 }
}

var DEG2RAD = Math.PI / 180;
var EARTH_RAD_IN_KM = 6371;

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

getLocation = function (callback, error) {
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(function (pos) {
            var lat = pos.coords.latitude;
            var lng = pos.coords.longitude;
            callback(lat, lng);
        });
    else if (error) error();
}

formatDist = function (distInKm) {
    if (distInKm < 1) return Math.round(distInKm * 100) * 10 + " m";
    return Number(distInKm).toFixed(1) + " km";
}

