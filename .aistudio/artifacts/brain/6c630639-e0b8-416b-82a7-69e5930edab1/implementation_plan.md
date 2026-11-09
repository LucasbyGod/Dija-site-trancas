# Estúdio Dija Tranças - Plataforma de Agendamento Online & Catálogo Didático

Sistema web moderno, elegante e mobile-first para o **Estúdio Dija Tranças** (localizado no bairro Damas, Fortaleza - CE), projetado para eliminar respostas repetitivas no WhatsApp/Instagram, apresentar o catálogo completo com transparência, permitir agendamento didático passo a passo com reserva via sinal PIX de R$ 50,00 e valorizar a arte e ancestralidade das tranças afros.

---

## Revisão do Usuário & Decisões Confirmadas

> [!IMPORTANT]
> Decisões alinhadas com o cliente na Fase 1:
> - **Confirmação e Notificação do Agendamento**: Ao concluir a reserva e conferir os dados do sinal PIX, o sistema gera a mensagem oficial formatada e aciona a notificação direta via **WhatsApp** da proprietária (`85 9100-2233`) com cópia e persistência do agendamento.
> - **Organização do Catálogo**: Organizado em **abas por categorias** (ex.: *Tranças Soltas & Crochet*, *Nagô & Tiara*, *Entrelace & French Curl*, *Masculino*, *Manutenção & Retirada*) com campo de busca instantânea e sem estimativa rígida de duração, mantendo foco na técnica, materiais e variações de preço.
> - **Promoção Cartão Fidelidade**: Destaque em **banner dourado interativo** com contador interativo e simulador de carimbos ("A cada 5 procedimentos, o 6º sai pela metade do preço"), além de selo informativo transparente no agendamento.
> - **Logo Oficial**: O logotipo anexado (`/public/assets/aistudio/Dija_Tran_as_Logo_acda334d.jpeg`) será incorporado com tratamento de borda dourada luxuosa, filtro óptico de nitidez e acabamento escovado harmonizado com a paleta.

---

## 1. Visão Geral & Conceito Central

- **O que a aplicação entrega**: Uma experiência digital completa, rápida e didática onde clientes de qualquer gênero e idade exploram o portfólio e catálogo oficial com preços reais e pacotes (ex.: 1 pacote vs 2 pacotes, apenas mão de obra vs material incluso), calculam o valor exato, agendam data e horário disponíveis, recebem as instruções da chave PIX para o sinal obrigatório de R$ 50,00 e enviam o comprovante diretamente para o WhatsApp do Estúdio.
- **Público-Alvo**: Clientes e admiradores de tranças afros, nagô, box braids, entrelace, crochet braids e dreads em Fortaleza e Região Metropolitana que buscam agilidade e clareza antes de sair de casa.
- **Valor Principal**: Economia de horas diárias da trancista com orçamentos manuais repetitivos, fim de no-shows através da garantia de sinal não-reembolsável, e posicionamento de marca de alto padrão.

---

## 2. Experiência do Usuário & Design Visual

### Fluxo do Usuário
1. **Header e Hero**: Recepção impactante com a marca Dija Tranças em dourado e preto profundo, botão direto de "Agendar Horário" e atalhos rápidos.
2. **Banner Fidelidade & Benefícios**: Destaque da regra do 6º procedimento com 50% de desconto e diferenciais do atendimento.
3. **Catálogo Interativo de Serviços**: Abas temáticas e barra de busca. Cards contendo nome, descrição detalhada do procedimento (método costurado, nós, adição de jumbo, etc.), valores por pacote e botão de seleção imediata.
4. **Agendador Passo a Passo Didático (4 Passos)**:
   - *Passo 1*: Serviço e variações selecionadas (com opção de pacotes/aplicação).
   - *Passo 2*: Calendário inteligente com seleção de dia e grade de horários disponíveis do Estúdio.
   - *Passo 3*: Identificação rápida do cliente (Nome completo, WhatsApp com DDD, observações ou tipo de cabelo).
   - *Passo 4*: Termo de Confirmação & Chave PIX do Sinal (R$ 50,00), alerta transparente sobre a não devolução por reserva exclusiva, botão Copia-e-Cola da chave PIX e botão de finalização com disparo imediato para o WhatsApp oficial com resumo preenchido.
5. **Guia Didático "Como Cuidar das Suas Tranças"**: Perguntas frequentes e dicas práticas de lavagem com xampu diluído, secagem completa, touca de cetim e tempo recomendado de permanência.
6. **Galeria de Inspirações & Trabalhos**: Grid responsivo com fotos de alta qualidade exibindo os estilos (Box Braids, Nagô, Gypsy, French Curl, Masculino, etc.) e modal de visualização em tela cheia.
7. **Espaço de Avaliações & Depoimentos**: Comentários de clientes com estrelas, depoimento interativo e botões de compartilhamento social para WhatsApp e Instagram.
8. **Rodapé Completo**: Endereço (Rua Desembargador Praxedes 171, Damas, Fortaleza - CE), mapa/rotas, links de contato e horários de funcionamento.

