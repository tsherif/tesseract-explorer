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
