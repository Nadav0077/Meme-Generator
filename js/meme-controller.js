'use strict'

var gCanvas;
var gCtx;

function onInit() {
    gCanvas = document.querySelector('#canvas');
    gCtx = gCanvas.getContext('2d');
    createImgs();
    renderMemes()

}

function renderMemes() {
    document.querySelector('.memes-container').innerHTML = getImgs().map((img, idx) => {
        return ` <img src="${img.url}" class="gallery-meme" onclick="onOpenEditor(${idx},this)">`
    }).join('');
}

function onOpenEditor(idx, elImg) {
    console.log(elImg.style.height, elImg.style.width)
    document.querySelector('.meme-editor-container').style.display = 'block'
    document.querySelector('.memes-container').style.display = 'none'
    drawImgOnCanvas(idx, elImg.height, elImg.width);
}

function drawImgOnCanvas(idx, height, width) {
    gCanvas.height = height
    gCanvas.width = width
    var img = new Image()
    img.src = getImgs()[idx].url;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    }
}