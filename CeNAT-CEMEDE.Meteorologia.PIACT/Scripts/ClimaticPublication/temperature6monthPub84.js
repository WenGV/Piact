window.addEventListener('load', function (event) {


    var btnAnimate_ff = document.getElementById("animate_ff");
    btnAnimate_ff.addEventListener("click", function () {

        animate_ff();
    }, false);



    MAX_FRAMES = 20;
    var j = 0;
    var frame = 0;
    var timeout_id = null;
    var mainLink = "http://www.cpc.ncep.noaa.gov/products/international/cpci/data/12/";
    var images = new Array(MAX_FRAMES);
    for (var i = 0; i < MAX_FRAMES; i++) {
        images[i] = new Image();
        J = (i + 1) * 6;
        if (J == 6) {
            images[i].src = mainLink + "gfs.t12z.925mb_wind.f006.camerica" + ".gif";
        }
        else if (J > 6 && J <= 96) {
            images[i].src = mainLink + "gfs.t12z.925mb_wind.f0" + J + ".camerica" + ".gif";
        }
        else {
            images[i].src = mainLink + "gfs.t12z.925mb_wind.f" + J + ".camerica" + ".gif";
        }
    }

    // Now get to the functions
    function animate_ff() {
        console.log("1");
        document.animation.src = images[frame].src;
        //$('#animation').attr('src', images[frame].src);
        frame = (frame + 1) % MAX_FRAMES;
        if (frame == 0) {
            if (timeout_id) clearTimeout(timeout_id);
            timeout_id = setTimeout("animate_ff()", 3000);
        }
        else {
            if (timeout_id) clearTimeout(timeout_id);
            timeout_id = setTimeout("animate_ff()", 150);
        }
    }

    function animate_f() {
        document.animation.src = images[frame].src;
        frame = (frame + 1) % MAX_FRAMES;

        if (frame == 0) {
            if (timeout_id) clearTimeout(timeout_id);
            timeout_id = setTimeout("animate_f()", 3000);
        }
        else {
            if (timeout_id) clearTimeout(timeout_id);
            timeout_id = setTimeout("animate_f()", 700);
        }
    }

    function animate_fb() {
        frame = (frame - 1) % MAX_FRAMES;
        if (frame < 0) frame += MAX_FRAMES;
        document.animation.src = images[frame].src;
        if (frame == 0) {
            if (timeout_id) clearTimeout(timeout_id);
            timeout_id = setTimeout("animate_fb()", 3000);
        }
        else {
            if (timeout_id) clearTimeout(timeout_id);
            timeout_id = setTimeout("animate_fb()", 150);
        }
    }

    function animate_b() {
        frame = (frame - 1) % MAX_FRAMES;
        if (frame < 0) frame += MAX_FRAMES;
        document.animation.src = images[frame].src;
        if (frame == 0) {
            if (timeout_id) clearTimeout(timeout_id);
            timeout_id = setTimeout("animate_b()", 3000);
        }
        else {
            if (timeout_id) clearTimeout(timeout_id);
            timeout_id = setTimeout("animate_b()", 350);
        }
    }


    function stopF() {
        if (timeout_id) clearTimeout(timeout_id); timeout_id = null;
    }
    function stepf()
    {

        frame = (frame + 1) % MAX_FRAMES;
        if (frame < 0) frame += MAX_FRAMES;
        document.animation.src = images[frame].src;
        if (timeout_id) clearTimeout(timeout_id);
    }

    function stepb() {
        frame = (frame - 1) % MAX_FRAMES;
        if (frame < 0) frame += MAX_FRAMES;
        document.animation.src = images[frame].src;
        if (timeout_id) clearTimeout(timeout_id);
    }

    function current() {
        frame = MAX_FRAMES - 1;
        document.animation.src = images[frame].src;
    }

    function gonote()
    { open(href = "http://www.cpc.ncep.noaa.gov/products/hurricane/hurricane-AMMA/anim_trouble.html", menubar = "no", "width=700,height=250,resizable,scrollbars") }


}, false);