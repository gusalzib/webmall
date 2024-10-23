import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import Products from './views/Products.vue'
import Carts from './views/Carts.vue'
import Buyers from './views/Buyers.vue'
import SingleBuyer from './views/SingleBuyer.vue'
import Signup from './views/Signup.vue'
import SignupConfirmation from './views/confirmationViews/SignupConfirmation.vue'
import Login from './views/Login.vue'
import AddProduct from './views/AddProduct.vue'
import Orders from './views/Orders.vue'
import SingleProduct from './views/SingleProduct.vue'
import InventoryManager from './views/InventoryManager.vue'
import EditProduct from './views/EditProduct.vue'
import OrderDetails from './views/OrderDetails.vue'
import Stores from './views/Stores.vue'
import AddNewStore from './views/AddNewStore.vue'
import Payment from './views/Payment.vue'
import AdminBuyerPage from './views/AdminBuyerPage.vue'
import SellerSignup from './views/SellerSignup.vue'
import Store from './views/Store.vue'

const routes = [
  { path: '/', name: 'home', component: Home }, //the empty path here means the user will go to the home by defult
  { path: '/products', name: 'products', component: Products },
  { path: '/buyers', name: 'buyers', component: Buyers },
  { path: '/buyers/profile', name: 'buyer', component: SingleBuyer },
  { path: '/products', name: 'products', component: Products },
  { path: '/carts', name: 'carts', component: Carts },
  { path: '/signup', name: 'signup', component: Signup },
  {
    path: '/signupConfirmation',
    name: 'signupConfirmation',
    component: SignupConfirmation
  },
  { path: '/login', name: 'login', component: Login },
  { path: '/addProduct', name: 'addProduct', component: AddProduct },
  { path: '/orders', name: 'orders', component: Orders },
  {
    path: '/single/product/:productID',
    name: 'singleProduct',
    component: SingleProduct
  },
  {
    path: '/inventoryManager',
    name: 'inventoryManager',
    component: InventoryManager
  },
  {
    path: '/editProduct/:productID',
    name: 'editProduct',
    component: EditProduct
  },
  {
    path: '/orders/order/details/:order_id',
    name: 'orderDetails',
    component: OrderDetails
  },
  { path: '/stores', name: 'stores', component: Stores },
  { path: '/add-new-store', name: 'add-new-store', component: AddNewStore },
  { path: '/payment', name: 'payment', component: Payment },
  {
    path: '/buyers/:buyer_id',
    name: 'adminBuyerPage',
    component: AdminBuyerPage
  },
  { path: '/sellers', name: 'sellerSignup', component: SellerSignup },
  { path: '/store', name: 'store', component: Store }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
