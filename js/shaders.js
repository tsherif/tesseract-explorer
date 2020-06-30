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

export const vsTesseract = `
    #version 300 es

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
        vec4 pos = vec4(position, 1.0);
        vec4 viewPosition = view * pos;
        vPosition = viewPosition.xyz; 
        vUV = vec3(uv, 1.0) * uvProjection;
        vShadowProjection = proj * shadowView * pos;
        gl_Position = proj * viewPosition;
    }
`;

export const vsScreenQuad = `
    #version 300 es

    layout(location=0) in vec4 position;
    
    out vec2 vUV;

    void main() {
        gl_Position = position;
        vUV = gl_Position.xy * 0.5 + 0.5;
    }
`;

export const fsTransparent = `
    #version 300 es
    precision highp float;
    
    in vec3 vPosition;

    uniform vec3 color;
    uniform vec3 eyePosition;
    uniform vec3 lightPosition;

    layout(location=0) out vec4 oitColor;
    layout(location=1) out float oitAlpha;

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
        oitColor = vec4(color.rgb * w, color.a);
        oitAlpha = color.a * w;
    }
`;

export const fsOIT = `
    #version 300 es
    precision highp float;

    in vec2 vUV;

    uniform sampler2D oitColor;
    uniform sampler2D oitAlpha;

    out vec4 fragColor;
    
    void main() {
        ivec2 fragCoord = ivec2(gl_FragCoord.xy);
        vec4 accum = texture(oitColor, vUV);
        float a = 1.0 - accum.a;
        accum.a = texture(oitAlpha, vUV).r;
        fragColor = vec4(a * accum.rgb / clamp(accum.a, 0.001, 50000.0), a);
    }
`;

export const fsOpaque = `
    #version 300 es
    precision highp float;
    
    in vec3 vPosition;
    in vec3 vUV;
    in vec4 vShadowProjection;

    uniform vec3 color;
    uniform vec3 eyePosition;
    uniform vec3 lightPosition;
    uniform bool cutout;
    uniform highp sampler2DShadow shadowMap;

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

    in vec3 vUV;

    uniform bool cutout;

    void main() {
        vec2 cutoutUV = (vUV.xy / vUV.z) * 2.0 - 1.0;
        if (cutout && dot(cutoutUV, cutoutUV) < 0.7) {
            discard;
        }
    }
`;
