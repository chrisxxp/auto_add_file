$(function () {
    my.vue({
        data: function () {
            return {

            }
        },
        methods: {
            back: function () {
                H.$closeCurrentWin();
            },
            openWin: function (winName, data) {
                H.$openWin(winName, data);
            },
        },
        watch: {},
        ready: function () {
            var _this = this;
            /*必须初始化apiCloud*/
            H.ready(function () {
                //初始化
            });
        }
    });
});
