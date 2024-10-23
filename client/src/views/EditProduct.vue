<template>
  <div>
    <b-container fluid>
      <!-- <b-button class="btn_message" variant="primary" v-on:click="getBuyer()">Get buyer</b-button> -->
      <!-- <p class="dsd" style="z-index: 100; color: red; height: 50px;">This is an error message:  {{ message }}</p> -->

        <div class="singleProduct-container">
            <div id="singleProduct-card">
                <form id="edit-profile" enctype='multipart/form-data'>
                    <h3>Edit Product</h3>
                    

                        
                        <label>Product price: </label>
                        <input v-model="this.product.price" type="number" id="price"/>
                        </br>
                        <label>product discount: </label>
                        <input v-model="this.product.discount" type="number" id="discount"/>
                        </br>
                        <label>product quantity: </label>
                        <input v-model="this.product.quantity" type="number" id="quantity"/>
                        </br>
                        <label>Product name: </label>
                        <input v-model="this.product.name" type="text" id="name"/>
                        </br>
                        <label>Product category: </label>
                        <input v-model="this.product.category" type="text" id="category"/>
                        </br>
                        <label>Product color/s: </label>
                        <input v-model="this.product.color" type="text" id="colors"/>
                        </br>
                        <label>Product size/s: </label>
                        <input v-model="this.product.size" type="text" id="size"/>
                        </br>
                        <label>Product description: </label>
                        <input v-model="this.product.description" type="text" id="description"/>
                        </br>
                        <label>Product image: </label>
                        <input  type="file" v-on:change="onFileSelected" id="image"/>

                        <p type="text" id="product_image">../public/product_images/{{ product.image }}</p>

                        <img id="product-image" :src="`http://localhost:3000/public/product_images/${product.image}`" alt="Product image"/>

                        </br>
                        <button id="update-button" class="submit-button" v-on:click="updateProduct()" type="button">Update product</button>
                    </form>

               
                <div id="confirmation_message" class="confirmation_message">{{ this.confirmation_message }}</div>
                <div id="error_message" class="error_message">{{ this.error_message }}</div>
            </div>
        </div>
    </b-container>

    
  </div>
</template>

<script>

// @ is an alias to /src
import { Api } from '@/Api';
import  axios  from 'axios';


export default {
    name: 'editProduct',
    data() {
        return {
            message: 'none',
            product: {
                name: '',
                price: 0,
                discount: 0,
                category: '',
                color: '',
                quantity: 0,
                size: '',
                description: '',
                image: '',
            },
            products: [],
            error_message: '',
            confirmation_message: '',
            stores: [],
            selectedFile: null,
      productionURL: 'https://webmall.onrender.com/api'

        }
    },
    mounted() {
        this.getProduct();
    },
    methods: {
        getProduct() {
            document.getElementById("error_message").style.display = "none";
            var productId = this.$route.params.productID;
            Api.get(`${this.productionURL}/products/${productId}`)
                .then(response => {
                    this.product = response.data;
                })
                .catch(error => {
                    document.getElementById("error_message").style.display = "block";
                    document.getElementById("error_message").innerHTML = "Product information not found";
                })
        },
        onFileSelected(event) {
            this.selectedFile = event.target.files[0]
        },
        async updateProduct() {
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

            if (this.selectedFile) {
                /*update the image only if a new one is selected */
                formData.append('image', this.selectedFile);
            } else {
                formData.append('image', this.product.image);
            }
            
            var productId = this.$route.params.productID;
            try {
                const res = await axios.put(`${this.productionURL}/products/edit/product/${productId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (res.status === 200) {
                    this.product = {
                        name: '',
                        price: 0,
                        discount: 0,
                        category: '',
                        color: '',
                        quantity: 0,
                        size: '',
                        description: '',
                        image: '',
                    }
                    document.getElementById("error_message").style.display = "none";
                    document.getElementById("edit-profile").reset();
                    document.getElementById("confirmation_message").innerHTML = "Product updated successfully!";
                    document.getElementById("confirmation_message").style.display = "block";
                } else {
                    document.getElementById("error_message").innerHTML = "Product could not be updated, please try again!";
                    document.getElementById("error_message").style.display = "block";
                }
            } catch (error) {
                if (error.response?.status === 400) {
                    //console.log(error.response?.data.message)
                    document.getElementById("error_message").innerHTML = error.response?.data.message;
                    document.getElementById("error_message").style.display = "block";
                }

            }
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