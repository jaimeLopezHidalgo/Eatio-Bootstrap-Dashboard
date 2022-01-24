(function ($) {
    //GLOBAL VARIABLES:

    // const menuCardElement = "<div class=\"menuCard adminMenuCard stopPropagation clipChildren\"><div class=\"deleteCardIconContainer clickable\" hidden><i class=\"flaticon-381-multiply-1 deleteCardIcon\"><\/i><\/div><div class=\"menuImageCard\"><div class=\"mealCategory\"><\/div><div class=\"gradientShadow\"><div class=\"mealDescription\"><div><span class=\"iconContainer\"><i class=\"flaticon-381-view-2 visible\"><\/i><\/span><span class=\"mealName\"><\/span><\/div><\/div><\/div><\/div><div class=\"menuCardFooter\"><label class=\"form-switch\"><input type=\"checkbox\" class=\"menuCardSwitch\" checked><i><\/i><\/label><span class=\"ingredientsDescription clickable badge light badge-secondary\"><i class=\"fas fa-pepper-hot\"><\/i><span class=\"ingredientsRatio\"><span class=\"ingredientsVariableAmount\"><\/span>\/<span class=\"ingredientsFixedAmount\"><\/span><\/span><\/span><\/div><\/div>";

    const menuCardElement = "<div class=\"menuCard adminMenuCard stopPropagation clipChildren\"><div class=\"deleteCardIconContainer clickable\" hidden><i class=\"flaticon-381-multiply-1 deleteCardIcon\"><\/i><\/div><div class=\"menuImageCard\"><div class=\"menuImageCardHeader\"><div class=\"cookingTimeContainer menuCardTag\"><span><i class=\"flaticon-381-clock\"><\/i><\/span><span class=\"cookingTime\"><\/span><span> min<\/span><\/div><div class=\"mealCategory menuCardTag\"><\/div><\/div><div class=\"gradientShadow\"><div class=\"mealDescription\"><div><span class=\"iconContainer\"><i class=\"flaticon-381-view-2 visible\"><\/i><\/span><span class=\"mealName\"><\/span><\/div><div class=\"priceContainer\"><span class=\"mealPrice\">125<\/span><span> MXN<\/span><\/div><\/div><\/div><\/div><div class=\"menuCardFooter\"><label class=\"form-switch\"><input type=\"checkbox\" class=\"menuCardSwitch\" checked><i><\/i><\/label><span class=\"ingredientsDescription clickable badge light badge-secondary\"><i class=\"fas fa-pepper-hot\"><\/i><span class=\"ingredientsRatio\"><span class=\"ingredientsVariableAmount\"><\/span>\/<span class=\"ingredientsFixedAmount\"><\/span><\/span><\/span><\/div><\/div>";

    const ingredientsModalSwitchElement = "<tr><td><label class=\"form-switch\"><input type=\"checkbox\" class=\"ingredientsModalCardSwitch\" checked><i><\/i><\/label><span class=\"ingredientName\"><\/span><\/td><\/tr>";

    const ingredientsWindowSwitchElement = "<div class=\"ingredientsWindowElement\"><label class=\"form-switch ingredientsWindowSwitch\"><input type=\"checkbox\" checked><i><\/i><\/label><input type=\"text\" class=\"clearField\"><\/div>";

    const availabilityIcons = [
        "<i class=\"flaticon-381-view-2 visible\"><\/i>",
        "<i class=\"flaticon-381-hide\"><\/i>"
    ];

    const categories = [
        [
            "dieta",
            "postre",
            "picante",
            "italiana",
            "oriental"
        ],
        [
            "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/salad-mix-plate-shot-from-above-on-rustic-wooden-royalty-free-image-1018199524-1556130377.jpg",
            "https://lh5.googleusercontent.com/9gAm0iRzY3dsjZ-xvKNA3LCl2CFd5EG86p31LBXM_ATZMpfOzmyY9IoROmNmjPLsgVAnT1WoTRkJlehsx_02PM5NlXscoYMa0y_Z3HmQmHa5dVYaq7L4O1N9UF8ozyI2ByX8IJ6L",
            "https://assets3.thrillist.com/v1/image/2946435/828x610/flatten;crop;jpeg_quality=70",
            "https://thekitchencommunity.org/wp-content/uploads/2021/08/shutterstock_1829686103-Italian.jpg", "https://www.visitstockholm.com/media/original_images/wang1.jpg"
        ]
    ]

    const categoryItemElement = "<span class=\"categoryItem menuCard clickable\"><\/span>";

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

    function pushCard(id, imageURL, time, category, mealName, price, ingredientsArray, visible) {
        let menuContainer = $('#menuContainer');
        var card = $(menuCardElement);
        let categoryBadge = card.find(".mealCategory");
        var checkedIngredients = 0;

        card.attr('id', id);
        card.find(".menuImageCard").css("background-image", "url(" + imageURL + ")");
        card.find(".cookingTime").text(time);
        if (category) {
            categoryBadge.text(category);
        }else{
            categoryBadge.remove();
        }
        card.find(".mealName").text(mealName);
        card.find(".mealPrice").text(price);
        card.find(".ingredientsFixedAmount").text(ingredientsArray.length);
        ingredientsArray.forEach(ingredient => {
            if (ingredient.checked) {
                checkedIngredients += 1;
            }
        });
        ingredientsObject[id] = ingredientsArray; //almacenar ingredientes
        if (!visible) {
            manageCardVisibility(card, false);
        }
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

                            pushCard(initialInfo.mealID, initialInfo.mealThumbnail, "15", null, initialInfo.mealName, "125", currentIngredients, true);
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
        card.find("#cookingTimeField").removeClass("invalidField");
        card.find("#cookingTimeField").val(null);
        card.find(".mealName").removeClass("invalidField");
        card.find(".mealName").val(null);
        card.find(".mealPrice").removeClass("invalidField");
        card.find(".mealPrice").val(null);
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

    function filterCategories(argText) {
        let itemNameText;
        
        argText = argText.toLowerCase();
        argText = argText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        $('#categoryWindowBody').find(".categoryItem").each(function () {
            itemNameText = $(this).text().toLowerCase();
            itemNameText = itemNameText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (itemNameText.includes(argText)) {
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
        $('input[type=text]').attr('autocomplete', 'off');

        $(document).on('change', ".menuCardSwitch", function () {
            manageCardVisibility($(this).closest(".menuCard"), $(this).prop("checked"));
        })

        $(document).on('click', ".ingredientsDescription", function () {
            var badge = $(this);
            let id = $(this).closest(".menuCard").attr('id');

            if (badge.attr('id') != "newMealModalIngredientsDescription") {
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
            }
        });

        $(document).on('click', '#masterSwitchButton', function () {
            $(".menuCard").has('input[type=checkbox]:not(:checked)').each(function () {
                manageCardVisibility($(this), true);
            })

            $(this).prop("hidden", true);
        });

        $(document).on('click', '#newMealModalMenuImageCard', function () {
            $('#hiddenUploadButton').click();
        });

        $(document).on('mouseover', '#newMealModalMenuImageCardHoverable', function () {
            var parentCard = $(this).closest(".menuImageCard");
            var prevOutline = parentCard.css("outline");

            parentCard.css("outline", "2px solid var(--magentaKomiin)");
            parentCard.css("outline-style", "dashed");
        });

        $(document).on('mouseout', '#newMealModalMenuImageCardHoverable', function () {
            var parentCard = $(this).closest(".menuImageCard");
            parentCard.css("outline", "none");
        });

        $(document).on('change', '#hiddenUploadButton', function () {
            $('#newMealModalMenuImageCardHoverable > i').prop("hidden", true);
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#newMealModalMenuImageCard').css("background-image", "url(" + e.target.result + ")");
                    $('#newMealModalMenuCard').data("imageURL", e.target.result);
                }
                reader.readAsDataURL(this.files[0]);
            }
            $('#newMealModalMenuImageCard').css("border", "none");
        });

        $(document).on('click', '#addMealButton', function () {
            manageNewMealModal();
        });

        $(document).on('click', '#deleteMealButton', function () {
            let cards = $(".menuCard");
            let exes = cards.find(".deleteCardIconContainer");

            $(this).toggleClass("btn-rounded");
            $(this).text("terminar");
            if (!$(this).hasClass("btn-rounded")) {
                $(this).text("remover");
            }

            cards.toggleClass("deletableMenuCard");
            exes.prop("hidden", !exes.prop("hidden"));
        });

        $(document).on('click', '.stopPropagation', function (e) {
            e.stopPropagation();
        });

        $(document).on('click', '#main-wrapper', function () {
            cancelCardRemoval();
        });

        $(document).on('click', '.deleteCardIconContainer', function () {
            $(this).closest(".menuCard").remove();
            manageMasterButton();
        });


        $(document).on('click', '#newMealModalClearButton', function () {
            clearNewMealModal();
        });

        $(document).on('click', '#newMealModalSaveButton', function () {
            var errorFound = false;
            var card = $('#newMealModalMenuCard');
            let time;
            let category;

            if ($('#cookingTimeField').val() == "") {
                errorFound = true;
                $('#cookingTimeField').addClass("invalidField");
            }else{
                time = card.find("#cookingTimeField").val();
            }

            if (!card.data("categoryAssigned")) {
                if ($('#hiddenUploadButton').val() == "") {
                    errorFound = true;
                    card.find(".menuImageCard").css("border", "1px solid red");
                }
            } else {
                category = card.find("#mealCategory").text();
            }

            if ($('#newMealModalMenuCardMealName').val() == "") {
                errorFound = true;
                $('#newMealModalMenuCardMealName').addClass("invalidField");
            }

            if (card.find('#newMealPrice').val() == "") {
                errorFound = true;
                card.find('#newMealPrice').addClass("invalidField");
            }

            if (!errorFound) {
                let id = getNextCardID();
                let card = $('#newMealModalMenuCard');
                let url = card.data("imageURL");
                let mealName = card.find(".mealName").val();
                let price = card.find('#newMealPrice').val();
                let ingredients = [];
                var ingredientObject;
                var ingredientName;

                $("#ingredientsWindowBody").find(".ingredientsWindowElement").each(function () {
                    ingredientObject = {
                        name: "",
                        checked: ""
                    };
                    ingredientName = $(this).find(".clearField").val();
                    if (ingredientName != "") {
                        ingredientObject.name = ingredientName;
                        ingredientObject.checked = $(this).find('input[type=checkbox]').prop("checked");
                        ingredients.push(ingredientObject);
                    }
                });

                pushCard(id, url, time, category, mealName, price, ingredients, card.find('input[type=checkbox]').prop("checked"));
                $('#newMealModalCloseButton').click();
                clearNewMealModal();
            }

        });

        $(document).on('click', '#newMealModalIngredientsDescription', function () {
            var td = $('#slidingTD');
            if (td.prop("hidden") || !$('#categoryWindow').prop("hidden")) {
                if (td.prop("hidden")) {
                    td.prop("hidden", false);
                }
                td.find('#categoryWindow').prop("hidden", true);
                td.find("#newMealModalIngredientsWindow").prop("hidden", false);
                td.find('#fakeIngredientField').focus();
            } else {
                td.prop("hidden", true);
            }
            manageNewMealModalWidths();
        });

        $(document).on('click', '#mealCategoryContainer', function (e) {
            e.stopPropagation()
            var td = $('#slidingTD');
            if (td.prop("hidden") || !$('#newMealModalIngredientsWindow').prop("hidden")) {
                if (td.prop("hidden")) {
                    td.prop("hidden", false);
                }
                td.find('#newMealModalIngredientsWindow').prop("hidden", true);
                td.find("#categoryWindow").prop("hidden", false);
                td.find('#modalSearchBarInput').focus();
            } else {
                td.prop("hidden", true);
            }
            manageNewMealModalWidths();
        });

        $(document).on('click', '#newMealModal .cookingTimeContainer', function (e) {
            e.stopPropagation();
        });

        // new ResizeSensor(jQuery('#newMealModal'), function () {
        //     manageNewMealModalWidths();
        // });

        $(document).on('keydown', '#fakeIngredientField', function (pressedKey) {
            pressedKey.preventDefault();
            if (keyIsValid(pressedKey)) {
                addNewIngredient(pressedKey.key);
                $(this).prop("hidden", true);
                $('#addIngredientInstructions').prop("hidden", false);
            }
        });

        $(document).on('keydown', '.ingredientsWindowElement', function (pressedKey) {
            var field = $(this).find(".clearField");

            if (pressedKey.keyCode == 13 && field.val().length > 0) {
                addNewIngredient();
            }
        });

        $(document).on('change', '.ingredientsWindowSwitch', function () {
            manageIngredientsBadge($('#ingredientsWindowBody'), $('#newMealModalIngredientsDescription'));
        });

        $(document).on('keyup', '#modalSearchBarInput', function () {
            if (!($(this).val() === "")) {
                $('.searchBarClearIcon').prop("hidden", false);
            } else {
                $('.searchBarClearIcon').prop("hidden", true);
            }
            filterCategories($(this).val());
        });

        $(document).on('click', '.searchBarClearIcon', function () {
            $('#modalSearchBarInput').val(null);
            $(this).prop("hidden", true);
            filterCategories("");
        });

        $(document).on('click', '.categoryItem', function () {
            $('#mealCategory').text($(this).text());
            $('#newMealModalMenuCard').data("categoryAssigned", true);
            if ($('#hiddenUploadButton').val() == "") {
                let ind = $(this).data("categoryIndex");

                $('#newMealModalMenuImageCard').css("border", "none");
                $('#newMealModalMenuImageCard').css("background-image", "url(" + categories[1][ind] + ")");
                $('#newMealModalMenuCard').data("imageURL", categories[1][ind]);
            }
            resetCategoriesWindow();
            $('#slidingTD').prop("hidden", true);
        });

        $(document).on('keydown', '.clearField', function () {
            if ($(this).hasClass("invalidField") && $(this).val() != "") {
                $(this).removeClass("invalidField");
            }
        });

        $(document).on('keydown', '.realNumeric', function (e) {
            if (e.keyCode == 69 || e.keyCode == 189) {
                //rechzar 'e' y '-'

                e.preventDefault();
            }
        });


    });
})(jQuery);