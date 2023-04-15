let moveCounter = 0,
  time = 0,
  startTime = !0
const intervalRefresh = setInterval(startTime, 1e3)
let countCells,
  gameType = '4',
  itemNodes,
  matrix,
  sizeCell,
  playGame = !1,
  playAudio = !0,
  resultArray = []
const header = document.createElement('header')
;(header.className = 'header'), document.body.append(header)
const h1 = document.createElement('h1')
;(header.className = 'header'), (h1.innerHTML = 'Puzzle Game')
const controlPanel = document.createElement('div')
;(controlPanel.className = 'control-panel'), header.append(h1, controlPanel)
const shuffleBtn = document.createElement('button')
shuffleBtn.innerHTML = 'new game'
const saveBtn = document.createElement('button')
saveBtn.innerHTML = 'Save'
const loadBtn = document.createElement('button')
loadBtn.innerHTML = 'Load'
const soundBtn = document.createElement('button')
soundBtn.innerHTML = 'mute🔊'
const resBtn = document.createElement('button')
;(resBtn.innerHTML = 'Result'),
  controlPanel.append(shuffleBtn, saveBtn, loadBtn, soundBtn, resBtn)
const mainSection = document.createElement('main')
;(mainSection.className = 'main'), header.after(mainSection)
const scoreWrapper = document.createElement('div')
;(scoreWrapper.className = 'score-wrapper'), mainSection.append(scoreWrapper)
const movesWrapper = document.createElement('span')
;(movesWrapper.className = 'moves'), (movesWrapper.innerHTML = 'Moves: 0')
const timeWrapper = document.createElement('span')
;(timeWrapper.className = 'time'),
  (timeWrapper.innerHTML = 'Time: 00:00'),
  scoreWrapper.append(timeWrapper, movesWrapper)
const page = document.createElement('div')
;(page.className = 'page'), mainSection.append(page)
const wrapperNodeDiv = document.createElement('div')
;(wrapperNodeDiv.className = 'fifteen'), page.append(wrapperNodeDiv)
const footer = document.createElement('footer')
;(footer.className = 'footer'), mainSection.after(footer)
const fieldSizeWrapper = document.createElement('div')
for (
  fieldSizeWrapper.className = 'field-param__wrapper',
    footer.append(fieldSizeWrapper),
    i = 3;
  i <= 8;
  i++
) {
  let e = document.createElement('button')
  ;(e.className = 'field-param'),
    (e.id = `${i}`),
    (e.innerHTML = `${i} x ${i}`),
    fieldSizeWrapper.append(e),
    4 === i && e.classList.add('active')
}
function fieldSizeClickHandler() {
  document
    .querySelector('.field-param__wrapper')
    .addEventListener('click', (e) => {
      e.target.classList.contains('field-param') &&
        (document.querySelectorAll('.field-param').forEach((e) => {
          e.classList.remove('active')
        }),
        e.target.classList.add('active'),
        showMovesAndTime())
    })
}
fieldSizeClickHandler()
const containerNode = document.querySelector('.fifteen'),
  fieldSize = document.querySelectorAll('.field-param')
