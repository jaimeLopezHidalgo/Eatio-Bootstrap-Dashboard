(function ($) {
    //VARIABLES
    // var ordersTable = $('#ordersTable').DataTable({
    //         // "scrollY": "42vh",
    //         // "scrollCollapse": true,
    //         "paging": false,
    //         "info": true
    //     });
    var ordersTable;
    var nextID = 0;
    // let secondsToCook = 900; //15 minutos
    var deadlineUpdateTimeout;
    let deadlineUpdateSeconds = 5;
    let secondsToCook = 3600;
    var stopwatchTimeout;
    var stopwatchRow;

    let people = [
        "Joaquín Olmos", "Alexis Sahagún", "Jaime López-Hidalgo", "León"
    ];

    let checkboxTD = "<td class=\"checkboxTD\"><div class=\"custom-control custom-checkbox ml-2\"><input type=\"checkbox\" class=\"custom-control-input\" id=\"";

    let badges = [
        ["badge-danger", "badge-warning", "badge-success"],
        ["pendiente", "cocinando", "lista"]
    ];

    let paymentStatusIcons = [
        "<i class=\"fa fa-check text-success mr-1\"></i>", "<i class=\"flaticon-381-clock text-warning mr-1\"></i>"
    ]

    let deadlineIcons = [
        "<i class=\"deadlineIcon flaticon-381-stopwatch text-success mr-1\"></i>",
        "<i class=\"deadlineIcon flaticon-381-stopwatch text-warning mr-1\"></i>",
        "<i class=\"deadlineIcon flaticon-381-stopwatch text-danger mr-1\"></i>",
        "<i class=\"deadlineIcon flaticon-381-warning-1 text-danger mr-1\"></i>"
    ];

    let stopwatchElements = [
        [
            "<span class=\"badge badge-xl light badge-success fs-16\"><\/span>", "<span class=\"badge badge-xl light badge-warning fs-16\"><\/span>",
            "<span class=\"badge badge-xl light badge-danger fs-16\"><\/span>",
            "<span class=\"badge badge-xl badge-danger fs-16\"><\/span>"
        ],
        [
            "<span id=\"stopwatchDescription\">sin prisa<\/span>",
            "<span id=\"stopwatchDescription\">a tiempo<\/span>",
            "<span id=\"stopwatchDescription\">justo<\/span>",
            "<span id=\"stopwatchDescription\">tarde<\/span>",
        ]
    ];

    //FUNCIONES

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function getRandomHour() {
        var hour = getRandomInt(0, 24).toString();
        if (parseInt(hour) < 10) {
            hour = "0" + hour;
        }
        var minute = getRandomInt(0, 60).toString();
        if (parseInt(minute) < 10) {
            minute = "0" + minute;
        }
        return hour + ":" + minute;
    }

    function getCurrentTime() {
        let today = new Date();

        var minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        var seconds = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();

        return today.getHours() + ":" + minutes + ":" + seconds;
    }

    function hmsToSeconds(hms) {
        var seconds = 0;
        let array = hms.split(':');
        var val = 3600;

        array.forEach((timeUnit) => {
            seconds += parseInt(timeUnit) * val;
            val /= 60;
        });

        return seconds;
    }

    function secondsToHMS(seconds_) {
        var val = seconds_ / 3600;
        let hours = Math.floor(val);
        val = (val - hours) * 60;
        let minutes = Math.floor(val);
        val = (val - minutes) * 60;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        let seconds = Math.round(val);
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return hours + ":" + minutes + ":" + seconds;
    }

    function getLimitTime(secondSpan) {
        return secondsToHMS(hmsToSeconds(getCurrentTime()) + parseInt(secondSpan));
    }

    function getRandomPrice() {
        var cents = getRandomInt(0, 100).toString();
        if (parseInt(cents) < 10) {
            cents = "0" + cents;
        }
        return "$" + getRandomInt(10, 501).toString() + "." + cents;
    }

    function clearOldData() {
        $('#ordersTable tbody').html("");
    }

    function getRandomRow(i) {
        var htmlRow = "<tr class=\"clickable\">";
        var badgeInd;
        var ind;
        var stageTD;
        var fullTime;

        //checkbox
        badgeInd = getRandomInt(0, badges[0].length);
        if (badgeInd < badges[0].length - 1) {
            htmlRow += checkboxTD + (i + 1).toString() + "\" required=\"\"><label class=\"custom-control-label\" for=\"" + (i + 1).toString() + "\"><\/label><\/div><\/td>";
        } else {
            htmlRow += checkboxTD + (i + 1).toString() + "\" disabled><label class=\"custom-control-label\" for=\"" + (i + 1).toString() + "\"><\/label><\/div><\/td>";
        }

        //etapa
        stageTD = "<td data-order=\"" + badgeInd + "\"><span class=\"badge badge-xl light " + badges[0][badgeInd] + "\" fs-16\">" + badges[1][badgeInd] + "<\/span><\/td>";
        htmlRow += stageTD;

        //orden
        htmlRow += ("<td class=\"orderNumber\">" + (i + 1).toString() + "<\/td>");

        //monto
        ind = getRandomInt(0, paymentStatusIcons.length)
        htmlRow += ("<td class=\"amount\">" + "<div class=\"d-flex align-items-center\">" + paymentStatusIcons[ind] + getRandomPrice() + "<\/div><\/td>");

        //hora
        fullTime = getCurrentTime().split(':');
        htmlRow += ("<td class=\"startTime\" seconds=\"" + fullTime[2] + "\">" + fullTime[0] + ":" + fullTime[1] + "<\/td>");

        //límite
        fullTime = getLimitTime(secondsToCook).split(':');
        if (badgeInd < badges[0].length - 1) {
            htmlRow += ("<td class=\"endTime\" seconds=\"" + fullTime[2] + "\">" + deadlineIcons[0] + fullTime[0] + ":" + fullTime[1] + "<\/td>");
        } else {
            htmlRow += ("<td class=\"endTime\" seconds=\"" + fullTime[2] + "\">" + paymentStatusIcons[0] + fullTime[0] + ":" + fullTime[1] + "<\/td>");
        }

        //cliente
        ind = getRandomInt(0, people.length);
        htmlRow += ("<td class=\"customer\">" + people[ind] + "<\/td>");

        htmlRow += "<\/tr>"
        return htmlRow;
    }

    function loadData(entries) {
        var htmlTBody = "";
        for (let i = 0; i < entries; i++) {
            htmlTBody += (getRandomRow(i));
        }
        $('#ordersTable tbody').append(htmlTBody);
        ordersTable = $('#ordersTable').DataTable({
            // "scrollY": "42vh",
            // "scrollCollapse": true,
            "paging": false,
            "info": true
        });
        nextID = getGreatestID() + 1;
        updateDeadlineIcons();
    }


    function getGreatestID() {
        var max = 0;
        $('#ordersTable tbody tr').each(function () {
            orderNumber = $(this).find(".orderNumber").text();
            if (parseInt(orderNumber) > max) {
                max = parseInt(orderNumber);
            }
        });
        return max;
    }

    function getCheckedRows() {
        return $('#ordersTable tbody').find('tr').has('input[type=checkbox]:checked');
    }

    function manageButtonVisibility() {
        var checkedRows = getCheckedRows();
        if (checkedRows.length > 0) {
            $('#nextStageButton').removeAttr("hidden");
        } else {
            $('#nextStageButton').attr("hidden", "hidden");
        }
    }

    function updateDataTable(rows) {
        rows.each(function () {
            ordersTable.row($(this)).invalidate('dom');
        });
    }

    function incrementBadge(badge) {
        ind = 0;
        isLastBadge = false;
        if (!badge.hasClass(badges[0][(badges[0].length) - 1])) {
            var parentTD = badge.closest('td');
            for (let i = 0; i < badges.length; i++) {
                if (badge.hasClass(badges[0][i])) {
                    ind = i;
                    break;
                }
            }
            badge.removeClass(badges[0][ind]);
            badge.addClass(badges[0][ind + 1]);
            badge.text(badges[1][ind + 1]);
            parentTD.attr('data-order', ind + 1);
            if (ind == badges[0].length - 2) {
                isLastBadge = true;
            }
        }

        return isLastBadge;
    }

    function incrementRowBadge(rows) {
        var checkbox;
        var endTimeTD;
        rows.each(function () {
            checkbox = $(this).find(':input[type="checkbox"]');
            checkbox.prop('checked', false);
            if (incrementBadge($(this).find(".badge"))) {
                checkbox.attr("disabled", "disabled");
                endTimeTD = $(this).find(".endTime");
                endTimeTD.find('.deadlineIcon').remove();
                endTimeTD.prepend(paymentStatusIcons[0]);
            }
        });
        updateDataTable(rows);
    }

    function getRemainingTimeAndIndex(row) {
        var endTimeTD;
        var endTimeSecods;
        var currentTimeSeconds;
        var secondsLeft;
        var ind = 3;
        endTimeTD = row.find('.endTime');
        endTimeSecods = hmsToSeconds(endTimeTD.text()) + parseInt(endTimeTD.attr("seconds"));
        currentTimeSeconds = hmsToSeconds(getCurrentTime());
        secondsLeft = endTimeSecods - currentTimeSeconds;

        if (secondsLeft > secondsToCook * 2 / 3) {
            ind = 0;
        } else if (secondsLeft > secondsToCook / 3) {
            ind = 1;
        } else if (secondsLeft > 0) {
            ind = 2;
        }

        return [secondsToHMS(secondsLeft), ind];
    }

    function updateDeadlineIcons() {
        console.log("updating... ");
        let rows = ($('#ordersTable tbody').find(".deadlineIcon").not(".flaticon-381-warning-1")).closest('tr');
        var deadlineIcon;
        var parentTD;
        var time_index;

        rows.each(function () {
            deadlineIcon = $(this).find('.deadlineIcon');
            time_index = getRemainingTimeAndIndex($(this));
            let ind = time_index[1];
            parentTD = deadlineIcon.closest('td');
            deadlineIcon.remove();
            parentTD.prepend(deadlineIcons[ind]);
            updateDataTable(rows);
        });
        if (rows.length > 0) {
            deadlineUpdateTimeout = setTimeout(updateDeadlineIcons, 1000 * deadlineUpdateSeconds);
        } else {
            clearTimeout(deadlineUpdateTimeout);
            deadlineUpdateTimeout = false;
        }
    }

    function fillOrderModal(row) {
        var customerName = row.find(".customer").text();
        var orderNumber = row.find(".orderNumber").text();
        var modal = $('#orderModal');
        modal.find(".modal-title").text("Órden #" + orderNumber + " (" + customerName + ")");
        var modalFooterButtonContainer = modal.find("#modalFooterButtonContainer");
        var badge = row.find(".badge");
        var prevModalBadge = modalFooterButtonContainer.find(".badge");
        if (prevModalBadge[0]) {
            prevModalBadge.remove();
        }
        var newModalBadge = badge.clone();
        modalFooterButtonContainer.prepend(newModalBadge);
        var nextStageButton = $('#nextStageButton2');
        nextStageButton.off('click');
        if (newModalBadge.hasClass(badges[0][(badges[0].length) - 1])) {
            nextStageButton.attr("hidden", "hidden");
        } else {
            nextStageButton.removeAttr("hidden");
        }
    }

    function showStopwatch() {
        let stopwatchContainer = $('#modalFooterStopwtachContainer');
        var time_index;
        var badge;
        var description;
        var ind;
        var timesUp = false;
        var timeToDisplay;

        stopwatchContainer.find(".badge").remove();
        stopwatchContainer.find("#stopwatchDescription").remove();

        time_index = getRemainingTimeAndIndex(stopwatchRow);
        ind = time_index[1];
        timeToDisplay = time_index[0];
        if (ind == stopwatchElements[0].length - 1) {
            timesUp = true;
            timeToDisplay = "00:00:00";
        }
        badge = $(stopwatchElements[0][ind]);
        badge.text(timeToDisplay);
        stopwatchContainer.append(badge);
        description = $(stopwatchElements[1][ind]);
        stopwatchContainer.append(description);

        if (!timesUp) {
            stopwatchTimeout = setTimeout(showStopwatch, 1000);
        } else {
            clearTimeout(stopwatchTimeout);
        }
    }

    //JQUERY

    $('#swagButton').on('click', function () {
        ordersTable.row.add($(getRandomRow(nextID - 1))).draw();
        ordersTable.columns.adjust();
        nextID += 1;
        if (deadlineUpdateTimeout == false) {
            updateDeadlineIcons();
        }
    });

    // $('#swagButton').on('click', function () {
    //     loadData(1);
    // });

    //Prevenir que click en checkbox active modal
    $('#ordersTable tbody').on('click', 'td .custom-checkbox', function (e) {
        e.stopPropagation();
    });

    //checkbox master
    $('#checkAll').on('change', function () {
        var rows = $('#ordersTable tbody tr');
        var checkboxes = rows.find(':input[type="checkbox"]').not(":disabled");
        if (checkboxes.length > 0) {
            checkboxes.prop('checked', $(this).prop("checked"));
            checkboxes.attr('data-order', $(this).prop("checked") ? 1 : 0);

        } else {
            $(this).prop('checked', false);
        }
        updateDataTable(rows);
    });

    //al hacer click en checkbox
    $('#ordersTable').on('change', ':input[type="checkbox"]', function () {
        manageButtonVisibility();
    });

    //avanzar etapa desde tabla
    $('#nextStageButton').on('click', function () {
        incrementRowBadge(getCheckedRows());
        $(this).attr("hidden", "hidden");
        $('#checkAll').prop('checked', false);
    });

    //al cerrar el modal
    $('#orderModal').on('hidden.bs.modal', function () {
        clearTimeout(stopwatchTimeout);
    });

    //activar modal con click en renglón
    $('#ordersTable tbody').on('click', 'tr', function () {
        var row = $(this);
        var modalBadge;
        var stopwatchContainer;

        row.attr('data-toggle', 'modal');
        row.attr('data-target', '.bd-example-modal-lg');

        //llenar info de modal
        fillOrderModal(row);
        modalBadge = $('#modalFooterButtonContainer .badge');

        //manejar stopwatch
        if (!modalBadge.hasClass("badge-success")) {
            stopwatchRow = row;
            stopwatchTimeout = showStopwatch();
        } else {
            let stopwatchContainer = $('#modalFooterStopwtachContainer');
            stopwatchContainer.find(".badge").remove();
            stopwatchContainer.find("#stopwatchDescription").remove();
            clearTimeout(stopwatchTimeout);
        }

        //avanzar etapa
        $('#nextStageButton2').on('click', function () {
            incrementRowBadge(row);
            if (incrementBadge(modalBadge)) {
                $(this).attr("hidden", "hidden");
                clearTimeout(stopwatchTimeout);
                stopwatchContainer = $('#modalFooterStopwtachContainer');
                stopwatchContainer.find('.badge').remove();
                stopwatchContainer.find('#stopwatchDescription').remove();
            }
            updateDataTable(row);
        });
    });

    //activar checkboxes desde el td
    $('#ordersTable').on('click', '.checkboxTD', function (e) {
        e.stopPropagation();
        var checkbox = $(this).find('input[type=checkbox]').not(':disabled');
        checkbox.prop('checked', !checkbox.prop('checked'));
        manageButtonVisibility();
    });

    //MAIN CODE:
    $(document).ready(function () {
        loadData(15);
    });


})(jQuery);