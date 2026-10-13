/**
 * Componentes Visuais Puros para o Módulo de Dashboard
 * Estruturas HTML nativas com cálculos matemáticos limpos do IFPUG.
 */

export function renderCabecalhoDashboard(nomeProjeto, nomeGerente) {
    return `
        <div class="card-fpa" style="background-color: white; padding: 16px;">
            <div class="linha-adaptativa" style="gap: 24px;">
                <div>
                    <div style="font-size: 10px; color: #64748B; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">PROJETO ATIVO</div>
                    <div style="font-size: 13px; font-weight: bold; color: #1E293B; margin-top: 4px;">` + nomeProjeto + `</div>
                </div>
                <div>
                    <div style="font-size: 10px; color: #64748B; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">GERENTE RESPONSÁVEL</div>
                    <div style="font-size: 13px; font-weight: bold; color: #1E293B; margin-top: 4px;">` + nomeGerente + `</div>
                </div>
                <div>
                    <div style="font-size: 10px; color: #64748B; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">NORMA TÉCNICA</div>
                    <div style="font-size: 13px; font-weight: bold; color: #1E293B; margin-top: 4px;">IFPUG CPM 4.3 (Contagem)</div>
                </div>
            </div>
        </div>
    `;
}

export function renderPainelKpis(pfBrutos, nivelInf, vFatorAjuste, vPfAjustados, vValorTotal, vValorPorPf) {
    const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    
    return `
        <div class="painel-fpa-grid" style="margin-top: 20px;">
            <div class="card-fpa" style="background-color: white;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px;">
                    <span>Pontos de Função Brutos (Não Ajustados)</span>
                    <span style="font-weight: bold;">` + pfBrutos + ` PF</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px;">
                    <span>Somatório Nível de Influência (NI)</span>
                    <span style="font-weight: bold;">` + nivelInf + ` / 70</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px;">
                    <span>Fator de Ajuste Calculado (Dinâmico)</span>
                    <span style="font-weight: bold;">` + vFatorAjuste.toFixed(2) + `</span>
                </div>
                <hr style="border: 0; border-top: 1px solid var(--cor-borda); margin: 16px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; color: var(--cor-primaria);">
                    <span>PONTOS DE FUNÇÃO AJUSTADOS (FPA)</span>
                    <span style="color: #1E40AF;">` + vPfAjustados.toFixed(2) + ` PF</span>
                </div>
            </div>

            <div class="card-fpa" style="background-color: #0F172A; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                <div style="font-size: 32px; color: #4ADE80; margin-bottom: 8px;">💵</div>
                <div style="font-size: 10px; color: #94A3B8; letter-spacing: 1px; font-weight: bold;">VALOR TOTAL DA ESTIMATIVA</div>
                <div style="font-size: 22px; font-weight: bold; color: #4ADE80; margin-top: 6px; margin-bottom: 8px;">` + formatarMoeda(vValorTotal) + `</div>
                <div style="font-size: 11px; color: #64748B;">Preço por PF: ` + formatarMoeda(vValorPorPf) + `</div>
            </div>
        </div>
    `;
}

export function renderFormulaDemonstrativa(pfBrutos, nivelInf, vPfAjustados) {
    const pfAjustadosBr = vPfAjustados.toFixed(2).replace('.', ',');
    
    return `
        <div class="card-fpa" style="background-color: white; border-top: 2px solid #0F172A; border-bottom: 2px solid #0F172A; padding: 16px; margin-top: 24px;">
            <div style="text-align: center; font-size: 12px; font-weight: bold; color: #1E293B; letter-spacing: 0.2px; margin-bottom: 12px;">
                Pontos por Função = Pontos Não Ajustados x ( 0,65 + ( 0,01 x Grau de Influência ) )
            </div>
            <hr style="border: 0; border-top: 1px solid var(--cor-borda); margin: 12px 0;">
            <div style="text-align: center; font-size: 13px; font-weight: bold; color: #1E40AF; letter-spacing: 0.5px;">
                Pontos por Função = ` + pfBrutos + ` x ( 0,65 + ( 0,01 x ` + nivelInf + ` ) ) = ` + pfAjustadosBr + `
            </div>
        </div>
    `;
}

export function renderTabelaMatriz(linhas, totalGeralBruto) {
    let htmlLinhas = "";

    // Evita o .map de strings complexas concatenando o HTML de forma direta e atômica
    for (let i = 0; i < linhas.length; i++) {
        const item = linhas[i];
        const tipoFuncao = item["Tipo de Função"] || "";
        const complexidade = item["Complexidade"] || "";
        const qtd = parseInt(item["Quantidade"], 10) || 0;
        const peso = parseFloat(item["Peso"]) || 0;
        const totalCompl = parseInt(item["Total Complexidade"], 10) || 0;

        const corFundoRow = qtd > 0 ? "#F0FDF4" : "white";
        const txtQtd = qtd > 0 ? qtd : "";
        const txtTotal = totalCompl > 0 ? totalCompl : "";
        const txtPeso = peso.toFixed(0);

        htmlLinhas += `
            <tr style="background-color: ` + corFundoRow + `;">
                <td style="padding: 12px; font-weight: bold; color: #0F172A;">` + tipoFuncao + `</td>
                <td style="padding: 12px; font-size: 13px; color: #334155;">
                    <span style="font-weight: bold; color: #16A34A; display: inline-block; width: 20px;">` + txtQtd + `</span>
                    <span>` + complexidade + ` x</span>
                </td>
                <td style="padding: 12px; text-align: center; font-size: 13px;">` + txtPeso + `</td>
                <td style="padding: 12px; text-align: center; font-size: 13px;">` + txtTotal + `</td>
            </tr>
        `;
    }

    return `
        <div class="tabela-responsiva" style="margin-top: 16px;">
            <table class="tabela-fpa-escopo">
                <thead>
                    <tr style="background-color: #F8FAFC;">
                        <th style="padding: 12px; font-weight: bold;">Tipo de Função</th>
                        <th style="padding: 12px; font-weight: bold;">Quantidade / Complexidade</th>
                        <th style="padding: 12px; font-weight: bold; text-align: center; width: 80px;">Peso</th>
                        <th style="padding: 12px; font-weight: bold; text-align: center; width: 110px;">Total Compl.</th>
                    </tr>
                </thead>
                <tbody>
                    ` + htmlLinhas + `
                    <tr style="background-color: #F8FAFC; border-top: 2px solid var(--cor-borda);">
                        <td style="padding: 12px; font-weight: bold; color: #1E293B;">Total Pontos Não Ajustados (PFNA)</td>
                        <td></td>
                        <td></td>
                        <td style="padding: 12px; text-align: center; font-size: 15px; font-weight: bold; color: #1E3A8A;">` + totalGeralBruto + `</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}
