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
};

