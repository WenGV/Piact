
sessvars = function () {
    var x = {}; x.$ = {
        prefs: { memLimit: 2000, autoFlush: true, crossDomain: false, includeProtos: false, includeFunctions: false }, parent: x, clearMem: function () { for (var i in this.parent) { if (i != "$") { this.parent[i] = undefined } }; this.flush(); }, usedMem: function () { x = {}; return Math.round(this.flush(x) / 1024); }, usedMemPercent: function () { return Math.round(this.usedMem() / this.prefs.memLimit); }, flush: function (x) {
            var y, o = {}, j = this.$$; x = x || top; for (var i in this.parent) { o[i] = this.parent[i] }; o.$ = this.prefs; j.includeProtos = this.prefs.includeProtos; j.includeFunctions = this.prefs.includeFunctions; y = this.$$.make(o); if (x != top) { return y.length }; if (y.length / 1024 > this.prefs.memLimit) { return false }
            x.name = y; return true;
        }, getDomain: function () {
            var l = location.href
            l = l.split("///").join("//"); l = l.substring(l.indexOf("://") + 3).split("/")[0]; while (l.split(".").length > 2) { l = l.substring(l.indexOf(".") + 1) }; return l
        }, debug: function (t) { var t = t || this, a = arguments.callee; if (!document.body) { setTimeout(function () { a(t) }, 200); return }; t.flush(); var d = document.getElementById("sessvarsDebugDiv"); if (!d) { d = document.createElement("div"); document.body.insertBefore(d, document.body.firstChild) }; d.id = "sessvarsDebugDiv"; d.innerHTML = '<div style="line-height:20px;padding:5px;font-size:11px;font-family:Verdana,Arial,Helvetica;' + 'z-index:10000;background:#FFFFCC;border: 1px solid #333;margin-bottom:12px">' + '<b style="font-family:Trebuchet MS;font-size:20px">sessvars.js - debug info:</b><br/><br/>' + 'Memory usage: ' + t.usedMem() + ' Kb (' + t.usedMemPercent() + '%)&nbsp;&nbsp;&nbsp;' + '<span style="cursor:pointer"><b>[Clear memory]</b></span><br/>' + top.name.split('\n').join('<br/>') + '</div>'; d.getElementsByTagName('span')[0].onclick = function () { t.clearMem(); location.reload() } }, init: function () {
            var o = {}, t = this; try { o = this.$$.toObject(top.name) } catch (e) { o = {} }; this.prefs = o.$ || t.prefs; if (this.prefs.crossDomain || this.prefs.currentDomain == this.getDomain()) { for (var i in o) { this.parent[i] = o[i] }; }
            else { this.prefs.currentDomain = this.getDomain(); }; this.parent.$ = t; t.flush(); var f = function () { if (t.prefs.autoFlush) { t.flush() } }; if (window["addEventListener"]) { addEventListener("unload", f, false) }
            else if (window["attachEvent"]) { window.attachEvent("onunload", f) }
            else { this.prefs.autoFlush = false };
        }

    }; x.$.$$ = {
        compactOutput: false, includeProtos: false, includeFunctions: false, detectCirculars: true, restoreCirculars: true, make: function (arg, restore) { this.restore = restore; this.mem = []; this.pathMem = []; return this.toJsonStringArray(arg).join(''); }, toObject: function (x) {
            if (!this.cleaner) {
                try { this.cleaner = new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$') }
                catch (a) { this.cleaner = /^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$/ }
            }; if (!this.cleaner.test(x)) { return {} }; eval("this.myObj=" + x); if (!this.restoreCirculars || !alert) { return this.myObj }; if (this.includeFunctions) { var x = this.myObj; for (var i in x) { if (typeof x[i] == "string" && !x[i].indexOf("JSONincludedFunc:")) { x[i] = x[i].substring(17); eval("x[i]=" + x[i]) } } }; this.restoreCode = []; this.make(this.myObj, true); var r = this.restoreCode.join(";") + ";"; eval('r=r.replace(/\\W([0-9]{1,})(\\W)/g,"[$1]$2").replace(/\\.\\;/g,";")'); eval(r); return this.myObj
        }, toJsonStringArray: function (arg, out) {
            if (!out) { this.path = [] }; out = out || []; var u; switch (typeof arg) {
                case 'object': this.lastObj = arg; if (this.detectCirculars) { var m = this.mem; var n = this.pathMem; for (var i = 0; i < m.length; i++) { if (arg === m[i]) { out.push('"JSONcircRef:' + n[i] + '"'); return out } }; m.push(arg); n.push(this.path.join(".")); }; if (arg) {
                    if (arg.constructor == Array) {
                        out.push('['); for (var i = 0; i < arg.length; ++i) {
                            this.path.push(i); if (i > 0)
                                out.push(',\n'); this.toJsonStringArray(arg[i], out); this.path.pop();
                        }
                        out.push(']'); return out;
                    } else if (typeof arg.toString != 'undefined') {
                        out.push('{'); var first = true; for (var i in arg) {
                            if (!this.includeProtos && arg[i] === arg.constructor.prototype[i]) { continue }; this.path.push(i); var curr = out.length; if (!first)
                                out.push(this.compactOutput ? ',' : ',\n'); this.toJsonStringArray(i, out); out.push(':'); this.toJsonStringArray(arg[i], out); if (out[out.length - 1] == u)
                                out.splice(curr, out.length - curr); else
                                first = false; this.path.pop();
                        }
                        out.push('}'); return out;
                    }
                    return out;
                }
                    out.push('null'); return out; case 'unknown': case 'undefined': case 'function': if (!this.includeFunctions) { out.push(u); return out }; arg = "JSONincludedFunc:" + arg; out.push('"'); var a = ['\n', '\\n', '\r', '\\r', '"', '\\"']; arg += ""; for (var i = 0; i < 6; i += 2) { arg = arg.split(a[i]).join(a[i + 1]) }; out.push(arg); out.push('"'); return out; case 'string': if (this.restore && arg.indexOf("JSONcircRef:") == 0) { this.restoreCode.push('this.myObj.' + this.path.join(".") + "=" + arg.split("JSONcircRef:").join("this.myObj.")); }; out.push('"'); var a = ['\n', '\\n', '\r', '\\r', '"', '\\"']; arg += ""; for (var i = 0; i < 6; i += 2) { arg = arg.split(a[i]).join(a[i + 1]) }; out.push(arg); out.push('"'); return out; default: out.push(String(arg)); return out;
            }
        }
    }; x.$.init(); return x;
}()

/////COMMON

/* Updated on 30 Oct 2017 */
var isCookieEnabled = true;
if (!sessvars.cookieEnabled && sessvars.cookieEnabled != null) isCookieEnabled = false;
var selector_list = '.header-menu-right>ul li a, .header-menu-left ul li a, .mainmenu li a, .submenu li a, #fav_item_container li a, .footer-area,.home_intro p,.page_note_content,.page_pilot_area li, .disclaimer_content, .page_data_content,site_map_footer h3,.site_map_footer ul li a,.lang_menu  ';
var pageLang = localLang = 'en';
var tr = [];
tr['add'] = "Add";
tr['remove'] = "Remove";
tr['instruct_add'] = "Click here to add city as my favourite";
tr['instruct_remove'] = "Click here to remove city from MyFavourites page";
var blinkTime = 800;
var index_blink = -1;
var timer_blink;
var forecastCityObj = null;
var member_json_data_map = null;
//20170306
var regionObj_map;
var divs = new Array();
var regionArray = new Array();
var ulId = 0;
var buf = new StringBuffer();
/*var areaObj = {
    "home": "Home",
    "regions": "Regions",
    "myfav": "MyFavourites",
    "wtnew": "What's New",
    "abtus": "About Us"
};*/
//20170306
/* 20161228 */
var currentTempUnit = getCookie('tempUnit_e');
if (currentTempUnit == null) {
    currentTempUnit = "C";
}

var currentWindUnit = getCookie('windUnit_e');
if (currentWindUnit == null || currentWindUnit == '') {
    currentWindUnit = "km/h";
}

/* 20161228 */


/* 20161221 */
var forecastCityObj = null;
var share_msg = "Here is the weather information for [#Place Name#] on the WMO\'s WWIS.";
var share_msg1 = "Weather information for [#Place Name#] on the WMO\'s WWIS:";
var share_msg2 = "[#Place Name#] Weather Information on the WMO\'s WWIS.";
var share_fav = "Here is the weather information for you on the WMO\'s WWIS.";
var wxinfo = "[#Place Name#] Weather Information";
var hello = "Hello,";
/* 20161221 */

function getCookie(c_name) {
    var isChinese = (c_name.indexOf('_uc') != -1);
    var isEnglish = (c_name.indexOf('_e') != -1);

    c_name = c_name.replace(/_e/gi, "_x");
    c_name = c_name.replace(/_uc/gi, "_x");

    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            if (isEnglish) {
                return unescape(y);
            }
            if (isChinese) {
                return unescape(y);
            }
        }
    }
}

