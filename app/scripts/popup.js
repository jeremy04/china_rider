'use strict';

console.log('Popup');


$(function() {

  var xhr_requests = {};
  
  function doProgress(oEvent) {
    if (oEvent.lengthComputable) {
      var percentComplete = oEvent.loaded / oEvent.total;
      var oldPercent = getTotalPercent();
      updatePercent(oEvent.target.responseURL, percentComplete);
      var newPercent = getTotalPercent();
      if (newPercent > oldPercent) {
        document.getElementById("progress").innerHTML = "Compressing " + getTotalPercent() + " % ";
      }   
      
    }
  
    function updatePercent(url, percent) {
      xhr_requests[url] = percent;
    }

    function getPercents() {
      return xhr_requests;
    }

    function getTotalPercent() {

      var array = _.map(getPercents(), function(value, index) {
          return value;
      });

      var sum = _.reduce(array, function(a,b){ return a + b; }, 0);
      return Math.floor((sum / array.length) * 100);

    }
    
  }

  function startDownload(err, data) {
      if(err) {
          deferred.reject(err);
          console.log("Ahh Craig ");
      } else {
          zip.file(filename, data, {binary:true});
          deferred.resolve(data);
      }
    }

  function deferredAddZip(url, filename, zip) {
    var deferred = $.Deferred();
    JSZipUtils.getBinaryContent(url, startDownload, doProgress);
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