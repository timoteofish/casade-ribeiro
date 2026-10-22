const shutterPanels = document.querySelectorAll('.page-shutter__panel');
const searchForm = document.querySelector('.menu-search');
const searchToggle = document.querySelector('.menu-search__toggle');
const searchInput = document.querySelector('#menu-search');
const openingStatus = document.querySelector('.opening-status');
const openingStatusText = document.querySelector('.opening-status__text');
const rotatingTagline = document.querySelector('[data-rotating-tagline]');
const rotatingTaglineText = rotatingTagline.querySelector('.opening-status__text');
let catalogCards = [];
let catalogSections = [];
const catalog = document.querySelector('.catalog');
const noResults = document.querySelector('.catalog__no-results');
const categoryNav = document.querySelector('.category-nav');
const categoryNavPrevious = document.querySelector('.category-nav__arrow--prev');
const categoryNavNext = document.querySelector('.category-nav__arrow--next');
let categoryNavDirection = 1;
let categoryNavPaused = false;
let categoryNavResumeTimer;

function pauseCategoryNav() {
  categoryNavPaused = true;
  window.clearTimeout(categoryNavResumeTimer);
  categoryNavResumeTimer = window.setTimeout(() => {
    categoryNavPaused = false;
  }, 7000);
}
const cartButton = document.querySelector('.cart-button');
const cartCount = document.querySelector('.cart-button__count');
const mobileCart = document.querySelector('.mobile-cart');
const mobileCartCount = document.querySelector('.mobile-cart__count');
const mobileCartTotal = document.querySelector('.mobile-cart__total');
const orderBag = document.querySelector('#order-bag');
const closeBagButton = document.querySelector('.order-bag__close');
const emptyBag = document.querySelector('.order-bag__empty');
const bagList = document.querySelector('.order-bag__list');
const bagTotal = document.querySelector('.order-bag__total strong');
const checkoutButton = document.querySelector('.order-bag__checkout');
const orderNotes = document.querySelector('#order-notes');
const paymentMethod = document.querySelector('#payment-method');
const drinkChoiceDialog = document.querySelector('#drink-choice-dialog');
const drinkChoiceForm = document.querySelector('#drink-choice-form');
const drinkChoiceInput = document.querySelector('#drink-choice');
const drinkChoiceBack = document.querySelector('.drink-choice__back');
const closedNotice = document.querySelector('#closed-notice');
const closedNoticeClose = document.querySelector('.closed-notice__close');
const simulateClosed = false;
const cartItems = new Map();
let pendingDrinkButton;

function updateCategoryNavArrows() {
  if (!categoryNav || !categoryNavPrevious || !categoryNavNext) return;
  const maxScroll = categoryNav.scrollWidth - categoryNav.clientWidth;
  categoryNavPrevious.hidden = maxScroll <= 0 || categoryNav.scrollLeft <= 1;
  categoryNavNext.hidden = maxScroll <= 0 || categoryNav.scrollLeft >= maxScroll - 1;
}

categoryNav?.addEventListener('scroll', updateCategoryNavArrows, { passive: true });
categoryNavPrevious?.addEventListener('click', () => {
  pauseCategoryNav();
  categoryNav?.scrollBy({ left: -(categoryNav.clientWidth * 0.78), behavior: 'smooth' });
});
categoryNavNext?.addEventListener('click', () => {
  pauseCategoryNav();
  categoryNav?.scrollBy({ left: categoryNav.clientWidth * 0.78, behavior: 'smooth' });
});
categoryNav?.addEventListener('wheel', pauseCategoryNav, { passive: true });
categoryNav?.addEventListener('touchstart', pauseCategoryNav, { passive: true });
window.setInterval(() => {
  if (!categoryNav || categoryNavPaused || categoryNav.scrollWidth <= categoryNav.clientWidth)
    return;
  const maxScroll = categoryNav.scrollWidth - categoryNav.clientWidth;
  const nextScroll = categoryNav.scrollLeft + categoryNavDirection * 0.7;
  if (nextScroll >= maxScroll) categoryNavDirection = -1;
  if (nextScroll <= 0) categoryNavDirection = 1;
  categoryNav.scrollLeft = Math.max(0, Math.min(maxScroll, nextScroll));
}, 24);
window.addEventListener('resize', updateCategoryNavArrows);
window.requestAnimationFrame(updateCategoryNavArrows);

const taglineMessages = [
  'Cardápio digital',
  'Aberto das 08h às 00h',
  'Comida boa é aqui',
  'Temos Quinta do Dendê',
];
let taglineIndex = 0;

function rotateTagline() {
  rotatingTagline.classList.add('is-changing');
  window.setTimeout(() => {
    taglineIndex = (taglineIndex + 1) % taglineMessages.length;
    rotatingTaglineText.textContent = taglineMessages[taglineIndex];
    rotatingTagline.classList.remove('is-changing');
  }, 180);
}

