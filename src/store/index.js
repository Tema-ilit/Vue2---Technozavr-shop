import Vue from "vue";
import Vuex from 'vuex'
import products from "@/data/products";
import axios from "axios";
import { API_BASE_URL } from "@/config";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],

    userAccessKey: null,

    cartProductData: [],

    orderInfo: null
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo
    },
    resetCart(state) {
      state.cartProducts = []
      state.cartProductData = []
    },
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find(item => item.productId === productId)
      if (item) {
        item.amount = amount
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter(item => item.productId !== productId)
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey
    },
    updateCartProductData(state, items) {
      state.cartProductData = items
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductData.map(item => {
        return {
          productId: item.product.id,
          amount: item.quantity
        }
      })
    }
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map(item => {
        const product = state.cartProductData.find(p => p.product.id === item.productId).product
        return {
          ...item,
          product: {
            ...product,
            img: product.image.file.url
          }
        }
      })
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0)
    },
    cartItemsLength(state, getters) {
      let count = getters.cartDetailProducts.reduce((total, item) => total + item.amount, 0)

      switch (count) {
        case 1:
        case 21:
        case 31:
          return `${count} товар`
        case 2:
        case 22:
        case 33:
        case 3:
        case 23:
        case 33:
        case 4:
        case 34:
          return `${count} товара`
        default:
          return `${count} товаров`
      }
    },
    countOfProducts(state) {
      let count = state.orderInfo.basket.items.length

      switch (count) {
        case 1:
        case 21:
        case 31:
          return `${count} товар`
        case 2:
        case 22:
        case 33:
        case 3:
        case 23:
        case 33:
        case 4:
        case 34:
          return `${count} товара`
        default:
          return `${count} товаров`
      }
    }
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios.get(API_BASE_URL + 'api/orders/' + orderId, {
        params: {
          userAccessKey: context.state.userAccessKey
        }
      })
        .then(response => {
          context.commit('updateOrderInfo', response.data)
        })
    },
    loadCart(context) {
      return axios.get(API_BASE_URL + 'api/baskets', {
        params: {
          userAccessKey: context.state.userAccessKey
        }
      })
        .then(response => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey)
            context.commit('updateUserAccessKey', response.data.user.accessKey)
          }
          context.commit('updateCartProductData', response.data.items)
          context.commit('syncCartProducts')

        })
    },
    addProductToCart(context, { productId, amount }) {
      return axios
        .post(API_BASE_URL + 'api/baskets/products', {
          productId: productId,
          quantity: amount
        }, {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then(response => {
          context.commit('updateCartProductData', response.data.items)
          context.commit('syncCartProducts')
        })
    },
    updateCartProductAmount(context, { productId, amount }) {

      context.commit('updateCartProductAmount', { productId, amount })

      if (amount < 1) {
        return
      }

      return axios
        .put(API_BASE_URL + 'api/baskets/products', {
          productId: productId,
          quantity: amount
        }, {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then(response => {
          context.commit('updateCartProductData', response.data.items)
        })
        .catch(() => {
          context.commit('syncCartProducts')
        })
    },
    deleteCartProduct(context, productId) {
      context.commit('updateCartProductAmount', productId)

      return axios
        .delete(API_BASE_URL + 'api/baskets/products', {
          data: {
            productId: productId
          },
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then((response) => {
          context.commit('updateCartProductData', response.data.items)
          context.commit('syncCartProducts')
        })
        .catch((error) => console.log(error))
    }
  }
})
