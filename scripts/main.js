Vue.component('reading', {
    props: { read: Object, ind: String },
    template: '#reading-template',
    computed: {
        getClasses: function () {
            var classObj = {};
            classObj[indicators[this.ind].judge(this.read.value).class] = true;
            return classObj;
        }
    }
})

Vue.component('highlight', {
    props: { highlight: Object, location: Object },
    template: '#highlight-template',
    computed: {
        distance: function () {
            var selRegion = regionMetadata[this.highlight.zone];
            var dist = reverseHaversine(this.location.lat, this.location.lng, selRegion.lat, selRegion.lng);
            return formatDist(dist * EARTH_RAD_IN_KM);
        }
    }
})

Vue.component('indicator', {
    props: { indicator: Object, location: Object },
    template: '#indicator-template',
    data: function () {
        return { highlightId: 'central' };
    },
    computed: {
        timeString: function () {
            var dateString = "";
            var time = new Date(this.indicator.time);
            switch (getDayDiff(new Date(), time)) {
                case 0:
                    dateString = "today";
                    break;
                case 1:
                    dateString = "yesterday";
                    break;
                default:
                    dateString = formatDate(time)
                    break;
            }
            return dateString + ", " + formatTime(time);
        }
    }
})

tick = function (vm) {
    for (const indicator of Object.values(indicators))
        updateIndicators(vm, indicator);

    getLocation((lat, lng) => vm.location = { lat: lat, lng: lng }, () => vm.location = null);
}

window.app = new Vue({
    el: '#app',
    data: {
        indicators: indicators,
        location: null
    },
    created: function () {
        var vm = this;
        tick(vm)
        setInterval(() => tick(vm), 60000);
    }
})
