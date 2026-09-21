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

    // Mesmos breakpoints do bloco "DESTINOS - SCROLL VERTICAL CONVERTIDO EM
    // HORIZONTAL" em explore.css. Se mudar aqui, mude la.
    const HORIZONTAL_PINNED_QUERY = "(min-width: 901px) and (prefers-reduced-motion: no-preference)";
    const HORIZONTAL_NATIVE_QUERY = "(max-width: 900px), (prefers-reduced-motion: reduce)";

    let smoothScroll = null;

    // O Lenis da inercia ao scroll vertical. Como o trilho horizontal e
    // "scrubbado" por esse mesmo scroll, os dois precisam andar no mesmo
    // relogio - por isso o Lenis e alimentado pelo ticker do GSAP em vez de
    // um requestAnimationFrame proprio.
    function setupSmoothScroll() {
        if (smoothScroll) return smoothScroll;
        if (!window.Lenis || !window.gsap || !window.ScrollTrigger) return null;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

        smoothScroll = new window.Lenis();
        smoothScroll.on("scroll", window.ScrollTrigger.update);
        window.gsap.ticker.add((time) => smoothScroll.raf(time * 1000));
        window.gsap.ticker.lagSmoothing(0);

        return smoothScroll;
    }

    function scrollWindowTo(position) {
        if (smoothScroll) {
            smoothScroll.scrollTo(position);
            return;
        }

        window.scrollTo({ top: position, behavior: "smooth" });
    }

    function createHorizontalDestinationController({ section, viewport, track, progressBar }) {
        function setProgress(value) {
            const clamped = Math.min(1, Math.max(0, value || 0));
            progressBar.style.setProperty("--destination-progress", clamped.toFixed(4));
            progressBar.setAttribute("aria-valuenow", String(Math.round(clamped * 100)));
        }

        // Espaco util da viewport, ja descontado o respiro lateral: e contra
        // ele que medimos o quanto o trilho ainda tem a percorrer.
        function getViewportInnerWidth() {
            const styles = window.getComputedStyle(viewport);

            return viewport.clientWidth
                - parseFloat(styles.paddingLeft)
                - parseFloat(styles.paddingRight);
        }

        function getHorizontalDistance() {
            return Math.max(0, track.scrollWidth - getViewportInnerWidth());
        }

        // A secao sangra para a largura da tela. Usar 100vw para isso conta a
        // barra de rolagem junto e sobra alguns pixels para fora da area
        // visivel dos dois lados - o bastante para cortar a primeira e a
        // ultima carta. Medimos a largura de fato visivel e entregamos ao CSS.
        function syncBleedWidth() {
            viewport.style.setProperty(
                "--destination-bleed",
                document.documentElement.clientWidth + "px"
            );
        }

        function syncNativeProgress() {
            const maxScroll = viewport.scrollWidth - viewport.clientWidth;
            setProgress(maxScroll > 0 ? viewport.scrollLeft / maxScroll : 0);
        }

        const gsapLib = window.gsap;
        const scrollTriggerLib = window.ScrollTrigger;

        // Sem as libs o trilho nao deixa de funcionar: o CSS ja entrega
        // scroll horizontal nativo, so falta manter a barra em dia.
        if (!gsapLib || !scrollTriggerLib) {
            syncBleedWidth();
            window.addEventListener("resize", syncBleedWidth);
            viewport.addEventListener("scroll", syncNativeProgress, { passive: true });
            syncNativeProgress();

            return {
                refresh() {
                    syncBleedWidth();
                    syncNativeProgress();
                }
            };
        }

        gsapLib.registerPlugin(scrollTriggerLib);
        setupSmoothScroll();

        // "refreshInit" roda antes de cada medicao do ScrollTrigger, inclusive
        // as automaticas de resize: garante que a sangria ja esta certa quando
        // a distancia do trilho for calculada.
        syncBleedWidth();
        scrollTriggerLib.addEventListener("refreshInit", syncBleedWidth);

        const media = gsapLib.matchMedia();

        // Preenchido so enquanto o modo preso esta valendo; serve de sinal de
        // "o GSAP esta no comando" para refresh().
        let activeTrigger = null;
        let activeHorizontalTween = null;
        let cardReveals = [];
        let pendingRefresh = 0;
        let lastTrackWidth = 0;

        /* ----------------------------------------------------------------
           SURGIMENTO DAS CARTAS
           ----------------------------------------------------------------
           Cada carta entra pela direita levemente encolhida, transparente e
           deslocada para a esquerda - ou seja, sobreposta a carta anterior -
           e vai assentando na propria vaga conforme atravessa a tela.

           O gatilho usa "containerAnimation": em vez de um tempo proprio, ele
           le a posicao HORIZONTAL da carta dentro do trilho. Isso e o que faz
           a animacao andar junto com o dedo do usuario, para frente e para
           tras, e ficar interrompivel no meio - se fosse um timeline solto a
           carta continuaria animando depois que o scroll parasse.

           Mexe so em transform e opacity (nada de layout), com transformOrigin
           explicito para o scale nao puxar a carta para um canto. */
        const CARD_REVEAL = Object.freeze({
            opacity: 0.2,
            scale: 0.92,
            x: -52,
            transformOrigin: "center center",
            ease: "power2.out"
        });

        function killCardReveals() {
            cardReveals.forEach((tween) => {
                tween.scrollTrigger?.kill();
                tween.kill();
            });
            cardReveals = [];
            gsapLib.set(track.children, { clearProps: "opacity,transform" });
        }

        // O render recria as cartas por innerHTML, entao os gatilhos antigos
        // ficam apontando para nos que sairam do documento: reconstruir e a
        // unica saida, nao da para so atualizar.
        function buildCardReveals() {
            killCardReveals();
            if (!activeHorizontalTween) return;

            Array.prototype.forEach.call(track.children, (card) => {
                cardReveals.push(gsapLib.from(card, {
                    ...CARD_REVEAL,
                    scrollTrigger: {
                        trigger: card,
                        containerAnimation: activeHorizontalTween,
                        // Da borda direita da tela ate 60% da travessia: a
                        // carta chega ja assentada bem antes do centro.
                        start: "left right",
                        end: "left 60%",
                        scrub: true
                    }
                }));
            });
        }

        // Filtrar a busca muda o tamanho do trilho, e a busca fica dentro do
        // painel preso. Remedir com a pagina parada no meio de um pin que
        // acabou de encolher tem dois efeitos ruins: a secao se solta e a
        // pagina pula para o rodape, e o ScrollTrigger mede a secao enquanto
        // ela ainda esta "fixed" e crava um start errado. Voltar para o
        // inicio da secao ANTES de remedir resolve os dois - e ainda mostra
        // o resultado filtrado desde a primeira carta.
        function rewindToSectionStart() {
            if (!activeTrigger) return;

            // Medimos a secao agora em vez de confiar em activeTrigger.start:
            // o valor guardado envelhece quando o layout mexeu depois da
            // ultima medicao (modelo 3D que carrega, fonte que troca). Com o
            // pin ativo, quem ocupa o lugar da secao no fluxo e o pin-spacer.
            const holder = section.parentElement
                && section.parentElement.classList.contains("pin-spacer")
                ? section.parentElement
                : section;

            const sectionStart = Math.max(
                0,
                Math.round(holder.getBoundingClientRect().top + window.scrollY)
            );

            if (window.scrollY <= sectionStart) return;

            // O scroll nativo vale na hora - e e isso que o ScrollTrigger le
            // ao remedir em seguida. O Lenis recebe a mesma posicao para nao
            // puxar a pagina de volta no tick seguinte.
            window.scrollTo(0, sectionStart);

            if (smoothScroll) {
                smoothScroll.scrollTo(sectionStart, { immediate: true, force: true });
            }
        }

        media.add(HORIZONTAL_PINNED_QUERY, () => {
            // A classe destrava o layout preso em explore.css e so entra
            // quando o GSAP assumiu mesmo o controle do trilho.
            document.body.classList.add("destination-horizontal-enabled");

            const horizontalTween = gsapLib.to(track, {
                x: () => -getHorizontalDistance(),
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    // O minimo de 1px evita um pin de comprimento zero quando
                    // a busca deixa poucas cartas e nao ha trilho a percorrer.
                    end: () => "+=" + Math.max(1, getHorizontalDistance()),
                    pin: section,
                    pinSpacing: true,
                    anticipatePin: 1,
                    // scrub travado no scroll (true), nao com atraso (1): com
                    // atraso o trilho ainda estava correndo quando a secao
                    // soltava o pin no fim, e as ultimas cartas deslizavam com
                    // a secao ja subindo. O Lenis ja da a suavidade.
                    scrub: true,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => setProgress(self.progress),
                    onRefresh: (self) => setProgress(self.progress)
                }
            });

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
            viewport.addEventListener("scroll", syncNativeProgress, { passive: true });
            syncNativeProgress();

            return () => viewport.removeEventListener("scroll", syncNativeProgress);
        });

        // invalidateOnRefresh remede a distancia do pin sozinho; no modo
        // estreito quem cuida da barra e o scroll nativo da viewport.
        function applyRefresh() {
            scrollTriggerLib.refresh();

            if (!activeTrigger) syncNativeProgress();
        }

        return {
            // ScrollTrigger.refresh() remede a pagina inteira e a busca chama
            // um render por tecla digitada, entao no maximo um refresh por
            // quadro - as demais chamadas caem no mesmo agendamento.
            refresh() {
                if (pendingRefresh) return;

                pendingRefresh = window.requestAnimationFrame(() => {
                    pendingRefresh = 0;

                    // Vem antes da checagem de largura de proposito: escolher
                    // um destino nao muda a geometria, mas recria as cartas,
                    // e sem isto os gatilhos ficariam orfaos e o surgimento
                    // pararia de acontecer depois do primeiro clique.
                    buildCardReveals();

                    // Escolher um destino re-renderiza o trilho, mas so troca
                    // classes: a geometria fica identica. Remedir ali seria
                    // trabalho jogado fora - e pior, cairia bem no caso em que
                    // a secao esta presa, que e quando o ScrollTrigger mede a
                    // secao ainda "fixed" e crava um start errado. Sem mudanca
                    // de tamanho, nao ha nada para remedir.
                    const trackWidth = track.scrollWidth;
                    if (trackWidth === lastTrackWidth) return;

                    lastTrackWidth = trackWidth;

                    rewindToSectionStart();
                    applyRefresh();
                });
            }
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
