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

export function rotateXY(tesseract, angle, out) {
    for (const direction in tesseract) {
        rotateCellXY(tesseract[direction], angle, out[direction])
    }
}

export function rotateCellXY(cell, angle, out) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    for (let i = 0; i < cell.length; i += 4) {
        let x = cell[i];
        let y = cell[i + 1];
        out[i]     = c * x - s * y;
        out[i + 1] = s * x + c * y;
        out[i + 2] = cell[i + 2];
        out[i + 3] = cell[i + 3];
    }
}

export function rotateXZ(tesseract, angle, out) {
    for (const direction in tesseract) {
        rotateCellXZ(tesseract[direction], angle, out[direction])
    }
}

export function rotateCellXZ(cell, angle, out) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    for (let i = 0; i < cell.length; i += 4) {
        let x = cell[i];
        let z = cell[i + 2];
        out[i]     = c * x - s * z;
        out[i + 2] = s * x + c * z;
        out[i + 1] = cell[i + 1];
        out[i + 3] = cell[i + 3];
    }
}

export function rotateXW(tesseract, angle, out) {
    for (const direction in tesseract) {
        rotateCellXW(tesseract[direction], angle, out[direction])
    }
}

export function rotateCellXW(cell, angle, out) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    for (let i = 0; i < cell.length; i += 4) {
        let x = cell[i];
        let w = cell[i + 3];
        out[i]     = c * x - s * w;
        out[i + 3] = s * x + c * w;
        out[i + 1] = cell[i + 1];
        out[i + 2] = cell[i + 2];
    }
}

export function rotateYZ(tesseract, angle, out) {
    for (const direction in tesseract) {
        rotateCellYZ(tesseract[direction], angle, out[direction])
    }
}

export function rotateCellYZ(cell, angle, out) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    for (let i = 0; i < cell.length; i += 4) {
        let y = cell[i + 1];
        let z = cell[i + 2];
        out[i + 1] = c * y - s * z;
        out[i + 2] = s * y + c * z;
        out[i]     = cell[i];
        out[i + 3] = cell[i + 3];
    }
}

export function rotateYW(tesseract, angle, out) {
    for (const direction in tesseract) {
        rotateCellYW(tesseract[direction], angle, out[direction])
    }
}

export function rotateCellYW(cell, angle, out) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    for (let i = 0; i < cell.length; i += 4) {
        let y = cell[i + 1];
        let w = cell[i + 3];
        out[i + 1] = c * y - s * w;
        out[i + 3] = s * y + c * w;
        out[i]     = cell[i];
        out[i + 2] = cell[i + 2];
    }
}

export function rotateZW(tesseract, angle, out) {
    for (const direction in tesseract) {
        rotateCellZW(tesseract[direction], angle, out[direction])
    }
}

export function rotateCellZW(cell, angle, out) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    for (let i = 0; i < cell.length; i += 4) {
        let z = cell[i + 2];
        let w = cell[i + 3];
        out[i + 2] = c * z - s * w;
        out[i + 3] = s * z + c * w;
        out[i]     = cell[i];
        out[i + 1] = cell[i + 1];
    }
}

export function scale(tesseract, scales, out) {
    const {x, y, z, w} = scales;

    for (const direction in tesseract) {
        const cell = tesseract[direction];
        const transformedCell = out[direction];

        for (let i = 0; i < cell.length; i += 4) {
            transformedCell[i]     = cell[i]     * x;
            transformedCell[i + 1] = cell[i + 1] * y;
            transformedCell[i + 2] = cell[i + 2] * z;
            transformedCell[i + 3] = cell[i + 3] * w;
        }
    }
}

export function unfold(tesseract, unfoldTransforms, factor, out) {
    for (const direction in unfoldTransforms) {
        const cellIn = tesseract[direction];
        const cellResult = out[direction];
        let cellOut = out[direction];

        const {rotationPlane, rotationAngle = 0, translation = [0, 0, 0, 0]} = unfoldTransforms[direction];

        switch(rotationPlane) {
            case "xw": 
                rotateCellXW(cellIn, factor * rotationAngle, cellOut);
                break;
            case "yw": 
                rotateCellYW(cellIn, factor * rotationAngle, cellOut);
                break;
            case "zw": 
                rotateCellZW(cellIn, factor * rotationAngle, cellOut);
                break;
            default:
                cellOut = cellIn;
                break;
        }

        for (let i = 0; i < cellOut.length; i += 4) {
            cellResult[i]     = cellOut[i]     + translation[0] * factor;
            cellResult[i + 1] = cellOut[i + 1] + translation[1] * factor;
            cellResult[i + 2] = cellOut[i + 2] + translation[2] * factor;
            cellResult[i + 3] = cellOut[i + 3] + translation[3] * factor;
        }
    }
}

