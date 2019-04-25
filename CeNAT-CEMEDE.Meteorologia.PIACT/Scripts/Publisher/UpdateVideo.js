$(function () {


    var selectedPublication = localStorage.getItem('selectedVideo');

    if (selectedPublication != null) {
        selectedPublication = JSON.parse(selectedPublication);
        //localStorage.removeItem('selectedVideo');

        $("#txtTitulo").val(selectedPublication.title);
        $("#descriptionTXT").val(selectedPublication.interpretation);

        $("#podcastTXT").val(selectedPublication.source);

    } else {
        window.location.pathname = "/Biblioteca/Videos";
    }
    //on load, set the Category and Section's select tag
    //Var local
    var publication;
    var error = [];

    function setPanel(source) {
        publication.source = source;
        var panel =
            "<iframe class='embed-responsive - item' src='" + source + "' allowfullscreen='' data-gtm-yt-inspected-2340190_699='true' data-gtm-yt-inspected-2340190_908='true'>" +
            "</iframe > ";

        //SET PANEL BY DEFAULT
        $("#panel").html(panel);

    }


    $.getJSON("/Publisher/getInterviewsSection", function (data) {
        // console.log(data);
        var items = "<option>Seleccione aqu&iacute;</option>";
        $.each(data, function (i, category) {
            items += "<option " + "value='" + category.ID + "'>" + category.Name + "</option>";
        });
        $("#Section").html(items);//tag name, name from HTML helper
    });


    $('#btEnviar').attr('disabled', 'disabled');
    $('#txtTitulo').on("change", function () {

        var text = $("#txtTitulo").val()
        $("#lblTitulo").text(text);
    });

    $('#descriptionTXT').on("change", function () {

        var text = $('#descriptionTXT').val();
        $("#lblDescripcion").text(text);
    });

    $("#podcastTXT").on("change", function () {

        //$("#txtTitulo").val() !== "" && && $("#descriptionTXT").val() !== ""
        if ($("#podcastTXT").val() !== "") {
            var url = $("#podcastTXT").val();
            if (url !== "") {
                var aorv = url.split("/");
                //console.log(aorv);
                var aorv_route = aorv[aorv.length - 1];
                //console.log(aorv_route);
                for (var i = 0; i < aorv.length; i++) {
                    if (aorv[i].toLowerCase().indexOf(".com") >= 0) {
                        var yos = aorv[i].toLowerCase();
                        //console.log(aorv[i]);
                        publication = {
                            'title': $("#txtTitulo").val(),
                            'idSection': 20,
                            'source': '',
                            'interpretation': $("#descriptionTXT").val()
                        }
                        if (yos === "youtube.com" || yos === "www.youtube.com") {
                            if (aorv_route !== "") {

                                var video_embed = (aorv_route.includes('watch?v='))
                                    ? aorv_route.replace("watch?v=", "embed/")
                                    : "embed/"+aorv_route;

                                $('#btEnviar').removeAttr('disabled');
                                publication.source = "https://" + yos + "/" + video_embed;
                                if (publication.idPublication !== 0) {
                                    setPanel(publication.source);
                                }
                            } else {
                                console.log("El video no tiene el formato adecuado, copia correctamente un link válido de youtube");
                                //error.push("El video no tiene el formato adecuado, copia correctamente un link válido de youtube");
                            }
                        }
                    }
                }
            }
        }
    });


    $("#txtTitulo").keyup(function () {
        var text = $(this).val();
        $("#lblTitulo").html(text);
    });

    $("#descriptionTXT").keyup(function () {
        var text = $(this).val();
        $("#lblDescripcion").html(text);
    });


    //btLimpiar 
    $("#btLimpiar").click(function () {
        $("#podcastTXT").val("");

    });

    function validateString(a, b, c) {
        return !(isEmptyOrSpaces(a) || isEmptyOrSpaces(b) || isEmptyOrSpaces(c));
    }

    function isEmptyOrSpaces(str) {
        return str === null || str.match(/^ *$/) !== null;
    }

    $("#btEliminar").click(
        function() {
            submit(0);
        }
    );

    

    $("#btEnviar").click(
        function() {
            submit(1);
        }
    );

    function submit(state) {

        publication.title = $("#txtTitulo").val();
        publication.interpretation = $("#descriptionTXT").val();
        publication.source = encodeURI(publication.source);
        publication.idDisplayMode = 3;
        publication.State = state;
        publication.idPublication = encodeURI(selectedPublication.idPublication);
        if (validateString(publication.title, publication.interpretation, publication.source)) {
            $.post('/Publisher/setPublicationInfo/', publication, function (res) {
                var msg = "";
                if (res.toString() === "true") {
                    msg =
                        "<div class='alert alert-success alert-dismissible'>" +
                        "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
                        "<strong>Success!</strong> Nuevo Video publicado." +
                        "</div>";
                    $("#lblResponseMsg").html(msg);
                    localStorage.removeItem('selectedVideo');

                }
                else {
                    msg =
                        "<div class='alert alert-danger alert-dismissible'>" +
                        "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
                        "<strong>Error!</strong> Disculpa, hubo un error al tratar de publicar por favor intenta nuevamente." +
                        "</div>";
                    $("#lblResponseMsg").html(msg);
                }
            });
        }
        else {
            msg =
                "<div class='alert alert-danger alert-dismissible'>" +
                "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
                "<strong>Campos vacíos!</strong> Disculpa, completa todos los campos para continuar." +
                "</div>";
            $("#lblResponseMsg").html(msg);

        }
        $("html, body").stop().animate({ scrollTop: 0 }, 500, 'swing', function () { });

    }

    $("#podcastTXT").change();

    
});