function addItemNodes(e) {
  ;(wrapperNodeDiv.innerHTML = ''), (sizeCell = e)
  if (
    ([...Array((countCells = e * e)).keys()].forEach((e) => {
      let t = document.createElement('div')
      ;(t.className = 'cell'),
        (t.innerHTML = `${e + 1}`),
        (t.id = `${e + 1}`),
        wrapperNodeDiv.append(t),
        (t.style.width = `${100 / sizeCell}%`),
        (t.style.height = `${100 / sizeCell}%`),
        (t.draggable = !0),
        t.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('id', e.target.id)
        })
    }),
    (matrix = getMatrix(
      (itemNodes = Array.from(wrapperNodeDiv.querySelectorAll('.cell'))).map(
        (e) => Number(e.id)
      )
    )),
    (itemNodes[countCells - 1].style.display = 'none'),
    shuffleCells(),
    playGame)
  ) {
    ;(matrix = JSON.parse(localStorage.getItem('matrix'))),
      (e = Number(localStorage.getItem('typeGame'))),
      (playAudio = !playAudio)
        ? (soundBtn.innerHTML = 'unmuted')
        : (soundBtn.innerHTML = 'muted')
    let t = document.querySelectorAll('.field-param')
    t.forEach((t, a) => {
      t.classList.remove('active'), a + 3 === e && t.classList.add('active')
    })
  }
}
function shuffleCells() {
  let e = matrix.flat(),
    t = shuffle(e)
  for (; !searchDecideArray(t); ) t = shuffle(e)
  setPositionCells((matrix = getMatrix(t)))
}
function shuffle(e) {
  for (let t = e.length - 1; t > 0; t--) {
    let a = Math.floor(Math.random() * (t + 1))
    ;[e[t], e[a]] = [e[a], e[t]]
  }
  return e
}
function searchDecideArray(e) {
  let t = 0,
    a = e.slice(),
    r = Math.ceil((a.indexOf(countCells) + 1) / Math.sqrt(countCells)) - 1
  a.splice(a.indexOf(countCells), 1)
  for (let n = 0; n < a.length; n++)
    for (let l = n; l < a.length; l++) a[n] > a[l] && t++
  return (
    (countCells % 2 != 0 && t % 2 == 0) ||
    ((t + r) % 2 != 0 && countCells % 2 == 0)
  )
}
function formatDate(e) {
  let t = new Date(2022, 0, 1)
  return t.setSeconds(e), t.toTimeString().replace(/.*(\d{2}:\d{2}).*/, '$1')
}
function startTimer() {
  setInterval(() => {
    startTime && time++,
      (document.querySelector('.time').innerHTML = `Time: ${formatDate(time)}`)
  }, 1e3)
}
function changeMoves() {
  moveCounter++,
    (document.querySelector('.moves').innerHTML = `Moves: ${moveCounter}`)
}
function showMovesAndTime() {
  ;(time = 0),
    (timeWrapper.innerHTML = 'Time: 00:00'),
    (startTime = !0),
    (moveCounter = 0),
    (document.querySelector('.moves').innerHTML = `Moves: ${moveCounter}`)
}
function changeAudio(e) {
  let t = new Audio()
  ;(t.src = 'assets/sounds/mclick.mp3'), (t.autoplay = e)
}
function createWinModal() {
  let e = document.createElement('div')
  ;(e.className = 'modal-overlay'), document.body.append(e)
  let t = document.createElement('div')
  ;(t.className = 'modal'), e.append(t)
  let a = document.createElement('div')
  ;(a.className = 'modal-content'), t.append(a)
  let r = document.createElement('h2')
  ;(r.innerHTML = `Hooray! You solved the puzzle in ${formatDate(
    time
  )} and ${moveCounter} moves!`),
    a.append(r)
}
function removeModal() {
  let e = document.querySelector('.modal-overlay')
  e.addEventListener('click', (t) => {
    t.target.classList.contains('modal-overlay') && e.remove()
    shuffleCells()
    showMovesAndTime()
  })
}
function getMatrix(e) {
  let t = []
  for (let a = 0; a < sizeCell; a++) t.push([])
  let r = 0,
    n = 0
  for (i = 0; i < e.length; i++)
    r >= sizeCell && (n++, (r = 0)), (t[n][r] = e[i]), r++
  return t
}
function setPositionCells(e) {
  for (let t = 0; t < e.length; t++)
    for (let a = 0; a < e[t].length; a++) {
      let r = e[t][a],
        n = itemNodes[r - 1]
      setNodeStyles(n, a, t)
    }
}
function setNodeStyles(e, t, a) {
  e.style.transform = `translate3D(${100 * t}%,${100 * a}%,0)`
}
function findCoordinatesByNumber(e, t) {
  for (let a = 0; a < t.length; a++)
    for (let r = 0; r < t[a].length; r++)
      if (t[a][r] === e) return { x: r, y: a }
  return null
}
function isValidForSwap(e, t) {
  let a = Math.abs(e.x - t.x),
    r = Math.abs(e.y - t.y)
  return (1 === a || 1 === r) && (e.x === t.x || e.y === t.y)
}
function swap(e, t, a) {
  let r = a[e.y][e.x]
  ;(a[e.y][e.x] = a[t.y][t.x]),
    (a[t.y][t.x] = r),
    changeMoves(),
    checkWin(a) &&
      (createWinModal(), removeModal(), (startTime = !1), addWinDate())
}
function checkWin(e) {
  let t = Array(countCells)
      .fill(0)
      .map((e, t) => t + 1),
    a = e.flat()
  for (let r = 0; r < t.length; r++) if (a[r] !== t[r]) return !1
  return !0
}
function addWinDate() {
  resultArray.push({
    typeGame: gameType,
    time: formatDate(time),
    moves: moveCounter,
  }),
    resultArray.sort((e, t) => e.moves - t.moves),
    resultArray.length > 10 && (resultArray.length = 10),
    setLocalStorage()
}
function createResultModal() {
  let e = document.createElement('div')
  ;(e.className = 'modal-overlay'), document.body.append(e)
  let t = document.createElement('div')
  ;(t.className = 'modal'), e.append(t)
  let a = document.createElement('div')
  ;(a.className = 'modal-content'), t.append(a)
  let r = document.createElement('h2')
  ;(r.innerHTML = 'Results'), a.append(r)
}
function setLocalStorage() {
  localStorage.setItem('resultArray', JSON.stringify(resultArray))
}
function getLocalStorage() {
  localStorage.getItem('resultArray') &&
    (resultArray = JSON.parse(localStorage.getItem('resultArray')))
}
fieldSize.forEach((e) => {
  e.addEventListener('click', () => {
    addItemNodes((gameType = e.id))
  })
}),
  addItemNodes(gameType),
  setPositionCells(matrix),
  shuffleBtn.addEventListener('click', () => {
    shuffleCells(), showMovesAndTime()
  }),
  containerNode.addEventListener('click', (e) => {
    let t = e.target.closest('.cell')
    if (!t) return
    let a = Number(t.id),
      r = findCoordinatesByNumber(a, matrix),
      n = findCoordinatesByNumber(countCells, matrix),
      l = isValidForSwap(r, n)
    l && (changeAudio(playAudio), swap(n, r, matrix), setPositionCells(matrix))
  }),
  containerNode.addEventListener('dragover', (e) => {
    e.preventDefault()
  }),
  containerNode.addEventListener('drop', (e) => {
    let t = document.getElementById(e.dataTransfer.getData('id'))
    if (!t) return
    let a = Number(t.id),
      r = findCoordinatesByNumber(a, matrix),
      n = findCoordinatesByNumber(countCells, matrix),
      l = isValidForSwap(r, n)
    l && (changeAudio(playAudio), swap(n, r, matrix), setPositionCells(matrix))
  }),
  window.addEventListener('keydown', (e) => {
    if (!e.key.includes('Arrow')) return
    let t = findCoordinatesByNumber(countCells, matrix),
      a = { x: t.x, y: t.y },
      r = e.key,
      n = matrix.length
    switch (r) {
      case 'ArrowUp':
        a.y += 1
        break
      case 'ArrowDown':
        a.y -= 1
        break
      case 'ArrowLeft':
        a.x += 1
        break
      case 'ArrowRight':
        a.x -= 1
    }
    !(a.y >= n) &&
      !(a.y < 0) &&
      !(a.x >= n) &&
      !(a.x < 0) &&
      (changeAudio(playAudio), swap(t, a, matrix), setPositionCells(matrix))
  }),
  startTimer(),
  soundBtn.addEventListener('click', () => {
    ;(playAudio = !playAudio)
      ? (soundBtn.innerHTML = 'mute')
      : (soundBtn.innerHTML = 'unmute')
  }),
  resBtn.addEventListener('click', () => {
    createResultModal(),
      removeModal(),
      localStorage.getItem('resultArray') &&
        (resultArray = JSON.parse(localStorage.getItem('resultArray'))).forEach(
          (e, t) => {
            let a = document.querySelector('.modal-content'),
              r = document.createElement('p')
            ;(r.innerHTML = `${t + 1}. Type: ${e.typeGame} x ${
              e.typeGame
            }, Time: ${e.time}, Moves: ${e.moves}`),
              a.append(r)
          }
        )
  }),
  window.addEventListener('load', getLocalStorage),
  saveBtn.addEventListener('click', () => {
    localStorage.setItem('matrix', JSON.stringify(matrix)),
      localStorage.setItem('gameType', gameType),
      localStorage.setItem('moves', moveCounter),
      localStorage.setItem('time', time),
      localStorage.setItem('audio', playAudio)
  }),
  loadBtn.addEventListener('click', () => {
    localStorage.getItem('matrix') &&
      ((playGame = !0),
      (matrix = JSON.parse(localStorage.getItem('matrix'))),
      (gameType = localStorage.getItem('gameType')),
      (moveCounter = localStorage.getItem('moves')),
      (time = localStorage.getItem('time')),
      (playAudio = localStorage.getItem('audio')),
      addItemNodes(gameType),
      setPositionCells(matrix),
      (document.querySelector('.moves').innerHTML = `Moves: ${moveCounter}`)),
      (playGame = !1)
  })
