// =====================
// PRODUCT DATA
// =====================
const products = {
  blue: { name: 'Butterfly Pea Flower Blue Tea 50g', price: 449, variant: '50g', qty: 1 },
  combo: { name: 'Peppermint + Blue Tea Combo (Pack of 2)', price: 899, variant: 'Pack of 2', qty: 1 }
};
const selectedProducts = {};

// Clone product data for cart tracking
let cart = [];

// =====================
// TOAST NOTIFICATION
// =====================
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.background = type === 'error' ? '#e74c3c' : '#27ae60';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// =====================
// PRODUCT VARIANT TOGGLE
// =====================
function updatePrice(productId, newPrice, btn, name, qty) {
  document.getElementById('price-' + productId).textContent = '₹' + newPrice;
  document.querySelectorAll('#toggles-' + productId + ' .size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  products[productId] = { name, price: newPrice, qty };
}

// =====================
// CART
// =====================
function toggleCart() {
  document.getElementById('cart-drawer').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('open');
}

function addToCart(productId) {
  const p = products[productId];
  const existing = cart.find(i => i.name === p.name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...p, qty: 1 });
  }
  renderCart();
  toggleCart();
  showToast('✅ Added to cart!');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const countEl = document.getElementById('cart-count');
  const totalEl = document.getElementById('cart-total');
  const checkoutTotal = document.getElementById('checkout-total');

  let total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  let count = cart.reduce((s, i) => s + i.qty, 0);

  countEl.textContent = count;
  totalEl.textContent = '₹' + total;
  if (checkoutTotal) checkoutTotal.textContent = '₹' + total;

  if (cart.length === 0) {
    container.innerHTML = '<p style="color:#aaa;text-align:center;margin-top:40px;">Your cart is empty. Add something beautiful! 🌿</p>';
    return;
  }

  container.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div>
        <div style="font-weight:500">${item.name}</div>
        <div style="font-size:0.85rem;color:#aaa">Qty: ${item.qty}</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="font-weight:600;color:#0A2F82">₹${item.price * item.qty}</span>
        <button onclick="removeFromCart(${i})" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:1.2rem;">🗑</button>
      </div>
    </div>
  `).join('');
}

// =====================
// BUY NOW
// =====================
function buyNow(productId) {
  cart = [{ ...products[productId], qty: 1 }];
  renderCart();
  openCheckout();
}

// =====================
// CHECKOUT
// =====================
function openCheckout() {
  if (cart.length === 0) { showToast('Please add items to cart first!', 'error'); return; }
  document.getElementById('checkout-modal').classList.add('open');
  document.getElementById('checkout-total').textContent = '₹' + cart.reduce((s, i) => s + i.price * i.qty, 0);
  // Close cart drawer
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
}

function closeCheckout() {
  document.getElementById('checkout-modal').classList.remove('open');
}

function placeOrder() {
  const fname = document.getElementById('co-fname').value.trim();
  const email = document.getElementById('co-email').value.trim();
  const phone = document.getElementById('co-phone').value.trim();
  const addr = document.getElementById('co-addr').value.trim();
  const pin = document.getElementById('co-pin').value.trim();
  const payment = document.querySelector('input[name="payment"]:checked').value;

  if (!fname || !email || !phone || !addr || !pin) {
    showToast('Please fill in all required fields!', 'error');
    return;
  }

  const orderId = 'NLR-' + Math.random().toString(36).substr(2,8).toUpperCase();
  showToast(`🎉 Order ${orderId} placed! You'll receive a confirmation shortly.`);
  closeCheckout();
  cart = [];
  renderCart();
}

// =====================
// SEARCH
// =====================
const searchIndex = [
  { name: 'Butterfly Pea Flower Blue Tea 50g', tags: ['blue tea', 'sleep', 'skin', 'antioxidant', 'stress', 'relaxation'], price: 449, id: 'blue' },
  { name: 'Butterfly Pea Flower Blue Tea 100g (Pack of 2)', tags: ['blue tea', 'bundle', 'antioxidant', 'skin', 'glowing'], price: 749, id: 'blue' },
  { name: 'Butterfly Pea Flower Blue Tea 150g (Pack of 3)', tags: ['blue tea', 'value pack', 'antioxidant', 'best value'], price: 1099, id: 'blue' },
  { name: 'Peppermint + Blue Tea Combo (Pack of 2)', tags: ['peppermint', 'combo', 'digestion', 'anxiety', 'stress', 'refresh'], price: 899, id: 'combo' },
];

