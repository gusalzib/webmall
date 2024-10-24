<template>
  <div id="app">

    <div class="nav">
      <div class="menu-icon"><img src="../public/menu-bar.png" @click="toggleMenu()"></div>
      <img id="logo" src="../public/logo2.png">
      <div class="header-links">
        <router-link class="nav-links" to="/">Home</router-link>
        <router-link class="nav-links" to="/payment">Payment</router-link>

        <div class="dropdown" v-if="this.isAdmin || this.isSeller">
          <button class="dropbtn">Products</button>
          <div class="dropdown-content">
            <router-link class="nav-links" to="/products">Products display</router-link>
            <router-link class="nav-links" to="/addProduct" v-if="this.isAdmin  || this.isSeller">Add product</router-link>
            <router-link class="nav-links" to="/inventoryManager" v-if="this.isAdmin">Inventory Manager</router-link>
          </div>
        </div>

        <router-link class="nav-links" to="/products" v-if="!this.isAdmin && !this.isSeller">Products</router-link>
        <!-- <router-link class="nav-links" to="/addProduct" v-if="this.isAdmin">Add product</router-link>
        <router-link class="nav-links" to="/inventoryManager" v-if="this.isAdmin">Inventory Manager</router-link> -->

        <div class="dropdown" v-if="this.isAdmin">
          <button class="dropbtn">Stores</button>
          <div class="dropdown-content">
            <router-link class="nav-links" to="/add-new-store" v-if="this.isAdmin">Add Store</router-link>
            <router-link class="nav-links" to="/stores">Stores display</router-link>
          </div>
        </div>

        <!-- <router-link class="nav-links" to="/add-new-store" v-if="this.isAdmin">Add Store</router-link> -->
        <router-link class="nav-links" to="/stores" v-if="!this.isAdmin">Stores</router-link>
        <router-link class="nav-links" to="/buyers" v-if="this.isAdmin">Buyers</router-link>
        <router-link class="nav-links" to="/orders" v-if="this.isAdmin">Order</router-link>
        <router-link class="nav-links" to="/buyers/profile"  v-if="this.isLoggedIn && !this.isSeller">Profile</router-link>
        <router-link class="nav-links" to="/login" v-if="!this.isLoggedIn">Login</router-link>
        <router-link class="nav-links" to="/" @click="logout()"  v-if="this.isLoggedIn">Logout</router-link>
        <router-link class="nav-links" to="/signup" v-if="!this.isLoggedIn">Sign up</router-link>

      </div>

        <router-link class="nav-links-cart" to="/carts">
          <img id="cart-icon" src="../public/shopping-cart.png"> 
          <i v-if="numberOfProducts >0" class="cart-icon-number"  :value="numberOfProducts" ></i>
        </router-link>


    </div>
    <div id="nav-mobile-view" class="toggled" >
      <router-link class="nav-links-mobile-view top-link" to="/">Home</router-link>
      <router-link class="nav-links-mobile-view" to="/products">Products</router-link>
      <router-link class="nav-links-mobile-view" to="/addProduct" v-if="this.isAdmin">Add product</router-link>
      <router-link class="nav-links-mobile-view" to="/inventoryManager" v-if="this.isAdmin">Inventory Manager</router-link>
      <router-link class="nav-links-mobile-view" to="/add-new-store" v-if="this.isAdmin">Add store</router-link>
      <router-link class="nav-links-mobile-view" to="/stores">Stores</router-link>
      <router-link class="nav-links-mobile-view" to="/buyers" v-if="this.isAdmin">Buyers</router-link>
      <router-link class="nav-links-mobile-view" to="/orders" v-if="this.isAdmin">Order</router-link>
      <router-link class="nav-links-mobile-view" to="/buyers/profile" v-if="this.isLoggedIn && !this.isSeller">profile</router-link>
      <router-link class="nav-links-mobile-view" to="/login" v-if="!this.isLoggedIn">Login</router-link>
      <router-link class="nav-links-mobile-view" to="/" @click="logout()" v-if="this.isLoggedIn">Logout</router-link>
      <router-link class="nav-links-mobile-view" to="/signup" v-if="!this.isLoggedIn">Sign up</router-link>
      <!-- <router-link class="nav-links-cart" to="/carts"><a href="/cart" > <img id="cart-icon" src="../public/shopping-cart.png"> </a></router-link> -->
    </div>

    <main>
      <!-- Render the content of the current page view -->
      <!-- <a href="https://www.flaticon.com/free-icons/shopping-cart" title="shopping cart icons">Shopping cart icons created by Freepik - Flaticon</a> -->
      <router-view/>
    </main>




    <!-- Remove the container if you want to extend the Footer to full width. -->
