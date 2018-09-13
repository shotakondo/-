/////////////////////////////////////////////////////////////// 
///////////////////////////////////////////////////////////////
/////////////////////////////////////
// アクセスカウンターの表示ルーチン
/////////////////////////////////////
function drawcounter0() {
  var counterval,divval,dat,offset,xpos;

  var canvas = document.getElementById('counterfield');
  if (!canvas || !canvas.getContext) {
    return;
  }
  ctxcounter = canvas.getContext('2d');
  counterval = accesscounter;
  divval = 10000;
  dat = new Array(5);
  for (var i= 0; i < 5; i++) {
    dat[i] = Math.floor(counterval/divval);
    counterval -= dat[i]*divval;
    divval /= 10;
  }
  ctxcounter.font = MyAccessCounterFont;
  str = String(dat[0])+String(dat[1])+String(dat[2])+String(dat[3])+String(dat[4]);
  xpos = 0;
  for (var i= 0; i < 5; i++) {
    tm = ctxcounter.measureText(dat[i]);
    ctxcounter.fillStyle = "rgb(0,0,0)";
    ctxcounter.fillRect(xpos, 0, tm.width+4,16+2);
    ctxcounter.fillStyle = "rgb(255, 255, 255)";
    ctxcounter.fillText(dat[i],xpos+2,16-1);
    xpos += tm.width+6;
  }
}
function geturl(name) {
  src = "http://t-ishii.la.coocan.jp/hp/cgi/counter.cgi";
  src += "?"+name;
  ref = document.referrer;
  str = "";
  for (var i = 0; i < ref.length; i++) {
    ch = ref.charAt(i);
    if (ch == "?") {
      str += "Xq";
    } else if (ch == "+") {
      str += "Xp";
    } else if (ch == "=") {
      str += "Xe";
    } else {
      str += ch;
    }
  }
  return src + "+" + str;
}
function drawcounter(name){
  var src = geturl(name);
  var sc = document.createElement('script');
  sc.type = 'text/javascript';
  if (window.ActiveXObject) {
    // IEの場合
    sc.onreadystatechange = function() {
      if (sc.readyState == 'complete') {
        drawcounter0(sc.readyState);
      }
      if (sc.readyState == 'loaded') {
        drawcounter0(sc.readyState);
      }
    };
  } else {
    // IE以外の場合
    sc.onload = function() {
      drawcounter0('onload');
    };
  }
  sc.src = src;
  document.getElementsByTagName("head")[0].appendChild(sc);
}

