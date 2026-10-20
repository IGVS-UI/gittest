// =============================================================================
// hero_mask.js — Efeito máscara com trail fluido (XR / VR Explore)
// -----------------------------------------------------------------------------
// As duas fotos vivem no MESMO canvas. Uma simulação de fluido ping-pong
// desenha um rastro conforme o mouse (ou o dedo) se move, e esse rastro é a
// máscara que revela a camada de baixo através da camada de cima.
//
// A diferença para a versão anterior: as fotos agora são PNGs com fundo
// transparente. Quem desenha o fundo é o próprio shader, e cada camada tem o
// SEU fundo — claro em cima, grafite embaixo. Então a máscara não revela só a
// pessoa com o headset: ela revela um ambiente inteiro por baixo do outro.
//
// Cada camada é montada em 3 níveis de profundidade:
//   CAMADA 1 — linhas de contorno largas, movimento muito lento (fundo)
//   CAMADA 2 — linhas menores, movimento médio          (plano intermediário)
//   CAMADA 3 — a foto, com parallax de mouse             (protagonista)
//
// TODOS OS VALORES DE AJUSTE ESTÃO NO BLOCO "CONFIG" LOGO ABAIXO.
// =============================================================================

// ── CONFIG ────────────────────────────────────────────────────────────────────
// É aqui que se mexe. Nada de caçar número solto no meio do shader.
var CFG = {

    // --- IMAGENS -------------------------------------------------------------
    IMG_TOP:    'assets/pagina__princiapl/img/img_top_semfundo.png',
    IMG_BOTTOM: 'assets/pagina__princiapl/img/img_bottom_semfundo.png',

    // Altura do header fixo. Precisa bater com o margin-top de .hero-section
    // em pt.css — se mudar lá, muda aqui.
    HEADER_H: 80,

    // --- CORES ---------------------------------------------------------------
    // Camada de cima: claro, no tom do fundo original das fotos antigas.
    TOP_BG:      '#efefef',   // cor de base do fundo claro
    TOP_LINE:    '#c4c4c4',   // cor das linhas orgânicas

    // Camada de baixo: versão escura do mesmo ambiente. Grafite, não preto puro
    // — preto puro achata a imagem e mata a sensação de profundidade.
    // Para a direção mais suave (off-white / cinza claro), troque por algo
    // como '#d6d6d9' + linha '#a9a2bd'.
    BOTTOM_BG:   '#17171d',   // grafite
    BOTTOM_LINE: '#6939d2',   // roxo da marca — dá o acento "tech" no escuro

    // --- MÁSCARA -------------------------------------------------------------
    MASK_DECAY:      0.96,   // quanto o rastro demora a sumir (0.90 rápido, 0.99 lento)
    MASK_RADIUS:     0.07,   // espessura do rastro do cursor
    MASK_EDGE_START: 0.01,   // onde a revelação começa
    MASK_EDGE_END:   0.07,   // onde a revelação completa — mais distante = borda mais suave

    // --- PARALLAX ------------------------------------------------------------
    PARALLAX_IMG:   18,   // px que a FOTO desloca com o mouse (camada 3)
    PARALLAX_NEAR:  0.55, // fator da camada 2 em relação à foto
    PARALLAX_FAR:   0.22, // fator da camada 1 — menor = mais longe
    PARALLAX_MOBILE: 0.35,// multiplicador geral do parallax no mobile

    // --- LINHAS (aparência do fundo) ----------------------------------------
    FAR_SCALE:    1.15,  // tamanho das ondas da camada 1 (menor = ondas maiores)
    FAR_DENSITY:  8.0,   // quantidade de linhas
    FAR_SPEED:    0.010, // velocidade da deriva contínua
    FAR_WARP:     0.55,  // o quanto a linha serpenteia
    FAR_OPACITY:  0.42,

    NEAR_SCALE:   1.95,
    NEAR_DENSITY: 11.0,
    NEAR_SPEED:   0.024,
    NEAR_WARP:    0.38,
    NEAR_OPACITY: 0.62,

    LINE_SOFTNESS: 1.6,  // espessura/antialias da linha em px (1.0 fina, 2.5 grossa)

    VIGNETTE: 0.16,      // escurecimento nas bordas — 0 desliga

    // --- ENQUADRAMENTO -------------------------------------------------------
    // 0 = cover  (a foto preenche a tela e sobra corte nas laterais)
    // 1 = contain(a foto inteira aparece e o fundo gerado preenche o resto)
    //
    // Fica em 0 de propósito. Nestas fotos a pessoa ocupa a altura inteira e o
    // torso é cortado na base do arquivo — em contain esse corte reto vira uma
    // linha visível no meio da tela, e no celular a pessoa fica minúscula.
    // Com cover a base do arquivo sai da tela e o enquadramento se mantém em
    // qualquer proporção. Só mexa aqui se trocar por fotos com margem sobrando.
    FIT: 0.0,
};

