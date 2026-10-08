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
  // Every direction of the existing studio light is white. A constant CubeUV
  // atlas gives the same neutral reflection without generating PMREM mip levels
  // and compiling their extra blur shaders on the first frame.
  const width = 3 * 16 * 7, height = 4 * 16;
  const texture = new THREE.DataTexture(new Uint8Array(width * height * 4).fill(255), width, height);
  texture.mapping = THREE.CubeUVReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false; texture.needsUpdate = true;
  return texture;
}

function BarMaterial({ barProps }) {
  const { nodes } = useGLTF(MODEL);
  const { size, invalidate, gl, camera, scene: outputScene } = useThree();
  const width = Math.min(1536, Math.ceil(size.width)), height = Math.ceil(size.height);
  const buffer = useFBO(width, height, { samples: 0, depthBuffer: false, stencilBuffer: false, type: THREE.UnsignedByteType });
  const [scene] = useState(() => { const s = new THREE.Scene(); s.background = new THREE.Color('#ffffff'); return s; });
  const bar = useRef(), material = useRef(), videoPlane = useRef(), edgesPlane = useRef();
  const pump = useRef({ until: 0, frame: null, lastDraw: -Infinity });
  const backdrop = useRef(null), pressed = useRef(false);
  const clearColor = useMemo(() => new THREE.Color(), []);
  const compiled = useRef(false);
  const host = useRef(null), video = useRef(null), texture = useRef(null), videoFrame = useRef(null);
  const edges = useMemo(makeEdges, []);
  const studioLight = useMemo(makeStudioLight, []);
  const geometry = nodes.Cube.geometry;
  const dimensions = useMemo(() => { geometry.computeBoundingBox(); return geometry.boundingBox.getSize(new THREE.Vector3()); }, [geometry]);

  useEffect(() => {
    host.current = gl.domElement.closest('.site-header');
    video.current = document.querySelector('.hero-video');
    const v = video.current, header = host.current;
    if (!v || !header) return;
    texture.current = new THREE.VideoTexture(v); texture.current.colorSpace = THREE.SRGBColorSpace;
    texture.current.minFilter = THREE.LinearFilter; texture.current.magFilter = THREE.LinearFilter; texture.current.generateMipmaps = false;
    videoPlane.current.material.map = texture.current; videoPlane.current.material.needsUpdate = true;
    let layoutFrame = null, scrollFrame = null;
    const art = v.closest('.hero-art');
    const active = () => !document.hidden && !document.body.classList.contains('dialog-open');
    // The video remains 60 fps. Its small decorative glass reflection is capped
    // at 30 fps and never keeps a rendering tail alive during ordinary scrolling.
    const draw = (force = false) => {
      if (!active() || (!force && performance.now() - pump.current.lastDraw < 1000 / 30)) return;
      pump.current.lastDraw = performance.now(); invalidate();
    };
    const updateBackground = () => {
      const data = backdrop.current;
      if (!data) return false;
      const { header: r, video: b } = data;
      data.top = b.top - scrollY;
      data.hero = data.top + b.height > r.top && data.top < r.bottom && b.left + b.width > r.left && b.left < r.right && v.readyState >= 2 && !v.paused;
      const background = data.hero ? 'hero' : 'css';
      const changed = header.dataset.fluidBackground !== background;
      if (changed) { header.dataset.fluidBackground = background; draw(true); }
      return data.hero;
    };
    const measure = () => {
      layoutFrame = null;
      const r = header.getBoundingClientRect(), b = v.getBoundingClientRect();
      backdrop.current = { header: r, video: { top: b.top + scrollY, left: b.left, width: b.width, height: b.height } };
      updateBackground(); draw(true);
    };
    const scheduleMeasure = () => { if (layoutFrame === null) layoutFrame = requestAnimationFrame(measure); };
    const stopPump = () => { cancelAnimationFrame(pump.current.frame); pump.current.frame = null; };
    const wake = (duration = 280) => {
      if (!active()) return;
      pressed.current = !!header.querySelector('[data-lens-pressed="true"],.is-pressed');
      pump.current.until = Math.max(pump.current.until, performance.now() + duration);
      if (pump.current.frame !== null) return;
      const tick = () => {
        if (!active()) { stopPump(); return; }
        draw(); pump.current.frame = performance.now() < pump.current.until ? requestAnimationFrame(tick) : null;
      };
      pump.current.frame = requestAnimationFrame(tick);
    };
    const onPress = () => wake();
    const onScroll = () => {
      if (scrollFrame !== null) return;
      scrollFrame = requestAnimationFrame(() => { scrollFrame = null; if (updateBackground()) draw(); });
    };
    const requestVideoFrame = callback => v.requestVideoFrameCallback ? v.requestVideoFrameCallback(callback) : setTimeout(callback, 1000 / 30);
    const cancelVideoFrame = () => {
      if (videoFrame.current !== null) { if (v.cancelVideoFrameCallback) v.cancelVideoFrameCallback(videoFrame.current); else clearTimeout(videoFrame.current); videoFrame.current = null; }
    };
    const onVideoFrame = () => {
      videoFrame.current = null;
      if (!active() || v.paused) return;
      if (updateBackground()) draw();
      videoFrame.current = requestVideoFrame(onVideoFrame);
    };
    const reconcile = () => {
      if (!active()) { stopPump(); cancelVideoFrame(); return; }
      updateBackground(); draw(true);
      if (!v.paused && videoFrame.current === null) videoFrame.current = requestVideoFrame(onVideoFrame);
      if (v.paused) cancelVideoFrame();
    };
    const resize = new ResizeObserver(scheduleMeasure); resize.observe(header); resize.observe(art);
    // Short hero entrance transforms change its screen geometry; cache it again
    // only while those styles change, rather than reading both rectangles per frame.
    const artChanges = new MutationObserver(scheduleMeasure); artChanges.observe(art, { attributes: true, attributeFilter: ['style'] });
    const presses = new MutationObserver(onPress); presses.observe(header, { subtree: true, attributes: true, attributeFilter: ['data-lens-pressed', 'class'] });
    const modal = new MutationObserver(reconcile); modal.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', scheduleMeasure);
    document.addEventListener('visibilitychange', reconcile);
    v.addEventListener('play', reconcile); v.addEventListener('pause', reconcile); v.addEventListener('loadeddata', scheduleMeasure);
    measure(); reconcile(); wake();
    return () => {
      stopPump(); cancelVideoFrame(); cancelAnimationFrame(layoutFrame); cancelAnimationFrame(scrollFrame);
      resize.disconnect(); artChanges.disconnect(); presses.disconnect(); modal.disconnect();
      window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', scheduleMeasure); document.removeEventListener('visibilitychange', reconcile);
      v.removeEventListener('play', reconcile); v.removeEventListener('pause', reconcile); v.removeEventListener('loadeddata', scheduleMeasure);
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

  useEffect(() => {
    let active = true;
    compiled.current = false;
    // Leave the existing CSS glass visible while GPU programs compile. Taking
    // over the render loop prevents the first draw from synchronously waiting
    // for a large transmission shader. Unsupported drivers keep the CSS layer.
    if (!gl.extensions.has('KHR_parallel_shader_compile')) return;
    Promise.all([gl.compileAsync(scene, camera), gl.compileAsync(outputScene, camera)])
      .then(() => { if (active) { compiled.current = true; invalidate(); } })
      .catch(() => { /* The native navigation and CSS material remain available. */ });
    return () => { active = false; compiled.current = false; };
  }, [gl, camera, scene, outputScene, invalidate]);

  useFrame((state, delta) => {
    const header = host.current, v = video.current;
    if (!header || !v || !texture.current || !compiled.current) return;
    const data = backdrop.current;
    if (!data || document.hidden || document.body.classList.contains('dialog-open')) return;
    const r = data.header, b = data.video, intersects = data.hero;
    videoPlane.current.visible = edgesPlane.current.visible = intersects;
    if (intersects) {
      const cover = Math.max(b.width / v.videoWidth, b.height / v.videoHeight);
      const tx = texture.current; tx.repeat.set(b.width / (v.videoWidth * cover), b.height / (v.videoHeight * cover)); tx.offset.set((1 - tx.repeat.x) / 2, (1 - tx.repeat.y) / 2);
      [videoPlane.current, edgesPlane.current].forEach(plane => {
        plane.position.x = b.left + b.width / 2 - (r.left + r.width / 2);
        plane.position.y = r.top + r.height / 2 - (data.top + b.height / 2);
        plane.scale.set(b.width, b.height, 1);
      });
    }
    // Orthographic pixel coordinates keep sampling tied to the actual viewport.
    bar.current.scale.set((size.width - 2) / dimensions.x, 5 / dimensions.y, (size.height - 2) / dimensions.z);
    easing.damp(material.current, 'thickness', (barProps.thickness ?? BAR.thickness) * (pressed.current ? .86 : 1), .12, Math.min(delta, .035));
    const target = gl.getRenderTarget(), clear = gl.getClearColor(clearColor), alpha = gl.getClearAlpha();
    gl.setRenderTarget(buffer); gl.setClearColor('#ffffff', 1); gl.clear(); gl.render(scene, camera);
    gl.setRenderTarget(target); gl.setClearColor(clear, alpha);
    gl.render(outputScene, camera);
    if (header.dataset.fluidReady !== 'true') header.dataset.fluidReady = 'true';
  }, 1);

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
