# Tesseract Explorer

Welcome to the 4<sup>th</sup> dimension! Visit the live application [here](https://tsherif.github.io/tesseract-explorer/)!

![Tesseract](img/tesseract-350x350.png?raw=true)

## What's a Tesseract?

A [tesseract](https://en.wikipedia.org/wiki/Tesseract), also known as a hypercube or 8-cell, is the 4D analog to the 2D square and the 3D cube. Its 3D "surface" is composed of 8 cubes, called cells, 2 along each of the 4 axes, X, Y, Z, and W. These cells enclose the 4D hypervolume of the tesseract. A way to imagine the shape of the tesseract is that space is folded in such a way that each of the six faces of each cell are flush with one face of 6 other cells, with the only cell left out being the opposite one on the same axis. This is analogous to the 4 edges of each square face of a 3D cube being flush with the edges of 4 of its other faces, an impossible formation in 2D space, but possible with the folding into 3D.

Obviously, we can't directly visualize a tesseract, since we live in only 3 dimensions, but we can project its form into 3D space, essentially taking "photographs" from 4 dimensions onto the 3D "film" of our universe (in the same way we photograph our 3D universe onto the 2D film of a camera). I highly recommend [this site](http://eusebeia.dyndns.org/4d/vis/vis) for a primer on visualizing 4D shapes.


## Tesseract Explorer

The [Tesseract Explorer](https://tsherif.github.io/tesseract-explorer/) provides a variety of tools for visualizing the projections of a 4D tesseract into 3D space. The tesseract can be manipulated in 4D space, and its projection into 3D space is then rendered in the browser using [WebGL 2](https://get.webgl.org/webgl2/).

### 3D View Controls

The 3D projection of the tesseract can be explored using the mouse. Click and drag to orbit the camera, and use the mouse wheel to zoom in and out.

### Control Panel Options

- **Rendering**:
    - `transparent`: Transparent rendering of the projection.
    - `cutout`: Opaque rendering of the projection with holes cut out of each face to expose the internal cells.
    - `solid`: Opaque rendering of the projection. 

- **Projection**:
    - `perspective`: A "camera" in 4D space is placed at some distance from the origin along the W-axis. Cells further from camera project to smaller cubes than nearer cells. Cells at an angle to the hyperplane of projection appear as distorted cubes (or [frustums](https://en.wikipedia.org/wiki/Frustum)).
    - `orthographic`: Projection flattens the 4D scene to 3D without any scaling due to distance. A cell-first view of a tesseract will project orthographically to a 3D cube.

- **Colorization**:
    - `axis`: Cells are colored by axis, with the X-axis pair colored red, the Y-axis pair colored green, the Z-axis pair colored blue, and W-axis pair colored yellow.
    - `cell`: Each cell is colored separately. The coloring of the pair of cells on an axis will be light and dark shades of their axis coloring, with the positive cell having the darker shade and the negative cell, the lighter one.

- **Unfold**: Rotate the cells of the tesseract into 3D space in the form of a [Dalí cross](https://en.wikipedia.org/wiki/Polycube#Octacubes_and_hypercube_unfoldings).

- **Rotate**: Rotate the tesseract along any of the 6 planes formed by pairs of axes in 4D space. The first 3 rotations include the W-axis, and thus will affect the projection more directly.

- **Scale**: Scale the tesseract along any of the 4 axes in 4D space. Scaling shows a sweep across the 4D hypervolume (in the same way scaling a 3D cube along one axis shows the sweep across its internal 3D volume).

- **Cell Visibility**: Hide or show individual cells. This can make it easier to follow certain transformations.


## Other Resources

The following are resources I found extremely helpful in understanding 4D visualizations:

- [4D Visualization](http://eusebeia.dyndns.org/4d/vis/vis) article series
- [Dimensions](https://www.youtube.com/playlist?list=PL3C690048E1531DC7) video series by Jos Leys, Étienne Ghys, and Aurélien Alvarez
- [4D Toys](https://4dtoys.com/) game by Marc ten Bosch
