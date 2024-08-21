<template>
    <div class="flap-card-wrapper" v-show="flapCardVisible">
        <div class="flap-card-bg" :class="{ 'animation': runFlapCardAnimation }" v-show="runFlapCardAnimation">
            <div class="flag-card" v-for="(item, index) in flapCardList" :key="index" :style="{ zIndex: item.zIndex }">
                <div class="flap-card-circle">
                    <div class="flag-card-semi-circle flag-card-semi-circle-left" :style="semiCircleStyle(item, 'left')"
                        ref="left">
                    </div>
                    <div class="flag-card-semi-circle flag-card-semi-circle-right" :style="semiCircleStyle(item, 'right')"
                        ref="right">
                    </div>
                </div>
            </div>
            <div class="point-wrapper">
                <div class="point" :class="{ 'animation': runPointAnimation }" v-for="(item, index) in  pointList "
                    :key="index">
                </div>
            </div>
        </div>

        <div class="book-card" :class="{ 'animation': runBookCardAnimation }" v-show="runBookCardAnimation">
            <div class="book-card-wrapper">
                <div class="img-wrapper">
                    <img class="img" :src="randomBook ? randomBook.cover : ''">
                </div>
                <div class="content-wrapper">
                    <div class="content-title">{{ randomBook ? randomBook.title : '' }}</div>
                    <div class="content-author sub-title-medium">{{ randomBook ? randomBook.author : '' }}</div>
                    <div class="content-category">{{ categoryText() }}</div>
                </div>
                <div class="read-btn" @click.stop="showBookDetail(randomBook)">{{ $t('home.readNow') }}</div>
            </div>

        </div>

        <div class="close-btn-wrapper" @click="close">
            <span class="iconfont icon-close "></span>
        </div>
    </div>
</template>
  
<script>

import { storeHomeMixin } from '../../utils/mixin';
import { flapCardList } from '../../utils/store';
import { categoryText } from '../../utils/store';

export default {
    props: {
        randomBook: Object
    },
    mixins: [storeHomeMixin],
    mounted() {
        console.log("123", this.randomBook);
    },
    data() {
        return {
            flapCardList: flapCardList,
            front: 0,
            back: 1,
            pointList: null,
            runFlapCardAnimation: false,
            runPointAnimation: false,
            runBookCardAnimation: false
        };
    },
    created() {
        this.pointList = [];
        for (let i = 0; i < 18; i++) {
            this.pointList.push(`point${i}`);
        }
    },
    watch: {
        flapCardVisible(v) {
            if (v) {
                this.startAllAnimation();
            }
        }
    },
    methods: {
        categoryText() {
            if (this.randomBook) {
                return categoryText(this.randomBook.category, this);
            } else return '';

        },

        showBookDetail(book) {
            console.log("book", book);
        },
        close() {
            this.setFlapCardVisible(false);
            this.stopAnimation();
        },
        semiCircleStyle(item, dir) {
            return {
                backgroundColor: `rgb(${item.r},${item.g},${item.b})`,
                backgroundSize: item.backgroundSize,
                backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
            };
        },
        rotate(index, type) {
            // type front正面圆 back背面圆
            // 首先根据index获取到对应的属性值
            const item = this.flapCardList[index];
            let dom;
            if (type === 'front') {
                dom = this.$refs.right[index];
            } else {
                dom = this.$refs.left[index];
            }
            dom.style.transform = `rotateY(${item.rotateDegree}deg)`;
            dom.style.backgroundColor = `rgb(${item.r},${item._g},${item.b})`;
        },
        // 每隔100毫秒执行一次
        flapCardRotate() {
            const front = this.flapCardList[this.front];
            const back = this.flapCardList[this.back];
            front.rotateDegree += 10;
            front._g -= 5;   // 逐渐变深
            back.rotateDegree -= 10;

            console.log("11backDegree", back.rotateDegree);   // 从180开始减
            console.log("11frontDegree", front.rotateDegree);   // 从0开始加
            if (back.rotateDegree < 90) {
                console.log("back.rotateDegree", back.rotateDegree);
                back._g += 5;  // 偷偷变回原来颜色
            }
            if (front.rotateDegree === 90 && back.rotateDegree === 90) {
                back.zIndex += 2;   //到达90度垂直临界值的时候，将back的z-Index加大，以覆盖住front
            }
            this.rotate(this.front, 'front');
            this.rotate(this.back, 'back');
            if (front.rotateDegree === 180 && back.rotateDegree === 0) {
                this.next();   // 切换到下一组
            }
        },
        next() {
            // 在切换下一组之前，先将前面这一组的值复原
            const front = this.flapCardList[this.front];
            const back = this.flapCardList[this.back];
            front.rotateDegree = 0;
            back.rotateDegree = 0;
            front._g = front.g;
            back._g = back.g;
            this.rotate(this.front, 'front');
            this.rotate(this.back, 'back');
            this.front++;
            this.back++;
            const len = this.flapCardList.length;
            if (this.front >= len) this.front = 0;
            if (this.back >= len) this.back = 0;
            // 动态设置z-index的值  100->96 99->100 98-> 99 ...
            this.flapCardList.forEach((item, index) => {
                item.zIndex = 100 - ((index - this.front + len) % len);
            });
            this.prepare();
        },
        prepare() {
            const back = this.flapCardList[this.back];
            back.rotateDegree = 180;
            back._g = back._g - 9 * 5;
            this.rotate(this.back, 'back');
        },
        startPointAnimation() {
            this.runPointAnimation = true;
            setTimeout(() => {
                this.runPointAnimation = false;
            }, 750);
        },

        // 创建翻转卡片的动画
        startFlapCardAnimation() {
            this.prepare();
            this.task = setInterval(() => {
                this.flapCardRotate();
            }, 20);
        },
        stopAnimation() {
            // 点击关闭按钮的时候，所有的定时器都要进行关闭
            if (this.task) {
                clearInterval(this.task);
            }
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            if (this.timeout2) {
                clearTimeout(this.timeout2);
            }
            this.reset();
        },
        reset() {
            this.front = 0;
            this.back = 1;
            this.flapCardList.forEach((item, index) => {
                item.zIndex = 100 - index;
                item.rotateDegree = 0;
                item._g = item.g;
                this.rotate(index, 'front');  // 让所有的图片都正确归位
                this.rotate(index, 'back');
            });
            // 进行全面的关闭
            this.runBookCardAnimation = false;
            this.runFlapCardAnimation = false;
            this.runPointAnimation = false;

        },
        startAllAnimation() {
            this.runFlapCardAnimation = true;
            this.timeout = setTimeout(() => {
                this.startFlapCardAnimation();
                this.startPointAnimation();
            }, 300);
            this.timeout2 = setTimeout(() => {
                this.stopAnimation();
                this.runBookCardAnimation = true;
            }, 2500);
        }
    }
};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";
@import "../../assets/styles/flapCard";

