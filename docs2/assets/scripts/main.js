var wrapper = document.querySelector('.wrapper'),
    container = document.querySelector('.container'),
    btn = document.querySelector('#btn'),
    pull = document.querySelector('#pull'),
    numbers = document.querySelector('.numbers'),
    input = document.querySelector('#amount'),
    form = document.querySelector('#form'),
    bg = document.querySelector('.bg'),
    bgLeft = document.querySelector('.bg__left'),
    bgRight = document.querySelector('.bg__right');

// Функция сreateTable возвращает таблицу с заданным числом столбцов и строк.
// cols - Количество столбцов.
// rows - Количество строк

createTable = function (cols, rows) {
  var block = document.createElement('div'),
      x, y, cell;
  block.className = 'table';
  block.style.width = rows * 100 + 'px';

  for (x = 0; x < cols; x++) {
    for (y = 0; y < rows; y++) {
      cell = document.createElement('div');
      cell.className = 'block cell-' + y + ' row-' + x;
      cell.innerHTML = '<span class="text">' + (Math.floor(Math.random() * (1000 - 100)) + 100) + '</span>';

      if(!((x + y) % 2)) {
        cell.classList.add('block--black');
      }

      block.appendChild(cell);
    }
  }

  return block;
}

// Функция circus заполняет ячейки числами по спирали из центра против часовой стрелки.
// size - количество витков спирали.
// startNum с какого числа начать.

function circus(size) {
  var direct = 0, /* направление движения (изначально вверх) */
      rowcols = size * 2 - 1, /* длина стороны таблицы */
      limit = Math.pow(rowcols, 2), /* нужное количество чисел для заполнения таблицы */
      table = createTable(rowcols, rowcols),
      nowCell = [(rowcols - 1) / 2 , (rowcols - 1) / 2], /* середина таблицы */
      nowNum = 0, addNum = 0;

  rotate = -1;

  container.appendChild(table);

  while ( nowNum < limit ) {

    if (direct > 3) direct = 0;
    if (direct < 0) direct = 3;

    var curentItem = document.querySelector('.row-' + nowCell[0] + '.cell-' + nowCell[1]);
    curentItem.setAttribute('id', nowNum);
    if  (direct === 0 || direct === 2) { // движение по вертикали
      addNum = direct === 0 ? rotate : -rotate;

      if ( !(document.querySelector('.row-' + nowCell[0] + '.cell-' + (nowCell[1] + addNum))).getAttribute('id')) {
        nowCell[1] += addNum;
        direct += rotate;
      } else {
        nowCell[0] -= addNum * rotate;
      }
      
    } else { // движение по горизонтали
      addNum = direct === 1 ? rotate : -rotate;

      if ( !(document.querySelector('.row-' + (nowCell[0] + addNum) + '.cell-' + nowCell[1])).getAttribute('id')) {
        nowCell[0] += addNum;
        direct += rotate;
      } else {
        nowCell[1] += addNum * rotate;
      }

    }

    nowNum++;
  }

  return table;
}

btn.addEventListener('click', function(e) {
  e.preventDefault();

  if(input.value) {
    form.style.top = '-100px';
    bgRight.style.left = '100%';
    bgLeft.style.right = '100%';

    setTimeout(function() {
      bg.style.display = 'none';
    }, 1000)
    const table = circus(input.value);
  }
})

pull.addEventListener('click', function(e) {
  e.preventDefault();

  const block = document.querySelectorAll('.block');
  let counter = 0;

  if(block.length) {
    pull.style.display = 'none';

    function each() {
      num = document.createElement('span');
      num.className = 'num';

      num.innerHTML = document.getElementById(counter).children[0].innerHTML;

      numbers.appendChild(num);

      counter++;

      if(counter == block.length) {
        return;
      }

      setTimeout(each, 300);
    };

    each();
  }
})