//////////////////////////
// 大域変数
//////////////////////////
var width,height;
var canvas;
var ctx;
var phase;
var timerID;
var ball;
var racket;
var blocks;
var screenwidth,screenheight;
var blocknumx,blocknumy;
var blockwidth,blockheight;
var baseposx,baseposy;
var gameno,highscore,resethighscore,score,ball;
var maxstage,stage;
var hitpoint,score,highscore;
var mousex,mousey;
var difficulty,soundon;
var backimg;
var saveimg;
var playobj_blockhit;
var phase_demo = 0;
var phase_gamestart = 1;
var phase_playstart = 2;
var phase_play = 3;
var phase_pause = 4;
var phase_stageclear = 5;
var phase_playend = 6;
var phase_gameend = 7;
var field_else = 0;
var field_play = 1;
var field_highscore = 2;
var field_difficulty = 3;
var field_stage = 4;
var field_sound = 5;
var blocklife = [1,1,1,1,2,1,1,3,1,1,1];
//変更箇所１
var stageblock = [
                   /* Stage 1 */
                   [
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,5,5,5,5,5,5,0,0,0,0,
                    0,0,0,0,5,5,5,5,5,5,5,5,0,0,0,
                    0,0,3,0,5,2,2,2,2,2,2,5,0,3,0,
                    0,0,3,0,2,2,2,2,2,2,2,2,0,3,0,
                    0,0,3,3,2,3,5,3,3,5,3,2,3,3,0,
                    0,0,3,3,2,3,2,3,3,2,3,2,3,3,0,
                    0,0,0,3,3,3,3,3,3,3,3,3,3,2,0,
                    0,0,0,0,5,3,3,2,2,3,3,5,2,2,0,
                    0,0,2,2,2,2,2,3,3,3,5,5,5,3,0,
                    0,2,2,3,2,2,2,2,5,5,5,5,5,3,0,
                    0,2,3,3,3,2,2,3,2,2,5,5,2,0,0,
                    0,2,2,3,2,2,2,3,5,2,2,2,5,0,0,
                    0,2,2,3,2,2,2,3,2,2,5,5,5,0,0,
                    0,2,2,2,2,2,2,3,5,5,5,2,0,0,0,
                    0,0,3,3,3,3,3,0,0,2,2,2,0,0,0,
                    0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
                    ],
                   /* Stage 2 */
                   [
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,7,7,7,7,7,0,0,0,0,0,
                    0,0,0,7,7,8,6,6,6,8,7,7,0,0,0,
                    0,0,7,8,6,6,6,6,6,6,6,8,7,0,0,
                    0,7,8,6,6,6,6,6,6,6,6,6,7,0,0,
                    0,7,6,6,6,6,6,6,6,6,6,6,8,7,0,
                    7,6,6,6,6,6,6,6,7,6,7,6,8,7,0,
                    8,6,6,6,6,6,6,6,7,6,7,6,6,6,7,
                    6,6,6,6,6,6,6,6,7,6,7,6,6,6,7,
                    6,6,6,6,6,8,8,6,6,6,6,8,8,6,7,
                    8,6,6,8,6,6,6,6,6,6,6,6,8,6,7,
                    7,8,6,7,6,6,6,6,6,7,6,6,7,8,7,
                    0,7,7,8,6,6,6,6,6,6,6,8,7,7,0,
                    0,0,7,7,8,8,6,6,6,6,8,7,7,0,0,
                    0,7,8,8,7,7,7,7,7,7,7,8,8,7,0,
                    7,8,8,8,8,8,7,7,7,7,8,8,8,8,7,
                    0,7,7,7,7,7,0,0,0,0,7,7,7,7,0
                   ],
                    /* Stage 3 */
                   [
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,
                    0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,
                    0,0,0,2,2,2,3,3,2,3,0,0,0,0,0,
                    0,0,2,3,2,3,3,3,2,3,3,3,0,0,0,
                    0,0,2,3,2,2,3,3,3,2,3,3,3,0,0,
                    0,0,2,2,3,3,3,3,2,2,2,2,0,0,0,
                    0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,
                    0,0,0,2,2,1,2,2,2,0,0,0,0,0,0,
                    0,0,2,2,2,1,2,2,1,2,2,2,0,0,0,
                    0,2,2,2,2,1,1,1,1,2,2,2,2,0,0,
                    0,3,3,2,1,3,1,1,3,1,2,3,3,0,0,
                    0,3,3,3,1,1,1,1,1,1,3,3,3,0,0,
                    0,3,3,1,1,1,1,1,1,1,1,2,2,0,0,
                    0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,
                    0,0,2,2,2,0,0,0,0,2,2,2,0,0,0,
                    0,2,2,2,2,0,0,0,0,2,2,2,2,0,0
                   ],
                   /* Stage 4 */
                   [
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,
                    0,0,0,0,0,0,7,9,7,0,0,0,0,0,0,
                    0,0,0,0,0,0,7,9,7,0,0,0,0,0,0,
                    0,0,0,0,0,0,7,9,7,0,0,0,0,0,0,
                    0,0,0,0,0,7,9,9,9,7,0,0,0,0,0,
                    0,0,0,7,7,4,9,9,9,9,7,7,0,0,0,
                    0,0,7,4,4,4,9,9,9,9,9,9,7,0,0,
                    0,7,9,4,9,9,9,9,9,9,9,9,9,7,0,
                    7,9,9,9,9,4,9,9,9,4,9,9,9,9,7,
                    7,9,9,9,4,7,4,9,4,7,4,9,9,9,7,
                    7,9,9,9,9,4,9,9,9,4,9,9,9,9,7,
                    7,9,9,9,1,9,9,9,9,9,1,9,9,9,7,
                    0,7,9,9,9,1,1,1,1,1,9,9,9,7,0,
                    0,0,7,7,9,9,9,9,9,9,9,7,7,0,0,
                    0,0,0,0,7,7,7,7,7,7,7,0,0,0,0,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
                   ],
                   /* Stage 5 */
                   [
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                    0,0,0,0,0,7,7,7,7,7,7,0,0,0,0,
                    0,0,0,0,7,10,10,10,10,10,10,7,0,0,0,
                    0,7,7,7,10,10,10,10,7,7,10,10,7,0,0,
                    7,10,10,10,10,10,10,10,4,7,7,10,7,0,0,
                    7,10,10,10,10,10,10,10,7,7,7,10,7,0,0,
                    7,10,10,10,10,7,7,10,10,10,10,10,7,0,0,
                    0,7,7,7,7,10,10,10,10,10,10,10,7,0,0,
                    0,7,10,10,10,10,10,7,7,10,10,7,0,0,0,
                    0,0,7,7,7,7,7,10,7,7,10,7,0,0,0,
                    0,7,10,10,7,10,10,7,10,10,10,10,7,0,0,
                    0,7,7,7,7,10,10,7,7,7,7,10,7,0,0,
                    0,0,0,0,7,7,10,10,10,10,7,10,10,7,0,
                    0,0,7,7,10,10,7,7,7,7,10,10,10,7,0,
                    0,7,4,7,10,10,7,0,7,4,7,4,7,4,7,
                    0,7,7,7,7,7,7,0,7,7,7,7,7,7,7,
                    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
                   ]
                  ];


