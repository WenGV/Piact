$(function () {
    console.log("ready!");

    //$.getJSON("/Biblioteca/GenerateDownloadLinks", function (data) {
    //    //console.log(data);
    //    createTable(data);
    //});


    $("#findFile").change(function () {

        var val = $(this).val().trim();
        val = val.replace(/\s+/g, '');

        if (val.length >= 0 && val.length < 11) { //for checking 3 characters
            var pub = {
                'title': $(this).val()
            }
            $.post("/Biblioteca/findFileByName", pub, function (data) {
                //console.log(data);
                //Find by Publication Title
               
                //Find by File Name
                createTable(data, 1);

            });
        }

    });

    var section = {
        'name':32
    }
    $.post('/getPubBySection/', section, function (data) {
        console.log(data);
        createTable(data,2);
    });


    
    //Add event to UPLOAD FILE
    $("#login-submit").click(function (event) {
        //Upload file
        $.post
    });

    //Mode 1 = Find by file name, Mode 2, Fuind by Publication title
    function createTable(jsonTable,mode) {

        var rows = "";

            $.each(jsonTable, function (i, row) {
                rows += "<tr>" +
                           "<td><a class='linkbiblio' href='" + row.source + "'><h2 class='textbiblio'>" + row.title + "</h2></a></td>" +
                           /*"<td><a class='linkbiblio' href='" + row.source + "'><h2>Link de Descarga</h2></a></td>" +*/
                           "<td><img id='imgbiblio' class='img img-responsive'  src='" + row.OriginalURL + "'></img></td>" +
                        "</tr>";
           });
        



        var table =
            "<table class='table table-striped table-hover '>" +
             "<thead>" +
               "<tr class='barbiblio'>" +
                  "<th>" + "Nombre del archivo" + "</th>" +
                  /*"<th>" + "Descargar" + "</th>" +*/
                  "<th>" + "Tipo de archivo" + "</th>" +
               "</tr>" +
             "</thead>" +
                  "<tbody>" +
                    rows
                 "</tbody>" +
     "</table>";

        $("#panel").html(table);
    }

});