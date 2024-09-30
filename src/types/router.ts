export type Dex = 'stonfi' | 'dedust';

export interface BestRoute {
    selected_pool: SelectedPool;
    pool_data: PoolData;
}

export interface SelectedPool {
    router_address: string;
    dex: string;
    reserve0: string;
    reserve1: string;
    token0_address: string;
    token1_address: string;
    fee: number;
}

export interface PoolData {
    router_address: string;
    pay: number;
    receive: number;
    priceImpact: number;
    minimumReceive: number;
    innerMinimumReceive: number;
    blockchainFee: string;
    status: boolean;
    message: string;
    route: string[];
    receive_show: number;
    minimumReceive_show: number;
    route_view: string[];
}
