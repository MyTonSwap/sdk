import { Services } from '../../core/services';
import { Balance, CustomPayload } from '../../types/swap';

export class TonApi extends Services {
    public async getJettonData(walletAddr: string, jettonAddress: string) {
        const data = await this.client.request.send<Balance>({
            baseURL: 'https://tonapi.io/v2',
            maxBodyLength: Infinity,
            url: `/accounts/${walletAddr}/jettons/${jettonAddress}?supported_extensions=custom_payload`,
        });

        return data;
    }

    public async getCustomPayload(walletAddr: string, jettonAddress: string) {
        const data = await this.client.request.send<CustomPayload>({
            baseURL: 'https://tonapi.io/v2',
            maxBodyLength: Infinity,
            url: `/jettons/${jettonAddress}/transfer/${walletAddr}/payload`,
        });

        return data;
    }
}
