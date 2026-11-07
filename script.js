// ==========================================
// MARATONA TECH
// DESINFORMAÇÃO EM SAÚDE
// KARINA COSTA NUNES · 2026
// ==========================================


// ==========================================
// 1. DADOS DA PESQUISA
// ==========================================

const TOTAL_PARTICIPANTES = 30;

const colors = [
  '#397FCA',
  '#E47782',
  '#F2A36F',
  '#91AD9A',
  '#9565B8'
];

const researchData = {

  q1: {

    labels: [
      'Sim',
      'Não',
      'Às vezes',
      'Raramente',
      'Nunca'
    ],

    values: [10, 7, 6, 4, 3]

  },

  q2: {

    labels: [
      'Sim',
      'Não',
      'Talvez',
      'Raramente',
      'Nunca'
    ],

    values: [9, 9, 6, 2, 4]

  }

};


// ==========================================
// 2. CÁLCULO DOS PERCENTUAIS
// ==========================================

function getPercentage(value) {

  const result = (value / TOTAL_PARTICIPANTES) * 100;

  return result.toFixed(1).replace('.', ',') + '%';

}


// ==========================================
// 3. CRIAÇÃO DAS LEGENDAS
// ==========================================

function createLegend(elementId, data) {

  const element = document.getElementById(elementId);

  if (!element) return;

  element.innerHTML = data.labels.map((label, index) => {

    return `

      <li>

        <span
          class="legend-dot"
          style="background-color: ${colors[index]}"
        ></span>

        <span>${label}</span>

        <small>
          ${getPercentage(data.values[index])}
        </small>

      </li>

    `;

  }).join('');

}


// ==========================================
// 4. MENSAGENS INTERATIVAS
// ==========================================

function showMessage(message) {

  let toast = document.getElementById('toast');

  if (!toast) {

    toast = document.createElement('div');

    toast.id = 'toast';

    toast.className = 'toast';

    document.body.appendChild(toast);

  }

  toast.textContent = message;

  toast.classList.add('show');

  clearTimeout(window.messageTimeout);

  window.messageTimeout = setTimeout(() => {

    toast.classList.remove('show');

  }, 2500);

}


// ==========================================
// 5. CONFIGURAÇÃO DOS GRÁFICOS
// ==========================================

const commonOptions = {

  responsive: true,

  maintainAspectRatio: false,

  cutout: '62%',

  animation: {

    duration: 1300,

    animateRotate: true,

    animateScale: true

  },

  plugins: {

    legend: {

      display: false

    },

    tooltip: {

      backgroundColor: '#205B9C',

      titleFont: {

        family: 'DM Sans',

        size: 13

      },

      bodyFont: {

        family: 'DM Sans',

        size: 12

      },

      padding: 12,

      cornerRadius: 10,

      callbacks: {

        label: function(context) {

          const quantidade = context.raw;

          return ` ${quantidade} respostas · ${getPercentage(quantidade)}`;

        }

      }

    }

  }

};


// ==========================================
// 6. CRIAÇÃO DOS GRÁFICOS
// ==========================================

function createChart(canvasId, data) {

  const canvas = document.getElementById(canvasId);

  if (!canvas) return null;

  if (typeof Chart === 'undefined') {

    console.error(
      'Chart.js não foi carregado. Verifique sua conexão com a internet.'
    );

    showMessage(
      'Não foi possível carregar os gráficos. Verifique a internet.'
    );

    return null;

  }

  return new Chart(canvas, {

    type: 'doughnut',

    data: {

      labels: data.labels,

      datasets: [{

        data: data.values,

        backgroundColor: colors,

        borderColor: '#FFFFFF',

        borderWidth: 3,

        hoverOffset: 10,

        spacing: 1

      }]

    },

    options: {

      ...commonOptions,

      onClick: function(event, elements, chart) {

        if (!elements.length) return;

        const index = elements[0].index;

        const label = chart.data.labels[index];

        const value = chart.data.datasets[0].data[index];

        showMessage(
          `${label}: ${value} participantes (${getPercentage(value)}).`
        );

      }

    }

  });

}


// ==========================================
// 7. INICIALIZAÇÃO DOS GRÁFICOS
// ==========================================

createLegend(
  'legendOne',
  researchData.q1
);

createLegend(
  'legendTwo',
  researchData.q2
);

const chartOne = createChart(
  'chartOne',
  researchData.q1
);

const chartTwo = createChart(
  'chartTwo',
  researchData.q2
);


// ==========================================
// 8. FILTRO INTERATIVO
// ==========================================

const questionFilter = document.getElementById('questionFilter');

const cardOne = document.getElementById('card-q1');

const cardTwo = document.getElementById('card-q2');

if (questionFilter && cardOne && cardTwo) {

  questionFilter.addEventListener('change', function() {

    const selected = this.value;

    cardOne.classList.toggle(
      'is-hidden',
      selected === 'q2'
    );

    cardTwo.classList.toggle(
      'is-hidden',
      selected === 'q1'
    );

    if (selected === 'all') {

      showMessage(
        'Exibindo todas as perguntas.'
      );

    } else if (selected === 'q1') {

      showMessage(
        'Exibindo a primeira pergunta.'
      );

    } else {

      showMessage(
        'Exibindo a segunda pergunta.'
      );

    }

    setTimeout(() => {

      if (chartOne) chartOne.resize();

      if (chartTwo) chartTwo.resize();

    }, 180);

  });

}


// ==========================================
// 9. ANÁLISE DOS RESULTADOS
// ==========================================

document.querySelectorAll('.explain-button').forEach(button => {

  button.addEventListener('click', function() {

    const targetId = this.dataset.target;

    const detail = document.getElementById(targetId);

    if (!detail) return;

    const opened = detail.classList.toggle('open');

    this.classList.toggle('active', opened);

    this.setAttribute(
      'aria-expanded',
      String(opened)
    );

    this.innerHTML = opened

      ? 'Fechar análise <span>×</span>'

      : 'Analisar resultado <span>↗</span>';

  });

});


// ==========================================
// 10. MODO ESCURO
// ==========================================

const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {

  themeToggle.addEventListener('click', function() {

    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');

    this.textContent = isDark ? '☀' : '☾';

    this.setAttribute(
      'aria-label',
      isDark ? 'Ativar modo claro' : 'Ativar modo escuro'
    );

  });

}


// ==========================================
// 11. VOLTAR AO INÍCIO
// ==========================================

const backTop = document.getElementById('backTop');

if (backTop) {

  backTop.addEventListener('click', function() {

    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });

  });

}


// ==========================================
// FIM DO SCRIPT
// KARINA COSTA NUNES · 2026
// ==========================================