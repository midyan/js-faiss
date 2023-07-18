import { Layer } from "./Layer"
import type { PointDTO } from "./Point"

export class Store {
    layers: Layer[] = []

    async create(nLayers: number, points: PointDTO[]) {

        this.layers = Array.from({ length: nLayers }, (_, i) => new Layer(i))

    }
}