function setCookie(c_name, value, exdays) {
    c_name = c_name.replace(/_e/gi, "_x");
    c_name = c_name.replace(/_uc/gi, "_x");

    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString() + "; path=/");
    document.cookie = c_name + "=" + c_value;
}

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else
            if (i == key && obj[i] == val || i == key && val == '') {
                objects.push(obj);
            } else if (obj[i] == val && key == '') {
                if (objects.lastIndexOf(obj) == -1) {
                    objects.push(obj);
                }
            }
    }
    return objects;
}

function changeFontSize(fs) {
    if (isCookieEnabled)
        setCookie('fontsize_e', fs, 365);
    else
        //alert(fs);
        sessvars.fontsize = fs;
    $('.large_font').removeAttr('href').removeClass('no_href');
    $('.small_font').removeAttr('href').removeClass('no_href');
    if (fs == "0") {

        $('.large_font').attr("href", "javascript:changeFontSize(\'1\');");
        $('.small_font').addClass('no_href');
    }
    if (fs == "1") {
        $('.large_font').attr("href", "javascript:changeFontSize(\'2\');");
        $('.small_font').attr("href", "javascript:changeFontSize(\'0\');");
    }
    if (fs == "2") {
        $('.large_font').addClass('no_href');
        $('.small_font').attr("href", "javascript:changeFontSize(\'1\');");
        selector_list = selector_list.replace(", .weekday_n_date", "");
        selector_list = selector_list.replace(", .cen span, .cen1 span", "");
    }
    //alert('fs='+fs);
    $(selector_list).removeClass(function (index, css) {
        return (css.match(/\bfs\S+/g) || []).join(' ');
    }).addClass('fs' + fs);
}

