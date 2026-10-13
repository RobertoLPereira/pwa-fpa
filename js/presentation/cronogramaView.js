import { ApiServiceFpa } from '../data/services/api_service.js';
import { 
    renderQuadroResumoCronograma, 
    renderGraficoEsforco, 
    renderTabelaCronograma 
} from './componentes/planejamentoComponentes.js';

/**
 * View de Cronograma e Distribuição de Esforço (Equivalente ao PlanejamentoPage do Flutter)
 */
export class CronogramaView {
    constructor(viewManagerContexto) {
        this.api = new ApiServiceFpa();
        this.contexto = viewManagerContexto;
        this.containerId = 'conteudo-principal';
    }

    async renderizar() {
        const container = document.getElementById(this.containerId);
        const projetoId = this.contexto.estado.projetoIdAtivo;

        try {
            // Invoca o método com a rota de planejamento real da Railway
            const resposta = await this.api.obterPlanejamentoHoras(projetoId);
            const dadosReais = resposta.dados || [];

            if (dadosReais.length === 0) {
                throw new Error("Nenhum dado retornado no cronograma deste projeto.");
            }

            // 🧮 CALCULA OS MACRO ACUMULADORES SOMANDO AS LINHAS DE SUBTOTAL DO SQLite
            let geralLev = 0, geralEsp = 0, geralDes = 0, geralHom = 0, geralTotal = 0;

            for (let i = 0; i < dadosReais.length; i++) {
                const item = dadosReais[i];
                const itemTexto = item["Item / Subtotal"] || "";
                
                // Se a linha for um subtotal de bloco, soma no indicador mestre do topo
                if (itemTexto.includes('>>>')) {
                    geralLev += parseFloat(item["Levantamento (20%)"]) || 0;
                    geralEsp += parseFloat(item["Especificação (20%)"]) || 0;
                    geralDes += parseFloat(item["Desenvolvimento (50%)"]) || 0;
                    geralHom += parseFloat(item["Homologação (10%)"]) || 0;
                    geralTotal += parseFloat(item["Total Horas"]) || 0;
                }
            }

            // Injeção limpa, contínua e 100% sem nenhuma contrabarra
            container.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    ` + renderQuadroResumoCronograma(geralLev, geralEsp, geralDes, geralHom, geralTotal) + `
                    
                    <div style="margin-top: 16px;">
                        ` + renderGraficoEsforco(geralLev, geralEsp, geralDes, geralHom, geralTotal) + `
                    </div>

                    <h3 style="font-size: 15px; font-weight: bold; color: #0F172A; margin-top: 24px;">
                        Detalhamento Cronograma por Componente Funcional
                    </h3>
                    <div class="card-fpa" style="background-color: white; padding: 12px; margin-top: 12px;">
                        ` + renderTabelaCronograma(dadosReais) + `
                    </div>
                </div>
            `;

        } catch (erro) {
            container.innerHTML = `
                <div class="card-fpa" style="border-color: #FEE2E2; background-color: #FEF2F2; padding: 20px;">
                    <h3 style="color: #991B1B; font-size: 14px;">Erro ao carregar o Planejamento</h3>
                    <p style="color: #B91C1C; font-size: 12px; margin-top: 4px;">
                        Falha na consolidação da carga horária por fase. Detalhe técnico: ` + erro.message + `
                    </p>
                </div>
            `;
        }
    }
}
