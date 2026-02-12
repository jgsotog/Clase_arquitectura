/* ============================================================
 * MODULO: codeCanvas.js
 * RESPONSABILIDAD: Renderizar bloques de codigo con resaltado
 *                  de sintaxis basico y numeros de linea.
 * 
 * COMENTARIO ARQUITECTONICO:
 * Este modulo actua como un "componente de presentacion".
 * Recibe datos (codigo fuente) y los transforma en HTML 
 * con formato visual. No modifica estado global.
 * 
 * PATRON UTILIZADO: Factory / Generador de componentes.
 * Cada llamada a renderCodeBlock genera un componente
 * HTML independiente, similar a como funcionan los 
 * componentes en frameworks modernos.
 * ============================================================ */

const CodeCanvas = (function () {

    /* ----------------------------------------------------------
     * MAPA DE PALABRAS CLAVE POR LENGUAJE
     * Utilizado para el resaltado de sintaxis basico.
     * En una arquitectura real, este seria un servicio
     * independiente o se usaria una libreria como Prism.js
     * ---------------------------------------------------------- */
    const _keywords = {
        javascript: [
            'const', 'let', 'var', 'function', 'return', 'if', 'else',
            'for', 'while', 'class', 'extends', 'new', 'this', 'import',
            'export', 'from', 'async', 'await', 'try', 'catch', 'throw',
            'switch', 'case', 'break', 'default', 'typeof', 'instanceof'
        ],
        python: [
            'def', 'class', 'return', 'if', 'elif', 'else', 'for',
            'while', 'import', 'from', 'as', 'try', 'except', 'raise',
            'with', 'lambda', 'yield', 'pass', 'True', 'False', 'None',
            'self', 'and', 'or', 'not', 'in', 'is'
        ],
        java: [
            'public', 'private', 'protected', 'static', 'void', 'class',
            'interface', 'extends', 'implements', 'return', 'if', 'else',
            'for', 'while', 'new', 'this', 'super', 'import', 'package',
            'try', 'catch', 'throw', 'throws', 'final', 'abstract',
            'synchronized', 'volatile'
        ]
    };

    const _types = {
        javascript: ['String', 'Number', 'Boolean', 'Array', 'Object', 'Promise', 'Map', 'Set'],
        python: ['str', 'int', 'float', 'list', 'dict', 'tuple', 'set', 'bool'],
        java: ['String', 'int', 'boolean', 'void', 'long', 'double', 'float', 'List', 'Map', 'Set', 'ArrayList', 'HashMap']
    };

    /* ----------------------------------------------------------
     * FUNCION: _escapeHtml
     * Escapa caracteres HTML para evitar inyeccion de codigo.
     * Esto es una practica de seguridad fundamental.
     * ---------------------------------------------------------- */
    function _escapeHtml(text) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    /* ----------------------------------------------------------
     * FUNCION: _highlightSyntax
     * Aplica resaltado de sintaxis basico a una linea de codigo.
     * 
     * Proceso:
     * 1. Escapa HTML para seguridad
     * 2. Resalta comentarios (prioridad alta)
     * 3. Resalta strings
     * 4. Resalta palabras clave del lenguaje
     * 5. Resalta tipos de datos
     * 6. Resalta numeros
     * 7. Resalta decoradores (Python)
     * ---------------------------------------------------------- */
    function _highlightSyntax(code, language) {
        let escaped = _escapeHtml(code);

        /* Comentarios en linea */
        escaped = escaped.replace(
            /(\/\/.*$|#.*$)/gm,
            '<span class="cm">$1</span>'
        );

        /* Strings entre comillas simples y dobles */
        escaped = escaped.replace(
            /(&quot;[^&]*&quot;|&#39;[^&]*&#39;|"[^"]*"|'[^']*')/g,
            '<span class="str">$1</span>'
        );

        /* Palabras clave */
        const kwList = _keywords[language] || _keywords['javascript'];
        kwList.forEach(function (kw) {
            const regex = new RegExp('\\b(' + kw + ')\\b', 'g');
            escaped = escaped.replace(regex, '<span class="kw">$1</span>');
        });

        /* Tipos */
        const typeList = _types[language] || [];
        typeList.forEach(function (tp) {
            const regex = new RegExp('\\b(' + tp + ')\\b', 'g');
            escaped = escaped.replace(regex, '<span class="tp">$1</span>');
        });

        /* Numeros */
        escaped = escaped.replace(
            /\b(\d+)\b/g,
            '<span class="num">$1</span>'
        );

        /* Nombres de funcion */
        escaped = escaped.replace(
            /\b([a-zA-Z_]\w*)\s*(?=\()/g,
            '<span class="fn">$1</span>'
        );

        /* Decoradores Python */
        if (language === 'python') {
            escaped = escaped.replace(
                /(@\w+)/g,
                '<span class="dec">$1</span>'
            );
        }

        return escaped;
    }

    /* ----------------------------------------------------------
     * FUNCION: render
     * Genera el HTML completo de un bloque de codigo con 
     * encabezado de archivo, numeros de linea y resaltado.
     * 
     * PARAMETROS:
     *   containerId: string - ID del elemento contenedor
     *   code: string - Codigo fuente a mostrar
     *   filename: string - Nombre del archivo
     *   language: string - Lenguaje de programacion
     * ---------------------------------------------------------- */
    function render(containerId, code, filename, language) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const lines = code.split('\n');
        const lineNumbers = lines.map(function (_, i) {
            return (i + 1);
        }).join('\n');

        const highlightedCode = lines.map(function (line) {
            return _highlightSyntax(line, language);
        }).join('\n');

        container.innerHTML =
            '<div class="code-canvas">' +
                '<div class="code-canvas__header">' +
                    '<div class="code-canvas__dots">' +
                        '<span class="code-canvas__dot code-canvas__dot--red"></span>' +
                        '<span class="code-canvas__dot code-canvas__dot--yellow"></span>' +
                        '<span class="code-canvas__dot code-canvas__dot--green"></span>' +
                    '</div>' +
                    '<span class="code-canvas__filename">' + filename + '</span>' +
                    '<span class="code-canvas__lang">' + language + '</span>' +
                '</div>' +
                '<div class="code-canvas__body">' +
                    '<div class="code-canvas__lines">' +
                        '<div class="code-canvas__line-numbers"><pre>' + lineNumbers + '</pre></div>' +
                        '<div class="code-canvas__code"><pre>' + highlightedCode + '</pre></div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    /* ----------------------------------------------------------
     * INTERFAZ PUBLICA
     * Exponemos solo la funcion render.
     * ---------------------------------------------------------- */
    return {
        render: render
    };

})();
