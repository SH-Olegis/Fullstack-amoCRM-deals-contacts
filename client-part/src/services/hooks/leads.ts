import api from '@/services/api'
import type { Lead } from '@/feature/leads/leads-config'
import type { AxiosResponse } from 'axios'

export const useLeadsApi = () => {
  const getLeads = async (searchParam?: string) => {
    return api.get<any, AxiosResponse<Lead>>('/leads', {
      params: {
        search: searchParam
      }
    })
  }

  return {
    getLeads
  }
}