function triggerSubMenu(mid) {
    var allsubmenu = $('div[id*="menu"]');
    for (var i = 0; i < allsubmenu.length; i++) {
        var getSubID = $(allsubmenu[i]).attr('id');
        if (mid != getSubID && $('#' + getSubID).is(':visible')) {
            $('#' + getSubID).slideUp(500, function () { });
        }
    }
    if (!$('#' + mid).is(':visible')) {
        $('#' + mid).slideDown(500, function () { });
    } else {
        $('#' + mid).slideUp(500, function () { });
    }
}

function checkTerritory(keyword) {
    //Territory prefix list
    var chkTerr = ["spain - ", "france - ", "portugal - ", "uk - ", "西班牙-", "法国-", "葡萄牙-", "英国-", "espagne - ", "españa - ", "francia - ", "reino unido - ", "hiszpania - ", "francja - ", "portugalia - ", "wielka brytania - ", "اسبانيا - ", "فرنسا - ", "البرتغال - ", "المملكة المتحدة - ", "法國-", "英國-", "(spanien)", "(frankreich)", "(portugal)", "(großbritannien)", "spagna - ", "portogallo - ", "regno unito - ", "espanha - ", "frança - ", "испания - ", "франция - ", "португалия - ", "스페인령 - ", "포르투갈령 - ", "영국령 - ", "프랑스령 - "];
    var isTerr = false;
    for (var i = 0; i < chkTerr.length; i++) {
        if (keyword.indexOf(chkTerr[i]) > -1) {
            isTerr = true;
            break;
        }
    }
    return isTerr;
}
function redirect2page(sKey, page) {
    console.log('redirect2page: ' + sKey + ', ' + page);
    if (/[A-Z]{3}/.test(sKey)) {
        window.location.href = "./country.html?countryCode=" + sKey;
    } else {
		/*if(page == 'home') {
			displayLoadingMsg(loading + '...');
			ajax_get_city_info(sKey); //, true
			
			var currentMapType = getCookie('mapType_e') || sessvars.mapType;
			if(pageLang == 'zh')
				currentMapType = getCookie('mapTypeC_e') || sessvars.mapTypeC;
			
			if(currentMapType == "openstreet") openstreetGetMarkerByCityID(sKey);
			
			setSelectedCSS();
			t = setTimeout(function(){clearTimeout(t);updateRAandMemId();},150);
			setTimeout($.unblockUI, 1000);
			setTimeout(function(){$('#q_search1').val(default_search_text);}, 1200);
		}
		else */
        if (page == 'territory')
            window.location.href = "./country.html?countryCode=" + sKey;
        else
            window.location.href = "./city.html?cityId=" + sKey;
    }
}

/*Search Box Submit*/
function searchFormSubmit(searchFormID) {
    var keyword = document.getElementById(searchFormID).query.value;
    var page = document.getElementById(searchFormID).page.value;
    console.log('searchKey: ' + searchKey);
    console.log('keyword: ' + keyword);
    console.log('page: ' + page);
    if (keyword.length == 0 || searchKey.length == 0) {
        //alert(default_search_text);
        return false;
    } else {
        if (searchKey != '') {
            if (checkTerritory(searchValue.toLowerCase()))
                page = "territory";
            redirect2page(searchKey, page);
            return false;
        } else {
            var found = false;
            $.each(qsDataSource, function (key, value) {
                if (keyword.toLowerCase() == value.value.toLowerCase()) {
                    if (checkTerritory(keyword.toLowerCase()))
                        page = "territory";
                    redirect2page(value.key, page);
                    found = true;
                }
            });

            if (!found)
                alert(not_found);
        }
        return false;
    }
}
/*Search Box Submit*/
function setupSearchBox() {
    $.getJSON('/' + pageLang + '/json/QuickSearch_' + pageLang + '.xml', function (data) {
        search_data = data;

        var cityname = getSelectedCity('name') || 'empty';
        var city_obj = getObjects(search_data, 'value', cityname.replace(/\+/g, " "));
        if (city_obj.length) { window.location.href = './city.html?cityId=' + city_obj[0].key; }
        if (city_obj.length == 0 && cityname != 'empty' && !getSelectedCity('cityId')) { window.location.href = './error.html'; }

        $.each(data, function (key, val) {
            var item = new Array;
            item["value"] = val.value + '^' + val.eng;
            item["key"] = val.key;
            qsDataSource.push(item);
        });
    }).fail(function () {
        console.log("Cannot get the JSON.");
    });
    $('#q_search').focus(function () {
        if ($(this).val() == default_search_text) $(this).val('');
    }).blur(function () {
        if ($(this).val().length == 0) $(this).val(default_search_text);
    });
    //setup autocomplete on quick search box
    $("#q_search").autocomplete({
        source: qsDataSource,
        autoFocus: true,
        focus: function (event, ui) {
            if (ui.item) {
                searchKey = ui.item.key;
                searchValue = ui.item.value.split('^').shift();
            }
            event.preventDefault();
        },
        select: function (event, ui) {
            if (event.keyCode == 0 || event.keyCode == 13) { // click || enter
                $('.top_searchbox_submit').focus();
                searchFormSubmit('searchForm');
            }
            $('.top_searchbox_submit').focus();
        },
        open: function (event, ui) {
            $.map($('.ui-menu-item'), function (val, i) {
                var content = $(val).html().split('^');
                $(val).html(content.shift());
            });
        }
    });

    $("#q_search").focusout(function () {
        var keyword = $('#q_search').val();
        if (keyword.length > 0 || searchKey.length > 0) searchFormSubmit('searchForm');
    });
}


