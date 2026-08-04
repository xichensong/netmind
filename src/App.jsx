import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import "../styles.css";

const links = {
  dashboard: "https://www.netmind.ai/user/dashboard",
  contact: "https://www.netmind.ai/feedback/contact",
  pricing: "https://www.netmind.ai/pricing",
  blog: "https://blog.netmind.ai/",
  agents: "https://www.netmind.ai/agents",
  api: "https://www.netmind.ai/api",
  compute: "https://www.netmind.ai/compute",
  solutions: "https://www.netmind.ai/solutions",
};

const modelLogoUrls = [
  "https://netmindai.blob.core.windows.net/netmind/METMIND5478a2f64273df4dcf4813de341521a3.svg",
  "https://netmindai.blob.core.windows.net/netmind/METMINDcb2482db5614562f115b9ea6139550a9.svg",
  "https://netmindai.blob.core.windows.net/netmind/METMINDf4aa2a2a372ee1e51607ac687296d801.svg",
  "https://netmindai.blob.core.windows.net/netmind/METMINDeae23a39f6dbb6832c5e4a876fea1e69.svg",
  "https://netmindai.blob.core.windows.net/netmind/METMIND699662948c1326f9a0928ec04e0ea080.svg",
  "https://netmindai.blob.core.windows.net/netmind/METMIND2be3c6a5672998af388484de92e9f965.svg",
  "https://netmindai.blob.core.windows.net/netmind/METMIND6dd752be571f3b4b6c1f12389fb22629.svg",
  "https://netmindai.blob.core.windows.net/netmind/METMINDaf4d29046b24cc72fedfca0896438b25.svg",
  "https://netmindai.blob.core.windows.net/netmind/METMIND164dd65e8a5b6bf2c2c2ee34529bf6b0.svg",
  "https://netmindai.blob.core.windows.net/netmind/METMIND08e84fbd09f8ec623a46df10bb9c3720.svg",
  "https://netmindai.blob.core.windows.net/netmind/METMINDf79f80b5a3357fd688593a5d42efe2f0.svg",
  "https://netmindai.blob.core.windows.net/netmind/METMINDc670e053c8a88d81c88fcc1d4967f277.svg",
];

const partnerLogos = [
  "King's College London",
  "Northwestern University",
  "University of Illinois",
  "Tsinghua University",
  "Peking University",
  "Alibaba",
  "Baidu",
  "AWS",
  "Microsoft",
  "Google",
];

const apiCardShuffles = [
  { x: -150, y: 100, rotate: -12 },
  { x: 130, y: -80, rotate: 10 },
  { x: -95, y: -120, rotate: 8 },
  { x: 145, y: 118, rotate: -9 },
];

const computeCardShuffles = [
  { x: -150, y: 90, rotate: -8 },
  { x: 0, y: -120, rotate: 7 },
  { x: 150, y: 92, rotate: 8 },
];

const agentCardShuffles = [
  { x: -165, y: -90, rotate: 9 },
  { x: 0, y: 130, rotate: -8 },
  { x: 165, y: -80, rotate: 8 },
];

const solutionCardShuffles = [
  { x: -150, y: 110, rotate: -10 },
  { x: 0, y: -125, rotate: 8 },
  { x: 150, y: 106, rotate: 10 },
];

function Brand() {
  return (
    <a className="brand" href="https://www.netmind.ai/home" aria-label="NetMind home">
      <svg width="34" height="34" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="brand-mark" aria-hidden="true">
        <g transform="scale(0.9375)">
          <path d="M22.2599 8.94615C22.5633 8.96582 22.8561 9.06648 23.1088 9.23794C23.3781 9.3773 23.6075 9.58464 23.775 9.84004C24.0495 10.3352 24.1537 10.9091 24.0711 11.471C23.9884 12.033 23.7237 12.5509 23.3187 12.9432C22.9488 13.2607 22.5391 13.5271 22.1002 13.7352C21.4192 14.0609 20.8177 14.5354 20.3386 15.1247C19.6851 15.9164 19.1724 16.8176 18.8235 17.7878C18.5593 18.5045 18.4548 19.2717 18.5177 20.0341C18.5654 20.448 18.5654 20.8661 18.5177 21.28C18.4451 21.8819 18.1536 22.4346 17.7002 22.8297C17.2468 23.2247 16.6643 23.4335 16.067 23.4152C15.4649 23.4371 14.8771 23.2258 14.4229 22.8242C13.9687 22.4225 13.682 21.8605 13.6209 21.2522C13.5732 20.8383 13.5732 20.4202 13.6209 20.0063C13.6815 19.2439 13.5772 18.4772 13.3152 17.76C13.1422 17.2782 12.9268 16.8132 12.6717 16.3706C12.4164 15.9251 12.1248 15.5022 11.8 15.1061C11.4618 14.6938 11.0649 14.3347 10.6226 14.0409C10.4202 13.9232 10.1995 13.8418 9.96999 13.8C9.72812 13.8407 9.49772 13.9339 9.29455 14.0733C8.87081 14.3648 8.48977 14.7156 8.16279 15.1154C7.83797 15.5114 7.5464 15.9344 7.29113 16.3798C7.03779 16.8234 6.82251 17.2883 6.64766 17.7693C6.38485 18.4863 6.28198 19.2535 6.34645 20.0156C6.4064 20.5649 6.36618 21.1207 6.2278 21.6552C6.08649 22.1774 5.77589 22.636 5.34613 22.9571C4.91638 23.278 4.39257 23.4427 3.85927 23.4244C3.55805 23.4117 3.26538 23.3191 3.01043 23.1558C2.74334 23.0126 2.51704 22.802 2.35326 22.5445C2.06804 22.0555 1.95052 21.4843 2.01905 20.9204C2.08758 20.3564 2.33831 19.8314 2.73204 19.4274C3.1273 19.1082 3.55947 18.8391 4.01899 18.6261C4.69967 18.3 5.30114 17.8256 5.78056 17.2367C6.10832 16.8418 6.40151 16.4188 6.65678 15.9722C6.90697 15.5276 7.12066 15.063 7.29569 14.5828C7.5596 13.866 7.66402 13.099 7.60146 12.3365C7.54883 11.9229 7.54883 11.5041 7.60146 11.0906C7.77032 10.2337 8.25406 8.95079 9.97915 8.95079C11.7042 8.95079 12.1606 10.192 12.3614 11.1184C12.4167 11.5318 12.4167 11.9508 12.3614 12.3642C12.2988 13.1267 12.4032 13.8938 12.6671 14.6106C12.8419 15.0916 13.0572 15.5565 13.3106 16C13.5656 16.4478 13.8604 16.8711 14.1913 17.2645C14.5475 17.6986 14.9697 18.0722 15.4418 18.3714C15.6394 18.4922 15.8577 18.5739 16.0853 18.6122C16.3343 18.5662 16.5716 18.4702 16.7835 18.3297C17.2274 18.036 17.6257 17.677 17.9655 17.2645C18.2884 16.8592 18.577 16.4269 18.8281 15.9722C19.0815 15.5287 19.2968 15.0638 19.4715 14.5828C19.7331 13.8655 19.8375 13.0989 19.7773 12.3365C19.7305 11.8736 19.7427 11.4066 19.8138 10.947C19.9781 10.1179 20.941 8.87668 22.2599 8.94615Z" fill="#0A0A0A" fillRule="evenodd" clipRule="evenodd"></path>
          <circle cx="27.6908" cy="21.085" r="2.31" fill="#D97757"></circle>
        </g>
      </svg>
      <span>Net<span>Mind</span></span>
    </a>
  );
}

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const easeInOut = (value) => value * value * (3 - 2 * value);

