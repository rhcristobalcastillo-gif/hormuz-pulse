import { fetchGlobalNews } from './services/taco-motor.js';
import { renderWatchlist } from './components/radar.js';
import { updateStatusPanel } from './components/status.js';

// Inicialización de TradingView con reintento ligero
function initTradingView() {
    if (typeof TradingView === 'undefined') {
        console.warn("TradingView no está cargado aún. Reintentando...");
        setTimeout(initTradingView, 500);
        return;
    }

    new TradingView.widget({
        "autosize": true,
        "symbol": "TVC:USOIL",
        "interval": "15",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "es",
        "enable_publishing": false,
        "backgroundColor": "#0b111e",
        "gridColor": "#1e293b",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "container_id": "tv-chart",
        "show_popup_button": true,
        "studies": ["RSI@tv-basicstudies", "MACD@tv-basicstudies"]
    });
}

// Helper para encadenar actualizaciones periódicas
function startLoop(fn, intervalMs) {
    fn();
    return setInterval(fn, intervalMs);
}

// Inicialización cuando el DOM está listo (no espera todas las imágenes)
document.addEventListener("DOMContentLoaded", () => {
    console.log("Terminal Hormuz Pulse Inicializada ⚡");

    // Iniciar TradingView
    initTradingView();

    // Iniciar loops
    startLoop(updateStatusPanel, 1000);      // cada 1s
    startLoop(renderWatchlist, 10000);       // cada 10s

    // Taco Motor (prueba de fuego)
    fetchGlobalNews()
        .catch(err => {
            console.error("Error en Taco Motor (fetchGlobalNews):", err);
        });
});
