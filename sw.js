/**
 * Service Worker Nativo do Ecossistema FPA (Motor Offline e Performance)
 * Estratégia: Cache-First para arquivos locais e Network-Only para APIs do SQLite.
 */

const NOME_CACHE = 'fpa-metricas-v1';

// 📋 Lista de ativos estáticos obrigatórios para o funcionamento da casca PWA
const ATIVOS_ESTATICOS = [
    '/',
    '/index.html',
    '/css/estilo.css',
    '/manifest.json',
    '/js/core/ambiente.js',
    '/js/presentation/viewmanager.js',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png',
    '/assets/icons/app_icon.png'
];

// 1. EVENTO DE INSTALAÇÃO: Armazena os arquivos da estrutura na memória local do navegador
self.addEventListener('install', (evento) => {
    evento.waitUntil(
        caches.open(NOME_CACHE).then((cache) => {
            console.log('📦 PWA FPA: Mapeando infraestrutura estática no cache local...');
            return cache.addAll(ATIVOS_ESTATICOS);
        }).then(() => self.skipWaiting()) // Força o SW a se tornar ativo imediatamente
    );
});

// 2. EVENTO DE ATIVAÇÃO: Remove caches antigos caso você atualize a versão do app
self.addEventListener('activate', (evento) => {
    evento.waitUntil(
        caches.keys().then((chaves) => {
            return Promise.all(
                chaves.map((chave) => {
                    if (chave !== NOME_CACHE) {
                        console.log('🗑️ PWA FPA: Removendo cache legado:', chave);
                        return caches.delete(chave);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Assume o controle das abas abertas imediatamente
    );
});

// 3. EVENTO DE INTERCEPTAÇÃO (FETCH): Gerencia o comportamento Online/Offline de forma limpa
self.addEventListener('fetch', (evento) => {
    const urlRequisicao = new URL(evento.request.url);

    // 🛡️ REGRA CRÍTICA: Se a requisição for para o backend Python FastAPI, ignore o cache!
    // As chamadas ao banco precisam ser 100% vivas em tempo real.
    if (urlRequisicao.pathname.startsWith('/api/')) {
        evento.respondWith(fetch(evento.request));
        return;
    }

    // Estratégia Cache-First para os arquivos visuais locais do app
    evento.respondWith(
        caches.match(evento.request).then((respostaArmazenada) => {
            // Retorna o arquivo do cache se existir; caso contrário, busca na rede
            return respostaArmazenada || fetch(evento.request).then((respostaRede) => {
                // Se o arquivo for válido e local, salva uma cópia dinamicamente
                if (respostaRede && respostaRede.status === 200 && respostaRede.type === 'basic') {
                    const respostaParaCache = respostaRede.clone();
                    caches.open(NOME_CACHE).then((cache) => {
                        cache.put(evento.request, respostaParaCache);
                    });
                }
                return respostaRede;
            });
        }).catch(() => {
            // Caso ocorra falha total (rede caída e arquivo fora do cache)
            if (evento.request.mode === 'navigate') {
                return caches.match('/index.html');
            }
        })
    );
});