const platformDetails = [
  { level: "L4", title: "Solutions", text: "Vertical AI products" },
  { level: "L3", title: "AI Agents", text: "Arena42 · NarraNexus · Manyfold" },
  { level: "L2", title: "NetMind API", text: "100+ models, one endpoint" },
  { level: "L1", title: "Compute", text: "Massive GPU fleet" },
];

const productPlatformMap = {
  solutions: {
    color: "#db9f89",
    index: 0,
    title: "Solutions",
    text: "Document automation, speech analytics, support automation",
    items: ["Business Solutions", "AI Apps", "Custom Solution"],
  },
  agents: {
    color: "#eeeae1",
    index: 1,
    title: "AI Agents",
    text: "Arena42, NarraNexus, Manyfold",
    items: ["Arena42", "NarraNexus", "Manyfold"],
  },
  api: {
    color: "#ddd8cc",
    index: 2,
    title: "NetMind API",
    text: "100+ frontier models, one endpoint",
    items: ["Models", "Smart Model", "Smart Tools", "SDK"],
  },
  compute: {
    color: "#cfc8ba",
    index: 3,
    title: "Compute",
    text: "H100, A100, RTX 4090 - on-demand or reserved",
    items: ["GPU Clusters", "Dedicated Endpoint", "Request Cluster"],
  },
};

const platformContentByIndex = Object.values(productPlatformMap).reduce((items, item) => {
  items[item.index] = item;
  return items;
}, []);

function BackgroundGradientScene() {
  const material = useRef();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
    }),
    []
  );

  useFrame(({ clock, size }) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.getElapsedTime();
    material.current.uniforms.uAspect.value = size.width / Math.max(1, size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `}
        fragmentShader={`
          precision highp float;

          uniform float uTime;
          uniform float uAspect;
          varying vec2 vUv;

          float circle(vec2 uv, vec2 center, float radius, float blur) {
            float dist = distance(uv, center);
            return 1.0 - smoothstep(radius, radius + blur, dist);
          }

          void main() {
            vec2 uv = vUv;
            vec2 p = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5);
            float t = uTime * 0.055;

            vec2 a = vec2(0.42 * sin(t * 1.3), 0.27 * cos(t * 0.9));
            vec2 b = vec2(0.48 * cos(t * 0.8 + 1.6), 0.32 * sin(t * 1.05 + 0.7));
            vec2 c = vec2(0.28 * sin(t * 1.7 + 2.4), 0.42 * cos(t * 0.7 + 1.1));

            float glow =
              circle(p, a, 0.22, 0.52) * 0.58 +
              circle(p, b, 0.18, 0.46) * 0.42 +
              circle(p, c, 0.16, 0.42) * 0.36;

            float wave = sin((p.x * 2.2 + p.y * 2.8 + t * 4.0)) * 0.5 + 0.5;
            float shade = clamp(glow * 0.5 + wave * 0.1, 0.0, 1.0);

            vec3 white = vec3(1.0);
            vec3 gray = vec3(0.62, 0.62, 0.6);
            vec3 color = mix(white, gray, shade);

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function BackgroundShader() {
  return (
    <div className="background-shader" aria-hidden="true">
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }} gl={{ antialias: true, alpha: false }} dpr={[1, 1.5]}>
        <BackgroundGradientScene />
      </Canvas>
    </div>
  );
}

