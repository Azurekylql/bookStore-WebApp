<template>
    <!-- transition的叠加效果 -->
    <transition name="fade">

        <div class="slide-content-wrapper" v-show="menuVisible && settingVisible === 3">
            <transition name="fade-slide-right">
                <div class="content" v-if="settingVisible === 3">
                    <div class="content-page-wrapper" v-if="bookAvailable">
                        <div class="content-page">
                            <component :is="currentTab === 0 ? slideContent : slideBookMark"></component>
                        </div>
                        <div class="content-page-tab">
                            <div class="content-page-tab-item" :class="{ selected: this.currentTab === 0 }"
                                @click="changeTab(0)">{{
                                    $t('book.navigation') }}</div>
                            <div class="content-page-tab-item" :class="{ selected: this.currentTab === 1 }"
                                @click="changeTab(1)">{{
                                    $t('book.bookmark') }}</div>
                        </div>
                    </div>

                    <div class="content-empty" v-else>
                        <EBookLoading></EBookLoading>
                    </div>

                </div>
            </transition>
            <div class="content-bg" @click="hide()"></div>
        </div>
    </transition>
</template>
  
<script>

import { ebookMixin } from '../../utils/mixin';
import slideContent from '../../components/ebook/slideContent.vue';
import slideBookMark from '../../components/ebook/slideBookMark.vue';
import EBookLoading from '../../components/ebook/EBookLoading.vue';

export default {

    mixins: [ebookMixin],
    components: {
        slideContent,
        slideBookMark,
        EBookLoading
    },
    data() {
        return {
            currentTab: 0,
            slideContent: slideContent,
            slideBookMark: slideBookMark
        };
    },
    methods: {
        hide() {
            this.setSettingVisible(-1);
            this.setMenuVisible(false);
        },
        changeTab(tab) {
            this.currentTab = tab;
        }
    }
};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";

.slide-content-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 105;
    display: flex;

    .content {
        flex: 0 0 85%;
        width: 85%;
        background: transparent;
        height: 100%;

        .content-page-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;

            .content-page {
                flex: 1;
                width: 100%;
            }

            .content-page-tab {
                flex: 0 0 px2rem(48);
                width: 100%;
                height: px2rem(48);
                display: flex;
                font-size: px2rem(16);



                .content-page-tab-item {
                    @include center;
                    flex: 0 0 50%;
                    width: 100%;
                    height: 100%;
                    background-color: #ccc;
                }
            }
        }

        .content-empty {
            width: 100%;
            height: 100%;
            @include center
        }
    }

    .content-bg {
        flex: 0 0 15%;
        background: #6e6e6e47;
        width: 100%;
        height: 100%;
    }
}
</style>
  