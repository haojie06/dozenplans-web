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
  getRFCTime (date) {
    if (date === null) {
      date = new Date()
    }
    let y = date.getFullYear()
    let m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    let hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    let mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    let ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    let endDate = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    return endDate.replace(/\s+/g, 'T') + '+08:00'
  },
  splitTags (tags) {
    return tags === '' ? [] : tags.trim().split(/\s+/)
  },
  mergeTags (tagList) {
    let tags = ''
    for (let tag of tagList) {
      tags = tags + ' ' + tag
    }
    return tags.trim()
  },
  setIntervalTime (interval, time) {
    let m = interval / 60
    let h = m / 60
    let min = m % 60
    let hour = h % 24
    let day = h / 24
    time.min = min
    time.hour = hour
    time.day = day
  },
  getIntervalSecond (time) {
    return ((time.day * 24 + time.hour) * 60 + time.min) * 60
  }
}

export {
  parseUtils
}
