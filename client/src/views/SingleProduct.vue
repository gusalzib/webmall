<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <div>
    <b-container fluid>
      <div class="singleProduct-container">
        <div id="singleProduct-card">
          <img
            id="product-image"
            :src="`http://localhost:3000/public/product_images/${product.image}`"
            alt="Product image"
          />
          <!-- {{ product }} -->
          <h3 id="product-name">{{ product.name }}</h3>
          <p id="product-discount" v-if="product.discount > 0">
            <strong>New price: </strong> {{ calcDiscountedPrice(product) }} SEK
          </p>
          <p id="product-price"><strong>Price: </strong> {{ product.price }}</p>
          <p id="product-size"><strong>Size:</strong> {{ product.size }}</p>
          <p id="product-color">
            <strong>Color/s:</strong> {{ product.color }}
          </p>
          <p id="product-category">
            <strong>Category:</strong> {{ product.category }}
          </p>
          <p id="product-description">
            <strong>Description:</strong> {{ product.description }}
          </p>
          <button class="submit-button" v-on:click="addToCart(product._id)">
            Add to cart
          </button>
          <div id="confirmation_message" class="confirmation_message">
            {{ confirmation_message }}
          </div>
          <div id="error_message" class="error_message">
            {{ error_message }}
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'singleProduct',
  data: () => ({
   
        message: 'none',
        product: {
            name: "",
            price: 0,
            discount: 0,
            category: "",
            color: "",
            size: "",
            quantity: 0,
            description: "", 
            image: ""
        } ,
        cartId: '',
        confirmation_message: '',
        error_message: '',
        isLoggedIn: false,
        cartProducts: [],
        numberOfProducts: 0
    })
    ,
    mounted() {
        
        this.getProduct();
        this.checkLogin();
        this.numberOfProducts = 0;
    },
    methods: {
       
        getProduct() {
            const productID = this.$route.params.productID;
            Api.get(`/single/product/${productID}`)
                .then(response => {
                    
                    this.product = response.data;

                })
                .catch(error => {
                    this.message = error;
        })
      },
        calcDiscountedPrice(product) {
            var discountedPrice = product.price - ((product.discount / 100) * product.price);
            return discountedPrice.toFixed(2);
        },
        async addToCart(productId) {
            this.cartProducts = [];
            
            await Api.get("/carts/get/cart",{withCredentials:true}).then(response => {
                        
                        this.cart = response.data.cart;
                        this.cartProducts = this.cart.products; 
                        this.cartId = this.cart._id;
                    })
                    .catch(error => {
                        this.confirmation_message = error.message;
                    })
            if (this.isLoggedIn) {
                Api.put(`/carts/${this.cartId}/${productId}`).then(response => {
                if (response.status === 200) {
                    this.emitter.emit("requestCurrentNumber");
                    
                    document.getElementById("error_message").style.display = "none";
                    document.getElementById("confirmation_message").innerHTML = "Product added successfully";
                    document.getElementById("confirmation_message").style.display = "block";
                } else {

                    document.getElementById("confirmation_message").style.display = "none";
                    document.getElementById("error_message").innerHTML = 'Something went wrong. Could not add products to your cart';
                    document.getElementById("error_message").style.display = "block";
                }
            }).catch(error => {
                        this.confirmation_message = error.message;
        })
            } else if (!this.isLoggedIn) {
                    document.getElementById("confirmation_message").style.display = "none";
                    document.getElementById("error_message").innerHTML = 'Not logged in. Please login to add products to your cart';
                    document.getElementById("error_message").style.display = "block";
            }
            
        },
        checkLogin() {

            Api.get('/login-check').then(response => {
                this.isLoggedIn = response.data.loggedIn
                //console.log(this.isLoggedIn)
            }).catch(error => {
                //console.log('failed to authenticate')
                this.error_message = 'Not logged in. Please login to be able to add products to you cart.'
            })
    }
  }
}
</script>

<style src="../css/style.css"></style>
