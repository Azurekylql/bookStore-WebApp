<template>
    <transition name="slide-up">
        <div class="store-menu" v-show="isEditMode">
            <div class="shelf-menu-tab-wrapper" v-for="item in tabs" :key="item.index" @click="onTabClick(item)">
                <div class="shelf-menu-tab" :class="{ 'is-selected': isSelected }">
                    <div class="iconfont icon-private tab-icon" v-if="item.index === 1 && !isPrivate"></div>
                    <div class="iconfont icon-private-see tab-icon" v-if="item.index === 1 && isPrivate"></div>

                    <div class="iconfont icon-download tab-icon" v-if="item.index === 2 && !isDownload"></div>
                    <div class="iconfont icon-download-remove tab-icon" v-if="item.index === 2 && isDownload"></div>

                    <div class="iconfont icon-move tab-icon" v-if="item.index === 3"></div>
                    <div class="iconfont icon-shelf tab-icon" v-if="item.index === 4"></div>
                    <div class="tab-text" :class="{ 'remove-text': item.index === 4 }">{{ label(item) }}</div>
                </div>
            </div>

        </div>
    </transition>
</template>
  
<script>

import { storeShelfMixin } from '../../utils/mixin';
import {
    saveBookShelf
    // , removeLocalStorage 
} from '../../utils/localStorage';
import { download } from '../../api/store';
import { removeLocalForage } from '@/utils/localForage';

