const canvas = document.getElementById('snakeCanvas'); // Constante que pega o elemento snakeCanvas do HTML
const ctx = canvas.getContext('2d'); // Salva o contexto da tag canvas para 2d
const eatSound = document.getElementById('eatSound'); // Constante que pega o elemento eatSound do HTML 
eatSound.volume = 1.0; // Define o volume do áudio 
const gridSize = 20; // Define o tamanho do grid 

let snake = [
  { x: 100, y: 20, color: '#FF1493' }, // Cabeça
  { x: 80, y: 100, color: '#FF1493' }   // Corpo inicial
];
let apple = { x: 200, y: 200, color: 'red' }; 
let direction = 'right';
let speed = 150;
let score = 0;

// Obter o Best Score do armazenamento
let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;

document.getElementById('best-score-value').textContent = bestScore;
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) { // Função com switch para as direções da cobra no jogo
  switch (event.key) {
    case 'ArrowUp':
      if (direction !== 'down') {
        direction = 'up';
      }
      break;
    case 'ArrowDown': 
      if (direction !== 'up') {
        direction = 'down';
      }
      break;
    case 'ArrowLeft':
      if (direction !== 'right') {
        direction = 'left';
      }
      break;
    case 'ArrowRight':
      if (direction !== 'left') {
        direction = 'right';
      }
      break;
  }
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

  ctx.fillStyle = apple.color;
  ctx.fillRect(apple.x, apple.y, gridSize, gridSize); // Desenha a maçã no local exato do grid

  snake.forEach(segment => {
    ctx.fillStyle = segment.color;
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize); // Desenha a cobra por segmento de acordo com o que foi definido
  });
}

function update() {
  let newHead;
  switch (direction) {
    case 'up':
      newHead = { x: snake[0].x, y: snake[0].y - gridSize, color: getNextColor(snake[0].color) };
      break;
    case 'down':
      newHead = { x: snake[0].x, y: snake[0].y + gridSize, color: getNextColor(snake[0].color) };
      break;
    case 'left':
      newHead = { x: snake[0].x - gridSize, y: snake[0].y, color: getNextColor(snake[0].color) };
      break;
    case 'right':
      newHead = { x: snake[0].x + gridSize, y: snake[0].y, color: getNextColor(snake[0].color) };
      break;
  }
  snake.unshift(newHead); // Cria uma nova cabeça a cada movimento da cobra pelo canva, gerando novas cores a cada bloco do grid

  if (newHead.x === apple.x && newHead.y === apple.y) {
    apple.x = Math.floor(Math.random() * canvas.width / gridSize) * gridSize;
    apple.y = Math.floor(Math.random() * canvas.height / gridSize) * gridSize;
    apple.color = 'red'; 

    score++;
    eatSound.play();

    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem('bestScore', bestScore);
      document.getElementById('best-score-value').textContent = bestScore;
    }
    speed = Math.max(100, speed - 5); // Diminui a velocidade do jogo, sendo que a cobra fica mais rapida 
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
  } else {
    snake.pop(); // Quando come a maçã, a cobra cresce e remove o último elemento da cauda para que não fique solta no jogo
  }
  // Atualizar a pontuação atual
  document.getElementById('current-score').textContent = score;
}

function getNextColor(currentColor) {
  const colors = ['#FF1493', '#FF8C00', '#FFD700', '#008000', '#0000FF', '#4B0082'];
  const currentIndex = colors.indexOf(currentColor);
  const nextIndex = (currentIndex + 1) % colors.length;
  return colors[nextIndex]; // Fica gerando novas cores (que estão no array 'colors') para a cobra a cada movimento
}

function checkCollision() {
  if (
    snake[0].x < 0 || snake[0].x >= canvas.width ||
    snake[0].y < 0 || snake[0].y >= canvas.height
  ) {
    gameOver(); // Verifica se há colisão com as bordas do canvas, caso passe dos 400 x 400, gameover() é ativada
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      gameOver(); // Verifica no eixo X e Y se teve colisão da cobra com o próprio corpo, caso tenha, gameover() é chamada
    }
  }
}
function resetGame() {
  snake = [
    { x: 100, y: 100, color: '#FF1493' }, 
    { x: 80, y: 100, color: '#FF1493' }   
  ];
  apple = { x: 200, y: 200, color: 'red' };
  direction = 'right';
  score = 0;
  speed = 150;

  gameInterval = setInterval(gameLoop, speed); // Reinicia o jogo com as mesmas características iniciais
  
  document.getElementById('game-over-container').style.display = 'none';  // Esconde o container de game over
}
function gameOver() {
  clearInterval(gameInterval);

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

  ctx.fillStyle = '#fa76bd';
  ctx.font = '30px Anta';
  ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2 - 15); // Mostra  a mensagem de game over

  ctx.fillStyle = '#fff';
  ctx.font = '17px Arial';
  ctx.fillText('Your Score: ' + score, canvas.width / 2 - 53, canvas.height / 2 + 15); // Mostra a pontuação quando perde
  
  document.getElementById('play-again').style.display = 'block';
  document.getElementById('game-over-container').style.display = 'flex'; // Mostra o botao de play again e o container de game over
  snake.style.display = 'none' // Esconde a cobra do jogo
}
function startGame() {
  document.removeEventListener('keydown', startGame); // Desabilita o startgame pelo 'keydown' após o inicio
  gameInterval = setInterval(gameLoop, speed); // Iniciar o jogo com as mesma características iniciais

  document.getElementById('start-game').style.display = 'none'; // Oculta o botão de start após o inicio 
   document.removeEventListener('keydown', startGame); // Desabilita o startgame pelo 'keydown' após o inicio
}
document.addEventListener('keydown', function (event) {
  if (event.key === ' ') { // Inicia o jogo quando é pressionado espaço
    startGame();
  }
});

function gameLoop() { // Faz o loop do jogo
  update();
  checkCollision();
  draw();
}

let gameInterval; // Iniciar o jogo
document.getElementById('play-again').style.display = 'none';

