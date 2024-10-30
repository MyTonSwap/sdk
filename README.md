<p align="center">
  <a href="https://app.mytonswap.com" target="blank"><img src="assets/sdk-icon.png" width="130" alt="MyTonSwap logo" /></a>
</p>

<p align="center">SDK for MyTonSwap DEX aggregator</p>


Installation:

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