<div class="my-5">
  <!-- Footer -->
  <footer
          class="text-center text-lg-start text-white"
          style="background-color: #828a95"
          >
    <!-- Grid container -->
    <div class="container p-4 pb-0">
      <!-- Section: Links -->
      <section class="">
        <!--Grid row-->
        <div class="row">
          <!-- Grid column -->
          <div class="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h6 class="text-uppercase mb-4 font-weight-bold">
              Webmall AB
            </h6>
            <p>
              Welcome to you webmall. You can find all of your needs here. One place, countless stores.
            </p>
          </div>
          <!-- Grid column -->

          <hr class="w-100 clearfix d-md-none" />

          <!-- Grid column -->
          <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h6 class="text-uppercase mb-4 font-weight-bold">Products</h6>
            <p>
              <a class="text-white" >Clothes</a>
            </p>
            <p>
              <a class="text-white">Electronics</a>
            </p>
            <p>
              <a class="text-white">Art</a>
            </p>
            <p>
              <a class="text-white">Sales</a>
            </p>
          </div>
          <!-- Grid column -->

          <hr class="w-100 clearfix d-md-none" />

          <!-- Grid column -->
          <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h6 class="text-uppercase mb-4 font-weight-bold">
              Useful links
            </h6>
            <p>
              <a class="text-white">Your Account</a>
            </p>
            <p>
              <a class="text-white">Profile</a>
            </p>
            <p>
              <a class="text-white">Edit you personal data</a>
            </p>
            <p>
              <a class="text-white">Help</a>
            </p>
          </div>

          <!-- Grid column -->
          <hr class="w-100 clearfix d-md-none" />

          <!-- Grid column -->
          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h6 class="text-uppercase mb-4 font-weight-bold">Contact</h6>
            <p><i class="fas fa-home mr-3"></i> Gothenburg, Sweden</p>
            <p><i class="fas fa-envelope mr-3"></i> webmall@gmail.com</p>
            <p><i class="fas fa-phone mr-3"></i> + 01 234 567 88</p>
            <p><i class="fas fa-print mr-3"></i> + 01 234 567 89</p>
          </div>
          <!-- Grid column -->
        </div>
        <!--Grid row-->
      </section>
      <!-- Section: Links -->

      <hr class="my-3">

      <!-- Section: Copyright -->
      <section class="p-3 pt-0">
        <div class="row d-flex align-items-center">
          <!-- Grid column -->
          <div class="col-md-7 col-lg-8 text-center text-md-start">
            <!-- Copyright -->
            <div class="p-3">
              © 2024 Copyright:
              <a class="text-white" href="https://mdbootstrap.com/"
                 >MDBootstrap.com</a
                >
            </div>
            <!-- Copyright -->
          </div>
          <!-- Grid column -->

          <!-- Grid column -->
          <div class="col-md-5 col-lg-4 ml-lg-0 text-center text-md-end">
            <!-- Facebook -->
            <a
               class="btn btn-outline-light btn-floating m-1"

               role="button"
               ><i class="fab fa-facebook-f"></i
              ></a>

            <!-- Twitter -->
            <a
               class="btn btn-outline-light btn-floating m-1"

               role="button"
               ><i class="fab fa-twitter"></i
              ></a>

            <!-- Google -->
            <a
               class="btn btn-outline-light btn-floating m-1"

               role="button"
               ><i class="fab fa-google"></i
              ></a>

            <!-- Instagram -->
            <a
               class="btn btn-outline-light btn-floating m-1"

               role="button"
               ><i class="fab fa-instagram"></i
              ></a>
          </div>
          <!-- Grid column -->
        </div>
      </section>
      <!-- Section: Copyright -->
    </div>
    <!-- Grid container -->
  </footer>
  <!-- Footer -->
