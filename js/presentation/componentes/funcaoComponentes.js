/**
 * Componentes Visuais Puros para o Módulo de Funções FPA
 * Estruturas HTML nativas baseadas nos critérios oficiais do IFPUG CPM 4.3.
 */

/**
 * Renderiza o Formulário de Entrada inline (Equivalente ao CrudFuncoesWidget superior)
 * @param {Object} funcaoEmEdicao Dados da função se estiver em modo de edição (ou null)
 * @param {number} tipoFuncaoIdSelecionado ID do dropdown selecionado
 * @param {boolean} gerarCrudAutomatico Estado do checkbox de automatização
 */
export function renderFormularioFuncao(funcaoEmEdicao = null, tipoFuncaoIdSelecionado = 1, gerarCrudAutomatico = false) {
    const eEdicao = funcaoEmEdicao !== null;
    // Controla a classe CSS dinamicamente em vez de injetar código style inline
    const classeVisibilidade = (tipoFuncaoIdSelecionado === 1 && !eEdicao) ? 'exibir-bloco' : 'ocultar-bloco';
    
    return `
        <form id="form-funcao" class="form-fpa-nativo">
            <h3 class="form-titulo-fpa">
                ${eEdicao ? '📝 Editar Componente Funcional' : '⚡ Mapear Novo Componente no Escopo'}
            </h3>
            
            <div class="painel-inputs-funcao">
                <div class="campo-grupo flex-3">
                    <label>Descrição da Função (Ex: Dicionário de dados)</label>
                    <input type="text" id="func-descricao" required value="${eEdicao ? funcaoEmEdicao.descricao : ''}" placeholder="Nome ou objetivo do componente funcional">
                </div>

                <div class="campo-grupo flex-2">
                    <label>Tipo Funcional</label>
                    <select id="func-tipo-id" class="select-fpa-nativo" required>
                        <option value="1" ${tipoFuncaoIdSelecionado === 1 ? 'selected' : ''}>ALI (Arq. Interno)</option>
                        <option value="2" ${tipoFuncaoIdSelecionado === 2 ? 'selected' : ''}>AIE (Arq. Interface)</option>
                        <option value="3" ${tipoFuncaoIdSelecionado === 3 ? 'selected' : ''}>EE (Entrada Externa)</option>
                        <option value="4" ${tipoFuncaoIdSelecionado === 4 ? 'selected' : ''}>SE (Saída Externa)</option>
                        <option value="5" ${tipoFuncaoIdSelecionado === 5 ? 'selected' : ''}>CE (Consulta Externa)</option>
                    </select>
                </div>

                <div class="campo-grupo width-80">
                    <label>ALR / AR</label>
                    <input type="number" id="func-ar" min="0" value="${eEdicao ? funcaoEmEdicao.arquivos_referenciados : '0'}" required>
                </div>

                <div class="campo-grupo width-80">
                    <label>DER / ID</label>
                    <input type="number" id="func-id" min="0" value="${eEdicao ? funcaoEmEdicao.itens_dados : '0'}" required>
                </div>

                <div class="campo-acoes-inline">
                    ${eEdicao ? `
                        <button type="button" id="btn-cancelar-edicao" class="btn-fpa-secundario" title="Cancelar Edição">❌</button>
                    ` : ''}
                    <button type="submit" class="btn-fpa-salvar ${eEdicao ? 'modo-check' : ''}" title="Salvar Componente">
                        ${eEdicao ? '✓' : '＋'}
                    </button>
                </div>
            </div>

            <!-- Injeção de classe estática limpa eliminando o erro de validação de propriedade CSS -->
            <div id="container-automacao-crud" class="automacao-crud-box ${classeVisibilidade}">
                <label class="checkbox-fpa-label">
                    <input type="checkbox" id="func-automatizar" ${gerarCrudAutomatico ? 'checked' : ''} class="checkbox-fpa-input">
                    Automatizar Ecossistema Transacional (Gerar EE de Manutenção e CE de Consulta automaticamente)
                </label>
            </div>
        </form>
    `;
}

/**
 * Renderiza a listagem de componentes mapeados (Equivalente ao ListView.builder inferior)
 * @param {Array} funcoes Vetor de funções vindas da rota detalhada do SQLite
 */
export function renderTabelaFuncoes(funcoes) {
    if (!funcoes || funcoes.length === 0) {
        return `
            <div class="tabela-fpa-vazia">
                Nenhum componente cadastrado neste projeto ainda. Mapeie o escopo acima!
            </div>
        `;
    }

    return `
        <div class="tabela-responsiva">
            <table class="tabela-fpa-escopo">
                <thead>
                    <tr>
                        <th class="col-tipo">TIPO</th>
                        <th>DESCRIÇÃO COMPONENTE</th>
                        <th class="col-num">ALR/AR</th>
                        <th class="col-num">DER/ID</th>
                        <th class="col-complex">COMPLEXIDADE</th>
                        <th class="col-acoes">AÇÕES</th>
                    </tr>
                </thead>
                <tbody>
                    ${funcoes.map(f => {
                        let classeComplexidade = "chip-baixa";
                        if (f.complexidade === 'Complexa') { classeComplexidade = "chip-complexa"; }
                        else if (f.complexidade === 'Média') { classeComplexidade = "chip-media"; }

                        return `
                            <tr>
                                <td>
                                    <span class="chip-fpa-sigla">
                                        ${f.sigla_tipo || f.tipo_funcao || 'FUN'}
                                    </span>
                                </td>
                                <td class="celula-descricao">${f.descricao}</td>
                                <td class="celula-centro">${f.arquivos_referenciados}</td>
                                <td class="celula-centro">${f.itens_dados}</td>
                                <td class="celula-centro">
                                    <span class="chip-fpa-complexidade ${classeComplexidade}">
                                        ${f.complexidade || 'Baixa'}
                                    </span>
                                </td>
                                <td class="celula-centro">
                                    <div class="container-acoes-tabela">
                                        <button class="btn-acao-tabela btn-editar-func" data-id="${f.id}" title="Editar Componente">✏️</button>
                                        <button class="btn-acao-tabela btn-excluir-func" data-id="${f.id}" title="Remover do Escopo">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}
