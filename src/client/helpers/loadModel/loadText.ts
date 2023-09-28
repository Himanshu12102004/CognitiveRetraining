import * as THREE from 'three'
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

const loadText = (): Promise<Font> => {
    return new Promise<Font>((resolve, reject) => {
        const fontLoader = new FontLoader()
        fontLoader.load('./public/assets/helvetiker_bold.typeface.json', (droidFont) => {
            resolve(droidFont)
            console.log(typeof droidFont)
        })
    })
}

export default loadText
