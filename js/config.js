document.addEventListener('DOMContentLoaded', function(event) {

    var currentEditClicker = undefined;
    var currentNewTableCreator = undefined;

    class ConfigParser {
        constructor(xmlFileContent) {
            let inBuiltDOM_Parser = new DOMParser();
            let configXML_Doc = inBuiltDOM_Parser.parseFromString(xmlFileContent, "text/xml");
            // All IMP Data
            this.userGroupList = this.getUserGroupListFromXML(configXML_Doc);
            this.requestList = this.getRequestListFromXML(configXML_Doc);
            this.policyList = this.getPolicyListFromXML(configXML_Doc);
        }

        getUserGroupListFromXML(configXML_Doc) {
            let userGroupList = new Array();
            configXML_Doc.querySelectorAll("userGroup").forEach( function(oneuserGroup) {
                let status = oneuserGroup.children[0].textContent.trim();
                let userGroupName = oneuserGroup.children[1].textContent.trim();
                let userGroupDesc = oneuserGroup.children[2].textContent.trim();
                let userGroupIPList = oneuserGroup.children[3].textContent.trim();
                const userGroupDetails = new UserGroup(status, userGroupName, userGroupDesc, userGroupIPList);
                console.log("userGroupDetailsFromXML: ", userGroupDetails);
                userGroupList.push(userGroupDetails);
            });
            return userGroupList;
        }

        getRequestListFromXML(configXML_Doc) {
            let requestList = new Array();
            configXML_Doc.querySelectorAll("request").forEach( function(oneRequest) {
                let status = oneRequest.children[0].textContent.trim();
                let reqName = oneRequest.children[1].textContent.trim();
                let reqDesc = oneRequest.children[2].textContent.trim();
                let reqDomainList = oneRequest.children[3].textContent.trim();
                const requestDetails = new Request(status, reqName, reqDesc, reqDomainList);
                console.log("requestDetails: ", requestDetails);
                requestList.push(requestDetails);
            });
            return requestList;
        }

        getPolicyListFromXML(configXML_Doc) {
            let policyList = new Array();
            configXML_Doc.querySelectorAll("policy").forEach( function(onePolicy) {
                let status = onePolicy.children[0].textContent.trim();
                let policyName = onePolicy.children[1].textContent.trim();
                let policyDesc = onePolicy.children[2].textContent.trim();
                let dnsServerList = onePolicy.children[3].textContent.trim(); // Not Added
                let userGroupList = onePolicy.children[4].textContent.trim();
                let requestedDomainList = onePolicy.children[5].textContent.trim();
                let webCategoryList = onePolicy.children[6].textContent.trim();
                let responseIPList = onePolicy.children[7].textContent.trim(); // Not Added
                let policyAction = onePolicy.children[8].textContent.trim();

                /** Modification Required For Better UI Experience, Wherein Blank Field which means [For ALL], is changed to [ALL] */
                if (userGroupList.trim() === "") {
                    userGroupList = "ALL";
                }

                if (requestedDomainList.trim() === "") {
                    requestedDomainList = "ALL";
                }

                if (webCategoryList.trim() === "") {
                    webCategoryList = "ALL";
                }

                const policyDetails = new Policy(status, policyName, policyDesc, userGroupList, requestedDomainList, webCategoryList, policyAction);
                console.log("Original Policy Details: ", { status, policyName, policyDesc, dnsServerList, userGroupList, requestedDomainList, webCategoryList, responseIPList, policyAction });
                console.log("policyDetails: ", policyDetails);
                policyList.push(policyDetails);
            });
            return policyList;
        }

        getUserGroupListFromDOM() {
            let userGroupList = new Array();
            document.querySelectorAll("#userGroupsTable tbody tr").forEach(function(oneTableRow) {
                const userGroupDetails = UserGroup_UI_Manager.getUserGroupDataFromUserGroupsTable(oneTableRow);
                console.log("UserGroupListFromDOM: ", userGroupDetails);
                userGroupList.push(userGroupDetails);
            })
            console.log("this.userGroupList [BEFORE]: ", this.userGroupList);
            this.userGroupList = userGroupList;
            console.log("this.userGroupList [AFTER]: ", this.userGroupList);
            return userGroupList;
        }

        getRequestListFromDOM() {
            let requestList = new Array();
            document.querySelectorAll("#requestTable tbody tr").forEach(function(oneTableRow) {
                const requestDetails = Request_UI_Manager.getRequestDataFromRequestTable(oneTableRow);
                console.log("RequestListFromDOM: ", requestDetails);
                requestList.push(requestDetails);
            })
            console.log("this.requestList [BEFORE]: ", this.requestList);
            this.requestList = requestList;
            console.log("this.requestList [AFTER]: ", this.requestList);
            return requestList;
        }

        getPolicyListFromDOM() {
            let policyList = new Array();
            document.querySelectorAll("#policyTable tbody tr").forEach(function(oneTableRow) {
                const policyDetails = Policy_UI_Manager.getPolicyDataFromPolicyTable(oneTableRow);
                console.log("PolicyListFromDOM: ", policyDetails);
                policyList.push(policyDetails);
            })
            console.log("this.policyList [BEFORE]: ", this.policyList);
            this.policyList = policyList;
            console.log("this.policyList [AFTER]: ", this.policyList);
            return policyList;
        }



        getDnsServerXML() {
            let dnsServerXML = `<rootDnsProviders>
                                    <dnsServer>
                                        <status>ENABLE</status>
                                        <dnsName>Google DNS Server 1</dnsName>
                                        <dnsIP_Address>8.8.8.8</dnsIP_Address>
                                        <addrDescription>Google Public DNS Server 1, DO ALL RESOLUTION USING GOOGLE DNS SERVER.</addrDescription>
                                    </dnsServer>
                                </rootDnsProviders>`;
            return dnsServerXML;
        }

        getUserGroupXML() {
            let userGroupXML = "";
            let userGroupXML_Header = `<userGroups>`;
            userGroupXML = userGroupXML_Header;
            
            let allUserGroupXML_Data = "";

            let userGroupList = this.getUserGroupListFromDOM();
            userGroupList.forEach(function(oneuserGroup) {
                let data = `<userGroup>
                                <status>${oneuserGroup.status}</status>
                                <userGroupName>${oneuserGroup.userGroupName}</userGroupName>
                                <userGroupDescription>${oneuserGroup.userGroupDesc}</userGroupDescription>
                                <usersIPList>${oneuserGroup.userGroupIPList}</usersIPList>
                            </userGroup>`;
                allUserGroupXML_Data += data;
                console.log("UserGroup Data XML: ---------------", data);
            })

            userGroupXML += allUserGroupXML_Data;

            let userGroupXML_Footer = `</userGroups>`;

            userGroupXML += userGroupXML_Footer;

            return userGroupXML;
        }

        getRequestXML() {
            let requestXML = "";
            let requestXML_Header = `<requestedDomain>`;
            requestXML = requestXML_Header;
            
            let allRequestXML_Data = "";

            let requestList = this.getRequestListFromDOM();
            requestList.forEach(function(oneRequest) {
                let data = `<request>
                                <status>${oneRequest.status}</status>
                                <reqName>${oneRequest.reqName}</reqName>
                                <reqDescription>${oneRequest.reqDesc}</reqDescription>
                                <reqDomainName>${oneRequest.reqDomainList}</reqDomainName>
                            </request>`;
                allRequestXML_Data += data;
            })

            requestXML += allRequestXML_Data;

            let requestXML_Footer = `</requestedDomain>`;

            requestXML += requestXML_Footer;

            return requestXML;
        }

        getResponseXML() {
            let responseXML = `<responseIP>
                                    <response>
                                        <status>ENABLE</status>
                                        <resName>MALICIOUS IP</resName>
                                        <resDescription>DETECTING AND IDENTIFYING MALICIOUS WEBSITE BY THEIR IP received after DNS Resolution</resDescription>
                                        <resCname>0.0.0.0,chansd,sadsadsad</resCname>
                                        <resIP_AddressList>19.19.19.19</resIP_AddressList>
                                    </response>
                                </responseIP>`;
            return responseXML;
        }

        getPolicyXML() {
            let policyXML = "";
            let policyXML_Header = `<accessPolicies>`;
            policyXML = policyXML_Header;
            
            let allPolicyXML_Data = "";

            let policyList = this.getPolicyListFromDOM();
            policyList.forEach(function(onePolicy) {
                /** Modified To Keep Unused Field Empty */

                // Validation / Correction
                let modifiedUserGroupList = onePolicy.userGroupList;
                if (onePolicy.userGroupList === "ALL") { 
                    modifiedUserGroupList = "";
                } 

                let modifiedRequestList = onePolicy.requestedDomainList;
                if (onePolicy.requestedDomainList === "ALL") { 
                    modifiedRequestList = ""
                } 

                let modifiedWebCategoryList = onePolicy.webCategoryList;
                if (onePolicy.webCategoryList === "ALL") { 
                    modifiedWebCategoryList = "";
                } 

                let data = `<policy>
                                <status>${onePolicy.status}</status>
                                <policyName>${onePolicy.policyName}</policyName>
                                <policyDescription>${onePolicy.policyDesc}</policyDescription>
                                <dnsServerList></dnsServerList>
                                <userGroupList>${modifiedUserGroupList}</userGroupList>
                                <requestedDomainList>${modifiedRequestList}</requestedDomainList>
                                <webCategoryList>${modifiedWebCategoryList}</webCategoryList>
                                <responseIPList></responseIPList>
                                <policyAction>${onePolicy.policyAction}</policyAction>
                            </policy>`;
                allPolicyXML_Data += data;
            })

            policyXML += allPolicyXML_Data;

            let policyXML_Footer = `</accessPolicies>`;

            policyXML += policyXML_Footer;

            return policyXML;
        }

        generateConfigXML() {
            
            let configXML_Content = "";
            
            let configXML_Header = `<?xml version="1.0" encoding="utf-8" ?>
                                    <dnsPolicyConfig>`;

            configXML_Content += configXML_Header;
            
            let dnsServerXML = this.getDnsServerXML(); // Static Content
            configXML_Content += dnsServerXML;

            let userGroupXML = this.getUserGroupXML();
            configXML_Content += userGroupXML;

            let requestXML = this.getRequestXML();
            configXML_Content += requestXML;

            let responseXML = this.getResponseXML(); // Static Content
            configXML_Content += responseXML;

            let policyXML = this.getPolicyXML();
            configXML_Content += policyXML;

            let configXML_Footer = `</dnsPolicyConfig>`;
            configXML_Content += configXML_Footer;

            console.log("XML: ", configXML_Content);

            /* NOT WORKING

            // Added
            var format = require('xml-formatter');
            var formattedXml = format(configXML_Content, {
                indentation: '    ', 
                filter: (node) => node.type !== 'Comment', 
                collapseContent: true, 
                lineSeparator: '\r\n'
            });
            console.log(formattedXml);

            */

            var formattedXml = this.formatXml(configXML_Content);

            console.log("(Using Gist Lib To Do It Best is xml-formatter which needs require solve thsi later] Formatted XML: ", formattedXml);
            
            return formattedXml;
        }

        // ForamtXMl [Copied from Internet github gist]
        formatXml(xml) {
            var formatted = '';
            var reg = /(>)\s*(<)(\/*)/g;
            xml = xml.replace(reg, '$1\r\n$2$3');
            var pad = 0;
            jQuery.each(xml.split('\n'), function(index, node) {
                var indent = 0;
                if (node.match( /.+<\/\w[^>]*>$/ )) {
                    indent = 0;
                } else if (node.match( /^<\/\w/ )) {
                    if (pad != 0) {
                        pad -= 1;
                    }
                } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
                    indent = 1;
                } else {
                    indent = 0;
                }
        
                var padding = '';
                for (var i = 0; i < pad; i++) {
                    padding += '  ';
                }
        
                formatted += padding + node + '\r\n';
                pad += indent;
            });
        
            return formatted;
        }

        showDetails() {
            // userGroup
            console.log("userGroupList: ", this.userGroupList);
            // request
            console.log("requestList: ", this.requestList);
            // policy
            console.log("policyList: ", this.policyList);
        }
    }

    class UserGroup {
        constructor(status, userGroupName, userGroupDesc, userGroupIPList) {
            this.status = status;
            this.userGroupName = userGroupName;
            this.userGroupDesc = userGroupDesc;
            this.userGroupIPList = userGroupIPList;
        }
    }

    class Request {
        constructor(status, reqName, reqDesc, reqDomainList) {
            this.status = status;
            this.reqName = reqName;
            this.reqDesc = reqDesc;
            this.reqDomainList = reqDomainList;
        }
    }

    class Policy {
        /** Fields Not in USE are Removed From CLient Side Will be Added when Post Data is Send */
        constructor(status, policyName, policyDesc, userGroupList, requestedDomainList, webCategoryList, policyAction) {
            this.status = status;
            this.policyName = policyName;
            this.policyDesc = policyDesc;
            this.userGroupList = userGroupList;
            this.requestedDomainList = requestedDomainList;
            this.webCategoryList = webCategoryList;
            this.policyAction = policyAction;
        }
    }

    class UserGroup_UI_Manager {

        /** Since this Added Multiple Time We will use different way to add click Event using [onclick] */
        static addClickEventOnDynamicObj() {
            Array.from(document.querySelectorAll(".delete")).forEach(function(thisDeleteButton) {
                console.log("delete bttton [USERGORUP] ");
                thisDeleteButton.onclick = function clickEve() {
                    console.log("Click on Delete DONE [USERGORUP] ");
                    UserGroup_UI_Manager.deleteFromUserGroupsTable(thisDeleteButton);
                };
            });

            Array.from(document.querySelectorAll(".editThisUserGroup")).forEach(function(thisEditButton) {
                console.log("edit bttton [USERGROUP] ");
                thisEditButton.onclick = function() { {
                        console.log("Click on edit DONE [USERGORUP] ");
                        currentEditClicker = thisEditButton;
                        const currentTR = thisEditButton.parentElement.parentElement;
                        const userGroup = UserGroup_UI_Manager.getUserGroupDataFromUserGroupsTable(currentTR);
                        Modal_UI_Manager.addUserGroupDataToModal(userGroup);
                    }
                }
            });

        }

        /** */
        static getUserGroupDataFromUserGroupsTable(trElement) {
            const alltdElement = trElement.querySelectorAll("td");
            const currentStatus = alltdElement[1].textContent.trim();
            const currentUserGroupName = alltdElement[2].textContent.trim();
            const currentUserGroupDesc = alltdElement[3].textContent.trim();
            const currentUserGroupIPList = alltdElement[4].textContent.trim();
            const userGroupDetails = new UserGroup(currentStatus, currentUserGroupName, currentUserGroupDesc, currentUserGroupIPList);
            console.log(userGroupDetails);
            return userGroupDetails;
        }

        /** This Func Adds Data to the UserGroups Table */
        static addToUserGroupsTable(userGroup) {

            if(userGroup !== undefined) {
            
                const userGroupList = document.querySelector('#userGroupsTable tbody');
                const row = document.createElement('tr');
            
                row.innerHTML = `
                                <td>
                                    <button type="button" class="btn btn-outline-info btn-sm editThisUserGroup">
                                        <svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                        </svg>                            
                                    </button>
                                    <button type="button" class="btn btn-outline-danger btn-sm delete">
                                        <svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                        </svg>
                                    </button>
                                </td>
                                <td>${userGroup.status}</td>
                                <td>${userGroup.userGroupName}</td>
                                <td>${userGroup.userGroupDesc}</td>
                                <td>${userGroup.userGroupIPList}</td>
                                `;
            
                userGroupList.appendChild(row);
                this.addClickEventOnDynamicObj();
                return "created";
            }
            
        }

        /** */
        static editToThisUserGroupsTableTR(trElement, userGroup) {
            trElement.querySelectorAll("td")[1].textContent = userGroup.status;
            trElement.querySelectorAll("td")[2].textContent = userGroup.userGroupName;
            trElement.querySelectorAll("td")[3].textContent = userGroup.userGroupDesc;
            trElement.querySelectorAll("td")[4].textContent = userGroup.userGroupIPList;
            return "updated";
        }

        /** */
        static deleteFromUserGroupsTable(element) {
            if(element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
            }
        }

    }

    /**  */
    class Request_UI_Manager {

        /** Since this Added Multiple Time We will use different way to add click Event using [onclick] */
        static addClickEventOnDynamicObj() {
            Array.from(document.querySelectorAll(".delete")).forEach(function(thisDeleteButton) {
                console.log("delete bttton [REQUEST]");
                thisDeleteButton.onclick = function clickEve() {
                    console.log("Click on Delete DONE [REQUEST]");
                    Request_UI_Manager.deleteFromRequestTable(thisDeleteButton);
                };
            });

            Array.from(document.querySelectorAll(".editThisRequest")).forEach(function(thisEditButton) {
                console.log("edit bttton [REQUEST]");
                thisEditButton.onclick = function() { {
                        console.log("Click on edit DONE [REQUEST]");
                        currentEditClicker = thisEditButton;
                        const currentTR = thisEditButton.parentElement.parentElement;
                        const request = Request_UI_Manager.getRequestDataFromRequestTable(currentTR);
                        Modal_UI_Manager.addRequestDataToModal(request);
                    }
                }
            });
        }

        /** */
        static getRequestDataFromRequestTable(trElement) {
            const alltdElement = trElement.querySelectorAll("td");
            const currentStatus = alltdElement[1].textContent.trim();;
            const currentReqName = alltdElement[2].textContent.trim();;
            const currentReqDesc = alltdElement[3].textContent.trim();;
            const currentReqDomainList = alltdElement[4].textContent.trim();;
            const requestDetails = new Request(currentStatus, currentReqName, currentReqDesc, currentReqDomainList);
            console.log("RequestDetails [Retried From TR:[ ", trElement, " ]: ", requestDetails);
            return requestDetails;
        }

        /** This Func Adds Data to the UserGroups Table */
        static addToRequestTable(request) {

            if(request !== undefined) {
            
                const requestList = document.querySelector('#requestTable tbody');
                const row = document.createElement('tr');
            
                row.innerHTML = `
                                <td>
                                    <button type="button" class="btn btn-outline-info btn-sm editThisRequest">
                                        <svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                        </svg>
                                    </button>
                                    <button type="button" class="btn btn-outline-danger btn-sm delete">
                                        <svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                        </svg>
                                    </button>
                                </td>
                                <td>${request.status}</td>
                                <td>${request.reqName}</td>
                                <td>${request.reqDesc}</td>
                                <td>${request.reqDomainList}</td>
                                `;
            
                requestList.appendChild(row);
                this.addClickEventOnDynamicObj();
                return "created";
            }
            
        }

        /** */
        static editToThisRequestTableTR(trElement, request) {
            trElement.querySelectorAll("td")[1].textContent = request.status;
            trElement.querySelectorAll("td")[2].textContent = request.reqName;
            trElement.querySelectorAll("td")[3].textContent = request.reqDesc;
            trElement.querySelectorAll("td")[4].textContent = request.reqDomainList;
            return "updated";
        }

        /** */
        static deleteFromRequestTable(element) {
            if(element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
            }
        }

    }

    class Policy_UI_Manager {

        /** Since this Added Multiple Time We will use different way to add click Event using [onclick] */
        static addClickEventOnDynamicObj() {
            Array.from(document.querySelectorAll(".delete")).forEach(function(thisDeleteButton) {
                console.log("delete bttton [POLICY]");
                thisDeleteButton.onclick = function clickEve() {
                    console.log("Click on Delete DONE [POLICY]");
                    Policy_UI_Manager.deleteFromPolicyTable(thisDeleteButton);
                };
            });

            Array.from(document.querySelectorAll(".editThisPolicy")).forEach(function(thisEditButton) {
                console.log("edit bttton [POLICY]");
                thisEditButton.onclick = function() { {
                        console.log("Click on edit DONE [POLICY]");
                        currentEditClicker = thisEditButton;
                        const currentTR = thisEditButton.parentElement.parentElement;
                        const policy = Policy_UI_Manager.getPolicyDataFromPolicyTable(currentTR);
                        Modal_UI_Manager.addPolicyDataToModal(policy);
                    }
                }
            });
        }

        static getPolicyDataFromPolicyTable(trElement) {
            const alltdElement = trElement.querySelectorAll("td");
            const currentStatus = alltdElement[1].textContent.trim();;
            const currentPolicyName = alltdElement[2].textContent.trim();;
            const currentPolicyDesc = alltdElement[3].textContent.trim();;
            const currentUserGroupList = alltdElement[4].textContent.trim();;
            const currentRequestedDomainList = alltdElement[5].textContent.trim();;
            const currentWebCategoryList = alltdElement[6].textContent.trim();;
            const currentPolicyAction = alltdElement[7].textContent.trim();;
            const policyDetails = new Policy(currentStatus, currentPolicyName, currentPolicyDesc, currentUserGroupList, currentRequestedDomainList, currentWebCategoryList, currentPolicyAction);
            console.log("PolicyDetails [Retried From TR:[ ", trElement, " ]: ", policyDetails);
            return policyDetails;
        }

        /** This Func Adds Data to the Policy Table */
        static addToPolicyTable(policy) {

            if(policy !== undefined) {
            
                const policyList = document.querySelector('#policyTable tbody');
                const row = document.createElement('tr');
                
                console.log("Policy Field in addToPolicyTable: ", policy);
                
                
                /******** REVISIT TIS FOR SELECT */
                row.innerHTML = `
                                <td>
                                    <button type="button" class="btn btn-outline-info btn-sm editThisPolicy">
                                        <svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                        </svg>
                                    </button>
                                    <button type="button" class="btn btn-outline-danger btn-sm delete">
                                        <svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                        </svg>
                                    </button>
                                </td>
                                <td>${policy.status}</td>
                                <td>${policy.policyName}</td>
                                <td>${policy.policyDesc}</td>
                                <td>${policy.userGroupList}</td> <!-- TEST THIS -->
                                <td>${policy.requestedDomainList}</td>
                                <td>${policy.webCategoryList}</td>
                                <td>${policy.policyAction}</td>
                                `;
            
                policyList.appendChild(row);
                this.addClickEventOnDynamicObj(); // Add Event Listener Again
                return "created";
            }
            
        }

        /** */
        static editToThisPolicyTableTR(trElement, policy) {
            trElement.querySelectorAll("td")[1].textContent = policy.status;
            trElement.querySelectorAll("td")[2].textContent = policy.policyName;
            trElement.querySelectorAll("td")[3].textContent = policy.policyDesc;
            trElement.querySelectorAll("td")[4].textContent = policy.userGroupList;
            trElement.querySelectorAll("td")[5].textContent = policy.requestedDomainList;
            trElement.querySelectorAll("td")[6].textContent = policy.webCategoryList;
            trElement.querySelectorAll("td")[7].textContent = policy.policyAction;
            return "updated";
        }

        /** */
        static deleteFromPolicyTable(element) {
            if(element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
            }
        }

    }

    /** */
    class Modal_UI_Manager {

        /****** JQuery + Boostrap 4 is used for Simple Modal */
        static showModalWithData(data) {
            $("#modalBody").html(data); // Add it to the Modal Body
            $("#modalPopup").modal("show"); // Show The Modal
        }

        static createSelect(optionsArray, optionToSet) {
            console.log("createSelect: optionsArray: ",  optionsArray);
            let selectHTML = `<select class="custom-select webCategoryList-select">`;
            let selectEnd = `</select>`;

            selectHTML += `<option value="" selected>-NOT-SELECTED-</option>`;
            for (let index = 0; index < optionsArray.length; index++) {
                const oneOption = optionsArray[index];
                console.log("createSelect: optionsArray [oneOption]: ",  oneOption);
                if(oneOption === optionToSet) {
                    selectHTML += `<option value="${oneOption}" selected>${oneOption}</option>`;
                }
                else {
                    selectHTML += `<option value="${oneOption}">${oneOption}</option>`;
                }
            }
            selectHTML += selectEnd;
            return selectHTML;
        }

        static getUserGroupSet() {
            let userGroupSet = new Set(); 
            document.querySelectorAll("#userGroupsTable tbody tr td:nth-child(3)").forEach( function(oneTableData) {
                userGroupSet.add(oneTableData.textContent.trim()) ;
            });
            userGroupSet.add("ALL");
            console.log("Retrived userGroupSet: ", userGroupSet);
            return userGroupSet;
        }

        static getRequestSet() {
            let requestSet = new Set(); 
            document.querySelectorAll("#requestTable tbody tr td:nth-child(3)").forEach( function(oneTableData) {
                requestSet.add(oneTableData.textContent.trim());
            });
            requestSet.add("ALL");
            console.log("Retrived requestSet: ", requestSet);
            return requestSet;
        }

        static getWebCategorySet() {
            let webCategorySet = new Set(); 
            //webCategorySet.add("Advertisements and Trackers");
            //webCategorySet.add("Adult Content");
            let webCategoryList = getWebCategoryList();
            webCategoryList.forEach(function(oneWebCategory) {
                webCategorySet.add(oneWebCategory);
            });
            webCategorySet.add("ALL");
            console.log("Retrived webCategorySet: ", webCategorySet);
            return webCategorySet;
        }
        
        static getPolicyActionSet() {
            let policyActionSet = new Set(); 
            policyActionSet.add("ALLOW");
            policyActionSet.add("BLOCK");
            console.log("Retrived policyActionSet: ", policyActionSet);
            return policyActionSet;
        }

        /** This Func Adds Data From UserGroup Table to the Modal Table */
        static addUserGroupDataToModal(userGroup) {

            const table = document.createElement('table');
        
            table.innerHTML = `
                            <tr>
                                <th>Status</th>
                                <td>${ this.createSelect(["ENABLE", "DISABLE"], userGroup.status) }</td>
                            </tr>
                            <tr>
                                <th>UserGroup Name</th>
                                <td><input type="text" value="${userGroup.userGroupName}" /></td>
                            </tr>
                            <tr>
                                <th>UserGroup Description</th>
                                <td><input type="text" value="${userGroup.userGroupDesc}" /></td>
                            </tr>
                            <tr>
                                <th>UserGroup IP List</th>
                                <td><input type="text" value="${userGroup.userGroupIPList}" /></td>
                            </tr>
                            `;
            this.showModalWithData(table);
        }

        /** This Func Adds Data From Request Table to the Modal Table */
        static addRequestDataToModal(request) {

            const table = document.createElement('table');
        
            table.innerHTML = `
                            <tr>
                                <th>Status</th>
                                <td>${ this.createSelect(["ENABLE", "DISABLE"], request.status) }</td>
                            </tr>
                            <tr>
                                <th>Request Name</th>
                                <td><input type="text" value="${request.reqName}" /></td>
                            </tr>
                            <tr>
                                <th>Request Description</th>
                                <td><input type="text" value="${request.reqDesc}" /></td>
                            </tr>
                            <tr>
                                <th>Request Domain List</th>
                                <td><input type="text" value="${request.reqDomainList}" /></td>
                            </tr>
                            `;
            this.showModalWithData(table);
        }

        /** This Func Adds Data From Policy Table to the Modal Table */
        static addPolicyDataToModal(policy) {

            const table = document.createElement('table');
        
            table.innerHTML = `
                            <tr>
                                <th>Status</th>
                                <td>${ this.createSelect(["ENABLE", "DISABLE"], policy.status) }</td>
                            </tr>
                            <tr>
                                <th>Policy Name</th>
                                <td><input type="text" value="${policy.policyName}" /></td>
                            </tr>
                            <tr>
                                <th>Policy Description</th>
                                <td><input type="text" value="${policy.policyDesc}" /></td>
                            </tr>
                            <tr>
                                <th>UserGroup List</th>
                                <td>${this.createSelect([...this.getUserGroupSet()], policy.userGroupList)}</td>
                            </tr>
                            <tr>
                                <th>Request Domain List</th>
                                <td>${this.createSelect([...this.getRequestSet()], policy.requestedDomainList)}</td>
                            </tr>
                            <tr>
                                <th>WebCategory List</th>
                                <td>${this.createSelect([...this.getWebCategorySet()], policy.webCategoryList)}</td>
                            </tr>
                            <tr>
                                <th>Policy Action</th>
                                <td>${this.createSelect([...this.getPolicyActionSet()], policy.policyAction)}</td>
                            </tr>
                            `;
            this.showModalWithData(table);
        }


        /** This Func Adds Data to the UserGroup Table */
        static saveDataToUserGroupTable(userGroup) {
            return UserGroup_UI_Manager.addToUserGroupsTable(userGroup);
        }

        /** This Func Adds Data to the Request Table */
        static saveDataToRequestTable(request) {
            return Request_UI_Manager.addToRequestTable(request);
        }

        /** This Func Adds Data to the UserGroup Table */
        static saveDataToPolicyTable(policy) {
            return Policy_UI_Manager.addToPolicyTable(policy);
        }

        static getUserGroupDataFromModal() {
            let tableDataArray = document.querySelectorAll("#modalBody table tbody tr td");
            let statusValue = tableDataArray[0].childNodes[0].selectedOptions[0].value;
            let userGroupNameValue = tableDataArray[1].childNodes[0].value;
            let userGroupDescValue = tableDataArray[2].childNodes[0].value;
            let userGroupIPListValue = tableDataArray[3].childNodes[0].value;
            
            // Validation
            if(statusValue === '' || userGroupNameValue === '' || userGroupDescValue === '' || userGroupIPListValue === '') {
                this.showAlertOnModal('Please fill in all fields', 'danger'); // ORIGINALMODIFY AND USE THIS
            } else {
                const userGroupDetails = new UserGroup(statusValue, userGroupNameValue, userGroupDescValue, userGroupIPListValue)
                console.log(userGroupDetails);
                return userGroupDetails;
            }
        }

        static getRequestDataFromModal() {
            let tableDataArray = document.querySelectorAll("#modalBody table tbody tr td");
            let statusValue = tableDataArray[0].childNodes[0].selectedOptions[0].value;
            let reqNameValue = tableDataArray[1].childNodes[0].value;
            let reqDescValue = tableDataArray[2].childNodes[0].value;
            let reqDomainListValue = tableDataArray[3].childNodes[0].value;
            
            // Validation
            if(statusValue === '' || reqNameValue === '' || reqDescValue === '' || reqDomainListValue === '') {
                this.showAlertOnModal('Please fill in all fields', 'danger'); // ORIGINAL MODIFY AND USE THIS
            } else {
                const requestDetails = new Request(statusValue, reqNameValue, reqDescValue, reqDomainListValue)
                console.log("RequestDetails [Retrived From MODAL: ", requestDetails);
                return requestDetails;
            }
        }

        static getPolicyDataFromModal() {
            let tableDataArray = document.querySelectorAll("#modalBody table tbody tr td");
            let statusValue = tableDataArray[0].childNodes[0].selectedOptions[0].value;
            let policyNameValue = tableDataArray[1].childNodes[0].value;
            let policyDescValue = tableDataArray[2].childNodes[0].value;
            let userGroupListValue = tableDataArray[3].childNodes[0].selectedOptions[0].value;
            let requestedDomainListValue = tableDataArray[4].childNodes[0].selectedOptions[0].value;
            let webCategoryListValue = tableDataArray[5].childNodes[0].selectedOptions[0].value;
            let policyActionValue = tableDataArray[6].childNodes[0].selectedOptions[0].value;
            
            // Validation
            if(statusValue === '' || policyNameValue === '' || policyDescValue === '' || userGroupListValue === '' || requestedDomainListValue === '' || webCategoryListValue === '' || policyActionValue === '') {
                this.showAlertOnModal('Please fill in all fields', 'danger'); // ORIGINAL MODIFY AND USE THIS
            } else {
                const policyDetails = new Policy(statusValue, policyNameValue, policyDescValue, userGroupListValue, requestedDomainListValue, webCategoryListValue, policyActionValue)
                console.log("PolicyDetails [Retrived From MODAL: ", policyDetails);
                return policyDetails;
            }
        }

        static showAlertOnModal(message, className) {
            const div = document.createElement('div');
            div.className = `alert alert-${className}`;
            div.appendChild(document.createTextNode(message));
            const mainContainer = document.querySelector('.modal-content');
            const modalContent = document.querySelector('.modal-header');
            mainContainer.insertBefore(div, modalContent);
            setTimeout(() => document.querySelector('.alert').remove(), 2000); // Vanish in 3 seconds
        }

        static closeModal() {
            $("#modalPopup").modal("hide"); // Hide The Modal
        }    
    }

    /** Comment Needed [Add New UserGroup] */
    document.getElementById("addNewUserGroup").addEventListener('click', function(event) {
        userGroup = new UserGroup("", "", "", "");
        currentNewTableCreator = "userGroup";
        Modal_UI_Manager.addUserGroupDataToModal(userGroup);
    })

    /** Comment Needed [Add New Request] */
    document.getElementById("addNewRequest").addEventListener('click', function(event) {
        request = new Request("", "", "", "");
        currentNewTableCreator = "request";
        Modal_UI_Manager.addRequestDataToModal(request);
    })

    /** Comment Needed [Add New Policy] */
    document.getElementById("addNewPolicy").addEventListener('click', function(event) {
        policy = new Policy("", "", "", "", "", "", "");
        currentNewTableCreator = "policy";
        Modal_UI_Manager.addPolicyDataToModal(policy);
    })

    /** Comment Needed */
    document.querySelector('#modalSave').addEventListener('click', function modalSave(event) {
        let creationStatus = "notcreated"
        if (currentEditClicker === undefined) {
            // Add new Data to the table => Check Which Table
            if(currentNewTableCreator === "userGroup") {
                creationStatus = Modal_UI_Manager.saveDataToUserGroupTable(Modal_UI_Manager.getUserGroupDataFromModal());
            } else if (currentNewTableCreator === "request") {
                creationStatus = Modal_UI_Manager.saveDataToRequestTable(Modal_UI_Manager.getRequestDataFromModal());
            } else {
                creationStatus = Modal_UI_Manager.saveDataToPolicyTable(Modal_UI_Manager.getPolicyDataFromModal());
            }
        } else {
            // Edit the Caller
            console.log("currentEditClicker: ", currentEditClicker);
            let editThisTR = currentEditClicker.parentElement.parentElement;
            console.log("editThistr: ", editThisTR);
            if (currentEditClicker.classList.contains("editThisUserGroup")) {
                const userGroupDetails = Modal_UI_Manager.getUserGroupDataFromModal();
                creationStatus = UserGroup_UI_Manager.editToThisUserGroupsTableTR(editThisTR, userGroupDetails);
            } else if (currentEditClicker.classList.contains("editThisRequest")) {
                const requestDetails = Modal_UI_Manager.getRequestDataFromModal();
                creationStatus = Request_UI_Manager.editToThisRequestTableTR(editThisTR, requestDetails);
            } else if (currentEditClicker.classList.contains("editThisPolicy")) {
                const policyDetails = Modal_UI_Manager.getPolicyDataFromModal();
                creationStatus = Policy_UI_Manager.editToThisPolicyTableTR(editThisTR, policyDetails);
            } else {
                console.log("ERRRRRRRRRRRRRRROOOOOOOOOOOORRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", { currentEditClicker, currentNewTableCreator });
            }
        }
        if (creationStatus === "created" || creationStatus === "updated" ) {
            Modal_UI_Manager.closeModal();
        }
    });

    /** When Modal Hide is Called OR when Modal is going to Hide/Off Focus */
    $('#modalPopup').on('hidden.bs.modal', function (event) {
        console.log("Modal Hidden! Refresh Modal && Related Contents [currentEditClicker] ");
        
        // IMP FIELDS
        currentEditClicker = undefined; // Store Who Clicked on Edit, To Save the Chnaged to that Respective TR -> TD, It is Initilized @ edit Click Event
        currentNewTableCreator = undefined; // Store Who clicked The New Row Creation, It is Initilized @ addNew Click Event
        $("#modalBody").html(""); // Empty Modal Body

        // Testing Data

    })

    /** For Testing Purposes */
    var fileContent = `<?xml version="1.0" encoding="utf-8"?>
    <dnsPolicyConfig>
        <rootDnsProviders>
            <dnsServer>
                <status>ENABLE</status>
                <dnsName>Google DNS Server 1</dnsName>
                <dnsIP_Address>8.8.8.8</dnsIP_Address>
                <addrDescription>Google Public DNS Server 1, DO ALL RESOLUTION USING GOOGLE DNS SERVER.</addrDescription>
            </dnsServer>
        </rootDnsProviders>
        <userGroups>
            <userGroup>
                <status>ENABLE</status>
                <userGroupName>UserGroup1(LOCALHOST)</userGroupName>
                <userGroupDescription>UserGroup1(LOCALHOST)</userGroupDescription>
                <usersIPList>127.0.0.1</usersIPList>
            </userGroup>
        </userGroups>
        <requestedDomain>
            <request>
                <status>ENABLE</status>
                <reqName>Ads Req</reqName>
                <reqDescription>Ads Req</reqDescription>
                <reqDomainName>doubleclick|googleads|pubmatic</reqDomainName>
            </request>
        </requestedDomain>
        <responseIP>
            <response>
                <status>ENABLE</status>
                <resName>MALICIOUS IP</resName>
                <resDescription>DETECTING AND IDENTIFYING MALICIOUS WEBSITE BY THEIR IP received after DNS Resolution</resDescription>
                <resCname>0.0.0.0,chansd,sadsadsad</resCname>
                <resIP_AddressList>19.19.19.19</resIP_AddressList>
            </response>
        </responseIP>
        <accessPolicies>
            <policy>
                <status>ENABLE</status>
                <policyName>BLOCK ADS</policyName>
                <policyDescription>Block Ads for Localhost</policyDescription>
                <dnsServerList></dnsServerList>
                <userGroupList>UserGroup1(LOCALHOST)</userGroupList>
                <requestedDomainList>Ads Req</requestedDomainList>
                <webCategoryList></webCategoryList>
                <responseIPList></responseIPList>
                <policyAction>BLOCK</policyAction>
            </policy>
        </accessPolicies>
    </dnsPolicyConfig>`;

    function loadConfig(xmlContent) {
        configParser = new ConfigParser(xmlContent);
        configParser.showDetails();
        
        // Add Data to UserGroup Table
        document.querySelector("#userGroupsTable tbody").innerHTML = ""; // Empty The UserGroup Table
        configParser.userGroupList.forEach(function(oneuserGroup) {
            UserGroup_UI_Manager.addToUserGroupsTable(oneuserGroup);
        })

        // Add Data to Request Table
        document.querySelector("#requestTable tbody").innerHTML = "" // Empty The Request Table
        configParser.requestList.forEach(function(oneRequest) {
            Request_UI_Manager.addToRequestTable(oneRequest);
        })

        // Add Data to Policy Table
        document.querySelector("#policyTable tbody").innerHTML = "" // Empty The Policy Table
        configParser.policyList.forEach(function(onePolicy) {
            Policy_UI_Manager.addToPolicyTable(onePolicy);
        })
    }

    function loadConfigFromServer() {

        method = "GET";
        reqUrl = "http://127.0.0.1:8080/sendXML";
        
        $.ajax({
            type: method,
            url: reqUrl,
            contentType: "text/plain", // Header: Request: Content-Type
            success: function (data) {
            //alert("Data Recieved: " + data);
            loadConfig(data);
            },
            error: function (e) {
                //alert("Error Occured: ", JSON.stringify(e));
                console.log("Error Occured: ", JSON.stringify(e));
            }
        });
    }

    function uploadConfig() {
        // Testing
        xmlData = configParser.generateConfigXML();

        // Make Ajax Call

        method = "POST";
        uploadUrl = "http://127.0.0.1:8080/uploadXML";

        if (uploadUrl === "") {
            alert("uploadUrl NOT Specified ");
            return;
        }

        $.ajax({
            type: method,
            url: uploadUrl,
            contentType: "text/xml", // Header: Request: Content-Type
            //dataType: 'json', // Header: Accept: [Content-Type]
            data: xmlData,
            success: function (data) {
                //alert("Data Recieved: " + data);
                console.log("Data Recieved: " + data);
            },
            error: function (e) {
                //alert("Data Recieved: ", JSON.stringify(e));
                console.log("Data Recieved: ", JSON.stringify(e));
            }
        });

        console.log("uploadConfig........................!!!!!!!!!!!")

    }

    function getWebCategoryList() {

        console.log("CATEGORY LSIT CALLED -----------------")
        function addToAllSelect(categoryList) {
            document.querySelectorAll("select.webCategoryList-select").forEach(function(oneWebCategorySelect) {  
                oneWebCategorySelect.innerHTML = ""; //EMPTY THE LIST
            })
            let selectHTML = `<option value="" selected>--NOT-SELECTED--</option>`;
            for (let index = 0; index < categoryList.length; index++) {
                const oneOption = categoryList[index];
                selectHTML += `<option value="${oneOption}">${oneOption}</option>`;
            }
            document.querySelectorAll("select.webCategoryList-select").forEach(function(oneWebCategorySelect) {  
                oneWebCategorySelect.innerHTML = selectHTML; //Add Data To List
            })
            
        }

        method = "GET";
        reqUrl = "http://127.0.0.1:8080/sendWebCategoryList";
        
        let webCategoryList = [];

        // Sync Call Needed for Web Category Should be changed //IMP ERROR
        $.ajax({
            async: false,
            type: method,
            url: reqUrl,
            contentType: "text/plain", // Header: Request: Content-Type
            success: function (data) {
                console.log("[Data Received] WebCategoryList: ", data, ", DataType: ", typeof data);
                webCategoryList = JSON.parse(data);
                /** Automatically add it to all Select with Class: custom-select : */
                addToAllSelect(webCategoryList);
                console.log("[Transformed Received Data To Object] WebCategoryList: ", webCategoryList, ", DataType: ", typeof webCategoryList);
            },
            error: function (error) {
                console.log("Error Occured: ", JSON.stringify(error));
            }
        });
        return webCategoryList;
    }

    // Load Config
    document.querySelector("#loadConfig").addEventListener('click', function(event) {
        loadConfig(fileContent); // Testing Purposes
        loadConfigFromServer();
    })

    // Upload Config
    document.querySelector("#uploadConfig").addEventListener('click', function(event) {
        uploadConfig();
    })

    // loadConfig(fileContent); // Test Static Data

    // Use Click Event
    document.querySelector("#loadConfig").click();

    getWebCategoryList();

});