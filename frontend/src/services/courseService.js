const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const courseService = {
  async getPathDetails(slug) {
    const response = await fetch(`${API_URL}/courses/path/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch path details');
    return response.json();
  },

  async getLessonSlides(lessonId) {
    const response = await fetch(`${API_URL}/slides/${lessonId}`);
    if (!response.ok) throw new Error('Failed to fetch slides');
    return response.json();
  }
};
