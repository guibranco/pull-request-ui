const API_BASE_URL = "https://guilhermebranco.com.br/webhooks/api/v1";

/**
 * Fetches data from a specified endpoint with authentication.
 * This function automatically includes an authorization token in the request headers.
 *
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {RequestInit} [options={}] - Optional configuration for the request, such as method, body, and headers.
 *
 * @returns {Promise<Response>} A promise that resolves to the response of the fetch request.
 *
 * @throws {Error} Throws an error if the fetch operation fails.
 *
 * @example
 * fetchWithAuth('/users', {
 *   method: 'GET',
 * })
 * .then(response => response.json())
 * .then(data => console.log(data))
 * .catch(error => console.error('Error fetching data:', error));
 */
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