window.setInterval(rotateTagline, 3500);

function updateOpeningStatus() {
  const now = new Date();
  const hour = now.getHours();
  const isClosingSoon = !simulateClosed && hour === 23;
  const isOpen = !simulateClosed && hour >= 8;
  openingStatus.classList.toggle('is-open', isOpen);
  openingStatus.classList.toggle('is-closing', isClosingSoon);
  openingStatus.classList.toggle('is-closed', !isOpen);
  openingStatusText.textContent = isClosingSoon
    ? 'Quase fechando · Fecha às 00h'
    : isOpen
      ? 'Aberto agora · 08h às 00h'
      : 'Fechado agora · Abre às 08h';
}

function isRestaurantOpen() {
  return !simulateClosed && new Date().getHours() >= 8;
}

updateOpeningStatus();
setInterval(updateOpeningStatus, 60000);

const menuCatalog = [
  [
    'Todos os dias',
    'daily-title',
    [
      ['Comida Baiana', 25.0, 'Acompanha arroz, farofa, salada e vinagrete.'],
      [
        'Sarapatel',
        25.0,
        'Ingredientes e acompanhamentos não especificados individualmente no cardápio.',
      ],
      [
        'Mocotó',
        25.0,
        'Ingredientes e acompanhamentos não especificados individualmente no cardápio.',
      ],
      [
        'Rabada',
        25.0,
        'Ingredientes e acompanhamentos não especificados individualmente no cardápio.',
      ],
      [
        'Feijoada',
        25.0,
        'Ingredientes e acompanhamentos não especificados individualmente no cardápio.',
      ],
      ['Filé à Parmegiana', 44.0, 'Arroz e purê de batata.'],
    ],
  ],
  [
    'Quinta do Dendê',
    'dende-title',
    [
      ['Acarajé com Camarão', 19.0],
      ['Acarajé sem Camarão', 16.0],
      ['Abará com Camarão', 19.0],
      ['Abará sem Camarão', 16.0],
      ['Mini Acarajé com Camarão (6 un.)', 19.0],
      ['Mini Acarajé com Camarão (12 un.)', 37.0],
      ['Mini Acarajé sem Camarão (6 un.)', 19.0],
      ['Mini Acarajé sem Camarão (12 un.)', 37.0],
    ],
  ],
  [
    'Espetinhos',
    'skewers-title',
    [
      ['Carne Bovina', 10.0, 'Espetinho de carne bovina.'],
      ['Coração', 10.0, 'Espetinho de coração.'],
      ['Porco', 10.0, 'Espetinho de carne suína.'],
      ['Frango', 10.0, 'Espetinho de frango.'],
      ['Queijo Coalho', 10.0, 'Espetinho de queijo coalho.'],
      ['Pão de Alho', 6.0, 'Pão de alho, vinagrete e farofa'],
    ],
  ],
  [
    'Petiscos',
    'snacks-title',
    [
      ['Batata Frita Pequena', 9.0],
      ['Batata Frita Média', 14.0],
      ['Batata Frita Grande', 24.0],
      ['Batata Frita com Cheddar e Bacon', 32.0],
      ['Aipim Frito Pequeno', 14.0],
      ['Aipim Frito Grande', 24.0],
      ['Camarão Alho e Óleo', 55.0],
      ['Filé com Fritas', 40.0],
      ['Carne de Sol com Fritas', 45.0],
      ['Carne de Sol com Aipim', 50.0],
      ["Charque com Farofa d'Água", 50.0],
      ['Kibe (6 un.)', 17.0],
      ['Pastel (6 un.)', 17.0, 'Carne e frango'],
      ['Pastel Grande Tradicional', 17.0, 'Frango, carne, queijo, presunto'],
      ['Pastel Grande de Charque', 21.0, 'Charque com banana da terra'],
    ],
  ],
  [
    'Bebidas',
    'drinks-title',
    [
      ['Água sem gás', 3],
      ['Água com gás', 4],
      ['Água sem gás 1,5 L', 6],
      ['H2O', 7],
      ['Refrigerante em Lata', 6],
      ['Refrigerante 200 ml', 3],
      ['Coca-Cola 1 L', 10],
      ['Coca-Cola 600 ml', 7],
      ['Refrigerante 1 L', 8],
      ['Red Bull', 16],
      ['Monster', 16],
    ],
  ],
  [
    'Cervejas',
    'beers-title',
    [
      ['Heineken 600 ml', 16],
      ['Stella Artois 550 ml', 15],
      ['Stella Artois Pure Golden', 20, 'Cerveja Stella Artois Pure Golden.'],
      ['Original 600ml', 14],
      ['Spaten 600ml', 12],
      ['Brahma Chopp 600ml', 12],
      ['Skol 600ml', 10],
      ['Amstel 600ml', 12],
      ['Amstel 300ml', 6],
      ['Skol 300ml', 5],
      ['Cervejas de lata', 6],
      ['Long Neck', 10],
    ],
  ],
  [
    'Quentes',
    'hot-drinks-title',
    [
      ["Whisky Ballantine's", 16],
      ['Whisky Red', 16],
      ['Caipirinha', 8],
      ['Caipirosca', 14],
      ['Conhaque', 6],
      ['Domecq', 8],
      ['Campari', 10],
      ['Alcatrão', 6],
      ['Asa Branca', 5],
      ['Pitú', 3],
    ],
  ],
  [
    'Hambúrgueres',
    'burgers-title',
    [
      ['Hambúrguer', 10.0, 'Pão, salada, molho especial e carne'],
      ['Hambúrguer Especial', 13.0, 'Pão, salada, molho especial, carne, queijo e batata palha.'],
      ['X-Burguer', 15.0, 'Pão, salada, molho especial, carne, queijo e presunto.'],
      ['X-Bacon', 18.0, 'Pão, molho especial, carne, bacon e queijo.'],
      ['American Burguer', 18, 'Pão, salada, molho especial, carne, ovo, queijo e presunto.'],
      ['X-Salada', 16.0, 'Pão, salada, molho especial, carne e batata palha.'],
      ['Egg Burguer', 18.0, 'Pão, salada, molho especial, carne, ovo e batata palha.'],
      ['X-Egg', 19.0, 'Pão, salada, molho especial, carne, queijo, ovo e batata palha.'],
      ['X-Calabresa', 20.0, 'Pão, salada, molho especial, carne, queijo e calabresa.'],
      ['Calabresa Especial', 20.0, 'Pão, salada, molho especial, calabresa, ovo e bacon.'],
      [
        'X-Egg Calabresa',
        20.0,
        'Pão, salada, molho especial, carne, ovo, calabresa, queijo e batata palha.',
      ],
      [
        'X-Tudo',
        23.0,
        'Pão, salada, molho especial, carne, ovo, queijo, presunto, calabresa, bacon e batata palha.',
      ],
      [
        'X-Tudo Duplo',
        30.0,
        'Pão, salada, molho especial, 2 carnes, 2 ovos, queijo, presunto, calabresa, bacon e batata palha em dobro.',
      ],
      ['Big Cheddar', 24.0, 'Pão, salada, molho especial, 2 carnes, 2 queijos e batata palha.'],
      [
        'Big Bacon',
        24.0,
        'Pão, salada, molho especial, 2 carnes, 2 queijos, bacon e batata palha.',
      ],
      [
        'Big Calabresa',
        24.0,
        'Pão, salada, molho especial, 2 carnes, 2 queijos, calabresa e batata palha.',
      ],

      [
        'Big Burguer',
        24.0,
        'Pão, salada, molho especial, 2 carnes, bacon, calabresa, 2 queijos e batata palha.',
      ],
      ['Triplo X', 26.0, 'Pão, salada, molho especial, 3 carnes, 3 queijos, bacon e batata palha.'],
    ],
  ],
  [
    'Tradicionais',
    'traditional-title',
    [
      ['Misto Quente', 10.0, 'Pão, queijo e presunto.'],
      ['Misto Quente Especial', 13.0, 'Pão, 3 fatias de queijo e 3 fatias de presunto.'],
      ['Americano', 13.0, 'Pão, salada, ovo, queijo e presunto.'],
      ['Bauru', 12.0, 'Pão, salada, queijo e presunto.'],
      ['Bauru Especial', 14.0, 'Pão, salada, 3 fatias de queijo e 3 fatias de presunto.'],
    ],
  ],
  [
    'Hambúrgueres de Frango',
    'chicken-title',
    [
      ['Ki Frango', 17.0, 'Pão, salada, molho especial, frango e batata palha.'],
      ['Especial de Frango', 19.0, 'Pão, salada, molho especial, frango, queijo e batata palha.'],
      ['Frango Chic', 19.0, 'Pão, salada, molho especial, frango, queijo, ovo e batata palha.'],
      [
        'Frango Calabresa',
        20.0,
        'Pão, salada, molho especial, frango, calabresa, queijo e batata palha.',
      ],
      ['Franbacon', 20.0, 'Pão, salada, molho especial, frango, queijo e bacon.'],
      ['Egg Frango', 22.0, 'Pão, salada, molho especial, frango, queijo, ovo e batata palha.'],
      [
        'Frango Mais',
        22.0,
        'Pão, salada, molho especial, frango, calabresa, bacon, queijo e batata palha.',
      ],
    ],
  ],
  [
    'Sanduíches Especiais com Filé',
    'file-title',
    [
      ['X-Filé', 24.0, 'Pão, salada, molho especial, filé de carne, queijo e batata palha.'],
      [
        'Filezão',
        29.0,
        'Pão, salada, molho especial, filé bovino, queijo, presunto, ovo, calabresa, bacon e batata palha.',
      ],
    ],
  ],
  [
    'Sanduíches Especiais no Prato',
    'plate-title',
    [
      [
        'Chapa Burguer',
        34.0,
        'Pão, filé bovino, 2 ovos, bacon, calabresa, queijo, presunto, batata palha, molho cheddar, barbecue e requeijão cremoso.',
      ],
      [
        'Moda da Casa',
        40.0,
        'Pão, filé bovino, 2 ovos, bacon, calabresa, queijo, presunto, azeitonas, frango desfiado, batata palha, salada, cheddar e barbecue.',
      ],
    ],
  ],
  [
    'Artesanais',
    'artisan-title',
    [
      ['Clássico', 26.0, 'Pão, 1 carne, queijo, bacon, salada e cebola caramelizada.'],
      ['Raiz', 28.0, 'Pão, 1 carne, queijo, ovo, bacon, salada e cebola caramelizada.'],
      ['Supremo', 32.0, 'Pão, 2 carnes, queijo, bacon, salada e cebola caramelizada.'],
      ['Potente', 34.0, 'Pão, 2 carnes, queijo, bacon, ovo, salada e cebola caramelizada.'],
    ],
  ],
  [
    'Jantinha',
    'jantinha-title',
    [['Espetinho com arroz', 17.0, 'Acompanha arroz, aipim e vinagrete.']],
  ],
  [
    'Sucos 400 ml',
    'juices-title',
    [
      ['Abacaxi', 6],
      ['Cacau', 6],
      ['Goiaba', 6],
      ['Acerola', 6],
      ['Morango', 6],
      ['Cajá', 6],
      ['Umbu', 6],
      ['Caju', 6],
      ['Cupuaçu', 6],
      ['Manga', 6],
      ['Graviola', 6],
      ['Maracujá', 6],
      ['Com Leite (qualquer sabor)', 7],
    ],
  ],
];

