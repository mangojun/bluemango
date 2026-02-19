export const LIST_SCHEMES = {
    inout: [
        {
            type: "block",
            id: "getColor",
            label: "(V)를 화면의 <BVI> 색으로 정하기",
            value: 2,
            glsl: "{0} = vec4(generate_final({1}), 1.0);"
        },
        {
            type: "block",
            id: "getDepth",
            label: "[V]를 화면의 <BVI> 깊이로 정하기",
            value: 2,
            glsl: "{0} = texture(MainDepthSampler, {1}).r;"
        },
        {
            type: "block",
            id: "print",
            label: "(BVI) 출력하기",
            value: 1,
            glsl: "fragColor = {0};"
        }
    ],
    math: [
        {
            type: "block",
            id: "sum",
            label: "[V]에 [BVI] 더하기",
            value: 2,
            glsl: "{0} += {1};"
        },
        {
            type: "block",
            id: "sub",
            label: "[V]에 [BVI] 빼기",
            value: 2,
            glsl: "{0} -= {1};"
        },
        {
            type: "block",
            id: "mul",
            label: "[V]에 [BVI] 곱하기",
            value: 2,
            glsl: "{0} *= {1};"
        },
        {
            type: "block",
            id: "div",
            label: "[V]에 [BVI] 나누기",
            value: 2,
            glsl: "{0} /= {1};"
        }
    ],
    var: [
        {
            type: "button",
            label: "수 변수 선언",
            action: "declareVariable",
            attr: "varNum"
        },
        {
            type: "button",
            label: "좌표 변수 선언",
            action: "declareVariable",
            attr: "varPos"
        },
        {
            type: "button",
            label: "색 변수 선언",
            action: "declareVariable",
            attr: "varColor"
        },

        {
            type: "label",
            label: "수 변수 정하기:"
        },
        {
            type: "block",
            id: "setNum",
            label: "[V]를 [BVI]로 정하기",
            value: 2,
            glsl: "{0} = {1};"
        },
        { type: "bar" },
        {
            type: "block",
            id: "setNumByPosX",
            label: "[V]를 <BV>의 X좌표로 정하기",
            value: 2,
            glsl: "{0} = {1}.x;"
        },
        {
            type: "block",
            id: "setNumByPosY",
            label: "[V]를 <BV>의 Y좌표로 정하기",
            value: 2,
            glsl: "{0} = {1}.y;"
        },
        { type: "bar" },
        {
            type: "block",
            id: "setNumByColorR",
            label: "[V]를 (BV)의 빨강으로 정하기",
            value: 2,
            glsl: "{0} = {1}.r;"
        },
        {
            type: "block",
            id: "setNumByColorG",
            label: "[V]를 (BV)의 초록으로 정하기",
            value: 2,
            glsl: "{0} = {1}.g;"
        },
        {
            type: "block",
            id: "setNumByColorB",
            label: "[V]를 (BV)의 파랑으로 정하기",
            value: 2,
            glsl: "{0} = {1}.b;"
        },
        {
            type: "block",
            id: "setNumByColorA",
            label: "[V]를 (BV)의 투명도로 정하기",
            value: 2,
            glsl: "{0} = {1}.a;"
        },

        {
            type: "label",
            label: "좌표 변수 정하기:"
        },
        {
            type: "block",
            id: "setPos",
            label: "<V>를 <BVI>로 정하기",
            value: 2,
            glsl: "{0} = {1};"
        },
        {
            type: "block",
            id: "setPosEach",
            label: "<V>를 X [BVI] Y [BVI]로 정하기",
            value: 3,
            glsl: "{0} = vec2({1}, {2});"
        },

        {
            type: "label",
            label: "색 변수 정하기:"
        },
        {
            type: "block",
            id: "setColor",
            label: "(V)를 (BVI)로 정하기",
            value: 2,
            glsl: "{0} = {1};"
        },
        {
            type: "block",
            id: "setColorEach",
            label: "(V)를 R [BVI] G [BVI] B [BVI] A [BVI]로 정하기",
            value: 5,
            glsl: "{0} = vec4({1}, {2}, {3}, {4});"
        }
    ],
    draw: [
        {
            type: "block",
            id: "rectangle",
            label: "(V)에 <BVI>~<BVI>의 (BVI) 사각형 그리기",
            value: 4,
            glsl: "{0} = rectMask(texCoord, {1}, {2}, {3}, {0});"
        },
        {
            type: "block",
            id: "circle",
            label: "(V)에 <BVI>~<BVI>의 (BVI) 타원 그리기",
            value: 4,
            glsl: "{0} = ellipseMask(texCoord, {1}, {2}, {3}, {0});"
        }
    ],
    filter: [
        {
            type: "block",
            id: "grayscale",
            label: "(V)에 흑백 적용하기",
            value: 1,
            glsl: `{0} = grayscale({0});`
        },
        {
            type: "block",
            id: "invert",
            label: "(V)에 색 반전 적용하기",
            value: 1,
            glsl: "{0} = vec4( 1 - {0}.rgb, 1.0 );"
        },
        {
            type: "block",
            id: "sepia",
            label: "(V)에 세피아 톤 적용하기",
            value: 1,
            glsl: `{0} = vec4( dot({0}.rgb, vec3(0.393, 0.769, 0.189)), dot({0}.rgb, vec3(0.349, 0.686, 0.168)), dot({0}.rgb, vec3(0.272, 0.534, 0.131)), 1.0);`
        },
        {type: "bar"},
        {
            type: "block",
            id: "lightness",
            label: "(V)에 밝기 [BVI] 적용하기",
            value: 2,
            glsl: "{0} = vec4( {0}.rgb * {1}, 1.0 );"
        },
        {
            type: "block",
            id: "contrast",
            label: "(V)에 대비 [BVI] 적용하기",
            value: 2,
            glsl: "{0} = vec4( ({0}.rgb - 0.5) * {1} + 0.5, 1.0 ); {0} = clamp({0}, 0.0, 1.0);"
        },
        {type: "bar"},
                {
            type: "block",
            id: "mix",
            label: "(V)에 (BVI)를 [BVI]만큼 섞기",
            value: 3,
            glsl: "{0} = mix({0}, {1}, {2});"
        }
    ],
    danger: [
        {
            type: "block",
            id: "GLSL",
            label: "GLSL 코드 [I]",
            value: 1,
            glsl: "{0}"
        }
    ]
};

