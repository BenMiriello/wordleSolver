localStorage.clear();

const ga = document.querySelector('game-app');
ga.shadowRoot.querySelector('game-modal').remove();
const board = ga.$board;
const keyboard = ga.$keyboard.shadowRoot.children[1];

const rows = Array.from(ga.$board.children).map((c) => c.shadowRoot.children[1]);
const keys = Array.from(keyboard.children)
  .flatMap(row => Array.from(row.children))
  .filter(btn => !(btn.classList.contains('one-and-a-half') || btn.classList.contains('spacer')));

const enter = Array.from(keyboard.children)
  .flatMap(row => Array.from(row.children))[21];

const clickKey = char => keys.find(k => k.dataset.key === char).click();
const typeWord = word => word.split('').forEach(clickKey);
const submitWord = () => enter.click();

typeWord('crane');
submitWord();
