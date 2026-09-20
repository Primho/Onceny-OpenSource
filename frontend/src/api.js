const API_URL = `${import.meta.env.VITE_API_URL || ''}/api`;

const parseJson = async (response) => {
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `API error: ${response.status}`);
    }
    return response.json();
};

const apiFetch = (url, options = {}) => fetch(url, {
    ...options,
    credentials: 'include',
});

const getSpaces = () => apiFetch(`${API_URL}/cards`).then(parseJson);

const createSpace = (spaceData) => apiFetch(`${API_URL}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spaceData),
}).then(parseJson);

const updateSpace = (id, payload) => apiFetch(`${API_URL}/cards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
}).then(parseJson);

const deleteSpace = (id) => apiFetch(`${API_URL}/cards/${id}`, { method: 'DELETE' }).then(parseJson);

const getSpace = (id) => apiFetch(`${API_URL}/cards/${id}`).then(parseJson);

const createPage = (cardId, pageData) => apiFetch(`${API_URL}/cards/${cardId}/pages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pageData),
}).then(parseJson);

const updatePage = (id, payload) => apiFetch(`${API_URL}/pages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
}).then(parseJson);

const deletePage = (id) => apiFetch(`${API_URL}/pages/${id}`, { method: 'DELETE' }).then(parseJson);

const createBlock = (pageId, payload) => apiFetch(`${API_URL}/pages/${pageId}/blocks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
}).then(parseJson);

const updateBlock = (id, payload) => apiFetch(`${API_URL}/blocks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
}).then(parseJson);

const deleteBlock = (id) => apiFetch(`${API_URL}/blocks/${id}`, { method: 'DELETE' }).then(parseJson);

const reorderBlocks = (pageId, payload) => apiFetch(`${API_URL}/pages/${pageId}/blocks/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
}).then(parseJson);

const signup = (userData) => apiFetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
}).then(parseJson);

const login = (userData) => apiFetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
}).then(parseJson);

const getCurrentUser = () => apiFetch(`${API_URL}/auth/me`).then(parseJson);

const logout = () => apiFetch(`${API_URL}/auth/logout`, {
    method: 'POST',
}).then(parseJson);

export { 
    getSpaces, 
    createSpace, 
    updateSpace, 
    deleteSpace, 
    getSpace, 
    createPage,
    updatePage,
    deletePage,
    createBlock, 
    updateBlock, 
    deleteBlock, 
    reorderBlocks,
    signup,
    login,
    getCurrentUser,
    logout,
};