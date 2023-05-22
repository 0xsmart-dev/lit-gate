import { FormEvent, useContext, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import UUIDContext from "../context/UUID.js";
import ConnectToLit from "../context/connected.js";

const Home: NextPage = (props: any) => {
  const router = useRouter();
  const [uuidCurrent] = useContext(UUIDContext);
  const [connected] = useContext(ConnectToLit);

  function navigateProtected() {
    router.push(
      `/protected?id=${uuidCurrent}&authSig=${JSON.stringify(props.authSig)}`
    );
  }

  return (
    <>
      <div className="hero min-h-screen bg-base-200"></div>
      <div className="hero-content text-center">
        {!connected ? (
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello visitor</h1>
            <p className="py-6">Only Warp Anomaly NFT holders may enter</p>
          </div>
        ) : (
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">You are authorized...</h1>
            <br />
            <button className="btn btn-primary" onClick={navigateProtected}>
              Protected View
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
