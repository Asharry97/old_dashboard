document.addEventListener('DOMContentLoaded', function (event) {

    console.log("webcategory.js File Loaded");

    /** No In Use Whill do it if time permits */
    class WebCategory {
        constructor(websiteName, webCategoryName) {
            this.websiteName = websiteName;
            this.webCategoryName = webCategoryName;
        }
    }

    class ServerConnector {
        static checkInWebCategoryURL = "http://localhost:8080/checkwebsitepresentincategorytable";
        static addToWebCategoryURL = "http://localhost:8080/addwebsitetoprovidedwebcategoryincategorytable";
        static deleteFromWebCategoryURL = "http://localhost:8080/deletewebsitewithprovidedwebcategory";

        static sendAndReceiveFromServer(method, customUrl, postData) {
            $.ajax({
                type: method,
                url: customUrl,
                contentType: "text/plain",
                dataType: 'json',
                data: postData,
                success: function (data) {
                    myJsonData = data;
                    console.log("[Success] AJAX Received Data as shown below", { myJsonData });
                    WebCategoryChecker_UI_Manager.addToQueryStatusLabel(myJsonData);
                },
                error: function (e) {
                    console.log("[Error] AJAX There was an error with your request ", JSON.stringify(e));
                    toastr.error("Error, Could not Connect or Being Proper Data, Check Console");
                }
            });
        }

        static sendWebCategoryAndListToServer(method, customUrl, postData) {
            console.log("Sending Post Data: ", postData);
            $.ajax({
                type: method,
                url: customUrl,
                contentType: "text/plain",
                dataType: 'json',
                data: postData,
                success: function (data) {
                    myJsonData = data;
                    console.log("[Success] AJAX Received Data as shown below", { myJsonData });
                    //WebCategoryChecker_UI_Manager.addToQueryStatusLabel(myJsonData);
                    WebCategoryCreator_UI_Manager.showAlert(JSON.stringify(myJsonData), "success");
                },
                error: function (e) {
                    console.log("[Error] AJAX There was an error with your request ", JSON.stringify(e));
                    toastr.error("Error, Could not Connect or Being Proper Data, Check Console");
                }
            });
        }
    }

    class Validation {

        // Imp Variables
        static regexDomainCheck = /(^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])$/;
        static regexValidCategoryName = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;

        /** Change This */
        static domainNameIsProper(websitename) {
            // Implement it later on
            toastr.warning("No DomainName is Checked, [FutureScope] Implement it later on");
            console.log(">>> regexDomainCheck.test(websitename) >> " + Validation.regexDomainCheck.test(websitename));
            if (Validation.regexDomainCheck.test(websitename)) {
                toastr.warning("Matched Our Currently Used Domain Checker Regex, domain MIGHT be proper");
                console.log("toastr: object data: ", toastr);
                return true;
            } else {
                toastr.warning("DOES NOT MATCH our Currenly Used Domain Checker Regex");
                return false;
            }
        }

        static checkValidCategoryName(categoryName) {
            let checker;
            if ((checker = this.regexValidCategoryName.exec(categoryName)) !== null) {
                console.log("Web Catgeory Name Checker: ", checker);
                return true;
            }
            return false;
        }

        static domainCheck(websitename) {
            // checks for null and undefined
            if (websitename == null || websitename === "") {
                toastr.error("Please provide WebsiteName!");
                return false;
            }
            else {
                if (this.domainNameIsProper(websitename)) {
                    toastr.success("[Website:" + websitename + "] is Proper");
                    return true;
                } else {
                    toastr.error("[Website:" + websitename + " is IMProper");
                    return false;
                }
            }
        }

    }

    class WebCategoryChecker_UI_Manager {

        // All IMP ID
        static checkCategoryDiv = "checkwebcategory_div";
        static websiteNameInputId = "querywebsite";
        static categoryNameSelectId = "querywebcategory";
        static checkWebCategoryBtnId = "checkinwebcategory_btn";
        static addWebSiteToCategoryBtnId = "addwebsitetocategory_btn";
        static removeFromWebCategoryBtnId = "removefromwebcategory_btn";
        static clearQueryStatusLogBtnId = "clearquerystatuslog_btn";
        static queryStatusLabelId = "querystatuslabel";


        static addToQueryStatusLabel(jsonData) {
            var firstRowJson = jsonData[0];

            let queryStatusLabel = document.querySelector("#querystatuslabel");
            //queryStatusLabel.innerText = JSON.stringify(jsonData);

            queryStatusLabel.innerHTML = ""; // Clear

            jsonData.forEach(function (oneData) {
                let dataToShow = `WebsiteName: ${oneData.websitename}, <br> WebCategoryname: ${oneData.webcategory}, <br> Status ${oneData.status} <br> <br>`;
                console.log(dataToShow);
                queryStatusLabel.innerHTML += dataToShow;
            });


            console.log("Processing: ", { firstRowJson })

            if (firstRowJson.status === "NOT PRESENT") {
                queryStatusLabel.innerHTML += "Website is NOT PRESENT Inside Category Data, Switching to NOTKNOWN";
            }
            else if (firstRowJson.status === "ADDED") {
                queryStatusLabel.innerHTML += "Website NEWLY Added Inside Category Data, In Category: " + firstRowJson.webcategory;
            }
            else if (firstRowJson.status === "DELETED") {
                queryStatusLabel.innerHTML += "Website DELETED With websitename " + firstRowJson.websitename + " & Category: " + firstRowJson.webcategory;
            }
            else {
                queryStatusLabel.innerHTML += "Website ALREADY Inside Category Data, In Category: " + firstRowJson.webcategory;
            }
        }

        static clearLogs() {
            console.log("[Testing] Clear Logs");
            document.querySelector(`#${this.queryStatusLabelId}`).innerHTML = "";
        }

        static checkInWebCategory() {
            console.log("[Since this is Check in Web Category], Just Fetch Website name No Select Options ");
            var website = document.querySelector(`#${this.websiteNameInputId}`).value;
            console.log("Website [" + website + "]");

            if (Validation.domainCheck(website)) {
                toastr.success("Sending Data to Server: ", { website });
                let checkInWebCategoryURL = ServerConnector.checkInWebCategoryURL;
                var postData = "{ websitename: '" + website + "' }"; // [Testing] [CurrentVersionNoChange] [Java Accepts String data therfore send string {json} data]
                console.log("Using URL -> ", checkInWebCategoryURL, "Post Data -> ", postData);
                ServerConnector.sendAndReceiveFromServer('post', checkInWebCategoryURL, postData);
                toastr.success("Showing Data ");
            }
        }

        static addWebsiteToCategory() {
            var website = document.querySelector(`#${this.websiteNameInputId}`).value;
            var webcategory = document.querySelector(`#${this.categoryNameSelectId}`).selectedOptions[0].value;
            console.log(website, webcategory);
            console.log("Website [" + website + "], [" + webcategory + "]");
            if (webcategory === "") {
                toastr.error("Please Select A Webcategory from the List: ");
                return;
            }
            if (Validation.domainCheck(website)) {
                toastr.success("Sending Data to Server: ", { website, webcategory });

                var postData = "{ websitename: '" + website + "', webcategory : '" + webcategory + "'}"; // [Testing] [CurrentVersionNoChange] [Java Accepts String data therfore send string {json} data]

                let addToWebCategoryURL = "http://localhost:8080/addwebsitetoprovidedwebcategoryincategorytable";
                console.log("Using URL -> ", addToWebCategoryURL, "Post Data -> ", postData);
                ServerConnector.sendAndReceiveFromServer('post', addToWebCategoryURL, postData);
                toastr.success("Showing Data");
            }
        }

        //removefromwebcategory_btn
        static removeWebsiteFromCategory() {
            var website = document.querySelector(`#${this.websiteNameInputId}`).value;
            var webcategory = document.querySelector(`#${this.categoryNameSelectId}`).selectedOptions[0].value;
            console.log(website, webcategory);
            console.log("Website [" + website + "], [" + webcategory + "]");

            if (webcategory === "") {
                toastr.error("Please Select A Webcategory from the List: ");
                return;
            }

            if (Validation.domainCheck(website)) {
                toastr.success("Sending Data to Server: ", { website, webcategory });
                var postData = "{ websitename: '" + website + "', webcategory : '" + webcategory + "'}"; // [Testing] [CurrentVersionNoChange] [Java Accepts String data therfore send string {json} data]

                let deleteFromWebCategoryURL = "http://localhost:8080/deletewebsitewithprovidedwebcategory";
                console.log("Using URL -> ", deleteFromWebCategoryURL, "Post Data -> ", postData);
                ServerConnector.sendAndReceiveFromServer('post', deleteFromWebCategoryURL, postData);
                toastr.success("Showing Data");

            }
        }

        static addAllClickEvents() {
            let checkWebCategoryBtn = document.querySelector(`#${this.checkWebCategoryBtnId}`);
            let addWebSiteToCategoryBtn = document.querySelector(`#${this.addWebSiteToCategoryBtnId}`);
            let removeFromWebCategoryBtn = document.querySelector(`#${this.removeFromWebCategoryBtnId}`);
            let clearQueryStatusLogBtn = document.querySelector(`#${this.clearQueryStatusLogBtnId}`);

            clearQueryStatusLogBtn.addEventListener('click', function (event) {
                console.log("ClearQueryStatus CLick Event Func:");
                WebCategoryChecker_UI_Manager.clearLogs();
            });

            checkWebCategoryBtn.addEventListener('click', function (event) {
                console.log("checkWebCategoryBtn CLick Event Func:");
                WebCategoryChecker_UI_Manager.checkInWebCategory();
            });

            addWebSiteToCategoryBtn.addEventListener('click', function (event) {
                console.log("addWebSiteToCategoryBtn CLick Event Func:");
                WebCategoryChecker_UI_Manager.addWebsiteToCategory();
            });

            removeFromWebCategoryBtn.addEventListener('click', function (event) {
                console.log("removeFromWebCategoryBtn CLick Event Func:");
                WebCategoryChecker_UI_Manager.removeWebsiteFromCategory();
            });
        }

        static initialize() {
            this.addAllClickEvents();
        }

    }

    // Start From here
    WebCategoryChecker_UI_Manager.initialize();

    class WebCategoryCreator_Fields {
        constructor(webcategoryname, webcategoryname_websitelist) {
            this.webCategoryName = webcategoryname;
            this.websiteList = webcategoryname_websitelist;
        }
    }

    class WebCategoryCreator_UI_Manager {

        static showWebsiteListLengthLimit = 100;
        static mainDiv = "div.createnew_webcategory_div";
        static webcategorynameInputId = "webcategoryname";
        static webcategoryname_websitelistTextareaId = "webcategoryname_websitelist";
        static website_list_line_seperatorInputId = "website_list_line_seperator";
        static lineSeperatorSelectId = "lineSeperatorSelect";
        static validatewebcategoryandlist_btnId = "validatewebcategoryandlist_btn";
        static addwebcategoryname_btnId = "addwebcategoryname_btn";
        static clear_createnew_webcategory_div_btnId = "clear_createnew_webcategory_div_btn";
        static new_websitelistUlId = "new_websitelist";

        static createListElement(count, elementName) {
            // testing Purpose

            let createOneListElement = `<li class="list-group-item d-flex justify-content-between align-items-center">
                                        <span>
                                            <span>${count})</span>
                                            <line>${elementName}</line>
                                        </span>
                                        <span>
                                            <button class="deleteElement btn btn-outline-danger btn-sm">
                                                <svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                </svg>
                                            </button>
                                        </span>
                                    </li>`;
            return createOneListElement;

        }

        static validateAndAddWebsitesToList() {
            console.log("validateAndAddWebsitesToList")
            let webcategoryname = document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} input#${WebCategoryCreator_UI_Manager.webcategorynameInputId}`).value;
            console.log("WebCategoryName: ", webcategoryname);
            let webcategoryname_websitelist = document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} textarea#${WebCategoryCreator_UI_Manager.webcategoryname_websitelistTextareaId}`).value;
            console.log("WebCategoryName_Websitelist: ", webcategoryname_websitelist);
            let website_list_line_seperator = document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} input#${WebCategoryCreator_UI_Manager.website_list_line_seperatorInputId}`).value;
            console.log("website_list_line_seperator: [" + website_list_line_seperator + "]");

            if (Validation.checkValidCategoryName(webcategoryname) && webcategoryname_websitelist.trim() !== "" && website_list_line_seperator.trim() !== "") {
                console.log("ALL GOOD LETS GO AHEAD");
                if (website_list_line_seperator === "newline") {
                    website_list_line_seperator = "\n";
                } else if (website_list_line_seperator === "pipe") {
                    website_list_line_seperator = "|";
                } else if (website_list_line_seperator === "comma") {
                    website_list_line_seperator = ",";
                } else if (website_list_line_seperator === "space") {
                    website_list_line_seperator = " ";
                } else {
                    console.log("[Error] Expecting newline, comma, pipe, space GOT: [" + website_list_line_seperator + "]");
                }
                let websiteList = webcategoryname_websitelist.split(website_list_line_seperator);
                console.log("Website List: ", websiteList);
                WebCategoryCreator_UI_Manager.addValidatedWebsiteNameToList(websiteList);
            } else {
                document.querySelector("div.createnew_webcategory_div ul").innerHTML = "";
                console.log("DATA INCORRRECT PLEASE CHECK");
            }
        }

        static addValidatedWebsiteNameToList(websiteList) {
            console.time("startAddToList");

            let mainList = document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} #${WebCategoryCreator_UI_Manager.new_websitelistUlId}`); // Change This
            console.log("Append to this MAINlIST: ", mainList); // [Testing]
            mainList.innerHTML = ""; // Clear The List

            let limit = WebCategoryCreator_UI_Manager.showWebsiteListLengthLimit;

            if (websiteList.length <= limit) {
                limit = websiteList.length;
            }

            console.log("showWebsiteListLengthLimit For Loop Length: ", limit)

            for (let index = 0; index < limit; index++) {
                const oneWebsiteName = websiteList[index];
                let checker;
                console.log("Validate Checker: ", oneWebsiteName);
                if ((checker = Validation.regexDomainCheck.exec(oneWebsiteName)) !== null) {
                    console.log("ADDED Checker: ", checker);
                    mainList.innerHTML += WebCategoryCreator_UI_Manager.createListElement(index, oneWebsiteName);
                }
            }
            // Directly Enable For Now
            console.timeEnd("Enabling the button");
            document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} button#${WebCategoryCreator_UI_Manager.addwebcategoryname_btnId}`).disabled = false;
            console.timeEnd("startAddToList");
        }

        static getWebCategoryCreator_Fields() {
            let webCategoryName = document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} input#${WebCategoryCreator_UI_Manager.webcategorynameInputId}`).value;
            //let websiteListLineSep = document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} input#${WebCategoryCreator_UI_Manager.website_list_line_seperatorInputId}`).value;
            let websiteList = [];
            document.querySelectorAll("div.createnew_webcategory_div ul li").forEach(function (oneLi) {
                let lineContent = oneLi.querySelector("span line").textContent.trim();
                websiteList.push(lineContent);
            })
            let webCatFields = new WebCategoryCreator_Fields(webCategoryName, websiteList);
            console.log("WebCategoryCreator_Fields: ", webCatFields);
            webCatFields = JSON.stringify(webCatFields);
            console.log("WebCategoryCreator_Fields [String]: ", webCatFields);
            return webCatFields;
        }

        static clear() {
            document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} input#${WebCategoryCreator_UI_Manager.webcategorynameInputId}`).value = ""; // WebCategory Name Field
            document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} textarea#${WebCategoryCreator_UI_Manager.webcategoryname_websitelistTextareaId}`).value = ""; // WebSite List Field
            document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} input#${WebCategoryCreator_UI_Manager.website_list_line_seperatorInputId}`).value = ""; // WebsiteList Line Seperator Field
            document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} #${WebCategoryCreator_UI_Manager.new_websitelistUlId}`).innerHTML = ""; // New Validated List Field
            document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} button#${WebCategoryCreator_UI_Manager.addwebcategoryname_btnId}`).disabled = true; // Disable the Upload Button
            document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} select#${WebCategoryCreator_UI_Manager.lineSeperatorSelectId}`).selectedIndex = 0; // Reset Select Fields
            // Enable All Fields

        }

        static enableElement(element) {
            element.disabled = false;
        }

        static disableElement(element) {
            element.disabled = true;
        }

        static showAlert(message, className) {
            const div = document.createElement('div');
            div.className = `alert alert-${className}`;
            div.appendChild(document.createTextNode(message));
            const mainContainer = document.querySelector('.createnew_webcategory_div');
            const modalContent = document.querySelector('#new_websitelist');
            mainContainer.insertBefore(div, modalContent);
            setTimeout(() => document.querySelector('.alert').remove(), 4000); // Vanish in 3 seconds
        }

        static addAllClickEvents() {

            // Get Select Line Seperator
            document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} select#${WebCategoryCreator_UI_Manager.lineSeperatorSelectId}`).onchange = function () {
                let selectedOption_Value = document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} select#${WebCategoryCreator_UI_Manager.lineSeperatorSelectId}`).selectedOptions[0].value;
                console.log(selectedOption_Value);
                document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} input#${WebCategoryCreator_UI_Manager.website_list_line_seperatorInputId}`).value = selectedOption_Value;

            };

            /** Comments Needed */
            document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} button#${WebCategoryCreator_UI_Manager.validatewebcategoryandlist_btnId}`).addEventListener('click', function (event) {
                WebCategoryCreator_UI_Manager.validateAndAddWebsitesToList();
            });

            /** Comments Needed */
            document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} button#${WebCategoryCreator_UI_Manager.clear_createnew_webcategory_div_btnId}`).addEventListener('click', function (event) {
                WebCategoryCreator_UI_Manager.clear();
            });

            /** Comments Needed */
            document.querySelector(`${WebCategoryCreator_UI_Manager.mainDiv} button#${WebCategoryCreator_UI_Manager.addwebcategoryname_btnId}`).addEventListener('click', function (event) {
                let webCategoryDetails = WebCategoryCreator_UI_Manager.getWebCategoryCreator_Fields();
                let sendWebCategoryAndListToServerURL = "http://localhost:8080/createWebCategoryAndAddList";
                ServerConnector.sendWebCategoryAndListToServer('post', sendWebCategoryAndListToServerURL, webCategoryDetails);
                WebCategoryCreator_UI_Manager.clear(); // Clear Data
            });

        }

        static initialize() {
            this.addAllClickEvents();
        }



    }

    WebCategoryCreator_UI_Manager.initialize();

});