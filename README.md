# iradio
This is a template for an internet radio site. It's optimized as a web client for an Icecast server.

See demo here https://walexi.github.io/iradio/


![Alt text](/demo.png?raw=true "Demo")



To use this

1. Edit the main.js file in the js directory

2. Change the url on line 3 in the radioTitle function  
 `var url = ' '; //put the url to fetch currently playing here. For an icecast server, it looks like this 192.000.000/iradio.xspf`

3.  Modify the url on line 55  
 `$(this).jPlayer("setMedia", {mp3: " " //Put the url of the server here such as 192.000.000.000/iradio}).jPlayer("play");`


4.  You can also change the logo in the img folder and edit to suit your taste

Credits:
jplayer https://github.com/jplayer/jPlayer

zen player https://github.com/simurai/ZEN-Player
