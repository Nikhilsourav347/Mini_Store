// Prices are stored in cents so totals never suffer from floating-point errors.
const PRODUCTS = [
  { id: 'notebook', name: 'Notebook', price: 450 },
  { id: 'pen-set', name: 'Pen Set', price: 1200 },
];
const MAX_QTY = 99;
const cart = {};      // productId -> quantity
let placed = false;   // set synchronously on the first successful order; blocks repeats

const $ = (id) => document.getElementById(id);
const money = (cents) => '$' + (cents / 100).toFixed(2);
const find = (id) => PRODUCTS.find((p) => p.id === id);
const total = () => Object.keys(cart).reduce((sum, id) => sum + find(id).price * cart[id], 0);

function renderProducts() {
  $('products').innerHTML = PRODUCTS.map((p) =>
    `<li>
       ${p.id === 'notebook'
         ? `<svg class="product-art" viewBox="0 0 240 160" role="img" aria-label="Illustration of a colorful notebook" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="123" cy="137" rx="66" ry="9" fill="#d98767" opacity=".22"/>
              <g transform="rotate(-8 120 80)">
                <rect x="69" y="24" width="104" height="119" rx="9" fill="#fffaf4"/>
                <rect x="61" y="19" width="104" height="119" rx="9" fill="#f3a47e"/>
                <rect x="72" y="30" width="82" height="97" rx="5" fill="#fff5e9"/>
                <rect x="61" y="19" width="17" height="119" rx="8" fill="#de765f"/>
                <path d="M92 55h45M92 68h45M92 81h45M92 94h32" stroke="#e9b59c" stroke-width="3" stroke-linecap="round"/>
                <path d="M113 38c2-7 12-7 14 0-5 5-9 5-14 0Z" fill="#f2bc49"/>
                <circle cx="69" cy="42" r="2.5" fill="#fff5e9"/>
                <circle cx="69" cy="64" r="2.5" fill="#fff5e9"/>
                <circle cx="69" cy="86" r="2.5" fill="#fff5e9"/>
                <circle cx="69" cy="108" r="2.5" fill="#fff5e9"/>
              </g>
            </svg>`
         : `<svg class="product-art" viewBox="0 0 240 160" role="img" aria-label="Illustration of a set of colorful pens" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="120" cy="135" rx="70" ry="9" fill="#7770bd" opacity=".2"/>
              <g transform="rotate(-23 91 82)">
                <rect x="65" y="31" width="18" height="91" rx="8" fill="#f06b77"/>
                <path d="m65 118 9 19 9-19" fill="#c74f69"/>
                <rect x="71" y="23" width="6" height="17" rx="3" fill="#d94b66"/>
                <path d="M69 51h10M69 58h10" stroke="#ffd8d7" stroke-width="2"/>
              </g>
              <g transform="rotate(-7 120 82)">
                <rect x="105" y="24" width="18" height="104" rx="8" fill="#52b6a4"/>
                <path d="m105 124 9 19 9-19" fill="#318f85"/>
                <rect x="111" y="16" width="6" height="17" rx="3" fill="#318f85"/>
                <path d="M109 48h10M109 56h10" stroke="#d7fff1" stroke-width="2"/>
              </g>
              <g transform="rotate(12 151 82)">
                <rect x="145" y="32" width="18" height="91" rx="8" fill="#f3b84d"/>
                <path d="m145 119 9 19 9-19" fill="#d79335"/>
                <rect x="151" y="24" width="6" height="17" rx="3" fill="#d79335"/>
                <path d="M149 52h10M149 60h10" stroke="#fff1bd" stroke-width="2"/>
              </g>
              <path d="M78 20c0-7 11-7 11 0v9H78zM114 12c0-7 11-7 11 0v9h-11zM154 20c0-7 11-7 11 0v9h-11z" fill="#fff" opacity=".75"/>
            </svg>`}
       <div class="product-details">${p.name}<span>${money(p.price)}</span></div>
       <button type="button" data-add="${p.id}" data-testid="add-${p.id}">Add to cart</button></li>`
  ).join('');
}

function updateTotal() {
  $('order-total').textContent = money(total());
}

function applyLock() {
  document.querySelectorAll('#shop button, #shop input').forEach((el) => { el.disabled = placed; });
}

// Re-renders only the cart list, so the name field is never touched and keeps what was typed.
function renderCart() {
  const ids = Object.keys(cart);
  $('empty-msg').hidden = ids.length > 0;
  $('cart-lines').innerHTML = ids.map((id) => {
    const p = find(id);
    return `<li><span>${p.name} (${money(p.price)} each)</span>
      <label>Qty <input type="number" min="1" max="${MAX_QTY}" value="${cart[id]}" data-qty="${id}" data-testid="qty-${id}"></label>
      <span data-testid="line-total-${id}">${money(p.price * cart[id])}</span>
      <button type="button" data-remove="${id}" data-testid="remove-${id}">Remove</button></li>`;
  }).join('');
  updateTotal();
  applyLock();
}

document.addEventListener('click', (e) => {
  if (placed) return;
  const { add, remove } = e.target.dataset;
  if (add) { cart[add] = Math.min((cart[add] || 0) + 1, MAX_QTY); renderCart(); }
  if (remove) { delete cart[remove]; renderCart(); }
});

// Quantity edits update totals in place (no re-render, so the field keeps focus while typing).
$('cart-lines').addEventListener('input', (e) => {
  const id = e.target.dataset.qty;
  const qty = parseInt(e.target.value, 10);
  if (!id || placed || !(qty >= 1)) return;   // ignore blank/zero/negative while typing
  cart[id] = Math.min(qty, MAX_QTY);
  document.querySelector(`[data-testid="line-total-${id}"]`).textContent = money(find(id).price * cart[id]);
  updateTotal();
});
$('cart-lines').addEventListener('change', (e) => {
  const id = e.target.dataset.qty;
  if (id) e.target.value = cart[id];          // snap invalid entries back to the real quantity
});

$('name').addEventListener('input', () => {
  $('error').textContent = '';
  $('name').setAttribute('aria-invalid', 'false');
});

function makeReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'ORD-' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

$('place-order').addEventListener('click', () => {
  if (placed) return;                          // second click of a double-click ends here
  const name = $('name').value.trim();
  const errors = [];
  if (Object.keys(cart).length === 0) errors.push('Your cart is empty. Add at least one item to check out.');
  if (!name) errors.push('Please enter your full name.');
  $('name').setAttribute('aria-invalid', String(!name));
  $('error').textContent = errors.join(' ');
  if (errors.length) { if (!name) $('name').focus(); return; }

  placed = true;
  applyLock();
  $('confirm-name').textContent = name;
  $('order-reference').textContent = makeReference();
  $('confirm-total').textContent = money(total());
  $('confirmation').hidden = false;
});

$('new-order').addEventListener('click', () => {
  Object.keys(cart).forEach((id) => delete cart[id]);
  placed = false;
  $('name').value = '';
  $('error').textContent = '';
  $('confirmation').hidden = true;
  renderCart();
});

renderProducts();
renderCart();
