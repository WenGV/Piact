$(function () {



    //on load, set the Category and Section's select tag
    //Var local
    var publication;
    var error = [];


    function setPanel(title, interpretation, source, idPublication, interpretarionIMG) {
        publication.source = source;
        var imageTag = "";


        //Video y windity
        if (idPublication === 20) {
            imageTag =
          "<div class='divvideoclass' ><iframe   src='" + source + "' frameborder='0' allowfullscreen></iframe></div>" ;
          /*"<iframe class='visible-lg-block center-block img-rounded' src='" + source + " 'width='600' height='400' frameborder='0'></iframe>";*/
        }

            //para Uadio
        else if (idPublication === 19) {
            imageTag = "<div class='audioSoundCloud' frameborder='0' allowfullscreen>" +source+"</div>";
            //imageTag = "<div class='audioSoundCloud'>" +source+"</div>";
        }


        var panel =
           "<div class=''>" +

           "    <div class='panel-heading ' style='margin-top: 13px;'>" +
           "        <h2 id='lblTitulo' style='font-size: 33px;' class='panel-title'>" + title + "</h2>" +
           "   </div>" +
           "    <div class='well'>" +
                           imageTag +
           "       <br />" +

           "    <div class='panel-heading'>" +
              "<div  id=" + "subPanel" + idPublication + " ></div>" +
           "       <h3>Descripci&oacute;n</h3>" +
           "       <p id='lblDescripcion' style='font-size:22px;'>" +
           "           " + interpretation + "  " + interpretarionIMG +
           "       </p>" +

           "   </div>" +
           "   </div>" +

           "</div>" +
           "<br>";
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

    $("#btVisualize").on("click", function () {
        if ($("#txtTitulo").val() !== "" && $("#podcastTXT").val() !== "" && $("#descriptionTXT").val() !== "") {
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
                            'idPublication': 20,
                            'source': '',
                            'interpretation': $("#descriptionTXT").val()
                        }
                        if (yos === "youtube.com" || yos === "www.youtube.com") {
                            if (aorv_route !== "") {
                                var video_embed = aorv_route.replace("watch?v=", "embed/");
                                $('#btEnviar').removeAttr('disabled');
                                publication.source = "https://" + yos + "/" + video_embed;
                                if (publication.idPublication !== 0) {
                                    setPanel(publication.title, publication.interpretation, publication.source, publication.idPublication, "");
                                }
                            } else {
                                error.push("El video no tiene el formato adecuado, copia correctamente un link válido de youtube");
                            }
                        } else if (yos === "soundcloud.com" || yos === "www.soundcloud.com") {
                            if (aorv_route !== "") {
                                publication.idPublication = 19;

                                var audio_route = aorv[aorv.length - 2] + "/" + aorv[aorv.length - 1];
                                //console.log(audio_route);
                                $('#btEnviar').removeAttr('disabled');
                                var mySource = "https://" + yos + "/" + audio_route;
                                //var mySource = $("#podcastTXT").val();
                                //console.log(mySource);

                                //INIT SOUND CLOUD API CONNECTION
                                SC.initialize({
                                    client_id: '250862962'
                                });

                                var track_url = mySource;
                                //var track_url = $("#podcastTXT").val();
                                SC.oEmbed(track_url, { auto_play: true }).then(function (oEmbed) {
                                    //console.log('oEmbed response: ', oEmbed.html);
                                    publication.source = $("#podcastTXT").val(); //mySource.slice(71, mySource.length).replace('"></iframe>', "");
                                    if (publication.idPublication !== 0) {
                                        setPanel(publication.title, publication.interpretation, oEmbed.html, publication.idPublication, "");
                                    }
                                });
                                
                            } else {
                                error.push("El potcast no tiene el formato adecuado, copia correctamente un link válido de soundcloud");
                            }
                        }
                    }
                }
            }
        }
    });

    //visualize publication
    /*$("#btVisualize").click(function () {

       


        publication = {
            'title' : $("#txtTitulo").val(),
            'idPublication': $("#Section > option:selected").attr("value"),
            'source': '',
            'interpretation': $("#descriptionTXT").val()
        }
        if ($("#podcastTXT").val() != "") {
            var idPublication = $("#Section > option:selected").attr("value");
            if (idPublication == 20) {
                var potcastDATA = $("#podcastTXT").val();
                //is video from youtube
                if (potcastDATA.indexOf("https://www.youtube.com/watch?v=") != -1) {
                    $('#btEnviar').removeAttr('disabled');
                    publication.source = potcastDATA.replace("watch?v=", "embed/");
                    setPanel(publication.title, publication.interpretation, publication.source, idPublication,"");

                } else {
                    error.push("El video no tiene el formato adecuado, copia correctamente un link válido de youtube");
                }
            }
            else if (idPublication == 19) {
   

                var potcastDATA = $("#podcastTXT").val();
                if (potcastDATA.indexOf("https://soundcloud.com/") != -1) {
                    $('#btEnviar').removeAttr('disabled');
                    var mySource = $("#podcastTXT").val();

                    //INIT SOUND CLOUD API CONNECTION
                    SC.initialize({
                        client_id: '250862962'
                    });

                    var track_url = $("#podcastTXT").val();
                    SC.oEmbed(track_url, { auto_play: true }).then(function (oEmbed) {
                        console.log('oEmbed response: ', oEmbed);
                        publication.source = $("#podcastTXT").val(); //mySource.slice(71, mySource.length).replace('"></iframe>', "");
                        setPanel(publication.title, publication.interpretation, oEmbed.html, idPublication, "");
                    });


                   
                }
                else {
                    error.push("El potcast no tiene el formato adecuado, copia correctamente un link válido de soundcloud");
                }

            }else{
                error.push("No selecciono la opción ");
            }
        } else { error.push("No hay texto de podcasr");}

        if (error.length != 0) {
            var errorData;
            for (var i = 0; i < error.length; i++) {
                errorData += error[i] + "<br>";
            }
            alert(errorData);
        }
        console.log(publication);


    });*/

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

    $("#btEnviar").click(function () {

        publication.title = $("#txtTitulo").val();
        publication.interpretation = $("#descriptionTXT").val();

        publication.source = encodeURI(publication.source);
        console.log(publication);
        $.post('/Publisher/setInterviewPublicationInfo/', publication, function (res) {
            if (res === "true") alert("si")
            else alert("error");
        });  
    });

});