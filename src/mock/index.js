function delay(fn) {
  var args = [].slice.call(arguments, 1)
  setTimeout(() => {
    fn.apply(null, args)
  }, Math.random() * 200 >> 0)
}
const mockData = [{
  id: 'button',
  name: '按钮',
  demoList: [{
    id: 'button-1',
    url: 'http://fe.epoint.com.cn:8080/miniui_dev/demo/button/button.html',
    name: '按钮',
    height:840
  }, {
    id: 'button-2',
    url: 'http://fe.epoint.com.cn:8080/miniui_dev/demo/button/button_semantic.html',
    name: '语义按钮'
  }, {
    id: 'button-3',
    url: 'http://fe.epoint.com.cn:8080/miniui_dev/demo/button/menubutton.html',
    name: '菜单按钮'
  }, {
    id: 'button-4',
    url: 'http://fe.epoint.com.cn:8080/miniui_dev/demo/button/splitbutton.html',
    name: '分隔按钮'
  }]
}, {
  id: 'form',
  name: '表单',
  demoList: [{
    id: 'form-1',
    name: '表单验证',
    url: 'http://fe.epoint.com.cn:8080/miniui_dev/demo/form/validation.html'
  }, {
    id: 'form-2',
    name: '表单组合验证',
    url: 'http://fe.epoint.com.cn:8080/miniui_dev/demo/form/validGroup.html'
  }]
}, {
  id: 'layout',
  name: '框架布局',
  demoList: [{
    id: 'left-right2',
    name: '测试运行',
    isVertical: false,
    url: './static/test.html'
  },{
    id: 'left-right',
    name: '左右布局',
    isVertical: false,
    url: 'http://fe.epoint.com.cn:8080/f9proto/master/leftRight.php',
    docUrl: 'http://fe.epoint.com.cn:8080/f9fedoc/library/005-%E5%9F%BA%E7%A1%80%E5%B8%83%E5%B1%80/002-%E5%B7%A6%E5%8F%B3%E7%BB%93%E6%9E%84%E5%B8%83%E5%B1%80.md',
  }, {
    id: 'contentPage',
    name: 'contentPage布局',
    isVertical: true,
    url: 'http://fe.epoint.com.cn:8080/f9proto/master/contentPage.php',
    docUrl: 'http://fe.epoint.com.cn:8080/f9fedoc/library/005-%E5%9F%BA%E7%A1%80%E5%B8%83%E5%B1%80/003-ContentPage%E5%B8%83%E5%B1%80.md',
  }, {
    id: 'fui-search',
    name: '高级搜索布局',
    isVertical: true,
    height:600,
    url: 'http://fe.epoint.com.cn:8080/EP920/fui/test/search/search-default.html',
    docUrl: 'http://fe.epoint.com.cn:8080/f9fedoc/library/005-%E5%9F%BA%E7%A1%80%E5%B8%83%E5%B1%80/004-%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E5%B8%83%E5%B1%80.md',
  }, {
    id: 'fui-accordions',
    isVertical: true,
    name: '手风琴布局',
    url: 'http://fe.epoint.com.cn:8080/f9proto/master/accLayout.php',
    docUrl: 'http://fe.epoint.com.cn:8080/f9fedoc/library/005-%E5%9F%BA%E7%A1%80%E5%B8%83%E5%B1%80/005-%E6%89%8B%E9%A3%8E%E7%90%B4%E5%B8%83%E5%B1%80.md',
  }]
}]
export function getMenu() {
  const data = mockData
  return new Promise((reslove) => {
    delay(reslove, data)
  })
}
export function getList(id) {
  let aimSub = mockData.filter(item => {
    return item.id === id;
  });
  const data = aimSub && aimSub[0].demoList;

  return new Promise((reslove) => {
    delay(reslove, data)
  })
}
export function getDemo(id) {
  const data = {
    id: id,
    url: '',
    docUrl: '',
  };
  return new Promise((reslove) => {
    delay(reslove, data)
  })
}
