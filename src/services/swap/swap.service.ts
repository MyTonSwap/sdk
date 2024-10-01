import {
    Address,
    address,
    beginCell,
    Cell,
    OpenedContract,
    SenderArguments,
    toNano,
} from '@ton/ton';
import {
    DEDUST_SWAP,
    DEDUST_TRANSFER,
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
import {
    Asset,
    Factory,
    JettonRoot,
    MAINNET_FACTORY_ADDR,
    Pool,
    PoolType,
    ReadinessStatus,
    Vault,
    VaultJetton,
    VaultNative,
} from '@dedust/sdk';
import { sleep } from '@lifeomic/attempt';

export class Swap extends Services {
    /**
     * swap
     */
    public async swap(userWalletAddress: string, bestRoute: BestRoute) {
        try {
            switch (bestRoute.selected_pool.dex) {
                case 'stonfi':
                    return await this.createStonSwap(userWalletAddress, bestRoute);
                case 'dedust':
                    return await this.createDedustSwap(userWalletAddress, bestRoute);

                default:
                    break;
            }
        } catch (error) {
            console.log(error);
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
        return swapTxParams satisfies SenderArguments;
    }

    private async createDedustSwap(userWalletAddress: string, bestRoute: BestRoute) {
        let [jetton0, jetton1, jetton2] = bestRoute.pool_data.route;

        let Asset0: Asset;
        let Asset1: Asset;
        let Asset2: Asset;
        let Vault0: OpenedContract<VaultNative> | OpenedContract<VaultJetton>;
        let Vault2: OpenedContract<VaultNative> | OpenedContract<VaultJetton>;
        let PoolB: OpenedContract<Pool>;
        let RequestAddress: Address;
        let StoreAddress: Address;

        let TxAmount = toNano('0.3');

        let jettonData: Balance | undefined;
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
        const factory = this.client.tonClient.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));
        if (jetton0 == 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c') {
            if (jetton2 && jetton2 !== '') {
                throw new Error('This request can not process!');
            }

            Asset0 = Asset.native();
            Vault0 = this.client.tonClient.open(await factory.getNativeVault());
        } else {
            Asset0 = Asset.jetton(Address.parse(jetton0));
            Vault0 = this.client.tonClient.open(
                await factory.getJettonVault(Address.parse(jetton0)),
            );
        }
        await sleep(500);
        if (jetton1 == 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c') {
            Asset1 = Asset.native();
        } else {
            Asset1 = Asset.jetton(Address.parse(jetton1));
        }
        await sleep(500);
        const PoolA = this.client.tonClient.open(
            await factory.getPool(PoolType.VOLATILE, [Asset0, Asset1]),
        );
        if (jetton2 && jetton2 !== '') {
            if (jetton2 == 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c') {
                Asset2 = Asset.native();
            } else {
                Asset2 = Asset.jetton(Address.parse(jetton2));
            }
            await sleep(500);

            PoolB = this.client.tonClient.open(
                await factory.getPool(PoolType.VOLATILE, [Asset1, Asset2]),
            );
        }

        let PAY_LOAD: Cell;
        let pay: Cell;
        if (jetton0 == 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c') {
            // @ts-expect-error because dedust doesn't let user to build custom payloads
            PAY_LOAD = Vault.packSwapParams({});

            StoreAddress = PoolA.address;
            RequestAddress = Vault0.address;

            TxAmount = BigInt(bestRoute.pool_data.pay) + toNano('0.1');

            pay = beginCell()
                .storeUint(DEDUST_SWAP, 32)
                .storeUint(0, 64)
                .storeCoins(BigInt(bestRoute.pool_data.pay))
                .storeAddress(StoreAddress)
                .storeUint(0, 1)
                .storeCoins(0)
                .storeMaybeRef(null)
                .storeRef(PAY_LOAD)
                .endCell();
        } else {
            const JRoot = this.client.tonClient.open(
                JettonRoot.createFromAddress(Address.parse(jetton0)),
            );
            const JWallet = this.client.tonClient.open(
                await JRoot.getWallet(Address.parseRaw(userWalletAddress)),
            );

            StoreAddress = Vault0.address;
            RequestAddress = JWallet.address;

            if (jetton2 == '') {
                PAY_LOAD = VaultJetton.createSwapPayload({
                    poolAddress: Address.parse(PoolA.address.toString()),
                });
            } else {
                PAY_LOAD = VaultJetton.createSwapPayload({
                    poolAddress: Address.parse(PoolA.address.toString()),
                    limit: BigInt(bestRoute.pool_data.innerMinimumReceive),
                    next: {
                        poolAddress: PoolB!.address,
                    },
                });
            }

            pay = beginCell()
                .storeUint(DEDUST_TRANSFER, 32)
                .storeUint(0, 64)
                .storeCoins(BigInt(bestRoute.pool_data.pay))
                .storeAddress(StoreAddress)
                .storeAddress(Address.parseRaw(userWalletAddress))
                .storeMaybeRef(customPayload ? customPayload : null)
                .storeCoins(toNano('0.25'))
                .storeMaybeRef(PAY_LOAD)
                .endCell();
        }
        return {
            to: RequestAddress,
            value: isMintless ? TxAmount + toNano(0.07) : TxAmount,
            body: pay,
            init: stateInit,
        } satisfies SenderArguments;
    }
}
