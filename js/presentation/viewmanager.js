import { CronogramaView } from './cronogramaView.js';
import { ProjetosView } from './projetosView.js';
import { FuncoesView } from './funcoesView.js';
import { DashboardView } from './dashboardView.js';
import { AdminView } from './adminView.js';
/**
 * Gerenciador de Views Centralizado (Equivalente ao MainNavigationShell do Flutter)
 * Controla o estado da aba ativa, o projeto selecionado e a injeção reativa de componentes.
 */
export class ViewManager {
    constructor() {
        // Estado Global do Frontend PWA (Preservando IDs estáveis da Memória Técnica)
        this.estado = {
            projetoIdAtivo: 1,
            nomeProjetoAtivo: "Selecione um Projeto",
            abaAtiva: "projetos"
        };

        // Cache de seletores do DOM para máxima performance
        this.dom = {
            menuNavegacao: document.querySelector('.navigation-menu'),
            conteudoPrincipal: document.getElementById('conteudo-principal'),
            projetoAtivoDisplay: document.getElementById('projeto-ativo-display')
        };
    }

    /**
     * Inicializa os escutadores de eventos globais do sistema
     */
    inicializar() {
        if (!this.dom.menuNavegacao || !this.dom.conteudoPrincipal) {
            console.error("Erro crítico: Infraestrutura HTML do index.html não localizada.");
            return;
        }

        // 1. Configura o escutador de cliques no menu de abas (Equivalente ao onDestinationSelected)
        this.dom.menuNavegacao.addEventListener('click', (evento) => {
            const botao = evento.target.closest('.nav-item');
            if (!botao) return;

            const novaAba = botao.getAttribute('data-aba');
            this.chavearAba(novaAba);
        });

        // 2. Registra um evento customizado global para escutar a troca de projetos de qualquer sub-view
        window.addEventListener('fpaProjetoAlterado', (evento) => {
            const { id, nome } = evento.detail;
            this.atualizarProjetoAtivo(id, nome);
        });

        // 3. Carrega a view inicial padrão
        this.chavearAba(this.estado.abaAtiva);
    }

    /**
     * Atualiza o projeto ativo no topo do app e força o refresh da aba atual
     */
    atualizarProjetoAtivo(id, nome) {
        this.estado.estadoAlterado = true;
        this.estado.projetoIdAtivo = id;
        this.estado.nomeProjetoAtivo = nome;

        // Atualiza a AppBar superior com tratamento contra estouros visuais
        if (this.dom.projetoAtivoDisplay) {
            this.dom.projetoAtivoDisplay.textContent = nome;
            this.dom.projetoAtivoDisplay.title = nome; // Tooltip nativo
        }

        console.log(`🔹 Projeto ativo sincronizado: ID ${id} - ${nome}`);
        
        // Força a aba atual a se renderizar novamente com os novos dados do SQLite
        this.renderizarViewAtual();
    }

    /**
     * Gerencia a transição visual das abas e dispara a renderização
     */
    chavearAba(nomeAba) {
        this.estado.abaAtiva = nomeAba;

        // Atualiza o estado visual ativo dos botões no menu (Equivalente ao activeColor do Flutter)
        const botoes = this.dom.menuNavegacao.querySelectorAll('.nav-item');
        botoes.forEach(btn => {
            if (btn.getAttribute('data-aba') === nomeAba) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Executa a renderização do componente correspondente
        this.renderizarViewAtual();
    }

    /**
     * Injeta dinamicamente a view correspondente dentro do container principal
     */
    async renderizarViewAtual() {
        // Exibe um estado de carregamento elegante enquanto o JavaScript monta a tela
        this.dom.conteudoPrincipal.innerHTML = `
            <div class="carregando-inicial">
                <span style="font-size: 13px; color: #64748B;">Carregando dados do SQLite...</span>
            </div>
        `;

        try {
            // Chaveamento dinâmico baseado na aba ativa (Equivalente à lista de telas do Flutter)
            switch (this.estado.abaAtiva) {
                case 'projetos':
                    // INSTANCIAÇÃO REAL: Passa o contexto mestre do ViewManager para a tela carregar os estados
                    const viewProjetos = new ProjetosView(this);
                    await viewProjetos.renderizar();
                    break;
                case 'dashboard':
                    const viewDashboard = new DashboardView(this);
                    await viewDashboard.renderizar();
                    break;
               case 'horas':
                    const viewFuncoes = new FuncoesView(this);
                    await viewFuncoes.renderizar();
                    break;
                case 'cronograma':
                    const viewCronograma = new CronogramaView(this);
                    await viewCronograma.renderizar();
                    break;
                case 'admin':
                    const viewAdmin = new AdminView(this);
                    await viewAdmin.renderizar();
                    break;
                default:
                    this.dom.conteudoPrincipal.innerHTML = `<div class="card-fpa"><h2>Aba não encontrada</h2></div>`;
            }

        } catch (erro) {
            this.dom.conteudoPrincipal.innerHTML = `
                <div class="card-fpa" style="border-color: #FEE2E2; background-color: #FEF2F2;">
                    <h3 style="color: #991B1B; font-size: 14px;">Erro ao carregar a View</h3>
                    <p style="color: #B91C1C; font-size: 12px; margin-top: 4px;">${erro.message}</p>
                </div>
            `;
        }
    }
}
