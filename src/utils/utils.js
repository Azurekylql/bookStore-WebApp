// 这个函数的目的是将像素值转换为 rem 单位。rem 是相对于根元素（通常是 <html>）的字体大小的单位。
export function px2rem(px) {
    const ratio = 375 / 10;
    return px / ratio;
}

// 这个函数的目的是根据当前设备的屏幕宽度动态调整像素值，通常用于计算元素的实际尺寸，以适应不同的屏幕宽度。
export function realPx(px) {
    const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth;
    const ratio = maxWidth / 375;
    return px * ratio;
}