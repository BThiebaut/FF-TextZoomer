console.log('runned');
var baseValue = 0;
var root = null;
window.isScanned = typeof window.isScanned != 'undefined' ? window.isScanned : false;

function initZoom(request, sender, sendResponse){
  root = document.querySelector(":root");
  var rootStyle = window.getComputedStyle(root);
  baseValue = parseInt(rootStyle.fontSize.replace('px', ''));
  scanText();
  changeZoom(request.value);
}

function scanText(){
  if (!isScanned){
    document.querySelectorAll('*').forEach(function(node) {
      var style = window.getComputedStyle(node);
      if (style.fontSize.indexOf('px') > -1){
        
        var size = style.fontSize.match(/\d+/);
        if (size !== null){
          size = parseInt(size[0]);
          var rem = parseFloat((size / parseInt(baseValue, 10)).toPrecision(4));        
          node.style.fontSize = rem + 'rem';
        }
      }
    });
    isScanned = true;
  }
}

function changeZoom(value){
  root.style.fontSize = value + '%'; 
}


browser.runtime.onMessage.addListener(initZoom);


