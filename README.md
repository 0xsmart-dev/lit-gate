# Lit Gated Two NextJS  

## Explanation

The way this demo is set up, you have to own ANY `0x93Ba6D4b1C2B4921b41986C20B95cF154CA8B9B7` NFT from the Polygon Mumbai testnet to get access to the protected view, but it has to be the specific NFT with a tokenId of 4 to decrypt the Unity game's WASM file.  

## Changing the Encrypt/Decrypt Conditions

You can change the required tokenId by changing line 25 in `functions/decrypt.js` which is `parameters: ['4'],` to another valid integer. Or simply copy the `accessControlConditions` const from line 41 in `components/Layout.tsx` and replace the `accessControlConditions` const on line 17 of `functions/decrypt.js`. This allows any NFT in the `0x93Ba6D4b1C2B4921b41986C20B95cF154CA8B9B7` contract to decrypt the encrypted wasm file. You also need to upload the new encrypted wasm file to `files/`. and name it `tetrisdemoone.wasm.encrypted`. On line 17 in `functions/decrypt.js` which is `const encryptedSymmetricKey = 'MY ENCRYPTION KEY';` replace `MY ENCRYPTION KEY` with your actual Lit Protocol decryption key.  

KEEP IN MIND THAT IF YOU CHANGE THE `accessControlConditions` const in `functions/decrypt.js` IN ANY WAY, YOU HAVE TO GO THROUGH THE LIT PROTOCOL ENCRYPTION PROCESS ALL OVER AGAIN WHICH IS NOT FACILITATED OR EXPLAINED IN THIS APP.  

## Changing the JWT Conditions  

Change `accessControlConditions` const from line 41 in `components/Layout.tsx` to whatever conditions you want. No need to re-encrypt anything as long as the new conditions are similar enough to `accessControlConditions` const in `functions/decrypt.js` to allow for both conditions to be true. In the production release both `accessControlConditions` consts should be the same.  

## Running in Dev mode  
 - run `npm install`  
 - run `netlify dev`  

As of 12/31/22 this app does not run. For some reason I can't get `functions/decrypt.js` to keep a persistant connection with the app which is required to keep a stream of decrypted WASM file information running to the Unity instance.