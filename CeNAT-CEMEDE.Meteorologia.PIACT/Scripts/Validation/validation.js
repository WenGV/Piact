$(function () {

    //Main variables
    var Email = $("#email");
    var PasswordHash = $("#PasswordHash");

    //Add Event Listeners
    Email.on("blur", function () {
        validate(Email,1);
    });
    PasswordHash.on("blur", function () {
        validate(PasswordHash,2);
    });

    //Functions

    //Type 1 = Email, Type 2 = Length
    function validate(field, type) {

        //Determining what input it is
        var validation = "";
        if (type == 1) {
            validation = isValidEmailAddress;
        }
        else if (type == 2) {
            validation = validateLength;
        }

        // Get the  value of the input field being submitted
        value = field.val();

        // Set the error field tag in the html
        errorField = field.attr("id") + 'Error';

        // Set the success field
        successField = field.attr("id") + 'Success';

        if (validation(value)) {
            document.getElementById(successField).style.display = 'block';
            document.getElementById(errorField).style.display = 'none';
        }
        else {
            document.getElementById(successField).style.display = 'none';
            document.getElementById(errorField).style.display = 'block';
        }
    }

    function isValidEmailAddress(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    }

    function validateLength(field) {
        if (field.length >= 8) {
            return true;
        }
        else {
            return false;
        }
    }


})