// ── VERTEX SHADER ─────────────────────────────────────────────────────────────
var vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// ── FLUID SHADER (ping-pong) ──────────────────────────────────────────────────
// Inalterado: desenha o rastro do cursor num render target que se realimenta.
var fluidFragmentShader = `
uniform sampler2D uPrevTrails;
uniform vec2  uMouse;
uniform vec2  uPrevMouse;
uniform float uDecay;
uniform float uRadius;
uniform bool  uIsMoving;
varying vec2 vUv;

void main() {
    float prev = texture2D(uPrevTrails, vUv).r;
    float val  = prev * uDecay;

    if (uIsMoving) {
        vec2 dir = uMouse - uPrevMouse;
        float len = length(dir);
        if (len > 0.0003) {
            // distância do pixel até o SEGMENTO percorrido pelo cursor —
            // é o que evita o rastro sair pontilhado em movimento rápido
            vec2 d = dir / len;
            vec2 toP = vUv - uPrevMouse;
            float proj = clamp(dot(toP, d), 0.0, len);
            float dist = length(vUv - (uPrevMouse + proj * d));
            val += smoothstep(uRadius, 0.0, dist) * 0.4;
        }
    }

    gl_FragColor = vec4(clamp(val, 0.0, 1.0), 0.0, 0.0, 1.0);
}
`;

