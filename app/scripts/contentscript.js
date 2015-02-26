'use strict';

console.log('\'Allo \'Allo! Content script');

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.cmd == 'getMP3') {
    var foo = $(".mp3").map(function(){return $(this).data('url');}).get();
    sendResponse({urls: foo });
  }
  else if (msg.cmd == 'getURL') {
    var foo = $.map( $(".content a"), function(n) { return { "name": n.text, "url": n.href } } ) ;
    sendResponse({urls: foo });
  }
  else
  {
   sendResponse({urls: "error"}); 
  }
});

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = chrome.extension.getURL('scripts/grabPlaylist.js');
document.getElementsByTagName('head')[0].appendChild(script);