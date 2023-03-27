'use strict'
const panels = document.getElementById('panels');
const panelList = [...document.querySelectorAll('.panel')];
const panelSqrt = Math.sqrt(panelList.length);

let bombPosition = new Array(panelSqrt);


console.log(panels);
console.log(panelList);
console.log(panelList.length);
console.log(bombPosition);

panelList.forEach(li => {
  li.addEventListener('click', e => {
    const index = panelList.findIndex(num => num === e.target);
    // console.log(index);
  })
});