export default {

    mixins: [storeShelfMixin],
    data() {
        return {
            popupMenu: null
        };
    },
    methods: {
        onComplete() {
            this.hidePopup();
            this.setIsEditMode(false);
            saveBookShelf(this.shelfList);
        },
        onTabClick(item) {
            if (!this.isSelected) return;
            if (item.index === 1) {
                this.showPrivate();
            } else if (item.index === 2) {
                this.showDownload();
            } else if (item.index === 3) {
                this.showGroupDialog();
            } else if (item.index === 4) {
                this.showRemove();
            }
        },
        label(item) {
            if (item.index === 1) {
                return this.isPrivate ? item.label2 : item.label;
            } else if (item.index === 2) {
                return this.isDownload ? item.label2 : item.label;
            } else {
                return item.label;
            }
        },
        hidePopup() {
            this.popupMenu.hide();
        },
        showPrivate() {
            this.popupMenu = this.popup({
                title: this.isPrivate ? this.$t('shelf.closePrivateTitle') : this.$t('shelf.setPrivateTitle'),
                btn: [
                    {
                        text: this.isPrivate ? this.$t('shelf.close') : this.$t('shelf.open'),
                        click: () => {
                            this.setPrivate();
                        }
                    },
                    {
                        text: this.$t('shelf.cancel'),
                        click: () => {
                            this.hidePopup();
                        }
                    }
                ]
            }).show();
        },
        setPrivate() {
            let isPrivate;
            if (this.isPrivate) {
                isPrivate = false;
            } else {
                // 如果选中的图书都不是或者有部分不是私密阅读，就将选中的全部设置为私密阅读
                isPrivate = true;
            }
            this.shelfSelected.forEach(book => {
                book.private = isPrivate;
            });

            this.onComplete();

            // 弹框弹出信息提示
            if (isPrivate) {
                this.toast({ text: this.$t('shelf.setPrivateSuccess') }).show();
            } else {
                this.toast({ text: this.$t('shelf.closePrivateSuccess') }).show();
            }
        },

        showDownload() {
            this.popupMenu = this.popup({
                title: this.isDownload ? this.$t('shelf.removeDownloadTitle') : this.$t('shelf.setDownloadTitle'),
                btn: [
                    {
                        text: this.isDownload ? this.$t('shelf.delete') : this.$t('shelf.open'),
                        click: () => {
                            this.setDownload();
                        }
                    },
                    {
                        text: this.$t('shelf.cancel'),
                        click: () => {
                            this.hidePopup();
                        }
                    }
                ]
            }).show();
        },
        async setDownload() {
            this.onComplete();
            if (this.isDownload) {
                await this.removeSelectedBook();

            } else {
                // 如果选中的图书都不是或者有部分不是已下载，就将选中的全部设置为已下载
                // 下载选中的图书

                await this.downloadSelectedBook();
                saveBookShelf(this.shelfList);
                this.simpleToast(this.$t('shelf.setDownloadSuccess'));
            }

        },
        async removeSelectedBook() {
            // for (let i = 0; i < this.shelfSelected.length; i++) {
            //     await this.removeBook(this.shelfSelected[i]).then(book => {
            //         book.cache = false;
            //     });
            // }
            // 在remove这里，其实不需要每本书都按顺序删除，因此可以考虑使用promise.all
            Promise.all(this.shelfSelected.map(book => this.removeBook(book))).then(books => {
                books.map(book => {
                    book.cache = false;
                });
                saveBookShelf(this.shelfList);
                this.simpleToast(this.$t('shelf.removeDownloadSuccess'));
            });
        },
        removeBook(book) {
            return new Promise((resolve) => {
                // removeLocalStorage(`${book.categoryText}/${book.fileName}-info`);
                removeLocalForage(`${book.fileName}`);
                resolve(book);
            });
        },
        async downloadSelectedBook() {
            for (let i = 0; i < this.shelfSelected.length; i++) {
                await this.downloadBook(this.shelfSelected[i]).then(book => {
                    book.cache = true;
                });
            }
            // 在下载这里之所以使用for循环加await，是为了让每本书能够按顺序下载并显示进度条。
        },
        downloadBook(book) {

            const toast = this.toast({ text: '下载开始' });
            toast.continueShow();

            return new Promise((resolve, reject) => {
                // 调用api
                // VUE_APP_EPUB_URL

                download(book, res => {
                    toast.remove();
                    resolve(res);
                }, reject, ProgressEvent => {
                    console.log("ProgressEvent", ProgressEvent);
                    const progress = Math.floor(ProgressEvent.loaded / ProgressEvent.total * 100) + '%';
                    const text = this.$t('shelf.progressDownload').replace('$1', `${book.fileName}.epub(${progress})`);
                    toast.updateText(text);
                });
            });
        },

        showRemove() {
            let title;
            // 选一本书和选择两本书的提示不同
            if (this.shelfSelected.length === 1) {
                title = this.$t('shelf.removeBookTitle').replace('$1', `《${this.shelfSelected[0].title}》`);
            } else {
                title = this.$t('shelf.removeBookTitle').replace('$1', this.$t('shelf.selectedBooks'));
            }
            this.popupMenu = this.popup({
                title: title,
                btn: [
                    {
                        text: this.$t('shelf.removeBook'),
                        type: 'danger',
                        click: () => {
                            this.removeSelected();
                        }
                    },
                    {
                        text: this.$t('shelf.cancel'),
                        click: () => {
                            this.hidePopup();
                        }
                    }
                ]
            }).show();
        },
        removeSelected() {
            let shelfList;
            this.shelfSelected.forEach(selected => {
                shelfList = this.shelfList.filter(item => item !== selected);
            });

            this.setShelfList(shelfList).then(() => {
                this.onComplete();
            });
        },
        showGroupDialog() {
            this.dialog().show();
        }
    },
    mounted() {

    },
    computed: {
        isSelected() {
            // 选中条目多于1
            return this.shelfSelected && this.shelfSelected.length > 0;
        },
        tabs() {
            return [
                {
                    label: this.$t('shelf.private'),
                    label2: this.$t('shelf.noPrivate'),
                    index: 1
                },
                {
                    label: this.$t('shelf.download'),
                    label2: this.$t('shelf.delete'),
                    index: 2
                },
                {
                    label: this.$t('shelf.move'),
                    index: 3
                },
                {
                    label: this.$t('shelf.remove'),
                    index: 4
                }
            ];
        },
        isPrivate() {
            if (!this.isSelected) {
                return false;
            } else {
                // 只有当选中的全是私密阅读isPrivate才是true
                return this.shelfSelected.every(item => item.private);
            }
        },
        isDownload() {
            console.log("this.shelfSelected", this.shelfSelected);

            if (!this.isSelected) {
                return false;
            } else {
                // 只有当选中的全是下载了的 isDownload才是true
                return this.shelfSelected.every(item => item.cache);
            }

        },
    }

};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";

.store-menu {
    width: 100%;
    position: absolute;
    z-index: 120;
    bottom: 0;
    left: 0;
    display: flex;
    height: px2rem(42);
    background: #ffffff;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);

    .shelf-menu-tab-wrapper {
        flex: 1;
        width: 25%;
        height: 100%;



        .shelf-menu-tab {
            width: 100%;
            height: 100%;
            opacity: .5;
            @include columnCenter;

            &.is-selected {
                opacity: 1;
            }

            .tab-icon {
                font-size: px2rem(20);
                color: #666;

                &.icon-shelf {
                    color: $color-pink;
                }

                &.icon-download {
                    font-size: px2rem(22);
                }


            }

            .tab-text {
                margin-top: px2rem(5);
                font-size: px2rem(12);
                color: #666;
                opacity: .5;

                &.remove-text {
                    color: $color-pink;
                }

            }
        }
    }
}
</style>
  