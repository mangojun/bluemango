import { LIST_SCHEMES, POPOVER_SCHEMES, BASE_TYPES } from "./config/scheme.js";
import { TEMPLATE_AFTER, TEMPLATE_BEFORE, PACK_FORMAT, TEMPLATE_FSH, TEMPLATE_VSH } from "./config/template.js";

let editing_shader = 0;
let button_operation = "delete";
let copyed_block = "";
let pack_format = PACK_FORMAT;

let shaders = [
  {
    declares: {
      num: [],
      pos: [],
      color: [
        "varfinal"
      ]
    },
    blocks: [
      {
        type: "inout",
        id: "getColor",
        values: [
          "varfinal",
          "texCoord"
        ]
      },
      {
        type: "inout",
        id: "print",
        values: [
          "varfinal"
        ]
      }
    ]
  }
];

function setBlockList({type}) {
    const BLOCK_LIST = document.getElementById("block-list");
    BLOCK_LIST.innerHTML = "";

    LIST_SCHEMES[type].forEach(b => {
        switch (b.type) {
            case "block":
                let block = document.createElement("button");
                block.innerText = b.label;
                block.className = type;
                block.addEventListener("click", () => appendBlock(type, b.id, b.value));
                BLOCK_LIST.appendChild(block);
                break;
            case "button":
                let button = document.createElement("button");
                button.innerText = b.label;
                button.className = "button";
                button.dataset.action = b.action;
                button.dataset.attr = b.attr;
                BLOCK_LIST.appendChild(button);
                break;
            case "bar":
                let hr = document.createElement("hr");
                BLOCK_LIST.appendChild(hr);
                break;
            case "label":
                let label = document.createElement("span");
                label.innerText = b.label;
                BLOCK_LIST.appendChild(label);
                break;
        }
    });
};

function appendBlock(type, id, value) {
    shaders[editing_shader].blocks.push({type: type, id: id, values: new Array(value).fill("")});
    render();
}

