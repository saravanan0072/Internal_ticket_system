import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (userData) => {
  if (!userData) return;
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  if (!userData) return;
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const fetchAllUser = async () => {
  const response = await api.get("/auth/AllUsers");
  return response.data;
};

export const updateRole = async (id, role) => {
  await api.patch(`/auth/users/${id}/role`, { role });
};

export const updateStatus = async (id, status) => {
  await api.patch(`/auth/users/${id}/status`, { status });
};

export const createTicket = async (ticketData) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/tickets", ticketData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


export const fetchTicket = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/tickets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};



export const updateTicket = async (id,ticketData) => {
  const token = localStorage.getItem("token");

  const response = await api.put(`/tickets/update/${id}`, ticketData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};