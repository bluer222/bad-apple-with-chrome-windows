//define vars
var xres;
var yres ;
var height;
var width;
var wtocX;
var wtocY;
var startFrame = 100;
var startGo ;
var darkmode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
//open function
function openit(x, y, width) {
    if (darkmode) {
        return window.open('black.html', '_blank', 'width=' + width + 'px,height=100px,screenX=' + x + 'px, screenY=' + y + 'px');
    } else {
        return window.open('white.html', '_blank', 'width=' + width + 'px,height=100px,screenX=' + x + 'px, screenY=' + y + 'px');
    }
}
async function newFrame(number) {
    //load image
    const img = new Image(); // Create new img element
    img.src = "badApple/bad_apple_" + number.toString().padStart(3, 0) + ".png";
    //once image loads
    img.addEventListener("load", () => {
        //draw image
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        //process image
        wtocX = canvas.width / width;
        wtocY = canvas.height / height;
        var windowsToOpen = {
            x: [],
            y: [],
            width: []
        };
        //get windows to open
        let currentWindow = {
            x: "",
            y: "",
            width: ""
        };
        for (let y = 0; y < height / yres; y++) {
            for (let x = 0; x < width / xres; x++) {
                const pixelColor = getPixelColor(Math.round(((x * xres)) * wtocX), Math.round(((y * yres) * wtocY)));
                //if its sizing a window right now
                if (currentWindow.x != "") {
                    if (pixelColor) {
                        currentWindow.width += xres;
                    } else {
                        if(currentWindow.width != 0){
                        windowsToOpen.x.push(currentWindow.x);
                        windowsToOpen.y.push(currentWindow.y);
                        windowsToOpen.width.push(currentWindow.width);
                        }
                        currentWindow.x = "";
                    }
                }
                //new window
                if (currentWindow.x == "" && pixelColor) {
                    currentWindow.x = x * xres;
                    currentWindow.y = y * yres;
                    currentWindow.width = 0;
                }
            }
            if (currentWindow.x != "") {
                if(currentWindow.width != 0){
                windowsToOpen.x.push(currentWindow.x);
                windowsToOpen.y.push(currentWindow.y);
                windowsToOpen.width.push(currentWindow.width);
                }
                currentWindow.x = "";
            }
        }
        console.log(windowsToOpen);
       frameDone(number, windowsToOpen);
    }, false,);
}
function getPixelColor(x, y) {
    const imgData = ctx.getImageData(x, y, 1, 1);
    const imageData = imgData.data;
    // Extract the color components (red, green, blue, alpha)
    const red = imageData[0];
    //const green = imageData[1];
    //const blue = imageData[2];
    // Return the color as a string in the format "rgb(red, green, blue)"
    return red < 100;
}
async function frameDone(frame, windowsToOpen) {
    newFrame(frame + 50);
    let openwindows = [];
    windowsToOpen.x.forEach((no, index) => openwindows.push(openit(windowsToOpen.x[index], windowsToOpen.y[index], windowsToOpen.width[index])));
    openwindows.forEach((x) => x.close());
}

function start() {
    //resolution for edge detection
    xres = Number(document.getElementById("xres").value);
    yres = Number(document.getElementById("yres").value);
    //screen
     height = window.outerHeight- Number(document.getElementById("fullHeight").value);
 width = height * (4 / 3);
    if (darkmode) {
        document.getElementById("bblocker").style.display = "block"
        document.getElementById("bblocker").style.zIndex = "100";

    } else {
        document.getElementById("wblocker").style.display = "block"
        document.getElementById("wblocker").style.zIndex = "100";
    }
    document.getElementById("body").scroll({ top: 0, left: 0, behavior: "instant", });
    console.log("starting")
    newFrame(startFrame);
}