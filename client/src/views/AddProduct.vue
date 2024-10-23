<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <div>
    <b-container fluid>
      <!-- <b-button class="btn_message" variant="primary" v-on:click="getProducts()">Get products</b-button> -->
      <div class="addProduct-container">
        <!-- <p id="error_message">{{ message }}</p> -->
        <form id="addProduct" enctype='multipart/form-data'>
          <h3>Add new product</h3>

          <label>Product name: </label>
          <input v-model="product.name" type="text" id="name" required/>
          </br>
          <label>Product category: </label>
          <input v-model="product.category" type="text" id="category" required/>
          </br>
          <label>Product price: </label>
          <input v-model="product.price" type="number" id="price" required/>
          </br>
          <label>Product discount: </label>
          <input v-model="product.discount" type="number" id="discount" required/>
          </br>
          <label>Product size: </label>
          <input v-model="product.size" type="text" id="size" required/>
          </br>
          <label>Product color: </label>
          <input v-model="product.color" type="text" id="color" required/>
          </br>
          <label>Product quantity: </label>
          <input v-model="product.quantity" type="number" id="quantity" required/>
          </br>
          <label>Product description: </label>
          <input v-model="product.description" type="text" id="description" required/>
          </br>
          <label>Product image: </label>
          <input  type="file" v-on:change="onFileSelected" id="image" required/>
          <button id="update-button" class="submit-button addProduct-button" v-on:click="createProduct()" type="button">Add</button>
        </form>
      </div>
                <div id="confirmation_message" class="confirmation_message">{{ confirmation_message }}</div>
                <div id="error_message" class="error_message">{{ error_message }}</div>
    </b-container>


  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'
import  axios  from 'axios';

export default {
  name: 'addProduct',
  data() {
    return {
      message: 'none',
      confirmation_message: '',
      error_message:'',
      product: {
        name: '',
        category: '',
        price: 0,
        discount: 0,
        size: '',
        color: '',
        quantity: 0,
        description: '',
        image: ''
      },
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
    async createProduct() {
      //Casting certain fields to number because apparently the v-model tag forces the value to be string.
      var formData = new FormData();
      formData.append('name', this.product.name);
      formData.append('category', this.product.category);
      formData.append('price', Number(this.product.price));
      formData.append('discount', Number(this.product.discount));
      formData.append('size', this.product.size);
      formData.append('color', this.product.color);
      formData.append('quantity', Number(this.product.quantity));
      formData.append('description', this.product.description);
      formData.append('image', this.selectedFile);
      try {
        const res = await axios.post(`${this.productionURL}/add/product`, formData, {
          Headers: {
            'Content-Type': 'multipart/form-data'
          } 
        });
        if (res.status === 200) {
          this.product = {
              name: '',
              category: '',
              price: 0,
              discount: 0,
              size: '',
              color: '',
              quantity: 0,
              description: '',
              image: ''
            }
          document.getElementById("addProduct").reset();
          document.getElementById("error_message").style.display = "none";
          document.getElementById("confirmation_message").innerHTML = "Product added successfully!";
          document.getElementById("confirmation_message").style.display = "block";
        } else {
          document.getElementById("confirmation_message").style.display = "none";
          document.getElementById("error_message").innerHTML = "Product could not be added, please try again!";
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
