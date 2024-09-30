import { Services } from '../core/services';
import { Asset } from '../types/assets';

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
}
