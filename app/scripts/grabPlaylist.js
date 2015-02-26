$(window).load(function(){

setTimeout(function(){ 

  var foo = jwplayer('jw6').getPlaylist();
  foo = $.map(foo, function(n) { return "https://archive.org" + n.file } );
  $.each(foo, function(k,v) {
    $('body').append($("<div class='mp3' data-url='" + v + "'></div>"));
  });

 }, 5000);



});
