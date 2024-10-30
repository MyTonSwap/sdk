import { Services } from '../../core/services';
import { BestRoute } from '../../types/router';
import { SwapResponse } from '../../types/swap';

export class Swap extends Services {
    /**
     * Creates a swap request using the provided user wallet address and best route.
     *
     * @param {string} userWalletAddress - The address of the user's wallet.
     * @param {BestRoute} bestRoute - The best route from router.
     * @param {string} [app_id] - Optional application ID to include in the request headers.
     * @returns {Promise<SwapResponse>} A promise that resolves to the swap response.
     */
    public async createSwap(userWalletAddress: string, bestRoute: BestRoute, app_id?: string) {
        return await this.client.request.send<SwapResponse>({
            method: 'POST',
            headers: {
                ...(app_id ? { 'app-id': app_id } : {}),
            },
            url: 'v2/routes/boc',
            data: {
                userWallet: userWalletAddress,
                bestRoute: bestRoute,
            },
        });
    }
}
