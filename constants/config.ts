export const contractAddress =
  process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS_TESTNET ??
  "0x72127343c6950ADbf2Ccd4B709f94F7e74f9DD70";
export const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY ?? "testkey";

export const networkConfig = {
  readOnlyChainId: 80001,
  readOnlyUrls: {
    80001:
      "https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78",
  },
};
