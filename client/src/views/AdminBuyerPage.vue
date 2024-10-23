<template>
  <div>
    <b-container fluid>
      <!-- <b-button class="btn_message" variant="primary" v-on:click="getBuyer()">Get buyer</b-button> -->
      <!-- <p class="dsd" style="z-index: 100; color: red; height: 50px;">This is an error message:  {{ message }}</p> -->

      <div class="single-buyer-container">
            <div class="single-buyer-sidebar">
                <div id="single-buyer-sidebar-menu">
                    <h3>Control Panel</h3>
                    <a id="sidebar-links" @click.native="setActive('my_profile')">My profile</a>
                    <a id="sidebar-links" @click.native="setActive('edit_profile')">Edit profile</a>
                    <a id="sidebar-links" @click.native="setActive('order_history')" @click="orderHistory()">Order history</a>
                    <a id="sidebar-links" @click.native="setActive('payment_method')">Payment method</a>
                </div>
            </div>

            <div id="single-buyer-card">
                <div id="edit-profile" v-if="activeSection === 'edit_profile'">
                    <h3>Edit Profile</h3>
                    
                        <label>First name: </label>
                        <input v-model="buyer.fname" type="text" id="fname"/>
                        </br>
                        <label>Last name: </label>
                        <input v-model="buyer.lname" type="text" id="lname"/>
                        </br>
                        <label>Middle name: </label>
                        <input v-model="buyer.minit" type="text" id="minit"/>
                        </br>
                        <label>Phone number: </label>
                        <input v-model="buyer.phone_number" type="text" id="phone_number"/>
                        </br>
                        <label>Email: </label>
                        <input v-model="buyer.email" type="email" id="email"/>
                        </br>
                        <label>Street: </label>
                        <input v-model="buyer.street" type="text" id="street"/>
                        </br>
                        <label>Zipcode: </label>
                        <input v-model="buyer.zipcode" type="text" id="zipcode"/>
                        </br>
                        <label>City: </label>
                        <input v-model="buyer.city" type="text" id="city"/>
                        </br>
                        <button id="update-button" class="submit-button" v-on:click="updateBuyer()" type="button">Update</button>
                </div>

                <div v-else-if="activeSection === 'order_history'">
                    <h3>Order History</h3>
                    <div id="order_error_message" class="order_error_message">{{ order_error_message }}</div>

                    <li v-for="order in orders" :key = "order._id">
                        <hr>
                        <p>Order ID: {{ order._id }}</p>
                        <p>Store ID: {{ order.store_id }}</p>
                        <p>Order date: {{ order.order_date }}</p>
                        <p>Order number: {{ order.order_number }}</p>
                        <p>Payment ID: {{ order.payment_id }}</p>
                        <p>Status: {{ order.status }}</p>
                        <p><strong>Purchased items:</strong></p>
                    
                        <div v-for="product in products.filter(p => p.order_id === order._id)" :key="product.name">
                            <ul>
                                <p>Product: {{ product.name }}</p>
                                <p>Price: {{ product.price }} SEK</p>
                                <p>Color: {{ product.color }}</p>
                                <p>Size: {{ product.size }}</p>
                                <p>Category: {{ product.category }}</p>
                                <p>Valid discount: {{ product.discount }}%</p>
                                <p>Purchased quantity: {{ product.product_quantity }}</p>
                            </ul>
                            <hr>
                        </div>
                        
                        <p>Total sum: <em> {{ order.total_sum }} SEK</em></p>
                        <button class="delete-button" v-on:click="deleteOrder(order._id)">Delete</button>
                    </li>

                </div>
                <div v-else-if="activeSection === 'payment_method'">
                    <h3>Change Payment Method</h3>
                </div>
                <div v-else>
                    <h3 id="single-buyer-detail">{{ buyer.fname }} {{ buyer.lname }}</h3>
                    <hr>
                    <p >Phone: {{ buyer.phone_number }} </p>
                    <p >E-mail:  {{ buyer.email }}</p>
                    <p >Street:  {{ buyer.street }}</p>
                    <p >Zipcode:  {{ buyer.zipcode }}</p>
                    <p >City:  {{ buyer.city }}</p>
                </div>
                <div id="confirmation_message" class="confirmation_message">{{ confirmation_message }}</div>
                  <div id="error_message" class="error_message">{{ error_message }}</div>
            </div>
      </div>

    </b-container>

    
  </div>
</template>

<script>

// @ is an alias to /src
import { Api } from '@/Api';


