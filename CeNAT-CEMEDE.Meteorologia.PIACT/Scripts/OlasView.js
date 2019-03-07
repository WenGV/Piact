﻿//Updated on 28 Aug 2017
var areaObj = { "home": "Home", "region": "Region", "regions": "Regions", "myfav": "Personalize", "wtnew": "What's New", "abtus": "About" };
var selector_list = ', .city_name, .m_city_name, .city_country, .city_local_time, .city_currwx_issuetmie, .city_forecast_issuetime, .city_currwx_issuetime, .city_fc_date, .sunrise_datetime,.city_fc_temp,.max_temp_icon,.min_temp_box,.city_fc_desc, .moonrise_datetime, .sunset_datetime, .moonset_datetime, .city_map_instruction, #remark, #breadcrumb li, #breadcrumb li a';
var member_json_data = null, t = null;
var set_max_item = 4, fav_item_w = 162, sb_margin_left = 2, ts_padding_left = 0, btn_lock = false;
var qsDataSource = [], default_search_text = "Please enter city / country / territory name", searchKey = "", searchValue = "", search_data = null;
var pageLang = localLang = "en";
var GetURLParameter = function GetURLParameter(sParam) { return "1117" }


if (pageLang == 'zh') localLang = 'zh-cn';
if (pageLang == 'tc') localLang = 'zh-tw';
if (pageLang == 'kr') localLang = 'ko';

var cityObj1 = [];
var gray_base_map = "Gray base map";
var capCityObj = null;
var forecastCityObj = null;
var cityObj = null;
var MyLat = 0;
var MyLng = 0;
var base_layer = "The base layer";
var additional_layer = "Additional layers";
var wmotitle = '';
var present_json_data = null;
var list_data = null;
var region_json_data = null;
var forecastObjArr = new Array();
var wmo_on_fb = "WMO on Facebook";

var memberObj = null;
var json_data;
var ra_val;
var regionArray = new Array();
var t1 = null;
var temp_f = "";

var DropDownModel =

    [
        {
            'name': "Costa Rica",
            'value': [
                [1127, "Nicoya"],
                [1125, "Filadelfia"],
                [1124, "Liberia"],
                [1122, "Upala"],
                [1126, "Cañas"],
                [1121, "Los Chiles"],
                [1128, "Puntarenas"],
                [285, "Alajuela"],
                [1114, "Heredia"],
                [1113, "San Jose"],
                [1129, "Quepos"],
                [1115, "Cartago"],
                [1116, "Turrialba"],
                [1120, "Guapiles"],
                [1130, "San Isidro"],
                [1119, "Limon"],
                [1117, "Sixaola"]
            ]
        }
        ,
        {
            'name': "El Salvador",
            'value': [
                [1187, "Acajutla"],
                [1186, "Santa Ana"],
                [1189, "Nueva Concepcion"],
                [282, "San Salvador"],
                [1188, "San Miguel"]
            ]
        }
        ,
        {
            'name': "Honduras",
            'value': [
                [283, "Tegucigalpa"]
            ]
        }
        ,
        {
            'name': "Guatemala",
            'value': [
                [906, "Guatemala City"]
            ]
        }
        ,
        {
            'name': "Nicaragua",
            'value': [[284, "Chinandega"]]
        }
        ,
        {
            'name': "Panamá",
            'value': [
                [1245, "Bocas del Toro"],
                [1241, "David"],
                [1242, "Santiago"],
                [1243, "Los Santos"],
                [1244, "Anton"],
                [1221, "Panama City"]
            ]
        }
    ];
InitializeComponents(DropDownModel);


///
/// Initialize Dropdowns..
///
function InitializeComponents(data) {
    var pather = $('#select1').empty();
    var sons = $('#select2').empty();
    $.each(data, function (i, item) {
        pather.append('<option value="' + i + '">' + item.name + '</option>');

        $.each(item.value, function (j, item) {
            sons.append('<option id="' + item[0] + '" value="' + i + '">' + item[1] + '</option>');
        });
    });

}


//Reference: https://jsfiddle.net/fwv18zo1/
var $select1 = $('#select1'),
    $select2 = $('#select2'),
    $options = $select2.find('option');

$select1.on('change', function () {
    $select2.html($options.filter('[value="' + this.value + '"]'));

    var id = getSelectedCity();
    if (id > 0 && id < 9999) {

        ajax_get_city_info(id);
    }

}).trigger('change');

$select2.on('change', function () {
    var id = getSelectedCity();
    if (id > 0 && id < 9999) {

        ajax_get_city_info(id);
    }
}).trigger('change');


function close_beta(type) {
    if (type == 2) {
        $('.beta_box').css('display', 'none');
    } else {
        $('.beta_box_sun').css('display', 'none');
    }


}

function beta_box(type) {
    var close_btn = '<div class="close_beta" onclick="close_beta(' + type + ')">✖</div>';

    var msg_sun = "The provision of the times of sunrise and sunset in this website is in beta version.<p>The times of sunrise and sunset are calculated using standard algorithm and are generally accurate to within a few minutes.  The accuracy of times is also affected by the actual altitude and location of the observation.</p><p>Because times of sunrise and sunset are calculated in local time, there is a chance that future times may not be correct, as changes might be made to dates of Daylight Saving Time.</p>";
    var msg_weather = "<p>The provision of the current weather information in this website is in beta version.</p>The current weather for cities displayed on this website are derived from weather reports measured at nearby weather stations.  In using the current weather information, users should note that it may be different from actual weather conditions due to various factors, which include but not limited to, difference in topography and altitude of user’s locations and the weather station, and difference in user’s time and observation time of weather report.  Users may refer to the latest weather reports which are available on the website of the National Meteorological and Hydrological Services.";



    if (type == 1) {
        $('.beta_box').css('display', 'none');
        $('.beta_box_sun').css('display', 'block');
        $('.beta_box_sun').html(close_btn + msg_sun);

    }

    if (type == 2) {
        $('.beta_box').css('display', 'block');
        $('.beta_box_sun').css('display', 'none');
        $('.beta_box').html(close_btn + msg_weather);

    }

}


function beta_msg() {

    $('.beta_msg').css('display', 'block');
    if (pageLang == 'ar') {
        $('.beta_msg').html('بيتا');

    }

    if (pageLang == 'en') {
        $('.beta_msg').html('N.B.');
    }

    if (pageLang == 'tc') {
        $('.beta_msg').html('測試');
    }

    if (pageLang == 'zh') {
        $('.beta_msg').html('测试');
    }

    if (pageLang == 'fr') {
        $('.beta_msg').html('Bêta / en test');
    }

    if (pageLang == 'de') {
        $('.beta_msg').html('Beta-Version');
    }

    if (pageLang == 'it') {
        $('.beta_msg').html('Beta');
    }

    if (pageLang == 'kr') {
        $('.beta_msg').html('베타');
    }

    if (pageLang == 'pl') {
        $('.beta_msg').html('wersja testowa');
    }

    if (pageLang == 'pt') {
        $('.beta_msg').html('Beta');
    }

    if (pageLang == 'ru') {
        $('.beta_msg').html('Примечание');
    }

    if (pageLang == 'es') {
        $('.beta_msg').html('Beta');
    }
}

