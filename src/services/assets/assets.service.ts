import { Services } from '../../core/services';
import { Asset } from '../../types/assets';

export class Assets extends Services {
    public async getExactAsset(asset: string): Promise<Asset | null> {
        const assets = await this.client.request.send<Asset[]>({
            url: '/swap-process/data/assets/find/exactSearch',
            method: 'POST',
            data: {
                assets: [asset],
            },
        });
        if (assets.length > 0) {
            return assets[0];
        } else {
            return null;
        }
    }

    /**
     * getAssets
     */
    public async getAssets(assetsAddress: string[]) {
        const listOfAssets = await this.client.request.send<{ list: Asset[] }>({
            url: '/swap-process/data/assets',
            method: 'POST',
            data: {
                assets: assetsAddress,
            },
        });
        return listOfAssets.list;
    }

    /**
     * searchAssets
     */
    public async searchAssets(phrase: string, page = 1, warning = false) {
        const listOfAssets = await this.client.request.send<{ assets: Asset[] }>({
            url: `/swap-process/data/assets/find/${page}?warning=${warning}&search=${phrase}`,
        });

        return listOfAssets.assets;
    }

    /**
     * getPairs
     */
    public async getPairs(
        assetAddress: string,
        page = 1,
        warning = false,
        searchPhrase: string = '',
    ) {
        const listOfPairs = await this.client.request.send<{ assets: Asset[] }>({
            url: `https://app.mytonswap.com/api/swap-process/data/assets/pairs/${assetAddress}?page=${page}&warning=${warning}&search=${searchPhrase}`,
        });

        return listOfPairs.assets;
    }
}
