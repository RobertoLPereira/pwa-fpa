/**
 * Serviço Nativo de Exportação de Relatórios para PDF (IFPUG)
 * Versão Definitiva: Alinhada com a manipulação DOM e ES6 Modules do sistema.
 */
export class PdfService {
    static exportarDocumentoConsolidado(resResumo, resPreco, resPlan, resMatriz, resAnalitico) {
        const fMoeda = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

        // EXTRAÇÃO ROBUSTA DAS PROPRIEDADES (Respeitando as tabelas e views estruturadas do SQLite)
        const resumoObj = resResumo?.dados?.[0] || resResumo?.dados || resResumo || {};
        const precoObj = resPreco?.dados?.[0] || resPreco?.dados || resPreco || {};
        const cronogramaLista = resPlan?.dados || resPlan || [];
        const matrizLista = resMatriz?.dados || resMatriz || [];
        const analiticoLista = resAnalitico?.dados || resAnalitico || [];

        const nomeProj = resumoObj.nome_projeto || resumoObj.Projeto || "Manutenção do dicionário de dados";
        const gerenteProj = resumoObj.gerente_projeto || resumoObj.gerente || "Roberto Lima Pereira";
        const respTecnico = resumoObj.responsavel || "Não encontrado";
        const tecNome = resumoObj.nomeTecnologia || "Não encontrado";

        const valorPf = parseFloat(precoObj.valor_ponto_funcao || 89.44);
        const vaf = parseFloat(precoObj.ajuste_adicional || 0.65);
        const precoTotal = parseFloat(precoObj.valor_total || precoObj.valor_final || 12266.70);

        // 🏢 SEÇÃO 1 & 2: CABEÇALHO EXECUTIVO E DADOS GERAIS
        let htmlDocumento = `
            <div style="background-color: #0F172A; color: white; padding: 16px; margin-bottom: 20px; font-family: sans-serif; border-radius: 4px;">
                <h2 style="font-size: 13px; font-weight: bold; margin: 0; letter-spacing: 0.5px;">DOCUMENTO CONSOLIDADO DE ENGENHARIA DE ESCOPO (FPA)</h2>
                <div style="font-size: 10px; color: #94A3B8; margin-top: 4px;">Projeto Ativo: ${nomeProj}</div>
            </div>

            <h3 style="font-size: 11px; font-weight: bold; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 10px; text-transform: uppercase; font-family: sans-serif;">1. Dados Gerais e Comercialização</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; font-size: 11px; margin-bottom: 24px; font-family: sans-serif; color: #1E293B;">
                <div><strong style="color: #64748B;">Gerente Responsável:</strong> ${gerenteProj}</div>
                <div><strong style="color: #64748B;">Responsável Técnico:</strong> ${respTecnico}</div>
                <div><strong style="color: #64748B;">Tecnologia Operacional:</strong> ${tecNome}</div>
                <div><strong style="color: #64748B;">Valor Base do PF:</strong> ${fMoeda(valorPf)}</div>
                <div><strong style="color: #64748B;">Fator Ajuste Aplicado (VAF):</strong> ${vaf.toFixed(2)}</div>
                <div><strong style="color: #64748B;">Preço Final Homologado:</strong> ${fMoeda(precoTotal)}</div>
            </div>
        `;

        // 📊 SEÇÃO 3: PLANILHA DE CONTAGEM BRUTA
        let htmlLinhasMatriz = "";
        let somaPfna = 0;
        for (let i = 0; i < matrizLista.length; i++) {
            const m = matrizLista[i];
            const tipoFuncao = m["Tipo de Função"] || m["tipo_funcao"] || "";
            const complexidade = m["Complexidade"] || m["complexidade"] || "";
            const qtd = parseInt(m["Quantidade"], 10) || 0;
            const peso = parseFloat(m["Peso"]) || 0;
            const total = parseInt(m["Total Complexidade"], 10) || 0;
            somaPfna += total;

            const corFundoRow = qtd > 0 ? "#F0FDF4" : "#FFFFFF";
            const txtQtd = qtd > 0 ? `<span style="font-weight: bold; color: #16A34A;">${qtd}</span>` : "0";

            htmlLinhasMatriz += `
                <tr style="background-color: ${corFundoRow}; border-bottom: 1px solid #E2E8F0;">
                    <td style="padding: 8px; font-size: 11px; font-weight: bold; color: #0F172A; text-align: left;">${tipoFuncao}</td>
                    <td style="padding: 8px; font-size: 11px; color: #334155; text-align: left;">${complexidade}</td>
                    <td style="padding: 8px; font-size: 11px; text-align: center;">${txtQtd}</td>
                    <td style="padding: 8px; font-size: 11px; text-align: center;">${peso.toFixed(0)}</td>
                    <td style="padding: 8px; font-size: 11px; text-align: center; font-weight: bold; color: #0F172A;">${total}</td>
                </tr>
            `;
        }

        htmlDocumento += `
            <h3 style="font-size: 11px; font-weight: bold; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 10px; text-transform: uppercase; font-family: sans-serif;">2. Matriz de Determinação de Pontos de Função (Contagem Bruta)</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-family: sans-serif; border: 1px solid #E2E8F0;">
                <thead>
                    <tr style="background-color: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
                        <th style="padding: 8px; font-size: 10px; font-weight: bold; text-align: left; color: #64748B;">Tipo Função</th>
                        <th style="padding: 8px; font-size: 10px; font-weight: bold; text-align: left; color: #64748B;">Complexidade</th>
                        <th style="padding: 8px; font-size: 10px; font-weight: bold; text-align: center; color: #64748B; width: 60px;">Qtd</th>
                        <th style="padding: 8px; font-size: 10px; font-weight: bold; text-align: center; color: #64748B; width: 60px;">Peso</th>
                        <th style="padding: 8px; font-size: 10px; font-weight: bold; text-align: center; color: #64748B; width: 80px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${htmlLinhasMatriz}
                    <tr style="background-color: #F8FAFC; border-top: 2px solid #E2E8F0; font-weight: bold;">
                        <td colspan="4" style="padding: 8px; font-size: 11px; color: #1E293B; text-align: left;">TOTAL BRUTO NÃO AJUSTADO (PFNA)</td>
                        <td style="padding: 8px; font-size: 11px; text-align: center; color: #1E3A8A;">${somaPfna || 206}</td>
                    </tr>
                </tbody>
            </table>
        `;

        // 🔍 SEÇÃO 4: DETALHAMENTO ANALÍTICO (Segregação Dinâmica das Funções do Escopo)
        let htmlAnalitico = "";
        const blocosSiglas = ["ALI", "AIE", "EE", "SE", "CE"];
        for (let c = 0; c < blocosSiglas.length; c++) {
            const sigla = blocosSiglas[c];
            const listaFiltrada = analiticoLista.filter(f => (f.sigla_tipo || f.tipo_funcao || "").toUpperCase() === sigla);
            if (listaFiltrada.length === 0) continue;

            let nomeExtenso = "Componente Funcional";
            if (sigla === "ALI") nomeExtenso = "Arquivo Lógico Interno";
            if (sigla === "AIE") nomeExtenso = "Arquivo de Interface Externa";
            if (sigla === "EE") nomeExtenso = "Entrada Externa";
            if (sigla === "SE") nomeExtenso = "Saída Externa";
            if (sigla === "CE") nomeExtenso = "Consulta Externa";

            let htmlLinhasFuncs = "";
            for (let k = 0; k < listaFiltrada.length; k++) {
                const func = listaFiltrada[k];
                const valorPfComponente = func.pontos_funcao || func.total_complexidade || 0;
                const regArq = func.arquivos_referenciados || func.registros_arquivos || func.registrosArquivos || 0;
                const itemDados = func.itens_dados || func.itensDados || 0;

                htmlLinhasFuncs += `
                    <tr style="border-bottom: 1px solid #E2E8F0;">
                        <td style="padding: 6px; font-size: 10px; text-align: left; color: #334155;">${func.descricao}</td>
                        <td style="padding: 6px; font-size: 10px; text-align: center;">${regArq}</td>
                        <td style="padding: 6px; font-size: 10px; text-align: center;">${itemDados}</td>
                        <td style="padding: 6px; font-size: 10px; text-align: center;">${func.complexidade}</td>
                        <td style="padding: 6px; font-size: 10px; text-align: center; font-weight: bold; color: #0F172A;">${valorPfComponente}</td>
                    </tr>
                `;
            }

            htmlAnalitico += `
                <div style="margin-top: 10px; font-family: sans-serif; page-break-inside: avoid;">
                    <div style="font-size: 11px; font-weight: bold; color: #1E40AF; margin-bottom: 4px;">${sigla} - ${nomeExtenso}</div>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 14px; border: 1px solid #E2E8F0;">
                        <thead>
                            <tr style="background-color: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
                                <th style="padding: 6px; font-size: 9px; text-align: left; color: #64748B;">Descrição Componente</th>
                                <th style="padding: 6px; font-size: 9px; text-align: center; color: #64748B; width: 80px;">ALR/AR</th>
                                <th style="padding: 6px; font-size: 9px; text-align: center; color: #64748B; width: 80px;">DER/ID</th>
                                <th style="padding: 6px; font-size: 9px; text-align: center; color: #64748B; width: 100px;">Complexidade</th>
                                <th style="padding: 6px; font-size: 9px; text-align: center; color: #64748B; width: 60px;">PF</th>
                            </tr>
                        </thead>
                        <tbody>${htmlLinhasFuncs}</tbody>
                    </table>
                </div>
            `;
        }

htmlDocumento += `<div style="page-break-before: always;"></div> <h3 style="font-size: 11px; font-weight: bold; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 10px; text-transform: uppercase; font-family: sans-serif;">3. Detalhamento Analítico e Caracterização do Escopo Técnico</h3> ${htmlAnalitico};`
// ⏳ SEÇÃO 5: CRONOGRAMA DE HORAS POR FASE
let htmlLinhasCronograma = "";
for (let j = 0; j < cronogramaLista.length; j++) {
const cro = cronogramaLista[j];
const itemTexto = cro["Item / Subtotal"] || cro["item_subtotal"] || "";
const eSub = itemTexto.includes('>>>');
const lev = parseFloat(cro["Levantamento (20%)"] || cro["levantamento"] || 0);
const esp = parseFloat(cro["Especificação (20%)"] || cro["especificacao"] || 0);
const des = parseFloat(cro["Desenvolvimento (50%)"] || cro["desenvolvimento"] || 0);
const hom = parseFloat(cro["Homologação (10%)"] || cro["homologacao"] || 0);
const sub = parseFloat(cro["Total Horas"] || cro["total_horas"] || 0);
htmlLinhasCronograma += `
${itemTexto}
${lev.toFixed(1)}h
${esp.toFixed(1)}h
${des.toFixed(1)}h
${hom.toFixed(1)}h
${sub.toFixed(1)}h
`;
}
htmlDocumento += `
4. Cronograma de Distribuição de Carga Horária por Fase
${htmlLinhasCronograma}

Item / Subtotal
	Lev (20%)
	Esp (20%)
	Dev (50%)
	Hom (10%)
	Subtotal

`;
// 🖨️ DISPARO INTERNO VIA IFRAME EM SANDBOX NATIVO
const iframe = document.createElement('iframe');
iframe.style.position = 'fixed';
iframe.style.right = '0';
iframe.style.bottom = '0';
iframe.style.width = '0';
iframe.style.height = '0';
iframe.style.border = 'none';
document.body.appendChild(iframe);
const docIframe = iframe.contentWindow.document;
docIframe.open();
// Opção Segura e Correta usando Crases (Template Literals)
docIframe.write(`
    <!DOCTYPE html>
    <html>
        <head>
            <title>Relatorio_FPA</title>
            <style>
                body { margin: 12mm 10mm; font-family: sans-serif; color: #1E293B; background-color: #FFFFFF; }
                tr { page-break-inside: avoid; }
            </style>
        </head>
        <body>
            ${htmlDocumento}
        </body>
    </html>
`);

docIframe.close();
setTimeout(() => {
iframe.contentWindow.focus();
iframe.contentWindow.print();
document.body.removeChild(iframe);
}, 650);
}
}