//define vars
var xres;
var yres;
var height;
var width;
var wtocX;
var wtocY;
var startFrame = 200;
var startGo;
var darkmode = window.matchMedia('(prefers-color-scheme: dark)').matches;
var skipFrames = false;
var tooSmall = true;
var sameTime = false;
var windowWidth = 150;
var framesToSkip = 50;
var nextFrame = {
    x: [],
    y: [],
    width: []
};
if (!darkmode) {
    alert("your browser is on light mode, dark mode is recomended for best quality, you dont have to switch though")
}
const myWorker = new Worker("worker.js");

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
async function newFrame(frame) {
    //load image
    const img = new Image(); // Create new img element
    img.src = "badApple/bad_apple_" + frame.toString().padStart(3, 0) + ".png";
    //once image loads
    img.addEventListener("load", () => {
        //draw image
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        //process image
        wtocX = canvas.width / width;
        wtocY = canvas.height / height;
        //get windows to open
        let currentWindow = {
            x: "",
            y: "",
            width: ""
        };
        nextFrame = {
            x: [],
            y: [],
            width: []
        };
        for (let y = 0; y < height / yres; y++) {   
            for (let x = 0; x < width / xres; x++) {
                const pixelColor = getPixelColor(Math.round(((x * xres)) * wtocX), Math.round(((y * yres) * wtocY)));
                //if its sizing a window right now
                if (currentWindow.x != "") {
                    if (pixelColor) {
                        currentWindow.width += xres;
                    } else {
                        if((currentWindow.width > 0 && !tooSmall) || (tooSmall && currentWindow.width>100)){
                        nextFrame.x.push(currentWindow.x);
                        nextFrame.y.push(currentWindow.y);
                        nextFrame.width.push(currentWindow.width);
                        }
                        currentWindow.x = "";
                    }
                } else if (pixelColor) {
                    //new window
                    currentWindow.x = x * xres;
                    currentWindow.y = y * yres;
                    currentWindow.width = 0;
                }
            }
            if (currentWindow.x != "") {
                if((currentWindow.width > 0 && !tooSmall) || (tooSmall && currentWindow.width>windowWidth)){
                    nextFrame.x.push(currentWindow.x);
                    nextFrame.y.push(currentWindow.y);
                    nextFrame.width.push(currentWindow.width);
                    }
                    currentWindow.x = "";

            }
        }
        console.log(nextFrame);
           frameDone(frame, nextFrame);
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
    if (darkmode) {
        return red < 100;
    } else {
        return red > 100;
    }
}
async function frameDone(frame, windowsToOpen) {
    let startTime = Date.now();
    let openwindows = [];
    windowsToOpen.x.forEach((no, index) => openwindows.push(openit(windowsToOpen.x[index], windowsToOpen.y[index], windowsToOpen.width[index])));
    let endTime = Date.now();
    let prevTime = endTime-startTime;
    openwindows.forEach((x) => x.close());

if(sameTime){
    setTimeout(()=>{
    openwindows.forEach((x) => x.close());
    if(skipFrames){
        newFrame(frame + prevTime/33);
        }else{
            newFrame(frame + framesToSkip);
        }
    }, 750-prevTime)
}else{
    openwindows.forEach((x) => x.close());
    if(skipFrames){
        newFrame(frame + Math.round(prevTime/33));
        }else{
            newFrame(frame + framesToSkip);
        }
}
}

function start() {
    //resolution for edge detection
    xres = Number(document.getElementById("xres").value);
    yres = Number(document.getElementById("yres").value);
    tooSmall = document.getElementById("tooSmall").checked
    skipFrames = document.getElementById("skipFrames").checked;
    sameTime = document.getElementById("sameTime").checked;
    windowWidth = document.getElementById("wwidth").value;
    //screen
    height = window.outerHeight - Number(document.getElementById("fullHeight").value);
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