import { AttemptOptions, retry } from '@lifeomic/attempt';
import { MyTonSwapClient } from './client';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { defaultsDeep } from 'lodash';
import { MyTonSwapResponse } from '../types/client';
import { defaultBaseUrl } from '../constants';
export class Request {
    attemptOptions: Partial<AttemptOptions<any>> = {
        maxAttempts: 3,
    };
    constructor(private client: MyTonSwapClient) {}
    /**
     * send
     */
    public async send<T = any>(userOptions: AxiosRequestConfig): Promise<T> {
        const defaultOptions = {
            baseURL: this.client.options?.baseUrl ?? defaultBaseUrl,
            headers: userOptions.baseURL
                ? {}
                : {
                      'x-api-key': this.client.options?.apiKey ?? '',
                  },
            method: 'GET',
        } satisfies AxiosRequestConfig;

        const options = defaultsDeep(userOptions, defaultOptions, {
            headers: this.getDefaultHeaders,
        }) satisfies AxiosRequestConfig;

        const response = await this.faultTolerantRequest<MyTonSwapResponse<T>>(options);
        this.handleErrors<T>(response);
        let data;
        if (userOptions.baseURL === defaultBaseUrl) {
            data = this.transformBody(response!.data);
        } else {
            data = response!.data as T;
        }
        return data;
    }

    private handleErrors<T>(responseBody: AxiosResponse<MyTonSwapResponse<T>> | undefined) {
        if (!responseBody) return;
        if (responseBody.data.statusCode <= 200 && responseBody.data.statusCode >= 400) {
            throw new Error(
                `Request failed with ${responseBody.data.statusCode}\nReason: ${responseBody.data.errorData}`,
            );
        } else {
            return;
        }
    }

    /**
     * transformBody
     */
    public transformBody<T = any>(response: MyTonSwapResponse<T>): T {
        return response.data;
    }

    /**
     * faultTolerantRequest
     */
    public async faultTolerantRequest<T>(
        options: AxiosRequestConfig,
    ): Promise<AxiosResponse<T> | undefined> {
        try {
            return await retry(async () => axios.request(options), this.attemptOptions);
        } catch (err) {
            throw err;
        }
    }
    /**
     * getDefaultHeaders
     */
    public getDefaultHeaders() {
        return {
            stats_id: 'SDK',
        };
    }
}
