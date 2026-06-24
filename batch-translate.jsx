//@target illustrator
#target illustrator

/*
  批量翻译工具 - 将jsx目录下的所有脚本UI文本翻译为中文
  使用方法：在Illustrator中运行此脚本
*/

app.preferences.setBooleanPreference('ShowExternalJSXWarning', false);

function main() {
  if (!/illustrator/i.test(app.name)) {
    alert('请在Illustrator中运行');
    return;
  }

  // 定位jsx目录
  var scriptFile = new File($.fileName);
  var jsxRoot = new Folder(scriptFile.path.replace(/\\/g, '/') + '/jsx');
  
  if (!jsxRoot.exists) {
    alert('找不到jsx目录：' + jsxRoot.fsName);
    return;
  }

  // 收集所有jsx文件（排除导航器自身）
  var allFiles = [];
  collectJSXFiles(jsxRoot, allFiles);
  
  if (allFiles.length === 0) {
    alert('jsx目录中没有找到.jsx文件');
    return;
  }

  var translatedCount = 0;
  var errorCount = 0;
  var errorMessages = [];
  
  // 遍历翻译每个文件
  for (var i = 0; i < allFiles.length; i++) {
    var file = allFiles[i];
    try {
      if (translateFile(file)) {
        translatedCount++;
      }
    } catch(e) {
      errorCount++;
      errorMessages.push(file.name + ': ' + e.message);
    }
  }
  
  alert('翻译完成！\n\n成功翻译：' + translatedCount + ' 个文件' + 
        '\n错误：' + errorCount + ' 个文件' + 
        '\n\n总文件数：' + allFiles.length +
        (errorMessages.length > 0 ? '\n\n错误详情：\n' + errorMessages.join('\n') : ''));
}

// 递归收集所有jsx文件
function collectJSXFiles(folder, result) {
  try {
    var items = folder.getFiles();
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item instanceof Folder) {
        collectJSXFiles(item, result);
      } else if (item instanceof File && /\.jsx$/i.test(item.name)) {
        // 跳过导航器自身
        if (item.name.indexOf('illustrator-navigator') === -1) {
          result.push(item);
        }
      }
    }
  } catch(e) {}
}

