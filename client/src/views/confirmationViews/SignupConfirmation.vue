<template>
  <div class="confirmation-container">
    <p>You signed up successfully!</p>
    <route-link class="nav-links">Login</route-link>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'signupConfirmation',
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
    }
  },
  methods: {
      async signup() {
          try {
              var response = await Api.post('/signup', this.buyer);

              if (response.status === 200) {
                  console.log('signup successful');
              } else {
                console.log('failure!')
              }
          } catch (error) {
              this.message = error.message;
        }
    }
  }
}
</script>

<style src="@/css/style.css"></style>
