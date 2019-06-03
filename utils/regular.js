const regular = {
  // 手机号验证
  phone: /^1[3456789]\d{9}$/,
  // 邮箱
  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  // 数字
  allNub: /^[\d]+$/,
  // 一些字符
  comma: ",|、|，|\\s+",
  // 字母
  letter: "^[a-zA-Z]+$",
  // 数字
  nub: "^[0-9]+$",
  // 中文
  chinaText: "^[\\\u4E00-\\\u9FA5]+$",
  // 组合
  all: "^[\\\u4e00-\\\u9fa5a-zA-Z0-9-\\s()（）·，,#|〇]+$",
  // 特殊字符
  specialCount: "[* /\\:|\"?<>]"
};

const isValid = (valueType, value) => {
  //判断该类型
  switch (valueType) {
    case 'Phone':
      return regular.phone.test(value);
      break;
    case 'Email':
      return regular.email.test(value);
      break;
    case 'Number':
      return regular.allNub.test(value);
      break;
  }
}

// 匹配掉特殊字符
const stripScript = (s) => {
  let pattern = new RegExp(regular.specialCharacter)
  let rs = "";
  for (let i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, '');
  }
  return rs;
}

// 提示特殊字符（方法1）
const reminderStripScript = (s) => {
  let pattern = new RegExp(regular.specialCharacter);
  return pattern.test(s);
}

// 提示特殊字符（方法2）
const reminderStripScriptTow = (s) => {
  let pattern = new RegExp(regular.all);
  return pattern.test(s);
}

// 提示特殊字符（方法3）
const reminderStripScriptThree = (s) => {
  let pattern = new RegExp(regular.specialCount);
  return pattern.test(s);
}

const comma = (s) => {
  let pattern = new RegExp(regular.comma);
  let rs = "";
  for (let i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, ' ');
  }
  return rs;
}

const ifNumber = (s) => {
  let pattern = new RegExp(regular.allNub);
  return pattern.test(s);
}

//匹配剪切板上的电话，返回正常手机号或座机号
const clipboardNumber = (s) => {
  //去除空格
  let data = s.replace(/\s*/g, "");
  let data1 = data.replace(/[^0-9]/ig, "");
  let test = data1.substring(2, 0);
  console.log(test);
  if (test == "86") {
    if (data.substring(2).length >= 12) {
      let phone = data1.substring(2).slice(0, 12)
      return phone;
    }
    return data1.substring(2);
  } else {
    if (data.substring(2).length >= 12) {
      let phone = data1.slice(0, 12)
      return phone;
    }
    return data1;
  }

}

module.exports = {
  isValid: isValid,
  stripScript: stripScript,
  reminderStripScript: reminderStripScript,
  reminderStripScriptTow: reminderStripScriptTow,
  reminderStripScriptThree,
  reminderStripScriptThree,
  comma: comma,
  ifNumber: ifNumber,
  clipboardNumber: clipboardNumber
}