<template>
    <div class="ebook-slide-bookmark">
        <div class="slide-bookmark-title">{{ $t('book.bookmark') }} · {{ bookmark ? bookmark.length : 0 }}</div>
        <scroll class="slide-bookmark-list" :top="48" :bottom="48">
            <div class="slide-bookmark-item" v-for="(item, index) in bookmark" :key="index"
                @click="displayBookmark(item.cfi)">
                <div class="slide-bookmark-item-icon">
                    <div class="icon-bookmark-wrapper">
                        <div class="iconfont icon-bookmark"></div>
                    </div>
                </div>
                <div class="slide-bookmark-item-text">{{ item.text }}</div>
            </div>
        </scroll>
    </div>
</template>
  
<script>

import { ebookMixin } from '../../utils/mixin';
import { getBookmark } from '@/utils/localStorage';
import Scroll from '../common/Scroll';

export default {

    mixins: [ebookMixin],
    name: 'slideBookMark',
    data() {
        return {
            bookmark: null
        };
    },
    methods: {
        displayBookmark(cfi) {
            this.currentBook.rendition.display(cfi).then(() => {
                this.refreshLocation();
                this.hideTitleAndMenu();
            });
        }
    },
    components: {
        Scroll,
    },
    mounted() {
        this.bookmark = getBookmark(this.fileName);

        console.log("this.bookmark", this.bookmark);
    }
};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";


.ebook-slide-bookmark {
    width: 100%;

    .slide-bookmark-title {
        width: 100%;
        height: px2rem(48);
        font-size: px2rem(14);
        font-weight: bold;
        padding: 0 px2rem(15);
        box-sizing: border-box; // box-sizing属性不能继承，每个元素都要单独设置
        @include left;
    }

    .slide-bookmark-list {
        padding: 0 px2rem(15);
        box-sizing: border-box;

        .slide-bookmark-item {
            display: flex;
            padding: px2rem(15) 0;
            box-sizing: border-box;

            .slide-bookmark-item-icon {
                flex: 0 0 px2rem(29);
                @include left;

                .icon-bookmark-wrapper {
                    width: px2rem(20);
                    height: px2rem(20);
                    font-size: px2rem(12);
                    border-radius: 50%;
                    background: #bbb;
                    @include center;
                }
            }

            .slide-bookmark-item-text {
                font-size: px2rem(14);
                line-height: px2rem(15);
                max-height: px2rem(45);
                @include ellipse2(3);
            }
        }
    }
}
</style>
  