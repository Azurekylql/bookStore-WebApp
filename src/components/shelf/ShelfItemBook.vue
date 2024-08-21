<template>
    <div class="shelf-item-book">
        <img class="shelf-item-book-cover" :src="data.cover">
        <div class="private-wrapper" v-show="data.private"></div>
        <div class="private-icon-wrapper" v-show="data.private">
            <span class="iconfont icon-private"></span>
        </div>
    </div>
</template>
  
<script>

import { storeShelfMixin } from '../../utils/mixin';

export default {
    props: {
        data: Object
    },
    mixins: [storeShelfMixin],
    mounted() {

    }
};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";

.shelf-item-book {
    width: 100%;
    height: 100%;

    .shelf-item-book-cover {
        width: 100%;
        height: 100%;
    }

    .private-wrapper {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0;
        height: 0;
        border-width: px2rem(15);
        border-style: solid;
        border-color: transparent transparent rgba(0, 0, 0, .3) rgba(0, 0, 0, .3);
    }

    .private-icon-wrapper {
        position: absolute;
        left: 0;
        bottom: 0;
        width: px2rem(30);
        height: px2rem(30);
        padding-bottom: px2rem(5);
        padding-left: px2rem(3);

        .icon-private {
            font-size: px2rem(12);
            color: white;
        }
    }
}
</style>
  