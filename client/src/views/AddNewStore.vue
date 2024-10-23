<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <div>
    <b-container fluid>
      <div class="add-store-container">
        
        <form id="add-store-form" enctype='multipart/form-data'>
          <h3>Add new store</h3>

          <div class="addStore-form-group">
            <label>Store name: </label>
            <input type="text" v-model="store.store_name" id="store_name" required/>
          </div>

          <div class="addStore-form-group">
            <label>Store Location: </label>
            <input type="text" v-model="store.location" id="location" required/>
          </div>

          <div class="addStore-form-group">
            <label>Store Organisation Number: </label>
            <input type="number" v-model="store.org_number" id="org_number" required/>
          </div>

          <div class="addStore-form-group">
            <label>Store Description: </label>
            <input type="text" v-model="store.description" id="-description" required/>
          </div>

          <div class="addStore-form-group">
            <label>Store Products: </label>
            <input type="text" v-model="store.products" id="products"/>
          </div>

          <div class="addStore-form-group">
            <label>Store Sellers: </label>
            <input type="text" v-model="store.sellers" id="sellers"/>
          </div>

<!--          <div class="addStore-form-group">-->
<!--            <label>Store Banner: </label>-->
<!--            <input  type="file" v-on:change="onFileSelected" id="banner_img"/>-->
<!--          </div>-->

          <div class="addStore-form-group">
            <label>Store Logo: </label>
            <input  type="file" v-on:change="onFileSelected" id="logo_img"/>
          </div>

          <button id="update-button" class="submit-button addStore-button" v-on:click="createStore()" type="button">Add</button>
        </form>
		    <div id="confirmation_message" class="confirmation_message">{{ confirmation_message }}</div>
        <div id="error_message" class="error_message">{{ error_message }}</div>
      </div>

    </b-container>


  </div>
</template>

<script>
import { Api } from '@/Api'
import  axios  from 'axios';

export default {
  name: 'add-new-store',
  data() {
    return {
      message: 'none',
      store: {
        store_name: '',
        location: '',
        org_number: 0,
        description: '',
        products: '',
        sellers: '',
        // banner_img: '',
        logo_img: ''
      },
      confirmation_message: '',
      error_message:'',
      selectedFile: null,
      productionURL: 'https://webmall.onrender.com/api'
    }
  },
  mounted() {
  },
  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0]
    },
    async createStore() {
      const formData = new FormData()
      formData.append('store_name', this.store.store_name);
     
      formData.append('location', this.store.location);
   
      formData.append('org_number', Number(this.store.org_number));
     
      formData.append('description', this.store.description);
      
      formData.append('products', this.store.products);
   
      formData.append('sellers', this.store.sellers);
  
      formData.append('logo_img', this.selectedFile);
      try {

        const res = await axios.post(`${this.productionURL}/stores`, formData, {
          Headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (res.status === 200) {
          document.getElementById("add-store-form").reset();
          document.getElementById("error_message").style.display = "none";
          document.getElementById("confirmation_message").innerHTML = "Store was added successfully!";
          document.getElementById("confirmation_message").style.display = "block";
        } else {
          document.getElementById("confirmation_message").style.display = "none";
          document.getElementById("error_message").innerHTML = "Store could not be added, please try again!";
          document.getElementById("error_message").style.display = "block";
        }
      } catch (error) {
        const backendMessage = error.response?.data.message;
        const requestStatus = error.response?.status;

        document.getElementById("confirmation_message").style.display = "none";
        document.getElementById("error_message").innerHTML = backendMessage;
        document.getElementById("error_message").style.display = "block";
      }
    }
  }

}
</script>

<style src="../css/style.css"></style>
