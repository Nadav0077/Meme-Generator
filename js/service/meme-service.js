'use strict'

var gImgs = [];
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [{
        txt: 'I never eat Falafel',
        size: 20,
        align: 'left',
        color: 'red'
    }]
}


function createImgs() {
    for (var i = 0; i < 18; i++) {
        gImgs.push({ id: i + 1, url: `img/meme-imgs/${i+1}.jpg` })
    }
    gImgs[0].keywords = ['politics']
    gImgs[1].keywords = ['cute']
    gImgs[2].keywords = ['cute']
    gImgs[3].keywords = ['cute', 'funny']
    gImgs[4].keywords = ['cute', 'funny']
    gImgs[5].keywords = ['funny', 'stupid']
    gImgs[6].keywords = ['stupid', 'funny']
    gImgs[7].keywords = ['funny', 'explain']
    gImgs[8].keywords = ['cute', 'funny']
    gImgs[9].keywords = ['politics', 'funny']
    gImgs[10].keywords = ['fight', 'funny']
    gImgs[11].keywords = ['you']
    gImgs[12].keywords = ['happy']
    gImgs[13].keywords = ['mad', 'serious']
    gImgs[14].keywords = ['explain']
    gImgs[15].keywords = ['funny']
    gImgs[16].keywords = ['explain', 'serious', 'politics']
    gImgs[17].keywords = ['funny', 'explain']

}

function getImgs() {
    return gImgs;
}