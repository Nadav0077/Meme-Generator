'use strict'
var gIsShowSaved = false;
var gCurrColor = '#FFFFFF'
var gCurrSavedMemeIdx;

const KEYwords = 'savedKeywords'
const KEYmemes = 'savedMemes'
var gImgs = [];
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: []
}
var gSavedMemes = (loadFromStorage(KEYmemes)) ? loadFromStorage(KEYmemes) : []
var gKeywords;
var gKeyword


function createImgs() {
    for (var i = 0; i < 23; i++) {
        gImgs.push({ id: i + 1, url: `img/meme-imgs/${i+1}.jpg` })
    }
    gImgs[0].keywords = ['politics']
    gImgs[1].keywords = ['cute']
    gImgs[2].keywords = ['cute', 'kids']
    gImgs[3].keywords = ['cute', 'funny']
    gImgs[4].keywords = ['cute', 'funny', 'kids']
    gImgs[5].keywords = ['funny', 'stupid']
    gImgs[6].keywords = ['stupid', 'funny', 'kids']
    gImgs[7].keywords = ['funny', 'explain']
    gImgs[8].keywords = ['cute', 'funny', 'kids']
    gImgs[9].keywords = ['politics', 'funny']
    gImgs[10].keywords = ['fight', 'funny']
    gImgs[11].keywords = ['you']
    gImgs[12].keywords = ['happy']
    gImgs[13].keywords = ['mad', 'serious']
    gImgs[14].keywords = ['explain']
    gImgs[15].keywords = ['funny']
    gImgs[16].keywords = ['explain', 'serious', 'politics']
    gImgs[17].keywords = ['funny', 'explain']
    gImgs[18].keywords = ['cute']
    gImgs[19].keywords = ['devil']
    gImgs[20].keywords = ['kids']
    gImgs[21].keywords = ['happy']
    gImgs[22].keywords = ['mad']

    gKeywords = (loadFromStorage(KEYwords)) ? loadFromStorage(KEYwords) : createKeywordsMap();

}

function getImgs() {
    return gImgs;
}

function getCurrMeme() {
    return gMeme;
}

function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx--;
}

function addNewLine(txt = 'Add Text Here', x = gCanvas.width / 2, y, size = gCanvas.height / 10, align = 'center', strokeColor = 'black') {

    gMeme.lines.push({
        txt,
        size,
        align,
        strokeColor: strokeColor,
        isDragging: false,
        pos: { x, y },
        fontFam: 'Impact',
        color: gCurrColor,
        lastStrokeColor: strokeColor

    })
    var length = gMeme.lines.length;
    if (gMeme.lines.length === 1) gMeme.lines[length - 1].pos.y = gCanvas.height / 6;
    else if (gMeme.lines.length === 2) gMeme.lines[length - 1].pos.y = gCanvas.height - gCanvas.height / 6
    else if (gMeme.lines.length === 3) gMeme.lines[length - 1].pos.y = gCanvas.height / 2
    else gMeme.lines[length - 1].pos.y = gMeme.lines[length - 2].pos.y + size;

    gCurrLine = gMeme.lines[gMeme.lines.length - 1]
}

function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function createKeywordsMap() {
    var keywordsMap = {}
    gImgs.forEach(img => {
        img.keywords.forEach(keyword => {
            if (!keywordsMap[keyword]) keywordsMap[keyword] = 1;
        });
    });
    saveToStorage(KEYwords, keywordsMap)
    return keywordsMap;
}

function getKeywords() {
    return gKeywords;
}

function getImgsToShow() {
    if (!gIsShowSaved) {
        if (!gKeyword || gKeyword.length === 0) return gImgs;
        return gImgs.filter(img => {
            return img.keywords.some(keyword => {
                return keyword.substring(0, gKeyword.length) === gKeyword;
            });
        })
    } else {
        return (loadFromStorage(KEYmemes)) ? loadFromStorage(KEYmemes) : []
    }
}

function setFilter(keyword) {
    gKeyword = keyword;
}

function incKeyWord(keyword) {
    if (!gKeywords[keyword]) return false
    else gKeywords[keyword]++;
    saveToStorage(KEYwords, gKeywords)
    return true;
}

function saveImg() {
    var imgContent = gCanvas.toDataURL('image/jpeg')
    if (gIsShowSaved) gSavedMemes.splice(gCurrSavedMemeIdx, 1, { meme: gMeme, imgContent })
    else gSavedMemes.push({ meme: gMeme, imgContent })
    saveToStorage(KEYmemes, gSavedMemes)
}

function setFontColor(color) {
    gCurrColor = color;
}

function setStroke() {
    var color = (gCurrLine.strokeColor === 'red') ? gCurrLine.lastStrokeColor : gCurrLine.strokeColor;
    console.log(color)
    if (color === 'black')
        gCurrLine.strokeColor = 'transparent'
    else gCurrLine.strokeColor = 'black'
    gCurrLine.lastStrokeColor = gCurrLine.strokeColor;
}

function setCurrLineX(align) {
    var txtWidth = gCurrLine.txt.length * 20

    switch (align) {
        case 'right':
            gCurrLine.pos.x = gCanvas.width - txtWidth / 2
            break;
        case 'left':
            gCurrLine.pos.x = 0 + txtWidth / 2
            break;
        case 'center':
            gCurrLine.pos.x = gCanvas.width / 2
            break;
    }
}

function getSavedMemes() {
    return gSavedMemes;
}

function setCurrSavedMemeIdx(idx) {
    gCurrSavedMemeIdx = idx;
}