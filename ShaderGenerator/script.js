// 셰이더 컨테이너
const shaderContainer = document.getElementById("shader-container");
let currentComponentContainer = null;

// 셰이더 추가
document.getElementById("shader-add").onclick = () => {
    // 레이아웃
    const shader = document.createElement("div");
    shader.className = "shader-layout";

    // 상단 바
    const shaderUpbar = document.createElement("div");
    shaderUpbar.className = "shader-upbar";

    // 이름 인풋
    const shaderName = document.createElement("input");
    shaderName.placeholder = "셰이더 이름을 입력하세요";

    // 삭제 버튼
    const shaderDelete = document.createElement("button");
    shaderDelete.textContent = "close";
    shaderDelete.className = "delete-button material-symbols-outlined";
    shaderDelete.onclick = () => shaderContainer.removeChild(shader);

    // 컴포넌트 컨테이너
    const componentContainer = document.createElement("div");
    componentContainer.className = "component-container";
    
    // 추가 버튼
    const componentAdd = document.createElement("button");
    componentAdd.className = "add-button material-symbols-outlined"
    componentAdd.textContent = "add";
    componentAdd.onclick = () => {
        currentComponentContainer = componentContainer;
        openModal();
    };

    // 최종 추가하기
    shader.appendChild(shaderUpbar);
    shaderUpbar.appendChild(shaderName);
    shaderUpbar.appendChild(shaderDelete);
    shader.appendChild(componentContainer);
    shader.appendChild(componentAdd);
    shaderContainer.appendChild(shader);
};

