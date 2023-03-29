'use strict'
const mineCounter = document.getElementById('mine-count');
const panelCounter = document.getElementById('panel-count');
const timeCounter = document.getElementById('time-count');
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

function timeCount() {
  const t = new Date(Date.now() - startTime);
  const s = String(t.getSeconds()).padStart(3, "0");

  timeCounter.textContent = `TIME：${s}s`
  timeoutId = setTimeout(() => {
    timeCount()
  }, 1000);
}

function bombPositionSpecify(n) {
  return bombPosition[Math.floor(n / panelSqrt)][n % panelSqrt]
}

function setBomb(x) {
  for (let i = 0; i < x; i++) {
    let bombNum = Math.floor(Math.random() * panelList.length);
    console.log(`頭から${bombNum + 1}番目に爆弾`);
    if (bombPositionSpecify(bombNum) === 0) {
      bombPosition[Math.floor(bombNum / panelSqrt)][bombNum % panelSqrt] = +1;
    } else {
      i--;
    }
  }
}

function open(x, y) {
  if (bombPosition[x][y] === 1) {
    panelList[x * panelSqrt + y].classList.add('open');
    panelList[x * panelSqrt + y].classList.add('hit');
  } else {
    let bombCount = 0;
    for (let ix = x - 1; ix <= x + 1; ix++) {
      for (let iy = y - 1; iy <= y + 1; iy++) {
        // 現在の座標
        // console.log(`ixは${ix}:iyは${iy}`);
        if (ix >= 0 && iy >= 0 && ix < panelSqrt && iy < panelSqrt) {
          if (bombPosition[ix][iy] === 1) {
            console.log(`ix:${ix}のiy:${iy}に爆弾あり`);
            bombCount++;
          } else {
            // console.log(`ix:${ix}のiy:${iy}に爆弾なし`);
          }
        } else {
          // console.log('盤面外処理');
        }
      }
    }
    console.log('チェック完了');
    panelQuantity--;
    panelCounter.textContent = `PANEL：${panelQuantity}`;
    panelList[x * panelSqrt + y].classList.add('open');
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
              open(ix, iy);
            }
          }
        }
      }
    }
  }
}

function setBoard() {
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
              console.log(`ixは${ix}:iyは${iy}`);
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

      open(x, y);
      if(panelQuantity === 0) {
        console.log('クリア')
        clearTimeout(timeoutId);
      }
    })
  });
  console.log(bombPosition);
}

setBoard();

