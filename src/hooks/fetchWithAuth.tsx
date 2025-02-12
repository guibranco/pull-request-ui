const API_BASE_URL = "https://guilhermebranco.com.br/webhooks/api/v1";

const fetchWithAuth = (endpoint: string, options: RequestInit = {}) => {
  const token = "";

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export default fetchWithAuth;
