import * as THREE from 'three'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

const gltfLoader = new GLTFLoader()

function loadModel(
    modelName: String, // Use lowercase 'string'
    modelScale: { X: number; Y: number; Z: number }
): Promise<{ model: THREE.Group; mixer?: THREE.AnimationMixer }> {
    return new Promise<{ model: THREE.Group; mixer?: THREE.AnimationMixer }>((resolve, reject) => {
        gltfLoader.load(
            `./public/assets/${modelName}/scene.gltf`,
            (gltf: GLTF) => {
                const model: THREE.Group = gltf.scene
                model.scale.set(1 * modelScale.X, 1 * modelScale.Y, 1 * modelScale.Z)

                console.log(model)

                let mixer
                if (modelName === 'boy') {
                    mixer = new THREE.AnimationMixer(model)
                    mixer.timeScale = 3
                    const action = mixer.clipAction(gltf.animations[0]) // Change the index accordingly
                    action.play()
                }

                const result = {
                    model,
                    mixer,
                }

                resolve(result) // Resolve the promise with the loaded model and mixer
            },
            undefined,
            (error: Event) => {
                console.error(error)
                reject(error) // Reject the promise if there's an error
            }
        )
    })
}

export default loadModel
