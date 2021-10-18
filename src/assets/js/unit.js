//获取token
const getCookie = (name) => {
    //cookie中的数据都是以分号加空格区分开
    let arr = document.cookie.split("; ");
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].split("=")[0] === name) {
            return arr[i].split("=")[1];
        }
    }
    //未找到对应的cookie则返回空字符串
    return '';
};
//存token
const setCookie = (name, value, seconds) => {
    let expires = '';
    //设置cookie生存时间
    let date = new Date();
    date.setTime(date.getTime() + (seconds * 1000));
    expires = "; expires=" + date.toGMTString();
    // debugger
    document.cookie = name + "=" + value + expires + "; path=/"; //转码并赋值
};
//token是否存在
const IsCookis = () => {
    // let getC = () => {
        let arr = document.cookie.split("; ");
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].split("=")[0] === 'token') {
                return true
                // return arr[i].split("=")[1];
            }
        }
        return false;
    // };
    // if (getC() === '') {
    //     return true
    // }

};


export default {setCookie, getCookie, IsCookis}
