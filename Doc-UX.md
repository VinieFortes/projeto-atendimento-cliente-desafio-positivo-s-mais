Segue um relatório técnico com justificativas detalhadas para cada decisão de design, incluindo princípios de UX e fundamentos cognitivos aplicados:

---

### **1. Estrutura Centralizada dos Elementos (Cards e Modais)**
#### **Justificativa**
- A estrutura centralizada facilita a escaneabilidade visual, pois respeita o princípio da **Proximidade (Gestalt)**, onde elementos agrupados em áreas bem definidas são mais facilmente compreendidos.
- O posicionamento central dos modais e cards melhora a usabilidade em dispositivos móveis. O ponto focal central reduz o esforço ocular e motor do usuário, atendendo ao **Princípio de Fitts**, que destaca a importância de tornar os alvos clicáveis mais acessíveis e próximos.
- Em dispositivos menores, a centralização garante que elementos-chave estejam ao alcance do polegar, respeitando o conceito de **Mobile-First Design**.
---

### **2. Contraste e Hierarquia Visual**
#### **Justificativa**
- O uso de cores distintas para os botões de ação (como "Sim" em azul e "Não" em vermelho) segue o princípio da **Distinção de Ações Primárias e Secundárias**, ajudando o usuário a identificar rapidamente qual ação é mais relevante.
- A hierarquia textual (títulos maiores, mensagens menores) respeita o princípio de **Cognitividade Reduzida**, permitindo que o usuário compreenda o conteúdo sem sobrecarga cognitiva.
---

### **3. Feedback Imediato**
#### **Justificativa**
- Mensagens como "Tem certeza de que deseja sair?" e "Usuário ou senha inválidos" fornecem feedback imediato, respeitando o princípio de **Visibilidade do Estado do Sistema** (Nielsen). Esse feedback mantém o usuário informado sobre o resultado de suas ações.
- A confirmação de ações sensíveis (como logout e encerramento de atendimento) respeita o princípio da **Prevenção de Erros**, ajudando o usuário a revisar antes de executar uma ação irreversível.
---

### **4. Barra de Pesquisa na Lista de Clientes**
#### **Justificativa**
- A inclusão da barra de pesquisa segue o princípio de **Reconhecimento em vez de Memorização** (Nielsen), permitindo que os usuários filtrem informações sem a necessidade de percorrer toda a lista.
- O placeholder "Pesquisar clientes" é um exemplo de **Guias Visuais**, que orientam o usuário e reduzem a incerteza na interação.
---

### **5. Design Responsivo**
#### **Justificativa**
- O layout responsivo, com elementos ajustados para centralização e botões bem espaçados, atende ao **Princípio da Flexibilidade e Eficiência de Uso** (Nielsen), permitindo que tanto usuários avançados quanto iniciantes naveguem facilmente.
- O botão "Visualizar Dashboard", posicionado no canto inferior direito, é um exemplo de design orientado ao toque, garantindo que ações importantes estejam acessíveis no **Espaço de Conforto do Polegar**.
---

### **6. Consistência na Navegação**
#### **Justificativa**
- A presença de elementos como o botão de voltar (⬅) no canto esquerdo e a disposição fixa da lista de clientes segue o princípio da **Consistência e Padrões** (Nielsen). Isso ajuda os usuários a preverem o comportamento do sistema.