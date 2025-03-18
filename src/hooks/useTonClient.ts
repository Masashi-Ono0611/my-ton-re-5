import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from 'ton';
import { useAsyncInitialize } from './useAsyncInitialize';

export function useTonClient() {
  return useAsyncInitialize(
    async () => {
      try {
        console.log("Initializing TON client...");
        const endpoint = await getHttpEndpoint({ network: 'testnet' });
        console.log("Using endpoint:", endpoint);
        const client = new TonClient({
          endpoint: endpoint
        });
        console.log("TON client initialized successfully");
        return client;
      } catch (error) {
        console.error("Error initializing TON client:", error);
        return null;
      }
    }
  );
} 