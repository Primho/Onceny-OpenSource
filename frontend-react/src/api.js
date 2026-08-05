const API_URL = 'http://127.0.0.1:5000/api';

const parseJson = async (response) => {
    if (!response.ok) { throw new Error(`API error: ${response.status}`) };
    return response.json();
};

const getSpaces = () => {
    return fetch(`${API_URL}/cards`).then(parseJson);
};

const createSpace = (spaceData) => {
    return fetch(`${API_URL}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spaceData),
    }).then(parseJson);
};

const updateSpace = (id, payload) => {
    return fetch(`${API_URL}/cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).then(parseJson);
};

const deleteSpace = (id) => {
    return fetch(`${API_URL}/cards/${id}`, { method: 'DELETE' }).then(parseJson)
};

const getSpace = (id) => {
    return fetch(`${API_URL}/cards/${id}`).then(parseJson);
};

const createBlock = (pageId, payload) => {
    return fetch(`${API_URL}/pages/${pageId}/blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(parseJson);
};

const updateBlock = (id, payload) => {
    return fetch(`${API_URL}/blocks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(parseJson);
};

export { getSpaces, createSpace, updateSpace, deleteSpace, getSpace, createBlock, updateBlock };