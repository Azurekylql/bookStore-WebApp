<template>
    <div class="ebook-slide-content">
        <div class="slide-contents-search-wrapper">
            <div class="slide-contents-search-input-wrapper">
                <div class="slide-contents-search-icon">
                    <span class="iconfont icon-search"></span>
                </div>
                <input type="text" class="slide-contents-search-input" :placeholder="$t('book.searchHint')"
                    @click="showSearchPage" v-model="searchText" @keyup.enter.exact="search">
            </div>
            <div class="slide-contents-search-cancel" @click="hideSearchPage" v-if="searchVisible">{{ $t('book.cancel') }}
            </div>
        </div>

        <div class="slide-contents-book-wrapper" v-show="!searchVisible">
            <div class="slide-contents-book-img-wrapper">
                <img :src="cover" class="slide-contents-book-img">
            </div>

            <div class="slide-contents-book-info-wrapper">
                <div class="slide-contents-book-title">{{ metadata.title }}</div>
                <div class="slide-contents-book-author">{{ metadata.creator }}</div>
            </div>
            <div class="slide-contents-book-progress-wrapper">
                <div class="slide-contents-book-progress">
                    <span class="progress">{{ progress + '%' }}</span>
                    <span class="progress-text">{{ $t('book.haveRead2') }}</span>
                </div>
                <div class="slide-contents-book-readtime">{{ getReadTime() }}</div>
            </div>
        </div>

        <Scroll class="slide-contents-list" :top="156" :bottom="48" ref="scroll" v-show="!searchVisible">
            <div class="slide-contents-item" v-for="(item, index) in navigation " :key="index">
                <span class="slide-contents-item-label" :class="{ 'selected': section === index ? true : false }"
                    :style="contentItemStyle(item)" @click="displayNowSection(item.href)">{{ item.label }}</span>
                <span class="slide-contents-item-page"></span>
            </div>
        </Scroll>

        <Scroll class="slide-search-list" :top="66" :bottom="48" v-show="searchVisible">
            <div class="slide-search-item" v-for="(item, index) in searchList" :key="index" v-html="item.excerpt"
                @click="changeToSearch(item.cfi)"></div>
        </Scroll>
    </div>
</template>
  
<script>

import { ebookMixin } from '../../utils/mixin';
import Scroll from '../../components/common/Scroll.vue';
import { px2rem } from '../../utils/utils';
// import { getLocation } from '../../utils/localStorage';


