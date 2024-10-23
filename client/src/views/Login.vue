<template>

  <div class="login-container">
    <img id="avatar-img" src="/avatar.jpeg" alt="Login avatar">
    <form id="login-form" class="login-form"  method="POST">
        <label>Email: </label>
        <input v-model="buyer.email" type="email" id="email"/>
        <br>
        <label>Password:</label>
        <input v-model="buyer.password" type="password" id="password"/>
        <strong>Show Password</strong>
        <input type="checkbox" v-on:click="toggle()">
        
        <button id="update-button" class="submit-button signup-submit-button" v-on:click="login()" type="button">Login</button>
    </form>
    <div class="login-info-message">Don't have an account? <br> <router-link class="signup-link" to="/signup">Sign up here.</router-link></div>
  </div>
  <div id="confirmation_message" class="confirmation_message">{{ confirmation_message }}</div>
    <div id="error_message" class="error_message">{{ error_message }}</div>

</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'


export default {
  name: 'login',
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
        confirmation_message : "",
        error_message: ''
    }
  },
  methods: {
      async login() {
          try {
            var response = await Api.post('/login', this.buyer, {withCredentials:true});
              if (response.status === 200) {
                  // response.redirect('/signupConfirmation')
                document.getElementById("login-form").reset();
                    document.getElementById("error_message").style.display = "none";
                    document.getElementById("confirmation_message").style.display = "block";

                    this.confirmation_message = response.data.message;
                    
                    setTimeout(()=>{
                      this.triggerConfetti();
                    }, 1000);
                    setTimeout(()=>{  
                       window.location.replace( "/");
                     }, 3000);     
            } 
              
          } catch (error) {
            const backendMessage = error.response?.data.message;
            const requestStatus = error.response?.status;
            if (requestStatus === 401) {
              
              this.error_message = "Wrong password. Please try again!";
              document.getElementById("error_message").style.display = "block";

            } else if (requestStatus === 404) {
              
                this.error_message = "Wrong email. Please try again!";
                document.getElementById("error_message").style.display = "block";
              }
              this.message = backendMessage;
        }
    }, 
    toggle() {
          
            let temp = document.getElementById("password");
             
            if (temp.type === "password") {
                temp.type = "text";
            }
            else {
                temp.type = "password";
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
      }
    
  }
}
</script>

<style src="../css/style.css"></style>
