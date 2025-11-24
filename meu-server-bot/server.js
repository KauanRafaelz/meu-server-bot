// === SERVER V25 (UNIVERSAL - RENDER/RAILWAY) ===
const WebSocket = require('ws');
const http = require('http');

// Cria um servidor HTTP "falso" só para o Render saber que estamos online
// O Render exige que algo escute na porta process.env.PORT
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('✅ Servidor FB Bot V25 (Titanium) ONLINE!');
});

const wss = new WebSocket.Server({ server });

console.log("🛡️ Iniciando Servidor V25 Titanium...");

wss.on('connection', (ws, req) => {
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });

    ws.on('message', (message) => {
        try {
            const dados = message.toString();
            // Broadcast (Repassa para todos)
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(dados);
                }
            });
        } catch (e) { console.error("Erro broadcast:", e); }
    });

    ws.on('error', () => {});
});

// Mantém vivo (Heartbeat)
setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

// OUVIR NA PORTA CORRETA (IMPORTANTE PARA O RENDER)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`📡 Ouvindo na porta ${PORT}`);
});