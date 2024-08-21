import Mock from 'mockjs';
import BookHomeApi from './bookHome';
import BookShelfApi from './bookShelf';
import BookHomeList from './bookList';
import BookFlatList from './bookFlatList';

// Mock.setup({
//   timeout: '350-600'
// })

// 第一个参数是一个正则表达式，用来匹配我们所请求的url.第二个参数的请求方法
Mock.mock(/\/book\/home/, 'get', BookHomeApi);  //  /book/home
Mock.mock(/\/book\/shelf/, 'get', BookShelfApi);  //  /book/shelf
Mock.mock(/\/book\/list/, 'get', BookHomeList);  // /book/list
Mock.mock(/\/book\/flat-list/, 'get', BookFlatList);// /book/flat-list

export default Mock;
