// === SERVER V25 (UNIVERSAL - RENDER/RAILWAY) ===
const WebSocket = require('ws');
// === SERVER V25.1 (UNIVERSAL FIX) ===
const WebSocket = require('ws');
const http = require('http');

// 1. Cria um servidor HTTP simples (Necessário para Render/Replit não darem erro 404)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('✅ Servidor WebSocket FB Bot está ONLINE!');
});

// 2. Acopla o WebSocket nesse servidor HTTP
const wss = new WebSocket.Server({ server });

console.log("🛡️ Iniciando Servidor Universal...");

wss.on('connection', (ws, req) => {
    console.log("Nova conexão detectada!"); // Log para debug
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    ws.on('message', (message) => {
        try {
            const dados = message.toString();
            // Broadcast (Repassa para todos os outros)
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(dados);
                }
            });
        } catch (e) { console.error("Erro no broadcast:", e); }
    });

    ws.on('error', () => {});
});

// 3. Mantém a conexão viva (Ping-Pong)
setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

// 4. OUVIR NA PORTA CERTA (CRUCIAL PARA O RENDER/REPLIT)
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`📡 Ouvindo na porta ${PORT}`);
});