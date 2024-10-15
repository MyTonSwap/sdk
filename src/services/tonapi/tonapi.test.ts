import { beforeAll, beforeEach, expect, test } from 'bun:test';
import { MyTonSwapClient } from '../../core/client';
let client: MyTonSwapClient;
const userWallet = 'UQAaIQh7jVlOEylI8jM8OI1O-yYGZRqUfJRxuR-K57pskl9I';
const hmstrJetton = 'EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo';
beforeEach(() => {
    client = new MyTonSwapClient();
});

test('it should get jetton with custom payload uri', async () => {
    const data = await client.tonapi.getJettonData(userWallet, hmstrJetton);
    expect(data.jetton.custom_payload_api_uri).not.toBeUndefined();
});

test('it should get fail on random address', async () => {
    expect(async () => await client.tonapi.getJettonData(userWallet, 'hmstrJetton')).toThrow();
});

test('it should get user assets in type of map', async () => {
    const data = await client.tonapi.getWalletAssets(
        'UQAaIQh7jVlOEylI8jM8OI1O-yYGZRqUfJRxuR-K57pskl9I',
    );
    expect(data instanceof Map).toBeTrue();
    expect(
        data.get('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c')?.jetton.name,
    ).not.toBeUndefined();

    expect(data.get('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c')?.jetton.name).toEqual(
        'TON',
    );
});

test('it should get asset rate by any address', async () => {
    const rateRaw = await client.tonapi.getAssetsRates([
        '0:0000000000000000000000000000000000000000000000000000000000000000',
    ]);
    expect(
        rateRaw.get('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c')?.USD,
    ).not.toBeUndefined();
    expect(rateRaw.get('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c')?.USD).toBeNumber();
    const rateEq = await client.tonapi.getAssetsRates([
        'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
    ]);
    expect(rateEq.get('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c')?.USD).not.toBeUndefined();
    expect(rateEq.get('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c')?.USD).toBeNumber();
    const rateUq = await client.tonapi.getAssetsRates([
        'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ',
    ]);
    expect(rateUq.get('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c')?.USD).not.toBeUndefined();
    expect(rateUq.get('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c')?.USD).toBeNumber();
});

test(
    'it should wait for transaction to complete',
    async () => {
        const event = await client.tonapi.waitForTransactionResult(
            '935bed287431084c28561677bb4aed200f8b31e93dfb3b88e00c46a7d6c749c1',
        );
        expect(event).not.toBeUndefined();
    },
    { timeout: 100_000 },
);

// test('it should get custom payload for Hamster Kombat Token', async () => {
//     const customPayload = await client.tonapi.getCustomPayload(userWallet, hmstrJetton);
//     expect(customPayload.custom_payload).not.toBeUndefined();
//     expect(customPayload.state_init).not.toBeUndefined();
// });
