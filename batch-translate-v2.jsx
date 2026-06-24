//@target illustrator
#target illustrator

/*
  批量翻译脚本 v2.0
  自动翻译jsx目录下所有脚本的英文UI为中文
*/

app.preferences.setBooleanPreference('ShowExternalJSXWarning', false);

var scriptFile = new File($.fileName);
var jsxRoot = new Folder(scriptFile.path.replace(/\\/g, '/') + '/jsx');
var count = 0;
var success = 0;
var failed = 0;
var errors = [];

// 翻译字典
var translateDict = {
  // 通用
  'Error': '错误',
  'Open a document and try again': '打开文档后重试',
  'No documents': '没有文档',
  'Script error': '脚本错误',
  'Wrong application': '错误的应用程序',
  'Run script from Adobe Illustrator': '请从Adobe Illustrator中运行脚本',
  'Cancel': '取消',
  'OK': '确定',
  'Yes': '是',
  'No': '否',
  'Close': '关闭',
  'Save': '保存',
  'Load': '加载',
  'Reset': '重置',
  'Delete': '删除',
  'Add': '添加',
  'Edit': '编辑',
  'Copy': '复制',
  'Paste': '粘贴',
  'Select All': '全选',
  'Clear': '清除',
  'Apply': '应用',
  'Done': '完成',
  'Processing': '处理中',
  'Please wait': '请稍候',
  'Success': '成功',
  'Failed': '失败',
  'Warning': '警告',
  'Information': '信息',
  'Confirm': '确认',

  // 画板相关
  'Artboard': '画板',
  'Artboards': '画板',
  'Fit Artboard': '适应画板',
  'Duplicate Artboard': '复制画板',
  'Rename Artboard': '重命名画板',
  'Move Artboard': '移动画板',
  'Select Artboard': '选择画板',
  'Center to Artboard': '居中到画板',
  'Align to Artboard': '对齐到画板',

  // 对象操作
  'Object': '对象',
  'Objects': '对象',
  'Select': '选择',
  'Deselect': '取消选择',
  'Move': '移动',
  'Copy': '复制',
  'Delete': '删除',
  'Group': '编组',
  'Ungroup': '取消编组',
  'Lock': '锁定',
  'Unlock': '解锁',
  'Hide': '隐藏',
  'Show': '显示',
  'Resize': '调整大小',
  'Rotate': '旋转',
  'Flip': '翻转',
  'Mirror': '镜像',
  'Scale': '缩放',
  'Shear': '倾斜',

  // 颜色
  'Color': '颜色',
  'Colors': '颜色',
  'Fill': '填充',
  'Stroke': '描边',
  'Gradient': '渐变',
  'Opacity': '不透明度',
  'Swatch': '色板',
  'Swatches': '色板',
  'Tint': '淡色',
  'Shade': '暗色',
  'Brightness': '亮度',
  'Contrast': '对比度',
  'Saturation': '饱和度',
  'Hue': '色相',

  // 文本
  'Text': '文本',
  'Font': '字体',
  'Size': '大小',
  'Leading': '行距',
  'Kerning': '字距',
  'Tracking': '字符间距',
  'Paragraph': '段落',
  'Align': '对齐',
  'Left': '左对齐',
  'Center': '居中对齐',
  'Right': '右对齐',
  'Justify': '两端对齐',

  // 图层
  'Layer': '图层',
  'Layers': '图层',
  'New Layer': '新建图层',
  'Delete Layer': '删除图层',
  'Rename Layer': '重命名图层',
  'Merge Layers': '合并图层',
  'Flatten Layers': '拼合图层',

  // 路径
  'Path': '路径',
  'Paths': '路径',
  'Point': '点',
  'Points': '点',
  'Anchor': '锚点',
  'Handle': '手柄',
  'Curve': '曲线',
  'Line': '直线',
  'Shape': '形状',
  'Rectangle': '矩形',
  'Ellipse': '椭圆',
  'Polygon': '多边形',
  'Star': '星形',

  // 导出导入
  'Export': '导出',
  'Import': '导入',
  'Save As': '另存为',
  'Open': '打开',
  'File': '文件',
  'Format': '格式',
  'Resolution': '分辨率',
  'Quality': '质量',

  // 其他
  'Width': '宽度',
  'Height': '高度',
  'Position': '位置',
  'X': 'X',
  'Y': 'Y',
  'Top': '上',
  'Bottom': '下',
  'Left': '左',
  'Right': '右',
  'Center': '居中',
  'Middle': '中间',
  'Horizontal': '水平',
  'Vertical': '垂直',
  'All': '全部',
  'None': '无',
  'Default': '默认',
  'Custom': '自定义',
  'Enabled': '启用',
  'Disabled': '禁用',
  'Visible': '可见',
  'Hidden': '隐藏',
  'Locked': '已锁定',
  'Unlocked': '未锁定'
};

