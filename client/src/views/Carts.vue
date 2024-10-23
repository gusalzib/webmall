Carts.vue

<template>

<div class="Cart"></div>
    <!-- <p class="cart-text">This is my text.</p> -->
    <!-- <b-button class="btn_message" variant="primary" v-on:click="getProducts()">Get products</b-button> -->


<div class="cart-card-container" v-if="cartProducts.length >  0">
    <div v-for="product in products" :key="product._id" class="cart-card" > 
        <div class="cart-picture-card">
            <img :src="`http://localhost:3000/public/product_images/${product.image}`" alt="Product Image" />
        </div>
        <div class="cart-text-card">
            <b id="product-name"> {{ product.name }} </b>
            <div id="size-div">
            <p id="cart-product-text-size"> Size: </p>
            <p id="product- size"> {{ product.size }}</p>
            </div>
            <div id="color-div">
            <p id="cart-product-text-color"> Color:  </p>
            <p id="Product-color">{{ product.color }} </p>
            </div>
            <div id=price-div>
            <p id="cart-product-text-price"> Old price: </p>
            <p id="cart-product-price"> {{ product.price }} SEK</p>
            </div>
            <div id=discount-div>
            <p id="cart-product-text-discount"> New price: </p>
            <p id="cart-product-discount">{{ product.discount }} SEK </p>
            </div>
            
        </div>
        <div class="cart-counter"> 
            <div class="number-of-items">Number of items:<br>
            </div>
            <div class="cart-counter-buttons">
                <button class="minus-button" v-on:click="removeOneProductFromCart(product._id)" >-</button>
                <div class="counter-square">{{ getProductQuantity(product._id ) }}</div>
                <button class="plus-button" v-on:click="putProductInCart(product._id)">+</button>
            </div>
            <div class="cart-lower-part">
                <p class="total_sum">Items total:<br> </p>
                <p class="sum-calculation">{{ (getProductQuantity(product._id ) * product.price)  }} SEK </p>
            </div>
          
        </div>
    </div>
    
    
    <div class="cart-summary-box">
        <div class="left-side">
             <p id="top-text"> Summary of your cart:</p>
            <div class="cart-product-line-top">
                <p id="cart-product-line-text"> Number of products in cart: </p>
                <p id="cart-product-line-number"> {{ cartNumberOfProducts }} items</p>
            </div>
            <div class="cart-product-line-bottom">
                <p id="cart-sum-line-text">Total sum of products in cart:</p>
                <p id="cart-sum-line-number"> {{ cart_total_sum }} SEK</p>
            </div>   
        </div>
        
        <div class="right-side">
            <p id="top-text-right-side"> Do you want to place an order <br>
                of the content in your cart?</p>
            <button class="order-button" @click="redirectToPayment()">Proceed to Checkout</button>
        </div>
    
        
    
    <img :src="`http://localhost:3000/public/product_images/bin_1696942.png`" alt="Garbage bin" v-on:click="removeAllProductsFromCart()" class="garbage-bin"/>
    </div>
