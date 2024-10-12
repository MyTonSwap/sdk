export interface Balance {
    balance: string;
    price?: Price;
    wallet_address: WalletAddress;
    jetton: Jetton;
    extensions?: string[];
    lock?: Lock;
}

export interface Jetton {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    image: string;
    verification: string;
    prices?: Prices;
    custom_payload_api_uri?: string;
}

export interface CustomPayload {
    custom_payload: string;
    state_init: string;
}

export interface WalletAssets {
    balances: Balance[];
}
export interface IJettonsRate {
    rates: Rates;
}

export interface Rates {
    [key: string]: Price;
}
export interface Price {
    prices: Prices;
    diff_24h: Diff24h;
    diff_7d: Diff7d;
    diff_30d: Diff30d;
}

export interface Prices {
    [key: string]: number;
}

export interface Diff24h {
    [key: string]: number;
}

export interface Diff7d {
    [key: string]: number;
}

export interface Diff30d {
    TON: string;
}

export interface WalletAddress {
    address: string;
    name?: string;
    is_scam: boolean;
    icon?: string;
    is_wallet: boolean;
}

export interface Lock {
    amount: string;
    till: number;
}

export interface WalletInfo {
    address: string;
    balance: number;
    last_activity: number;
    status: string;
    interfaces: string[];
    get_methods: string[];
    is_wallet: boolean;
}
