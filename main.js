const windowW = 50;
const windowH = 50;
const width = window.outerWidth;
const height = window.outerHeight;
//ratio of window size to canvas size
var wtocX;
var wtocY;
var openwindows = [];
var windowsToOpen = {
    x: [],
    y: []
};

async function openit(x, y) {
        openwindows.push(window.open('black.html', '_blank', 'width=100,height=100,screenX=' + x + 'px, screenY=' + y + 'px'));
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
    for (let y = 0; y < height / windowH; y++) {
        for (let x = 0; x < width / windowW; x++) {
            if(getPixelColor(Math.round(((x * windowW))*wtocX), Math.round(((y * windowH)*wtocY)))){
                windowsToOpen.x.push(x * windowW);
                windowsToOpen.y.push(y * windowH);

            }
        }
    }
    windowsToOpen.x.forEach((no, index) => openit(windowsToOpen.x[index], windowsToOpen.y[index]));
        setTimeout(() => {   
       openwindows.forEach((x) => x.close());
       openwindows = [];
        }, "1000");
}
console.log("starting")
newFrame(1);
