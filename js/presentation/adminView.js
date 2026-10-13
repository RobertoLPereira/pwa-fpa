import { ApiServiceFpa } from '../data/services/api_service.js';
import { renderSubAbasAdmin, renderAbaFatores, renderAbaBackups } from './componentes/adminComponentes.js';
import { renderFormularioTipoFuncao, renderTabelaTiposFuncao } from './componentes/tipofuncaofpaComponentes.js';
import { renderFormularioTecnologia, renderTabelaTecnologias } from './componentes/tecnologiaComponentes.js';
/**
 * View Principal do Painel de Administração (Equivalente ao AdminPage do Flutter)
 * Orquestra as sub-abas internas de configuração e rotinas fail-safe de backup.
 */
export class AdminView {
    constructor(viewManagerContexto) {
        this.api = new ApiServiceFpa();
        this.contexto = viewManagerContexto; // Acesso ao projetoIdAtivo global
        this.containerId = 'conteudo-principal';
        
        // Estado local de controle das sub-abas internas
        this.estadoLocal = {
            subAbaAtiva: 'fatores', // 'fatores', 'tipos', 'tecnologias', 'backups'
            executandoBackup: false
        };
    }

    /**
     * Monta o esqueleto principal com a barra de abas estilo TabBar nativo
     */
    async renderizar() {
        const container = document.getElementById(this.containerId);
        
        // Desenha a casca estrutural com o TabBar
        container.innerHTML = renderSubAbasAdmin(this.estadoLocal.subAbaAtiva);

        // Configura o escutador de cliques do TabBar nativo
        const tabBar = container.querySelector('.sub-tab-bar-fpa');
        if (tabBar) {
            tabBar.addEventListener('click', async (e) => {
                const botao = e.target.closest('.sub-tab-item');
                if (!botao) return;

                this.estadoLocal.subAbaAtiva = botao.getAttribute('data-subaba');
                
                // Reaplica a casca com o estado ativo atualizado
                await this.renderizar();
            });
        }

        // Direciona o fluxo para renderizar o miolo da sub-aba selecionada
        await this.renderizarConteudoSubAba();
    }

