// ═══════════════════════════════════════════════════
//  TASTE OF INDIA — MALTA  |  Main JavaScript
// ═══════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

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

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    document.getElementById('cart-total').innerHTML = `
      <span>Total</span>
      <span style="font-size:20px;color:var(--gold);">€${total.toFixed(2)}</span>
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

  // ── Send to WhatsApp ──
  document.getElementById('cart-wa-btn').addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty! Please add some items first.');
      return;
    }
    const note = document.getElementById('cart-note').value.trim();
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    let msg = `Hello! 🍛 I'd like to place an order from *Taste of India, Malta*:\n\n`;
    cart.forEach(item => {
      msg += `• ${item.qty}x ${item.name} (${item.spicy}) — €${(item.price * item.qty).toFixed(2)}\n`;
    });
    msg += `\n*Total: €${total.toFixed(2)}*`;
    if (note) msg += `\n\n📝 Note: ${note}`;
    msg += `\n\nThank you! 🙏`;

    const waUrl = `https://wa.me/35699796995?text=${encodeURIComponent(msg)}`;
    // Works on both mobile (opens WA app) and desktop (opens WA web)
    const a = document.createElement('a');
    a.href = waUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

  // Initial render
  renderCart();

});
