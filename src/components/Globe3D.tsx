import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { DESTINATIONS } from '../data/travelData';
import { DestinationId } from '../types/travel';
import { Compass, RotateCw, Play, Pause, Navigation, Info } from 'lucide-react';

interface Globe3DProps {
  selectedDestinationId: DestinationId;
  onSelectDestination: (id: DestinationId) => void;
  activeDay: number;
}

// Pre-allocated math objects to prevent garbage collection in render loop
const _vec3 = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3(0, 0, 0);

// Coordinates: India Departure Hub + 5 Tour Destinations
interface GlobeMarker {
  id: DestinationId | 'india';
  name: string;
  country: string;
  flag: string;
  lat: number;
  lng: number;
  isHub?: boolean;
}

const MARKERS: GlobeMarker[] = [
  { id: 'india', name: 'Delhi / Mumbai (Origin Hub)', country: 'India', flag: '🇮🇳', lat: 20.5937, lng: 78.9629, isHub: true },
  { id: 'malaysia', name: 'Kuala Lumpur', country: 'Malaysia', flag: '🇲🇾', lat: 3.1390, lng: 101.6869 },
  { id: 'singapore', name: 'Singapore City', country: 'Singapore', flag: '🇸🇬', lat: 1.3521, lng: 103.8198 },
  { id: 'thailand', name: 'Bangkok', country: 'Thailand', flag: '🇹🇭', lat: 13.7563, lng: 100.5018 },
  { id: 'indonesia', name: 'Bali (Denpasar)', country: 'Indonesia', flag: '🇮🇩', lat: -8.3405, lng: 115.0920 },
  { id: 'uae', name: 'Dubai', country: 'United Arab Emirates', flag: '🇦🇪', lat: 25.2048, lng: 55.2708 },
];

// Flight route sequence: India -> Malaysia -> Singapore -> Thailand -> Bali -> Dubai -> India
const FLIGHT_LEGS: { from: GlobeMarker; to: GlobeMarker; legIndex: number }[] = [
  { from: MARKERS[0], to: MARKERS[1], legIndex: 1 }, // India -> Malaysia
  { from: MARKERS[1], to: MARKERS[2], legIndex: 2 }, // Malaysia -> Singapore
  { from: MARKERS[2], to: MARKERS[3], legIndex: 3 }, // Singapore -> Thailand
  { from: MARKERS[3], to: MARKERS[4], legIndex: 4 }, // Thailand -> Bali
  { from: MARKERS[4], to: MARKERS[5], legIndex: 5 }, // Bali -> Dubai
  { from: MARKERS[5], to: MARKERS[0], legIndex: 6 }, // Dubai -> India
];

