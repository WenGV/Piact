var mq_col_xs;
init_fullscreen_slider_responsive_img();
$(window).resize(function () {
    init_fullscreen_slider_responsive_img();
});
function init_fullscreen_slider_responsive_img() {
    mq_col_xs = window.matchMedia("(min-width: 768px)");//JS Media Query
    if (mq_col_xs.matches) {
        //$("#slider .owl-stage-outer .owl-stage img").height($(window).height());
    }
}
function isEmpty(el) {
    return !$.trim(el.html())
}


if ($("#content-manager-container").length) {
    $(".admin #page-content-wrapper .hamburger").on("click", function () {
        if ($(".admin .overlay").css("display") == "block") {
            $("footer").css("bottom", "auto");
        } else if ($(".admin .overlay").css("display") == "none") {
            $("footer").css("bottom", 0);
        }
    });
}


$(window).on('load', function () {
    console.log($(".climatic-publication-images").length);
    if ($("body").hasClass("home")) {
        mq_col_xs = window.matchMedia("(max-width: 768px)");//JS Media Query
        if (mq_col_xs.matches) {
            setTimeout(function () {
                $(".home #hp-windy #mediumPubIMG2 iframe.visible-xs").removeClass("img-responsive");
                $(".home #hp-windy #mediumPubIMG2 iframe.visible-xs").removeClass("img-thumbnail");
                $("body").addClass("loaded");
            }, 3000);
        } else {
            $("body").addClass("loaded");
        }
    } else if ($(".climatic-publication-images").length == 0 && $(".audio-video-interviews").length == 0) {
        $("body").addClass("loaded");
    } else {
        //$("body").addClass("loaded");
    }
    /*setTimeout(function () {
        alert('page is loaded and 1 minute has passed');
    }, 3000);*/ 
});


$("#visualizePanel").on("click", "#admin-imgorvid-radios-wrapper .group-image input",function () {
    if ($("#admin-imgorvid-field-wrapper .group-video").css("display") == "block") {
        $("#admin-imgorvid-field-wrapper .group-video").slideUp();
    }
    $("#admin-imgorvid-field-wrapper .group-image").slideDown();
});
$("#visualizePanel").on("click", "#admin-imgorvid-radios-wrapper .group-video input", function () {
    if ($("#admin-imgorvid-field-wrapper .group-image").css("display") == "block") {
        $("#admin-imgorvid-field-wrapper .group-image").slideUp();
    }
    $("#admin-imgorvid-field-wrapper .group-video").slideDown();
});

$(document).ready(function () {
    if ($(".users-view").length) {
        var users_role = $(".user-view-role");
        for (var i = 0; i < users_role.length; i++) {
            var user_role = $(users_role[i]).text();
            user_role = user_role.replace(/\s+/g, '');
            user_role = user_role.toLowerCase();
            console.log(user_role);
            if (user_role === "administrator") {
                var user_admin = $(users_role[i]);
                user_admin.next().children().css({
                    display: "none",
                    visibility: "hidden"
                });
                user_admin.next().html("");
            }
        }
    }


    $("#panel").on("mouseenter", ".card-container", function () {
        var header_container = $(this).children()[0];
        var img_container = $(this).children().next()[0];
        $(header_container).css("filter", "grayscale(100%)");
        $(img_container).children().css("filter", "grayscale(100%)");
    });
    $("#panel").on("mouseleave", ".card-container", function () {
        var header_container = $(this).children()[0];
        var img_container = $(this).children().next()[0];
        $(header_container).css("filter", "none");
        $(img_container).children().css("filter", "none");
    });

    $(".dropdown-toggle").on("click", function () {
        mq_col_xs = window.matchMedia("(max-width: 768px)");//JS Media Query
        if (mq_col_xs.matches) {
            if ($(this).parent().hasClass("open")) {
                $(this).next().css("display", "block");
            }
            else
            {
                $(this).next().css("display", "none");
            }
        }
    });
    $(".dropdown-submenu-toggle").on("click", function () {
        mq_col_xs = window.matchMedia("(max-width: 768px)");//JS Media Query
        if (mq_col_xs.matches) {
            if ($(this).next().hasClass("open")) {
                $(this).next().removeClass("open");
                $(this).next().css("display", "none");
                //$(this).parent().parent().css("display", "none");
            } else {
                $(this).next().addClass("open");
                $(this).next().css("display", "block");
                //$(this).next().slideDown();
                $(this).parent().parent().parent().css("display", "block");
            }
            //$(this).next().css("display", "block");
            //$(this).next().slideDown();
            //$(this).parent().parent().css("display", "block");
        }
    });
    $("#what-is-windy .titularpd").on("mouseenter", function () {
        $(this).next().slideDown();
    });
    $("#what-is-windy .titularpd").on("mouseleave", function () {
        $(this).next().slideUp();
    });
    //Footer display for not logged in 
    if (!$("body").hasClass("admin")) {
        var footer = $("footer");
        var footer_height = footer.innerHeight();
        footer.css({ height: footer_height });
        $("body").css("margin-bottom", footer_height);
    }
    //If the page loaded is the homepage.

    if($("body").hasClass("home")) {
        $("#piact-offers-container .row").slick({
            arrows: true,
            dots: false,
            infinite: false,
            slidesToScroll: 3,
            slidesToShow: 3,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        arrows: true,
                        dots: false,
                        infinite: false,
                        slidesToScroll: 3,
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        arrows: true,
                        dots: false,
                        infinite: false,
                        slidesToScroll: 2,
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        arrows: true,
                        dots: false,
                        infinite: false,
                        slidesToScroll: 1,
                        slidesToShow: 1
                    }
                }
            ]
        });
    }


});

