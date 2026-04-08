const API_URL = '/api';

export const materialsService = {
  async getMaterials() {
    const response = await fetch(`${API_URL}/materials/`);
    if (!response.ok) throw new Error('Failed to fetch materials');
    return response.json();
  }
};
