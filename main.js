var windowW = 150;
var windowH = 50;
//resolution for edge detection
var xres = 10;
var yres = 50;
var width = window.outerWidth;
var height = window.outerHeight-134;
//ratio of window size to canvas size
var wtocX;
var wtocY;
var openwindows = [];
var windowsToOpen = {
    x: [],
    y: []
};
var  darkmode = window.matchMedia('(prefers-color-scheme: dark)').matches;

async function openit(x, y) {
    if(darkmode){
        openwindows.push(window.open('black.html', '_blank', 'width=100,height=100,screenX=' + x + 'px, screenY=' + y + 'px'));
    }else{
        openwindows.push(window.open('white.html', '_blank', 'width=100,height=100,screenX=' + x + 'px, screenY=' + y + 'px'));
    }
}
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function newFrame(number) {
    console.log("new image");
    const img = new Image(); // Create new img element
    img.src = "badApple/" + number + ".png";
    img.addEventListener("load", () => {
        canvas.width = img.width;
        canvas.height = img.height;
        console.log("image loaded");
        ctx.drawImage(img, 0, 0);
        wtocX = canvas.width/width;
        wtocY = canvas.height/height;
        frameDone(number);
    }, false,);
}
function getPixelColor(x, y) {
    const imgData = ctx.getImageData(x, y, 1, 1);
    const imageData = imgData.data;
    // Extract the color components (red, green, blue, alpha)
    const red = imageData[0];
    const green = imageData[1];
    const blue = imageData[2];

    // Return the color as a string in the format "rgb(red, green, blue)"
    return red<100;
}
function frameDone(frame) {
    //draw it
    let previousPixelColor = false;
    let previousPixelNumber = 0;
    for (let y = 0; y < height / yres; y++) {
        for (let x = 0; x < width / xres; x++) {
            const pixelColor = getPixelColor(Math.round(((x * xres))*wtocX), Math.round(((y * yres)*wtocY)));
            if((!previousPixelColor && pixelColor) || (previousPixelNumber>windowW && previousPixelColor==true)){
                windowsToOpen.x.push(x * xres + (windowW/2));
                windowsToOpen.y.push(y * yres + (windowH/2));
                previousPixelNumber = 0;
            }
            previousPixelColor = pixelColor;
            previousPixelNumber += xres;
        }
        previousPixelNumber = 0;
    }
    windowsToOpen.x.forEach((no, index) => openit(windowsToOpen.x[index], windowsToOpen.y[index]));
        setTimeout(() => {   
       openwindows.forEach((x) => x.close());
       openwindows = [];
        }, "1000");
}

function start(){
     windowW = Number(document.getElementById("width").value);
 windowH = Number(document.getElementById("height").value);
//resolution for edge detection
 xres = Number(document.getElementById("res").value);
 yres = 50;
 width = window.outerWidth;
 height = window.outerHeight-Number(document.getElementById("fullHeight").value);
 if(darkmode){
document.getElementById("bblocker").style.display = "block"
document.getElementById("bblocker").style.zIndex = "100";

}else{
    document.getElementById("wblocker").style.display = "block"
    document.getElementById("wblocker").style.zIndex = "100";

}
document.getElementById("body").scroll({top: 0,left: 0,behavior: "instant",});
console.log("starting")
newFrame(1);

}