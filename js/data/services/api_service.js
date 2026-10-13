import { baseUrl } from '../../core/ambiente.js';

/**
 * Serviço de Integração com o Backend Python FastAPI e SQLite (fpa.db)
 * Contratos de rede com passagem de ID como subrecurso no meio da URL preservados.
 */
export class ApiServiceFpa {

    // ==========================================================================
    // 🏢 1. MÓDULO DE PROJETOS (Equivalente ao ApiServiceProjeto)
    // ==========================================================================

    /**
     * Lista todos os projetos cadastrados em formato resumido para a barra lateral/celular
     */
    async listarProjetos() {
        const url = baseUrl + '/api/projetos';
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error('Erro ao listar projetos (' + resposta.status + ')');
            return await resposta.json();
        } catch (erro) {
            console.error("Erro no SQLite [listarProjetos]:", erro);
            throw erro;
        }
    }

    /**
     * Cadastra um novo projeto acionando o schema basal fixo
     */
    async cadastrarProjeto(dadosProjeto) {
        const url = baseUrl + '/api/projetos';
        try {
            const resposta = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosProjeto)
            });
            return resposta.ok;
        } catch (erro) {
            console.error("Erro no SQLite [cadastrarProjeto]:", erro);
            return false;
        }
    }

    // ==========================================================================
    // 📋 2. MÓDULO DE FUNÇÕES COMPONENTES FPA (Equivalente ao ApiServiceFuncao)
    // ==========================================================================

    /**
     * Busca todas as funções mapeadas passando o ID obrigatoriamente no MEIO da URL
     */
    async listarFuncoes(projetoId) {
        const url = baseUrl + '/api/projetos/' + projetoId + '/funcoes';
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error('Erro ao buscar funções do escopo (' + resposta.status + ')');
            return await resposta.json();
        } catch (erro) {
            console.error("Erro no SQLite [listarFuncoes]:", erro);
            throw erro;
        }
    }

    /**
     * Cadastra uma função de escopo disparando dinamicamente as TRIGGERs internas
     */
    async cadastrarFuncao(dadosFuncao) {
        const url = baseUrl + '/api/funcoes';
        try {
            const resposta = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosFuncao)
            });
            return resposta.ok;
        } catch (erro) {
            console.error("Erro no SQLite [cadastrarFuncao]:", erro);
            return false;
        }
    }

    /**
     * Atualiza uma função componente em edição pelo ID físico da subquery
     */
    async atualizarFuncao(funcaoId, dadosFuncao) {
        const url = baseUrl + '/api/funcoes/' + funcaoId;
        try {
            const resposta = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosFuncao)
            });
            return resposta.ok;
        } catch (erro) {
            console.error("Erro no SQLite [atualizarFuncao]:", erro);
            return false;
        }
    }

    /**
     * Deleta uma função removendo-a permanentemente do escopo técnico
     */
    async deletarFuncao(funcaoId) {
        const url = baseUrl + '/api/funcoes/' + funcaoId;
        try {
            const resposta = await fetch(url, { method: 'DELETE' });
            return resposta.ok;
        } catch (erro) {
            console.error("Erro no SQLite [deletarFuncao]:", erro);
            return false;
        }
    }

    // ==========================================================================
    // 📊 3. MÓDULO DE RELATÓRIOS E MATRIZES (Equivalente ao ApiServiceRelatorio)
    // ==========================================================================

    /**
     * Captura os dados calculados agregados (PF Bruto, Fator Ajuste, Valor Estimativa)
     */
    async buscarRelatorioFinal(projetoId) {
        const url = baseUrl + '/api/projetos/' + projetoId + '/fatores-detalhado';
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error('Erro ao consolidar relatório (' + resposta.status + ')');
            return await resposta.json();
        } catch (erro) {
            console.error("Erro no SQLite [buscarRelatorioFinal]:", erro);
            throw erro;
        }
    }

    /**
     * Busca a planilha com a Matriz Oficial cruzada de complexidades e pesos
     */
    async buscarMatrizContagem(projetoId) {
        const url = baseUrl + '/api/projetos/' + projetoId + '/matriz-calculo';
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error('Erro ao processar matriz cruzada (' + resposta.status + ')');
            return await resposta.json();
        } catch (erro) {
            console.error("Erro no SQLite [buscarMatrizContagem]:", erro);
            throw erro;
        }
    }

    /**
     * Busca os dados consolidados de fatiamento tridimensional de horas por fase da Railway
     */
    async obterPlanejamentoHoras(projetoId) {
        const url = baseUrl + '/api/projetos/' + projetoId + '/planejamento';
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error('Erro ao buscar planejamento (' + resposta.status + ')');
            return await resposta.json();
        } catch (erro) {
            console.error("Erro no SQLite [obterPlanejamentoHoras]:", erro);
            throw erro;
        }
    }
        // ==========================================================================
    // 🛡️ 4. MÓDULO DE BACKUPS (Contratos Corrigidos com /api/sistema)
    // ==========================================================================

    /**
     * Busca os 14 fatores de influência vinculados ao projeto ativo
     */
    async obterFatoresPorProjeto(projetoId) {
        const url = baseUrl + '/api/projetos/' + projetoId + '/fatores-detalhado';
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error('Erro ao ler fatores (' + resposta.status + ')');
            // Como unificamos, se o seu backend devolver envelopado, desembrulhamos o nó na view
            return await resposta.json();
        } catch (erro) {
            console.error("Erro no SQLite [obterFatoresPorProjeto]:", erro);
            throw erro;
        }
    }

    /**
     * Atualiza via persistência otimista a nota de um fator específico no banco
     */
    async atualizarNotaFator(projetoId, nomeFator, novaNota) {
        const url = baseUrl + '/api/fatores/atualizar';
        try {
            const resposta = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projeto_id: projetoId,
                    nome_fator: nomeFator,
                    nota: novaNota
                })
            });
            return resposta.ok;
        } catch (erro) {
            console.error("Erro na persistência otimista do fator:", erro);
            return false;
        }
    }
    /**
     * Lista os arquivos de snapshots retornados como Array de Strings simples do Python
     */
    async listarBackups() {
        const url = baseUrl + '/api/sistema/backups';
        try {
            const respuesta = await fetch(url);
            if (!respuesta.ok) throw new Error('Erro ao listar diretório (' + respuesta.status + ')');
            return await respuesta.json(); // Retorna o array de strings puro
        } catch (erro) {
            console.error("Erro no SQLite [listarBackups]:", erro);
            return [];
        }
    }

    /**
     * Dispara a criação de um snapshot de segurança com retorno Status 201
     */
    async criarBackup() {
        const url = baseUrl + '/api/sistema/backup';
        try {
            const resposta = await fetch(url, { 
                method: 'POST',
                headers: { 'accept': '*/*' }
            });
            return resposta.status === 201 || resposta.ok;
        } catch (erro) {
            console.error("Erro ao gerar snapshot no Python:", erro);
            return false;
        }
    }

    /**
     * Sobrescreve o banco ativo restaurando um arquivo de snapshot histórico
     */
    async restaurarBackup(nomeArquivo) {
        const url = baseUrl + '/api/sistema/restaurar'; // Ajuste para a sua rota exata de restore se necessário
        try {
            const respuesta = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ arquivo: nomeArquivo })
            });
            return resposta.ok;
        } catch (erro) {
            console.error("Erro no Restore do SQLite:", erro);
            return false;
        }
    }
        // ==========================================================================
    // ⚙️ 5. MÓDULO DE TIPOS FUNCIONAIS (Contratos com /api/tipofuncaofpa)
    // ==========================================================================

    /**
     * Lista todos os tipos funcionais do manual IFPUG direto do banco
     */
    async listarTiposFuncao() {
        const url = baseUrl + '/api/tipofuncaofpa';
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error('Erro ao listar tipos (' + resposta.status + ')');
            return await resposta.json();
        } catch (erro) {
            console.error("Erro no SQLite [listarTiposFuncao]:", erro);
            return [];
        }
    }

    /**
     * Cadastra um novo tipo funcional (ALI, EE, etc.) respeitando o CHECK de Categoria
     */
    async cadastrarTipoFuncao(dadosTipo) {
        const url = baseUrl + '/api/tipofuncaofpa';
        try {
            const resposta = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosTipo)
            });
            return resposta.ok;
        } catch (erro) {
            console.error("Erro no SQLite [cadastrarTipoFuncao]:", erro);
            return false;
        }
    }

    /**
     * Atualiza os dados de um tipo funcional existente pelo ID físico
     */
    async atualizarTipoFuncao(id, dadosTipo) {
        const url = baseUrl + '/api/tipofuncaofpa/' + id;
        try {
            const resposta = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosTipo)
            });
            return resposta.ok;
        } catch (erro) {
            console.error("Erro no SQLite [atualizarTipoFuncao]:", erro);
            return false;
        }
    }

    /**
     * Remove um tipo do ecossistema se não houverem funções vinculadas (Fail-safe)
     */
    async deletarTipoFuncao(id) {
        const url = baseUrl + '/api/tipofuncaofpa/' + id;
        try {
            const resposta = await fetch(url, { method: 'DELETE' });
            return resposta.ok;
        } catch (erro) {
            console.error("Erro no SQLite [deletarTipoFuncao]:", erro);
            return false;
        }
    }

}

