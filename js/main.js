function radioTitle() {

    var url = ' '; //put the url to fetch currently playing here. For an icecast server, it looks like this 192.000.000/iradio.xspf

    $.ajax({
        type: 'GET',
        url: url,
        async: true,
        cache: false,
        dataType: 'xml',
        success: function(xml) {


            var name = $(xml).find("track").find("title").text();
            if (name) {
            	$('.live_tag').toggle(false);
            	
			$('#current_track_title').text(name);
            } else{
             fetchCustomTitle();
           }

        },
        error: function(e) {
            console.log(e.message);
        }
    });
}

function fetchCustomTitle() {
    // var timeObject = clock.getTime();
    //  var res = str1.concat(str2); 
    // var name = "GOBC 2016 Day ";
    // var finName = name.concat(timeObject.getDays(true));
     $('.live_tag').toggle(true); //show the live tag

    $('#current_track_title').text("Live Streaming");
    
}
 

$(document).ready(function() {

    var dragging = false;
    // init

   
    var player = $("#radio .player");

   

	 player.jPlayer({
        ready: function() {
            $(this).jPlayer("setMedia", {
                mp3: " " //Put the url of the server here such as 192.000.000.000/iradio
            }).jPlayer("play");
        },
        swfPath: "",
        supplied: "mp3",
        preload: "auto",
        smoothPlayBar: "true"
    });

    var status = "play";

    $("#radio").addClass("play");



    player.bind($.jPlayer.event.progress, function(event) {

        var audio = $('#radio audio').get(0);
        var pc = 0;

        if ((audio.buffered != undefined) && (audio.buffered.length != 0)) {
            pc = parseInt(((audio.buffered.end(0) / audio.duration) * 100), 10);
            displayBuffered(pc);
            if (pc >= 99) {
                $('#radio .buffer').addClass("loaded");

            }
        }
        
        radioTitle();
        setTimeout(function() { radioTitle(); }, 2000);
        setInterval(function() { radioTitle(); }, 15000); // we're going to update our html elements / player every 15 seconds

		
    });


    player.bind($.jPlayer.event.timeupdate, function(event) {
        var pc = event.jPlayer.status.currentPercentAbsolute;
        if (!dragging) {
            displayProgress(pc);
        }
    });

    player.bind($.jPlayer.event.ended, function(event) {
        $('#radio .circle').removeClass("rotate");
        $("#radio").removeClass("play");
        $('#radio .progress').css({ rotate: '0deg' });
        status = "stop";
    });





    // play/pause

    $("#radio .button").bind('mousedown', function() {
        // not sure if this can be done in a simpler way.
        // when you click on the edge of the play button, but button scales down and doesn't drigger the click,
        // so mouseleave is added to still catch it.
        $(this).bind('mouseleave', function() {
            $(this).unbind('mouseleave');
            onClick();
        });
    });

    $("#radio .button").bind('mouseup', function() {
        $(this).unbind('mouseleave');
        onClick();
    });


    function onClick() {

        if (status != "play") {
            status = "play";
            $("#radio").addClass("play");
            player.jPlayer("play");
        } else {
            $('#radio .circle').removeClass("rotate");
            $("#radio").removeClass("play");
            status = "pause";
            player.jPlayer("pause");
        }
    };




    // draggin

    var clickControl = $('#radio .drag');

    clickControl.grab({
        onstart: function() {
            dragging = true;
            $('#radio .button').css("pointer-events", "none");

        }, onmove: function(event) {
            var pc = getArcPc(event.position.x, event.position.y);
            player.jPlayer("playHead", pc).jPlayer("play");
            displayProgress(pc);

        }, onfinish: function(event) {
            dragging = false;
            var pc = getArcPc(event.position.x, event.position.y);
            player.jPlayer("playHead", pc).jPlayer("play");
            $('#radio .button').css("pointer-events", "auto");
        }
    });






    // functions

    function displayProgress(pc) {
        var degs = pc * 3.6 + "deg";
        $('#radio .progress').css({ rotate: degs });
    }
    function displayBuffered(pc) {
        var degs = pc * 3.6 + "deg";
        $('#radio .buffer').css({ rotate: degs });
    }

    function getArcPc(pageX, pageY) {
        var self = clickControl,
            offset = self.offset(),
            x = pageX - offset.left - self.width() / 2,
            y = pageY - offset.top - self.height() / 2,
            a = Math.atan2(y, x);

        if (a > -1 * Math.PI && a < -0.5 * Math.PI) {
            a = 2 * Math.PI + a;
        }

        // a is now value between -0.5PI and 1.5PI 
        // ready to be normalized and applied   			
        var pc = (a + Math.PI / 2) / 2 * Math.PI * 10;

        return pc;
    }




});

