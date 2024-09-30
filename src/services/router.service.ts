import { Services } from '../core/services';
import { BestRoute, Dex } from '../types/router';

export class Router extends Services {
    public async findBestRoute(
        inputAssetAddress: string,
        outputAssetAddress: string,
        payAmount: number,
        slippage?: number,
        forceDex?: Dex,
    ) {
        // TODO Validation on address, slippage
        // TODO if User doesn't input address get address by asset service

        const body = {
            token0: inputAssetAddress,
            token1: outputAssetAddress,
            amount: payAmount,
            slippage: slippage ?? 'auto',
            token0_symbol: 'SDK',
            token1_symbol: 'SDK',
            init: true,
            dex: forceDex,
        };
        const data = this.client.request.send<BestRoute>({
            url: '/swap-process/data/pools',
            method: 'POST',
            data: body,
        });

        return data;
    }
}