const intersectPoint = new Float32Array(3);
export function perspectiveProjection(tesseract, cameraWOffset, focalLength, projections, uvProjections, sceneBoundary) {
    sceneBoundary.min[0] = Number.POSITIVE_INFINITY;
    sceneBoundary.min[1] = Number.POSITIVE_INFINITY;
    sceneBoundary.min[2] = Number.POSITIVE_INFINITY;

    sceneBoundary.max[0] = Number.NEGATIVE_INFINITY;
    sceneBoundary.max[1] = Number.NEGATIVE_INFINITY;
    sceneBoundary.max[2] = Number.NEGATIVE_INFINITY;

    for (const direction in tesseract) {
        const cell = tesseract[direction];
        const projection = projections[direction];
        const uvProjection = uvProjections[direction];

        const numVertex = cell.length / 4;
        for (let i = 0; i < numVertex; ++i) {
            const ci = i * 4;
            const pi = i * 3;

            const w = cameraWOffset - cell[ci + 3];
            projection[pi]     = (focalLength * cell[ci]    ) / w;
            projection[pi + 1] = (focalLength * cell[ci + 1]) / w;
            projection[pi + 2] = (focalLength * cell[ci + 2]) / w;

            sceneBoundary.min[0] = Math.min(projection[pi]    , sceneBoundary.min[0]);
            sceneBoundary.min[1] = Math.min(projection[pi + 1], sceneBoundary.min[1]);
            sceneBoundary.min[2] = Math.min(projection[pi + 2], sceneBoundary.min[2]);

            sceneBoundary.max[0] = Math.max(projection[pi]    , sceneBoundary.max[0]);
            sceneBoundary.max[1] = Math.max(projection[pi + 1], sceneBoundary.max[1]);
            sceneBoundary.max[2] = Math.max(projection[pi + 2], sceneBoundary.max[2]);
        }

        for (let i = 0; i < numVertex; i += 6) {
            const pi = i * 3;

            const v1 = projection.subarray(pi,      pi + 3);
            const v2 = projection.subarray(pi + 3,  pi + 6);
            const v3 = projection.subarray(pi + 15, pi + 18);
            const v4 = projection.subarray(pi + 6,  pi + 9);

            const t = intersect(v1, v3, v4, v2);
            const oneMinus = (1 - t);

            intersectPoint[0] = oneMinus * v1[0] + t * v3[0]; 
            intersectPoint[1] = oneMinus * v1[1] + t * v3[1]; 
            intersectPoint[2] = oneMinus * v1[2] + t * v3[2]; 

            const d1 = vec3.distance(intersectPoint, v1);
            const d2 = vec3.distance(intersectPoint, v2);
            const d3 = vec3.distance(intersectPoint, v3);
            const d4 = vec3.distance(intersectPoint, v4);

            const z1 = (d1 + d3) / d3;
            const z2 = (d2 + d4) / d4;
            const z3 = (d3 + d1) / d1;
            const z4 = (d4 + d2) / d2;

            // Vertex order 1, 2, 4, 4, 2, 3
            uvProjection[i]     = z1;
            uvProjection[i + 1] = z2;
            uvProjection[i + 2] = z4;
            uvProjection[i + 3] = z4;
            uvProjection[i + 4] = z2;
            uvProjection[i + 5] = z3;
        } 
    }
}

export function orthographicProjection(tesseract, projections, uvProjections, sceneBoundary) {
    sceneBoundary.min[0] = Number.POSITIVE_INFINITY;
    sceneBoundary.min[1] = Number.POSITIVE_INFINITY;
    sceneBoundary.min[2] = Number.POSITIVE_INFINITY;

    sceneBoundary.max[0] = Number.NEGATIVE_INFINITY;
    sceneBoundary.max[1] = Number.NEGATIVE_INFINITY;
    sceneBoundary.max[2] = Number.NEGATIVE_INFINITY;

    for (const direction in tesseract) {
        const cell = tesseract[direction];
        const projection = projections[direction];
        const uvProjection = uvProjections[direction];

        const numVertex = cell.length / 4;
        for (let i = 0; i < numVertex; ++i) {
            const ci = i * 4;
            const pi = i * 3;

            projection[pi]     = cell[ci];
            projection[pi + 1] = cell[ci + 1];
            projection[pi + 2] = cell[ci + 2];

            sceneBoundary.min[0] = Math.min(projection[pi]    , sceneBoundary.min[0]);
            sceneBoundary.min[1] = Math.min(projection[pi + 1], sceneBoundary.min[1]);
            sceneBoundary.min[2] = Math.min(projection[pi + 2], sceneBoundary.min[2]);

            sceneBoundary.max[0] = Math.max(projection[pi]    , sceneBoundary.max[0]);
            sceneBoundary.max[1] = Math.max(projection[pi + 1], sceneBoundary.max[1]);
            sceneBoundary.max[2] = Math.max(projection[pi + 2], sceneBoundary.max[2]);

            uvProjection[i] = 1;
        }
    }
}

const r = new Float32Array(3);
const s = new Float32Array(3);
const qmp = new Float32Array(3);
function intersect(p0, p1, q0, q1, out) {
    vec3.subtract(r, p1, p0);
    vec3.subtract(s, q1, q0);
    vec3.subtract(qmp, q0, p0);

    let x = 0;
    let y = 1;
    let denominator = r[x] * s[y] - r[y] * s[x];
    if (denominator === 0) {
        x = 1;
        y = 2;
        denominator = r[x] * s[y] - r[y] * s[x];
    } 

    if (denominator === 0) {
        x = 0;
        y = 2;
        denominator = r[x] * s[y] - r[y] * s[x];
    }

    return (qmp[x] * s[y] - qmp[y] * s[x]) / denominator;
}
