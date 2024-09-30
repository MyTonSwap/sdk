import { MyTonSwapClientOptions } from '../types/client';
import { defaultBaseUrl } from '../constants';
import { Request } from './request';
import { Assets } from '../services/assets/assets.service';
import { Router } from '../services/router/router.service';
export class MyTonSwapClient {
    public options: { apiKey: string | undefined; baseUrl: string | undefined } | undefined;
    public request = new Request(this);
    public assets = new Assets(this);
    public router = new Router(this);
    constructor(options?: MyTonSwapClientOptions) {
        this.options = options;
    }
}