</div>
<!-- End of .container -->
  </div>
</template>
<script>
import { Api } from '@/Api'
import Stores from '@/views/Stores.vue'
import CartsVue from './views/Carts.vue';
import SingleProduct from './views/SingleProduct.vue';

export default {
  components: { Stores, CartsVue, SingleProduct },
  data: () => ({
      isLoggedIn: false,
      isAdmin: false,
      isSeller: false,
      cartProducts: [],
      numberOfProducts: 0,
      newNumberOfProducts: 0,
    isCheckingCart: false,
      productionURL: 'https://webmall.onrender.com/api'
  }),

  mounted() {
    this.checkLogin();

    this.emitter.on("requestCurrentNumber", () => {
        if(!this.isCheckingCart){
          this.checkCart();
        }
    })

    this.emitter.on("updateNumber",(data) =>{
      this.numberOfProducts = data.msg;
    })

  },

  methods: {
    
    toggleMenu() {
        var menu = document.getElementById('nav-mobile-view');
      if (menu.style.display === 'flex') {
          menu.classList.add('toggled');
        menu.style.display = 'none';

        } else {
          menu.classList.remove('toggled');
        menu.style.display = 'flex';

        }
    },
    checkLogin() {
      try {
        Api.get(`${this.productionURL}/login-check`).then(response => {
          this.isLoggedIn = response.data.loggedIn;
          this.isAdmin = response.data.isAdmin;
          this.isSeller = response.data.isSeller;
          console.log('Is authenticated: ', this.isLoggedIn)
          console.log('Is admin: ', this.isAdmin)
          console.log('Is seller: ', this.isSeller)
          if(this.isLoggedIn && !this.isSeller){
          this.checkCart (); 
          }
        })
      } catch (error) {
        // console.log(error.message)
        console.log('User type has not cart')

      }
    },
    sendEvent(updatedNumber){
      this.emitter.emit("updateNumber",{msg: updatedNumber})
    },
    cartSendEvent(updatedCartNumber){
      this.emitter.emit("updateCartNumber",{msg: updatedCartNumber})
    },

    checkCart (){
      try{
        this.isCheckingCart = true;
        this.numberOfProducts = 0;
        this.cartProducts = [];
        Api.get(`${this.productionURL}/carts/get/cart`,{withCredentials:true}).then(response =>{
          this.cart = response.data.cart;
          this.cartProducts = this.cart.products;

          for (let i = 0; i <= this.cartProducts.length-1; i++){
          this.numberOfProducts += this.cartProducts[i].product_quantity;
          }

          this.sendEvent(this.numberOfProducts);
          this.cartSendEvent(this.numberOfProducts);
          this.isCheckingCart = false;

        })
      }catch (error) {
        console.log(error.message);
        this.isCheckingCart = false;
      }
    },
    logout() {
      try {
        Api.get(`${this.productionURL}/logout`).then(response => {
          this.isLoggedIn = response.data.loggedIn;
          this.isAdmin = response.data.isAdmin;
          this.numberOfProducts = 0;
          console.log('Is authenticated: ', this.isLoggedIn)
          clearInterval();
        })
      } catch (error) {
        console.log(error.message)
      }
    },
    

  },


}

</script>
<style src="@/css/style.css"></style>

