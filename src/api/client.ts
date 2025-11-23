import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth
  async register(email: string, username: string, password: string) {
    return this.client.post('/register', { email, username, password });
  }

  async login(email: string, password: string) {
    return this.client.post('/login', { email, password });
  }

  async requestOtp(email: string) {
    return this.client.post('/request-otp', { email });
  }

  async loginOtp(email: string, otp: string) {
    return this.client.post('/login-otp', { email, otp });
  }

  async refreshToken(body: {refreshToken: string}) {
    return this.client.post('/refresh-token', body);
  }

  async logout(body?: {refreshToken?: string}) {
    return this.client.post('/logout', body ?? {});
  }

  // Stores
  async getStores(config?: AxiosRequestConfig) {
    return this.client.get('/stores', config);
  }

  async getStore(id: string, config?: AxiosRequestConfig) {
    return this.client.get(`/stores/${id}`, config);
  }

  async createStore(data: any) {
    return this.client.post('/stores', data);
  }

  async updateStore(id: string, data: any) {
    return this.client.patch(`/stores/${id}`, data);
  }

  async deleteStore(id: string) {
    return this.client.delete(`/stores/${id}`);
  }

  async setDefaultStore(userId: string, storeId: string) {
    return this.client.post(`/account/${userId}/default-store`, {storeId});
  }

  async getAccount(userId: string) {
    return this.client.get(`/account/${userId}`);
  }

  // Products
  async getProducts(config?: AxiosRequestConfig) {
    return this.client.get('/products', config);
  }

  async getProduct(id: string, config?: AxiosRequestConfig) {
    return this.client.get(`/products/${id}`, config);
  }

  async getStoreProducts(storeId: string, config?: AxiosRequestConfig) {
    return this.client.get(`/stores/${storeId}/products`, config);
  }

  async createProduct(data: any) {
    return this.client.post('/products', data);
  }

  async createStoreProduct(storeId: string, data: any) {
    return this.client.post(`/stores/${storeId}/products`, data);
  }

  async updateProduct(id: string, data: any) {
    return this.client.patch(`/products/${id}`, data);
  }

  async deleteProduct(id: string) {
    return this.client.delete(`/products/${id}`);
  }

  // Brands
  async getBrands(config?: AxiosRequestConfig) {
    return this.client.get('/brands', config);
  }

  async getBrand(id: string, config?: AxiosRequestConfig) {
    return this.client.get(`/brands/${id}`, config);
  }

  async getStoreBrands(storeId: string, config?: AxiosRequestConfig) {
    return this.client.get(`/brands/store/${storeId}`, config);
  }

  async createBrand(data: any) {
    return this.client.post('/brands', data);
  }

  async updateBrand(id: string, data: any) {
    return this.client.patch(`/brands/${id}`, data);
  }

  async deleteBrand(id: string) {
    return this.client.delete(`/brands/${id}`);
  }

  // Categories
  async getCategories(config?: AxiosRequestConfig) {
    return this.client.get('/categories', config);
  }

  async getCategory(id: string, config?: AxiosRequestConfig) {
    return this.client.get(`/categories/${id}`, config);
  }

  async getStoreCategories(storeId: string, config?: AxiosRequestConfig) {
    return this.client.get(`/categories/store/${storeId}`, config);
  }

  async createCategory(data: any) {
    return this.client.post('/categories', data);
  }

  async updateCategory(id: string, data: any) {
    return this.client.patch(`/categories/${id}`, data);
  }

  async deleteCategory(id: string) {
    return this.client.delete(`/categories/${id}`);
  }

  // Orders
  async getOrders(config?: AxiosRequestConfig) {
    return this.client.get('/orders', config);
  }

  async getOrder(id: string, config?: AxiosRequestConfig) {
    return this.client.get(`/orders/${id}`, config);
  }

  async getStoreOrders(storeId: string, status?: string) {
    return this.client.get(`/stores/${storeId}/orders`, {
      params: { status },
    });
  }

  async createOrder(data: any) {
    return this.client.post('/orders', data);
  }

  async updateOrder(id: string, data: any) {
    return this.client.patch(`/orders/${id}`, data);
  }

  async deleteOrder(id: string) {
    return this.client.delete(`/orders/${id}`);
  }

  // Transactions (Income, Expense, Sales, Purchase)
  async getIncomes(config?: AxiosRequestConfig) {
    return this.client.get('/incomes', config);
  }

  async createIncome(data: any) {
    return this.client.post('/incomes', data);
  }

  async updateIncome(id: string, data: any) {
    return this.client.patch(`/incomes/${id}`, data);
  }

  async deleteIncome(id: string) {
    return this.client.delete(`/incomes/${id}`);
  }

  async getExpenses(config?: AxiosRequestConfig) {
    return this.client.get('/expenses', config);
  }

  async createExpense(data: any) {
    return this.client.post('/expenses', data);
  }

  async updateExpense(id: string, data: any) {
    return this.client.patch(`/expenses/${id}`, data);
  }

  async deleteExpense(id: string) {
    return this.client.delete(`/expenses/${id}`);
  }

  async getSales(config?: AxiosRequestConfig) {
    return this.client.get('/sales', config);
  }

  async createSale(data: any) {
    return this.client.post('/sales', data);
  }

  async updateSale(id: string, data: any) {
    return this.client.patch(`/sales/${id}`, data);
  }

  async deleteSale(id: string) {
    return this.client.delete(`/sales/${id}`);
  }

  async getPurchases(config?: AxiosRequestConfig) {
    return this.client.get('/purchases', config);
  }

  async createPurchase(data: any) {
    return this.client.post('/purchases', data);
  }

  async updatePurchase(id: string, data: any) {
    return this.client.patch(`/purchases/${id}`, data);
  }

  async deletePurchase(id: string) {
    return this.client.delete(`/purchases/${id}`);
  }

  // File Upload
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.client.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default new ApiClient();
export { ApiClient };

