//@ts-nocheck
import Head from "next/head";
import { useContext } from "react";
import styles from "../styles/Home.module.css";
import UUIDContext from "../context/UUID.js";
import ConnectToLit from "../context/connected.js";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { chain, accessControlConditions, baseUrl } from "../constants/config";
import FirstThreeFiber from "./FirstThreeFiber";

import LitJsSdk from "lit-js-sdk";

const Layout = ({ children }: { children: any }) => {
  const [connected, setConnect] = useContext(ConnectToLit);
  const [uuidCurrent, setUuidCurrent] = useContext(UUIDContext);
  const router = useRouter();

  function navigateHome() {
    router.push("/");
  }

  function disconnectLit() {
    setConnect();
    setUuidCurrent();
    Cookies.set("lit-auth", "0", { expires: 0 });
    LitJsSdk.disconnectWeb3();
  }

  async function connect() {
    const resourceId = {
      baseUrl: baseUrl,
      path: "/protected",
      orgId: "",
      role: "",
      extraData: uuidCurrent,
    };

    const client = new LitJsSdk.LitNodeClient({ alertWhenUnauthorized: false });
    await client.connect();
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });

    await client.saveSigningCondition({
      accessControlConditions,
      chain,
      authSig,
      resourceId,
    });
    try {
      const litjwt = await client.getSignedToken({
        accessControlConditions,
        chain,
        authSig,
        resourceId: resourceId,
      });
      Cookies.set("lit-auth", litjwt, { expires: 1 });
      children.props.setAuthSig(authSig);
      setConnect();
    } catch (err) {
      console.log("error: ", err);
      setUuidCurrent();
    }
  }

  return (
    <>
      <FirstThreeFiber />
      <div
        style={{
          position: "absolute",
          top: "0px",
          right: "0px",
          left: "0px",
          bottom: "0px",
          zIndex: 1,
        }}
      >
        <div
          id="layout-main"
          data-theme="synthwave"
          className={styles.container}
        ></div>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a
              className="btn btn-ghost normal-case text-xl"
              onClick={navigateHome}
            >
              Warp Anomaly NFT
            </a>
          </div>
          {!connected ? (
            <button className="btn btn-primary" onClick={connect}>
              Connect Wallet
            </button>
          ) : (
            <div className="flex-1">
              <a
                className="btn btn-ghost normal-case text-xl"
                onClick={disconnectLit}
              >
                Disconnect
              </a>
            </div>
          )}
        </div>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>Warp Anomaly Powered</footer>
      </div>
    </>
  );
};

export default Layout;
