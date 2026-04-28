const BASE_URL = "http://localhost:8000/api";

const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
    }

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
};

export const api = {
    auth: {
        login: (credentials) => apiFetch('/login', { method: 'POST', body: JSON.stringify(credentials) }),
        logout: () => apiFetch('/logout', { method: 'POST' }),
        me: () => apiFetch('/me'),
    },
    users: {
        list: () => apiFetch('/users'),
        create: (data) => apiFetch('/users', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        toggleActive: (id) => apiFetch(`/users/${id}/toggle-active`, { method: 'PATCH' }),
        resetPassword: (id) => apiFetch(`/users/${id}/reset-password`, { method: 'POST' }),
    },
    patients: {
        list: (search = '', page = 1) => apiFetch(`/patients?search=${search}&page=${page}`),
        get: (id) => apiFetch(`/patients/${id}`),
        create: (data) => apiFetch('/patients', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => apiFetch(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        archive: (id) => apiFetch(`/patients/${id}/archive`, { method: 'PATCH' }),
    },
    consultations: {
        list: (params = {}) => {
            const query = new URLSearchParams(params).toString();
            return apiFetch(`/consultations?${query}`);
        },
        create: (data) => apiFetch('/consultations', { method: 'POST', body: JSON.stringify(data) }),
        updateStatut: (id, statut) => apiFetch(`/consultations/${id}/statut`, { method: 'PATCH', body: JSON.stringify({ statut }) }),
        updateConstantes: (id, data) => apiFetch(`/consultations/${id}/constantes`, { method: 'PATCH', body: JSON.stringify(data) }),
    },
    dossier: {
        get: (consultationId) => apiFetch(`/consultations/${consultationId}/dossier`),
        save: (consultationId, data) => apiFetch(`/consultations/${consultationId}/dossier`, { method: 'POST', body: JSON.stringify(data) }),
    },
    ordonnances: {
        create: (consultationId, data) => apiFetch(`/consultations/${consultationId}/ordonnances`, { method: 'POST', body: JSON.stringify(data) }),
        get: (id) => apiFetch(`/ordonnances/${id}`),
        markPrinted: (id) => apiFetch(`/ordonnances/${id}/imprimer`, { method: 'PATCH' }),
    },
    certificats: {
        create: (consultationId, data) => apiFetch(`/consultations/${consultationId}/certificats`, { method: 'POST', body: JSON.stringify(data) }),
        get: (id) => apiFetch(`/certificats/${id}`),
    },
    factures: {
        list: (params = {}) => {
            const query = new URLSearchParams(params).toString();
            return apiFetch(`/factures?${query}`);
        },
        get: (consultationId) => apiFetch(`/consultations/${consultationId}/facture`),
        addLigne: (factureId, data) => apiFetch(`/factures/${factureId}/lignes`, { method: 'POST', body: JSON.stringify(data) }),
        removeLigne: (factureId, ligneId) => apiFetch(`/factures/${factureId}/lignes/${ligneId}`, { method: 'DELETE' }),
        pay: (factureId, data) => apiFetch(`/factures/${factureId}/paiements`, { method: 'POST', body: JSON.stringify(data) }),
        normalise: (factureId) => apiFetch(`/factures/${factureId}/normaliser`, { method: 'PATCH' }),
    },
    paiements: {
        list: (params = {}) => {
            const query = new URLSearchParams(params).toString();
            return apiFetch(`/paiements?${query}`);
        },
    },
    statistiques: {
        dashboard: () => apiFetch('/statistiques/dashboard'),
    },
    get: (endpoint) => apiFetch(endpoint),
    post: (endpoint, data) => apiFetch(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    patch: (endpoint, data) => apiFetch(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
    put: (endpoint, data) => apiFetch(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    logs: {
        list: () => apiFetch('/logs'),
    },
    roles: {
        list: () => apiFetch('/roles'),
    },
    assurances: {
        list: () => apiFetch('/assurances'),
        create: (data) => apiFetch('/assurances', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => apiFetch(`/assurances/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    },
    tarifs: {
        list: () => apiFetch('/tarifs'),
        create: (data) => apiFetch('/tarifs', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => apiFetch(`/tarifs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    },
};
