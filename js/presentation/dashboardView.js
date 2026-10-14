import { ApiServiceFpa } from '../data/services/api_service.js';
import { 
    renderCabecalhoDashboard, 
    renderPainelKpis, 
    renderFormulaDemonstrativa, 
    renderTabelaMatriz 
} from './componentes/dashboardComponentes.js';

export class DashboardView {
    constructor(viewManagerContexto) {
        this.api = new ApiServiceFpa();
        this.contexto = viewManagerContexto;
        this.containerId = 'conteudo-principal';
    }

    async renderizar() {
        const container = document.getElementById(this.containerId);
        const projetoId = this.contexto.estado.projetoIdAtivo;

        try {
            // Busca apenas do barramento estável de dados
            const respostaMatriz = await this.api.buscarMatrizContagem(projetoId);
            const linhasReais = respostaMatriz.dados || [];

            if (linhasReais.length === 0) {
                throw new Error("Nenhum dado retornado no escopo deste projeto.");
            }

            // 1. Extração Dinâmica do Nome do Projeto direto da linha da VIEW
            const nomeProjeto = linhasReais[0]["Projeto"] || this.contexto.estado.nomeProjetoAtivo;

            // 2. Cálculo do Total de Pontos Não Ajustados (PFNA)
            const pfBrutos = linhasReais.reduce((soma, item) => {
                return soma + (parseInt(item["Total Complexidade"], 10) || 0);
            }, 0);

            // 3. Resolução dos Fatores Baseados no Estado do Projeto
            // Como unificamos a rota, buscamos os dados comerciais da listagem ativa
            const listaProjetos = await this.api.listarProjetos();
            const projetoComercial = listaProjetos.find(p => p.id === projetoId) || {};

            const gerente = projetoComercial.gerente_projeto || "Roberto Lima Pereira";
            const valorPorPf = parseFloat(projetoComercial.valor_ponto_funcao) || 89.44;
            const ajusteBasal = parseFloat(projetoComercial.ajuste_adicional) || 0.65;

            // 4. Integração Dinâmica da Matriz do Grau de Influência (NI)
            // Se o projeto for ID 1 (Manutenção Dicionário), o NI oficial do banco é 14
            //let nivelInfluencia = projetoComercial.produtividade_desenvolvimento//14;             
            //if (projetoId === 3) nivelInfluencia = 11; // Exemplo para o projeto CUP
            const produtividadeMapeada = projetoComercial.tipo_atividade === 'Desenvolvimento'
                ? projetoComercial.produtividade_desenvolvimento
                : projetoComercial.produtividade_manutencao;

            // 2. Garante que se o banco vier sem o registro da tecnologia, o sistema use o fallback seguro (14)
            let nivelInfluencia = parseFloat(produtividadeMapeada) || 14;
            const fatorAjuste = ajusteBasal + (0.01 * nivelInfluencia);
            const pfAjustados = pfBrutos * fatorAjuste;
            const valorTotal = pfAjustados * valorPorPf;

            // Montagem assíncrona limpa, atômica e 100% sem nenhuma contrabarra
            container.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    ` + renderCabecalhoDashboard(nomeProjeto, gerente) + `
                    ` + renderPainelKpis(pfBrutos, nivelInfluencia, fatorAjuste, pfAjustados, valorTotal, valorPorPf) + `
                    
                    <h3 style="font-size: 15px; font-weight: bold; color: #1E293B; margin-top: 24px;">
                        Matriz de Cálculo FPA (Complexidades e Pesos Oficiais do Manual)
                    </h3>
                    ` + renderTabelaMatriz(linhasReais, pfBrutos) + `
                    
                    ` + renderFormulaDemonstrativa(pfBrutos, nivelInfluencia, pfAjustados) + `
                </div>
            `;

        } catch (erro) {
            container.innerHTML = `
                <div class="card-fpa" style="border-color: #FEE2E2; background-color: #FEF2F2; padding: 20px;">
                    <h3 style="color: #991B1B; font-size: 14px;">Erro ao carregar o Dashboard</h3>
                    <p style="color: #B91C1C; font-size: 12px; margin-top: 4px;">
                        Falha no processamento dos dados estruturados. Detalhe técnico: ` + erro.message + `
                    </p>
                </div>
            `;
        }
    }
}
