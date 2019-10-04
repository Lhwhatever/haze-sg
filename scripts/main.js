Vue.component('reading', {
    props: { read: Object },
    template: '#reading-template',
    computed: {
        getClasses: function () {
            var classObj = {};
            console.log(indicators[this.ind].judge(this.read.value).class);
            classObj[indicators[this.ind].judge(this.read.value).class] = true;
            return classObj;
        }
    }
})

Vue.component('indicator', {
    props: { indicator: Object },
    template: '#indicator-template'
})

tick = function (vm) {
    for (const indicator of Object.values(indicators))
        updateIndicators(vm, indicator);
}

window.app = new Vue({
    el: '#app',
    data: {
        indicators: indicators
    },
    created: function () {
        var vm = this;
        tick(vm)
        setInterval(() => tick(vm), 60000);
    }
})
