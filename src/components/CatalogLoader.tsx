import { useEffect } from 'react';
import { useCatalogStore } from '@/store/catalogStore';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';

/**
 * Component that loads catalogs when the user is authenticated
 * This component doesn't render anything, it just manages the catalog state
 */
export const CatalogLoader = () => {
  const { isAuthenticated } = useAuthStore();
  const { catalogs, setCatalogs, setLoading } = useCatalogStore();

  useEffect(() => {
    const loadCatalogs = async () => {
      if (!isAuthenticated) return;
      
      // Only load if catalogs haven't been loaded yet
      if (catalogs.length > 0) return;

      try {
        setLoading(true);
        const response = await apiClient.getCatalogList();
        
        if (response.success && response.data) {
          setCatalogs(response.data);
        }
      } catch (error) {
        console.error('Failed to load catalogs:', error);
        // Don't show error toast as this is a background operation
      } finally {
        setLoading(false);
      }
    };

    loadCatalogs();
  }, [isAuthenticated, catalogs.length, setCatalogs, setLoading]);

  return null;
};

