<template>
    <div class="ebook-header">
        <span class="ebook-header-text">{{ this.progress + '%' }}</span>
    </div>
</template>
  
<script type="text/ecmascript-6">
import { ebookMixin } from '../../utils/mixin';

export default {
    mixins: [ebookMixin]
};
</script>
  
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.ebook-header {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 100;
    width: 100%;
    height: px2rem(48);
    padding: 0 px2rem(15);
    box-sizing: border-box;
    overflow: hidden;
    @include right;
    // background-color: aqua;

    .ebook-header-text {
        font-size: px2rem(12);
        color: #6d7178;
    }
}
</style>