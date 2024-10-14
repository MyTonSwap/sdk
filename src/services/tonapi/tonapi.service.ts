import { address } from '@ton/ton';
import { Services } from '../../core/services';
import {
    Balance,
    CustomPayload,
    IJettonsRate,
    Prices,
    WalletAssets,
    WalletInfo,
} from '../../types/swap';

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

    /**
     * getWalletAssets
     */
    public async getWalletAssets(
        walletAddress: string,
        currencies: string[] = ['usd'],
        custom_payload: boolean = true,
    ) {
        const { balances } = await this.client.request.send<WalletAssets>({
            baseURL: 'https://tonapi.io/v2',
            maxBodyLength: Infinity,
            url: `/accounts/${walletAddress}/jettons?currencies=${currencies.join(',')}${
                custom_payload ? '&supported_extensions=custom_payload' : ''
            }`,
        });

        const addresses = balances.map((item) => item.jetton.address).join(',');

        const { rates } = await this.client.request.send<IJettonsRate>({
            baseURL: 'https://tonapi.io/v2',
            url: `/rates?tokens=${
                addresses.length > 0 ? addresses : ''
            },EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c&currencies=usd`,
        });

        const { balance: tonBalance } = await this.client.request.send<WalletInfo>({
            baseURL: 'https://tonapi.io/v2',
            url: `/accounts/${walletAddress}`,
        });

        balances.push({
            balance: String(tonBalance),
            wallet_address: {
                address: walletAddress,
                is_scam: false,
                is_wallet: true,
            },
            jetton: {
                address: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
                symbol: 'TON',
                name: 'TON',
                image: 'https://asset.ston.fi/img/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c/4ecd4687e0b5b8ff21a7fbe03f9d281c26a2dc13eac7b7d16048cc693fe0ec39',
                decimals: 9,
                verification: '',
            },
        });
        const newBalances = balances.reduce((map, item) => {
            const userFriendlyAddr = address(item.jetton.address).toString();
            item.price = rates[userFriendlyAddr];
            map.set(userFriendlyAddr, item);
            return map;
        }, new Map<string, Balance>());
        return newBalances;
    }

    /**
     * getAssetsRates
     */
    public async getAssetsRates(assetsAddresses: string[]) {
        const addresses = assetsAddresses.join(',');
        const { rates } = await this.client.request.send<IJettonsRate>({
            baseURL: 'https://tonapi.io/v2',
            url: `/rates?tokens=${
                addresses.length > 0 ? addresses : ''
            },EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c&currencies=usd`,
        });

        const ratesMap = assetsAddresses.reduce((map, item) => {
            const userFriendlyAddr = address(item).toString();
            map.set(userFriendlyAddr, rates[userFriendlyAddr].prices);
            return map;
        }, new Map<string, Prices>());

        return ratesMap;
    }
}
