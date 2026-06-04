let selectedColor = '#f1f1f1';
let dataCards = [];
let activeCard = null;

const setColor = (color) => {
    selectedColor = color;
};

const getColor = () => selectedColor;

const setDataCards = (cards) => {
    dataCards = cards;
};

const getDataCards = () => dataCards;

const setActiveCard = (card) => {
    activeCard = card;
    if (card?.color) {
        selectedColor = card.color;
    }
};

const getActiveCard = () => activeCard;

export {
    setColor,
    getColor,
    setDataCards,
    getDataCards,
    setActiveCard,
    getActiveCard,
};
