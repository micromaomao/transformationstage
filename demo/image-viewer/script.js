import {TransformationStage} from '../../dist/TransformationStage.js'

let state = {
  image: null
}
let canv = document.getElementById('target')
let tr = new TransformationStage()
tr.bindEvents(canv)
tr.setContentSize(1920, 1050)
tr.minScale = 0.5
canv.width = window.innerWidth
canv.height = window.innerHeight - 200
tr.setViewportSize(canv.width, canv.height)
tr.putOnCenter([0, 0, 1920, 1050]).applyImmediate()

let debugDiv = document.getElementById("debug")

let ctx = canv.getContext("2d")
tr.onUpdate = function () {
  canv.width = window.innerWidth
  canv.height = window.innerHeight - 200
  tr.setViewportSize(canv.width, canv.height)
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, canv.width, canv.height)
  if (state.image === null) {
    ctx.textAlign = "center"
    ctx.font = `normal ${tr.scale * 18}px sans-serif`
    ctx.fillStyle = "#000"
    ctx.fillText("Loading image\u2026", ...tr.stage2view([1920/2, 1050/2]))
    ctx.strokeStyle = "1px #000"
    ctx.strokeRect(...tr.stage2view([0, 0]), ...[1920, 1050].map(x => x * tr.scale))
  } else {
    ctx.drawImage(state.image, 0, 0, 1920, 1050, ...tr.stage2view([0, 0]).map(x => Math.round(x)), Math.round(1920 * tr.scale), Math.round(1050 * tr.scale))
  }

  ctx.strokeStyle = "#000"
  ctx.strokeRect(0, 0, canv.width, canv.height)

  debugDiv.innerText = `T=${tr.translate.map(x => Math.round(x * 10) / 10)}, S=${Math.round(tr.scale * 10) / 10}`
}

tr.onUpdate()

let img = new Image()
img.src = "./image.png"
img.addEventListener('load', evt => {
  state.image = img
  tr.onUpdate()
})
