import Vue from 'vue';
import VueI18N from 'vue-i18n';
import en from './en';
import cn from './cn';
import { getLocale, saveLocale } from '@/utils/localStorage';

Vue.use(VueI18N);

const messages = {
    en,
    cn
};

let locale = getLocale();
if (!locale) {
    locale = 'cn';
    saveLocale(locale);
}

export default new VueI18N({
    locale,
    messages
});
