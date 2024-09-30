import { beforeAll, beforeEach, expect, test } from 'bun:test';
import { MyTonSwapClient } from '../../core/client';
let client: MyTonSwapClient;

beforeEach(() => {
    client = new MyTonSwapClient();
});

test('it should get asset by address', async () => {
    const asset = await client.assets.getExactAsset(
        'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
    );
    expect(asset).not.toBeNull();
    expect(asset?.symbol).toBe('TON');
});

test('it should get asset by symbol', async () => {
    const asset = await client.assets.getExactAsset('TON');
    expect(asset).not.toBeNull();
    expect(asset?.address).toBe('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');
});

test("it should return null when asset doesn't exist", async () => {
    const asset = await client.assets.getExactAsset('SOMETOKEN');
    expect(asset).toBeNull();
});

test('it should have liquidity on not ton assets', async () => {
    const asset = await client.assets.getExactAsset('NOT');
    expect(asset?.liquidity).not.toBeNull();
});
