import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { applyMove, SOLVED } from '../../lib/cube/state.js';

const FACE_COLORS = {
  U: '#FFFFFF',
  D: '#FFD400',
  F: '#009B48',
  B: '#0046AD',
  R: '#B71234',
  L: '#FF5800',
  X: '#0A0B0F', // hidden internal sticker
};

// Build the 27 cubies (3x3x3) with their initial positions and which face stickers they show.
function buildCubies() {
  const cubies = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubies.push({ id: `${x},${y},${z}`, x, y, z });
      }
    }
  }
  return cubies;
}

// Map facelet state string -> color for each (cubie, face) pair.
// We compute sticker color per visible face based on (x,y,z) position and current facelet state.
//
// The 54-sticker facelet array layout is fixed (URFDLB), and each sticker corresponds to
// a unique (face, row, col) on the SOLVED cube. After moves, the indices stay the same but
// colors move around. We need a deterministic mapping: which facelet index is at the
// "U face, row r, col c" slot of the cube AT REST? That never changes — facelet index 0..8 = U.
// So we read from the facelet string by face+row+col, where row/col are determined by the
// current position of the cubie relative to that face.

function colorAt(state, face, row, col) {
  const faceIndex = { U: 0, R: 1, F: 2, D: 3, L: 4, B: 5 }[face];
  const idx = faceIndex * 9 + row * 3 + col;
  const ch = state[idx];
  return FACE_COLORS[ch] || FACE_COLORS.X;
}

function getCubieFaceColor(state, x, y, z, face) {
  // For each face, derive (row, col) from the cubie's static position when on that face.
  // Coordinates: x=L→R (-1..1), y=D→U (-1..1), z=B→F (-1..1).
  // Returns the color string, or null if the cubie isn't on that face.
  switch (face) {
    case 'U':
      if (y !== 1) return null;
      // Row 0 = back (z=-1), col 0 = left (x=-1)
      return colorAt(state, 'U', z + 1, x + 1);
    case 'D':
      if (y !== -1) return null;
      // Row 0 = front (z=1), col 0 = left (x=-1)
      return colorAt(state, 'D', 1 - z, x + 1);
    case 'F':
      if (z !== 1) return null;
      // Row 0 = up (y=1), col 0 = left (x=-1)
      return colorAt(state, 'F', 1 - y, x + 1);
    case 'B':
      if (z !== -1) return null;
      // Row 0 = up (y=1), col 0 = right (x=1)
      return colorAt(state, 'B', 1 - y, 1 - x);
    case 'R':
      if (x !== 1) return null;
      // Row 0 = up (y=1), col 0 = front (z=1)
      return colorAt(state, 'R', 1 - y, 1 - z);
    case 'L':
      if (x !== -1) return null;
      // Row 0 = up (y=1), col 0 = back (z=-1)
      return colorAt(state, 'L', 1 - y, z + 1);
    default:
      return null;
  }
}

