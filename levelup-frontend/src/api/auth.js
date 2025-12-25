// F:\gopro\levelup-frontend\src\api\auth.js
const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, options);
  let data = null;

  try {
    data = await res.json();
  } catch {
    // может быть пустой body
  }

  if (!res.ok) {
    const msg = data?.error || `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

export function registerUser({ email, password, fullName }) {
  return request("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
      // role больше не отправляем
    }),
  });
}

export function loginUser({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function getChallenges(token) {
  return request("/challenges", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createChallenge(token, payload) {
  return request("/challenges", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

// НОВОЕ: детальный просмотр челленджа
export function getChallenge(token, id) {
  return request(`/challenges/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// НОВОЕ: студент начинает челлендж
export function startChallenge(token, id) {
  return request(`/challenges/${id}/start`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getMyChallenges(token) {
  return request("/me/challenges", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function submitChallenge(token, id, payload) {
  return request(`/challenges/${id}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function getChallengeSubmissions(token, challengeId) {
  return request(`/challenges/${challengeId}/submissions`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function reviewSubmission(token, attemptId, payload) {
  return request(`/submissions/${attemptId}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function getMicrotasks(token) {
  const res = await fetch(`${API_URL}/microtasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Не удалось загрузить микрозадачи");
  }

  return res.json();
}

export async function applyMicrotask(token, microtaskId, payload) {
  const res = await fetch(`${API_URL}/microtasks/${microtaskId}/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Не удалось отправить отклик");
  }

  return res.json();
}

export async function getMyMicrotasks(token) {
  const res = await fetch(`${API_URL}/me/microtasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Не удалось загрузить ваши микрозадачи");
  }

  return res.json();
}

export async function getMicrotaskApplications(token, microtaskId) {
  const res = await fetch(`${API_URL}/microtasks/${microtaskId}/applications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Не удалось загрузить отклики по микрозадаче");
  }

  return res.json();
}

export async function updateMicrotaskApplicationStatus(token, applicationId, status) {
  const res = await fetch(
    `${API_URL}/microtask-applications/${applicationId}/status`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    let data = null;
    try {
      data = await res.json();
    } catch {
      // ignore
    }
    throw new Error(data?.error || "Не удалось обновить статус отклика");
  }

  return res.json();
}

export async function createMicrotask(token, payload) {
  const res = await fetch(`${API_URL}/microtasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = "Failed to create microtask";
    try {
      const data = await res.json();
      if (data && data.error) msg = data.error;
    } catch (_) {}
    throw new Error(msg);
  }

  return res.json();
}

export async function submitMicrotaskResult(token, applicationId, payload) {
  const res = await fetch(
    `${API_URL}/microtask-applications/${applicationId}/submit-result`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    let msg = "Не удалось отправить результат микрозадачи";
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch (_) {}
    throw new Error(msg);
  }

  return res.json();
}

export async function getLeaderboard(token) {
  const res = await fetch(`${API_URL}/leaderboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to load leaderboard");
  }
  return res.json();
}

// микрозадачи, созданные текущим пользователем (teacher/company/admin)
export async function getMyCreatedMicrotasks(token) {
  const res = await fetch(`${API_URL}/me/microtasks/created`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load my created microtasks");
  }

  return res.json();
}

// смена статуса микрозадачи: open / closed / archived
export async function updateMicrotaskStatus(token, microtaskId, status) {
  const res = await fetch(`${API_URL}/microtasks/${microtaskId}/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update microtask status");
  }

  return res.json();
}

export function getMe(token) {
  return request("/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
