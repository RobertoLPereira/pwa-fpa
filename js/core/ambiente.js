/**
 * Configuração de Ambiente Centralizada (Equivalente ao AmbienteConfig do Flutter)
 * Gerencia a URL base do ecossistema e chaves globais da aplicação.
 * 
 * O Object.freeze garante imutabilidade em tempo de execução, impedindo injeções indesejadas.
 */
export const AmbienteConfig = Object.freeze({
    // URL base que aponta para o backend Python FastAPI separado
    baseUrl: 'https://backend-fpa.up.railway.app',// Altere para o IP de produção/servidor quando necessário    
    // Configurações auxiliares do PWA que podem ser reaproveitadas pelos Services
    versaoApp: '1.0.0',
    timeoutRequisicao: 5000 // Tempo limite padrão de 5 segundos para fail-fast
});

// Exportação direta da propriedade isolada para compatibilidade exata com o seu api_service.js
export const baseUrl = AmbienteConfig.baseUrl;