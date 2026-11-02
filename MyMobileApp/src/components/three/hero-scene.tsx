import { GLView, type ExpoWebGLRenderingContext } from 'expo-gl';
import { useIsFocused } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import * as THREE from 'three';

import { colors } from '@/theme';

type HeroSceneProps = {
  style?: StyleProp<ViewStyle>;
  // Must match the surface behind the canvas (Android GL views are not transparent)
  background?: string;
  // Smaller, calmer variant for headers
  compact?: boolean;
};

/**
 * Real-time 3D brand object rendered with three.js on expo-gl.
 * Works on iOS, Android (Expo Go included) and web. Pauses when the screen is
 * not focused and renders a single still frame when Reduce Motion is on.
 */
export function HeroScene({ style, background = colors.ink, compact = false }: HeroSceneProps) {
  const focused = useIsFocused();
  const activeRef = useRef(true);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [failed, setFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    activeRef.current = focused;
  }, [focused]);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      sub.remove();
      cleanupRef.current?.();
    };
  }, []);

  const fail = (error: unknown) => {
    console.warn('3D scene unavailable:', error);
    cleanupRef.current?.();
    cleanupRef.current = null;
    setFailed(true);
  };

  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    try {
      cleanupRef.current = startScene(gl, { background, compact, reduceMotion, activeRef, onError: fail });
    } catch (error) {
      fail(error);
    }
  };

  if (failed) return <View style={[styles.fill, style]} pointerEvents="none" />;

  return (
    <View style={[styles.fill, style]} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <GLView style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} msaaSamples={4} />
    </View>
  );
}

type SceneOptions = {
  background: string;
  compact: boolean;
  reduceMotion: boolean;
  activeRef: { current: boolean };
  onError: (error: unknown) => void;
};

/**
 * expo-gl's native context is WebGL2-capable but also registers a global
 * `WebGLRenderingContext`, which trips three.js's "WebGL 1 is not supported"
 * instanceof check. Hide that global only while the renderer is created.
 */
function createRenderer(params: THREE.WebGLRendererParameters) {
  if (Platform.OS === 'web') return new THREE.WebGLRenderer(params);

  const scope = globalThis as { WebGLRenderingContext?: unknown };
  const original = scope.WebGLRenderingContext;
  scope.WebGLRenderingContext = undefined;
  try {
    return new THREE.WebGLRenderer(params);
  } finally {
    scope.WebGLRenderingContext = original;
  }
}

function startScene(
  gl: ExpoWebGLRenderingContext,
  { background, compact, reduceMotion, activeRef, onError }: SceneOptions,
) {
  const width = gl.drawingBufferWidth;
  const height = gl.drawingBufferHeight;

  // On web expo-gl gives a real <canvas>; on native three.js only needs a stub
  const webCanvas = (gl as unknown as { canvas?: HTMLCanvasElement }).canvas;
  const canvas =
    webCanvas && typeof webCanvas.addEventListener === 'function'
      ? webCanvas
      : ({
          width,
          height,
          style: {},
          clientWidth: width,
          clientHeight: height,
          addEventListener: () => {},
          removeEventListener: () => {},
          getContext: () => gl,
        } as unknown as HTMLCanvasElement);

  const renderer = createRenderer({
    canvas,
    context: gl as unknown as WebGL2RenderingContext,
    antialias: true,
  });
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  renderer.setClearColor(new THREE.Color(background), 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(compact ? 40 : 45, width / height, 0.1, 100);
  camera.position.set(0, 0, compact ? 5.4 : 6.2);

  // Lighting: soft fill + brand-colored rim lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  scene.add(new THREE.HemisphereLight(0xb9b2ff, 0x1a1030, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 4, 5);
  scene.add(key);
  const violet = new THREE.PointLight(new THREE.Color(colors.primary), 40, 20);
  violet.position.set(-3, 1.5, 2);
  scene.add(violet);
  const coral = new THREE.PointLight(new THREE.Color(colors.accent), 30, 20);
  coral.position.set(3, -2, 1.5);
  scene.add(coral);

  const group = new THREE.Group();
  scene.add(group);

  // Faceted gem
  const gemGeometry = new THREE.IcosahedronGeometry(1.1, 0);
  const gemMaterial = new THREE.MeshStandardMaterial({
    // No environment map, so moderate metalness keeps the facets bright
    color: new THREE.Color(colors.primary),
    emissive: new THREE.Color(0x1b1450),
    metalness: 0.35,
    roughness: 0.28,
    flatShading: true,
  });
  const gem = new THREE.Mesh(gemGeometry, gemMaterial);
  group.add(gem);

  // Glowing wireframe shell
  const shellGeometry = new THREE.IcosahedronGeometry(1.35, 1);
  const shellMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(colors.primary),
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });
  const shell = new THREE.Mesh(shellGeometry, shellMaterial);
  group.add(shell);

  // Orbit ring
  const ringGeometry = new THREE.TorusGeometry(1.9, 0.025, 12, 120);
  const ringMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(colors.accent) });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2.6;
  group.add(ring);

  // Particle halo
  const particleCount = compact ? 120 : 220;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const radius = 2.2 + Math.random() * 1.4;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 2.4;
    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * radius;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: compact ? 0.022 : 0.028,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  let frame = 0;
  let disposed = false;

  // A GPU/driver failure stops the loop and falls back to the plain card
  const present = () => {
    try {
      renderer.render(scene, camera);
      gl.endFrameEXP();
    } catch (error) {
      disposed = true;
      onError(error);
    }
  };
  const start = Date.now();

  const tick = () => {
    if (disposed) return;
    frame = requestAnimationFrame(tick);
    if (!activeRef.current) return;

    const t = (Date.now() - start) / 1000;
    gem.rotation.x = t * 0.35;
    gem.rotation.y = t * 0.5;
    shell.rotation.y = -t * 0.2;
    shell.rotation.z = t * 0.1;
    ring.rotation.z = t * 0.6;
    particles.rotation.y = t * 0.06;
    group.position.y = Math.sin(t * 1.2) * 0.12;
    present();
  };

  if (reduceMotion) {
    gem.rotation.set(0.5, 0.7, 0);
    present();
  } else {
    tick();
  }

  let released = false;

  return () => {
    if (released) return;
    released = true;
    disposed = true;
    cancelAnimationFrame(frame);
    [gemGeometry, shellGeometry, ringGeometry, particleGeometry].forEach((g) => g.dispose());
    [gemMaterial, shellMaterial, ringMaterial, particleMaterial].forEach((m) => m.dispose());
    renderer.dispose();
    // Browsers cap live WebGL contexts; hand this one back right away
    if (Platform.OS === 'web') renderer.forceContextLoss();
  };
}

const styles = StyleSheet.create({
  fill: {
    overflow: 'hidden',
  },
});
