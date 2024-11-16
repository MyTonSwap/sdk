<p align="center">
  <a href="https://app.mytonswap.com" target="blank"><img src="assets/sdk-icon.png" width="130" alt="MyTonSwap logo" /></a>
</p>

<p align="center">SDK for MyTonSwap DEX aggregator</p>

![GitHub package.json version](https://img.shields.io/github/package-json/v/mytonswap/sdk?style=for-the-badge&color=%230f904d)
![GitHub last commit](https://img.shields.io/github/last-commit/mytonswap/sdk?style=for-the-badge&color=%230f904d)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/mytonswap/sdk/main.yml?style=for-the-badge&color=%230f904d)
![NPM Downloads](https://img.shields.io/npm/dw/%40mytonswap%2Fsdk?style=for-the-badge&color=%230f904d)

# Mytonswap SDK

The *Mytonswap SDK* is a comprehensive JavaScript library for integrating with the TON blockchain, allowing you to access assets, find optimal swap routes, and create swap payloads with ease. This SDK is designed to streamline TON blockchain interactions, making it suitable for DeFi applications, dApps, and wallets.

## Features

- **Access to TON Blockchain Assets**:
  - Retrieve a specific asset by address or identifier.
  - Fetch a paginated list of assets for browsing and filtering.
  - Search for assets by name, ticker, or other identifying information.

- **Token Swap Optimization**:
  - Calculate the best swap route between tokens to minimize fees and maximize returns.

- **Swap Payload Creation**:
  - Generate a ready-to-use payload for seamless token swaps on the TON blockchain.

- **Built-in Utility Functions**:
  - Easily convert between Ton units using `toNano` and `fromNano` functions.



## Installation

```bash
npm install @mytonswap/sdk
```

## Usage

Here's a basic example of how to use the MyTonSwap SDK:

```ts
import { MyTonSwapClient, toNano } from '@mytonswap/sdk';

const client = new MyTonSwapClient();

async function performSwap() {
  const userWallet = 'your-wallet-address';
  const TON = await client.assets.getExactAsset('TON');
  const NOT = await client.assets.getExactAsset('NOT');
  const bestRoute = await client.router.findBestRoute(
    TON!.address,
    NOT!.address,
    toNano(1),
    1,
  );

  const swap = await client.swap.createSwap(userWallet, bestRoute);
  console.log(swap);
}

performSwap();
```


## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, feel free to open an issue on our [GitHub repository](https://github.com/MyTonSwap/sdk/issues).
