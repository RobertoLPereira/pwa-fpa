import { ApiServiceFpa } from '../data/services/api_service.js';
import { renderFormularioFuncao, renderTabelaFuncoes } from './componentes/funcaoComponentes.js';

/**
 * View de Gerenciamento de Funções do Escopo (Equivalente ao CrudFuncoesWidget do Flutter)
 * Orquestra as operações de CRUD, os estados de edição e a lógica de automação transacional.
 */
export class FuncoesView {
    constructor(viewManagerContexto) {
        this.api = new ApiServiceFpa();
        this.contexto = viewManagerContexto; // Acesso ao projetoIdAtivo
        this.containerId = 'conteudo-principal';
        
        // Estados locais de controle do formulário
        this.estadoLocal = {
            idFuncaoEmEdicao: null,
            funcaoDadosEmEdicao: null,
            tipoFuncaoIdSelecionado: 1,
            gerarCrudAutomatico: false
        };
    }

    /**
     * Renderiza a casca inicial do módulo de escopo FPA
     */
    async renderizar() {
        const container = document.getElementById(this.containerId);
        
        container.innerHTML = `
            <div class="card-fpa" id="container-form-funcao">
                <!-- O Formulário será injetado dinamicamente aqui -->
            </div>
            <div class="card-fpa" style="margin-top: 24px;">
                <h3 style="font-size: 13px; font-weight: bold; color: #64748B; text-transform: uppercase; margin-bottom: 12px;">
                    Componentes Funcionais Mapeados no Escopo Atual:
                </h3>
                <div id="container-tabela-funcoes">
                    <!-- A Tabela analítica com dados do SQLite será injetada aqui -->
                </div>
            </div>
        `;

        this.atualizarFormularioUI();
        await this.atualizarTabelaUI();
    }

    /**
     * Desenha o formulário baseado no estado local (Inserção ou Edição)
     */
    atualizarFormularioUI() {
        const formContainer = document.getElementById('container-form-funcao');
        
        formContainer.innerHTML = renderFormularioFuncao(
            this.estadoLocal.funcaoDadosEmEdicao,
            this.estadoLocal.tipoFuncaoIdSelecionado,
            this.estadoLocal.gerarCrudAutomatico
        );

        this.configurarEventosFormulario();
    }

    /**
     * Busca as funções do projeto ativo na Railway e renderiza na tabela
     */
    async atualizarTabelaUI() {
        const tabelaContainer = document.getElementById('container-tabela-funcoes');
        const projetoId = this.contexto.estado.projetoIdAtivo;

        try {
            const funcoes = await this.api.listarFuncoes(projetoId);
            tabelaContainer.innerHTML = renderTabelaFuncoes(funcoes);
            this.configurarEventosTabela();
        } catch (erro) {
            tabelaContainer.innerHTML = `
                <p style="color: #991B1B; font-size: 12px; font-weight: bold; padding: 16px;">
                    ⚠️ Erro ao carregar componentes do escopo: ${erro.message}
                </p>
            `;
        }
    }

