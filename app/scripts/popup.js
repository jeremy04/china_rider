'use strict';

console.log('Popup');


$(function() {
  
  function deferredAddZip(url, filename, zip) {
    var deferred = $.Deferred();
    JSZipUtils.getBinaryContent(url, function (err, data) {
        if(err) {
            deferred.reject(err);
            alert("error dude" + err);
        } else {
            zip.file(filename, data, {binary:true});
            deferred.resolve(data);
        }
    });
    return deferred;
  }


  function download_all(urls) 
  {
    var zip = new JSZip();
    var deferreds = [];

    $.each(urls, function(k,v) {
      deferreds.push(deferredAddZip(v, "track" + k + ".mp3", zip));
    });
    
    $.when.apply($, deferreds).done(function () {
      var blob = zip.generate({type:"blob"});
      $("#submit").prop("disabled",false);
      saveAs(blob, "example.zip");

    }).fail(function (err) {
      alert("AHH CRAIG");
    });

  }

  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {cmd: "getMP3"},function(response) {
      if (response.urls) {
        $("<button type='submit' id='submit' class='btn btn-primary'>Download</button>").insertAfter("#radios");
    
      }
    });
  });


  $("#download_form").on("submit", function () {
    
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {cmd: "getMP3"},function(response) {
          if (response.urls) {
            $("#submit").prop("disabled",true);
            console.log("about to download");
            download_all(response.urls);
          }
          else {
            console.log("Something went wrong");
          }
        });
    });
  
    event.preventDefault();
            
  });


});