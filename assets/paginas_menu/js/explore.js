(function () {
    "use strict";

    // Ordem e dados definidos a partir do design do Figma do projeto (seção ".map-explore").
    // Para adicionar um novo destino no futuro: basta incluir um novo objeto neste array,
    // com uma imagem quadrada (~608x608px) em "image". O trilho horizontal (GSAP ScrollTrigger)
    // recalcula automaticamente a largura total e a distância de scroll — nenhum outro ajuste
    // de código é necessário além de fornecer a imagem.
    const destinations = Object.freeze([
        {
            id: "cristo-redentor-rio",
            name: "Cristo Redentor",
            city: "Rio de Janeiro",
            country: "Brasil",
            description: "Contemple o Rio de Janeiro a partir de um de seus cartões-postais mais reconhecidos.",
            image: "../img/pngtree-christ-the-redeemer-png-jesus-christ-statue-in-rio-de-janeiro-png-image_20950810 1.png",
            imageAlt: "Ilustração do Cristo Redentor",
            embedUrl: "https://www.google.com/maps?layer=c&cbll=-22.951916,-43.210487&cbp=11,28,0,0,0&output=svembed",
            mapsUrl: "https://www.google.com/maps/search/?api=1&query=Christ+the+Redeemer+Rio+de+Janeiro+Brazil"
        },
        {
            id: "taj-mahal-agra",
            name: "Taj Mahal",
            city: "Angra",
            country: "Índia",
            description: "Admire a simetria e os detalhes em mármore de um dos maiores símbolos de amor do mundo.",
            // Substitua null por "../img/nome-do-arquivo.png" quando a imagem for adicionada.
            image: null,
            imageAlt: "Vista do Taj Mahal",
            embedUrl: "https://www.google.com/maps?q=Taj+Mahal,+Agra,+India&output=embed",
            mapsUrl: "https://www.google.com/maps/search/?api=1&query=Taj+Mahal+Agra+India"
        },
        {
            id: "coliseu-roma",
            name: "Coliseu",
            city: "Roma",
            country: "Itália",
            description: "Observe de perto a arquitetura do anfiteatro que marcou a história do Império Romano.",
            image: "../img/ai-generated-ancient-colosseum-structure-free-png 1.png",
            imageAlt: "Ilustração do Coliseu de Roma",
            embedUrl: "https://www.google.com/maps/embed?pb=!4v1776799049750!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ0VqYzdTRWc.!2m2!1d41.8902101706461!2d12.49223093463763!3f318.7032!4f0!5f0.7820865974627469",
            mapsUrl: "https://www.google.com/maps/search/?api=1&query=Colosseum+Rome+Italy"
        },
        {
            id: "opera-sydney",
            name: "Ópera de Sydney",
            city: "Sydney",
            country: "Austrália",
            description: "Aprecie as conchas brancas que se tornaram o símbolo arquitetônico da Austrália.",
            // Substitua null por "../img/nome-do-arquivo.png" quando a imagem for adicionada.
            image: null,
            imageAlt: "Vista da Ópera de Sydney",
            embedUrl: "https://www.google.com/maps?q=Sydney+Opera+House,+Sydney,+Australia&output=embed",
            mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sydney+Opera+House+Australia"
        },
        {
            id: "monte-fuji-japao",
            name: "Monte Fuji",
            city: "Honshu",
            country: "Japão",
            description: "Contemple o vulcão mais alto do Japão, cercado por lagos e vilarejos tradicionais.",
            // Substitua null por "../img/nome-do-arquivo.png" quando a imagem for adicionada.
            image: null,
            imageAlt: "Vista do Monte Fuji",
            embedUrl: "https://www.google.com/maps?q=Mount+Fuji,+Japan&output=embed",
            mapsUrl: "https://www.google.com/maps/search/?api=1&query=Mount+Fuji+Japan"
        },
        {
            id: "machu-picchu-cusco",
            name: "Machu Pichu",
            city: "Cusco",
            country: "Peru",
            description: "Explore caminhos, terraços e construções da histórica cidadela inca entre as montanhas.",
            // Substitua null por "../img/nome-do-arquivo.png" quando a imagem for adicionada.
            image: null,
            imageAlt: "Vista de Machu Picchu",
            embedUrl: "https://www.google.com/maps/embed?pb=!4v1787590000000!6m8!1m7!1smD4ThA4SthLifTAdt0lb4A!2m2!1d-13.1650709!2d-72.5447154!3f329.33!4f-12.19!5f0.7820865974627469",
            mapsUrl: "https://www.google.com/maps/search/?api=1&query=Machu+Picchu+Cusco+Peru"
        },
        {
            id: "estatua-liberdade-ny",
            name: "Estátua da Liberdade",
            city: "Nova York",
            country: "Estados Unidos",
            description: "Conheça o monumento que recebe visitantes na baía de Nova York há mais de um século.",
            // Substitua null por "../img/nome-do-arquivo.png" quando a imagem for adicionada.
            image: null,
            imageAlt: "Vista da Estátua da Liberdade",
            embedUrl: "https://www.google.com/maps?q=Statue+of+Liberty,+New+York&output=embed",
            mapsUrl: "https://www.google.com/maps/search/?api=1&query=Statue+of+Liberty+New+York"
        },
        {
            id: "piramides-gize",
            name: "Pirâmides de Gizé",
            city: "Gizé",
            country: "Egito",
            description: "Viaje até o planalto de Gizé e conheça de perto as últimas maravilhas do mundo antigo.",
            // Substitua null por "../img/nome-do-arquivo.png" quando a imagem for adicionada.
            image: null,
            imageAlt: "Vista das Pirâmides de Gizé",
            embedUrl: "https://www.google.com/maps?q=Pyramids+of+Giza,+Egypt&output=embed",
            mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pyramids+of+Giza+Egypt"
        }
    ]);

    const destinationById = new Map(destinations.map((destination) => [destination.id, destination]));
    const filterState = { query: "" };
    let selectedDestinationId = destinations[0].id;

    function normalizeSearchText(value) {
        return String(value)
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .toLocaleLowerCase("pt-BR")
            .trim();
    }

    function destinationMatchesFilters(destination) {
        if (!filterState.query) return true;

        const searchableText = normalizeSearchText([
            destination.id,
            destination.name,
            destination.city,
            destination.country
        ].join(" "));

        return searchableText.includes(filterState.query);
    }

    function createPlaceholderMarkup(destination) {
        return `
            <div class="destination-card-placeholder" aria-label="Imagem temporária de ${destination.name}">
                <svg aria-hidden="true" viewBox="0 0 64 64" focusable="false">
                    <path d="M32 57s18-16.6 18-34A18 18 0 0 0 14 23c0 17.4 18 34 18 34Z"></path>
                    <circle cx="32" cy="23" r="6"></circle>
                </svg>
                <span>${destination.city}</span>
            </div>`;
    }

    function createMediaMarkup(destination) {
        if (!destination.image) return createPlaceholderMarkup(destination);

        return `<img src="${destination.image}" alt="${destination.imageAlt}" loading="lazy">`;
    }

    function createCardMarkup(destination) {
        const isSelected = destination.id === selectedDestinationId;

        return `
            <button
                type="button"
                class="destination-card${isSelected ? " is-selected" : ""}"
                data-destination-id="${destination.id}"
                data-select-destination="${destination.id}"
                aria-label="Ver ${destination.name}, ${destination.city}, em 360°"
                ${isSelected ? "aria-current=\"true\"" : ""}>
                <div class="destination-card-media">
                    ${createMediaMarkup(destination)}
                    <div class="destination-card-overlay">
                        <span class="destination-card-name">${destination.name}</span>
                        <span class="destination-card-place">${destination.city}, ${destination.country}</span>
                    </div>
                </div>
            </button>`;
    }


    /*gsap code Scroll horizontal*/

    function initializeDestinationExplorer() {
        const trackContainer = document.querySelector("#destination-cards");
        const searchInput = document.querySelector("#destination-search-input");
        const searchStatus = document.querySelector("#destination-search-status");
        const emptyMessage = document.querySelector("#destination-empty");
        const mapViewer = document.querySelector("#map-viewer");
        const mapFrame = document.querySelector("#map-frame");
        const mapLoading = document.querySelector("#map-loading");
        const destinationName = document.querySelector("#map-destination-name");
        const destinationLocation = document.querySelector("#map-destination-location");
        const destinationDescription = document.querySelector("#map-destination-description");
        const externalLink = document.querySelector("#map-external-link");
        const expandButton = document.querySelector("#map-expand-button");
        const destinationSection = document.querySelector("#destination-selector");
        const horizontalViewport = document.querySelector("#destination-horizontal-viewport");
        const horizontalProgress = document.querySelector("#destination-horizontal-progress");

        if (!trackContainer || !searchInput || !searchStatus || !emptyMessage || !mapViewer ||
            !mapFrame || !mapLoading || !destinationName || !destinationLocation ||
            !destinationDescription || !externalLink || !expandButton || !destinationSection ||
            !horizontalViewport || !horizontalProgress) {
            return;
        }

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const horizontalController = createHorizontalDestinationController({
            section: destinationSection,
            viewport: horizontalViewport,
            track: trackContainer,
            progressBar: horizontalProgress
        });

        function renderDestinationCards() {
            const matchedDestinations = destinations.filter(destinationMatchesFilters);
            trackContainer.innerHTML = matchedDestinations.map(createCardMarkup).join("");

            emptyMessage.hidden = matchedDestinations.length !== 0;
            searchStatus.textContent = filterState.query
                ? `${matchedDestinations.length} ${matchedDestinations.length === 1 ? "destino encontrado" : "destinos encontrados"}`
                : `${destinations.length} destinos disponíveis`;

            trackContainer.querySelectorAll(".destination-card-media img").forEach((image) => {
                image.addEventListener("error", () => {
                    const destination = destinationById.get(image.closest("[data-destination-id]")?.dataset.destinationId);
                    if (destination) {
                        const overlay = image.nextElementSibling;
                        image.replaceWith(createPlaceholderElement(destination));
                        if (overlay) image.closest(".destination-card-media")?.appendChild(overlay);
                    }
                }, { once: true });
            });

// O conteúdo do trilho mudou (busca filtrou cards): recalcula a distância do scroll horizontal.
window.requestAnimationFrame(() => horizontalController.refresh());
        }

        function createPlaceholderElement(destination) {
            const template = document.createElement("template");
            template.innerHTML = createPlaceholderMarkup(destination).trim();
            return template.content.firstElementChild;
        }

        function setMapLoading(isLoading) {
            mapViewer.classList.toggle("is-loading", isLoading);
            mapLoading.setAttribute("aria-hidden", String(!isLoading));
        }

        function scrollToViewer() {
            mapViewer.scrollIntoView({
                behavior: reduceMotion.matches ? "auto" : "smooth",
                block: "start"
            });
        }

        function selectDestination(destinationId) {
            const destination = destinationById.get(destinationId);
            if (!destination) return;

            const hasChanged = selectedDestinationId !== destination.id;
            selectedDestinationId = destination.id;
            destinationName.textContent = destination.name;
            destinationLocation.textContent = `${destination.city}, ${destination.country}`;
            destinationDescription.textContent = destination.description;
            externalLink.href = destination.mapsUrl;
            mapFrame.title = `Paisagem 360° de ${destination.name}, em ${destination.city}, ${destination.country}`;

            if (hasChanged || mapFrame.src !== destination.embedUrl) {
                setMapLoading(true);
                mapFrame.src = destination.embedUrl;
            }

            renderDestinationCards();
            window.requestAnimationFrame(scrollToViewer);
        }

        function getFullscreenElement() {
            return document.fullscreenElement || document.webkitFullscreenElement;
        }

        function syncFullscreenButton() {
            const isFullscreen = getFullscreenElement() === mapViewer;
            expandButton.setAttribute(
                "aria-label",
                isFullscreen ? "Sair da tela cheia" : "Expandir mapa em tela cheia"
            );
            expandButton.classList.toggle("is-fullscreen", isFullscreen);
        }

        async function toggleFullscreen() {
            try {
                if (getFullscreenElement()) {
                    const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen;
                    if (exitFullscreen) await exitFullscreen.call(document);
                    return;
                }

                const requestFullscreen = mapViewer.requestFullscreen || mapViewer.webkitRequestFullscreen;
                if (requestFullscreen) await requestFullscreen.call(mapViewer);
            } catch (_error) {
                expandButton.setAttribute("aria-label", "Tela cheia indisponível neste navegador");
            }
        }

        trackContainer.addEventListener("click", (event) => {
            const selectButton = event.target.closest("[data-select-destination]");
            if (selectButton) selectDestination(selectButton.dataset.selectDestination);
        });

        searchInput.addEventListener("input", () => {
            filterState.query = normalizeSearchText(searchInput.value);
            renderDestinationCards();
        });

        mapFrame.addEventListener("load", () => setMapLoading(false));
        expandButton.addEventListener("click", toggleFullscreen);
        document.addEventListener("fullscreenchange", syncFullscreenButton);
        document.addEventListener("webkitfullscreenchange", syncFullscreenButton);

        setMapLoading(true);
        renderDestinationCards();
        syncFullscreenButton();
        mapFrame.src = destinations[0].embedUrl;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeDestinationExplorer, { once: true });
    } else {
        initializeDestinationExplorer();
    }
}());
