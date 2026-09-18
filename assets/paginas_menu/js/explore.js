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
    let horizontalScroll = null;

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

    function createHorizontalDestinationController({ section, viewport, track, progressBar }) {
        const noOpController = { refresh: function () {} };

        if (!section || !viewport || !track || !progressBar) return noOpController;

        const horizontalMedia = window.matchMedia(
            "(min-width: 901px) and (prefers-reduced-motion: no-preference)"
        );
        const progressFill = progressBar.querySelector("span");

        let maxTranslate = 0;
        let currentProgress = 0;
        let animationFrameId = null;

        function clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        }

        function setProgress(progress) {
            currentProgress = clamp(progress, 0, 1);
            const translatedX = -maxTranslate * currentProgress;

            track.style.setProperty("--destination-track-x", `${translatedX.toFixed(2)}px`);
            progressBar.style.setProperty("--destination-progress", currentProgress.toFixed(4));
            progressBar.setAttribute("aria-valuenow", String(Math.round(currentProgress * 100)));

            if (progressFill) {
                progressFill.style.setProperty("--destination-progress", currentProgress.toFixed(4));
            }
        }

        function enhancedScrollIsActive() {
            return document.body.classList.contains("destination-horizontal-enabled");
        }

        function updateFromPageScroll() {
            const scrollRange = Math.max(section.offsetHeight - window.innerHeight, 1);
            const sectionTop = section.getBoundingClientRect().top;
            setProgress(-sectionTop / scrollRange);
        }

        function updateFromNativeScroll() {
            const nativeRange = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
            setProgress(nativeRange ? viewport.scrollLeft / nativeRange : 0);
        }

        function update() {
            animationFrameId = null;

            if (enhancedScrollIsActive()) {
                updateFromPageScroll();
            } else {
                updateFromNativeScroll();
            }
        }

        function requestUpdate() {
            if (animationFrameId !== null) return;
            animationFrameId = window.requestAnimationFrame(update);
        }

        function disableEnhancedScroll() {
            document.body.classList.remove("destination-horizontal-enabled");
            section.style.removeProperty("--destination-scroll-distance");
            track.style.removeProperty("--destination-track-x");
            maxTranslate = 0;
            updateFromNativeScroll();
        }

        function refresh() {
            if (animationFrameId !== null) {
                window.cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }

            const canPinSection = horizontalMedia.matches && track.children.length > 1;
            if (!canPinSection) {
                disableEnhancedScroll();
                return;
            }

            document.body.classList.add("destination-horizontal-enabled");
            viewport.scrollLeft = 0;
            track.style.setProperty("--destination-track-x", "0px");

            maxTranslate = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
            if (!maxTranslate) {
                disableEnhancedScroll();
                return;
            }

            section.style.setProperty("--destination-scroll-distance", `${Math.ceil(maxTranslate)}px`);
            requestUpdate();
        }

        function scrollToProgress(progress) {
            const scrollRange = Math.max(section.offsetHeight - window.innerHeight, 0);
            const sectionTop = window.scrollY + section.getBoundingClientRect().top;

            window.scrollTo({
                top: sectionTop + scrollRange * clamp(progress, 0, 1),
                behavior: "smooth"
            });
        }

        viewport.addEventListener("keydown", (event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

            event.preventDefault();

            if (!enhancedScrollIsActive()) {
                const direction = event.key === "ArrowLeft" || event.key === "Home" ? -1 : 1;
                const destination = event.key === "Home"
                    ? 0
                    : event.key === "End"
                        ? viewport.scrollWidth
                        : viewport.scrollLeft + viewport.clientWidth * 0.78 * direction;

                viewport.scrollTo({ left: destination, behavior: "smooth" });
                return;
            }

            if (event.key === "Home") {
                scrollToProgress(0);
                return;
            }

            if (event.key === "End") {
                scrollToProgress(1);
                return;
            }

            const lastCardIndex = Math.max(track.children.length - 1, 1);
            const activeCardIndex = Math.round(currentProgress * lastCardIndex);
            const direction = event.key === "ArrowRight" ? 1 : -1;
            const nextCardIndex = clamp(activeCardIndex + direction, 0, lastCardIndex);
            scrollToProgress(nextCardIndex / lastCardIndex);
        });

        window.addEventListener("scroll", requestUpdate, { passive: true });
        viewport.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", refresh, { passive: true });

        if (typeof horizontalMedia.addEventListener === "function") {
            horizontalMedia.addEventListener("change", refresh);
        } else {
            horizontalMedia.addListener(refresh);
        }

        if ("ResizeObserver" in window) {
            const resizeObserver = new ResizeObserver(refresh);
            resizeObserver.observe(viewport);
            resizeObserver.observe(track);
        }

        return { refresh };
    }

    function initializeDestinationExplorer() {
        const trackContainer = document.querySelector("#destination-cards");
        const pinWrapper = document.querySelector("#explore-horizontal-pin");
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

        if (!trackContainer || !pinWrapper || !searchInput || !searchStatus || !emptyMessage || !mapViewer ||
            !mapFrame || !mapLoading || !destinationName || !destinationLocation ||
            !destinationDescription || !externalLink || !expandButton || !destinationSection ||
            !horizontalViewport || !horizontalProgress) {
            return;
        }

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const horizontalController = createHorizontalDestinationController({
            section: destinationSection,
            viewport: horizontalViewport,
            track: cardsContainer,
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
if (typeof horizontalScroll !== 'undefined' && horizontalScroll) horizontalScroll.refresh();

if (typeof horizontalController !== 'undefined' && horizontalController && typeof horizontalController.refresh === 'function') {
    window.requestAnimationFrame(function () { horizontalController.refresh(); });
}
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

        horizontalScroll = setupHorizontalScroll(pinWrapper, trackContainer);
    }

    // ==================================================================
    // SCROLL HORIZONTAL DOS DESTINOS (GSAP + ScrollTrigger)
    // ==================================================================
    // Ideia geral: enquanto o usuário rola a página verticalmente, a seção
    // ".explore-horizontal-pin" fica fixa na tela ("pin") e o trilho de
    // cards (".explore-track") é deslocado horizontalmente (translateX) na
    // mesma proporção do scroll ("scrub"). Cada card também recebe um fade
    // suave de entrada/saída (ver updateCardFades) conforme se aproxima das
    // bordas da área visível. Quando o último card passa, a seção se solta
    // e o scroll vertical volta ao normal.
    function setupHorizontalScroll(pinWrapper, track) {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
            return null;
        }

        gsap.registerPlugin(ScrollTrigger);

        let scrollTween = null;

        // Easing usado no fade dos cards (entrada pela direita / saída pela
        // esquerda). "power1.inOut" deixa a transição de opacidade gradual,
        // sem o corte abrupto que dava a sensação de "tela preta" quando um
        // card saía do quadro exatamente na borda do overflow:hidden.
        const fadeEase = gsap.parseEase("power1.inOut");
        const FADE_ZONE_RATIO = 0.18; // 18% da largura visível em cada borda faz o fade

        // Recalcula a opacidade de cada card com base na posição atual dele
        // dentro da área visível (pinWrapper). Cards totalmente visíveis
        // ficam com opacidade 1; ao se aproximarem da borda esquerda/direita
        // (a "FADE_ZONE"), a opacidade cai suavemente até 0.
        function updateCardFades() {
            const wrapperRect = pinWrapper.getBoundingClientRect();
            const fadeZone = wrapperRect.width * FADE_ZONE_RATIO;

            track.querySelectorAll(".destination-card").forEach((card) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2 - wrapperRect.left;

                let opacity = 1;
                if (cardCenter < fadeZone) {
                    opacity = fadeEase(Math.max(cardCenter, 0) / fadeZone);
                } else if (cardCenter > wrapperRect.width - fadeZone) {
                    const distanceFromEdge = wrapperRect.width - cardCenter;
                    opacity = fadeEase(Math.max(distanceFromEdge, 0) / fadeZone);
                }

                card.style.opacity = opacity;
            });
        }

        // Distância horizontal que o trilho precisa percorrer: largura total
        // do conteúdo menos a largura visível da área pinada. Recalculada
        // dinamicamente, então funciona com qualquer quantidade de cards.
        function getHorizontalDistance() {
            return Math.max(track.scrollWidth - pinWrapper.clientWidth, 0);
        }

        function destroyTween() {
            if (!scrollTween) return;
            if (scrollTween.scrollTrigger) scrollTween.scrollTrigger.kill();
            scrollTween.kill();
            scrollTween = null;
            gsap.set(track, { clearProps: "transform" });
            track.querySelectorAll(".destination-card").forEach((card) => {
                card.style.opacity = "";
            });
        }

        function createTween() {
            destroyTween();

            const distance = getHorizontalDistance();
            if (distance <= 0) return;

            scrollTween = gsap.to(track, {
                x: () => -getHorizontalDistance(),
                ease: "none",
                onUpdate: updateCardFades, // recalcula o fade dos cards a cada tick do scrub
                scrollTrigger: {
                    trigger: pinWrapper,      // elemento observado para disparar a animação
                    start: "top top",         // começa quando o topo da seção encosta no topo da viewport
                    end: () => `+=${getHorizontalDistance()}`, // distância de scroll = largura a percorrer
                    pin: true,                 // fixa a seção na tela enquanto dura a animação
                    scrub: 1,                  // acompanha a velocidade do scroll (com suavização de ~1s)
                    invalidateOnRefresh: true, // recalcula "x", "end" e o fade a cada resize/refresh
                    anticipatePin: 1,
                    onRefresh: updateCardFades
                }
            });

            updateCardFades();
        }

        // matchMedia do próprio ScrollTrigger: liga o efeito só em telas
        // maiores e quando o usuário não pediu "prefers-reduced-motion".
        // Em telas pequenas ou com reduced-motion, os cards ficam em scroll
        // vertical normal (ver media query em explore.css).
        const mm = gsap.matchMedia();
        mm.add(
            {
                isDesktop: "(min-width: 701px)",
                reduceMotion: "(prefers-reduced-motion: reduce)"
            },
            (context) => {
                const { isDesktop, reduceMotion } = context.conditions;
                if (isDesktop && !reduceMotion) {
                    createTween();
                } else {
                    destroyTween();
                }
                return () => destroyTween();
            }
        );

        window.addEventListener("resize", () => ScrollTrigger.refresh());

        return {
            // Para ajustar a velocidade do scroll: mude o valor de "scrub" acima
            // (número maior = movimento mais "atrasado"/suave em relação ao mouse;
            // "true" = acompanha o scroll instantaneamente).
            refresh() {
                window.requestAnimationFrame(() => ScrollTrigger.refresh());
            }
        };
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeDestinationExplorer, { once: true });
    } else {
        initializeDestinationExplorer();
    }
}());
