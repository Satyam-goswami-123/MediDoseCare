import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mdc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => { throw err.response?.data || err; }
);

export const authApi = {
  sendOtp: (phone) => api.post('/auth/send-otp', { phone }),
  verifyOtp: (phone, otp, name) => api.post('/auth/verify-otp', { phone, otp, name }),
};

export const medicinesApi = {
  getAll: () => api.get('/medicines'),
  getOne: (id) => api.get(`/medicines/${id}`),
  create: (data) => api.post('/medicines', data),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  remove: (id) => api.delete(`/medicines/${id}`),
  getLogs: () => api.get('/medicines/logs'),
  updateDose: (logId, status) => api.patch(`/medicines/logs/${logId}`, { status }),
};

export const healthApi = {
  getLogs: (limit = 10) => api.get(`/health?limit=${limit}`),
  getLatest: () => api.get('/health/latest'),
  addLog: (data) => api.post('/health', data),
};

export const prescriptionsApi = {
  getAll: () => api.get('/prescriptions'),
  getOne: (id) => api.get(`/prescriptions/${id}`),
  create: (data) => api.post('/prescriptions', data),
  remove: (id) => api.delete(`/prescriptions/${id}`),
};

export const notificationsApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

export const sosApi = {
  trigger: (location) => api.post('/sos/trigger', { location }),
};

export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export default api;
