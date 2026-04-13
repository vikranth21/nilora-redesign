// ─── STATE (synced from NiloraStore) ───
const P = {
  blue:  { name:'Butterfly Pea Flower Blue Tea — 50g', price:449, was:599, img:'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=80&h=80' },
  combo: { name:'Peppermint + Blue Tea Combo (Pack of 2)', price:899, was:1199, img:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=80&h=80' }
};
let cart = [];

// ─── TOAST ───
function toast(msg, err=false) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.style.background = err ? '#b91c1c' : '#1e1b5e';
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3200);
}

// ─── HEADER SCROLL ───
window.addEventListener('scroll', () => {
  document.getElementById('siteHeader')?.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ─── APPLY STORE TO PAGE ───
function applyStore(s) {
  // Hero
  const htEl = document.getElementById('heroTitle');
  const hsEl = document.getElementById('heroSub');
  const hcEl = document.getElementById('heroCta');
  if (htEl) htEl.innerHTML = s.hero.title;
  if (hsEl) hsEl.textContent = s.hero.subtitle;
  if (hcEl) hcEl.textContent = s.hero.cta;

  // Section visibility
  const secMap = {
    benefits: 'benefits', products: 'shop', reels: 'community',
    story: 'story', newsletter: 'nlSection', testimonials: 'testimonials'
  };
  for (const [key, id] of Object.entries(secMap)) {
    const el = document.getElementById(id);
    if (el) el.style.display = s.sections[key] === false ? 'none' : '';
  }

  // Product prices — Blue Tea
  const bv = s.products.blue.variants[0];
  P.blue.price = bv.price; P.blue.was = bv.was; P.blue.name = bv.name;
  const priceBlue = document.getElementById('priceBlue');
  const wasBlue   = document.getElementById('wasBlue');
  if (priceBlue) priceBlue.textContent = '₹' + bv.price;
  if (wasBlue)   wasBlue.textContent   = '₹' + bv.was;

  // Variant buttons — update onclick with store prices
  const vBlue = document.getElementById('variantsBlue');
  if (vBlue) {
    const btns = vBlue.querySelectorAll('.variant-btn');
    s.products.blue.variants.forEach((v, i) => {
      if (btns[i]) {
        btns[i].textContent = v.label;
        btns[i].onclick = function() { setVariant('blue', v.price, v.was, v.name, this); };
        if (i === 0) btns[i].classList.add('active');
        else btns[i].classList.remove('active');
      }
    });
  }

  // Combo price
  const cp = s.products.combo;
  P.combo.price = cp.price; P.combo.was = cp.was; P.combo.name = cp.name;
  const priceCombo = document.getElementById('priceCombo');
  const wasCombo   = document.getElementById('wasCombo');
  if (priceCombo) priceCombo.textContent = '₹' + cp.price;
  if (wasCombo)   wasCombo.textContent   = '₹' + cp.was.toLocaleString('en-IN');

  // Reels
  renderReels(s.reels);

  // Testimonials
  renderTestimonials(s.testimonials);

  // AI widget visibility
  const aiW = document.getElementById('ai-widget');
  if (aiW) aiW.style.display = s.aiActive ? '' : 'none';

  // Payment methods in checkout
  renderPaymentOptions(s.payments);
}

// ─── RENDER REELS ───
function renderReels(reels) {
  const grid = document.getElementById('reelsGrid');
  if (!grid || !reels) return;
  grid.innerHTML = reels.map(r => `
    <div class="reel-card">
      <img src="${r.img}" alt="${r.username}" loading="lazy">
      <div class="reel-play-btn">▶</div>
      <div class="reel-info">
        <div class="reel-username">${r.username}</div>
        <div class="reel-views">${r.views}</div>
      </div>
    </div>
  `).join('');
}

// ─── RENDER TESTIMONIALS ───
function renderTestimonials(testimonials) {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid || !testimonials) return;
  if (!testimonials.length) { grid.innerHTML = ''; return; }
  grid.innerHTML = testimonials.map(t => `
    <div class="tc-card">
      <div class="tc-stars">${'★'.repeat(t.rating)}${'☆'.repeat(5-t.rating)}</div>
      <p class="tc-text">"${t.text}"</p>
      <div class="tc-name">— ${t.name}</div>
    </div>
  `).join('');
}

// ─── RENDER PAYMENT OPTIONS ───
function renderPaymentOptions(payments) {
  const container = document.getElementById('paymentOptions');
  if (!container) return;
  const opts = [
    { key:'upi',        icon:'💡', label:'UPI / QR Code',         sub:'PhonePe, Paytm, Google Pay' },
    { key:'card',       icon:'💳', label:'Credit / Debit Card',    sub:'Visa, Mastercard, RuPay' },
    { key:'cod',        icon:'📦', label:'Cash on Delivery',       sub:'Pay when you receive the order' },
    { key:'netbanking', icon:'🏦', label:'Net Banking',            sub:'All major Indian banks' }
  ];
  const enabled = opts.filter(o => payments[o.key] !== false);
  container.innerHTML = enabled.map((o, i) => `
    <label class="pay-option">
      <input type="radio" name="pay" value="${o.key}" ${i===0?'checked':''}>
      <span class="pay-icon">${o.icon}</span>
      <div class="pay-label"><strong>${o.label}</strong><span>${o.sub}</span></div>
    </label>
  `).join('');
}

// ─── VARIANTS ───
function setVariant(id, price, was, name, btn) {
  P[id] = { ...P[id], price, was, name };
  const priceEl = document.getElementById('price' + id[0].toUpperCase() + id.slice(1));
  const wasEl   = document.getElementById('was'   + id[0].toUpperCase() + id.slice(1));
  if (priceEl) priceEl.textContent = '₹' + price;
  if (wasEl)   wasEl.textContent   = '₹' + was.toLocaleString('en-IN');
  document.querySelectorAll('#variants' + id[0].toUpperCase() + id.slice(1) + ' .variant-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ─── CART ───
function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

function addToCart(id) {
  const p = P[id];
  const i = cart.findIndex(c => c.name === p.name);
  i > -1 ? cart[i].qty++ : cart.push({ ...p, qty: 1 });
  renderCart();
  toast('Added to cart ✓');
}

function removeItem(i) { cart.splice(i, 1); renderCart(); }

function renderCart() {
  const body  = document.getElementById('cartBody');
  const count = cart.reduce((s, c) => s + c.qty, 0);
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const badge = document.getElementById('cartCount');
  badge.textContent = count;
  badge.style.display = count ? 'flex' : 'none';
  document.getElementById('cartTotal').textContent = '₹' + total.toLocaleString('en-IN');
  ['coSubtotal','coTotal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '₹' + total.toLocaleString('en-IN');
  });
  if (!cart.length) {
    body.innerHTML = `<div class="cart-empty-state"><span>🍃</span><p>Your cart is empty</p><p style="font-size:0.82rem;">Browse and add something beautiful.</p></div>`;
    return;
  }
  body.innerHTML = cart.map((c, i) => `
    <div class="cart-item">
      <img class="cart-item-img" src="${c.img}" alt="${c.name}">
      <div class="cart-item-info">
        <div class="cart-item-name" title="${c.name}">${c.name}</div>
        <div class="cart-item-price">₹${(c.price*c.qty).toLocaleString('en-IN')}</div>
        <div class="cart-item-qty">Qty: ${c.qty}</div>
      </div>
      <button class="cart-rm" onclick="removeItem(${i})">✕</button>
    </div>
  `).join('');
}

function buyNow(id) {
  cart = [{ ...P[id], qty: 1 }];
  renderCart();
  openCheckout();
}

// ─── CHECKOUT ───
function openCheckout() {
  if (!cart.length) { toast('Add items first', true); return; }
  document.getElementById('checkoutModal').classList.add('open');
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}
function closeCheckout() { document.getElementById('checkoutModal').classList.remove('open'); }

function placeOrder() {
  const required = ['coFirst','coEmail','coPhone','coAddr','coPin'];
  for (const f of required) {
    if (!document.getElementById(f)?.value.trim()) { toast('Please fill all required fields', true); return; }
  }
  const s = window.NiloraStore?.get() || {};
  const payEl = document.querySelector('input[name="pay"]:checked');
  const order = NiloraStore.addOrder({
    customer: document.getElementById('coFirst').value.trim() + ' ' + (document.getElementById('coLast')?.value.trim()||''),
    email:    document.getElementById('coEmail').value.trim(),
    phone:    document.getElementById('coPhone').value.trim(),
    address:  document.getElementById('coAddr').value.trim() + ', ' + (document.getElementById('coCity')?.value||'') + ' ' + document.getElementById('coPin').value.trim(),
    payment:  payEl ? payEl.value.toUpperCase() : 'UPI',
    items:    cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
    total:    cart.reduce((a, c) => a + c.price*c.qty, 0),
    courier:  'Shiprocket'
  });
  closeCheckout();
  cart = []; renderCart();
  toast(`✓ Order ${order.id} placed! Confirmation on its way.`);
}

// ─── SEARCH ───
function buildCatalog() {
  const s = window.NiloraStore?.get() || {};
  const bp = s.products?.blue?.variants || [];
  const cp = s.products?.combo || {};
  return [
    ...bp.map(v => ({ name: v.name, tags:['sleep','antioxidant','skin','glow','calm','relax','blue'], price: v.price, id:'blue' })),
    { name: cp.name||'Peppermint + Blue Tea Combo', tags:['peppermint','stress','anxiety','digestion','combo','gut'], price: cp.price||899, id:'combo' }
  ];
}

function openSearch() {
  document.getElementById('searchModal').classList.add('open');
  setTimeout(() => document.getElementById('searchInput').focus(), 80);
}
function closeSearch() {
  document.getElementById('searchModal').classList.remove('open');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
}
function doSearch(q) {
  const el = document.getElementById('searchResults');
  if (!q.trim()) { el.innerHTML = ''; return; }
  const catalog = buildCatalog();
  const hits = catalog.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.tags.some(t => t.includes(q.toLowerCase())));
  if (!hits.length) { el.innerHTML = `<p style="color:var(--gray-400);padding:6px 0;font-size:0.875rem;">No results. Try "blue tea", "stress", "skin".</p>`; return; }
  el.innerHTML = hits.map(h => `
    <div class="search-hit" onclick="quickAdd('${h.name}',${h.price},'${h.id}')">
      <div>
        <div class="search-hit-name">${h.name}</div>
        <div style="font-size:0.75rem;color:var(--gray-400);margin-top:2px;">${h.tags.slice(0,3).join(' · ')}</div>
      </div>
      <div class="search-hit-price">₹${h.price}</div>
    </div>
  `).join('');
}
function quickAdd(name, price, id) {
  const img = P[id]?.img || '';
  const i = cart.findIndex(c => c.name === name);
  i > -1 ? cart[i].qty++ : cart.push({ name, price, was: price, img, qty: 1 });
  renderCart(); closeSearch(); toast('Added to cart ✓');
}

// ─── AI CHAT ───
function toggleAI() {
  document.getElementById('aiPanel').classList.toggle('closed');
}
function openAI() {
  document.getElementById('aiPanel')?.classList.remove('closed');
}

function sendAI() {
  const inp = document.getElementById('aiInput');
  const q = inp.value.trim(); if (!q) return;
  const msgs = document.getElementById('aiMessages');
  msgs.innerHTML += `<div class="msg-user">${q}</div>`;
  inp.value = ''; msgs.scrollTop = msgs.scrollHeight;

  setTimeout(() => {
    const l = q.toLowerCase();
    const s = window.NiloraStore?.get() || {};
    const bp = s.products?.blue?.variants?.[0] || {}; // default: 50g
    const bp2 = s.products?.blue?.variants?.[1] || {};
    const bp3 = s.products?.blue?.variants?.[2] || {};
    const cp  = s.products?.combo || {};
    let reply = '', cta = '';

    if (/sleep|insomnia|night|calm|relax/.test(l)) {
      reply = `For better sleep, our <strong>${bp.name||'Blue Tea 50g'}</strong> is ideal — naturally caffeine-free and deeply calming before bed.`;
      cta = `<br><button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="P.blue.price=${bp.price||449};P.blue.name='${bp.name||'Blue Tea'}';addToCart('blue');toggleAI()">Add to Cart — ₹${bp.price||449}</button>`;
    } else if (/skin|glow|radiant|anti.?aging|bright/.test(l)) {
      reply = `For glowing skin, our <strong>${bp2.name||'Blue Tea 100g Pack'}</strong> is perfect — rich in anthocyanin for daily use and visible results.`;
      cta = `<br><button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="P.blue.price=${bp2.price||749};P.blue.name='${bp2.name||'Blue Tea 100g'}';addToCart('blue');toggleAI()">Add — ₹${bp2.price||749}</button>`;
    } else if (/stress|anxiety|worry|tension/.test(l)) {
      reply = `For stress relief, our <strong>${cp.name||'Peppermint + Blue Tea Combo'}</strong> is perfect — peppermint clears the head, blue tea calms the nerves.`;
      cta = `<br><button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="addToCart('combo');toggleAI()">Add Combo — ₹${cp.price||899}</button>`;
    } else if (/digest|gut|stomach|bloat/.test(l)) {
      reply = `For digestion, our <strong>${cp.name||'Peppermint + Blue Tea Combo'}</strong> is excellent — peppermint soothes and cleanses the gut naturally.`;
      cta = `<br><button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="addToCart('combo');toggleAI()">Add Combo — ₹${cp.price||899}</button>`;
    } else if (/price|budget|cheap|value|deal/.test(l)) {
      reply = `Best value — our <strong>${bp3.name||'Blue Tea 150g Pack'}</strong> gives you 300 cups and saves ₹${(bp3.was||1499)-(bp3.price||1099)} compared to buying separately.`;
      cta = `<br><button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="P.blue.price=${bp3.price||1099};P.blue.name='${bp3.name||'Blue Tea 150g'}';addToCart('blue');toggleAI()">Add Value Pack — ₹${bp3.price||1099}</button>`;
    } else {
      reply = "I can help you find the right blend. Tell me your goal — <strong>sleep, skin glow, stress relief, or digestion</strong>?";
    }
    msgs.innerHTML += `<div class="msg-bot">${reply}${cta}</div>`;
    msgs.scrollTop = msgs.scrollHeight;
  }, 600);
}

// ─── NEWSLETTER ───
function nlSubmit(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  if (input?.value) {
    window.NiloraStore?.addSubscriber(input.value.trim());
  }
  toast('✓ Subscribed! Your wellness guide is on the way.');
  e.target.reset();
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  // Apply store data to the page
  if (window.NiloraStore) {
    applyStore(NiloraStore.get());
    // Re-apply whenever admin makes changes (cross-tab)
    window.addEventListener('storage', () => applyStore(NiloraStore.get()));
    window.addEventListener('nilora:updated', e => applyStore(e.detail));
  }

  renderCart();
  document.getElementById('aiInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') sendAI(); });
  document.getElementById('searchInput')?.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });
});
