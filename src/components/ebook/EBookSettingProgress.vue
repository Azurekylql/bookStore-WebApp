<template>
    <transition name="popup-slide-up">
        <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
            <div class="setting-progress">
                <div class="read-time-wrapper">
                    <span class="read-time-text">{{ getReadTime() }}</span>
                    <span class="iconfont icon-forward"></span>
                </div>
                <div class="progress-wrapper">
                    <div class="progress-icon-wrapper">
                        <span class="iconfont icon-back" @click="prevSection"></span>
                    </div>
                    <input class="progress" type="range" max="100" min="0" step="1" :value="progress"
                        :disabled="!bookAvailable" ref="progress" @change="onprogressChange($event.target.value)"
                        @input="onprogressInput($event.target.value)">
                    <div class="progress-icon-wrapper">
                        <span class="iconfont icon-forward" @click="nextSection"></span>
                    </div>
                </div>
                <div class="text-wrapper">
                    <span class="progress-section-text">{{ getSectionName }}</span>
                    <span class="progress-text">({{ bookAvailable ? progress + '%' : $t('book.loading') }})</span>
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

        displaySection() {
            const sectionInfo = this.currentBook.section(this.section);
            if (sectionInfo && sectionInfo.href) {
                console.log("sectionInfo", sectionInfo);
                this.display(sectionInfo.href);
            }
        },

        // displaySection() {
        //     const sectionInfo = this.currentBook.section(this.section);
        //     console.log("sectionInfo", sectionInfo);
        //     if (sectionInfo && sectionInfo.href) {
        //         this.currentBook.rendition.display(sectionInfo.href).then(() => {
        //             this.refreshLocation();
        //         });
        //     }
        // },
        prevSection() {
            if (this.section > 0 && this.bookAvailable) {
                this.setSection(this.section - 1).then(() => {
                    this.displaySection();
                });
            }

        },
        nextSection() {
            // spine.length 表示章节数
            if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
                this.setSection(this.section + 1).then(() => {
                    this.displaySection();
                });
            }

        },
        // 拖动进度条松手时调用的方法
        onprogressChange(progress) {
            this.setProgress(progress).then(() => {
                this.displayProgress(progress);
            });
        },
        // 拖动过程中调用的方法
        onprogressInput(progress) {
            this.setProgress(progress);
        },

        // 用于跳转到当前进度条所在的页面
        // displayProgress() {
        //     // locations下的cfiFromPercentage方法，通过百分比获取cfi也就是定位
        //     const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100);
        //     this.currentBook.rendition.display(cfi).then(() => {
        //         this.refreshLocation();
        //     });
        // },
        displayProgress() {
            const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100);
            this.display(cfi);
        },
    }

};
</script>
  
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 100;
    width: 100%;
    height: px2rem(90);
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);

    .setting-progress {
        position: relative;
        width: 100%;
        height: 100%;

        .read-time-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: px2rem(40);
            @include center;
            font-size: px2rem(12);
        }

        .progress-wrapper {
            width: 100%;
            height: 100%;
            @include center;
            padding: 0 px2rem(15);
            box-sizing: border-box;

            .progress {
                flex: 1;
                width: 100%;
                height: px2rem(2);
                background: -webkit-linear-gradient(#5d6268, #5d6268) no-repeat, #b4b5b7;
                background-size: 0 100% !important;
                margin: 0 px2rem(10);

                &:focus {
                    outline: none;
                }

                &::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: px2rem(20);
                    width: px2rem(20);
                    border-radius: 50%;
                    background: #ceced0;
                    box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0, 0, .15);
                    border: none;
                }
            }

            .progress-icon-wrapper {
                flex: 0 0 px2rem(22);
                font-size: px2rem(22);
                @include center;
            }
        }

        .text-wrapper {
            position: absolute;
            left: 0;
            bottom: px2rem(10);
            width: 100%;
            font-size: px2rem(12);
            text-align: center;
            padding: 0 px2rem(15);
            box-sizing: border-box;
            @include center;

            .progress-section-text {

                margin-right: px2rem(8);
                @include ellipse
            }


        }
    }
}
</style>