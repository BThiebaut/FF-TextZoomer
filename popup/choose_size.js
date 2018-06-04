var slider  = document.getElementById("textRange");
var output  = document.getElementById("output");
var reset   = document.getElementById("resetBtn");
var save    = document.getElementById("saveBtn");
var regUrl  = /^https?:\/\/[^\/]+/i; 

output.innerHTML = '100%';
slider.value = 100;

function setPageZoome(){
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
       browser.tabs.sendMessage(tabs[0].id, {value: '100'});
       slider.value = 100;
       output.innerHTML = '100%';
    });
}

function restoreSaved(){
    browser.windows.getCurrent({populate: true}).then((windowInfo) => {
        browser.tabs.query({windowId: windowInfo.id, active: true})
        .then((tabs) => {
            var url = tabs[0].url.match(regUrl);
            return browser.storage.local.get(url[0]);
        })
        .then((storedInfo) => {
            var value = storedInfo[Object.keys(storedInfo)[0]];
            slider.value = value;
            output.innerHTML = value + '%';
            setPageZoome();
        });
    });
}

function saveValue(){        
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
        let store = {};
        var url = tabs[0].url.match(regUrl);
        store[url[0]] = slider.value;
        browser.storage.local.set(store);
    });
}

restoreSaved();
browser.tabs.executeScript(null, { file: "/content_scripts/TextZoomer.js" });
slider.oninput = function() {
    output.innerHTML = this.value + '%';
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {value: this.value});
      window.currentValue = this.value;
    });
};

reset.onclick = setPageZoome;
save.onclick = saveValue;