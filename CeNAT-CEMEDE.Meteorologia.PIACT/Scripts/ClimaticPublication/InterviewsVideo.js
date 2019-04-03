//Class Interviewa Video

'use strict';
function pag(length) {
    //var itemsNumber = $('#panel .row').length;
    var itemsNumber = length / 3;
    var limitRowPerPage = 2; // Limit of rows per each page
    $('#panel .row:gt(' + (limitRowPerPage - 1) + ')').hide(); //Hide the rows that over limit of the current page
    var totalPages = Math.round(itemsNumber / limitRowPerPage); // Get number of pages
    $(".pagination").append("<li class='current-page active' value ='"+ 1 +"' ><a href='javascript:void(0)'>" + 1 + "</a></li>"); // Add first page marker
    
    // Loop to insert page number for each sets of items equal to page limit (e.g., limit of 4 with 20 total items = insert 5 pages)
    for (var i = 2; i < totalPages; i++) {
        if (i <= 4) {
            $(".pagination").append("<li class='current-page' value = '"+ i +"' ><a href='javascript:void(0)'>" + i + "</a></li>"); // Insert page number into pagination tabs
        }
        else {
            if (i < totalPages) {
                $(".pagination").append("<li class='current-page hide ' value = '" + i + "' ><a href='javascript:void(0)'>" + i + "</a></li>"); // Insert page number into pagination tabs
            }
        }
    }
    if (totalPages > 4) {
        $(".pagination").append("<li class='paginationjs-ellipsis disabled'><a>...</a></li>"); // Insert page number into pagination tabs
    }
    $(".pagination").append("<li class='current-page' value = '" + totalPages + "'><a href='javascript:void(0)'>" + totalPages + "</a></li>"); // Insert page number into pagination tabs

    //disabled previous
    hidePaginationItem(1, totalPages);

    // Add next button after all the page numbers  
    $(".pagination").append("<li id='next-page'><a href='javascript:void(0)' aria-label=Next><span aria-hidden=true>Siguiente</span></a></li>");

    // Function that displays new items based on page number that was clicked
    $(".pagination li.current-page").on("click", function () {debugger
        // Check if page number that was clicked on is the current page that is being displayed
        if ($(this).hasClass('active')) {
            return false; // Return false (i.e., nothing to do, since user clicked on the page number that is already being displayed)
        } else {
            var currentPage = $(this).index(); // Get the current page number
            $(".pagination li").removeClass('active'); // Remove the 'active' class status from the page that is currently being displayed
            $(this).addClass('active'); // Add the 'active' class status to the page that was clicked on
            $("#panel .row").hide(); // Hide all items in loop, this case, all the list groups
            var grandTotal = limitRowPerPage * currentPage; // Get the total number of items up to the page number that was clicked on

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
        if (currentPage === totalPages) {
            return false; // Return false (i.e., cannot navigate any further, since it would exceed the maximum number of pages)
        } else {
            currentPage++; // Increment the page by one
            $(".pagination li").removeClass('active'); // Remove the 'active' class status from the current page
            $("#panel .row").hide(); // Hide all items in the pagination loop
            var grandTotal = limitRowPerPage * currentPage; // Get the total number of items up to the page that was selected

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
            $("#panel .row").hide(); // Hide all items in the pagination loop
            var grandTotal = limitRowPerPage * currentPage; // Get the total number of items up to the page that was selected

            // Loop through total items, selecting a new set of items based on page number
            for (var i = grandTotal - limitRowPerPage; i < grandTotal; i++) {
                $("#panel .row:eq(" + i + ")").show(); // Show items from the new page that was selected
            }

            $(".pagination li.current-page:eq(" + (currentPage - 1) + ")").addClass('active'); // Make new page number the 'active' page
        }
        hidePaginationItem(currentPage,totalPages);
    });

}

//Function: Set video selected to iframe "fr" and play the video
function showVideo(object) {
    var src = object.title;
    src = src.split("?show")[0];
    $('#fr').attr('src', src + '?autoplay=1');
    $("#panelIframe").fadeIn("slow");
    //$(".ytp-button").trigger("click");
}

function hidePaginationItem(index, totalPages)
{
    if (index == 1) {
        $("#previous-page").addClass('disabled');
        $("#next-page").removeClass('disabled');
    }
    else {
        if (index >= totalPages) {
            $("#next-page").addClass('disabled');
        } else {
            $("#next-page").removeClass('disabled');
        }

        $("#previous-page").removeClass('disabled');
    }
    var position = 0;
    if(index >= 4 )
    {
        for (var i = index; i <= index + 2; i++)
        {
            var element = $(".pagination").find("[value=" + i + "]").removeClass('hide');
            if (i >= (totalPages - 1))
            {
                $(".pagination").find(".paginationjs").addClass('hide');
            }
        }
    }
} 