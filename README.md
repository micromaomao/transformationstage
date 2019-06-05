# TransformationStage: moving & zooming handler

![demo gif](demo.gif)

This JavaScript library implements a generic API (framework & rendering surface agnostic) for a very common task:
allowing user to move and zoom a scene on their screen.

Demo: [Simple image viewer](https://micromaomao.github.io/transformationstage/demo/image-viewer/)

Things to notice:
  - Use mouse & mouse wheel to move
  - Use ctrl + wheel to zoom
  - Use trackpad to move & zoom (including on Mac Safari)
  - Full touch input support (zoom and move at the same time supported).
  - Kinetic scrolling.
  - Bounding (bouncing back when content edge reached) with animation.
  - Maximum and minimum zoom level.

Real life demo: [Click me](https://paper.sc/search/?as=page&query=A%20random%20sample%20of%20five%20metal%20rods%20produced%20by%20a%20machine%20is%20taken.%20Each%20rod%20is%20teste%20d%20for%20hardness.%20The%20results%2C%20in%20suitable%20units%2C%20are%20as%20follows.) and then click any result. ( Wait for javascript to load before clicking, otherwise it will simply open the pdf in your browser. )

In fact, the reason why this project was built is because of the need of [that real life demo](https://paper.sc/). The code has been
extracted from that project and put here for your convinence.

## API example

```javascript
// This is an ES6 module. In the case of paper.sc, it is bundled with webpack in the application build process.
import {TransformationStage} from 'transformationstage'

// You can render your stuff anywhere, but there has to be an element for event handlers to bind to.
let canv = document.getElementById('target')

let tr = new TransformationStage()
tr.bindEvents(canv)
// call tr.removeEvents(elem) to clean up event handlers.

// Set a content size. This is usually the dimension of your render source, or Infinity (TODO: Test for contentSize=Infinity).
tr.setContentSize(1920, 1050)
// That content size will be used to bound user interaction. (Bouncing back when edge reached)

// Initialize viewport
canv.width = 1000
canv.height = 800
tr.setViewportSize(canv.width, canv.height)

tr.onUpdate = () => {
  // Something changed! re-render?

  // Map content coordinate to viewport coordinate with...
  tr.stage2view([x, y])
  // or vise versa...
  tr.view2stage([cX, cY])
  // For example:
  fillText("Hello", ...tr.stage2view([width/2, height/2]))
}
```

See the [code for the image viewer](./demo/image-viewer/script.js) (49 lines) to learn more, or visit the [JsDoc](https://micromaomao.github.io/transformationstage/doc/modules/_transformationstage_.html) for this project.
