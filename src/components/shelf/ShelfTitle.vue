<template>
    <transition name="fade">
        <div class="shelf-title" v-show="shelfTitleVisible">
            <div class="shelf-title-clearbtn-wrapper" @click="clearbtn" v-if="!isShowBack">
                <span class="shelf-clearbtn-text">{{ $t('shelf.clearCache') }}</span>
            </div>
            <div class="shelf-title-clearbtn-wrapper" @click="back" v-if="isShowBack">
                <span class="iconfont icon-back"></span>
            </div>
            <div class="shelf-title-text-wrapper">
                <span class="shelf-title-text">{{ title }}</span>
                <span class="shelf-title-sub-text" v-show="isEditMode">{{ selectedText }}</span>

            </div>
            <div class="shelf-title-editbtn-wrapper" @click="editbtn">
                <span class="shelf-editbtn-text">{{ isEditMode ? $t('shelf.cancel') : $t('shelf.edit') }}</span>
            </div>


        </div>
    </transition>
</template>
  
<script>

import { clearLocalForage } from '@/utils/localForage';
import { storeShelfMixin } from '../../utils/mixin';
import { clearLocalStorage } from '../../utils/localStorage';
import { bookShelf } from '../../api/store';
import { getBookShelf, saveBookShelf } from '../../utils/localStorage';

export default {

    mixins: [storeShelfMixin],
    computed: {
        selectedText() {
            const shelfSelectedNum = this.shelfSelected ? this.shelfSelected.length : 0;
            if (shelfSelectedNum) {
                return this.$t('shelf.haveSelectedBook').replace('$1', shelfSelectedNum);
            }
            return this.$t('shelf.selectBook');
        }
    },
    props: {
        isShowBack: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
        }
    },
    data() {
        return {
            subVis: false,
            editText: this.$t('shelf.edit'),
        };
    },
    methods: {
        back() {
            this.setIsEditMode(false);
            this.$router.go(-1);
        },
        clearbtn() {
            console.log("清除缓存");
            clearLocalForage();
            clearLocalStorage();
            this.setShelfList([]);
            this.setShelfSelected([]);
            this.getBookShelf();
            this.simpleToast(this.$t('shelf.clearCacheSuccess'));
        },
        getBookShelf() {
            const bookList = getBookShelf();
            if (!bookList) {
                bookShelf().then(res => {
                    const bookList = res.data.bookList;
                    this.setShelfList(this.appendAppToShelf(bookList)).then(() => {
                        saveBookShelf(this.shelfList);
                    });
                });
            } else {
                this.setShelfList(bookList);
            }
        },
        async editbtn() {

            await this.setIsEditMode(!this.isEditMode);

            if (this.isEditMode) {
                this.setShelfSelected([]);
                this.shelfList.forEach(item => {
                    item.selected = false;
                    if (item.itemList) {
                        item.itemList.forEach(item => item.selected = false);
                    }
                });
            }

            this.setSearchShow(!this.isEditMode);
        }
    }
};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";

.shelf-title {
    width: 100%;
    // z-index: 130;
    height: px2rem(38);
    background: #fafafa;
    @include center;

    .shelf-title-clearbtn-wrapper {
        flex: 0 0 px2rem(100);
        @include center;
        // padding-left: px2rem();
        box-sizing: border-box;

        .shelf-clearbtn-text {
            font-size: px2rem(12);
            color: #9b9b9b;
        }

        .icon-back {
            font-size: px2rem(16);
            color: #9b9b9b;
        }
    }

    .shelf-title-text-wrapper {
        width: 100%;
        height: 100%;
        @include columnCenter;
        flex: 1;

        .shelf-title-text {
            font-size: px2rem(18);
            font-weight: bold;
        }

        .shelf-title-sub-text {
            font-size: px2rem(11);
            color: #9b9b9b;
        }
    }

    .shelf-title-editbtn-wrapper {

        flex: 0 0 px2rem(80);
        @include center;
        box-sizing: border-box;

        .shelf-editbtn-text {
            font-size: px2rem(12);
            color: #9b9b9b;
        }
    }
}
</style>
  