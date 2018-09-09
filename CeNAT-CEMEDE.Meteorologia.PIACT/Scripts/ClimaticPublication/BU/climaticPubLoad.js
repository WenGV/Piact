$(function () {

    var section = {
        'Name': $("#lblSection").attr("value")
    }

    var eventPosition = $(window).innerHeight();//("#panel").height();// This is the height position you want the event to fire on. 70%

    var elem = $("#panel");
    var maxScrollTop = elem[0].scrollHeight - elem.outerHeight();
    console.log(maxScrollTop);

    function setSimplePanel(title, interpretation, source, idPublication, interpretarionIMG, State, publications_amount, counter, img,idDisplayMode) {
        var short_int_num_words = 6;
        var section_id = parseInt($("#lblSection").attr("value"));
        var short_interpretation_ar = interpretation.split(" ");
        var short_interpretation = "";
        for (var i = 0; i < short_int_num_words; i++) {
            if (short_interpretation_ar[i] != undefined && interpretation != "") {
                short_interpretation += short_interpretation_ar[i] + " ";
            }
        }
        if (short_interpretation == "") {
            short_interpretation = "";
        } else {
            short_interpretation += "...";
        }
        if (State === 1 && interpretation != "" || State === 1 && idDisplayMode == 3) {
            if (title != "") {
                //console.log(State);
                var list = interpretation.split("..");
                interpretation = "";
                $.each(list, function (index, value) {
                    interpretation += value + "<br><br>";
                });
                var imageTag = "";
                var interpretacionTagName = "Interpretaci&oacute;n";


                //Video y windity

                if (idDisplayMode == 3) {
                    $("#lblCategory").html(title);
                    $("#lblSection").html(interpretation);
                }
                else if (section_id === 20) {//idPublication === 5 || section.Name === 20
                    imageTag =
                        "<iframe  class='visible-xs img-responsive img-thumbnail img-rounded crop videoestilo'   src='" + source + "' frameborder='0'></iframe>" +
                        "<iframe  class='visible-lg-block center-block img-rounded videoestilo' src='" + source + "' frameborder='0'></iframe>";
                    interpretacionTagName = "Descripci&oacute;n";
                    //para Audio
                } else if (section_id === 19) {
                    imageTag = "<iframe  class='visible-xs img-responsive img-thumbnail img-rounded crop videoestilo'   src='https://w.soundcloud.com/player/?visual=true&amp;url=" + source + "&amp;show_artwork=true&amp;auto_play=false' frameborder='0'></iframe>" +
                        "<iframe  class='visible-lg-block center-block img-rounded videoestilo' src='https://w.soundcloud.com/player/?visual=true&amp;url=" + source + "&amp;show_artwork=true&amp;auto_play=false' frameborder='0'></iframe>";
                    //CASE ENOS PLUMAS
                } else if (idPublication === 66 || idPublication === 67) {

                    imageTag = ""; //initializing the variable, to prevent overriting
                    //step 1 Split the source list
                    var listSrc = source.split("\n"),
                        tag = "",
                        iterator = 1,
                        imageList;

                    listSrc.pop();
                    if (idPublication === 67) { listSrc.shift() };
                    publications_amount = listSrc.length
                    var p_counter = 0, prow_counter = 0, panel = "";
                    //console.log(listSrc.length);
                    $.each(listSrc, function (index, src) {
                        if (index === 0) {
                            p_counter = index + 1;
                            prow_counter = index;
                        }
                        //Prints in thirds, counter checks if the publication is the third one or divisible by three
                        //The variable prow_counter will make sure a row is started when its value is three, then variable is restarted
                        //If remainder of the division of counter by three isn't zero, meaning the current publicacion isn't the third one
                        if (p_counter % 3 !== 0) {
                            if (img !== "") {
                                img = "data:image/jpeg;base64," + img;
                                img = "<img class='imagelist img-fluid' width='100%' height='100%' src='" + img + "'>";
                            }
                            //If the publication isn't the first one or the first one in the row.
                            if (p_counter === 1 || prow_counter === 3) { tag += "<div class='row'>"; }
                            //Prints the publication within its responsive div
                            tag += "<div class='col-xs-12 col-sm-6 col-md-4 weather-image-column'>" +
                                "<a href='#' data-toggle='modal' data-target='#publication-" + idPublication + "-" + p_counter + "'>" +
                                "<div class='card-container'><div class='card-header-wrapper'><h4>" + title + "</h4></div><div class='card-image-wrapper'><img class='img-fluid' width='600' height='400' border='2' width='30%' height='30%' src='" + src + "  ' ></div><div class='card-content-wrapper'><p>" + short_interpretation + "</p></div></div > " +
                                "</a > " +
                                "<div class='modal fade' id='publication-" + idPublication + "-" + p_counter + "' tabindex='- 1' role='dialog' aria-labelledby='myModalLabel'>" +
                                "<div class='modal-dialog' role= 'document'>" +
                                "<div class='modal-content'>" +
                                "<div class='modal-header'>" +
                                "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                                "<h4 class='modal-title' id='myModalLabel'>" + title + "</h4>" +
                                "</div>" +
                                "<div class='modal-body'>" +
                                "<img class='imagelist img-fluid' width='100%' height='100%' src='" + src + "'>" +
                                img +

                                "<p>" + interpretation + "</p>" +
                                "</div > " +
                                "<div class='modal-footer'>" +
                                "<button type='button' class='btn btn-default' data-dismiss='modal'>Cerrar</button>" +
                                "</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>";
                            //Close row failsafe, in case the number of publications isn't divisible by three
                            if (publications_amount === p_counter) { tag += "</div>"; }
                            //If prow_counter is equal to three, reset its value back to zero, if not add 1 to it.
                            if (prow_counter === 3) {
                                //If the amount of publications is bigger than 6, prow_counter restarts to one, if not to zero
                                if (publications_amount > 6) { prow_counter = 1; } else { prow_counter = 0; }
                            } else { prow_counter++; }

                        } else {
                            if (img != "") {
                                img = "data:image/jpeg;base64," + img;
                                img = "<img class='imagelist img-fluid' width='100%' height='100%' src='" + img + "'>";
                            }
                            //Add 1 to prow_counter.
                            prow_counter++;
                            //Prints the publication within its responsive div
                            tag += "<div class='col-xs-12 col-sm-6 col-md-4 weather-image-column'>" +
                                "<a href='#' data-toggle='modal' data-target='#publication-" + idPublication + "-" + p_counter + "'>" +
                                "<div class='card-container'><div class='card-header-wrapper'><h4>" + title + "</h4></div><div class='card-image-wrapper'><img class='img-fluid' width='600' height='400' border='2' width='30%' height='30%' src='" + src + "'></div><div class='card-content-wrapper'><p>" + short_interpretation + "</p></div></div >" +
                                "</a > " +
                                "<div class='modal fade' id='publication-" + idPublication + "-" + p_counter + "' tabindex='- 1' role='dialog' aria-labelledby='myModalLabel'>" +
                                "<div class='modal-dialog' role= 'document'>" +
                                "<div class='modal-content'>" +
                                "<div class='modal-header'>" +
                                "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                                "<h4 class='modal-title' id='myModalLabel'>" + title + "</h4>" +
                                "</div>" +
                                "<div class='modal-body'>" +
                                "<img class='imagelist img-fluid' width='100%' height='100%' src='" + src + "'>" +
                                img +

                                "<p>" + interpretation + "</p>" +
                                "</div > " +
                                "<div class='modal-footer'>" +
                                "<button type='button' class='btn btn-default' data-dismiss='modal'>Cerrar</button>" +
                                "</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>";
                        }
                        //setting all th img group into the main imageTag variable
                        //tag = "<a  target='_blank' href='" + src + "'><img width='600' height='400' alt='GFS 925mb Wind' border='2' width='30%' height='30%'  src='" + src + "  '></a>";
                        //imageTag += tag;
                        p_counter++;
                    });
                    //}//END State validation
                    //Solo imagen
                } else {
                    // width='50%' height='50%'
                    if (img != "") {
                        img = "data:image/jpeg;base64," + img;
                        img = "<img class='imagelist img-fluid' width='100%' height='100%' src='" + img + "'>";
                    }

                    /*
                    "<div class='card-container'>" +
                                        "<div class='card-image-wrapper'>" +
                                            "< img class='imagelist img-fluid' width= '100%' height= '100%' src= '" + source + "' >" +
                                        "</div>" +
                                        "<div class='card-content-wrapper'>" +
                                            "<p>" + interpretation + "</p>" +
                                        "</div>" +
                                    "</div>" +
                    */

                    imageTag = "<a href='#'  data-toggle='modal' data-target='#publication-" + counter + "'><div class='card-container'><div class='card-header-wrapper'><h4>" + title + "</h4></div><div class='card-image-wrapper'><img class='imagelist img-fluid' width='100%' height='100%' src='" + source + "'></div><div class='card-content-wrapper'><p>" + short_interpretation + "</p></div></div></a>" +
                        "<div class='modal fade' id='publication-" + counter + "' tabindex='- 1' role='dialog' aria-labelledby='myModalLabel'>" +
                        "<div class='modal-dialog' role= 'document'>" +
                        "<div class='modal-content'>" +
                        "<div class='modal-header'>" +
                        "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                        "<h4 class='modal-title' id='myModalLabel'>" + title + "</h4>" +
                        "</div>" +
                        "<div class='modal-body'>" +
                        "<a href='" + source + "' data-lightbox='climatic-image-" + counter + "' data-title='" + interpretation + "'><img class='imagelist img-fluid' width='100%' height='100%' src='" + source + "'></a>" +
                        img +

                        "<p>" + interpretation + "</p>" +
                        "</div > " +
                        "<div class='modal-footer'>" +
                        "<button type='button' class='btn btn-default' data-dismiss='modal'>Cerrar</button>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</div>";
                    //imageTag = "<a target='_blank' href='" + source + "' ><img class='imagelist' width='100%' height='100%' src='" + source + "'></a>";
                }

                var panel = "";
                if (idDisplayMode == 3) {

                    //panel = "";
                }
                else if (idPublication === 66 || idPublication === 67) {
                    if (counter == 1) {
                        tag += "<hr class='star- primary'>";
                    }
                    panel = tag;
                    return panel;
                } else {
                    //Prints in thirds, counter checks if the publication is the third one or divisible by three
                    //The variable row_counter will make sure a row is started when its value is three, then variable is restarted
                    //If remainder of the division of counter by three isn't zero, meaning the current publicacion isn't the third one
                    if (counter % 3 != 0) {
                        //If the publication is the first one or the first one in the row.
                        if (counter == 1 || row_counter == 3) { panel += "<div class='row'>"; }
                        //Prints the publication within its responsive div
                        panel += "<div class='col-xs-12 col-sm-6 col-md-4 weather-image-column'>" + imageTag + "</div>";
                        //Close row failsafe, in case the number of publications isn't divisible by three
                        if (publications_amount == counter) { panel += "</div>"; }
                        //If row_counter is equal to three, reset its value back to zero, if not add 1 to it.
                        if (row_counter == 3) {
                            //If the amount of publications is bigger than 6, row_counter restarts to one, if not to zero
                            if (publications_amount > 6) { row_counter = 1; } else { row_counter = 0; }
                        } else { row_counter++; }
                    } else {
                        //Add 1 to row_counter.
                        row_counter++;
                        //Prints the publication within its responsive div
                        panel += "<div class='col-xs-12 col-sm-6 col-md-4 weather-image-column'>" + imageTag + "</div></div>";
                    }
                    return panel;
                }
            }
        }//END State validation
    };

    var getPubCostaRicaCentroAmeric = function (section)
    {
        $.post('/getPubBySection/', section, function (data) {
            $("#panel").html("");
            climaticPub = data;
            console.log(data);


            window.row_counter = 0;
            var publication_panel, publications_amount = data.length, counter = 1, publications = "", interpretarionIMG = "";
            try {
                $.each(data, function (i, publication) {
                    interpretarionIMG = "";
                    if (publication.img !== "") {
                        interpretarionIMG = "<img  src='data:image/jpeg;base64," + publication.img + "'>";
                    }
                    publication_panel = setSimplePanel(publication.title, publication.interpretation, publication.source, publication.idPublication, interpretarionIMG, publication.State, publications_amount, counter, publication.img, publication.idDisplayMode);
                    if (publication_panel == undefined) { row_counter = row_counter--; } else { counter++; publications += publication_panel; }                    
                });
                $("#panel").append(publications);
            }
            catch (e) {
                eventPosition = 0;
            }

        }, 'json').done(function (data) {
            if (!$("body").hasClass("home")) {
                setTimeout(function () {
                    $("body").addClass("loaded");
                }, 3000);
            }
        });
    }
    getPubCostaRicaCentroAmeric(section);



    //Row's Button is clicked
    /*$(document).on("click", ".filter-sat-img-type .col-md-3 button", function filterByCountry() {
       
        section.Name = this.id;
        
        if (section.Name != "") {
            getPubCostaRicaCentroAmeric(section);
        }    
    });*/

    $(document).on("click", "#filter-sat-img-type .selectpais a", function (e) {
        e.preventDefault();
        e.stopPropagation();

        section.Name = $(this).attr("value");

        if (section.Name != "") {
            getPubCostaRicaCentroAmeric(section);
        }  
    });


    //$(window).scroll(function (e) {
    //    if (eventPosition != 0) {
    //        //If the screen is on 60% displayed, load the next part of
    //        if ($(this).scrollTop() > eventPosition) {
    //        //if ((($("#panel").outerHeight() - 796) == ($(this).scrollTop())) && (!endRun)) {
    //            eventPosition *= 2;
    //            fireEvent();

    //        }
    //    }
    //});
    


    function fireEvent() {
        // Add logic here to complete what you're trying to do.
        console.log(eventPosition);
        //Below, the request call remaining Publication Post to be displayed
        getPubCostaRicaCentroAmeric();
    };

});
