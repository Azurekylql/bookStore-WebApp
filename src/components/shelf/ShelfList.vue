<template>
    <div class="shelf-list">
        <transition-group name="list" tag="div" id="shelf-list">
            <div class="shelf-list-item-wrapper" v-for="item in shelfListData" :key="item.id">
                <shelf-item :data="item" :style="{ height: itemHeight }"></shelf-item>
                <div class="shelf-list-title-wrapper">
                    <span class="shelf-list-title title-small">{{ item.title }}</span>
                </div>
            </div>
        </transition-group>
    </div>
</template>
  
<script>
import { storeShelfMixin } from '../../utils/mixin';
import ShelfItem from './ShelfItem';
import { realPx } from '../../utils/utils';

// import { getBookShelf ,saveBookShelf } from '../../utils/localStorage';

export default {
    mixins: [storeShelfMixin],
    components: {
        ShelfItem
    },
    props: {
        shelfListData: Array
    },
    // data() {
    //     return {
    //         // 创建一个本地的响应式数据属性
    //         localData: this.data
    //     };
    // },
    // watch: {
    //     data() {
    //         if (this.data.length > 0) {
    //             this.localData = this.data;
    //         }
    //     },
    //     isEditMode() {
    //         if (this.isEditMode) {
    //             this.localData = this.removeAppFromShelf(this.localData);
    //         } else {
    //             this.localData = this.appendAppToShelf(this.localData);
    //         }
    //     }
    // },
    computed: {
        itemHeight() {
            // 图片的宽高比是250px:350px
            // w / 250 = h / 350
            // h = w / 250 * 350
            return ((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px';
        }
    }
};
</script>
  
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.shelf-list {
    // position: absolute;
    // left: 0;
    background: #fff;
    // z-index: 100;
    width: 100%;

    #shelf-list {
        display: flex;
        flex-flow: row wrap; // 水平换行排列
        width: 100%;
        padding: 0 px2rem(15);
        box-sizing: border-box;

        .shelf-list-item-wrapper {
            flex: 0 0 33.33%;
            width: 33.33%;
            padding: px2rem(15);
            box-sizing: border-box;

            &.list-leave-active {
                display: none;
            }

            &.list-move {
                transition: transform .5s;
            }

            .shelf-list-title-wrapper {
                margin-top: px2rem(10);
                @include ellipse2(2);
                font-size: px2rem(13);
                line-height: px2rem(15);
                max-height: px2rem(30);
            }
        }
    }
}
</style>