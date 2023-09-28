import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import loadModel from './helpers/loadModel/loadModel'
import Model from './helpers/modelCalss'
import loadText from './helpers/loadModel/loadText'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Font } from 'three/examples/jsm/loaders/FontLoader'
const planeGeometry = new THREE.PlaneGeometry(5, 100, 1, 1)
const textMaterial = new THREE.MeshNormalMaterial()

let mixer: THREE.AnimationMixer | undefined
const scene = new THREE.Scene()
let playerModel: Model
let deltaTime: number
let letters: Model[] = []
let font: Font
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = -2
camera.position.y = 1.5
const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0x000000)
renderer.setPixelRatio(devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
})
material.side = THREE.DoubleSide
planeGeometry.rotateX(Math.PI * 0.5)
const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}
const stats = new Stats()
document.body.appendChild(stats.dom)
const clock = new THREE.Clock()
let frame = 0
const keys: Record<string, { pressed: boolean }> = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    space: {
        pressed: false,
    },
}
addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyA':
            keys.a.pressed = true
            break
        case 'KeyD':
            keys.d.pressed = true
            break
        case 'ArrowLeft':
            keys.a.pressed = true
            break
        case 'ArrowRight':
            keys.d.pressed = true
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyA':
            keys.a.pressed = false
            break
        case 'KeyD':
            keys.d.pressed = false
            break
        case 'ArrowLeft':
            keys.a.pressed = false
            break
        case 'ArrowRight':
            keys.d.pressed = false
            break
    }
})
function animate() {
    playerModel.velocity.X = 0
    playerModel.velocity.Y = 0
    playerModel.velocity.Z = 0
    if (keys.a.pressed) {
        playerModel.velocity.X = 0.1
    } else if (keys.d.pressed) {
        playerModel.velocity.X = -0.1
    } else if (keys.w.pressed) {
        playerModel.velocity.Z = +0.2
    } else if (keys.s.pressed) {
        playerModel.velocity.Z = -0.2
    }
    if (keys.space.pressed) {
        playerModel.velocity.Y = 0.15
    }
    frame++

    requestAnimationFrame(animate)
    deltaTime = clock.getDelta()
    if (frame % 30 == 0) {
        makeFont(String.fromCharCode(parseInt(Math.random() * 26 + 65 + '')), {
            X: (Math.random() - 0.5) * 5,
            Y: 0,
            Z: 30,
        })
    }
    playerModel.update()
    if (mixer) {
        mixer.update(deltaTime)
    }
    letters.forEach((letter) => {
        letter.update()
    })
    console.log(playerModel.front, playerModel.back)
    cube.rotation.x += 1 * deltaTime
    cube.rotation.y += 1 * deltaTime

    controls.update()

    render()
}

scene.add(new THREE.AmbientLight(0xffffff, 1))
async function model(modelName: String, modelScale: { X: number; Y: number; Z: number }) {
    console.log('fvfuh')
    const loadedModel = await loadModel(modelName, modelScale)
    console.log(loadedModel)
    mixer = loadedModel.mixer
    playerModel = new Model(loadedModel.model, modelScale.X, modelScale.Y, modelScale.Z, false, {
        X: 0,
        Y: 0,
        Z: 0,
    })
    scene.add(playerModel)
    animate()
}
function velocitySettelment(deltaTime: number) {
    letters.forEach((model: Model) => {
        model.velocity.X = model.velocity.X * deltaTime
        model.velocity.X = model.velocity.Y * deltaTime
        model.velocity.Z = model.velocity.Z * deltaTime
        console.log(model.velocity)
    })
}
function render() {
    renderer.render(scene, camera)
    stats.update()
}
model('boy', { X: 0.4, Y: 0.4, Z: 0.4 })
loadText().then((txt) => {
    font = txt
})

function makeFont(
    letter: string,
    position: { X: number; Y: number; Z: number } = { X: 0, Y: 0, Z: 0 }
) {
    if (font) {
        const textGeometry = new TextGeometry(letter, {
            height: 0.2,
            size: 1,
            font,
        })

        const textMesh = new THREE.Mesh(textGeometry, textMaterial)
        const model = new Model(
            textMesh,
            0.8,
            0.4,
            0.4,
            true,
            { X: 0, Y: 0, Z: -20 * deltaTime },
            { ...position }
        )
        model.rotateY(-Math.PI)
        letters.push(model)
        scene.add(model)
        console.log(model.position)
        console.log(model.left, model.right, model.front, model.back)
    }
}
function init() {
    letters = []
    const mesh = new THREE.Mesh(planeGeometry, material)
    scene.add(mesh)
}

function collisionDetector(boy: Model, letter: Model) {
    // if(boy.back)
}
// scene.add(new THREE.AxesHelper(10))
init()