//////////////////////////
// 初期化
//////////////////////////
onload = function() {
  // アクセスカウンターの表示
  drawcounter("block");
  // 画面表示用コンテキストの取得
  canvas = document.getElementById('gamefield');
  if (!canvas || !canvas.getContext) {
    alert("本ページの閲覧はHTML5対応ブラウザで行ってください");
    return false;
  }
  ctx = canvas.getContext('2d');
  // 大域変数の初期化
  width = 640;
  height = 480;
  blocknumx = 15;
  blocknumy = 17;
  blockwidth = 28;
  blockheight = 20;
  baseposx = 8;
  baseposy = 8;
  //変更箇所２
  maxstage = 5;
  mousex = -1;
  mousey = -1;
  soundon = 1;
  difficulty = 2;  // Normal
  screenwidth = blockwidth*blocknumx;
  screenheight = 460;
  playobj_blockhit = new BlockHitAudio();
  // ハイスコアの読み込み
  highscore = localStorage.getItem('TiBlock_HighScore');
  if (highscore == null) {
    highscore = 0;
    localStorage.setItem("TiBlock_HighScore","0");
  } else {
    highscore = parseInt(highscore);
  }
  // ボールとラケットの作成
  ball = new ball();
  racket = new racket();
  racket.y = 440;
  // 初期化
  counter = 0;
  phase = phase_demo;
  stage = 0;
  score = 0;
  hitpoint = 1;
  ballnum = 5;
  initScreen(1);
  // キーボードイベント関数の設定
  canvas.addEventListener('click',clickfunc,true);
  canvas.addEventListener('mousemove',mousemovefunc,true);
  // タイマーイベント関数の設定
  timerID = setInterval('timerfunc()',33);
}

///////////////////////////////
// 初期画面の描画
///////////////////////////////
function initScreen(newscreen)
{
  // 画面消去
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, baseposx+screenwidth, height);
  // 背景表示
  //変更箇所３
  var grad  = ctx.createLinearGradient(baseposx,baseposy,baseposx,screenheight);
  //grad.addColorStop(0.0,'rgb(0,0,32)');
  //grad.addColorStop(1.0,'rgb(0,0,32)');
  grad.addColorStop(0.0,'rgb(32,32,100)');
  ctx.fillStyle = grad;
  ctx.rect(baseposx,baseposy,screenwidth,screenheight);
  ctx.fill();
  // 背景データの記憶
  backimg = ctx.getImageData(baseposx,baseposy,screenwidth,screenheight);
　// ブロックの初期化
  blocks = new Array(blocknumx*blocknumy);
  for (var y = 0; y < blocknumy; y++) {
    for (var x = 0; x < blocknumx; x++) {
      blocks[x+y*blocknumx] = new block(x,y,stageblock[stage][x+y*blocknumx]);
    }
  }
  // ラケットの初期化
  if (phase == phase_demo) {
    racket.initimg(0,128,0,128,128,128);
  } else {
    racket.initimg(0,255,0,255,255,255);
  }
  // ボールの初期化
  if (phase == phase_demo) {
    ball.initimg(128,128,128);
  } else {
    ball.initimg(255,255,255);
  }
  // ブロックの表示
  for (var x = 0; x < blocknumx; x++) {
    for (var y = 0; y < blocknumy; y++) {
      if (!newscreen && blocks[x+y*blocknumx].valid == 0) {
        continue;
      }
      blocks[x+y*blocknumx].initimg();
      blocks[x+y*blocknumx].draw();
    }
  }
}

