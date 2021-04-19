'use strict'

var gCanvas;
var gCtx;
var gStartPos
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gCurrLine


function onInit() {
    gCanvas = document.querySelector('#canvas');
    gCtx = gCanvas.getContext('2d');
    createImgs();
    renderMemes()
        // addListeners()
        // renderCanvas()
}

function renderMemes() {
    document.querySelector('.memes-container').innerHTML = getImgs().map((img, idx) => {
        return ` <img src="${img.url}" class="gallery-meme" onclick="onOpenEditor(${idx},this)">`
    }).join('');
}

function onOpenEditor(idx, elImg) {
    getCurrMeme().selectedImgId = idx;
    getCurrMeme().lines = [];
    console.log(elImg.style.height, elImg.style.width)
    document.querySelector('.meme-editor-container').style.display = 'grid'
    document.querySelector('.memes-container').style.display = 'none'
    drawImgOnCanvas(getCurrMeme().selectedImgId, elImg.height, elImg.width);
}

function drawImgOnCanvas(idx, height, width) {

    var img = new Image()
    img.src = getImgs()[idx].url;
    img.onload = () => {
        gCanvas.height = img.height
        gCanvas.width = img.width
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    }

}

function onAddText() {
    var text = document.querySelector('input[name=textLine]').value
    addNewLine(text)
    gCurrLine = getCurrMeme().lines[getCurrMeme().lines.length - 1]
    drawText(gCurrLine);
    onSwitchLine();
}



function drawText(line) {
    var text = line.txt;
    gCtx.lineWidth = 2
    gCtx.strokeStyle = line.color
    gCtx.fillStyle = 'white'
    gCtx.font = `${line.size}px Impact`
    gCtx.textAlign = line.align
    gCtx.fillText(text, line.pos.x, line.pos.y)
    gCtx.strokeText(text, line.pos.x, line.pos.y)
}

function renderCanvas() {
    drawImgOnCanvas(getCurrMeme().selectedImgId, gCanvas.height, gCanvas.width);
    setTimeout(() => {
        console.log(getCurrMeme().lines)
        getCurrMeme().lines.forEach(line => drawText(line))
    }, 100);

}

function currLine() {
    var lines = getCurrMeme().lines
    lines.forEach(line => {
        if (lines[getCurrMeme().selectedLineIdx] === line) {
            line.color = 'red';
            gCurrLine = line
        } else line.color = 'black';
    })
    renderCanvas()
}

function onSwitchLine() {
    var lines = getCurrMeme().lines
    getCurrMeme().selectedLineIdx = (getCurrMeme().selectedLineIdx === lines.length - 1) ? 0 : getCurrMeme().selectedLineIdx + 1
    currLine();
}

function onIncY() {
    getCurrMeme().lines[getCurrMeme().selectedLineIdx].pos.y += 10
    renderCanvas();
}

function onDecY() {
    getCurrMeme().lines[getCurrMeme().selectedLineIdx].pos.y -= 10
    renderCanvas();
}




























































function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    })
}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (!isTextlicked(pos)) return
    gCurrLine.isDragging = true
    gStartPos = pos
    document.body.style.cursor = 'grabbing'

}

function onMove(ev) {
    if (gCurrLine.isDragging) {
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y

        gCurrLine.pos.x += dx
        gCurrLine.pos.y += dy

        gStartPos = pos
        renderCanvas()
    }
}

function onUp() {
    gCurrLine.isDragging = false
    document.body.style.cursor = 'auto'
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function isTextlicked(clickedPos) {
    const { pos } = gCurrLine
    const distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2)
    return distance <= gCurrLine.size
}

function drawArc(x, y, size = 60, color = 'blue') {
    gCtx.beginPath()
    gCtx.lineWidth = '6'
    gCtx.arc(x, y, size, 0, 2 * Math.PI)
    gCtx.strokeStyle = 'white'
    gCtx.stroke()
    gCtx.fillStyle = color
    gCtx.fill()

}

// function renderCanvas() {
//     gCtx.save()
//     gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height)
//     gCtx.restore()
//     if (gCurrLine) renderCircle()
// }

function renderCircle() {
    const { pos, color, size } = gCurrLine
    drawArc(pos.x, pos.y, size, color)
}