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
import { TransactionEvent } from '../../types/transaction-event';

export class TonApi extends Services {
    /**
     * Fetches the jetton data for a given wallet address and jetton address.
     *
     * @param {string} walletAddr - The wallet address to fetch the jetton data for.
     * @param {string} jettonAddress - The jetton address to fetch the data from.
     * @returns {Promise<Balance>} A promise that resolves to the balance data.
     */
    public async getJettonData(walletAddr: string, jettonAddress: string) {
        const data = await this.client.request.send<Balance>({
            baseURL: 'https://tonapi.io/v2',
            maxBodyLength: Infinity,
            url: `/accounts/${walletAddr}/jettons/${jettonAddress}?supported_extensions=custom_payload`,
        });

        return data;
    }

    /**
     * Retrieves a custom payload for a specific wallet and jetton address.
     *
     * @param {string} walletAddr - The address of the wallet.
     * @param {string} jettonAddress - The address of the jetton.
     * @returns {Promise<CustomPayload>} A promise that resolves to the custom payload.
     */
    public async getCustomPayload(walletAddr: string, jettonAddress: string) {
        const data = await this.client.request.send<CustomPayload>({
            baseURL: 'https://tonapi.io/v2',
            maxBodyLength: Infinity,
            url: `/jettons/${jettonAddress}/transfer/${walletAddr}/payload`,
        });

        return data;
    }

    /**
     * Retrieves wallet assets for a given wallet address, including balances and rates for jettons.
     *
     * @param {string} walletAddress - The address of the wallet to retrieve assets for.
     * @param {string[]} [currencies=['usd']] - An array of currency codes to retrieve rates for.
     * @param {boolean} [custom_payload=true] - Whether to include custom payload in the request.
     * @returns {Promise<Map<string, Balance>>} A promise that resolves to a map of balances keyed by jetton addresses.
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
     * Fetches the rates of specified assets from the TON API.
     *
     * @param {string[]} assetsAddresses - An array of asset addresses to fetch rates for.
     * @returns {Promise<Map<string, Prices>>} A promise that resolves to a map where the keys are user-friendly asset addresses and the values are their corresponding prices.
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

    /**
     * waitForTransactionResult
     */
    /**
     * Waits for a transaction result by periodically checking the transaction status.
     *
     * @param {string} hash - The hash of the transaction to wait for.
     * @param {number} [period_ms=3000] - The period in milliseconds to wait between checks.
     * @param {number} [maxRetry=30] - The maximum number of retries before giving up.
     * @returns {Promise<TransactionEvent>} - A promise that resolves with the transaction result when complete.
     * @throws {Error} - Throws an error if the maximum number of retries is reached.
     */
    public async waitForTransactionResult(
        hash: string,
        period_ms: number = 3000,
        maxRetry: number = 30,
    ) {
        let retries = 0;
        while (retries <= maxRetry) {
            try {
                let result = await this.client.tonapi.getTransactionEvent(hash);
                while (this.allTransactionComplete(result) === 'inprogress') {
                    await new Promise((resolve) => setTimeout(resolve, period_ms));
                    result = await this.client.tonapi.getTransactionEvent(hash);
                    retries++;
                    if (retries > maxRetry) {
                        throw new Error('Max retries reached');
                    }
                }
                return result;
            } catch (error) {
                await new Promise((resolve) => setTimeout(resolve, period_ms));
                retries++;
                if (retries > maxRetry) {
                    throw new Error('Max retries reached');
                }
            }
        }
        throw new Error('Max retries reached');
    }

    /**
     * Fetches a transaction event from the TON API using the provided hash.
     *
     * @param {string} hash - The hash of the transaction event to retrieve.
     * @returns {Promise<TransactionEvent>} A promise that resolves to the transaction event.
     */
    public async getTransactionEvent(hash: string) {
        const event = await this.client.request.send<TransactionEvent>({
            baseURL: 'https://tonapi.io/v2',
            url: `/events/${hash}`,
        });
        return event;
    }

    /**
     * Checks if all transactions in the given event are complete.
     *
     * @param {TransactionEvent} event - The transaction event to check.
     * @returns {string} - Returns `ok` if all transactions are complete and successful, otherwise `failed` or `inprogress`.
     * @throws {Error} - Throws an error if any transaction action has a status other than 'ok'.
     */
    public allTransactionComplete(event: TransactionEvent) {
        if (event.in_progress) return 'inprogress';
        if (event.actions.some((item) => item.status !== 'ok')) return 'failed';
        return 'ok';
    }
}