const productImages = {
  'Água sem gás': 'agua-sem-gas.webp',
  'Água com gás': 'água-com-gas.webp',
  'Água sem gás 1,5L': 'agua-sem-gas-1.5L.webp',
  H2O: 'h2o.webp',
  'Refrigerante em Lata': 'refrigerante-em-lata.webp',
  'Refrigerante 200 ml': 'refrigerante-200ml.webp',
  'Coca-Cola 1 L': 'coca-cola-1L.webp',
  'Coca-Cola 600 ml': 'coca-cola-600ml.webp',
  'Refrigerante 1 L': 'refrigerante-1L.webp',
  'Red Bull': 'red-bull.webp',
  Monster: 'monster.webp',
  'Heineken 600ml': 'heineken-600ml.webp',
  'Stella Artois 550ml': 'stella-artois-550ml.webp',
  'Stella Artois Pure Golden': 'stella-artois-pure-golden.webp',
  'Original 600ml': 'original-600ml.webp',
  'Spaten 600ml': 'spaten-600ml.webp',
  'Brahma Chopp 600ml': 'brahma-chopp-600ml.webp',
  'Skol 600ml': 'skol-600m.webp',
  'Amstel 600ml': 'amstel-600ml.webp',
  'Amstel 300ml': 'amstel-300ml.webp',
  'Skol 300ml': 'skol-300ml.webp',
  'Cervejas de lata': 'cervejas-de-lata.webp',
  "Whisky Ballantine's": "whisky-ballantine's.webp",
  'Whisky Red': 'whisky-red.webp',
  Domecq: 'domecq.webp',
  Campari: 'campari.webp',
  Alcatrão: 'alcatrão.webp',
  'Asa Branca': 'asa-branca.webp',
  Pitú: 'pitú.webp',
};

