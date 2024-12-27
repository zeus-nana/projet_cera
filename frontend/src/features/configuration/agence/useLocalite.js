import { useQuery } from '@tanstack/react-query';
import ConfigurationService from '../../../services/configurationService.js';

export function useGetAllAgences() {
    const {
        data: localites,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['localites'],
        queryFn: async () => {
            const response = await ConfigurationService.getAllLocalites();
            return response.data.data.localites;
        },
    });

    return { localites, isLoading, error };
}
