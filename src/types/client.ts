export type MyTonSwapClientOptions = {
    apiKey: string;
    baseUrl: string;
};

export type MyTonSwapResponse<Tdata = any, Terror = any> = {
    statusCode: number;
    error: boolean;
    errorData: Terror;
    data: Tdata;
};
