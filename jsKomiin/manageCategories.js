(function ($) {

    //GLOBAL VARIABLES:
    let categoryItemElement = "<div class=\"searchBoardItem clickable\"><div class=\"deleteItemIconContainer clickable\" hidden><i class=\"flaticon-381-multiply-1 deleteItemIcon\"><\/i><\/div><span class=\"itemName\"><\/span><\/div>";


    //FUNCTIONS:
    function filterCategories(argText) {
        let itemNameText;
        
        argText = argText.toLowerCase();
        argText = argText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        $('.searchBoardBody').find(".searchBoardItem").each(function () {
            itemNameText = $(this).text().toLowerCase();
            itemNameText = itemNameText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (itemNameText.includes(argText)) {
                $(this).prop("hidden", false)
            } else {
                $(this).prop("hidden", true)
            }
        });
    }

    function addCategory(name){
        let element = $(categoryItemElement);
        element.find(".itemName").text(name);
        $(".searchBoardBody").append(element);
    }

    //MAIN CODE:
    $(document).ready(function () {
        $(document).on('keyup', '#categorySearchBarInput', function () {
            if (!($(this).val() === "")) {
                $('.searchBarClearIcon').prop("hidden", false);
            } else {
                $('.searchBarClearIcon').prop("hidden", true);
            }
            filterCategories($(this).val());
        });

        $(document).on('click', '.searchBarClearIcon', function () {
            $('#categorySearchBarInput').val(null);
            $(this).prop("hidden", true);
            filterCategories("");
        });

        $(document).on('click', '#deleteCategoryButton', function () {
            let categoryItems = $(".searchBoardItem");
            let exes = categoryItems.find(".deleteItemIconContainer");

            $(this).toggleClass("btn-rounded");
            $(this).text("terminar");
            if (!$(this).hasClass("btn-rounded")) {
                $(this).text("remover");
            }

            categoryItems.toggleClass("deletableMenuCard");
            exes.prop("hidden", !exes.prop("hidden"));
        });

        $(document).on('click', '.deleteItemIconContainer', function () {
            $(this).closest(".searchBoardItem").remove();
        });

        $(document).on('click', '#newCategoryModalCancelButton', function () {
            $('#newCategoryNameField').val(null);
        });

        $(document).on('click', '#addCategoryButton', function () {
            setTimeout(function () {
                $('#newCategoryNameField').focus();
            }, 500);
        });

        $(document).on('click', '#newCategoryModalSaveButton', function () {
            let name = $('#newCategoryNameField').val();
            addCategory(name);
            $('#newCategoryModalCancelButton').click();
        });

        $(document).on('keydown', '#newCategoryNameField', function (pressedKey) {
            var field = $(this);
            
            if (pressedKey.keyCode == 13 && field.val().length > 0) {
                $('#newCategoryModalSaveButton').click();
            }
        });


    });
})(jQuery);