export default {
  name: 'adminBuyerPage',
  data() {
      return {
        activeSection: 'my_profile',
        message: 'none',
          buyer: {
              fname: '',
              lname: '',
              minit: '',
              phone_number: '',
              email: '',
              street: '',
              zipcode: '',
              city: '',
          },
          orders: [],
          products: [],
          tempProducts: [],
          error_message: '',
          confirmation_message: '',
          order_error_message: '',
          deletedOrder: '',
          stores: [],
          order_id: '',
      productionURL: 'https://webmall.onrender.com/api'
        
    }
    },
    mounted() {
        this.getBuyer();
        // this.orderHistory(); //doesn't need to load orders with the page. It loads onClick
  },
    methods: {
        getBuyer() {
            document.getElementById("error_message").style.display = "none";
            var buyerId = this.$route.params.buyer_id;
            Api.get(`${this.productionURL}/buyers/${buyerId}`)
                .then(response => {
                    this.buyer = response.data;
                })
                .catch(error => {
                    document.getElementById("error_message").style.display = "block";
                    document.getElementById("error_message").innerHTML = "Buyer profile not found";
        })
        }, 
        setActive(section) {
            try {
                this.activeSection = section;
            } catch (error) {
                this.error_message = error.message;
                console.log(this.message);
            }
            
    },
        async updateBuyer() {
            
            
            try {
                const buyerId = this.$route.params.buyer_id;
                // console.log('Buyer Id ' + buyerId);
                var response = await Api.put(`${this.productionURL}/buyers/admin/update/buyer/${buyerId}`, this.buyer);
                
                if (response.status === 200) {
                    document.getElementById("error_message").style.display = "none";
                    document.getElementById("confirmation_message").innerHTML = "Updated successfully";
                    document.getElementById("confirmation_message").style.display = "block";
                }
                // console.log('updated' + response.data);
            } catch (error) {
                const result = error.response?.status;
                const result_message = error.response?.data.message
                if (result === 400) {
                    document.getElementById("error_message").style.display = "block";
                    document.getElementById("error_message").innerHTML = result_message;
                }
            }
            
        },
        async extractProducts() {
            this.products = []
            for (let i = 0; i < this.orders.length; i++){
                const order = this.orders[i]

                for (let j = 0; j < order.products.length; j++){

                    const tempProduct = order.products[j];

                    try {
                        const response = await Api.get(`${this.productionURL}/products/${tempProduct.product_id}`)
                        /* I am getting the product information from the products db, however, the 
                            quantity of the purchased products stays inside the tempProducts array. That 
                            is why I needed to merge the arrays to create a new one that contains all the
                            information I need. :-] */
                        if (response.status === 200) {
                            const productObject = {
                                order_id: order._id,
                                name: response.data.name,
                                price: response.data.price,
                                color: response.data.color,
                                size: response.data.size,
                                category: response.data.category,
                                discount: response.data.discount,
                                description: response.data.description,
                                product_quantity: tempProduct.product_quantity
                            }
                            this.products.push(productObject);
                            //console.log(this.products)
                        }
                    } catch (error) {
                        console.log(error.message)
                    }
                }
            }
        },
        async orderHistory() {
        
            try {
                const buyerId = this.$route.params.buyer_id;
                //console.log(buyerId);
                Api.get(`${this.productionURL}/buyers/${buyerId}/orders/admin/orderhistory`).then(async response => {

                    if (response.status === 200 || response.status === 304) {
                        
                        this.orders = response.data;
                        this.order_id = this.orders._id
                        
                        await this.extractProducts();

                         
                    } else {
                        document.getElementById("order_error_message").innerHTML = "No orders yet";
                        document.getElementById("order_error_message").style.display = "block";
                        
                    }
                })
                .catch(error => {
                const result = error.response?.status;
                const result_message = error.response?.data.message
                if (result === 404) {
                    document.getElementById("order_error_message").style.display = "block";
                    document.getElementById("order_error_message").innerHTML = result_message;
                }
                    
                });
                
            } catch (error) {
                document.getElementById("order_error_message").style.display = "block";
                document.getElementById("order_error_message").innerHTML = result_message;
            }
        },
        deleteOrder(orderId) {
            Api.delete(`${this.productionURL}orders/${orderId}`).then(response => {
                this.orders = this.orders.filter(order => order._id !== orderId)
                
                this.deletedOrder = response.data;
            }).catch(error => {
                this.error_message = error.message;
            })
        }, 
        getStoreInfo() {
            
            try {
                Api.get(`${this.productionURL}/orders/${order_id}/stores`).then(response => {

                    if (response.status === 200) {

                        this.stores = response.data;
                         
                    } else {
                        document.getElementById("error_message").innerHTML = "No stores found";
                        document.getElementById("error_message").style.display = "block";
                        
                    }
                })
                .catch(error => {
                        document.getElementById("error_message").innerHTML = "No stores found";
                        document.getElementById("error_message").style.display = "block";
                    
                });
                
            } catch (error) {
                this.error_message = error.message;
            }
        }
  }
}
</script>

<style src="../css/style.css"></style>