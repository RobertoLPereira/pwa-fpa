/**
 * Componentes Visuais Puros para o Módulo de Administração
 * Estruturas HTML nativas para gerenciamento de fatores, tecnologias, tipos e snapshots.
 */

/**
 * Renderiza o Menu de Sub-Abas superior (Equivalente ao TabBar do Flutter)
 */
export function renderSubAbasAdmin(subAbaAtiva) {
    const abas = [
        { id: 'fatores', label: '🎛️ Características' },
        { id: 'tipos', label: '⚙️ Tipos Funcionais' },
        { id: 'tecnologias', label: '💾 Tecnologias' },
        { id: 'backups', label: '🛡️ Snapshots & Backups' }
    ];

    let htmlAbas = "";
    for (let i = 0; i < abas.length; i++) {
        const a = abas[i];
        const classeAtiva = a.id === subAbaAtiva ? "active" : "";
        htmlAbas += `<button class="sub-tab-item ` + classeAtiva + `" data-subaba="` + a.id + `">` + a.label + `</button>`;
    }

    return `<div class="sub-tab-bar-fpa">` + htmlAbas + `</div><div id="sub-conteudo-admin" style="margin-top: 16px;"></div>`;
}

/**
 * Renderiza os Sliders das 14 Características (Equivalente à AbaFatoresWidget)
 */
export function renderAbaFatores(fatores) {
    if (!fatores || fatores.length === 0) {
        return `<div class="tabela-fpa-vazia">Nenhuma característica localizada para este projeto.</div>`;
    }

    let htmlFatores = "";
    for (let i = 0; i < fatores.length; i++) {
        const f = fatores[i];
        const nome = f.nome || "";
        const nota = parseInt(f.nota, 10) || 0;

        htmlFatores += `
            <div class="card-fpa" style="background-color: white; margin-bottom: 12px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 13px; font-weight: 600; color: #1E293B;">` + nome + `</span>
                    <span style="background-color: #0F172A; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">Nível ` + nota + `</span>
                </div>
                <input type="range" class="slider-fpa-nativo" min="0" max="5" step="1" value="` + nota + `" data-nome="` + nome + `" style="width: 100%; accent-color: #0F172A; cursor: pointer;">
            </div>
        `;
    }

    return `
        <div style="margin-bottom: 12px;">
            <h3 style="font-size: 16px; color: #0F172A; font-weight: bold;">Características Gerais de Influência (IFPUG)</h3>
            <p style="font-size: 12px; color: #64748B; margin-top: 2px; margin-bottom: 16px;">Ajuste o nível de influência de 0 a 5. A Railway atualizará o VAF dinamicamente.</p>
        </div>
        <div class="painel-fpa-grid" style="grid-template-columns: 1fr 1fr; gap: 16px;" id="grid-sliders-container">
            ` + htmlFatores + `
        </div>
    `;
}

/**
 * Renderiza a listagem de Backups e Snapshots (Equivalente à AbaBackupsWidget)
 */
export function renderAbaBackups(lista, executandoBackup) {
    let htmlLista = "";

    for (let i = 0; i < lista.length; i++) {
        const arquivo = lista[i] || "";
        const ePreventivo = arquivo.includes('preventivo');
        const corIcone = ePreventivo ? "orange" : "#2563EB";
        const corFundoCard = ePreventivo ? "#F8FAFC" : "white";

        // Regex para capturar e formatar a data contida no nome do snapshot (Ex: 20261013)
        const matchData = arquivo.match(/\d{8}/);
        let dataExibicao = "Data não identificada";
        if (matchData && matchData[0]) {
            const d = matchData[0];
            dataExibicao = d.substring(6,8) + "/" + d.substring(4,6) + "/" + d.substring(0,4);
        }

        htmlLista += `
            <div class="card-fpa" style="background-color: ` + corFundoCard + `; padding: 12px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 12px; overflow: hidden;">
                    <span style="font-size: 20px; color: ` + corIcone + `;">💾</span>
                    <div style="overflow: hidden;">
                        <div style="font-family: monospace; font-size: 12px; font-weight: bold; color: #1E293B; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">` + arquivo + `</div>
                        <div style="font-size: 11px; color: #64748B; margin-top: 2px;">Ponto de Restauração: ` + dataExibicao + `</div>
                    </div>
                </div>
                <button class="btn-restore-snapshot" data-arquivo="` + arquivo + `" style="background-color: #EFF6FF; color: #1E3A8A; border: 1px solid #BFDBFE; padding: 6px 12px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; white-space: nowrap;">
                    🔄 Restaurar
                </button>
            </div>
        `;
    }

    const btnDispararHtml = executandoBackup ? `
        <button id="btn-disparar-backup" disabled style="background-color: #64748B; color: white; padding: 10px 16px; border: none; border-radius: 6px; font-weight: bold; font-size: 13px; cursor: not-allowed;">
            ⏳ Gerando Snapshot...
        </button>
    ` : `
        <button id="btn-disparar-backup" style="background-color: #0F172A; color: white; padding: 10px 16px; border: none; border-radius: 6px; font-weight: bold; font-size: 13px; cursor: pointer;">
            📦 Disparar Novo Backup
        </button>
    `;

    return `
        <div class="card-fpa" style="background-color: white; padding: 16px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div>
                <h4 style="font-size: 14px; font-weight: bold; color: #0F172A;">GERENCIAMENTO DE BACKUP DO SISTEMA</h4>
                <p style="font-size: 12px; color: #64748B; margin-top: 2px;">Gere snapshots completos do banco fpa.db instantaneamente na nuvem.</p>
            </div>
            ` + btnDispararHtml + `
        </div>
        <h4 style="font-size: 13px; font-weight: bold; color: #64748B; text-transform: uppercase; margin-bottom: 12px;">Pontos de Restauração Indexados no Diretório:</h4>
        <div id="lista-snapshots-container">
            ` + (lista.length === 0 ? '<div class="tabela-fpa-vazia">Nenhum snapshot de banco disponível.</div>' : htmlLista) + `
        </div>
    `;
}
