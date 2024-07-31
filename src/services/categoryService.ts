import { Category } from "@/interface/Category";
import axios from "axios";

const API_URL = "http://localhost:5000";

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await axios.get(`${API_URL}/categories/${id}`);
  return response.data;
};

export const addCategory = async (category: Category): Promise<Category> => {
  const response = await axios.post(`${API_URL}/categories`, category);
  return response.data;
};

export const updateCategory = async (
  id: number,
  category: Category
): Promise<Category> => {
  const response = await axios.put(`${API_URL}/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/categories/${id}`);
};
