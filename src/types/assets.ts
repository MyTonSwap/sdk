export interface PaginatedAssets {
    assets: Asset[];
    meta: Meta;
}

export interface Asset {
    id: number;
    createdAt: string;
    updatedAt: string;
    address: string;
    symbol: string;
    name: string;
    image: string;
    decimal: number;
    disabled: boolean;
    warning: boolean;
    verify_tag: boolean;
    liquidity: number;
    liquidity_text: string;
}

export interface Meta {
    perPage: number;
    currentPage: number;
    nextPage: string;
    totalPage: number;
    previousPage: number;
    isLastPage: boolean;
}
