///////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)
//
// Copyright (c) 2020 Tarek Sherif
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
///////////////////////////////////////////////////////////////////////////////////

export function createTesseract() {
    return {
        posX: createCube4D([1, 2, 3, 0], 1),
        negX:  createCube4D([1, 2, 3, 0], -1),
        posY: createCube4D([2, 3, 0, 1], 1),
        negY:  createCube4D([2, 3, 0, 1], -1),
        posZ: createCube4D([3, 0, 1, 2], 1),
        negZ:  createCube4D([3, 0, 1, 2], -1),
        posW: createCube4D([0, 1, 2, 3], 1),
        negW:  createCube4D([0, 1, 2, 3], -1)
    };
}

export function createTesseractUVProjections() {
    // Projection depth factors
    return {
        posX: new Float32Array(36),
        negX:  new Float32Array(36),
        posY: new Float32Array(36),
        negY:  new Float32Array(36),
        posZ: new Float32Array(36),
        negZ:  new Float32Array(36),
        posW: new Float32Array(36),
        negW:  new Float32Array(36)
    };
}

export function createTesseractProjections(tesseract) {
    const projections = {};
    for (const direction in tesseract) {
        projections[direction] = new Float32Array(tesseract[direction].length * 3 / 4);
    }

    return projections;
}

export const TESSERACT_BASE_UVS = new Float32Array([
    //front
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1,

    //right
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1,

    //back
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1,

    //left
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1,

    //top
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1,

    //bottom
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1
]);

export const TESSERACT_UNFOLD_TRANSFORMS = {
    posX: {
        rotationPlane: "xw",
        rotationAngle: -Math.PI * 0.5,
        translation: [2, 0, 0, 1]
    },
    negX: {
        rotationPlane: "xw",
        rotationAngle: Math.PI * 0.5,
        translation: [-2, 0, 0, 1]
    },
    posY: {
        rotationPlane: "yw",
        rotationAngle: -Math.PI * 0.5,
        translation: [0, 2, 0, 1]
    },
    negY: {
        rotationPlane: "yw",
        rotationAngle: Math.PI * 0.5,
        translation: [0, -2, 0, 1]
    },
    posZ: {
        rotationPlane: "zw",
        rotationAngle: -Math.PI * 0.5,
        translation: [0, 0, 2, 1]
    },
    negZ: {
        rotationPlane: "zw",
        rotationAngle: Math.PI * 0.5,
        translation: [0, 0, -2, 1]
    },
    posW: {
        translation: [0, 0, 4, -1]
    },
    negW: {
        translation: [0, 0, 0, 1]
    },

};

export function extract3DCube(cube4D, axes) {
    const x = axes[0];
    const y = axes[1];
    const z = axes[2];

    const numVerts = cube4D.length / 4;

    const cube3D = new Float32Array(numVerts * 3);

    for (let i = 0; i < numVerts; ++i) {
        const i3 = i * 3;
        const i4 = i * 4;

        cube3D[i3]     = cube4D[i4 + x];
        cube3D[i3 + 1] = cube4D[i4 + y];
        cube3D[i3 + 2] = cube4D[i4 + z];
    }

    return cube3D;
}

function createCube4D(axisOrder, wVal) {
    const x = axisOrder[0];
    const y = axisOrder[1];
    const z = axisOrder[2];
    const w = axisOrder[3];

    const fbl = new Array(4);
    fbl[x] = -1;
    fbl[y] = -1;
    fbl[z] = 1;
    fbl[w] = wVal;

    const fbr = new Array(4);
    fbr[x] = 1;
    fbr[y] = -1;
    fbr[z] = 1;
    fbr[w] = wVal;

    const ftl = new Array(4);
    ftl[x] = -1;
    ftl[y] = 1;
    ftl[z] = 1;
    ftl[w] = wVal;

    const ftr = new Array(4);
    ftr[x] = 1;
    ftr[y] = 1;
    ftr[z] = 1;
    ftr[w] = wVal;

    const bbl = new Array(4);
    bbl[x] = -1;
    bbl[y] = -1;
    bbl[z] = -1;
    bbl[w] = wVal;

    const bbr = new Array(4);
    bbr[x] = 1;
    bbr[y] = -1;
    bbr[z] = -1;
    bbr[w] = wVal;

    const btl = new Array(4);
    btl[x] = -1;
    btl[y] = 1;
    btl[z] = -1;
    btl[w] = wVal;

    const btr = new Array(4);
    btr[x] = 1;
    btr[y] = 1;
    btr[z] = -1;
    btr[w] = wVal;

    return new Float32Array([
        // //front
        fbl[0], fbl[1], fbl[2], fbl[3],
        fbr[0], fbr[1], fbr[2], fbr[3],
        ftl[0], ftl[1], ftl[2], ftl[3],
        ftl[0], ftl[1], ftl[2], ftl[3],
        fbr[0], fbr[1], fbr[2], fbr[3],
        ftr[0], ftr[1], ftr[2], ftr[3],

        //right
        fbr[0], fbr[1], fbr[2], fbr[3],
        bbr[0], bbr[1], bbr[2], bbr[3],
        ftr[0], ftr[1], ftr[2], ftr[3],
        ftr[0], ftr[1], ftr[2], ftr[3],
        bbr[0], bbr[1], bbr[2], bbr[3],
        btr[0], btr[1], btr[2], btr[3],

        //back
        bbr[0], bbr[1], bbr[2], bbr[3],
        bbl[0], bbl[1], bbl[2], bbl[3],
        btr[0], btr[1], btr[2], btr[3],
        btr[0], btr[1], btr[2], btr[3],
        bbl[0], bbl[1], bbl[2], bbl[3],
        btl[0], btl[1], btl[2], btl[3],

        //left
        bbl[0], bbl[1], bbl[2], bbl[3],
        fbl[0], fbl[1], fbl[2], fbl[3],
        btl[0], btl[1], btl[2], btl[3],
        btl[0], btl[1], btl[2], btl[3],
        fbl[0], fbl[1], fbl[2], fbl[3],
        ftl[0], ftl[1], ftl[2], ftl[3],

        // //top
        ftl[0], ftl[1], ftl[2], ftl[3],
        ftr[0], ftr[1], ftr[2], ftr[3],
        btl[0], btl[1], btl[2], btl[3],
        btl[0], btl[1], btl[2], btl[3],
        ftr[0], ftr[1], ftr[2], ftr[3],
        btr[0], btr[1], btr[2], btr[3],

        // //bottom
        bbl[0], bbl[1], bbl[2], bbl[3],
        bbr[0], bbr[1], bbr[2], bbr[3],
        fbl[0], fbl[1], fbl[2], fbl[3],
        fbl[0], fbl[1], fbl[2], fbl[3],
        bbr[0], bbr[1], bbr[2], bbr[3],
        fbr[0], fbr[1], fbr[2], fbr[3]
    ]);
}
