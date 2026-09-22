const icons = {
  plus: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/></svg>`,
  minus: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="12" x2="20" y2="12"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" stroke="none" aria-hidden="true"><path d="M12.9 2 4 13.2h5.6L10.4 22 20 9.8h-5.8L12.9 2Z"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 3v2.4M12 18.6V21M4.2 12H2M22 12h-2.2M5.7 5.7l1.6 1.6M16.7 16.7l1.6 1.6M18.3 5.7l-1.6 1.6M7.3 16.7l-1.6 1.6"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" stroke="none" aria-hidden="true"><path d="M20.5 14.7A8.5 8.5 0 0 1 9.3 3.5a8.5 8.5 0 1 0 11.2 11.2Z"/></svg>`,
};

const channelAccent = {
  pickup: "#465061",
  menulog: "#ff8000",
  doordash: "#eb1700",
  uber: "#06c167",
};

const menuItems = [
  {
    id: "smash-burger",
    name: "Classic Smash Burger",
    description: "Double beef, cheddar, pickles and house sauce.",
    category: "mains",
    pickup: 14.5,
    prices: { uber: 17.5, doordash: 16.9, menulog: 17.0 },
  },
  {
    id: "chicken-burger",
    name: "Spicy Chicken Burger",
    description: "Crispy chicken, slaw, chilli glaze and aioli.",
    category: "mains",
    pickup: 15.5,
    prices: { uber: 18.9, doordash: 18.5, menulog: 18.0 },
  },
  {
    id: "halloumi-bowl",
    name: "Charred Halloumi Bowl",
    description: "Herbed rice, greens, tomato and lemon dressing.",
    category: "mains",
    pickup: 16.0,
    prices: { uber: 19.5, doordash: 19.0, menulog: 18.7 },
  },
  {
    id: "loaded-fries",
    name: "Loaded Fries",
    description: "Cheddar sauce, smoky bacon and spring onion.",
    category: "sides",
    pickup: 9.0,
    prices: { uber: 11.5, doordash: 10.9, menulog: 11.0 },
  },
  {
    id: "chicken-wings",
    name: "Chilli Chicken Wings",
    description: "Six wings with a sticky chilli glaze.",
    category: "sides",
    pickup: 12.0,
    prices: { uber: 14.5, doordash: 14.0, menulog: 13.8 },
  },
  {
    id: "iced-tea",
    name: "House Iced Tea",
    description: "Black tea, lemon and a light peach finish.",
    category: "drinks",
    pickup: 4.5,
    prices: { uber: 5.5, doordash: 5.0, menulog: 5.3 },
  },
];

const channels = {
  pickup: {
    name: "Restaurant pickup",
    meta: "Collect directly · no platform fees",
    deliveryFee: () => 0,
    serviceFee: () => 0,
  },
  menulog: {
    name: "Menulog",
    meta: "Estimated 25–35 min",
    deliveryFee: () => 5.49,
    serviceFee: () => 1.99,
  },
  doordash: {
    name: "DoorDash",
    meta: "Estimated 20–30 min",
    deliveryFee: () => 3.99,
    serviceFee: (subtotal) => Math.max(2.5, subtotal * 0.085),
  },
  uber: {
    name: "Uber Eats",
    meta: "Estimated 20–30 min",
    deliveryFee: () => 4.99,
    serviceFee: (subtotal) => Math.max(2.99, subtotal * 0.1),
  },
};

const state = {
  cart: {},
  category: "all",
  selectedChannel: null,
};

const $ = (selector) => document.querySelector(selector);
const menuGrid = $("#menu-grid");
const basketEmpty = $("#basket-empty");
const basketContent = $("#basket-content");
const basketLines = $("#basket-lines");
const compareButton = $("#compare-button");
const mobileCart = $("#mobile-cart");
const mobileCompareButton = $("#mobile-compare-button");
const statusMessage = $("#status-message");
const themeToggle = $("#theme-toggle");

function money(value) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(value);
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function itemTypicalPrice(item) {
  return median(Object.values(item.prices));
}

function cartEntries() {
  return menuItems
    .filter((item) => (state.cart[item.id] || 0) > 0)
    .map((item) => ({ item, quantity: state.cart[item.id] }));
}

function itemCount() {
  return Object.values(state.cart).reduce((sum, quantity) => sum + quantity, 0);
}

function channelFoodSubtotal(channelId) {
  return cartEntries().reduce((sum, { item, quantity }) => {
    const unitPrice = channelId === "pickup" ? item.pickup : item.prices[channelId];
    return sum + unitPrice * quantity;
  }, 0);
}

function channelTotal(channelId) {
  const food = channelFoodSubtotal(channelId);
  const channel = channels[channelId];
  const delivery = channel.deliveryFee(food);
  const service = channel.serviceFee(food);
  return { food, delivery, service, total: food + delivery + service };
}

