export interface Balance {
    balance: string;
    wallet_address: WalletAddress;
    jetton: Jetton;
    extensions?: string[];
}

export interface WalletAddress {
    address: string;
    is_scam: boolean;
    is_wallet: boolean;
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
export interface Prices {
    USD: number;
}

export interface CustomPayload {
    custom_payload: string;
    state_init: string;
}
export interface CustomPayload {
    custom_payload: string;
    state_init: string;
}
