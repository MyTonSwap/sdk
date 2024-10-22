import { Services } from '../../core/services';
import { BestRoute } from '../../types/router';
import { SwapResponse } from '../../types/swap';

export class Swap extends Services {
    /**
     * swap
     */
    public async createSwap(userWalletAddress: string, bestRoute: BestRoute, app_id?: string) {
        return await this.client.request.send<SwapResponse>({
            method: 'POST',
            headers: {
                ...(app_id ? { app_id: app_id } : {}),
            },
            url: 'v2/routes/boc',
            data: {
                userWallet: userWalletAddress,
                bestRoute: bestRoute,
            },
        });
    }
}
