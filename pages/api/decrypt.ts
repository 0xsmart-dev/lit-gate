import { NextApiRequest, NextApiResponse } from 'next';
var LitJsSdk = require("lit-js-sdk/build/index.node.js");
import { env } from '../../constants/env'
const {
  TESTING_MODE ,
  ENCRYPTED_FILE_LOCATION_BASE_URL_DEV,
  ENCRYPTED_FILE_LOCATION_BASE_URL_PROD,
  NFT_CONTRACT_ADDRESS_TESTNET,
  TOKENID_TESTNET,
  NFT_CONTRACT_ADDRESS_MAINNET,
  TOKENID_MAINNET,
  LIT_CHAIN_TESTNET,
  LIT_CHAIN_MAINNET,
  DECRYPT_SYMMETRIC_KEY,
  UNITY_APP_NAME,
  UNITY_BUILD_PATH,
} = env

///////////SETUP SERVER/////////////////////////////
console.log('STEP 1:INIT INITIAL PARAMETERS ')
const encryptedSymmetricKey = DECRYPT_SYMMETRIC_KEY;
const baseUrl = ENCRYPTED_FILE_LOCATION_BASE_URL_DEV;
const url =  baseUrl  + UNITY_BUILD_PATH + UNITY_APP_NAME +'.wasm.encrypted';
console.log('wasm file location : ', url)
const chain = (TESTING_MODE == 'false' ? LIT_CHAIN_MAINNET : LIT_CHAIN_TESTNET);
const accessControlConditions =
  [
    {
      contractAddress: TESTING_MODE == 'false' ? NFT_CONTRACT_ADDRESS_MAINNET : NFT_CONTRACT_ADDRESS_TESTNET,
      standardContractType: 'ERC721',
      chain,
      method: 'ownerOf',
      parameters: [TESTING_MODE == 'false' ? TOKENID_MAINNET : TOKENID_TESTNET],
      returnValueTest: {
        comparator: '=',
        value: ':userAddress'
      },
    },
  ]

console.log('access control condition:')
console.log(accessControlConditions)
/////////////////////////////////////////////////////


console.log('STEP 2: SETUP THE FUNCTIONS USED TO DECRYPT WASM FILES')

async function initAndDecrypt(authSig: any) {
  console.log('logTheInput',{
    encryptedSymmetricKey,
    baseUrl ,
    url ,
    chain ,
    accessControlConditions ,

  })
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
  });
  await litNodeClient.connect();
  console.log('URL-->',url)
  const encrypted = await fetch(url)
    .then(res => res.text())
    .then(response => { return response });

  const check = LitJsSdk.uint8arrayFromString(
    encryptedSymmetricKey,
    "base64"
  );
  console.log(check)

  const symmetricKey = await litNodeClient.getEncryptionKey({
    accessControlConditions,
    // Note, below we convert the encryptedSymmetricKey from a UInt8Array to a hex string. 
    // This is because we obtained the encryptedSymmetricKey from "saveEncryptionKey" 
    //which returns a UInt8Array.  But the getEncryptionKey method expects a hex string.
    toDecrypt: LitJsSdk.uint8arrayToString(check, "base16"),
    chain,
    //@ts-ignore
    //  authSig: JSON.parse(decodeURI(authSig))
    authSig
  })

  console.log(typeof encrypted)
  const arrayBuffer = LitJsSdk.uint8arrayFromString(
    encrypted,
    "base64"
  ).buffer;
  //@ts-ignore
  const blob = new Blob([arrayBuffer])

  console.log(blob)

  console.log('CHECK -->> :', arrayBuffer)

  const decryptedString = await LitJsSdk.decryptString(
    blob,
    symmetricKey
  );
  // console.log(decryptedString)
  return decryptedString

}


export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    //@ts-ignore
    let authSig = JSON.parse(request.query.authSig)


    const decrypted = await initAndDecrypt(authSig)

    var buffer = Buffer.from(decrypted.split(',')[1], 'base64');

    response.writeHead(200, {
      'Content-Type': 'application/wasm',
      'Content-Length': buffer.length
    });
    response.end(buffer);
  } catch (e) {
    console.log(e)
    response.send(JSON.stringify(e));
  }
  console.log(request.query.authSig)
}