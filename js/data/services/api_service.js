import { baseUrl } from '../../core/ambiente.js';

/**
 * Serviço de Integração com o Backend Python FastAPI e SQLite (fpa.db)
 * Contratos de rede com passagem de ID como subrecurso no meio da URL preservados.
 */
export class ApiServiceFpa {

    // ==========================================================================
    // 🏢 1. MÓDULO DE PROJETOS (Equivalente ao ApiServiceProjeto)
    // ==========================================================================

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

    async atualizarFuncao(funcaoId, dadosFuncao) {
        const url = baseUrl + '/api/funcoes/' + funcaoId;
        try {
            const MathResposta = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosFuncao)
            });
            return MathResposta.ok;
        } catch (erro) {
            console.error("Erro no SQLite [atualizarFuncao]:", erro);
            return false;
        }
    }

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
    // 📊 3. MÓDULO DE RELATÓRIOS E COMPILADORES MULTI-ROTAS DO PDF
    // ==========================================================================

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

    async obterResumoExecutivo(projetoId) {
        // Rota corrigida com o Case Sensitivity "resumo-Executivo" do seu FastAPI
        const url = baseUrl + '/api/projetos/' + projetoId + '/resumo-executivo';
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error('Erro no resumo (' + resposta.status + ')');
            return await resposta.json();
        } catch (erro) {
            console.error("Erro no SQLite [obterResumoExecutivo]:", erro);
            throw erro;
        }
    }

    async obterPrecificacao(projetoId) {
        const url = baseUrl + '/api/projetos/' + projetoId + '/precificacao';
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error('Erro na precificação (' + resposta.status + ')');
            return await resposta.json();
        } catch (erro) {
            console.error("Erro no SQLite [obterPrecificacao]:", erro);
            throw erro;
        }
    }

    async obterRelatorioAnalitico(projetoId) {
        const url = baseUrl + '/api/projetos/' + projetoId + '/relatorio-analitico';
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error('Erro no analítico (' + resposta.status + ')');
            return await resposta.json();
        } catch (erro) {
            console.error("Erro no SQLite [obterRelatorioAnalitico]:", erro);
            throw erro;
        }
    }

    // ==========================================================================
    // ⚙️ 4. MÓDULO ADMIN, CARACTERÍSTICAS E SISTEMA DE Snapshots
    // ==========================================================================

    async obterFatoresPorProjeto(projetoId) {
        const url = baseUrl + '/api/projetos/' + projetoId + '/fatores-detalhado';
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error('Erro ao ler fatores (' + resposta.status + ')');
            return await resposta.json();
        } catch (erro) {
            console.error("Erro no SQLite [obterFatoresPorProjeto]:", erro);
            throw erro;
        }
    }

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

    async listarBackups() {
        const url = baseUrl + '/api/sistema/backups';
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error('Erro ao listar diretório (' + resposta.status + ')');
            return await resposta.json();
        } catch (erro) {
            console.error("Erro no SQLite [listarBackups]:", erro);
            return [];
        }
    }

    async criarBackup() {
        const url = baseUrl + '/api/sistema/backup';
        try {
            const resposta = await fetch(url, { method: 'POST', headers: { 'accept': '*/*' } });
            return resposta.status === 201 || resposta.ok;
        } catch (erro) {
            console.error("Erro ao gerar snapshot no Python:", erro);
            return false;
        }
    }

    async restaurarBackup(nomeArquivo) {
        const url = baseUrl + '/api/sistema/restaurar';
        try {
            const resposta = await fetch(url, {
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
    async listarTecnologias() {
        const url = baseUrl + '/api/tecnologias';
        try {
            const resposta = await fetch(url);
            if (!resposta.ok) throw new Error('Erro ao buscar tecnologias (' + resposta.status + ')');
                return await resposta.json();
        } catch (erro) {
            console.error("Erro no SQLite [listarTecnologias]:", erro);
            return [];
        }
    }
    async cadastrarTecnologia(dadosTec) {
        const url = baseUrl + '/api/tecnologias';
        try {
            const resposta = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosTec)
            });
            return resposta.ok ? "sucesso" : "Erro ao processar dados no banco.";
        } catch (erro) {
            console.error("Erro no SQLite [cadastrarTecnologia]:", erro);
            return erro.message;
        }
    }
    async atualizarTecnologia(id, dadosTec) {
    const url = baseUrl + '/api/tecnologias/' + id;
    try {
    const resposta = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosTec)
    });
    return resposta.ok ? "sucesso" : "Erro ao atualizar registro.";
    } catch (erro) {
    console.error("Erro no SQLite [atualizarTecnologia]:", erro);
    return erro.message;
    }
    }
    async deletarTecnologia(id) {
        const url = baseUrl + '/api/tecnologias/' + id;
        try {
            const resposta = await fetch(url, { method: 'DELETE' });
            return resposta.ok;
        } catch (erro) {
            console.error("Erro no SQLite [deletarTecnologia]:", erro);
            return false;
        }
    }
}