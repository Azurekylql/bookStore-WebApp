<template>
    <transition name="slide-down">
        <div class="title-wrapper" v-show="menuVisible">
            <div class="left" @click="back">
                <span class="iconfont icon-back"></span>
            </div>
            <div class="right">
                <div class="icon-wrapper">
                    <span class="iconfont icon-shelf"></span>
                </div>
                <div class="icon-wrapper">
                    <span class="iconfont icon-cart"></span>
                </div>
                <div class="icon-wrapper" @click="gotoBookStore">
                    <span class="iconfont icon-more"></span>
                </div>
            </div>
        </div>
    </transition>
</template>
  
<script>

import { ebookMixin } from '../../utils/mixin';

export default {
    mixins: [ebookMixin],
    methods: {
        back() {
            this.$router.go(-1);
        },
        gotoBookStore() {
            console.log("gotoBookStore");
        },
    }

};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";

.title-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    z-index: 101;
    display: flex; // 开启弹性布局
    height: px2rem(48);
    background-color: white;
    box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, .15);
    font-size: px2rem(22); // 设置字体大小 是为了统一字体图标的大小

    .left {
        flex: 0 0 px2rem(37); // 相当于flex-grow：0 flex-shrink：0 flex-basis：px2rem(37) 不能放大缩小
        @include left;
        margin-left: px2rem(15)
    }

    .right {
        flex: 1;
        display: flex;
        justify-content: flex-end; // 弹性盒内部元素靠右

        .icon-wrapper {
            flex: 0 0 px2rem(37);
            @include center;
        }
    }

}
</style>
  