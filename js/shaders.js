export const vsTesseract = `
    #version 300 es

    layout(std140, column_major) uniform;

    layout(location=0) in vec3 position;
    layout(location=1) in vec2 uv;
    layout(location=2) in float uvProjection;
    
    uniform mat4 view;
    uniform mat4 proj;
    uniform mat4 shadowView;

    out vec3 vPosition;
    out vec3 vUV;
    out vec4 vShadowProjection;
    
    void main() {
        vec4 viewPosition = view * vec4(position, 1.0);
        vPosition = viewPosition.xyz; 
        vUV = vec3(uv, 1.0) * uvProjection;
        vShadowProjection = proj * shadowView * vec4(position, 1.0);
        gl_Position = proj * viewPosition;
    }
`;

export const fsTransparent = `
    #version 300 es
    precision highp float;

    layout(std140, column_major) uniform;

    uniform vec3 color;
    uniform vec3 eyePosition;
    uniform vec3 lightPosition;
    uniform bool cutout;

    in vec3 vPosition;

    layout(location=0) out vec4 accumColor;
    layout(location=1) out float accumAlpha;

    float weight(float z, float a) {
        return 2.0 - z;
    }

    void main() {
        vec3 position = vPosition;
        vec3 normal = normalize(cross(dFdx(position), dFdy(position)));

        vec4 baseColor = vec4(color, 1.0);
        float ambient = 0.4;

        vec3 eyeDirection = normalize(eyePosition - position);
        vec3 lightVec = lightPosition - position;
        vec3 lightDirection = normalize(lightVec);
        vec3 reflectionDirection = reflect(-lightDirection, normal);
        float nDotL = max(dot(lightDirection, normal), 0.0);
        float diffuse = nDotL;
        float specular = pow(max(dot(reflectionDirection, eyeDirection), 0.0), 100.0);

        vec4 color = vec4((ambient + diffuse + specular) * baseColor.rgb, 1.0) * 0.5;
        float w = weight(gl_FragCoord.z, color.a);
        accumColor = vec4(color.rgb * w, color.a);
        accumAlpha = color.a * w;
    }
`;

export const fsOpaque = `
    #version 300 es
    precision highp float;

    uniform vec3 color;
    uniform vec3 eyePosition;
    uniform vec3 lightPosition;
    uniform bool cutout;

    uniform highp sampler2DShadow shadowMap;

    in vec3 vPosition;
    in vec3 vUV;
    in vec4 vShadowProjection;

    out vec4 fragColor;

    void main() {
        vec2 cutoutUV = (vUV.xy / vUV.z) * 2.0 - 1.0;
        float shadow = 1.0;
        if (cutout) {
            if (dot(cutoutUV, cutoutUV) < 0.7) {
                discard;
            } else {
                vec3 shadowCoord = (vShadowProjection.xyz / vShadowProjection.w) / 2.0 + 0.5;
                shadowCoord.z -= 0.01;
                shadow = texture(shadowMap, shadowCoord) * 0.3 + 0.7;
            }
        }

        vec3 position = vPosition;
        vec3 normal = normalize(cross(dFdx(position), dFdy(position)));

        vec4 baseColor = vec4(color, 1.0);
        float ambient = 0.4;

        vec3 eyeDirection = normalize(eyePosition - position);
        vec3 lightVec = lightPosition - position;
        vec3 lightDirection = normalize(lightVec);
        vec3 reflectionDirection = reflect(-lightDirection, normal);
        float nDotL = max(dot(lightDirection, normal), 0.0);
        float diffuse = nDotL * 0.8  * shadow;
        float specular = pow(max(dot(reflectionDirection, eyeDirection), 0.0), 100.0) * shadow;
        
        fragColor = vec4((ambient + diffuse + specular) * baseColor.rgb, 1.0);
    }
`;

export const fsShadow = `
    #version 300 es
    precision highp float;

    uniform bool cutout;

    in vec3 vPosition;
    in vec3 vUV;

    out vec4 fragColor;

    void main() {
        vec2 cutoutUV = (vUV.xy / vUV.z) * 2.0 - 1.0;
        if (cutout && dot(cutoutUV, cutoutUV) < 0.7) {
            discard;
        }

        float z = gl_FragCoord.z;

        z = z * z * z * z;
        fragColor = vec4(z, 0.0, 1.0, 1.0);
    }
`;

export const vsScreenQuad = `
    #version 300 es

    layout(location=0) in vec4 aPosition;
    
    void main() {
        gl_Position = aPosition;
    }
`;

export const fsOIT = `
    #version 300 es
    precision highp float;

    uniform sampler2D uAccumulate;
    uniform sampler2D uAccumulateAlpha;
    out vec4 fragColor;
    void main() {
        ivec2 fragCoord = ivec2(gl_FragCoord.xy);
        vec4 accum = texelFetch(uAccumulate, fragCoord, 0);
        float a = 1.0 - accum.a;
        accum.a = texelFetch(uAccumulateAlpha, fragCoord, 0).r;
        fragColor = vec4(a * accum.rgb / clamp(accum.a, 0.001, 50000.0), a);
    }
`;

export const fsShadowDebug = `
    #version 300 es
    precision highp float;

    uniform sampler2D shadow;

    out vec4 fragColor;
    void main() {
        ivec2 fragCoord = ivec2(gl_FragCoord.xy);
        fragColor = vec4(texelFetch(shadow, fragCoord, 0).rgb, 1.0);
    }
`;
