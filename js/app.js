/* ============================================================
 * ARCHIVO: js/app.js
 * DESCRIPCION: Punto de entrada principal de la aplicacion.
 * 
 * COMENTARIO ARQUITECTONICO:
 * Este archivo actua como el "orquestador" o "compositor"
 * de la aplicacion. Su responsabilidad es:
 *   1. Importar (cargar) los modulos necesarios.
 *   2. Inicializar cada modulo en el orden correcto.
 *   3. NO contener logica de negocio propia.
 * 
 * Esto sigue el patron de "Composicion raiz" (Composition Root),
 * donde las dependencias se conectan en un unico lugar.
 * 
 * ESTRUCTURA DE MODULOS:
 * - navigation.js   -> Manejo de la barra de navegacion
 * - codeCanvas.js    -> Renderizado de bloques de codigo
 * - interactions.js  -> Acordeones, tabs, animaciones
 * - diagrams.js      -> Diagramas en Canvas 2D
 * ============================================================ */

/* ----------------------------------------------------------
 * EVENTO: DOMContentLoaded
 * Razon: Esperamos a que todo el DOM este construido antes
 * de inicializar los modulos. Esto garantiza que todos los
 * elementos HTML esten disponibles para ser manipulados.
 * 
 * Nota: No usamos 'load' porque ese evento espera tambien
 * a imagenes y otros recursos, lo cual retrasaria la 
 * interactividad innecesariamente.
 * ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {

    /* --- Paso 1: Inicializar la navegacion --- */
    if (typeof Navigation !== 'undefined') {
        Navigation.init();
    }

    /* --- Paso 2: Inicializar las interacciones (tabs, acordeones) --- */
    if (typeof Interactions !== 'undefined') {
        Interactions.init();
    }

    /* --- Paso 3: Renderizar bloques de codigo de la pagina actual --- */
    if (typeof CodeCanvas !== 'undefined') {
        _initPageCodeBlocks();
    }

    /* --- Paso 4: Renderizar diagramas Canvas de la pagina actual --- */
    if (typeof Diagrams !== 'undefined') {
        _initPageDiagrams();
    }

});

/* ----------------------------------------------------------
 * FUNCION: _initPageCodeBlocks
 * Busca todos los elementos con el atributo data-code-block
 * y renderiza el codigo correspondiente.
 * 
 * CONVENCION: Los bloques de codigo se definen en HTML con:
 *   <div id="code-xxx" 
 *        data-code-block
 *        data-filename="ejemplo.js" 
 *        data-language="javascript">
 *   </div>
 * 
 * El contenido del codigo se almacena opcionalmente en un 
 * elemento <script type="text/plain"> dentro del div.
 * ---------------------------------------------------------- */
function _initPageCodeBlocks() {
    var codeBlocks = document.querySelectorAll('[data-code-block]');

    codeBlocks.forEach(function (block) {
        var id = block.id;
        var filename = block.getAttribute('data-filename') || 'archivo.js';
        var language = block.getAttribute('data-language') || 'javascript';
        
        /* Buscar el codigo dentro de un script type=text/plain */
        var codeSource = block.querySelector('script[type="text/plain"]');
        if (codeSource) {
            var code = codeSource.textContent;
            CodeCanvas.render(id, code, filename, language);
        }
    });
}

/* ----------------------------------------------------------
 * FUNCION: _initPageDiagrams
 * Busca elementos con data-diagram y llama a la funcion
 * de dibujo correspondiente del modulo Diagrams.
 * 
 * CONVENCION:
 *   <canvas id="diagram-xxx" data-diagram="pipeAndFilter"></canvas>
 * ---------------------------------------------------------- */
function _initPageDiagrams() {
    var diagramElements = document.querySelectorAll('[data-diagram]');

    diagramElements.forEach(function (el) {
        var diagramType = el.getAttribute('data-diagram');
        var canvasId = el.id;

        switch (diagramType) {
            case 'pipeAndFilter':
                Diagrams.drawPipeAndFilter(canvasId);
                break;
            case 'dataCentric':
                Diagrams.drawDataCentric(canvasId);
                break;
            case 'callReturn':
                Diagrams.drawCallReturn(canvasId);
                break;
            case 'layered':
                Diagrams.drawLayered(canvasId);
                break;
        }
    });

    /* Redibujar diagramas al redimensionar la ventana */
    var resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            diagramElements.forEach(function (el) {
                var diagramType = el.getAttribute('data-diagram');
                var canvasId = el.id;
                switch (diagramType) {
                    case 'pipeAndFilter': Diagrams.drawPipeAndFilter(canvasId); break;
                    case 'dataCentric': Diagrams.drawDataCentric(canvasId); break;
                    case 'callReturn': Diagrams.drawCallReturn(canvasId); break;
                    case 'layered': Diagrams.drawLayered(canvasId); break;
                }
            });
        }, 250);
    });
}