    /**
     * Controla o fluxo de renderização assíncrona do miolo de cada sub-aba
     */
    async renderizarConteudoSubAba() {
        const subContainer = document.getElementById('sub-conteudo-admin');
        if (!subContainer) return;

        const projetoId = this.contexto.estado.projetoIdAtivo;

        switch (this.estadoLocal.subAbaAtiva) {
            case 'fatores':
                subContainer.innerHTML = '<div class="carregando-inicial" style="height:100px;">Buscando fatores do SQLite...</div>';
                try {
                    const resposta = await this.api.obterFatoresPorProjeto(projetoId);
                    // Desembrulha caso venha envelopado em um nó "dados"
                    const listaFatores = resposta.dados || resposta || [];
                    
                    subContainer.innerHTML = renderAbaFatores(listaFatores);
                    this.configurarEventosFatores();
                } catch (erro) {
                    subContainer.innerHTML = '<p style="color:#DC2626; font-size:12px;">⚠️ Falha ao ler fatores: ' + erro.message + '</p>';
                }
                break;

            case 'backups':
                subContainer.innerHTML = '<div class="carregando-inicial" style="height:100px;">Buscando snapshots no Python...</div>';
                try {
                    const listaBackups = await this.api.listarBackups();
                    subContainer.innerHTML = renderAbaBackups(listaBackups, this.estadoLocal.executandoBackup);
                    this.configurarEventosBackups();
                } catch (erro) {
                    subContainer.innerHTML = '<p style="color:#DC2626; font-size:12px;">⚠️ Falha ao ler snapshots: ' + erro.message + '</p>';
                }
                break;

            case 'tipos':
                subContainer.innerHTML = '<div class="carregando-inicial" style="height:100px;">Buscando tipos funcionais no fpa.db...</div>';
                try {
                    const tiposCadastrados = await this.api.listarTiposFuncao();
                    
                    subContainer.innerHTML = `
                        <div class="painel-fpa-grid" style="grid-template-columns: 320px 1fr; gap: 24px;">
                            <div id="container-form-tipo">
                                ` + renderFormularioTipoFuncao(this.estadoLocal.tipoDadosEmEdicao, this.estadoLocal.categoriaSelecionada) + `
                            </div>
                            <div class="card-fpa" style="background-color: white;">
                                <h4 style="font-size: 15px; font-weight: bold; color: #0F172A; margin-bottom: 12px;">Tipos Cadastrados no Sistema</h4>
                                <div id="container-tabela-tipo">
                                    ` + renderTabelaTiposFuncao(tiposCadastrados) + `
                                </div>
                            </div>
                        </div>
                    `;
                    
                    this.configurarEventosTiposFuncao(tiposCadastrados);
                } catch (erro) {
                    subContainer.innerHTML = '<p style="color:#DC2626; font-size:12px;">⚠️ Falha ao processar tipos funcionais: ' + erro.message + '</p>';
                }
                break;

           case 'tecnologias':
                subContainer.innerHTML = '<div class="carregando-inicial" style="height:100px;">Buscando fatores de produtividade no SQLite...</div>';
                try {
                    const listaTecnologias = await this.api.listarTecnologias();
                    
                    subContainer.innerHTML = `
                        <div class="painel-fpa-grid" style="grid-template-columns: 320px 1fr; gap: 24px;">
                            <div id="container-form-tecnologia">
                                ` + renderFormularioTecnologia(this.estadoLocal.tecDadosEmEdicao) + `
                            </div>
                            <div class="card-fpa" style="background-color: white;">
                                <h4 style="font-size: 15px; font-weight: bold; color: #0F172A; margin-bottom: 12px;">Fatores de Produtividade Cadastrados</h4>
                                <div id="container-tabela-tecnologia">
                                    ` + renderTabelaTecnologias(listaTecnologias) + `
                                </div>
                            </div>
                        </div>
                    `;
                    
                    this.configurarEventosTecnologias(listaTecnologias);
                } catch (erro) {
                    subContainer.innerHTML = '<p style="color:#DC2626; font-size:12px;">⚠️ Falha ao processar fatores de tecnologia: ' + erro.message + '</p>';
                }
                break;
        }
    }

    /**
     * Configura os Sliders com o mecanismo de Persistência Otimista Imediata
     */
    configurarEventosFatores() {
        const subContainer = document.getElementById('sub-conteudo-admin');
        const sliders = subContainer.querySelectorAll('.slider-fpa-nativo');
        const projetoId = this.contexto.estado.projetoIdAtivo;

        sliders.forEach(slider => {
            slider.addEventListener('change', async (e) => {
                const nomeFator = e.target.getAttribute('data-nome');
                const novaNota = parseInt(e.target.value, 10);

                // 🚀 PERSISTÊNCIA OTIMISTA: Atualiza o indicador visual na hora, antes da resposta do servidor
                const badge = e.target.previousElementSibling.querySelector('span');
                if (badge) badge.textContent = 'Nível ' + novaNota;

                console.log('⚡ Persistência otimista disparada para ' + nomeFator + ' -> Nível ' + novaNota);

                const sucesso = await this.api.atualizarNotaFator(projetoId, nomeFator, novaNota);
                if (!sucesso) {
                    alert('❌ Falha ao salvar alteração no banco fpa.db. Recarregando estado estável...');
                    await this.renderizarConteudoSubAba(); // Dá rollback para o estado anterior do banco se falhar
                }
            });

            // Atualização contínua do texto ao arrastar o Slider no celular/mouse
            slider.addEventListener('input', (e) => {
                const badge = e.target.previousElementSibling.querySelector('span');
                if (badge) badge.textContent = 'Nível ' + e.target.value;
            });
        });
    }

