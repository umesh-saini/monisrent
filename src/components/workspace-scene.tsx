'use client';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls, RoundedBox } from '@react-three/drei';
import { Component, type ReactNode, Suspense } from 'react';
import type { Setup } from '@/lib/catalog';

function Box({ position, size, color, radius = .03 }: { position: [number,number,number]; size: [number,number,number]; color: string; radius?: number }) { return <RoundedBox args={size} radius={radius} smoothness={3} position={position} castShadow receiveShadow><meshStandardMaterial color={color} roughness={.75} /></RoundedBox>; }
function Plant({ position, scale = 1 }: { position: [number,number,number]; scale?: number }) { return <group position={position} scale={scale}><mesh position={[0,.18,0]} castShadow><cylinderGeometry args={[.19,.14,.36,24]} /><meshStandardMaterial color="#c18b6d" /></mesh><mesh position={[0,.58,0]}><cylinderGeometry args={[.018,.02,.65,8]} /><meshStandardMaterial color="#526d40" /></mesh>{Array.from({length:7},(_,i)=><mesh key={i} position={[Math.sin(i*2.4)*.15,.4+i*.075,Math.cos(i*2.4)*.1]} rotation={[0,i*2.4,.7]} scale={[.1,.24,.055]} castShadow><sphereGeometry args={[1,12,12]} /><meshStandardMaterial color={i%2 ? '#729565' : '#4d7651'} /></mesh>)}</group>; }
function Room({ setup }: { setup: Setup }) {
 const oak = setup.desk === 'oak'; const soft = setup.chair === 'lounge'; const has = (id:string)=>setup.accessories.includes(id);
 const wall = setup.theme === 'coral' ? '#e9d7c5' : setup.theme === 'sage' ? '#d4dfcd' : '#ded6e7';
 return <group position={[0,-.7,0]}>
  <Box position={[0,-.1,0]} size={[5.2,.18,4.1]} color="#e6d5ba" />
  <Box position={[0,1.65,-2]} size={[5.2,3.4,.12]} color={wall} /><Box position={[-2.55,1.65,0]} size={[.12,3.4,4.1]} color="#eee6d8" />
  <Box position={[-2.46,1.95,-.25]} size={[.045,1.9,1.9]} color="#c0cdb8" />
  {[-1.2,.7].map(z=><Box key={z} position={[-2.40,1.95,z]} size={[.08,2,.065]} color="#faf4e8" />)}
  {[1,1.95,2.9].map(y=><Box key={y} position={[-2.4,y,-.25]} size={[.08,.065,2]} color="#faf4e8" />)}
  <Box position={[-2.39,1.95,-.25]} size={[.08,1.9,.065]} color="#faf4e8" />
  <Box position={[.65,2.25,-1.89]} size={[.78,.99,.07]} color="#a17f61" /><Box position={[.65,2.25,-1.84]} size={[.66,.87,.035]} color="#f2e7d5" />
  <mesh position={[.65,2.28,-1.812]}><circleGeometry args={[.23,32]} /><meshStandardMaterial color="#cd825f" /></mesh>
  <Box position={[1.76,1.66,-1.82]} size={[1,.08,.34]} color="#b58c65" /><Plant position={[1.75,1.7,-1.78]} scale={.52} />
  {has('rug') && <Box position={[0,.015,.4]} size={[3.5,.025,2.6]} color={setup.theme === 'coral' ? '#c9a28b' : '#a5b49a'} radius={.01} />}
  <Box position={[0,1.35,-.45]} size={[2.8,.13,1.3]} color={oak ? '#c69a69' : '#edeae0'} />
  {[-1.18,1.18].flatMap(x=>[-.92,.03].map(z=><Box key={`${x}${z}`} position={[x,.65,z]} size={[oak?.1:.075,1.3,oak?.1:.075]} color={oak?'#a77a50':'#59615e'} />))}
  {!oak && <Box position={[0,.35,-.8]} size={[2.4,.09,.08]} color="#59615e" />}
  {has('monitor') && <group><Box position={[0,1.54,-.79]} size={[.38,.035,.24]} color="#56615e" /><Box position={[0,1.76,-.83]} size={[.06,.4,.06]} color="#56615e" /><Box position={[0,2,-.83]} size={[1.14,.68,.065]} color="#303c3b" /><Box position={[0,2,-.789]} size={[1.05,.58,.018]} color="#9cb9ad" /><Box position={[-.23,1.99,-.775]} size={[.4,.42,.008]} color="#dce4cf" /><Box position={[.23,2.12,-.775]} size={[.34,.14,.008]} color="#eedab3" /><Box position={[.23,1.91,-.775]} size={[.34,.2,.008]} color="#6d9286" /></group>}
  <Box position={[-.1,1.435,-.13]} size={[.68,.035,.25]} color="#e7e7da" />{Array.from({length:10},(_,i)=><Box key={i} position={[-.38+i*.062,1.459,-.13]} size={[.035,.008,.17]} color="#c4c8bd" radius={.002} />)}
  <Box position={[.48,1.445,-.1]} size={[.13,.05,.2]} color="#e7e7da" />
  {has('plant') && <Plant position={[1.02,1.42,-.72]} scale={.65} />}
  {has('lamp') && <group position={[-1.05,1.43,-.55]}><mesh><cylinderGeometry args={[.15,.17,.04,24]} /><meshStandardMaterial color="#d7a150" /></mesh><Box position={[0,.27,0]} size={[.035,.54,.035]} color="#d7a150" /><mesh position={[.09,.55,0]} rotation={[0,0,-.45]}><coneGeometry args={[.19,.24,24,1,true]} /><meshStandardMaterial color="#e6b364" side={2} /></mesh><pointLight position={[.13,.45,0]} intensity={.7} color="#ffe0a0" /></group>}
  <group position={[0,0,.85]}><Box position={[0,.69,0]} size={[.76,.15,.7]} color={soft?'#9ba98c':'#424f4a'} /><Box position={[0,1.13,.27]} size={[.72,.83,.12]} color={soft?'#a9b69a':'#3d4945'} radius={.05} />{!soft && Array.from({length:8},(_,i)=><Box key={i} position={[0,.84+i*.075,.34]} size={[.6,.014,.012]} color="#65736a" radius={.003} />)}<Box position={[0,.34,0]} size={[.08,.55,.08]} color="#59635b" />{[-1,1].map(s=><group key={s}><Box position={[s*.43,.89,.03]} size={[.09,.06,.43]} color="#647067" /><Box position={[s*.43,.76,.12]} size={[.045,.28,.045]} color="#647067" /><Box position={[s*.22,.1,0]} size={[.5,.06,.07]} color="#59635b" /><Box position={[0,.1,s*.22]} size={[.07,.06,.5]} color="#59635b" /></group>)}</group>
  <Plant position={[-1.85,0,-1.45]} scale={1.5} />
 </group>;
}
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}> { state={failed:false}; static getDerivedStateFromError(){return {failed:true};} render(){return this.state.failed ? <div className="scene-fallback">Your browser could not open the 3D room. You can still build and review your setup using the product cards.</div> : this.props.children;} }
export default function WorkspaceScene({ setup, resetKey }: { setup: Setup; resetKey: number }) { return <SceneBoundary><Canvas frameloop="demand" shadows camera={{position:[6,4.3,6],fov:37}} dpr={[1,1.8]} aria-label="Interactive 3D workspace preview" gl={{antialias:true}}><ambientLight intensity={1.4} /><directionalLight position={[1,7,4]} intensity={2.7} castShadow shadow-mapSize={[2048,2048]} /><Suspense fallback={null}><Room setup={setup} /><ContactShadows position={[0,-.81,0]} opacity={.3} scale={12} blur={2.8} far={5} /></Suspense><OrbitControls key={resetKey} makeDefault target={[0,.65,0]} minDistance={5} maxDistance={12} minPolarAngle={.35} maxPolarAngle={Math.PI/2.15} minAzimuthAngle={-.35} maxAzimuthAngle={Math.PI/2.1} enablePan={false} /></Canvas></SceneBoundary>; }