</div>
<div class="empty_cart_message" v-else> Your cart is currently empty!</div>
		<div id="confirmation_message" class="confirmation_message">{{ confirmation_message }}</div>
        <div id="error_message" class="error_message">{{ error_message }}</div>



    </template>
    
    <script>
    import { Api } from '@/Api'
    import axios from 'axios';
    export default {
        name: "Carts",
        data: () => ({
            cart: null,
            message: 'none',
            cartProducts: [],
            productID: [],
            products: [],
            productAndQuantity: [],
            cart_id: null,
            cart_total_sum : 0,
            cartNumberOfProducts: 0,
            numberOfProducts: 0,
            error_message: '',
            confirmation_message: '',
            isLoggedIn: false,
            isAdmin: false,
        
    }),
    
    mounted() {
        this.getCartById();
        this.checkLogin();

        this.emitter.on("updateCartNumber",(data) =>{
        this.cartNumberOfProducts = data.msg;
        })
    },
    methods: {
        checkLogin() {
            Api.get('/login-check').then(response => {
                this.isLoggedIn = response.data.loggedIn
                //console.log(this.isLoggedIn)
            }).catch(error => {
                //console.log('failed to authenticate')
                this.error_message = 'Not logged in. Please login to be able to add products to you cart.'
            })
        },
        getCartById() {
            try{
                this.cartProducts = [];
                this.productID = [];
                this.products = [];
                this.productAndQuantity = [];

                Api.get("/carts/get/cart",{withCredentials:true})
                    .then(response => {
                        
                        this.cart = response.data.cart;
                        this.cartProducts = this.cart.products;
                        this.cart_id = this.cart._id;
                        this.cart_total_sum = this.cart.total_sum;
                        
                        for (let i = 0; i <= this.cartProducts.length-1; i++){
                            this.productID[i] = this.cartProducts[i].product_id;
                            
                            const newProduct = {
                                cartProduct_id : this.cartProducts[i].product_id,
                                product_quantity: this.cartProducts[i].product_quantity
                            }
                            this.productAndQuantity.push(newProduct);
                        }
                        this.getProductsInfo();
                        this.emitter.emit("requestCurrentNumber");
                    }).catch(error => {
                        const backendMessage = error.response?.data.message;
                        const requestStatus = error.response?.status;


                        if (requestStatus === 401) {
                            console.log(backendMessage)
                            document.getElementById("confirmation_message").style.display = "none";
                            document.getElementById("error_message").innerHTML = backendMessage;
                            document.getElementById("error_message").style.display = "block";
                        }
                    })
            } catch (error) {

                this.error_message = error.message;
            }
        },



        async getProductsInfo() {
            for (let i = 0; i<= this.cartProducts.length-1; i++){
                await Api.get(`/products/${this.productID[i]}`).then(response => {
                    if (response.status === 200) {
                        this.products[i] = response.data;
                    } else {
                        this.error_message = error.message;
                    }
                })
            }
        },
        getProductQuantity(product_id ){
        
            const product = this.productAndQuantity.find(products => products.cartProduct_id === product_id)
            return product ? product.product_quantity: 0;
        },
    
        putProductInCart(product_id){
            Api.put(`/carts/${this.cart_id}/${product_id}`)
                .then(response => {

                    const product = this.productAndQuantity.find(product => product.cartProduct_id === product_id);
                    if (product){
                        product.product_quantity += 1;

                        const productInProducts = this.products.find(product => product._id === product_id); 
                        this.cart_total_sum += productInProducts.price;
                        this.emitter.emit("requestCurrentNumber");
                    }
                
                })
                .catch(error => {
                    // this.error_message = error.message
                    const backendMessage = error.response?.data.message;
                    const requestStatus = error.response?.status;

                    document.getElementById("confirmation_message").style.display = "none";
                    document.getElementById("error_message").innerHTML = backendMessage;
                    document.getElementById("error_message").style.display = "block";
                })
        },
        removeOneProductFromCart(product_id){
            Api.put(`/carts/remove/product/${this.cart_id}/${product_id}`)
                .then(response => {
                    
                    const product =this.productAndQuantity.find(product => product.cartProduct_id === product_id); //Update product_quantity
                    if(product && product.product_quantity > 0){
                        product.product_quantity -= 1;
                        //console.log("product.productQuantity = ",product.product_quantity);

                    }else{
                            
                            this.productAndQuantity = this.productAndQuantity.filter(product => product.cartProduct_id !== product_id); //remove product if 0
                            //console.log("productAndQuantity = ",this.productAndQuantity);
                            //console.log("last item");
                        }
                    
                    
                    const productInProducts = this.products.find(product => product._id === product_id); //Update total_sum
                    if (productInProducts){
                        this.cart_total_sum -= productInProducts.price;
                        //console.log("cart total sum = ",this.cart_total_sum);
                    }
                    if (product.product_quantity === 0){
                        location.reload();
                    }
            
                    // this.numberOfProducts = this.productAndQuantity.reduce((total, product) =>{
                    //     return total + product.product_quantity;}, 0);                  //recalulate all quantitys
    
                    this.emitter.emit("requestCurrentNumber");
                        
                })
                .catch(error => {
                    this.message = error.message
                })
        },
        removeAllProductsFromCart(){
            
            Api.put(`/carts/empty/cart/${this.cart_id}`)
                .then(response => {
                    this.cartProducts = [];
                    this.productID = [];
                    this.products = [];
                    this.productAndQuantity = [];

                    this.message = "All products removed from the cart";
                    this.emitter.emit("requestCurrentNumber");
                })
            
        },
        // placeAnOrder() {
        //     var buyerId = this.cart.buyer_id;
        //     Api.post(`/orders/${buyerId}`).then(response => {
        //         if (response.status === 200) {
        //             this.removeAllProductsFromCart()
        //             window.location.replace('/')
        //         } else {
        //             document.getElementById('error_message').style.display = "block"
        //             document.getElementById('error_message').innerHTML = error.message
        //         }
        //     })
            

        // },
        redirectToPayment(){
            window.location.replace('/payment')
        }

      }
    }
    
    
    
    
    </script>
    
    <style src="../css/style.css">
    </style>
    
