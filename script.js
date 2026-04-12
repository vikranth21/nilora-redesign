// ─── PRODUCT STATE ───
const products = {
  blue:  { name: 'Butterfly Pea Flower Blue Tea — 50g', price: 449, origPrice: 599, img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=80&h=80' },
  combo: { name: 'Peppermint + Blue Tea Combo (Pack of 2)', price: 899, origPrice: 1199, img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=80&h=80' }
};
let cart = [];

// ─── TOAST ───
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = type === 'error' ? '#dc2626' : '#1a1a5e';
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── HEADER SCROLL ───
window.addEventListener('scroll', () => {
  const h = document.getElementById('site-header');
  if (h) h.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── PARTICLES ───
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 40 + 10;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;animation-duration:${Math.random()*18+12}s;animation-delay:${Math.random()*10}s;`;
    container.appendChild(p);
  }
})();

// ─── SCROLL REVEAL ───
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ─── PRODUCT VARIANTS ───
function updateVariant(id, price, origPrice, btn, name) {
  products[id] = { ...products[id], name, price, origPrice };
  document.getElementById('price-' + id).textContent = '₹' + price;
  document.getElementById('orig-' + id).textContent = '₹' + origPrice.toLocaleString('en-IN');
  document.querySelectorAll('#toggles-' + id + ' .size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ─── CART ───
function toggleCart() {
  document.getElementById('cart-drawer').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('open');
}

function addToCart(id) {
  const p = products[id];
  const idx = cart.findIndex(i => i.name === p.name);
  if (idx > -1) cart[idx].qty++;
  else cart.push({ ...p, qty: 1 });
  renderCart();
  showToast('✅ Added to cart!');
  // bounce animation on cart icon
  const badge = document.getElementById('cart-count');
  badge.style.transform = 'scale(1.5)';
  setTimeout(() => badge.style.transform = '', 300);
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  renderCart();
  showToast('Removed from cart', 'info');
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const badge = document.getElementById('cart-count');
  const totalEl = document.getElementById('cart-total');
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  badge.textContent = count;
  badge.style.display = count ? 'flex' : 'none';
  if (totalEl) totalEl.textContent = '₹' + total.toLocaleString('en-IN');

  const checkoutTotals = document.querySelectorAll('#checkout-total, #checkout-total-final');
  checkoutTotals.forEach(el => { if (el) el.textContent = '₹' + total.toLocaleString('en-IN'); });

  if (!cart.length) {
    container.innerHTML = `<div class="cart-empty"><span class="cart-empty-icon">🫖</span><p>Your cart is empty.</p><p style="font-size:0.85rem;">Add a beautiful blend to begin!</p></div>`;
    return;
  }
  container.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')} <span style="font-size:0.78rem;color:#aaa;font-weight:400;">× ${item.qty}</span></div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${i})">🗑</button>
    </div>
  `).join('');
}

function buyNow(id) {
  cart = [{ ...products[id], qty: 1 }];
  renderCart();
  openCheckout();
}

// ─── CHECKOUT ───
function openCheckout() {
  if (!cart.length) { showToast('Add items to your cart first!', 'error'); return; }
  document.getElementById('checkout-modal').classList.add('open');
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.querySelectorAll('#checkout-total, #checkout-total-final').forEach(el => { if (el) el.textContent = '₹' + total.toLocaleString('en-IN'); });
}
function closeCheckout() { document.getElementById('checkout-modal').classList.remove('open'); }

function placeOrder() {
  const fields = ['co-fname', 'co-email', 'co-phone', 'co-addr', 'co-pin'];
  for (const f of fields) {
    if (!document.getElementById(f)?.value.trim()) {
      showToast('Please fill in all required fields!', 'error'); return;
    }
  }
  const orderId = 'NLR-' + Math.random().toString(36).substr(2,8).toUpperCase();
  closeCheckout();
  cart = [];
  renderCart();
  showToast(`🎉 Order ${orderId} placed! Confirmation sent to your email.`);
}

// ─── SEARCH ───
const catalog = [
  { name: 'Butterfly Pea Flower Blue Tea — 50g', tags: ['sleep','skin','antioxidant','stress','blue','relax','calm'], price: 449, id: 'blue' },
  { name: 'Butterfly Pea Flower Blue Tea — 100g (Pack of 2)', tags: ['skin','glow','bundle','antioxidant','value','blue'], price: 749, id: 'blue' },
  { name: 'Butterfly Pea Flower Blue Tea — 150g (Pack of 3)', tags: ['best value','bulk','antioxidant','blue'], price: 1099, id: 'blue' },
  { name: 'Peppermint + Blue Tea Combo (Pack of 2)', tags: ['peppermint','stress','anxiety','digestion','combo','refresh'], price: 899, id: 'combo' },
];

function openSearch() {
  document.getElementById('search-modal').classList.add('open');
  setTimeout(() => document.getElementById('search-input')?.focus(), 120);
}
function closeSearch() {
  document.getElementById('search-modal').classList.remove('open');
  document.getElementById('search-results').innerHTML = '';
  document.getElementById('search-input').value = '';
}
function runSearch(q) {
  const container = document.getElementById('search-results');
  if (!q.trim()) { container.innerHTML = ''; return; }
  const results = catalog.filter(p => p.tags.some(t => t.includes(q.toLowerCase())) || p.name.toLowerCase().includes(q.toLowerCase()));
  if (!results.length) { container.innerHTML = `<p style="color:var(--text-muted);padding:8px 0;">No results. Try "blue tea", "sleep", or "stress".</p>`; return; }
  container.innerHTML = results.map(r => `
    <div class="search-result-item" onclick="quickAdd('${r.name}',${r.price},'${r.id}')">
      <div><div class="search-result-name">${r.name}</div><div style="font-size:0.78rem;color:var(--text-muted);">${r.tags.slice(0,3).join(' · ')}</div></div>
      <div class="search-result-price">₹${r.price}</div>
    </div>
  `).join('');
}
function quickAdd(name, price, id) {
  const img = products[id]?.img || '';
  const idx = cart.findIndex(i => i.name === name);
  if (idx > -1) cart[idx].qty++;
  else cart.push({ name, price, origPrice: price, img, qty: 1 });
  renderCart();
  closeSearch();
  showToast('✅ Added to cart!');
}

// ─── AI CHAT ───
function toggleAIChat() {
  document.getElementById('ai-chat-window').classList.toggle('hidden');
}
function handleAIQuery() {
  const input = document.getElementById('ai-input');
  const q = input.value.trim();
  if (!q) return;
  const chatBody = document.getElementById('chat-body');
  chatBody.innerHTML += `<div class="user-msg">${q}</div>`;
  input.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;
  setTimeout(() => {
    const l = q.toLowerCase();
    let reply, action = '';
    if (/sleep|relax|calm|night|insomnia/.test(l)) {
      reply = 'For better sleep, our <b>Blue Tea 50g</b> is perfect — naturally caffeine-free and deeply calming before bedtime. 🌙';
      action = `<br><button class="btn btn-dark btn-sm" style="margin-top:8px;" onclick="addToCart('blue');toggleAIChat()">Add Blue Tea to Cart →</button>`;
    } else if (/skin|glow|anti.?aging|radiant|bright/.test(l)) {
      reply = 'For glowing skin, the anthocyanins in <b>Blue Tea 100g Pack of 2</b> are amazing when taken daily for 30+ days! ✨';
      action = `<br><button class="btn btn-dark btn-sm" style="margin-top:8px;" onclick="cart.push({...products.blue,name:'Butterfly Pea Flower Blue Tea — 100g (Pack of 2)',price:749,qty:1});renderCart();toggleAIChat();showToast('✅ Added!')">Add 100g Pack →</button>`;
    } else if (/stress|anxiety|tension|worry|overwhelm/.test(l)) {
      reply = 'For stress and anxiety, our <b>Peppermint + Blue Tea Combo</b> is incredible — peppermint clears the mind, blue tea calms the nerves. 🧘';
      action = `<br><button class="btn btn-dark btn-sm" style="margin-top:8px;" onclick="addToCart('combo');toggleAIChat()">Add Combo →</button>`;
    } else if (/digest|stomach|bloat|gut/.test(l)) {
      reply = 'For digestive wellness, our <b>Peppermint + Blue Tea Combo</b> is excellent. Peppermint naturally soothes and cleanses the digestive tract. 🌿';
      action = `<br><button class="btn btn-dark btn-sm" style="margin-top:8px;" onclick="addToCart('combo');toggleAIChat()">Add Combo →</button>`;
    } else if (/price|cheap|budget|afford|value/.test(l)) {
      reply = 'For the best value, our <b>Blue Tea 150g Pack of 3</b> gives you 300 servings and saves you ₹400 vs buying separately! 💰';
      action = `<br><button class="btn btn-dark btn-sm" style="margin-top:8px;" onclick="cart.push({...products.blue,name:'Butterfly Pea Flower Blue Tea — 150g (Pack of 3)',price:1099,qty:1});renderCart();toggleAIChat();showToast('✅ Added!')">Add Value Pack →</button>`;
    } else {
      reply = 'I can help you find the perfect blend! Could you share your main goal? Try: <b>sleep, skin, stress, digestion, or value</b>. 🫖';
    }
    chatBody.innerHTML += `<div class="bot-msg">${reply}${action}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 650);
}

// ─── NEWSLETTER ───
function subscribeNewsletter(e) {
  e.preventDefault();
  showToast('🎉 Subscribed! Your wellness guide is on its way!');
  e.target.reset();
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  document.getElementById('ai-input')?.addEventListener('keypress', e => { if (e.key === 'Enter') handleAIQuery(); });
  document.getElementById('search-input')?.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });
});