///////////////////////////////
// 画面フィールドの判定
///////////////////////////////
function getfield(x,y) {
  if (x >= (width-180) && x < (width-180+100)) {
    if (y > 50 && y < 80) {
      return field_highscore;
    }
    if (y > 280 && y < 310) {
      return field_stage;
    }
    if (y > 350 && y < 380) {
      return field_difficulty;
    }
    if (y > 420 && y < 450) {
      return field_sound;
    }
  }
  if (x >= baseposx && x < (baseposx+screenwidth) && y >= baseposy && y < (baseposx+screenheight)) {
    return field_play;
  }
  return field_else;
}
////////////////////////////
// マウスカーソルの変更
////////////////////////////
function chgcursor(x,y) {
  if (phase == phase_demo || phase == phase_pause) {
    canvas.style.cursor = "default";
    return;
  }
  field = getfield(x,y);
  switch (field) {
  case field_else:
    canvas.style.cursor = "default";
    break;
  case field_play:
    canvas.style.cursor = "url(transparent.cur),crosshair";
    break;
  case field_highscore:
  case field_difficulty:
  case field_stage:
  case field_sound:
    canvas.style.cursor = "pointer";
    break;
  }
}
///////////////////////////////
// マウスクリック処理
///////////////////////////////
function cmd_highscore() {
  if (resethighscore) {
   resethighscore = 0;
  } else {
   resethighscore = 1;
  }
}
function cmd_difficulty() {
  difficulty += 1;
  if (difficulty == 4) {
    difficulty = 1;
  }
}
function cmd_stage() {
  stage += 1;
  if (stage == maxstage) {
    stage = 0;
  }
  initScreen(1);
}
function cmd_sound() {
  if (soundon) {
    soundon = 0;
  } else {
    soundon = 1;
  }
}
///////////////////////////////
// ブロッククラス
///////////////////////////////
function block(x,y,type) {
  this.x = x*blockwidth;
  this.y = y*blockheight;
  this.img = ctx.getImageData(0,0,blockwidth-2*2,blockheight-2*2);
  this.backimg;
  this.type = type;
  this.valid = 0;
  this.life = blocklife[type];

  this.initimg = function() {
    var basepos;
    //変更箇所４
    var drawcolor = [[64,64,64],[225,34,34],[123,72,21],[213,161,106],[255,255,255],[0,255,0],[255,192,203],[0,0,0],[255,105,180],[30,144,255],[255,213,0]];
    var r,g,b;

    if (this.type == 0) {
      this.valid = 0;
      return;
    }
    if (phase == phase_demo) {
      r = drawcolor[this.type][0]-64;
      g = drawcolor[this.type][1]-64;
      b = drawcolor[this.type][2]-64;
    } else {
      r = drawcolor[this.type][0];
      g = drawcolor[this.type][1];
      b = drawcolor[this.type][2];
    }
    // 消去時用に背景画像を記憶
    this.backimg = ctx.getImageData(baseposx+this.x,baseposy+this.y,blockwidth,blockheight);
    // イメージデータの作成
    for (var x = 0; x < blockwidth-2*2; x++) {
      for (var y = 0; y < blockheight-2*2; y++) {
        basepos = (x+y*(blockwidth-2*2))*4;
        color = r;
        //変更箇所５
        if (color < 0) {
          color = 0;
        }
        this.img.data[basepos+0] = color;
        color = g;
        if (color < 0) {
          color = 0;
        }
        this.img.data[basepos+1] = color;
        color = b;
        if (color < 0) {
          color = 0;
        }
        this.img.data[basepos+2] = color;
        this.img.data[basepos+3] = 255;
      }
    }
    this.valid = 1;
  }
  this.clear = function() {
    ctx.putImageData(this.backimg,baseposx+this.x+2,baseposy+this.y+2);
    this.valid = 0;
  }
  this.draw = function() {
    if (this.valid == 0) {
      return;
    }
    ctx.putImageData(this.img,baseposx+this.x+2,baseposy+this.y+2);
  }
}
///////////////////////////////
// ラケットクラス
///////////////////////////////
function racket() {
  var basepos,backratio,imgratio;
  this.x = 0;
  this.y = 0;
  this.height = 8;
  this.lastx = 0;
  this.width = 64;
  this.img = ctx.getImageData(0,0,this.width,this.height);
  this.backimg = ctx.getImageData(baseposx+this.x,baseposy+this.y,this.width,this.height);
  this.initimg = function(r1,g1,b1,r2,g2,b2) {
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        basepos = (x+y*this.width)*4;
        if (x <= 2 || x >= (this.width-3)) {
          this.img.data[basepos+0] = r1;
          this.img.data[basepos+1] = g1;
          this.img.data[basepos+2] = b1;
          this.img.data[basepos+3] = 255;
        } else {
          this.img.data[basepos+0] = r2;
          this.img.data[basepos+1] = g2;
          this.img.data[basepos+2] = b2;
          this.img.data[basepos+3] = 255;
        }
      }
    }
    this.lastx = -1000;
  }
  this.draw = function(force) {
    if (force == 0 && this.x == this.lastx) {
      return;
    }
    if (this.lastx != -1000) {
      for (var y1 = 0; y1 < this.height; y1++) {
        for (var x1 = 0; x1 < this.width; x1++) {
          for (var color = 0; color < 3; color++) {
            this.backimg.data[(x1+y1*this.width)*4+color] = backimg.data[((this.lastx+x1)+(this.y+y1)*screenwidth)*4+color];
          }
          this.backimg.data[(x1+y1*this.width)*4+3] = 255;
        }
      }
      ctx.putImageData(this.backimg,baseposx+this.lastx,baseposy+this.y);
    }
    ctx.putImageData(this.img,baseposx+this.x,baseposy+this.y);
    this.lastx = this.x;
  }
}
///////////////////////////////
// ボールクラス
///////////////////////////////
function ball() {
  var balldat = [
                   000,000,000,000,000,064,200,255,
                   000,000,000,000,200,255,255,255,
                   000,000,128,200,255,255,255,255,
                   000,000,200,255,255,255,255,255,
                   000,200,255,255,255,255,255,255,
                   128,200,255,255,255,255,255,255,
                   200,255,255,255,255,255,255,255,
                   255,255,255,255,255,255,255,255
                ];
  var datposx,datposy;

  this.img = ctx.getImageData(0,0,16,16);
  this.drawimg = ctx.getImageData(0,0,16,16);
  this.width = 16;
  this.height = 16;
  this.x = 0;
  this.y = 0;
  this.speedx = 0;
  this.speedy = 0;
  this.lastx = -1000;
  this.lasty = -1000;
  this.initimg = function(r,g,b) {
    for (var y = 0; y < 16; y++) {
      for (var x = 0; x < 16; x++) {
        if (x >= 8) {
          datposx = 7-(x-8);
        } else {
          datposx = x;
        }
        if (y >= 8) {
          datposy = 7-(y-8);
        } else {
          datposy = y;
        }
        this.img.data[(x+y*16)*4+0] = r;
        this.img.data[(x+y*16)*4+1] = g;
        this.img.data[(x+y*16)*4+2] = b;
        this.img.data[(x+y*16)*4+3] = balldat[datposx+datposy*8];
      }
    }
    this.lastx = -1000;
  }
  this.update = function() {
    this.x += this.speedx;
    this.y += this.speedy;
    if (this.x <= 0 && this.speedx < 0) {
      this.speedx *= -1;
    }
    if (this.x >= (screenwidth-this.width) && this.speedx > 0) {
      this.speedx *= -1;
    }
    if (this.y <= 0 && this.speedy < 0) {
      this.speedy *= -1;
    }
    if (this.y >= screenheight && this.speedy > 0) {
      this.speedy *= -1;
    }
  }
  this.clear = function() {
    if (this.lastx == -1000) {
      return;
    }
    for (var y = 0; y < 16; y++) {
      for (var x = 0; x < 16; x++) {
        basepos = ((x+this.lastx)+(y+this.lasty)*screenwidth)*4;
        basepos1 = (x+y*this.width)*4;
        this.drawimg.data[basepos1+0] = backimg.data[basepos+0];
        this.drawimg.data[basepos1+1] = backimg.data[basepos+1];
        this.drawimg.data[basepos1+2] = backimg.data[basepos+2];
        this.drawimg.data[basepos1+3] = 255;
      }
    }
    ctx.putImageData(this.drawimg,baseposx+this.lastx,baseposy+this.lasty);
    this.lastx = -1000;
  }
  this.draw = function() {
    var backratio,imgratio;

    if (this.lastx != -1000) {
      for (var y = 0; y < 16; y++) {
        for (var x = 0; x < 16; x++) {
          basepos = ((x+this.lastx)+(y+this.lasty)*screenwidth)*4;
          basepos1 = (x+y*this.width)*4;
          this.drawimg.data[basepos1+0] = backimg.data[basepos+0];
          this.drawimg.data[basepos1+1] = backimg.data[basepos+1];
          this.drawimg.data[basepos1+2] = backimg.data[basepos+2];
          this.drawimg.data[basepos1+3] = 255;
        }
      }
      ctx.putImageData(this.drawimg,baseposx+this.lastx,baseposy+this.lasty);
    }
    if (this.x < 0 || this.y < 0 || this.x >= (screenwidth-16) || this.y >= (screenheight-16)) {
      return;
    }
    this.lastx = this.x;
    this.lasty = this.y;
    for (var y = 0; y < 16; y++) {
      for (var x = 0; x < 16; x++) {
        basepos = (x+y*this.width)*4;
        imgratio = this.img.data[basepos+3]/255;
        backratio = 1-imgratio;
        this.drawimg.data[basepos+0] = Math.floor(backimg.data[((this.x+x)+(this.y+y)*screenwidth)*4+0]*backratio+this.img.data[basepos+0]*imgratio);
        this.drawimg.data[basepos+1] = Math.floor(backimg.data[((this.x+x)+(this.y+y)*screenwidth)*4+1]*backratio+this.img.data[basepos+1]*imgratio);
        this.drawimg.data[basepos+2] = Math.floor(backimg.data[((this.x+x)+(this.y+y)*screenwidth)*4+2]*backratio+this.img.data[basepos+2]*imgratio);
        this.drawimg.data[basepos+3] = 255;
      }
    }
    ctx.putImageData(this.drawimg,baseposx+this.x,baseposy+this.y);
  }
}
///////////////////////////////
// 音声出力
///////////////////////////////
function playAudio(name,volume) {
   if (soundon) {
     try {
       document.getElementById(name).currentTime = 0;
       document.getElementById(name).volume = volume;
       document.getElementById(name).play();
     } catch (e) {
       // for IE9
       document.getElementById(name).volume = volume;
       document.getElementById(name).play();
     }
   }
}
function BlockHitAudio() {
  this.curno = 0;
  this.aud = new Array(4);

  this.aud[0] = document.getElementById("audio_wallhit1");
  this.aud[1] = document.getElementById("audio_wallhit2");
  this.aud[2] = document.getElementById("audio_wallhit3");
  this.aud[3] = document.getElementById("audio_wallhit4");

  this.play = function() {
    if (soundon == 0) {
      return;
    }
    try {
      this.aud[this.curno].currentTime = 0;
      this.aud[this.curno].volume = 1.0;
      this.aud[this.curno].play();
    } catch (e) {
      // for IE9
      this.aud[this.curno].volume = 1.0;
      this.aud[this.curno].play();
    }
    this.curno += 1;
    if (this.curno == 4) {
      this.curno = 0;
    }
  }
}

