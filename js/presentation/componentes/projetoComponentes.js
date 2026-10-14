/**
 * Componentes Visuais Puros para o Módulo de Projetos
 * Gera estruturas de formulários e listagens adaptativas (Sem dependências externas).
 */

/**
 * Renderiza as opções do select de tecnologias de forma segura
 */
export function renderTecnologiaOptions(tecnologias, selecionadoId = null) {
    let html = '<option value="">Selecione uma Tecnologia...</option>';
    if (!tecnologias || tecnologias.length === 0) return html;

    for (let i = 0; i < tecnologias.length; i++) {
        const t = tecnologias[i];
        const isSelected = Number(t.id) === Number(selecionadoId) ? ' selected' : '';
        html += '<option value="' + t.id + '"' + isSelected + '>' + t.nome + '</option>';
    }
    return html;
}

/**
 * Renderiza o Formulário de Escopo (Suporta Novo e Edição Crítica)
 */
export function renderFormularioProjeto(projeto = null, tecnologias = []) {
    const isEdit = projeto !== null;
    const id = isEdit ? projeto.id : '';
    const nome = isEdit ? projeto.nome_projeto : '';
    const numero = isEdit ? (projeto.numero_projeto || '') : '';
    const data = isEdit ? (projeto.data_elaboracao || '') : '';
    const gerente = isEdit ? (projeto.gerente_projeto || '') : '';
    const resp = isEdit ? (projeto.responsavel || '') : '';
    const valorPf = isEdit ? projeto.valor_ponto_funcao : '89.44';
    const ajuste = isEdit ? projeto.ajuste_adicional : '0.65';
    const tecId = isEdit ? projeto.tecnologia_id : '';
    const tipo = isEdit ? projeto.tipo_atividade : 'Desenvolvimento';

    const tituloForm = isEdit ? 'Editar Escopo de Projeto (ID: ' + id + ')' : 'Novo Escopo de Projeto (FPA)';
    const textoBotao = isEdit ? '💾 Salvar Alterações' : '💾 Salvar Escopo Comercial';
    
    const selectTecnologiasHTML = renderTecnologiaOptions(tecnologias, tecId);

    let html = '<form id="form-projeto" class="form-fpa-nativo" data-id="' + id + '">';
    html += '<h3 style="font-size: 15px; font-weight: bold; color: #0F172A; margin-bottom: 16px;">' + tituloForm + '</h3>';
    
    // Nome do Projeto
    html += '<div class="campo-grupo">';
    html += '<label>Nome do Projeto *</label>';
    html += '<input type="text" id="proj-nome" required value="' + nome + '" placeholder="Ex: Sistema de Gestão Comercial">';
    html += '</div>';

    // Número e Data
    html += '<div class="linha-adaptativa">';
    html += '<div class="campo-grupo">';
    html += '<label>Número do Projeto / OS</label>';
    html += '<input type="text" id="proj-numero" required value="' + numero + '">';
    html += '</div>';
    html += '<div class="campo-grupo">';
    html += '<label>Data Elaboração (YYYY-MM-DD)</label>';
    html += '<input type="date" id="proj-data" required value="' + data + '">';
    html += '</div>';
    html += '</div>';

    // Gerente e Responsável
    html += '<div class="linha-adaptativa">';
    html += '<div class="campo-grupo">';
    html += '<label>Gerente do Projeto</label>';
    html += '<input type="text" id="proj-gerente" required value="' + gerente + '">';
    html += '</div>';
    html += '<div class="campo-grupo">';
    html += '<label>Responsável Técnico</label>';
    html += '<input type="text" id="proj-responsavel" required value="' + resp + '">';
    html += '</div>';
    html += '</div>';

    // REVISÃO CRÍTICA: Integração de Tecnologia Dinâmica do fpa.db e Tipo de Atividade
    html += '<div class="linha-adaptativa">';
    html += '<div class="campo-grupo">';
    html += '<label>Tecnologia Principal *</label>';
    html += '<select id="proj-tecnologia-id" required style="width: 100%; padding: 8px; border: 1px solid #CBD5E1; border-radius: 6px;">' + selectTecnologiasHTML + '</select>';
    html += '</div>';
    html += '<div class="campo-grupo">';
    html += '<label>Tipo de Atividade *</label>';
    html += '<select id="proj-tipo-atividade" required style="width: 100%; padding: 8px; border: 1px solid #CBD5E1; border-radius: 6px;">';
    html += '<option value="Desenvolvimento"' + (tipo === 'Desenvolvimento' ? ' selected' : '') + '>Desenvolvimento</option>';
    html += '<option value="Manutenção"' + (tipo === 'Manutenção' ? ' selected' : '') + '>Manutenção</option>';
    html += '</select>';
    html += '</div>';
    html += '</div>';

    // Valores Financeiros / Multiplicadores
    html += '<div class="linha-adaptativa">';
    html += '<div class="campo-grupo">';
    html += '<label>Valor por PF (R$)</label>';
    html += '<input type="number" id="proj-valor" step="0.01" value="' + valorPf + '" required>';
    html += '</div>';
    html += '<div class="campo-grupo">';
    html += '<label>Ajuste Basal Fixo</label>';
    html += '<input type="number" id="proj-ajuste" step="0.01" value="' + ajuste + '" required>';
    html += '</div>';
    html += '</div>';

    // Botões de Ação
    html += '<div style="display: flex; gap: 10px; margin-top: 16px;">';
    if (isEdit) {
        html += '<button type="button" id="btn-cancelar-edicao" class="btn-fpa-secundario" style="width: 30%; background: #64748B; color: white; border: none; border-radius: 6px; cursor: pointer;">Cancelar</button>';
    }
    html += '<button type="submit" class="btn-fpa-primario" style="flex: 1;">' + textoBotao + '</button>';
    html += '</div>';

    html += '</form>';
    return html;
}

