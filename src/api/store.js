// 用来做api请求
import axios from 'axios';
import { setLocalForage } from '../../src/utils/localForage';

export function home() {
    //发送请求
    return axios({
        method: 'get',
        // 以便能够根据我发布环境的更改而更改
        url: `${process.env.VUE_APP_BASE_URL}/book/home`
    });
}

// detail接口 将fileName作为参数 之后发布的时候会详细写，现在使用线上的方法
export function detail(book) {
    //发送请求
    return axios({
        method: 'get',
        // 以便能够根据我发布环境的更改而更改
        url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
        params: {
            fileName: book.fileName
        }
    });
}

export function list() {
    //发送请求
    return axios({
        method: 'get',
        // 以便能够根据我发布环境的更改而更改
        url: `${process.env.VUE_APP_BASE_URL}/book/list`
    });
}

export function bookShelf() {
    //发送请求
    return axios({
        method: 'get',
        // 以便能够根据我发布环境的更改而更改
        url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
    });
}

// 电子书下载api
// VUE_APP_EPUB_URL
export function download(book, onSuccess, onError, onProgress) {
    if (!onProgress) {
        onProgress = onError;
    }
    //发送请求  但是现在使用axios的create方法（返回一个axios实例），再调用axios实例的get方法或其他
    return axios.create({
        // baseURL: process.env.VUE_APP_EPUB_URL, 
        baseURL: process.env.VUE_APP_EPUB_URL,
        method: 'get',
        responseType: 'blob',
        timeout: 180 * 1000,
        //  用于进度计算
        onDownloadProgress: ProgressEvent => {
            if (onProgress) onProgress(ProgressEvent);
        }
    }).get(`${book.categoryText}/${book.fileName}.epub`)
        .then(res => {
            // res.data中成功获取到文件的blob对象，因此使用new Blob创建一个blob对象
            // 这个获得的blob对象epubjs是能直接打开的
            const blob = new Blob([res.data]);
            // book.fileName作为键 blob作为值存入IndexDB中
            setLocalForage(book.fileName, blob, () => {
                if (onSuccess) onSuccess(book);
            }, err => {
                if (onError) onError(err);
            });
        }).catch(err => {
            if (onError) onError(err);
        });
}

