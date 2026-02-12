/* ============================================================
 * MODULO: navigation.js
 * RESPONSABILIDAD: Gestionar la navegacion del sitio.
 * PATRON: Modulo revelador (Revealing Module Pattern).
 * 
 * COMENTARIO ARQUITECTONICO:
 * Este modulo sigue el principio de responsabilidad unica (SRP).
 * Solo se encarga de:
 *   1. Toggle del menu hamburguesa en pantallas pequenas.
 *   2. Resaltar el enlace activo segun la pagina actual.
 *   3. Cerrar el menu al hacer click fuera de el.
 * 
 * No mezcla logica de presentacion con logica de datos,
 * demostrando separacion de responsabilidades.
 * ============================================================ */

const Navigation = (function () {

    /* ----------------------------------------------------------
     * VARIABLES PRIVADAS
     * Encapsuladas dentro del modulo, no accesibles desde fuera.
     * Esto es analogo al concepto de "encapsulamiento" en
     * arquitectura orientada a objetos.
     * ---------------------------------------------------------- */
    let _menuElement = null;
    let _toggleButton = null;
    let _isOpen = false;

    /* ----------------------------------------------------------
     * FUNCION: _init
     * Inicializa los elementos del DOM y asigna listeners.
     * Se ejecuta una sola vez al cargar la pagina.
     * ---------------------------------------------------------- */
    function _init() {
        _menuElement = document.querySelector('.navbar__menu');
        _toggleButton = document.querySelector('.navbar__toggle');

        if (_toggleButton) {
            _toggleButton.addEventListener('click', _toggleMenu);
        }

        /* Inicializar dropdowns de navegacion */
        _initDropdowns();

        /* Cerrar menu al hacer click fuera */
        document.addEventListener('click', function (event) {
            if (_isOpen && 
                !_menuElement.contains(event.target) && 
                !_toggleButton.contains(event.target)) {
                _closeMenu();
            }

            /* Cerrar dropdowns al hacer click fuera */
            var dropdowns = document.querySelectorAll('.navbar__dropdown');
            dropdowns.forEach(function (dd) {
                if (!dd.contains(event.target)) {
                    dd.classList.remove('navbar__dropdown--open');
                }
            });
        });

        _highlightActiveLink();
    }

    /* ----------------------------------------------------------
     * FUNCION: _initDropdowns
     * Inicializa los dropdowns de la barra de navegacion.
     * Permiten agrupar enlaces de un mismo criterio bajo un menu.
     * ---------------------------------------------------------- */
    function _initDropdowns() {
        var triggers = document.querySelectorAll('.navbar__dropdown-trigger');
        triggers.forEach(function (trigger) {
            trigger.addEventListener('click', function (e) {
                e.stopPropagation();
                var dropdown = trigger.closest('.navbar__dropdown');
                var wasOpen = dropdown.classList.contains('navbar__dropdown--open');

                /* Cerrar todos los dropdowns */
                document.querySelectorAll('.navbar__dropdown').forEach(function (dd) {
                    dd.classList.remove('navbar__dropdown--open');
                });

                /* Toggle del clickeado */
                if (!wasOpen) {
                    dropdown.classList.add('navbar__dropdown--open');
                }
            });
        });
    }

    /* ----------------------------------------------------------
     * FUNCION: _toggleMenu
     * Alterna la visibilidad del menu en pantallas moviles.
     * ---------------------------------------------------------- */
    function _toggleMenu() {
        _isOpen = !_isOpen;
        _menuElement.classList.toggle('navbar__menu--open', _isOpen);
        _toggleButton.setAttribute('aria-expanded', _isOpen);
    }

    /* ----------------------------------------------------------
     * FUNCION: _closeMenu
     * Cierra el menu movil.
     * ---------------------------------------------------------- */
    function _closeMenu() {
        _isOpen = false;
        _menuElement.classList.remove('navbar__menu--open');
        if (_toggleButton) {
            _toggleButton.setAttribute('aria-expanded', 'false');
        }
    }

    /* ----------------------------------------------------------
     * FUNCION: _highlightActiveLink
     * Determina la pagina actual y agrega la clase activa al
     * enlace correspondiente en la barra de navegacion.
     * 
     * Nota: Usa window.location.pathname para detectar la 
     * pagina. Este enfoque es sencillo y funcional para
     * arquitecturas de paginas multiples (MPA).
     * ---------------------------------------------------------- */
    function _highlightActiveLink() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.navbar__link');

        links.forEach(function (link) {
            link.classList.remove('navbar__link--active');
            const href = link.getAttribute('href');
            
            if (href && currentPath.endsWith(href.replace('./', ''))) {
                link.classList.add('navbar__link--active');
            }

            /* Caso especial: index o raiz */
            if ((currentPath.endsWith('/') || currentPath.endsWith('index.html')) 
                && (href === './index.html' || href === 'index.html')) {
                link.classList.add('navbar__link--active');
            }
        });
    }

    /* ----------------------------------------------------------
     * INTERFAZ PUBLICA
     * Solo exponemos lo necesario. Todo lo demas queda privado.
     * Este patron demuestra el principio de "ocultamiento de
     * informacion" fundamental en arquitectura de software.
     * ---------------------------------------------------------- */
    return {
        init: _init
    };

})();