function renderMenu() {
  const visibleItems = menuItems.filter(
    (item) => state.category === "all" || item.category === state.category,
  );

  menuGrid.innerHTML = visibleItems
    .map((item) => {
      const quantity = state.cart[item.id] || 0;
      const action = quantity
        ? `<div class="quantity-control" aria-label="Quantity for ${item.name}">
             <button type="button" data-action="decrease" data-item="${item.id}" aria-label="Remove one ${item.name}">${icons.minus}</button>
             <span class="quantity-value" aria-live="polite">${quantity}</span>
             <button type="button" data-action="increase" data-item="${item.id}" aria-label="Add one ${item.name}">${icons.plus}</button>
           </div>`
        : `<button class="add-button" type="button" data-action="increase" data-item="${item.id}" aria-label="Add ${item.name}">${icons.plus}</button>`;

      return `<article class="menu-card ${quantity ? "is-selected" : ""}">
        <h3>${item.name}</h3>
        <p class="item-description">${item.description}</p>
        <div class="price-block">
          <div>
            <span class="typical-price">About ${money(itemTypicalPrice(item))}</span>
            <span class="typical-label">typical delivery menu price</span>
          </div>
          ${action}
        </div>
      </article>`;
    })
    .join("");
}

function renderBasket() {
  const entries = cartEntries();
  const count = itemCount();
  const typical = entries.reduce(
    (sum, { item, quantity }) => sum + itemTypicalPrice(item) * quantity,
    0,
  );

  $("#basket-count-badge").textContent = `${count} ${count === 1 ? "item" : "items"}`;
  basketEmpty.hidden = count > 0;
  basketContent.hidden = count === 0;
  compareButton.disabled = count === 0;
  mobileCart.hidden = count === 0;

  basketLines.innerHTML = entries
    .map(
      ({ item, quantity }) => `<div class="basket-line">
        <span>${quantity}×</span>
        <span>${item.name}</span>
        <span>${money(itemTypicalPrice(item) * quantity)}</span>
      </div>`,
    )
    .join("");

  $("#typical-subtotal").textContent = money(typical);
  $("#mobile-count").textContent = `${count} ${count === 1 ? "item" : "items"}`;
  $("#mobile-estimate").textContent = `${money(typical)} typical`;
}

function updateQuantity(itemId, difference) {
  const item = menuItems.find((candidate) => candidate.id === itemId);
  if (!item) return;

  const next = Math.max(0, (state.cart[itemId] || 0) + difference);
  if (next === 0) delete state.cart[itemId];
  else state.cart[itemId] = next;

  renderMenu();
  renderBasket();
  statusMessage.textContent = `${item.name} quantity is now ${next}.`;
}

function renderComparison() {
  const pickupTotal = channelTotal("pickup").total;
  const results = Object.keys(channels)
    .map((id) => ({ id, ...channelTotal(id) }))
    .sort((a, b) => a.total - b.total);
  const deliveryResults = results.filter((result) => result.id !== "pickup");
  const cheapestDelivery = deliveryResults.reduce((best, current) =>
    current.total < best.total ? current : best,
  );

  $("#compare-subtitle").textContent = `${itemCount()} items from Toowong Kitchen across available channels in Toowong.`;

  $("#platform-list").innerHTML = results
    .map((result) => {
      const channel = channels[result.id];
      const difference = result.total - pickupTotal;
      const isCheapest = result.id === cheapestDelivery.id && result.id !== "pickup";
      const tag =
        result.id === "pickup"
          ? `<span class="platform-tag platform-tag--reference">Reference</span>`
          : isCheapest
            ? `<span class="platform-tag platform-tag--best">${icons.bolt}Lowest delivery</span>`
            : "";
      const differenceText = result.id === "pickup" ? "Reference total" : `${money(difference)} above pickup`;

      return `<article class="platform-card ${state.selectedChannel === result.id ? "is-selected" : ""}" data-card="${result.id}">
        <button class="platform-main" type="button" data-channel="${result.id}" aria-pressed="${state.selectedChannel === result.id}">
          <span>
            <span class="platform-name-row">
              <span class="platform-dot" style="background:${channelAccent[result.id]}" aria-hidden="true"></span>
              <span class="platform-name">${channel.name}</span>
              ${tag}
            </span>
            <span class="platform-meta">${channel.meta}</span>
          </span>
          <span class="platform-price">
            <strong>${money(result.total)}</strong>
            <span>${differenceText}</span>
          </span>
        </button>
        <details class="breakdown">
          <summary>View price breakdown</summary>
          <dl>
            <div><dt>Food subtotal</dt><dd>${money(result.food)}</dd></div>
            <div><dt>Delivery fee</dt><dd>${money(result.delivery)}</dd></div>
            <div><dt>Service fee</dt><dd>${money(result.service)}</dd></div>
          </dl>
        </details>
      </article>`;
    })
    .join("");

  renderSelectedChannel();
}

