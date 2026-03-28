// Dados de exemplo (substitua por API real se quiser)
const products = [
  { id: "p1", name: "Camiseta Oversized Chama", price: 168.00, oldPrice: null, sku: "UM5L84VEE", img: "https://via.placeholder.com/600x400?text=Camiseta+1" },
  { id: "p2", name: "Camiseta Good News", price: 188.00, oldPrice: 198.00, sku: "NPYJS8KTC", img: "https://via.placeholder.com/600x400?text=Camiseta+2", discountPct: 5 },
  { id: "p3", name: "Boné Jesus Copy", price: 78.00, oldPrice: 98.00, sku: "FWEHFV9UD", img: "https://via.placeholder.com/600x400?text=Bone" },
  { id: "p4", name: "Vale Presente R$498", price: 498.00, sku: "EWDVPQYTB", img: "https://via.placeholder.com/600x400?text=Vale+Presente" }
];

const productsGrid = document.getElementById('products-grid');
const cartDrawer = document.getElementById('cart-drawer');
const openCartBtn = document.getElementById('open-cart');
const closeCartBtn = document.getElementById('close-cart');
const cartCountEl = document.getElementById('cart-count');
const cartItemsEl = document.getElementById('cart-items');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartShippingEl = document.getElementById('cart-shipping');
const cartTotalEl = document.getElementById('cart-total');
const btnCheckout = document.getElementById('btn-checkout');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.getElementById('close-checkout');
const checkoutForm = document.getElementById('checkout-form');
const checkoutResult = document.getElementById('checkout-result');

let cart = JSON.parse(localStorage.getItem('cart_v1')) || {};

function formatMoney(v){
  return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}

function renderProducts(){
  productsGrid.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div>
        ${p.oldPrice ? `<span class="old-price">${formatMoney(p.oldPrice)}</span>` : ''}
        <div class="price">${formatMoney(p.price)}</div>
      </div>
      <div class="actions">
        <button class="btn" data-id="${p.id}">Ver mais</button>
        <button class="btn primary" data-add="${p.id}">Adicionar</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

function saveCart(){ localStorage.setItem('cart_v1', JSON.stringify(cart)); }

function addToCart(id){
  if(!cart[id]) cart[id] = {qty:0};
  cart[id].qty++;
  saveCart();
  renderCart();
}

function removeFromCart(id){
  delete cart[id];
  saveCart();
  renderCart();
}

function changeQty(id, qty){
  if(qty <= 0) return removeFromCart(id);
  cart[id].qty = qty;
  saveCart();
  renderCart();
}

function calculateTotals(){
  let subtotal = 0;
  Object.keys(cart).forEach(id=>{
    const p = products.find(x=>x.id===id);
    subtotal += (p.price * cart[id].qty);
  });
  const shipping = subtotal === 0 ? 0 : (subtotal >= 150 ? 0 : 18.50);
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

function renderCart(){
  cartItemsEl.innerHTML = '';
  const keys = Object.keys(cart);
  cartCountEl.textContent = keys.reduce((s,id)=>s+cart[id].qty,0);
  if(keys.length === 0){
    cartItemsEl.innerHTML = '<p>Carrinho vazio</p>';
  } else {
    keys.forEach(id=>{
      const p = products.find(x=>x.id===id);
      const item = document.createElement('div');
      item.style.marginBottom = '12px';
      item.innerHTML = `
        <div style="display:flex;gap:8px;align-items:center">
          <img src="${p.img}" style="width:64px;height:48px;object-fit:cover;border-radius:6px"/>
          <div style="flex:1">
            <div>${p.name}</div>
            <div style="color:var(--muted);font-size:13px">${formatMoney(p.price)} × ${cart[id].qty}</div>
          </div>
          <div>
            <input type="number" min="1" value="${cart[id].qty}" data-q="${id}" style="width:60px"/>
            <button data-r="${id}" class="btn">Remover</button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(item);
    });
  }
  const totals = calculateTotals();
  cartSubtotalEl.textContent = formatMoney(totals.subtotal);
  cartShippingEl.textContent = formatMoney(totals.shipping);
  cartTotalEl.textContent = formatMoney(totals.total);
}

// eventos
document.addEventListener('click', (ev)=>{
  if(ev.target.matches('[data-add]')) addToCart(ev.target.getAttribute('data-add'));
  if(ev.target.matches('[data-r]')) removeFromCart(ev.target.getAttribute('data-r'));
  if(ev.target.matches('.btn') && ev.target.textContent.trim() === 'Ver mais'){ alert('Detalhes do produto (pode-se implementar página de produto)'); }
});

cartItemsEl.addEventListener('change', (ev)=>{
  const id = ev.target.getAttribute('data-q');
  if(id) changeQty(id, parseInt(ev.target.value,10));
});

// abrir/fechar carrinho
openCartBtn.addEventListener('click', ()=>{ cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); });
closeCartBtn.addEventListener('click', ()=>{ cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); });

// checkout modal eventos
btnCheckout.addEventListener('click', ()=>{
  checkoutModal.classList.add('open'); checkoutModal.setAttribute('aria-hidden','false');
});
closeCheckout.addEventListener('click', ()=>{ checkoutModal.classList.remove('open'); checkoutModal.setAttribute('aria-hidden','true'); });

// formulário de checkout
checkoutForm.addEventListener('submit', async (ev)=>{
  ev.preventDefault();
  const formData = new FormData(checkoutForm);
  const payload = {
    customer: {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address')
    },
    coupon: formData.get('coupon') || null,
    items: Object.keys(cart).map(id=>{
      const p = products.find(x=>x.id===id);
      return { id: p.id, sku: p.sku, name: p.name, price: p.price, qty: cart[id].qty };
    })
  };
  if(payload.items.length === 0){
    checkoutResult.textContent = 'Seu carrinho está vazio.';
    return;
  }
  checkoutResult.textContent = 'Enviando pedido...';
  try{
    const res = await fetch('http://localhost:3000/api/checkout', {
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
    });
    const data = await res.json();
    if(res.ok){
      checkoutResult.textContent = 'Pedido recebido! ID: ' + data.orderId;
      cart = {}; saveCart(); renderCart();
    } else {
      checkoutResult.textContent = 'Erro: ' + (data.message || 'Erro no servidor');
    }
  }catch(err){
    checkoutResult.textContent = 'Erro de conexão: ' + err.message;
  }
});

// inicialização
renderProducts();
renderCart();