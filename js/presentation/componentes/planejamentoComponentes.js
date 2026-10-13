/**
 * Componentes Visuais Puros para o Módulo de Planejamento e Cronograma
 * Estruturas HTML nativas adaptadas para chaves complexas com espaços e acentuações.
 */

export function renderQuadroResumoCronograma(l, e, d, h, t) {
    return `
        <div class="card-fpa" style="background-color: white; padding: 16px;">
            <h3 class="form-titulo-fpa" style="margin-bottom: 12px;">Macro Planejamento Consolidado do Projeto</h3>
            <hr style="border: 0; border-top: 1px solid var(--cor-borda); margin-bottom: 16px;">
            <div class="linha-adaptativa" style="gap: 16px;">
                <div style="text-align: center;">
                    <div style="font-size: 10px; color: #64748B; font-weight: bold;">LEVANTAMENTO (20%)</div>
                    <div style="font-size: 13px; font-weight: bold; color: #1E293B; margin-top: 4px;">` + l.toFixed(1) + ` h</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 10px; color: #64748B; font-weight: bold;">ESPECIFICAÇÃO (20%)</div>
                    <div style="font-size: 13px; font-weight: bold; color: #1E293B; margin-top: 4px;">` + e.toFixed(1) + ` h</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 10px; color: #1E40AF; font-weight: bold;">DESENVOLVIMENTO (50%)</div>
                    <div style="font-size: 13px; font-weight: bold; color: #1E3A8A; margin-top: 4px;">` + d.toFixed(1) + ` h</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 10px; color: #64748B; font-weight: bold;">HOMOLOGAÇÃO (10%)</div>
                    <div style="font-size: 13px; font-weight: bold; color: #1E293B; margin-top: 4px;">` + h.toFixed(1) + ` h</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 10px; color: #2563EB; font-weight: bold;">TOTAL CRONOGRAMA</div>
                    <div style="font-size: 14px; font-weight: bold; color: #2563EB; margin-top: 4px;">` + t.toFixed(1) + ` h</div>
                </div>
            </div>
        </div>
    `;
}

export function renderGraficoEsforco(l, e, d, h, total) {
    if (total === 0) {
        return `
            <div class="card-fpa" style="background-color: white; padding: 24px; text-align: center; font-style: italic; color: #64748B;">
                Aguardando mapeamento de escopo para gerar os gráficos de esforço.
            </div>
        `;
    }

    const maxHoras = Math.max(l, e, d, h);
    const fases = [
        { nome: 'Levantamento', horas: l, cor: '#3B82F6', pct: (l / total) * 100 },
        { nome: 'Especificação', horas: e, cor: '#8B5CF6', pct: (e / total) * 100 },
        { nome: 'Desenvolvimento', horas: d, cor: '#10B981', pct: (d / total) * 100 },
        { nome: 'Homologação', horas: h, cor: '#F59E0B', pct: (h / total) * 100 }
    ];

    let htmlBarras = "";
    for (let i = 0; i < fases.length; i++) {
        const f = fases[i];
        const larguraProporcional = maxHoras > 0 ? (f.horas / maxHoras) * 100 : 0;

        htmlBarras += `
            <div style="margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 13px;">
                    <span style="font-weight: 600; color: #1E293B;">` + f.nome + `</span>
                    <span style="font-weight: bold; color: ` + f.cor + `;">` + f.horas.toFixed(1) + ` h (` + f.pct.toFixed(1) + `%)</span>
                </div>
                <div style="height: 10px; width: 100%; background-color: #F1F5F9; border-radius: 5px; position: relative; overflow: hidden;">
                    <div style="height: 100%; width: ` + larguraProporcional + `%; background-color: ` + f.cor + `; border-radius: 5px; transition: width 0.5s ease;"></div>
                </div>
            </div>
        `;
    }

    return `
        <div class="card-fpa" style="background-color: white; padding: 16px; border: 1px solid var(--cor-borda);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="font-size: 14px; font-weight: bold; color: #0F172A;">Distribuição Analítica do Esforço</h3>
                <span style="font-size: 13px; font-weight: bold; color: #1E40AF;">Total: ` + total.toFixed(1) + ` h</span>
            </div>
            <hr style="border: 0; border-top: 1px solid var(--cor-borda); margin-bottom: 16px;">
            ` + htmlBarras + `
        </div>
    `;
}

export function renderTabelaCronograma(dadosReais) {
    let htmlLinhas = "";

    for (let i = 0; i < dadosReais.length; i++) {
        const linha = dadosReais[i];
        const itemTexto = linha["Item / Subtotal"] || "";
        const eSubtotal = itemTexto.includes('>>>');

        // Valores numéricos extraídos com segurança baseados na nomenclatura exata do SQLite
        const lev = parseFloat(linha["Levantamento (20%)"]) || 0;
        const esp = parseFloat(linha["Especificação (20%)"]) || 0;
        const des = parseFloat(linha["Desenvolvimento (50%)"]) || 0;
        const hom = parseFloat(linha["Homologação (10%)"]) || 0;
        const total = parseFloat(linha["Total Horas"]) || 0;

        const corFundoRow = eSubtotal ? "#EFF6FF" : "white";
        const corTextoItem = eSubtotal ? "#1E40AF" : "#1E293B";
        const pesoFonte = eSubtotal ? "bold" : "normal";

        htmlLinhas += `
            <tr style="background-color: ` + corFundoRow + `;">
                <td style="padding: 12px; font-weight: ` + pesoFonte + `; color: ` + corTextoItem + `;">` + itemTexto + `</td>
                <td style="padding: 12px; text-align: center; font-weight: ` + pesoFonte + `;">` + lev.toFixed(1) + ` h</td>
                <td style="padding: 12px; text-align: center; font-weight: ` + pesoFonte + `;">` + esp.toFixed(1) + ` h</td>
                <td style="padding: 12px; text-align: center; font-weight: ` + pesoFonte + `;">` + des.toFixed(1) + ` h</td>
                <td style="padding: 12px; text-align: center; font-weight: ` + pesoFonte + `;">` + hom.toFixed(1) + ` h</td>
                <td style="padding: 12px; text-align: center; font-weight: bold; color: ` + corTextoItem + `;">` + total.toFixed(1) + ` h</td>
            </tr>
        `;
    }

    return `
        <div class="tabela-responsiva">
            <table class="tabela-fpa-escopo" style="min-width: 800px;">
                <thead>
                    <tr style="background-color: #0F172A;">
                        <th style="padding: 12px; color: white; font-weight: bold; text-align: left;">Componente / Função / Linha de Escopo</th>
                        <th style="padding: 12px; color: white; font-weight: bold; text-align: center; width: 130px;">Levantamento (20%)</th>
                        <th style="padding: 12px; color: white; font-weight: bold; text-align: center; width: 130px;">Especificação (20%)</th>
                        <th style="padding: 12px; color: white; font-weight: bold; text-align: center; width: 140px;">Desenvolvimento (50%)</th>
                        <th style="padding: 12px; color: white; font-weight: bold; text-align: center; width: 130px;">Homologação (10%)</th>
                        <th style="padding: 12px; color: white; font-weight: bold; text-align: center; width: 110px;">Subtotal Horas</th>
                    </tr>
                </thead>
                <tbody>
                    ` + htmlLinhas + `
                </tbody>
            </table>
        </div>
    `;
}
