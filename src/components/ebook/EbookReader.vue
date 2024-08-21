<!--动态路由组件 -->
<template>
    <div class="ebook-reader">
        <!-- 接收参数：{{ this.$route.params.filename }} -->
        <div id="read"></div>
        <!-- 通过蒙版实现书签 -->
        <div class="ebook-reader-mask" @click="onMaskClick" @touchmove="move" @touchend="moveEnd"
            @mousedown.left="onMouseEnter" @mousemove.left="onMouseMove" @mouseup.left="onMouseUp"></div>
    </div>
</template>
  
<script>

import { ebookMixin } from '../../utils/mixin';
import {
    getFontFamily,
    saveFontFamily,
    getFontSize,
    saveFontSize,
    saveTheme,
    getTheme,
    getLocation
} from '../../utils/localStorage';
import { flatten } from '../../utils/book';

import Epub from 'epubjs';
import { getLocalForage } from '@/utils/localForage';

// global 对象是一个预定义的全局对象，几乎所有的全局变量和函数都是它的属性
// 通过将 Epub 类赋值给 global.epub，你实际上是把它作为一个全局可访问的变量，这样在任何其他组件或脚本文件中，都不需要通过模块系统（如 require 或 import）来导入 Epub 类，就可以直接使用它。
global.epub = Epub;

