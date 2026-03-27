import api from '@/lib/api';
import type { DesignationResponseDto, CreateDesignationDto } from '@/types/backend';

export const designationService = {
  // GET /api/v1/designations
  getAll: async (): Promise<DesignationResponseDto[]> => {
    const response = await api.get<any>('/designations');
    const paginatedData = response.data.data;
    const designations = paginatedData?.data || paginatedData || [];
    return Array.isArray(designations) ? designations : [];
  },

  // GET /api/v1/designations/deleted
  getAllDeleted: async (): Promise<DesignationResponseDto[]> => {
    const response = await api.get<any>('/designations/deleted');
    const paginatedData = response.data.data;
    const designations = paginatedData?.data || paginatedData || [];
    return Array.isArray(designations) ? designations : [];
  },

  // GET /api/v1/designations/:id
  getById: async (id: number): Promise<DesignationResponseDto> => {
    const response = await api.get<any>(`/designations/${id}`);
    return response.data.data || response.data;
  },

  // POST /api/v1/designations
  create: async (data: CreateDesignationDto): Promise<DesignationResponseDto> => {
    const response = await api.post<any>('/designations', data);
    return response.data.data || response.data;
  },

  // PUT /api/v1/designations/:id
  update: async (id: number, data: CreateDesignationDto): Promise<DesignationResponseDto> => {
    const response = await api.put<any>(`/designations/${id}`, data);
    return response.data.data || response.data;
  },

  // DELETE /api/v1/designations/:id
  delete: async (id: number): Promise<void> => {
    console.log('[DesignationService] Deleting designation with id:', id);
    try {
      const response = await api.delete(`/designations/${id}`);
      console.log('[DesignationService] Delete response:', response.data);
    } catch (error: any) {
      console.log('[DesignationService] Delete error:', error.response?.data);
      console.log('[DesignationService] Delete error status:', error.response?.status);
      throw error;
    }
  },

  // POST /api/v1/designations/:id/restore
  restore: async (id: number): Promise<void> => {
    console.log('[DesignationService] Restoring designation with id:', id);
    const response = await api.post(`/designations/${id}/restore`);
    console.log('[DesignationService] Restore response:', response.data);
  },

  // DELETE /api/v1/designations/purge?months=12
  purge: async (months: number = 12): Promise<number> => {
    console.log('[DesignationService] Purging designations older than:', months, 'months');
    const response = await api.delete(`/designations/purge?months=${months}`);
    console.log('[DesignationService] Purge response:', response.data);
    return response.data?.data || 0;
  },
};