    /**
     * Acopla as escutas de eventos nos inputs, selects e submissão do formulário
     */
    configurarEventosFormulario() {
        const form = document.getElementById('form-funcao');
        const selectTipo = document.getElementById('func-tipo-id');
        const checkAutomatizar = document.getElementById('func-automatizar');
        const btnCancelar = document.getElementById('btn-cancelar-edicao');

        // Escuta a mudança do Dropdown (Garante comportamento reativo do checkbox de CRUD para ALI)
        if (selectTipo) {
            selectTipo.addEventListener('change', (e) => {
                this.estadoLocal.tipoFuncaoIdSelecionado = parseInt(e.target.value, 10);
                
                // Exibe ou oculta a automação de forma reativa alterando as classes higiênicas
                const boxAutomacao = document.getElementById('container-automacao-crud');
                if (boxAutomacao) {
                    if (this.estadoLocal.tipoFuncaoIdSelecionado === 1 && !this.estadoLocal.idFuncaoEmEdicao) {
                        boxAutomacao.className = "automacao-crud-box exibir-bloco";
                    } else {
                        boxAutomacao.className = "automacao-crud-box ocultar-bloco";
                        this.estadoLocal.gerarCrudAutomatico = false;
                    }
                }
            });
        }

        // Sincroniza o clique do checkbox com o estado local
        if (checkAutomatizar) {
            checkAutomatizar.addEventListener('change', (e) => {
                this.estadoLocal.gerarCrudAutomatico = e.target.checked;
            });
        }

        // Escuta o botão de Cancelar Edição (Limpa os estados e volta para modo inclusão)
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => {
                this.limparEstadoFormulario();
                this.atualizarFormularioUI();
            });
        }

        // Submissão assíncrona do formulário
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const descricaoBase = document.getElementById('func-descricao').value.trim();
            const ar = parseInt(document.getElementById('func-ar').value, 10) || 0;
            const id = parseInt(document.getElementById('func-id').value, 10) || 0;
            const projetoId = this.contexto.estado.projetoIdAtivo;

            const dados = {
                projeto_id: projetoId,
                descricao: descricaoBase,
                tipo_funcao_id: this.estadoLocal.tipoFuncaoIdSelecionado,
                arquivos_referenciados: ar,
                itens_dados: id
            };

            let sucesso = false;

            if (this.estadoLocal.idFuncaoEmEdicao === null) {
                // 🚀 MODO CADASTRO
                sucesso = await this.api.cadastrarFuncao(dados);

                // Executa a persistência da regra de automação transacional se for ALI e marcado
                if (sucesso && this.estadoLocal.tipoFuncaoIdSelecionado === 1 && this.estadoLocal.gerarCrudAutomatico) {
                    // Cadastra EE de Manutenção automaticamente
                    await this.api.cadastrarFuncao({
                        projeto_id: projetoId,
                        descricao: `Inclusão/Alteração de ${descricaoBase}`,
                        tipo_funcao_id: 3,
                        arquivos_referenciados: 1,
                        itens_dados: id
                    });
                    // Cadastra CE de Consulta automaticamente
                    await this.api.cadastrarFuncao({
                        projeto_id: projetoId,
                        descricao: `Consulta de ${descricaoBase}`,
                        tipo_funcao_id: 5,
                        arquivos_referenciados: 1,
                        itens_dados: id
                    });
                }
            } else {
                // 📝 MODO ATUALIZAÇÃO
                sucesso = await this.api.atualizarFuncao(this.estadoLocal.idFuncaoEmEdicao, dados);
            }

            if (sucesso) {
                this.limparEstadoFormulario();
                this.atualizarFormularioUI();
                await this.atualizarTabelaUI();
                alert('🔹 Escopo de funções atualizado com sucesso no fpa.db!');
            } else {
                alert('❌ Erro ao persistir componente funcional no SQLite.');
            }
        });
    }

    /**
     * Acopla as escutas de eventos nos botões de Editar e Excluir de dentro das linhas da tabela
     */
    configurarEventosTabela() {
        const tabelaContainer = document.getElementById('container-tabela-funcoes');
        
        // Captura cliques no botão Editar
        const botoesEditar = tabelaContainer.querySelectorAll('.btn-editar-func');
        botoesEditar.forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.getAttribute('data-id'), 10);
                
                // Busca a lista atual para carregar os dados na memória do formulário
                const projetoId = this.contexto.estado.projetoIdAtivo;
                const funcoes = await this.api.listarFuncoes(projetoId);
                const funcaoSelecionada = funcoes.find(f => f.id === id);

                if (funcaoSelecionada) {
                    this.estadoLocal.idFuncaoEmEdicao = id;
                    this.estadoLocal.funcaoDadosEmEdicao = funcaoSelecionada;
                    // Mapeia o id do dropdown correspondente baseado no retorno textual do banco
                    let idDropdown = 1;
                    const sigla = funcaoSelecionada.sigla_tipo || funcaoSelecionada.tipo_funcao;
                    if (sigla === 'AIE') idDropdown = 2;
                    else if (sigla === 'EE') idDropdown = 3;
                    else if (sigla === 'SE') idDropdown = 4;
                    else if (sigla === 'CE') idDropdown = 5;

                    this.estadoLocal.tipoFuncaoIdSelecionado = idDropdown;
                    this.estadoLocal.gerarCrudAutomatico = false;

                    this.atualizarFormularioUI();
                }
            });
        });

        // Captura cliques no botão Excluir
        const botoesExcluir = tabelaContainer.querySelectorAll('.btn-excluir-func');
        botoesExcluir.forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.getAttribute('data-id'), 10);
                
                if (confirm('⚠️ Deseja realmente remover este componente funcional do escopo do projeto?')) {
                    const sucesso = await this.api.deletarFuncao(id);
                    if (sucesso) {
                        await this.atualizarTabelaUI();
                        alert('🗑️ Componente removido do escopo.');
                    } else {
                        alert('❌ Erro ao remover componente do SQLite.');
                    }
                }
            });
        });
};
}