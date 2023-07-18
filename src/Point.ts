export interface PointDTO {
    id: string
    embeddings: number[]
}


export class Point implements PointDTO {
    id: string    
    embeddings: number[]
}
