<template>
  <li class="cart__order">
    <h3>{{item.product.title}}</h3>
    <b>{{item.product.price | numberFormat}} ₽</b>
    <span>Артикул: {{item.product.id}}</span>
    <span>Количество: {{ item.quantity }}</span>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
export default {
props: ['item'],
filters: {numberFormat}
}
</script>
