'use strict'


var gCanvas;
var gCtx;
var gStartPos
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gCurrLine;



function onInit() {
    downloadFonts()
    animateFavicon();
    gCanvas = document.querySelector('#canvas');
    gCtx = gCanvas.getContext('2d');
    createImgs();
    renderMemes()
    addListeners()
    renderCanvas()
    renderKeyWords();
}

function renderMemes() {
    document.querySelector('.memes-container').innerHTML =
        (!gIsShowSaved) ?
        getImgsToShow().map((img) => {
            return ` <img src="${img.url}" class="gallery-meme" onclick="onOpenEditor(${img.id-1},this,'${img.url}')">`
        }).join('') :

        getImgsToShow().map((img) => {
            return ` <img src="${img.imgContent}" data-meme="${JSON.stringify(img.meme).substring(0,-1)}" class="gallery-meme" onclick="onOpenEditor(${img.meme.selectedImgId},this,'${img.meme.url}')">`
        }).join('')
}

function onOpenEditor(idx, elImg, url) {
    if (gIsShowSaved) {
        gMeme = JSON.parse(elImg.dataset.meme);
        var img = new Image()
        img.onload = renderCanvas.bind()
        img.src = gMeme.url

    } else {
        getCurrMeme().url = url
        getCurrMeme().selectedImgId = idx;
        getCurrMeme().lines = [];
        getCurrMeme().selectedLineIdx = 0;
    }
    document.querySelector('.meme-editor-container').style.display = 'grid'
    document.querySelector('.filter-container').style.display = 'none'
    document.querySelector('.memes-container').style.display = 'none'
    drawImgOnCanvas(idx, elImg.height, elImg.width);

}

