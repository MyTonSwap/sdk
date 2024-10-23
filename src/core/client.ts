import { MyTonSwapClientOptions } from '../types/client';
import { Request } from './request';
import { Assets } from '../services/assets/assets.service';
import { Router } from '../services/router/router.service';
import { TonClient } from '@ton/ton';
import { TonApi } from '../services/tonapi/tonapi.service';
import { Swap } from '../services/swap/swap.service';
export class MyTonSwapClient {
    public options: MyTonSwapClientOptions | undefined;
    public request = new Request(this);
    public assets = new Assets(this);
    public router = new Router(this);
    public tonapi = new TonApi(this);
    public swap = new Swap(this);

    public tonClient: TonClient;

    constructor(options?: MyTonSwapClientOptions) {
        this.options = options;
        this.tonClient = new TonClient({
            endpoint: 'https://toncenter.com/api/v2/jsonRPC',
            apiKey: options?.tonCenterApiKey,
        });
    }
}
