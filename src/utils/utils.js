let parseUtils = {
  parseTime: function (rfc3399) {
    let date = new Date(rfc3399).toJSON()
    // 我们要转化来自服务器西四区的时区，若有必要可以修改时区
    let timeZone = 8
    return new Date(+new Date(date) + timeZone * 3600 * 1000).toISOString()
      .replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  },
  parseToken: function (token) {
    let userPart = decodeURIComponent(escape(window.atob(token.split('.')[1])))
    return JSON.parse(userPart)
  }
}

export {
  parseUtils
}
