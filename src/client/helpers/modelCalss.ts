import * as THREE from 'three'

class Model extends THREE.Group {
    public front: number // Declare the 'front' property
    public back: number
    public depth: number
    public height: number
    public width: number
    public left: number
    public right: number
    public isLetter: Boolean
    public velocity: { X: number; Y: number; Z: number }
    constructor(
        model: THREE.Group | THREE.Mesh,
        width: number,
        height: number,
        depth: number,
        isLetter: Boolean = false,
        velocity: { X: number; Y: number; Z: number } = { X: 0, Y: 0, Z: 0 },
        position: { X: number; Y: number; Z: number } = { X: 0, Y: 0, Z: 0 }
    ) {
        super()
        this.position.set(position.X, position.Y, position.Z)
        this.add(model)
        this.width = width
        this.height = height
        this.depth = depth
        this.isLetter = isLetter
        if (isLetter) {
            this.front = model.position.z
            this.back = model.position.z + this.depth
            this.left = model.position.x + this.width
            this.right = model.position.x
        } else {
            this.front = model.position.z - this.depth / 2

            this.front = model.position.z - this.depth / 2
            this.back = model.position.z + this.depth
            this.left = model.position.x + this.width / 2
            this.right = model.position.x - this.width / 2
        }
        this.velocity = velocity
        this.back = model.position.z + this.depth / 2
    }
    update(): void {
        console.log(this.velocity)
        this.position.x += this.velocity.X
        this.position.y += this.velocity.Y
        this.position.z += this.velocity.Z
        if (this.isLetter) {
            this.front = this.position.z
            this.back = this.position.z + this.depth
            this.left = this.position.x + this.width
            this.right = this.position.x
        } else {
            this.front = this.position.z - this.depth / 2

            this.front = this.position.z - this.depth / 2
            this.back = this.position.z + this.depth
            this.left = this.position.x + this.width / 2
            this.right = this.position.x - this.width / 2
        }
    }
}
export default Model