// ── DISPLAY SHADER ────────────────────────────────────────────────────────────
var displayFragmentShader = `
uniform sampler2D uFluid;
uniform sampler2D uTopTexture;
uniform sampler2D uBottomTexture;
uniform vec2  uResolution;
uniform vec2  uTopTextureSize;
uniform vec2  uBottomTextureSize;
uniform vec2  uRefSize;
uniform float uTime;
uniform float uVelocity;
uniform float uFit;
uniform vec2  uParallax;

uniform vec3 uTopBg;
uniform vec3 uTopLine;
uniform vec3 uBottomBg;
uniform vec3 uBottomLine;

varying vec2 vUv;

// ---------------------------------------------------------------- ruído ------
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i),               hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < OCTAVES; i++) {
        v += a * vnoise(p);
        p *= 2.02;
        a *= 0.5;
    }
    return v;
}

// ------------------------------------------------------- linhas de contorno ---
// Curvas de nível de um campo de ruído. É o que dá o traço orgânico e contínuo
// do fundo original, em vez de "ondinha de seno" que denuncia código.
// O warp de domínio (deslocar p por outro ruído) é o que faz a linha serpentear.
float contourBand(vec2 p, float scale, float density, float drift, float warp) {
    vec2 q = p * scale;
    q.x += drift;
    q += warp * vec2(vnoise(q * 0.5 + 13.0), vnoise(q * 0.5 - 7.0));

    float g = fbm(q) * density;
    // fwidth = largura do passo em pixels -> linha com espessura constante
    // na tela, independente do zoom do campo
    float d = abs(fract(g) - 0.5) / max(fwidth(g), 1e-5);
    return 1.0 - smoothstep(0.0, LINE_SOFTNESS, d);
}

// Monta um ambiente completo: base + camada 1 (longe) + camada 2 (meio).
vec3 buildBackground(vec2 asp, vec3 base, vec3 lineColor, float seed) {
    vec2 far  = asp * PARALLAX_FAR_F  + vec2(seed,       0.0);
    vec2 near = asp * PARALLAX_NEAR_F + vec2(seed + 4.7, 0.0);

    float l1 = contourBand(far,  FAR_SCALE,  FAR_DENSITY,  uTime * FAR_SPEED,  FAR_WARP);
    float l2 = contourBand(near, NEAR_SCALE, NEAR_DENSITY, uTime * NEAR_SPEED, NEAR_WARP);

    vec3 col = base;
    col = mix(col, lineColor, l1 * FAR_OPACITY);
    col = mix(col, lineColor, l2 * NEAR_OPACITY);

    // vinheta: profundidade sem recorrer a blur
    float vig = smoothstep(0.25, 1.05, length(asp));
    col *= 1.0 - vig * VIGNETTE;
    return col;
}

// -------------------------------------------------------- enquadramento ------
// uFit: 0 = cover (preenche a tela, corta as bordas)
//       1 = contain (mostra a foto inteira, o fundo gerado preenche o resto)
// A foto é encaixada dentro de um retângulo de REFERÊNCIA comum às duas, então
// as duas camadas ficam registradas pixel a pixel mesmo se tiverem tamanhos
// diferentes — é isso que impede a pessoa de "pular" quando a máscara passa.
vec2 fitUV(vec2 uv, vec2 texSize) {
    vec2  s  = uResolution / uRefSize;
    float sc = mix(max(s.x, s.y), min(s.x, s.y), uFit);

    vec2 refRect = uRefSize * sc;
    vec2 origin  = (uResolution - refRect) * 0.5 + uParallax;
    vec2 pRef    = uv * uResolution - origin;

    vec2 texRect   = texSize * min(refRect.x / texSize.x, refRect.y / texSize.y);
    vec2 texOrigin = (refRect - texRect) * 0.5;
    return (pRef - texOrigin) / texRect;
}

// 1 dentro da imagem, 0 fora — evita a borda esticar quando o modo é contain
float inBounds(vec2 uv) {
    vec2 b = step(vec2(0.0), uv) * step(uv, vec2(1.0));
    return b.x * b.y;
}

void main() {
    // coordenada corrigida pela proporção: o fundo não estica em tela larga
    vec2 asp = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

    float fluid = texture2D(uFluid, vUv).r;

    // ondulação radial no limiar da máscara: a borda "respira" conforme a
    // velocidade do cursor, em vez de ser um recorte duro
    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
    float wave  = sin(angle * 5.0 - uTime * 2.5) * 0.015 * uVelocity;
    fluid = fluid + wave * fluid * (1.0 - fluid) * 3.0;

    float t = smoothstep(MASK_EDGE_START, MASK_EDGE_END, fluid);

    // --- CAMADA DE CIMA (claro) ---
    vec2  topUV = fitUV(vUv, uTopTextureSize);
    vec4  pTop  = texture2D(uTopTexture, topUV);
    vec3  colTop = buildBackground(asp, uTopBg, uTopLine, 0.0);
    colTop = mix(colTop, pTop.rgb, pTop.a * inBounds(topUV));

    vec3 color = colTop;

    // A camada de baixo só é calculada onde a máscara está de fato passando.
    // Sem este if, o custo do fundo procedural dobraria na tela inteira a cada
    // frame — com ele, a maior parte dos pixels paga só o ambiente claro.
    if (t > 0.001) {
        vec2  botUV = fitUV(vUv, uBottomTextureSize);
        vec4  pBot  = texture2D(uBottomTexture, botUV);
        // seed diferente = o fundo escuro tem o MESMO idioma gráfico, mas não é
        // o mesmo desenho: reforça que é outro ambiente, não um filtro por cima
        vec3  colBot = buildBackground(asp, uBottomBg, uBottomLine, 31.7);
        colBot = mix(colBot, pBot.rgb, pBot.a * inBounds(botUV));

        color = mix(colTop, colBot, t);
    }

    gl_FragColor = vec4(color, 1.0);
}
`;

// ── ESTADO ────────────────────────────────────────────────────────────────────
var targetMouse = { x: 0.5, y: 0.5 };
var smoothMouse = { x: 0.5, y: 0.5 };
var prevMouse   = { x: 0.5, y: 0.5 };
var prevSmooth  = { x: 0.5, y: 0.5 };
var velocity    = 0;
var isMoving    = false;
var lastMove    = 0;
var currentTarget = 0;
var startTime   = null;

var renderer, scene, camera, simScene, simCamera;
var trailsMaterial, displayMaterial;
var pingPong = [];
var refSz, topSz, botSz;

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
var isMobile     = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;

// ── HELPERS ───────────────────────────────────────────────────────────────────
function placeholder() {
    var d = new Uint8Array([0, 0, 0, 0]);
    var t = new THREE.DataTexture(d, 1, 1, THREE.RGBAFormat);
    t.needsUpdate = true;
    return t;
}

var loadedCount = 0;

function loadImg(url, slot, sv) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        sv.set(img.width, img.height);

        var t = new THREE.Texture(img);
        t.minFilter = THREE.LinearFilter;
        t.magFilter = THREE.LinearFilter;
        // ClampToEdge + inBounds() no shader: nada de repetir a borda
        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
        t.needsUpdate = true;

        displayMaterial.uniforms[slot === 'top' ? 'uTopTexture' : 'uBottomTexture'].value = t;

        loadedCount++;
        if (loadedCount === 2) {
            // retângulo de referência = o maior das duas, para alinhá-las
            refSz.set(Math.max(topSz.x, botSz.x), Math.max(topSz.y, botSz.y));
            updateFit();
        }
    };
    img.onerror = function () { console.error('hero_mask: falhou ao carregar', url); };
    img.src = url;
}

