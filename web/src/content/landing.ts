export const hero = {
  badge: "HealthTech para alinhadores removíveis",
  title: "Acompanhe o uso dos alinhadores mesmo entre as consultas.",
  subtitle:
    "O OrthoTrack ajuda clínicas odontológicas a monitorar a aderência dos pacientes, registrar horas de uso e identificar riscos antes que o tratamento atrase.",
  ctaPrimary: "Quero participar do piloto",
  ctaSecondary: "Ver como funciona",
  context: "Criado para tratamentos com alinhadores removíveis que exigem uso diário de 20 a 22 horas.",
};

export const problem = {
  title: "Entre uma consulta e outra, muita coisa acontece.",
  description:
    "Em tratamentos com alinhadores removíveis, a evolução depende da constância do paciente. Mas na prática, a clínica muitas vezes só descobre problemas de aderência semanas depois.",
  cards: [
    {
      title: "O paciente esquece de recolocar",
      text: "Pausas rápidas durante refeições podem virar horas sem uso.",
      icon: "Clock",
    },
    {
      title: "A clínica perde visibilidade",
      text: "O dentista depende do relato do paciente para entender o que aconteceu entre as consultas.",
      icon: "EyeOff",
    },
    {
      title: "O tratamento pode atrasar",
      text: "Baixa aderência compromete a previsibilidade e pode prolongar o tratamento.",
      icon: "AlertTriangle",
    },
    {
      title: "Faltam dados objetivos",
      text: "Sem registros, é difícil saber quais pacientes precisam de atenção antes da próxima consulta.",
      icon: "BarChart3",
    },
  ],
};

export const origin = {
  title: "Uma ideia nascida de uma dor real da ortodontia.",
  paragraphs: [
    "O OrthoTrack surgiu a partir da observação de um problema comum em tratamentos com alinhadores removíveis: o paciente recebe a orientação de usar o aparelho por quase todo o dia, mas a clínica não consegue acompanhar esse comportamento de forma contínua.",
    "A cada consulta, o dentista precisa confiar no relato do paciente. Mas esquecimentos, pausas longas e baixa aderência podem acontecer durante semanas sem gerar nenhum sinal claro para a clínica.",
    "A proposta do OrthoTrack é simples: transformar a rotina de uso dos alinhadores em dados visíveis, organizados e fáceis de acompanhar.",
  ],
  steps: [
    { label: "Dor identificada", description: "Observação de um problema real na ortodontia" },
    { label: "Protótipo do app", description: "Primeira versão para validação com pacientes" },
    { label: "Validação com clínicas", description: "Teste com clínicas parceiras reais" },
  ],
};

export const solution = {
  title: "O OrthoTrack transforma uso diário em acompanhamento clínico.",
  description:
    "Com o app, o paciente registra quando remove e recoloca o alinhador. O sistema calcula automaticamente o tempo de uso, tempo sem uso, média diária, aderência e status de risco.",
  cards: [
    {
      title: "Registro simples",
      text: "O paciente informa quando retira ou recoloca o alinhador.",
      icon: "Smartphone",
    },
    {
      title: "Cálculo automático",
      text: "O sistema calcula horas usadas, pausas, média e aderência.",
      icon: "Calculator",
    },
    {
      title: "Visão para a clínica",
      text: "O dentista acompanha pacientes por status, risco e histórico de uso.",
      icon: "Stethoscope",
    },
  ],
};

export const howItWorks = {
  title: "Simples para o paciente. Valioso para a clínica.",
  steps: [
    {
      number: 1,
      title: "A clínica adiciona o paciente",
      text: "A clínica ou dentista gera um convite e vincula o paciente ao tratamento.",
      icon: "UserPlus",
    },
    {
      number: 2,
      title: "O paciente registra o uso",
      text: "Ao retirar ou recolocar o alinhador, o paciente atualiza seu status no app.",
      icon: "ToggleRight",
    },
    {
      number: 3,
      title: "O sistema calcula a aderência",
      text: "O OrthoTrack transforma eventos de uso em horas, médias, pausas e indicadores.",
      icon: "Activity",
    },
    {
      number: 4,
      title: "O dentista acompanha",
      text: "A clínica visualiza quais pacientes estão em boa aderência, em alerta ou em risco.",
      icon: "LayoutDashboard",
    },
  ],
};

export const clinicalTrust = {
  title: "Complementa o acompanhamento clínico, sem substituir o dentista.",
  text: "O OrthoTrack não substitui a avaliação profissional. A plataforma organiza dados de uso e aderência para ajudar clínicas e dentistas a acompanharem melhor seus pacientes entre as consultas.",
};

export const patientApp = {
  title: "Um app pensado para criar rotina.",
  description:
    "O paciente acompanha seu próprio progresso, entende quanto tempo usou o alinhador e recebe feedback visual sobre sua aderência.",
  cards: [
    {
      title: "Meta diária clara",
      text: "O paciente sabe exatamente quanto falta para atingir a meta.",
      icon: "Target",
    },
    {
      title: "Feedback visual",
      text: "Verde, amarelo e vermelho ajudam o paciente a entender seu desempenho.",
      icon: "Palette",
    },
    {
      title: "Histórico de uso",
      text: "As pausas ficam registradas para consulta posterior.",
      icon: "History",
    },
  ],
};

