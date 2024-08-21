<template>
    <div class="ebook-bookmark" ref="bookmark">
        <div class="ebook-bookmark-text-wrapper">
            <div class="ebook-bookmark-down-wrapper">
                <span class="iconfont icon-down" ref="iconDown"></span>
            </div>
            <div class="ebook-bookmark-text">{{ text }}</div>
        </div>
        <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
            <Bookmark :color="color" :height="height" :width="width"></Bookmark>
        </div>

    </div>
</template>
  
<script>

import { realPx } from '@/utils/utils';
import { ebookMixin } from '../../utils/mixin';
import Bookmark from '@/components/common/Bookmark.vue';
import { getBookmark, saveBookmark } from '@/utils/localStorage';

const BLUE = '#346cbc';
const WHITE = '#fff';
// const MaskText = this.$t('book.pulldownAddMark');  // 成功添加书签时
// const NOMaskText = this.$t('book.pulldownAddMark');  // 还没有书签时

export default {

    mixins: [ebookMixin],
    data() {
        return {
            text: '',
            color: WHITE,
            // height: 0,
            width: 20,
            isFixed: false

        };
    },
    components: {
        Bookmark
    },
    computed: {
        height() {
            return realPx(35);
        },
        threshold() {
            return realPx(55);
        },
        fixedStyle() {
            return {
                position: 'fixed',
                top: 0,
                right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
            };
        }
    },
    methods: {
        addBookmark() {
            this.bookmark = getBookmark(this.fileName);
            if (!this.bookmark) {
                this.bookmark = [];
            }

            const currentLocation = this.currentBook.rendition.currentLocation();
            // 将感叹号后面的内容转成空格。
            const cfibase = currentLocation.start.cfi.replace(/!.*/, '');

            // 将感叹号前面的内容转成空格,并且将最后那个括号去掉。 $匹配行尾
            const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '');
            const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '');

            // 将cfistart以及cfiend拼接成一个范围
            const cifrange = `${cfibase}!,${cfistart},${cfiend})`;

            // 调用book对象的getRange方法，传入拼接好的range
            this.currentBook.getRange(cifrange).then(range => {

                const text = range.toString().replace(/\s\s/g, '');

                this.bookmark.push({
                    cfi: currentLocation.start.cfi,
                    text: text
                });
                saveBookmark(this.fileName, this.bookmark);
            });
        },
        removeBookmark() {
            const currentLocation = this.currentBook.rendition.currentLocation();
            const cfi = currentLocation.start.cfi;
            this.bookmark = getBookmark(this.fileName);
            if (this.bookmark) {
                this.bookmark = this.bookmark.filter(item => item.cfi !== cfi); // 通过将对应cfi的元素过滤掉以实现删除书签的目的
                saveBookmark(this.fileName, this.bookmark);
            }
        },
        restore() {
            // 状态4:归位
            setTimeout(() => {
                this.$refs.bookmark.style.top = `${-this.height}px`;
                this.$refs.iconDown.style.transform = 'rotate(0deg)';
            }, 200);

            if (this.isFixed) {
                this.setIsBookmark(true);
                // 往书签列表中添加书签数据
                this.addBookmark();
            } else {
                this.setIsBookmark(false);
                // 从书签列表中删除书签数据
                this.removeBookmark();
            }

        },
        beforeHeight() {

            // 状态1: 未超过书签的高度
            if (this.isBookmark) {
                this.text = this.$t('book.pulldownDeleteMark');
                this.color = BLUE;
            } else {
                this.text = this.$t('book.pulldownAddMark');
                this.color = WHITE;
            }
            this.isFixed = false;
        },
        beforeThreshold(y) {
            // 状态2: 超过书签高度但未达到临界状态

            // 为了达到吸顶效果，在下拉的时候，让整个bookmark组件页也着动
            this.$refs.bookmark.style.top = `${-y}px`;
            this.beforeHeight();

            const iconDown = this.$refs.iconDown;
            if (iconDown.style.transform === 'rotate(180deg)') {
                iconDown.style.transform = 'rotate(0deg)';
            }
            this.isFixed = false;
        },
        afterThreshold(y) {
            // 状态3: 超过临界值
            // 在超过临界值的时候，也要保持跟着y在动，才能实现吸顶效果

            this.$refs.bookmark.style.top = `${-y}px`;


            if (this.isBookmark) {
                this.text = this.$t('book.releaseDeleteMark');
                this.color = WHITE;
                this.isFixed = false;
            } else {
                this.text = this.$t('book.releaseAddMark');
                this.color = BLUE;
                this.isFixed = true;
            }

            const iconDown = this.$refs.iconDown;
            if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
                iconDown.style.transform = 'rotate(180deg)';
            }

        }
    },
    watch: {
        // 监听vuex中的某些状态变化
        offsetY(y) {
            // 这些条件下都不做监听 直接return掉
            if (this.menuVisible || !this.bookAvailable || this.settingVisible >= 0) {
                return;
            }
            if (y > 0 && y <= this.height) {
                this.beforeHeight();
            } else if (y >= this.height && y <= this.threshold) {
                this.beforeThreshold(y);
            } else if (y > this.threshold) {
                this.afterThreshold(y);
            } else if (y === 0) {
                // 归位
                this.restore();
            }
        },
        isBookmark(isBookmark) {
            this.isFixed = isBookmark;
            if (isBookmark) {
                this.color = BLUE;
            } else {
                this.color = WHITE;
            }
        }
    }
};
</script>

  
<style lang="scss" scoped>
@import "../../assets/styles/global";

.ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 105;
    width: 100%;
    height: px2rem(35);
    // background-color: #484646;

    .ebook-bookmark-text-wrapper {
        position: absolute;
        right: px2rem(45);
        bottom: 0;
        display: flex;

        .ebook-bookmark-down-wrapper {
            font-size: px2rem(14);
            color: white;
            transition: all .2s linear;
            @include center;
        }

        .ebook-bookmark-text {
            font-size: px2rem(14);
            color: white;
        }
    }

    .ebook-bookmark-icon-wrapper {
        position: absolute;
        right: 0;
        bottom: 0;
        margin-right: px2rem(15);

    }
}
</style>
  