function updateFit() {
    displayMaterial.uniforms.uFit.value = CFG.FIT;
}

function hexToVec3(hex) {
    var c = new THREE.Color(hex);
    return new THREE.Vector3(c.r, c.g, c.b);
}

// ── INIT ──────────────────────────────────────────────────────────────────────
function init() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) { console.error('hero_mask: #hero-canvas nao encontrado'); return; }

    var W = window.innerWidth;
    var H = window.innerHeight - CFG.HEADER_H;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    // Teto de pixel ratio: o fundo procedural é caro por pixel, e em telas
    // retina 3x o ganho visual não paga o custo. 1.5 no mobile, 2 no desktop.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(W, H);

    scene     = new THREE.Scene();
    camera    = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    simScene  = new THREE.Scene();
    simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // --- render targets do fluido, com fallback de HalfFloat ---
    var SIM = isMobile ? 256 : 512;
    var fType = THREE.HalfFloatType;

    var testTarget = null;
    try {
        testTarget = new THREE.WebGLRenderTarget(2, 2, {
            type: THREE.HalfFloatType, format: THREE.RGBAFormat
        });
        renderer.setRenderTarget(testTarget);
        renderer.clear();
        renderer.setRenderTarget(null);
    } catch (e) {
        fType = THREE.UnsignedByteType;
        console.warn('hero_mask: HalfFloat nao suportado, usando UnsignedByte');
    }
    if (testTarget) testTarget.dispose();

    var rtOpts = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format:    THREE.RGBAFormat,
        type:      fType
    };

    pingPong = [
        new THREE.WebGLRenderTarget(SIM, SIM, rtOpts),
        new THREE.WebGLRenderTarget(SIM, SIM, rtOpts)
    ];
    renderer.setRenderTarget(pingPong[0]); renderer.clear();
    renderer.setRenderTarget(pingPong[1]); renderer.clear();
    renderer.setRenderTarget(null);

    topSz = new THREE.Vector2(1, 1);
    botSz = new THREE.Vector2(1, 1);
    refSz = new THREE.Vector2(1, 1);

    trailsMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uPrevTrails: { value: placeholder() },
            uMouse:      { value: new THREE.Vector2(0.5, 0.5) },
            uPrevMouse:  { value: new THREE.Vector2(0.5, 0.5) },
            uDecay:      { value: CFG.MASK_DECAY },
            uRadius:     { value: CFG.MASK_RADIUS },
            uIsMoving:   { value: false }
        },
        vertexShader: vertexShader,
        fragmentShader: fluidFragmentShader
    });

    displayMaterial = new THREE.ShaderMaterial({
        // Constantes viram #define: o compilador dobra as contas e o shader
        // fica mais barato do que lendo tudo como uniform.
        defines: {
            OCTAVES:         isMobile ? 2 : 3,
            LINE_SOFTNESS:   CFG.LINE_SOFTNESS.toFixed(2),
            FAR_SCALE:       CFG.FAR_SCALE.toFixed(3),
            FAR_DENSITY:     CFG.FAR_DENSITY.toFixed(2),
            FAR_SPEED:       CFG.FAR_SPEED.toFixed(4),
            FAR_WARP:        CFG.FAR_WARP.toFixed(3),
            FAR_OPACITY:     CFG.FAR_OPACITY.toFixed(3),
            NEAR_SCALE:      CFG.NEAR_SCALE.toFixed(3),
            NEAR_DENSITY:    CFG.NEAR_DENSITY.toFixed(2),
            NEAR_SPEED:      CFG.NEAR_SPEED.toFixed(4),
            NEAR_WARP:       CFG.NEAR_WARP.toFixed(3),
            NEAR_OPACITY:    CFG.NEAR_OPACITY.toFixed(3),
            PARALLAX_FAR_F:  CFG.PARALLAX_FAR.toFixed(3),
            PARALLAX_NEAR_F: CFG.PARALLAX_NEAR.toFixed(3),
            VIGNETTE:        CFG.VIGNETTE.toFixed(3),
            MASK_EDGE_START: CFG.MASK_EDGE_START.toFixed(4),
            MASK_EDGE_END:   CFG.MASK_EDGE_END.toFixed(4)
        },
        // fwidth() precisa de derivadas — no WebGL1 isso é uma extensão
        extensions: { derivatives: true },
        uniforms: {
            uFluid:             { value: placeholder() },
            uTopTexture:        { value: placeholder() },
            uBottomTexture:     { value: placeholder() },
            uResolution:        { value: new THREE.Vector2(W, H) },
            uTopTextureSize:    { value: topSz },
            uBottomTextureSize: { value: botSz },
            uRefSize:           { value: refSz },
            uTime:              { value: 0.0 },
            uVelocity:          { value: 0.0 },
            uFit:               { value: 0.0 },
            uParallax:          { value: new THREE.Vector2(0, 0) },
            uTopBg:             { value: hexToVec3(CFG.TOP_BG) },
            uTopLine:           { value: hexToVec3(CFG.TOP_LINE) },
            uBottomBg:          { value: hexToVec3(CFG.BOTTOM_BG) },
            uBottomLine:        { value: hexToVec3(CFG.BOTTOM_LINE) }
        },
        vertexShader: vertexShader,
        fragmentShader: displayFragmentShader
    });

    var geo = new THREE.PlaneGeometry(2, 2);
    simScene.add(new THREE.Mesh(geo, trailsMaterial));
    scene.add(new THREE.Mesh(geo, displayMaterial));

    loadImg(CFG.IMG_TOP,    'top',    topSz);
    loadImg(CFG.IMG_BOTTOM, 'bottom', botSz);

    window.addEventListener('mousemove', onMove);
    // sem isto o efeito simplesmente não existe no celular
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('resize', onResize);

    updateFit();
    startTime = performance.now();
    animate();
}

