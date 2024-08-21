<!-- 标题以及搜索框 -->

<template>
    <div>
        <div class="search-bar" :class="{ 'hide-title': !titleVisible, 'show-shadow': shadowVisible }">
            <transition name="title-move">
                <div class="search-bar-title-wrapper title" v-show="titleVisible">

                    <div class="title-text-wrapper">
                        <span class="title-text title">{{ $t('home.title') }}</span>
                    </div>
                    <div class="title-icon-shake-wrapper" @click="showFlapCard">
                        <span class="iconfont icon-shake icon"></span>
                    </div>
                </div>
            </transition>
            <div class="title-icon-back-wrapper" :class="{ 'hide-title': !titleVisible }" @click="back">
                <span class="iconfont icon-back icon"></span>
            </div>

            <div class="search-bar-input-wrapper" :class="{ 'hide-title': !titleVisible }">
                <div class="search-bar-blank" :class="{ 'show-blank': !titleVisible }"></div>
                <div class="search-bar-input">
                    <span class="iconfont icon-search icon"></span>
                    <input class="input" type="text" :placeholder="$t('home.hint')" v-model="searchText"
                        @click="showHotSearch" @keyup.13.exact="search">
                </div>
            </div>
        </div>
        <hot-search-list v-show="hotSearchVisible" ref="hotSearchList"></hot-search-list>
    </div>
</template>
  
<script>

import { storeHomeMixin } from '../../utils/mixin';
// import { mapGetters } from 'vuex';

import HotSearchList from './HotSearchList';


export default {

    mixins: [storeHomeMixin],
    data() {
        return {
            searchText: '',
            titleVisible: true, //向下滚动隐藏标题
            shadowVisible: false,
            hotSearchVisible: false
        };
    },
    components: {
        HotSearchList
    },
    watch: {
        offsetY(y) {
            if (y > 0) {
                this.hideTitle();
                this.showShadow();

                // this.showShadow();
            } else {
                this.showTitle();
                this.hideShadow();
            }
        },
        hotSearchOffsetY(y) {
            if (y > 0) {
                this.showShadow();
            } else {
                this.hideShadow();
            }
        }
    },

    methods: {
        showFlapCard() {
            this.setFlapCardVisible(true).then(() => {
                console.log("FlapCardVisible", this.flapCardVisible);
            });
        },
        back() {
            if (this.offsetY > 0) {
                this.showShadow();
                this.hideTitle();
            } else {
                this.hideShadow();
                this.showTitle();
            }
            if (this.hotSearchVisible) {
                this.hideHotSearch();
            } else {
                // 如果是在书城页面点击返回图标的话，就跳转到书架页面
                this.$router.push('/store/shelf');
            }

        },
        hideHotSearch() {
            this.hotSearchVisible = false;
            this.$refs.hotSearchList.reset();
        },
        showHotSearch() {
            this.hotSearchVisible = true;
            this.hideShadow();
            this.hideTitle();
        },
        search() {
            this.$router.push({
                path: '/store/list',
                query: {
                    keyword: this.searchText
                }
            });
        },
        hideTitle() {
            this.titleVisible = false;
        },
        showTitle() {
            this.titleVisible = true;
        },
        hideShadow() {
            this.shadowVisible = false;
        },
        showShadow() {
            this.shadowVisible = true;
        }

    }
};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";

.search-bar {
    position: relative;
    width: 100%;
    z-index: 101;
    height: px2rem(94);

    &.hide-title {
        height: px2rem(52);
    }

    &.show-shadow {
        box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    }

    .search-bar-title-wrapper {
        width: 100%;
        height: px2rem(42);
        position: absolute;
        top: 0;
        left: 0;

        .title-text-wrapper {
            width: 100%;
            height: px2rem(42);
            @include center
        }

        .title-icon-shake-wrapper {
            position: absolute;
            top: 0;
            right: px2rem(15);
            // width: px2rem(20);
            height: px2rem(42);
            @include center
        }
    }

    .title-icon-back-wrapper {
        position: absolute;
        top: 0;
        left: px2rem(15);
        // width: px2rem(20);
        height: px2rem(42);
        @include center;
        transition: height .2s linear;
        z-index: 102;

        &.hide-title {
            height: px2rem(52);
        }
    }

    .search-bar-input-wrapper {
        width: 100%;
        top: px2rem(42);
        left: 0;
        position: absolute;
        height: px2rem(52);
        padding: px2rem(10);
        box-sizing: border-box;
        transition: top .2s linear;
        display: flex;

        &.hide-title {
            top: 0;
        }

        .search-bar-blank {
            flex: 0 0 0;
            width: 0;
            transition: all .2s linear;

            &.show-blank {
                flex: 0 0 px2rem(31);
                width: px2rem(31);
            }
        }

        .search-bar-input {
            flex: 1;
            background-color: #ededed;
            border-radius: px2rem(20);
            width: 100%;
            @include left;
            padding: px2rem(5) px2rem(15);
            box-sizing: border-box;

            .input {
                width: 100%;
                height: px2rem(22);
                border: none;
                background-color: transparent;
                outline: none;
                padding: 0 px2rem(10);
                box-sizing: border-box;

                &::-webkit-input-placeholder {
                    color: #ccc;
                }
            }
        }
    }
}
</style>
  