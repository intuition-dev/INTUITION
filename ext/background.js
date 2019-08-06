let active = false;
function isActive() { return active; }

let webAdminUrl;
let u;
function getWebAdminUrl() { return webAdminUrl; }
function getCurrentPage() { return u; }

let activate = () => {
    active = true;
    console.info("Extension is active");
    chrome.browserAction.setIcon({path:"icon.png"});
    
}

let deactivate = () => {
    active = false;
    console.info("Extension deactivated");
    chrome.browserAction.setIcon({path:"icon_disabled.png"});
}

let checkExtStatus = function () {
    deactivate();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function (response) {
            tabs.forEach(function (activeTab) {
                if (typeof activeTab.url !== 'undefined') {
                    // console.info('activeTab ------>', activeTab, activeTab.url);
                    u = new URL(activeTab.url);
                    u = u.pathname.replace(/^\/|\/$/g, '');
                    chrome.extension.sendMessage('hello');
                    
                    var url = new URL(activeTab.url);
                    var domain = url.hostname;
                    if (url.protocol === 'http:' || url.protocol === 'https:') {
                        var map = url.protocol + '//' + domain + '/server.yaml';
                        // console.info('map ------>', map);
                        
                        $.get(map)
                        .done(function (res) {
                            let map = jsyaml.load(res);
                            console.info('RES:', res, map.isAdmin);
                            webAdminUrl = map.isAdmin;
                            if (typeof map.isAdmin !== 'undefined') {
                                activate();
                            } else {
                                deactivate();
                            }
                        })
                        .fail(deactivate);
                    } else {
                        deactivate();
                    }
                } else {
                    deactivate();
                }
                
            })
        })
    })
};

chrome.tabs.onUpdated.addListener(checkExtStatus);
chrome.tabs.onActivated.addListener(checkExtStatus);