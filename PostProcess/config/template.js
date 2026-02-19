export const TEMPLATE_BEFORE = `
#version 330

uniform sampler2D MainSampler;
uniform sampler2D MainDepthSampler;
uniform sampler2D TranslucentSampler;
uniform sampler2D TranslucentDepthSampler;
uniform sampler2D ItemEntitySampler;
uniform sampler2D ItemEntityDepthSampler;
uniform sampler2D ParticlesSampler;
uniform sampler2D ParticlesDepthSampler;
uniform sampler2D WeatherSampler;
uniform sampler2D WeatherDepthSampler;
uniform sampler2D CloudsSampler;
uniform sampler2D CloudsDepthSampler;

in vec2 texCoord;

vec4 color_layers[6] = vec4[](vec4(0.0), vec4(0.0), vec4(0.0), vec4(0.0), vec4(0.0), vec4(0.0));
float depth_layers[6] = float[](0, 0, 0, 0, 0, 0);
int active_layers = 0;

out vec4 fragColor;

void try_insert(vec4 color, float depth) {
    if (color.a == 0.0) {
        return;
    }

    color_layers[active_layers] = color;
    depth_layers[active_layers] = depth;

    int jj = active_layers++;
    int ii = jj - 1;
    while (jj > 0 && depth_layers[jj] > depth_layers[ii]) {
        float depthTemp = depth_layers[ii];
        depth_layers[ii] = depth_layers[jj];
        depth_layers[jj] = depthTemp;

        vec4 colorTemp = color_layers[ii];
        color_layers[ii] = color_layers[jj];
        color_layers[jj] = colorTemp;

        jj = ii--;
    }
}

vec3 blend(vec3 dst, vec4 src) {
    return (dst * (1.0 - src.a)) + src.rgb;
}

vec3 generate_final(vec2 coord) {
    color_layers[0] = vec4(texture(MainSampler, texCoord).rgb, 1.0);
    depth_layers[0] = texture(MainDepthSampler, texCoord).r;
    active_layers = 1;

    try_insert(texture(TranslucentSampler, texCoord), texture(TranslucentDepthSampler, texCoord).r);
    try_insert(texture(ItemEntitySampler, texCoord), texture(ItemEntityDepthSampler, texCoord).r);
    try_insert(texture(ParticlesSampler, texCoord), texture(ParticlesDepthSampler, texCoord).r);
    try_insert(texture(WeatherSampler, texCoord), texture(WeatherDepthSampler, texCoord).r);
    try_insert(texture(CloudsSampler, texCoord), texture(CloudsDepthSampler, texCoord).r);

    vec3 texelAccum = color_layers[0].rgb;
    for (int ii = 1; ii < active_layers; ++ii) {
        texelAccum = blend(texelAccum, color_layers[ii]);
    }
    return texelAccum.rgb;
}

vec4 grayscale(vec4 color) {
    float g = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    return vec4(vec3(g), 1.0);
}

vec4 rectMask(vec2 texCoord, vec2 p1, vec2 p2, vec4 color1, vec4 color2) {
    vec2 minP = min(p1, p2);
    vec2 maxP = max(p1, p2);

    float inside =
        step(minP.x, texCoord.x) *
        step(texCoord.x, maxP.x) *
        step(minP.y, texCoord.y) *
        step(texCoord.y, maxP.y);

    return mix(color2, color1, inside);
}

vec4 ellipseMask(vec2 texCoord, vec2 p1, vec2 p2, vec4 color1, vec4 color2) {
    vec2 minP = min(p1, p2);
    vec2 maxP = max(p1, p2);

    vec2 center = (minP + maxP) * 0.5;
    vec2 radius = (maxP - minP) * 0.5;

    vec2 d = texCoord - center;

    float v =
        (d.x * d.x) / (radius.x * radius.x) +
        (d.y * d.y) / (radius.y * radius.y);

    float inside = step(v, 1.0);

    return mix(color2, color1, inside);
}


void main() {
    float value = texture(ParticlesSampler, vec2(0.0, 0.0)).g * 100;
    float mode = texture(ParticlesSampler, vec2(0.0, 0.0)).b * 100;
    vec3 FinalColor = generate_final(texCoord);

`;

export const TEMPLATE_AFTER = `
    fragColor = vec4(FinalColor.rgb, 1.0);
}
`;

export const TEMPLATE_FSH = `
#version 330

#moj_import <minecraft:fog.glsl>
#moj_import <minecraft:dynamictransforms.glsl>

uniform sampler2D Sampler0;

in float sphericalVertexDistance;
in float cylindricalVertexDistance;
in vec2 texCoord0;
in vec4 vertexColor;

out vec4 fragColor;

in float isMarker;
in vec4 tint;

void main() {
    if (isMarker == 1.0) {
        fragColor = tint;
    } else {
        vec4 color = texture(Sampler0, texCoord0) * vertexColor * ColorModulator;
        if (color.a < 0.1) {
            discard;
        }
        fragColor = apply_fog(color, sphericalVertexDistance, cylindricalVertexDistance, FogEnvironmentalStart, FogEnvironmentalEnd, FogRenderDistanceStart, FogRenderDistanceEnd, FogColor);
    }
}
`

export const TEMPLATE_VSH = `
#version 330

#moj_import <minecraft:fog.glsl>
#moj_import <minecraft:dynamictransforms.glsl>
#moj_import <minecraft:projection.glsl>

in vec3 Position;
in vec2 UV0;
in vec4 Color;
in ivec2 UV2;

uniform sampler2D Sampler2;

out float sphericalVertexDistance;
out float cylindricalVertexDistance;
out vec2 texCoord0;
out vec4 vertexColor;

out float isMarker;
out vec4 tint;

vec2[] corners = vec2[](
    vec2(0, 1),
    vec2(0, 0),
    vec2(1, 0),
    vec2(1, 1)
);

void main() {
    tint = Color;

    if (Color.r == 0.0) {
        isMarker =  1.0;

        gl_Position = vec4(0.01 * corners[gl_VertexID % 4] - 1.0, 0.0, 1.0);
        sphericalVertexDistance = fog_spherical_distance(Position);
        cylindricalVertexDistance = fog_cylindrical_distance(Position);
        texCoord0 = vec2(0);
        vertexColor = vec4(0);
    } else {
        isMarker = 0.0;

        gl_Position = ProjMat * ModelViewMat * vec4(Position, 1.0);
        sphericalVertexDistance = fog_spherical_distance(Position);
        cylindricalVertexDistance = fog_cylindrical_distance(Position);
        texCoord0 = UV0;
        vertexColor = Color * texelFetch(Sampler2, UV2 / 16, 0);
    }
}
`

export const PACK_FORMAT = `
{
  "pack": {
    "description": "Generated By BlueMango Shader Generator. (https://mangojun.github.io/bluemango/PostProcessor)",
    "min_format": 75,
    "max_format": 75
  }
}
`