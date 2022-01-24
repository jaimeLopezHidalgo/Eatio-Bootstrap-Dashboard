(function ($) {
    /* "use strict" */

    //VARIABLES
    const xAxisHours = ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

    //FUNCIONES
    function getGraphSettings(xData, yData, yUnits, yContext, color) {
        var mySettings = {
            series: [
                {
                    name: yContext,
                    data: yData,
                    //radius: 12,	
                },
            ],
            chart: {
                type: 'area',
                height: 350,
                toolbar: {
                    show: false,
                },

            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                },
            },
            colors: [color],
            dataLabels: {
                enabled: false,
            },
            markers: {
                shape: "circle",
            },


            legend: {
                show: false,
            },
            stroke: {
                show: true,
                width: 4,
                colors: [color],
            },

            grid: {
                borderColor: '#eee',
            },
            xaxis: {

                categories: xData,
                labels: {
                    style: {
                        colors: '#3e4954',
                        fontSize: '13px',
                        fontFamily: 'Poppins',
                        fontWeight: 100,
                        cssClass: 'apexcharts-xaxis-label',
                    },
                },
                crosshairs: {
                    show: false,
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#3e4954',
                        fontSize: '13px',
                        fontFamily: 'Poppins',
                        fontWeight: 100,
                        cssClass: 'apexcharts-xaxis-label',
                    },
                },
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val + " " + yUnits;
                    }
                }
            }
        };

        return mySettings;
    }


    var dzChartlist = function () {

        var screenWidth = $(window).width();

        var chartBar = function () {
            
            // Tiempo que tardan en entregar la comida para los clientes 
            var timeVsHourChart = new ApexCharts(document.querySelector(".timeVsHourChart"), getGraphSettings(xAxisHours, [50, 70, 40, 80, 30, 60, 100], 'min', 'Duración', '#2f4cdd'));
            timeVsHourChart.render();

            // Ventas
            var salesVsHourChart = new ApexCharts(document.querySelector("#salesVsHourChart"), getGraphSettings(xAxisHours, [500, 600, 400, 1000, 300, 700, 800], 'MXN', 'Ingresos', '#ff57cf'));
            salesVsHourChart.render();

            // Órdenes
            var ordersPerHourChart = new ApexCharts(document.querySelector("#ordersPerHourChart"), getGraphSettings(xAxisHours, [3, 4, 2, 3, 4, 10, 1], '', 'Ordenes', '#8fff57'));
            ordersPerHourChart.render();

            // Productos por orden
            var productsPerOrderChart = new ApexCharts(document.querySelector("#productsPerOrderChart"), getGraphSettings(xAxisHours, [1, 1, 4, 3, 2, 4, 3], '', 'Productos', '#2f4cdd'));
            productsPerOrderChart.render();

            // Ticket Promedio
            var productsPerOrderChart = new ApexCharts(document.querySelector("#orderPriceChart"), getGraphSettings(xAxisHours, [80, 70, 120, 180, 302, 50, 30], 'MXN', 'Precio', '#ff57cf'));
            productsPerOrderChart.render();
        }



        var counterBar = function () {
            $(".counter").counterUp({
                delay: 30,
                time: 3000
            });
        }
        var peitySuccess = function () {
            $(".peity-success").peity("line", {
                fill: ["rgba(48, 194, 89, .2)"],
                stroke: '#30c259',
                strokeWidth: '3',
                width: "47",
                height: "30"
            });
        }
        var peityDanger = function () {
            $(".peity-danger").peity("line", {
                fill: ["rgba(248, 79, 78, .2)"],
                stroke: '#f84f4e',
                strokeWidth: '3',
                width: "47",
                height: "30"
            });
        }

        /* Function ============ */
        return {
            init: function () {
            },


            load: function () {
                chartBar();
                counterBar();
                peitySuccess();
                peityDanger();
            },

            resize: function () {

            }
        }

    }();

    jQuery(document).ready(function () {
    });

    jQuery(window).on('load', function () {
        setTimeout(function () {
            dzChartlist.load();
        }, 1000);

    });

    jQuery(window).on('resize', function () {


    });

})(jQuery);