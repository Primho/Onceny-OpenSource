let selectedColor = '#f1f1f1';
let dataCards = [];
let counter = 0;
let activeCard = null;

const setColor = (color) => { selectedColor = color };
const getColor = () => selectedColor;

const setCounter = (i) => { counter = i };
const getCounter = () => counter;

const setDataCards = (nCard) => { dataCards = nCard };
const getDataCards = () => dataCards;

const setActiveCard = (card) => { activeCard = card };
const getActiveCard = () => activeCard;

export { 
    setColor, getColor, 
    setDataCards, getDataCards, 
    setCounter, getCounter, 
    setActiveCard, getActiveCard 
};