export default {
    mixins: [ebookMixin],
    data() {
        return {
            // offsetYstart: null,
            // offsetYend: null,
            // timeStart: 0,
            // timeEnd: 0,
        };
    },
    methods: {
        // 1.左键按下
        // 2.左键按下然后移动
        // 3.左键松开
        // 4.鼠标还原
        onMouseEnter(e) {
            this.mouseState = 1;
            this.mouseStartTime = e.timeStamp;
            e.preventDefault();
            e.stopPropagation();
        },
        onMouseMove(e) {
            if (this.mouseState === 1) {
                this.mouseState = 2;
            } else if (this.mouseState === 2) {

                let offsetY = 0;
                if (this.firstOffsetY) {
                    offsetY = e.clientY - this.firstOffsetY;
                    this.setOffsetY(offsetY);
                } else {
                    this.firstOffsetY = e.clientY; // 直接通过e.clientY获取鼠标当前所在的位置
                }
            }
            e.preventDefault();
            e.stopPropagation();

        },
        onMouseUp(e) {
            if (this.mouseState === 2) {
                this.setOffsetY(0);
                this.firstOffsetY = null;
                this.mouseState = 3;
            } else {
                this.mouseState = 4;  // 点击事件 执行onMaskClick
            }
            this.mouseEndTime = e.timeStamp;
            this.mouseDiffTime = this.mouseEndTime - this.mouseStartTime;
            if (this.mouseDiffTime < 100) this.mouseState = 4;  // 点击事件 执行onMaskClick

            e.preventDefault();
            e.stopPropagation();
        },

        // 移动端触摸事件
        move(e) {
            let offsetY = 0;
            if (this.firstOffsetY) {
                offsetY = e.changedTouches[0].clientY - this.firstOffsetY;
                this.setOffsetY(offsetY);
            } else {
                this.firstOffsetY = e.changedTouches[0].clientY;
            }

        },
        moveEnd() {
            this.setOffsetY(0);
            this.firstOffsetY = null;
        },

        onMaskClick(e) {
            if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
                return;
            }
            // console.log("e", e);
            const offsetX = e.offsetX;
            const width = window.innerWidth;
            if (offsetX > 0 && offsetX < width * 0.3) {
                this.prevPage();
            } else if (offsetX > 0 && offsetX > width * 0.7) {
                this.nextPage();
            } else {
                this.toggleTitleAndMenu();
            }

        },
        // ...mapActions(['setMenuVisible', 'setFileName']),
        prevPage() {
            if (this.rendition) {
                // 调用电子书渲染的对象方法让它返回上一页
                this.rendition.prev().then(() => {
                    this.refreshLocation();
                });
            }
            this.hideTitleAndMenu();
        },
        nextPage() {
            if (this.rendition) {
                // 调用电子书渲染的对象方法让它返回下一页
                this.rendition.next().then(() => {
                    this.refreshLocation();
                });
            }
            this.hideTitleAndMenu();
        },
        toggleTitleAndMenu() {
            // this.$store.dispatch('setMenuVisible', !this.menuVisible);
            this.setMenuVisible(!this.menuVisible);
            if (this.fontFamilyVisible) this.setFontFamilyVisible(false);

        },
        initFontSize() {
            const fontSize = getFontSize(this.fileName);
            if (!fontSize) {
                saveFontSize(this.fileName, this.defaultFontSize);
            } else {
                this.rendition.themes.fontSize(fontSize + 'px');
                this.setDefaultFontSize(fontSize);
            }
        },
        initFontFamily() {
            const fontFamily = getFontFamily(this.fileName);
            if (!fontFamily) {
                saveFontFamily(this.fileName, this.defaultFontFamily);
            } else {
                this.rendition.themes.font(fontFamily);
                this.setDefaultFontFamily(fontFamily);
            }
        },
        initTheme() {
            // 进行主题的注册
            this.themeList.forEach(theme => {
                this.rendition.themes.register(theme.name, theme.style);
            });

            let theme = getTheme();
            if (!theme) {
                theme = this.themeList[0].name;
                saveTheme(this.defaultTheme);
            }
            this.setDefaultTheme(theme);
            this.rendition.themes.select(theme);
        },

        initRendition() {// 将电子书进行渲染  需要绑定在一个dom上（dom id）
            this.rendition = this.book.renderTo('read', {
                width: window.innerWidth,
                height: window.innerHeight,
                // method: 'default'  // 为了在微信上能正常显示
            });

            // 进行显示

            let location = getLocation(this.fileName);

            this.display(location, () => {
                this.initTheme();
                this.initFontSize();
                this.initFontFamily();
                this.initGlobalStyle();
            });


            // 钩子手动添加样式文件
            this.rendition.hooks.content.register(contents => {
                Promise.all([
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`),
                ]).then(() => {
                    console.log("字体加载完成");
                });
            });
        },
        parseBook() {
            // 获取电子书的封面图片等
            this.book.loaded.cover.then(cover => {
                this.book.archive.createUrl(cover).then(url => {
                    this.setCover(url);
                });
            });

            this.book.loaded.metadata.then(metadata => {
                this.setMetadata(metadata);
                console.log(this.metadata);
            });

            // 获取书本目录信息
            this.book.loaded.navigation.then(navigation => {
                // this.setMetadata(metadata);

                const navItem = flatten(navigation.toc);

                function find(item, level = 0) {
                    if (!item.parent) return level;
                    return find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level);
                }

                navItem.forEach(item => {
                    item.level = find(item);
                });

                this.setNavigation(navItem);

                console.log(navItem);

            });
        },
        initGesture() {
            //事件绑定
            this.rendition.on('touchstart', (event) => {
                this.touchstartX = event.changedTouches[0].clientX;
                this.timeStart = event.timeStamp;

            });
            this.rendition.on('touchend', (event) => {

                this.touchendX = event.changedTouches[0].clientX;
                this.timeEnd = event.timeStamp;

                // 右滑是负数 左滑是正数
                const offsetX = this.touchstartX - this.touchendX;
                const timeDiff = this.timeEnd - this.timeStart;

                // 设置时间阈值和滑动阈值
                if (timeDiff < 500 && offsetX < -40) {
                    this.prevPage();
                } else if (timeDiff < 500 && offsetX > 40) {
                    this.nextPage();
                } else {
                    this.toggleTitleAndMenu();  //否则就显示菜单栏
                }
                // 禁止时间的默认行为和传播
                // event.preventDefault();
                event.stopPropagation();
            });
        },

        initEpub(url) {

            // 获得电子书的下载链接之后，使用epub库进行实例化
            // Epubjs允许我们传入电子书的url或者一个电子书的blob对象
            this.book = new Epub(url);
            this.setCurrentBook(this.book).then(() => {
                this.initRendition();
                this.initGesture();
                this.parseBook();  // 解析电子书的内容
            });

            // 等book中的全部内容都解析完成之后，就调用分页方法进行分页
            this.book.ready.then(() => {
                return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16));
            }).then(() => {

                // console.log(locations);
                this.setBookAvailable(true);
                // 分页完成之后再调用一次刷新定位的方法
                this.refreshLocation();

            });

        },

    },
    mounted() {
        const books = this.$route.params.filename.split('|');
        const fileName = books[1];
        getLocalForage(fileName, (err, blob) => {
            if (!err && blob) {
                this.setFileName(books.join('/')).then(() => {
                    this.initEpub(blob);
                });
                console.log("找到缓存在数据库中的电子书");
            } else {
                console.log("没找到缓存，在线获取电子书");
                this.setFileName(books.join('/')).then(() => {
                    // 192.168.31.1 // 192.168.139.1 // 192.168.252.84: // 外网ip 223.160.231.153
                    // 将filename拼接成nginx目录地址
                    // const url = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName + '.epub';
                    const url = process.env.VUE_APP_EPUB_URL + '/' + this.fileName + '.epub';
                    this.initEpub(url);
                });
            }
        });


    }
};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";

.ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .ebook-reader-mask {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 100%;
        background: transparent;
    }
}
</style>
  