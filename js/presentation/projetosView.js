import { ApiServiceFpa } from '../data/services/api_service.js';
import { renderFormularioProjeto, renderListaProjetos } from './componentes/projetoComponentes.js';

/**
 * View de Projetos e Escopo Comercial (Equivalente ao ProjetosPage do Flutter)
 * Controla os eventos de clique, validação de formulários e renderização de dados vivos.
 */
export class ProjetosView {
    constructor(viewManagerContexto) {
        this.api = new ApiServiceFpa();
        this.contexto = viewManagerContexto; // Acesso ao estado global do app (projetoIdAtivo, etc.)
        this.containerId = 'conteudo-principal';
        this.projetos = [];
        this.tecnologias = [];
        this.projetoEmEdicao = null; // null = Modo Cadastro, populado = Modo Edição
    }

    /**
     * Ponto de entrada chamado pelo ViewManager para desenhar a tela
     */
    async renderizar() {
        const container = document.getElementById(this.containerId);
        
        // Estrutura a Row mestre adaptativa em Grid
        container.innerHTML = `
            <div class="painel-fpa-grid">
                <div class="coluna-formulario" id="fpa-col-formulario">
                    <div class="card-fpa" id="fpa-formulario-container">Carregando formulário...</div>
                </div>
                <div class="coluna-listagem" id="fpa-col-listagem">
                    <div class="card-fpa" id="fpa-lista-container">Carregando projetos...</div>
                </div>
            </div>
        `;

        // Executa cargas do banco fpa.db em concorrência de rede
        await this.carregarDadosEcossistema();
    }

    /**
     * Carrega tabelas do SQLite em paralelo e renderiza os subcomponentes internos
     */
    async carregarDadosEcossistema() {
        const formularioContainer = document.getElementById('fpa-formulario-container');
        const listaContainer = document.getElementById('fpa-lista-container');

        try {
            const [dadosProjetos, dadosTecnologias] = await Promise.all([
                this.api.listarProjetos(),
                this.api.listarTecnologias()
            ]);

            this.projetos = dadosProjetos || [];
            this.tecnologias = dadosTecnologias || [];

            // Injeção reativa atômica
            formularioContainer.innerHTML = renderFormularioProjeto(this.projetoEmEdicao, this.tecnologias);
            listaContainer.innerHTML = renderListaProjetos(this.projetos, this.contexto.estado.projetoIdAtivo);
            
            this.configurarFormulario();
            this.configurarCliquesEEdicao();
        } catch (erro) {
            listaContainer.innerHTML = `
                <p style="color: #991B1B; font-size: 12px; font-weight: bold;">
                    ⚠️ Erro ao sincronizar tabelas com o SQLite: ${erro.message}
                </p>
            `;
        }
    }

    /**
     * Escuta os eventos de clique delegados na listagem lateral (Seleção e Edição)
     */
    configurarCliquesEEdicao() {
        const listaContainer = document.getElementById('fpa-lista-container');
        const formularioContainer = document.getElementById('fpa-formulario-container');
        
        // Clique na área de seleção do projeto ativo
        const areasSelecao = listaContainer.querySelectorAll('.area-clique-selecao');
        areasSelecao.forEach(area => {
            area.addEventListener('click', () => {
                const cardPai = area.closest('.item-projeto-card');
                const id = parseInt(cardPai.getAttribute('data-id'), 10);
                const nome = cardPai.getAttribute('data-nome');

                // Dispara o evento reativo global para sincronismo do PWA
                window.dispatchEvent(new CustomEvent('fpaProjetoAlterado', {
                    detail: { id: id, nome: nome }
                }));
            });
        });

        // Clique no gatilho de ativação do Modo de Edição
        const botoesEditar = listaContainer.querySelectorAll('.btn-acao-editar');
        botoesEditar.forEach(botao => {
            botao.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(botao.getAttribute('data-id'), 10);
                const projetoOriginal = this.projetos.find(p => Number(p.id) === Number(id));
                
                if (projetoOriginal) {
                    this.projetoEmEdicao = { ...projetoOriginal };
                    // Atualiza apenas o bloco do formulário mantendo o estado
                    formularioContainer.innerHTML = renderFormularioProjeto(this.projetoEmEdicao, this.tecnologias);
                    this.configurarFormulario();
                }
            });
        });

        // Clique no cancelamento do estado de edição
        const btnCancelar = document.getElementById('btn-cancelar-edicao');
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => {
                this.projetoEmEdicao = null;
                formularioContainer.innerHTML = renderFormularioProjeto(this.projetoEmEdicao, this.tecnologias);
                this.configurarFormulario();
            });
        }
    }

    /**
     * Processa a validação e o envio do formulário padrão (POST / PUT)
     */
        /**
     * Processa a validação e o envio do formulário padrão (POST / PUT)
     */
    configurarFormulario() {
        const form = document.getElementById('form-projeto');
        if (!form) return;

        form.addEventListener('submit', async (evento) => {
            evento.preventDefault(); // Impede o recarregamento total da página HTML
            const idEdicao = form.getAttribute('data-id');

            // Captura limpa dos inputs nativos
            const dadosPayload = {
                nome_projeto: document.getElementById('proj-nome').value,
                numero_projeto: document.getElementById('proj-numero').value,
                data_elaboracao: document.getElementById('proj-data').value,
                gerente_projeto: document.getElementById('proj-gerente').value,
                responsavel: document.getElementById('proj-responsavel').value,
                tecnologia_id: parseInt(document.getElementById('proj-tecnologia-id').value, 10),
                tipo_atividade: document.getElementById('proj-tipo-atividade').value,
                valor_ponto_funcao: parseFloat(document.getElementById('proj-valor').value) || 89.44,
                ajuste_adicional: parseFloat(document.getElementById('proj-ajuste').value) || 0.65
            };

            let sucesso = false;

            if (idEdicao && idEdicao !== "") {
                // Modo Edição: Invoca o novo método adicionado ao serviço
                sucesso = await this.api.atualizarProjeto(idEdicao, dadosPayload);
                this.projetoEmEdicao = null;
            } else {
                // Modo Criação: Utiliza o método original do projeto
                sucesso = await this.api.cadastrarProjeto(dadosPayload);
            }

            if (sucesso) {
                form.reset(); // Limpa os campos do formulário
                await this.carregarDadosEcossistema(); // Recarga dinâmica instantânea das tabelas e selects
                alert('🔹 Operação realizada no banco fpa.db com sucesso!');
                
                // Se o projeto editado for o ativo corrente, força o app a se atualizar por completo
                if (idEdicao && Number(idEdicao) === Number(this.contexto.estado.projetoIdAtivo)) {
                    window.dispatchEvent(new CustomEvent('fpaProjetoAlterado', {
                        detail: { id: this.contexto.estado.projetoIdAtivo, nome: dadosPayload.nome_projeto }
                    }));
                }
            } else {
                alert('❌ Erro ao persistir alterações do escopo no SQLite.');
            }
        });
    
    }
}
