<template>

  <div class="signup-container">
    <h2> Seller Registration Form</h2>
    <form id="signup-form" class="signup-form"  method="POST">
      *Required
        <label>First name:* </label>
        <input v-model="seller.fname" type="text" id="fname" required/>
        </br> 
        <label>Last name:* </label>
        <input v-model="seller.lname" type="text" id="lname" required/>
        </br>
        <label>Middle name:* </label>
        <input v-model="seller.minit" type="text" id="minit" required/>
        </br>
        <label>Phone number:* </label>
        <input v-model="seller.phone_number" type="text" id="phone_number" required/>
        </br>
        <label>Email:* </label>
        <input v-model="seller.email" type="email" id="email" required/>
        </br>
        <label>Store name:* </label>
        <input v-model="seller.street" type="text" id="street" required/>
        </br>
        <label>Password:*</label>
        <input v-model="seller.password" type="password" id="password" required/>
        <strong>Show Password</strong>
        <input type="checkbox" v-on:click="toggle()">
        <button id="update-button" class="submit-button signup-submit-button" v-on:click="signup()" type="button">Sign up</button>
    </form>
    <div class="signup-info-message">Already have an account? </br> <router-link class="login-link" to="/login">Login here.</router-link></div>
  </div>
  <div id="confirmation_message" class="confirmation_message">{{ confirmation_message }}</div>
  <div id="error_message" class="error_message">{{ error_message }}</div>
  </template>
<!--     fname: {type: String}, 
    minit: { type: String }, 
    lname: { type: String }, 
    phone_number: { type: String },
    email: { type: String },
    store_name: { type: String },
    password: { type: String },  -->
<script>
// @ is an alias to /src
import { Api } from '@/Api'


export default {
  name: 'sellerSignup',
  data() {
    return {
        message: 'none',
        seller: {
              fname: '',
              lname: '',
              minit: '',
              phone_number: '',
              email: '',
              store_name: '',
              password: ''
        },
      confirmation_message: "",
        error_message: ''
    }
  },
  methods: {
      async signup() {
          try {
              var response = await Api.post('/sellers', this.seller);
              if (response.status === 200) {
                  
                    document.getElementById("signup-form").reset();
                    document.getElementById("error_message").style.display = "none";
                    this.confirmation_message = "Signup successfull!";
                    document.getElementById("confirmation_message").style.display = "block";

                    
               
                    setTimeout(()=>{
                      this.triggerConfetti();
                    }, 1000);
                    setTimeout(()=>{  
                      window.location.replace( "/login");
                    }, 3000);
              } else {
                this.confirmation_message = "Signup failed. Please try again!";
                
              }
          } catch (error) {
             
            //   if (error.response?.status === 400 && error.response?.data.message === "Email already exists.") {
              
            //   this.error_message = "Email already exists. Please login or try another email";
            //   document.getElementById("error_message").style.display = "block";

            // } else if (error.response?.status === 422) {
              
            //     this.error_message = "Missing information. Please fill in the *required fields!";
            //     document.getElementById("error_message").style.display = "block";

            //   } else if (error.response?.status === 400 && error.response?.data.message === "failed") {

            //     this.error_message = "Registration failed. Please try again later!";
            //     document.getElementById("error_message").style.display = "block";

            //   } else if ((error.response?.status === 400 && error.response?.data.message === "invalid email")) {

            //     this.error_message = "Registration failed. Invalid email format!";
            //     document.getElementById("error_message").style.display = "block";

            //   } else if (error.response?.status === 400 && error.response?.data.message === "invalid password") {

            //     this.error_message = "Registration failed. Invalid password!";
            //     document.getElementById("error_message").style.display = "block";
            //   }
              this.message = error.message;
              //console.log(this.message)
        }
      }, 
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
    toggle() {
          
            let temp = document.getElementById("password");
             
            if (temp.type === "password") {
                temp.type = "text";
            }
            else {
                temp.type = "password";
            }
        
      }
    
  }
}
</script>

<style src="../css/style.css"></style>