// 翻译单个文件
function translateFile(file) {
  // 读取文件内容
  file.open('r');
  var content = file.read();
  file.close();
  
  if (!content || content.length === 0) return false;
  
  var originalContent = content;
  
  // 常见翻译映射表
  var translations = [
    // 对话框标题
    [/name:\s*'Artboards Finder'/g, "name: '画板查找器'"],
    [/name:\s*'Batch Renamer'/g, "name: '批量重命名器'"],
    [/name:\s*'Align Text Baseline'/g, "name: '文本基线对齐'"],
    [/name:\s*'Color Blind Simulator'/g, "name: '色盲模拟器'"],
    [/name:\s*'Contrast Checker'/g, "name: '对比度检查器'"],
    [/name:\s*'Insert Text'/g, "name: '插入文本'"],
    [/name:\s*'Sort Layer Items'/g, "name: '图层项目排序'"],
    [/name:\s*'Random Scribble'/g, "name: '随机涂鸦'"],
    [/name:\s*'Batch Trace'/g, "name: '批量描摹'"],
    [/name:\s*'Named Items Finder'/g, "name: '命名项目查找器'"],
    [/name:\s*'Average Colors'/g, "name: '平均颜色'"],
    [/name:\s*'Grayscale To Opacity'/g, "name: '灰度转不透明度'"],
    [/name:\s*'Zoom and Center'/g, "name: '缩放并居中'"],
    [/name:\s*'Save All Docs'/g, "name: '保存所有文档'"],
    [/name:\s*'Document Switcher'/g, "name: '文档切换器'"],
    [/name:\s*'Select By Swatches'/g, "name: '按色板选择'"],
    [/name:\s*'Select Rotated Items'/g, "name: '选择旋转项目'"],
    [/name:\s*'Make Numbers Sequence'/g, "name: '制作数字序列'"],
    [/name:\s*'Multi-edit Text'/g, "name: '批量编辑文本'"],
    [/name:\s*'Text Block'/g, "name: '文本块转换'"],
    [/name:\s*'Rename Layer As Text'/g, "name: '图层按文本重命名'"],
    [/name:\s*'Show Object Names'/g, "name: '显示对象名称'"],
    [/name:\s*'Extract From Group'/g, "name: '从组提取'"],
    [/name:\s*'ExtUngroup'/g, "name: '扩展取消编组'"],
    [/name:\s*'Remember Selection Layers'/g, "name: '记住选择图层'"],
    [/name:\s*'Opacity Mask Clip'/g, "name: '不透明度蒙版剪切'"],
    [/name:\s*'Sync Global Colors Names'/g, "name: '同步全局颜色名称'"],
    [/name:\s*'Select All Layers Above'/g, "name: '选择上方图层'"],
    [/name:\s*'Select All Layers Below'/g, "name: '选择下方图层'"],
    [/name:\s*'Rename Items'/g, "name: '重命名项目'"],
    [/name:\s*'Objects Counter'/g, "name: '对象计数器'"],
    [/name:\s*'Color Corrector'/g, "name: '颜色校正器'"],
    [/name:\s*'Color Group Replacer'/g, "name: '颜色组替换器'"],
    [/name:\s*'Beautify Swatch Names'/g, "name: '美化色板名称'"],
    [/name:\s*'Hex To Swatches'/g, "name: 'HEX转色板'"],
    [/name:\s*'Match Colors'/g, "name: '匹配颜色'"],
    [/name:\s*'Stroke Color From Fill'/g, "name: '填充颜色转描边'"],
    [/name:\s*'Reverse Gradient Color'/g, "name: '反转渐变颜色'"],
    [/name:\s*'Remove Gradient Stops'/g, "name: '移除渐变色标'"],
    [/name:\s*'Cycle Colors'/g, "name: '循环颜色'"],
    [/name:\s*'Cycle Gradient'/g, "name: '循环渐变'"],
    [/name:\s*'Distribute Gradient Stops'/g, "name: '分布渐变色标'"],
    [/name:\s*'Convert To Gradient'/g, "name: '转换为渐变'"],
    [/name:\s*'Change Opacity'/g, "name: '改变不透明度'"],
    [/name:\s*'Check Pixel Perfect'/g, "name: '检查像素完美'"],
    [/name:\s*'Average Strokes Width'/g, "name: '平均描边宽度'"],
    [/name:\s*'Draw Polyline'/g, "name: '绘制多段线'"],
    [/name:\s*'Draw Path By Selected Points'/g, "name: '绘制选定点的路径'"],
    [/name:\s*'Divide Bottom Path'/g, "name: '分割底部路径'"],
    [/name:\s*'Subtract Top Path'/g, "name: '减去顶部路径'"],
    [/name:\s*'Split Path'/g, "name: '分割路径'"],
    [/name:\s*'Mirror Move'/g, "name: '镜像移动'"],
    [/name:\s*'Move To Group'/g, "name: '移到组中'"],
    [/name:\s*'Swap Objects'/g, "name: '交换对象'"],
    [/name:\s*'Set Points Coordinates'/g, "name: '设置点坐标'"],
    [/name:\s*'Points Move Random'/g, "name: '随机移动点'"],
    [/name:\s*'Select Only Points'/g, "name: '选择特定点'"],
    [/name:\s*'Select Points By Type'/g, "name: '按类型选择点'"],
    [/name:\s*'Corners Selector'/g, "name: '角点选择器'"],
    [/name:\s*'Make Envelopes With Tops'/g, "name: '用顶部封套扭曲'"],
    [/name:\s*'Fit Artboards To Artwork'/g, "name: '画板适应图稿'"],
    [/name:\s*'Center Clips To Artboards'/g, "name: '居中剪切到画板'"],
    [/name:\s*'Align To Artboards'/g, "name: '对齐到画板'"],
    [/name:\s*'Draw Rectangles By Artboards'/g, "name: '按画板绘制矩形'"],
    [/name:\s*'Duplicate Artboards Light'/g, "name: '画板复制(轻量版)'"],
    [/name:\s*'Duplicate To Artboards'/g, "name: '复制到画板'"],
    [/name:\s*'Move Artboards'/g, "name: '移动画板'"],
    [/name:\s*'Rename Artboard As Layer'/g, "name: '画板按图层重命名'"],
    [/name:\s*'Rename Artboard As Size'/g, "name: '画板按尺寸重命名'"],
    [/name:\s*'Rename Artboard As Top Obj'/g, "name: '画板按顶部对象重命名'"],
    [/name:\s*'Select Artboard Objects'/g, "name: '选择画板对象'"],
    [/name:\s*'Group Artboard Objects'/g, "name: '画板对象分组'"],
    [/name:\s*'Mask Artboards'/g, "name: '画板剪切蒙版'"],
    [/name:\s*'Fit Selection To Artboards'/g, "name: '选区适应画板'"],
    [/name:\s*'Export Selection As AI'/g, "name: '导出选中为AI'"],
    [/name:\s*'Export To DXF'/g, "name: '导出到DXF'"],
    [/name:\s*'Resize On Larger Side'/g, "name: '调整大小(较大边)'"],
    [/name:\s*'Random Stroke Width'/g, "name: '随机描边宽度'"],
    [/name:\s*'Rescale'/g, "name: '重新缩放'"],
    [/name:\s*'Resize To Size'/g, "name: '调整大小至指定尺寸'"],
    [/name:\s*'Strokes Weight Up'/g, "name: '描边加粗'"],
    [/name:\s*'Strokes Weight Down'/g, "name: '描边减细'"],
    [/name:\s*'Triangle Maker'/g, "name: '三角形制作器'"],
    [/name:\s*'Trim Masks'/g, "name: '修剪蒙版'"],
    [/name:\s*'Trim Open Ends'/g, "name: '修剪开放末端'"],
    [/name:\s*'Numerates Points'/g, "name: '点到编号器'"],
    [/name:\s*'Round Coordinates'/g, "name: '坐标四舍五入'"],
    [/name:\s*'Place Symbols'/g, "name: '选择符号'"],
    [/name:\s*'Make Trapping Stroke'/g, "name: '制作捕获描边'"],
    [/name:\s*'File Version Former'/g, "name: '文件版本信息'"],
    
    // 按钮文本
    [/'Cancel'/g, "'取消'"],
    [/'Ok'/g, "'确定'"],
    [/'Preview'/g, "'预览'"],
    [/'Close'/g, "'关闭'"],
    [/'Export'/g, "'导出'"],
    [/'Save'/g, "'保存'"],
    [/'Open'/g, "'打开'"],
    [/'Yes'/g, "'是'"],
    [/'No'/g, "'否'"],
    [/'Select All'/g, "'全选'"],
    [/'Deselect All'/g, "'取消全选'"],
    [/'Reset'/g, "'重置'"],
    [/'Refresh'/g, "'刷新'"],
    [/'Minimize'/g, "'最小化'"],
    [/'Run Script'/g, "'运行脚本'"],
    [/'Run'/g, "'运行'"],
    [/'Stop'/g, "'停止'"],
    [/'Start'/g, "'开始'"],
    
    // 提示信息
    [/'Error\\nOpen a document and try again'/g, "'错误\\n请打开文档并重试'"],
    [/'No documents\\nOpen a document and try again'/g, "'没有文档\\n请打开一个文档并重试'"],
    [/'Wrong application\\nRun script from Adobe Illustrator'/g, "'错误的应用程序\\n请从Adobe Illustrator中运行脚本'"],
    [/'Please select'/g, "'请选择'"],
    [/'Select'/g, "'选择'"],
    [/'Processing'/g, "'处理中'"],
    [/'Done'/g, "'完成'"],
    [/'Failed'/g, "'失败'"],
    [/'Success'/g, "'成功'"],
    [/'Found'/g, "'找到'"],
    [/'Not found'/g, "'未找到'"],
    [/'Please select at least one column to export'/g, "'请至少选择一列用于导出'"],
    [/'Few objects are selected\\nPlease select at least 1 text frame and try again'/g, "'选择的物件太少\\n请至少选择1个文本框并重试'"],
    [/'Please, select one or more paths'/g, "'请选择一个或多个路径'"],
    [/'Background object has no solid fill'/g, "'背景对象没有纯色填充'"],
    [/'Foreground object has no solid fill'/g, "'前景对象没有纯色填充'"]
  ];
  
  // 执行翻译
  for (var t = 0; t < translations.length; t++) {
    try {
      if (translations[t] && translations[t].length >= 2) {
        content = content.replace(translations[t][0], translations[t][1]);
      }
    } catch(e) {}
  }
  
  // 如果有修改，保存文件
  if (content !== originalContent) {
    file.open('w');
    file.write(content);
    file.close();
    return true;
  }
  
  return false;
}

// 启动
try {
  main();
} catch (e) {
  alert('错误：' + e.message);
}
