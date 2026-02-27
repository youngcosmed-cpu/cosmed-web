import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });

/**
 * Request-scoped singleton for server components.
 * React.cache() ensures one QueryClient per RSC request.
 */
export const getQueryClient = cache(makeQueryClient);
