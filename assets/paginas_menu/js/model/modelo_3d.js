document.addEventListener("DOMContentLoaded", async () => {
    const vrModel = document.querySelector("#vr-model");
    const loadingMessage = document.querySelector("#vr-loading-message");

    if (!vrModel) {
        console.error("O elemento #vr-model não foi encontrado.");
        return;
    }

    /*
     * Caminho do modelo 3D.
     *
     * Estrutura esperada:
     * paginas_menu/
     * ├── html/
     * │   └── explore.html
     * ├── js/
     * │   └── modelo_3d.js
     * └── models/
     *     └── source/
     *         └── Quest3.glb
     */
    const modelPath = "../models/source/Quest3.glb";

    // Aguarda o componente model-viewer ficar disponível.
    await customElements.whenDefined("model-viewer");

    // Configura a rotação horizontal automática.
    vrModel.setAttribute("auto-rotate", "");
    vrModel.setAttribute("auto-rotate-delay", "0");
    vrModel.setAttribute("rotation-per-second", "20deg");

    // Carrega o arquivo GLB.
    vrModel.src = modelPath;

    // Executado quando o modelo terminar de carregar.
    vrModel.addEventListener("load", () => {
        vrModel.classList.add("model-loaded");

        if (loadingMessage) {
            loadingMessage.classList.add("hidden");
        }

        console.log("Modelo 3D carregado com sucesso.");
    });

    // Executado enquanto o modelo estiver carregando.
    vrModel.addEventListener("progress", (event) => {
        if (!loadingMessage) return;

        const percentage = Math.round(
            event.detail.totalProgress * 100
        );

        loadingMessage.textContent =
            `Carregando modelo 3D... ${percentage}%`;
    });

    // Executado se o arquivo não existir ou ocorrer outro erro.
    vrModel.addEventListener("error", (event) => {
        console.error("Não foi possível carregar o modelo 3D.", event);

        if (loadingMessage) {
            loadingMessage.textContent =
                "O modelo 3D ainda não foi adicionado.";
            loadingMessage.classList.add("error");
        }
    });
});
