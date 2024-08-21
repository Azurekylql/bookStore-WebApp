// 装的是vuex3所以不支持用下面这个语句
// import { createStore } from 'vuex';

import Vue from 'vue';
import Vuex from 'vuex';
import book from './modules/book.js';
import store from './modules/store.js';
import getters from './getters.js';
import actions from './actions.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        book,
        store
    },
    getters,
    actions
});