/*** get url parameter start ***/
function getSelectedCity() {
    return $("#select2 option").length > 1 ? $("#select2 option:selected")[0].id : $("#select2 option")[0].id ;
}
/*** get url parameter end ***/

function loadSavedLocations() {


}

function updateFavBtnImg(cid, icon_name) {
    if (icon_name == 'add') {
        location.reload();
        $('#favButton' + cid).attr({ 'href': 'javascript:addToMyFavoriteList(' + cid + ', \'no\', false);', 'title': 'Click here to add city as my favourite' }).removeClass('link_ico_remove').addClass('class="link_ico_add"').html('<span class="ico_add">&#10010;</span><span class="txt_add">Add</span>');

    }
    if (icon_name == 'remove') {
        location.reload();
        $('#favButton' + cid).attr({ 'href': 'javascript:removeFromMyFavoriteList(' + cid + ', \'no\', false);', 'title': 'Click here to remove city from MyFavourites page' }).removeClass('class="link_ico_add"').addClass('class="link_ico_remove"').html('<span class="ico_remove">-</span><span class="txt_remove">Remove</span>');
    }

    if (icon_name == 'remove_add') {
        $('.ico_add').css('display', 'none');
        window.location.href = './city.html?cityId=' + cid;
    }
}

function removeFromMyFavoriteListSelection(itemId) {//, favType, btnId, reload
    //var fav = favType + '#' + itemId;
    //favCityIdnAction = itemId + '#remove';
    if (getCookie('myFavorite_e') != null) {
        var fav = 'c#' + itemId;
        var favArr = getCookie('myFavorite_e').split('|');
        var index = favArr.indexOf(fav);
        favArr.splice(index, 1);

        setCookie('myFavorite_e', favArr.join('|'), 365);

        /*if (btnId == 'no') {
            updateFavBtnImg(itemId, 'add');
            return;
        }

        if (reload && favArr.length > 0) {
            loadMyFavorites(false);
            favButton_handler(itemId);
            setSelectedCSS();
        } else if (btnId == 'myFavPage') {
            if (getCookie('myFavorite_e') != null && getCookie('myFavorite_e') != '')
                window.location.href = './myfavourites.html';
            else
                window.location.href = './home.html';
        } else {
            favButton_handler(itemId);
        }*/
    } else {
        console.log('cookie err');
    }
    loadSavedLocations();
}


/*fav handler area*/
function removeFromMyFavoriteList(selcityid, btnId, reload) {//, favType, btnId, reload
    //var fav = favType + '#' + itemId;
    //favCityIdnAction = itemId + '#remove';
    if (getCookie('myFavorite_e') != null) {
        var fav = 'c#' + selcityid;
        var favArr = getCookie('myFavorite_e').split('|');
        var index = favArr.indexOf(fav);
        favArr.splice(index, 1);

        setCookie('myFavorite_e', favArr.join('|'), 365);

        if (btnId == 'no') {
            updateFavBtnImg(selcityid, 'add');
            return;
        }

        if (getCookie('myFavorite_e') != null && getCookie('myFavorite_e') != '') {
            window.location.href = './myfavourites.html';
        } else {
            window.location.href = './home.html';
        }
		/*
        if (reload && favArr.length > 0) {
            loadMyFavorites(false);
            favButton_handler(itemId);
            setSelectedCSS();
        } else if (btnId == 'myFavPage') {
            if (getCookie('myFavorite_e') != null && getCookie('myFavorite_e') != '')
                window.location.href = './myfavourites.html';
            else
                window.location.href = './home.html';
        } else {
            favButton_handler(itemId);
        }*/
    } else {
        console.log('cookie err');
    }
    //alert('load favour');
    loadMyFavorites();
    //loadSavedLocations(); //20161222
}

