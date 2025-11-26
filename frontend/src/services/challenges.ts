import { api, unwrapResults } from './api';

export const challengesAPI = {
  getLearningObjectives: async () => {
    const response = await api.get('/challenges/learning-objectives/');
    return unwrapResults(response.data);
  },

  getActivities: async (params?: Record<string, any>) => {
    const response = await api.get('/challenges/activities/', { params });
    return unwrapResults(response.data);
  },

  getActivityById: async (activityId: number | string) => {
    const response = await api.get(`/challenges/activities/${activityId}/`);
    return response.data;
  },

  getChallengeById: async (challengeId: number | string) => {
    const response = await api.get(`/challenges/challenges/${challengeId}/`);
    return response.data;
  },

  getTopics: async (params?: Record<string, any>) => {
    const response = await api.get('/challenges/topics/', { params });
    return unwrapResults(response.data);
  },

  getTopicById: async (topicId: number | string) => {
    const response = await api.get(`/challenges/topics/${topicId}/`);
    return response.data;
  },

  getChallenges: async (params?: Record<string, any>) => {
    const response = await api.get('/challenges/challenges/', { params });
    return unwrapResults(response.data);
  },

  updateActivity: async (activityId: number | string, data: Partial<{
    name?: string;
    description?: string | null;
    order_number?: number;
    timer_duration?: number | null;
    is_active?: boolean;
    config_data?: any;
  }>) => {
    const response = await api.patch(`/challenges/activities/${activityId}/`, data);
    return response.data;
  },

  // Topics CRUD
  createTopic: async (data: {
    name: string;
    icon?: string;
    description?: string;
    image_url?: string;
    category?: string;
    faculty_ids?: number[];
    is_active?: boolean;
  }) => {
    const response = await api.post('/challenges/topics/', data);
    return response.data;
  },

  updateTopic: async (topicId: number | string, data: Partial<{
    name?: string;
    icon?: string;
    description?: string;
    image_url?: string;
    category?: string;
    faculty_ids?: number[];
    is_active?: boolean;
  }>) => {
    const response = await api.patch(`/challenges/topics/${topicId}/`, data);
    return response.data;
  },

  deleteTopic: async (topicId: number | string) => {
    const response = await api.delete(`/challenges/topics/${topicId}/`);
    return response.data;
  },

  // Challenges CRUD
  createChallenge: async (data: {
    topic: number;
    title: string;
    description?: string;
    icon?: string;
    persona_name?: string;
    persona_age?: number;
    persona_story?: string;
    persona_image?: File | null;
    difficulty_level?: 'low' | 'medium' | 'high';
    learning_objectives?: string;
    additional_resources?: string;
    is_active?: boolean;
  }) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'persona_image' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (data[key as keyof typeof data] !== undefined && data[key as keyof typeof data] !== null) {
        formData.append(key, String(data[key as keyof typeof data]));
      }
    });
    const response = await api.post('/challenges/challenges/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateChallenge: async (challengeId: number | string, data: Partial<{
    topic?: number;
    title?: string;
    description?: string;
    icon?: string;
    persona_name?: string;
    persona_age?: number;
    persona_story?: string;
    persona_image?: File | null;
    difficulty_level?: 'low' | 'medium' | 'high';
    learning_objectives?: string;
    additional_resources?: string;
    is_active?: boolean;
  }>) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'persona_image' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (data[key as keyof typeof data] !== undefined && data[key as keyof typeof data] !== null) {
        formData.append(key, String(data[key as keyof typeof data]));
      }
    });
    const response = await api.patch(`/challenges/challenges/${challengeId}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteChallenge: async (challengeId: number | string) => {
    const response = await api.delete(`/challenges/challenges/${challengeId}/`);
    return response.data;
  },
};

