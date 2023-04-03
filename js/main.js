'use strict'
const mineCounter = document.getElementById('mine-count');
const panelCounter = document.getElementById('panel-count');
const timeCounter = document.getElementById('time-count');
const restartButton = document.getElementById('restart-button');
const scoopButton = document.getElementById('scoop-button');
const flagButton = document.getElementById('flag-button');
let panels = document.getElementById('panels');
let panelList = [...document.querySelectorAll('.panel')];
let panelSqrt = Math.sqrt(panelList.length);
let bombPosition;
let startTime;
let timeoutId;
let mercifulSwitch = 1;
let firstCount = 0;
let mineQuantity = 10;
let panelQuantity = panelList.length - mineQuantity;

//タイマー起動
function timeCount() {
  const t = new Date(Date.now() - startTime);
  const s = String(t.getSeconds()).padStart(3, "0");

  timeCounter.textContent = `TIME：${s}s`
  timeoutId = setTimeout(() => {
    timeCount()
  }, 1000);
}

//リストのｎ番目を配列上の座標に変換する
function bombPositionSpecify(n) {
  return bombPosition[Math.floor(n / panelSqrt)][n % panelSqrt]
}

//地雷の配置
function setBomb(x) {
  for (let i = 0; i < x; i++) {
    let bombNum = Math.floor(Math.random() * panelList.length);
    // console.log(`頭から${bombNum + 1}番目に爆弾`);
    if (bombPositionSpecify(bombNum) === 0) {
      bombPosition[Math.floor(bombNum / panelSqrt)][bombNum % panelSqrt] = +1;
    } else {
      i--;
    }
  }
}

//パネルを開く
function open(x, y) {
  if (panelList[x * panelSqrt + y].classList.contains('open')) {
    console.log('このパネルはすでに開かれている');
  }
  else if (bombPosition[x][y] === 1) {
    panelList[x * panelSqrt + y].classList.add('open');
    panelList[x * panelSqrt + y].classList.add('hit');
    clearTimeout(timeoutId);
    panels.classList.add('gameover');
  } else {
    // console.log('周囲の地雷数カウント');
    let bombCount = 0;
    for (let ix = x - 1; ix <= x + 1; ix++) {
      for (let iy = y - 1; iy <= y + 1; iy++) {
        // 現在の座標
        // console.log(`ixは${ix}:iyは${iy}`);
        if (ix >= 0 && iy >= 0 && ix < panelSqrt && iy < panelSqrt) {
          if (bombPosition[ix][iy] === 1) {
            // console.log(`ix:${ix}のiy:${iy}に爆弾あり`);
            bombCount++;
          } else {
            // console.log(`ix:${ix}のiy:${iy}に爆弾なし`);
          }
        } else {
          // console.log('盤面外処理');
        }
      }
    }
    // console.log('チェック完了');
    panelQuantity--;
    panelCounter.textContent = `PANEL：${panelQuantity}`;
    panelList[x * panelSqrt + y].classList.add('open');
    // console.log(`残り：x${x}y${y}にopenを付与`);

    // console.log(`残り：${panelQuantity}`);

    //無事にすべてを開ききったのでクリア
    if(panelQuantity === 0) {
      clearTimeout(timeoutId);
      console.log('クリア')
      panels.classList.add('clear');
    }

    //連鎖して開く
    if(bombCount > 0){
      panelList[x * panelSqrt + y].textContent = bombCount;
    } else {
      panelList[x * panelSqrt + y].textContent = "";
    }
    if (bombCount === 0) {
      panelList[x * panelSqrt + y].textContent = '';
      for (let ix = x - 1; ix <= x + 1; ix++) {
        for (let iy = y - 1; iy <= y + 1; iy++) {
          if (ix >= 0 && iy >= 0 && ix < panelSqrt && iy < panelSqrt) {
            if (!panelList[ix * panelSqrt + iy].classList.contains('open')) {
              // console.log(`次はix:${ix}のiy:${iy}を開く`);
              open(ix, iy);
            } else {
              // console.log('このパネルはすでに開かれている');
            }
          }
        }
      }
    }
  }
}

//ボードの初期化
function resetBoard() {
  clearTimeout(timeoutId);
  firstCount = 0;
  panelQuantity = panelList.length - mineQuantity;

  mineCounter.textContent = `MINE：${mineQuantity}`;
  panelCounter.textContent = `PANEL：${panelQuantity}`;
  timeCounter.textContent = 'TIME：000s';

  
  flagButton.classList.remove('active');
  scoopButton.classList.add('active');
  panels.classList.remove('flag');
  panels.classList.remove('clear');
  panels.classList.remove('gameover');

  panelList.forEach((li)=> {
    console.log('hoge');
    li.textContent = "";
    li.classList.remove('open');
    li.classList.remove('hit');
    li.classList.remove('flag');
  });
}

//ボードのセッティング
function setBoard() {

  resetBoard();

  bombPosition = Array.from({ length: panelSqrt }, () => Array(panelSqrt).fill(0));

  panelList.forEach(li => {
    li.addEventListener('click', e => {
      const index = panelList.findIndex(num => num === e.target);
      // console.log(`頭から${index +1}番目をクリック`);
      let x = Math.floor(index / panelSqrt);
      let y = index % panelSqrt;

      //1手目のみの処理
      if(firstCount < 1){
        startTime = Date.now();
        timeCount();
        if(mercifulSwitch ===1){
          for (let ix = x - 1; ix <= x + 1; ix++) {
            for (let iy = y - 1; iy <= y + 1; iy++) {
              // console.log(`ixは${ix}:iyは${iy}`);
              if (ix >= 0 && iy >= 0 && ix < panelSqrt && iy < panelSqrt) {
                bombPosition[ix][iy] = -1;
              }
            }
          }
        }

        setBomb(mineQuantity);
        mineCounter.textContent = `MINE：${mineQuantity}`;
        panelCounter.textContent = `PANEL：${panelQuantity}`;
        firstCount++;
        console.log(bombPosition);
      }

      if (panels.classList.contains('flag')) {
        if (li.classList.contains('flag')) {
          li.classList.remove('flag');
        } else {
          li.classList.add('flag');
        }
      } else {
        if (!li.classList.contains('flag')) {
          open(x, y);
        }
      }
    })
  });
  console.log(bombPosition);
}

flagButton.addEventListener('click',() => {
  if (!panels.classList.contains('flag')) {
    panels.classList.add('flag');
    flagButton.classList.add('active');
    scoopButton.classList.remove('active');
  }
})

scoopButton.addEventListener('click',() => {
  if (panels.classList.contains('flag')) {
    panels.classList.remove('flag');
    flagButton.classList.remove('active');
    scoopButton.classList.add('active');
  }
})

restartButton.addEventListener('click', () => {
  setBoard();
  console.log('restart');
  console.log(`リセット時点での残りパネル:${panelQuantity}`);
});

setBoard();

