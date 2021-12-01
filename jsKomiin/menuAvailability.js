(function ($) {

    //GLOBAL VARIABLES:
    // const menuCardElement = "<div class=\"menuCard clipChildren\"><div class=\"menuImageCard\"><div class=\"gradientShadow\"><div class=\"mealDescription\"><span class=\"iconContainer\"><i class=\"flaticon-381-view-2 visible\"><\/i><\/span><span class=\"mealName\"><\/span><\/div><\/div><\/div><div class=\"menuCardFooter\"><label class=\"form-switch\"><input type=\"checkbox\" class=\"menuCardSwitch\"><i><\/i><\/label><span class=\"ingredientsDescription badge light badge-secondary\"><i class=\"fas fa-pepper-hot\"><\/i><span class=\"ingredientsRatio\"><span class=\"ingredientsVariableAmount\"><\/span>\/<span class=\"ingredientsFixedAmount\"><\/span><\/span><\/span><\/div><\/div>";

    const menuCardElement = "<div class=\"menuCard clipChildren\"><div class=\"menuImageCard\"><div class=\"mealCategory\">categoría<\/div><div class=\"gradientShadow\"><div class=\"mealDescription\"><div><span class=\"iconContainer\"><i class=\"flaticon-381-view-2 visible\"><\/i><\/span><span class=\"mealName\"><\/span><\/div><\/div><\/div><\/div><div class=\"menuCardFooter\"><label class=\"form-switch\"><input type=\"checkbox\" class=\"menuCardSwitch\" checked><i><\/i><\/label><span class=\"ingredientsDescription clickable badge light badge-secondary\"><i class=\"fas fa-pepper-hot\"><\/i><span class=\"ingredientsRatio\"><span class=\"ingredientsVariableAmount\"><\/span>\/<span class=\"ingredientsFixedAmount\"><\/span><\/span><\/span><\/div><\/div>";

    const ingredientsModalSwitchElement = "<tr><td><label class=\"form-switch\"><input type=\"checkbox\" class=\"ingredientsModalCardSwitch\" checked><i><\/i><\/label><span class=\"ingredientName\"><\/span><\/td><\/tr>";

    const availabilityIcons = [
        "<i class=\"flaticon-381-view-2 visible\"><\/i>",
        "<i class=\"flaticon-381-hide\"><\/i>"
    ];

    const mealsURL = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian";

    const mealsLookupPrefix = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

    let ingredientsObject = {};

    //FUNCTIONS:
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function getRandomPrice() {
        var cents = getRandomInt(0, 100).toString();
        if (parseInt(cents) < 10) {
            cents = "0" + cents;
        }
        return "$" + getRandomInt(10, 501).toString() + "." + cents;
    }

    async function getInitialMealData(mealObject) {
        //función asíncrona que extrae los datos iniciales de los platillos

        //objeto a llenar:
        var summary = {
            mealID: "",
            mealName: "",
            mealThumbnail: ""
        };

        //llenar objeto local a partir de 'mealJSON': 
        summary.mealID = mealObject.idMeal;
        summary.mealName = mealObject.strMeal;
        summary.mealThumbnail = mealObject.strMealThumb;

        return summary;
    }

    function pushCard(id, imageURL, mealName, ingredientsArray, visible, category) {
        let menuContainer = $('#menuContainer');
        var card = $(menuCardElement);
        let categoryBadge = card.find(".mealCategory");
        var checkedIngredients = 0;

        card.attr('id', id);
        if (category) {
            categoryBadge.text(category);
        } else {
            categoryBadge.remove();
        }
        card.find(".menuImageCard").css("background-image", "url(" + imageURL + ")");
        card.find(".mealName").text(mealName);
        if (!visible) {
            manageCardVisibility(card, false);
        }
        ingredientsObject[id] = ingredientsArray; //almacenar ingredientes
        card.find(".ingredientsFixedAmount").text(ingredientsArray.length);
        ingredientsArray.forEach(ingredient => {
            if (ingredient.checked) {
                checkedIngredients += 1;
            }
        });
        card.find(".ingredientsVariableAmount").text(checkedIngredients);

        menuContainer.append(card); //meter tarjeta al cuerpo del menú
    }

    function loadMenu() {
        let menuContainer = $('#menuContainer');
        menuContainer.empty(); //vaciar menú actual

        //request del API por categoría:
        $.getJSON(mealsURL, function (mealsData) {
            mealsJSON = mealsData;

            //por cada platillo:
            $.each(mealsData.meals, function (key, mealObject) {
                getInitialMealData(mealObject) //función asíncrona para obtener datos necesarios ANTES de la siguiente parte:
                    .then(function (initialInfo) {

                        //request del API de los detalles de dicho platillo:
                        $.getJSON(mealsLookupPrefix + initialInfo.mealID, function (mealLookupData) {
                            var count = 1;
                            var currentIngredients = [];
                            var ingredientObject;

                            while (mealLookupData.meals[0]["strIngredient" + count] != "") {
                                ingredientObject = {
                                    name: "",
                                    checked: true
                                };
                                ingredientObject.name = mealLookupData.meals[0]["strIngredient" + count];
                                currentIngredients.push(ingredientObject);
                                count += 1;
                            }

                            pushCard(initialInfo.mealID, initialInfo.mealThumbnail, initialInfo.mealName, currentIngredients, true);
                        });
                    });
            });
        });
    };

    function fillUpIngredientsModal(card) {
        var mealName = card.find(".mealName").text();
        var mealID = card.attr('id');
        var ingredientSwitch;
        var table = $('#ingredientsTable');
        var checkbox;

        table.empty();

        $('#ingredientsModalMealName').text(mealName);
        ingredientsObject[mealID].forEach(ingredient => {
            ingredientSwitch = $(ingredientsModalSwitchElement);
            checkbox = ingredientSwitch.find("input[type=checkbox]");
            checkbox.prop("checked", true);
            if (!ingredient.checked) {
                checkbox.prop("checked", false);
            }
            ingredientSwitch.find(".ingredientName").text(ingredient.name);
            table.append(ingredientSwitch);
        });
    }

    function manageMasterButton() {
        var uncheckedCards = $(".menuCard").has('input[type=checkbox]:not(:checked)');

        if (uncheckedCards.length > 0) {
            $('#masterSwitchButton').prop("hidden", false);
        } else {
            $('#masterSwitchButton').prop("hidden", true);
        }
    }

    function manageCardVisibility(card, makeVisible) {
        var iconContainer;

        iconContainer = card.find(".iconContainer");
        iconContainer.find("i").remove();

        if (makeVisible) {
            card.removeClass("hiddenMenuCard");
            iconContainer.append(availabilityIcons[0]);
            card.find('input[type=checkbox]').prop("checked", true);
        } else {
            card.addClass("hiddenMenuCard");
            iconContainer.append(availabilityIcons[1]);
            card.find('input[type=checkbox]').prop("checked", false);
        }

        if (card.attr("id") != "newMealModalMenuCard") {
            if (makeVisible) {
                card.find(".ingredientsDescription").fadeIn();
            } else {
                card.find(".ingredientsDescription").fadeOut();
            }
            manageMasterButton();
        }
    }

    function manageNewMealModalWidths() {
        let leftProp = 0.5;
        let table = $('#newMealModal table');
        let slidingTD = $('#slidingTD');
        let cardTD = $('#newMealModalMenuCardTD');
        let card = $('#newMealModalMenuCard');

        if (!slidingTD.prop("hidden")) {
            var leftWidth = table.width() * leftProp;
            if (leftWidth < 312) {
                card.width(leftWidth);
            } else {
                card.width(312);
            }
            cardTD.width(leftWidth);
            slidingTD.width(table.width() - leftWidth);
        } else if (table.width() >= 312) {
            card.width(312);
        }
    }

    function keyIsValid(e) {
        var validKey = false;

        switch (e.keyCode) {
            case 8: //Backspace
            case 9: //Tab
            case 13: // Enter
            case 16: // Shift
            case 17: // Ctrl
            case 18: // Alt
            case 19: // Pause/Break
            case 20: // Caps Lock
            case 27: // Escape
            case 32: // Spacebar
            case 35: // End
            case 36: // Home
            case 37: // Left
            case 38: // Up
            case 39: // Right
            case 40: // Down

            // Mac CMD Key
            case 91: // Safari, Chrome
            case 93: // Safari, Chrome
            case 224: // Firefox
                break;
            default:
                validKey = true;
                break;
        }

        return validKey;
    }

    function addNewIngredient(name) {
        var switchElement = $(ingredientsWindowSwitchElement);

        switchElement.find(".clearField").val(name);
        $('#ingredientsWindowBody').append(switchElement);
        manageIngredientsBadge($('#ingredientsWindowBody'), $("#newMealModalIngredientsDescription"));
        $('#ingredientsWindowBody .clearField:last').focus();
    }

    function manageIngredientsBadge(switchContainer, badge) {
        let totalSwitches = switchContainer.find('input[type=checkbox]').length;
        let checkedSwitches = switchContainer.find('input[type=checkbox]:checked').length;

        badge.find(".ingredientsFixedAmount").text(totalSwitches);
        badge.find(".ingredientsVariableAmount").text(checkedSwitches);
    }

    function cancelCardRemoval() {
        let cards = $(".menuCard");
        let exes = cards.find(".deleteCardIconContainer");
        let deleteButton = $('#deleteMealButton');

        deleteButton.text("remover");
        deleteButton.removeClass("btn-rounded");

        cards.removeClass("deletableMenuCard");
        exes.prop("hidden", true);
    }

    function resetIngredientsWindow() {
        $('#ingredientsWindowBody').empty();
        $('#fakeIngredientField').prop("hidden", false);
        $('#addIngredientInstructions').prop("hidden", true);
        $('#newMealModalIngredientsWindow').prop("hidden", true);
    }

    function resetCategoriesWindow() {
        $('#modalSearchBarInput').val(null);
        $('.searchBarClearIcon').prop("hidden", true);
        filterCategories("");
        $('#categoryWindow').prop("hidden", true);
    }

    function clearNewMealModal() {
        var card = $('#newMealModalMenuCard');

        card.find("#mealCategory").text("selecciona categoría");
        card.data("categoryAssigned", false);
        $("#hiddenUploadButton").val(null);
        card.find(".menuImageCard").css("background-image", "none");
        card.find(".menuImageCard").css("border", "none");
        card.data("imageURL", null)
        // $('#newMealModalMenuImageCardHoverable > i').prop("hidden", false);
        card.removeClass("hiddenMenuCard");
        iconContainer = card.find(".iconContainer");
        icon = iconContainer.find("i");
        iconIsvisible = icon.hasClass("visible");
        if (!iconIsvisible) {
            icon.remove();
            iconContainer.append(availabilityIcons[0]);
        }
        card.find(".mealName").removeClass("invalidField");
        card.find(".mealName").val(null);
        card.find(".menuCardSwitch").prop("checked", true);
        card.find(".ingredientsFixedAmount").text(0);
        card.find(".ingredientsVariableAmount").text(0);
        resetIngredientsWindow();
        resetCategoriesWindow();
        $('#slidingTD').prop("hidden", true);
    }

    function getNextCardID() {
        var max = -1;

        for (ing in ingredientsObject) {
            if (parseInt(ing) > max) {
                max = parseInt(ing);
            }
        }

        return max + 1;
    }

    function filterCategories(argText) {
        let text = $('#modalSearchBarInput').val();
        if (!(argText == null)) {
            text = argText
        }
        $('#categoryWindowBody').find(".categoryItem").each(function () {
            if ($(this).text().includes(text)) {
                $(this).prop("hidden", false)
            } else {
                $(this).prop("hidden", true)
            }
        });
    }

    function loadCategories() {
        var cat;
        let container = $('#categoryWindowBody');

        container.empty();
        categories[0].forEach((category, ind) => {
            cat = $(categoryItemElement);
            cat.text(category);
            cat.data("categoryIndex", ind);
            container.append(cat);
        });
    }

    function manageNewMealModal() {
        $('#newMealModalMenuCard').find('#newMealModalMenuCardMealName').focus();
        loadCategories();
        $('#newMealModalMenuCard').data("categoryAssigned", false);
    }

    //MAIN CODE:
    $(document).ready(function () {
        loadMenu();
        manageMasterButton();

        //JQUERY:
        $(document).on('change', ".menuCardSwitch", function () {
            manageCardVisibility($(this).closest(".menuCard"), $(this).prop("checked"));
        })

        $(document).on('click', ".ingredientsDescription", function () {
            var badge = $(this);
            let id = $(this).closest(".menuCard").attr('id');

            $('#dummyModalButton').click(); //truco para desplegar modal de ingredientes

            fillUpIngredientsModal($(this).closest('.menuCard'));

            $(".ingredientsModalCardSwitch").on('change', function () {
                let ingredientName = $(this).closest('tr').find(".ingredientName").text();

                ingredientsObject[id].forEach(ingredient => {
                    if (ingredient.name == ingredientName) {
                        ingredient.checked = $(this).prop("checked");
                    }
                });
                manageIngredientsBadge($('#ingredientsTable'), badge);
                $(this).off('change');
            });
        });

        $(document).on('click', '#masterSwitchButton', function () {
            $(".menuCard").has('input[type=checkbox]:not(:checked)').each(function () {
                manageCardVisibility($(this), true);
            })

            $(this).prop("hidden", true);
        });
    });
})(jQuery);