function updateFavBar() {
    var w_w = $(window).width();
    var w_srlbar = ($(document).height() > $(window).height()) ? 17 : 0;
    //w_w -= w_srlbar;
    fav_item_w = 162;
    sb_margin_left = 0;
    ts_padding_left = 0;
    if (w_w < 343) {
        set_max_item = 1;
        fav_item_w = 107;
    } else if (w_w < 380) {
        set_max_item = 2;
        fav_item_w = 107;
    } else if (w_w < 420) {
        set_max_item = 2;
        fav_item_w = 135;
    } else if (w_w < 460) {
        set_max_item = 2;
        fav_item_w = 145;
    } else if (w_w < 480) {
        set_max_item = 2;
        fav_item_w = 162;
    } else if (w_w < 580) {
        set_max_item = 3;
        fav_item_w = 125;
    } else if (w_w < 600) {
        set_max_item = 1;
        sb_margin_left = 72 - (630 - w_w);
        fav_item_w = 158;
    } else if (w_w < 630) {
        set_max_item = 1;
        sb_margin_left = 72 - (630 - w_w);
    } else if (w_w < 695) {
        set_max_item = 2;
        fav_item_w = 115;
        sb_margin_left = 68 - (695 - w_w);
    } else if (w_w < 725) {
        set_max_item = 2;
        fav_item_w = 148;
        sb_margin_left = 32 - (725 - w_w);
    } else if (w_w < 885) {
        set_max_item = 2;
        sb_margin_left = 163 - (885 - w_w);
    } else if (w_w < 1024) {//1024
        set_max_item = 3;
        sb_margin_left = 149 - (1024 - w_w);

        //sb_margin_left = 134 - (1024 - w_w);
    } else {
        set_max_item = 4;
        sb_margin_left = 2;
    }
    /*
   if (w_w < 600) {
        ts_padding_left = (w_w / 2) - ($('#top_searchcontainer').outerWidth() / 2);
    }*/
    $('#fav_item_container li').css({ 'width': fav_item_w + 'px' });
    $('#fav_item_container li a').css({ 'width': fav_item_w + 'px' });
    //$('.fav_item_mask').css({'width': (set_max_item * fav_item_w)+'px'});
    $('#search_box').css({ 'margin-left': sb_margin_left + 'px' });
    $('#top_searchcontainer').css({ 'margin-left': ts_padding_left + 'px' });
    var currentMyFavoritesList = getCookie('myFavorite_e') || sessvars.myFavorite || '';
    var myFavoritesList = currentMyFavoritesList.split('|');

    if (window.innerWidth < 1024) {
        $('.fav_item_mask').css({ 'max-width': '200px' });
    } else {
        if (set_max_item > myFavoritesList.length) {
            $('.fav_item_mask').css({ 'width': (myFavoritesList.length * fav_item_w) + 'px' });
        } else {
            $('.fav_item_mask').css({ 'width': (set_max_item * fav_item_w) + 'px' });
        }

    }

    if (myFavoritesList.length > set_max_item) {
        if (pageLang == 'ar') {
            $('#next_item_btn>span').css({ 'background-position': '-5px 0px' });
            $('#prev_item_btn>span').css({ 'background-position': '-10px 0px' });
        } else {
            $('#next_item_btn>span').css({ 'background-position': '-15px 0px' });
        }
    }

    $('.fav_city_fc_block_mask').css({ 'width': ($('.fav_city_fc_block').width()) + 'px' });
}

function goPrevItem() {
    if (btn_lock)
        return;
    btn_lock = true;
    var currentMyFavoritesList = getCookie('myFavorite_e') || sessvars.myFavorite;
    var myFavoritesList = currentMyFavoritesList.split('|');
    //var myFavoritesList = currentMyFavoritesList_sample.split('|');

    var move_width;
    if (myFavoritesList.length / 4 > 0) {
        move_width = 4 * fav_item_w;
    }

    if (myFavoritesList.length > set_max_item) {


        if (pageLang == 'ar') {
            var curr_margin_right = parseInt($('#fav_item_container').css('margin-right'));

            if (curr_margin_right < 0) {
                $("#fav_item_container").animate({
                    'margin-right': "+=" + move_width
                }, 240, function () {
                    if (parseInt($('#fav_item_container').css('margin-right')) == 0) {
                        $('#prev_item_btn>span').css({ 'background-position': '-15px 0px' });
                    }
                    btn_lock = false;
                });

                $('#next_item_btn>span').css({ 'background-position': '-5px 0px' });

            } else {
                $('#prev_item_btn>span').css({ 'background-position': '-10px 0px' });
                btn_lock = false;
            }

        } else {


            var curr_margin_left = parseInt($('#fav_item_container').css('margin-left'));
            if (curr_margin_left < 0) {
                $("#fav_item_container").animate({
                    'margin-left': "+=" + move_width
                }, 240, function () {
                    if (parseInt($('#fav_item_container').css('margin-left')) == 0) {
                        $('#prev_item_btn>span').css({ 'background-position': '0px 0px' });
                    }
                    btn_lock = false;
                });
                $('#next_item_btn>span').css({ 'background-position': '-15px 0px' });
            } else {
                btn_lock = false;
            }

        }
    } else {
        btn_lock = false;
    }
}

function goNextItem() {
    if (btn_lock)
        return;
    btn_lock = true;
    var currentMyFavoritesList = getCookie('myFavorite_e') || sessvars.myFavorite;
    var myFavoritesList = currentMyFavoritesList.split('|');
    //var myFavoritesList = currentMyFavoritesList_sample.split('|');

    var move_width;
    if (myFavoritesList.length / 4 > 0) {
        move_width = 4 * fav_item_w;
    }


    if (myFavoritesList.length > set_max_item) {

        if (pageLang == 'ar') {

            var curr_margin_right = parseInt($('#fav_item_container').css('margin-right'));
            if (curr_margin_right > (myFavoritesList.length - set_max_item) * fav_item_w * -1) {
                $("#fav_item_container").animate({
                    'margin-right': "-=" + move_width
                }, 240, function () {
                    if (parseInt($('#fav_item_container').css('margin-right')) == (myFavoritesList.length - set_max_item) * fav_item_w * -1) {
                        $('#next_item_btn>span').css({ 'background-position': '-5px 0px' });
                    }
                    btn_lock = false;
                });
                $('#prev_item_btn>span').css({ 'background-position': '-15px 0px' });
            } else {
                $('#next_item_btn>span').css({ 'background-position': '0px 0px' });
                btn_lock = false;
            }
        } else {


            var curr_margin_left = parseInt($('#fav_item_container').css('margin-left'));
            if (curr_margin_left > (myFavoritesList.length - set_max_item) * fav_item_w * -1) {
                $("#fav_item_container").animate({
                    'margin-left': "-=" + move_width
                }, 240, function () {
                    if (parseInt($('#fav_item_container').css('margin-left')) == (myFavoritesList.length - set_max_item) * fav_item_w * -1) {
                        $('#next_item_btn>span').css({ 'background-position': '-10px 0px' });
                    }
                    btn_lock = false;
                });
                $('#prev_item_btn>span').css({ 'background-position': '-5px 0px' });
            } else {
                btn_lock = false;
            }

        }
    } else {
        btn_lock = false;
    }
}
function setSelectedCSS(li_id) {
    $('#fav_item_container a').removeClass('sel');
    $('#fav_item_container li#' + li_id + ' a').addClass('sel');
}

function update_m_my_fav() {
    var select_val = $('#m_my_fav_menu option:selected').val();
    window.location.replace("./city.html?cityId=" + select_val);
}


/*Load MyFavorite city from cookie, get the home city info*/
/*and create each MyFavorite item in Slider*/
function loadMyFavorites(loadHomeCity) {
    /*if(getCookie('homepage_e') != 'default' && (isCookieEnabled && getCookie('myFavorite_e') != null && getCookie('myFavorite_e') != '') || (sessvars.myFavorite != null && sessvars.myFavorite != '') || !loadHomeCity) {*/
    var currentMyFavoritesList = getCookie('myFavorite_e') || sessvars.myFavorite || '';
    var myFavoritesList = currentMyFavoritesList.split('|');
    //var myFavoritesList = currentMyFavoritesList_sample.split('|');

    var favoriteObj;


    if (window.innerWidth < 1024) {
        $('#fav_item_container').css('display', 'none');
        $('#next_item_btn').css('display', 'none');
        $('#prev_item_btn').css('display', 'none');

        var select = $('<select id="m_my_fav_menu" class="m_my_fav_menu" onchange="update_m_my_fav()" ></select>');
        var option;

        for (var i = 0; i < myFavoritesList.length; i++) {


            var favoriteType = myFavoritesList[i].substr(0, myFavoritesList[i].indexOf('#'));
            var cityId = myFavoritesList[i].substr(myFavoritesList[i].indexOf('#') + 1);


            if (favoriteType == "c") {
                if (i == 0 && loadHomeCity) {
                    //     ajax_get_city_info(cityId, !loadHomeCity);
                }
                favoriteObj = getObjects(member_json_data, 'cityId', cityId);


                var fav_city_length = 0; //20170418
                if (pageLang == 'zh' || pageLang == 'tc') {
                    fav_city_length = favoriteObj[0].cityName.indexOf('，')
                } else {
                    fav_city_length = favoriteObj[0].cityName.indexOf(',')
                }

                if (fav_city_length == -1 || fav_city_length == 0) {
                    fav_city_length = favoriteObj[0].cityName.length;
                }

                //display_favorite_name = favoriteObj[0].cityName.substr(0, favoriteObj[0].cityName.indexOf(',') === -1 ? favoriteObj[0].cityName.length : favoriteObj[0].cityName.indexOf(','));
                display_favorite_name = favoriteObj[0].cityName.substr(0, fav_city_length);

                //var sel = '';
                var sel = (i == 0) ? 'sel' : '';

                option = $('<option value="' + favoriteObj[0].cityId + '">' + display_favorite_name + '</option>');
                //if (val == default) {
                //option.attr('selected', 'selected');
                //}
                select.append(option);

            }
        }

        $('.fav_item_mask').html(select);

        updateFavBar();

    } else {

        $('.fav_item_mask').css({ 'width': (set_max_item * fav_item_w) + 'px' });
        var obj = $('#fav_item_container');
        obj.css({ 'width': (myFavoritesList.length * fav_item_w) + 'px' });
        for (var i = 0; i < myFavoritesList.length; i++) {
            var favoriteType = myFavoritesList[i].substr(0, myFavoritesList[i].indexOf('#'));
            var cityId = myFavoritesList[i].substr(myFavoritesList[i].indexOf('#') + 1);
            if (favoriteType == "c") {
                if (i == 0 && loadHomeCity) {
                    //ajax_get_city_info(cityId, 'fav');//!loadHomeCity //20170424
                }
                favoriteObj = getObjects(member_json_data, 'cityId', cityId);

                var fav_city_length = 0; //20170418
                if (pageLang == 'zh' || pageLang == 'tc') {
                    fav_city_length = favoriteObj[0].cityName.indexOf('，')
                } else {
                    fav_city_length = favoriteObj[0].cityName.indexOf(',')
                }

                if (fav_city_length == -1 || fav_city_length == 0) {
                    fav_city_length = favoriteObj[0].cityName.length;
                }

                //display_favorite_name = favoriteObj[0].cityName.substr(0, favoriteObj[0].cityName.indexOf(',') === -1 ? favoriteObj[0].cityName.length : favoriteObj[0].cityName.indexOf(','));
                display_favorite_name = favoriteObj[0].cityName.substr(0, fav_city_length);

                var sel = '';
                //obj.append('<li id="c' + favoriteObj[0].cityId + '"><a class="' + sel + '" href="./city.html?cityId=' + favoriteObj[0].cityId + '">' + favoriteObj[0].cityName + '</a></li>');
                obj.append('<li id="c' + favoriteObj[0].cityId + '"><a class="' + sel + '" href="./city.html?cityId=' + favoriteObj[0].cityId + '">' + display_favorite_name + '</a></li>');
            }
        }
        var max_item = (myFavoritesList.length > set_max_item) ? set_max_item : myFavoritesList.length;

        updateFavBar();
    }


}

