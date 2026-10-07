/* React Bits FluidGlass, JS/CSS: portfolio bar adaptation.
 * Original supplied component: ../references/FluidGlass.original.jsx
 * Retains its bar.glb + useFBO + scene portal + MeshTransmissionMaterial.
 * Replaces demo ScrollControls/photos/Three.Text with the existing video scene
 * and a bounded, demand-rendered material. HTML content stays outside Canvas.
 */
import * as THREE from 'three';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, useFBO, useGLTF } from '@react-three/drei';
import { easing } from 'maath';

const MODEL = '/assets/3d/bar.glb';
const BAR = Object.freeze({ ior: 1.12, thickness: 3, chromaticAberration: .003, transmission: 1, roughness: 0, anisotropicBlur: 0 });

function makeEdges() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d');
  const vertical = context.createLinearGradient(0, 0, 0, 256);
  vertical.addColorStop(0, '#fff'); vertical.addColorStop(.24, '#ffffff00'); vertical.addColorStop(.72, '#ffffff00'); vertical.addColorStop(1, '#fff');
  context.fillStyle = vertical; context.fillRect(0, 0, 256, 256);
  const horizontal = context.createLinearGradient(0, 0, 256, 0);
  horizontal.addColorStop(0, '#fff'); horizontal.addColorStop(.16, '#ffffff00'); horizontal.addColorStop(.84, '#ffffff00'); horizontal.addColorStop(1, '#fff');
  context.fillStyle = horizontal; context.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeStudioLight() {
  // A neutral white reflection environment prevents unlit Fresnel edges from
  // appearing black. This lights the glass; it is never the backdrop input.
  const face = document.createElement('canvas'); face.width = face.height = 4;
  const context = face.getContext('2d'); context.fillStyle = '#ffffff'; context.fillRect(0, 0, 4, 4);
  const texture = new THREE.CubeTexture(Array(6).fill(face));
  texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true;
  return texture;
}

