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

export function webgl2Test(canvas, extensions = []) {
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        return false;
    }

    for (let i = 0; i < extensions.length; ++i) {
        if (!gl.getExtension(extensions[i])) {
            return false;
        }
    }

    return true;
}

export function profileRenderLoop(app, draw) {
    const timer = app.createTimer();
    const timerDiv = document.createElement("div");
    timerDiv.style.position = "absolute";
    timerDiv.style.bottom = "10px"
    timerDiv.style.left = "10px"
    timerDiv.style.color = "white"
    document.body.appendChild(timerDiv);

    return (...args) => {
        if (timer.ready()) {
            timerDiv.innerHTML = `
                CPU Time: ${timer.cpuTime.toFixed(2)}<BR>
                GPU Time: ${timer.gpuTime.toFixed(2)}
            `;
        }

        timer.start();

        draw(...args);
    
        timer.end();
    };
}