console.log(
  'Contacts:\n',
  'Telegram: @casie2\nhttps://t.me/casie2\n\n',

  'Score: 120 / 120\n\n',

  '+30 Basic scope\n',
  '- Макет, дизайн, адаптивный интерфейс +10\n',
  '- В начальном состоянии игры рамка заполняется случайно сгенерированными и перетасованными числами +10\n',
  '- При нажатии на плитку рядом с пустой ячейкой плитка перемещается в пустую ячейку +10\n\n',

  '+50 Advanced scope\n',
  '- Игру можно перезапустить без перезагрузки страницы +10\n',
  '- Отображается продолжительность игры и количество ходов +10\n',
  '- Звуковое сопровождение (вкл/выкл) движения плитки +10\n',
  '- Реализовано сохранение состояния игры и сохранение 10 лучших результатов с помощью LocalStorage +10\n',
  '- Реализован выбор разных размеров для кадра +10\n\n',

  '+40 Hacker scope\n',
  '- Когда игра закончена, отображается следующее сообщение `Ура! Вы решили головоломку за ##:## и N ходов!`. Алгоритм перетасовки работает правильно - пользователь может решить головоломку +10\n',
  '- Анимация движения плитки по кадру +15\n',
  '- Плитки можно перетаскивать мышью +15'
)
