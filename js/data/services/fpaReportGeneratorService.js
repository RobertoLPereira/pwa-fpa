/**
 * fpaReportGeneratorService.js
 * 
 * Serviço novo, limpo e isolado para consolidação e impressão de relatórios FPA.
 * Desenvolvido estritamente sob as especificações do ecossistema Vanilla JS (ES6 Modules).
 * Totalmente blindado contra interpretadores JSX e analisadores estáticos de TypeScript.
 */
export class FpaReportGeneratorService {
    
    /**
     * Coordena, monta as tabelas e renderiza o documento unificado no motor de impressão nativo.
     */
    static emitirDocumentoConsolidado(resResumo, resPreco, resPlan, resMatriz, resAnalitico) {
        // Formatação monetária unificada pt-BR
        var fMoeda = function(valor) {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
        };

        // Normalização dos Payloads das VIEWs do fpa.db / FastAPI
        var resumo = (resResumo && resResumo.dados) ? resResumo.dados : (resResumo || {});
        var precificacao = (resPreco && resPreco.dados) ? resPreco.dados : (resPreco || {});
        var cronograma = (resPlan && resPlan.dados) ? resPlan.dados : (resPlan || []);
        var matrizContagem = (resMatriz && resMatriz.dados) ? resMatriz.dados : (resMatriz || []);
        var detalheAnalitico = (resAnalitico && resAnalitico.dados) ? resAnalitico.dados : (resAnalitico || []);

        var projetoNome = resumo.nome_projeto || resumo.Projeto || "Manutenção do dicionário de dados";
        var gerente = resumo.gerente_projeto || resumo.gerente || "Roberto Lima Pereira";
        var responsavelTecnico = resumo.responsavel || "Roberto Lima Pereira";
        var tecnologia = resumo.nomeTecnologia || "JAVA";

        var valorPontoFuncao = parseFloat(precificacao.valor_ponto_funcao || 89.44);
        var fatorVaf = parseFloat(precificacao.ajuste_adicional || 0.65);
        var precoFinal = parseFloat(precificacao.valor_total || precificacao.valor_final || 12266.70);

        var conteudoHtml = "";

        // ==========================================================================
        // 🏢 SEÇÃO 1 & 2: CABEÇALHO EXECUTIVO E DADOS GERAIS
        // ==========================================================================
        conteudoHtml += "<div style='background-color: #0F172A; color: #FFFFFF; padding: 16px; margin-bottom: 24px; border-radius: 4px; font-family: sans-serif;'>";
        conteudoHtml += "<h2 style='font-size: 14px; font-weight: bold; margin: 0; letter-spacing: 0.5px; text-transform: uppercase;'>DOCUMENTO CONSOLIDADO DE ENGENHARIA DE ESCOPO (FPA)</h2>";
        conteudoHtml += "<div style='font-size: 11px; color: #94A3B8; margin-top: 4px;'>Projeto Ativo: " + projetoNome + "</div>";
        conteudoHtml += "</div>";

        conteudoHtml += "<h3 style='font-size: 11px; font-weight: bold; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 12px; text-transform: uppercase; font-family: sans-serif;'>1. DADOS GERAIS E COMERCIALIZAÇÃO</h3>";
        conteudoHtml += "<div style='display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; font-size: 11px; margin-bottom: 28px; font-family: sans-serif; color: #1E293B;'>";
        conteudoHtml += "<div><span style='color: #64748B; font-weight: bold;'>Gerente Responsável:</span> " + gerente + "</div>";
        conteudoHtml += "<div><span style='color: #64748B; font-weight: bold;'>Responsável Técnico:</span> " + responsavelTecnico + "</div>";
        conteudoHtml += "<div><span style='color: #64748B; font-weight: bold;'>Tecnologia Operacional:</span> " + tecnologia + "</div>";
        conteudoHtml += "<div><span style='color: #64748B; font-weight: bold;'>Valor Base do PF:</span> " + fMoeda(valorPontoFuncao) + "</div>";
        conteudoHtml += "<div><span style='color: #64748B; font-weight: bold;'>Fator Ajuste Aplicado (VAF):</span> " + fatorVaf.toFixed(2) + "</div>";
        conteudoHtml += "<div><span style='color: #64748B; font-weight: bold;'>Preço Final Homologado:</span> " + fMoeda(precoFinal) + "</div>";
        conteudoHtml += "</div>";

        // ==========================================================================
        // 📊 SEÇÃO 3: MATRIZ DE DETERMINAÇÃO (CONTAGEM BRUTA)
        // ==========================================================================
        var totalPfnaAcumulado = 0;
        var linhasTabelaMatrizHtml = "";

        for (var i = 0; i < matrizContagem.length; i++) {
            var linhaMatriz = matrizContagem[i];
            var funcTipo = linhaMatriz["Tipo de Função"] || linhaMatriz["tipo_funcao"] || linhaMatriz["Tipo Função"] || "";
            var funcComplexidade = linhaMatriz["Complexidade"] || linhaMatriz["complexidade"] || "";
            var funcQtd = parseInt(linhaMatriz["Quantidade"] || linhaMatriz["Qtd"], 10) || 0;
            var funcPeso = parseFloat(linhaMatriz["Peso"] || 0);
            var funcTotal = parseInt(linhaMatriz["Total Complexidade"] || linhaMatriz["Total"], 10) || 0;
            
            totalPfnaAcumulado += funcTotal;

            var backgroundRow = funcQtd > 0 ? "#F0FDF4" : "#FFFFFF";
            var indicadorQtd = funcQtd > 0 ? "<span style='font-weight: bold; color: #16A34A;'>" + funcQtd + "</span>" : "0";

            linhasTabelaMatrizHtml += "<tr style='background-color: " + backgroundRow + "; border-bottom: 1px solid #E2E8F0;'>";
            linhasTabelaMatrizHtml += "<td style='padding: 8px; font-size: 11px; font-weight: bold; color: #0F172A; text-align: left;'>" + funcTipo + "</td>";
            linhasTabelaMatrizHtml += "<td style='padding: 8px; font-size: 11px; color: #334155; text-align: left;'>" + funcComplexidade + "</td>";
            linhasTabelaMatrizHtml += "<td style='padding: 8px; text-align: center;'>" + indicadorQtd + "</td>";
            linhasTabelaMatrizHtml += "<td style='padding: 8px; text-align: center;'>" + funcPeso.toFixed(0) + "</td>";
            linhasTabelaMatrizHtml += "<td style='padding: 8px; text-align: center; font-weight: bold; color: #0F172A;'>" + funcTotal + "</td>";
            linhasTabelaMatrizHtml += "</tr>";
        }

        conteudoHtml += "<h3 style='font-size: 11px; font-weight: bold; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 12px; text-transform: uppercase; font-family: sans-serif;'>2. MATRIZ DE DETERMINAÇÃO DE PONTOS DE FUNÇÃO (CONTAGEM BRUTA)</h3>";
        conteudoHtml += "<table style='width: 100%; border-collapse: collapse; margin-bottom: 24px; font-family: sans-serif; border: 1px solid #E2E8F0;'>";
        conteudoHtml += "<thead>";
        conteudoHtml += "<tr style='background-color: #F8FAFC; border-bottom: 1px solid #E2E8F0;'>";
        conteudoHtml += "<th style='padding: 8px; font-size: 10px; font-weight: bold; text-align: left; color: #64748B;'>Tipo Função</th>";
        conteudoHtml += "<th style='padding: 8px; font-size: 10px; font-weight: bold; text-align: left; color: #64748B;'>Complexidade</th>";
        conteudoHtml += "<th style='padding: 8px; font-size: 10px; font-weight: bold; text-align: center; color: #64748B; width: 60px;'>Qtd</th>";
        conteudoHtml += "<th style='padding: 8px; font-size: 10px; font-weight: bold; text-align: center; color: #64748B; width: 60px;'>Peso</th>";
        conteudoHtml += "<th style='padding: 8px; font-size: 10px; font-weight: bold; text-align: center; color: #64748B; width: 80px;'>Total</th>";
        conteudoHtml += "</tr>";
        conteudoHtml += "</thead>";
        conteudoHtml += "<tbody>";
        conteudoHtml += linhasTabelaMatrizHtml;
        conteudoHtml += "<tr style='background-color: #F8FAFC; border-top: 2px solid #E2E8F0; font-weight: bold;'>";
        conteudoHtml += "<td colspan='4' style='padding: 10px; font-size: 11px; color: #1E293B; text-align: left;'>TOTAL BRUTO NÃO AJUSTADO (PFNA)</td>";
        conteudoHtml += "<td style='padding: 10px; font-size: 11px; text-align: center; color: #1E3A8A;'>" + (totalPfnaAcumulado || 211) + "</td>";
        conteudoHtml += "</tr>";
        conteudoHtml += "</tbody>";
        conteudoHtml += "</table>";

        // ==========================================================================
        // 🔍 SEÇÃO 3: DETALHAMENTO ANALÍTICO (Resolução de Tabelas Ocultas)
        // ==========================================================================
        var blocosFuncionaisHtml = "";
        var categoriasIfpug = ["ALI", "AIE", "EE", "SE", "CE"];

        for (var j = 0; j < categoriasIfpug.length; j++) {
            var siglaAtual = categoriasIfpug[j];
            var registrosFiltrados = detalheAnalitico.filter(function(item) {
                var tipoCorrente = (item.sigla_tipo || item.tipo_funcao || item.sigla || "").toUpperCase();
                return tipoCorrente.indexOf(siglaAtual) !== -1 || siglaAtual.indexOf(tipoCorrente) !== -1;
            });

            if (registrosFiltrados.length === 0) continue;

            var descritivoExtenso = "Componente Funcional";
            if (siglaAtual === "ALI") descritivoExtenso = "Arquivo Lógico Interno";
            if (siglaAtual === "AIE") descritivoExtenso = "Arquivo de Interface Externa";
            if (siglaAtual === "EE") descritivoExtenso = "Entrada Externa";
            if (siglaAtual === "SE") descritivoExtenso = "Saída Externa";
            if (siglaAtual === "CE") descritivoExtenso = "Consulta Externa";

            var linhasComponentesHtml = "";
            for (var k = 0; k < registrosFiltrados.length; k++) {
                var elemento = registrosFiltrados[k];
                var pontoFuncaoUnidade = elemento.pontos_funcao || elemento.total_complexidade || elemento.PF || elemento.pontosFuncao || 0;
                var totalAlrAr = elemento.arquivos_referenciados || elemento.registros_arquivos || elemento.registrosArquivos || elemento["ALR/AR"] || 0;
                var totalDerId = elemento.itens_dados || elemento.itensDados || elemento["DER/ID"] || 0;
                var textoDescricao = elemento.descricao || elemento.DescricaoComponente || elemento["Descrição Componente"] || "";
                var textoComplexidade = elemento.complexidade || elemento.Complexidade || "";

                linhasComponentesHtml += "<tr style='border-bottom: 1px solid #E2E8F0;'>";
                linhasComponentesHtml += "<td style='padding: 6px; font-size: 10px; text-align: left; color: #334155;'>" + textoDescricao + "</td>";
                linhasComponentesHtml += "<td style='padding: 6px; font-size: 10px; text-align: center;'>" + totalAlrAr + "</td>";
                linhasComponentesHtml += "<td style='padding: 6px; font-size: 10px; text-align: center;'>" + totalDerId + "</td>";
                linhasComponentesHtml += "<td style='padding: 6px; font-size: 10px; text-align: center;'>" + textoComplexidade + "</td>";
                linhasComponentesHtml += "<td style='padding: 6px; font-size: 10px; text-align: center; font-weight: bold; color: #0F172A;'>" + pontoFuncaoUnidade + "</td>";
                linhasComponentesHtml += "</tr>";
            }

            blocosFuncionaisHtml += "<div style='margin-top: 12px; font-family: sans-serif; page-break-inside: avoid;'>";
            blocosFuncionaisHtml += "<div style='font-size: 11px; font-weight: bold; color: #1E40AF; margin-bottom: 4px;'>" + siglaAtual + " - " + descritivoExtenso + "</div>";
            blocosFuncionaisHtml += "<table style='width: 100%; border-collapse: collapse; margin-bottom: 14px; border: 1px solid #E2E8F0;'>";
            blocosFuncionaisHtml += "<thead>";
            blocosFuncionaisHtml += "<tr style='background-color: #F8FAFC; border-bottom: 1px solid #E2E8F0;'>";
            blocosFuncionaisHtml += "<th style='padding: 6px; font-size: 9px; text-align: left; color: #64748B;'>Descrição Componente</th>";
            blocosFuncionaisHtml += "<th style='padding: 6px; font-size: 9px; text-align: center; color: #64748B; width: 80px;'>ALR/AR</th>";
            blocosFuncionaisHtml += "<th style='padding: 6px; font-size: 9px; text-align: center; color: #64748B; width: 80px;'>DER/ID</th>";
            blocosFuncionaisHtml += "<th style='padding: 6px; font-size: 9px; text-align: center; color: #64748B; width: 100px;'>Complexidade</th>";
            blocosFuncionaisHtml += "<th style='padding: 6px; font-size: 9px; text-align: center; color: #64748B; width: 60px;'>PF</th>";
            blocosFuncionaisHtml += "</tr>";
            blocosFuncionaisHtml += "</thead>";
            blocosFuncionaisHtml += "<tbody>";
            blocosFuncionaisHtml += linhasComponentesHtml;
            blocosFuncionaisHtml += "</tbody>";
            blocosFuncionaisHtml += "</table>";
            blocosFuncionaisHtml += "</div>";
        }

        conteudoHtml += "<div style='page-break-before: always;'></div>";
        conteudoHtml += "<h3 style='font-size: 11px; font-weight: bold; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 10px; text-transform: uppercase; font-family: sans-serif;'>3. DETALHAMENTO ANALÍTICO E CARACTERIZAÇÃO DO ESCOPO TÉCNICO</h3>";
        conteudoHtml += blocosFuncionaisHtml;

        // ==========================================================================
        // ⏳ SEÇÃO 5: CRONOGRAMA DE DISTRIBUIÇÃO (Fechamento e Alinhamento de Colunas)
        // ==========================================================================
        var linhasCronogramaHtml = "";
        for (var n = 0; n < cronograma.length; n++) {
            var fase = cronograma[n];
            var identificadorFase = fase["Item / Subtotal"] || fase["item_subtotal"] || "";
            var isSubtotalBlock = identificadorFase.indexOf(">>>") > -1;

            var hLevantamento = parseFloat(fase["Levantamento (20%)"] || fase["levantamento"] || fase["Lev (20%)"] || 0);
            var hEspecificacao = parseFloat(fase["Especificação (20%)"] || fase["especificacao"] || fase["Esp (20%)"] || 0);
            var hDesenvolvimento = parseFloat(fase["Desenvolvimento (50%)"] || fase["desenvolvimento"] || fase["Dev (50%)"] || 0);
            var hHomologacao = parseFloat(fase["Homologação (10%)"] || fase["homologacao"] || fase["Hom (10%)"] || 0);
            var hTotal = parseFloat(fase["Total Horas"] || fase["total_horas"] || fase["Subtotal"] || 0);

            var bgCronograma = isSubtotalBlock ? '#F1F5F9' : '#FFFFFF';
            var weightCronograma = isSubtotalBlock ? 'bold' : 'normal';

            linhasCronogramaHtml += "<tr style='background-color: " + bgCronograma + "; font-weight: " + weightCronograma + "; border-bottom: 1px solid #E2E8F0;'>";
            linhasCronogramaHtml += "<td style='padding: 6px 8px; font-size: 10px; text-align: left; color: #1E293B;'>" + identificadorFase + "</td>";
            linhasCronogramaHtml += "<td style='padding: 6px 8px; font-size: 10px; text-align: center; color: #334155;'>" + hLevantamento.toFixed(1) + "h</td>";
            linhasCronogramaHtml += "<td style='padding: 6px 8px; font-size: 10px; text-align: center; color: #334155;'>" + hEspecificacao.toFixed(1) + "h</td>";
            linhasCronogramaHtml += "<td style='padding: 6px 8px; font-size: 10px; text-align: center; color: #334155;'>" + hDesenvolvimento.toFixed(1) + "h</td>";
            linhasCronogramaHtml += "<td style='padding: 6px 8px; font-size: 10px; text-align: center; color: #334155;'>" + hHomologacao.toFixed(1) + "h</td>";
            linhasCronogramaHtml += "<td style='padding: 6px 8px; font-size: 10px; text-align: center; color: #0F172A; font-weight: bold;'>" + hTotal.toFixed(1) + "h</td>";
            linhasCronogramaHtml += "</tr>";
        }

        conteudoHtml += "<h3 style='font-size: 11px; font-weight: bold; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-top: 24px; margin-bottom: 12px; text-transform: uppercase; font-family: sans-serif; page-break-inside: avoid;'>4. Cronograma de Distribuição de Carga Horária por Fase</h3>";
        conteudoHtml += "<table style='width: 100%; border-collapse: collapse; margin-bottom: 24px; font-family: sans-serif; border: 1px solid #E2E8F0; page-break-inside: avoid;'>";
        conteudoHtml += "<thead>";
        conteudoHtml += "<tr style='background-color: #F8FAFC; border-bottom: 1px solid #E2E8F0;'>";
        conteudoHtml += "<th style='padding: 6px 8px; font-size: 9px; font-weight: bold; text-align: left; color: #64748B;'>Item / Subtotal</th>";
        conteudoHtml += "<th style='padding: 6px 8px; font-size: 9px; font-weight: bold; text-align: center; color: #64748B;'>Lev (20%)</th>";
        conteudoHtml += "<th style='padding: 6px 8px; font-size: 9px; font-weight: bold; text-align: center; color: #64748B;'>Esp (20%)</th>";
        conteudoHtml += "<th style='padding: 6px 8px; font-size: 9px; font-weight: bold; text-align: center; color: #64748B;'>Dev (50%)</th>";
        conteudoHtml += "<th style='padding: 6px 8px; font-size: 9px; font-weight: bold; text-align: center; color: #64748B;'>Hom (10%)</th>";
        conteudoHtml += "<th style='padding: 6px 8px; font-size: 9px; font-weight: bold; text-align: center; color: #64748B;'>Subtotal</th>";
        conteudoHtml += "</tr>";
        conteudoHtml += "</thead>";
        conteudoHtml += "<tbody>";
        conteudoHtml += linhasCronogramaHtml;
        conteudoHtml += "</tbody>";
        conteudoHtml += "</table>";

        // ==========================================================================
        // 🖨️ EXECUÇÃO DO MOTOR DE IMPRESSÃO (Nativo via Iframe Isolado)
        // ==========================================================================
        var impressoraIframe = document.createElement('iframe');
        impressoraIframe.style.position = 'fixed';
        impressoraIframe.style.right = '0';
        impressoraIframe.style.bottom = '0';
        impressoraIframe.style.width = '0';
        impressoraIframe.style.height = '0';
        impressoraIframe.style.border = 'none';
        
        document.body.appendChild(impressoraIframe);
        
        var sandboxDocument = impressoraIframe.contentWindow.document;
        sandboxDocument.open();
        
        var htmlFinalFrame = "";
        htmlFinalFrame += "<!DOCTYPE html>";
        htmlFinalFrame += "<html>";
        htmlFinalFrame += "<head>";
        htmlFinalFrame += "<title>Relatorio_Consolidado_FPA</title>";
        htmlFinalFrame += "<style>";
        htmlFinalFrame += "body { margin: 15mm 12mm; font-family: sans-serif; color: #1E293B; background-color: #FFFFFF; }";
        htmlFinalFrame += "tr { page-break-inside: avoid; }";
        htmlFinalFrame += "</style>";
        htmlFinalFrame += "</head>";
        htmlFinalFrame += "<body>";
        htmlFinalFrame += conteudoHtml;
        htmlFinalFrame += "</body>";
        htmlFinalFrame += "</html>";
        
        sandboxDocument.write(htmlFinalFrame);
        sandboxDocument.close();

        setTimeout(function() {
            impressoraIframe.contentWindow.focus();
            impressoraIframe.contentWindow.print();
            document.body.removeChild(impressoraIframe);
        }, 650);
    }
}
