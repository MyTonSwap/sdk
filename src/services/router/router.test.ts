import { beforeAll, beforeEach, expect, test } from 'bun:test';
import { MyTonSwapClient } from '../../core/client';
import { toNano } from '../../utils';
let client: MyTonSwapClient;

beforeEach(() => {
    client = new MyTonSwapClient();
});

test('it should find a route for a pair', async () => {
    const asset0 = await client.assets.getExactAsset('TON');
    const asset1 = await client.assets.getExactAsset('STON');
    expect(asset0).not.toBeNull();
    expect(asset1).not.toBeNull();

    const bestRoute = await client.router.findBestRoute(
        asset0!.address,
        asset1!.address,
        toNano(1000),
    );
    expect(bestRoute.selected_pool.dex).toBe('stonfi');
});

test('it should select dedust for scale', async () => {
    const asset0 = await client.assets.getExactAsset('TON');
    const asset1 = await client.assets.getExactAsset('SCALE');
    expect(asset0).not.toBeNull();
    expect(asset1).not.toBeNull();

    const bestRoute = await client.router.findBestRoute(
        asset0!.address,
        asset1!.address,
        toNano(1000),
    );
    expect(bestRoute.selected_pool.dex).toBe('dedust');
});

test('it should select ston for ston', async () => {
    const asset0 = await client.assets.getExactAsset('TON');
    const asset1 = await client.assets.getExactAsset('STON');
    expect(asset0).not.toBeNull();
    expect(asset1).not.toBeNull();

    const bestRoute = await client.router.findBestRoute(
        asset0!.address,
        asset1!.address,
        toNano(1000),
    );
    expect(bestRoute.selected_pool.dex).toBe('stonfi');
});

test('it should impact price on large amount input', async () => {
    const asset0 = await client.assets.getExactAsset('TON');
    const asset1 = await client.assets.getExactAsset('SCALE');
    expect(asset0).not.toBeNull();
    expect(asset1).not.toBeNull();

    const bestRoute = await client.router.findBestRoute(
        asset0!.address,
        asset1!.address,
        toNano(100000),
    );
    expect(bestRoute.pool_data.priceImpact).toBeGreaterThan(90);
});
