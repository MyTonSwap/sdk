import { Services } from '../../core/services';
import { Asset, PaginatedAssets } from '../../types/assets';

export class Assets extends Services {
    /**
     * Retrieves an exact asset from the server.
     *
     * @param {string} asset - The token address you want.
     * @returns {Promise<Asset | null>} A promise that resolves to the token if found, or null if not found.
     */
    public async getExactAsset(token_address: string): Promise<Asset | null> {
        const assets = await this.client.request.send<Asset[]>({
            url: '/swap-process/data/assets/find/exactSearch',
            method: 'POST',
            data: {
                assets: [token_address],
            },
        });
        if (assets.length > 0) {
            return assets[0];
        } else {
            return null;
        }
    }

    /**
     * Retrieves a list of assets from the server based on the provided asset addresses.
     *
     * @param {string[]} assetsAddress - An array of asset addresses to fetch.
     * @returns {Promise<Asset[]>} A promise that resolves to an array of assets.
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
     * Retrieves a paginated list of assets from the server.
     *
     * @param {number} [page=1] page  - The page number to retrieve. Defaults to 1.
     * @param {boolean} [warning=false] warning - A boolean indicating whether to include warnings. Defaults to false.
     * @param {string} [phrase=''] phrase - An optional search phrase to filter the assets.
     * @returns {Promise<PaginatedAssets>} A promise that resolves to a paginated list of assets.
     */
    public async getPaginatedAssets(page = 1, warning = false, phrase?: string) {
        const listOfAssets = await this.client.request.send<PaginatedAssets>({
            url: `/swap-process/data/assets/find/${page}?warning=${warning}${
                phrase ? `&search=${phrase}` : ''
            }`,
        });

        return listOfAssets;
    }

    /**
     * Retrieves a paginated list of asset pairs from the server.
     *
     * @param {string} assetAddress - The address of the asset to fetch pairs for.
     * @param {number} [page=1] - The page number to retrieve. Defaults to 1.
     * @param {boolean} [warning=false] - A boolean indicating whether to include warnings. Defaults to false.
     * @param {string} [searchPhrase=''] - An optional search phrase to filter the asset pairs.
     * @returns {Promise<PaginatedAssets>} A promise that resolves to a paginated list of asset pairs.
     */
    public async getPairs(
        assetAddress: string,
        page = 1,
        warning = false,
        searchPhrase: string = '',
    ) {
        const listOfPairs = await this.client.request.send<PaginatedAssets>({
            url: `https://app.mytonswap.com/api/swap-process/data/assets/pairs/${assetAddress}?page=${page}&warning=${warning}&search=${searchPhrase}`,
        });

        return listOfPairs;
    }
}
