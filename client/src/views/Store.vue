<template>
  <div class="singleStore-container">
    <div class="singleStore-main-section">
        <div id="edit-profile" v-if="activeSection === 'edit_profile'">
                    <h3>Edit Profile</h3>
                    
                        <label>First name: </label>
                        <input  type="text" id="fname"/>
                        </br>
                        <label>Last name: </label>
                        <input  type="text" id="lname"/>
                        </br>
                        <label>Middle name: </label>
                        <input  type="text" id="minit"/>
                        </br>
                        <label>Phone number: </label>
                        <input  type="text" id="phone_number"/>
                        </br>
                        <label>Email: </label>
                        <input  type="email" id="email"/>
                        </br>
                        <label>Street: </label>
                        <input  type="text" id="street"/>
                        </br>
                        <label>Zipcode: </label>
                        <input  type="text" id="zipcode"/> 
                        </br>
                        <label>City: </label>
                        <input  type="text" id="city"/>
                        </br>
                        <button id="update-button" class="submit-button" v-on:click="updateBuyer()" type="button">Update</button>
                </div>

                <div v-else-if="activeSection === 'order_history'">
                    <h3>Order History</h3>
                    <div id="order_error_message" class="order_error_message">{{ order_error_message }}</div>

                    <li v-for="order in orders" :key = "order._id">

                    </li>

                </div>
                <div v-else-if="activeSection === 'payment_method'">
                    <h3>Change Payment Method</h3>
                </div>
                <div v-else>

                </div>
                <div id="confirmation_message" class="confirmation_message">{{ confirmation_message }}</div>
                  <div id="error_message" class="error_message">{{ error_message }}</div>

    </div>
    <div class="singleStore-sidebar">
        <div id="single-buyer-sidebar-menu">
            <h3>Control Panel</h3>
            <a id="sidebar-links" @click.native="setActive('my_profile')">My profile</a>
            <a id="sidebar-links" @click.native="setActive('edit_profile')">Edit profile</a>
            <a id="sidebar-links" @click.native="setActive('order_history')" @click="orderHistory()">Order history</a>
            <a id="sidebar-links" @click.native="setActive('payment_method')">Payment method</a>
        </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'
import { errorMessages } from 'vue/compiler-sfc'

export default {
  name: 'store',
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
      order_error_message:'',
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
