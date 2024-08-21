/* eslint-disable no-extend-native */
Array.prototype.pushWithoutDuplicate = function () {
    for (let i = 0; i < arguments.length; i++) {
        // 只有当数组中不存在该元素时才添加
        if (this.indexOf(arguments[i]) === -1) {
            this.push(arguments[i]);
        }
    }
};