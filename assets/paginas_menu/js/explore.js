(function () {
    "use strict";

    const destinations = Object.freeze([
        {
            id: "coliseu-roma",
            name: "Coliseu",
            city: "Roma",
            country: "Itália",
            category: "História",
            keywords: ["anfiteatro", "romano", "monumento", "roma antiga"],
            description: "Observe de perto a arquitetura do anfiteatro que marcou a história do Império Romano.",
            image: "../img/ai-generated-ancient-colosseum-structure-free-png 1.png",
            imageAlt: "Ilustração do Coliseu de Roma",
            gradient: "radial-gradient(circle at 50% 36%, #8055a7 0%, #30213d 52%, #100d13 100%)",
            embedUrl: "https://www.google.com/maps/embed?pb=!4v1776799049750!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ0VqYzdTRWc.!2m2!1d41.8902101706461!2d12.49223093463763!3f318.7032!4f0!5f0.7820865974627469",
            mapsUrl: "https://www.google.com/maps/search/?api=1&query=Colosseum+Rome+Italy"
        },
        {
            id: "cristo-redentor-rio",
            name: "Cristo Redentor",
            city: "Rio de Janeiro",
            country: "Brasil",
            category: "Arquitetura",
            keywords: ["corcovado", "cristo", "maravilha do mundo", "rio"],
            description: "Contemple o Rio de Janeiro a partir de um de seus cartões-postais mais reconhecidos.",
            image: "../img/pngtree-christ-the-redeemer-png-jesus-christ-statue-in-rio-de-janeiro-png-image_20950810 1.png",
            imageAlt: "Ilustração do Cristo Redentor",
            gradient: "radial-gradient(circle at 50% 34%, #376d82 0%, #182b3d 52%, #0d1117 100%)",
            embedUrl: "https://www.google.com/maps?layer=c&cbll=-22.951916,-43.210487&cbp=11,28,0,0,0&output=svembed",
            mapsUrl: "https://www.google.com/maps/search/?api=1&query=Christ+the+Redeemer+Rio+de+Janeiro+Brazil"
        },
        {
            id: "torre-eiffel-paris",
            name: "Torre Eiffel",
            city: "Paris",
            country: "França",
            category: "Arquitetura",
            keywords: ["eiffel", "torre", "champ de mars", "paris"],
            description: "Passeie pelos arredores do monumento que se tornou símbolo de Paris e da França.",
            image: "../img/eiffel-tower-in-paris-france-close-up-free-png 1.png",
            imageAlt: "Ilustração da Torre Eiffel",
            gradient: "radial-gradient(circle at 50% 34%, #71537d 0%, #2d2336 52%, #100d13 100%)",
            embedUrl: "https://www.google.com/maps/embed?pb=!4v1787590000000!6m8!1m7!1sf-ouK7bxmBzLT9S9-tKCQw!2m2!1d48.858363!2d2.2946418!3f310.66!4f0.35!5f0.7820865974627469",
            mapsUrl: "https://www.google.com/maps/search/?api=1&query=Eiffel+Tower+Paris+France"
        },
        {
            id: "machu-picchu-cusco",
            name: "Machu Picchu",
            city: "Cusco",
            country: "Peru",
            category: "História",
            keywords: ["inca", "andes", "ruínas", "patrimônio mundial"],
            description: "Explore caminhos, terraços e construções da histórica cidadela inca entre as montanhas.",
            // Substitua null por "../img/nome-do-arquivo.png" quando a imagem for adicionada.
            image: null,
            imageAlt: "Vista de Machu Picchu",
            gradient: "linear-gradient(145deg, #5f7441 0%, #283c2e 48%, #121613 100%)",
            embedUrl: "https://www.google.com/maps/embed?pb=!4v1787590000000!6m8!1m7!1smD4ThA4SthLifTAdt0lb4A!2m2!1d-13.1650709!2d-72.5447154!3f329.33!4f-12.19!5f0.7820865974627469",
            mapsUrl: "https://www.google.com/maps/search/?api=1&query=Machu+Picchu+Cusco+Peru"
        },
        {
            id: "times-square-nova-york",
            name: "Times Square",
            city: "Nova York",
            country: "Estados Unidos",
            category: "Cultura",
            keywords: ["manhattan", "broadway", "nova york", "luzes", "cidade"],
            description: "Entre no ritmo de Manhattan em um dos cruzamentos urbanos mais vibrantes do mundo.",
            // Substitua null por "../img/nome-do-arquivo.png" quando a imagem for adicionada.
            image: null,
            imageAlt: "Vista da Times Square",
            gradient: "linear-gradient(145deg, #9b2e81 0%, #31256d 48%, #101023 100%)",
            embedUrl: "https://www.google.com/maps?layer=c&cbll=40.758000,-73.985500&cbp=11,5,0,0,0&output=svembed",
            mapsUrl: "https://www.google.com/maps/search/?api=1&query=Times+Square+New+York+USA"
        },
        {
            id: "cataratas-iguacu-parana",
            name: "Cataratas do Iguaçu",
            city: "Paraná",
            country: "Brasil",
            category: "Natureza",
            keywords: ["cataratas", "iguaçu", "cachoeira", "parque nacional", "foz do iguaçu"],
            description: "Aproxime-se da força das quedas-d'água em uma das paisagens naturais mais impressionantes do Brasil.",
            // Substitua null por "../img/nome-do-arquivo.png" quando a imagem for adicionada.
            image: null,
            imageAlt: "Vista das Cataratas do Iguaçu",
            gradient: "linear-gradient(145deg, #187a73 0%, #244c47 48%, #0d1716 100%)",
            embedUrl: "https://www.google.com/maps?layer=c&cbll=-25.695300,-54.436700&cbp=11,30,0,0,0&output=svembed",
            mapsUrl: "https://www.google.com/maps/search/?api=1&query=Iguazu+Falls+Parana+Brazil"
        }
    ]);

    const destinationGroups = Object.freeze([
        { id: "historical-icons", destinationIds: ["coliseu-roma", "cristo-redentor-rio"] },
        { id: "world-landmarks", destinationIds: ["torre-eiffel-paris", "machu-picchu-cusco"] },
        { id: "city-and-nature", destinationIds: ["times-square-nova-york", "cataratas-iguacu-parana"] }
    ]);

    const destinationById = new Map(destinations.map((destination) => [destination.id, destination]));
    const filterState = { query: "", category: "all" };
    const activeDestinationByGroup = new Map(
        destinationGroups.map((group) => [group.id, group.destinationIds[0]])
    );
    const switchTimers = new Map();
    let selectedDestinationId = destinations[0].id;

    function normalizeSearchText(value) {
        return String(value)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase("pt-BR")
            .trim();
    }

    function destinationMatchesFilters(destination) {
        const matchesCategory = filterState.category === "all" || destination.category === filterState.category;
        if (!matchesCategory) return false;

        if (!filterState.query) return true;

        const searchableText = normalizeSearchText([
            destination.id,
            destination.name,
            destination.city,
            destination.country,
            destination.category,
            ...destination.keywords
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

    function createImageMarkup(destination) {
        if (!destination.image) return createPlaceholderMarkup(destination);

        return `<img src="${destination.image}" alt="${destination.imageAlt}" loading="lazy">`;
    }

    function createCardMarkup(group, groupIndex, destination, visibleDestinations) {
        const isSelected = destination.id === selectedDestinationId;
        const selectionLabel = isSelected ? "PAISAGEM SELECIONADA" : "VER PAISAGEM EM 360°";
        const indicators = visibleDestinations.map((item) => {
            const isActive = item.id === destination.id;
            return `
                <button
                    class="destination-card-dot${isActive ? " is-active" : ""}"
                    type="button"
                    data-destination-switch="${item.id}"
                    data-group-id="${group.id}"
                    aria-label="Exibir ${item.name} neste card"
                    aria-pressed="${isActive}">
                </button>`;
        }).join("");

        return `
            <article
                class="destination-card${isSelected ? " is-selected" : ""}"
                data-group-card="${group.id}"
                data-destination-id="${destination.id}"
                data-destination-name="${destination.name}"
                data-scene-index="${groupIndex}"
                style="--card-gradient: ${destination.gradient};">
                <div class="destination-card-stage">
                    <div class="destination-card-image">
                        <span class="destination-card-number">0${groupIndex + 1}</span>
                        ${createImageMarkup(destination)}
                    </div>
                    <div class="destination-card-copy">
                        <span class="destination-card-category">${destination.category}</span>
                        <strong>${destination.name}</strong>
                        <span class="destination-card-location">${destination.city}, ${destination.country}</span>
                        <p>${destination.description}</p>
                        <button
                            class="destination-select-button"
                            type="button"
                            data-select-destination="${destination.id}"
                            ${isSelected ? "aria-current=\"true\"" : ""}>
                            ${selectionLabel}
                        </button>
                    </div>
                </div>
                <div class="destination-card-controls" role="group" aria-label="Paisagens do card ${groupIndex + 1}">
                    ${indicators}
                </div>
            </article>`;
    }

    function createHorizontalDestinationController({ section, viewport, track, progressBar, counter }) {
        const noOpController = { refresh: function () {} };

        if (!section || !viewport || !track || !progressBar) return noOpController;

        const horizontalMedia = window.matchMedia(
            "(min-width: 901px) and (prefers-reduced-motion: no-preference)"
        );
        const progressFill = progressBar.querySelector("span");

        let targetProgress = 0;
        let renderedProgress = 0;
        let sceneCards = [];
        let animationFrameId = null;
        let activeSceneIndex = -1;

        function clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        }

        function easeOutCubic(value) {
            return 1 - Math.pow(1 - value, 3);
        }

        function enhancedScrollIsActive() {
            return document.body.classList.contains("destination-horizontal-enabled");
        }

        function readPageProgress() {
            const scrollRange = Math.max(section.offsetHeight - window.innerHeight, 1);
            const sectionTop = section.getBoundingClientRect().top;
            return clamp(-sectionTop / scrollRange, 0, 1);
        }

        function readNativeProgress() {
            const nativeRange = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
            return nativeRange ? clamp(viewport.scrollLeft / nativeRange, 0, 1) : 0;
        }

        function clearCardSceneStyles() {
            sceneCards.forEach((card) => {
                card.style.removeProperty("--scene-x");
                card.style.removeProperty("--scene-y");
                card.style.removeProperty("--scene-scale");
                card.style.removeProperty("--scene-rotate");
                card.style.removeProperty("--scene-opacity");
                card.style.removeProperty("--scene-blur");
                card.style.removeProperty("--image-shift-x");
                card.style.removeProperty("--image-shift-y");
                card.style.removeProperty("--copy-shift-x");
                card.style.removeProperty("z-index");
                card.classList.remove("is-scene-active");
                card.removeAttribute("inert");
                card.removeAttribute("aria-hidden");
            });
        }

        function applyScene(progress) {
            const cardCount = sceneCards.length;
            const lastCardIndex = Math.max(cardCount - 1, 1);
            const scenePosition = progress * lastCardIndex;
            const nearestIndex = clamp(Math.round(scenePosition), 0, Math.max(cardCount - 1, 0));
            const stageWidth = Math.max(viewport.clientWidth, window.innerWidth);

            sceneCards.forEach((card, index) => {
                const distance = index - scenePosition;
                const absoluteDistance = Math.abs(distance);
                const curvedDistance = Math.sign(distance) * easeOutCubic(Math.min(absoluteDistance, 1));
                const extendedDistance = absoluteDistance > 1
                    ? Math.sign(distance) * (absoluteDistance - 1) * 0.55
                    : 0;
                const x = (curvedDistance + extendedDistance) * stageWidth * 0.58;
                const y = Math.min(absoluteDistance, 1.7) * 34 + Math.sin((scenePosition + index) * 1.35) * 9;
                const scale = clamp(1 - absoluteDistance * 0.16, 0.68, 1);
                const rotate = clamp(distance * 4.5, -8, 8);
                const opacity = clamp(1 - Math.max(absoluteDistance - 0.08, 0) * 0.43, 0, 1);
                const blur = clamp((absoluteDistance - 0.72) * 3.2, 0, 4);
                const isActive = index === nearestIndex;
                const isOutsideScene = absoluteDistance > 1.72;

                card.style.setProperty("--scene-x", `${x.toFixed(2)}px`);
                card.style.setProperty("--scene-y", `${y.toFixed(2)}px`);
                card.style.setProperty("--scene-scale", scale.toFixed(4));
                card.style.setProperty("--scene-rotate", `${rotate.toFixed(2)}deg`);
                card.style.setProperty("--scene-opacity", opacity.toFixed(4));
                card.style.setProperty("--scene-blur", `${blur.toFixed(2)}px`);
                card.style.setProperty("--image-shift-x", `${clamp(-distance * 46, -68, 68).toFixed(2)}px`);
                card.style.setProperty("--image-shift-y", `${(Math.sin((scenePosition + index) * 1.7) * 8).toFixed(2)}px`);
                card.style.setProperty("--copy-shift-x", `${clamp(distance * 26, -36, 36).toFixed(2)}px`);
                card.style.zIndex = String(1000 - Math.round(absoluteDistance * 100));
                card.classList.toggle("is-scene-active", isActive);
                card.toggleAttribute("inert", !isActive);
                card.setAttribute("aria-hidden", String(isOutsideScene));
            });

            const activeCard = sceneCards[nearestIndex];
            if (activeCard && nearestIndex !== activeSceneIndex) {
                activeSceneIndex = nearestIndex;
                viewport.dataset.activeLabel = activeCard.dataset.destinationName.toLocaleUpperCase("pt-BR");
                if (counter) {
                    counter.textContent = `${String(nearestIndex + 1).padStart(2, "0")} / ${String(cardCount).padStart(2, "0")}`;
                }
            }

            progressBar.style.setProperty("--destination-progress", progress.toFixed(4));
            progressBar.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
            if (progressFill) progressFill.style.setProperty("--destination-progress", progress.toFixed(4));
        }

        function renderFrame() {
            animationFrameId = null;

            if (enhancedScrollIsActive()) {
                targetProgress = readPageProgress();
                renderedProgress += (targetProgress - renderedProgress) * 0.12;
                if (Math.abs(targetProgress - renderedProgress) < 0.0005) {
                    renderedProgress = targetProgress;
                }
                applyScene(renderedProgress);
            } else {
                targetProgress = readNativeProgress();
                renderedProgress = targetProgress;
                const nativeIndex = sceneCards.length
                    ? clamp(Math.round(renderedProgress * (sceneCards.length - 1)), 0, sceneCards.length - 1)
                    : 0;
                progressBar.style.setProperty("--destination-progress", renderedProgress.toFixed(4));
                progressBar.setAttribute("aria-valuenow", String(Math.round(renderedProgress * 100)));
                if (progressFill) progressFill.style.setProperty("--destination-progress", renderedProgress.toFixed(4));
                if (counter && sceneCards.length) {
                    counter.textContent = `${String(nativeIndex + 1).padStart(2, "0")} / ${String(sceneCards.length).padStart(2, "0")}`;
                }
            }

            if (Math.abs(targetProgress - renderedProgress) >= 0.0005) requestUpdate();
        }

        function requestUpdate() {
            if (animationFrameId !== null) return;
            animationFrameId = window.requestAnimationFrame(renderFrame);
        }

        function disableEnhancedScroll() {
            document.body.classList.remove("destination-horizontal-enabled");
            section.style.removeProperty("--destination-scroll-distance");
            clearCardSceneStyles();
            activeSceneIndex = -1;
            targetProgress = readNativeProgress();
            renderedProgress = targetProgress;
            progressBar.style.setProperty("--destination-progress", renderedProgress.toFixed(4));
            progressBar.setAttribute("aria-valuenow", String(Math.round(renderedProgress * 100)));
            if (counter && sceneCards.length) {
                const nativeIndex = clamp(Math.round(renderedProgress * (sceneCards.length - 1)), 0, sceneCards.length - 1);
                counter.textContent = `${String(nativeIndex + 1).padStart(2, "0")} / ${String(sceneCards.length).padStart(2, "0")}`;
            }
        }

        function refresh() {
            if (animationFrameId !== null) {
                window.cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }

            clearCardSceneStyles();
            sceneCards = Array.from(track.children);

            const canPinSection = horizontalMedia.matches && sceneCards.length > 1;
            if (!canPinSection) {
                disableEnhancedScroll();
                return;
            }

            document.body.classList.add("destination-horizontal-enabled");
            viewport.scrollLeft = 0;
            const scrollDistance = window.innerHeight * Math.max(sceneCards.length - 1, 1) * 0.95;
            section.style.setProperty("--destination-scroll-distance", `${Math.ceil(scrollDistance)}px`);
            targetProgress = readPageProgress();
            renderedProgress = targetProgress;
            applyScene(renderedProgress);
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
            const activeCardIndex = Math.round(renderedProgress * lastCardIndex);
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
        const cardsContainer = document.querySelector("#destination-cards");
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
        const sceneCounter = document.querySelector("#destination-scene-counter");

        if (!cardsContainer || !searchInput || !searchStatus || !emptyMessage || !mapViewer ||
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
            progressBar: horizontalProgress,
            counter: sceneCounter
        });

        function renderDestinationGroups() {
            const matchedDestinations = destinations.filter(destinationMatchesFilters);
            const markup = destinationGroups.map((group, groupIndex) => {
                const visibleDestinations = group.destinationIds
                    .map((id) => destinationById.get(id))
                    .filter((destination) => destination && destinationMatchesFilters(destination));

                if (!visibleDestinations.length) return "";

                let activeId = activeDestinationByGroup.get(group.id);
                if (!visibleDestinations.some((destination) => destination.id === activeId)) {
                    activeId = visibleDestinations[0].id;
                    activeDestinationByGroup.set(group.id, activeId);
                }

                return createCardMarkup(
                    group,
                    groupIndex,
                    destinationById.get(activeId),
                    visibleDestinations
                );
            }).join("");

            cardsContainer.innerHTML = markup;
            emptyMessage.hidden = matchedDestinations.length !== 0;
            searchStatus.textContent = filterState.query
                ? `${matchedDestinations.length} ${matchedDestinations.length === 1 ? "destino encontrado" : "destinos encontrados"}`
                : `${destinations.length} destinos disponíveis`;

            cardsContainer.querySelectorAll(".destination-card-image img").forEach((image) => {
                image.addEventListener("error", () => {
                    const destination = destinationById.get(image.closest("[data-destination-id]")?.dataset.destinationId);
                    if (destination) image.replaceWith(createPlaceholderElement(destination));
                }, { once: true });
            });

            window.requestAnimationFrame(horizontalController.refresh);
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

            renderDestinationGroups();
            window.requestAnimationFrame(scrollToViewer);
        }

        function switchCardDestination(groupId, destinationId) {
            const group = destinationGroups.find((item) => item.id === groupId);
            if (!group || !group.destinationIds.includes(destinationId)) return;
            if (activeDestinationByGroup.get(groupId) === destinationId) return;

            const card = cardsContainer.querySelector(`[data-group-card="${groupId}"]`);
            const previousTimer = switchTimers.get(groupId);
            if (previousTimer) window.clearTimeout(previousTimer);

            if (reduceMotion.matches || !card) {
                activeDestinationByGroup.set(groupId, destinationId);
                renderDestinationGroups();
                return;
            }

            card.classList.add("is-changing");
            const timer = window.setTimeout(() => {
                activeDestinationByGroup.set(groupId, destinationId);
                switchTimers.delete(groupId);
                renderDestinationGroups();
            }, 180);
            switchTimers.set(groupId, timer);
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

        cardsContainer.addEventListener("click", (event) => {
            const switchButton = event.target.closest("[data-destination-switch]");
            if (switchButton) {
                switchCardDestination(switchButton.dataset.groupId, switchButton.dataset.destinationSwitch);
                return;
            }

            const selectButton = event.target.closest("[data-select-destination]");
            if (selectButton) selectDestination(selectButton.dataset.selectDestination);
        });

        searchInput.addEventListener("input", () => {
            filterState.query = normalizeSearchText(searchInput.value);
            renderDestinationGroups();
        });

        mapFrame.addEventListener("load", () => setMapLoading(false));
        expandButton.addEventListener("click", toggleFullscreen);
        document.addEventListener("fullscreenchange", syncFullscreenButton);
        document.addEventListener("webkitfullscreenchange", syncFullscreenButton);

        setMapLoading(true);
        renderDestinationGroups();
        syncFullscreenButton();
        mapFrame.src = destinations[0].embedUrl;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeDestinationExplorer, { once: true });
    } else {
        initializeDestinationExplorer();
    }
}());
