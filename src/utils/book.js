import { realPx } from '../utils/utils.js';

export const FONT_SIZE_LIST = [
    { fontSize: 12 },
    { fontSize: 14 },
    { fontSize: 16 },
    { fontSize: 18 },
    { fontSize: 20 },
    { fontSize: 22 },
    { fontSize: 24 }
];

export const FONT_FAMILY = [
    { font: 'Default' },
    { font: 'Cabin' },
    { font: 'Days One' },
    { font: 'Montserrat' },
    { font: 'Tangerine' }
];

export function themeList(vue) {
    return [
        {
            // 别名，使用国际化方式来设置
            alias: vue.$t('book.themeDefault'),
            // 传入this.book中select方法的名称
            name: 'Default',
            style: {
                body: {
                    'color': '#4c5059',
                    'background': '#cecece',
                    'padding-top': `${realPx(48)}px!important`,
                    'padding-bottom': `${realPx(48)}px!important`
                },
                // img: {
                //     'width': '100%'
                // },
                // '.epubjs-hl': {
                //     'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
                // }
            }
        },
        {
            alias: vue.$t('book.themeGold'),
            name: 'Gold',
            style: {
                body: {
                    'color': '#5c5b56',
                    'background': '#c6c2b6',
                    'padding-top': `${realPx(48)}px!important`,
                    'padding-bottom': `${realPx(48)}px!important`
                },
                // img: {
                //     'width': '100%'
                // },
                // '.epubjs-hl': {
                //     'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
                // }
            }
        },
        {
            alias: vue.$t('book.themeEye'),
            name: 'Eye',
            style: {
                body: {
                    'color': '#404c42',
                    'background': '#a9c1a9',
                    'padding-top': `${realPx(48)}px!important`,
                    'padding-bottom': `${realPx(48)}px!important`
                },
                // img: {
                //     'width': '100%'
                // },
                // '.epubjs-hl': {
                //     'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
                // }
            }
        },
        {
            alias: vue.$t('book.themeNight'),
            name: 'Night',
            style: {
                body: {
                    'color': '#cecece',
                    'background': '#000000',
                    'padding-top': `${realPx(48)}px!important`,
                    'padding-bottom': `${realPx(48)}px!important`
                },
                // img: {
                //     'width': '100%'
                // },
                // '.epubjs-hl': {
                //     'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
                // }
            }
        }
    ];
}

//动态添加css
export function addCss(href) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', href);

    document.getElementsByTagName('head')[0].appendChild(link);
}

// 清除css标签节点
export function removeCss(href) {
    const links = document.getElementsByTagName('link');
    // 遍历一遍所有的links标签
    for (let i = links.length; i >= 0; i--) {
        let link = links[i];
        if (link && link.getAttribute('href') && link.getAttribute('href') === href) {
            document.getElementsByTagName('head')[0].removeChild(link);
        }
    }
}

export function removeAllCss() {
    removeCss(process.env.VUE_APP_RES_URL + '/theme/theme_default.css');
    removeCss(process.env.VUE_APP_RES_URL + '/theme/theme_eye.css');
    removeCss(process.env.VUE_APP_RES_URL + '/theme/theme_gold.css');
    removeCss(process.env.VUE_APP_RES_URL + '/theme/theme_night.css');
}

// 扁平化数组
export function flatten(array) {
    return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))));
}