<template>
    <transition name="popup-slide-up">
        <div class="setting-wrapper" v-show="fontFamilyVisible">
            <div class="ebook-fontfamily-title">
                <div class="icon-wrapper" @click="fontFamilyHide">
                    <span class="iconfont icon-down2"></span>
                </div>
                <!-- 国际化语言 -->
                <div class="ebook-fontfamily-title-text">{{ $t('book.selectFont') }}</div>
            </div>
            <div class="ebook-fontfamily-list-wrapper">
                <div class="select-item" v-for="(item, index) in fontFamilyList" :key="index"
                    @click="selectFontFamily(item.font)">
                    <div class="ebook-item-text" :class="{ 'selected': isSelected(item.font) }">{{ item.font }}</div>
                    <div class="icon-wrapper"><span class="iconfont icon-check"
                            v-show="defaultFontFamily === item.font"></span></div>
                </div>
            </div>
        </div>
    </transition>
</template>
  
<script>

import { ebookMixin } from '../../utils/mixin';
import { FONT_FAMILY } from '../../utils/book';
import {
    saveFontFamily,
} from '../../utils/localStorage';

export default {

    mixins: [ebookMixin],
    data() {
        return {
            fontFamilyList: FONT_FAMILY
        };
    },
    methods: {
        fontFamilyHide() {
            this.setFontFamilyVisible(false);
        },
        isSelected(font) {
            return this.defaultFontFamily === font;
        },
        selectFontFamily(font) {
            this.setDefaultFontFamily(font);
            // 保存到本地
            saveFontFamily(this.fileName, this.defaultFontFamily);
            if (font === 'Default') {
                this.currentBook.rendition.themes.font('Times New Roman');
            } else {
                this.currentBook.rendition.themes.font(font);
            }

            console.log(" this.setDefaultFontFamily", this.defaultFontFamily);
        }
    }
};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";

.setting-wrapper {
    // 绝对布局 相对于底部为0
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    // height: px2rem(160);
    width: 100%;
    z-index: 300;
    border-radius: px2rem(10) px2rem(10) 0 0;
    box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, 0.12);
    background-color: #fff;


    .ebook-fontfamily-title {
        position: relative;
        padding: px2rem(16);
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #b8b9bb;
        display: flex;
        font-size: px2rem(14);

        @include center;

        .icon-wrapper {
            position: absolute;
            left: px2rem(14);

        }

        .ebook-fontfamily-title-text {
            font-weight: 600;

        }
    }

    .ebook-fontfamily-list-wrapper {

        .select-item {
            display: flex;
            height: px2rem(38);
            font-size: px2rem(14);

            line-height: px2rem(38);
            padding: 0 px2rem(14);

            border-bottom: px2rem(1) solid #b8b9bb1d;

            .ebook-item-text {
                flex: 1;
                text-align: start; // 左边居左
                height: 100%;

                &.selected {
                    color: rgb(66, 203, 245);
                    font-weight: 700;
                }
            }

            .icon-wrapper {
                flex: 1;
                text-align: end; // 
                color: rgb(66, 203, 245);
                font-weight: 700;
                height: 100%;


            }

        }
    }
}
</style>
  