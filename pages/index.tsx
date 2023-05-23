import { FormEvent, useContext, useState } from "react";
import type { NextPage } from "next";
import FirstThreeFiber from "../components/FirstThreeFiber";
import { useEthers, useEtherBalance } from "@usedapp/core";
import useIsOwner from "../hooks/useIsOwner";

const Home: NextPage = (props: any) => {
  const { active, account, chainId, deactivate, activateBrowserWallet } =
    useEthers();
  const isOwner = useIsOwner(account);

  return (
    <div className="relative w-[100vw] h-[100vh]">
      <FirstThreeFiber />

      <nav className=" z-20 navbar bg-base-100 w-full fixed left-0 top-0 shadow-lg flex justify-between">
        <a className="btn btn-ghost normal-case text-xl">Warp Anomaly NFT</a>
        {account ? (
          <button
            className="btn btn-ghost normal-case text-xl"
            onClick={() => {
              deactivate();
            }}
          >
            Disconnect
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => activateBrowserWallet()}
          >
            Connect Wallet
          </button>
        )}
      </nav>

      <div className=" relative flex h-full items-center justify-center flex-col text-center">
        {!account ? (
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello visitor</h1>
            <p className="py-6">Only Warp Anomaly NFT holders may enter</p>
          </div>
        ) : !isOwner ? (
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">You are not NFT holder...</h1>
            <br />
          </div>
        ) : (
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">You are authorized...</h1>
            <br />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