function renderSelectedChannel() {
  const empty = $("#selected-channel-empty");
  const content = $("#selected-channel-content");
  const continueButton = $("#continue-button");

  if (!state.selectedChannel) {
    empty.hidden = false;
    content.hidden = true;
    continueButton.disabled = true;
    return;
  }

  const selected = channelTotal(state.selectedChannel);
  const pickup = channelTotal("pickup");
  const difference = selected.total - pickup.total;
  empty.hidden = true;
  content.hidden = false;
  continueButton.disabled = false;
  $("#selected-channel-name").textContent = channels[state.selectedChannel].name;
  $("#selected-channel-total").textContent = money(selected.total);
  $("#selected-channel-context").textContent =
    state.selectedChannel === "pickup"
      ? "This is the restaurant's direct pickup reference price."
      : `You are paying ${money(difference)} more than pickup for menu markups and platform convenience.`;
}

function showScreen(screenId) {
  ["home-screen", "menu-screen", "compare-screen", "complete-screen"].forEach((id) => {
    $("#" + id).hidden = id !== screenId;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openMenu() {
  showScreen("menu-screen");
  document.title = "Toowong Kitchen menu — SamePlate";
}

function openHome() {
  showScreen("home-screen");
  document.title = "SamePlate — Compare delivery prices";
}

function openComparison() {
  if (itemCount() === 0) return;
  state.selectedChannel = null;
  renderComparison();
  showScreen("compare-screen");
  document.title = "Compare totals — SamePlate";
}

function selectChannel(channelId) {
  state.selectedChannel = channelId;
  document.querySelectorAll(".platform-card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.card === channelId);
  });
  document.querySelectorAll(".platform-main").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.channel === channelId));
  });
  renderSelectedChannel();
  statusMessage.textContent = `${channels[channelId].name} selected.`;
}

menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  updateQuantity(button.dataset.item, button.dataset.action === "increase" ? 1 : -1);
});

document.querySelectorAll(".category-tab").forEach((button) => {
  button.addEventListener("click", () => {
    state.category = button.dataset.category;
    document.querySelectorAll(".category-tab").forEach((tab) => {
      tab.classList.toggle("is-active", tab === button);
    });
    renderMenu();
  });
});

compareButton.addEventListener("click", openComparison);
mobileCompareButton.addEventListener("click", openComparison);

$("#home-view-menu").addEventListener("click", openMenu);
$("#back-to-home").addEventListener("click", openHome);
$(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  openHome();
});

$("#platform-list").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-channel]");
  if (button) selectChannel(button.dataset.channel);
});

$("#back-to-menu").addEventListener("click", () => {
  showScreen("menu-screen");
  document.title = "SamePlate — Multi-platform order comparison";
});

$("#modify-button").addEventListener("click", () => {
  showScreen("menu-screen");
  document.title = "SamePlate — Multi-platform order comparison";
});

$("#continue-button").addEventListener("click", () => {
  if (!state.selectedChannel) return;
  const result = channelTotal(state.selectedChannel);
  $("#complete-channel").textContent = channels[state.selectedChannel].name;
  $("#complete-summary").textContent = `${itemCount()} items · ${money(result.total)} final estimated total.`;
  showScreen("complete-screen");
  document.title = "Decision made — SamePlate";
});

$("#restart-button").addEventListener("click", () => {
  state.cart = {};
  state.selectedChannel = null;
  state.category = "all";
  document.querySelectorAll(".category-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.category === "all");
  });
  renderMenu();
  renderBasket();
  showScreen("home-screen");
  document.title = "SamePlate — Compare delivery prices";
});

const priceDialog = $("#price-dialog");
$("#price-info-button").addEventListener("click", () => priceDialog.showModal());
$("#close-dialog").addEventListener("click", () => priceDialog.close());
priceDialog.addEventListener("click", (event) => {
  const bounds = priceDialog.getBoundingClientRect();
  const outside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;
  if (outside) priceDialog.close();
});

const THEME_KEY = "sameplate-theme";

function currentTheme() {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function renderThemeToggle(theme) {
  themeToggle.innerHTML = theme === "dark" ? icons.sun : icons.moon;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    /* private browsing or storage disabled: theme just won't persist */
  }
  renderThemeToggle(theme);
  statusMessage.textContent = `${theme === "dark" ? "Dark" : "Light"} mode on.`;
}

themeToggle.addEventListener("click", () => {
  setTheme(currentTheme() === "dark" ? "light" : "dark");
});

renderThemeToggle(currentTheme());

renderMenu();
renderBasket();
