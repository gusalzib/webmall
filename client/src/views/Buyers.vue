<template>
  <div>
    <b-container fluid>
      <!-- <b-button class="btn_message" variant="primary" v-on:click="getBuyer()">Get buyer</b-button> -->
      <!-- <p class="dsd">This is an error message:  {{ message }}</p> -->

      <div class="buyer-container">
        <li v-for="buyer in buyers" :key = "buyer._id">
          <router-link id="single-buyer-link"  :to="`/buyers/${buyer._id}`">
              <div id="buyer-card">
                  <h3 id="buyer-detail">{{ buyer.fname }} {{ buyer.lname }}</h3>
                  <hr>
                  <p >Phone: {{ buyer.phone_number }} </p>
                  <p >E-mail:  {{ buyer.email }}</p>
                  <p >Street:  {{ buyer.street }}</p>
                  <p >Zipcode:  {{ buyer.zipcode }}</p>
                  <p >City:  {{ buyer.city }}</p>

              </div>
            </router-link>
        </li>
      </div>

    </b-container>

    
  </div>
</template>


<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'buyers',
  data() {
    return {
        message: 'none',
        buyers: 'no registered buyer found',
      productionURL: 'https://webmall.onrender.com/api'
        
    }
  },
  mounted() {
        this.getBuyer();
  },
    methods: {
        getBuyer() {
            Api.get(`${this.productionURL}/buyers`)
                .then(response => {
                    
                    this.buyers = response.data;

                })
                .catch(error => {
                    this.message = error;
        })
    }
  }
}
</script>

<style src="../css/style.css"></style>