// ── EVENTOS ───────────────────────────────────────────────────────────────────
function setPointer(clientX, clientY) {
    var r = renderer.domElement.getBoundingClientRect();
    targetMouse.x = (clientX - r.left) / r.width;
    targetMouse.y = 1 - (clientY - r.top) / r.height;
    isMoving = true;
    lastMove = performance.now();
}

function onMove(e)  { setPointer(e.clientX, e.clientY); }
function onTouch(e) { if (e.touches.length) setPointer(e.touches[0].clientX, e.touches[0].clientY); }

function onResize() {
    var W = window.innerWidth;
    var H = window.innerHeight - CFG.HEADER_H;
    isMobile = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(W, H);
    displayMaterial.uniforms.uResolution.value.set(W, H);
    updateFit();
}

// ── LOOP ──────────────────────────────────────────────────────────────────────
function animate() {
    requestAnimationFrame(animate);

    var now = performance.now();
    if (isMoving && now - lastMove > 80) isMoving = false;

    smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.08;
    smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.08;

    var dx = smoothMouse.x - prevSmooth.x;
    var dy = smoothMouse.y - prevSmooth.y;
    velocity += (Math.min(Math.sqrt(dx * dx + dy * dy) * 500, 1.0) - velocity) * 0.1;
    prevSmooth.x = smoothMouse.x;
    prevSmooth.y = smoothMouse.y;

    // --- fluido (ping-pong) ---
    var prev = pingPong[1 - currentTarget];
    var curr = pingPong[currentTarget];

    trailsMaterial.uniforms.uPrevTrails.value = prev.texture;
    trailsMaterial.uniforms.uMouse.value.set(smoothMouse.x, smoothMouse.y);
    trailsMaterial.uniforms.uPrevMouse.value.set(prevMouse.x, prevMouse.y);
    trailsMaterial.uniforms.uIsMoving.value = isMoving;

    prevMouse.x = smoothMouse.x;
    prevMouse.y = smoothMouse.y;

    renderer.setRenderTarget(curr);
    renderer.render(simScene, simCamera);

    // --- parallax das 3 camadas ---
    // A foto anda mais que o plano do meio, que anda mais que o fundo. A
    // diferença entre as velocidades é o que o olho lê como profundidade.
    var pf = CFG.PARALLAX_IMG * (isMobile ? CFG.PARALLAX_MOBILE : 1);
    displayMaterial.uniforms.uParallax.value.set(
        (smoothMouse.x - 0.5) * pf,
        (smoothMouse.y - 0.5) * pf
    );

    // Com "prefers-reduced-motion" o tempo congela: as linhas param de derivar
    // e a vinheta/parallax somem, mas a MÁSCARA continua funcionando — ela é o
    // conteúdo, não enfeite.
    displayMaterial.uniforms.uTime.value     = reduceMotion.matches ? 0 : (now - startTime) / 1000;
    displayMaterial.uniforms.uVelocity.value = reduceMotion.matches ? 0 : velocity;
    displayMaterial.uniforms.uFluid.value    = curr.texture;

    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    currentTarget = 1 - currentTarget;
}

window.addEventListener('load', init);
