const cards = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍉', '🍍', '🍒']; // 8 ícones para garantir variedade
let gameCards = [];
let firstCard = null;
let secondCard = null;
let matchedPairs = 0;
let score = 0;
let playerName = '';
const maxPairs = { easy: 3, hard: 6 };

// Limpa o ranking sempre que a página for carregada
localStorage.removeItem('rankings');

document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('restart-button').addEventListener('click', restartGame);
document.getElementById('home-button').addEventListener('click', goHome);

function startGame() {
    playerName = document.getElementById('player-name').value;
    const difficulty = document.getElementById('difficulty').value;
    const totalPairs = maxPairs[difficulty];

    // Embaralha as cartas
    gameCards = [...cards.slice(0, totalPairs), ...cards.slice(0, totalPairs)];
    gameCards.sort(() => 0.5 - Math.random());

    const board = document.getElementById('board');
    board.innerHTML = '';
    gameCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.addEventListener('click', flipCard);
        board.appendChild(cardElement);
    });

    document.getElementById('result').classList.add('hidden');
    board.classList.remove('hidden');
}

function flipCard() {
    const index = this.dataset.index;
    if (this.classList.contains('flipped') || secondCard) return;

    this.textContent = gameCards[index];
    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkMatch();
    }
}

function checkMatch() {
    if (firstCard.textContent === secondCard.textContent) {
        matchedPairs++;
        score += 10; // Pontuação por acerto
        resetCards();
        if (matchedPairs === (gameCards.length / 2)) {
            endGame();
        }
    } else {
        setTimeout(() => {
            firstCard.textContent = '';
            firstCard.classList.remove('flipped');
            secondCard.textContent = '';
            secondCard.classList.remove('flipped');
            resetCards();
        }, 1000);
    }
}

function resetCards() {
    firstCard = null;
    secondCard = null;
}

function endGame() {
    document.getElementById('board').classList.add('hidden');
    const resultDiv = document.getElementById('result');
    document.getElementById('score').textContent = `Nome: ${playerName}, Pontuação: ${score}`;
    resultDiv.classList.remove('hidden');
    saveRanking(playerName, score);
    displayRanking();
}

function restartGame() {
    // Reseta o jogo
    score = 0;
    matchedPairs = 0;
    firstCard = null;
    secondCard = null;

    const board = document.getElementById('board');
    board.innerHTML = ''; // Limpa o tabuleiro

    // Reseta o resultado
    document.getElementById('result').classList.add('hidden');
    board.classList.add('hidden');

    // Reinicia o jogo com a mesma dificuldade
    const playerNameInput = document.getElementById('player-name');
    if (playerNameInput.value) {
        playerName = playerNameInput.value;
    }

    const difficulty = document.getElementById('difficulty').value;
    const totalPairs = maxPairs[difficulty];

    // Embaralha as cartas
    gameCards = [...cards.slice(0, totalPairs), ...cards.slice(0, totalPairs)];
    gameCards.sort(() => 0.5 - Math.random());

    // Cria as cartas novamente
    gameCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.addEventListener('click', flipCard);
        board.appendChild(cardElement);
    });

    board.classList.remove('hidden'); // Exibe o tabuleiro
}

function saveRanking(name, score) {
    const rankings = JSON.parse(localStorage.getItem('rankings')) || [];
    rankings.push({ name, score });
    rankings.sort((a, b) => b.score - a.score);
    localStorage.setItem('rankings', JSON.stringify(rankings));
}

function displayRanking() {
    const rankings = JSON.parse(localStorage.getItem('rankings')) || [];
    const rankingDiv = document.getElementById('ranking');
    rankingDiv.innerHTML = '<h2>Ranking</h2>';
    rankings.forEach(entry => {
        rankingDiv.innerHTML += `<p>${entry.name}: ${entry.score}</p>`;
    });
}

function goHome() {
    // Limpa o nome do jogador e a pontuação
    playerName = '';
    score = 0;
    matchedPairs = 0;

    // Esconde o tabuleiro e os resultados
    document.getElementById('board').classList.add('hidden');
    document.getElementById('result').classList.add('hidden');

    // Reseta os inputs
    document.getElementById('player-name').value = '';
    document.getElementById('difficulty').value = 'easy'; // Reseta para a dificuldade padrão
}
