<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <div>
    <b-container fluid>
      <div class="singleOrder-container">
        <h2>Order Details</h2>
        <div id="singleOrder-card">
          <!-- {{ product }} -->
          <p id="order-field">Order ID: {{ this.order._id }}</p>
          <p id="order-field">Street: {{ order.street }}</p>
          <p id="order-field">City: {{ this.order.city }}</p>
          <p id="order-field">Zipcode : {{ this.order.zipcode }}</p>
          <p id="order-field">Status : {{ this.order.status }}</p>
          <p id="order-field">Order date : {{ this.order.order_date }}</p>
          <hr />
          <p><strong>Customer details:</strong></p>
          <p id="order-field">Buyer ID : {{ this.order.buyer_id }}</p>
          <p id="order-field">Buyer first name : {{ this.buyer.fname }}</p>
          <p id="order-field">Buyer last name : {{ this.buyer.lname }}</p>
          <p id="order-field">Buyer email : {{ this.buyer.email }}</p>
          <hr />
          <p><strong>Other information:</strong></p>
          <p id="order-field">Store ID : {{ this.order.store_id }}</p>
          <p id="order-field">Payment ID : {{ this.order.payment_id }}</p>
          <hr />

          <li>
            <p><strong>Purchased items:</strong></p>

            <div v-for="product in this.products" :key="product._id">
              <!-- {{ product }} -->
              <ul>
                <p>Product: {{ product.name }}</p>
                <p>Price: {{ product.price }} SEK</p>
                <p>Color: {{ product.color }}</p>
                <p>Size: {{ product.size }}</p>
                <p>Category: {{ product.category }}</p>
                <p>Valid discount: {{ product.discount }}%</p>
                <p>Purchased quantity: {{ product.product_quantity }}</p>
              </ul>
              <hr />
            </div>

            <p>
              Total sum: <em> {{ order.total_sum }} SEK</em>
            </p>
            <button
              class="delete-button"
              v-if="this.isAdmin"
              v-on:click="deleteOrder(this.order._id)"
            >
              Delete
            </button>
          </li>

          <!-- <button class="submit-button" v-on:click="">Mark as Delivered</button>
          <button class="submit-button" v-on:click="">Mark as Cancelled</button>
          <button class="submit-button" v-on:click="">Mark as Sent</button> -->
          <div id="confirmation_message" class="confirmation_message">
            {{ confirmation_message }}
          </div>
          <div id="error_message" class="error_message">
            {{ error_message }}
          </div>
          <div id="order_error_message" class="order_error_message">
            {{ order_error_message }}
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
  name: 'orderDetails',
  data() {
    return {
      message: 'none',
      product: {
        name: '',
        price: 0,
        discount: 0,
        category: '',
        color: '',
        size: '',
        quantity: 0,
        description: '',
        image: ''
      },
      order: '',
      confirmation_message: '',
      error_message: '',
      order_error_message: '',
      isLoggedIn: false,
      isAdmin: false,
      products: [],
      orders: [],
      order_id: '',
      tempProduct: '',
      buyer: '',
      productionURL: 'https://webmall.onrender.com/api'
    }
  },
  mounted() {
    this.checkLogin()
    this.orderHistory()
    this.getBuyer()
  },
  methods: {
    calcDiscountedPrice(product) {
      var discountedPrice =
        product.price - (product.discount / 100) * product.price
      return discountedPrice.toFixed(2)
    },
    checkLogin() {
      Api.get(`${this.productionURL}/login-check`)
        .then((response) => {
          this.isLoggedIn = response.data.loggedIn
          this.isAdmin = response.data.isAdmin;
          //console.log(this.isLoggedIn)
        })
        .catch((error) => {
          //console.log('failed to authenticate')
          this.error_message =
            'Not logged in. Please login to be able to add products to you cart.'
        })
    },

    async extractProducts() {
      // this.products = []
      for (let i = 0; i < this.order.products.length; i++) {
        this.tempProduct = this.order.products[i]
        //console.log(this.tempProduct)

        try {
          const response = await Api.get(
            `${this.productionURL}/products/${this.tempProduct.product_id}`
          )
          /* I am getting the product information from the products db, however, the 
                            quantity of the purchased products stays inside the tempProducts array. That 
                            is why I needed to merge the arrays to create a new one that contains all the
                            information I need. :-] */
          if (response.status === 200) {
            const productObject = {
              order_id: this.order._id,
              name: response.data.name,
              price: response.data.price,
              color: response.data.color,
              size: response.data.size,
              category: response.data.category,
              discount: response.data.discount,
              description: response.data.description,
              product_quantity: this.tempProduct.product_quantity
            }
            this.products.push(productObject)
            //console.log(this.products)
          }
        } catch (error) {
          console.log(error.message)
        }
      }
    },
    async orderHistory() {
      try {
        const orderId = this.$route.params.order_id
        Api.get(`${this.productionURL}/orders/order/details/${orderId}`)
          .then(async (response) => {
            if (response.status === 200 || response.status === 304) {
              this.order = response.data
              // console.log('I am order', this.order)
              this.order_id = this.order._id
              await this.extractProducts()
            } else {
              document.getElementById('order_error_message').innerHTML =
                'No orders yet'
              document.getElementById('order_error_message').style.display =
                'block'
            }
          })
          .catch((error) => {
            const result = error.response?.status
            const result_message = error.response?.data.message
            if (result === 404) {
              document.getElementById('order_error_message').style.display =
                'block'
              //   document.getElementById('order_error_message').innerHTML = result_message
            }
          })
      } catch (error) {
        document.getElementById('order_error_message').style.display = 'block'
        // document.getElementById('order_error_message').innerHTML =result_message
      }
    },
    deleteOrder(orderId) {
      Api.delete(`${this.productionURL}orders/${orderId}`)
        .then((response) => {
          this.orders = this.orders.filter((order) => order._id !== orderId)

          this.deletedOrder = response.data
          if (response.status === 200) {
            window.location.replace('/orders')
          }
        })
        .catch((error) => {
          this.error_message = error.message
          document.getElementById('error_message').style.display = 'block'
          document.getElementById('error_message').innerHTML =
            'Could not delete the order, please try again.'
        })
    },
    getBuyer() {
      document.getElementById('error_message').style.display = 'none'
      //var buyerId = this.$route.params.buyer_id;
      Api.get(`${this.productionURL}/profile`)
        .then((response) => {
          this.buyer = response.data
        })
        .catch((error) => {
          document.getElementById('error_message').style.display = 'block'
          document.getElementById('error_message').innerHTML =
            'Buyer profile not found'
        })
    }
  }
}
</script>

<style src="../css/style.css"></style>