const now = new Date();
const isThursday = now.getDay() === 4;
const isDendeAvailable = isThursday && now.getHours() >= 18;
const catalogOrder = [
  'Todos os dias',
  'Hambúrgueres',
  'Tradicionais',
  'Hambúrgueres de Frango',
  'Sanduíches Especiais com Filé',
  'Sanduíches Especiais no Prato',
  'Artesanais',
  'Quinta do Dendê',
  'Espetinhos',
  'Petiscos',
  'Sucos 400 ml',
  'Bebidas',
  'Cervejas',
  'Quentes',
];
const catalogDisplayOrder = [
  'todos os dias',
  'jantinha',
  'quinta do dend',
  'espetinhos',
  'petiscos',
  'hamb',
  'tradicionais',
  'hamb',
  'sandu',
  'sandu',
  'artesanais',
  'bebidas',
  'sucos 400 ml',
  'cervejas',
  'quentes',
];
const normalizeCatalogTitle = (title) =>
  title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
const getCatalogDisplayRank = (title) => {
  const normalizedTitle = normalizeCatalogTitle(title);
  if (normalizedTitle.startsWith('hamb') && normalizedTitle.includes('frango')) return 7;
  if (normalizedTitle.startsWith('sandu') && normalizedTitle.includes('no prato')) return 9;
  if (normalizedTitle.startsWith('sandu')) return 8;
  if (normalizedTitle.startsWith('hamb')) return 5;
  const rank = catalogDisplayOrder.findIndex((category) => normalizedTitle.startsWith(category));
  return rank === -1 ? catalogDisplayOrder.length : rank;
};
const drinkGroupOrder = [
  ['Água', 'H2O'],
  ['Refrigerante', 'Coca-Cola'],
  ['Red Bull', 'Monster'],
];
const getDrinkGroup = (name) => {
  const groupIndex = drinkGroupOrder.findIndex((group) =>
    group.some((label) => name.startsWith(label)),
  );
  return groupIndex === -1 ? drinkGroupOrder.length : groupIndex;
};
const orderedCatalog = menuCatalog
  .filter(([title]) => title !== 'Quinta do Dendê' || isDendeAvailable)
  .sort(
    ([firstTitle], [secondTitle]) =>
      getCatalogDisplayRank(firstTitle) - getCatalogDisplayRank(secondTitle),
  )
  .map(([title, titleId, items]) => [
    title,
    titleId,
    [...items].sort((firstItem, secondItem) => {
      if (title === 'Bebidas') {
        const groupDifference = getDrinkGroup(firstItem[0]) - getDrinkGroup(secondItem[0]);
        if (groupDifference !== 0) return groupDifference;
      }
      const firstPrice = firstItem[1] ?? Number.POSITIVE_INFINITY;
      const secondPrice = secondItem[1] ?? Number.POSITIVE_INFINITY;
      return firstPrice - secondPrice;
    }),
  ]);
