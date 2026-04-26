export const patchHexGridShader = (shader, customUniforms) => {
    shader.uniforms.uTime = customUniforms.uTime
    shader.uniforms.uMouse = customUniforms.uMouse
    shader.uniforms.uWaveSpeed = customUniforms.uWaveSpeed
    shader.uniforms.uWaveFreq = customUniforms.uWaveFreq
    shader.uniforms.uWaveHeight = customUniforms.uWaveHeight
    shader.uniforms.uThemeTrough = customUniforms.uThemeTrough
    shader.uniforms.uThemePeak = customUniforms.uThemePeak
    shader.uniforms.uThemeAccent = customUniforms.uThemeAccent
    shader.uniforms.uColorBlendBias = customUniforms.uColorBlendBias
    shader.uniforms.uRadialFalloff = customUniforms.uRadialFalloff

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
    #include <common>
    uniform float uTime;
    uniform float uWaveSpeed;
    uniform float uWaveFreq;
    uniform float uWaveHeight;
    varying float vWaveFactor;
    varying vec2 vWorldPos;
    `
    )

    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
    #include <begin_vertex>
    // Get instance position from the matrix
    vec2 centerXZ = vec2(instanceMatrix[3][0], instanceMatrix[3][2]);
    vWorldPos = centerXZ;

    float wave = sin(centerXZ.x * uWaveFreq + uTime * uWaveSpeed) * uWaveHeight;
    vWaveFactor = wave;
    transformed.y += wave;
    `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
    #include <common>
    uniform vec3 uThemeTrough;
    uniform vec3 uThemePeak;
    uniform vec3 uThemeAccent;
    uniform float uColorBlendBias;
    uniform float uRadialFalloff;
    varying float vWaveFactor;
    varying vec2 vWorldPos;
    `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
    #include <color_fragment>
    // Calculate the depth-based color
    float mixFactor = clamp((vWaveFactor / 5.0) + uColorBlendBias, 0.0, 1.0);
    vec3 baseColor = mix(uThemeTrough, uThemePeak, mixFactor);
    
    diffuseColor.rgb = baseColor;

    // Apply simple radial vignette so it doesn't just "cut off" at the edges
    float d = distance(vWorldPos, vec2(0.0));
    float mask = smoothstep(50.0, 150.0, d);
    diffuseColor.rgb = mix(diffuseColor.rgb, uThemeTrough, mask * uRadialFalloff);
    `
    )
}