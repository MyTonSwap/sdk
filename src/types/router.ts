export type Dex = 'stonfi' | 'dedust' | 'tonco';

export interface BestRoute {
    selected_pool: SelectedPool;
    pool_data: PoolData;
}

export interface SelectedPool {
    router_address: string;
    dex: string;
    dex_details: DexDetails;
    reserve0: string;
    reserve1: string;
    token0_address: string;
    token1_address: string;
    fee: number;
}

export interface DexDetails {
    name: string;
    icon_url: string;
}

export interface PoolData {
    router_address: string;
    pay: string;
    receive: string;
    priceImpact: number;
    minimumReceive: string;
    innerMinimumReceive: string;
    blockchainFee: string;
    status: boolean;
    message: string;
    route: string[];
    receive_show: number;
    minimumReceive_show: number;
    route_view: string[];
}