const foodProductNames = new Set([
  ...orderedCatalog
    .filter(([title]) => !['Sucos 400 ml', 'Bebidas', 'Cervejas', 'Quentes'].includes(title))
    .flatMap(([, , items]) => items.map(([name]) => name)),
]);

const breadBasedCategories = new Set([
  'HambÃºrgueres',
  'Tradicionais',
  'HambÃºrgueres de Frango',
  'SanduÃ­ches Especiais com FilÃ©',
  'SanduÃ­ches Especiais no Prato',
  'Artesanais',
]);
const breadBasedProductNames = new Set(
  orderedCatalog
    .filter(([title]) => breadBasedCategories.has(title))
    .flatMap(([, , items]) => items.map(([name]) => name)),
);
const isBurgerOrSandwichCategory = (title) => {
  const normalizedTitle = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return normalizedTitle.includes('hamburguer') || normalizedTitle.includes('sanduiche');
};

function productId(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function defaultDescription(title, name) {
  const descriptions = {
    'Comida Baiana': 'Prato baiano tradicional da casa.',
    Sarapatel: 'Prato tradicional preparado com miúdos e temperos.',
    Mocotó: 'Caldo encorpado de mocotó com temperos da casa.',
    Rabada: 'Rabada cozida lentamente com molho caseiro.',
    Feijoada: 'Feijoada completa preparada com carnes suínas e temperos.',
    'Acarajé com Camarão': 'Acarajé recheado com vatapá, camarão e complementos.',
    'Acarajé sem Camarão': 'Acarajé recheado com vatapá e complementos.',
    'Abará com Camarão': 'Abará recheado com vatapá, camarão e complementos.',
    'Abará sem Camarão': 'Abará recheado com vatapá e complementos.',
    'Carne Bovina': 'Espetinho de carne bovina grelhada.',
    Coração: 'Espetinho de coração de frango grelhado.',
    Porco: 'Espetinho de carne suína grelhada.',
    Frango: 'Espetinho de frango grelhado.',
    'Queijo Coalho': 'Espetinho de queijo coalho dourado na brasa.',
    'Batata Frita Pequena': 'Porção pequena de batatas fritas crocantes.',
    'Batata Frita Média': 'Porção média de batatas fritas crocantes.',
    'Batata Frita Grande': 'Porção grande de batatas fritas crocantes.',
    'Batata Frita com Cheddar e Bacon': 'Batata frita coberta com cheddar e bacon crocante.',
    'Aipim Frito Médio': 'Porção média de aipim frito crocante.',
    'Aipim Frito Grande': 'Porção grande de aipim frito crocante.',
    'Camarão Alho e Óleo': 'Camarões salteados no alho e óleo.',
    'Filé com Fritas': 'Filé grelhado servido com batatas fritas.',
    'Carne de Sol com Fritas': 'Carne de sol acompanhada de batatas fritas.',
    'Carne de Sol com Aipim': 'Carne de sol acompanhada de aipim frito.',
    "Charque com Farofa d'Água": "Charque servido com farofa d'água.",
    'Kibe (6 unidades)': 'Seis unidades de kibe crocante.',
  };
  if (descriptions[name]) return descriptions[name];
  if (name.startsWith('Mini Acarajé'))
    return `${name.includes('com Camarão') ? 'Mini acarajé com camarão' : 'Mini acarajé sem camarão'}.`;
  if (name === 'Pastel Grande Tradicional')
    return 'Pastel grande recheado com frango, carne, queijo e presunto.';
  return title === 'Bebidas' || title === 'Cervejas' || title === 'Quentes'
    ? `${name} gelado, servido para acompanhar seu pedido.`
    : `Porção de ${name.toLowerCase()} preparada pela casa.`;
}

function renderCatalog() {
  catalog.querySelectorAll('.catalog-section').forEach((section) => section.remove());
  catalogSections = orderedCatalog.map(([title, titleId]) => {
    const section = document.createElement('section');
    section.className = 'catalog-section';
    section.innerHTML = `<h2 id="${titleId}">${title}</h2><div class="catalog-grid"></div>`;
    catalog.insertBefore(section, noResults);
    return section;
  });
  const categoryNav = catalog.querySelector('.category-nav');
  categoryNav.replaceChildren(
    ...orderedCatalog.map(([title, titleId]) => {
      const link = document.createElement('a');
      link.href = `#${titleId}`;
      link.textContent = title;
      return link;
    }),
  );
  updateCategoryNavArrows();
  catalogSections.forEach((section, sectionIndex) => {
    const [title, titleId, items] = orderedCatalog[sectionIndex];
    section.setAttribute('aria-labelledby', titleId);
    section.querySelector('h2').id = titleId;
    section.querySelector('h2').textContent = title;
    const grid = section.querySelector('.catalog-grid');
    grid.replaceChildren();
    for (const [name, price, description] of items) {
      const itemDescription = (description || defaultDescription(title, name)).replace(/[.]+$/, '');
      const card = document.createElement('article');
      card.className = 'menu-card';
      card.dataset.searchable = `${title} ${name}`;
      const fallbackImage = isBurgerOrSandwichCategory(title)
        ? 'comida.webp'
        : foodProductNames.has(name)
          ? 'comida2.webp'
          : 'bebida.webp';
      const resolvedImageName = productImages[name] ?? fallbackImage;
      const imagePath = `./assets/${encodeURIComponent(resolvedImageName)}`;
      const fallbackPath = `./assets/${fallbackImage}`;
      const priceLabel = price == null ? 'Preço não informado' : formatPrice(price);
      const addButton =
        price == null
          ? 'disabled aria-disabled="true"'
          : `data-product-price=\"${price.toFixed(2)}\"`;
      const addButtonLabel = price == null ? 'Indisponível' : priceLabel;
      card.innerHTML = `<div class="menu-card__visual menu-card__visual--drink"><img src="${imagePath}" alt="${name}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackPath}';"></div><div class="menu-card__body"><h3>${name}</h3><p>${itemDescription}</p><div class="menu-card__footer"><button class="add-button" type="button" data-add-to-cart data-product-id="${productId(name)}" data-product-name="${name}" ${addButton}>${addButtonLabel}</button><div class="catalog-quantity" data-catalog-quantity="${productId(name)}" hidden><button type="button" data-cart-action="decrease" data-product-id="${productId(name)}" aria-label="Diminuir ${name}">−</button><span class="catalog-quantity__summary"><span data-catalog-quantity-value>0</span><small data-catalog-price>${priceLabel}</small></span><button type="button" data-cart-action="increase" data-product-id="${productId(name)}" aria-label="Adicionar mais ${name}">+</button></div></div></div>`;
      grid.append(card);
    }
  });
  catalogCards = [...document.querySelectorAll('.menu-card')];
}

renderCatalog();

if (shutterPanels.length !== 2) {
  throw new Error('The page shutter requires two panels.');
}

if (
  !(searchForm instanceof HTMLFormElement) ||
  !(searchToggle instanceof HTMLButtonElement) ||
  !(searchInput instanceof HTMLInputElement) ||
  catalogSections.length === 0 ||
  !(noResults instanceof HTMLParagraphElement) ||
  !(cartButton instanceof HTMLButtonElement) ||
  !(cartCount instanceof HTMLSpanElement) ||
  !(mobileCart instanceof HTMLButtonElement) ||
  !(mobileCartCount instanceof HTMLSpanElement) ||
  !(mobileCartTotal instanceof HTMLElement) ||
  !(orderBag instanceof HTMLDialogElement) ||
  !(closeBagButton instanceof HTMLButtonElement) ||
  !(emptyBag instanceof HTMLDivElement) ||
  !(bagList instanceof HTMLUListElement) ||
  !(bagTotal instanceof HTMLElement) ||
  !(checkoutButton instanceof HTMLButtonElement) ||
  !(drinkChoiceDialog instanceof HTMLDialogElement) ||
  !(drinkChoiceForm instanceof HTMLFormElement) ||
  !(drinkChoiceInput instanceof HTMLInputElement) ||
  !(drinkChoiceBack instanceof HTMLButtonElement)
) {
  throw new Error('The menu is missing required controls.');
}

function setSearchOpen(isOpen) {
  searchForm.classList.toggle('is-open', isOpen);
  searchToggle.setAttribute('aria-expanded', String(isOpen));
  searchToggle.setAttribute('aria-label', isOpen ? 'Fechar busca' : 'Abrir busca');
  searchInput.tabIndex = isOpen ? 0 : -1;

  if (isOpen) {
    searchInput.focus();
  } else {
    searchInput.value = '';
    filterCatalog('');
  }
}

function filterCatalog(query) {
  const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
  let visibleCards = 0;

  for (const card of catalogCards) {
    const searchableText = card.dataset.searchable ?? card.textContent ?? '';
    const isMatch = searchableText.toLocaleLowerCase('pt-BR').includes(normalizedQuery);

    card.hidden = !isMatch;
    visibleCards += Number(isMatch);
  }

  for (const section of catalogSections) {
    section.hidden = !section.querySelector('.menu-card:not([hidden])');
  }

  noResults.hidden = visibleCards > 0;
}

searchToggle.addEventListener('click', () => {
  setSearchOpen(searchToggle.getAttribute('aria-expanded') !== 'true');
});

searchInput.addEventListener('input', () => {
  filterCatalog(searchInput.value);
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setSearchOpen(false);
    searchToggle.focus();
  }
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
});

