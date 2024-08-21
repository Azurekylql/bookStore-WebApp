<template>
    <div class="shelf-item-category">
        <div class="shelf-item-category-list" v-if="itemList.length > 0">
            <div class="shelf-item-category-item" v-for="(item, index) in itemList" :key="index">

                <img class="shelf-item-category-item-img" :src="item.cover" />

            </div>
        </div>
        <div class="shelf-item-category-bg" v-else>
            <span class="iconfont icon-book2"></span>
        </div>
    </div>
</template>
  
<script>

import { storeShelfMixin } from '../../utils/mixin';

export default {

    props: {
        data: Object
    },
    data() {
        return {
            itemList: []
        };
    },
    mixins: [storeShelfMixin],
    mounted() {
        if (this.data.itemList.length > 9) {
            this.itemList = this.data.itemList.slice(0, 9);
        } else {
            this.itemList = this.data.itemList;
        }
    }
};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";

.shelf-item-category {
    width: 100%;
    height: 100%;

    .shelf-item-category-list {
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        width: 100%;
        height: 100%;

        .shelf-item-category-item {
            font-size: px2rem(10);
            flex: 0 0 33.33%;
            width: 33.33%;
            height: 33.33%;
            background-color: #fff;

            box-sizing: border-box;

            // 每行开头第一个元素
            &:nth-child(3n+1) {
                // 上 右 下 左的顺序
                padding: 0 px2rem(2) px2rem(4) px2rem(4);
            }

            // 每行中间那个元素
            &:nth-child(3n+2) {
                padding: 0 px2rem(2) px2rem(4) px2rem(2);
            }

            // 每行最右那个元素
            &:nth-child(3n+3) {
                padding: 0 px2rem(4) px2rem(4) px2rem(2);
            }

            .shelf-item-category-item-img {
                width: 100%;
                height: 100%;

            }

        }

    }

    .shelf-item-category-bg {
        width: 100%;
        height: 100%;
        @include center;
        background-color: #fff;
        color: #ccc;
    }
}
</style>
  