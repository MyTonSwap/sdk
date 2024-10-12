import { beforeEach, expect, test } from 'bun:test';
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

test('it should get list of assets', async () => {
    const assets = await client.assets.getAssets([
        'EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT',
        'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
        'EQD4P32U10snNoIavoq6cYPTQR82ewAjO20epigrWRAup54_',
        'EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS',
        'EQD-cvR0Nz6XAyRBvbhz-abTrRC6sI5tvHvvpeQraV9UAAD7',
        'EQD6Z9DHc5Mx-8PI8I4BjGX0d2NhapaRAK12CgstweNoMint',
        'EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo',
        'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
    ]);
    expect(assets.length).toBeGreaterThan(0);
    expect(assets.length).toBe(8);
});

test('it should search for ton and find it', async () => {
    const assets = await client.assets.getPaginatedAssets(1, false, 'TON');

    expect(assets.length).toBeGreaterThan(0);
    expect(
        assets.filter((item) => item.address === 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c')
            .length,
    ).toBeGreaterThan(0);
});

test('it should get pairs of ton and usdt should be there', async () => {
    const assets = await client.assets.getPairs(
        'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
        1,
        false,
    );
    expect(assets.length).toBeGreaterThan(0);
    expect(
        assets.filter((item) => item.address === 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs')
            .length,
    ).toBeGreaterThan(0);
});

test('it should search pairs of ton and duck should be there', async () => {
    const assets = await client.assets.getPairs(
        'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
        1,
        true,
        'duck',
    );
    expect(assets.length).toBeGreaterThan(0);
    expect(
        assets.filter((item) => item.address === 'EQBTcytZjdZwFLj6TO7CeGvn4aMmqXvbX-nODiApbd011gT3')
            .length,
    ).toBeGreaterThan(0);
});