////////////////////////////////
// 位置更新と各種チェック
////////////////////////////////
function update() {
  var balldraw = 1;

  // ボール位置を更新
  ball.update();
  // ブロックとボールのヒットチェック
  hit = 0;
  horizontal = 0;
  if (ball.speedy < 0) {
    if (ball.speedx >= 0) {
      // 斜め右上へのボール移動時
      for (var i = 0; i < blocknumx*blocknumy; i++) {
        if (blocks[i].valid == 0) {
          continue;
        }
        if (((blocks[i].y+blockheight) > ball.y) && (blocks[i].y < (ball.y+ball.height))) {
          if (blocks[i].x < (ball.x+ball.width) && (blocks[i].x+blockwidth) > ball.x) {
            if ((ball.lastx+ball.width) <= blocks[i].x) {
              horizontal = 1;
            }
            blocks[i].life -= 1;
            if (blocks[i].life == 0) {
              blocks[i].clear();
              if(Math.floor( Math.random() * 1 ) == 0){
                ballnum++;
              } 
            } else {
              balldraw = 0;
            }
            hit = 1;
            score += hitpoint;
            hitpoint += 1;
          }
        }
      }
    } else {
      // 斜め左上へのボール移動時
      for (var i = 0; i < blocknumx*blocknumy; i++) {
        if (blocks[i].valid == 0) {
          continue;
        }
        if (((blocks[i].y+blockheight) > ball.y) && (blocks[i].y < (ball.y+ball.height))) {
          if (blocks[i].x < (ball.x+ball.width) && (blocks[i].x+blockwidth) > ball.x) {
            if (ball.lastx >= (blocks[i].x+blockwidth)) {
              horizontal = 1;
            }
            blocks[i].life -= 1;
            if (blocks[i].life == 0) {
              blocks[i].clear();
              if(Math.floor( Math.random() * 1 ) == 0){
                ballnum++;
              } 
            } else {
              balldraw = 0;
            }
            hit = 1;
            score += hitpoint;
            hitpoint += 1;
          }
        }
      }
    }
  } else {
    if (ball.speedx >= 0) {
      // 斜め右下へのボール移動時
      for (var i = 0; i < blocknumx*blocknumy; i++) {
        if (blocks[i].valid == 0) {
          continue;
        }
        if (blocks[i].y < (ball.y+ball.height) && (blocks[i].y+blockheight) > ball.y) {
          if (blocks[i].x < (ball.x+ball.width) && (blocks[i].x+blockwidth) > ball.x) {
            if ((ball.lastx+ball.width) <= blocks[i].x) {
              horizontal = 1;1
            }
            blocks[i].life -= 1;
            if (blocks[i].life == 0) {
              blocks[i].clear();
              if(Math.floor( Math.random() * 1 ) == 0){
                ballnum++;
              } 
            } else {
              balldraw = 0;
            }
            hit = 1;
            score += hitpoint;
            hitpoint += 1;
          }
        }
      }
    } else {
      // 斜め左下へのボール移動時
      for (var i = 0; i < blocknumx*blocknumy; i++) {
        if (blocks[i].valid == 0) {
          continue;
        }
        if (blocks[i].y < (ball.y+ball.height) && (blocks[i].y+blockheight) > ball.y) {
          if (blocks[i].x < (ball.x+ball.width) && (blocks[i].x+blockwidth) > ball.x) {
            if (ball.lastx >= (blocks[i].x+blockwidth)) {
              horizontal = 1;
            }
            blocks[i].life -= 1;
            if (blocks[i].life == 0) {
              blocks[i].clear();
              if(Math.floor( Math.random() * 1 ) == 0){
                ballnum++;
              } 
            } else {
              balldraw = 0;
            }
            hit = 1;
            score += hitpoint;
            hitpoint += 1;
          }
        }
      }
    }
  }
  if (hit) {
    playobj_blockhit.play();
    for (var i = 0; i < blocknumx*blocknumy; i++) {
      if (blocks[i].valid) {
        break;
      }
    }
    if (i == blocknumx*blocknumy) {
      // Stage Clear
      counter = 0;
      phase = phase_stageclear;
    } else {
      // Hit
      if (horizontal) {
        ball.speedx *= -1;
      } else {
        ball.speedy *= -1;
      }
    }
  }
  // ラケットとのヒットチェック
  if ((ball.y+ball.height) >= racket.y) {
    if ((ball.y+ball.height) < (racket.y+racket.height)) {
      // パッドにヒット？
      var hitpos = (ball.x+ball.width/2)-racket.x;
      if (hitpos >= 0 && hitpos < racket.width) {
        if (hitpos < racket.width*1/10) {
          ball.speedx = -10;
        } else if (hitpos < racket.width*2/10) {
          ball.speedx = -8;
        } else if (hitpos < racket.width*3/10) {
          ball.speedx = -6;
        } else if (hitpos < racket.width*4/10) {
          ball.speedx = -4;
        } else if (hitpos < racket.width*5/10) {
          ball.speedx = -2;
        } else if (hitpos < racket.width*6/10) {
          ball.speedx = 2;
        } else if (hitpos < racket.width*7/10) {
          ball.speedx = 4;
        } else if (hitpos < racket.width*8/10) {
          ball.speedx = 6;
        } else if (hitpos < racket.width*9/10) {
          ball.speedx = 8;
        } else {
          ball.speedx = 10;
        }
        switch (difficulty) {
        case 1:
          ball.speedx *= (8.0/12);
          break;
        case 2:
          break;
        case 3:
          ball.speedx *= (16.0/12);
          break;
        }
        ball.speedx = Math.floor(ball.speedx);
        ball.speedy *= -1;
        hitpoint = 1;
        playAudio("audio_stroke",1.0);
      }
    }
  }
  // 空振りチェック
  if ((ball.y+ball.height) >= screenheight) {
    counter = 0;
    phase = phase_playend;
    playAudio("audio_loss",1.0);
  }
  return balldraw;
}
/////////////////////////////////
// スコア表示部の表示
/////////////////////////////////
function drawscore() {
  // 表示色設定
  if (phase == phase_demo) {
    color0 = "rgb(128,128,128)";
    color1 = "rgb(128,128,128)";
    color2 = "rgb(128,128,128)";
  } else {
    color0 = "rgb(220,220,64)";
    color1 = "rgb(220,220,220)";
    if (phase == phase_gamestart) {
      color2 = "rgb(64,255,64)";
      color3 = "rgb(255,64,64)";
    } else {
      color2 = "rgb(200,200,200)";
      color3 = "rgb(200,200,200)";
    }
  }
  // 画面消去
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(baseposx+screenwidth, 0, (width-(baseposx+screenwidth)), height);
  ctx.fillStyle = "rgb(32,32,32)";
  ctx.fillRect(baseposx+screenwidth+10, 10, width-(baseposx+screenwidth)-10*2, height-baseposy*2);
  // スコア表示
  ctx.fillStyle = color0;
  ctx.font = "bold italic 24px 'Times New Roman'";
  ctx.fillText("High Score",width-180+10,40);
  if (getfield(mousex,mousey) == field_highscore) {
    ctx.fillStyle = color3;
  } else {
    ctx.fillStyle = color2;
  }
  if (resethighscore) {
    ctx.fillText(String(0),width-180+10,70);
  } else {
    ctx.fillText(String(highscore),width-180+10,70);
  }
  ctx.fillStyle = color0;
  ctx.fillText("Score",width-180+10,100);
  ctx.fillStyle = color1;
  ctx.fillText(String(score),width-180+10,130);
  ctx.fillStyle = color0;
  ctx.fillText("Ball",width-180+10,160);
   ctx.fillStyle = color1;
 ctx.fillText(String(ballnum),width-180+10,190);
  // セットアップフィールド
  ctx.fillText("== Setup ==",width-180+10,240);
  ctx.font = "bold italic 20px 'Times New Roman'";
  // ステージ設定
  ctx.fillStyle = color1;
  ctx.fillText("- Stage -",width-180+10,270);
  if (getfield(mousex,mousey) == field_stage) {
    ctx.fillStyle = color3;
  } else {
    ctx.fillStyle = color2;
  }
  str = "Stage-"+(stage+1);
  ctx.fillText(str,width-180+10,300);
  // 難易度設定
  ctx.fillStyle = color1;
  ctx.fillText("- Difficulty -",width-180+10,340);
  if (getfield(mousex,mousey) == field_difficulty) {
    ctx.fillStyle = color3;
  } else {
    ctx.fillStyle = color2;
  }
  switch (difficulty) {
  case 1:
    str = "Easy";
    break;
  case 2:
    str = "Normal";
    break;
  case 3:
    str = "Hard";
    break;
  }
  ctx.fillText(str,width-180+10,370);
  // サウンド設定
  ctx.fillStyle = color1;
  ctx.fillText("- Sound -",width-180+10,410);
  if (getfield(mousex,mousey) == field_sound) {
    ctx.fillStyle = color3;
  } else {
    ctx.fillStyle = color2;
  }
  if (soundon) {
    ctx.fillText("ON",width-180+10,440);
  } else {
    ctx.fillText("OFF",width-180+10,440);
  }
}
/////////////////////////////////
// タイトル画面の表示
/////////////////////////////////
function drawtitle(blink) {
  var str,tm;

  ctx.putImageData(saveimg,0,0);
  // タイトル表示
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.font = "italic bold 48px 'Times New Roman'";
  str = "ブロック崩し";
  tm = ctx.measureText(str);
  ctx.fillText(str,(width-tm.width)/2,100*height/240);
  ctx.font = "16px 'Times New Roman'";
  if (blink) {
    str = "Click Screen to Enter Game";
    tm = ctx.measureText(str);
    ctx.fillText(str,(width-tm.width)/2,140*height/240);
  }
  tm = ctx.measureText(str);
  ctx.fillText(str,(width-tm.width)/2,180*height/240);
}
////////////////////////////////
// タイマーイベント関数
////////////////////////////////
function timerfunc() {
  switch (phase) {
  case phase_demo:
    if (counter == 0) {
      gameno = 0;
      resethighscore = 0;
      racket.x = (screenwidth-racket.width)/2;
      racket.draw(1);
      ball.x = racket.x+racket.width/2-ball.width/2;
      ball.y = racket.y-ball.height;
      ball.draw();
      drawscore();
      saveimg = ctx.getImageData(0,0,width,height);
    }
    if ((counter % 40) == 0) {
      drawtitle(1);
    }
    if ((counter % 40) == 35) {
      drawtitle(0);
    }
    counter += 1;
    break;
  case phase_gamestart:
  case phase_playstart:
    if (counter == 0) {
      hitpoint = 1;
      resethighscore = 0;
    }
    if ((counter%4) == 0) {
      drawscore();
    }
    counter += 1;
    racket.draw(0);
    ball.x = racket.x+racket.width/2-ball.width/2;
    ball.y = racket.y-ball.height;
    ball.draw();
    break;
  case phase_play:
    if (gameno == 0 && counter == 0) {
      if (resethighscore) {
        localStorage.removeItem("TiBlock_HighScore");
        highscore = 0;
      }
      gameno += 1;
    }
    counter += 1;
    // ブロックの表示
/*
//  Firefox4.0.1があまりにも遅いのでコメント化。
//  元々、ここでのdrawは必要なく、負荷テストの意味合いだった。
    for (var x = 0; x < blocknumx; x++) {
      for (var y = 0; y < blocknumy; y++) {
        blocks[x+y*blocknumx].draw();
      }
    }
*/
    if (update()) {
      ball.draw();
    }
    if ((counter%4) == 0) {
      drawscore();
    }
    racket.draw(0);
    break;
  case phase_pause:
    if ((counter % 40) == 0) {
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.font = "bold 32px 'Times New Roman'";
      str = "Pause";
      tm = ctx.measureText(str);
      ctx.fillText(str,baseposx+(screenwidth-tm.width)/2,screenheight/2+16);
    }
    if ((counter % 40) == 35) {
      ctx.putImageData(saveimg,baseposx,baseposy);
    }
    if ((counter%4) == 0) {
      drawscore();
    }
    counter += 1;
    break;
  case phase_stageclear:
    if (counter == 0) {
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.font = "bold 24px 'Times New Roman'";
      str = "Stage Clear";
      tm = ctx.measureText(str);
      ctx.fillText(str,baseposx+(screenwidth-tm.width)/2,screenheight/2+16);
    }
    counter += 1;
    if (counter == 60) {
      stage += 1;
      if (stage == maxstage) {
        stage = 0;
      }
      ballnum += 1;
      initScreen(1);
      phase = phase_playstart;
    }
    break;
  case phase_playend:
    ball.clear();
    drawscore();
    if (counter == 0) {
      ballnum -= 1;
      if (ballnum == 0) {
        counter = 0;
        phase = phase_gameend;
        break;
      }
    }
    if (counter >= 30) {
      counter = 0;
      phase = phase_playstart;
      break;
    }
    counter += 1;
    racket.draw(1);
    break;
  case phase_gameend:
    if (counter == 0) {
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.font = "bold 32px 'Times New Roman'";
      str = "Game Over";
      tm = ctx.measureText(str);
      saveimg = ctx.getImageData(baseposx,baseposy,screenwidth,screenheight);
      ctx.fillText(str,baseposx+(screenwidth-tm.width)/2,screenheight/2+16);
      racket.draw(1);
      drawscore();
    }
    counter += 1;
    if (counter == 90) {
      if (score > highscore) {
        highscore = score;
        localStorage.setItem("TiBlock_HighScore",String(highscore));
      }
      ctx.putImageData(saveimg,baseposx,baseposy);
      counter = 0;
      phase = phase_demo;
      score = 0;
      ballnum = 5;
      initScreen(1);
      break;
    }
    break;
  }
}
/////////////////////////////
// マウスイベント
/////////////////////////////
function clickfunc(event) {
  var rect = event.target.getBoundingClientRect();
　var x = event.clientX - rect.left;
　var y = event.clientY - rect.top;

  field = getfield(x,y);
  if (phase == phase_demo) {
    counter = 0;
    phase = phase_gamestart;
    chgcursor(x,y);
    initScreen(1);
  } else if (phase == phase_playstart || phase == phase_gamestart) {
    switch (field) {
    case field_play:
      switch (difficulty) {
      case 1:
        ball.speedy = -8;
        if (Math.random() < 0.5) {
          ball.speedx = -4;
        } else {
          ball.speedx = 4;
        }
        break;
      case 2:
        ball.speedy = -12;
        if (Math.random() < 0.5) {
          ball.speedx = -6;
        } else {
          ball.speedx = 6;
        }
       break;
      case 3:
        ball.speedy = -16;
        if (Math.random() < 0.5) {
          ball.speedx = -8;
        } else {
          ball.speedx = 8;
        }
        break;
      }
      counter = 0;
      phase = phase_play;
      chgcursor(x,y);
      break;
    case field_highscore:
      if (phase == phase_gamestart) {
        cmd_highscore();
      }
      break;
    case field_stage:
      if (phase == phase_gamestart) {
        cmd_stage();
      }
      break;
    case field_difficulty:
      if (phase == phase_gamestart) {
        cmd_difficulty();
      }
      break;
    case field_sound:
      if (phase == phase_gamestart) {
        cmd_sound();
      }
      break;
    }
  } else if (phase == phase_play) {
    switch (field) {
    case field_play:
      saveimg = ctx.getImageData(baseposx,baseposy,screenwidth,screenheight);
      counter = 0;
      phase = phase_pause;
      chgcursor(x,y);
      break;
    }
  } else if (phase == phase_pause) {
    switch (field) {
    case field_play:
      ctx.putImageData(saveimg,baseposx,baseposy);
      counter = 0;
      phase = phase_play;
      chgcursor(x,y);
      break;
    }
  }
}

function mousemovefunc(event) {
  var rect = event.target.getBoundingClientRect();
　var x = (event.clientX - rect.left)-baseposx;
　var y = event.clientY - rect.top;

  // マウスカーソルの変更
  chgcursor(x,y);
  // ラケットの移動
  if (phase != phase_demo) {
    if (x >= racket.width/2 && x < (blockwidth*blocknumx-racket.width/2)) {
      racket.x = Math.floor(x-racket.width/2);
    }
  }
  // マウス位置を記憶しておく
  mousex = x;
  mousey = y;
}