function addToMyFavoriteListSelection() {//20161228 for selection page
    //var fav = favType + '#' + itemId;
    if (selcityid > 0) {
        var fav = 'c#' + selcityid;
        //favCityIdnAction = itemId + '#add';
        if (getCookie('myFavorite_e') != null && getCookie('myFavorite_e') != '') {
            var favArr = getCookie('myFavorite_e').split('|');
            var numOfFavArr = favArr.length;
            var index = favArr.indexOf(fav);
            if (index == -1) {
                setCookie('myFavorite_e', getCookie('myFavorite_e') + '|' + fav, 365);
                numOfFavArr += 1;
            }


        } else {
            setCookie('myFavorite_e', fav, 365);

        }
        //Assume only selection page can add city, update sortable list
        $('#faf_searchbox').val('');
        loadSavedLocations();
    }
}


function addToMyFavoriteList(selcityid, btnId, reload) {//itemId, favType
    //var fav = favType + '#' + itemId;
    if (selcityid > 0) {
        var fav = 'c#' + selcityid;
        //favCityIdnAction = itemId + '#add';
        if (getCookie('myFavorite_e') != null && getCookie('myFavorite_e') != '') {
            var favArr = getCookie('myFavorite_e').split('|');
            var numOfFavArr = favArr.length;
            var index = favArr.indexOf(fav);
            if (index == -1) {
                setCookie('myFavorite_e', getCookie('myFavorite_e') + '|' + fav, 365);
                numOfFavArr += 1;
            }

            if (btnId == 'no') {
                updateFavBtnImg(selcityid, 'remove');
                return;
            }



            if (btnId == 'city_no') {
                updateFavBtnImg(selcityid, 'remove_add');

                return;
            }



			/*if (btnId == 'no') {
				updateFavBtnImg(itemId, 'remove');
				return;
			}

			if (reload) {
				favButton_handler(itemId);
				setSelectedCSS('c' + itemId + '_' + numOfFavArr);
				loadMyFavorites(false);
			} else {
				favButton_handler(itemId);
			}*/
        } else {
            setCookie('myFavorite_e', fav, 365);

            if (btnId == 'no') {
                updateFavBtnImg(selcityid, 'remove');
                return;
            }

            if (btnId == 'city_no') {
                updateFavBtnImg(selcityid, 'remove_add');
                return;
            }


			/*if (btnId == 'no') {
				updateFavBtnImg(itemId, 'remove');
				return;
			}

			if (reload) {
				favButton_handler(itemId);
				setSelectedCSS('c' + itemId + '_1');
				loadMyFavorites(false);
			}*/
        }
        //Assume only selection page can add city, update sortable list
        $('#faf_searchbox').val('');
        //loadSavedLocations(); //20161222
    }
}



function updateMyFavoriteList(favOrderList) {
    var content = "";
    var arr = favOrderList.split('&');
    for (var i = 0; i < arr.length; i++) {
        if (i != 0)
            content += '|';
        var typeNid = arr[i].substr(0, arr[i].indexOf('['));
        content += typeNid.substr(0, 1) + '#' + typeNid.substr(1);
    }
    setCookie('myFavorite_e', content, 30);
}

function isExistInCookie(cookieName, separator, item) {
    var isExist = false;
    if (getCookie(cookieName) != null && getCookie(cookieName) != '') {
        if (separator.length > 0) {
            var cookieArr = getCookie(cookieName).split(separator);
            var index = cookieArr.indexOf(item);
            if (index > -1)
                isExist = true;
        } else {
            if (getCookie(cookieName) == item)
                isExist = true;
        }
        return isExist;
    } else {
        return false;
    }
}
/*fav handler area*/

function ObjectLength(object) {
    var length = 0;
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            ++length;
        }
    }
    return length;
};

function swap2divs(class1, class2) {
    var div1 = $('.' + class1);
    var div2 = $('.' + class2);
    var tdiv1 = div1.clone();
    var tdiv2 = div2.clone();
    div1.replaceWith(tdiv2);
    div2.replaceWith(tdiv1);
}

//----new 20161220
function share_box_control() {

    $('.share_box_container').slideToggle();
    //alert("test2");
}

function shareFacebook(page) {
    var extLink = 'http://www.facebook.com/share.php?m2w&s=100';
    //window.location.href = (extLink + '&p[url]=' + prepareSharePath(page) + '&p[summary]=');
    window.location.href = (extLink + '&p[url]=' + prepareSharePath(page) + '&p[summary]=' + prepareShareContent(page, 'facebook'));
}

function shareTwitter(page) {
    var extLink = 'http://twitter.com/intent/tweet?status=';
    window.location.href = (extLink + prepareShareContent(page, 'twitter'));
}

