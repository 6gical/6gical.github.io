var img = new Array();
img[0] = "images/ram1.jpg";
img[1] = "images/ram2.jpg";
img[2] = "images/ram3.jpg";

var n = Math.floor(Math.random()*img.length);
document.write("<img src='" + img[n] + " ' border='0'>");