/*Get all WMO member (i.e. country) info from JSON file*/
function ajax_get_present_info(noId) {
    //var param = new Array(noId);
    $.ajax({
        url: "../Biblioteca/worldWeatherGetPresent",
        type: "GET",
        dataType: "text",
        async: false,
        success: function (Jdata) {
            if (Jdata.length > 0) {
                present_json_data = JSON.parse(JSON.parse(Jdata))
                console.log(present_json_data);
                //ajaxRefreshHandling(ajax_get_present_info, "ajaxPresent", 0, param);
            } else {
                //ajaxRefreshHandling(ajax_get_present_info, "ajaxPresent", 1, param);
            }
        },
        error: function () {
            //ajaxRefreshHandling(ajax_get_present_info, "ajaxPresent", 1, param);
        }
    });
}


//load capital city weather forecast information
function load_capital_forecast(unit) {
    var wx_forecast_cap_city = 'Weather forecast of [#City Name#] (capital city)';
    $('.country_capital').html(wx_forecast_cap_city.replace(/\[#City Name#\]/g, capCityObj[0].cityName));


}

//Sort the array by city name
function SortByCityName(a, b) {
    var aName = a.enName.toLowerCase();
    var bName = b.enName.toLowerCase();
    return aName.localeCompare(bName);
}

function loadCurrentLocalTime() {
    $('#localTime').html(moment(new Date()).lang(localLang).zone(cityObj[0].timeZone).format('llll'));
    if (t1 != null) {
        clearTimeout(t1);
        t1 = null;
    }
    t1 = setTimeout(function () {
        loadCurrentLocalTime()
    }, 500);
}

function hash_raintype(type, txt, sen) {
    var name = '';
    switch (type) {
        case 'rainfall':
            name = (txt == 'rf') ? 'Rainfall' : 'Rain';
            if (sen == 1) {
                name = (txt == 'rf') ? 'Mean Total Rainfall' : 'Mean Total Rain';
            }
            break;
        case 'PPT':
            name = 'Precipitation';
            if (sen == 1) {
                name = 'Mean Total Precipitation';
            }
            break;
        default:
            name = (txt == 'rf') ? 'Rainfall' : 'Rain';
            if (sen == 1) {
                name = (txt == 'rf') ? 'Mean Total Rainfall' : 'Mean Total Rain';
            }
    }
    return name;
}

function check_climate(item) {
    var hvValue = false;
    var climate = cityObj[0].climate.climateMonth;
    for (var i = 0; i < climate.length; i++) {
        if (item == "maxTempC" && climate[i].maxTemp != null && climate[i].maxTemp != '') {
            hvValue = true;
            break;
        }
        if (item == "minTempC" && climate[i].minTemp != null && climate[i].minTemp != '') {
            hvValue = true;
            break;
        }
        if (item == "maxTempF" && climate[i].maxTempF != null && climate[i].maxTempF != '') {
            hvValue = true;
            break;
        }
        if (item == "minTempF" && climate[i].minTempF != null && climate[i].minTempF != '') {
            hvValue = true;
            break;
        }
        if (item == "meanTempC" && climate[i].meanTemp != null && climate[i].meanTemp != '') {
            hvValue = true;
            break;
        }
        if (item == "meanTempF" && climate[i].meanTempF != null && climate[i].meanTempF != '') {
            hvValue = true;
            break;
        }
        if (item == "raindays" && climate[i].raindays != null && climate[i].raindays != '') {
            hvValue = true;
            break;
        }
        if (item == "rainfall" && climate[i].rainfall != null && climate[i].rainfall != '') {
            hvValue = true;
            break;
        }
    }
    return hvValue;
}

var climateTable_height;
//Load Climatological Information in Table
function load_table(unit) {

    var format_unit;
    if (pageLang == 'ar') {
        format_unit = unit + '°';
    }
    else {

        format_unit = '°' + unit;
    }

    if (!check_climate("minTemp" + unit) && !check_climate("maxTemp" + unit) && !check_climate("meanTemp" + unit) && !check_climate("raindays") && !check_climate("rainfall")) {
        $('#climateTable').html('<div class="not_available">Climatology information currently not available.</div>');
    } else {

        $('#climateTable').each(function () {
            $('table', this).remove();
        });

        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var na = false;

        var climate_tbl = $('<table></table>').attr({ class: "climateTable" });
        //table header
        var header = $('<tr></tr>').css({ 'color': '#ffffff', 'background-color': '#0ebfa2' }).appendTo(climate_tbl);
        $('<th></th>').html("Month").appendTo(header); //.attr({'style': 'width:66px;'})

        if (check_climate("minTemp" + unit)) {
            $('<th></th>').html("Mean Daily Minimum Temperature (" + format_unit + ")").appendTo(header); //.attr({'style': 'width:200px;'})
        }
        if (check_climate("maxTemp" + unit)) {
            $('<th></th>').html("Mean Daily Maximum Temperature (" + format_unit + ")").appendTo(header); //.attr({'style': 'width:200px;'})
        }
        if (!check_climate("minTemp" + unit) && !check_climate("maxTemp" + unit) && check_climate("meanTemp" + unit)) {
            $('<th></th>').html("Mean Temperature (" + format_unit + ")").appendTo(header);
        }
        if (check_climate("rainfall")) {
            $('<th></th>').html(hash_raintype(cityObj[0].climate.raintype, 'rf', 1) + "<br>(mm)").appendTo(header);
        }
        if (check_climate("raindays")) {
            $('<th></th>').html((cityObj[0].climate.raintype == 'PPT') ? 'Mean Number of Precipitation Days' : 'Mean Number of Rain Days').appendTo(header);
        }

        for (var i = 0; i < cityObj[0].climate.climateMonth.length; i++) {
            var rowbgcolor = (i % 2 == 0) ? '#FFFFFF' : '#e8fbf9';
            var row = $('<tr></tr>').appendTo(climate_tbl);
            $('<td></td>').attr({ 'align': 'center' }).css({ 'color': '#ffffff', 'background-color': '#0ebfa2', 'text-shadow': '1px 1px 0px #5e5e5e' }).html(months[(cityObj[0].climate.climateMonth[i].month - 1)]).appendTo(row);
            if (unit == "C") {
                if (check_climate("minTemp" + unit)) {
                    if (cityObj[0].climate.climateMonth[i].minTemp != '')

                        $('<td></td>').attr({ 'align': 'center' }).css({ 'color': '#383838', 'background-color': rowbgcolor }).html(parseFloat(cityObj[0].climate.climateMonth[i].minTemp).toFixed(1)).appendTo(row);
                    else {
                        $('<td></td>').attr({ 'align': 'center' }).css({ 'color': '#383838', 'background-color': rowbgcolor }).html('/').appendTo(row);
                        na = true;
                    }
                }
                if (check_climate("maxTemp" + unit)) {
                    if (cityObj[0].climate.climateMonth[i].maxTemp != '')
                        $('<td></td>').attr({ 'align': 'center' }).css({ 'color': '#383838', 'background-color': rowbgcolor }).html(parseFloat(cityObj[0].climate.climateMonth[i].maxTemp).toFixed(1)).appendTo(row);
                    else {
                        $('<td></td>').attr({ 'align': 'center' }).css({ 'color': '#383838', 'background-color': rowbgcolor }).html('/').appendTo(row);
                        na = true;
                    }
                }
                if (!check_climate("minTemp" + unit) && !check_climate("maxTemp" + unit) && check_climate("meanTemp" + unit)) {
                    if (cityObj[0].climate.climateMonth[i].meanTemp != '')
                        $('<td></td>').attr({ 'align': 'center' }).css({ 'color': '#383838', 'background-color': rowbgcolor }).html(parseFloat(cityObj[0].climate.climateMonth[i].meanTemp).toFixed(1)).appendTo(row);
                    else {
                        $('<td></td>').attr({ 'align': 'center' }).css({ 'color': '#383838', 'background-color': rowbgcolor }).html('/').appendTo(row);
                        na = true;
                    }
                }
            }
            if (unit == "F") {
                if (check_climate("minTemp" + unit)) {
                    if (cityObj[0].climate.climateMonth[i].minTempF != '')
                        $('<td></td>').attr({ 'align': 'center' }).css({ 'color': '#383838', 'background-color': rowbgcolor }).html(parseFloat(cityObj[0].climate.climateMonth[i].minTempF).toFixed(1)).appendTo(row);
                    else {
                        $('<td></td>').attr({ 'align': 'center' }).css({ 'color': '#383838', 'background-color': rowbgcolor }).html('/').appendTo(row);
                        na = true;
                    }
                }
                if (check_climate("maxTemp" + unit)) {
                    if (cityObj[0].climate.climateMonth[i].maxTempF != '')
                        $('<td></td>').attr({ 'align': 'center' }).css({ 'color': '#383838', 'background-color': rowbgcolor }).html(parseFloat(cityObj[0].climate.climateMonth[i].maxTempF).toFixed(1)).appendTo(row);
                    else {
                        $('<td></td>').attr({ 'align': 'center' }).css({ 'color': '#383838', 'background-color': rowbgcolor }).html('/').appendTo(row);
                        na = true;
                    }
                }
                if (!check_climate("minTemp" + unit) && !check_climate("maxTemp" + unit) && check_climate("meanTemp" + unit)) {
                    if (cityObj[0].climate.climateMonth[i].meanTempF != '')
                        $('<td></td>').attr({ 'align': 'center' }).css({ 'color': '#383838', 'background-color': rowbgcolor }).html(parseFloat(cityObj[0].climate.climateMonth[i].meanTempF).toFixed(1)).appendTo(row);
                    else {
                        $('<td></td>').attr({ 'align': 'center' }).css({ 'color': '#383838', 'background-color': rowbgcolor }).html('/').appendTo(row);
                        na = true;
                    }
                }
            }
            if (check_climate("rainfall")) {
                if (cityObj[0].climate.climateMonth[i].rainfall != '')
                    $('<td></td>').attr({ 'align': 'center' }).css({ 'color': '#383838', 'background-color': rowbgcolor }).html(parseFloat(cityObj[0].climate.climateMonth[i].rainfall).toFixed(1)).appendTo(row);
                else {
                    $('<td></td>').attr({ 'align': 'center' }).css({ 'color': '#383838', 'background-color': rowbgcolor }).html('/').appendTo(row);
                    na = true;
                }
            }
            if (check_climate("raindays")) {
                if (cityObj[0].climate.climateMonth[i].raindays != '') {
                    if (cityObj[0].climate.climateMonth[i].raindays == 'NULL')
                        $('<td></td>').attr({ 'align': 'center' }).css({ 'background-color': rowbgcolor }).html(cityObj[0].climate.climateMonth[i].raindays).appendTo(row);
                    else
                        $('<td></td>').attr({ 'align': 'center' }).css({ 'background-color': rowbgcolor }).html(parseFloat(cityObj[0].climate.climateMonth[i].raindays).toFixed(1)).appendTo(row);
                } else {
                    $('<td></td>').attr({ 'align': 'center' }).css({ 'background-color': rowbgcolor }).html('/').appendTo(row);
                    na = true;
                }
            }
        }

        climate_tbl.appendTo($("#climateTable"));

        $('#climateTable').css('height', 'auto');

        var remark = '<div align="left"><strong>Remark</strong></div>';
        remark += '<ol align="left" class="remark_container">';

        if (na)
            remark += '<li>"/" - Not available.</li>';

        if (cityObj[0].member.memId == 1)
            remark += '<li>Forecast is provided by the China Meteorological Administration.</li>';

        if (cityObj[0].climate.climatefromclino != '') {
            remark += '<li>Climatological information is based on WMO Climatological Normals(CLINO)';
            if (cityObj[0].climate.datab != '' && cityObj[0].climate.datae != '') {
                remark += ' for the ' + (parseInt(cityObj[0].climate.datae) - parseInt(cityObj[0].climate.datab) + 1) + '-year period ' + cityObj[0].climate.datab + '-' + cityObj[0].climate.datae;
            }
            remark += '.</li>';
        } else {
            if (cityObj[0].climate.datab != '' && cityObj[0].climate.datae != '') {
                remark += '<li>Climatological information is based on monthly averages for the ' + (parseInt(cityObj[0].climate.datae) - parseInt(cityObj[0].climate.datab) + 1) + '-year period ' + cityObj[0].climate.datab + '-' + cityObj[0].climate.datae + '.</li>';
            }
        }

        if (cityObj[0].climate.tempb != '' && cityObj[0].climate.tempe != '') {
            remark += '<li>Mean temperature is based on monthly averages for the period ' + cityObj[0].climate.tempb + '-' + cityObj[0].climate.tempe + '.</li>';
        }

        if (cityObj[0].climate.rdayb != '' && cityObj[0].climate.rdaye != '') {
            remark += '<li>Mean number of ' + hash_raintype(cityObj[0].climate.raintype, 'rd', 0).toLowerCase() + ' days is based on monthly averages for the period ' + cityObj[0].climate.rdayb + '-' + cityObj[0].climate.rdaye + '.</li>';
        }

        if (cityObj[0].climate.rainfallb != '' && cityObj[0].climate.rainfalle != '') {
            remark += '<li>Mean total ' + hash_raintype(cityObj[0].climate.raintype, 'rf', 0).toLowerCase() + ' is based on monthly averages for the period ' + cityObj[0].climate.rainfallb + '-' + cityObj[0].climate.rainfalle + '.</li>';
        }

        if (cityObj[0].climate.raindef != '') {
            var rainunit = (cityObj[0].climate.rainunit != '') ? ' ' + cityObj[0].climate.rainunit : ' ';
            remark += '<li>Mean number of ' + hash_raintype(cityObj[0].climate.raintype, 'rd', 0).toLowerCase() + ' days = Mean number of days with at least ' + cityObj[0].climate.raindef + rainunit + ' of ' + hash_raintype(cityObj[0].climate.raintype, 'rd', 0).toLowerCase() + '.</li>';
        }
        if (cityObj[0].climate.raintype == "PPT") {
            remark += '<li>Precipitation includes both rain and snow.</li>';
        }

        remark += '<li>Attention: Please note that the averaging period for climatological information and the definition of "Mean Number of ' + hash_raintype(cityObj[0].climate.raintype, 'rd', 0) + ' Days" quoted in this web site may be different for different countries. Hence, care should be taken when city climatologies are compared.</li>';

        remark += '</ol>';

        $('#city_climate_remark').html(remark);

    }
    //changeFontSizechangeFontSize(getCookie('fontsize_e'));
}

//Load Climatological Information in High Chart API
function load_highchart(unit) {

    var format_unit;

    if (pageLang == 'ar') {
        format_unit = unit + '°';
    } else {
        format_unit = '°' + unit;
    }

    if (!check_climate("minTemp" + unit) && !check_climate("maxTemp" + unit) && !check_climate("meanTemp" + unit) && !check_climate("rainfall")) {
        $('#climateContainer').css({ 'display': 'none' });
    } else {
        $('#climateContainer').css({ 'display': 'block' });

        var primary_yAxis = {// Primary yAxis
            labels: {
                format: '{value}',
                style: {
                    color: '#5F666E'
                },
                align: 'left',
                x: -18,
                y: -2
            },
            showFirstLabel: false,
            title: {
                text: 'Temperature (' + format_unit + ')',
                style: {
                    color: '#596679',
                    fontFamily: 'Verdana',
                    direction: 'ltr'
                },
                x: -12
            }
        };
        var secondary_yAxis = {// Secondary yAxis
            labels: {
                format: '{value}',
                style: {
                    color: '#5F666E'
                },
                align: 'right',
                x: 18,
                y: -2
            },
            showFirstLabel: false,
            title: {
                text: hash_raintype(cityObj[0].climate.raintype, 'rf', 0) + ' (mm)',
                style: {
                    color: '#596679',
                    fontFamily: 'Verdana',
                    direction: 'ltr'
                },
                x: 12
            },
            opposite: true
        };

        var mean_total_rf_or_ppt = {
            name: hash_raintype(cityObj[0].climate.raintype, 'rf', 1),
            color: '#46cbd4',
            type: 'column',
            yAxis: 0,
            data: [null, null, null, null, null, null, null, null, null, null, null, null]
        };
        var maximum_temperature = {
            name: 'Mean Max. Temperature',
            color: '#eb6877',
            type: 'spline',
            data: [null, null, null, null, null, null, null, null, null, null, null, null]
        };
        var minimum_temperature = {
            name: 'Mean Min. Temperature',
            color: '#0f91c4',
            type: 'spline',
            data: [null, null, null, null, null, null, null, null, null, null, null, null]
        };
        var mean_temperature = {
            name: 'Mean Temperature',
            color: '#990000',
            type: 'spline',
            data: [null, null, null, null, null, null, null, null, null, null, null, null]
        };

        var prepareChartData = {
            chart: {
                renderTo: 'climateContainer',
                zoomType: 'xy',
                backgroundColor: '#ebf1f5', /*{
                             linearGradient: { x1: 0, y1: 0, x2: 0, y2: 0},
                             stops: [
                             [0, 'rgb(236, 241, 245)'],
                             [1, 'rgb(252, 255, 197)']
                             ]
                             },*/
                borderRadius: 0,
                style: {
                    fontFamily: 'Verdana',
                }
            },
            title: {
                text: '',
                style: {
                    fontFamily: 'Verdana',
                    fontWeight: 'bold',
                    color: '#596679'
                }
            },
            subtitle: {
                text: '30-year period',
                style: {
                    color: '#596679'
                }
            },
            xAxis: [{
                labels: {
                    style: {
                        color: '#5F666E'
                    }
                },
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                title: { text: 'Month', style: { fontWeight: 'bold', fontFamily: 'Verdana', color: '#596679' } }
            }],
            credits: {
                enabled: false,
            },
            yAxis: [],
            tooltip: {
                enabled: false,
                shared: true,
                style: {
                    fontWeight: 'bold'
                }
            },
            legend: {
                enabled: false
            },
            series: []
        };

        prepareChartData.title.text = cityObj[0].cityName;

        var yAxisOffset = 0;
        if ((check_climate("minTemp" + unit) && check_climate("maxTemp" + unit)) || check_climate("meanTemp" + unit)) {
            prepareChartData.yAxis[yAxisOffset++] = primary_yAxis;
            mean_total_rf_or_ppt.yAxis = 1;
        }
        var seriesOffset = 0;
        if (check_climate("rainfall")) {
            prepareChartData.yAxis[yAxisOffset++] = secondary_yAxis;
            prepareChartData.series[seriesOffset++] = mean_total_rf_or_ppt;
        }
        if (check_climate("minTemp" + unit) && check_climate("maxTemp" + unit)) {
            prepareChartData.series[seriesOffset++] = maximum_temperature;
            prepareChartData.series[seriesOffset++] = minimum_temperature;
        } else {
            if (check_climate("meanTemp" + unit)) {
                prepareChartData.series[seriesOffset++] = mean_temperature;
            }
        }

        for (var i = 0; i < cityObj[0].climate.climateMonth.length; i++) {
            var offset = 0;
            if (check_climate("rainfall")) {
                prepareChartData.series[offset++].data[i] = parseFloat(cityObj[0].climate.climateMonth[i].rainfall);
            }
            if (unit == "C" && check_climate("maxTemp" + unit) && check_climate("minTemp" + unit)) {
                if (cityObj[0].climate.climateMonth[i].maxTemp != '')
                    prepareChartData.series[offset].data[i] = parseFloat(cityObj[0].climate.climateMonth[i].maxTemp);
                offset++;
                if (cityObj[0].climate.climateMonth[i].minTemp != '')
                    prepareChartData.series[offset].data[i] = parseFloat(cityObj[0].climate.climateMonth[i].minTemp);
            } else {
                if (unit == "C" && check_climate("meanTemp" + unit)) {
                    prepareChartData.series[offset++].data[i] = parseFloat(cityObj[0].climate.climateMonth[i].meanTemp);
                }
            }
            if (unit == "F" && check_climate("maxTemp" + unit) && check_climate("minTemp" + unit)) {
                if (cityObj[0].climate.climateMonth[i].maxTempF != '')
                    prepareChartData.series[offset].data[i] = parseFloat(cityObj[0].climate.climateMonth[i].maxTempF);
                offset++;
                if (cityObj[0].climate.climateMonth[i].minTempF != '')
                    prepareChartData.series[offset].data[i] = parseFloat(cityObj[0].climate.climateMonth[i].minTempF);
            } else {
                if (unit == "F" && check_climate("meanTemp" + unit)) {
                    prepareChartData.series[offset++].data[i] = parseFloat(cityObj[0].climate.climateMonth[i].meanTempF);
                }
            }
        }

        var chart = new Highcharts.Chart(prepareChartData);
    }
}

function load_present(currentTempUnit) {

    //var mn = (moment().format('H') >= 18 || moment().format('H') < 6) ? 'b' : 'a';
    var present = getObjects(present_json_data, 'cityId', cityObj[0].cityId);


    if (present.length > 0) {


        var wind_speed = String(present[0].ws);
        var sunrise = String(present[0].sunrise);
        var sunset = String(present[0].sunset);
        var sundate = present[0].sundate;

        if (present[0].sunrise == "") {
            sunrise = "";
        }

        if (present[0].sunset == "") {
            sunset = "";
        }

        if (present[0].sundate == "") {
            sundate = "";
        }


        var display_wind;
        var present_temp = String(present[0].temp);
        var present_rh = String(present[0].rh);
        var daynightcode = present[0].daynightcode;
        $('.city_currwx_box').css('display', 'block');
        var currwxicon = (present[0].wxImageCode.length > 0) ? parseInt(present[0].wxImageCode) : -1;

        //sunrise = convert_24_2_12_hour(sunrise);
        //sunset = convert_24_2_12_hour(sunset);

        if (sundate == "") {
            $('.sun_date').html("");
        } else {
            sundate = sundate.substring(0, 4) + '-' + sundate.substring(4, 6) + '-' + sundate.substring(6, 8);
            $('.sun_date').html(moment(sundate).lang(localLang).format('D MMM'));
        }

        if (sunrise == "") {
            $('.sunrise_time').html("");
        } else {
            sunrise = sundate + ' ' + sunrise;
            $('.sunrise_time').html(moment(sunrise).lang(localLang).format('LT'));
        }

        if (sunset == "") {
            $('.sunset_time').html("");
        } else {
            sunset = sundate + ' ' + sunset;
            $('.sunset_time').html(moment(sunset).lang(localLang).format('LT'));
        }


        if (localLang == 'en') {
            if (sundate == "") {
                $('.sun_date').html("");
            } else {
                $('.sun_date').html(moment(sundate).lang(localLang).format('DD MMM YYYY'));
            }
        }

        if (localLang == 'zh-cn' || localLang == 'zh-tw' || localLang == 'ja') {

            if (sundate == "") {
                $('.sun_date').html("");
            } else {
                $('.sun_date').html(moment(sundate).lang(localLang).format('MMMDD[日]'));
            }
        }

        if (localLang == 'de') {

            if (sundate == "") {
                $('.sun_date').html("");
            } else {
                $('.sun_date').html(moment(sundate).lang(localLang).format('D[.] MMM'));
            }

        }



        if (currwxicon == -1) {

            $('.city_wxicon_block').css('display', 'none');
            $('.temp_block, .rh_block, #currwx_icon').css('display', 'none');
            $('.temp_block1, .rh_block1').css('display', 'block');
        } else {
            $('.temp_block, .rh_block, #currwx_icon').css('display', 'block');
            $('.temp_block1, .rh_block1').css('display', 'none');
        }
        $('#currwx_icon').removeAttr('class').addClass('weather_icon1').addClass('wxico_l_' + currwxicon + daynightcode).attr('title', present[0].wxdesc);


        if (present_temp != '' && present_temp != '') {
            beta_msg(); //20170420
            if (currentTempUnit == "F") {
                $('.present_temp_value').html(convert_c2f(present_temp) + "°F");
                //$('.present_temp_unit').html("°F");
            } else {
                $('.present_temp_value').html(Math.round(present_temp) + "°C");
                //$('.present_temp_unit').html("°C");
            }


        } else {
            $(".city_temp_block").css("display", "none");

        }


        if (present_rh != "" && present_rh != null) { //20170201
            $('.present_rh_value').html(present_rh + "%");

        } else {
            $(".city_rh_block").css("display", "none");
        }

        var windDirection = "";
        // && present[0].wd != "Calm"
        windDirection = present[0].wd;
        if (pageLang == 'zh' || pageLang == 'tc') {
            if (pageLang == 'zh') {
                if (windDirection == 'N') {
                    windDirection = '北';
                }

                if (windDirection == 'NNE') {
                    windDirection = '北东北';
                }

                if (windDirection == 'NE') {
                    windDirection = '东北';
                }

                if (windDirection == 'ENE') {
                    windDirection = '东东北';
                }

                if (windDirection == 'E') {
                    windDirection = '东';
                }

                if (windDirection == 'ESE') {
                    windDirection = '东东南';
                }

                if (windDirection == 'SE') {
                    windDirection = '东南';
                }

                if (windDirection == 'SSE') {
                    windDirection = '南东南';
                }


                if (windDirection == 'S') {
                    windDirection = '南';
                }


                if (windDirection == 'SSW') {
                    windDirection = '南西南';
                }


                if (windDirection == 'SW') {
                    windDirection = '西南';
                }

                if (windDirection == 'WSW') {
                    windDirection = '西西南';
                }

                if (windDirection == 'W') {
                    windDirection = '西';
                }

                if (windDirection == 'WNW') {
                    windDirection = '西西北';
                }

                if (windDirection == 'NW') {
                    windDirection = '西北';
                }

                if (windDirection == 'NNW') {
                    windDirection = '北西北';
                }


            }

            if (pageLang == 'tc') {
                if (windDirection == 'N') {
                    windDirection = '北';
                }

                if (windDirection == 'NNE') {
                    windDirection = '東北偏北';
                }

                if (windDirection == 'NE') {
                    windDirection = '東北';
                }

                if (windDirection == 'ENE') {
                    windDirection = '東北偏東';
                }

                if (windDirection == 'E') {
                    windDirection = '東';
                }

                if (windDirection == 'ESE') {
                    windDirection = '東南偏東';
                }

                if (windDirection == 'SE') {
                    windDirection = '東南';
                }

                if (windDirection == 'SSE') {
                    windDirection = '東南偏南';
                }


                if (windDirection == 'S') {
                    windDirection = '南';
                }


                if (windDirection == 'SSW') {
                    windDirection = '西南偏南';
                }


                if (windDirection == 'SW') {
                    windDirection = '西南';
                }

                if (windDirection == 'WSW') {
                    windDirection = '西南偏西';
                }

                if (windDirection == 'W') {
                    windDirection = '西';
                }

                if (windDirection == 'WNW') {
                    windDirection = '西北偏西';
                }

                if (windDirection == 'NW') {
                    windDirection = '西北';
                }

                if (windDirection == 'NNW') {
                    windDirection = '西北偏北';
                }


            }


        }

        if (wind_speed != "" && wind_speed != null) { //wind control
            var windSpeedValue = "";

            if (currentWindUnit == "km/h") {
                windSpeedValue = convert_m2km(present[0].ws);
            }

            if (currentWindUnit == "m/s") {
                windSpeedValue = wind_speed;
            }

            if (present[0].wd == "VBR") {
                display_wind = windSpeedValue + " " + currentWindUnit;

            } else if (present[0].wd == "Calm") {

                display_wind = windSpeedValue + " " + currentWindUnit;

            } else {
                display_wind = windDirection + " " + windSpeedValue + " " + currentWindUnit;
            }



            $('.present_wind_value').html(display_wind);
        } else {
            $(".city_wind_block").css("display", "none");
        }


        if (present[0].issue != false) {
            var issue_str = (present[0].issue.length < 12) ? ('20' + present[0].issue.substring(0, 2) + '-' + present[0].issue.substring(2, 4) + '-' + present[0].issue.substring(4, 6) + ' ' + present[0].issue.substring(6, 8) + ':00') : (present[0].issue.substring(0, 4) + '-' + present[0].issue.substring(4, 6) + '-' + present[0].issue.substring(6, 8) + ' ' + present[0].issue.substring(8, 10) + ':' + present[0].issue.substring(10, 12));
            $('.city_currwx_issuetime').html(moment(issue_str).lang(localLang).format('llll').replace("00分", "正") + ' (Local Time)');
        } else {
            $('.city_currwx_box').css('display', 'none');
        }

    } else { //no present data

        $("#currwx_icon").css("display", "none");
        $(".city_temp_block").css("display", "none");
        $(".city_wind_block").css("display", "none");
        $(".city_rh_block").css("display", "none");
    }
}

//Load Weather Forecast Information
function load_forecast(unit) {

    //var mn = (moment().format('H') >= 18 || moment().format('H') < 6) ? 'b' : 'a';
    var mn = 'a';
    $('.city_container').html('');

    var present = getObjects(present_json_data, 'cityId', cityObj[0].cityId); //20170202

    //get present weather data 20170309//
    var present_temp = '';
    var present_wx = '';
    var present_rh = '';
    var present_issue_date = '';


    if (present[0].temp != '' && present[0].temp != null) {
        present_temp = String(present[0].temp);
    }

    if (present[0].wxImageCode != '' && present[0].wxImageCode != null) {
        present_wx = String(present[0].wxImageCode);
    }

    if (present[0].rh != '' && present[0].rh != null) {
        present_rh = String(present[0].rh);
    }

    if (present[0].issue != '' && present[0].issue != null) {
        present_issue_date = (present[0].issue.length < 12) ? ('20' + present[0].issue.substring(0, 2) + '-' + present[0].issue.substring(2, 4) + '-' + present[0].issue.substring(4, 6) + ' ' + present[0].issue.substring(6, 8) + ':00') : (present[0].issue.substring(0, 4) + '-' + present[0].issue.substring(4, 6) + '-' + present[0].issue.substring(6, 8));
    }


    var forecastObj = cityObj[0].forecast.forecastDay;
    if (forecastObj.length == 0) {
        $('.city_fc_block').css('display', 'none'); //20170206

        $('#no_weather_forecast').html('<div class="not_available">Weather forecast information is not available at this moment.</div>');
    }
    for (var i = 0; i < forecastObj.length; i++) {
        var show_status = 0;

        var forecast_date = forecastObj[i].forecastDate

        if (present_issue_date == '') {
            show_status = 0;
        }

        if (present_issue_date != '' && present_issue_date == forecast_date) {
            show_status = 1;

            if (present[0].temp != '' && present[0].temp != null) {
                if (currentTempUnit == "F") {
                    if (convert_c2f(present[0].temp) >= forecastObj[i].minTempF && present[0].temp <= forecastObj[i].maxTempF && forecastObj[i].minTempF != '' && forecastObj[i].maxTempF != '' && forecastObj[i].minTempF != null && forecastObj[i].maxTempF != null) {
                        show_status = 0;
                    } else if ((forecastObj[i].minTempF == '' || forecastObj[i].minTempF == null) && convert_c2f(present[0].temp) <= forecastObj[i].maxTempF) {
                        show_status = 0;
                    } else {
                        show_status = 1;
                    }

                }


                if (currentTempUnit == "C") {
                    if (present[0].temp >= forecastObj[i].minTemp && present[0].temp <= forecastObj[i].maxTemp && forecastObj[i].minTemp != '' && forecastObj[i].maxTemp != '' && forecastObj[i].minTemp != null && forecastObj[i].maxTemp != null) {
                        show_status = 0;
                    } else if ((forecastObj[i].minTemp == '' || forecastObj[i].minTemp == null) && present[0].temp <= forecastObj[i].maxTemp) {
                        show_status = 0;
                    } else {
                        show_status = 1;
                    }
                }

            } else {
                show_status = 0;

            }

        } else {
            show_status = 0;
        }



        //if(i < 5) {
        //var maxTemp = (unit == "C") ? ((forecastObj[i].maxTemp != null && forecastObj[i].maxTemp != '') ? forecastObj[i].maxTemp : '') : ((forecastObj[i].maxTempF != null && forecastObj[i].maxTempF != '') ? forecastObj[i].maxTempF : '');
        //var minTemp = (unit == "C") ? ((forecastObj[i].minTemp != null && forecastObj[i].minTemp != '') ? forecastObj[i].minTemp : '') : ((forecastObj[i].minTempF != null && forecastObj[i].minTempF != '') ? forecastObj[i].minTempF : '');

        if (show_status == 0) {

            //if (localLang == 'ar') {
            //	var maxTemp = (unit == "C") ? ((forecastObj[i].maxTemp != null && forecastObj[i].maxTemp != '') ?  unit + '°' +forecastObj[i].maxTemp : '') : ((forecastObj[i].maxTempF != null && forecastObj[i].maxTempF != '') ? forecastObj[i].maxTempF + '°' + unit : ''); //20161223
            //	var minTemp = (unit == "C") ? ((forecastObj[i].minTemp != null && forecastObj[i].minTemp != '') ?  unit + '°'+ forecastObj[i].minTemp : '') : ((forecastObj[i].minTempF != null && forecastObj[i].minTempF != '') ? forecastObj[i].minTempF + '°' + unit : ''); //20161223

            //}else{
            var maxTemp = (unit == "C") ? ((forecastObj[i].maxTemp != null && forecastObj[i].maxTemp != '') ? forecastObj[i].maxTemp + '°' + unit : '') : ((forecastObj[i].maxTempF != null && forecastObj[i].maxTempF != '') ? forecastObj[i].maxTempF + '°' + unit : ''); //20161223
            var minTemp = (unit == "C") ? ((forecastObj[i].minTemp != null && forecastObj[i].minTemp != '') ? forecastObj[i].minTemp + '°' + unit : '') : ((forecastObj[i].minTempF != null && forecastObj[i].minTempF != '') ? forecastObj[i].minTempF + '°' + unit : ''); //20161223

            //}
            //var minTemp = (unit == "C") ? ((forecastObj[i].minTemp != null && forecastObj[i].minTemp != '') ? forecastObj[i].minTemp  : '') : ((forecastObj[i].minTempF != null && forecastObj[i].minTempF != '') ? forecastObj[i].minTempF  : ''); //20161223

            var symbol = (maxTemp != '' && minTemp != '') ? ' | ' : '';

            var icon = forecastObj[i].weatherIcon.toString().substr(0, (forecastObj[i].weatherIcon.toString().length - 2));

            var f_d = moment(forecastObj[i].forecastDate).lang(localLang).format('D MMM<br/>[(]ddd[)]'); //20170201
            //var weekday = moment(forecastObj[i].forecastDate).lang(localLang).format('ddd');
            if (localLang == 'zh-cn' || localLang == 'zh-tw' || localLang == 'ja') {
                f_d = moment(forecastObj[i].forecastDate).lang(localLang).format('ll<br/>[(]ddd[)]');
                f_d = f_d.substr(5).replace("周", "").replace("週", "");
            }
            if (localLang == 'de') {
                f_d = moment(forecastObj[i].forecastDate).lang(localLang).format('D[.] MMM<br/>[(]ddd[)]');
            }
            if (localLang == 'kr') {
                f_d = moment(forecastObj[0].forecast.forecastDay[i].forecastDate).lang('ko').format('MMM Do [(]ddd[)]');
            }
            var wxdesc = forecastObj[i].weather;
            if (forecastObj[i].wxdesc != '' && forecastObj[i].wxdesc != null) {
                wxdesc = forecastObj[i].wxdesc;
            }
            //$('.city_container').append('<div class="city_forecast_day_object"><div class="city_weekday_n_date"><div class="city_fc_weekday">' + weekday + '</div><div class="city_fc_date">' + f_d + '</div></div><div class="city_weather_icon" title="' + wxdesc + '"><span class="wxico' + icon + ((icon >= 21 && icon <= 25) ? mn : '') + '"></span></div><div class="city_fc_temp"><span class="min_temp_box">' + minTemp + '</span><span class="forecast_symbol_icon">' + symbol + '</span><span class="max_temp_icon">' + maxTemp + '</div><div class="city_fc_desc">' + wxdesc + '</div></div>');

            if (localLang == 'ar') {
                $('.city_container').append('<div class="city_forecast_day_object"><div class="city_weekday_n_date"><div class="city_fc_date">' + f_d + '</div></div><div class="city_fc_temp"></span><span class="max_temp_icon">' + maxTemp + '</span><span class="forecast_symbol_icon">' + symbol + '</span><span class="min_temp_box">' + minTemp + '</span></div><div class="city_weather_icon" title="' + wxdesc + '"><span class="wxico' + icon + ((icon >= 21 && icon <= 25) ? mn : '') + '"></span></div><div class="city_fc_desc">' + wxdesc + '</div></div>');

            } else {
                $('.city_container').append('<div class="city_forecast_day_object"><div class="city_weekday_n_date"><div class="city_fc_date">' + f_d + '</div></div><div class="city_fc_temp"><span class="min_temp_box">' + minTemp + '</span><span class="forecast_symbol_icon">' + symbol + '</span><span class="max_temp_icon">' + maxTemp + '</span></div><div class="city_weather_icon" title="' + wxdesc + '"><span class="wxico' + icon + ((icon >= 21 && icon <= 25) ? mn : '') + '"></span></div><div class="city_fc_desc">' + wxdesc + '</div></div>');
            }
            //}
        }


        $('#no_weather_forecast').css('display', 'none'); //20170206

        var tz = '';
        switch (cityObj[0].forecast.timeZone) {
            case "Local":
                tz = "Local Time";
                break;
            case "UTC":
                tz = "Coordinated Universal Time";
                break;
            case "EDT":
                tz = "Eastern Daylight Time";
                break;
        }
        var i_d = moment(cityObj[0].forecast.issueDate).lang(localLang).format('ll');
        var i_t = moment(cityObj[0].forecast.issueDate).lang(localLang).format('LT');
        $('.city_forecast_issuetime').html('Issued at  ' + i_t + ' \(' + tz + '\) ' + i_d);

        //changeFontSize(getCookie('fontsize_e'));

        //if(cityObj[0].forecast.forecastDay.length == 0) {
        //	$('#forecastTable').css('display', 'none');
        //	$('#forecastDetails').css('display', 'block');
        //	$('#forecastDetails').html('<div class="not_available">Weather forecast information is not available at this moment.</div>');
        //} else {
        //$('#forecastDetails').html('');
        //$('#forecastDetails').css('display', 'none');

        //}
    }
}

//build the website breadcrumb
function build_breadcrumb() {
    $('#breadcrumb').append('<li><a href="./region.html?ra=' + cityObj[0].member.ra + '">' + regionArray[(cityObj[0].member.ra - 1)] + '</a> &gt;</li>');
    $('#breadcrumb').append('<li><a href="./country.html?countryCode=' + cityObj[0].member.memId + '">' + cityObj[0].member.memName + '</a> &gt;</li>');
    $('#breadcrumb').append('<li><a href="./city.html?cityId=' + cityObj[0].cityId + '">' + cityObj[0].cityName + '</a></li>');
    //changeFontSize(getCookie('fontsize_e'));
}

//setup content include breadcrumb, country info, capital city info (if exist)
//      , initaialize map and alphabetical index search
function setup_content() {
    $('.not_available').remove();

    $('title').html("World Weather Information Service");
    //$('title').html(cityObj[0].cityName + " | World Weather Information Service");

    //$('.city_name').html(cityObj[0].cityName);
    $('.m_city_name').html(cityObj[0].cityName + '<a class="link_ico_add" id="favButton" href="javascript:addToMyFavoriteList(' + cityObj[0].cityId + ', \'city_no\', false);"><span class="ico_add">&#10010;</span></a>');

    if (!isExistInCookie('myFavorite_e', '|', 'c#' + cityObj[0].cityId)) {
        $('.city_name').html(cityObj[0].cityName + '<a class="link_ico_add" id="favButton" href="javascript:addToMyFavoriteList(' + cityObj[0].cityId + ', \'city_no\', false);"><span class="ico_add">&#10010;</span></a>');
    } else {
        $('.city_name').html(cityObj[0].cityName);
        $('.link_ico_add').css('display', 'none');
    }
    $('.city_country').html('<a href="./country.html?countryCode=' + cityObj[0].member.memId + '" class="city_place_name_member">' + cityObj[0].member.memName + '</a>');
    if (cityObj[0].member.logo.length > 0) {
        //20170201	$('#logo').html('<a href="http://' + cityObj[0].member.url + '" target="_blank"><img src="/images/logo/' + cityObj[0].member.logo + '" alt="' + cityObj[0].member.orgName + '" onload="this.width*=0.65;this.onload=null;"></a>');
        $('#logo').html('<a href="http://' + cityObj[0].member.url + '" target="_blank"><img src="../images/logo/' + cityObj[0].member.logo + '" alt="' + cityObj[0].member.orgName + '"></a>');

    } else {
        $('#logo').remove();
    }
    if (cityObj[0].member.orgName != '' && cityObj[0].member.orgName != null) {
        if (cityObj[0].member.url.length > 0) {
            $('#website').html('<a href="http://' + cityObj[0].member.url + '" target="_blank">' + cityObj[0].member.orgName + '</a>');
        } else {
            $('#website').html(cityObj[0].member.orgName);
        }
    }


    //favButton_handler(cityObj[0].cityId);

    //loadCurrentLocalTime();
    //var currentTempUnit = "C";
    //var currentTempUnit = getCookie('tempUnit_e');



    var displayTempUnit = " (°" + currentTempUnit + ") ";


    $(".temp_current_unit").text(displayTempUnit); //20161223

    load_present(currentTempUnit);
    //load_forecast(currentTempUnit);
    load_highchart(currentTempUnit);
    load_table(currentTempUnit);
    //initialize_temp_unit(currentTempUnit);

    //t2 = setTimeout(function () {
    //    clearTimeout(t);

    //    //ajax_get_member_info(cityObj[0].member.memId);
    //    //
    //    get_member_info(cityObj[0].member.memId);
    //}, 150);
}


function get_member_info(memId) {
    //json_data = JSON.parse(Jdata);
    member_json_data = member_json_data_map;
    delete member_json_data.member['lang'];
    memberObj = getObjects(member_json_data, 'memId', memId);
    if (memberObj.length > 0) {
        //ajax_get_region_info();
        //setup_content();
        loadMyFavorites(true);
    } else {
        window.location.href = './error.html';
    }
    var memberCityObj = getObjects(member_json_data, 'memId', memId);

    if (memberCityObj[0].city.length > 0) {
        if ($('.city_map').is(':visible') && $('.city_map').height() != 0) {
            setCookie('map_e_lat', parseFloat(memberCityObj[0].countryLatitude), 30); //save lat lng
            setCookie('map_e_lng', parseFloat(memberCityObj[0].countryLongitude), 30);//save lat lng
            setCookie('map_e_zoom', '3', 30);//save lat lng
            console.log('in city lng' + getCookie('map_e_lng'));

            if (cityObj[0].cityId == 223) {
                init_openstreetmap(parseFloat(cityObj[0].cityLatitude) - 3, parseFloat(cityObj[0].cityLongitude) - 1, 'city_openstreetmap_canvas', 5, memberCityObj[0].city, 'city');
            } else if (cityObj[0].cityId == 1954 || cityObj[0].cityId == 583) {
                init_openstreetmap(parseFloat(cityObj[0].cityLatitude), parseFloat(cityObj[0].cityLongitude), 'city_openstreetmap_canvas', 5, memberCityObj[0].city, 'city');
            } else {

                init_openstreetmap(parseFloat(memberCityObj[0].countryLatitude), parseFloat(memberCityObj[0].countryLongitude), 'city_openstreetmap_canvas', memberCityObj[0].szmlv, memberCityObj[0].city, 'city');


            }
            t = setTimeout(function () {
                clearTimeout(t);
                openstreetGetMarkerByCityID(getSelectedCity());
            }, 500);
        }
    } else {
        console.log("ERROR!!!");
    }
}



/*Use city ID to get city info from JSON file*/
function ajax_get_city_info(cityId, cat) {//loadHomeCity
    //var param = new Array(cityId, loadHomeCity);
    //url: "../../en/json/" + cityId + "_en.xml",
    $.ajax({

        url: "../Biblioteca/worldWeatherGetCityInfo/", //+ cityId + "_en.xml",
        type: "POST",
        crossDomain: true,
        contentType: "application/json",
        data: "{ 'city': '" + cityId + "' }",
        success: function (Jdata) {

            if (Jdata.length > 0) {
                json_data = JSON.parse(Jdata);
                if (cat == 'cap') {
                    capCityObj = getObjects(json_data, 'cityId', cityId);
                    //load_capital_forecast(); //currentTempUnit
                    //loadCurrentLocalTime();
                } else if (cat == 'fav') {
                    forecastCityObj = getObjects(json_data, 'cityId', cityId);
                } else {
                    cityObj = getObjects(json_data, 'cityId', cityId);
                    if (cityObj.length > 0) {
                        //ajax_get_region_info(); //20170413
                        //ajax_get_region_info_map('en');
                        build_breadcrumb();
                        setup_content();
                    } else {
                        console.log('nothing');
                    }
                }
                //ajaxRefreshHandling(ajax_get_city_info, "ajaxCity", 0, param);
            } else {
                //ajaxRefreshHandling(ajax_get_city_info, "ajaxCity", 1, param);
            }
        },
        error: function () {
            console.log("error");
            //ajaxRefreshHandling(ajax_get_city_info, "ajaxCity", 1, param);
        }
    });


}

//Use member id to get WMO Member info from JSON file
function ajax_get_member_info(memId) {
    $.ajax({
        url: "../../en/json/Country_en.xml",
        type: "GET",
        dataType: "text",
        success: function (Jdata) {
            json_data = JSON.parse(Jdata);
            member_json_data = json_data;
            delete member_json_data.member['lang'];
            memberObj = getObjects(json_data, 'memId', memId);
            if (memberObj.length > 0) {
                //ajax_get_region_info();
                //setup_content();
                loadMyFavorites(true);
            } else {
                window.location.href = './error.html';
            }
            var memberCityObj = getObjects(json_data, 'memId', memId);

            if (memberCityObj[0].city.length > 0) {
                if ($('.city_map').is(':visible') && $('.city_map').height() != 0) {
                    if (cityObj[0].cityId == 1954) {
                        init_openstreetmap(parseFloat(cityObj[0].cityLatitude), parseFloat(cityObj[0].cityLongitude), 'city_openstreetmap_canvas', 5, memberCityObj[0].city, 'city');
                    } else {

                        init_openstreetmap(parseFloat(memberCityObj[0].countryLatitude), parseFloat(memberCityObj[0].countryLongitude), 'city_openstreetmap_canvas', memberCityObj[0].szmlv, memberCityObj[0].city, 'city');
                    }
                    t = setTimeout(function () {
                        clearTimeout(t);
                        openstreetGetMarkerByCityID(getSelectedCity());
                    }, 500);
                }
            } else {
                console.log("ERROR!!!");
            }
        },
        error: function () {
            console.log("ERROR!!!");
        }
    });
}

//Map the WMO member ID by using Pub5 Country Code from JSON file
function ajax_map_member_id(key) {
    $.ajax({
        url: "../json/Pub5CountryCode.xml",
        type: "GET",
        dataType: "text",
        success: function (Jdata) {
            json_data = JSON.parse(Jdata);
            var mappingObj = getObjects(json_data, 'countryCode', key);
            if (mappingObj.length > 0) {
                ajax_get_member_info(mappingObj[0].memId);
            } else {
                window.location.href = './error.html';
            }
        },
        error: function () {
            console.log("ERROR!!!");
        }
    });
}

$(document).ready(function () {
    //$('.beta_box').css('display','none');
    //	$('.beta_box_sun').css('display','none');
    beta_msg();
    $('.beta_msg').css('display', 'none');
    $('.beta_msg_sun').css('display', 'block');
    //display beta message 20170419

    if (pageLang == 'de') {
        $('.city_cond_header').css('padding-left', '0px');
    }


    //ajax_get_region_info_map('en');
    ajax_get_member_info_sitemap('en');
    //generateSiteMap('regions');

    //if (getCookie('myFavorite_e') == null || getCookie('myFavorite_e') == "") {
    //
    //           $('.fav_item_mask').html('<div class="home_add_fav"><a href="./selection.html">Add Your Own City</a></div>');
    //         $('.fav_item_mask').addClass("fav_item_mask_add_button");
    //   }


    /*20161222*/
    $('.txt_share').one('click', function () { //.one('click') prevent multi run after multi click
        $('.share_btn_item').stop().slideToggle();
        return false;
    });
    $('.ico_share').one('click', function () { //.one('click') prevent multi run after multi click
        $('.share_btn_item').stop().slideToggle();
        return false;
    });

    /*20161222*/

    $('.city_local_time').css('display', 'none');
    $('.social-network-small').html($('.social-network').clone().contents());
    $('.header-menu-btn a').click(function () {
        if ($('.header-menu').is(':visible')) {
            $('.header-menu').slideUp(500, function () {
                $('.header-menu-btn a').children('img').attr('src', '../images/arrow_down.png');
            });
        } else {
            $('.header-menu').slideDown(500, function () {
                $('.header-menu-btn a').children('img').attr('src', '../images/arrow_up.png');
            });
        }
    });
    $('.main-menu-btn').click(function () {
        if ($('.mainmenu').is(':visible')) {
            $('.mainmenu').slideUp(500, function () { });
        } else {
            $('.mainmenu').slideDown(500, function () { });
        }
    });

    var param_val = getSelectedCity();
    //ajax_get_present_info('');
    //ajax_get_member_info('');

    $(window).resize(function () {
        updateFavBar();
    });

    if (isCookieEnabled && getCookie('fontsize_e') != null) {
        // changeFontSize(getCookie('fontsize_e'));
    } else {
        var fsv = sessvars.fontsize || '0';
        //changeFontSize(fsv);
    }
    //setupSearchBox();

    if ((/^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$/.test(param_val))) {
        ajax_get_city_info(param_val, '');

    } else {
        if (!getSelectedCity())
            window.location.href = './error.html';
    }

    setTimeout(function () {
        auto_adjust_height_map();
    }, 2500);


});



function auto_adjust_height_map() {
    climateTable_height = $('#climateTable').height();

    var climatological_area_height = $("#climatological_area_container").height();

    var city_map = $("#city_map_container").height();

    if (city_map < climatological_area_height) {

        city_openstreetmap_height = $("#city_openstreetmap_canvas").height();


        different_height = climatological_area_height - city_map;
        $('#city_openstreetmap_canvas').css('height', city_openstreetmap_height + different_height + 1 + 'px');
    }
}



/////
/////  REGION 
/////
/////


