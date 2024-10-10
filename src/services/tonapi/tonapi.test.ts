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

test('it should get custom payload for Hamster Kombat Token', async () => {
    try {
        const customPayload = await client.tonapi.getCustomPayload(userWallet, hmstrJetton);
        expect(customPayload.custom_payload).not.toBeUndefined();
        expect(customPayload.state_init).not.toBeUndefined();
    } catch (error) {
        console.log(error);
    }
});
