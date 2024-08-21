<template>
    <div class="shelf-item-add">
        <span class="iconfont icon-add"></span>
    </div>
</template>
  
<script>

import { storeShelfMixin } from '../../utils/mixin';

export default {

    mixins: [storeShelfMixin],
    mounted() {

    }
};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";

.shelf-item-add {
    width: 100%;
    height: 100%;
    border: px2rem(1) solid #ccc;
    box-sizing: border-box;
    @include center;

    .icon-add {
        color: #ccc;
    }
}
</style>
  