function vectorToList(vector) {
    let temp =  vector
        .replace(/^[^(]+\(|\)$/g, "") // xxx(yyy) -> yyy
        .split(",")
        .map(v => Number(v.trim()));

    return {value: temp, original: vector};
}

function openPopover({block_num, input_num, list}) {
    // 팝오버 초기화
    let block = document.getElementsByClassName("block")[Number(block_num)];
    let input = block.getElementsByClassName("input")[Number(input_num)];
    let rect = input.getBoundingClientRect();

    const popover = document.getElementById("popover");
    popover.classList.remove("hidden");
    popover.style.top = rect.bottom + "px";
    popover.style.left = rect.left + "px";
    popover.className = block.className;
    popover.classList.remove("block");

    const popover_content = document.getElementById("popover-content");
    popover_content.innerText = "";

    let type = input.className.replace("input ", "");

    // 내부에 인풋 추가
    if (list.includes("I")) {
        let inputs = document.createElement("div");
        inputs.id = "inputs";

        for(let i = 0; i < BASE_TYPES[type].size; i++){
            let inp = document.createElement("input");
            inp.className = "inp";

            const inps = document.getElementsByClassName("inp");
            inp.addEventListener("change", () => {
                let temp;

                switch (type) {
                    case "num":
                        temp = inps[0].value;
                        break;
                    case "pos":
                        temp = `vec2(${inps[0].value}, ${inps[1].value})`;
                        break;
                    case "color":
                        temp = `vec4(${inps[0].value}, ${inps[1].value}, ${inps[2].value}, ${inps[3].value})`;
                        break;
                }

                shaders[editing_shader].blocks[block_num].values[input_num] = temp;
                render();
            });

            let inner = vectorToList(shaders[editing_shader].blocks[block_num].values[input_num]);

            if (type == "num") inp.value = inner.original
            else if (isNaN(inner.value[i])) inp.value = 0;
            else inp.value = inner.value[i];

            inputs.appendChild(inp);

            popover_content.appendChild(inputs);
        }
    }

    // 내부에 불틴 추가
    if (list.includes("B")) {
        let bultins = document.createElement("div");
        bultins.id = "bultins";

        POPOVER_SCHEMES[type].forEach(r => {
            let blt = document.createElement("button");
            blt.className = type + " input";
            blt.innerText = r.label;
            blt.style.setProperty("--input-color", r.color);
            blt.style.setProperty("--input-bgcolor", r.bgcolor);
            blt.style.setProperty("--input-dark", r.dark);

            blt.onclick = () => {
                shaders[editing_shader].blocks[block_num].values[input_num] = r.id;
                closePopover();
                render();
            };

            bultins.appendChild(blt);
        });

        popover_content.appendChild(bultins);
    }

    // 내부에 변수 추가
    if (list.includes("V")) {
        let variables = document.createElement("div");
        variables.id = "variables";

        shaders[editing_shader].declares[type].forEach(v => {
            let vrb = document.createElement("button");
            vrb.className = type + " input";
            vrb.innerText = v.slice(3);
            vrb.style.setProperty("--input-color", "var(--white)");
            vrb.style.setProperty("--input-bgcolor", "var(--orange)");
            vrb.style.setProperty("--input-dark", "var(--orange-dark)");

            vrb.onclick = () => {
                shaders[editing_shader].blocks[block_num].values[input_num] = v;
                closePopover();
                render();
            };

            variables.appendChild(vrb);
        });

        popover_content.appendChild(variables);
    }

    // 팝오버 내부 추가
    popover.appendChild(popover_content);
}

function closePopover() {
    const popover = document.getElementById("popover");
    popover.classList.add("hidden");
}

function declareVariable({attr}) {
    // const modal = document.getElementById("modal");
    // modal.classList.remove("hidden");
    let a = prompt("이름");
    if (!a) return;
    switch (attr) {
        case "varNum":
            shaders[editing_shader].declares.num.push("var" + a);
            break;
        case "varPos":
            shaders[editing_shader].declares.pos.push("var" + a);
            break;
        case "varColor":
            shaders[editing_shader].declares.color.push("var" + a);
            break;
    }
}

function setButtonOperation({mode}) {
    button_operation = mode;
    document.querySelectorAll("#edit button").forEach(b => {
        b.classList.toggle("active", b.dataset.mode === mode);
    });
    render();
}

function blockButton({line}) {
    line = Number(line)
    let temp_blocks = shaders[editing_shader].blocks;
    switch (button_operation) {
        case "delete":
            temp_blocks.splice(line, 1);
            break;
        case "up":
            if (line > 0) {
                [temp_blocks[line - 1], temp_blocks[line]] = [temp_blocks[line], temp_blocks[line - 1]];
            }
            break;
        case "down":
            if (line < temp_blocks.length - 1) {
                [temp_blocks[line], temp_blocks[line + 1]] = [temp_blocks[line + 1], temp_blocks[line]];
            }
            break;
        case "copy":
            copyed_block = temp_blocks[line];
            break;
        case "cut":
            copyed_block = temp_blocks[line];
            temp_blocks.splice(line, 1);
            break;
        case "paste":
            temp_blocks.splice(line, 0, structuredClone(copyed_block));
            break;
        }
    shaders[editing_shader].blocks = temp_blocks;
    render();
}


function findBlockScheme(type, id) {
    let scheme;
    for (const b of LIST_SCHEMES[type]) {
        if (!b.type == "block") break;
        if (b.id == id) scheme = b;
    }

    return scheme;
}

function findReporterScheme(id) {
    let scheme;
    Object.keys(BASE_TYPES).forEach(t => {
        POPOVER_SCHEMES[t].forEach(r => {
            if (r.id == id) scheme = r;
        });
    });
    return scheme;
}

function render() {
    let block_ground = document.getElementById("block-ground");
    let scroll = block_ground.scrollTop;
    block_ground.innerHTML = ""

    // 셰이더 코드 모자블록
    let block_hat = document.createElement("div");
    block_hat.className = "hat";
    block_hat.innerHTML = '<span class="material-symbols-rounded">flag</span>각 픽셀에 대하여';
    block_ground.appendChild(block_hat);

    // 셰이더 코드 블록
    let block_num = 0;
    shaders[editing_shader].blocks.forEach(b => {
        // 메인 만들기
        const blockScheme = findBlockScheme(b.type, b.id);
        const main = document.createElement("div");
        const fragment = document.createDocumentFragment();

        const labelStr = blockScheme.label;
        const values = b.values ?? [];

        let temp = "";
        let inputNum = 0;

        const typeMap = {
            "]": "num",
            ")": "color",
            ">": "pos"
        };

        for (let i = 0; i < labelStr.length; i++) {
            const c = labelStr[i];

            if (c === "[" || c === "(" || c === "<") {
                if (temp) {
                    const span = document.createElement("span");
                    span.textContent = temp;
                    fragment.appendChild(span);
                    temp = "";
                }
            }

            else if (typeMap[c]) {
                const input = document.createElement("button");
                input.className = `input ${typeMap[c]}`;

                input.dataset.action = "openPopover";
                input.dataset.block_num = block_num;
                input.dataset.input_num = inputNum;
                input.dataset.list = temp;

                const value = values[inputNum] ?? "";
                const reporterScheme = findReporterScheme(value);

                if (reporterScheme) {
                    input.textContent = reporterScheme.label;
                    input.style.setProperty("--input-color", reporterScheme.color);
                    input.style.setProperty("--input-bgcolor", reporterScheme.bgcolor);
                    input.style.setProperty("--input-dark", reporterScheme.dark);
                } 
                else if (value.startsWith?.("var")) {
                    input.textContent = value.slice(3);
                    input.style.setProperty("--input-color", "var(--white)");
                    input.style.setProperty("--input-bgcolor", "var(--orange)");
                    input.style.setProperty("--input-dark", "var(--orange-dark)");
                } 
                else {
                    input.textContent = value;
                }

                fragment.appendChild(input);
                inputNum++;
                temp = "";
            }

            else {
                temp += c;
            }
        }

        if (temp) {
            const span = document.createElement("span");
            span.textContent = temp;
            fragment.appendChild(span);
        }

        main.appendChild(fragment);

        // 버튼 만들기
        let button = document.createElement("button");
        button.className = b.type + " block-btn material-symbols-rounded";
        button.innerText = document.querySelector("#edit .active").innerText;
        button.dataset.action = "blockButton";
        button.dataset.line = block_num

        // 블록 만들기
        let block = document.createElement("div");
        block.appendChild(main);
        block.appendChild(button);
        block.className = b.type + " block";

        block_ground.appendChild(block);
        block_num += 1;
    });

    block_ground.scrollTop = scroll;
}

function appendShader() {
    if (shaders.length == 100) {
        alert("셰이더 개수는 최대 100개(DEFAULT 1개 + 추가 99개) 까지입니다.");
        return;
    }

    shaders.push({blocks: [], declares: {num: [], pos: [], color: []}});
    editing_shader = shaders.length - 1;
    reloadShaderList();
    render()
}

function setShader({num}) {
    editing_shader = Number(num);
    reloadShaderList()
    render()
}

function reloadShaderList() {
    const SHADER_LIST = document.getElementById("shader-list");
    SHADER_LIST.innerText = "";

    for (let i = 0; i < shaders.length; i++) {
        let shader_btn = document.createElement("button");
        if (i == 0) shader_btn.innerText = "DEFAULT";
        else shader_btn.innerText = i;

        shader_btn.dataset.action = "setShader";
        shader_btn.dataset.num = i;

        if (i == editing_shader) shader_btn.id = "active";

        SHADER_LIST.appendChild(shader_btn);
    }

    let buttons = SHADER_LIST.querySelectorAll("button");
    buttons.forEach(s => s.id = "");
    buttons[editing_shader].id = "active";
}

function save() {
    const json = JSON.stringify(shaders, null, 2);
    const blob = new Blob([json], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "저장된 셰이더 파일.1699";
    a.click();

    URL.revokeObjectURL(url);
}

function open() {
    document.getElementById("open-file").click();
}

function datapack() {
    const a = document.createElement("a");
    a.href = "media/shader-controller.zip";
    a.download = "shader-selector.zip";
    a.click();
}

function generateGLSL(block) {
    let scheme = findBlockScheme(block.type, block.id);
    let glsl = scheme.glsl.replace(/\{(\d+)\}/g, (_, index) => {
        return block.values[Number(index)];
    });
    return glsl;
}

function generate() {
    let transparency = TEMPLATE_BEFORE;

    for (let i = 0; i < shaders.length; i++) {
        transparency += `    if (abs(mode - ${i}) < 0.5) {\n`;

        Object.keys(BASE_TYPES).forEach(t => {
            shaders[i].declares[t].forEach(v => {
                transparency += `        ${BASE_TYPES[t].glsl} ${v};\n`
            })
        });

        shaders[i].blocks.forEach(b => {
            transparency += `        ${generateGLSL(b)}\n`; 
        });

        transparency += `    } else\n`;
    }

    transparency += TEMPLATE_AFTER;

    const zip = new JSZip();
    
    zip.file("pack.mcmeta", pack_format);
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
        .file("transparency.fsh", transparency);

    // 압축 후 다운로드
    zip.generateAsync({ type: "blob" })
        .then(function(content) {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(content);
            a.download = "생성된 셰이더 리소스팩.zip";
            a.click();
        });
}

// 팝오버 밖 클릭하면 사라지기
document.addEventListener("click", (e) => {
    const CLICKED_POPOVER = e.target.closest("#popover");
    const CLICKED_INPUT = e.target.closest(".input");
    if (CLICKED_POPOVER || CLICKED_INPUT) return;

    closePopover();
});

// 버튼에 이벤트 넣기
const ACTIONS = {
    setBlockList,
    openPopover,
    blockButton,
    setButtonOperation,
    appendShader,
    setShader,
    declareVariable,
    save,
    open,
    generate,
    datapack
}

document.addEventListener("click", e => {
    const el = e.target.closest("[data-action]");
    if (!el) return;

    const action = el.dataset.action;
    ACTIONS[action]?.(el.dataset);
})

document.getElementById("open-file").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        shaders = JSON.parse(e.target.result);
        render();
        reloadShaderList();
    };

    reader.readAsText(file);
});

document.querySelectorAll("#edit button").forEach(b => b.dataset.action = "setButtonOperation");
document.querySelectorAll("#block-type button").forEach(b => b.dataset.action = "setBlockList");

// 초기 설정
setBlockList({type: "inout"});
render();