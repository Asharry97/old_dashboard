
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

function sidebarResize() {
    if ($(window).width() >= 768) {
        $("#wrapper").addClass("toggled");
    } else {
        $("#wrapper").removeClass("toggled");
    }
}

$(window).resize(sidebarResize);
sidebarResize();

/* Initialize Toastr Notification Options: This Toastr API makes it very easy to display Notificatiosn to the users */
    
toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "1000",
    "hideDuration": "1000",
    "timeOut": "1000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}
    

$('a[id^="container_"]').click(function() {
    $('a[id^="container_"]').removeClass("selectedSideNavOption");
    $(this).addClass("selectedSideNavOption");
    let clickedBtnID = this.id;
    $('div[class^="container_"]').hide(); // Hide All Div
    $("." + clickedBtnID).show(); // Show Only that Respective Div
});

// Default Show Reports Div
document.querySelector("#container_reports").click();

// Reports
//  document.querySelectorAll("button[id$='_div']")
$('div.container_reports button[id$="_div"]').click(function() {
    console.log("Clicked on container_reports 'div.container_reports button[id$=\"_div\"]' ");
    
    let clickedBtnID = this.id;
    $('div.container_reports div[class$="_div"]').hide(); /// Hide All Div
    $("div.container_reports div." + clickedBtnID).show(); // Show Only that Respective Div
});

// Default Show Reports Only Allowed Reports Div
document.querySelector("#alloweddomains_div").click();


// WebCategory Div
$('div.container_webcategory button[id$="_div"]').click(function() {
    console.log("Clicked on container_webcategory 'div.container_webcategory button[id$=\"_div\"]' ");
    
    let clickedBtnID = this.id;
    $('div.container_webcategory div[class$="_div"]').hide(); /// Hide All Div
    $("div.container_webcategory div." + clickedBtnID).show(); // Show Only that Respective Div
});

// Default Show Div WebCategory  Div
$('div.container_webcategory div[class$="_div"]').hide(); /// Hide All Div
