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
            image: "../img/rio_de_janeiro.png",
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
            image: "../img/taj_mahal.png",
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
            image: "../img/coliseu.png",
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
            image: "../img/opera_sydney.png",
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
            image: "../img/monte_fuji.png",
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
            image: "../img/machu_pichu.png",
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
            image: "../img/estatua_liberdade.png",
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
            image: "../img/piramides_gize.png",
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
            </button>`;
    }

    function createHorizontalDestinationController({ section, viewport, track, progressBar, counter }) {
        const noOpController = { refresh: function () {} };

    /*gsap code Scroll horizontal*/

    /* ==================================================================
       TRILHO HORIZONTAL DE DESTINOS  (GSAP ScrollTrigger + Lenis)
       ------------------------------------------------------------------
       A secao "#destination-selector" fica presa na tela (pin) enquanto o
       scroll vertical da pagina e convertido em deslocamento horizontal do
       trilho "#destination-cards". A distancia percorrida sai da largura
       real do trilho, entao acrescentar destinos ou filtrar pela busca nao
       exige ajuste manual - basta chamar refresh().

       Fora do modo GSAP (telas estreitas, "prefers-reduced-motion" ou CDN
       fora do ar) o trilho continua utilizavel com o scroll horizontal
       nativo + scroll-snap definidos em explore.css.
    ================================================================== */

    // Mesmos breakpoints do bloco "DESTINOS EM DESTAQUE - TRILHO HORIZONTAL"
    // em responsividade/explore_responsivo.css. Se mudar aqui, mude la.
    const HORIZONTAL_PINNED_QUERY = "(min-width: 901px) and (prefers-reduced-motion: no-preference)";
    const HORIZONTAL_NATIVE_QUERY = "(max-width: 900px), (prefers-reduced-motion: reduce)";

    let smoothScroll = null;

    // Preenchido so no modo nativo (telas estreitas): a viewport do trilho,
    // que ali rola sozinha na horizontal.
    let nativeHorizontalArea = null;

    // O Lenis escuta todo "wheel"/"touchmove" da janela e cancela o gesto
    // assim que ele tem QUALQUER componente vertical - e um deslize de
    // trackpad ou de dedo sobre as cartas quase nunca e 100% horizontal.
    // Resultado: o gesto virava scroll da pagina e o trilho nao saia do
    // lugar. Gestos predominantemente horizontais sobre o trilho nativo
    // ficam com o navegador.
    function shouldLenisHandle({ deltaX, deltaY, event }) {
        if (!nativeHorizontalArea || !nativeHorizontalArea.contains(event.target)) return true;

        return Math.abs(deltaX) <= Math.abs(deltaY);
    }

        let sceneCards = [];
        let horizontalTween = null;
        let cardTweens = [];
        let refreshFrameId = null;
        let activeSceneIndex = -1;

    function scrollWindowTo(position) {
        if (smoothScroll) {
            smoothScroll.scrollTo(position);
            return;
        }

        function enhancedScrollIsActive() {
            return document.body.classList.contains("destination-horizontal-enabled");
        }

        function readNativeProgress() {
            const nativeRange = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
            return nativeRange ? clamp(viewport.scrollLeft / nativeRange, 0, 1) : 0;
        }

        function librariesAreReady() {
            return Boolean(window.gsap && window.ScrollTrigger && window.Lenis);
        }

        function initializeSmoothScroll() {
            if (!librariesAreReady()) return false;

            window.gsap.registerPlugin(window.ScrollTrigger);

            if (!window.vrExploreLenis) {
                const lenis = new window.Lenis({
                    lerp: 0.085,
                    smoothWheel: true,
                    wheelMultiplier: 0.92
                });

                lenis.on("scroll", window.ScrollTrigger.update);
                window.gsap.ticker.add((time) => lenis.raf(time * 1000));
                window.gsap.ticker.lagSmoothing(0);
                window.vrExploreLenis = lenis;
            }

            return true;
        }

        function updateProgress(progress) {
            const normalizedProgress = clamp(progress, 0, 1);
            const cardCount = sceneCards.length;
            const lastCardIndex = Math.max(cardCount - 1, 1);
            const nearestIndex = clamp(
                Math.round(normalizedProgress * lastCardIndex),
                0,
                Math.max(cardCount - 1, 0)
            );

            const activeCard = sceneCards[nearestIndex];
            if (activeCard && nearestIndex !== activeSceneIndex) {
                activeSceneIndex = nearestIndex;
                viewport.dataset.activeLabel = activeCard.dataset.destinationName.toLocaleUpperCase("pt-BR");
                if (counter) {
                    counter.textContent = `${String(nearestIndex + 1).padStart(2, "0")} / ${String(cardCount).padStart(2, "0")}`;
                }
            }

            progressBar.style.setProperty("--destination-progress", normalizedProgress.toFixed(4));
            progressBar.setAttribute("aria-valuenow", String(Math.round(normalizedProgress * 100)));
            if (progressFill) {
                progressFill.style.setProperty("--destination-progress", normalizedProgress.toFixed(4));
            }
        }

        function updateFromNativeScroll() {
            updateProgress(readNativeProgress());
        }

        function killHorizontalAnimation() {
            cardTweens.forEach((tween) => {
                if (tween.scrollTrigger) tween.scrollTrigger.kill();
                tween.kill();
            });
            cardTweens = [];

            if (horizontalTween) {
                if (horizontalTween.scrollTrigger) horizontalTween.scrollTrigger.kill(true);
                horizontalTween.kill();
                horizontalTween = null;
            }

            if (window.gsap) {
                window.gsap.set(track, { clearProps: "transform" });
                if (sceneCards.length) {
                    window.gsap.set(sceneCards, { clearProps: "transform,opacity" });
                }
            }
        }

        function disableEnhancedScroll() {
            killHorizontalAnimation();
            document.body.classList.remove("destination-horizontal-enabled");
            activeSceneIndex = -1;
            updateFromNativeScroll();
        }

        function refresh() {
            killHorizontalAnimation();
            sceneCards = Array.from(track.children);

            const canPinSection = horizontalMedia.matches && sceneCards.length > 1 && initializeSmoothScroll();
            if (!canPinSection) {
                disableEnhancedScroll();
                return;
            }

            document.body.classList.add("destination-horizontal-enabled");
            viewport.scrollLeft = 0;

            const horizontalDistance = () => Math.max(
                track.scrollWidth - viewport.clientWidth,
                window.innerWidth * 0.75
            );

            horizontalTween = window.gsap.to(track, {
                x: () => -horizontalDistance(),
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => `+=${horizontalDistance()}`,
                    pin: true,
                    pinSpacing: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => updateProgress(self.progress),
                    onRefresh: (self) => updateProgress(self.progress)
                }
            });

            sceneCards.forEach((card) => {
                const cardTween = window.gsap.fromTo(card,
                    { y: 38, scale: 0.94, opacity: 0.56 },
                    {
                        y: 0,
                        scale: 1,
                        opacity: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: card,
                            containerAnimation: horizontalTween,
                            start: "left 88%",
                            end: "center center",
                            scrub: true
                        }
                    }
                );
                cardTweens.push(cardTween);
            });

            window.ScrollTrigger.refresh();
        }

        function scrollToProgress(progress) {
            if (!horizontalTween || !horizontalTween.scrollTrigger) return;

            const trigger = horizontalTween.scrollTrigger;
            const destination = trigger.start + (trigger.end - trigger.start) * clamp(progress, 0, 1);

            if (window.vrExploreLenis) {
                window.vrExploreLenis.scrollTo(destination, { duration: 1.05 });
            } else {
                window.scrollTo({ top: destination, behavior: "smooth" });
            }
        }

            activeTrigger = horizontalTween.scrollTrigger;
            activeHorizontalTween = horizontalTween;

            // A viewport e focavel e o aria-label promete navegacao por
            // setas; como aqui ela nao rola sozinha (overflow: hidden),
            // traduzimos cada seta em um passo de scroll vertical.
            function handleArrowKeys(event) {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                if (!activeTrigger) return;

                event.preventDefault();

                const firstCard = track.firstElementChild;
                const step = firstCard ? firstCard.getBoundingClientRect().width : 320;
                const direction = event.key === "ArrowRight" ? 1 : -1;

                scrollWindowTo(Math.min(
                    activeTrigger.end,
                    Math.max(activeTrigger.start, window.scrollY + (direction * step))
                ));
            }

            viewport.addEventListener("keydown", handleArrowKeys);

            // Cleanup do gsap.matchMedia: roda ao cruzar o breakpoint.
            return () => {
                killCardReveals();
                activeTrigger = null;
                activeHorizontalTween = null;
                viewport.removeEventListener("keydown", handleArrowKeys);
                document.body.classList.remove("destination-horizontal-enabled");
                horizontalTween.scrollTrigger?.kill();
                horizontalTween.kill();
                gsapLib.set(track, { clearProps: "transform" });
                setProgress(0);
            };
        });

        media.add(HORIZONTAL_NATIVE_QUERY, () => {
            let wheelLockUntil = 0;

            // Aqui nao ha pin para converter o scroll vertical em horizontal,
            // entao a roda do mouse sobre as cartas so rolava a pagina. Cada
            // "giro" vertical sobre o trilho avanca uma carta; nas pontas o
            // evento segue para a pagina normalmente. O bloqueio curto evita
            // que a rajada de eventos de um trackpad pule varias cartas.
            function handleNativeWheel(event) {
                if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

                const direction = Math.sign(event.deltaY);
                const maxScroll = viewport.scrollWidth - viewport.clientWidth;
                const canMove = direction > 0
                    ? viewport.scrollLeft < maxScroll - 1
                    : viewport.scrollLeft > 1;

                if (!canMove) return;

                event.preventDefault();
                // Impede o Lenis de rolar a pagina com este mesmo evento.
                event.lenisStopPropagation = true;

                const now = performance.now();
                if (now < wheelLockUntil) return;
                wheelLockUntil = now + 450;

                const firstCard = track.firstElementChild;
                const gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;
                const step = firstCard
                    ? firstCard.getBoundingClientRect().width + gap
                    : viewport.clientWidth * 0.8;

                viewport.scrollBy({ left: direction * step });
            }

            const lastCardIndex = Math.max(track.children.length - 1, 1);
            const currentProgress = horizontalTween && horizontalTween.scrollTrigger
                ? horizontalTween.scrollTrigger.progress
                : 0;
            const activeCardIndex = Math.round(currentProgress * lastCardIndex);
            const direction = event.key === "ArrowRight" ? 1 : -1;
            const nextCardIndex = clamp(activeCardIndex + direction, 0, lastCardIndex);
            scrollToProgress(nextCardIndex / lastCardIndex);
        });

        viewport.addEventListener("scroll", updateFromNativeScroll, { passive: true });

        function scheduleRefresh() {
            if (refreshFrameId !== null) window.cancelAnimationFrame(refreshFrameId);
            refreshFrameId = window.requestAnimationFrame(() => {
                refreshFrameId = null;
                refresh();
            });
        }

        window.addEventListener("resize", scheduleRefresh, { passive: true });

        if (typeof horizontalMedia.addEventListener === "function") {
            horizontalMedia.addEventListener("change", scheduleRefresh);
        } else {
            horizontalMedia.addListener(scheduleRefresh);
        }

        if ("ResizeObserver" in window) {
            const resizeObserver = new ResizeObserver(scheduleRefresh);
            resizeObserver.observe(viewport);
            resizeObserver.observe(track);
        }

        // A config() la em cima desligou o auto-refresh do ScrollTrigger no
        // resize de proposito - quem cobre esse caso agora e este listener,
        // com debounce para nao rebobinar/remedir a cada pixel enquanto o
        // usuario ainda esta arrastando a borda da janela (ou girando o
        // celular). scheduleRefresh() ja chama rewindToSectionStart() antes
        // de remedir, que e o que evita a secao pular de lugar.
        let resizeDebounce = null;
        window.addEventListener("resize", () => {
            window.clearTimeout(resizeDebounce);
            resizeDebounce = window.setTimeout(scheduleRefresh, 150);
        });

        return {
            refresh: scheduleRefresh
        };
    }


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
        const sceneCounter = document.querySelector("#destination-scene-counter");

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
            track: cardsContainer,
            progressBar: horizontalProgress,
            counter: sceneCounter
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
            // Com o Lenis ativo o scroll nativo e o suave brigariam pelo
            // mesmo gesto, entao delegamos a ele quando existe.
            if (smoothScroll && !reduceMotion.matches) {
                smoothScroll.scrollTo(mapViewer, { offset: -24 });
                return;
            }

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
