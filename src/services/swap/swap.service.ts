import { address, Cell, SenderArguments, toNano } from '@ton/ton';
import {
    feeWallet,
    PTON_V2,
    STON_ROUTER_V1,
    supportedMintlessTokens,
    TON_ADDRESS,
} from '../../constants';
import { Services } from '../../core/services';
import { BestRoute } from '../../types/router';
import { Balance, CustomPayload } from '../../types/swap';
import { DEX, pTON } from '@ston-fi/sdk';

export class Swap extends Services {
    /**
     * swap
     */
    public async swap(userWalletAddress: string, bestRoute: BestRoute) {
        switch (bestRoute.selected_pool.dex) {
            case 'stonfi':
                return await this.createStonSwap(userWalletAddress, bestRoute);
            case 'dedust':
                break;
            default:
                break;
        }
    }

    /**
     * createStonSwap
     *
     */
    private async createStonSwap(userWalletAddress: string, bestRoute: BestRoute) {
        let jettonData: Balance | undefined;
        let swapTxParams: SenderArguments | null = null;
        const isMintless = supportedMintlessTokens.includes(bestRoute.selected_pool.token0_address);
        if (isMintless) {
            jettonData = await this.client.tonapi.getJettonData(
                userWalletAddress,
                bestRoute.selected_pool.token0_address,
            );
        }

        let customPayload: Cell | undefined;
        let stateInit: { code: Cell; data: Cell } | undefined;

        if (isMintless && jettonData?.extensions?.includes('custom_payload')) {
            const offerJettonCustomPayload = await this.client.tonapi.getCustomPayload(
                userWalletAddress,
                bestRoute.selected_pool.token0_address,
            );

            if (!offerJettonCustomPayload) {
                throw new Error('Unable to retrieve custom payload. Please try again.');
            }
            customPayload = Cell.fromBoc(
                Buffer.from(offerJettonCustomPayload.custom_payload, 'hex'),
            )[0];
            const stateInitCell = Cell.fromBoc(
                Buffer.from(offerJettonCustomPayload.state_init, 'hex'),
            )[0].beginParse();

            stateInit = {
                code: stateInitCell.loadRef(),
                data: stateInitCell.loadRef(),
            };
        }

        const router =
            bestRoute.selected_pool.router_address === STON_ROUTER_V1
                ? this.client.tonClient.open(
                      DEX.v1.Router.create(bestRoute.selected_pool.router_address),
                  )
                : this.client.tonClient.open(
                      DEX.v2_1.Router.create(bestRoute.selected_pool.router_address),
                  );

        const pTon =
            bestRoute.selected_pool.router_address === STON_ROUTER_V1
                ? new pTON.v1()
                : new pTON.v2_1(PTON_V2);
        const gasConstants =
            bestRoute.selected_pool.router_address === STON_ROUTER_V1
                ? DEX.v1.Router.gasConstants
                : DEX.v2_1.Router.gasConstants;

        console.log(bestRoute.pool_data.route[0]);
        if (bestRoute.pool_data.route[0] === TON_ADDRESS) {
            swapTxParams = await router.getSwapTonToJettonTxParams({
                userWalletAddress: userWalletAddress,
                proxyTon: pTon,
                offerAmount: bestRoute.pool_data.pay,
                askJettonAddress: bestRoute.pool_data.route[1],
                minAskAmount: BigInt(bestRoute.pool_data.minimumReceive),
                referralAddress: address(feeWallet),
            });
        } else if (bestRoute.pool_data.route[1] === TON_ADDRESS) {
            swapTxParams = await router.getSwapJettonToTonTxParams({
                userWalletAddress: userWalletAddress,
                offerJettonAddress: bestRoute.pool_data.route[0],
                offerAmount: bestRoute.pool_data.pay,
                proxyTon: pTon,
                jettonCustomPayload: customPayload ? customPayload : undefined,
                minAskAmount: BigInt(bestRoute.pool_data.minimumReceive),
                referralAddress: feeWallet,
                gasAmount: isMintless
                    ? gasConstants.swapJettonToJetton.gasAmount + toNano(0.1)
                    : undefined,
            });
        } else {
            swapTxParams = await router.getSwapJettonToJettonTxParams({
                userWalletAddress: userWalletAddress,
                offerJettonAddress: bestRoute.selected_pool.token0_address,
                offerAmount: BigInt(bestRoute.pool_data.pay),
                askJettonAddress: bestRoute.selected_pool.token1_address,
                jettonCustomPayload: customPayload ? customPayload : undefined,

                minAskAmount: BigInt(bestRoute.pool_data.minimumReceive),
                referralAddress: address(feeWallet),
                gasAmount: stateInit
                    ? gasConstants.swapJettonToJetton.gasAmount + toNano(0.1)
                    : undefined,
            });
        }
        return swapTxParams;
    }

    private async createDedustSwap(userWalletAddress: string, bestRoute: BestRoute) {
        let [asset0, asset1, asset2] = bestRoute.pool_data.route;
        let jettonData: Balance | undefined;
        let swapTxParams: SenderArguments | null = null;
        const isMintless = supportedMintlessTokens.includes(bestRoute.selected_pool.token0_address);
        if (isMintless) {
            jettonData = await this.client.tonapi.getJettonData(
                userWalletAddress,
                bestRoute.selected_pool.token0_address,
            );
        }

        let customPayload: Cell | undefined;
        let stateInit: { code: Cell; data: Cell } | undefined;

        if (isMintless && jettonData?.extensions?.includes('custom_payload')) {
            const offerJettonCustomPayload = await this.client.tonapi.getCustomPayload(
                userWalletAddress,
                bestRoute.selected_pool.token0_address,
            );

            if (!offerJettonCustomPayload) {
                throw new Error('Unable to retrieve custom payload. Please try again.');
            }
            customPayload = Cell.fromBoc(
                Buffer.from(offerJettonCustomPayload.custom_payload, 'hex'),
            )[0];
            const stateInitCell = Cell.fromBoc(
                Buffer.from(offerJettonCustomPayload.state_init, 'hex'),
            )[0].beginParse();

            stateInit = {
                code: stateInitCell.loadRef(),
                data: stateInitCell.loadRef(),
            };
        }
    }
}
