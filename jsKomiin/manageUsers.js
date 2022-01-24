(function ($) {

    //GLOBAL VARIABLES:
    let userType_color_isDefault = [
        ["Admin", "Cajer@", "Chef"],
        ["pink", "palegoldenrod", "palegreen"],
        [false, true, false]
    ];

    let userTypeTabElement = "<td class=\"clickable\"><\/td>";

    let userItemElement = "<div class=\"searchBoardItem userItem clickable\"><div class=\"deleteItemIconContainer clickable\" hidden><i class=\"flaticon-381-multiply-1 deleteItemIcon\"><\/i><\/div><div class=\"userInfoContainer clipChildren\"><span class=\"userType\"><\/span><div class=\"userPicture\"><\/div><span><span class=\"itemName\"><\/span><span class=\"userIdentity\" hidden>(Tú)<\/span><\/span><\/div><\/div>";

    let rootUser = "Salma";


    //FUNCTIONS:
    function filterCategories(argText) {
        let itemNameText;

        argText = argText.toLowerCase(); //convertir a minúsculas
        argText = argText.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); //eliminar tildes, diéresis, etc.

        $(".searchBoardBody").find(".searchBoardItem").each(function () {
            itemNameText = $(this).find(".itemName").text().toLowerCase(); //convertir a minúsculas
            itemNameText = itemNameText.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); //eliminar tildes, diéresis, etc.

            if (itemNameText.includes(argText)) {
                $(this).prop("hidden", false)
            } else {
                $(this).prop("hidden", true)
            }
        });
    }

    function getUserColor(userType) {
        userType_color_isDefault[0].forEach((currentUserType, i) => {
            if (currentUserType == userType) {
                userTypeIndex = i;
            }
        });
        return userType_color_isDefault[1][userTypeIndex];
    }

    function changeUserCardColor(card, userType, inSearchBoard) {
        let userTypeIndex;
        let color;
        let tab;

        //obtener color:
        color = getUserColor(userType);

        //resetar color de la tarjeta recibida:
        card.css("outline", "none");
        card.find("td").css("color", "inherit");
        card.find("td").css("background", "inherit");

        //pintar la tarjeta del color correspondiente:
        if (!inSearchBoard) {//si es la tarjeta del modal
            tab = card.find("td:contains(" + userType + ")");

            card.css("outline", "3px solid " + color); //pintar contorno
            tab.css("background", "linear-gradient(to bottom, " + color + " 50%, rgba(0, 0, 0, 0) 100%)"); //pintar pestaña del color correspondiente
            tab.css("color", "white");
            tab.addClass("selectedUserType"); //agregar bandera para localizar fácil 
        } else {
            card.css("outline", "2px solid " + color); //pintar contorno
            card.find(".userType").css("background", "linear-gradient(to bottom, " + color + " 50%, rgba(0, 0, 0, 0) 100%)"); //pintar pestaña del color correspondiente

            return card; //solo en el caso de que sea tarjeta del tablero
        }

    }

    function getDefaultUser() {
        let def;

        userType_color_isDefault[0].forEach((userType, i) => {
            if (userType_color_isDefault[2][i] == true) {//si es el tipo de usuario default
                def = userType; //guardar el tipo de usuario default
            }
        });

        return def;
    }

    function fillUserTypes() {
        let table = $("#newUserModal .userType tbody");
        let tabContainer;
        let tabElement;
        let num; //número de tipos de usuario
        let width;

        table.append("<tr><\/tr>"); //construir encabezado de pestañas de tipo de usuario
        tabContainer = table.find("tr");

        //agregar las pestañas al encabezado:
        userType_color_isDefault[0].forEach((userType, i) => {
            tabElement = $(userTypeTabElement);
            tabElement.text(userType); //asignar tipo de usuario a la pestaña

            tabContainer.append(tabElement);
        });

        //ajustar ancho de las pestañas
        num = userType_color_isDefault[0].length;
        width = ((Math.floor(100 / num)).toString()) + "%";
        tabContainer.find("td").css("width", width); //fijar tamaño de las pestañas

        changeUserCardColor($("#newUserModal .searchBoardItem"), getDefaultUser(), false); //asignar color a la tarjeta
    }

    function emailIsValid(email) {
        var formatRegex = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])"; //expresión regular de email

        formatRegex = new RegExp(formatRegex);

        return formatRegex.test(email);
    }

    function passwordIsValid(password) {
        var formatRegex = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$" //al menos: una mayúscula, una minúscula, un dígito, 8 caracteres

        formatRegex = new RegExp(formatRegex);

        return formatRegex.test(password);
    }

    function createUser(userType, imageData, userName, email, password) {
        let userCard = changeUserCardColor($(userItemElement), userType, true); //asignar color a tarjeta

        userCard.find(".userType").text(userType); //asignar tipo de usuario
        if (imageData) {//si se mandaron datos para la foto del usuario
            userCard.find(".userPicture").css("background-image", "url(" + imageData + ")"); //asignar imagen
        }
        userCard.find(".itemName").text(userName);
        if (userName == rootUser) {//si la tarjeta del usuario es la del usuario actual
            userCard.find(".userIdentity").prop("hidden", false); //revelar el '(Tú)'
        }

        //agregar tarjeta al search board:
        $("#usersSearchBoard .searchBoardBody").append(userCard);

        //mandar a la base de datos (León):
    };

    function resetNewUserModal() {
        let modal = $("#newUserModal");
        let extraFields = modal.find(".extraFieldContainer input");
        let invalidMessages = modal.find(".invalidFieldMessage");

        changeUserCardColor(modal.find(".searchBoardItem"), getDefaultUser(), false); //restaurar tarjeta al tipo de usuario default

        //restaurar foto de usuario:
        modal.find(".userPicture").data("imageData", null); //borrar datos de foto en el atributo
        modal.find(".hiddenUploadButton").val(null); //borrar datos de foto en input escondido
        modal.find(".userPicture").css("background-image", "none"); //borrar foto
        modal.find(".userPicture").css("background-color", "var(--magentaKomiin)"); //background default
        modal.find(".userPictureEmptyIcon").prop("hidden", false); //revelar ícono

        modal.find(".itemName").val(null); //borrar nombre de usuario
        extraFields.val(null); //borrar campos extras

        //Esconder mensajes de alerta:
        invalidMessages.prop("hidden", true);

        //restaurar íconos de visibilidad de los campos de contraseña
        $(".changeFieldVisibilityIcon").removeClass("flaticon-381-hide");
        $(".changeFieldVisibilityIcon").addClass("flaticon-381-view-2");

        //quitar color rojo sobre los campos inválidos:
        modal.find(".invalidField").removeClass("invalidField");
    }

    //MAIN CODE:    
    fillUserTypes(); //construir pestañas de tipo de usuario en modal

    $(document).ready(function () {
        $(document).on("keyup", ".searchBoard .searchBar input", function () {
            if ($(this).val().length > 0) {
                $(".searchBarClearIcon").prop("hidden", false);
            } else {
                $(".searchBarClearIcon").prop("hidden", true);
            }
            filterCategories($(this).val());
        });

        $(document).on("click", ".searchBarClearIcon", function () {
            $(this).parent().find("input").val(null);
            $(this).prop("hidden", true);
            filterCategories("");
        });

        $(document).on("click", ".deleteSearchBoardItemsButton", function () {
            let items = $(".searchBoardItem");
            let exes = items.find(".deleteItemIconContainer");

            $(this).toggleClass("btn-rounded");
            $(this).text("terminar");
            if (!$(this).hasClass("btn-rounded")) {
                $(this).text("remover");
            }

            items.toggleClass("deletableMenuCard");
            exes.prop("hidden", !exes.prop("hidden"));
        });

        $(document).on("click", ".deleteItemIconContainer", function () {
            $(this).closest(".searchBoardItem").remove();
        });

        $(document).on("click", ".modalCancelButton", function () {
            resetNewUserModal();
        });

        $(document).on("click", ".changeFieldVisibilityIcon", function () {
            let field = $(this).parent().siblings();
            console.log(field[0]);
            if (field.attr("type") == "password") {
                field.attr("type", "text");
                $(this).removeClass("flaticon-381-view-2");
                $(this).addClass("flaticon-381-hide");
            } else if (field.attr("type") == "text") {
                field.attr("type", "password");
                $(this).removeClass("flaticon-381-hide");
                $(this).addClass("flaticon-381-view-2");
            }
        });

        $(document).on("click", ".addSearchBoardItemsButton", function () {
            setTimeout(function () {
                $(".modal .itemName").focus();
            }, 500);
        });

        $(document).on("click", "#newUserModal .userType td", function () {
            if (!$(this).hasClass("selectedUserType")) {
                $(this).parent().find(".selectedUserType").toggleClass("selectedUserType"); //quitarle selección a la pestaña seleccionada vieja
                $(this).addClass("selectedUserType"); //agregarle bandera la la nueva pestaña
                changeUserCardColor($(this).closest(".searchBoardItem"), $(this).text(), false);
            }
        });

        $(document).on('click', '#newUserModal .userPicture', function () {
            $('#newUserModal .hiddenUploadButton').click();
        });

        $(document).on('change', '#newUserModal .hiddenUploadButton', function () {
            $("#newUserModal .userPictureEmptyIcon").prop("hidden", true);
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#newUserModal .userPicture').css("background-image", "url(" + e.target.result + ")");
                    $('#newUserModal .userPicture').data("imageData", e.target.result);
                }
                reader.readAsDataURL(this.files[0]);
            }
        });

        //remover color rojo de los campos invalidos cuando se escriba en ellos:
        $(document).on('keydown', '#newUserModal .invalidField', function () {
            if ($(this).hasClass("invalidField") && $(this).val() != "") {
                $(this).removeClass("invalidField");

                //campos específicos:
                if ($(this).attr('id') == "newUserEmailField" || $(this).attr('id') == "newUserPasswordField") {
                    $(this).closest(".extraFieldContainer").find(".invalidFieldMessage").prop("hidden", true); //esconder mensaje de error
                }
            }
        });

        //al picarle al botón de 'guardar' en el modal
        $(document).on('click', '#newUserModal .modalConfirmButton', function () {
            let errorFound = false;
            let typeableFields = $("#newUserModal .clearField");
            let emailField = $("#newUserModal #newUserEmailField");
            let passwordField = $("#newUserModal #newUserPasswordField");

            //asegurar que todos los campos esten llenos:
            $(typeableFields).each(function () {
                if ($(this).val() == "") {
                    errorFound = true;
                    $(this).addClass("invalidField");
                }
            });

            if (emailField.val() != "" && !emailIsValid(emailField.val())) {
                errorFound = true;
                emailField.addClass("invalidField");
                emailField.closest(".extraFieldContainer").find(".invalidFieldMessage").prop("hidden", false); //revelar mensaje de error para email
            }

            if (passwordField.val() != "" && !passwordIsValid(passwordField.val())) {
                errorFound = true;
                passwordField.addClass("invalidField");
                passwordField.closest(".extraFieldContainer").find(".invalidFieldMessage").prop("hidden", false); //revelar mensaje de error para contraseña
            }

            if (!errorFound) {//si todos los campos están en órden
                let modal = $("#newUserModal");
                let userType = modal.find(".selectedUserType").text();
                let userPictureData = modal.find(".userPicture").data("imageData");
                let userName = modal.find(".itemName").val();
                let email = modal.find("#newUserEmailField").val();
                let password = modal.find("#newUserPasswordField").val();

                // console.log(userType);
                // console.log(userPictureData);
                // console.log(userName);
                // console.log(email);
                // console.log(password);

                createUser(userType, userPictureData, userName, email, password);

                resetNewUserModal(); //limpiar información
                $("#newUserModal .modalCloseIcon").click(); //cerrar modal
            }
        });
    });
})(jQuery);