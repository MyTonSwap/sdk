import { beforeAll, beforeEach, expect, test } from 'bun:test';
import { MyTonSwapClient } from '../../core/client';
import { toNano } from '@ton/ton';
let client: MyTonSwapClient;
const userWallet = 'UQAaIQh7jVlOEylI8jM8OI1O-yYGZRqUfJRxuR-K57pskl9I';
const hmstrJetton = 'EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo';
beforeEach(() => {
    client = new MyTonSwapClient();
});

test('it should get data for swap from stonfi', async () => {
    const TON = await client.assets.getExactAsset('TON');
    const NOT = await client.assets.getExactAsset('NOT');
    const bestRoute = await client.router.findBestRoute(TON!.address, NOT!.address, 1, 1, 'stonfi');
    const swap = await client.swap.swap(userWallet, bestRoute);
    expect(swap).toBeObject();
    expect(swap?.value).not.toBeUndefined();
    expect(swap?.value).toBeGreaterThan(toNano(1));
});
