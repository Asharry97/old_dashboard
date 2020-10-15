document.addEventListener('DOMContentLoaded', function(event) {

    /* Initialize Toastr Notification Options: This Toastr API makes it very easy to display Notificatiosn to the users */
    /*
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
    */

    /** Important Functions [COPIED] */
    function isIterable(object) {
        // checks for null and undefined
        if (object == null) {
            return false;
        }
        return typeof object[Symbol.iterator] === 'function';
    }

    /** All Table Related COlumns for DataTables */
    var alloweddomains_columns = [
        { data: "domain" },
        { data: "count" },
        { data: "status" }
    ];

    var blockeddomains_columns = [
        { data: "domain" },
        { data: "count" },
        { data: "status" }
    ];

    var clientlist_columns = [
        { data: "client" },
        { data: "count" },
        { data: "status" },
    ];

    var webcategorylist_columns = [
        { data: "webcategory" },
        { data: "count" }        
    ];

    var clientaccesslist_columns = [
            { data: "atTime" },
            { data: "clientIP" },
            { data: "domainName" },
            { data: "status" }
        ];

    var dashboard_table_columns_json = {
        "alloweddomains_table": alloweddomains_columns,
        "blockeddomains_table": blockeddomains_columns,
        "clientlist_table": clientlist_columns,
        "webcategorylist_table": webcategorylist_columns,
        "clientaccesslist_table": clientaccesslist_columns
    };


    /**  ---------------- Web APIs [Communicate with the WebServer]------------ */
    function populateDataTable_UsingAJAX(thisDataTableID, method, customUrl, postData) {

        $.ajax({
            type: method,
            url: customUrl,
            contentType: "text/plain",
            dataType: 'json',
            data: postData,
            success: function (data) {
                myJsonData = data;
                console.log("[Success] Received Data as shown below", { myJsonData });
                populateMyDataTable(thisDataTableID, myJsonData);
            },
            error: function (e) {
                console.log("[Error] There was an error with your request ", JSON.stringify(e));
                //toastr.error("Error, Could not Connect or Being Proper Data, Check Console");
            }
        });
    }

    /**  Populate the data table with Provided JSON{Array} data */
    function populateMyDataTable(thisDataTableID, rowData) {

        console.log("Data to be Populated in myDataTable With ID " + thisDataTableID + " -> [", { rowData }, "], Before Doing so Call clear() to Clear Previous DataTable Record");
        $("#" + thisDataTableID).DataTable().clear();

        if (isIterable(rowData)) {
            console.log("Data is Iterable. Do Not Modify the JsonData Array ");
        } else {
            rowData = new Array(rowData);
            console.log("Data is NOT Iterable. make the Json Data as Array as -> ", rowData);
        }

        var respColumns = dashboard_table_columns_json[thisDataTableID];

        console.log("dashboard_table_columns_json => ", dashboard_table_columns_json, ", respColumns => ", respColumns);

        //var respColumns = 
        console.log("thisDataTableID.get(alloweddomains_columns) -> ",  { respColumns } );

        // rowData = [{}]; [TestCase ] Not Working
        myDataTable = $("#" + thisDataTableID).DataTable({
                                        destroy: true,
                                        data: rowData,
                                        columns: respColumns
                                        });

        myDataTable.draw();// Add new data
    }

    // Show only the Selected Table Div that is Selected from the List & hide Rest Table Div
    $(".simpleTableBtnGroup button").click(function() {
        var app_dashboard_div = $(this).attr('id');
        console.log("TABLE BTN GROUP Selected having id", { app_dashboard_div });
        hideAllDashboardDiv();
        $( "." + app_dashboard_div ).show();
    });


    var dashboard_table_id = [ "alloweddomains_table", "blockeddomains_table", "clientlist_table", "webcategorylist_table" ];
    
    /** Initialize all DataTables */
    function initializeDataTables() {

        for (const one_dashboard_table_id of dashboard_table_id) {
            $("#" + one_dashboard_table_id).DataTable();    
        }
    }

    initializeDataTables();

    /** DataTable Functions */
    

    /** Load Actual Select Query Data with Limit 1000 Just to Check if Data can be Added in Table Using Complex [ Java ArrayList<> To JsonArray ] Json Data from Server **/
    $("#alloweddomains_btn").click(function() {
        var customUrl = "http://localhost:8080/sendalloweddomains";
        //var customUrl = "sendalloweddomains";
        var postData = "{ sqlLimit: 1000 }"; //[Testing] [CurrentVersionNoChange] [Java Accepts String data therfore send string {json} data]
        console.log("Using URL -> ", customUrl, "Post Data -> ", postData);
        populateDataTable_UsingAJAX("alloweddomains_table",'post', customUrl, postData);
        //toastr.success("Showing Allowed Domains Table");
    });


    $("#blockeddomains_btn").click(function() {
        var customUrl = "http://localhost:8080/sendblockeddomains";
        var postData = "{ sqlLimit: 1000 }";
        console.log("Using URL -> ", customUrl, "Post Data -> ", postData);
        populateDataTable_UsingAJAX("blockeddomains_table",'post', customUrl, postData);
        //toastr.success("Showing Blocked Domains Table");
    });


    $("#clientlist_btn").click(function() {
        var customUrl = "http://localhost:8080/sendclientdetails";
        var postData = "{ sqlLimit: 1000 }";
        console.log("Using URL -> ", customUrl, "Post Data -> ", postData);
        populateDataTable_UsingAJAX("clientlist_table",'post', customUrl, postData);
        //toastr.success("Showing Client List Table");
    });


    $("#webcategorylist_btn").click(function() {
        var customUrl = "http://localhost:8080/sendwebcategorylist";
        var postData = "{ sqlLimit: 1000 }";
        console.log("Using URL -> ", customUrl, "Post Data -> ", postData);
        populateDataTable_UsingAJAX("webcategorylist_table",'post', customUrl, postData);
        //toastr.success("Showing Totaly Category Stats Table");
    });

    $("#clientaccesslist_btn").click(function() {
            var customUrl = "http://localhost:8080/sendclientaccesslist";
            var postData = "{ sqlLimit: 1000 }";
            console.log("Using URL -> ", customUrl, "Post Data -> ", postData);
            populateDataTable_UsingAJAX("clientaccesslist_table",'post', customUrl, postData);
            //toastr.success("Showing Totaly Category Stats Table");
        });


    // Load All Reports [In Place] [Not Wokring properly Problem with the Table UI]
    document.querySelectorAll('div.container_reports button[id$="_btn"]').forEach(function(oneReportBtn) {
        console.log("Fetch All Reports");
        oneReportBtn.click();
    })

});

