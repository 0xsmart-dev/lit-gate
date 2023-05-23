// @ts-nocheck
import { Contract } from "@ethersproject/contracts";
import { useCall } from "@usedapp/core";
import contractAbi from "../constants/abi";
import { contractAddress } from "../constants/config";

const useIsOwner = (address) => {
  if (!address) return false;
  const { value, error } = useCall({
    contract: new Contract(contractAddress, contractAbi),
    method: "walletOfOwner",
    args: [address],
  }) || { value: [] };
  if (error) {
    console.error("error" + error.message);
    return false;
  }
  console.log(value);
  return value[0] ? value[0].length > 0 : false;
};

export default useIsOwner;
