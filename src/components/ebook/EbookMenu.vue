<template>
    <div class="ebook-menu">
        <transition name="slide-up">
            <div class="menu-wrapper" :class="{ 'hide-box-shadow': settingVisible >= 0 || !menuVisible }"
                v-show="menuVisible">
                <div class="icon-wrapper" :class="{ 'selected': settingVisible === 3 }">
                    <span class="iconfont icon-menu" @click="showSetting(3)"></span>
                </div>
                <div class="icon-wrapper" :class="{ 'selected': settingVisible === 2 }">
                    <span class="iconfont icon-progress" @click="showSetting(2)"></span>
                </div>
                <div class="icon-wrapper" :class="{ 'selected': settingVisible === 1 }">
                    <span class="iconfont icon-bright" @click="showSetting(1)"></span>
                </div>
                <div class="icon-wrapper" :class="{ 'selected': settingVisible === 0 }">
                    <span class="iconfont icon-A" @click="showSetting(0)"></span>
                </div>
            </div>
        </transition>
        <!-- 引入字体设置的组件 -->
        <ebook-setting-font></ebook-setting-font>
        <e-book-setting-font-family></e-book-setting-font-family>

    </div>
</template>
  
<script>
import EbookSettingFont from './EbookSettingFont.vue';
import EBookSettingFontFamily from './EBookSettingFontFamily.vue';
import { ebookMixin } from '../../utils/mixin';

export default {
    mixins: [ebookMixin],
    components: {
        EbookSettingFont,
        EBookSettingFontFamily
    },
    methods: {
        showSetting(key) {
            if (key === this.settingVisible) {
                this.setSettingVisible(-1);
            } else this.setSettingVisible(key);
        }
    }
};
</script>
  
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

// 添加新的样式规则
.menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    font-size: px2rem(22);
    background-color: white;
    z-index: 101;
    height: px2rem(48);
    display: flex;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);

    &.hide-box-shadow {
        box-shadow: none;
    }

    .icon-wrapper {
        flex: 1;
        @include center;

        .icon-progress {
            font-size: px2rem(24);
        }

        .icon-A {
            font-size: px2rem(20);
        }
    }

}
</style>