import React, { useContext, useEffect } from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";
import { unityBuildPath, unityBuildDataPath, unityBuildWasmName } from '../constants/config';
import ConnectToLit from '../context/connected.js';

const GameContainer = (props: any) => {
  const [connected] = useContext(ConnectToLit);

  const {
    unityProvider,
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
  } = useUnityContext({
    productName: "Christian O Connor - Unity WebGL Tests",
    companyName: "Christian O Connor",
  
    dataUrl: unityBuildDataPath+unityBuildWasmName+".data",
    loaderUrl: unityBuildPath+unityBuildWasmName+".loader.js",
    frameworkUrl: unityBuildPath+unityBuildWasmName+".framework.js",
    codeUrl: "/api/decrypt?authSig="+ JSON.stringify(props.authSignature),

    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });

  useEffect(() => {
    return () => {
      detachAndUnloadImmediate().catch((reason: any) => {
        console.log(reason);
      });
    };
  }, [detachAndUnloadImmediate]);
  
  return (
    <>
      {!connected ?
        <div>Not authorized</div> :
        <Unity unityProvider={unityProvider} style={{ width: 800, height: 600 }} />
      }
    </>
  )
}

export default GameContainer;