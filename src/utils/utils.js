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
  },
  getCurRFC () {
    let y = new Date().getFullYear()
    let m = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
    let d = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
    let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
    let mm = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
    let endDate = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    return endDate.replace(/\s+/g, 'T') + '+08:00'
  },
  splitTags (tags) {
    return tags.trim().split(/\s+/)
  }
}

export {
  parseUtils
}
