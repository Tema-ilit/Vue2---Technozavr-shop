<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link
            :to="{ name: 'main' }"
            class="breadcrumbs__link"
            href="index.html"
          >
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link
            :to="{ name: 'cart' }"
            class="breadcrumbs__link"
            href="cart.html"
          >
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Оформление заказа </a>
        </li>
      </ul>

      <h1 class="content__title">Корзина</h1>
      <span class="content__info"> 3 товара </span>
    </div>

    <section class="cart">
      <form
        class="cart__form form"
        action="#"
        method="POST"
        @submit.prevent="order"
      >
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText
              v-model="formData.name"
              :error="formError.name"
              title="ФИО"
              placeholder="Введите ваше полное имя"
              :type="'text'"
            />

            <BaseFormText
              v-model="formData.address"
              :error="formError.address"
              title="Введите ваш адрес"
              placeholder="Введите ваш адрес"
              :type="'text'"
            />

            <!-- <label class="form__label">
              <input class="form__input" v-model="formData.address" type="text" name="address"
                placeholder="Введите ваш адрес">
              <span class="form__value">Адрес доставки</span>
              <span class="form__error" v-if="formError.address">{{ formError.address }}</span>
            </label> -->

            <label class="form__label">
              <select class='form__select'>
                <option value="afd">asdf</option>
                <option value="">asdf</option>
                <option value="">asdf</option>

              </select>
              <span class="form__value">{{ title }}</span>
              <span class="form__error" v-if="error">{{ error }}</span>
            </label>

            <BaseFormText
              v-model="formData.phone"
              :error="formError.phone"
              title="телефон"
              placeholder="Введите ваш телефон"
              :type="'tel'"
            />

            <BaseFormText
              v-model="formData.email"
              :error="formError.email"
              title="Email"
              placeholder="Введи ваш Email"
              :type="'email'"
            />

            <BaseFormTextarea
              v-model="formData.comment"
              :error="formError.comment"
              title="Комментарий к заказу"
              placeholder="Ваши пожелания"
            />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    value="0"
                    checked=""
                  />
                  <span class="options__value">
                    Самовывоз <b>бесплатно</b>
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    value="500"
                  />
                  <span class="options__value"> Курьером <b>500 ₽</b> </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    value="card"
                  />
                  <span class="options__value"> Картой при получении </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    value="cash"
                  />
                  <span class="options__value"> Наличными при получении </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <!-- <li class="cart__order">
              <h3>Смартфон Xiaomi Redmi Note 7 Pro 6/128GB</h3>
              <b>18 990 ₽</b>
              <span>Артикул: 150030</span>
            </li> -->
            <OrderInfoItem
              v-for="item in productInfo"
              :key="item.id"
              :item="item"
            />
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>500 ₽</b></p>
            <p>
              Итого: <b>{{ totalItems }} </b> на сумму
              <b>{{ (totalPrice + 500) | numberFormat }} ₽</b>
            </p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMassage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMassage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from "@/components/BaseFormText.vue";
import BaseFormTextarea from "@/components/BaseFormTextarea.vue";
import OrderInfoItem from "@/components/OrderInfoItem.vue";
import numberFormat from "@/helpers/numberFormat";
import { API_BASE_URL } from "@/config";
import { mapGetters } from "vuex";
import axios from "axios";
export default {
  components: { BaseFormText, BaseFormTextarea, OrderInfoItem },
  data() {
    return {
      formData: {},
      formError: {},
      formErrorMassage: "",
    };
  },
  filters: { numberFormat },
  computed: {
    ...mapGetters({
      totalItems: "cartItemsLength",
      totalPrice: "cartTotalPrice",
      productInfo: "cartDetailProducts",
    }),
    products() {
      // return this.$store.state.orderInfo.basket.items
    },
  },
  methods: {
    order() {
      this.formError = {};
      this.formErrorMassage = "";

      axios
        .post(
          API_BASE_URL + "api/orders",
          { ...this.formData },
          { params: { userAccessKey: this.$store.state.userAccessKey } }
        )
        .then((response) => {
          this.$store.commit("resetCart");
          this.$store.commit("updateOrderInfo", response.data);
          this.$router.push({
            name: "orderIfno",
            params: { id: response.data.id },
          });
        })
        .catch((error) => {
          this.formError = error.response.data.error.request || {};
          this.formErrorMassage = error.response.data.error.message;
        });
    },
  },
};
</script>
