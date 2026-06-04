const API_BASE = 'http://127.0.0.1:5000/api/cards';

const parseJson = async (response) => {
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    return response.json();
};

const getCards = async () => {
    const response = await fetch(API_BASE);
    return parseJson(response);
};

const createCard = async (cardData) => {
    const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData),
    });
    return parseJson(response);
};

const updateCard = async (id, payload) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return parseJson(response);
};

const deleteCard = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    return parseJson(response);
};

export { getCards, createCard, updateCard, deleteCard };
