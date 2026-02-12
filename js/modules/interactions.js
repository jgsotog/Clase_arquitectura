/* ============================================================
 * MODULO: interactions.js
 * RESPONSABILIDAD: Gestionar las interacciones del usuario
 *                  como acordeones, tabs y animaciones de scroll.
 * 
 * COMENTARIO ARQUITECTONICO:
 * Este modulo complementa la capa de presentacion.
 * Maneja exclusivamente la interactividad del DOM, sin
 * logica de negocio. En una arquitectura MVC, este modulo
 * perteneceria a la capa del Controlador (Controller).
 * ============================================================ */

const Interactions = (function () {

    /* ----------------------------------------------------------
     * FUNCION: initAccordions
     * Inicializa todos los componentes tipo acordeon.
     * 
     * COMPORTAMIENTO:
     * - Al hacer click en un trigger, se expande/colapsa
     *   el contenido asociado.
     * - Solo un item puede estar abierto a la vez dentro
     *   del mismo acordeon (comportamiento exclusivo).
     * ---------------------------------------------------------- */
    function initAccordions() {
        const accordions = document.querySelectorAll('.accordion');

        accordions.forEach(function (accordion) {
            const triggers = accordion.querySelectorAll('.accordion__trigger');

            triggers.forEach(function (trigger) {
                trigger.addEventListener('click', function () {
                    const item = trigger.closest('.accordion__item');
                    const isOpen = item.classList.contains('accordion__item--open');

                    /* Cerrar todos los items del mismo acordeon */
                    accordion.querySelectorAll('.accordion__item').forEach(function (i) {
                        i.classList.remove('accordion__item--open');
                    });

                    /* Si no estaba abierto, abrirlo */
                    if (!isOpen) {
                        item.classList.add('accordion__item--open');
                    }
                });
            });
        });
    }

    /* ----------------------------------------------------------
     * FUNCION: initTabs
     * Inicializa los componentes de pestanas (tabs).
     * 
     * COMPORTAMIENTO:
     * - Al hacer click en un boton de tab, se muestra el
     *   panel correspondiente y se ocultan los demas.
     * - El atributo data-tab vincula boton con panel.
     * ---------------------------------------------------------- */
    function initTabs() {
        const tabContainers = document.querySelectorAll('.tabs');

        tabContainers.forEach(function (container) {
            const buttons = container.querySelectorAll('.tabs__button');
            const panels = container.querySelectorAll('.tabs__panel');

            buttons.forEach(function (button) {
                button.addEventListener('click', function () {
                    const targetTab = button.getAttribute('data-tab');

                    /* Desactivar todos */
                    buttons.forEach(function (b) {
                        b.classList.remove('tabs__button--active');
                    });
                    panels.forEach(function (p) {
                        p.classList.remove('tabs__panel--active');
                    });

                    /* Activar el seleccionado */
                    button.classList.add('tabs__button--active');
                    const targetPanel = container.querySelector(
                        '[data-tab-panel="' + targetTab + '"]'
                    );
                    if (targetPanel) {
                        targetPanel.classList.add('tabs__panel--active');
                    }
                });
            });
        });
    }

    /* ----------------------------------------------------------
     * FUNCION: initScrollAnimations
     * Aplica animaciones de entrada a elementos cuando  
     * entran en el viewport del usuario.
     * 
     * TECNOLOGIA: Intersection Observer API
     * Razon: Es mas eficiente que escuchar el evento scroll,
     * ya que el navegador optimiza internamente la deteccion.
     * ---------------------------------------------------------- */
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            elements.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            /* Fallback: mostrar todo sin animacion */
            elements.forEach(function (el) {
                el.classList.add('animate-in');
            });
        }
    }

    /* ----------------------------------------------------------
     * FUNCION: init
     * Punto de entrada. Inicializa todos los sub-componentes.
     * ---------------------------------------------------------- */
    function init() {
        initAccordions();
        initTabs();
        initScrollAnimations();
    }

    /* INTERFAZ PUBLICA */
    return {
        init: init
    };

})();
