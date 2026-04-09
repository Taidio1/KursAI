const API_URL = '/api';
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;

export const blogService = {
  async getPosts() {
    const response = await fetch(`${API_URL}/blog`);
    if (!response.ok) throw new Error('Failed to fetch blog posts');
    return response.json();
  },

  async getPost(slug) {
    const response = await fetch(`${API_URL}/blog/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch blog post');
    return response.json();
  },

  async getAdminPosts() {
    const response = await fetch(`${API_URL}/blog-admin/posts`, {
      headers: { 'X-Admin-Secret': ADMIN_SECRET },
    });
    if (!response.ok) throw new Error('Failed to fetch admin posts');
    return response.json();
  },

  async createPost(data) {
    const response = await fetch(`${API_URL}/blog-admin/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Secret': ADMIN_SECRET,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  },

  async updatePost(id, patch) {
    const response = await fetch(`${API_URL}/blog-admin/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Secret': ADMIN_SECRET,
      },
      body: JSON.stringify(patch),
    });
    if (!response.ok) throw new Error('Failed to update post');
    return response.json();
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_URL}/blog-admin/upload-image`, {
      method: 'POST',
      headers: { 'X-Admin-Secret': ADMIN_SECRET },
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Błąd wgrywania obrazu');
    }
    return response.json(); // { url: string }
  },

  async deletePost(id) {
    const response = await fetch(`${API_URL}/blog-admin/posts/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Secret': ADMIN_SECRET },
    });
    if (!response.ok) throw new Error('Failed to delete post');
    return response.json();
  },
};