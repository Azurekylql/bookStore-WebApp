<template>
    <div class="book-mark" :style="style" ref="bookmark">
    </div>
</template>
  
<script>
import { ebookMixin } from '../../utils/mixin';
import { px2rem } from '../../utils/utils';
export default {
    mixins: [ebookMixin],
    props: {
        width: Number,
        height: Number,
        color: String
    },
    mounted() {
        this.refresh();
    },
    computed: {
        style() {
            if (this.color) return { borderColor: `${this.color} ${this.color} transparent ${this.color}`};
            else return {};
        }
    },
    methods: {
        refresh() {
            if (this.height && this.width) {
                this.$refs.bookmark.style.borderWidth = `${px2rem(this.height - 10)}rem ${px2rem(this.width / 2)}rem ${px2rem(10)}rem ${px2rem(this.width / 2)}rem`;
            }
        }
    }

};
</script>
  
<style lang="scss" scoped>
@import "../../assets/styles/global";

.book-mark {
    // 用css开发一个三角形
    width: 0;
    height: 0;
    border-width: px2rem(50) px2rem(10) px2rem(10) px2rem(10);
    border-style: solid;
    border-color: white white transparent white;
}
</style>
  