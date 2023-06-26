/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 *  字符串
 * @param {*} s 
 * @returns 
 */
export const isStr = (s) => {
  return Object.prototype.toString.call(s).slice(8, -1) === 'String'
}

/**
 * 数字
 * @param {*} s
 * @returns 
 */
export const isNumber = (s) => {
  return Object.prototype.toString.call(s).slice(8, -1) === 'Number'
}

/**
 * 函数
 * @param {*} s 
 * @returns 
 */
export const isFunction = (s) => {
  return Object.prototype.toString.call(s).slice(8, -1) === 'Function'
}

/**
 * undefined
 * @param {*} s 
 * @returns 
 */
export const isUndefined = (s) => {
  return Object.prototype.toString.call(s).slice(8, -1) === 'Undefined'
}

/**
 * Promise对象
 * @param {*} s 
 * @returns 
 */
export const isPromise = (s) => {
  return Object.prototype.toString.call(s).slice(8, -1) === 'Promise'
}

/**
 * 微信浏览器
 * @returns 
 */
export const isWeiXin = () => {
  return ua.match(/microMessenger/i) == 'micromessenger'
}

/**
 * 爬虫
 * @returns 
 */
export const isSpider = () => {
  return /adsbot|googlebot|bingbot|msnbot|yandexbot|baidubot|robot|careerbot|seznambot|bot|baiduspider|jikespider|symantecspider|scannerlwebcrawler|crawler|360spider|sosospider|sogou web sprider|sogou orion spider/.test(ua)
}

/**
 * 删除某个class
 * @param {*} el 
 * @param {*} className 
 * @returns 
 */
export const removeClass = (el, className) => {
  if (!hasClass(el, className)) {
      return
  }
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g')
  el.className = el.className.replace(reg, ' ')
}

/**
 * 包含某个class
 * @param {*} el 
 * @param {*} className 
 * @returns 
 */
export const hasClass = (el, className) => {
  let reg = new RegExp('(^|\s)' + className + '(\s|$)')
  return reg.test(el.className)
}

/**
 * 洗牌算法随机
 * @param {*} arr 
 * @returns 
 */
export const shuffle = (arr) => {
  var result = [],
      random;
  while (arr.length > 0) {
      random = Math.floor(Math.random() * arr.length);
      result.push(arr[random])
      arr.splice(random, 1)
  }
  return result;
}

/**
 * 判断一个元素是否在数组中
 * @param {*} arr 
 * @param {*} val 
 * @returns 
 */
export const contains = (arr, val) => {
  return arr.indexOf(val) != -1 ? true : false;
}

/**
 * 检查密码强度
 * @param {*} str 
 * @returns 
 */
export const checkPwd = (str) => {
  var Lv = 0;
  if (str.length < 6) {
    return Lv
  }
  if (/[0-9]/.test(str)) {
    Lv++
  }
  if (/[a-z]/.test(str)) {
    Lv++
  }
  if (/[A-Z]/.test(str)) {
    Lv++
  }
  if (/[.|-|_]/.test(str)) {
    Lv++
  }
  return Lv;
}

/**
 * 判断集合类型
 * @param {*} str 
 * @param {*} type 
 * @returns 
 */
export const checkStr = (str, type) => {
  switch (type) {
      case 'phone':   //手机号码
          return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(str);
      case 'tel':     //座机
          return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
      case 'card':    //身份证
          return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
      case 'pwd':     //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
          return /^[a-zA-Z]\w{5,17}$/.test(str)
      case 'postal':  //邮政编码
          return /[1-9]\d{5}(?!\d)/.test(str);
      case 'QQ':      //QQ号
          return /^[1-9][0-9]{4,9}$/.test(str);
      case 'email':   //邮箱
          return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
      case 'money':   //金额(小数点2位)
          return /^\d*(?:\.\d{0,2})?$/.test(str);
      case 'URL':     //网址
          return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str)
      case 'IP':      //IP
          return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str);
      case 'date':    //日期时间
          return /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(str) || /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str)
      case 'number':  //数字
          return /^[0-9]$/.test(str);
      case 'english': //英文
          return /^[a-zA-Z]+$/.test(str);
      case 'chinese': //中文
          return /^[\\u4E00-\\u9FA5]+$/.test(str);
      case 'lower':   //小写
          return /^[a-z]+$/.test(str);
      case 'upper':   //大写
          return /^[A-Z]+$/.test(str);
      case 'HTML':    //HTML标记
          return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
      default:
          return true;
  }
}