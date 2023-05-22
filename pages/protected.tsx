//@ts-nocheck
import type { NextPage } from "next";
import { useCallback, useContext, useEffect, useState } from "react";
import ConnectToLit from "../context/connected.js";
import { baseUrl } from "../constants/config";
import cookieCutter from "cookie-cutter";
import LitJsSdk from "lit-js-sdk";
import { useRouter } from "next/router";
import GameContainer from "../components/GameContainer";

const Protected: NextPage = (props: any) => {
  const [connected] = useContext(ConnectToLit);
  const [jwt, setJwt] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  const GetSpecCookies = useCallback(async () => {
    const litCookieTemp = cookieCutter.get("lit-auth");
    setJwt(litCookieTemp);
  }, []);

  useEffect(() => {
    GetSpecCookies();

    if (jwt === "") {
      return;
    }

    const { query } = router;
    const { verified, payload } = LitJsSdk.verifyJwt({ jwt });

    if (
      payload.baseUrl !== baseUrl ||
      payload.path !== "/protected" ||
      payload.extraData !== query.id
    ) {
      return;
    } else {
      setIsVerified(verified);
    }
  }, [router, jwt, GetSpecCookies, setIsVerified, isVerified, connected]);

  if (!connected || jwt === "" || !isVerified) {
    return <h2>Unauthorized</h2>;
  } else {
    return <GameContainer authSignature={props.authSig} />;
  }
};

export default Protected;
