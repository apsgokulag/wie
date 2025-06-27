import api from './api';

export const login = async (data) => {
  const res = await api.post('/auth/login', data);
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user));
};

export const signup = async (data) => {
  const res = await api.post('/auth/signup', data);
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user));
};
