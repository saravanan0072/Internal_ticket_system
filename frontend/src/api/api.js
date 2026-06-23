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

export const updateUser = async (id, role, status) => {
  const res = await api.patch(`/auth/users/${id}`, {
    role,
    status,
  });

  return res.data;
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

export const updateTicket = async (id, ticketData) => {
  const token = localStorage.getItem("token");

  const response = await api.put(`/tickets/update/${id}`, ticketData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const DeleteTicket = async (id) => {
  const token = localStorage.getItem("token");

  const response = await api.delete(`/tickets/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateTicketStatus = async (id, status, confirm_status) => {
  const token = localStorage.getItem("token");

  const payload = {
    status,
  };

  if (confirm_status) {
    payload.confirm_status = confirm_status;
  }

  const response = await api.patch(`/tickets/ticketStatus/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const detectTicket = async (description) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/ai/categorize",
    { description },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getSuggestedResponse = async (description) => {
  const res = await api.post("/ai/suggest-response", { description });
  return res.data;
};
