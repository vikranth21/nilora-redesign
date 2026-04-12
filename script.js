// ─── STATE ───
const P = {
  blue:  { name:'Butterfly Pea Flower Blue Tea — 50g', price:449, was:599, img:'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=80&h=80' },
  combo: { name:'Peppermint + Blue Tea Combo (Pack of 2)', price:899, was:1199, img:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=80&h=80' }
};
let cart = [];

// ─── TOAST ───
function toast(msg, err=false) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.style.background = err ? '#b91c1c' : '#1a3a2a';
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3200);
}

// ─── HEADER SCROLL ───
window.addEventListener('scroll', () => {
  document.getElementById('siteHeader')?.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ─── VARIANTS ───
function setVariant(id, price, was, name, btn) {
  P[id] = { ...P[id], price, was, name };
  document.getElementById('price' + id[0].toUpperCase() + id.slice(1)).textContent = '₹' + price;
  document.getElementById('was'   + id[0].toUpperCase() + id.slice(1)).textContent = '₹' + was.toLocaleString('en-IN');
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
  toast('Added to cart');
}

function removeItem(i) {
  cart.splice(i, 1);
  renderCart();
}

function renderCart() {
  const body = document.getElementById('cartBody');
  const count = cart.reduce((s, c) => s + c.qty, 0);
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const badge = document.getElementById('cartCount');

  badge.textContent = count;
  badge.style.display = count ? 'flex' : 'none';
  document.getElementById('cartTotal').textContent = '₹' + total.toLocaleString('en-IN');
  ['coSubtotal','coTotal'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent = '₹'+total.toLocaleString('en-IN'); });

  if (!cart.length) {
    body.innerHTML = `<div class="cart-empty-state"><span>🍃</span><p>Your cart is empty</p><p style="font-size:0.82rem;">Browse and add something beautiful.</p></div>`;
    return;
  }
  body.innerHTML = cart.map((c,i) => `
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
  const id = 'NLR-' + crypto.randomUUID().substring(0,8).toUpperCase();
  closeCheckout();
  cart = []; renderCart();
  toast(`Order ${id} placed! Confirmation on its way.`);
}

// ─── SEARCH ───
const catalog = [
  { name:'Blue Tea — 50g (100 cups)',         tags:['sleep','antioxidant','stress','relax','blue','skin','calm'], price:449, id:'blue' },
  { name:'Blue Tea — 100g Pack of 2',          tags:['skin','glow','bundle','antioxidant','value','blue'],        price:749, id:'blue' },
  { name:'Blue Tea — 150g Pack of 3',          tags:['value','bulk','best deal','antioxidant','blue'],            price:1099, id:'blue' },
  { name:'Peppermint + Blue Tea Combo',        tags:['peppermint','stress','anxiety','digestion','combo','refresh','gut'], price:899, id:'combo' },
];
function openSearch() { document.getElementById('searchModal').classList.add('open'); setTimeout(()=>document.getElementById('searchInput').focus(),80); }
function closeSearch() { document.getElementById('searchModal').classList.remove('open'); document.getElementById('searchInput').value=''; document.getElementById('searchResults').innerHTML=''; }
function doSearch(q) {
  const el = document.getElementById('searchResults');
  if (!q.trim()) { el.innerHTML=''; return; }
  const hits = catalog.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.tags.some(t=>t.includes(q.toLowerCase())));
  if (!hits.length) { el.innerHTML=`<p style="color:var(--gray-400);padding:6px 0;font-size:0.875rem;">No results. Try "blue tea", "stress", "skin".</p>`; return; }
  el.innerHTML = hits.map(h=>`<div class="search-hit" onclick="quickAdd('${h.name}',${h.price},'${h.id}')"><div><div class="search-hit-name">${h.name}</div><div style="font-size:0.75rem;color:var(--gray-400);margin-top:2px;">${h.tags.slice(0,3).join(' · ')}</div></div><div class="search-hit-price">₹${h.price}</div></div>`).join('');
}
function quickAdd(name, price, id) {
  const img = P[id]?.img||'';
  const i = cart.findIndex(c=>c.name===name);
  i>-1 ? cart[i].qty++ : cart.push({name,price,was:price,img,qty:1});
  renderCart(); closeSearch(); toast('Added to cart');
}

// ─── AI CHAT ───
function toggleAI() { openAI(); }
function openAI() {
  const p = document.getElementById('aiPanel');
  p.classList.toggle('closed');
}
function sendAI() {
  const inp = document.getElementById('aiInput');
  const q = inp.value.trim(); if(!q) return;
  const msgs = document.getElementById('aiMessages');
  msgs.innerHTML += `<div class="msg-user">${q}</div>`;
  inp.value=''; msgs.scrollTop=msgs.scrollHeight;
  setTimeout(()=>{
    const l=q.toLowerCase(); let reply='', cta='';
    if (/sleep|insomnia|night|calm|relax/.test(l)) {
      reply='For better sleep, our <strong>Blue Tea (50g)</strong> is ideal — naturally caffeine-free and deeply calming before bed.';
      cta=`<br><button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="addToCart('blue');toggleAI()">Add to Cart</button>`;
    } else if (/skin|glow|radiant|anti.?aging|bright/.test(l)) {
      reply='For glowing skin, try the <strong>Blue Tea 100g Pack of 2</strong> for daily use. Rich in anthocyanin for visible results.';
      cta=`<br><button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="P.blue.name='Butterfly Pea Flower Blue Tea — 100g (Pack of 2)';P.blue.price=749;addToCart('blue');toggleAI()">Add 100g Pack</button>`;
    } else if (/stress|anxiety|worry|tension|overwhelm/.test(l)) {
      reply='For stress relief, our <strong>Peppermint + Blue Tea Combo</strong> is perfect — peppermint clears the head, blue tea calms the nerves.';
      cta=`<br><button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="addToCart('combo');toggleAI()">Add Combo</button>`;
    } else if (/digest|gut|stomach|bloat/.test(l)) {
      reply='For digestion, our <strong>Peppermint + Blue Tea Combo</strong> is excellent. Peppermint soothes and cleanses the digestive tract naturally.';
      cta=`<br><button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="addToCart('combo');toggleAI()">Add Combo</button>`;
    } else if (/price|budget|cheap|value|deal/.test(l)) {
      reply='Best value — our <strong>Blue Tea 150g Pack of 3</strong> gives you 300 cups and saves ₹400 versus buying separately.';
      cta=`<br><button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="P.blue.name='Butterfly Pea Flower Blue Tea — 150g (Pack of 3)';P.blue.price=1099;addToCart('blue');toggleAI()">Add Value Pack</button>`;
    } else {
      reply='I can help you find the right blend. What\'s your main goal — <strong>sleep, skin, stress, or digestion</strong>?';
    }
    msgs.innerHTML += `<div class="msg-bot">${reply}${cta}</div>`;
    msgs.scrollTop=msgs.scrollHeight;
  }, 600);
}

// ─── NEWSLETTER ───
function nlSubmit(e) { e.preventDefault(); toast('Subscribed! Your wellness guide is on the way.'); e.target.reset(); }

// ─── INIT ───
document.addEventListener('DOMContentLoaded', ()=>{
  renderCart();
  document.getElementById('aiInput')?.addEventListener('keydown', e=>{ if(e.key==='Enter') sendAI(); });
  document.getElementById('searchInput')?.addEventListener('keydown', e=>{ if(e.key==='Escape') closeSearch(); });
});
