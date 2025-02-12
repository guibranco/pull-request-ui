const API_BASE_URL = "https://guilhermebranco.com.br/webhooks/api/v1";

const fetchWithAuth = (apiKey: string | null, endpoint: string, options: RequestInit = {}) => {

  if (apiKey === null) {
    throw new Error("API key not set");
  }

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `token ${apiKey}`,
      "Content-Type": "application/json",
    },
  });
};

export default fetchWithAuth;
