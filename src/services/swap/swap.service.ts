import {
    Address,
    address,
    beginCell,
    Cell,
    OpenedContract,
    SenderArguments,
    toNano,
} from '@ton/ton';
import {
    DEDUST_SWAP,
    DEDUST_TRANSFER,
    feeWallet,
    PTON_V2,
    STON_ROUTER_V1,
    supportedMintlessTokens,
    TON_ADDRESS,
} from '../../constants';
import { Services } from '../../core/services';
import { BestRoute } from '../../types/router';
import { Balance, SwapResponse } from '../../types/swap';
import { DEX, pTON } from '@ston-fi/sdk';

import { sleep } from '@lifeomic/attempt';

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