/**
 * Renderiza a lista lateral de projetos ativos
 */
export function renderListaProjetos(projetos, idAtivo) {
    if (!projetos || projetos.length === 0) {
        return '<p style="font-style: italic; color: #64748B; text-align: center; padding: 20px;">Nenhum projeto cadastrado no banco fpa.db ainda.</p>';
    }

    let html = '<h3 style="font-size: 15px; font-weight: bold; color: #0F172A; margin-bottom: 16px;">Selecione o Projeto Ativo</h3>';
    html += '<div class="lista-projetos-scroll" style="max-height: 400px; overflow-y: auto;">';
    
    for (let i = 0; i < projetos.length; i++) {
        const proj = projetos[i];
        const isSelecionado = Number(proj.id) === Number(idAtivo);
        const classeSelecionado = isSelecionado ? ' selecionado' : '';
        
        html += '<div class="item-projeto-card' + classeSelecionado + '" data-id="' + proj.id + '" data-nome="' + proj.nome_projeto + '" style="display: flex; align-items: center; justify-content: space-between; padding: 10px; margin-bottom: 8px; cursor: pointer; border-radius: 6px;">';
        
        // Área clicável de informações de seleção
        html += '<div class="area-clique-selecao" style="display: flex; align-items: center; flex: 1;">';
        html += '<div class="item-projeto-icone">' + (isSelecionado ? '🟢' : '📁') + '</div>';
        html += '<div class="item-projeto-infos" style="margin-left: 12px; flex: 1;">';
        html += '<div class="item-projeto-name" style="font-size: 13px; font-weight: bold; color: #0F172A;">' + proj.nome_projeto + '</div>';
        html += '<div class="item-projeto-gerente" style="font-size: 11px; color: #64748B;">Gerente: ' + (proj.gerente_projeto || 'Não Definido') + ' | Tipo: ' + proj.tipo_atividade + '</div>';
        html += '</div>';
        html += '</div>';

        // Botão dedicado para disparar a edição estrutural do escopo
        html += '<div style="display: flex; align-items: center; gap: 8px;">';
        html += '<button type="button" class="btn-acao-editar" data-id="' + proj.id + '" style="background: transparent; border: 1px solid #CBD5E1; border-radius: 4px; padding: 2px 6px; font-size: 11px; cursor: pointer; color: #334155;">✏️ Editar</button>';
        if (isSelecionado) {
            html += '<div class="item-projeto-check" style="color: #16A34A; font-size: 12px;">✅</div>';
        }
        html += '</div>';

        html += '</div>';
    }

    html += '</div>';
    return html;
}
