/* ============================================================
 * MODULO: diagrams.js
 * RESPONSABILIDAD: Dibujar diagramas arquitectonicos usando 
 *                  el elemento HTML5 Canvas.
 * 
 * COMENTARIO ARQUITECTONICO:
 * Este modulo demuestra el uso de Canvas 2D para crear
 * representaciones visuales de patrones arquitectonicos.
 * Cada funcion de dibujo es independiente, siguiendo el
 * principio de alta cohesion: cada funcion hace una 
 * sola cosa bien.
 * ============================================================ */

const Diagrams = (function () {

    /* ----------------------------------------------------------
     * UTILIDADES DE DIBUJO
     * Funciones auxiliares para elementos comunes en diagramas.
     * ---------------------------------------------------------- */

    /**
     * Dibuja un rectangulo redondeado con efecto hundido
     */
    function _drawBox(ctx, x, y, w, h, color, label, borderColor) {
        /* Fondo */
        ctx.fillStyle = color;
        ctx.strokeStyle = borderColor || '#1c1c50';
        ctx.lineWidth = 1.5;

        _roundRect(ctx, x, y, w, h, 8);
        ctx.fill();
        ctx.stroke();

        /* Efecto hundido superior */
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#000';
        _roundRect(ctx, x + 1, y + 1, w - 2, 6, 8);
        ctx.fill();
        ctx.restore();

        /* Texto */
        if (label) {
            ctx.fillStyle = '#dde0ff';
            ctx.font = '13px "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, x + w / 2, y + h / 2);
        }
    }

    /**
     * Dibuja una flecha entre dos puntos
     */
    function _drawArrow(ctx, fromX, fromY, toX, toY, color) {
        const headLen = 8;
        const angle = Math.atan2(toY - fromY, toX - fromX);

        ctx.beginPath();
        ctx.strokeStyle = color || '#00d4ff';
        ctx.lineWidth = 1.5;
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        /* Punta de flecha */
        ctx.beginPath();
        ctx.fillStyle = color || '#00d4ff';
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headLen * Math.cos(angle - Math.PI / 6),
            toY - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            toX - headLen * Math.cos(angle + Math.PI / 6),
            toY - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Dibuja un rectangulo con esquinas redondeadas
     */
    function _roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    /**
     * Agrega etiqueta debajo de una flecha
     */
    function _drawLabel(ctx, x, y, text, color) {
        ctx.fillStyle = color || '#5a5e80';
        ctx.font = '11px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(text, x, y);
    }

    /* ----------------------------------------------------------
     * DIAGRAMA: Tuberia y Filtros (Pipe and Filter)
     * Muestra el flujo: Entrada -> Filtro1 -> Filtro2 -> ... -> Salida
     * ---------------------------------------------------------- */
    function drawPipeAndFilter(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = 250 * dpr;
        canvas.style.height = '250px';

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        const w = canvas.offsetWidth;

        /* Titulo */
        ctx.fillStyle = '#5a5e80';
        ctx.font = '11px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PATRON: TUBERIA Y FILTROS', w / 2, 20);

        const boxW = 110;
        const boxH = 50;
        const y = 80;
        const gap = 40;
        const totalW = 4 * boxW + 3 * gap;
        const startX = (w - totalW) / 2;

        const stages = [
            { label: 'Fuente de Datos', color: '#0f2a3d', border: '#00d4ff' },
            { label: 'Filtro A', color: '#1a1040', border: '#7c3aed' },
            { label: 'Filtro B', color: '#1a1040', border: '#7c3aed' },
            { label: 'Salida', color: '#0d2a1a', border: '#00ff88' }
        ];

        stages.forEach(function (stage, i) {
            const x = startX + i * (boxW + gap);
            _drawBox(ctx, x, y, boxW, boxH, stage.color, stage.label, stage.border);

            if (i < stages.length - 1) {
                const arrowStart = x + boxW + 4;
                const arrowEnd = x + boxW + gap - 4;
                _drawArrow(ctx, arrowStart, y + boxH / 2, arrowEnd, y + boxH / 2, '#00d4ff');
                _drawLabel(ctx, arrowStart + (arrowEnd - arrowStart) / 2, y + boxH / 2 + 10, 'Tuberia', '#5a5e80');
            }
        });

        /* Etiquetas descriptivas */
        ctx.fillStyle = '#8b8fb5';
        ctx.font = '12px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Los datos fluyen unidireccionalmente a traves de cada filtro de transformacion', w / 2, 170);
        ctx.fillText('Cada filtro procesa y transforma los datos de forma independiente', w / 2, 190);
    }

    /* ----------------------------------------------------------
     * DIAGRAMA: Repositorio / Centrado en Datos
     * Muestra multiples componentes conectados a un repositorio central
     * ---------------------------------------------------------- */
    function drawDataCentric(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = 300 * dpr;
        canvas.style.height = '300px';

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        const w = canvas.offsetWidth;
        const centerX = w / 2;
        const centerY = 140;

        /* Titulo */
        ctx.fillStyle = '#5a5e80';
        ctx.font = '11px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PATRON: REPOSITORIO CENTRALIZADO', centerX, 20);

        /* Repositorio central */
        const repoW = 140;
        const repoH = 55;
        _drawBox(ctx, centerX - repoW / 2, centerY - repoH / 2, repoW, repoH, '#1a0f30', 'Repositorio', '#7c3aed');

        /* Componentes alrededor */
        const components = [
            { label: 'Componente A', angle: -90 },
            { label: 'Componente B', angle: -30 },
            { label: 'Componente C', angle: 30 },
            { label: 'Componente D', angle: 150 },
            { label: 'Componente E', angle: 210 }
        ];

        const radius = 120;
        const compW = 100;
        const compH = 40;

        components.forEach(function (comp) {
            const rad = comp.angle * Math.PI / 180;
            const cx = centerX + Math.cos(rad) * radius;
            const cy = centerY + Math.sin(rad) * radius;

            _drawBox(ctx, cx - compW / 2, cy - compH / 2, compW, compH, '#0f2a3d', comp.label, '#00d4ff');
            
            /* Flechas bidireccionales */
            const dx = centerX - cx;
            const dy = centerY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const nx = dx / dist;
            const ny = dy / dist;

            _drawArrow(ctx,
                cx + nx * (compW / 2 + 5),
                cy + ny * (compH / 2 + 5),
                centerX - nx * (repoW / 2 + 5),
                centerY - ny * (repoH / 2 + 5),
                '#7c3aed'
            );
        });

        ctx.fillStyle = '#8b8fb5';
        ctx.font = '12px "Segoe UI", sans-serif';
        ctx.fillText('Todos los componentes acceden y modifican un almacen de datos compartido', centerX, 280);
    }

    /* ----------------------------------------------------------
     * DIAGRAMA: Llamada y Retorno (Cliente-Servidor)
     * ---------------------------------------------------------- */
    function drawCallReturn(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = 260 * dpr;
        canvas.style.height = '260px';

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        const w = canvas.offsetWidth;

        ctx.fillStyle = '#5a5e80';
        ctx.font = '11px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PATRON: LLAMADA Y RETORNO (CLIENTE-SERVIDOR)', w / 2, 20);

        /* Main program */
        const mainW = 150;
        const mainH = 50;
        const mainX = w / 2 - mainW / 2;
        const mainY = 45;

        _drawBox(ctx, mainX, mainY, mainW, mainH, '#1a1040', 'Programa Principal', '#7c3aed');

        /* Sub-rutinas */
        const subs = ['Subrutina A', 'Subrutina B', 'Subrutina C'];
        const subW = 120;
        const subH = 45;
        const subY = 140;
        const totalSubW = subs.length * subW + (subs.length - 1) * 30;
        const subStartX = w / 2 - totalSubW / 2;

        subs.forEach(function (label, i) {
            const sx = subStartX + i * (subW + 30);
            _drawBox(ctx, sx, subY, subW, subH, '#0f2a3d', label, '#00d4ff');

            /* Flecha de llamada (hacia abajo) */
            _drawArrow(ctx,
                mainX + mainW / 2 + (i - 1) * 20,
                mainY + mainH,
                sx + subW / 2,
                subY,
                '#00d4ff'
            );

            /* Flecha de retorno (punteada hacia arriba) */
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 1;
            ctx.moveTo(sx + subW / 2 + 8, subY);
            ctx.lineTo(mainX + mainW / 2 + (i - 1) * 20 + 8, mainY + mainH);
            ctx.stroke();
            ctx.setLineDash([]);
        });

        ctx.fillStyle = '#8b8fb5';
        ctx.font = '12px "Segoe UI", sans-serif';
        ctx.fillText('Linea continua = llamada / Linea punteada = retorno', w / 2, 215);
        ctx.fillText('El flujo de control se transfiere a subrutinas y regresa al programa principal', w / 2, 235);
    }

    /* ----------------------------------------------------------
     * DIAGRAMA: Arquitectura en Capas
     * ---------------------------------------------------------- */
    function drawLayered(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = 330 * dpr;
        canvas.style.height = '330px';

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        const w = canvas.offsetWidth;

        ctx.fillStyle = '#5a5e80';
        ctx.font = '11px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ARQUITECTURA EN CAPAS (N-TIER)', w / 2, 20);

        const layers = [
            { label: 'Capa de Presentacion (UI)', color: '#0f2a3d', border: '#00d4ff' },
            { label: 'Capa de Logica de Negocio', color: '#1a1040', border: '#7c3aed' },
            { label: 'Capa de Acceso a Datos', color: '#1a2a10', border: '#00ff88' },
            { label: 'Capa de Base de Datos', color: '#2a1a0a', border: '#ff8a00' }
        ];

        const layerW = Math.min(w * 0.7, 400);
        const layerH = 50;
        const gap = 12;
        const startX = w / 2 - layerW / 2;
        const startY = 45;

        layers.forEach(function (layer, i) {
            const y = startY + i * (layerH + gap);
            _drawBox(ctx, startX, y, layerW, layerH, layer.color, layer.label, layer.border);

            if (i < layers.length - 1) {
                const arrowY1 = y + layerH + 2;
                const arrowY2 = y + layerH + gap - 2;
                _drawArrow(ctx, w / 2 - 10, arrowY1, w / 2 - 10, arrowY2, '#5a5e80');
                _drawArrow(ctx, w / 2 + 10, arrowY2, w / 2 + 10, arrowY1, '#5a5e80');
            }
        });

        ctx.fillStyle = '#8b8fb5';
        ctx.font = '12px "Segoe UI", sans-serif';
        ctx.fillText('Cada capa solo se comunica con las capas adyacentes', w / 2, 310);
    }

    /* ----------------------------------------------------------
     * INTERFAZ PUBLICA
     * ---------------------------------------------------------- */
    return {
        drawPipeAndFilter: drawPipeAndFilter,
        drawDataCentric: drawDataCentric,
        drawCallReturn: drawCallReturn,
        drawLayered: drawLayered
    };

})();
