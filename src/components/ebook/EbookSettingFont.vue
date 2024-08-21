<template>
    <transition name="slide-up">
        <div class="setting-wrapper" v-show="menuVisible && settingVisible === 0">
            <div class="setting-font-size">
                <div class="preview" ref="left">
                    <span :style="styleLeft" ref="leftText">A</span>
                </div>
                <div class="select">
                    <div class="select-wrapper" v-for="(item, index) in fontSizeList" :key="index">
                        <div class="line"></div>
                        <div class="point-wrapper" @click="setFontSize(item.fontSize)">
                            <!-- 当当前设置的字体大小与小球所在的item的字体大小一致的时候，小球就会显示 -->
                            <div class="point" v-show="defaultFontSize === item.fontSize">
                                <div class="small-point"></div>
                            </div>
                        </div>
                        <div class="line"></div>
                    </div>
                </div>
                <div class="preview" ref="right">
                    <span :style="styleRight" ref="rightText">A</span>
                </div>
            </div>
            <div class="setting-font-family" @click="showSettingFontFamily">
                <div class="setting-font-family-text-wapper">
                    <div class="setting-font-family-text">{{ defaultFontFamily }}</div>
                </div>
                <div class="icon-wrapper">
                    <span class="iconfont icon-forward"></span>
                </div>
            </div>
        </div>
    </transition>
</template>
  
<script>

import { ebookMixin } from '../../utils/mixin';
import { FONT_SIZE_LIST } from '../../utils/book';
import {
    saveFontSize,
} from '../../utils/localStorage';

export default {
    data() {
        return {
            fontSizeList: FONT_SIZE_LIST,
            styleLeft: { fontSize: FONT_SIZE_LIST[0].fontSize + 'px' },
            styleRight: { fontSize: FONT_SIZE_LIST[FONT_SIZE_LIST.length - 1].fontSize + 'px' }
        };
    },
    mixins: [ebookMixin],
    methods: {
        setFontSize(fontSize) {
            this.setDefaultFontSize(fontSize);
            console.log("fontSize", fontSize);
            saveFontSize(this.fileName, this.defaultFontSize);
            // 将this.book放在vuex中，直接使用vuex this.currentBook改变字体大小
            this.currentBook.rendition.themes.fontSize(fontSize + 'px');
        },
        showSettingFontFamily() {
            this.setFontFamilyVisible(true);
        },
    }
};
</script>
  
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.setting-wrapper {
    display: flex;
    flex-direction: column;
    z-index: 100;
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    right: 0;
    width: 100%;
    height: px2rem(60);
    background-color: #fff;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);

    .setting-font-size {
        flex: 2;
        display: flex;
        height: 100%;

        .preview {
            flex: 0 0 px2rem(40);
            @include center
        }

        .select {
            display: flex;
            flex: 1;

            .select-wrapper {
                flex: 1;
                display: flex;
                align-items: center;

                &:first-child {
                    .line {
                        &:first-child {
                            border-top: none;
                        }
                    }

                }

                &:last-child {
                    .line {
                        &:last-child {
                            border-top: none;
                        }
                    }
                }

                .line {
                    flex: 1;
                    height: 0;
                    border-top: px2rem(1) #ccc solid;
                }

                .point-wrapper {
                    position: relative;
                    flex: 0 0 0;
                    width: 0;
                    height: px2rem(7);
                    border-right: px2rem(1) #ccc solid;

                    .point {
                        position: absolute;
                        top: px2rem(-6);
                        left: px2rem(-6);
                        width: px2rem(20);
                        height: px2rem(20);
                        border-radius: 50%;
                        background-color: white;
                        // border: px2rem(1) solid #ccc;
                        box-shadow: rgba(0, 0, 0, 0.18) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
                        @include center;

                        .small-point {

                            width: px2rem(5);
                            height: px2rem(5);
                            border-radius: 50%;
                            background-color: rgb(84, 84, 84);
                        }
                    }


                }
            }
        }


    }

    .setting-font-family {
        flex: 1;
        font-size: px2rem(12);
        @include center;

        .setting-font-family-text-wapper {
            @include center;
            margin-right: px2rem(2)
        }

        .icon-wrapper {
            @include center;
            margin-left: px2rem(2)
        }
    }
}
</style>
  