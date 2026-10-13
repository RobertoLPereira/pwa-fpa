/**
 * Renderiza o Formulário de Cadastro/Edição de Fatores de Tecnologia
 */
export function renderFormularioTecnologia(tecEmEdicao = null) {
    const eEdicao = tecEmEdicao !== null;

    // Mapeamento baseado no contrato real: produtividade_desenvolvimento e produtividade_manutencao
    const devValor = eEdicao ? tecEmEdicao.produtividade_desenvolvimento : '0.0';
    const manutValor = eEdicao ? tecEmEdicao.produtividade_manutencao : '0.0';

    return `
        <form id="form-tecnologia" class="form-fpa-nativo">
            <h4 style="font-size: 15px; font-weight: bold; color: #0F172A; margin-bottom: 16px;">
                ` + (eEdicao ? '📝 Editar Fatores' : '💾 Nova Tecnologia') + `
            </h4>
            <hr style="border: 0; border-top: 1px solid var(--cor-borda); margin-bottom: 16px;">

            <div class="campo-grupo">
                <label>Tecnologia / Linguagem</label>
                <input type="text" id="tec-nome" required value="` + (eEdicao ? tecEmEdicao.nome : '') + `" placeholder="Ex: Flutter Windows">
            </div>

            <div class="campo-grupo" style="margin-top: 12px;">
                <label>Produtividade Dev (h/PF)</label>
                <input type="number" id="tec-dev" step="0.1" min="0.1" required value="` + devValor + `">
            </div>

            <div class="campo-grupo" style="margin-top: 12px;">
                <label>Produtividade Sustentação (h/PF)</label>
                <input type="number" id="tec-manut" step="0.1" min="0.1" required value="` + manutValor + `">
            </div>

            <div style="display: flex; gap: 8px; margin-top: 20px;">
                ` + (eEdicao ? '<button type="button" id="btn-cancelar-tec" class="btn-fpa-primario" style="background-color:#64748B; width:50%;">Cancelar</button>' : '') + `
                <button type="submit" class="btn-fpa-primario" style="width: ` + (eEdicao ? '50%' : '100%') + `;">
                    ` + (eEdicao ? 'Atualizar' : 'Adicionar') + `
                </button>
            </div>
        </form>
    `;
}

/**
 * Renderiza a grade de fatores cadastrados (DataTable Responsiva baseada em snake_case)
 */
export function renderTabelaTecnologias(tecnologias) {
    if (!tecnologias || tecnologias.length === 0) {
        return `<div class="tabela-fpa-vazia">Nenhum fator de produtividade cadastrado no SQLite.</div>`;
    }

    let htmlLinhas = "";
    for (let i = 0; i < tecnologias.length; i++) {
        const tec = tecnologias[i];
        const id = tec.id;
        const nome = tec.nome || "";
        
        // Sincronização exata com as propriedades retornadas do backend em Railway
        const dev = parseFloat(tec.produtividade_desenvolvimento || 0).toFixed(1);
        const manut = parseFloat(tec.produtividade_manutencao || 0).toFixed(1);

        htmlLinhas += `
            <tr>
                <td style="padding: 12px; font-weight: bold; color: #0F172A;">` + nome + `</td>
                <td style="padding: 12px; text-align: center; font-size: 13px;">` + dev + ` h/PF</td>
                <td style="padding: 12px; text-align: center; font-size: 13px;">` + manut + ` h/PF</td>
                <td style="padding: 12px; text-align: center;">
                    <div class="container-acoes-tabela">
                        <button class="btn-acao-tabela btn-editar-tec" data-id="` + id + `" title="Editar Fatores">✏️</button>
                        <button class="btn-acao-tabela btn-excluir-tec" data-id="` + id + `" title="Remover Tecnologia">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    }

    return `
        <div class="tabela-responsiva">
            <table class="tabela-fpa-escopo" style="min-width: 600px;">
                <thead>
                    <tr style="background-color: #F8FAFC; border-bottom: 1px solid var(--cor-borda);">
                        <th style="padding: 12px; font-weight: bold;">TECNOLOGIA</th>
                        <th style="padding: 12px; font-weight: bold; text-align: center; width: 140px;">DESENVOLVIMENTO</th>
                        <th style="padding: 12px; font-weight: bold; text-align: center; width: 180px;">MANUTENÇÃO / SUSTENTAÇÃO</th>
                        <th style="padding: 12px; font-weight: bold; text-align: center; width: 100px;">AÇÕES</th>
                    </tr>
                </thead>
                <tbody>
                    ` + htmlLinhas + `
                </tbody>
            </table>
        </div>
    `;
}
