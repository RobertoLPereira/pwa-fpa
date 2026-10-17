import { ApiServiceFpa } from '../data/services/api_service.js';
import { FpaReportGeneratorService } from '../data/services/fpaReportGeneratorService.js';
import { 
    renderCabecalhoDashboard, 
    renderPainelKpis, 
    renderFormulaDemonstrativa, 
    renderTabelaMatriz 
} from './componentes/dashboardComponentes.js';

/**
 * View de Dashboard de Métricas FPA (Equivalente ao RelatorioCompletoPage do Flutter)
 * Consome de forma assíncrona as VIEWs e cálculos consolidados do SQLite.
 */
export class DashboardView {
    constructor(viewManagerContexto) {
        this.api = new ApiServiceFpa();
        this.contexto = viewManagerContexto;
        this.containerId = 'conteudo-principal';
    }

    /**
     * Coordena as chamadas assíncronas concorrentes de rede e monta o painel técnico
     */
    async renderizar() {
        const container = document.getElementById(this.containerId);
        const projetoId = this.contexto.estado.projetoIdAtivo;

        try {
            // Busca inicial para renderizar os componentes visuais do painel
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

            // 3. Resolução dos Fatores Baseados no Estado do Projeto do banco fpa.db
            const listaProjetos = await this.api.listarProjetos();
            const projetoComercial = listaProjetos.find(p => p.id === projetoId) || {};

            const gerente = projetoComercial.gerente_projeto || "Roberto Lima Pereira";
            const valorPorPf = parseFloat(projetoComercial.valor_ponto_funcao) || 89.44;
            const ajusteBasal = parseFloat(projetoComercial.ajuste_adicional) || 0.65;

            // 4. Integração Dinâmica da Produtividade para cálculo do Grau de Influência (NI)
            const produtividadeMapeada = projetoComercial.tipo_atividade === 'Desenvolvimento'
                ? projetoComercial.produtividade_desenvolvimento
                : projetoComercial.produtividade_manutencao;

            let nivelInfluencia = parseFloat(produtividadeMapeada) || 14;
            const fatorAjuste = ajusteBasal + (0.01 * nivelInfluencia);
            const pfAjustados = pfBrutos * fatorAjuste;
            const valorTotal = pfAjustados * valorPorPf;

            // Montagem contínua e higiênica da interface corporativa sem contrabarras ocultas
            container.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h2 style="font-size: 15px; color: #0F172A; font-weight: bold;">Métricas FPA - Painel Detalhado Técnico</h2>
                    <button id="btn-exportar-pdf-fpa" class="btn-fpa-primario" style="background-color: #0F172A; color: white; border: none; padding: 10px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                        📄 Exportar PDF Executivo
                    </button>
                </div>
                
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

            // Configura a escuta do clique do botão para disparar o Future.wait equivalente em JS
            document.getElementById('btn-exportar-pdf-fpa').addEventListener('click', async () => {
                try {
                    console.log("⏳ Agregando dados multi-rotas do SQLite para o relatório unificado...");
                    
                    // Dispara a leitura em paralelo de todos os pacotes reais necessários para o anexo
                    const [resResumo, resPreco, resPlan, resMatriz, resAnalitico] = await Promise.all([
                        this.api.obterResumoExecutivo(projetoId),
                        this.api.obterPrecificacao(projetoId),
                        this.api.obterPlanejamentoHoras(projetoId),
                        this.api.buscarMatrizContagem(projetoId),
                        this.api.obterRelatorioAnalitico(projetoId)
                    ]);

                    // Aciona o PdfService repassando os 5 pacotes individuais estáveis
                    FpaReportGeneratorService.emitirDocumentoConsolidado(
                        resResumo, 
                        resPreco, 
                        resPlan, 
                        resMatriz, 
                        resAnalitico
                    );

                } catch (erroInterno) {
                    alert("❌ Erro ao consolidar dados para a geração do relatório: " + erroInterno.message);
                }
            });

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