function shareWeibo(page) {
    var extLink = 'http://v.t.sina.com.cn/share/share.php?url=';
    window.location.href = (extLink + prepareSharePath(page) + '&title=' + prepareShareContent(page, 'weibo'));
}

function shareLinkedIn(page) {
    var extLink = 'http://www.linkedin.com/shareArticle?url=';
    window.location.href = (extLink + prepareSharePath(page) + '&title=' + prepareShareContent(page, 'linkedin') + '&summary=' + prepareSharePath(page) + " &ro=true");
}

function shareGooglePlus(page) {
    var extLink = 'http://plus.google.com/share?url=';
    window.location.href = (extLink + prepareSharePath(page));
}

function emailFriend(page) {
    window.location.href = 'mailto:?subject=' + prepareEmailSubject(page) + '&body=' + prepareShareContent(page, 'email') + "%0A" + prepareSharePath(page);
}

function prepareShareContent(page, cat) {


    var msg = '';
    var msg1 = '';
    var msg2 = '';

    if (page == 'home') {

        msg = share_msg.replace(/\[#Place Name#\]/g, forecastCityObj[0].cityName);
        msg1 = share_msg1.replace(/\[#Place Name#\]/g, forecastCityObj[0].cityName);
        msg2 = share_msg2.replace(/\[#Place Name#\]/g, forecastCityObj[0].cityName);
    }

    if (page == 'country') {
        msg = share_msg.replace(/\[#Place Name#\]/g, memberObj[0].memName); msg1 = share_msg1.replace(/\[#Place Name#\]/g, memberObj[0].memName); msg2 = share_msg2.replace(/\[#Place Name#\]/g, memberObj[0].memName);
    }

    if (page == 'city') {
        msg = share_msg.replace(/\[#Place Name#\]/g, cityObj[0].cityName); msg1 = share_msg1.replace(/\[#Place Name#\]/g, cityObj[0].cityName); msg2 = share_msg2.replace(/\[#Place Name#\]/g, cityObj[0].cityName);
    }

    if (page == 'myfav') {
        msg = share_fav; msg1 = share_fav; msg2 = share_fav;
    }

    if (cat == 'email') {
        return hello + '%0A%0A' + msg;
    } else if (cat == 'facebook' || cat == 'twitter' || cat == 'weibo' || cat == 'googleplus') {

        return msg1 + ' %0A' + prepareSharePath(page);
    }
    else {
        return msg2;
    }
}

function prepareSharePath(page) {

    var pathname_str = '';
    var pathname = (window.location.pathname).split("/");

    if (pathname.length > 3) {
        for (var i = 1; i < pathname.length - 2; i++) {
            pathname_str += '/' + pathname[i];
        }
    }

    var base = window.location.protocol + '//' + window.location.host + pathname_str + '/';

    var link = "";
    d = new Date();

    if (page == 'home') {




        link = encodeURIComponent(base + pageLang + '/city.html');
        //link=encodeURIComponent(base+'revamp'+'/city.html'); //need to update after publish


        return link + encodeURIComponent("?" + d.yyyymmddhhii() + "&cityId=" + forecastCityObj[0].cityId);
    }

    if (page == 'myfav') {
        link = encodeURIComponent(base + pageLang + '/myfavourites.html');
        var listofcity = (getCookie('myFavorite_e').replace(/\#/g, 'ww')).replace(/\|/g, 'is');
        return link + encodeURIComponent("?" + d.yyyymmddhhii() + "&cityId=" + listofcity);
    }

    if (page == 'country') {
        link = encodeURIComponent(base + pageLang + '/country.html');
        return link + encodeURIComponent("?" + d.yyyymmddhhii() + "&countryCode=" + memberObj[0].memId);
    }

    if (page == 'city') {
        link = encodeURIComponent(base + pageLang + '/city.html');
        return link + encodeURIComponent("?" + d.yyyymmddhhii() + "&cityId=" + cityObj[0].cityId);
    }

}


function prepareEmailSubject(page) {
    if (page == 'home') return encodeURIComponent(wxinfo.replace(/\[#Place Name#\]/g, forecastCityObj[0].cityName));
    if (page == 'myfav') return encodeURIComponent(wxinfo_share_from_frd);
    if (page == 'country') return encodeURIComponent(wxinfo.replace(/\[#Place Name#\]/g, memberObj[0].memName));
    if (page == 'city') return encodeURIComponent(wxinfo.replace(/\[#Place Name#\]/g, cityObj[0].cityName));
}

function prepareShareTitle(page) {
    if (page == 'home') return encodeURIComponent(wxinfo.replace(/\[#Place Name#\]/g, forecastCityObj[0].cityName));
    if (page == 'myfav') return encodeURIComponent(wxinfo_share_from_frd); if (page == 'country')
        return encodeURIComponent(wxinfo.replace(/\[#Place Name#\]/g, memberObj[0].memName));
    if (page == 'city') return encodeURIComponent(wxinfo.replace(/\[#Place Name#\]/g, cityObj[0].cityName));
}

Date.prototype.yyyymmddhhii = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    var hh = this.getHours().toString();
    var ii = this.getMinutes().toString();
    if (mm.length == 1) { mm = "0" + mm; }
    if (dd.length == 1) { dd = "0" + dd; }
    if (hh.length == 1) { hh = "0" + hh; }
    if (ii.length == 1) { ii = "0" + ii; }
    return yyyy + mm + dd + hh + ii;
};

/*20161220 add*/

/* 20161228 */

function convert_c2f(temp_c) {
    temp_f = Math.round((temp_c * 1.8) + 32);
    return temp_f;
}

/* 20170206 */
function convert_km2m(temp_w_km) {
    temp_w_m = (temp_w_km * 5) / 18;

    if (temp_w_m < 1) {
        temp_w_m = roundNumber(temp_w_m, 1);
    } else {
        temp_w_m = Math.round(temp_w_m);
    }
    if (temp_w_m == 0) {
        temp_w_m = 0;
    }
    return temp_w_m;
}

function convert_m2km(temp_w_m) {
    temp_w_km = (temp_w_m * 18) / 5;

    if (temp_w_km < 1) {
        temp_w_km = roundNumber(temp_w_km, 1);
    } else {
        temp_w_km = Math.round(temp_w_km);
    }

    if (temp_w_km == 0) {
        temp_w_km = 0;
    }
    return temp_w_km;
}

function roundNumber(number, decimals) { // Arguments: number to round, number of decimal places
    var newnumber = new Number(number + '').toFixed(parseInt(decimals));
    //document.roundform.roundedfield.value =  parseFloat(newnumber); // Output the result to the form field (change for your purposes)
    return newnumber;
}

function StringBuffer() { this.buffer = []; }
StringBuffer.prototype.append = function append(string) { this.buffer.push(string); return this; };
StringBuffer.prototype.toString = function toString() { return this.buffer.join(""); };

function convert_24_2_12_hour(input_time) { //eg input time format 19:29

    hour = input_time.substr(0, 2);
    min = input_time.substr(3, 2);

    time_suffix = "";

    time_suffix = (hour >= 12) ? 'PM' : 'AM';
    hour = (hour > 12) ? hour - 12 : hour;

    output_time = hour + ":" + min + " " + time_suffix;
    return output_time;
}


//20170307 Generate site map
function toggle(l, i) {
    o = MM_findObj(l);
    o.style.display = o.style.display == "none" ? "block" : "none";
    if (document.images) {
        document.images[i].src = o.style.display == "block" ? "../images/minus.gif" : "../images/plus.gif";
    }
}

function MM_findObj(n, d) { //v4.01
    var p, i, x; if (!d) d = document; if ((p = n.indexOf("?")) > 0 && parent.frames.length) {
        d = parent.frames[n.substring(p + 1)].document; n = n.substring(0, p);
    }
    if (!(x = d[n]) && d.all) x = d.all[n]; for (i = 0; !x && i < d.forms.length; i++) x = d.forms[i][n];
    for (i = 0; !x && d.layers && i < d.layers.length; i++) x = MM_findObj(n, d.layers[i].document);
    if (!x && d.getElementById) x = d.getElementById(n); return x;
}


function showlist(item, num) {
    buf.append('<ul class="rccsitemap" id="list' + ulId + '">');

    var imgsrc = "minus";
    if (item == 'regions') {
        for (var i = 0; i < regionObj_map.length; i++) {
            ulId++;
            divs.push(ulId);

            var region_num = "";

            if (regionObj_map[i].id == "1") {
                region_num = "I";
            }

            if (regionObj_map[i].id == "2") {
                region_num = "Ⅱ";
            }

            if (regionObj_map[i].id == "3") {
                region_num = "Ⅲ";
            }

            if (regionObj_map[i].id == "4") {
                region_num = "Ⅳ";
            }

            if (regionObj_map[i].id == "5") {
                region_num = "Ⅴ";
            }

            if (regionObj_map[i].id == "6") {
                region_num = "Ⅵ";
            }
            buf.append("<li><a href=\"javascript:toggle('list" + ulId + "', 'img" + ulId + "');\"><img src=\"../images/" + imgsrc + ".gif\" id=\"img" + ulId + "\" align=\"middle\" border=\"0\" alt=\"\" width=\"16\" height=\"13\" /></a>");
            //buf.append(" <strong><a class=\"sitemap_link\" href=\"./region.html?ra=" + regionObj_map[i].id + "\">" + regionObj_map[i].name + "</a></strong>");
            buf.append(" <strong><a class=\"sitemap_link\" href=\"./region.html?ra=" + regionObj_map[i].id + "\">" + regionObj_map[i].name + " (" + areaObj['region'] + " " + region_num + ")</a></strong>");

            showlist('member', regionObj_map[i].id);
            buf.append("</li>");
        }
    }
    if (item == 'member') {
        memberObj = getObjects(region_json_data, 'id', num);
        var tmp = getObjects(member_json_data_map, 'memId', memberObj[0].members[0].memId);
        for (var i = 0; i < memberObj[0].members.length; i++) {
            buf.append("<li><a style=\"padding-left:35px;\" href=\"./country.html?countryCode=" + memberObj[0].members[i].memId + "\">" + memberObj[0].members[i].memName + "</a></li>");

        }
    }

    ulId++;

    if (item == 'city') {
        cityObj = getObjects(member_json_data_map, 'memId', num);
        for (var i = 0; i < cityObj[0].city.length; i++) {
            buf.append("<li><a style=\"padding-left:45px;\" href=\"./city.html?cityId=" + cityObj[0].city[i].cityId + "\">" + cityObj[0].city[i].cityName + "</a></li>");
        }
    }


    if (item == 'home') {
        var menu = [{ "name": "Home", "url": "./home.html" }, { "name": "Apps", "url": "./apps.html" }];
        for (var i = 0; i < menu.length; i++) {
            buf.append("<li><a href=\"" + menu[i].url + "\">" + menu[i].name + "</a></li>");
        }
    }

    if (item == 'myfav') {
        var menu = [{ "name": "MyFavourites", "url": "./myfavourites.html" }];
        for (var i = 0; i < menu.length; i++) {
            buf.append("<li><a href=\"" + menu[i].url + "\">" + menu[i].name + "</a></li>");
        }
    }

    if (item == 'wtnew') {
        var menu = [{ "name": "What's New", "url": "./whatsnew.html" }];
        for (var i = 0; i < menu.length; i++) {
            buf.append("<li><a href=\"" + menu[i].url + "\">" + menu[i].name + "</a></li>");
        }
    }

    if (item == 'abtus') {
        var menu = [{ "name": "About this website", "url": "./pilot.html" }, { "name": "Participating Members", "url": "./members.html" }, { "name": "Weather Icons", "url": "./wxicons.html" }, { "name": "Nomination Form", "url": "http://www.worldweather.org/event/nomination.doc" }];
        for (var i = 0; i < menu.length; i++) {
            buf.append("<li><a href=\"" + menu[i].url + "\">" + menu[i].name + "</a></li>");
        }
    }

    buf.append('</ul>');
}

function generateSiteMap(area) {

    buf = new StringBuffer();
    //buf.append('<ul class="rccsitemap" id="list' + ulId + '">');
    ulId++;
    //buf.append('<div class="sitemap_title"><h3>' + areaObj[area] + '</h3></div>');
    //showlist(area, 0);
    //buf.append('</li></ul>');

    if (area == 'regions') {
        $('#rccSiteMap').html(buf.toString());
        for (var i = 0; i < divs.length; i++) {
            toggle('list' + divs[i], 'img' + divs[i]);
        }
    }

}


function ajax_get_region_info_map(lang) {
    $.ajax({
        url: "../Home/worldWeatherGetCountries_InfoSiteMap",
        type: "GET",
        dataType: "text",
        async: false,
        cache: true,
        success: function (Jdata) {
            region_json_data = JSON.parse(JSON.parse(Jdata));
            regionObj_map = getObjects(region_json_data, 'id', '');
            if (regionObj_map.length > 0) {
                for (var i = 0; i < regionObj_map.length; i++) {
                    regionArray.push(regionObj_map[i].name);
                }
                //if(breadcrumb!=''){
                //build_breadcrumb();
                //}
            } else {
                console.log('nothing');
            }
        },
        error: function () {
            console.log("ERROR!!!");
        }
    });
}





function ajax_get_member_info_sitemap(lang) {
    //$.ajax({
    //    url: "../Home/worldWeatherGetCountries_Map",
    //    type: "GET",
    //    dataType: "text",
    //    async: false,
    //    success: function (Jdata) {
    //        member_json_data_map = JSON.parse(JSON.parse(Jdata));
    //    },
    //    error: function () {
    //        console.log("ERROR!!!");
    //    }
    //});
}

//end geneate site map

function prepareURL(domain, page) {
    var para = window.location.search.substring(1);
    if (para.length > 0)
        window.location = domain + page + '.html?' + para;
    else
        window.location = domain + page + '.html';
}


function lang_css() {
    if (window.innerWidth <= 600) {
        if (pageLang == 'pl' || pageLang == 'pt' || pageLang == 'ru' || pageLang == 'de') {
            $('.forecast_day_object_header').css('font-size', '83%');

        }
    }

}

function getWords(str, number) {
    return str.split(/\s+/).slice(0, number).join(" ");
}


$(window).scroll(function () {
    if ($(window).scrollTop() > 99 && !$('#floating_back_to_top').is(':visible')) {
        $('#floating_back_to_top').css({ 'display': 'block' });
    }
    if ($(window).scrollTop() <= 99 && $('#floating_back_to_top').is(':visible')) {
        $('#floating_back_to_top').css({ 'display': 'none' });
    }
});

function reset_map_cookie() {

    setCookie('map_e_lat', '', 30);
    setCookie('map_e_lng', '', 30);
}



//



//////////////////////////////////////////////

//////COMMON
