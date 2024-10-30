import { Services } from '../../core/services';
import { BestRoute, Dex } from '../../types/router';

export class Router extends Services {
    /**
     * Finds the best route for a given input and output asset address, pay amount, and optional slippage and DEX.
     *
     * @param {string} inputAssetAddress - The address of the input asset.
     * @param {string} outputAssetAddress - The address of the output asset.
     * @param {bigint} payAmount - The amount to be paid.
     * @param {number} [slippage] - Optional slippage percentage.
     * @param {Dex} [forceDex] - Optional DEX to force the route through.
     * @returns {Promise<BestRoute>} A promise that resolves to the best route.
     *
     * @todo Add validation for address and slippage.
     * @todo If the user doesn't input an address, get the address by asset service.
     */
    public async findBestRoute(
        inputAssetAddress: string,
        outputAssetAddress: string,
        payAmount: bigint,
        slippage?: number,
        forceDex?: Dex,
    ) {
        // TODO if User doesn't input address get address by asset service

        const body = {
            token0: inputAssetAddress,
            token1: outputAssetAddress,
            amount: payAmount.toString(),
            slippage: slippage ?? 'auto',
            token0_symbol: 'SDK',
            token1_symbol: 'SDK',
            init: true,
            dex: forceDex,
        };

        const data = this.client.request.send<BestRoute>({
            url: 'v2/routes/pair',
            method: 'POST',
            data: body,
        });

        return data;
    }
}
