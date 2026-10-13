/**
 * Renderiza o Formulário lateral e estruturado de Tipos Funcionais FPA
 */
export function renderFormularioTipoFuncao(modelEmEdicao = null, categoriaSelecionada = 'Dados') {
    const eEdicao = modelEmEdicao !== null;

    return `
        <form id="form-tipo-funcao" class="form-fpa-nativo">
            <h4 style="font-size: 15px; font-weight: bold; color: #0F172A; margin-bottom: 16px;">
                ` + (eEdicao ? '📝 Editar Tipo Funcional' : '⚙️ Novo Tipo Funcional') + `
            </h4>
            <hr style="border: 0; border-top: 1px solid var(--cor-borda); margin-bottom: 16px;">

            <div class="campo-grupo">
                <label>Sigla (Ex: ALI, EE)</label>
                <input type="text" id="tipo-sigla" required value="` + (eEdicao ? modelEmEdicao.sigla : '') + `" placeholder="Ex: ALI">
            </div>

            <div class="campo-grupo" style="margin-top: 12px;">
                <label>Nome por Extenso</label>
                <input type="text" id="tipo-nome-extenso" required value="` + (eEdicao ? modelEmEdicao.nome_extenso : '') + `" placeholder="Ex: Arquivo Lógico Interno">
            </div>

            <div class="campo-grupo" style="margin-top: 12px;">
                <label>Categoria (IFPUG)</label>
                <select id="tipo-categoria" required class="select-fpa-nativo">
                    <option value="Dados" ` + (categoriaSelecionada === 'Dados' ? 'selected' : '') + `>Dados</option>
                    <option value="Transação" ` + (categoriaSelecionada === 'Transação' ? 'selected' : '') + `>Transação</option>
                </select>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 20px;">
                ` + (eEdicao ? '<button type="button" id="btn-cancelar-tipo" class="btn-fpa-primario" style="background-color:#64748B; width:50%;">Cancelar</button>' : '') + `
                <button type="submit" class="btn-fpa-primario" style="width: ` + (eEdicao ? '50%' : '100%') + `;">
                    ` + (eEdicao ? 'Atualizar' : 'Adicionar') + `
                </button>
            </div>
        </form>
    `;
}

/**
 * Renderiza a listagem tabular de Tipos cadastrados (Sem nenhuma contrabarra)
 */
export function renderTabelaTiposFuncao(tipos) {
    if (!tipos || tipos.length === 0) {
        return `<div class="tabela-fpa-vazia">Nenhum tipo funcional mapeado no banco fpa.db.</div>`;
    }

    let htmlLinhas = "";
    for (let i = 0; i < tipos.length; i++) {
        const t = tipos[i];
        const id = t.id;
        const sigla = t.sigla || "";
        const nomeExtenso = t.nome_extenso || "";
        const categoria = t.categoria || "Dados";

        // Estiliza dinamicamente as categorias oficiais do manual
        const classeChip = categoria === 'Dados' ? 'chip-baixa' : 'chip-media';

        htmlLinhas += `
            <tr>
                <td style="padding: 12px; font-weight: bold; color: #0F172A;">` + sigla + `</td>
                <td style="padding: 12px; font-size: 13px; color: #334155;">` + nomeExtenso + `</td>
                <td style="padding: 12px; text-align: center;">
                    <span class="chip-fpa-complexidade ` + classeChip + `">` + categoria + `</span>
                </td>
                <td style="padding: 12px; text-align: center;">
                    <div class="container-acoes-tabela">
                        <button class="btn-acao-tabela btn-editar-tipo" data-id="` + id + `" title="Editar Tipo">✏️</button>
                        <button class="btn-acao-tabela btn-excluir-tipo" data-id="` + id + `" title="Remover Tipo">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    }

    return `
        <div class="tabela-responsiva">
            <table class="tabela-fpa-escopo" style="min-width: 550px;">
                <thead>
                    <tr style="background-color: #F8FAFC; border-bottom: 1px solid var(--cor-borda);">
                        <th style="padding: 12px; font-weight: bold; width: 90px;">SIGLA</th>
                        <th style="padding: 12px; font-weight: bold;">NOME POR EXTENSO</th>
                        <th style="padding: 12px; font-weight: bold; text-align: center; width: 120px;">CATEGORIA</th>
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
