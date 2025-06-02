import {analyticsApi} from '../axios';

export interface AnalyticsEmbedResponse {
  iframeUrl: string;
  error?: string;
}

export const analyticsService = {
  getEmbedUrl: async (dashboard: string): Promise<AnalyticsEmbedResponse> => {
    try {
      const response = await analyticsApi.post<AnalyticsEmbedResponse>('/api/analytics/get-embed-url', { dashboard });
      return response.data;
    } catch (error) {
      console.error('Error fetching embed URL:', error);
      return {
        iframeUrl: '',
        error: 'Failed to fetch embed URL'
      };
    }
  }
};
