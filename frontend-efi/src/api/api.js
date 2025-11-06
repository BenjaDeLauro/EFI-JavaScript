const API_URL = "http://localhost:5000";

export const fetchWithToken = async (url, method = "GET", body = null, token) => {
  const res = await fetch(`${API_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });
  return await res.json();
};
