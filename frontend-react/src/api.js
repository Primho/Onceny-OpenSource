const API_URL = 'http://127.0.0.1:5000/api';

const parseJson = async (response) => {
    if (!response.ok) { throw new Error(`API error: ${response.status}`); }
    return response.json();
};

const getSpaces = () => fetch(`${API_URL}/cards`).then(parseJson);

const createSpace = (spaceData) => fetch(`${API_URL}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spaceData),
}).then(parseJson);

const updateSpace = (id, payload) => fetch(`${API_URL}/cards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
}).then(parseJson);

const deleteSpace = (id) => fetch(`${API_URL}/cards/${id}`, { method: 'DELETE' }).then(parseJson);

const getSpace = (id) => fetch(`${API_URL}/cards/${id}`).then(parseJson);

const createBlock = (pageId, payload) => fetch(`${API_URL}/pages/${pageId}/blocks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
}).then(parseJson);

const updateBlock = (id, payload) => fetch(`${API_URL}/blocks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
}).then(parseJson);

const deleteBlock = (id) => fetch(`${API_URL}/blocks/${id}`, { method: 'DELETE' }).then(parseJson);

const reorderBlocks = (pageId, payload) => fetch(`${API_URL}/pages/${pageId}/blocks/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
}).then(parseJson);

export { 
    getSpaces, 
    createSpace, 
    updateSpace, 
    deleteSpace, 
    getSpace, 
    createBlock, 
    updateBlock, 
    deleteBlock, 
    reorderBlocks 
};