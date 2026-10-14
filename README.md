
🧱 1. Estrutura Geral e Layout Base (Reset)

• * (Seletor Universal): Zera as margens e espaçamentos padrão do navegador. O box-sizing: border-box garante que se você definir que uma caixa tem 100px de largura, o preenchimento interno não vai "esticar" ela para 110px. Ela mantém os 100px.
• body (O corpo do site): Ocupa 100% da altura da tela (100vh). O display: flex com flex-direction: column empilha a barra superior e o conteúdo como blocos verticais. O overflow: hidden "trava" a tela para que o site inteiro nunca mostre aquela barra de rolagem lateral esquisita.
• .layout-shell:** Cria uma área flexível logo abaixo da barra superior. O flex: 1 diz: "Preencha todo o espaço que sobrar na tela".
• .viewport-content:** É a área principal onde as telas mudam. O overflow-y: auto faz com que, se o conteúdo dessa área específica for muito longo, apenas essa parte ganhe uma barra de rolagem vertical, mantendo o resto do site fixo.

📐 2. Alinhamentos Avançados (Flexbox e Grid)

O código usa muito duas ferramentas modernas de posicionamento: o Flexbox (para alinhar coisas em linha ou coluna única) e o Grid (para dividir a tela em colunas de tabelas ou painéis).

Classes que usam Flexbox (Alinhamento em linha/bloco)

• .app-bar (Barra Superior): Usa display: flex para colocar a logo e as tags em linha. O justify-content: space-between joga a logo totalmente para a esquerda e as tags para a direita.
• .navigation-menu (Menu Lateral): Organiza os botões de navegar em uma coluna perfeita (flex-direction: column) e centraliza todos eles no meio dela (align-items: center).
• .painel-inputs-funcao:** Alinha os campos de texto um ao lado do outro. O flex-wrap: wrap é o segredo aqui: se a tela encolher e os campos não couberem na mesma linha, eles quebram para a linha de baixo automaticamente.
• .flex-3 / .flex-2:** Usados dentro de áreas Flexbox. O flex: 3 diz que aquele campo deve crescer o triplo do tamanho proporcional em relação aos outros, mas respeitando uma largura mínima (min-width) para não esmagar.

Classes que usam Grid (Divisão de Tela)

• .painel-fpa-grid:** Divide a tela em duas colunas. O grid-template-columns: 4fr 3fr cria uma coluna maior (lado esquerdo) e uma um pouco menor (lado direito). O gap: 20px cria um espaço de 20px entre elas.
• .linha-adaptativa:** Divide o espaço em duas colunas exatamente iguais (1fr 1fr).

📱 3. Responsividade (Adaptação para Celulares)

As regras com @media servem para mudar o comportamento do design dependendo da largura da tela do usuário:
• @media (max-width: 850px):** Quando a tela for menor que 850px, o .painel-fpa-grid e a .linha-adaptativa mudam para grid-template-columns: 1fr. Isso faz com que as duas colunas virem uma coluna única, empilhando o conteúdo para caber em tablets.
• @media (max-width: 650px):** Faz com que os campos do formulário inline (.painel-inputs-funcao) mudem de linha para coluna (flex-direction: column). Os botões de salvar que eram pequenininhos passam a ocupar 100% da largura da tela para facilitar o clique com o dedo.
• @media (max-width: 600px) (Inversão para Celular): Aqui acontece a mágica. O menu que era lateral passa para a parte de baixo da tela (flex-direction: column-reverse) igual a um aplicativo de celular. O menu .navigation-menu muda sua largura para 100% e espalha os ícones horizontalmente com justify-content: space-around.

🛡️ 4. Proteções de Texto e Tabelas

• .projeto-tag:** Possui propriedades cruciais para evitar que o texto quebre o layout. O white-space: nowrap obriga o texto a ficar em uma linha só. O overflow: hidden esconde o que passar do limite da caixinha. O text-overflow: ellipsis adiciona os três pontinhos (...) automaticamente se o texto for longo demais.
• .tabela-responsiva:** O overflow-x: auto cria uma barra de rolagem horizontal apenas na tabela se ela for muito larga para a tela do celular, impedindo que ela quebre o resto do design do site.
• th.col-tipo, th.col-num, etc:** Usam propriedades de width fixas para travar a largura exata de cada coluna da tabela.

💡 5. Interações, Animações e Truques Visual/Lógicos

• .nav-item, .btn-fpa-salvar:** Usam cursor: pointer para fazer com que a setinha do mouse vire aquela "mãozinha" de clique. O transition: all 0.2s ease faz com que qualquer mudança de cor ou efeito demore 0,2 segundos para acontecer, tornando a transição suave e não um piscar brusco.
• .btn-acao-tabela:hover:** O :hover ativa quando o usuário passa o mouse por cima do botão. O transform: scale(1.15) dá um efeito de zoom de 15% no botão, dando um feedback visual de que ele é clicável.
• .exibir-bloco e .ocultar-bloco:** São classes utilitárias geralmente controladas por programação (JavaScript). O display: none !important força o elemento a sumir completamente da tela e não ocupar espaço nenhum.
• .sub-tab-item.active::after:** O ::after cria um elemento "fantasma" dentro do HTML. Nesse caso, ele é usado para desenhar aquela linha horizontal de destaque embaixo da aba que está selecionada no momento.