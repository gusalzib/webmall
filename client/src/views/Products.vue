<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <div>
    <b-container fluid>
      <!-- <b-button class="btn_message" variant="primary" v-on:click="getProducts()">Get products</b-button> -->
      <!-- <p id="error_message">This is an error message: {{ message }}</p> -->

      <!-- @submit.prevent="myFunction()", and your button could instead be <input type="submit" value="Submit"/>.
        The submit type will trigger the form to submit, and the submit.prevent will prevent the default
         submit behavior and execute myFunction as desired. 
         https://stackoverflow.com/questions/48028718/using-event-modifier-prevent-in-vue-to-submit-form-without-redirection#:~:text=Try%20%40submit.,and%20execute%20myFunction%20as%20desired.-->
      <div class="products-page-banner">
        <div class="search-container">
          <form @submit.prevent="searchProducts()">
            <input
              type="text"
              placeholder="Search.."
              name="search"
              v-model="searchString"
            />
            <button @click="searchProducts()">
              <i class="fa fa-search"></i>
            </button>
          </form>
        </div>
        <!-- <img src="/productBanner (7).jpeg" alt=""> -->
        <div class="product-filter">
          <select
            name="category-selection"
            id="selection"
            v-model="category"
            form="category-form"
            placeholder="Select category"
          >
            <option value="">Choose a category</option>
            <option value="Clothing">Clothes</option>
            <option value="Shoes">Shoes</option>
            <option value="Electronics">Electronics</option>
            <option value="Homemade">Homemade</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Hobby">Hobby</option>
            <option value="Art">Art</option>
          </select>

          <select
            name="price-selection"
            id="selection"
            form="price-form"
            placeholder="Sort after price"
            v-model="price"
          >
            <option value="">Sort after price</option>
            <option value="1">Lowest to highest</option>
            <option value="-1">Highest to lowest</option>
            <!-- <option value="sales">Sales</option> -->
          </select>

          <select
            name="alphabetical-selection"
            id="selection"
            form="alphabetical-form"
            placeholder="Sort by name"
            v-model="name"
          >
            <option value="">Sort by name</option>
            <option value="1">A - Z</option>
            <option value="-1">Z - A</option>
          </select>

          <br />
          <button class="submit-button" @click="getProducts()">
            Reset Filter</button
          >&nbsp&nbsp
          <button class="submit-button" @click="filterProducts()">
            Apply Filter
          </button>
        </div>
      </div>
      <div id="numberOfResults" class="numberOfResults">
        {{ numberOfResults }}
      </div>
      <div id="error_message" class="error_message">{{ error_message }}</div>
      <div class="cards-container">
        <li v-for="product in products" :key="product._id">
          <div id="product-card">
            <div class="discount-tag" v-if="product.discount > 0">
              <p>Save {{ product.discount }}%</p>
            </div>
            <router-link :to="`/single/product/${product._id}`">
              <img
                id="product-image"
                :src="`http://localhost:3000/public/product_images/${product.image}`"
                alt="Product image"
            /></router-link>

            <!-- {{ product }} -->
            <h3 id="product-name">{{ product.name }}</h3>
            <div v-if="product.discount > 0">
              <p id="product-price">{{ calcDiscountedPrice(product) }} SEK</p>
              <p id="product-discount">
                <s>{{ product.price }} SEK</s>
              </p>
            </div>
            <div v-else-if="product.discount === 0">
              <p id="product-price">{{ product.price }} SEK</p>
            </div>
          </div>
        </li>
      </div>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'
import { errorMessages } from 'vue/compiler-sfc'

export default {
  name: 'products',
  data() {
    return {
      message: 'none',
      products: [],
      category: '',
      query: '',
      price: '',
      name: '',
      searchString: '',
      error_message: '',
      numberOfResults: '',
      productionURL: 'https://webmall.onrender.com/api'
    }
  },
  mounted() {
    this.getProducts()
  },
  methods: {
    getProducts() {
      Api.get('/products')
        .then((response) => {
          this.products = response.data
        })
        .catch((error) => {
          document.getElementById('error_message').innerHTML = error.message

          this.message = error
        })
    },
    calcDiscountedPrice(product) {
      var discountedPrice =
        product.price - (product.discount / 100) * product.price
      return discountedPrice.toFixed(2)
    },
    filterProducts() {
      if (!this.category) {
        this.category = ''
      }
      Api.get(`${this.productionURL}/products/filter/${this.category}/${this.price}/${this.name}`)
        .then((response) => {
          this.products = response.data
        })
        .catch((error) => {
          document.getElementById('error_message').innerHTML = error.message
        })
      this.query = '' //reset the query every time the button is clicked
    },
    searchProducts() {
      if (!this.searchString) {
        this.error_message = ''
        document.getElementById('error_message').style.display = 'none'
        document.getElementById('numberOfResults').style.display = 'none'
        this.getProducts()
      } else {
        Api.get(`${this.productionURL}/products/search/products/${this.searchString}`)
          .then((response) => {
            this.products = response.data
            if (this.products.length === 0) {
              this.numberOfResults = ''
              this.error_message = 'No results found'
              document.getElementById('numberOfResults').style.display = 'none'
              document.getElementById('error_message').innerHTML =
                this.error_message
              document.getElementById('error_message').style.display = 'block'
            } else if (this.products.length > 0) {
              this.error_message = ''
              this.numberOfResults = this.products.length + ' products found'
              document.getElementById('error_message').style.display = 'none'
              document.getElementById('numberOfResults').style.display = 'block'
            }
          })
          .catch((error) => {
            const backendMessage = error.response?.data.message
            const requestStatus = error.response?.status
            document.getElementById('numberOfResults').style.display = 'none'
            document.getElementById('error_message').innerHTML = backendMessage
            document.getElementById('error_message').style.display = 'block'
          })
      }
    }
  }
}
</script>

<style src="../css/style.css"></style>