function main() {
  if (!jsxRoot.exists) {
    alert('找不到jsx目录');
    return;
  }

  if (!confirm('此操作将翻译jsx目录下所有脚本的英文UI为中文。\n\n确定要继续吗？')) {
    return;
  }

  processFolder(jsxRoot);

  var msg = '翻译完成！\n\n';
  msg += '处理文件：' + count + ' 个\n';
  msg += '成功：' + success + ' 个\n';
  msg += '失败：' + failed + ' 个\n\n';

  if (errors.length > 0) {
    msg += '错误列表：\n';
    for (var i = 0; i < Math.min(errors.length, 10); i++) {
      msg += errors[i] + '\n';
    }
    if (errors.length > 10) {
      msg += '... 还有 ' + (errors.length - 10) + ' 个错误';
    }
  }

  alert(msg);
}

function processFolder(folder) {
  try {
    var items = folder.getFiles();
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item instanceof Folder) {
        processFolder(item);
      } else if (item instanceof File && /\.jsx$/i.test(item.name)) {
        count++;
        if (translateFile(item)) {
          success++;
        } else {
          failed++;
        }
      }
    }
  } catch(e) {
    errors.push('文件夹错误: ' + folder.name + ' - ' + e.message);
  }
}

function translateFile(file) {
  try {
    file.open('r');
    var content = file.read();
    file.close();

    var original = content;

    // 翻译alert和confirm中的英文
    content = content.replace(/(alert|confirm)\s*\(\s*['"]([^'"]+)['"]/g, function(match, func, text) {
      var translated = translateText(text);
      return func + "('" + translated + "'";
    });

    // 翻译对话框标题
    content = content.replace(/new\s+Window\s*\(\s*['"][^'"]*['"]\s*,\s*['"]([^'"]+)['"]/g, function(match, title) {
      var translated = translateText(title);
      return match.replace(title, translated);
    });

    // 翻译statictext
    content = content.replace(/add\s*\(\s*['"]statictext['"]\s*,\s*undefined\s*,\s*['"]([^'"]+)['"]/g, function(match, text) {
      var translated = translateText(text);
      return match.replace(text, translated);
    });

    // 翻译button
    content = content.replace(/add\s*\(\s*['"]button['"]\s*,\s*undefined\s*,\s*['"]([^'"]+)['"]/g, function(match, text) {
      var translated = translateText(text);
      return match.replace(text, translated);
    });

    // 如果有修改，保存文件
    if (content !== original) {
      file.open('w');
      file.write(content);
      file.close();
      return true;
    }

    return true;
  } catch(e) {
    errors.push(file.name + ': ' + e.message);
    return false;
  }
}

function translateText(text) {
  // 检查是否有对应的翻译
  if (translateDict[text]) {
    return translateDict[text];
  }

  // 尝试部分匹配翻译
  for (var key in translateDict) {
    if (text.indexOf(key) !== -1) {
      text = text.replace(new RegExp(key, 'g'), translateDict[key]);
    }
  }

  return text;
}

try {
  main();
} catch(e) {
  alert('错误: ' + e.message);
}
