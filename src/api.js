import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export const fetchPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createPost = async (title) => {
  const response = await axios.post(API_URL, { title, body: '', userId: 1 });
  return response.data;
};

export const updatePost = async (id, title) => {
  const response = await axios.put(`${API_URL}/${id}`, { title, body: '', userId: 1 });
  return response.data;
};

export const deletePost = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};