export const POPOVER_SCHEMES = {
    num: [
        {
            id: "texCoord.x",
            label: "이 픽셀의 X",
            color: "var(--white)",
            bgcolor: "var(--yellow)",
            dark: "var(--yellow-dark)"
        },
        {
            id: "texCoord.y",
            label: "이 픽셀의 Y",
            color: "var(--white)",
            bgcolor: "var(--yellow)",
            dark: "var(--yellow-dark)"
        },
        {
            id: "GameTime",
            label: "게임 시간",
            color: "var(--white)",
            bgcolor: "var(--navy)",
            dark: "var(--navy-dark)"
        },
        {
            id: "value",
            label: "입력값",
            color: "var(--white)",
            bgcolor: "var(--navy)",
            dark: "var(--navy-dark)"
        },
    ],
    pos: [
        {
            id: "texCoord",
            label: "이 픽셀",
            color: "var(--white)",
            bgcolor: "var(--yellow)",
            dark: "var(--yellow-dark)"
        },
        {
            id: "vec2(0.5, 0.5)",
            label: "가운데",
            color: "var(--white)",
            bgcolor: "var(--magenta)",
            dark: "var(--magenta-dark)"
        },
        {
            id: "vec2(0, 1)",
            label: "왼쪽 위",
            color: "var(--white)",
            bgcolor: "var(--purple)",
            dark: "var(--purple-dark)"
        },
        {
            id: "vec2(1, 1)",
            label: "오른쪽 위",
            color: "var(--white)",
            bgcolor: "var(--purple)",
            dark: "var(--purple-dark)"
        },
        {
            id: "vec2(0, 0)",
            label: "왼쪽 아래",
            color: "var(--white)",
            bgcolor: "var(--purple)",
            dark: "var(--purple-dark)"
        },
        {
            id: "vec2(1, 0)",
            label: "오른쪽 아래",
            color: "var(--white)",
            bgcolor: "var(--purple)",
            dark: "var(--purple-dark)"
        }
    ],
    color: [
        {
            id: "vec4(0, 0, 0, 1)",
            label: "검정",
            color: "var(--white)",
            bgcolor: "rgb(0, 0, 0)",
            dark: "var(--gray2)"
        },
        {
            id: "vec4(0.5, 0.5, 0.5, 1)",
            label: "회색",
            color: "var(--white)",
            bgcolor: "rgb(128, 128, 128)",
            dark: "var(--gray2)"
        },
        {
            id: "vec4(0.75, 0.75, 0.75, 1)",
            label: "은색",
            color: "var(--black)",
            bgcolor: "rgb(192, 192, 192)",
            dark: "var(--gray1)"
        },
        {
            id: "vec4(1, 1, 1, 1)",
            label: "하양",
            color: "var(--black)",
            bgcolor: "rgb(255, 255, 255)",
            dark: "var(--gray1)"
        },
        {
            id: "vec4(0.5, 0, 0, 1)",
            label: "암적",
            color: "var(--white)",
            bgcolor: "rgb(128, 0, 0)",
            dark: "var(--red-dark)"
        },
        {
            id: "vec4(1, 0, 0, 1)",
            label: "빨강",
            color: "var(--white)",
            bgcolor: "rgb(255, 0, 0)",
            dark: "var(--red)"
        },
        {
            id: "vec4(0.5, 0, 0.5, 1)",
            label: "보라",
            color: "var(--white)",
            bgcolor: "rgb(128, 0, 128)",
            dark: "var(--purple-dark)"
        },
        {
            id: "vec4(1, 0, 1, 1)",
            label: "자주",
            color: "var(--white)",
            bgcolor: "rgb(255, 0, 255)",
            dark: "var(--purple)"
        },
        {
            id: "vec4(0, 0.5, 0, 1)",
            label: "초록",
            color: "var(--white)",
            bgcolor: "rgb(0, 128, 0)",
            dark: "var(--green-dark)"
        },
        {
            id: "vec4(0, 1, 0, 1)",
            label: "연두",
            color: "var(--black)",
            bgcolor: "rgb(0, 255, 0)",
            dark: "var(--green)"
        },
        {
            id: "vec4(0.5, 0.5, 0, 1)",
            label: "황토",
            color: "var(--white)",
            bgcolor: "rgb(128, 128, 0)",
            dark: "var(--yellow-dark)"
        },
        {
            id: "vec4(1, 1, 0, 1)",
            label: "노랑",
            color: "var(--black)",
            bgcolor: "rgb(255, 255, 0)",
            dark: "var(--yellow)"
        },
        {
            id: "vec4(0, 0, 0.5, 1)",
            label: "남색",
            color: "var(--white)",
            bgcolor: "rgb(0, 0, 128)",
            dark: "var(--navy-dark)"
        },
        {
            id: "vec4(0, 0, 1, 1)",
            label: "파랑",
            color: "var(--white)",
            bgcolor: "rgb(0, 0, 255)",
            dark: "var(--navy)"
        },
        {
            id: "vec4(0, 0.5, 0.5, 1)",
            label: "청록",
            color: "var(--white)",
            bgcolor: "rgb(0, 128, 128)",
            dark: "var(--cyan-dark)"
        },
        {
            id: "vec4(0, 1, 1, 1)",
            label: "바다",
            color: "var(--black)",
            bgcolor: "rgb(0, 255, 255)",
            dark: "var(--cyan)"
        }
    ]
}

export const BASE_TYPES = {
  num: { glsl: "float", size: 1 },
  pos: { glsl: "vec2",  size: 2 },
  color: { glsl: "vec4", size: 4 }
};