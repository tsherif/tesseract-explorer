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
