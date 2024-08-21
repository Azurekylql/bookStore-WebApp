// 使用mixin实现多个组件复用代码 解构
// 复用的可以是computed属性 方法等

import { mapGetters, mapActions } from 'vuex';
import { themeList } from './book';
import { addCss, removeAllCss } from './book';
import { getBookmark, getReadTime, saveLocation } from './localStorage';

export const ebookMixin = {
    computed: {
        ...mapGetters([
            'fileName',
            'menuVisible',
            'settingVisible',
            'defaultFontSize',
            'currentBook',
            'defaultFontFamily',
            'fontFamilyVisible',
            'defaultTheme',
            'bookAvailable',
            'progress',
            'section',
            'isPaginating',
            'navigation',
            'cover',
            'metadata',
            'paginate',
            'pagelist',
            'offsetY',
            'isBookmark',
            'speakingIconBottom'
        ]),
        themeList() {
            return themeList(this);
        },
        getSectionName() {
            return this.section ? this.navigation[this.section].label : this.fileName.split('/')[1];
        }
    },
    methods: {
        ...mapActions([
            'setMenuVisible',
            'setFileName',
            'setSettingVisible',
            'setDefaultFontSize',
            'setCurrentBook',
            'setDefaultFontFamily',
            'setFontFamilyVisible',
            'setDefaultTheme',
            'setBookAvailable',
            'setProgress',
            'setSection',
            'setIsPaginating',
            'setNavigation',
            'setCover',
            'setMetadata',
            'setPaginate',
            'setPagelist',
            'setOffsetY',
            'setIsBookmark',
            'setSpeakingIconBottom'
        ]),
        initGlobalStyle() {
            removeAllCss();
            const base = process.env.VUE_APP_RES_URL + '/theme/';
            let path;
            switch (this.defaultTheme) {
                case 'Default':
                    path = 'theme_default.css';
                    break;
                case 'Eye':
                    path = 'theme_eye.css';
                    break;
                case 'Gold':
                    path = 'theme_gold.css';
                    break;
                case 'Night':
                    path = 'theme_night.css';
                    break;
                default:
                    path = 'theme_default.css';
            }

            addCss(base + path);
        },
        getReadTime() {
            const readTime = getReadTime(this.fileName) ? getReadTime(this.fileName) : 0;
            return this.$t('book.haveRead').replace('$1', Math.ceil(readTime / 60));
        },
        refreshLocation() {

            console.log("refreshLocation进入了");

            // 先要求这俩都存在 再来获取currentLocation.start.cfi，否则会引发报错
            const currentLocation = this.currentBook.rendition.currentLocation();
            if (currentLocation && currentLocation.start) {
                console.log("refreshLocation进入了 条件");
                const startCfi = currentLocation.start.cfi;
                const progress = this.currentBook.locations.percentageFromCfi(startCfi);
                this.setProgress(Math.floor(progress * 100));
                this.setSection(currentLocation.start.index);
                saveLocation(this.fileName, startCfi);
                const bookmark = getBookmark(this.fileName);
                if (bookmark) {
                    if (bookmark.some(item => item.cfi === startCfi)) {
                        this.setIsBookmark(true);
                    } else {
                        this.setIsBookmark(false);
                    }
                } else {
                    this.setIsBookmark(false);
                }

            }
        },
        // else if (
        //     this.currentBook.rendition.location && this.currentBook.rendition.location.start && this.currentBook.rendition.location.start.cfi) {
        //     const startCfi = this.currentBook.rendition.location.start.cfi;
        //     const progress = this.currentBook.locations.percentageFromCfi(startCfi);
        //     this.setProgress(Math.floor(progress * 100));
        //     this.setSection(this.currentBook.rendition.location.start.index);  // 更新当前所在章节
        //     saveLocation(this.fileName, startCfi);

        //     console.log("reflash");

        //     const bookmark = getBookmark(this.fileName);
        //     if (bookmark) {
        //         if (bookmark.some(item => item.cfi === startCfi)) {
        //             this.setIsBookmark(true);
        //         } else {
        //             this.setIsBookmark(false);
        //         }
        //     } else {
        //         this.setIsBookmark(false);   // 如果本地存储中连书签这个数组都不存在的话，直接返回false
        //     }
        // }
        display(target, cb) {
            if (target) {
                console.log("display的target是：", target);
                this.currentBook.rendition.display(target).then(() => {
                    console.log("display的target是111", target);
                    this.refreshLocation();
                    if (cb) cb();
                });
            } else {
                console.log("display的target是：空");
                this.currentBook.rendition.display().then(() => {
                    this.refreshLocation();
                    if (cb) cb();
                });
            }
        },
        hideTitleAndMenu() {
            // this.$store.dispatch('setMenuVisible', false);
            this.setMenuVisible(false);
            this.setFontFamilyVisible(false);
            this.setSettingVisible(-1);
        },
    },

};

export const storeHomeMixin = {
    computed: {
        ...mapGetters([
            'offsetY',
            'hotSearchOffsetY',
            'flapCardVisible'
        ])
    },
    methods: {
        ...mapActions([
            'setOffsetY',
            'setHotSearchOffsetY',
            'setFlapCardVisible'
        ]),

        showBookDetail(book) {
            // 查看书籍详情，其实就是通过router的push方法，跳转路由来实现。
            this.$router.push({
                path: '/store/detail',
                query: {
                    fileName: book.fileName,
                    categoryText: book.categoryText,
                }
            });
        }
    }
};

export const storeShelfMixin = {
    computed: {
        ...mapGetters([
            'isEditMode',
            'shelfList',
            'shelfSelected',
            'shelfTitleVisible',
            'offsetY',
            'shelfCategory',
            'currentType',
            'showSearch'
        ])
    },
    methods: {
        ...mapActions([
            'setIsEditMode',
            'setShelfList',
            'setShelfSelected',
            'setShelfTitleVisible',
            'setOffsetY',
            'setShelfCategory',
            'setCurrentType',
            'setSearchShow'
        ]),

        showBookDetail(book) {
            // 查看书籍详情，其实就是通过router的push方法，跳转路由来实现。
            this.$router.push({
                path: '/store/detail',
                query: {
                    fileName: book.fileName,
                    categoryText: book.categoryText,
                }
            });
        },

        appendAppToShelf(list) {
            list.push({
                id: -1,
                type: 3
            });
            return list;
        },

        removeAppFromShelf(list) {
            return list.filter(item => item.type !== 3);
        }
    }
};
