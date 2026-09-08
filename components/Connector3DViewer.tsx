"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { RotateCw, Maximize2, Layers, Eye, RefreshCw } from "lucide-react";

interface Connector3DViewerProps {
  shellStyle: { code: string; label?: string; desc?: string; prefix?: string };
  materialFinish: { code: string; label?: string; class?: string; hex?: string; textColor?: string };
  insertArrangement: { code: string; size: string; pins: number; contactSize: string; rating: string };
  contactType: { code: string; label: string };
  keying: { code: string; label?: string; angle: number; desc?: string };
  generatedMpn: string;
}

export function Connector3DViewer({
  shellStyle,
  materialFinish,
  insertArrangement,
  contactType,
  keying,
  generatedMpn,
}: Connector3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [isCutaway, setIsCutaway] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cameraView, setCameraView] = useState<"iso" | "front" | "side">("iso");

  // Interaction tracking
  const pointerPosRef = useRef({ x: 0, y: 0 });
  const rotVelocityRef = useRef({ x: 0, y: 0 });
  const autoRotRef = useRef(true);
  const wireframeRef = useRef(false);
  const cutawayRef = useRef(false);

  useEffect(() => {
    autoRotRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    wireframeRef.current = wireframe;
  }, [wireframe]);

  useEffect(() => {
    cutawayRef.current = isCutaway;
  }, [isCutaway]);

  // Rebuild 3D scene whenever configuration changes
  const buildConnectorModel = useCallback(() => {
    if (!sceneRef.current) return;

    // Remove old model group
    if (modelGroupRef.current) {
      sceneRef.current.remove(modelGroupRef.current);
      // Clean up geometries & materials
      modelGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
    }

    const group = new THREE.Group();
    modelGroupRef.current = group;

    // Parse shell plating color
    const shellColor = new THREE.Color(materialFinish.hex || "#555D50");
    const isStainless = materialFinish.code === "K";
    const isNickel = materialFinish.code === "F";

    const metalness = isStainless ? 0.92 : isNickel ? 0.95 : 0.82;
    const roughness = isStainless ? 0.35 : isNickel ? 0.18 : 0.42;

    const shellMaterial = new THREE.MeshStandardMaterial({
      color: shellColor,
      metalness,
      roughness,
      wireframe: wireframeRef.current,
    });

    const darkAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.5,
      roughness: 0.6,
      wireframe: wireframeRef.current,
    });

    const threadMaterial = new THREE.MeshStandardMaterial({
      color: shellColor.clone().offsetHSL(0, 0, 0.08),
      metalness: metalness * 0.95,
      roughness: roughness * 1.1,
      wireframe: wireframeRef.current,
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Gold alloy
      metalness: 0.98,
      roughness: 0.15,
      wireframe: wireframeRef.current,
    });

    const dielectricMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Aerospace blue composite insulator
      roughness: 0.7,
      metalness: 0.1,
      wireframe: wireframeRef.current,
    });

    const sealMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Fluorosilicone orange elastomer seal
      roughness: 0.9,
      metalness: 0.05,
      wireframe: wireframeRef.current,
    });

    // Connector dimensions
    const shellRadius = 1.0;
    const barrelLength = 1.8;

    // 1. MAIN CYLINDRICAL BARREL
    const barrelGeom = new THREE.CylinderGeometry(
      shellRadius * 0.92,
      shellRadius,
      barrelLength,
      36
    );
    const barrel = new THREE.Mesh(barrelGeom, shellMaterial);
    group.add(barrel);

    // 2. SHELL STYLE SPECIFIC HARDWARE (Wall Mount vs Jam Nut vs Plug)
    if (shellStyle.code === "20") {
      // Wall Mount Receptacle: 4-Hole Square Mounting Flange
      const flangeSize = shellRadius * 2.3;
      const flangeThickness = 0.18;
      const flangeGeom = new THREE.BoxGeometry(flangeSize, flangeThickness, flangeSize);
      const flange = new THREE.Mesh(flangeGeom, shellMaterial);
      flange.position.y = -0.3;
      group.add(flange);

      // 4 Screw Mounting Holes
      const holeOffset = flangeSize * 0.38;
      const holeGeom = new THREE.CylinderGeometry(0.1, 0.1, flangeThickness + 0.02, 16);
      const holeMaterial = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      [
        [-holeOffset, -holeOffset],
        [holeOffset, -holeOffset],
        [-holeOffset, holeOffset],
        [holeOffset, holeOffset],
      ].forEach(([hx, hz]) => {
        const hole = new THREE.Mesh(holeGeom, holeMaterial);
        hole.position.set(hx, -0.3, hz);
        group.add(hole);
      });
    } else if (shellStyle.code === "24") {
      // Jam Nut Receptacle: Hexagonal Mounting Nut + O-Ring
      const hexGeom = new THREE.CylinderGeometry(
        shellRadius * 1.35,
        shellRadius * 1.35,
        0.3,
        6
      );
      const hexNut = new THREE.Mesh(hexGeom, shellMaterial);
      hexNut.position.y = -0.25;
      group.add(hexNut);

      // Rear mounting thread
      const rearThreadGeom = new THREE.CylinderGeometry(
        shellRadius * 0.88,
        shellRadius * 0.88,
        0.6,
        32
      );
      const rearThread = new THREE.Mesh(rearThreadGeom, threadMaterial);
      rearThread.position.y = -0.7;
      group.add(rearThread);
    } else {
      // Straight Plug (26): Knurled Coupling Sleeve Ring with Anti-Decoupling teeth
      const sleeveGeom = new THREE.CylinderGeometry(
        shellRadius * 1.14,
        shellRadius * 1.14,
        0.8,
        36
      );
      const sleeve = new THREE.Mesh(sleeveGeom, shellMaterial);
      sleeve.position.y = -0.1;
      group.add(sleeve);

      // Knurling Bands (textured tactile ridges)
      for (let i = 0; i < 24; i++) {
        const ridgeGeom = new THREE.BoxGeometry(0.04, 0.72, 0.06);
        const ridge = new THREE.Mesh(ridgeGeom, darkAccentMaterial);
        const angle = (i / 24) * Math.PI * 2;
        ridge.position.set(
          Math.cos(angle) * shellRadius * 1.14,
          -0.1,
          Math.sin(angle) * shellRadius * 1.14
        );
        ridge.rotation.y = -angle;
        group.add(ridge);
      }
    }

    // 3. FRONT MATING THREADED SECTION (Triple-start ACME threads)
    const threadRingsCount = 6;
    for (let i = 0; i < threadRingsCount; i++) {
      const ringGeom = new THREE.TorusGeometry(shellRadius * 0.93, 0.035, 12, 36);
      const ring = new THREE.Mesh(ringGeom, threadMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.35 + i * 0.1;
      group.add(ring);
    }

    // 4. FRONT MATING BARREL LIP & KEYWAY
    const lipGeom = new THREE.CylinderGeometry(
      shellRadius * 0.94,
      shellRadius * 0.94,
      0.2,
      36
    );
    const lip = new THREE.Mesh(lipGeom, shellMaterial);
    lip.position.y = 0.95;
    group.add(lip);

    // Master Keyway Slot (Rotated by keying angle)
    const keyAngleRad = (keying.angle * Math.PI) / 180;
    const keywayGeom = new THREE.BoxGeometry(0.12, 0.3, 0.14);
    const keywayMesh = new THREE.Mesh(keywayGeom, darkAccentMaterial);
    keywayMesh.position.set(
      Math.sin(keyAngleRad) * shellRadius * 0.92,
      0.95,
      Math.cos(keyAngleRad) * shellRadius * 0.92
    );
    keywayMesh.rotation.y = keyAngleRad;
    group.add(keywayMesh);

    // 5. INTERNAL DIELECTRIC INSULATOR DISC
    const insertGeom = new THREE.CylinderGeometry(
      shellRadius * 0.82,
      shellRadius * 0.82,
      0.3,
      32
    );
    const insertMesh = new THREE.Mesh(insertGeom, dielectricMaterial);
    insertMesh.position.y = 0.85;
    group.add(insertMesh);

    // Fluorosilicone Interfacial Perimeter Seal
    const sealGeom = new THREE.TorusGeometry(shellRadius * 0.83, 0.04, 10, 32);
    const seal = new THREE.Mesh(sealGeom, sealMaterial);
    seal.rotation.x = Math.PI / 2;
    seal.position.y = 0.98;
    group.add(seal);

    // 6. DYNAMIC CONTACT PINS / SOCKET CAVITIES
    const pinCount = insertArrangement.pins;
    const isPins = contactType.code === "P";

    // Pin polar distribution coordinates
    const pinPositions: { x: number; z: number }[] = [];
    if (pinCount <= 13) {
      pinPositions.push({ x: 0, z: 0 });
      for (let i = 0; i < pinCount - 1; i++) {
        const a = (i / (pinCount - 1)) * Math.PI * 2;
        pinPositions.push({ x: Math.cos(a) * 0.52, z: Math.sin(a) * 0.52 });
      }
    } else if (pinCount <= 37) {
      pinPositions.push({ x: 0, z: 0 });
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        pinPositions.push({ x: Math.cos(a) * 0.35, z: Math.sin(a) * 0.35 });
      }
      for (let i = 0; i < pinCount - 13; i++) {
        const a = (i / (pinCount - 13)) * Math.PI * 2;
        pinPositions.push({ x: Math.cos(a) * 0.65, z: Math.sin(a) * 0.65 });
      }
    } else {
      // 66+ Pins: 3 Concentric Rings
      pinPositions.push({ x: 0, z: 0 });
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        pinPositions.push({ x: Math.cos(a) * 0.25, z: Math.sin(a) * 0.25 });
      }
      for (let i = 0; i < 20; i++) {
        const a = (i / 20) * Math.PI * 2;
        pinPositions.push({ x: Math.cos(a) * 0.48, z: Math.sin(a) * 0.48 });
      }
      for (let i = 0; i < Math.min(35, pinCount - 31); i++) {
        const a = (i / Math.min(35, pinCount - 31)) * Math.PI * 2;
        pinPositions.push({ x: Math.cos(a) * 0.7, z: Math.sin(a) * 0.7 });
      }
    }

    pinPositions.forEach(({ x, z }) => {
      if (isPins) {
        // Protruding Male Contact Pin
        const pinGeom = new THREE.CylinderGeometry(0.026, 0.026, 0.24, 12);
        const pinMesh = new THREE.Mesh(pinGeom, goldMaterial);
        pinMesh.position.set(x, 1.05, z);

        // Rounded Gold Tip
        const tipGeom = new THREE.SphereGeometry(0.026, 12, 12);
        const tipMesh = new THREE.Mesh(tipGeom, goldMaterial);
        tipMesh.position.set(x, 1.17, z);

        group.add(pinMesh);
        group.add(tipMesh);
      } else {
        // Recessed Female Socket Entry Cavity
        const socketRingGeom = new THREE.TorusGeometry(0.032, 0.012, 8, 16);
        const socketRing = new THREE.Mesh(socketRingGeom, goldMaterial);
        socketRing.rotation.x = Math.PI / 2;
        socketRing.position.set(x, 1.0, z);

        const socketHoleGeom = new THREE.CylinderGeometry(0.022, 0.022, 0.1, 12);
        const socketHole = new THREE.Mesh(socketHoleGeom, darkAccentMaterial);
        socketHole.position.set(x, 0.96, z);

        group.add(socketRing);
        group.add(socketHole);
      }
    });

    // 7. CUTAWAY VISUALIZER (Displays Internal EMI Fingers and Interfacial Chamber)
    if (cutawayRef.current) {
      const emiClipGeom = new THREE.TorusGeometry(shellRadius * 0.76, 0.06, 8, 24);
      const emiMaterial = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.2,
      });
      const emiClip = new THREE.Mesh(emiClipGeom, emiMaterial);
      emiClip.rotation.x = Math.PI / 2;
      emiClip.position.y = 0.55;
      group.add(emiClip);
    }

    // Initial orientation: Tilt slightly so face, threads and shell body are simultaneously visible
    group.rotation.x = 0.45;
    group.rotation.y = 0.65;

    sceneRef.current.add(group);
  }, [shellStyle, materialFinish, insertArrangement, contactType, keying]);

  // Initialize Three.js WebGL Renderer
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 280;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
    rimLight.position.set(-6, 2, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xfef08a, 1.2);
    fillLight.position.set(0, -5, 4);
    scene.add(fillLight);

    // Build model
    buildConnectorModel();

    // Animation Loop
    let lastTime = performance.now();
    const animate = (time: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (modelGroupRef.current) {
        // Auto-rotation when not manually dragging
        if (autoRotRef.current) {
          modelGroupRef.current.rotation.y += delta * 0.65;
        }

        // Apply velocity inertia
        if (Math.abs(rotVelocityRef.current.x) > 0.0001 || Math.abs(rotVelocityRef.current.y) > 0.0001) {
          modelGroupRef.current.rotation.y += rotVelocityRef.current.x;
          modelGroupRef.current.rotation.x += rotVelocityRef.current.y;
          rotVelocityRef.current.x *= 0.92;
          rotVelocityRef.current.y *= 0.92;
        }
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [buildConnectorModel]);

  // Rebuild model when props or wireframe/cutaway toggle change
  useEffect(() => {
    buildConnectorModel();
  }, [buildConnectorModel, wireframe, isCutaway]);

  // Pointer & Touch Events for 360° Drag
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    pointerPosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !modelGroupRef.current) return;

    const deltaX = e.clientX - pointerPosRef.current.x;
    const deltaY = e.clientY - pointerPosRef.current.y;

    pointerPosRef.current = { x: e.clientX, y: e.clientY };

    const rotSpeed = 0.008;
    modelGroupRef.current.rotation.y += deltaX * rotSpeed;
    modelGroupRef.current.rotation.x += deltaY * rotSpeed;

    rotVelocityRef.current = {
      x: deltaX * rotSpeed * 0.4,
      y: deltaY * rotSpeed * 0.4,
    };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  // Zoom with wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!cameraRef.current) return;
    const zoomDelta = e.deltaY * 0.003;
    cameraRef.current.position.z = Math.min(
      Math.max(cameraRef.current.position.z + zoomDelta, 3.2),
      8.0
    );
  };

  // Set Preset Camera Views
  const setPresetView = (view: "iso" | "front" | "side") => {
    setCameraView(view);
    setAutoRotate(false);
    if (!modelGroupRef.current) return;

    rotVelocityRef.current = { x: 0, y: 0 };
    if (view === "iso") {
      modelGroupRef.current.rotation.set(0.45, 0.65, 0);
    } else if (view === "front") {
      modelGroupRef.current.rotation.set(Math.PI / 2, 0, 0); // Face looking directly at camera
    } else if (view === "side") {
      modelGroupRef.current.rotation.set(0, Math.PI / 2, 0); // Profile view
    }
  };

  return (
    <div className="relative rounded-xs border border-slate-300 bg-slate-950 overflow-hidden shadow-inner select-none">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-56 sm:h-72 md:h-80 cursor-grab active:cursor-grabbing touch-none flex items-center justify-center relative"
      />

      {/* Top Floating Badge & Status */}
      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 px-2.5 py-1 rounded-2xs text-[10px] font-mono text-slate-200 shadow-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-white uppercase tracking-wider">Three.js 3D Engine</span>
          <span className="text-slate-400">|</span>
          <span className="text-amber-400">{insertArrangement.pins} Pins</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 px-2 py-0.5 rounded-2xs text-[10px] font-mono text-slate-300 pointer-events-auto">
          Plating: <strong className="text-amber-300">{materialFinish.code}</strong>
        </div>
      </div>

      {/* Interaction Help Hint */}
      <div className="absolute bottom-11 left-3 pointer-events-none hidden sm:block">
        <span className="text-[10px] text-slate-400/90 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-2xs font-sans">
          🖱️ Drag to rotate 360° • Scroll to zoom
        </span>
      </div>

      {/* Bottom Interactive Toolbar Controls */}
      <div className="absolute bottom-2 left-1.5 right-1.5 sm:left-2 sm:right-2 flex items-center justify-between gap-1 sm:gap-1.5 bg-slate-900/95 backdrop-blur-md p-1 sm:p-1.5 border border-slate-800 rounded-2xs text-[10px] sm:text-[11px]">
        {/* Preset Angles */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPresetView("iso")}
            className={`px-2 py-0.5 rounded-2xs font-bold transition-colors cursor-pointer ${
              cameraView === "iso" && !autoRotate
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            title="Isometric 3D Perspective"
          >
            3D Iso
          </button>
          <button
            type="button"
            onClick={() => setPresetView("front")}
            className={`px-2 py-0.5 rounded-2xs font-bold transition-colors cursor-pointer ${
              cameraView === "front"
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            title="Direct Front Pin Face View"
          >
            Pin Face
          </button>
          <button
            type="button"
            onClick={() => setPresetView("side")}
            className={`px-2 py-0.5 rounded-2xs font-bold transition-colors cursor-pointer ${
              cameraView === "side"
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            title="Side Thread Profile"
          >
            Side
          </button>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2 py-0.5 rounded-2xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              autoRotate
                ? "bg-emerald-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            title="Toggle Auto 360° Spin"
          >
            <RotateCw className={`h-3 w-3 ${autoRotate ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Spin</span>
          </button>

          <button
            type="button"
            onClick={() => setWireframe(!wireframe)}
            className={`px-2 py-0.5 rounded-2xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              wireframe
                ? "bg-amber-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
            title="Toggle CAD Wireframe Mesh"
          >
            <Layers className="h-3 w-3" />
            <span className="hidden sm:inline">Wire</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAutoRotate(true);
              setCameraView("iso");
              if (modelGroupRef.current) {
                modelGroupRef.current.rotation.set(0.45, 0.65, 0);
              }
              if (cameraRef.current) {
                cameraRef.current.position.set(0, 0, 5.2);
              }
            }}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xs transition-colors cursor-pointer"
            title="Reset Camera Position"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
