/* ─────────────────────────────────────────────
   NiloraStore — Shared localStorage state layer
   Used by both index.html and admin.html
   ───────────────────────────────────────────── */
window.NiloraStore = {
  KEY: 'nilora_v1',

  DEFAULTS: {
    hero: {
      title: "Nature's Most Beautiful Tea.",
      subtitle: "Butterfly Pea Flower Blue Tea — naturally caffeine-free, rich in antioxidants, and mesmerisingly beautiful in every cup.",
      cta: "Shop Now"
    },
    sections: { benefits:true, products:true, reels:true, story:true, newsletter:true, testimonials:true },
    products: {
      blue: {
        variants: [
          { label:'50g · 100 cups',    name:'Butterfly Pea Flower Blue Tea — 50g',            price:449,  was:599  },
          { label:'100g × 2 · 200 cups', name:'Butterfly Pea Flower Blue Tea — 100g (Pack of 2)', price:749,  was:999  },
          { label:'150g × 3 · 300 cups', name:'Butterfly Pea Flower Blue Tea — 150g (Pack of 3)', price:1099, was:1499 }
        ]
      },
      combo: { name:'Peppermint + Blue Tea Combo (Pack of 2)', price:899, was:1199 }
    },
    payments: { upi:true, card:true, cod:true, netbanking:false },
    shipping:  { freeAll:true, threshold:499, days:'3–5 Business Days' },
    reels: [
      { username:'@wellness_with_priya', views:'45.2k views', img:'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=400&h=700&q=80' },
      { username:'@tea_with_meera',       views:'22.1k views', img:'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=400&h=700&q=80' },
      { username:'@healthybowls_india',   views:'18.7k views', img:'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?auto=format&fit=crop&w=400&h=700&q=80' }
    ],
    testimonials: [
      { name:'Priya Sharma', rating:5, text:"The blue tea is absolutely magical! I've been sleeping so much better since I started drinking it every night." },
      { name:'Meera Jain',   rating:5, text:"My skin is visibly glowing after 3 weeks. Incredible difference — will definitely reorder!" },
      { name:'Arjun M.',     rating:5, text:"Best tea I've ever had. The colour change when you add lemon is stunning. Love this product!" }
    ],
    aiActive: true,
    aiRules: "sleep / calm / relax / insomnia → Blue Tea 50g (₹449)\nskin / glow / radiant / anti-aging → Blue Tea 100g Pack (₹749)\nstress / anxiety / worry → Peppermint + Blue Tea Combo (₹899)\ndigestion / gut / bloat → Peppermint + Blue Tea Combo (₹899)\nbest value / budget / deal → Blue Tea 150g Pack (₹1099)",
    seo: { title:'Nilora Organics — Pure Blue Tea & Herbal Wellness', desc:'Shop premium organic Butterfly Pea Flower Blue Tea. Handpicked, 100% natural. Free shipping across India.', keywords:'blue tea, butterfly pea flower, organic tea India, wellness tea' },
    orders: [],
    subscribers: []
  },

  get() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return this._clone(this.DEFAULTS);
      return this._merge(this._clone(this.DEFAULTS), JSON.parse(raw));
    } catch(e) { return this._clone(this.DEFAULTS); }
  },

  set(partial) {
    const next = this._merge(this.get(), partial);
    localStorage.setItem(this.KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('nilora:updated', { detail: next }));
    return next;
  },

  addOrder(data) {
    const s = this.get();
    const order = {
      ...data,
      id: 'NLR-' + Math.random().toString(36).slice(2,8).toUpperCase(),
      date: new Date().toISOString(),
      status: 'Processing'
    };
    s.orders.unshift(order);
    this.set({ orders: s.orders });
    return order;
  },

  addSubscriber(email) {
    const s = this.get();
    if (!s.subscribers.find(e => e === email)) {
      s.subscribers.push(email);
      this.set({ subscribers: s.subscribers });
    }
  },

  _clone(o) { return JSON.parse(JSON.stringify(o)); },
  _merge(target, source) {
    const out = { ...target };
    for (const k of Object.keys(source || {})) {
      if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k]) && target[k] && typeof target[k] === 'object' && !Array.isArray(target[k])) {
        out[k] = this._merge(target[k], source[k]);
      } else {
        out[k] = source[k];
      }
    }
    return out;
  }
};
