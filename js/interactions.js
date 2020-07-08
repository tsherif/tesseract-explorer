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

export function setupInteractions(canvas, handlers = {}) {
    const {onDrag = () => {}, onWheel = () => {}, onPinch = () => {}} = handlers;

    let dragging = false;
    let lastX = -1;
    let lastY = -1;
    canvas.addEventListener("mousedown", e => {
        e.stopPropagation();
        e.preventDefault();

        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });

    canvas.addEventListener("mousemove", e => {
        if (!dragging) {
            return;
        }

        e.stopPropagation();
        e.preventDefault();

        let dx = e.clientX - lastX;
        let dy = e.clientY - lastY;

        onDrag(dx, dy);

        lastX = e.clientX;
        lastY = e.clientY;
    });

    document.addEventListener("mouseup", e => {
        dragging = false;
        lastX = -1;
        lastY = -1;
    });
    
    canvas.addEventListener("wheel", e => {
        e.stopPropagation();
        e.preventDefault();

        onWheel(Math.sign(e.deltaY));
    });

    let touchDragging = false;
    let touchPinching = false;
    let lastTouchX = -1;
    let lastTouchY = -1;
    let lastTouchX2 = -1;
    let lastTouchY2 = -1;
    canvas.addEventListener("touchstart", e => {
        e.stopPropagation();
        e.preventDefault();

        if (e.touches.length === 1) {
            touchDragging = true;
            touchPinching = false;
            const touch = e.touches[0];
            lastTouchX = touch.clientX;
            lastTouchY = touch.clientY;
        } else {
            touchPinching = true;
            touchDragging = false;
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            lastTouchX = touch1.clientX;
            lastTouchY = touch1.clientY; 

            lastTouchX2 = touch2.clientX;
            lastTouchY2 = touch2.clientY;   
        }
    });

    canvas.addEventListener("touchmove", e => {
        if (!touchDragging && !touchPinching) {
            return;
        }

        e.stopPropagation();
        e.preventDefault();

        if (touchDragging) {
            const touch = e.touches[0];

            const dx = touch.clientX - lastTouchX;
            const dy = touch.clientY - lastTouchY;

            onDrag(dx, dy);
            
            lastTouchX = touch.clientX;
            lastTouchY = touch.clientY;
        } else {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];

            const dx1 = touch1.clientX - lastTouchX;
            const dy1 = touch1.clientY - lastTouchY;
            const dx2 = touch2.clientX - lastTouchX2;
            const dy2 = touch2.clientY - lastTouchY2;

            const pinching = dx1 * dx2 + dy1 + dy2 < 0;

            if (pinching) {
                const separationX = touch2.clientX - touch1.clientX;
                const separationY = touch2.clientY - touch1.clientY;
                const lastSeparationX = lastTouchX2 - lastTouchX;
                const lastSeparationY = lastTouchY2 - lastTouchY;

                const separation = Math.sqrt(separationX * separationX + separationY * separationY);
                const lastSeparation = Math.sqrt(lastSeparationX * lastSeparationX + lastSeparationY * lastSeparationY);

                onPinch(lastSeparation - separation);
            }

            lastTouchX = touch1.clientX;
            lastTouchY = touch1.clientY;
            lastTouchX2 = touch2.clientX;
            lastTouchY2 = touch2.clientY;
        }
    });

    document.addEventListener("touchend", e => {
        if (e.touches.length === 0) {
            touchDragging = false;
            touchPinching = false;
            lastTouchX = -1;
            lastTouchY = -1;
            lastTouchX2 = -1;
            lastTouchY2 = -1;
        } else if (e.touches.length === 1) {
            touchDragging = true;
            touchPinching = false;
            lastTouchX2 = -1;
            lastTouchY2 = -1;
        }
    });
}
