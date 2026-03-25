import api from '@/lib/api';
import type { ApiResponse }
from '@/types/api';
import type { DesignationResponseDto, CreateDesignationDto }
from '@/types/backend';

export const designationService = {
  // GET /api/v1/designations
  getAll: async(): Promise<DesignationResponseDto[]> => {
    const response = await api.get<ApiResponse<DesignationResponseDto[]>>('/designations');
    return response.data.data;
},

  // GET /api/v1/designations/:id
  getById: async(id: number): Promise<DesignationResponseDto> => {
    const response = await api.get<ApiResponse<DesignationResponseDto>>(`/ designations /${ id}`);
    return response.data.data;
},

  // POST /api/v1/designations
  create: async(data: CreateDesignationDto): Promise<DesignationResponseDto> => {
    const response = await api.post<ApiResponse<DesignationResponseDto>>('/designations', data);
    return response.data.data;
},

  // DELETE /api/v1/designations/:id
  delete: async(id: number): Promise<void> => {
    await api.delete(`/ designations /${ id}`);
},
};