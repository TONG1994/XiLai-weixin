const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 请求成功
const ERROR = "000000";

// 清空
const clearVal = (el, btn) => {
  const ele = $(el);
  const btn_x = $(btn);
  ele.bind('input propertychange', function () {
    if (ele.val() !== '') {
      btn_x.show()
    } else {
      btn_x.hide()
    }
  });
  btn_x.click(function () {
    ele.val('');
    if (ele.val() === '') {
      btn_x.hide()
    }
  });
}

// 倒计时
const setTime = (val) => {
  if (countdown <= "0") {
    val.attr("disabled", false);
    Util.CookiesSetter("countdownTime", 0, 1 / 1440, ";path=/;");
    val.html("重新发送");
    val.toggleClass("active");
    return false;
  } else {
    val.attr("disabled", true);
    val.html("(" + countdown + ")");
    countdown--;
    Util.CookiesSetter("countdownTime", countdown, 1 / 1440, ";path=/;");
  }
  clearTimeout(t);
  t = setTimeout(function () {
    setTime(val)
  }, 1000)
}


module.exports = {
  formatTime: formatTime
}