// Convert Lat/Lng on globe of radius R to Vector3
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Generate high-resolution procedural Earth texture with continents and city lights
function createProceduralEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep ocean background
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#051329');
  oceanGrad.addColorStop(0.5, '#071A35');
  oceanGrad.addColorStop(1, '#051329');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle lat/long coordinates grid
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
  ctx.lineWidth = 1;
  for (let lat = 0; lat <= canvas.height; lat += 64) {
    ctx.beginPath();
    ctx.moveTo(0, lat);
    ctx.lineTo(canvas.width, lat);
    ctx.stroke();
  }
  for (let lng = 0; lng <= canvas.width; lng += 64) {
    ctx.beginPath();
    ctx.moveTo(lng, 0);
    ctx.lineTo(lng, canvas.height);
    ctx.stroke();
  }

  // Draw procedural continental landmasses with high fidelity
  // Mapping lat/lng to canvas coordinates: x = (lng + 180) * (width / 360), y = (90 - lat) * (height / 180)
  const toX = (lng: number) => ((lng + 180) / 360) * canvas.width;
  const toY = (lat: number) => ((90 - lat) / 180) * canvas.height;

  // Landmass color
  ctx.fillStyle = '#0f2942';
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 1.5;

  // Helper to draw filled land polygons
  const drawLand = (coords: [number, number][]) => {
    ctx.beginPath();
    coords.forEach(([lat, lng], idx) => {
      const x = toX(lng);
      const y = toY(lat);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // 1. Indian Subcontinent & South Asia
  drawLand([
    [36, 74], [32, 79], [28, 88], [27, 95], [22, 92], [21, 87], [16, 82],
    [10, 80], [8, 77], [12, 75], [19, 73], [24, 69], [25, 63], [30, 68], [35, 72]
  ]);

  // 2. Southeast Asia & Indochina & Thailand & Malaysia
  drawLand([
    [26, 98], [22, 108], [15, 108], [10, 105], [7, 100], [4, 101], [1.3, 103.8],
    [6, 100], [10, 99], [15, 98], [20, 97], [24, 95]
  ]);

  // 3. Indonesia (Sumatra, Java, Bali, Borneo, Sulawesi)
  drawLand([
    [5, 96], [2, 99], [-3, 103], [-6, 106], [-8, 114], [-8.5, 115.5], [-8, 117],
    [-7, 112], [-6, 106], [-2, 101], [3, 97]
  ]);
  drawLand([
    [6, 116], [4, 118], [0, 118], [-4, 115], [-3, 110], [1, 109], [4, 114]
  ]);

  // 4. Arabian Peninsula & Middle East (UAE, Oman, Saudi Arabia)
  drawLand([
    [32, 35], [30, 48], [25, 55], [23, 59], [17, 54], [12, 44], [22, 39], [28, 35]
  ]);

  // 5. Eurasia (Europe & Central Asia)
  drawLand([
    [70, 30], [60, 45], [55, 60], [50, 85], [50, 120], [60, 140], [65, 170],
    [40, 120], [35, 105], [30, 80], [40, 50], [45, 30], [55, 10], [60, 5], [70, 25]
  ]);

  // 6. Africa
  drawLand([
    [35, -5], [37, 10], [32, 32], [12, 44], [0, 42], [-15, 40], [-34, 19],
    [-34, 18], [-10, 12], [5, 2], [15, -17], [30, -10]
  ]);

  // 7. Australia
  drawLand([
    [-12, 131], [-15, 136], [-24, 153], [-37, 150], [-38, 144], [-32, 116],
    [-22, 114], [-15, 124]
  ]);

  // 8. Glowing metropolitan clusters & city night lights
  const cities: [number, number, string, number][] = [
    [28.6, 77.2, '#f59e0b', 5], // Delhi
    [19.0, 72.8, '#f59e0b', 5], // Mumbai
    [3.1, 101.7, '#22d3ee', 4], // Kuala Lumpur
    [1.35, 103.8, '#38bdf8', 4], // Singapore
    [13.7, 100.5, '#f59e0b', 4], // Bangkok
    [-8.4, 115.1, '#34d399', 4], // Bali
    [25.2, 55.3, '#fbbf24', 5], // Dubai
    [22.3, 114.1, '#38bdf8', 3], // HK
    [35.6, 139.6, '#38bdf8', 3], // Tokyo
    [51.5, -0.1, '#f59e0b', 3], // London
  ];

  cities.forEach(([lat, lng, color, rad]) => {
    const cx = toX(lng);
    const cy = toY(lat);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad * 3);
    glow.addColorStop(0, color);
    glow.addColorStop(0.4, color);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, rad * 3, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export const Globe3D: React.FC<Globe3DProps> = ({
  selectedDestinationId,
  onSelectDestination,
  activeDay,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [hoveredMarker, setHoveredMarker] = useState<GlobeMarker | null>(null);
  const [activeLegText, setActiveLegText] = useState('India ➔ Malaysia');
  const [collapsed, setCollapsed] = useState(false);

  // Mutable refs to persist Three.js scene instances without re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const airplaneRef = useRef<THREE.Mesh | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.3, y: -1.2 });
  const activeArcProgressRef = useRef(0);
  const flightArcsRef = useRef<THREE.Line[]>([]);

  // Find destination matching selected ID
  const currentDestination = DESTINATIONS.find((d) => d.id === selectedDestinationId);

  // Smoothly center the globe on selected destination
  const focusOnCoordinates = useCallback((lat: number, lng: number) => {
    // Globe rotation maps: y rotation = -(lng * degToRad) - offset
    const targetY = -((lng - 90) * (Math.PI / 180));
    const targetX = (lat * (Math.PI / 180)) * 0.5;
    targetRotationRef.current = { x: targetX, y: targetY };
  }, []);

  // Update camera focus when selected destination changes
  useEffect(() => {
    if (currentDestination) {
      focusOnCoordinates(currentDestination.lat, currentDestination.lng);
    }
  }, [currentDestination, focusOnCoordinates]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Initialize Scene, Camera, Renderer
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x050b14, 0.05);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 3. Lighting: Warm Key Light + Cool Ambient
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    keyLight.position.set(5, 4, 6);
    scene.add(keyLight);

    const goldFill = new THREE.DirectionalLight(0xf59e0b, 1.0);
    goldFill.position.set(-6, -2, -4);
    scene.add(goldFill);

    // 4. Globe Assembly
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    const GLOBE_RADIUS = 2.6;

    // Earth Sphere
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthTexture = createProceduralEarthTexture();
    earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.75,
      metalness: 0.15,
      bumpScale: 0.05,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // Atmosphere Glow Shell
    const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.025, 48, 48);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Outer Star Field / Dust particles
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 4.5 + Math.random() * 4.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.03,
      transparent: true,
      opacity: 0.45,
    });
    const particleField = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleField);

    // 5. Destination Marker Pins & Glowing Rings
    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);

    MARKERS.forEach((marker) => {
      const pos = latLngToVector3(marker.lat, marker.lng, GLOBE_RADIUS);
      const isOrigin = marker.isHub;

      // Base pin sphere
      const pinGeom = new THREE.SphereGeometry(isOrigin ? 0.055 : 0.048, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: isOrigin ? 0xf59e0b : 0x22d3ee,
      });
      const pinMesh = new THREE.Mesh(pinGeom, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { marker };
      markerGroup.add(pinMesh);

      // Beacon ring
      const ringGeom = new THREE.RingGeometry(0.065, 0.085, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isOrigin ? 0xf59e0b : 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.002));
      ringMesh.lookAt(_targetLookAt);
      markerGroup.add(ringMesh);

      // Pin stem pointing outward from center
      const stemGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.12, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: isOrigin ? 0xf59e0b : 0x22d3ee });
      const stemMesh = new THREE.Mesh(stemGeom, stemMat);
      const stemPos = pos.clone().multiplyScalar(1.025);
      stemMesh.position.copy(stemPos);
      stemMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      markerGroup.add(stemMesh);
    });

    // 6. 3D Flight Arcs Connecting Destinations
    const arcsGroup = new THREE.Group();
    globeGroup.add(arcsGroup);
    flightArcsRef.current = [];

    FLIGHT_LEGS.forEach((leg, index) => {
      const vFrom = latLngToVector3(leg.from.lat, leg.from.lng, GLOBE_RADIUS);
      const vTo = latLngToVector3(leg.to.lat, leg.to.lng, GLOBE_RADIUS);

      // Great circle mid-point elevated into the sky for authentic flight trajectory
      const midPoint = vFrom.clone().add(vTo).multiplyScalar(0.5);
      const distance = vFrom.distanceTo(vTo);
      const elevation = GLOBE_RADIUS + Math.min(distance * 0.35, 1.1);
      midPoint.normalize().multiplyScalar(elevation);

      const curve = new THREE.QuadraticBezierCurve3(vFrom, midPoint, vTo);
      const points = curve.getPoints(50);
      const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);

      const isFirst = index === 0;
      const curveMaterial = new THREE.LineBasicMaterial({
        color: isFirst ? 0xf59e0b : 0x0ea5e9,
        transparent: true,
        opacity: isFirst ? 0.95 : 0.45,
        linewidth: 2,
      });

      const line = new THREE.Line(curveGeometry, curveMaterial);
      (line as unknown as { curveObj: THREE.QuadraticBezierCurve3 }).curveObj = curve;
      arcsGroup.add(line);
      flightArcsRef.current.push(line);
    });

    // 7. Mini 3D Airplane Mesh traveling along the flight route
    const planeGroup = new THREE.Group();
    // Fuselage
    const fuselageGeom = new THREE.ConeGeometry(0.04, 0.14, 8);
    fuselageGeom.rotateX(Math.PI / 2);
    const fuselageMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const fuselage = new THREE.Mesh(fuselageGeom, fuselageMat);
    planeGroup.add(fuselage);

    // Wings
    const wingGeom = new THREE.BoxGeometry(0.18, 0.005, 0.04);
    const wingMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const wings = new THREE.Mesh(wingGeom, wingMat);
    planeGroup.add(wings);

    // Tail fin
    const tailGeom = new THREE.BoxGeometry(0.005, 0.05, 0.03);
    const tail = new THREE.Mesh(tailGeom, wingMat);
    tail.position.set(0, 0.02, -0.05);
    planeGroup.add(tail);

    globeGroup.add(planeGroup);
    airplaneRef.current = planeGroup as unknown as THREE.Mesh;

    // 8. Mouse & Pointer Interaction for Manual Globe Rotation
    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;
        targetRotationRef.current.y += deltaX * 0.005;
        targetRotationRef.current.x = Math.max(-1.0, Math.min(1.0, targetRotationRef.current.x + deltaY * 0.005));
        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
        return;
      }

      // Raycast marker pins on hover
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerGroup.children);
      if (intersects.length > 0 && intersects[0].object.userData?.marker) {
        setHoveredMarker(intersects[0].object.userData.marker);
        container.style.cursor = 'pointer';
      } else {
        setHoveredMarker(null);
        container.style.cursor = 'grab';
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerGroup.children);
      if (intersects.length > 0 && intersects[0].object.userData?.marker) {
        const m = intersects[0].object.userData.marker as GlobeMarker;
        if (m.id !== 'india') {
          onSelectDestination(m.id as DestinationId);
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    domElement.addEventListener('click', handleClick);

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. Silky Smooth Animation Loop
    let animationFrameId = 0;
    let clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();

      // Auto-rotation when enabled and user isn't dragging
      if (isRotating && !isDraggingRef.current) {
        targetRotationRef.current.y += delta * 0.12;
      }

      // Smooth exponential damping
      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.y = THREE.MathUtils.damp(
          globeGroupRef.current.rotation.y,
          targetRotationRef.current.y,
          4,
          delta
        );
        globeGroupRef.current.rotation.x = THREE.MathUtils.damp(
          globeGroupRef.current.rotation.x,
          targetRotationRef.current.x,
          4,
          delta
        );
      }

      // Slowly rotate star particles
      particleField.rotation.y += delta * 0.03;

      // Animate airplane along active flight leg
      activeArcProgressRef.current = (activeArcProgressRef.current + delta * 0.16) % 1;
      const currentLegIndex = Math.min(Math.floor((activeDay - 1) / 2), FLIGHT_LEGS.length - 1);
      const activeLine = (flightArcsRef.current[currentLegIndex] as unknown) as
        | (THREE.Line & { curveObj?: THREE.QuadraticBezierCurve3 })
        | undefined;

      if (activeLine && activeLine.curveObj && airplaneRef.current) {
        const t = activeArcProgressRef.current;
        const currentPos = activeLine.curveObj.getPointAt(t);
        const lookPos = activeLine.curveObj.getPointAt(Math.min(t + 0.02, 1));
        airplaneRef.current.position.copy(currentPos);
        airplaneRef.current.lookAt(lookPos);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domElement.removeEventListener('mousedown', handlePointerDown);
      domElement.removeEventListener('click', handleClick);
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      earthTexture.dispose();
    };
  }, [isRotating, activeDay, onSelectDestination]);

  // Update Flight Line Colors based on activeDay
  useEffect(() => {
    const legIdx = Math.min(Math.floor((activeDay - 1) / 2), FLIGHT_LEGS.length - 1);
    flightArcsRef.current.forEach((line, i) => {
      const mat = line.material as THREE.LineBasicMaterial;
      if (i === legIdx) {
        mat.color.setHex(0xf59e0b); // Active Gold
        mat.opacity = 1.0;
      } else if (i < legIdx) {
        mat.color.setHex(0x10b981); // Completed Emerald
        mat.opacity = 0.55;
      } else {
        mat.color.setHex(0x0ea5e9); // Upcoming Sky Blue
        mat.opacity = 0.35;
      }
    });

    const currentLeg = FLIGHT_LEGS[legIdx];
    if (currentLeg) {
      setActiveLegText(`${currentLeg.from.country} ➔ ${currentLeg.to.country}`);
    }
  }, [activeDay]);

  return (
    <div className="relative w-full h-[520px] md:h-[620px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#071224] via-[#050b14] to-[#040811] border border-cyan-500/20 shadow-2xl flex flex-col justify-between">
      {/* Top Spec Badges */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between pointer-events-none gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-xs font-mono text-cyan-300 pointer-events-auto shadow-lg">
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
          <span>Active Leg: {activeLegText}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300">Day {activeDay} of 10</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs text-slate-300 pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Drag to orbit · Scroll to inspect · Click pins</span>
        </div>
      </div>

      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Hover Pin Popup Card */}
      {hoveredMarker && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-200">
          <div className="px-4 py-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-cyan-400/50 shadow-2xl text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-white">
              <span className="text-lg">{hoveredMarker.flag}</span>
              <span>{hoveredMarker.name}</span>
            </div>
            <div className="text-xs text-cyan-300 mt-0.5">
              {hoveredMarker.isHub ? 'Indian International Departure Hub' : 'Click marker to view curated day itinerary'}
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Unified Bottom Control Dock (Three.js Directive Compliant) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[820px] pointer-events-auto transition-transform duration-300">
        <div className="flex justify-end mb-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-900/90 hover:bg-slate-800 rounded-md border border-slate-700/60 shadow-md transition-colors"
          >
            {collapsed ? '▴ Show Globe Dock' : '▾ Hide Controls'}
          </button>
        </div>

        {!collapsed && (
          <div className="p-2 sm:p-3 rounded-xl bg-slate-950/85 backdrop-blur-xl border border-cyan-500/25 shadow-2xl flex flex-wrap items-center justify-between gap-2 sm:gap-4">
            {/* Country Selector Pills */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {DESTINATIONS.map((dest) => {
                const isSelected = dest.id === selectedDestinationId;
                return (
                  <button
                    key={dest.id}
                    onClick={() => onSelectDestination(dest.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/30'
                        : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <span>{dest.flag}</span>
                    <span className="hidden sm:inline">{dest.country}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Utility Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`p-2 rounded-lg text-xs border transition-colors flex items-center gap-1.5 ${
                  isRotating
                    ? 'bg-slate-800/90 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title="Toggle Auto Rotation"
              >
                {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden md:inline text-[11px]">Orbit</span>
              </button>

              <button
                onClick={() => focusOnCoordinates(20.5937, 78.9629)}
                className="p-2 rounded-lg text-xs bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1.5"
                title="Reset View to India"
              >
                <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline text-[11px]">Origin (India)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
