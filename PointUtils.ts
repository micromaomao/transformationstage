export type Point = [number, number]
export interface Boundable {
  getBoundingClientRect: () => TopLeft;
}
interface TopLeft {
  top: number;
  left: number;
}

let getClientOffsetCache: {
  target: Boundable,
  rect: TopLeft
} = null

export function getClientOffset(view: Boundable): Point {
  let rect: TopLeft = null
  if (getClientOffsetCache && getClientOffsetCache.target === view) {
    rect = getClientOffsetCache.rect
  } else {
    rect = view.getBoundingClientRect()
    getClientOffsetCache = {
      target: view,
      rect
    }
  }
  return [rect.left, rect.top]
}

function removeClientOffsetCache() {
  getClientOffsetCache = null
  requestAnimationFrame(removeClientOffsetCache)
}

removeClientOffsetCache()

export function client2view(point: Point, view: Boundable): Point {
  let cOffset = getClientOffset(view)
  return [
    point[0] - cOffset[0],
    point[1] - cOffset[1]
  ]
}

export function view2client(point: Point, view: Boundable): Point {
  let cOffset = getClientOffset(view)
  return [
    point[0] + cOffset[0],
    point[1] + cOffset[1]
  ]
}

export function pointDistance(a: Point, b: Point): number {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))
}
