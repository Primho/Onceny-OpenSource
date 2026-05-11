let selectedColor = '#f1f1f1';
let dataCards = [];
let counter = 0;

const setColor = (color) => { selectedColor = color };
const getColor = () => selectedColor;

const setCounter = (i) => { counter = i };
const getCounter = () => counter;

const setDataCards = (nCard) => { dataCards = nCard };
const getDataCards = () => dataCards;

export { setColor, getColor, setDataCards, getDataCards, setCounter, getCounter };