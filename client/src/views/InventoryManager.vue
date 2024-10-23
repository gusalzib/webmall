<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <div>
    <b-container fluid>
      <!-- <b-button class="btn_message" variant="primary" v-on:click="getProducts()">Get products</b-button> -->
      <p id="error_message">This is an error message: {{ message }}</p>

      <!-- @submit.prevent="myFunction()", and your button could instead be <input type="submit" value="Submit"/>.
        The submit type will trigger the form to submit, and the submit.prevent will prevent the default
         submit behavior and execute myFunction as desired. 
         https://stackoverflow.com/questions/48028718/using-event-modifier-prevent-in-vue-to-submit-form-without-redirection#:~:text=Try%20%40submit.,and%20execute%20myFunction%20as%20desired.-->

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

      <div class="product-filter">
        <select
          name="category-selection"
          id="selection"
          v-model="category"
          form="category-form"
          placeholder="Select category"
        >
          <option value="">Choose a category</option>
          <option value="Clothes">Clothes</option>
          <option value="Shoes">Shoes</option>
          <option value="Electronics">Electronics</option>
          <option value="Homemade">Homemade</option>
          <option value="Jewelry">Jewelry</option>
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
          Reset Filter
        </button>
        <button class="submit-button" @click="filterProducts()">
          Apply Filter
        </button>
      </div>
      <div id="confirmation_message" class="confirmation_message">
        {{ confirmation_message }}
      </div>
      <div id="error_message" class="error_message">{{ error_message }}</div>
      <div class="cards-container">
        <li v-for="product in products" :key="product._id">
          <div id="product-card">
            <div class="discount-tag" v-if="product.discount > 0">
              <p>Save {{ product.discount }}%</p>
            </div>
            <router-link :to="`/editProduct/${product._id}`">
              <img
                id="product-image"
                :src="`http://localhost:3000/public/product_images/${product.image}`"
                alt="Product image"
            /></router-link>

            <!-- {{ product }} -->
            <!-- <h3 id="product-name">{{ product.name }}</h3> -->
            <div style="text-align: left; padding-left: 15px">
              <p>
                Price after discount: {{ calcDiscountedPrice(product) }} SEK
              </p>
              <p>Price before discount: {{ product.price }} SEK</p>
              <p>Product: {{ product.name }}</p>
              <p>Price: {{ product.price }} SEK</p>
              <p>Color/s: {{ product.color }}</p>
              <p>Size/s: {{ product.size }}</p>
              <p>Category: {{ product.category }}</p>
              <p>Quantity: {{ product.quantity }}</p>
              <p>Valid discount: {{ product.discount }}%</p>
            </div>
            <button
              class="delete-button"
              v-on:click="deleteProduct(product._id)"
            >
              Delete
            </button>

            <router-link
              id="submit-button-link"
              :to="`/editProduct/${product._id}`"
              ><button class="submit-button">Update</button></router-link
            >
          </div>
        </li>
      </div>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'inventoryManager',
  data() {
    return {
      message: 'none',
      products: [],
      category: '',
      query: '',
      category: '',
      price: '',
      name: '',
      searchString: '',
      deletedProduct: '',
      confirmation_message: '',
      error_message: '',
      productionURL: 'https://webmall.onrender.com/api'
    }
  },
  mounted() {
    this.getProducts()
  },
  methods: {
    getProducts() {
      Api.get(`${this.productionURL}/products`)
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
        this.getProducts()
      } else {
        Api.get(`${this.productionURL}/products/search/products/${this.searchString}`)
          .then((response) => {
            this.products = response.data
          })
          .catch((error) => {
            document.getElementById('error_message').innerHTML = error.message
          })
      }
    },
    deleteProduct(productId) {
      Api.delete(`${this.productionURL}products/${productId}`)
        .then((response) => {
          this.products = this.products.filter(
            (product) => product._id !== productId
          )
          if (response.status === 200) {
            this.deletedProduct = response.data
            document.getElementById('confirmation_message').innerHTML =
              'Product deleted successfully.'
            document.getElementById('confirmation_message').style.display =
              'block'
          } else {
            document.getElementById('error_message').innerHTML =
              'Could not delete product.'
            document.getElementById('error_message').style.display = 'block'
          }
        })
        .catch((error) => {
          this.error_message = error.message
          document.getElementById('error_message').innerHTML =
            'Could not delete product.'
          document.getElementById('error_message').style.display = 'block'
        })
    }
  }
}
</script>

<style src="../css/style.css"></style>