    /**
     * Configura as ações assíncronas de criar e restaurar snapshots da Railway
     */
    configurarEventosBackups() {
        const subContainer = document.getElementById('sub-conteudo-admin');
        const btnBackup = document.getElementById('btn-disparar-backup');
        const botoesRestore = subContainer.querySelectorAll('.btn-restore-snapshot');

        // Gatilho para Disparar Novo Snapshot
        if (btnBackup) {
            btnBackup.addEventListener('click', async () => {
                this.estadoLocal.executandoBackup = true;
                await this.renderizarConteudoSubAba(); // Força o loader a aparecer na tela

                const sucesso = await this.api.criarBackup();
                this.estadoLocal.executandoBackup = false;

                if (sucesso) {
                    alert('📦 Snapshot de segurança gerado com sucesso no diretório do Python!');
                } else {
                    alert('❌ Erro ao processar rotina de backup preventivo.');
                }
                await this.renderizarConteudoSubAba(); // Recarrega a lista reativamente
            });
        }

        // Gatilho Fail-Safe para Confirmar Restauração de Banco
        botoesRestore.forEach(btn => {
            btn.addEventListener('click', async () => {
                const arquivo = btn.getAttribute('data-arquivo');
                
                const msgConfirmacao = 'Deseja carregar o snapshot "' + arquivo + '"?\n\n⚠️ NOTA DE SEGURANÇA: O backend gerará um backup preventivo automático antes de sobrescrever o fpa.db ativo.';
                
                if (confirm(msgConfirmacao)) {
                    subContainer.innerHTML = '<div class="carregando-inicial" style="height:100px;">Executando restauração fail-safe...</div>';
                    
                    const sucesso = await this.api.restaurarBackup(arquivo);
                    if (sucesso) {
                        alert('🛡️ Banco de dados restaurado com sucesso!');
                    } else {
                        alert('❌ Falha ao aplicar restauração do snapshot.');
                    }
                    await this.renderizarConteudoSubAba();
                }
            });
        });
    }
    configurarEventosTiposFuncao(tiposCadastrados) {
        const form = document.getElementById('form-tipo-funcao');
        const selectCat = document.getElementById('tipo-categoria');
        const btnCancelar = document.getElementById('btn-cancelar-tipo');

        // Escuta alteração do dropdown de categoria
        if (selectCat) {
            selectCat.addEventListener('change', (e) => {
                this.estadoLocal.categoriaSelecionada = e.target.value;
            });
        }

        // Evento para Cancelar a Edição ativa
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => {
                this.limparFormularioTipo();
                this.renderizarConteudoSubAba();
            });
        }

        // Submissão assíncrona (POST / PUT)
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const dados = {
                    sigla: document.getElementById('tipo-sigla').value.trim().toUpperCase(),
                    nome_extenso: document.getElementById('tipo-nome-extenso').value.trim(),
                    categoria: this.estadoLocal.categoriaSelecionada
                };

                let sucesso = false;
                if (this.estadoLocal.idTipoEmEdicao === null) {
                    sucesso = await this.api.cadastrarTipoFuncao(dados);
                } else {
                    sucesso = await this.api.atualizarTipoFuncao(this.estadoLocal.idTipoEmEdicao, dados);
                }

                if (sucesso) {
                    this.limparFormularioTipo();
                    await this.renderizarConteudoSubAba();
                    alert('🔹 Configuração de tipo salva com sucesso!');
                } else {
                    alert('❌ Erro ao persistir tipo funcional no SQLite.');
                }
            });
        }

        // Escuta os botões de Ações da Tabela (Editar)
        const botoesEditar = document.querySelectorAll('.btn-editar-tipo');
        botoesEditar.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'), 10);
                const tipoSelecionado = tiposCadastrados.find(t => t.id === id);

                if (tipoSelecionado) {
                    this.estadoLocal.idTipoEmEdicao = id;
                    this.estadoLocal.tipoDadosEmEdicao = tipoSelecionado;
                    this.estadoLocal.categoriaSelecionada = tipoSelecionado.categoria;

                    this.renderizarConteudoSubAba(); // Recarrega os inputs preenchidos
                }
            });
        });

        // Escuta os botões de Ações da Tabela (Excluir com Fail-safe)
        const botoesExcluir = document.querySelectorAll('.btn-excluir-tipo');
        botoesExcluir.forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.getAttribute('data-id'), 10);

                if (confirm('⚠️ Deseja remover este tipo funcional do ecossistema?')) {
                    const sucesso = await this.api.deletarTipoFuncao(id);
                    if (sucesso) {
                        await this.renderizarConteudoSubAba();
                        alert('🔹 Tipo funcional removido do ecossistema.');
                    } else {
                        alert('❌ Erro: Existem funções de escopo mapeadas utilizando este Tipo.');
                    }
                }
            });
        });
    }

    limparFormularioTipo() {
        this.estadoLocal.idTipoEmEdicao = null;
        this.estadoLocal.tipoDadosEmEdicao = null;
        this.estadoLocal.categoriaSelecionada = 'Dados';
    }
    /**
     * Orquestra os cliques, exclusões assíncronas e edições do CRUD de Tecnologias
     */
    configurarEventosTecnologias(listaTecnologias) {
        const form = document.getElementById('form-tecnologia');
        const btnCancelar = document.getElementById('btn-cancelar-tec');

        // Evento Cancelar Edição
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => {
                this.limparFormularioTecnologia();
                this.renderizarConteudoSubAba();
            });
        }

        // Submissão assíncrona (POST / PUT)
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Envio estruturado em conformidade com as colunas reais do SQLite
                const dados = {
                    nome: document.getElementById('tec-nome').value.trim(),
                    produtividade_desenvolvimento: parseFloat(document.getElementById('tec-dev').value) || 0.0,
                    produtividade_manutencao: parseFloat(document.getElementById('tec-manut').value) || 0.0
                };

                let resultado = "";
                if (this.estadoLocal.idTecEmEdicao === null) {
                    resultado = await this.api.cadastrarTecnologia(dados);
                } else {
                    resultado = await this.api.atualizarTecnologia(this.estadoLocal.idTecEmEdicao, dados);
                }

                if (resultado === "sucesso") {
                    this.limparFormularioTecnologia();
                    await this.renderizarConteudoSubAba();
                    alert('🔹 Configuração de tecnologia salva com sucesso!');
                } else {
                    alert('⚠️ ' + resultado);
                }
            });
        }

        // Escuta ações de clique na tabela (Preparar Edição)
        const botoesEditar = document.querySelectorAll('.btn-editar-tec');
        botoesEditar.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'), 10);
                const tecSelecionada = listaTecnologias.find(t => t.id === id);

                if (tecSelecionada) {
                    this.estadoLocal.idTecEmEdicao = id;
                    this.estadoLocal.tecDadosEmEdicao = tecSelecionada;
                    this.renderizarConteudoSubAba();
                }
            });
        });

        // Escuta ações de clique na tabela (Excluir com Fail-safe estruturado)
        const botoesExcluir = document.querySelectorAll('.btn-excluir-tec');
        botoesExcluir.forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.getAttribute('data-id'), 10);

                if (confirm('⚠️ Deseja remover esta tecnologia do ecossistema comercial?')) {
                    const sucesso = await this.api.deletarTecnologia(id);
                    if (sucesso) {
                        await this.renderizarConteudoSubAba();
                        alert('🔹 Tecnologia removida.');
                    } else {
                        alert('❌ Erro: Existem projetos vinculados a esta tecnologia no banco de dados.');
                    }
                }
            });
        });
    }

    limparFormularioTecnologia() {
        this.estadoLocal.idTecEmEdicao = null;
        this.estadoLocal.tecDadosEmEdicao = null;
    }
}
