import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import {
  PerspectiveCamera,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import Head from "next/head";
import React from "react";
import {
  EffectComposer,
  GammaCorrectionShader,
  RGBShiftShader,
  RenderPass,
  ShaderPass,
  UnrealBloomPass,
} from "three-stdlib";
import { MeshStandardMaterial, Vector2 } from "three";
import CustomShaderMaterial from "three-custom-shader-material";

const fragmentShader = `
varying vec2 vUv;
float aastep(in float threshold, in float value) {
  float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
  return 1.0 - smoothstep(threshold-afwidth, threshold+afwidth, value);
}

void main() {

  float lw = 1.0;
  float w;

  float gx = 1.0 + cos(vUv.x * 24.0 * 2.0 * PI - PI);
  w = fwidth(vUv.x) * lw;
  gx = aastep(w, gx);

  float gy = 1.0 + cos(vUv.y * 24.0 * 2.0 * PI - PI);
  w = fwidth(vUv.y) * lw;
  gy = aastep(w, gy);

  float grid = gx + gy;
  
  csm_DiffuseColor = vec4(grid, grid * 0.5, grid * 0.5, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;

  }
`;

/**
 * Lots of great examples on how to handle effects are available at: https://onion2k.github.io/r3f-by-example
 */

// Read more about extend at https://docs.pmnd.rs/react-three-fiber/api/objects#using-3rd-party-objects-declaratively
extend({ EffectComposer, RenderPass, ShaderPass, UnrealBloomPass });

/**
 * This component renders the terrain composed of:
 * - a plane geometry
 * - a mesh standard material where we added:
 *   - a displacementMap for the topography
 *   - a texture for the grid
 *   - a metalnessMap for the reflective parts
 */
const Terrain = React.forwardRef((props, ref) => {
  const { z } = props;
  const materialRef = React.useRef();

  const [heightTexture, metalnessTexture] = useTexture([
    "assets/images/displacement-7.png",
    "assets/images/metalness-2.png",
  ]);

  return (
    <mesh ref={ref} position={[0, 0, z]} rotation={[-Math.PI * 0.5, 0, 0]}>
      <planeGeometry arrach="geometry" args={[1, 2, 24, 24]} />
      <CustomShaderMaterial
        ref={materialRef}
        baseMaterial={MeshStandardMaterial}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        displacementMap={heightTexture}
        displacementScale={0.4}
        metalnessMap={metalnessTexture}
        metalness={0.9}
        roughness={0.5}
      />
    </mesh>
  );
});

Terrain.displayName = "Terrain";

/**
 * This component renders the landscape:
 * - 2 Terrains behing one one another
 * - each terrain moves along the z axis creating an "endless moving animation"
 */
const Landscape = () => {
  const terrain1Ref = React.useRef();
  const terrain2Ref = React.useRef();

  useFrame((state) => {
    // Update plane position
    terrain1Ref.current.position.z = (state.clock.elapsedTime * 0.15) % 2;
    terrain2Ref.current.position.z = ((state.clock.elapsedTime * 0.15) % 2) - 2;
  });

  return (
    <>
      <Terrain ref={terrain1Ref} z={0} />
      <Terrain ref={terrain2Ref} z={-2} />
    </>
  );
};

/**
 * This component renders the post-processing effects we're using for this scene:
 * - a RGBShift
 * - an UnrealBloom pass
 * - a GammaCorrection to fix the colors
 *
 * Note: I had to set the Canvas linear prop to true to make effects work!
 * See the canva API for more info: https://docs.pmnd.rs/react-three-fiber/api/canvas
 */
const Effects = () => {
  const composerRef = React.useRef();
  const rgbShiftRef = React.useRef();
  const { gl, scene, camera, size } = useThree();

  React.useEffect(() => {
    composerRef?.current.setSize(size.width, size.height);
  }, [size]);

  useFrame(() => {
    if (rgbShiftRef.current) {
      rgbShiftRef.current.uniforms["amount"].value = 0.0012;
    }
    composerRef.current.render();
  }, 0);

  return (
    <effectComposer ref={composerRef} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
    </effectComposer>
  );
};

/**
 * This component renders the Light of the scene which is composed of:
 * - 2 spotlights of high intensity positioned right behind the camera
 * - each spotlight aims at a specific target on opposite sides of the landscapes
 */
const Light = () => {
  const spotlight1Ref = React.useRef();
  const spotlight2Ref = React.useRef();

  spotlight1Ref.current?.target.position.set([-0.25, 0.25, 0.25]);
  spotlight2Ref.current?.target.position.set([0.25, 0.25, 0.25]);

  return (
    <>
      <spotLight
        ref={spotlight1Ref}
        color="#E779C1"
        intensity={10}
        position={[0.5, 0.75, 2.1]}
        distance={25}
        angle={Math.PI * 0.1}
        penumbra={0.25}
        decay={10}
      />
      <spotLight
        ref={spotlight2Ref}
        color="#E779C1"
        intensity={10}
        position={[-0.5, 0.75, 2.1]}
        distance={25}
        angle={Math.PI * 0.1}
        penumbra={0.25}
        decay={10}
      />
    </>
  );
};

/**
 * This component renders the scene which renders all the components declared above and more:
 * - the moving landscape
 * - the lights
 * - the effect
 * - a black background color
 * - a black fog towards the back of the scene to hide the second terrain showing up every now and then when it appears
 * - orbit controls to play with (it helps a lot during development to drag, rotate objects in the scene)
 * - the perspective camera (our default camera thanks to the makeDefault prop)
 *
 *
 * Note:
 * I used this useEffect / isMounted trick to make sure Next.js doesn't make the scene
 * crash due to the lack of "window". Not the best, but it works. At least we have access to the
 * device pixel ratio immediately when the scene appears the first time.
 *
 */
const FirstThreeFiber = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {!mounted ? null : (
        <Canvas
          style={{
            position: "absolute",
            display: "block",
            top: 0,
            left: 0,
            right: 0,
            bottom: -5,
            zIndex: -10,
            opacity: 0.6,
          }}
          antialias="false"
        >
          <React.Suspense fallback={null}>
            <color attach="background" args={["#432BA5"]} />
            <fog attach="fog" args={["#432BA5", 1, 2.5]} />
            <OrbitControls attach="orbitControls" />
            <PerspectiveCamera
              makeDefault
              position={[0, 0.06, 0.9]}
              fov={75}
              near={0.01}
              far={20}
            />
            <Light />
            <Landscape />
          </React.Suspense>
        </Canvas>
      )}
    </>
  );
};

export default FirstThreeFiber;