.flap-card-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 120;
    width: 100%;
    height: 100%;
    @include center;

    .flap-card-bg {
        position: relative;
        background-color: #ffffff;
        width: px2rem(64);
        height: px2rem(64);
        border-radius: px2rem(5);
        // 增加一个默认值（不显示）
        transform: scale(0);
        opacity: 0;

        &.animation {
            animation: flap-card-move .3s ease-in both;
        }

        // 登场的效果
        @keyframes flap-card-move {
            0% {
                transform: scale(0); // 伸缩比
                opacity: 0;
            }

            50% {
                transform: scale(1.2); // 伸缩比
                opacity: 1;
            }

            75% {
                transform: scale(0.9); // 伸缩比
                opacity: 1;
            }

            100% {
                transform: scale(1); // 伸缩比
                opacity: 1;
            }

        }


        .flag-card {
            width: px2rem(48);
            height: px2rem(48);
            border-radius: 50%;
            // 使用绝对定位将这几个圆都重叠在一起
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;

            .flap-card-circle {
                display: flex;
                width: 100%;
                height: 100%;

                .flag-card-semi-circle {
                    flex: 0 0 50%;
                    height: 100%;
                    background-repeat: no-repeat;
                    backface-visibility: hidden;

                }

                .flag-card-semi-circle-left {
                    border-radius: px2rem(24) 0 0 px2rem(24);
                    // border-radius: 50% 0 0 50%;
                    background-position: center right;
                    // 修改转动轴
                    transform-origin: right;

                }

                .flag-card-semi-circle-right {
                    border-radius: 0 px2rem(24) px2rem(24) 0;
                    background-position: center left;
                    transform-origin: left;
                }


            }

        }

        .point-wrapper {
            @include absCenter;
            z-index: 130;

            .point {
                @include absCenter;
                border-radius: 50%;
                width: px2rem(12);
                height: px2rem(12);

                &.animation {

                    // scss中的for循环 给每一个point一个不同的样式
                    @for $i from 1 to length($moves) {
                        &:nth-child(#{$i}) {
                            @include move($i)
                        }
                    }
                }
            }
        }

    }

    .book-card {
        position: relative;
        background: #ffffff;
        width: 65%;
        max-height: px2rem(420);
        border-radius: px2rem(15);
        box-sizing: border-box;

        &.animation {
            animation: scale .3s ease-in both;
        }

        // 登场的效果
        @keyframes scale {
            0% {
                transform: scale(0); // 伸缩比
                opacity: 0;
            }

            100% {
                transform: scale(1); // 伸缩比
                opacity: 1;
            }
        }


        .book-card-wrapper {
            width: 100%;
            height: 100%;
            margin-bottom: px2rem(30);
            @include columnTop;

            .img-wrapper {
                width: 100%;
                margin-top: px2rem(20);
                @include center;

                .img {
                    width: px2rem(90);
                    height: px2rem(130);
                }
            }

            .content-wrapper {
                padding: 0 px2rem(20);
                margin-top: px2rem(20);

                .content-title {
                    color: #333;
                    font-weight: bold;
                    font-size: px2rem(18);
                    line-height: px2rem(20);
                    max-height: px2rem(40);
                    text-align: center;
                    @include ellipse2(2)
                }

                .content-author {
                    margin-top: px2rem(10);
                    text-align: center;
                }

                .content-category {
                    color: #999;
                    font-size: px2rem(14);
                    margin-top: px2rem(10);
                    margin-bottom: px2rem(20);
                    text-align: center;
                }
            }

            .read-btn {
                position: absolute;
                bottom: 0;
                left: 0;
                z-index: 122;
                width: 100%;
                height: px2rem(40);
                border-radius: 0 0 px2rem(15) px2rem(15);
                padding: px2rem(15) 0;
                text-align: center;
                color: white;
                font-size: px2rem(14);
                box-sizing: border-box;
                background: $color-blue;
            }
        }
    }

    .close-btn-wrapper {
        position: absolute;
        left: 0;
        bottom: px2rem(30);

        z-index: 121;
        width: 100%;
        color: #ffffff;
        @include center;

        .icon-close {
            height: px2rem(35);
            width: px2rem(35);
            font-size: px2rem(20);
            border-radius: 50%;
            background-color: #434343;
            @include center;
        }
    }
}
</style>
  