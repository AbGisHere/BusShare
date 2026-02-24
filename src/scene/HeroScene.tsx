import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const SAGE = '#84A98C';
const SAGE_DARK = '#52796F';
const NAVY = '#01161E';

function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const count = 600;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color(SAGE);
    const c2 = new THREE.Color(SAGE_DARK);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      const c = Math.random() > 0.5 ? c1 : c2;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.04;
      ref.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.18} vertexColors transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

function FloatingShape({ position, color, shape }: {
  position: [number, number, number];
  color: string;
  shape: 'box' | 'oct' | 'torus';
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const speed = useMemo(() => 0.3 + Math.random() * 0.4, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * speed * 0.5;
      ref.current.rotation.y += delta * speed;
    }
  });

  const geo = shape === 'box'
    ? <boxGeometry args={[1, 1, 1]} />
    : shape === 'oct'
    ? <octahedronGeometry args={[0.8]} />
    : <torusGeometry args={[0.7, 0.25, 8, 20]} />;

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={ref} position={position}>
        {geo}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.55}
          wireframe={shape === 'torus'}
        />
      </mesh>
    </Float>
  );
}

function BusIcon() {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.25;
  });

  return (
    <Float speed={0.8} floatIntensity={1.2}>
      <group ref={ref} position={[0, 0, -2]}>
<<<<<<< HEAD
=======
        {/* Body */}
>>>>>>> a4055be (V2.1.1 : Fronted changes)
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[3.2, 1.4, 1.4]} />
          <meshStandardMaterial color={SAGE} emissive={SAGE} emissiveIntensity={0.2} transparent opacity={0.7} />
        </mesh>
<<<<<<< HEAD
=======
        {/* Roof */}
>>>>>>> a4055be (V2.1.1 : Fronted changes)
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[3.0, 0.35, 1.3]} />
          <meshStandardMaterial color={SAGE_DARK} emissive={SAGE_DARK} emissiveIntensity={0.15} transparent opacity={0.7} />
        </mesh>
<<<<<<< HEAD
=======
        {/* Windows */}
>>>>>>> a4055be (V2.1.1 : Fronted changes)
        {[-1.0, 0, 1.0].map((x, i) => (
          <mesh key={i} position={[x, 0.45, 0.72]}>
            <boxGeometry args={[0.65, 0.55, 0.05]} />
            <meshStandardMaterial color="#CAD2C5" emissive="#CAD2C5" emissiveIntensity={0.6} transparent opacity={0.8} />
          </mesh>
        ))}
<<<<<<< HEAD
=======
        {/* Wheels */}
>>>>>>> a4055be (V2.1.1 : Fronted changes)
        {[-1.1, 1.1].map((x, i) => (
          <mesh key={i} position={[x, -0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 1.5, 12]} />
            <meshStandardMaterial color="#1a3a4a" />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

const shapes: Array<{ position: [number,number,number]; color: string; shape: 'box'|'oct'|'torus' }> = [
  { position: [-8, 3, -8], color: SAGE, shape: 'oct' },
  { position: [9, -2, -12], color: SAGE_DARK, shape: 'box' },
  { position: [-6, -5, -6], color: SAGE, shape: 'torus' },
  { position: [7, 4, -10], color: '#CAD2C5', shape: 'oct' },
  { position: [-12, 1, -14], color: SAGE_DARK, shape: 'box' },
  { position: [4, -6, -8], color: SAGE, shape: 'torus' },
  { position: [12, 2, -16], color: '#CAD2C5', shape: 'oct' },
  { position: [-4, 6, -10], color: SAGE_DARK, shape: 'box' },
];

export const HeroScene: React.FC = () => (
  <Canvas
    camera={{ position: [0, 0, 18], fov: 55 }}
    style={{ position: 'absolute', inset: 0, background: NAVY }}
    gl={{ antialias: true, alpha: false }}
  >
    <fog attach="fog" args={[NAVY, 20, 60]} />
    <ambientLight intensity={0.3} />
    <directionalLight position={[5, 10, 5]} intensity={0.6} color="#b0c8bc" />
    <pointLight position={[0, 0, 5]} intensity={0.8} color={SAGE} />
    <pointLight position={[-10, 5, 0]} intensity={0.4} color="#CAD2C5" />

    <Particles />
    <BusIcon />
    {shapes.map((s, i) => <FloatingShape key={i} {...s} />)}
  </Canvas>
);

export default HeroScene;
