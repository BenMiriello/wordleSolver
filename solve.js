localStorage.clear();

const starters = ['slate', 'sauce', 'slice', 'shale', 'saute', 'share', 'sooty', 'shine', 'suite', 'crane', 'reais', 'blahs', 'centu', 'doggo', 'arose', 'earls', 'laser', 'reals', 'aloes'];
let allowed;
let answers;

const alphabet = {};
const keyboardLetters = {};
let solved = false;
let tries = 0;

const ga = document.querySelector('game-app');
ga.shadowRoot.querySelector('game-modal').remove();
const board = ga.$board;
const keyboard = ga.$keyboard.shadowRoot.children[1];

// const rows = Array.from(ga.$board.children).map((c) => c.shadowRoot.children[1]);
const keys = Array.from(keyboard.children)
  .flatMap(row => Array.from(row.children))
  .filter(btn => !(btn.classList.contains('one-and-a-half') || btn.classList.contains('spacer')));

const enter = Array.from(keyboard.children).flatMap(row => Array.from(row.children))[21];

const clickKey = char => keys.find(k => k.dataset.key === char).click();
const typeWord = word => word.split('').forEach(clickKey);
const submitWord = () => {
  enter.click();
  setTimeout(() => {
    updateAlphabet();
    updateKeyboardLetters();
  }, 2500);
};

const updateAlphabet = () => {
  resetAlphabet(alphabet);
  const words = Array.from(board.querySelectorAll('game-row'));
  words.map(word => Array.from(word.$row.children).map((cell, i) => {
    const letter = cell.getAttribute('letter');
    if (letter) {
      if (!alphabet[letter]) alphabet[letter] = [];
      alphabet[letter][i] = cell.getAttribute('evaluation');
    }
  }));
};

const updateKeyboardLetters = () => {
  resetAlphabet(keyboardLetters);
  keys.forEach(key => {
    keyboardLetters[key.dataset.key] = key.dataset.state;
  });
  console.log(keyboardLetters);
};

const resetAlphabet = (alphabet) => {
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach(letter => alphabet[letter] = null);
};

const tryWord = () => {
  if (solved || (tries >= 6)) {
    localStorage.clear();
    return;
  }
  const word = pickNextWord();
  typeWord(word);
  submitWord();
  setTimeout(() => {
    tryWord();
  }, 3000);
};

const isValidGuess = (word) => {
  if (!word) return false;
  if (word.split('').find((letter) => {
    if (keyboardLetters[letter] === 'absent') return true;
  })) return false;
  return true;
};

'asdf'.split('').forEach((letter, i) => {
  if (letter === 's') return false;
  console.log('true');
});

const pickNextWord = () => {
  let word;
  let set = starters;
  if (tries === 0) {
    set = starters;
  } else if (tries < 3) {
    set = allowed;
  } else {
    set = answers;
  }
  while (!isValidGuess(word)) {
    word = set[Math.floor(Math.random() * set.length)];
  }
  tries += 1;
  return word;
};

const solve = () => {
  fetch('https://api.github.com/gists/a03ef2cba789d8cf00c08f767e0fad7b')
  .then(r => r.json())
  .then(res => {
    answers = res.files['wordle-answers-alphabetical.txt'].content.split("\n");
    fetch('https://api.github.com/gists/cdcdf777450c5b5301e439061d29694c')
      .then(r => r.json())
      .then(res => {
        allowed = res.files['wordle-allowed-guesses.txt'].content.split("\n");
        tryWord();
    });
  });
}

solve();