function drawImgOnCanvas(idx, height, width) {

    var img = new Image()
    img.src = getCurrMeme().url;
    img.onload = () => {
        gCanvas.height = height * (400 / width)
        gCanvas.width = 400
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
    gCtx.font = `${line.size}px ${line.fontFam}`
    gCtx.textAlign = line.align
    gCtx.fillText(text, line.pos.x, line.pos.y)
    gCtx.strokeText(text, line.pos.x, line.pos.y)
}

function renderCanvas() {
    drawImgOnCanvas(getCurrMeme().url, gCanvas.height, gCanvas.width);
    setTimeout(() => {
        getCurrMeme().lines.forEach(line => drawText(line))
    }, 50);

}

function currLine() {
    var lines = getCurrMeme().lines
    lines.forEach(line => {
        if (lines[getCurrMeme().selectedLineIdx] === line) {
            line.color = 'red';
            gCurrLine = line
            document.querySelector('input[name=textLine]').value = line.txt;
        } else line.color = 'black';
    })
    renderCanvas()
}

function onSwitchLine() {
    var lines = getCurrMeme().lines
    if (lines.length !== 0) {
        getCurrMeme().selectedLineIdx = (getCurrMeme().selectedLineIdx === lines.length - 1) ? 0 : getCurrMeme().selectedLineIdx + 1
        currLine();
    }
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
        // resizeCanvas()
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
    if (!isTextlicked(pos) || getCurrMeme().lines.length === 0) return
    gCurrLine.isDragging = true
    gStartPos = pos
    document.body.style.cursor = 'grabbing'

}

function onMove(ev) {
    if (getCurrMeme().lines.length !== 0 && gCurrLine.isDragging) {
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

function downloadImg(elLink) {
    var lines = getCurrMeme().lines
    lines.forEach(line => line.color = 'black')
    renderCanvas()
    var imgContent = gCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent

}

function onClear() {
    getCurrMeme().selectedLineIdx = 0;
    getCurrMeme().lines = [];
    renderCanvas();
}

function onAlign(align) {
    gCurrLine.align = align
    renderCanvas();
}

function onChangeFontSize(size) {
    gCurrLine.size += size
    renderCanvas();
}

function onChangeFontFamily(fontFam) {
    gCurrLine.fontFam = fontFam
    renderCanvas();
}

function onChangeTxt(ev, txt) {
    if (ev.code === 'Enter') {
        if (txt === '' || !txt) {
            removeLine();
            currLine();
        } else gCurrLine.txt = txt;
    }
    renderCanvas();
}

function renderKeyWords() {
    var strHtml = ''
    var keywords = getKeywords();
    for (const keyword in keywords) {
        strHtml += `<a href="#" class="keyword" onclick="onFilterImgs(this.dataset.keyword,this)" data-keyword="${keyword}" style="font-size:${keywords[keyword]+16}px">${keyword}</a>`

    }

    document.querySelector('.keywords-container').innerHTML = strHtml
}


function onAnimHamburger(x) {
    x.classList.toggle("change");
}


let mainNav = document.getElementById('js-menu');
let navBarToggle = document.getElementById('js-navbar-toggle');

navBarToggle.addEventListener('click', function() {
    mainNav.classList.toggle('active');
});

function onFilterImgs(keyword, elKeyword) {
    setFilter(keyword)
    incKeyWord(keyword)
    renderKeyWords();
    renderMemes();
}

function onSave() {
    var lines = getCurrMeme().lines
    lines.forEach(line => line.color = 'black')
    renderCanvas()
    setTimeout(() => saveImg(), 50)

}

function onOpenSaved() {
    document.querySelector('.meme-editor-container').style.display = 'none'
    document.querySelector('.filter-container').style.display = 'none'
    gIsShowSaved = true;
    renderMemes();
}

function onOpenGallery() {
    // window.location(ur)
    // gKeyword = ''
    // document.querySelector('.meme-editor-container').style.display = 'none'
    // document.querySelector('.filter-container').style.display = 'flex'
    // document.querySelector('.memes-container').style.display = 'block'
    // document.querySelector('input[name=imageUpload]').event = undefined
    // gIsShowSaved = false;
    location.reload();
    // renderMemes();
}

function base64_to_jpeg($base64_string, $output_file) {
    $ifp = fopen($output_file, 'wb');
    $data = explode(',', $base64_string);
    fwrite($ifp, base64_decode($data[1]));
    fclose($ifp);
    return $output_file;
}

function animateFavicon() {

    var favicon_images = [],
        image_counter = 0; // To keep track of the current image
    for (var i = 0; i < 88; i++) {
        favicon_images.push(`img/favicon/frame_${i}_delay-0.25s.gif`)
    }


    setInterval(function() {
        if (document.querySelector("link[rel='icon']") !== null)
            document.querySelector("link[rel='icon']").remove();
        if (document.querySelector("link[rel='shortcut icon']") !== null)
            document.querySelector("link[rel='shortcut icon']").remove();
        document.querySelector("head").insertAdjacentHTML('beforeend', '<link rel="icon" href="' + favicon_images[image_counter] + '" type="image/gif">');
        if (image_counter == favicon_images.length - 1)
            image_counter = 0;
        else
            image_counter++;
    }, 200);
}

function onShare() {
    var file = new File([gCanvas.toDataURL('image/jpeg')], "picture.jpg", { type: 'image/jpeg' });
    var filesArray = [file];
    // const filesArray = [gCanvas.toDataURL('image/jpeg')];
    if (navigator.canShare && navigator.canShare({ files: filesArray })) {
        var lines = getCurrMeme().lines
        lines.forEach(line => line.color = 'black')
        renderCanvas()
        setTimeout(() => navigator.share({
            files: filesArray,
            title: 'Pictures',
            text: 'Our Pictures.',
        }), 50)

        .then(() => console.log('Share was successful.'))
            .catch((error) => console.log('Sharing failed', error));
    } else {
        console.log(`Your system doesn't support sharing files.`);
    }
}

function onImgInput(ev) {
    loadImageFromInput(ev)

}

function loadImageFromInput(ev) {
    var reader = new FileReader()

    reader.onload = function(event) {
        var img = new Image()
        img.onload = () => {
            onOpenEditor(null, null, img.src)
            renderCanvas()
        }
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])
}

function downloadFonts() {
    var el = document.querySelector('.font-download');
    el.style.fontFamily = `Brush Script MT`
    el.style.font = `Courier New`
    el.style.font = `Garamond`
    el.style.font = `Georgia`
    el.style.font = `Times New Roman`
    el.style.font = `Trebuchet`
    el.style.font = `Tahoma`
    el.style.font = `Helvetica`
    el.style.font = `Verdana`
    el.style.font = `Ariel`
    el.style.fontFamily = `Impact`
    console.log(el.style.fontFamily)

}