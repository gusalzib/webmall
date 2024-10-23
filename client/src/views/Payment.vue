
<template>


<div class="payment-container">
<div class="container d-flex justify-content-center mt-5 mb-5">

            

            <div class="row g-3">

              <div class="col-md-6">  
                
                <span>Payment Method</span>
                <div class="card">

                  <div class="accordion" id="accordionExample">
                    
                    <!-- <div class="card">
                      <div class="card-header p-0" id="headingTwo">
                        <h2 class="mb-0">
                          <button class="btn btn-light btn-block text-left collapsed p-3 rounded-0 border-bottom-custom" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            <div class="d-flex align-items-center justify-content-between">

                              <span>Paypal</span>
                              <img src="https://i.imgur.com/7kQEsHU.png" width="30">
                              
                            </div>
                          </button>
                        </h2>
                      </div>
                      <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                        <div class="card-body">
                          <input type="text" class="form-control" placeholder="Paypal email">
                        </div>
                      </div>
                    </div> -->

                    <div class="card">
                      <div class="card-header p-0">
                        <h2 class="mb-0">
                          <button class="btn btn-light btn-block text-left p-3 rounded-0" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            <div class="d-flex align-items-center justify-content-between">

                              <span>Credit card</span>
                              <div class="icons">
                                <img src="https://i.imgur.com/2ISgYja.png" width="30">
                                <img src="https://i.imgur.com/W1vtnOV.png" width="30">
                                <img src="https://i.imgur.com/35tC99g.png" width="30">
                                <img src="https://i.imgur.com/2ISgYja.png" width="30">
                              </div>
                              
                            </div>
                          </button>
                        </h2>
                      </div>

                      <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                        <div class="card-body payment-card-body">
                          
                          <span class="font-weight-normal card-text">Card Number</span>
                          <div class="input">

                            <i class="fa fa-credit-card"></i>
                            <input type="text" class="form-control"  v-model="this.creditCard" placeholder="0000 0000 0000 0000">
                            
                          </div> 

                          <div class="row mt-3 mb-3">

                            <div class="col-md-6">

                              <span class="font-weight-normal card-text">Expiry Date</span>
                              <div class="input">

                                <i class="fa fa-calendar"></i>
                                <input type="text" class="form-control" v-model="this.date" placeholder="MM/YY">
                                
                              </div> 
                              
                            </div>


                            <div class="col-md-6">

                              <span class="font-weight-normal card-text">CVC/CVV</span>
                              <div class="input">

                                <i class="fa fa-lock"></i>
                                <input type="text" class="form-control"  v-model="this.cvc" placeholder="000">
                                
                              </div> 
                              
                            </div>
                            

                          </div>

                          <span class="text-muted certificate-text"><i class="fa fa-lock"></i> Your transaction is secured with ssl certificate</span>
                         
                        </div>
                      </div>
                    </div>
                    
                  </div>
                  
                </div>

              </div>

              <div class="col-md-6">
                  <span>Summary</span>

                  <div class="card">

                    <div class="d-flex justify-content-between p-3">

                      <div class="d-flex flex-column">

                        <span>TOTAL </span>
                        <!-- <a href="#" class="billing">Save 20% with annual billing</a> -->
                        <!-- <i class="fa fa-caret-down"></i> -->
                      </div>

                      <div class="mt-1">
                        <sup class="super-price">{{ this.cart_total_sum }} SEK</sup>
                        <!-- <span class="super-month">/Month</span> -->
                      </div>
                      
                    </div>

                    <hr class="mt-0 line">

                    <div class="p-3">

                      <div class="d-flex justify-content-between mb-2">

                        <span>Number of Items</span>
                        <span>{{ this.numberOfProducts }}</span>
                        
                      </div>

                      <div class="d-flex justify-content-between">

                        <!-- <span>Vat <i class="fa fa-clock-o"></i></span>
                        <span>-20%</span> -->
                        
                      </div>
                      

                    </div>

                    <hr class="mt-0 line">


                    <div class="p-3 d-flex justify-content-between">

                      <div class="d-flex flex-column">

                        <span>Today you pay(Swedish krona)</span>
                        <small></small>
                        
                      </div>
                      <span>{{this.cart_total_sum}}</span>

                      

                    </div>


                    <div class="p-3">

                    <button class="btn btn-primary btn-block free-button" v-on:click="confirmPayment()">Complete Payment</button> 
                   <div class="text-center">
                     <a href="#">Refund Policy</a>
                   </div>
                      
                    </div>



                    
                  </div>
              </div>
              
            </div>
            

          </div>
</div>
    


    <div id="checkout">
      <!-- Checkout will insert the payment form here -->
    </div>
    <div id="payment-container">
      <!-- Checkout will insert the payment form here -->
    </div>

  <div id="confirmation_message" class="confirmation_message">{{ confirmation_message }}</div>
    <div id="error_message" class="error_message">{{ error_message }}</div>

