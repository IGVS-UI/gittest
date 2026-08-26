document.addEventListener("DOMContentLoaded", () => {
    setupVrFocus();
    setupGameTabs();
    setupReflexGame();
});

function setupVrFocus() {
    const model = document.querySelector("#vr-headset-model");
    const buttons = Array.from(document.querySelectorAll("[data-vr-focus]"));

    if (!model || !buttons.length) {
        return;
    }

    const cameraPositions = {
        lentes: {
            orbit: "0deg 78deg 62%",
            fieldOfView: "27deg"
        },
        sensores: {
            orbit: "0deg 68deg 58%",
            fieldOfView: "24deg"
        },
        audio: {
            orbit: "72deg 75deg 60%",
            fieldOfView: "26deg"
        },
        processamento: {
            orbit: "180deg 76deg 76%",
            fieldOfView: "31deg"
        }
    };

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const focusName = button.dataset.vrFocus;
            const camera = cameraPositions[focusName];

            if (!camera) {
                return;
            }

            buttons.forEach((item) => {
                const isCurrent = item === button;
                item.classList.toggle("is-active", isCurrent);
                item.setAttribute("aria-pressed", String(isCurrent));
            });

            model.removeAttribute("auto-rotate");
            model.setAttribute("camera-orbit", camera.orbit);
            model.setAttribute("field-of-view", camera.fieldOfView);
        });
    });
}

function setupGameTabs() {
    const tabs = Array.from(document.querySelectorAll("[data-game]"));
    const panels = Array.from(document.querySelectorAll("[data-panel]"));

    if (!tabs.length || !panels.length) {
        return;
    }

    const activateGame = (gameName, moveFocus = false) => {
        tabs.forEach((tab) => {
            const isActive = tab.dataset.game === gameName;
            tab.classList.toggle("is-active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
            tab.tabIndex = isActive ? 0 : -1;

            if (isActive && moveFocus) {
                tab.focus();
            }
        });

        panels.forEach((panel) => {
            const isActive = panel.dataset.panel === gameName;
            panel.hidden = !isActive;
            panel.classList.toggle("is-active", isActive);

            if (isActive) {
                loadExternalGame(panel);
            }
        });
    };

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => activateGame(tab.dataset.game));

        tab.addEventListener("keydown", (event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
                return;
            }

            event.preventDefault();
            const direction = event.key === "ArrowRight" ? 1 : -1;
            const nextIndex = (index + direction + tabs.length) % tabs.length;
            activateGame(tabs[nextIndex].dataset.game, true);
        });
    });
}

function loadExternalGame(panel) {
    const container = panel.querySelector("[data-external-game]");
    const iframe = container?.querySelector("iframe[data-src]");

    if (!container || !iframe || iframe.src) {
        return;
    }

    iframe.addEventListener("load", () => {
        container.classList.add("is-loaded");
    }, { once: true });

    iframe.src = iframe.dataset.src;
}

function setupReflexGame() {
    const target = document.querySelector("#reflex-target");
    const message = document.querySelector("#reflex-message");
    const lastOutput = document.querySelector("#last-reaction");
    const bestOutput = document.querySelector("#best-reaction");

    if (!target || !message || !lastOutput || !bestOutput) {
        return;
    }

    const storageKey = "vrExploreBestReaction";
    let state = "idle";
    let readyAt = 0;
    let waitingTimer = null;
    let bestReaction = readBestReaction(storageKey);

    if (bestReaction !== null) {
        bestOutput.textContent = `${bestReaction} ms`;
    }

    const setMessage = (html) => {
        message.innerHTML = html;
    };

    const setVisualState = (nextState) => {
        target.classList.toggle("is-waiting", nextState === "waiting");
        target.classList.toggle("is-ready", nextState === "ready");
        target.classList.toggle("is-result", nextState === "result");
    };

    const startRound = () => {
        window.clearTimeout(waitingTimer);
        state = "waiting";
        setVisualState(state);
        setMessage("AGUARDE O<br>ALVO FICAR VERDE");
        target.setAttribute("aria-label", "Aguarde o alvo ficar verde");

        const delay = 1600 + Math.random() * 2800;
        waitingTimer = window.setTimeout(() => {
            state = "ready";
            readyAt = performance.now();
            setVisualState(state);
            setMessage("CLIQUE<br>AGORA!");
            target.setAttribute("aria-label", "Clique agora");
        }, delay);
    };

    const showEarlyClick = () => {
        window.clearTimeout(waitingTimer);
        state = "result";
        setVisualState(state);
        setMessage("MUITO CEDO!<br>TENTE NOVAMENTE");
        target.setAttribute("aria-label", "Muito cedo. Clique para tentar novamente");
    };

    const showResult = () => {
        const reaction = Math.max(1, Math.round(performance.now() - readyAt));
        state = "result";
        setVisualState(state);
        setMessage(`${reaction} ms<br><small>JOGAR NOVAMENTE</small>`);
        target.setAttribute("aria-label", `Resultado: ${reaction} milissegundos. Clique para jogar novamente`);
        lastOutput.textContent = `${reaction} ms`;

        if (bestReaction === null || reaction < bestReaction) {
            bestReaction = reaction;
            bestOutput.textContent = `${reaction} ms`;
            saveBestReaction(storageKey, reaction);
        }
    };

    target.addEventListener("click", () => {
        if (state === "idle" || state === "result") {
            startRound();
            return;
        }

        if (state === "waiting") {
            showEarlyClick();
            return;
        }

        if (state === "ready") {
            showResult();
        }
    });
}

function readBestReaction(storageKey) {
    try {
        const value = Number.parseInt(localStorage.getItem(storageKey), 10);
        return Number.isFinite(value) ? value : null;
    } catch (error) {
        return null;
    }
}

function saveBestReaction(storageKey, value) {
    try {
        localStorage.setItem(storageKey, String(value));
    } catch (error) {
        // O jogo continua funcionando mesmo quando o navegador bloqueia o armazenamento local.
    }
}
