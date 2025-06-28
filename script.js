document.addEventListener('DOMContentLoaded', function (){

    const products = [
        {id: 1, name: "Product 1", price: 10},
        {id: 2, name: "Product 2", price: 40},
        {id: 3, name: "Product 3", price: 70}
    ];

    let cart = JSON.parse(localStorage.getItem('cart')) || [];


    const productList = document.getElementById('product-list')
    const emptyCartMessage = document.getElementById('empty-cart')
    const cartItemList = document.getElementById('cart-items')
    const cartStats = document.getElementById('cart-total')
    const totalPriceDisplay = document.getElementById('total-price')
    const checkOutBtn = document.getElementById('checkout-btn')

    cart.forEach(item => displayProducts(item));

    products.forEach(product => {
        const productDiv = document.createElement('div');

        productDiv.classList.add('product'); 

        productDiv.innerHTML = `
        
        <span>${product.name} - <span id="price-item-${product.id}">$ ${product.price.toFixed(2)}</span></span>
        <button data-id=${product.id}>Add to cart</button>

        `;

        productList.appendChild(productDiv);
    })


    productList.addEventListener('click',(e) => {
        
        if(e.target.tagName !== 'BUTTON') return 
        
        const productId = parseInt(e.target.dataset.id)
        
        const product = products.find(p => p.id === productId)
        

        renderCartItem(product)

        updateCartStats()

        saveCartItems()
    })



    function updateCartStats(){

        let totalPrice = 0


        cart.forEach(item =>{
            totalPrice += item.price*item.qty
        })

        totalPriceDisplay.textContent = `${totalPrice.toFixed(2)}`

    }

    checkOutBtn.addEventListener('click', function (){


        alert('Checkout Successful!')
        cart = []
        clearCartList()

        saveCartItems()
    })

    cartItemList.addEventListener('click', (e) => {

        if(e.target.tagName !== 'BUTTON' || cart.length === 0) return 

        const selectedProduct = e.target
        const productId = parseInt(selectedProduct.dataset.id)

        const index = cart.findIndex(p => p.id === productId)

        if(cart[index]["qty"] > 1){
            cart[index]["qty"]--
            document.getElementById(`qty-${cart[index].id}`).textContent = `${cart[index]["qty"]}`
            
        }else{
            cart = cart.filter(item => item.id !== productId)
            e.target.parentElement.remove()
        }
        
        if(cart.length === 0){
            clearCartList()
        }
        saveCartItems()
        updateCartStats()
        
    })
    
    function saveCartItems(){
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    function renderCartItem(product){

        const cartProduct = cart.find(p => p.id === product.id)

        if(cartProduct) {
            const index = cart.findIndex(p => p.id === product.id)
            cart[index]["qty"] += 1
            
            document.getElementById(`qty-${cart[index].id}`).textContent = `${cart[index]["qty"]}`
            updateCartStats()

        }else{
            product["qty"] = 1
            cart.push(product)

            displayProducts(product)
        }
        
    }

    function displayProducts(product){
        const item = document.createElement('div')

        item.setAttribute('id', `item-${product.id}`)
        item.classList.add('cart-item')

        item.innerHTML = `
        <span>${product.name} - $${product.price.toFixed(2)}</span>
        <span> Qty: <span id="qty-${product.id}">${product.qty}</span></span>
        <button data-id="${product.id}" class = "">Remove</button>
        `

        updateCartStats()

        cartItemList.append(item)
        emptyCartMessage.classList.add('hidden')
        cartStats.classList.remove('hidden')
    }
    

    function clearCartList(){
        cartItemList.innerHTML = ''
        totalPriceDisplay.textContent = `0.00`
        emptyCartMessage.classList.remove('hidden')
        cartItemList.appendChild(emptyCartMessage)
        cartStats.classList.add('hidden')
    }
})