const selectors = {
  boardContainer: document.querySelector(".board-container"),
  board: document.querySelector(".board"),
  moves: document.querySelector(".moves"),
  time: document.querySelector(".time"),
  start: document.querySelector(".start"),
  win: document.querySelector(".win"),
};

const state = {
  gameStarted: false,
  flippedCard: 0,
  totalFilps: 0,
  totalTime: 0,
  loop: null,
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateGame = () => {
  const dimensions = selectors.board.getAttribute("data-dimension");

  if (dimensions % 2 !== 0) {
    throw new Error("the dimension of the board must be an even number ");
  }

  const imoji = ["🍕", "🍔", "🍟", "🌭", "🍿", "🧂", "🥓", "🥚", "🍳"];
  const picks = shuffle(imoji).slice(0, (dimensions * dimensions) / 2);
  const items = shuffle([...picks, ...picks]);

  const cards = items
    .map(
      (item) => `
          <div class="card">
            <div class="card-front"></div>
            <div class="card-back">${item}</div>
          </div>`
    )
    .join("");

  selectors.board.innerHTML = cards;
};

const startGame = () => {
  state.gameStarted = true;
  selectors.start.classList.add("disable");
  state.loop = setInterval(() => {
    state.totalTime++;
    selectors.moves.innerHTML = `${state.totalFilps} moves`;
    selectors.time.innerHTML = `time : ${state.totalTime} sec`;
  }, 1000);
};

const flipCard = (card) => {
  state.flippedCard++;
  state.totalFilps++;

  if (!state.gameStarted) {
    startGame();
  }

  if (state.flippedCard <= 2) {
    card.classList.add("flipped");
  }

  if (state.flippedCard === 2) {
    const flippedCards = Array.from(
      document.querySelectorAll(".flipped:not(.matched)")
    );
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.innerHTML === secondCard.innerHTML) {
      // Jika gambar di dalam dua kartu cocok, tandai sebagai pasangan yang cocok
      flippedCards.forEach((card) => card.classList.add("matched"));
    }

    setTimeout(() => {
      // Hanya putar kembali kartu-kartu yang tidak cocok dan belum dipasangkan
      flippedCards.forEach((card) => {
        if (!card.classList.contains("matched")) {
          card.classList.remove("flipped");
        }
      });
    }, 1000);

    state.flippedCard = 0;
  }

  if (!document.querySelectorAll(".card:not(.matched)").length) {
    setTimeout(() => {
      selectors.boardContainer.classList.add("flipped");
      selectors.win.innerHTML = `
              <span class="win-text">
                you winn <br/>
                with <span class="highlight">
                ${state.totalFilps}
                </span>
                moves <br/>
                under <span class="highlight">${state.totalTime}</span>
                secords 
              </span>`;
      clearInterval(state.loop);

      // Tampilkan alert dan beri opsi untuk memulai ulang permainan
      setTimeout(() => {
        if (
          confirm(
            "Congratulations! You've won the game! Do you want to play again?"
          )
        ) {
          restartGame();
        }
      }, 500);
    }, 1000);
  }
};

const attackEventListeners = () => {
  selectors.board.addEventListener("click", (event) => {
    const card = event.target.closest(".card");
    if (card && !card.classList.contains("flipped")) {
      flipCard(card);
    }
  });

  selectors.start.addEventListener("click", () => {
    if (!state.gameStarted) {
      startGame();
    }
  });
};

const restartGame = () => {
  // Lakukan inisialisasi ulang state dan tampilan permainan
  state.gameStarted = false;
  state.flippedCard = 0;
  state.totalFilps = 0;
  state.totalTime = 0;

  // Hapus kelas matched dari semua kartu
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.remove("matched");
  });

  // Lakukan inisialisasi ulang permainan
  generateGame();
  attackEventListeners();
};

// Inisialisasi permainan
generateGame();
attackEventListeners();
