import { toNano } from '@ton/ton';
import { Services } from '../../core/services';
import { BestRoute, Dex } from '../../types/router';

export class Router extends Services {
    public async findBestRoute(
        inputAssetAddress: string,
        outputAssetAddress: string,
        payAmount: bigint,
        slippage?: number,
        forceDex?: Dex,
    ) {
        // TODO Validation on address, slippage
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
            url: '/swap-process/data/pools-v2',
            method: 'POST',
            data: body,
        });

        return data;
    }
}