function openSearch() {
  document.getElementById('search-modal').classList.add('open');
  setTimeout(() => document.getElementById('search-input').focus(), 100);
}
function closeSearch() {
  document.getElementById('search-modal').classList.remove('open');
  document.getElementById('search-results').innerHTML = '';
  document.getElementById('search-input').value = '';
}

function runSearch(q) {
  const container = document.getElementById('search-results');
  if (!q.trim()) { container.innerHTML = ''; return; }
  const results = searchIndex.filter(p => p.tags.some(t => t.includes(q.toLowerCase())) || p.name.toLowerCase().includes(q.toLowerCase()));
  if (!results.length) {
    container.innerHTML = '<p style="color:#aaa">No products found. Try "blue tea", "sleep", "stress".</p>';
    return;
  }
  container.innerHTML = results.map(r => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border:1px solid #eee;border-radius:8px;margin-bottom:8px;">
      <div>
        <div style="font-weight:500">${r.name}</div>
        <div style="color:#0A2F82;font-weight:600">₹${r.price}</div>
      </div>
      <button class="btn btn-primary" style="padding:8px 16px;" onclick="cart.push({name:'${r.name}',price:${r.price},qty:1});renderCart();closeSearch();showToast('✅ Added to cart!')">Add to Cart</button>
    </div>
  `).join('');
}

// =====================
// AI WELLNESS CONCIERGE
// =====================
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
    let reply = '';
    let action = '';
    if (l.includes('sleep') || l.includes('relax') || l.includes('calm')) {
      reply = 'For better sleep I recommend our <b>Butterfly Pea Flower Blue Tea (50g)</b>. It\'s naturally caffeine-free and calming — perfect before bed!';
      action = `<button class="btn btn-primary" style="padding:8px 16px;margin-top:8px;" onclick="addToCart('blue');toggleAIChat()">Add Blue Tea to Cart →</button>`;
    } else if (l.includes('skin') || l.includes('glow') || l.includes('anti-aging')) {
      reply = 'For glowing skin, the antioxidants in <b>Blue Tea (100g Pack of 2)</b> work wonders when consumed daily for 30+ days!';
      action = `<button class="btn btn-primary" style="padding:8px 16px;margin-top:8px;" onclick="updatePrice('blue',749,document.querySelector('#toggles-blue .size-btn:nth-child(2)'),'Butterfly Pea Flower Blue Tea 100g (Pack of 2)',2);addToCart('blue');toggleAIChat()">Add 100g Pack to Cart →</button>`;
    } else if (l.includes('stress') || l.includes('anxiety') || l.includes('tension')) {
      reply = 'For stress & anxiety, our <b>Peppermint + Blue Tea Combo</b> is perfect — peppermint refreshes the mind, blue tea calms the nerves!';
      action = `<button class="btn btn-primary" style="padding:8px 16px;margin-top:8px;" onclick="addToCart('combo');toggleAIChat()">Add Combo to Cart →</button>`;
    } else if (l.includes('digestion') || l.includes('stomach') || l.includes('bloat')) {
      reply = 'Our <b>Peppermint + Blue Tea Combo</b> is excellent for digestion. Peppermint soothes the gut beautifully!';
      action = `<button class="btn btn-primary" style="padding:8px 16px;margin-top:8px;" onclick="addToCart('combo');toggleAIChat()">Add Combo to Cart →</button>`;
    } else {
      reply = 'I\'d love to help! Could you tell me your main health goal? For example: better sleep, glowing skin, or stress relief?';
    }
    chatBody.innerHTML += `<div class="bot-msg">${reply}${action ? '<br>' + action : ''}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 700);
}

// =====================
// INIT
// =====================
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  document.getElementById('ai-input').addEventListener('keypress', e => { if (e.key === 'Enter') handleAIQuery(); });
  document.getElementById('search-input') && document.getElementById('search-input').addEventListener('keypress', e => {
    if (e.key === 'Escape') closeSearch();
  });
});
