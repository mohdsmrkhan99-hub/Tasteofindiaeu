// ═══════════════════════════════════════════════════
//  TASTE OF INDIA — MALTA  |  Main JavaScript
// ═══════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ── Offer Banner ──
  const offerBanner = document.querySelector('.offer-banner');
  if (offerBanner) {
    document.body.classList.add('banner-visible');
    offerBanner.querySelector('.offer-banner-close').addEventListener('click', () => {
      offerBanner.classList.add('hidden');
      document.body.classList.remove('banner-visible');
    });
  }

  // ── Mobile hamburger menu ──
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Menu tabs ──
  const tabs = document.querySelectorAll('.menu-tab');
  const categories = document.querySelectorAll('.menu-category');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      categories.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab)?.classList.add('active');
    });
  });

  // ── Scroll reveal ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Active nav highlight ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--gold-lt)' : '';
    });
  });

  // ── WhatsApp pre-filled message (non-cart buttons only) ──
  document.querySelectorAll('a[data-wa], .float-wa[data-wa]').forEach(link => {
    const msg = encodeURIComponent(link.dataset.wa || 'Hello! I would like to place an order from Taste of India, Malta 🍛');
    link.href = `https://wa.me/35699796995?text=${msg}`;
  });

  // ══════════════════════════════════════
  //  CART SYSTEM
  // ══════════════════════════════════════

  let cart = [];

  // ── Build Add-to-Cart buttons on every menu card ──
  document.querySelectorAll('.menu-card').forEach(card => {
    const nameEl = card.querySelector('.menu-card-name');
    const priceEl = card.querySelector('.menu-card-price');
    if (!nameEl || !priceEl) return;

    const name = nameEl.textContent.trim();
    const priceText = priceEl.textContent.trim();
    const price = parseFloat(priceText.replace('€', ''));

    // Determine if spicy option makes sense
    const isBreakfastOrDosa = card.closest('#tab-breakfast, #tab-dosa') !== null;
    const isRicePlain = name.toLowerCase().includes('steam rice') || name.toLowerCase().includes('curd rice');
    const showSpicy = !isRicePlain;

    const btn = document.createElement('button');
    btn.className = 'add-to-cart-btn';
    btn.innerHTML = '🛒 Add to Cart';
    btn.addEventListener('click', () => openSpicyModal(name, price, showSpicy));
    card.appendChild(btn);
  });

  // ── Spicy Modal ──
  const modal = document.createElement('div');
  modal.className = 'spicy-modal-overlay';
  modal.innerHTML = `
    <div class="spicy-modal">
      <button class="spicy-modal-close" aria-label="Close">✕</button>
      <div class="spicy-modal-title" id="modal-item-name"></div>
      <div class="spicy-modal-price" id="modal-item-price"></div>
      <div class="spicy-options" id="modal-spicy-row">
        <div class="spicy-label">Spice Level:</div>
        <div class="spicy-btns">
          <button class="spicy-opt active" data-level="Normal">🌿 Normal</button>
          <button class="spicy-opt" data-level="Medium Spicy">🌶 Medium</button>
          <button class="spicy-opt" data-level="Extra Spicy">🔥 Extra Spicy</button>
        </div>
      </div>
      <div class="qty-row">
        <button class="qty-btn" id="qty-minus">−</button>
        <span class="qty-val" id="qty-val">1</span>
        <button class="qty-btn" id="qty-plus">+</button>
      </div>
      <button class="modal-add-btn" id="modal-confirm">Add to Cart</button>
    </div>
  `;
  document.body.appendChild(modal);

  let modalItem = { name: '', price: 0, spicy: 'Normal', qty: 1 };

  function openSpicyModal(name, price, showSpicy) {
    modalItem = { name, price, spicy: 'Normal', qty: 1 };
    document.getElementById('modal-item-name').textContent = name;
    document.getElementById('modal-item-price').textContent = '€' + price.toFixed(2);
    document.getElementById('qty-val').textContent = 1;
    document.getElementById('modal-spicy-row').style.display = showSpicy ? 'block' : 'none';
    modal.querySelectorAll('.spicy-opt').forEach(b => {
      b.classList.toggle('active', b.dataset.level === 'Normal');
    });
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  modal.querySelectorAll('.spicy-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.querySelectorAll('.spicy-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      modalItem.spicy = btn.dataset.level;
    });
  });

  document.getElementById('qty-minus').addEventListener('click', () => {
    if (modalItem.qty > 1) { modalItem.qty--; document.getElementById('qty-val').textContent = modalItem.qty; }
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    if (modalItem.qty < 20) { modalItem.qty++; document.getElementById('qty-val').textContent = modalItem.qty; }
  });

  document.getElementById('modal-confirm').addEventListener('click', () => {
    addToCart(modalItem.name, modalItem.price, modalItem.spicy, modalItem.qty);
    closeModal();
  });

  modal.querySelector('.spicy-modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Cart Panel ──
  const cartPanel = document.createElement('div');
  cartPanel.className = 'cart-panel';
  cartPanel.innerHTML = `
    <div class="cart-header">
      <span class="cart-title">🛒 Your Order</span>
      <button class="cart-close" aria-label="Close cart">✕</button>
    </div>
    <div class="cart-items" id="cart-items"></div>
    <div class="cart-footer" id="cart-footer">
      <div class="cart-total" id="cart-total"></div>
      <div class="cart-note-row">
        <label style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;color:var(--gold);display:block;margin-bottom:6px;">📝 Special Instructions</label>
        <textarea id="cart-note" placeholder="Any allergies, requests or extras?" rows="2"></textarea>
      </div>
      <button class="cart-wa-btn" id="cart-wa-btn">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Send Order on WhatsApp
      </button>
      <button class="cart-clear-btn" id="cart-clear-btn">Clear Cart</button>
    </div>
  `;
  document.body.appendChild(cartPanel);

  // Cart overlay
  const cartOverlay = document.createElement('div');
  cartOverlay.className = 'cart-overlay';
  document.body.appendChild(cartOverlay);
  cartOverlay.addEventListener('click', closeCart);

  // Cart bubble button
  const cartBubble = document.createElement('button');
  cartBubble.className = 'cart-bubble';
  cartBubble.innerHTML = `🛒 <span class="cart-bubble-count">0</span>`;
  cartBubble.setAttribute('aria-label', 'View cart');
  document.body.appendChild(cartBubble);
  cartBubble.addEventListener('click', openCart);

  cartPanel.querySelector('.cart-close').addEventListener('click', closeCart);

  function openCart() {
    cartPanel.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartPanel.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Cart Logic ──
  function addToCart(name, price, spicy, qty) {
    const key = name + '||' + spicy;
    const existing = cart.find(i => i.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ key, name, price, spicy, qty });
    }
    renderCart();
    openCart();
    showToast(`✓ ${name} added!`);
  }

  function renderCart() {
    const itemsEl = document.getElementById('cart-items');
    const footerEl = document.getElementById('cart-footer');
    const countEl = document.querySelector('.cart-bubble-count');

    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    countEl.textContent = totalQty;
    cartBubble.style.display = totalQty > 0 ? 'flex' : 'none';

    if (cart.length === 0) {
      itemsEl.innerHTML = `<div class="cart-empty">Your cart is empty.<br>Add items from the menu above 🍛</div>`;
      footerEl.style.display = 'none';
      return;
    }

    footerEl.style.display = 'block';
    itemsEl.innerHTML = cart.map((item, idx) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-spicy">${spicyIcon(item.spicy)} ${item.spicy}</div>
        </div>
        <div class="cart-item-controls">
          <button class="cart-qty-btn" data-action="minus" data-idx="${idx}">−</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button class="cart-qty-btn" data-action="plus" data-idx="${idx}">+</button>
          <span class="cart-item-price">€${(item.price * item.qty).toFixed(2)}</span>
          <button class="cart-remove-btn" data-idx="${idx}" aria-label="Remove">✕</button>
        </div>
      </div>
    `).join('');

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const freeCoke = subtotal > 15;

    document.getElementById('cart-total').innerHTML = `
      <div style="border-top:1px solid rgba(232,201,122,0.15);padding-top:14px;display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:13px;color:rgba(232,201,122,0.65);">Subtotal</span>
          <span style="font-size:14px;color:rgba(232,201,122,0.9);">€${subtotal.toFixed(2)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:13px;color:rgba(232,201,122,0.65);">🛵 Delivery</span>
          <span style="font-size:13px;font-weight:700;color:rgba(232,201,122,0.9);">From €2.00</span>
        </div>
        ${freeCoke ? `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:13px;color:rgba(232,201,122,0.65);">🥤 Coke</span>
          <span style="font-size:13px;font-weight:700;color:#4caf50;">FREE 🎉</span>
        </div>` : `
        <div style="background:rgba(232,201,122,0.07);border:1px solid rgba(232,201,122,0.18);border-radius:8px;padding:8px 12px;font-size:11.5px;color:rgba(232,201,122,0.8);text-align:center;line-height:1.5;">
          🥤 Add <strong style="color:#e8c97a;">€${(15 - subtotal).toFixed(2)}</strong> more to get a <strong style="color:#e8c97a;">FREE Coke!</strong>
        </div>`}
        <div style="background:rgba(232,201,122,0.07);border:1px solid rgba(232,201,122,0.18);border-radius:8px;padding:8px 12px;font-size:11.5px;color:rgba(232,201,122,0.7);text-align:center;line-height:1.5;">
          📍 Delivery charge depends on your distance.<br>Minimum €2 — final charge confirmed on order.
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(232,201,122,0.2);padding-top:10px;margin-top:2px;">
          <span style="font-size:15px;font-weight:700;letter-spacing:0.5px;">Subtotal</span>
          <span style="font-size:22px;color:var(--gold);font-weight:700;">€${subtotal.toFixed(2)}</span>
        </div>
      </div>
    `;

    // Bind buttons
    itemsEl.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        if (btn.dataset.action === 'plus') cart[idx].qty++;
        else if (cart[idx].qty > 1) cart[idx].qty--;
        else cart.splice(idx, 1);
        renderCart();
      });
    });
    itemsEl.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        cart.splice(parseInt(btn.dataset.idx), 1);
        renderCart();
      });
    });
  }

  function spicyIcon(level) {
    if (level === 'Extra Spicy') return '🔥';
    if (level === 'Medium Spicy') return '🌶';
    return '🌿';
  }

  // ── Location Modal ──
  const locModal = document.createElement('div');
  locModal.className = 'loc-modal-overlay';
  locModal.innerHTML = `
    <div class="loc-modal">
      <div class="loc-modal-icon">📍</div>
      <h3>Your Delivery Location</h3>
      <p>So we can deliver to you, please share your location or type your address.</p>
      <div id="loc-error" style="display:none;background:rgba(181,18,27,0.15);border:1px solid rgba(181,18,27,0.4);border-radius:8px;padding:9px 12px;margin-bottom:12px;font-size:12.5px;color:#ff6b6b;text-align:center;"></div>
      <div class="loc-modal-btns">
        <button class="loc-btn-share" id="loc-gps-btn">
          📡 Share My Location (GPS)
        </button>
        <button class="loc-btn-manual" id="loc-manual-toggle">✏️ Type My Address Instead</button>
        <div class="loc-manual-input" id="loc-manual-box">
          <textarea id="loc-address-text" rows="3" placeholder="e.g. 12 Triq il-Kbira, Msida, Malta"></textarea>
          <button class="loc-btn-confirm" id="loc-address-confirm">✓ Confirm Address</button>
        </div>
      </div>
      <button class="loc-skip" id="loc-skip">Skip — I'll tell you in the chat</button>
    </div>
  `;
  document.body.appendChild(locModal);

  let pendingWaMsg = '';

  function openLocModal(waMsg) {
    pendingWaMsg = waMsg;
    locModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLocModal() {
    locModal.classList.remove('open');
    document.body.style.overflow = '';
  }
  function sendToWhatsApp(msg) {
    closeLocModal();
    const waUrl = `https://wa.me/35699796995?text=${encodeURIComponent(msg)}`;
    const a = document.createElement('a');
    a.href = waUrl; a.target = '_blank'; a.rel = 'noopener noreferrer';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  function showLocError(msg) {
    const el = document.getElementById('loc-error');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 5000);
  }

  // GPS share
  document.getElementById('loc-gps-btn').addEventListener('click', () => {
    const btn = document.getElementById('loc-gps-btn');
    btn.innerHTML = '⏳ Getting location...';
    btn.disabled = true;
    if (!navigator.geolocation) {
      showLocError('GPS not supported on your device. Please type your address below.');
      btn.innerHTML = '📡 Share My Location (GPS)';
      btn.disabled = false;
      document.getElementById('loc-manual-box').style.display = 'block';
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        const fullMsg = pendingWaMsg + `\n\n📍 *My Location:* ${mapsLink}`;
        sendToWhatsApp(fullMsg);
        btn.innerHTML = '📡 Share My Location (GPS)';
        btn.disabled = false;
      },
      () => {
        showLocError('Could not get GPS. Please type your address below instead.');
        btn.innerHTML = '📡 Share My Location (GPS)';
        btn.disabled = false;
        document.getElementById('loc-manual-box').style.display = 'block';
      },
      { timeout: 10000 }
    );
  });

  // Manual address toggle
  document.getElementById('loc-manual-toggle').addEventListener('click', () => {
    const box = document.getElementById('loc-manual-box');
    box.style.display = box.style.display === 'block' ? 'none' : 'block';
  });

  // Confirm typed address
  document.getElementById('loc-address-confirm').addEventListener('click', () => {
    const addr = document.getElementById('loc-address-text').value.trim();
    if (!addr) { showLocError('Please enter your delivery address.'); return; }
    const fullMsg = pendingWaMsg + `\n\n📍 *My Address:* ${addr}`;
    sendToWhatsApp(fullMsg);
  });

  // Skip location
  document.getElementById('loc-skip').addEventListener('click', () => {
    sendToWhatsApp(pendingWaMsg);
  });

  // ── Send to WhatsApp ──
  document.getElementById('cart-wa-btn').addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Your cart is empty! Add items first 🍛');
      return;
    }
    const note = document.getElementById('cart-note').value.trim();
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const freeCoke = subtotal > 15;
    const preorderChecked = document.getElementById('preorder-check')?.checked;
    const preorderTime = document.getElementById('preorder-time')?.value;

    let msg = `Hello! 🍛 I'd like to place an order from *Taste of India, Malta*:\n\n`;
    cart.forEach(item => {
      msg += `• ${item.qty}x ${item.name} (${item.spicy}) — €${(item.price * item.qty).toFixed(2)}\n`;
    });
    if (freeCoke) msg += `• 🥤 Coke — *FREE (order over €15)*\n`;
    msg += `\n*Subtotal: €${subtotal.toFixed(2)}*`;
    msg += `\n*Delivery: From €2.00 (please confirm based on my location)*`;
    if (preorderChecked && preorderTime) {
      const dt = new Date(preorderTime);
      const formatted = dt.toLocaleString('en-MT', { weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
      msg += `\n\n⏰ *Pre-order for: ${formatted}*`;
    }
    if (note) msg += `\n\n📝 Note: ${note}`;
    msg += `\n\nThank you! 🙏`;

    // Increment loyalty count
    const newCount = incrementLoyalty();
    if (newCount >= LOYALTY_GOAL) showLoyaltyBanner();

    openLocModal(msg);
  });

  document.getElementById('cart-clear-btn').addEventListener('click', () => {
    if (confirm('Clear all items from cart?')) { cart = []; renderCart(); }
  });

  // ── Toast notification ──
  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  document.body.appendChild(toast);
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // ── 1. MENU SEARCH ──
  const searchInput = document.getElementById('menu-search');
  const searchClear = document.getElementById('search-clear');
  const searchInfo  = document.getElementById('search-results-info');
  const menuTabsRow = document.getElementById('menu-tabs-row');

  function runSearch() {
    const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const activeDiet = document.querySelector('.diet-btn.active')?.dataset.diet || 'all';
    const allCards = document.querySelectorAll('.menu-card');
    let visible = 0;

    if (q || activeDiet !== 'all') {
      document.querySelectorAll('.menu-category').forEach(c => c.style.display = 'block');
      if (menuTabsRow) menuTabsRow.style.display = q ? 'none' : '';
    } else {
      document.querySelectorAll('.menu-category').forEach(c => { c.style.display = ''; });
      if (menuTabsRow) menuTabsRow.style.display = '';
      const activeTab = document.querySelector('.menu-tab.active');
      if (activeTab) {
        document.querySelectorAll('.menu-category').forEach(c => c.classList.remove('active'));
        document.getElementById(activeTab.dataset.tab)?.classList.add('active');
      }
    }

    allCards.forEach(card => {
      const name = card.querySelector('.menu-card-name')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.menu-card-desc')?.textContent.toLowerCase() || '';
      const matchesSearch = !q || name.includes(q) || desc.includes(q);
      const matchesDiet =
        activeDiet === 'all' ||
        (activeDiet === 'veg'    && card.querySelector('.tag-veg'))    ||
        (activeDiet === 'nonveg' && card.querySelector('.tag-nonveg')) ||
        (activeDiet === 'spicy'  && card.querySelector('.tag-spicy'));
      if (matchesSearch && matchesDiet) { card.classList.remove('hidden-by-filter'); visible++; }
      else card.classList.add('hidden-by-filter');
    });

    if (searchInfo) {
      if (q || activeDiet !== 'all') {
        searchInfo.style.display = 'block';
        searchInfo.textContent = visible > 0 ? `${visible} dish${visible !== 1 ? 'es' : ''} found` : 'No dishes found — try a different search';
      } else { searchInfo.style.display = 'none'; }
    }
    if (searchClear) searchClear.style.display = q ? 'inline' : 'none';
  }

  if (searchInput) {
    searchInput.addEventListener('input', runSearch);
    searchClear?.addEventListener('click', () => { searchInput.value = ''; runSearch(); searchInput.focus(); });
  }

  // ── 2. DIETARY FILTERS ──
  document.querySelectorAll('.diet-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diet-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      runSearch();
    });
  });

  // ── 3. LOYALTY SYSTEM ──
  const LOYALTY_KEY    = 'toi_order_count';
  const LOYALTY_GOAL   = 5;
  const LOYALTY_REWARD = '1 Free Coke + Free Garlic Naan';

  function getLoyaltyCount() { return parseInt(localStorage.getItem(LOYALTY_KEY) || '0'); }
  function incrementLoyalty() { const c = getLoyaltyCount() + 1; localStorage.setItem(LOYALTY_KEY, c); return c; }
  function resetLoyalty() { localStorage.setItem(LOYALTY_KEY, '0'); }

  function showLoyaltyBanner() {
    const count = getLoyaltyCount();
    if (count === 0) return;
    const existing = document.getElementById('loyalty-banner');
    if (existing) existing.remove();
    const banner = document.createElement('div');
    banner.id = 'loyalty-banner';
    banner.className = 'loyalty-banner';
    const filled = Math.min(count, LOYALTY_GOAL);
    const isReady = count >= LOYALTY_GOAL;
    banner.style.position = 'fixed';
    banner.innerHTML = `
      <div class="loyalty-banner-icon">${isReady ? '🎁' : '⭐'}</div>
      <div class="loyalty-banner-text">
        <strong>${isReady ? '🎉 Reward Unlocked!' : 'Loyalty Reward'}</strong>
        <span>${isReady ? `Claim your ${LOYALTY_REWARD}!` : `${filled}/${LOYALTY_GOAL} orders — keep going!`}</span>
        <div class="loyalty-progress">${Array.from({length: LOYALTY_GOAL}, (_, i) => `<div class="loyalty-dot${i < filled ? ' filled' : ''}"></div>`).join('')}</div>
      </div>
      ${isReady ? `<button class="loyalty-claim-btn" id="loyalty-claim">Claim 🎁</button>` : ''}
      <button class="loyalty-close" id="loyalty-close" style="position:absolute;top:8px;right:10px;background:none;border:none;color:rgba(232,201,122,0.4);font-size:14px;cursor:pointer;">✕</button>
    `;
    document.body.appendChild(banner);
    document.getElementById('loyalty-close')?.addEventListener('click', () => banner.remove());
    document.getElementById('loyalty-claim')?.addEventListener('click', () => {
      const msg = `Hello! 🎁 I've completed ${LOYALTY_GOAL} orders and I'd like to claim my loyalty reward: *${LOYALTY_REWARD}*. Thank you!`;
      const a = document.createElement('a');
      a.href = `https://wa.me/35699796995?text=${encodeURIComponent(msg)}`;
      a.target = '_blank'; a.rel = 'noopener noreferrer';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      resetLoyalty(); banner.remove();
    });
  }
  setTimeout(showLoyaltyBanner, 2000);

  // ── 4. PRE-ORDER ──
  const cartNoteRow = document.querySelector('.cart-note-row');
  if (cartNoteRow) {
    const preorderDiv = document.createElement('div');
    preorderDiv.className = 'preorder-row';
    preorderDiv.innerHTML = `
      <label class="preorder-toggle">
        <input type="checkbox" id="preorder-check"> ⏰ Schedule for later (Pre-order)
      </label>
      <input type="datetime-local" id="preorder-time" class="preorder-time-input"
        min="${new Date(Date.now() + 30*60000).toISOString().slice(0,16)}">
    `;
    cartNoteRow.parentNode.insertBefore(preorderDiv, cartNoteRow);
    document.getElementById('preorder-check').addEventListener('change', function() {
      const t = document.getElementById('preorder-time');
      t.style.display = this.checked ? 'block' : 'none';
      if (this.checked) t.min = new Date(Date.now() + 30*60000).toISOString().slice(0,16);
    });
  }

  // ── Opening Hours Status ──
  function updateOpenStatus() {
    const badge = document.getElementById('hours-status-badge');
    const closedNotice = document.getElementById('closed-notice');
    const orderBtn = document.getElementById('main-order-btn');
    if (!badge) return;
    const maltaTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Malta' }));
    const totalMinutes = maltaTime.getHours() * 60 + maltaTime.getMinutes();
    const isOpen = totalMinutes >= 540 && totalMinutes <= 1439;
    if (isOpen) {
      badge.innerHTML = `<span class="status-dot open"></span> We're Open Now 🟢`;
      badge.className = 'hours-status-badge status-open';
      if (closedNotice) closedNotice.style.display = 'none';
      if (orderBtn) orderBtn.style.opacity = '1';
    } else {
      badge.innerHTML = `<span class="status-dot closed"></span> Currently Closed 🔴`;
      badge.className = 'hours-status-badge status-closed';
      if (closedNotice) closedNotice.style.display = 'flex';
      if (orderBtn) orderBtn.style.opacity = '0.5';
    }
  }
  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);

  // Initial render
  renderCart();

});
