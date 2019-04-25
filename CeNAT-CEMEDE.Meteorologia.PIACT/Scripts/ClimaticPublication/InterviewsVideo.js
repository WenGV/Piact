//Class Interviewa Video

$(function () {

    var section = {
        'ID': $("#lblSection").attr("value"),
        'pageNum': $("#pageNum").val(),
        'RowpPage':6
    }

    var eventPosition = $(window).innerHeight();//("#panel").height();// This is the height position you want the event to fire on. 70%
    var lengthVideo = 0;//video count
    var elem = $("#panel");
    var maxScrollTop = elem[0].scrollHeight - elem.outerHeight();
    //console.log(maxScrollTop);

    function setSimplePanel(title, interpretation, source, idPublication, interpretarionIMG, State, publications_amount, counter, img, idDisplayMode) {
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
                    //$("#lblCategory").html(title);
                    //$("#lblSection").html(interpretation);
                }
                else if (section_id === 20) {//idPublication === 5 || section.Name === 20
                    imageTag = "";
                    var idVideo = source.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
                    if (idVideo.length == 11) {
                        var video_img = '<img src="//img.youtube.com/vi/' + idVideo + '/0.jpg" class ="img-responsive img-thumbnail img-rounded crop videoestilo" title = "' + source + '" onClick="showVideo(this);" >';
                        imageTag = video_img;
                    }
                    //"<iframe  class='visible-xs img-responsive img-thumbnail img-rounded crop videoestilo'   src='" + source + "' frameborder='0'></iframe>" +
                    //"<iframe  class='visible-lg-block center-block img-rounded videoestilo' src='" + source + "' frameborder='0'></iframe>";
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

                    //TODO fix this line 
                    var l = listSrc.length - 1;
                    for (var i = 0; i < l; i++) { (listSrc[i] = listSrc[i].replace("set", "sep")); (listSrc[i] = listSrc[i].replace("set", "sep")); }



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
                                "<div class='card-container'><div class='card-header-wrapper'><h4>" + title + "</h4></div><div class='card-image-wrapper'><img class='img-fluid' width='600' height='400' border='2' width='30%' height='30%' src='" + src + "  ' ></div></div > " +//<div class='card-content-wrapper'><p>" + short_interpretation + "</p></div>
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
                                "<div class='card-container'><div class='card-header-wrapper'><h4>" + title + "</h4></div><div class='card-image-wrapper'><img class='img-fluid' width='600' height='400' border='2' width='30%' height='30%' src='" + src + "'></div></div >" +//<div class='card-content-wrapper'><p>" + short_interpretation + "</p></div>
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

                    imageTag = "<a href='#'  data-toggle='modal' data-target='#publication-" + counter + "'><div class='card-container'><div class='card-header-wrapper'><h4>" + title + "</h4></div><div class='card-image-wrapper'><img class='imagelist img-fluid' width='100%' height='100%' src='" + source + "'></div></div></a>" +//<div class='card-content-wrapper'><p>" + short_interpretation + "</p></div>
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
                } else if (section_id == 1 || section_id == 21 || section_id == 22 || section_id == 23 || section_id == 24 || section_id == 25 || section_id == 28 || section_id == 29 || section_id == 30) {
                    //Prints in pairs, counter checks if the publication is the third one or divisible by two
                    //The variable row_counter will make sure a row is started when its value is three, then variable is restarted
                    //If remainder of the division of counter by three isn't zero, meaning the current publicacion isn't the third one
                    if (counter % 2 != 0) {
                        //If the publication is the first one or the first one in the row.
                        if (counter == 1 || row_counter == 2) { panel += "<div class='row'>"; }
                        //Prints the publication within its responsive div
                        panel += "<div class='col-xs-12 col-sm-6 weather-image-column'>" + imageTag + "</div>";
                        //Close row failsafe, in case the number of publications isn't divisible by three
                        if (publications_amount == counter) { panel += "</div>"; }
                        //If row_counter is equal to three, reset its value back to zero, if not add 1 to it.
                        if (row_counter == 2) {
                            //If the amount of publications is bigger than 6, row_counter restarts to one, if not to zero
                            if (publications_amount > 4) { row_counter = 1; } else { row_counter = 0; }
                        } else { row_counter++; }
                    } else {
                        //Add 1 to row_counter.
                        row_counter++;
                        //Prints the publication within its responsive div
                        panel += "<div class='col-xs-12 col-sm-6 weather-image-column'>" + imageTag + "</div></div>";
                    }
                    return panel;
                } else {
                    //Prints in thirds, counter checks if the publication is the third one or divisible by three
                    //The variable row_counter will make sure a row is started when its value is three, then variable is restarted
                    //If remainder of the division of counter by three isn't zero, meaning the current publicacion isn't the third one
                    if (counter % 3 != 0) {
                        //If the publication is the first one or the first one in the row.
                        if (counter == 1 || row_counter == 3) { panel += "<div class='row'>"; }
                        //Prints the publication within its responsive div
                        panel += "<div class='col-xs-12 col-sm-6 col-md-4 weather-image-column vid'>" + imageTag + "<a title = '" + source + "' onClick='showVideo(this);'><h5 class='modal-title' id='myModalLabel'>" + title + "</h5></a>" + "</div>";
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
                        panel += "<div class='col-xs-12 col-sm-6 col-md-4 weather-image-column vid'>" + imageTag + "<a title = '" + source + "' onClick='showVideo(this);'> <h5 class='modal-title' id='myModalLabel'>" + title + "</h5> </a>" + "</div></div>";
                    }
                    return panel;
                }
            }
        }//END State validation
    };

    var getPubCostaRicaCentroAmeric = function (section) {
        $.get('./getPubBySectionPaged/', section, function (data) {
            $("#panel").html("");
            climaticPub = data;
            //console.log(data);


            window.row_counter = 0;
            var publication_panel, publications_amount = data.length, counter = 1, publications = "", interpretarionIMG = "";
            try {
                $.each(data, function (i, publication) {
                    lengthVideo = publication.Total;
                    interpretarionIMG = "";
                    if (publication.img !== "") {
                        interpretarionIMG = "<img  src='data:image/jpeg;base64," + publication.img + "'>";
                    }
                    publication_panel = setSimplePanel(publication.title, publication.interpretation, publication.source, publication.idPublication, interpretarionIMG, publication.State, publications_amount, counter, publication.img, publication.idDisplayMode);
                    if (publication_panel == undefined) { row_counter = row_counter--; } else { counter++; publications += publication_panel; }
                });
                $("#panel").append(publications);
                if (section.ID == 20) { pag(lengthVideo,section.RowpPage); }
            }
            catch (e) {
                eventPosition = 0;
            }

        }, 'json').done(function (data) {
            if ($(".climatic-publication-content").length) {
                //$("body").addClass("loaded");
                /*setTimeout(function () {
                    $("body").addClass("loaded");
                }, 5000);*/
                setTimeout(function () {
                    var row_img = $("#panel.climatic-publication-content .row");
                    //console.log(row_img);
                    $.each(row_img, function (index_row, value_row) {
                        var row_cols = $(value_row).children();
                        //console.log(row_cols);
                        for (var i = 0; i < row_cols.length; i++) {
                            var img = $(row_cols[i]).children().children().children().next().children();
                            //console.log(img);
                            var img_height = img.height();
                            //console.log(img_height);
                        }
                    });
                    $("body").addClass("loaded");
                }, 8000);
            } else if (!$("body").hasClass("home")) {
                setTimeout(function () {
                    $("body").addClass("loaded");
                }, 3000);
            }
        });
    }
    getPubCostaRicaCentroAmeric(section);

    $(document).on("click", "#filter-sat-img-type .selectpais a", function (e) {
        e.preventDefault();
        e.stopPropagation();

        section.Name = $(this).attr("value");

        if (section.Name != "") {
            getPubCostaRicaCentroAmeric(section);
        }
    });


    function fireEvent() {
        // Add logic here to complete what you're trying to do.
        console.log(eventPosition);
        //Below, the request call remaining Publication Post to be displayed
        getPubCostaRicaCentroAmeric();
    };


    'use strict';
    function pag(length, rows) {
        //var itemsNumber = $('#panel .row').length;
        if ($('.current-page').length <= 1) {

            var itemsNumber = length / 3;
            var limitRowPerPage = rows / 3; // Limit of rows per each page
            $('#panel .row:gt(' + (limitRowPerPage - 1) + ')').hide(); //Hide the rows that over limit of the current page
            var totalPages = Math.round(itemsNumber / limitRowPerPage); // Get number of pages
            $(".pagination").append("<li class='current-page active' value ='" + 1 + "' ><a href='javascript:void(0)'>" + 1 + "</a></li>"); // Add first page marker

            // Loop to insert page number for each sets of items equal to page limit (e.g., limit of 4 with 20 total items = insert 5 pages)
            for (var i = 2; i < totalPages; i++) {
                if (i <= 4) {
                    $(".pagination").append("<li class='current-page' value = '" + i + "' ><a href='javascript:void(0)'>" + i + "</a></li>"); // Insert page number into pagination tabs
                }
                else {
                    if (i <= totalPages) {
                        $(".pagination").append("<li class='current-page hide ' value = '" + i + "' ><a href='javascript:void(0)'>" + i + "</a></li>"); // Insert page number into pagination tabs
                    }
                }
            }
            if (totalPages > 4) {
                $(".pagination").append("<li class='paginationjs-ellipsis disabled'><a>...</a></li>"); // Insert page number into pagination tabs
            }
            if (totalPages > 1) {
                $(".pagination").append("<li class='current-page' value = '" + totalPages + "'><a href='javascript:void(0)'>" + totalPages + "</a></li>"); // Insert page number into pagination tabs

            }
            //disabled previous
            hidePaginationItem(1, totalPages);

            // Add next button after all the page numbers  
            $(".pagination").append("<li id='next-page'><a href='javascript:void(0)' aria-label=Next><span aria-hidden=true>Siguiente</span></a></li>");
        }
        toTop(500);

        // Function that displays new items based on page number that was clicked
        $(".pagination li.current-page").on("click", function () {
            // Check if page number that was clicked on is the current page that is being displayed
            if ($(this).hasClass('active')) {
                return false; // Return false (i.e., nothing to do, since user clicked on the page number that is already being displayed)
            } else {
                var currentPage = $(this).index(); // Get the current page number
                $(".pagination li").removeClass('active'); // Remove the 'active' class status from the page that is currently being displayed
                $(this).addClass('active'); // Add the 'active' class status to the page that was clicked on
                $("#panel .row").remove(); // Hide all items in loop, this case, all the list groups
                var grandTotal = limitRowPerPage * currentPage; // Get the total number of items up to the page number that was clicked on

                var section = {
                    'ID': $("#lblSection").attr("value"),
                    'pageNum': currentPage,
                    'RowpPage': 6
                }

                getPubCostaRicaCentroAmeric(section);

                // Loop through total items, selecting a new set of items based on page number
                for (var i = grandTotal - limitRowPerPage; i < grandTotal; i++) {
                    $("#panel .row:eq(" + i + ")").show(); // Show items from the new page that was selected
                }
            }
            hidePaginationItem($(this).val(), totalPages);
        });

        // Function to navigate to the next page when users click on the next-page id (next page button)
        $("#next-page").on("click", function () {
            var currentPage = $(".pagination li.active").index(); // Identify the current active page
            // Check to make sure that navigating to the next page will not exceed the total number of pages
            if (currentPage >=  totalPages || totalPages == undefined) {
                return false; // Return false (i.e., cannot navigate any further, since it would exceed the maximum number of pages)
            } else {
                currentPage++; // Increment the page by one
                $(".pagination li").removeClass('active'); // Remove the 'active' class status from the current page
                $("#panel .row").remove(); // Hide all items in the pagination loop
                var grandTotal = limitRowPerPage * currentPage; // Get the total number of items up to the page that was selected

                var section = {
                    'ID': $("#lblSection").attr("value"),
                    'pageNum': currentPage,
                    'RowpPage': 6
                }

                getPubCostaRicaCentroAmeric(section);

                // Loop through total items, selecting a new set of items based on page number
                for (var i = grandTotal - limitRowPerPage; i < grandTotal; i++) {
                    $("#panel .row:eq(" + i + ")").show(); // Show items from the new page that was selected
                }

                $(".pagination li.current-page:eq(" + (currentPage - 1) + ")").addClass('active'); // Make new page number the 'active' page
            }
            hidePaginationItem(currentPage, totalPages);
        });

        // Function to navigate to the previous page when users click on the previous-page id (previous page button)
        $("#previous-page").on("click", function () {
            var currentPage = $(".pagination li.active").index(); // Identify the current active page
            // Check to make sure that users is not on page 1 and attempting to navigating to a previous page
            if (currentPage === 1) {
                return false; // Return false (i.e., cannot navigate to a previous page because the current page is page 1)
            } else {
                currentPage--; // Decrement page by one
                $(".pagination li").removeClass('active'); // Remove the 'activate' status class from the previous active page number
                $("#panel .row").remove(); // Hide all items in the pagination loop
                var grandTotal = limitRowPerPage * currentPage; // Get the total number of items up to the page that was selected

                var section = {
                    'ID': $("#lblSection").attr("value"),
                    'pageNum': currentPage,
                    'RowpPage': 6
                }

                getPubCostaRicaCentroAmeric(section);

                // Loop through total items, selecting a new set of items based on page number
                for (var i = grandTotal - limitRowPerPage; i < grandTotal; i++) {
                    $("#panel .row:eq(" + i + ")").show(); // Show items from the new page that was selected
                }

                $(".pagination li.current-page:eq(" + (currentPage - 1) + ")").addClass('active'); // Make new page number the 'active' page
            }
            hidePaginationItem(currentPage, totalPages);
        });
    }

    function hidePaginationItem(index, totalPages) {
        if (index == 1) {
            $("#previous-page").addClass('disabled');
            $("#next-page").removeClass('hide');
        }
        else {
            if (index >= totalPages) {
                $("#next-page").addClass('hide');
            } else {
                $("#next-page").removeClass('hide');
            }

            $("#previous-page").removeClass('disabled');
        }
        var position = 0;
        if (index >= 4) {
            for (var i = index; i <= index + 2; i++) {
                var element = $(".pagination").find("[value=" + i + "]").removeClass('hide');
                if (i >= (totalPages - 1)) {
                    $(".pagination").find(".paginationjs").addClass('hide');
                }
            }
        }
    }

});

//Function: Set video selected to iframe "fr" and play the video
function showVideo(object) {
    toTop(480);

    var src = object.title;
    src = src.split("?show")[0];
    $('#fr').attr('src', src + '?autoplay=1');
    $("#panelIframe").fadeIn("slow");


    var id = parseInt(object.id);
    var result = $.grep(climaticPub, function (element, index) {
        return (element.idPublication === id);
    });
    localStorage.setItem('selectedVideo', JSON.stringify(result[0]));
    //$(".ytp-button").trigger("click");
}

function toTop(Interval) {
    $('html, body').animate({ scrollTop: Interval }, 600);
};
