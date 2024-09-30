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
