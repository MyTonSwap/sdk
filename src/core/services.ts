import { MyTonSwapClient } from './client';

export abstract class Services {
    protected client: MyTonSwapClient;
    constructor(client: MyTonSwapClient) {
        this.client = client;
    }
}