function BarMaterial({ barProps }) {
  const { nodes } = useGLTF(MODEL);
  const { size, invalidate, gl, camera } = useThree();
  const width = Math.min(1536, Math.ceil(size.width)), height = Math.ceil(size.height);
  const buffer = useFBO(width, height, { samples: 0, depthBuffer: false, stencilBuffer: false, type: THREE.UnsignedByteType });
  const [scene] = useState(() => { const s = new THREE.Scene(); s.background = new THREE.Color('#ffffff'); return s; });
  const bar = useRef(), material = useRef(), videoPlane = useRef(), edgesPlane = useRef();
  const pump = useRef({ until: 0, frame: null });
  const host = useRef(null), video = useRef(null), texture = useRef(null), videoFrame = useRef(null);
  const edges = useMemo(makeEdges, []);
  const studioLight = useMemo(makeStudioLight, []);
  const geometry = nodes.Cube.geometry;
  const dimensions = useMemo(() => { geometry.computeBoundingBox(); return geometry.boundingBox.getSize(new THREE.Vector3()); }, [geometry]);

  useEffect(() => {
    host.current = gl.domElement.closest('.site-header');
    video.current = document.querySelector('.hero-video');
    const v = video.current, header = host.current;
    texture.current = new THREE.VideoTexture(v); texture.current.colorSpace = THREE.SRGBColorSpace;
    texture.current.minFilter = THREE.LinearFilter; texture.current.magFilter = THREE.LinearFilter; texture.current.generateMipmaps = false;
    videoPlane.current.material.map = texture.current; videoPlane.current.material.needsUpdate = true;
    const wake = (duration = 520) => {
      if (document.hidden || document.body.classList.contains('dialog-open')) return;
      pump.current.until = Math.max(pump.current.until, performance.now() + duration);
      if (pump.current.frame !== null) return;
      const tick = () => { invalidate(); pump.current.frame = performance.now() < pump.current.until ? requestAnimationFrame(tick) : null; };
      pump.current.frame = requestAnimationFrame(tick);
    };
    const onInteraction = () => wake();
    const onScroll = () => wake(480);
    const onVideoFrame = () => {
      if (!document.hidden && !document.body.classList.contains('dialog-open') && !v.paused && header.dataset.fluidBackground === 'hero') invalidate();
      videoFrame.current = v.requestVideoFrameCallback(onVideoFrame);
    };
    videoFrame.current = v.requestVideoFrameCallback(onVideoFrame);
    const resize = new ResizeObserver(onInteraction); resize.observe(header);
    const changes = new MutationObserver(onInteraction); changes.observe(header, { subtree: true, attributes: true, attributeFilter: ['data-expanded', 'aria-current', 'data-preview', 'data-lens-pressed'] });
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onInteraction);
    ['pointermove', 'pointerdown', 'pointerup', 'pointerleave', 'keydown', 'focusin'].forEach(event => header.addEventListener(event, onInteraction, { passive: true }));
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(pump.current.frame); pump.current.frame = null; } else wake(); };
    document.addEventListener('visibilitychange', visibility); wake(650);
    return () => {
      cancelAnimationFrame(pump.current.frame); v.cancelVideoFrameCallback(videoFrame.current); resize.disconnect(); changes.disconnect();
      window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onInteraction); document.removeEventListener('visibilitychange', visibility);
      ['pointermove', 'pointerdown', 'pointerup', 'pointerleave', 'keydown', 'focusin'].forEach(event => header.removeEventListener(event, onInteraction));
      delete header.dataset.fluidReady; delete header.dataset.fluidBackground; texture.current.dispose(); edges.dispose(); studioLight.dispose();
    };
  }, [gl, invalidate, edges, studioLight]);

  useEffect(() => {
    const mat = material.current;
    const upstream = mat.onBeforeCompile.bind(mat);
    // Clear center, stronger optical contribution on curved edges. The original
    // HTML backdrop still shows through; arbitrary DOM is never claimed as a FBO.
    mat.onBeforeCompile = shader => {
      upstream(shader);
      shader.fragmentShader = shader.fragmentShader.replace('#include <dithering_fragment>',
        'gl_FragColor.a *= 0.008 + 0.16 * pow(1.0 - abs(normal.z), 1.4);\n#include <dithering_fragment>');
    };
    mat.customProgramCacheKey = () => 'portfolio-fluid-bar-rim-v1'; mat.needsUpdate = true;
    return () => { mat.onBeforeCompile = upstream; };
  }, []);

  useFrame((state, delta) => {
    const header = host.current, v = video.current;
    if (!header || !v || !texture.current) return;
    const r = header.getBoundingClientRect(), b = v.getBoundingClientRect();
    const intersects = b.bottom > r.top && b.top < r.bottom && b.right > r.left && b.left < r.right && v.readyState >= 2 && !v.paused;
    const background = intersects ? 'hero' : 'css';
    if (header.dataset.fluidBackground !== background) header.dataset.fluidBackground = background;
    videoPlane.current.visible = edgesPlane.current.visible = intersects;
    if (intersects) {
      const cover = Math.max(b.width / v.videoWidth, b.height / v.videoHeight);
      const tx = texture.current; tx.repeat.set(b.width / (v.videoWidth * cover), b.height / (v.videoHeight * cover)); tx.offset.set((1 - tx.repeat.x) / 2, (1 - tx.repeat.y) / 2);
      [videoPlane.current, edgesPlane.current].forEach(plane => {
        plane.position.x = b.left + b.width / 2 - (r.left + r.width / 2);
        plane.position.y = r.top + r.height / 2 - (b.top + b.height / 2);
        plane.scale.set(b.width, b.height, 1);
      });
    }
    // Orthographic pixel coordinates keep sampling tied to the actual viewport.
    bar.current.scale.set((size.width - 2) / dimensions.x, 5 / dimensions.y, (size.height - 2) / dimensions.z);
    const pressed = header.querySelector('[data-lens-pressed="true"],.is-pressed');
    easing.damp(material.current, 'thickness', (barProps.thickness ?? BAR.thickness) * (pressed ? .86 : 1), .12, Math.min(delta, .035));
    const target = gl.getRenderTarget(), clear = gl.getClearColor(new THREE.Color()), alpha = gl.getClearAlpha();
    gl.setRenderTarget(buffer); gl.setClearColor('#ffffff', 1); gl.clear(); gl.render(scene, camera);
    gl.setRenderTarget(target); gl.setClearColor(clear, alpha);
    if (header.dataset.fluidReady !== 'true') header.dataset.fluidReady = 'true';
  });

  return <>
    {createPortal(<><mesh ref={videoPlane}><planeGeometry args={[1, 1]} /><meshBasicMaterial toneMapped={false} /></mesh><mesh ref={edgesPlane} position={[0, 0, 1]}><planeGeometry args={[1, 1]} /><meshBasicMaterial map={edges} transparent toneMapped={false} depthWrite={false} /></mesh></>, scene)}
    <ambientLight intensity={.8} /><directionalLight position={[-100, 150, 30]} intensity={1.2} />
    <mesh ref={bar} geometry={geometry} rotation-x={Math.PI / 2} position={[0, 0, 10]}>
      <MeshTransmissionMaterial ref={material} {...BAR} {...barProps} envMap={studioLight} envMapIntensity={1} buffer={buffer.texture} samples={2} backside={false} transparent color="#ffffff" attenuationColor="#ffffff" attenuationDistance={Infinity} temporalDistortion={0} distortion={0} depthWrite={false} />
    </mesh>
  </>;
}

export default function FluidGlass({ mode = 'bar', barProps = {} }) {
  // This site needs the fixed floating bar, not the demo's separate scroll scene.
  if (mode !== 'bar') return null;
  return <Canvas orthographic camera={{ position: [0, 0, 30], zoom: 1, near: .1, far: 100 }} frameloop="demand" dpr={1}
    gl={{ alpha: true, antialias: false, powerPreference: 'low-power', toneMapping: THREE.NoToneMapping }}
    fallback={null} style={{ pointerEvents: 'none' }}>
    <Suspense fallback={null}><BarMaterial barProps={barProps} /></Suspense>
  </Canvas>;
}
