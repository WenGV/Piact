$(function () {


    var resourseID, idPublication,  IndexSource, selectedCategory,idDisplayMode;
    $('#editor').text("");
    $('#Position').attr('disabled', 'disabled');

    getClimaticData(1);
    function getClimaticData(state) {
        $.post("/Publisher/getClimaticData", { 'ID': 0, 'Pos': state }, function (data) {
            console.log(data);
            climaticData = data;
            data = climaticData.categories;
            var items = "<option>Seleccione aqu&iacute;</option>";
            $.each(data, function (i, category) {
                items += "<option " + "value='" + category.ID + "'>" + category.Name + "</option>";
            });
            $("#Category").html(items);//tag name, name from HTML helper
        });
    }

    $("#Category").change(function (sender) {

        //clean dropdowns
        $("#Sections").html("<option>Seleccione aqu&iacute;</option>");
        $("#Resource").html("<option>Seleccione aqu&iacute;</option>");
        $("#Position").html("<option>Seleccione aqu&iacute;</option>");

 

        var idCategory = $(sender.target).val();
        var data = climaticData.sections;
        var items = "<option>Seleccione aqu&iacute;</option>";
        $.each(data, function (i, section) {
            if (section.CategoryID == idCategory) {

                items += "<option value='" + section.ID + "'>" + section.Name + "</option>";

            }
        });
        $("#Sections").html(items);

        //Auto Select
        selectedCategory = $("#Category option:selected").text();
        if (selectedCategory == "Inicio") {
            $('#Sections').val(31).change();
        }
    });

   
    $("#Sections").change(function (sender) {

        //IF option is Biblioteca,  allow upload files Panel
        //Auto Select
        selectedCategory = $("#Sections option:selected").text();
        var items = "<option>Seleccione aqu&iacute;</option>",
            itemPos = "<option>Seleccione aqu&iacute;</option>";

        if (selectedCategory == "Biblioteca") {
            items = "<option>Seleccione aqu&iacute;</option>";
            items += "<option>Publicar Nuevo Archivo</option>";
        }
        else {
            $("#Resource").html("<option>Seleccione aqu&iacute;</option>");
        }

        var myPos = 1;
        $('#Position').attr('disabled', 'disabled');
        var idSection = $(sender.target).val();
        var data = climaticData.resources;
        var resources = [];
        

        $.each(data, function (i, resource) {
            if (resource.IDsection == idSection) {
                    items += "<option   name='" + resource.Pos + "' value='" + resource.ID + "'>" + resource.Name + "</option>";
                    itemPos += "<option value = '" + resource.Pos + "'>" + myPos + "</option>"; myPos++;
                    resources.push(resource.Name);
            }
        });
        console.log(resources);
        var doge = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // `states` is an array of state names defined in "The Basics"
            local: resources
        });
        /*$("#Resource").typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
            {
                name: 'resources',
                source: doge
            });*/
        $("#Position").html(itemPos);
        $("#Resource").html(items);
    });

    $("#Resource").change(function () {
        $('#Position').removeAttr('disabled');
        visualizer();
        var resource_name = $("#Resource option:selected").text();
        resource_name = resource_name.toLowerCase();
        resource_name = resource_name.split(" ");

        if ($.inArray("title", resource_name) != -1) {
            $("#Position").parent().addClass("dnd");
        } else {
            if ($("#content-manager-container .admin-content-select>div>.row:last-child").hasClass("dnd")) {
                $("#Position").parent().removeClass("dnd");
            }
        }
    });

    //Set the position
    $("#Position").blur(function (sender) {
        // var idPublication = $(sender.target).val();
        //if (!isNaN($("#Position option:selected").val()) && !($("#Resource option:selected").attr("name") == $("#Position option:selected").val())  ) {
        try {

            var changePos =parseInt( $("#Position option:selected").val());//climaticData.resources[$("#Position option:selected").val()].Pos;//Get Actual Pos0
            var IDresource = parseInt($("#Resource option:selected").val());
            var currentPos = parseInt($("#Resource option:selected").attr("name"));

            if (IDresource > 0 && changePos != currentPos)
        {

            var resource = {    
                'ID': IDresource,
                'Pos': changePos
            }

            $.post('/Publisher/setResourcePosition/', resource, function (res) {
                climaticData.resources = res;
                var myPos = 1;
                var items = "<option>Seleccione aqu&iacute;</option>",
                    itemPos = "<option>Seleccione aqu&iacute;</option>",
                    idSection =  $("#Sections option:selected").val();
            
                $.each(climaticData.resources, function (i, resource) {
                    if (resource.IDsection == idSection) {
                        if (resource.pubState == 1) {
                            items += "<option name='" + resource.Pos + "' value='" + resource.ID + "'>" + resource.Name + "</option>";
                            itemPos += "<option value='" + resource.Pos + "'>" + myPos + "</option>"; myPos++;
                        }
                    }
                });
                $("#Resource").html(items);
                $("#Position").html(itemPos);
                $('#Position').attr('disabled', 'disabled');

            }, 'json');
        }
        } catch (e) {

        }
    });

    function toggleOn() {
        $('#statusCheck').bootstrapToggle('on')
    }
    function toggleOff() {
        $('#statusCheck').bootstrapToggle('off')
    }

    function visualizer() {

        selectedCategory = $("#Resource option:selected").text();

        if (selectedCategory == "Publicar Nuevo Archivo") {
            //Display upload Panel
            setPanel("", "", "", "", "");
        }


        // falta validación
        resourseID = $("#Resource > option:selected").attr("value");
        $('#editor').html("");
        if (typeof (resourseID) == 'undefined') {
            
            return 0;
        }


       //Send Local Path, image Name when image is Index Sectio in resource Click
        var publication =
         {
             'idResource': resourseID,
         }

        $.post("/Home/getPublicationInfo/", publication, function (data) {
            console.log(data);
            idPublication = data.idPublication;
            idDisplayMode = data.idDisplayMode;
            var image, imgMovil, interprtationIMG;        

            if (data.State == 1) {
               // $("#radioActive").prop('checked', true);
                // $("#radioInactive").prop('checked', false);
                toggleOn();
            }
            else {
             //   $("#radioInactive").prop('checked', true);
                //   $("#radioActive").prop('checked', false);
                toggleOff();
            }

            $('#txtTitulo').val(data.title);
            $('#txtInterpretation').append(data.interpretation);
            //Set position
            console.log("Pos: "+data.pos);
            $("#Position").val(data.pos);
           
            if (data.img != "") {
                //class="imagelist img-fluid" width="100%" height="100%" 
                $('#txtInterpretation').append(data.interpretationIMG);
                $('#editor').append("<img src='data:image/jpeg;base64," + data.img + "'>");
                data.img = "<img class='center-block img-responsive' src='data:image/jpeg;base64," + data.img + "'>";

            }

            $('#editor').append(data.interpretation);

           

            $("#txtAuthorEmail").html("Autor: "+ data.authorEmail + "<br>   última actualización: " + data.pubDate);
            $("#lblTitulo").html(data.title);
            //$("#visualizePanel").html(image);
            setPanel(data.title, data.interpretation, data.source, data.idPublication, data.img, data.OriginalURL,data.idDisplayMode);
        });
    };


    $("#txtTitulo").keyup(function () {
        var text = $(this).val();
        $("#lblTitulo").html(text);
    });

    $("#editor").keyup(function () {
        var text = $(this).text();
        $("#txtInterpretation").html(text);
    });


    //radio buttons validation
    $("#radioActive").change(function () {
        //clean dropdowns
        $("#Sections").html("<option>Seleccione aqu&iacute;</option>");
        $("#Resource").html("<option>Seleccione aqu&iacute;</option>");
        $("#Position").html("<option>Seleccione aqu&iacute;</option>");
        getClimaticData(1);
        $("#radioInactive").prop('checked', false);
    });

    $("#radioInactive").change(function () {
        //clean dropdowns
        $("#Sections").html("<option>Seleccione aqu&iacute;</option>");
        $("#Resource").html("<option>Seleccione aqu&iacute;</option>");
        $("#Position").html("<option>Seleccione aqu&iacute;</option>");
        getClimaticData(0);
        $("#radioActive").prop('checked', false);
    });


    function displayClimaticData(state) {


        getClimaticData(state);
    }


    function displayClimaticData(state) {

    }

    $('#statusCheck').change(function () {

        var message = "";
        if($(this).prop('checked')){
            message = "Publicación Activada";
        }
        else{
            message = "Publicación Desactivada";
        }
            //Eliminar Publicaci&oacute;n
        $('#StatusText').html(message);
        console.log(true);
    })


    $("#btEnviar").click(function () {
        var errors = [];
        var isIndex = 0;

        //Set up File Type
        if ($("#Category option:selected").text() == "Inicio" && $("#Resource option:selected").text() != "WindyTV") {
            if ($("#Resource option:selected").text() != "Gestores de PIACT") {
                isIndex = 1;
            }
        }
        if ($("#Category option:selected").text() == "Inicio" && $("#Resource option:selected").text().includes("Slide")) {
            if ($("#txtLink").val().includes("youtube")) {
                idDisplayMode = 2;
                isIndex = 3;
            }
        }
        if ($("#Sections option:selected").text() == "Biblioteca" && $("#Resource option:selected").text() == "Publicar Nuevo Archivo") { isIndex = 2 }
        if (idDisplayMode == 3) { isIndex = idDisplayMode }
        //Upload IMAGES to Index or Default cases
        var imgIndex = undefined;


  
        if (isIndex == 1 || isIndex == 2)
        {
            imgIndex = $('#visualizePanel').find('img')[0]["src"];//Img from panel
            if (isIndex == 2) {
                IndexSource =  $('#visualizePanel').find('input')[0].files[0].name;
            }
           //If image is the same one already uploaded do not upload
            if (imgIndex.includes(IndexSource) && IndexSource.length > 0) {
               //Not load the image
               imgIndex = null;
            }
        

        }
            //IMAGE TAG IS YOUTUBE LINK!!!!!
        else if (isIndex == 3) {
            //IMAGE TAG IS YOUTUBE LINK!!!!!
             imgIndex = $("#txtLink").val();
        }
        else {
            //Set new windity source
            if ($("#Resource option:selected").text() == "WindyTV") {
                imgIndex = $('#visualizePanel').find('iframe')[0].src;
                imgIndex = JSON.stringify((imgIndex));
                isIndex = 3;//displayMode
            }
            else {
                IndexSource = "";
                imgIndex = $('#editor').find('img')[0];//Image from Editor
                //Regular images update, set Base value
                imgIndex = JSON.stringify(getBase64Image(imgIndex));
            }
         }

      
        //Initialize Json Data
        var imgDATA = imgIndex,
            titleText = $("#lblTitulo").text(),
            interpretationText = $("#editor").text(),
            State = $('#statusCheck').prop("checked");
        if (State == true) {
            State = 1;
        }
        else {
            State = 0;
        }

        //Load Json
        var publication =
        {
            'title': titleText,
            'idPublication': idPublication,
            'idResource': resourseID,
            'interpretation': interpretationText,
            'img': imgDATA,
            'State': State,
            'tagType': IndexSource,
            'idDisplayMode': isIndex
        }

        //resourceID can be undefined only when I create a File Publication
        if (typeof (resourseID) == 'undefined' && isIndex !=2) {
            errors.push("No ha seleccionado el recurso");
        }
        //Validating...
       if (interpretationText.length < 20) {
            errors.push("La interpretacion es muy corta");
        }
    
        if (titleText.length < 8) {
            errors.push("El titulo es muy corto");
        }
        
        // If No errors
        if (errors.length == 0) {
            //Submit File to Biblioteca
            if (isIndex == 2) {
                uploadFilePub(publication);
            }
            else {
                //Submit Regular Publication
                $.post("/Publisher/setPublicationInfo/", publication, function (response) {
                    //console.log(response);
                    if (response == true) {
                        var html = "La publicación se actualizo satisfactoriamente, la pagina se refrescara en cinco segundos";
                        $('#msgTitle').html(html);
                        $('#msgBody').modal('show');
                        setTimeout(function () {
                            window.location.reload(false); 
                        }, 5000);
                    } else {
                        var html = "Huvo un error al guardar los cambios en la publicación, por favor intente nuevamente";
                        $('#msgTitle').html(html);
                        $('#msgBody').modal('show');
                    }

                    //Reload data on change event
                    if ($("#radioActive").prop('checked')) {
                        $("#radioActive").trigger('change');
                    }
                    else {
                        $("#radioInactive").trigger('change');
                    }

                    idDisplayMode = 0;
                }, 'json');
            }

        }
        else
        {
            //Show error message
            var html = "";
            for (var i = 0; i < errors.length; i++) {
                html += errors[i] + "<br>";
            }

            $('#msgTitle').html(html);

            $('#msgBody').modal('show');

        }

    });


    $('#editor').bind("DOMSubtreeModified", function () {
        var imgLength = $("#editor").find('img').length;

        if (imgLength > 1) {
            $($("#editor").find('img')[0]).remove();
        }
    });

    //focus event


    function getBase64Image(imgElem) {
        try{

        
            // imgElem must be on the same server otherwise a cross-origin error will be thrown "SECURITY_ERR: DOM Exception 18"
            var canvas = document.createElement("canvas");
            canvas.width = imgElem.clientWidth;
            canvas.height = imgElem.clientHeight;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(imgElem, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }
        catch(e)
        {
            return  
        }
    };




    function setPanel(title, interpretation, source, idPublication, interpretarionIMG, OriginalURL,idDisplayMode) {

        var imageTag = "";
        var interpretacionTagName = "Interpretaci&oacute;n";

        ////Video y windity
        //if (idPublication == 5 ) {
        //    imageTag =
        //  "<iframe class='visible-xs img-responsive img-thumbnail img-rounded crop'   src='" + source + "'width='600' height='400'  frameborder='0'></iframe>" +
        //  "<iframe class='visible-lg-block center-block img-rounded' src='" + source + " 'width='600' height='400' frameborder='0'></iframe>";
        //    interpretacionTagName = "Descripci&oacute;n";
        //}
        //TITLE
        if (idDisplayMode == 3) {
            console.log(title);
        }//Plumas ENOS
        else if (idPublication == 66 || idPublication == 67) {

            imageTag = ""; //initializing the variable, to prevent overriting
            //step 1 Split the source list
            var listSrc = source.split("\n"),
                tag = "",
                iterator = 1,
                imageList;

            listSrc.pop();
            if (idPublication == 67) { listSrc.shift() };
            $.each(listSrc, function (index, src) {
                //setting all th img group into the main imageTag variable
                tag = "<a href='" + src + "'><img  alt='GFS 925mb Wind'   border='2' width='400' height='300'  src='" + src + "  '></a>";
                imageTag += tag;
            });

        }
        else if ($("#Category option:selected").text() == "Inicio" || $("#Resource option:selected").text() == "Publicar Nuevo Archivo"){
        
            var resource_slide_status = false;
            var resource_name = $("#Resource option:selected").text();
            resource_name = resource_name.toLowerCase();
            var resource_name_ar = resource_name.split(" ");

            if (resource_name == "publicar nuevo archivo" || $.inArray("slider", resource_name_ar) != -1 || $.inArray("slide", resource_name_ar) != -1) {
                //setting all th img group into the main imageTag variable
                imageTag = "<a>"+
                               "<span class='image-preview-input-title'>"+
                                    "<div id='admin-imgorvid-radios-wrapper'>"+
                                        "<div class='form-group group-image'>"+
                                            "<input type='radio' name='imgorvid' value='Imágen'><p>Imágen</p>"+
                                        "</div>";
                                        if (resource_name == "publicar nuevo archivo") {
                                            imageTag += "<div class='form-group group-video'>" +
                                                            "<input type='radio' name='imgorvid' value='Enlace importante'><p>Enlace importante</p>" +
                                                        "</div>";
                                        } else {
                                            imageTag += "<div class='form-group group-video'>" +
                                                            "<input type='radio' name='imgorvid' value='Video de Youtube'><p>Video de Youtube</p>" +
                                                        "</div>";
                                        }                                        
                        imageTag += "</div>"+
                                    "<div id='admin-imgorvid-field-wrapper'>"+
                                        "<div class='form-group group-image'>" +
                                            "<input type='file' accept='image/png, image/jpeg, image/gif' name='input-file-preview'>"+
                                        "</div>" +
                                        "<div class='form-group group-video'>" +
                                            "<input type='text' id='txtLink'>" +
                                        "</div>" +
                                    "</div>"+
                                    "<img class='center-block img-responsive' src='" + source + "'>"+
                                "</span>"
                            "</a>";
            } else {
                //setting all th img group into the main imageTag variable
                imageTag = "<a><span class='image-preview-input-title'><input type='file' accept='image/png, image/jpeg, image/gif' name='input-file-preview'><img  class='center-block img-responsive' src='" + source + "'></a>";
            }
        }
        else if ($("#Resource option:selected").text() == "Publicar Nuevo Archivo") {

            //setting all th img group into the main imageTag variable
            imageTag = "<a><span class='image-preview-input-title'><input type='file' accept='application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf,.pdf,.doc,.pptx' name='input-file-preview'><img  class='center-block img-responsive' src='" + source + "'></a>";

        }
        else if ($("#Sections option:selected").text() == "Biblioteca") {

            //setting all th img group into the main imageTag variable
            imageTag = "<a><span class='image-preview-input-title'><input type='file' accept='application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf,.pdf,.doc,.pptx' name='input-file-preview'><img  class='center-block img-responsive' src='" + OriginalURL + "'></a>";

        }
        else if ($("#Sections option:selected").text() == "Video") {

            //Videos
            imageTag = "<a><span class='image-preview-input-title'><input type='file' accept='application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf,.pdf,.doc,.pptx' name='input-file-preview'><iframe  class='center-block img-responsive' src='" + source + "'></a>";

        }
        else if ($("#Sections option:selected").text() == "Audio") {

            //Audio
            //INIT SOUND CLOUD API CONNECTION
            imageTag =  "<a><span class='image-preview-input-title'><input type='file' accept='application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf,.pdf,.doc,.pptx' name='input-file-preview'><div  class='audioSoundCloud' src='" + decodeURI(source) + "'></div>";
            source = imageTag;
        }
            //Solo imagen
        else {
            imageTag = "<a href='" + source + "'><img  class='center-block img-responsive' src='" + source + "'></a>";
        }

        IndexSource = source;//Send current Index source value (Used on Update Publication)
        var panel = "";


             panel =
             "    <div class='panel-heading ' style='margin-top: 13px;'>" +
             "        <h2 style='font-size: 33px;' class='panel-title' id='lblTitulo'>" + title + "</h2>" +
             "   </div>" +
             "    <div class='well'>" +

                             imageTag +
                            interpretarionIMG +
             "       <br />" +

             "    <div class='panel-heading'>" +
                "<div  id=" + "subPanel" + idPublication + " ></div>" +
             "       <h3 id='lblInterpretation' >" + interpretacionTagName + "</h3>" +
             "       <p id='txtInterpretation' style='font-size:22px;'>" +

             "           " + interpretation +
             "       </p>" +

             "   </div>" +
             "   </div>" +
             "<br>";

            //SET PANEL BY DEFAULT
            $("#visualizePanel").html(panel);
        

        if (idPublication == 84) {

            var ctrlPanel =
              "<td align='center'>" +
              "<FORM action=''>" +
              " <INPUT TYPE=button VALUE='Current' onClick='current()' title='Most recent image'>" +
              " <INPUT TYPE=button VALUE='Step <' onClick='stepb()' title='Back up one frame'>" +
              " <INPUT TYPE=button VALUE=' < ' onClick='animate_b()' title='Loop backward slowly'>" +
              "<INPUT TYPE=button VALUE=' << ' onClick='animate_fb()' title='Loop backward quickly'>" +
              "<INPUT TYPE=button VALUE=' >> ' id='animate_ff' title='Loop forward quickly'>" +
              " <INPUT TYPE=button VALUE=' > ' onClick='animate_f()' title='Loop forward slowly'>" +
              " <INPUT TYPE=button VALUE='Step >' onClick='stepf()' title='Advance forward one frame'>" +
              "<INPUT TYPE=button VALUE='Stop' onClick='stopF()'>" +
              "<br>" +
              "</FORM>" +
             "</td>"

            $("#subPanel" + idPublication).append(ctrlPanel);
            //load the js file       
            $.ajax({
                type: "GET",
                url: "/Scripts/ClimaticPublication/temperature6monthPub84.js",
                dataType: "script",
                cache: true
            });
        }
    }


    $('#visualizePanel').on('change', 'input', function () {
        //do something
        readURL(this);
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#visualizePanel img').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }


    //Updaload Files
    function uploadFilePub(publication) {
        publication.idSection = 32;
        $.post('/Publisher/setInterviewPublicationInfo/', publication, function (response) {
            if (response == true) {
                var html = "La publicación se actualizo satisfactoriamente";
                $('#msgTitle').html(html);
                $('#msgBody').modal('show');
            } else {
                var html = "Huvo un error al guardar los cambios en la publicación, por favor intente nuevamente";
                $('#msgTitle').html(html);
                $('#msgBody').modal('show');
            }

            //Reload data on change event
            if ($("#radioActive").prop('checked')) {
                $("#radioActive").trigger('change');
            }
            else {
                $("#radioInactive").trigger('change');
            }

        });
    };



    

});