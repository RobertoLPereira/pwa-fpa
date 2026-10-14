/**
 * Componentes Visuais Puros para o Módulo de Projetos
 * Gera estruturas de formulários e listagens adaptativas (Sem dependências externas).
 */

/**
 * Renderiza o Formulário de Novo Escopo (Equivalente ao FormProjetoWidget do Flutter)
 */
export function renderFormularioProjeto() {
    return `
        <form id="form-projeto" class="form-fpa-nativo">
            <h3 style="font-size: 15px; font-weight: bold; color: #0F172A; margin-bottom: 16px;">
                Novo Escopo de Projeto (FPA)
            </h3>
            
            <div class="campo-grupo">
                <label>Nome do Projeto</label>
                <input type="text" id="proj-nome" required placeholder="Ex: Sistema de Gestão Comercial">
            </div>

            <div class="linha-adaptativa">
                <div class="campo-grupo">
                    <label>Número do Projeto / OS</label>
                    <input type="text" id="proj-numero" required>
                </div>
                <div class="campo-grupo">
                    <label>Data Elaboração (YYYY-MM-DD)</label>
                    <input type="date" id="proj-data" required>
                </div>
            </div>

            <div class="linha-adaptativa">
                <div class="campo-grupo">
                    <label>Gerente do Projeto</label>
                    <input type="text" id="proj-gerente" required>
                </div>
                <div class="campo-grupo">
                    <label>Responsável Técnico</label>
                    <input type="text" id="proj-responsavel" required>
                </div>
            </div>

            <div class="linha-adaptativa">
                <div class="campo-grupo">
                    <label>Valor por PF (R$)</label>
                    <input type="number" id="proj-valor" step="0.01" value="89.44" required>
                </div>
                <div class="campo-grupo">
                    <label>Ajuste Basal Fixo</label>
                    <input type="number" id="proj-ajuste" step="0.01" value="0.65" required>
                </div>
            </div>

            <button type="submit" class="btn-fpa-primario" style="margin-top: 16px; width: 100%;">
                💾 Salvar Escopo Comercial
            </button>
        </form>
    `;
}

/**
 * Renderiza a lista lateral de projetos ativos (Equivalente ao _construirListaProjetosLateral)
 * @param {Array} projetos Lista de projetos vindos da API do Railway
 * @param {number} idAtivo ID do projeto selecionado no momento
 */
export function renderListaProjetos(projetos, idAtivo) {
    if (!projetos || projetos.length === 0) {
        return `
            <p style="font-style: italic; color: #64748B; text-align: center; padding: 20px;">
                Nenhum projeto cadastrado no banco fpa.db ainda.
            </p>
        `;
    }

    return `
        <h3 style="font-size: 15px; font-weight: bold; color: #0F172A; margin-bottom: 16px;">
            Selecione o Projeto Ativo
        </h3>
        <div class="lista-projetos-scroll" style="max-height: 400px; overflow-y: auto;">
            ${projetos.map(proj => {
                const isSelecionado = proj.id === idAtivo;
                
                // Sintaxe Corrigida: Sem contrabarras, injetando strings puras nativas da iteração do JS
                return `
                    <div class="item-projeto-card ${isSelecionado ? 'selecionado' : ''}" 
                         data-id="${proj.id}" 
                         data-nome="${proj.nome_projeto}">
                        <div class="item-projeto-icone">${isSelecionado ? '🟢' : '📁'}</div>
                        <div class="item-projeto-infos" style="margin-left: 12px; flex: 1;">
                            <div class="item-projeto-name" style="font-size: 13px; font-weight: bold; color: #0F172A;">
                                ${proj.nome_projeto}
                            </div>
                            <div class="item-projeto-gerente" style="font-size: 11px; color: #64748B;">
                                Gerente: ${proj.gerente_projeto}
                            </div>
                        </div>
                        ${isSelecionado ? '<div class="item-projeto-check" style="color: #16A34A;">✅</div>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}
