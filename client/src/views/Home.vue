<template>
  <div class="home-container">
    <div class="banner-container">
      <img class="banner-image" src="/banner (3).jpeg" alt="banner image" />
      <div class="banner-overlay">
        <!-- <h3>Continue as a...</h3> -->
        <!-- <router-link class="nav-links-mobile-view top-link" to="/">Buyer</router-link>or -->
        <div class="banner-overlay-button-container">
          <router-link id="overlay-button" to="/sellers"
            >Continue as Seller</router-link
          >
          <router-link id="overlay-button" to="/Stores"
            >Explore Stores</router-link
          >
        </div>
      </div>
    </div>
    <p id="error_message">This is an error message: {{ message }}</p>
    <h2 id="top_deals">Why work with us?</h2>
    <div id="announcements-container">
      <div class="announcement">
        <img src="/Designer (3).png" alt="Announcment" />
        <h5>Global Reach</h5>
      </div>
      <div class="announcement">
        <img src="/Designer (1).png" alt="Announcment" />
        <h5>Best Quality Guarantee</h5>
      </div>
      <div class="announcement">
        <img src="/Designer.png" alt="Announcment" />
        <h5>Reliable Shipping</h5>
      </div>
      <div class="announcement">
        <img src="/Designer (2).png" alt="Announcment" />
        <h5>Convenient Refund Policy</h5>
      </div>
    </div>

    <h2 id="top_deals">Our Top deals</h2>
    <div class="cards-container cards-container-home">
      <li v-for="product in products" :key="product._id">
        <div id="product-card">
          <div class="discount-tag" v-if="product.discount > 0">
            <p>Save {{ product.discount }}%</p>
          </div>
          <router-link :to="`/single/product/${product._id}`"
            ><img
              id="product-image"
              :src="`http://localhost:3000/public/product_images/${product.image}`"
              alt="Product image"
          /></router-link>
          <!-- {{ product }} -->
          <h3 id="product-name">{{ product.name }}</h3>
          <p id="product-price">{{ calcDiscountedPrice(product) }} SEK</p>
          <p id="product-discount"><s>{{ product.price }} SEK</s></p>
          <!-- <p> {{ product.color }} </p>
                <p> {{ product.size }} </p> -->
        </div>
      </li>
    </div>
    <router-link class="submit-button" to="/products"
      >Continue shopping...</router-link
    >
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'home',
  data() {
    return {
      message: 'none',
      products: []
    }
  },
  mounted() {
    this.getProducts()
  },
  methods: {
    getMessage() {
      Api.get('/')
        .then((response) => {
          this.message = response.data.message
        })
        .catch((error) => {
          this.message = error
        })
    },
    getProducts() {
      Api.get('/products/sales')
        .then((response) => {
          this.products = response.data
          //console.log(this.products)
        })
        .catch((error) => {
          document.getElementById('error_message').innerHTML = error.message
        })
    },
    calcDiscountedPrice(product) {
      var discountedPrice =
        product.price - (product.discount / 100) * product.price
      return discountedPrice.toFixed(2)
    }
  }
}
</script>

<style src="../css/style.css"></style>
