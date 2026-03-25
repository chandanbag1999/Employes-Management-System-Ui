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
    await api.delete(`/designations/${id}`);
  },
};
