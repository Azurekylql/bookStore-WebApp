<template>
    <div class="scroll-wrapper" :class="{ 'no-scroll': ifNoScroll }" @scroll.passive="handleScroll" ref="scrollWrapper">
        <slot></slot>
    </div>
</template>
  
<script>

import { realPx } from '../../utils/utils';


export default {
    name: 'Scroll',
    props: {
        top: {    // 传入的是rem 在下面方法中会使用realPx转成rem
            type: Number,
            default: 0
        },
        bottom: {
            type: Number,
            default: 0
        },
        ifNoScroll: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleScroll(e) {
            const offsetY = e.target.scrollTop || window.pageYOffset || document.body.scrollTop;
            this.$emit('onScroll', offsetY);  // 通过this.$emit派发事件onScroll，将滚动距离offsetY传到父组件
        },
        scrollTo(x, y) {
            this.$refs.scrollWrapper.scrollTo(x, y);
        },
        // 对外层包裹层的高度进行重新计算
        refresh() {
            if (this.$refs.scrollWrapper) {
                const otherHeight = window.innerHeight - realPx(this.top) - realPx(this.bottom);
                this.$refs.scrollWrapper.style.height = otherHeight + 'px';
                this.$refs.scrollWrapper.addEventListener('scroll', this.handleScroll);
            }
        }
    },


    mounted() {
        this.refresh();
    }
};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";

.scroll-wrapper {
    position: relative;
    z-index: 100;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch; // 可以解决移动端滚动卡顿问题

    &::-webkit-scrollbar {
        display: none;
    }

    &.no-scroll {
        overflow: hidden;
    }
}
</style>
  