<template>
    <transition name="fade">
        <!--  v-show="shelfSearchVisible" -->
        <div class="shelf-search-wrapper" v-show="showSearch">
            <div class="shelf-search">
                <div class="shelf-search-input-wrapper">
                    <div class="icon-search-wrapper">
                        <span class="iconfont icon-search"></span>
                    </div>
                    <input class="search-input" type="text" :placeholder="$t('shelf.search')" @click="showSearchPage"
                        v-model="searchText" @keyup.enter.exact="search">
                    <div class="icon-clear-wrapper" v-show="searchText.length > 0" @click="clearSearchText">
                        <span class="iconfont icon-close-circle-fill"></span>
                    </div>
                </div>

                <div class="icon-locale-wrapper" @click="switchLocale" v-if="!searching">
                    <span class="iconfont icon-cn" v-if="lang === 'cn'"></span>
                    <span class="iconfont icon-en" v-else></span>
                </div>

                <div class="cancel-btn-wrapper" @click="onCancelClick" v-else>
                    <div class="cancel-text">{{ $t('shelf.cancel') }}</div>
                </div>
            </div>

            <transition name="hot-search-move">
                <div class="shelf-search-tab-wrapper" v-if="searching">
                    <div class="shelf-search-tab-item" v-for="item in tabs" :key="item.id" @click="onTabClick(item.id)">
                        <span class="shelf-search-tab-text" :class="{ 'is-selected': item.id === selectedTab }">{{
                            item.text }}</span>
                    </div>
                </div>
            </transition>

        </div>
    </transition>
</template>
  
<script>

import { storeShelfMixin } from '../../utils/mixin';
import { getBookShelf, saveLocale } from '../../utils/localStorage';

export default {

    mixins: [storeShelfMixin],
    computed: {
        lang() {
            return this.$i18n.locale;
        },
        tabs() {
            return [
                {
                    id: 1,
                    text: this.$t('shelf.default')
                },
                {
                    id: 2,
                    text: this.$t('shelf.progress')
                },
                {
                    id: 3,
                    text: this.$t('shelf.purchase')
                }
            ];
        }
    },
    data() {
        return {
            searching: false,
            searchText: '',
            selectedTab: 0
        };
    },
    watch: {
        offsetY(y) {
            if (!this.isEditMode) {
                if (y > 0 && this.shelfTitleVisible) {
                    this.setSearchShow(false).then(() => {
                    });
                } else {
                    this.setSearchShow(true).then(() => {
                    });
                }
            }
        }
    },

    methods: {
        search() {
            this.searching = true;
            this.setShelfTitleVisible(false);
            let list = this.shelfList;
            list = this.searchItem(list);
            console.log("list", list);
            this.setShelfList(list);
        },

        searchItem(list) {
            return list.filter(item => {
                if (item.itemList) {
                    item.itemList = this.searchItem(item.itemList);
                    return item.itemList.length > 0;
                }
                if (item.fileName) {
                    return item.fileName.indexOf(this.searchText) > 0;
                }

            });
        },
        clearSearchText() {
            this.searchText = '';
            this.setShelfList(getBookShelf());
        },
        showSearchPage() {
            this.setShelfTitleVisible(false);
            this.searching = true;
        },
        switchLocale() {
            if (this.lang === 'en') {
                this.$i18n.locale = 'cn';
            } else {
                this.$i18n.locale = 'en';
            }
            saveLocale(this.$i18n.locale);
        },
        onCancelClick() {
            this.setShelfList(getBookShelf());
            console.log('取消');
            this.searchText = '';
            this.searching = false;
            this.setShelfTitleVisible(true);
        },
        onTabClick(id) {
            this.selectedTab = id;
        }
    }
};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";

.shelf-search-wrapper {
    width: 100%;
    position: relative;
    height: auto; // 自动设置高度
    background: rgb(255, 255, 255);
    font-size: px2rem(16);

    .shelf-search {
        width: 100%;
        // background: #ccc;
        @include center;
        height: px2rem(42);
        padding: px2rem(7) px2rem(0) px2rem(2) px2rem(10);
        box-sizing: border-box;

        .shelf-search-input-wrapper {
            height: 100%;
            box-sizing: border-box;
            @include center;
            border: px2rem(1) solid #cdcdcd;
            border-radius: px2rem(2);
            flex: 1;


            .icon-search-wrapper {
                flex: 0 0 px2rem(26);
                font-size: px2rem(10);
                font-weight: 600;
                @include center;
                height: 100%;
            }

            .search-input {
                height: 100%;
                box-sizing: border-box;
                flex: 1;
                outline: none;
                border: none;
                font-size: px2rem(12);
                color: #848484;
                padding: px2rem(3) 0;
            }

            .icon-clear-wrapper {
                height: 100%;
                flex: 0 0 px2rem(26);
                font-size: px2rem(10);
                @include center;
            }
        }

        .icon-locale-wrapper {
            flex: 0 0 px2rem(40);
            @include center;
        }

        .cancel-btn-wrapper {
            flex: 0 0 px2rem(50);
            @include center;
            font-size: px2rem(12);
            color: $color-blue;
        }

    }

    .shelf-search-tab-wrapper {
        width: 100%;
        height: px2rem(35);
        // background: #ffa3a3;
        display: flex;

        .shelf-search-tab-item {
            flex: 1;
            @include center;
            font-size: px2rem(11);
            color: #848484;

            .shelf-search-tab-text {

                &.is-selected {
                    color: $color-blue;
                }

            }
        }
    }
}
</style>
  