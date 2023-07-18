import { Point } from "./Point";

export class Layer {
    level: number
    points: Point[] = []

    constructor(level: number) {
        this.level = level
    }
}