document.addEventListener('click', (event) => {
  if (
    searchForm.classList.contains('is-open') &&
    event.target instanceof Node &&
    !searchForm.contains(event.target)
  ) {
    setSearchOpen(false);
  }
});

cartButton.addEventListener('click', () => orderBag.showModal());
mobileCart.addEventListener('click', () => orderBag.showModal());
closeBagButton.addEventListener('click', () => orderBag.close());
orderBag.addEventListener('click', (event) => {
  if (event.target === orderBag) {
    orderBag.close();
  }
});

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const addButton = event.target.closest('[data-add-to-cart]');

  if (!(addButton instanceof HTMLButtonElement)) {
    return;
  }

  if (!isRestaurantOpen()) {
    closedNotice.showModal();
    return;
  }

  const { productId, productName } = addButton.dataset;
  const productPrice = Number(addButton.dataset.productPrice);

  if (['Refrigerante em Lata', 'Refrigerante 200 ml'].includes(productName)) {
    pendingDrinkButton = addButton;
    drinkChoiceInput.value = '';
    drinkChoiceDialog.showModal();
    drinkChoiceInput.focus();
    return;
  }

  addItemToCart(productId, productName, productPrice);
});

closedNoticeClose.addEventListener('click', () => closedNotice.close());
closedNotice.addEventListener('click', (event) => {
  if (event.target === closedNotice) closedNotice.close();
});

drinkChoiceForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const flavor = drinkChoiceInput.value.trim();
  if (!flavor || !pendingDrinkButton) {
    drinkChoiceInput.focus();
    return;
  }

  const { productId, productName } = pendingDrinkButton.dataset;
  addItemToCart(
    `${productId}-${productIdFromName(flavor)}`,
    `${productName} (${flavor})`,
    Number(pendingDrinkButton.dataset.productPrice),
  );
  drinkChoiceDialog.close();
  pendingDrinkButton = undefined;
});

drinkChoiceBack.addEventListener('click', () => {
  drinkChoiceDialog.close();
  pendingDrinkButton = undefined;
});

drinkChoiceDialog.addEventListener('click', (event) => {
  if (event.target === drinkChoiceDialog) {
    drinkChoiceDialog.close();
    pendingDrinkButton = undefined;
  }
});

function addItemToCart(productId, productName, productPrice) {
  if (!productId || !productName || !Number.isFinite(productPrice) || productPrice < 0) {
    console.error('A catalog item requires an id, name, and valid price.');
    return;
  }

  const item = cartItems.get(productId);
  const baseProductName = productName.replace(/ \([^)]*\)$/, '');
  const fallbackImage = breadBasedProductNames.has(baseProductName)
    ? 'comida.webp'
    : foodProductNames.has(baseProductName)
      ? 'comida2.webp'
      : 'bebida.webp';
  cartItems.set(productId, {
    name: productName,
    image: productImages[baseProductName] ?? fallbackImage,
    price: productPrice,
    quantity: (item?.quantity ?? 0) + 1,
  });
  renderCart();
  animateCartFeedback();
}

