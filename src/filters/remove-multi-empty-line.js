/**
 * 移除多余的空白行
 * */
export default function (str) {
  if (!str) return '';
  return str.replace(/(\r\n|\r|\n){2,}/g, '\r\n');
}
