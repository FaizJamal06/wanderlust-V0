'use client';

import { useRef, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useLoader, ThreeEvent } from '@react-three/fiber';
import { Stars, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useRouter } from 'next/navigation';
import type { Listing } from '@/types/listing';
import { useUIStore } from '@/store/uiStore';
import { getImageUrl } from '@/lib/api';

/* ── helpers ─────────────────────────────────────── */
function latLngToVec3(lat: number, lng: number, r = 2.02): THREE.Vector3 {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
  );
}

/* ── Atmosphere glow ─────────────────────────────── */
function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[2.12, 64, 64]} />
      <meshPhongMaterial
        color={new THREE.Color(0x4488ff)}
        transparent
        opacity={0.04}
        side={THREE.FrontSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Single listing pin ──────────────────────────── */
function ListingPin({
  listing,
  isSelected,
  onClick,
}: {
  listing: Listing;
  isSelected: boolean;
  onClick: (l: Listing) => void;
}) {
  const meshRef  = useRef<THREE.Mesh>(null!);
  const [hov, setHov] = useState(false);
  const coords   = listing.geometry!.coordinates; // [lng, lat]
  const pos      = latLngToVec3(coords[1], coords[0]);
  const setCursor = useUIStore((s) => s.setCursorVariant);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hov || isSelected ? 1.6 : 1.0);
    }
  });

  return (
    <group position={pos}>
      <mesh
        ref={meshRef}
        onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(listing); }}
        onPointerOver={() => { setHov(true); setCursor('hover'); }}
        onPointerOut={()  => { setHov(false); setCursor('default'); }}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color={hov || isSelected ? '#64E4CC' : '#B197FC'}
          emissive={hov || isSelected ? '#64E4CC' : '#B197FC'}
          emissiveIntensity={hov || isSelected ? 2.5 : 1.2}
        />
      </mesh>
      {/* Glow ring under pin */}
      <mesh rotation-x={Math.PI / 2} position={[0, -0.01, 0]}>
        <ringGeometry args={[0.05, 0.08, 24]} />
        <meshBasicMaterial
          color={hov || isSelected ? '#64E4CC' : '#B197FC'}
          transparent
          opacity={hov || isSelected ? 0.6 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Popup on hover */}
      {(hov && !isSelected) && (
        <Html distanceFactor={6} style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          <div
            style={{
              background: 'rgba(6,8,13,0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(177,151,252,0.3)',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#E8EAF0',
              transform: 'translateX(-50%)',
              minWidth: '120px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: 600, color: '#B197FC', marginBottom: 2 }}>{listing.title}</div>
            <div style={{ color: '#6B7280', fontSize: 11 }}>{listing.location}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

/* ── Earth sphere ────────────────────────────────── */
function Earth({
  listings,
  selectedId,
  onPinClick,
}: {
  listings: Listing[];
  selectedId: string | null;
  onPinClick: (l: Listing) => void;
}) {
  const earthRef = useRef<THREE.Mesh>(null!);
  const setCursor = useUIStore((s) => s.setCursorVariant);

  // Load earth textures (served from /public/textures/)
  const [colorMap, normalMap] = useLoader(TextureLoader, [
    '/textures/earth_daymap.jpg',
    '/textures/earth_normal.jpg',
  ]);

  useFrame((_, delta) => {
    earthRef.current.rotation.y += delta * 0.04;
  });

  const geoListings = listings.filter(
    (l) => l.geometry?.coordinates?.length === 2
  );

  return (
    <group
      onPointerOver={() => setCursor('drag')}
      onPointerOut={() => setCursor('default')}
    >
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.6, 0.6)}
          shininess={12}
          specular={new THREE.Color(0x333366)}
        />
      </mesh>
      <Atmosphere />
      {geoListings.map((l) => (
        <ListingPin key={l._id} listing={l} isSelected={selectedId === l._id} onClick={onPinClick} />
      ))}
    </group>
  );
}

/* ── Tooltip overlay (2D) ────────────────────────── */
function ListingTooltip({
  listing,
  onClose,
}: {
  listing: Listing;
  onClose: () => void;
}) {
  const router = useRouter();
  const imgSrc = getImageUrl(listing);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        background: 'rgba(12,15,24,0.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(177,151,252,0.3)',
        borderRadius: '20px',
        overflow: 'hidden',
        zIndex: 10,
        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        animation: 'revealUp 0.35s ease',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '16/9' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={listing.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(6,8,13,0.7)',
            border: 'none', borderRadius: '50%',
            width: 28, height: 28, cursor: 'pointer', color: '#fff',
            fontSize: 14,
          }}
        >
          ✕
        </button>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ fontSize: 11, color: '#B197FC', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4 }}>
          {listing.category?.toUpperCase()}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#E8EAF0', marginBottom: 4 }}>
          {listing.title}
        </div>
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>
          📍 {listing.location}, {listing.country}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#E8EAF0' }}>
            ₹{listing.price.toLocaleString()}
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 400 }}>/night</span>
          </span>
          <button
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: 13 }}
            onClick={() => router.push(`/listings/${listing._id}`)}
          >
            View →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main exported scene ─────────────────────────── */
export default function GlobeScene({ listings }: { listings: Listing[] }) {
  const [selected, setSelected] = useState<Listing | null>(null);
  const setGlobeLoaded = useUIStore((s) => s.setGlobeLoaded);

  const handlePinClick = useCallback((l: Listing) => {
    setSelected((prev) => (prev?._id === l._id ? null : l));
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setGlobeLoaded(true)}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.25} />
        <directionalLight position={[8, 4, 6]}  intensity={1.4} color="#fff8f0" />
        <directionalLight position={[-5, -2, -4]} intensity={0.15} color="#4488ff" />

        {/* Space stars */}
        <Stars radius={90} depth={60} count={6000} factor={3} saturation={0.3} fade speed={0.5} />

        {/* Earth */}
        <Suspense fallback={null}>
          <Earth listings={listings} selectedId={selected?._id ?? null} onPinClick={handlePinClick} />
        </Suspense>

        {/* Controls */}
        <OrbitControls
          enableZoom
          enablePan={false}
          autoRotate={!selected}
          autoRotateSpeed={0.25}
          minDistance={3.2}
          maxDistance={9}
          zoomSpeed={0.5}
        />
      </Canvas>

      {/* 2D tooltip overlay */}
      {selected && (
        <ListingTooltip listing={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
