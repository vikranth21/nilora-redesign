// Cart Logic
let cartCount = 0;

function toggleCart() {
    const cart = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (cart.classList.contains('hidden')) {
        cart.classList.remove('hidden');
        overlay.classList.remove('hidden');
    } else {
        cart.classList.add('hidden');
        overlay.classList.add('hidden');
    }
}

function addToCart() {
    cartCount++;
    document.querySelector('.cart-count').innerText = cartCount;
    document.querySelector('.empty-cart-msg').innerText = "Item added! Your natural wellness is one step away.";
    
    // Auto-open cart to show seamless experience
    toggleCart();
    setTimeout(() => {
        if (!document.getElementById('cart-drawer').classList.contains('hidden')) toggleCart();
    }, 2500);
}

// Product Variant Toggles
function updatePrice(productId, newPrice, btnElement) {
    // Update price text
    document.getElementById(`price-${productId}`).innerText = `₹${newPrice}`;
    
    // Update active button state
    const parent = btnElement.parentElement;
    parent.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
}

// AI Assistant Logic (Mockup for frontend experience)
function toggleAIChat() {
    const chat = document.getElementById('ai-chat-window');
    chat.classList.toggle('hidden');
}

function handleAIQuery() {
    const inputField = document.getElementById('ai-input');
    const query = inputField.value.trim();
    if (!query) return;

    const chatBody = document.getElementById('chat-body');
    
    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'user-msg';
    userMsg.innerText = query;
    chatBody.appendChild(userMsg);

    inputField.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulate AI Thinking and Response
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'bot-msg';
        
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('sleep') || lowerQuery.includes('stress')) {
            botMsg.innerHTML = "For better sleep and stress relief, our <strong>Butterfly Pea Flower (Blue Tea)</strong> is perfect because it's naturally caffeine-free and calming. Would you like me to add it to your cart?";
        } else if (lowerQuery.includes('skin') || lowerQuery.includes('anti-aging')) {
            botMsg.innerHTML = "Blue tea is rich in antioxidants which promote glowing skin and anti-aging! I recommend the <strong>100g Pack</strong> for a daily routine.";
        } else {
            botMsg.innerText = "That's wonderful. Our organic blends are designed to support your daily wellness journey. Let me know if you need help finding a specific tea!";
        }

        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 800);
}

// Enter key support for AI input
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('ai-input');
    if (input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') handleAIQuery();
        });
    }
});