function PlatformSlab({ color, edgeOpacity = 0.26 }) {
  const topColor = new THREE.Color(color);
  const sideColor = topColor.clone().multiplyScalar(0.72);

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.42, 0.2, 2.42]} />
        <meshStandardMaterial color={sideColor} roughness={0.68} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.094, 0]} receiveShadow>
        <boxGeometry args={[2.43, 0.02, 2.43]} />
        <meshStandardMaterial color={topColor} roughness={0.48} metalness={0.1} />
      </mesh>
      <lineSegments position={[0, 0.108, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.43, 0.02, 2.43)]} />
        <lineBasicMaterial color="#bdb6ac" transparent opacity={edgeOpacity} />
      </lineSegments>
    </group>
  );
}

function createPlatformTextTexture(content) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 740;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#181715";
  context.font = "700 108px Inter, Arial, sans-serif";
  context.fillText(content.title, 76, 150);

  context.fillStyle = "rgba(24, 23, 21, 0.68)";
  context.font = "400 48px Inter, Arial, sans-serif";
  const words = content.text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > 810 && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  lines.slice(0, 3).forEach((copy, index) => context.fillText(copy, 76, 232 + index * 62));

  context.strokeStyle = "rgba(24, 23, 21, 0.13)";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(76, 420);
  context.lineTo(914, 420);
  context.stroke();

  context.font = "500 42px Inter, Arial, sans-serif";
  content.items.forEach((item, index) => {
    const y = 504 + index * 68;
    context.fillStyle = "rgba(24, 23, 21, 0.76)";
    context.beginPath();
    context.arc(90, y - 12, 7, 0, Math.PI * 2);
    context.fill();
    context.fillText(item, 126, y);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function PlatformFaceContent({ content, productProgressRef }) {
  const material = useRef();
  const texture = useMemo(() => createPlatformTextTexture(content), [content]);

  useFrame(() => {
    if (!material.current) return;
    material.current.opacity = productProgressRef.current >= 0.995 ? 1 : easeInOut(clamp01((productProgressRef.current - 0.72) / 0.24));
  });

  return (
    <mesh position={[0, 0.122, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2.24, 1.62]} />
      <meshBasicMaterial ref={material} map={texture} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function ResearchPlatform({ index, color, y, progressRef, productProgressRef, platformTargetsRef, hoveredLayer, onHover }) {
  const mesh = useRef();
  const { camera, size } = useThree();
  const productTarget = useRef(new THREE.Vector3());

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    const progress = progressRef.current;
    const productProgress = productProgressRef.current;
    const targetScreen = platformTargetsRef.current[index];
    const revealProgress = easeInOut(progress);
    const q = easeInOut(productProgress);
    const settled = productProgress >= 0.995;
    const layerReveal = clamp01((revealProgress - index * 0.12) / 0.58);
    const stackX = index * 0.18 * layerReveal;
    const stackY = y * layerReveal + Math.sin(t * 0.85 + index * 0.6) * 0.018 * layerReveal;
    const stackZ = -index * 0.16 * layerReveal;

    if (targetScreen) {
      productTarget.current
        .set((targetScreen.x / size.width) * 2 - 1, -(targetScreen.y / size.height) * 2 + 1, 0)
        .unproject(camera);
      productTarget.current.z = 0;
    } else {
      productTarget.current.set(stackX, stackY, stackZ);
    }

    if (settled) {
      mesh.current.position.copy(productTarget.current);
      mesh.current.rotation.set(Math.PI / 2, 0, 0);
      mesh.current.scale.set(1.66, 0.9, 1.72);
      mesh.current.visible = true;
      return;
    }

    mesh.current.position.x = THREE.MathUtils.lerp(stackX, productTarget.current.x, q);
    mesh.current.position.y = THREE.MathUtils.lerp(stackY, productTarget.current.y, q);
    mesh.current.position.z = THREE.MathUtils.lerp(stackZ, productTarget.current.z, q);
    const settleProgress = q > 0.985 ? 1 : q;
    mesh.current.rotation.x = THREE.MathUtils.lerp(0, Math.PI / 2, settleProgress);
    mesh.current.rotation.y = THREE.MathUtils.lerp(0, 0, settleProgress);
    mesh.current.rotation.z =
      THREE.MathUtils.lerp(Math.sin(t * 0.7 + index) * 0.014 * layerReveal, 0, settleProgress);
    const hoverScale = hoveredLayer === index && layerReveal > 0.55 && q < 0.12 ? 1.075 : 1;
    const targetScaleX = THREE.MathUtils.lerp(hoverScale, 1.66, settleProgress);
    const targetScaleY = THREE.MathUtils.lerp(hoverScale, 0.9, settleProgress);
    const targetScaleZ = THREE.MathUtils.lerp(hoverScale, 1.72, settleProgress);
    mesh.current.scale.set(
      THREE.MathUtils.lerp(mesh.current.scale.x, targetScaleX, 0.16),
      THREE.MathUtils.lerp(mesh.current.scale.y, targetScaleY, 0.16),
      THREE.MathUtils.lerp(mesh.current.scale.z, targetScaleZ, 0.16)
    );
    mesh.current.visible = index === 0 || layerReveal > 0.03;
  });

  return (
    <group
      ref={mesh}
      position={[index * 0.18, y, -index * 0.16]}
      onPointerMove={(event) => {
        if (productProgressRef.current > 0.08) return;
        event.stopPropagation();
        onHover(index);
      }}
      onPointerOver={(event) => {
        if (productProgressRef.current > 0.08) return;
        event.stopPropagation();
        onHover(index);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        onHover(null);
      }}
    >
      <PlatformSlab color={color} edgeOpacity={index === 0 ? 0.35 : 0.22} />
      <PlatformFaceContent content={platformContentByIndex[index]} productProgressRef={productProgressRef} />
    </group>
  );
}

function ResearchStack3D({ progressRef, productProgressRef, platformTargetsRef, hoveredLayer, onHover }) {
  const group = useRef();

  useFrame(({ clock, size }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const progress = progressRef.current;
    const productProgress = productProgressRef.current;
    const p = easeInOut(progress);
    const q = easeInOut(productProgress);
    if (productProgress >= 0.995) {
      group.current.rotation.set(0, 0, 0);
      group.current.position.set(0, 0, 0);
      return;
    }
    const finalX = size.width < 520 ? -0.2 : 2.15;
    group.current.rotation.x = (THREE.MathUtils.lerp(0.01, 0.16, p)) * (1 - q);
    group.current.rotation.y = (THREE.MathUtils.lerp(0, -0.72, p) + Math.sin(t * 0.25) * 0.04 * p) * (1 - q);
    group.current.rotation.z = (THREE.MathUtils.lerp(0, -0.1, p) + Math.sin(t * 0.18) * 0.014 * p) * (1 - q);
    group.current.position.x = THREE.MathUtils.lerp(THREE.MathUtils.lerp(0, finalX, p), 0, q);
    group.current.position.y = THREE.MathUtils.lerp(THREE.MathUtils.lerp(0, 0.08, p), 0, q);
  });

  return (
    <>
      <ambientLight intensity={1.85} />
      <directionalLight position={[3.8, 5.5, 4.2]} intensity={2.2} castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={0.8} />
      <group ref={group} position={[0, 0, 0]} rotation={[0.08, -0.04, 0]}>
        <ResearchPlatform index={0} y={1.08} color="#c9856e" progressRef={progressRef} productProgressRef={productProgressRef} platformTargetsRef={platformTargetsRef} hoveredLayer={hoveredLayer} onHover={onHover} />
        <ResearchPlatform index={1} y={0.38} color="#eeeae1" progressRef={progressRef} productProgressRef={productProgressRef} platformTargetsRef={platformTargetsRef} hoveredLayer={hoveredLayer} onHover={onHover} />
        <ResearchPlatform index={2} y={-0.32} color="#ddd8cc" progressRef={progressRef} productProgressRef={productProgressRef} platformTargetsRef={platformTargetsRef} hoveredLayer={hoveredLayer} onHover={onHover} />
        <ResearchPlatform index={3} y={-1.02} color="#cfc8ba" progressRef={progressRef} productProgressRef={productProgressRef} platformTargetsRef={platformTargetsRef} hoveredLayer={hoveredLayer} onHover={onHover} />
      </group>
    </>
  );
}

function ResearchCamera({ progressRef, productProgressRef }) {
  const { camera, size } = useThree();

  useFrame(() => {
    const progress = progressRef.current;
    const productProgress = productProgressRef.current;
    const p = easeInOut(progress);
    const q = easeInOut(productProgress);
    if (productProgress >= 0.995) {
      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, 0);
      if ("zoom" in camera) {
        camera.zoom = size.width < 520 ? 52 : 72;
      }
      camera.updateProjectionMatrix();
      return;
    }
    const heroCamera = new THREE.Vector3(
      THREE.MathUtils.lerp(0.05, 4.6, p),
      THREE.MathUtils.lerp(7.6, 0.34, p),
      THREE.MathUtils.lerp(0.12, 6.45, p)
    );
    const productCamera = new THREE.Vector3(0, 0, 10);
    const lookTarget = new THREE.Vector3(
      THREE.MathUtils.lerp(1.15 * p, 0, q),
      THREE.MathUtils.lerp(-0.08, 0, q),
      0
    );
    heroCamera.lerp(productCamera, q);
    camera.position.set(
      heroCamera.x,
      heroCamera.y,
      heroCamera.z
    );
    camera.lookAt(lookTarget);
    if ("zoom" in camera) {
      const finalZoom = size.width < 520 ? 42 : 74;
      const introZoom = size.width < 520 ? 330 : 760;
      const productZoom = size.width < 520 ? 52 : 72;
      camera.zoom = THREE.MathUtils.lerp(THREE.MathUtils.lerp(introZoom, finalZoom, p), productZoom, q);
    }
    camera.updateProjectionMatrix();
  });

  return null;
}

function HeroResearch({ progress, productProgress, progressRef, productProgressRef, platformTargetsRef }) {
  const [hoveredLayer, setHoveredLayer] = useState(null);
  const [displayedLayer, setDisplayedLayer] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const activeDetail = displayedLayer === null ? null : platformDetails[displayedLayer];

  useEffect(() => {
    if (hoveredLayer === null || progress < 0.45) {
      setDetailVisible(false);
      return;
    }

    setDetailVisible(false);
    const timer = window.setTimeout(() => {
      setDisplayedLayer(hoveredLayer);
      setDetailVisible(true);
    }, 110);

    return () => window.clearTimeout(timer);
  }, [hoveredLayer, progress]);

  return (
    <div
      className={`hero-system ${productProgress > 0.08 ? "is-product-stage" : ""}`}
      style={{ "--hero-progress": progress, "--product-progress": productProgress, "--hero-product-fade": 1 - productProgress }}
    >
      <div className="axis-card">
        <p>NetMind Research</p>
        <span>Models · methods · the foundational axis</span>
      </div>
      <div className="stack-canvas" aria-label="Four rotating square 3D platforms representing NetMind's AI stack">
        <Canvas
          orthographic
          camera={{ position: [4.6, 4.2, 6.8], zoom: 68, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          shadows
        >
          <ResearchCamera progressRef={progressRef} productProgressRef={productProgressRef} />
          <ResearchStack3D progressRef={progressRef} productProgressRef={productProgressRef} platformTargetsRef={platformTargetsRef} hoveredLayer={hoveredLayer} onHover={setHoveredLayer} />
        </Canvas>
      </div>
      <div className={`platform-detail ${detailVisible ? "is-visible" : ""}`} aria-live="polite">
        {activeDetail && (
          <p>
            <small>{activeDetail.level}</small>
            <b>{activeDetail.title}</b>
            <span>{activeDetail.text}</span>
          </p>
        )}
      </div>
      <div className="stack-caption">ONE STACK · END TO END</div>
    </div>
  );
}

function Header({ progress }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <header className="site-header" style={{ "--header-progress": progress }}>
      <Brand />
      <button className="menu-toggle" type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span></span><span></span>
      </button>
      <nav className="nav-links" aria-label="Primary navigation" onClick={() => setOpen(false)}>
        <a href="#products">Product</a>
        <a href="#solutions">Solutions</a>
        <a href="#api">Developer</a>
        <a href={links.pricing}>Pricing</a>
        <a href="#agents">Company</a>
        <a href={links.blog}>Blog</a>
      </nav>
      <div className="header-actions" onClick={() => setOpen(false)}>
        <button className="language" type="button" aria-label="Language selector">
          <span aria-hidden="true">◎</span> English <span aria-hidden="true">⌄</span>
        </button>
        <a className="ghost-link" href={links.dashboard}>Sign In</a>
        <a className="pill dark" href={links.dashboard}>Get started</a>
      </div>
    </header>
  );
}

function ProductPlatformDock({ layer }) {
  return (
    <div className="product-platform-visual" data-layer={layer}></div>
  );
}

function OverviewCard({ title, text, href, layer, children }) {
  return (
    <article className={`overview-card platform-product-card is-visible layer-${layer}`}>
      <ProductPlatformDock layer={layer} />
      <a className="card-target" href={href} aria-label={title}></a>
      <div className="sr-card-copy">
        <h2>{title}</h2>
        <p>{text}</p>
        <ul>{children}</ul>
      </div>
    </article>
  );
}

function App() {
  const heroRef = useRef(null);
  const productRef = useRef(null);
  const apiRef = useRef(null);
  const computeRef = useRef(null);
  const agentsRef = useRef(null);
  const solutionsRef = useRef(null);
  const progressRef = useRef(0);
  const productProgressRef = useRef(0);
  const platformTargetsRef = useRef({});
  const [heroProgress, setHeroProgress] = useState(0);
  const [productProgress, setProductProgress] = useState(0);
  const [apiProgress, setApiProgress] = useState(0);
  const [computeProgress, setComputeProgress] = useState(0);
  const [computeCardProgress, setComputeCardProgress] = useState([]);
  const [agentsProgress, setAgentsProgress] = useState(0);
  const [agentCardProgress, setAgentCardProgress] = useState([]);
  const [solutionsProgress, setSolutionsProgress] = useState(0);
  const [solutionCardProgress, setSolutionCardProgress] = useState([]);

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      reveals.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    reveals.forEach((node, index) => {
      node.style.transitionDelay = `${Math.min(index * 35, 220)}ms`;
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let rafId = 0;

    const updateProgress = () => {
      rafId = 0;
      const hero = heroRef.current;
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const scrollable = Math.max(1, rect.height - window.innerHeight);
        const nextHeroProgress = clamp01(-rect.top / scrollable);
        progressRef.current = nextHeroProgress;
        setHeroProgress((previous) => (Math.abs(previous - nextHeroProgress) > 0.003 ? nextHeroProgress : previous));
      }

      const product = productRef.current;
      if (!product) return;
      const productRect = product.getBoundingClientRect();
      const nextProductProgress = clamp01((window.innerHeight * 0.92 - productRect.top) / (window.innerHeight * 0.72));
      const nextTargets = {};

      product.querySelectorAll(".product-platform-visual[data-layer]").forEach((slot) => {
        const layer = slot.getAttribute("data-layer");
        const meta = productPlatformMap[layer];
        if (!meta) return;
        const slotRect = slot.getBoundingClientRect();
        nextTargets[meta.index] = {
          x: slotRect.left + slotRect.width / 2,
          y: slotRect.top + slotRect.height / 2,
        };
      });

      productProgressRef.current = nextProductProgress;
      platformTargetsRef.current = nextTargets;
      setProductProgress((previous) => (Math.abs(previous - nextProductProgress) > 0.003 ? nextProductProgress : previous));

      const api = apiRef.current;
      if (api) {
        const apiTarget = api.querySelector(".feature-grid") || api;
        const apiRect = apiTarget.getBoundingClientRect();
        const apiCenter = apiRect.top + apiRect.height * 0.5;
        const viewportCenter = window.innerHeight * 0.56;
        const activeDistance = Math.max(window.innerHeight * 0.68, apiRect.height * 0.7);
        const nextApiProgress = easeInOut(clamp01(1 - Math.abs(apiCenter - viewportCenter) / activeDistance));
        setApiProgress((previous) => (Math.abs(previous - nextApiProgress) > 0.006 ? nextApiProgress : previous));
      }

      const sectionProgress = (section, selector) => {
        if (!section) return 0;
        const target = section.querySelector(selector) || section;
        const rect = target.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const viewportCenter = window.innerHeight * 0.56;
        const activeDistance = Math.max(window.innerHeight * 0.68, rect.height * 0.72);
        return easeInOut(clamp01(1 - Math.abs(center - viewportCenter) / activeDistance));
      };

      const cardProgressList = (section, selector) => {
        if (!section) return [];
        return Array.from(section.querySelectorAll(selector)).map((card) => {
          const rect = card.getBoundingClientRect();
          const center = rect.top + rect.height * 0.5;
          const viewportCenter = window.innerHeight * 0.56;
          const activeDistance = Math.max(window.innerHeight * 0.74, rect.height * 1.2);
          return easeInOut(clamp01(1 - Math.abs(center - viewportCenter) / activeDistance));
        });
      };

      const updateProgressList = (setter, next) => {
        setter((previous) => {
          const sameLength = previous.length === next.length;
          const unchanged = sameLength && previous.every((value, index) => Math.abs(value - next[index]) <= 0.006);
          return unchanged ? previous : next;
        });
      };

      const nextComputeProgress = sectionProgress(computeRef.current, ".compute-carousel");
      const nextAgentsProgress = sectionProgress(agentsRef.current, ".agent-grid");
      const nextSolutionsProgress = sectionProgress(solutionsRef.current, ".solution-grid");

      setComputeProgress((previous) => (Math.abs(previous - nextComputeProgress) > 0.006 ? nextComputeProgress : previous));
      setAgentsProgress((previous) => (Math.abs(previous - nextAgentsProgress) > 0.006 ? nextAgentsProgress : previous));
      setSolutionsProgress((previous) => (Math.abs(previous - nextSolutionsProgress) > 0.006 ? nextSolutionsProgress : previous));
      updateProgressList(setComputeCardProgress, cardProgressList(computeRef.current, ".compute-card"));
      updateProgressList(setAgentCardProgress, cardProgressList(agentsRef.current, ".agent-card"));
      updateProgressList(setSolutionCardProgress, cardProgressList(solutionsRef.current, ".solution-card"));
    };

    const scheduleProgressUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", scheduleProgressUpdate, { passive: true });
    window.addEventListener("resize", scheduleProgressUpdate);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleProgressUpdate);
      window.removeEventListener("resize", scheduleProgressUpdate);
    };
  }, []);

  const apiCardStyle = (index) => {
    const progress = apiProgress;
    const hidden = 1 - progress;
    const shuffle = apiCardShuffles[index];
    return {
      opacity: progress * progress,
      transform: `translate3d(${shuffle.x * hidden}px, ${shuffle.y * hidden}px, 0) rotate(${shuffle.rotate * hidden}deg) scale(${0.34 + progress * 0.66})`,
      filter: `blur(${hidden * 5}px)`,
    };
  };

  const motionCardStyle = (progress, shuffles, index, itemProgress = []) => {
    const effectiveProgress = Math.max(progress, itemProgress[index] || 0);
    const hidden = 1 - effectiveProgress;
    const shuffle = shuffles[index];
    return {
      opacity: effectiveProgress * effectiveProgress,
      transform: `translate3d(${shuffle.x * hidden}px, ${shuffle.y * hidden}px, 0) rotate(${shuffle.rotate * hidden}deg) scale(${0.38 + effectiveProgress * 0.62})`,
      filter: `blur(${hidden * 5}px)`,
    };
  };

  return (
    <div className="site-shell">
      <BackgroundShader />
      <Header progress={heroProgress} />
      <main>
        <HeroResearch progress={heroProgress} productProgress={productProgress} progressRef={progressRef} productProgressRef={productProgressRef} platformTargetsRef={platformTargetsRef} />
        <section className="hero section-grid" id="home" ref={heroRef} style={{ "--hero-progress": heroProgress }}>
          <div className="ambient-lines" aria-hidden="true"></div>
          <div className="hero-copy reveal">
            <h1>Build with <span>NetMind AI</span>,<br />or just use it.</h1>
            <p className="headline-accent">One stack, end to end.</p>
            <p className="muted">100+ models. Massive GPU fleet. One key, one bill.</p>
            <div className="button-row">
              <a className="pill dark" href={links.dashboard}>Start building</a>
              <a className="pill light" href={links.contact}>Talk to us</a>
            </div>
          </div>
        </section>

        <section className="product-overview" id="products" ref={productRef}>
          <div className="product-section-intro reveal">
            <span>Product</span>
            <p>One ecosystem for agents, models, compute, and enterprise AI solutions.</p>
          </div>
          <OverviewCard icon="waveform" layer="agents" title="AI Agents" text="Arena42, NarraNexus, Manyfold" href={links.agents}>
            <li><a href="https://arena42.ai/">Arena42</a></li>
            <li><a href="https://narra.nexus/">NarraNexus</a></li>
            <li><a href="https://manyfold.ai/">Manyfold</a></li>
          </OverviewCard>
          <OverviewCard icon="nodes" layer="api" title="NetMind API" text="100+ frontier models, one endpoint" href={links.api}>
            <li><a href="https://www.netmind.ai/modelsLibrary">Models</a></li>
            <li><a href="https://www.netmind.ai/api/smart-model">Smart Model</a></li>
            <li><a href="https://www.netmind.ai/api/smart-tools">Smart Tools</a></li>
            <li><a href="https://www.netmind.ai/api/sdk">SDK</a></li>
          </OverviewCard>
          <OverviewCard icon="grid" layer="compute" title="Compute" text="H100, A100, RTX 4090 - on-demand or reserved" href={links.compute}>
            <li><a href="https://www.netmind.ai/computer/gpu-clusters">GPU Clusters</a></li>
            <li><a href="https://www.netmind.ai/computer/inference">Dedicated Endpoint</a></li>
            <li><a href="https://www.netmind.ai/feedback/reserveGpu">Request Cluster</a></li>
          </OverviewCard>
          <OverviewCard icon="brand-small" layer="solutions" title="Solutions" text="Document automation, speech analytics, support automation" href={links.solutions}>
            <li><a href={links.solutions}>Business Solutions</a></li>
            <li><a href="https://www.netmind.ai/application">AI Apps</a></li>
            <li><a href="https://calendly.com/hao-wang-netmind/30min">Custom Solution</a></li>
          </OverviewCard>
        </section>

        <section className="logo-rail" aria-label="NetMind partners">
          <div className="rail-track">
            {[...partnerLogos, ...partnerLogos].map((name, index) => (
              <span className="partner-logo" key={`${name}-${index}`}>{name}</span>
            ))}
          </div>
        </section>

        <section className="api-section" id="api" ref={apiRef} style={{ "--api-progress": apiProgress }}>
          <div className="section-heading reveal">
            <span>NetMind API</span>
            <div>
              <h2><em>Unified Model API</em><br />for Everything AI</h2>
              <div className="button-row">
                <a className="pill dark" href="https://www.netmind.ai/user/apiToken">Get API Key</a>
                <a className="pill light" href="https://www.netmind.ai/modelsLibrary">Model Library</a>
              </div>
            </div>
            <p>Access 100+ leading models — chat, vision, audio, embeddings — through one unified API, one key, and one contract. Enterprise-ready billing, compliance, and routing, with no provider lock-in.</p>
          </div>

          <div className="feature-grid">
            <a className="feature-card api-feature-card" style={apiCardStyle(0)} href="https://www.netmind.ai/modelsLibrary">
              <div className="model-cloud" aria-hidden="true">
                {modelLogoUrls.map((src, index) => (
                  <span key={src}>
                    <img src={src} alt="" loading={index > 5 ? "lazy" : "eager"} />
                  </span>
                ))}
              </div>
              <h3>Frontier models, unified</h3>
              <p>Chat, vision, audio, image and embeddings from every major provider — all behind a single endpoint.</p>
            </a>
            <a className="feature-card api-feature-card" style={apiCardStyle(1)} href="https://www.netmind.ai/user/apiToken">
              <pre><code>{`from openai import OpenAI

client = OpenAI(
  base_url="api.netmind.ai/…/v1",
  api_key="NETMIND_API_KEY",
)

client.chat.completions.create(…)`}</code></pre>
              <h3>One API key, all models</h3>
              <p>Switch providers by changing one string. No new accounts, no vendor lock-in, no re-authentication.</p>
            </a>
            <a className="feature-card api-feature-card" style={apiCardStyle(2)} href="https://www.netmind.ai/api/sdk">
              <div className="agent-pills" aria-hidden="true">{["OpenAI SDK", "OpenClaw", "Hermes Agent", "LangChain"].map((item) => <span key={item}>{item}</span>)}</div>
              <h3>Works with your agents</h3>
              <p>Drop-in replacement for OpenAI in agent frameworks like OpenClaw and Hermes Agent — no rewrites required.</p>
            </a>
            <a className="feature-card api-feature-card" style={apiCardStyle(3)} href="https://www.netmind.ai/api/smart-model">
              <div className="cost-chart" aria-hidden="true">
                <svg viewBox="0 0 320 150" role="img" aria-label="Lower spend chart">
                  <path d="M8 28 C 60 38, 78 74, 118 86 S 208 126, 312 118" />
                  <circle cx="286" cy="116" r="5"></circle>
                  <circle cx="312" cy="118" r="5"></circle>
                </svg>
              </div>
              <h3>Cost-optimized routing</h3>
              <p>Smart routing picks the cheapest qualified provider per request — without trading off quality.</p>
            </a>
          </div>

          <aside className="pro-banner reveal">
            <span>NetMind Pro</span>
            <div>
              <h3>Subscribe to NetMind Pro for better model API pricing</h3>
              <p>Subscribe to NetMind Pro to enjoy up to 50% off model API pricing, 0% platform service fee, and 100% Credits back, helping reduce usage costs as your AI traffic grows.</p>
            </div>
            <a className="pill dark" href={links.pricing}>Subscribe now</a>
          </aside>
        </section>

        <section className="compute-section" id="compute" ref={computeRef}>
          <div className="section-heading reveal">
            <span>Compute</span>
            <div>
              <h2>GPU infrastructure<br /><em>at any scale.</em></h2>
              <div className="button-row">
                <a className="pill dark" href={links.compute}>Explore Compute</a>
                <a className="pill light" href="https://www.netmind.ai/feedback/reserveGpu">Reserve GPUs</a>
              </div>
            </div>
            <p>One of the largest on-demand GPU fleets — train, serve, and reserve compute across global regions, without the procurement overhead.</p>
          </div>
          <div className="compute-carousel">
            {[
              ["server", "GPU Cluster", "Access a massive GPU fleet for training and fine-tuning, from single-node experiments to multi-thousand GPU jobs.", ["Massive GPU fleet", "Elastic GPU scaling", "Cost-optimized scheduling"], "https://www.netmind.ai/computer/gpu-clusters"],
              ["route", "Dedicated Endpoint", "Run production workloads on reserved capacity with predictable latency, high reliability, and enterprise-grade isolation.", ["99.95% uptime SLA", "Low-latency global routing", "Private networking options"], "https://www.netmind.ai/computer/inference"],
              ["custom", "Custom GPU Requirements", "Need specific GPU models, regions, or long-term reserved capacity? Submit your requirements and get a tailored cluster plan.", ["Custom GPU & region planning", "Reserved capacity options", "Enterprise support response"], "https://www.netmind.ai/feedback/reserveGpu"],
            ].map(([icon, title, text, items, href], index) => (
              <a className="compute-card motion-section-card" style={motionCardStyle(computeProgress, computeCardShuffles, index, computeCardProgress)} href={href} key={title}>
                <span className={`mini-icon ${icon}`}></span>
                <h3>{title}</h3>
                <p>{text}</p>
                <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
                <span className="card-cta">Get started</span>
              </a>
            ))}
          </div>
        </section>

        <section className="agents-section" id="agents" ref={agentsRef}>
          <div className="section-heading reveal">
            <span>AI Agents</span>
            <div><h2>The AI Agent Ecosystem</h2></div>
            <p>NetMind has built a unique AI agent ecosystem - build your own agent, give it a social identity, or bring any agent into the Arena to compete.</p>
          </div>
          <div className="agent-grid">
            <a className="agent-card motion-section-card arena" style={motionCardStyle(agentsProgress, agentCardShuffles, 0, agentCardProgress)} href="https://arena42.ai/">
              <div className="agent-art image-art" style={{ "--agent-image": "url('https://www.netmind.ai/Arena.png')" }}></div><small>Agent Competition</small><h3>Arena42</h3>
              <p>A platform built for AI agents to compete. Register your own agent - from any platform or framework - and let it battle autonomously against agents from around the world.</p><span>Join the arena →</span>
            </a>
            <a className="agent-card motion-section-card narra" style={motionCardStyle(agentsProgress, agentCardShuffles, 1, agentCardProgress)} href="https://narra.nexus/">
              <div className="agent-art image-art" style={{ "--agent-image": "url('https://www.netmind.ai/NarraNexus.png')" }}></div><small>Build Agents</small><h3>NarraNexus</h3>
              <p>A platform for building agents with persistent memory, social identity, and evolving relationships. Your agent grows over time and participates in a living intelligence network.</p><span>Start building →</span>
            </a>
            <a className="agent-card motion-section-card manyfold" style={motionCardStyle(agentsProgress, agentCardShuffles, 2, agentCardProgress)} href="https://manyfold.ai/">
              <div className="agent-art image-art" style={{ "--agent-image": "url('https://www.netmind.ai/manyfold.png')" }}></div><small>Build Agents</small><h3>Manyfold</h3>
              <p>Manyfold provides orchestration, hosting, and observability for agent fleets, supports parallel execution at scale, and can host agents you already have.</p><span>Start building →</span>
            </a>
          </div>
        </section>

        <section className="solutions-section" id="solutions" ref={solutionsRef}>
          <div className="section-heading reveal">
            <span>Solutions</span>
            <div>
              <h2>Tailored enterprise solutions.</h2>
              <div className="button-row">
                <a className="pill dark" href={links.solutions}>Explore solutions</a>
                <a className="pill light" href={links.contact}>Talk to us</a>
              </div>
            </div>
            <p>Bring the business need. NetMind designs, builds, and operates the solution — end to end.</p>
          </div>
          <div className="solution-grid">
            <a className="solution-card motion-section-card" style={motionCardStyle(solutionsProgress, solutionCardShuffles, 0, solutionCardProgress)} href={links.solutions}><div className="solution-art dashboard"></div><h3>Enterprise Custom</h3><p>Purpose-built dashboards, portals, and business software tailored to your operations — not off-the-shelf templates.</p></a>
            <a className="solution-card motion-section-card" style={motionCardStyle(solutionsProgress, solutionCardShuffles, 1, solutionCardProgress)} href={links.solutions}><div className="solution-art integration"></div><h3>AI Integration</h3><p>Connect your existing tools, data, and platforms with AI capabilities — turning fragmented systems into one intelligent workflow.</p></a>
            <a className="solution-card motion-section-card" style={motionCardStyle(solutionsProgress, solutionCardShuffles, 2, solutionCardProgress)} href={links.solutions}><div className="solution-art managed"></div><h3>Fully Managed</h3><p>End-to-end ownership after launch — monitoring, maintenance, and continuous improvement with no handoff gaps.</p></a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div><Brand /><p>One Ecosystem to Build and<br />Run AI, Safely</p></div>
        <nav aria-label="Resources"><h2>Resources</h2><a href="https://www.netmind.ai/brandAssets">Brand Assets</a></nav>
        <nav aria-label="Legal"><h2>Legal</h2><a href="https://www.netmind.ai/termsOfService">Terms of Service</a><a href="https://www.netmind.ai/privacyPolicy">Privacy Policy</a></nav>
        <nav aria-label="Contact"><h2>Contact Us</h2><a href="mailto:hello@netmind.ai">hello@netmind.ai</a><a href={links.dashboard}>Support</a></nav>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