### Identidade Visual & Tema
- **Paleta de Cores (60-30-10)**:
  - *60% Neutro Dominante*: Preto profundo (`#0A0A0B`) e grafite escuro (`#121214`) criando atmosfera intimista e refinada.
  - *30% Superfícies Estruturais*: Tons ébano com bordas metálicas suaves em dourado envelhecido (`rgba(212, 175, 55, 0.2)`), fundos foscos e tipografia em off-white (`#F4F4F6`).
  - *10% Dourado Nobre de Ação*: Dourado imperial (`#D4AF37`, `#F59E0B`, degradê dourado acetinado `#E5C158`) nos botões de conversão primários, destaques do logotipo e indicadores de etapa.
- **Tipografia**:
  - *Display / Títulos*: `Playfair Display` & `Outfit` — elegância editorial com toque contemporâneo.
  - *Corpo & Legibilidade*: `Plus Jakarta Sans` — didático, limpo e legível em qualquer resolução mobile.
  - *Números & Valores*: `tabular-nums` alinhados para valores em R$.
- **Anti-Slop & Mobile First**:
  - Nada de pills genéricas ou tags mecânicas. Metadados e preços expostos com tipografia limpa.
  - Alvos de toque generosos ($\ge 44\text{px}$) otimizados para smartphones.
  - Logo original tratado com anel dourado sutil e contraste nítido.

---

## 3. Principais Decisões de Produto & Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                       ESTÚDIO DIJA TRANÇAS                  │
│                     (Aplicação React + Vite)                │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┼────────────────────────┐
       ▼                       ▼                        ▼
┌──────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ Top Bar &    │      │  Catálogo &     │      │   Agendamento   │
│ Hero Section │      │  Abas Temáticas │      │  Didático (1-4) │
└──────────────┘      └────────┬────────┘      └────────┬────────┘
                               │                        │
       ┌───────────────────────┴────────────────────────┘
       ▼
┌─────────────────────────────────────────────────────────────┐
│                      LÓGICA & INTEGRAÇÕES                   │
│  - Chave PIX Copia-e-Cola (Sinal R$ 50,00)                  │
│  - Validação de Horários e Dados do Cliente                 │
│  - Disparo de Mensagem Formatada via WhatsApp API           │
│  - Armazenamento Local de Agendamentos & Avaliações         │
│  - Guia de Cuidados & Galeria Interativa                    │
└─────────────────────────────────────────────────────────────┘
```

1. **Notificação de Agendamento via WhatsApp Link Oficial**:
   - Criação de URL universal `https://wa.me/558591002233?text=...` com mensagem perfeitamente codificada contendo: Nome do cliente, serviço escolhido com variação, data, horário, valor total, aviso do sinal de R$ 50,00 e instrução de envio do comprovante. Isso garante que a trancista receba na hora sem depender de servidores de e-mail instáveis.
2. **Regra Transparente do Sinal de R$ 50,00**:
   - Modal/passo dedicado com aviso destacado em caixa dourada com texto literal exigido: *"Para garantir a sua vaga, é necessário o pagamento de um sinal de R$ 50,00. O valor do adiantamento não será devolvido sob nenhuma justificativa, pois é destinado à reserva exclusiva do seu horário."*
   - Chave PIX em destaque (e-mail cadastrado `dijatrancascadidabo@gmail.com` ou telefone `8591002233`) com botão de 1 clique "Copiar Chave PIX" e feedback tátil de sucesso.
3. **Catálogo Estruturado Fiel à Tabela Fornecida**:
   - Inclusão exata de todos os procedimentos enviados: Crochet braids (1 pacote, 2 pacotes, apenas aplicação), Fulany braids (normal, entrelace, com cachos), Gypsy braids / Goddess com cachos Nina, Nina Softex (cintura e meio das costas), Box braids (normal, texturização pontas, masculino), French curl, Entrelace tradicional, Trança Chanel / Long bob, Nagô (com cachos/abacaxi, grossa, tiara frontal, masculino), Retiradas + Lavagem e Dread removível reutilizável.
4. **Reserva e Gestão Local**:
   - Dados salvos em `localStorage` para que o usuário ou a proprietária consulte os agendamentos registrados no dispositivo, permitindo visualização de histórico.

---

## 4. Estratégia de Implementação e Verificação

- **Fase 1**: Atualização do `metadata.json` e `<head>` com título e metatags adequados para Estúdio Dija Tranças.
- **Fase 2**: Implementação dos componentes principais:
  - `Navbar` com logo do salão, navegação e botão de agendamento.
  - `Hero` com chamada sofisticada, fotos autênticas e botão de ação rápida.
  - `LoyaltyBanner` com o simulador de carimbos da promoção dos 5 procedimentos.
  - `ServicesCatalog` com abas categorizadas e busca instantânea.
  - `BookingModal` (ou seção de agendamento 4 passos) didático, com calendário, horários, cálculo e aviso do sinal PIX.
  - `CareGuide` com perguntas e respostas didáticas sobre como cuidar das tranças.
  - `Gallery` com visualizador de estilos de tranças afros.
  - `ReviewsSection` com notas reais e formulário para novos depoimentos.
  - `Footer` com todos os dados de contato, endereço no Damas e atalhos.
- **Fase 3**: Verificação via `compile_applet` e testes de responsividade e fluxo de cópia PIX e WhatsApp.
