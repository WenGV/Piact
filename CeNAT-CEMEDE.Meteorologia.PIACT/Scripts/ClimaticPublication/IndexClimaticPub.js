$(function () {
    
    var section = {
        'Name': $("#lblSection").attr("value")
    }
    getPubCostaRicaCentroAmeric(section);


    function getPubCostaRicaCentroAmeric (section)
    {
        
        $.post('/getPubBySection/', section, function (data) {
            $("#panel").html("");
            climaticPub = data;
            console.log(data);



            var publication_panel, publications_amount = data.length, counter = 1, publications = "", interpretarionIMG = "";
            console.log(publications_amount);
            try {
                $.each(data, function (i, publication) {
                    //Slidder
                    if (publication.idDisplayMode == 2) {
                        setSliderPanel(publication.title, publication.interpretation, publication.source, publication.OriginalURL, counter, publications_amount);
                        counter++;
                    }
                    else {
                        setSimplePanel(publication.title, publication.interpretation, publication.source, publication.idPublication, publication.img);
                    }
                });
                //playSlider();
                //$("#panel").append(publications);
            }
            catch (e) {
                eventPosition = 0;
            }
           
        }, 'json').done(function (data) {
            setTimeout(function () {
                $("body").addClass("loaded");
            }, 10000);
        });;
    }

    function setSliderPanel(title, interpretation, source, OriginalURL, counter, pubs_amount) {
        if (OriginalURL == "") { OriginalURL = "#"; }
        //If source isn't empty
        if (source.length > 0) {
            //Splits the video url or image route/url
            var imgorvid = source.split("/");
            //If the array contains a youtube video url goes through, if not it's an image
            if ($.inArray("www.youtube.com", imgorvid) != -1) {
                    var youtubeID = "//img.youtube.com/vi/" + (source.substring(32)) +"/hqdefault.jpg";  //"//img.youtube.com/vi/OiC_5NJjzCo/hqdefault.jpg";

                    var slider =
                        " <div class='owl-item active' data-video='" + source + "' style='width: 100%;'>" +
                        "   <div class='item-video' style='height: 585.063px;'>" +
                        "      <div class='owl-video-wrapper'>" +
                        "         <a class='owl-video' href='" + source + "' style='display: none;'>" +

                        "        </a>" +
                        "       <div class='owl-video-play-icon'></div>" +
                        "      <div class='owl-video-tn' style='opacity:1;background-image:url(" +youtubeID+")'></div>" +
                        " </div>" +
                        "</div>"
                        "</div>";
            } else {
                var slider = "<div class='item'>" +
                                 "<img src='" + source + "' alt=''>" +
                                 "<div class='slide-content textbanner'>" +
                                     "<h2 id='slide-"+counter+"-header'>" + title + "</h2>" +
                                     "<p id='slide-"+counter+"-content'>" + interpretation + "</p>" +
                                     "<a id='slide-button-"+counter+"' href='" + OriginalURL + "'>Ver información</a>" +
                                 "</div>" +
                             "</div>";
            }
            $('.owl-carousel').owlCarousel('add', slider).owlCarousel('refresh');



            //        var slide_height = $(".owl-carousel .owl-stage .owl-item:first-child").height();
            //        $(".owl-carousel .owl-item .item-video").css("height", slide_height);

            //if (counter == 3) {
            //setTimeout(function () {
            //        //Gives video wrapper of the same height in the other images
            //        var slide_height = $(".owl-carousel .owl-stage .owl-item:first-child").height();
            //        $(".owl-carousel .owl-item .item-video").css("height", slide_height);
            //    }, 1000);
            //}
        }
    }

    function setSimplePanel(title, interpretation, source, idPublication, img) {

     

            if (idPublication == 5) {
                //Case medium 1
                $("#mediumPubText").html(interpretation);
                $("#mediumPubIMG").attr("src", source);

            }
            else if(idPublication == 159) {
                //case medium 2
               var list = interpretation.split("..");
                interpretation = "";
                $.each(list, function (index, value) {
                    interpretation += value + "<br><br>";
                });
                $("#mediumPubTitle2").html(title);
                $("#mediumPubText2").html(interpretation);
                $("#mediumPubIMG2").html(source);
            }
            else if (idPublication == 175) {
                //case medium 3
                var list = interpretation.split("..");
                interpretation = "";
                $.each(list, function (index, value) {
                    interpretation += value + "<br><br>";
                });
                $("#mediumPubText3").html(interpretation);
            }
            if (idPublication == 332) {
                //case medium 2
                var list = interpretation.split("..");
                interpretation = "";
                $.each(list, function (index, value) {
                    interpretation += value + "<br><br>";
                });
                $("#mediumPubTitle4").html(title);
                $("#mediumPubText4").html(interpretation);
                source = "<img src='" + source + "' class='leftpopimg' />";
                $("#mediumPubIMG4").html(source);
            }
            //Slider
        
    };
});