function openModal() {
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function addInput(parent, name, template) {
    temp = "";
    parent.className = name;
    template.split("").forEach(char => {
        if (char == "[") {
            let label = document.createElement("span");
            label.textContent = temp;
            parent.appendChild(label);

            temp = "";
        } else if (char == "]") {
            let input = document.createElement("input");
            input.placeholder = temp;
            input.setAttribute("list", "template");
            parent.appendChild(input);

            let list = document.createElement("datalist");
            list.id = "template";

            let pos = document.createElement("option");
            pos.value = "texCoord";
            pos.textContent = "현재 좌표";

            let x = document.createElement("option");
            x.value = "texCoord.x";
            x.textContent = "현재 X 좌표";

            let y = document.createElement("option");
            y.value = "texCoord.y";
            y.textContent = "현재 Y 좌표";

            let final = document.createElement("option");
            final.value = "FinalColor";
            final.textContent = "최종 색깔";

            let r = document.createElement("option");
            r.value = "FinalColor.r";
            r.textContent = "최종 색깔의 빨강";

            let g = document.createElement("option");
            g.value = "FinalColor.g";
            g.textContent = "최종 색깔의 초록";

            let b = document.createElement("option");
            b.value = "FinalColor.b";
            b.textContent = "최종 색깔의 파랑";

            let value = document.createElement("option");
            value.value = "value";
            value.textContent = "입력값 (value)";

            list.appendChild(pos)
            list.appendChild(x)
            list.appendChild(y)
            list.appendChild(final)
            list.appendChild(r)
            list.appendChild(g)
            list.appendChild(b)
            list.appendChild(value)
            parent.appendChild(list)

            temp = "";
        } else {
            temp += char;
        }
    })

    if (temp) {
        let label = document.createElement("span");
        label.textContent = temp
        parent.appendChild(label)
    }
}

function selectType(type) {
    // 컴포넌트 레이아웃
    const component = document.createElement("div");
    component.className = "component-layout";

    // 위로 버튼
    const componentMoveup = document.createElement("button");
    componentMoveup.textContent = "keyboard_arrow_up";
    componentMoveup.className = "move-button material-symbols-outlined";
    componentMoveup.onclick = () => {
        const prev = component.previousElementSibling;
        if (prev) currentComponentContainer.insertBefore(component, prev);
    };

    // 아래로 버튼
    const componentMovedown = document.createElement("button");
    componentMovedown.textContent = "keyboard_arrow_down";
    componentMovedown.className = "move-button material-symbols-outlined";
    componentMovedown.onclick = () => {
        const next = component.nextElementSibling;
        if (next) currentComponentContainer.insertBefore(next, component);
    };
    
    // 입력 레이아웃
    let componentInput = document.createElement("div");

    if (type === "BasicCode") {
        addInput(componentInput, "BasicCode", "코드 실행 [glsl 코드]");

    } else if (type === "BasicFinal") {
        addInput(componentInput, "BasicFinal", "X: [X 좌표] Y: [Y 좌표](으)로 최종 색깔 생성하기");

    } else if (type === "BasicOutput") {
        addInput(componentInput, "BasicOutput", "R: [빨강] G: [초록] B: [파랑](을)를 출력하기");

    } else if (type === "BasicVar") {
        addInput(componentInput, "BasicVar", "[변수](을)를 [값](으)로 바꾸기");

    } else if (type === "BasicFloat") {
        addInput(componentInput, "BasicFloat", "수치 [수치](을)를 [값](으)로 정하기");

    } else if (type === "BasicVec2") {
        addInput(componentInput, "BasicVec2", "좌표 [좌표](을)를 X [X 좌표], Y [Y 좌표](으)로 정하기");

    } else if (type === "BasicVec3") {
        addInput(componentInput, "BasicVec3", "색깔 [색깔](을)를 R [빨강], G [초록], B [파랑](으)로 정하기");

    } else if (type === "FilterMono") {
        addInput(componentInput, "FilterMono", "색깔 [색깔](을)를 흑백으로 바꾸기");

    } else if (type === "FilterReverse") {
        addInput(componentInput, "FilterReverse", "색깔 [색깔](을)를 색 반전하기");

    }

    // 삭제 버튼
    const componentDelete = document.createElement("button");
    componentDelete.textContent = "close";
    componentDelete.className = "delete-button material-symbols-outlined";
    componentDelete.onclick = () => currentComponentContainer.removeChild(component);

    // 최종 추가
    component.appendChild(componentMoveup);
    component.appendChild(componentMovedown);
    component.appendChild(componentInput)
    component.appendChild(componentDelete);
    currentComponentContainer.appendChild(component);

    closeModal();
}

// glsl 일부 생성
function compile() {
    const result = [];

    const shaders = document.querySelectorAll(".shader-layout");
    shaders.forEach(shader => {
        const shaderName = shader.querySelector("input");
        const components = shader.querySelectorAll(".component-layout");

        const glsls = [];
        components.forEach(component => {
            const inputs = component.querySelectorAll("input");
            const type = component.querySelector("div").className;
            if (!inputs) return;

            let code = [];
            inputs.forEach(input => {
                code.push(input.value);
            });

            switch (type) {
                case "BasicCode":
                    glsls.push(`${code}`);
                    break;

                case "BasicFinal":
                    glsls.push(`FinalColor = generate_final(vec2(${code[0]}, ${code[1]}));`);
                    break;

                case "BasicOutput":
                    glsls.push(`fragColor = vec4( vec3(${code[0]}, ${code[1]}, ${code[2]}), 1.0 );`);
                    break;

                case "BasicVar":
                    glsls.push(`${code[0]} = ${code[1]};`);
                    break;

                case "BasicFloat":
                    glsls.push(`float ${code[0]} = ${code[1]};`);
                    break;

                case "BasicVec2":
                    glsls.push(`vec2 ${code[0]} = vec2(${code[1]}, ${code[2]});`);
                    break;

                case "BasicVec3":
                    glsls.push(`vec3 ${code[0]} = vec3(${code[1]}, ${code[2]}, ${code[3]});`);
                    break;

                case "FilterMono":
                    glsls.push(`float y = (${code[0]}.r + ${code[0]}.g + ${code[0]}.b) / 3;
                        ${code[0]} = vec3(y, y, y);`);
                    break;

                case "FilterReverse":
                    glsls.push(`${code[0]} = 1 - ${code[0]};`);
                    break;
            }
        });

        result.push({
            name: shaderName.value.trim(),
            component: glsls
        });
    });

    return result
}

TEMPLATE_BEFORE = `
#version 150

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

#define NUM_LAYERS 6

vec4 color_layers[NUM_LAYERS];
float depth_layers[NUM_LAYERS];
int active_layers = 0;

out vec4 fragColor;

void try_insert( vec4 color, float depth ) {
    if ( color.a == 0.0 ) {
        return;
    }

    color_layers[active_layers] = color;
    depth_layers[active_layers] = depth;

    int jj = active_layers++;
    int ii = jj - 1;
    while ( jj > 0 && depth_layers[jj] > depth_layers[ii] ) {
        float depthTemp = depth_layers[ii];
        depth_layers[ii] = depth_layers[jj];
        depth_layers[jj] = depthTemp;

        vec4 colorTemp = color_layers[ii];
        color_layers[ii] = color_layers[jj];
        color_layers[jj] = colorTemp;

        jj = ii--;
    }
}

vec3 blend( vec3 dst, vec4 src ) {
    return ( dst * ( 1.0 - src.a ) ) + src.rgb;
}

vec3 generate_final(vec2 coord) {
    color_layers[0] = vec4( texture( MainSampler, coord ).rgb, 1.0 );
    depth_layers[0] = texture( MainDepthSampler, coord ).r;
    active_layers = 1;

    try_insert( texture( TranslucentSampler, coord ), texture( TranslucentDepthSampler, coord ).r );
    try_insert( texture( ItemEntitySampler, coord ), texture( ItemEntityDepthSampler, coord ).r );
    try_insert( texture( ParticlesSampler, coord ), texture( ParticlesDepthSampler, coord ).r );
    try_insert( texture( WeatherSampler, coord ), texture( WeatherDepthSampler, coord ).r );
    try_insert( texture( CloudsSampler, coord ), texture( CloudsDepthSampler, coord ).r );

    vec3 texelAccum = color_layers[0].rgb;
    for ( int ii = 1; ii < active_layers; ++ii ) {
        texelAccum = blend( texelAccum, color_layers[ii] );
    }
    return texelAccum.rgb;
}

void main() {
    float value = texture(ParticlesSampler, vec2(0.0, 0.0)).g * 100;
    float marker = texture(ParticlesSampler, vec2(0.0, 0.0)).b * 100;
    vec3 FinalColor = generate_final(texCoord);

`;

TEMPLATE_AFTER = `
    fragColor = vec4( FinalColor.rgb, 1.0 );
}
`;

TEMPLATE_FSH = `
#version 150

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

TEMPLATE_VSH = `
#version 150

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

    if (Color.r == 1.0) {
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

function download() {
    // GLSL 가져오기
    file = TEMPLATE_BEFORE;
    setting = compile();

    for(i = 0; i < setting.length; i++) {
        file += `    if (abs(marker - ${i}) < 0.5) {\n`;
        setting[i].component.forEach(code => {
            file += "        " + code + "\n";
        });
        file += `    } else\n`;
    }

    file += TEMPLATE_AFTER;

    // 팩 포멧 가져오기
    shaderFormat = document.getElementById("version").value;

    // 팩 이름 가져오기
    shaderName = document.getElementById("name").value;

    // ZIP 파일 생성
    const zip = new JSZip();

    zip.file("pack.mcmeta", `{"pack": {"pack_format":${shaderFormat}, "description": "Generated By BlueMango Shader Generator"}}`);
    zip.folder("assets")
        .folder("minecraft")
        .folder("shaders")
        .folder("core")
        .file("particle.fsh", TEMPLATE_FSH)
        .file("particle.vsh", TEMPLATE_VSH);

    zip.folder("assets")
        .folder("minecraft")
        .folder("shaders")
        .folder("post")
        .file("transparency.fsh", file);

    // 압축 후 다운로드
    zip.generateAsync({ type: "blob" })
    .then(function(content) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = shaderName + ".zip";
        a.click();
    });
}

// 기본값 채우기
document.getElementById("shader-add").click();
document.querySelector(".shader-upbar input").value = "default";
document.querySelector(".shader-layout .add-button").click();
buttons = document.querySelectorAll("#modal-main button");
buttons[1].click();
buttons[2].click();
inputs = document.querySelectorAll(".component-layout div input");
inputs[0].value = "texCoord.x";
inputs[1].value = "texCoord.y";
inputs[2].value = "FinalColor.r";
inputs[3].value = "FinalColor.g";
inputs[4].value = "FinalColor.b";