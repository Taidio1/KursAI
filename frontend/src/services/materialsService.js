const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const materialsService = {
  async getMaterials() {
    const response = await fetch(`${API_URL}/materials/`);
    if (!response.ok) throw new Error('Failed to fetch materials');
    return response.json();
  }
};