export const clinicPanel = {
  title: "Visibilidade para o dentista sem depender apenas do relato do paciente.",
  description:
    "O painel da clínica centraliza os pacientes e mostra status atual, horas de uso, aderência e risco de baixa utilização.",
  cards: [
    {
      title: "Status em tempo real",
      text: "Veja quais pacientes estão usando ou estão sem o alinhador.",
      icon: "Radio",
    },
    {
      title: "Pacientes em alerta",
      text: "Identifique rapidamente quem está abaixo da meta ideal.",
      icon: "Bell",
    },
    {
      title: "Detalhes por paciente",
      text: "Acesse histórico, média semanal e comportamento recente.",
      icon: "FileText",
    },
  ],
};

export const reports = {
  title: "Dados que ajudam a tomar decisões melhores.",
  description:
    "O OrthoTrack organiza os registros de uso em relatórios simples, permitindo acompanhar evolução diária e semanal.",
  indicators: [
    { label: "Horas usadas hoje", icon: "Clock" },
    { label: "Horas sem uso hoje", icon: "Pause" },
    { label: "Média semanal", icon: "TrendingUp" },
    { label: "Maior pausa", icon: "AlertCircle" },
    { label: "Aderência", icon: "CheckCircle" },
    { label: "Risco", icon: "Shield" },
  ],
};

export const feedbackColors = {
  title: "Feedback visual para entender aderência rapidamente.",
  items: [
    {
      label: "Boa aderência",
      range: "21h30 ou mais",
      text: "Paciente próximo ou acima da meta diária.",
      color: "success",
    },
    {
      label: "Atenção",
      range: "Entre 18h e 21h29",
      text: "Uso abaixo do ideal, mas ainda recuperável.",
      color: "warning",
    },
    {
      label: "Risco",
      range: "Abaixo de 18h",
      text: "Uso muito abaixo do recomendado.",
      color: "danger",
    },
  ],
};

export const hardwareFuture = {
  badge: "Em desenvolvimento",
  title: "Preparado para monitoramento automático com hardware.",
  text: "A evolução do OrthoTrack inclui uma caixa inteligente capaz de detectar a retirada e o armazenamento do alinhador, sincronizando eventos com o aplicativo via Bluetooth.",
  features: [
    "Quando o alinhador sai da caixa, o app poderá iniciar o monitoramento automaticamente.",
    "Quando o alinhador volta para a caixa, o app poderá pausar o monitoramento.",
    "A luz UV faz parte da proposta futura de higienização.",
    "Essa funcionalidade ainda está em desenvolvimento.",
  ],
};

export const benefits = {
  title: "Mais clareza no acompanhamento, sem aumentar a carga da equipe.",
  items: [
    {
      title: "Menos achismo",
      text: "A clínica passa a acompanhar dados reais de uso.",
      icon: "Search",
    },
    {
      title: "Pacientes mais conscientes",
      text: "O app ajuda o paciente a visualizar sua própria rotina.",
      icon: "Lightbulb",
    },
    {
      title: "Identificação de risco",
      text: "Pacientes com baixa aderência ficam mais fáceis de acompanhar.",
      icon: "AlertTriangle",
    },
    {
      title: "Diferencial competitivo",
      text: "A clínica oferece uma experiência mais moderna para pacientes com alinhadores.",
      icon: "Award",
    },
    {
      title: "Relatórios organizados",
      text: "Informações claras para discutir evolução e comportamento.",
      icon: "ClipboardList",
    },
    {
      title: "Base para acompanhamento contínuo",
      text: "O sistema cria uma ponte entre paciente e clínica durante o tratamento.",
      icon: "Link",
    },
  ],
};

export const ctaIntermediate = {
  title: "Quer validar o OrthoTrack na sua clínica?",
  description:
    "Estamos buscando clínicas parceiras para testar uma nova forma de acompanhar pacientes com alinhadores removíveis.",
  cta: "Quero participar do piloto",
};

export const pilotForm = {
  title: "Faça parte das primeiras clínicas a testar o OrthoTrack.",
  description:
    "Estamos selecionando clínicas parceiras para validar o acompanhamento digital de pacientes com alinhadores removíveis.",
  fields: [
    { name: "nome", label: "Seu nome", placeholder: "Nome completo", required: true },
    { name: "clinica", label: "Nome da clínica", placeholder: "Nome da clínica", required: true },
    { name: "whatsapp", label: "WhatsApp", placeholder: "(00) 00000-0000", required: true },
    { name: "cidade", label: "Cidade", placeholder: "Cidade e estado", required: true },
    { name: "qtdPacientes", label: "Quantidade aproximada de pacientes com alinhadores", placeholder: "Ex: 20", required: true },
  ],
  submitText: "Quero participar do piloto",
  submittingText: "Enviando...",
  successMessage: "Obrigado! Recebemos seu interesse e entraremos em contato para apresentar o OrthoTrack.",
  errorMessage: "Não foi possível enviar agora. Verifique os dados e tente novamente.",
};
