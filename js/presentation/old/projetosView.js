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
    }

    /**
     * Ponto de entrada chamado pelo ViewManager para desenhar a tela
     */
    async renderizar() {
        const container = document.getElementById(this.containerId);
        
        // Estrutura a Row mestre adaptativa (flex: 4 e 3 do Flutter espelhado em Grid CSS)
        container.innerHTML = `
            <div class="painel-fpa-grid">
                <div class="coluna-formulario" id="fpa-col-formulario">
                    <div class="card-fpa">${renderFormularioProjeto()}</div>
                </div>
                <div class="coluna-listagem" id="fpa-col-listagem">
                    <div class="card-fpa" id="fpa-lista-container">Carregando projetos...</div>
                </div>
            </div>
        `;

        // Ativa os gatilhos e escutadores de dados logo após injetar o esqueleto HTML
        this.configurarFormulario();
        await this.atualizarListagemProjetos();
    }

    /**
     * Busca os dados reais do SQLite e renderiza o componente de lista lateral
     */
    async atualizarListagemProjetos() {
        const listaContainer = document.getElementById('fpa-lista-container');
        try {
            const projetos = await this.api.listarProjetos();
            
            // Injeta o componente visual puro passando o ID ativo mantido no contexto
            listaContainer.innerHTML = renderListaProjetos(projetos, this.contexto.estado.projetoIdAtivo);
            
            this.configurarCliquesNaLista();
        } catch (erro) {
            listaContainer.innerHTML = `
                <p style="color: #991B1B; font-size: 12px; font-weight: bold;">
                    ⚠️ Erro ao carregar projetos do SQLite: ${erro.message}
                </p>
            `;
        }
    }

    /**
     * Escuta a seleção de projeto do usuário e sincroniza reativamente com todo o PWA
     */
    configurarCliquesNaLista() {
        const container = document.getElementById('fpa-lista-container');
        const itens = container.querySelectorAll('.item-projeto-card');

        itens.forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.getAttribute('data-id'), 10);
                const nome = item.getAttribute('data-nome');

                // Dispara o evento reativo global que o ViewManager está escutando na index.html
                window.dispatchEvent(new CustomEvent('fpaProjetoAlterado', {
                    detail: { id: id, nome: nome }
                }));
            });
        });
    }

    /**
     * Escuta a validação e o envio do formulário padrão da planilha
     */
    configurarFormulario() {
        const form = document.getElementById('form-projeto');
        if (!form) return;

        form.addEventListener('submit', async (evento) => {
            evento.preventDefault(); // Impede o recarregamento total da página HTML

            // Captura limpa dos inputs nativos
            const dados = {
                nome_projeto: document.getElementById('proj-nome').value,
                numero_projeto: document.getElementById('proj-numero').value,
                data_elaboracao: document.getElementById('proj-data').value,
                gerente_projeto: document.getElementById('proj-gerente').value,
                responsavel: document.getElementById('proj-responsavel').value,
                valor_ponto_funcao: parseFloat(document.getElementById('proj-valor').value) || 89.44,
                ajuste_adicional: parseFloat(document.getElementById('proj-ajuste').value) || 0.65,
                tecnologia_id: 1, // Tecnologia padrão inicial
                tipo_atividade: 'Desenvolvimento'
            };

            const sucesso = await this.api.cadastrarProjeto(dados);
            if (sucesso) {
                form.reset(); // Limpa os campos do formulário
                await this.atualizarListagemProjetos(); // Recarrega reativamente sem quebras
                alert('🔹 Projeto cadastrado no banco fpa.db com sucesso!');
            } else {
                alert('❌ Erro ao persistir projeto no SQLite.');
            }
        });
    }
}
