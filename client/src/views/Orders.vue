<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <div>
    <b-container fluid>
      <!-- <b-button class="btn_message" variant="primary" v-on:click="getProducts()">Get products</b-button> -->

      <div class="order-search-container">
        <form @submit.prevent="searchOrder()">
          <input
            type="text"
            placeholder="Search city, status, street"
            name="search"
            v-model="searchString"
          />
          <button @click="searchOrder()"><i class="fa fa-search"></i></button>
        </form>
      </div>
      <div id="confirmation_message" class="confirmation_message">
        {{ confirmation_message }}
      </div>
      <div id="error_message" class="error_message">{{ error_message }}</div>
      <div class="cards-container">
        <li v-for="order in orders" :key="order._id">
          <div class="order-card-background">
            <div id="order-card">
              <p id="order-id"><strong>OrderID:</strong> {{ order._id }}</p>
              <p id="order-name">
                <strong>Buyer ID:</strong> {{ order.buyer_id }}
              </p>
              <p id="order-street">
                <strong>Street:</strong> {{ order.street }}
              </p>
              <p id="order-city"><strong>City:</strong> {{ order.city }}</p>
              <p id="order-zipcode">
                <strong>Zipcode:</strong> {{ order.zipcode }}
              </p>
              <p id="order-order_number">
                <strong>Order Number:</strong> {{ order.order_number }}
              </p>
              <p id="order-status">
                <strong>Status:</strong> {{ order.status }}
              </p>
              <p id="order-total_sum">
                <strong>Total:</strong> {{ order.total_sum }} SEK
              </p>
              <router-link
                id="submit-button-link"
                :to="`/orders/order/details/${order._id}`"
                ><button class="submit-button">See details</button></router-link
              >
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

export default {
  name: 'orders',
  data() {
    return {
      message: 'none',
      orders: [],
      searchString: '',
      isLoggedIn: false,
      isAdmin: false,
      productionURL: 'https://webmall.onrender.com/api'
    }
  },
  mounted() {
    this.getOrders()
    this.checkLogin()
  },
  methods: {
    getOrders() {
      Api.get(`${this.productionURL}/orders`)
        .then((response) => {
          this.orders = response.data
        })
        .catch((error) => {
          document.getElementById('error_message').innerHTML = error.message
          this.message = error
        })
    },

    searchOrder() {
      if (!this.searchString) {
        this.getOrders()
      } else {
        Api.get(`${this.productionURL}/orders/search/orders/${this.searchString}`)
          .then((response) => {
            this.orders = response.data

            if (response.status === 200) {
              document.getElementById('confirmation_message').style.display =
                'block'
              document.getElementById('confirmation_message').innerHTML =
                'Results found: ' + this.orders.length
              document.getElementById('error_message').style.display = 'none'
            }

            if (this.orders.length === 0) {
              document.getElementById('error_message').style.display = 'block'
              document.getElementById('error_message').innerHTML =
                'No results found'
              document.getElementById('confirmation_message').style.display =
                'none'
            }
          })
          .catch((error) => {
            document.getElementById('error_message').style.display = 'block'
            document.getElementById('error_message').innerHTML =
              'Search failed '
            document.getElementById('confirmation_message').style.display =
              'none'
          })
      }
    },
    checkLogin() {
      try {
        Api.get(`${this.productionURL}/login-check`)
          .then((response) => {
            this.isLoggedIn = response.data.loggedIn
            this.isAdmin = response.data.isAdmin
            // console.log('Is authenticated: ', this.isLoggedIn)
            // console.log('Is admin: ', this.isAdmin)
          })
          .catch((error) => {
            if (error.response.status === 401) {
              // console.log(error.message)
              window.location.replace('/login')
              document.getElementById('error_message').style.display = 'block'
              document.getElementById('error_message').innerHTML =
                'Session expired. Please login again. '
              document.getElementById('confirmation_message').style.display =
                'none'
            }
          })
      } catch (error) {
        document.getElementById('error_message').style.display = 'block'
        document.getElementById('error_message').innerHTML =
          'Session expired. Please login again. '
        document.getElementById('confirmation_message').style.display = 'none'
      }
    },
    getStoreInfo() {
      try {
        Api.get(`${this.productionURL}/orders/${order_id}/stores`)
          .then((response) => {
            if (response.status === 200) {
              this.stores = response.data
            } else {
              document.getElementById('error_message').innerHTML =
                'No stores found'
              document.getElementById('error_message').style.display = 'block'
            }
          })
          .catch((error) => {
            document.getElementById('error_message').innerHTML =
              'No stores found'
            document.getElementById('error_message').style.display = 'block'
          })
      } catch (error) {
        this.error_message = error.message
      }
    }
  }
}
</script>

<style src="../css/style.css"></style>