function Cubie({ x, y, z, state, size = 0.94 }) {
  const stickerOffset = 0.501;
  const faces = [
    { face: 'R', pos: [stickerOffset, 0, 0], rot: [0, Math.PI / 2, 0] },
    { face: 'L', pos: [-stickerOffset, 0, 0], rot: [0, -Math.PI / 2, 0] },
    { face: 'U', pos: [0, stickerOffset, 0], rot: [-Math.PI / 2, 0, 0] },
    { face: 'D', pos: [0, -stickerOffset, 0], rot: [Math.PI / 2, 0, 0] },
    { face: 'F', pos: [0, 0, stickerOffset], rot: [0, 0, 0] },
    { face: 'B', pos: [0, 0, -stickerOffset], rot: [0, Math.PI, 0] },
  ];
  return (
    <group position={[x, y, z]}>
      <RoundedBox args={[size, size, size]} radius={0.08} smoothness={3}>
        <meshStandardMaterial color="#0a0a0a" roughness={0.7} metalness={0.1} />
      </RoundedBox>
      {faces.map(({ face, pos, rot }) => {
        const color = getCubieFaceColor(state, x, y, z, face);
        if (!color) return null;
        return (
          <mesh key={face} position={pos} rotation={rot}>
            <planeGeometry args={[0.82, 0.82]} />
            <meshStandardMaterial
              color={color}
              roughness={0.35}
              metalness={0.05}
              emissive={color}
              emissiveIntensity={0.05}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Determines whether a cubie at (x,y,z) belongs to the layer rotated by the given face.
function inLayer(face, x, y, z) {
  switch (face) {
    case 'U': return y === 1;
    case 'D': return y === -1;
    case 'R': return x === 1;
    case 'L': return x === -1;
    case 'F': return z === 1;
    case 'B': return z === -1;
    default: return false;
  }
}

// Axis & sign for face rotation (right-hand rule, CW when looking AT the face from outside).
function rotationAxisAndSign(face) {
  switch (face) {
    case 'U': return { axis: new THREE.Vector3(0, 1, 0), sign: -1 };
    case 'D': return { axis: new THREE.Vector3(0, 1, 0), sign: 1 };
    case 'R': return { axis: new THREE.Vector3(1, 0, 0), sign: -1 };
    case 'L': return { axis: new THREE.Vector3(1, 0, 0), sign: 1 };
    case 'F': return { axis: new THREE.Vector3(0, 0, 1), sign: -1 };
    case 'B': return { axis: new THREE.Vector3(0, 0, 1), sign: 1 };
    default: return { axis: new THREE.Vector3(0, 1, 0), sign: 1 };
  }
}

function CubeScene({ state, animatingMove, onMoveComplete, autoSpin }) {
  const rootRef = useRef();
  const layerRef = useRef();
  const startTime = useRef(null);
  const cubies = useMemo(() => buildCubies(), []);

  // Auto idle spin
  useFrame((_, dt) => {
    if (autoSpin && rootRef.current && !animatingMove) {
      rootRef.current.rotation.y += dt * 0.25;
      rootRef.current.rotation.x = Math.sin(performance.now() / 4000) * 0.06;
    }
  });

  // Animate face turn
  useFrame(() => {
    if (!animatingMove || !layerRef.current) return;
    if (startTime.current == null) startTime.current = performance.now();
    const elapsed = performance.now() - startTime.current;
    const duration = 220 * Math.abs(animatingMove.turns);
    const t = Math.min(elapsed / duration, 1);
    // ease-out-quart
    const eased = 1 - Math.pow(1 - t, 4);
    const { axis, sign } = rotationAxisAndSign(animatingMove.face);
    const totalAngle = sign * (Math.PI / 2) * animatingMove.turns;
    layerRef.current.setRotationFromAxisAngle(axis, eased * totalAngle);
    if (t >= 1) {
      startTime.current = null;
      onMoveComplete();
    }
  });

  // Reset layer rotation when move changes
  useEffect(() => {
    if (layerRef.current) layerRef.current.rotation.set(0, 0, 0);
    startTime.current = null;
  }, [animatingMove]);

  const layerCubies = animatingMove
    ? cubies.filter((c) => inLayer(animatingMove.face, c.x, c.y, c.z))
    : [];
  const staticCubies = animatingMove
    ? cubies.filter((c) => !inLayer(animatingMove.face, c.x, c.y, c.z))
    : cubies;

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={0.9} castShadow />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} />
      <pointLight position={[0, 0, 6]} intensity={0.4} color="#6E5BFF" />
      <group ref={rootRef} rotation={[0.45, -0.6, 0]}>
        {staticCubies.map((c) => (
          <Cubie key={c.id} x={c.x} y={c.y} z={c.z} state={state} />
        ))}
        <group ref={layerRef}>
          {layerCubies.map((c) => (
            <Cubie key={c.id} x={c.x} y={c.y} z={c.z} state={state} />
          ))}
        </group>
      </group>
    </>
  );
}

const EMPTY_MOVES = Object.freeze([]);

export default function Cube3D({
  state = SOLVED,
  pendingMoves = EMPTY_MOVES,
  onMovesComplete,
  autoSpin = false,
  interactive = false,
  className,
  cameraDistance = 5.5,
}) {
  const [currentState, setCurrentState] = useState(state);
  const [queue, setQueue] = useState([]);
  const [prevState, setPrevState] = useState(state);
  const [prevPending, setPrevPending] = useState(pendingMoves);

  // Sync external state prop → reset internal state (React-blessed pattern)
  if (prevState !== state) {
    setPrevState(state);
    setCurrentState(state);
    setQueue([]);
  }

  // Append new pendingMoves array → into the queue
  if (prevPending !== pendingMoves) {
    setPrevPending(pendingMoves);
    if (pendingMoves && pendingMoves.length) {
      setQueue((q) => [...q, ...pendingMoves]);
    }
  }

  // Active move is derived directly — no extra render.
  const active = queue[0] || null;

  const handleComplete = () => {
    if (!active) return;
    setCurrentState((s) => applyMove(s, active));
    setQueue((q) => q.slice(1));
    if (onMovesComplete && queue.length === 1) onMovesComplete();
  };

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [cameraDistance, cameraDistance * 0.85, cameraDistance], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <CubeScene
          state={currentState}
          animatingMove={active}
          onMoveComplete={handleComplete}
          autoSpin={autoSpin && !interactive}
        />
        {interactive && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            rotateSpeed={0.7}
            dampingFactor={0.12}
          />
        )}
      </Canvas>
    </div>
  );
}