export default {

    mixins: [ebookMixin],
    data() {
        return {
            searchVisible: false,
            searchList: [],
            searchText: ''
        };
    },
    methods: {

        changeToSearch(cfi) {
            this.currentBook.rendition.display(cfi);
            this.setMenuVisible(false);
            this.setSettingVisible(-1);
            // 文章中的高亮显示，通过eupbjs库自带的方法实现
            this.currentBook.rendition.annotations.highlight(cfi);
        },

        // 全文搜素功能 epubjs库提供,异步返回结果
        search() {
            if (this.searchText && this.searchText !== '') {
                this.doSearch(this.searchText).then((res) => {
                    this.searchList = res;
                    this.searchList.map(item => {
                        item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`);
                        return item;
                    });
                });

            }
        },
        async doSearch(q) {
            return Promise.all(
                // this.currentBook.spine.spineItems表示的是当前书籍的所有章节
                // 调用section的load方法，然后通过bind 将this.currentBook作为section的上下文传入进去
                // 此时section能获取到对应的文本信息
                this.currentBook.spine.spineItems.map(section => section.load(this.currentBook.load.bind(this.currentBook))
                    .then(section.find.bind(section, q))
                    // 最后都要使用unload方法对资源进行释放
                    .finally(section.unload.bind(section)))
                // 对所有章节都遍历搜索一遍，然后将结果的二维数组转成一维数组
                // apply() 方法将数组中的所有元素作为参数逐一传入到函数中,使得results能降维
            ).then(results => Promise.resolve([].concat.apply([], results)));
        },

        displayNowSection(href) {

            this.display(href, () => {
                console.log('进入了display');

                this.hideTitleAndMenu();
            });
            // this.currentBook.rendition.display(href).then(() => {
            //     console.log('123');
            //     const currentLocation = this.currentBook.rendition.currentLocation();
            //     console.log("this.currentBook", this.currentBook);
            //     console.log("this.currentBook.rendition", this.currentBook.rendition);

            //     console.log("currentLocation123", currentLocation);
            //     this.refreshLocation();
            //     this.setSettingVisible(-1);
            //     this.setMenuVisible(false);
            // });
        },
        contentItemStyle(item) {
            return {
                marginLeft: `${px2rem(item.level * 10)}rem`
            };
        },
        hideSearchPage() {
            this.searchVisible = false;
            this.searchText = '';
            this.searchList = null;
        },
        showSearchPage() {
            this.searchVisible = true;
        }
    },
    components: {
        Scroll
    },
    mounted() {
        this.currentBook.ready.then(() => {
            this.doSearch("added").then((res) => {
                console.log(res);
            });
        });
    }
};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";

.ebook-slide-content {
    width: 100%;
    font-size: 0; // 消除空格占据一定空间的方法

    .slide-contents-search-wrapper {
        display: flex;
        margin: px2rem(20) 0 px2rem(10) 0;
        padding: 0 px2rem(15);
        box-sizing: border-box;

        .slide-contents-search-input-wrapper {
            flex: 1;
            @include center;

            .slide-contents-search-icon {
                flex: 0 0 px2rem(28);
                font-size: px2rem(12);
                @include center;
                font-weight: 600;
                color: #8d8d8d
            }

            .slide-contents-search-input {
                flex: 1;
                width: 100%;
                height: px2rem(32);
                background: none;
                border: none;
                outline: none; // 去除选中状态边框
                color: #8d8d8d;
                padding-left: px2rem(6);

            }
        }

        .slide-contents-search-cancel {
            flex: 0 0 px2rem(50);
            font-size: px2rem(14);
            @include right;
        }
    }

    .slide-contents-book-wrapper {

        display: flex;
        // margin: px2rem(20) 0 px2rem(10) 0;
        padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
        box-sizing: border-box;
        height: px2rem(90);
        font-size: px2rem(14);

        .slide-contents-book-img-wrapper {
            flex: 0 0 px2rem(45);


            .slide-contents-book-img {
                height: px2rem(60);
                width: px2rem(45);

            }
        }


        .slide-contents-book-info-wrapper {
            flex: 1;
            padding: 0 px2rem(10);
            // display: flex;
            // flex-direction: column;
            // justify-content: center;
            width: px2rem(153.75);


            .slide-contents-book-title {
                // 要注意 缩略显示都要指定外层盒子的宽度 否则会被撑开
                // 375*0.85-30-20-45-70 = 153.75

                line-height: px2rem(16);
                // @include ellipse;
                display: -webkit-box;
                @include ellipse2(3);

            }

            .slide-contents-book-author {
                @include ellipse;
                font-size: px2rem(12);
                margin-top: px2rem(5);
            }
        }

        .slide-contents-book-progress-wrapper {
            flex: 0 0 px2rem(70);
            display: flex;
            flex-direction: column;
            margin-top: px2rem(10);
            // justify-content: center;
            align-items: flex-start;


            .slide-contents-book-progress {
                display: flex;

                .progress-text {
                    // flex: 1;
                    font-size: px2rem(12);
                }
            }

            .slide-contents-book-readtime {
                font-size: px2rem(12);
            }

        }
    }

    .slide-contents-list {
        padding: 0 px2rem(15);
        box-sizing: border-box;
        // width: px2rem(153.75);

        .slide-contents-item {
            padding: px2rem(20) 0;
            box-sizing: border-box;
            display: flex;

            .slide-contents-item-label {
                @include ellipse;
                // 添加flex能自动计算宽度 以成功省略
                flex: 1;
                font-size: px2rem(14);
                line-height: px2rem(16); // 开发英文类app的小技巧 设置行号 否则单词上下可能显示不全

            }

            // .slide-contents-item-page {}
        }
    }

    .slide-search-list {
        padding: 0 px2rem(15);
        box-sizing: border-box;

        .slide-search-item {
            font-size: px2rem(14);
            line-height: px2rem(16);
            padding: px2rem(20) 0;
            box-sizing: border-box;
        }
    }

}
</style>
  