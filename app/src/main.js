import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Zonas de ejemplo de una finca (ver guia-planos-finca.md en la raíz del repo).
// Reemplazar por la geometría real del plano cuando esté disponible.
const ZONES = [
  { name: 'Vivienda', size: [12, 6, 10], position: [-20, 3, 15], color: 0xd9a441 },
  { name: 'Establo', size: [16, 5, 8], position: [10, 2.5, 25], color: 0x8d6e63 },
  { name: 'Bodega', size: [10, 4, 8], position: [-25, 2, -10], color: 0x607d8b },
  { name: 'Cultivo', size: [30, 0.2, 20], position: [20, 0.1, -15], color: 0x9ccc65 },
]

const viewport = document.querySelector('#viewport')
const btn2d = document.querySelector('#btn-2d')
const btn3d = document.querySelector('#btn-3d')

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x16171d)

scene.add(new THREE.AmbientLight(0xffffff, 0.6))
const sun = new THREE.DirectionalLight(0xffffff, 1.2)
sun.position.set(40, 60, 20)
scene.add(sun)

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(120, 120),
  new THREE.MeshStandardMaterial({ color: 0x2e3b22 }),
)
ground.rotation.x = -Math.PI / 2
scene.add(ground)

scene.add(new THREE.GridHelper(120, 24, 0x4a5a3a, 0x3a4730))

for (const zone of ZONES) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(...zone.size),
    new THREE.MeshStandardMaterial({ color: zone.color }),
  )
  mesh.position.set(...zone.position)
  mesh.name = zone.name
  scene.add(mesh)
}

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
viewport.appendChild(renderer.domElement)

// Cámara 3D: perspectiva libre con orbit controls.
const perspCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
perspCamera.position.set(60, 50, 60)

// Cámara 2D: ortográfica cenital, igual que un plano de planta.
const orthoSize = 60
const orthoCamera = new THREE.OrthographicCamera(-orthoSize, orthoSize, orthoSize, -orthoSize, 0.1, 1000)
orthoCamera.position.set(0, 100, 0)
orthoCamera.lookAt(0, 0, 0)

const perspControls = new OrbitControls(perspCamera, renderer.domElement)
perspControls.enableDamping = true
perspControls.enabled = false

// Sin rotación en 2D: solo pan y zoom, como en un plano técnico.
const orthoControls = new OrbitControls(orthoCamera, renderer.domElement)
orthoControls.enableRotate = false
orthoControls.enableDamping = true

let activeCamera = orthoCamera
let activeControls = orthoControls

function setView(view) {
  const is2d = view === '2d'
  activeCamera = is2d ? orthoCamera : perspCamera
  activeControls = is2d ? orthoControls : perspControls
  orthoControls.enabled = is2d
  perspControls.enabled = !is2d
  btn2d.classList.toggle('active', is2d)
  btn3d.classList.toggle('active', !is2d)
}

btn2d.addEventListener('click', () => setView('2d'))
btn3d.addEventListener('click', () => setView('3d'))

function resize() {
  const { clientWidth: w, clientHeight: h } = viewport
  renderer.setSize(w, h)

  perspCamera.aspect = w / h
  perspCamera.updateProjectionMatrix()

  const aspect = w / h
  orthoCamera.left = -orthoSize * aspect
  orthoCamera.right = orthoSize * aspect
  orthoCamera.top = orthoSize
  orthoCamera.bottom = -orthoSize
  orthoCamera.updateProjectionMatrix()
}

window.addEventListener('resize', resize)
resize()

function animate() {
  requestAnimationFrame(animate)
  activeControls.update()
  renderer.render(scene, activeCamera)
}
animate()
