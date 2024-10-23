<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

  <div>
    <b-container fluid>

      <div class="store-page-banner">

        <div class="search-container">
        <form action="" >
          <input type="text" placeholder="Search for Store" name="search">
          <button type="submit"><i class="fa fa-search"></i></button>
        </form>
      </div>
      </div>


      <div class="store-cards-container">

        <li v-for="store in stores" :key = "store._id">
          <div id="store-card">

          <div id="store-photo-card">
            <router-link to="/store">
              <img id="store-image"
                   :src="`http://localhost:3000/public/store_images/${store.logo_img}`"
                   alt="Store image"/></router-link>
          </div>

            <div class="store-name-container">
              <h3 id="store-name">{{ store.store_name }}</h3>
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
  name: 'stores',
  data() {
    return {
      message: 'none',
      store_name: '',
      store_category: '',
      stores: [],
    }
  },
  mounted() {
    this.getStores();
  },
  methods: {
    getStores() {
      Api.get('/stores')
        .then(response => {

          this.stores = response.data;

        })
        .catch(error => {
          this.message = error;
        })
    },
  }
}
</script>

<style src="../css/style.css"></style>