function animateCartFeedback() {
  for (const element of [cartButton, mobileCart]) {
    element.classList.remove('is-updated');
    void element.offsetWidth;
    element.classList.add('is-updated');
    element.addEventListener('animationend', () => element.classList.remove('is-updated'), {
      once: true,
    });
  }
}

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const actionButton = event.target.closest('[data-cart-action]');

  if (!(actionButton instanceof HTMLButtonElement)) {
    return;
  }

  const { cartAction, productId } = actionButton.dataset;
  const item = productId ? cartItems.get(productId) : undefined;

  if (!productId || !item) {
    return;
  }

  if (cartAction === 'remove') {
    cartItems.delete(productId);
  } else if (cartAction === 'increase') {
    item.quantity += 1;
  } else if (cartAction === 'decrease') {
    item.quantity -= 1;

    if (item.quantity === 0) {
      cartItems.delete(productId);
    }
  }

  renderCart();
});

function renderCart() {
  const items = [...cartItems.entries()];
  const itemCount = items.reduce((count, [, item]) => count + item.quantity, 0);
  const total = items.reduce((sum, [, item]) => sum + item.price * item.quantity, 0);

  cartCount.hidden = itemCount === 0;
  cartCount.textContent = String(itemCount);
  cartCount.setAttribute('aria-label', `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`);
  mobileCart.hidden = itemCount === 0;
  mobileCartCount.textContent = String(itemCount);
  mobileCartTotal.textContent = formatPrice(total);
  mobileCart.setAttribute(
    'aria-label',
    `Abrir sacola, ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}, total ${formatPrice(total)}`,
  );
  cartButton.setAttribute(
    'aria-label',
    `Abrir sacola, ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`,
  );
  emptyBag.hidden = itemCount > 0;
  checkoutButton.disabled = itemCount === 0;
  bagTotal.textContent = formatPrice(total);
  bagList.replaceChildren();

  for (const [productId, item] of items) {
    const row = document.createElement('li');
    row.className = 'order-bag__item';

    const image = document.createElement('img');
    image.className = 'order-bag__item-image';
    image.src = `./assets/${encodeURIComponent(item.image ?? 'bebida.webp')}`;
    image.alt = item.name;
    image.loading = 'lazy';
    image.addEventListener('error', () => {
      image.onerror = null;
      image.src = './assets/bebida.webp';
    });

    const description = document.createElement('div');
    description.className = 'order-bag__item-description';
    const name = document.createElement('span');
    name.className = 'order-bag__item-name';
    name.textContent = item.name;

    const unitPrice = document.createElement('span');
    unitPrice.className = 'order-bag__item-quantity';
    unitPrice.textContent = `${formatPrice(item.price)} cada`;
    description.append(name, unitPrice);

    const controls = document.createElement('div');
    controls.className = 'order-bag__item-controls';

    const quantity = document.createElement('div');
    quantity.className = 'bag-quantity';

    const decreaseButton = createCartButton('decrease', productId, `Diminuir ${item.name}`, '−');
    const quantityValue = document.createElement('span');
    quantityValue.className = 'bag-quantity__value';
    quantityValue.textContent = String(item.quantity);
    quantityValue.setAttribute('aria-label', 'Quantidade');
    const increaseButton = createCartButton(
      'increase',
      productId,
      `Adicionar mais ${item.name}`,
      '+',
    );
    quantity.append(decreaseButton, quantityValue, increaseButton);

    const lineTotal = document.createElement('span');
    lineTotal.className = 'order-bag__item-price';
    lineTotal.textContent = formatPrice(item.price * item.quantity);

    controls.append(quantity, lineTotal);
    row.append(image, description, controls);
    bagList.append(row);
  }

  document.querySelectorAll('[data-catalog-quantity]').forEach((controls) => {
    const item = cartItems.get(controls.dataset.catalogQuantity);
    const addButton = controls.parentElement.querySelector('[data-add-to-cart]');
    controls.hidden = !item;
    if (item) {
      controls.querySelector('[data-catalog-quantity-value]').textContent = String(item.quantity);
      controls.querySelector('[data-catalog-price]').textContent = formatPrice(item.price);
    }
    if (addButton) addButton.hidden = Boolean(item);
  });
}

checkoutButton.addEventListener('click', () => {
  if (cartItems.size === 0) return;
  if (!paymentMethod.value) {
    paymentMethod.focus();
    return;
  }

  const items = [...cartItems.values()];
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderLines = items.map(
    (item) => `• ${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)}`,
  );
  const message = [
    'Olá, Casa de Ribeiro! Gostaria de fazer este pedido:',
    '',
    ...orderLines,
    '',
    `Total: ${formatPrice(total)}`,
    `Forma de pagamento: ${paymentMethod.value}`,
    `Observações: ${orderNotes.value.trim() || 'Nenhuma'}`,
  ].join('\n');

  window.location.href = `https://wa.me/5571999076842?text=${encodeURIComponent(message)}`;
});

function createCartButton(action, productId, label, text) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'bag-quantity__button';
  button.dataset.cartAction = action;
  button.dataset.productId = productId;
  button.setAttribute('aria-label', label);
  button.textContent = text;
  return button;
}

function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function productIdFromName(name) {
  return productId(name);
}

window.requestAnimationFrame(() => {
  document.body.classList.add('is-opening');
});
