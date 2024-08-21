import Storage from 'web-storage-cache';

const localStorage = new Storage();

// 封装几个localStorage的常用方法

export function setLocalStorage(key, value) {
    return localStorage.set(key, value);
}

export function getLocalStorage(key) {
    return localStorage.get(key);
}

export function removeLocalStorage(key) {
    return localStorage.remove(key);
}

export function clearLocalStorage() {
    return localStorage.clear();
}

// 业务逻辑

// 为每一本电子书都开一个localStorage空间来存储相关的配置信息
// book在存储的时候会转为json获取的时候又会转为对象
export function setBookObject(fileName, key, value) {
    let book = getLocalStorage(`${fileName}-info`);
    if (!book) {
        book = {};
    }
    book[key] = value;
    setLocalStorage(`${fileName}-info`, book);
}

export function getBookObject(fileName, key) {
    let book = getLocalStorage(`${fileName}-info`);
    if (book) {
        return book[key];
    } else {
        return null;
    }
}

// 字体设置的缓存
export function getFontFamily(fileName) {
    return getBookObject(fileName, 'fontFamily');
}

export function saveFontFamily(fileName, font) {
    return setBookObject(fileName, 'fontFamily', font);
}

// 字号设置的缓存
export function getFontSize(fileName) {
    return getBookObject(fileName, 'fontSize');
}

export function saveFontSize(fileName, size) {
    return setBookObject(fileName, 'fontSize', size);
}

// 默认国际化语言设置
export function saveLocale(locale) {
    return setLocalStorage('locale', locale);
}

export function getLocale() {
    return getLocalStorage('locale');
}

// 主题设置缓存
export function saveTheme(theme) {
    return setLocalStorage('theme', theme);
}

export function getTheme() {
    return getLocalStorage('theme');
}

// 缓存阅读进度
export function saveLocation(fileName, location) {
    return setBookObject(fileName, 'location', location);
}

export function getLocation(fileName) {
    return getBookObject(fileName, 'location');
}

// 缓存阅读时长
export function saveReadTime(fileName, readTime) {
    return setBookObject(fileName, 'readTime', readTime);
}

export function getReadTime(fileName) {
    return getBookObject(fileName, 'readTime');
}

// 缓存书签

export function saveBookmark(fileName, bookmark) {
    return setBookObject(fileName, 'bookmark', bookmark);
}

export function getBookmark(fileName) {
    return getBookObject(fileName, 'bookmark');
}

//  缓存书架信息
export function saveBookShelf(bookShelf) {
    return setLocalStorage('bookShelf', bookShelf);
}

export function getBookShelf() {
    return getLocalStorage('bookShelf');
}

// 存储当前目录的书籍

export function saveShelfCategory(shelfCategory) {
    return setLocalStorage('shelfCategory', shelfCategory);
}

export function getShelfCategory() {
    return getLocalStorage('shelfCategory');
}