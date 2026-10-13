const shutterPanels = document.querySelectorAll(".page-shutter__panel");
const searchForm = document.querySelector(".menu-search");
const searchToggle = document.querySelector(".menu-search__toggle");
const searchInput = document.querySelector("#menu-search");
const catalogCards = [...document.querySelectorAll(".menu-card")];
const catalogSections = [...document.querySelectorAll(".catalog-section")];
const noResults = document.querySelector(".catalog__no-results");
const cartButton = document.querySelector(".cart-button");
const cartCount = document.querySelector(".cart-button__count");
const mobileCart = document.querySelector(".mobile-cart");
const mobileCartCount = document.querySelector(".mobile-cart__count");
const mobileCartTotal = document.querySelector(".mobile-cart__total");
const orderBag = document.querySelector("#order-bag");
const closeBagButton = document.querySelector(".order-bag__close");
const emptyBag = document.querySelector(".order-bag__empty");
const bagList = document.querySelector(".order-bag__list");
const bagTotal = document.querySelector(".order-bag__total strong");
const checkoutButton = document.querySelector(".order-bag__checkout");
const cartItems = new Map();

if (shutterPanels.length !== 2) {
  throw new Error("The page shutter requires two panels.");
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
  !(checkoutButton instanceof HTMLButtonElement)
) {
  throw new Error("The menu is missing required controls.");
}

function setSearchOpen(isOpen) {
  searchForm.classList.toggle("is-open", isOpen);
  searchToggle.setAttribute("aria-expanded", String(isOpen));
  searchToggle.setAttribute(
    "aria-label",
    isOpen ? "Fechar busca" : "Abrir busca",
  );
  searchInput.tabIndex = isOpen ? 0 : -1;

  if (isOpen) {
    searchInput.focus();
  } else {
    searchInput.value = "";
    filterCatalog("");
  }
}

function filterCatalog(query) {
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  let visibleCards = 0;

  for (const card of catalogCards) {
    const searchableText = card.dataset.searchable ?? card.textContent ?? "";
    const isMatch = searchableText
      .toLocaleLowerCase("pt-BR")
      .includes(normalizedQuery);

    card.hidden = !isMatch;
    visibleCards += Number(isMatch);
  }

  for (const section of catalogSections) {
    section.hidden = !section.querySelector(".menu-card:not([hidden])");
  }

  noResults.hidden = visibleCards > 0;
}

searchToggle.addEventListener("click", () => {
  setSearchOpen(searchToggle.getAttribute("aria-expanded") !== "true");
});

searchInput.addEventListener("input", () => {
  filterCatalog(searchInput.value);
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setSearchOpen(false);
    searchToggle.focus();
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

document.addEventListener("click", (event) => {
  if (
    searchForm.classList.contains("is-open") &&
    event.target instanceof Node &&
    !searchForm.contains(event.target)
  ) {
    setSearchOpen(false);
  }
});

cartButton.addEventListener("click", () => orderBag.showModal());
mobileCart.addEventListener("click", () => orderBag.showModal());
closeBagButton.addEventListener("click", () => orderBag.close());
orderBag.addEventListener("click", (event) => {
  if (event.target === orderBag) {
    orderBag.close();
  }
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const addButton = event.target.closest("[data-add-to-cart]");

  if (!(addButton instanceof HTMLButtonElement)) {
    return;
  }

  const { productId, productName } = addButton.dataset;
  const productPrice = Number(addButton.dataset.productPrice);

  if (
    !productId ||
    !productName ||
    !Number.isFinite(productPrice) ||
    productPrice < 0
  ) {
    console.error("A catalog item requires an id, name, and valid price.");
    return;
  }

  const item = cartItems.get(productId);
  cartItems.set(productId, {
    name: productName,
    price: productPrice,
    quantity: (item?.quantity ?? 0) + 1,
  });
  renderCart();
});

bagList.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const actionButton = event.target.closest("[data-cart-action]");

  if (!(actionButton instanceof HTMLButtonElement)) {
    return;
  }

  const { cartAction, productId } = actionButton.dataset;
  const item = productId ? cartItems.get(productId) : undefined;

  if (!productId || !item) {
    return;
  }

  if (cartAction === "remove") {
    cartItems.delete(productId);
  } else if (cartAction === "increase") {
    item.quantity += 1;
  } else if (cartAction === "decrease") {
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
  const total = items.reduce(
    (sum, [, item]) => sum + item.price * item.quantity,
    0,
  );

  cartCount.hidden = itemCount === 0;
  cartCount.textContent = String(itemCount);
  cartCount.setAttribute(
    "aria-label",
    `${itemCount} ${itemCount === 1 ? "item" : "itens"}`,
  );
  mobileCart.hidden = itemCount === 0;
  mobileCartCount.textContent = String(itemCount);
  mobileCartTotal.textContent = formatPrice(total);
  mobileCart.setAttribute(
    "aria-label",
    `Abrir sacola, ${itemCount} ${itemCount === 1 ? "item" : "itens"}, total ${formatPrice(total)}`,
  );
  cartButton.setAttribute(
    "aria-label",
    `Abrir sacola, ${itemCount} ${itemCount === 1 ? "item" : "itens"}`,
  );
  emptyBag.hidden = itemCount > 0;
  checkoutButton.disabled = itemCount === 0;
  bagTotal.textContent = formatPrice(total);
  bagList.replaceChildren();

  for (const [productId, item] of items) {
    const row = document.createElement("li");
    row.className = "order-bag__item";

    const description = document.createElement("div");
    const name = document.createElement("span");
    name.className = "order-bag__item-name";
    name.textContent = item.name;

    const unitPrice = document.createElement("span");
    unitPrice.className = "order-bag__item-quantity";
    unitPrice.textContent = `${formatPrice(item.price)} cada`;
    description.append(name, unitPrice);

    const controls = document.createElement("div");
    controls.className = "order-bag__item-controls";

    const quantity = document.createElement("div");
    quantity.className = "bag-quantity";

    const decreaseButton = createCartButton(
      "decrease",
      productId,
      `Diminuir ${item.name}`,
      "−",
    );
    const quantityValue = document.createElement("span");
    quantityValue.className = "bag-quantity__value";
    quantityValue.textContent = String(item.quantity);
    quantityValue.setAttribute("aria-label", "Quantidade");
    const increaseButton = createCartButton(
      "increase",
      productId,
      `Adicionar mais ${item.name}`,
      "+",
    );
    quantity.append(decreaseButton, quantityValue, increaseButton);

    const lineTotal = document.createElement("span");
    lineTotal.className = "order-bag__item-price";
    lineTotal.textContent = formatPrice(item.price * item.quantity);

    const removeButton = createCartButton(
      "remove",
      productId,
      `Remover ${item.name} da sacola`,
      "Remover",
    );
    removeButton.className = "bag-remove";

    controls.append(quantity, lineTotal, removeButton);
    row.append(description, controls);
    bagList.append(row);
  }
}

function createCartButton(action, productId, label, text) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "bag-quantity__button";
  button.dataset.cartAction = action;
  button.dataset.productId = productId;
  button.setAttribute("aria-label", label);
  button.textContent = text;
  return button;
}

function formatPrice(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

window.requestAnimationFrame(() => {
  document.body.classList.add("is-opening");
});