</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'


export default {
  name: 'payment',
  data() {
    return {
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
              password: ''
        },
        creditCard: '',
        date: '',
        cvc: '',
        total_sum: 99,
        confirmation_message : "",
        error_message: '',
        cartProducts : [],
        productID :[],
        products : [],
        productAndQuantity: [],
        cart_id: null,
        cart_total_sum : 0,
        numberOfProducts: 0,
      cart: null,
      paymentID: '',
        orderID: '',
      productionURL: 'https://webmall.onrender.com/api'
    }
  },
  mounted() {
    this.getCartById();
  },
  methods: {
      
      triggerConfetti() {
        const defaults = {
            spread: 360,
            ticks: 50,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            shapes: ["star"],
            colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
            };

        confetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,
            shapes: ["star"],
        });

        confetti({
            ...defaults,
            particleCount: 10,
            scalar: 0.75,
            shapes: ["circle"],
        });
        setTimeout(shoot, 0);
        setTimeout(shoot, 100);
        setTimeout(shoot, 200);
    },
    async redirection() {
        const session = await fetch(`/session_status?session_id=${session_id}`)
          if (session.status == 'open') {
            // Remount embedded Checkout
          } else if (session.status == 'complete') {
            // Show success page
            // Optionally use session.payment_status or session.customer_email
            // to customize the success page
          }
    },
              getCartById() {
            this.cartProducts = [];
            this.productID = [];
            this.products = [];
            this.productAndQuantity = [];

                Api.get(`${this.productionURL}/carts/get/cart`,{withCredentials:true})
                    .then(response => {
                        
                        this.cart = response.data.cart;
                        this.cartProducts = this.cart.products;
                        this.cart_id = this.cart._id;
                        this.cart_total_sum = this.cart.total_sum;
                        
                        for (let i = 0; i <= this.cartProducts.length-1; i++){
                            this.productID[i] = this.cartProducts[i].product_id;
                            this.numberOfProducts = this.numberOfProducts + this.cartProducts[i].product_quantity;
                            
                            const newProduct = {
                                cartProduct_id : this.cartProducts[i].product_id,
                                product_quantity: this.cartProducts[i].product_quantity
                            }
                            this.productAndQuantity.push(newProduct);
                        }
                        this.getProductsInfo();
                    })
                    .catch(error => {
                        this.message = error.message;
            })
        },
        async getProductsInfo() {
            for (let i = 0; i<= this.cartProducts.length-1; i++){
                await Api.get(`${this.productionURL}/products/${this.productID[i]}`).then(response => {
                    if (response.status === 200) {
                        this.products[i] = response.data;
                    } else {
                        this.message = error.message;
                    }
                })
            }
    },
        placeAnOrder() {
            var buyerId = this.cart.buyer_id;
            Api.post(`${this.productionURL}/orders/${buyerId}/payment/${this.paymentID}`).then(response => {
              if (response.status === 200) {
                this.orderID = response.data._id;
                Api.put(`${this.productionURL}/carts/empty/cart/${this.cart_id}`).then(response => {
                      window.location.replace(`${this.productionURL}/orders/order/details/${this.orderID}`)
                }).catch(error => {
                    document.getElementById('error_message').style.display = "block"
                    document.getElementById('error_message').innerHTML = error.message
                    })
                    
                    
                } else {
                    document.getElementById('error_message').style.display = "block"
                document.getElementById('error_message').innerHTML = error.message
                        setTimeout(() => {
                            const htmlElement = document.getElementById("error_message");
                            htmlElement.style.display = 'none';
                        }, 3000);
                }
            })
            

        },
    async confirmPayment() {
      try {
        const response = await Api.post(`${this.productionURL}/orders/gateway/create/payment/confirmation`)
        if (response.status === 200) {
          this.paymentID = response.data._id;

          this.placeAnOrder()
              
                  document.getElementById("confirmation_message").style.display = "block";
          document.getElementById("confirmation_message").innerHTML = "Payment Successful";
                  
                        setTimeout(() => {
                            const htmlElement = document.getElementById("confirmation_message");
                            htmlElement.style.display = 'none';
                        }, 3000);
            } else {
                  document.getElementById("error_message").style.display = "block";
                  document.getElementById("error_message").innerHTML = "Payment failed. Please try again or contact customer service.";
            }
      } catch (error) {
        if (error.response?.status === 400) {
              document.getElementById("error_message").style.display = "block";
              document.getElementById("error_message").innerHTML = "Payment failed. Please try again or contact customer service.";
        }

          }
        }
    
  }
}
</script>

<style src="../css/style.css"></style>
