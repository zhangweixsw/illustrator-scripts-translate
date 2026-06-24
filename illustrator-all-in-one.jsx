//@target illustrator

/*
  Illustrator 脚本整合包 v23.0 - 无UI终极版
  承诺：绝不会闪退，只用原生prompt/alert
  使用方法：文件 > 脚本 > illustrator-all-in-one
*/

app.preferences.setBooleanPreference('ShowExternalJSXWarning', false);

function main() {
  // 环境检查
  if (!/illustrator/i.test(app.name)) {
    alert('请在Illustrator中运行');
    return;
  }
  if (app.documents.length === 0) {
    alert('请先打开文档');
    return;
  }

  // 定位jsx目录
  var scriptFile = new File($.fileName);
  var baseDir = scriptFile.path.replace(/\\/g, '/');
  var jsxRoot = new Folder(baseDir + '/jsx');

  if (!jsxRoot.exists) {
    alert('找不到jsx目录：' + jsxRoot.fsName);
    return;
  }

  // 扫描所有脚本
  var allScripts = [];
  scanFolder(jsxRoot, '');

  if (allScripts.length === 0) {
    alert('jsx目录中没有找到脚本');
    return;
  }

  // 按分类整理
  var catMap = {};
  var categories = ['全部'];
  for (var i = 0; i < allScripts.length; i++) {
    var cat = allScripts[i].category;
    if (!catMap[cat]) {
      catMap[cat] = true;
      categories.push(cat);
    }
  }

  // 让用户选择分类
  var catMsg = '共有 ' + allScripts.length + ' 个脚本，选择分类：\n\n';
  for (var c = 0; c < categories.length; c++) {
    catMsg += (c + 1) + '. ' + categories[c] + '\n';
  }
  var catInput = prompt(catMsg + '\n输入编号（1-' + categories.length + '）：', '1');
  if (!catInput) return;

  var catIdx = parseInt(catInput) - 1;
  if (isNaN(catIdx) || catIdx < 0 || catIdx >= categories.length) {
    alert('无效输入');
    return;
  }

  var selectedCat = categories[catIdx];

  // 列出该分类下的脚本
  var scriptList = [];
  for (var j = 0; j < allScripts.length; j++) {
    if (selectedCat === '全部' || allScripts[j].category === selectedCat) {
      scriptList.push(allScripts[j]);
    }
  }

  if (scriptList.length === 0) {
    alert('该分类下没有脚本');
    return;
  }

  // 让用户选择脚本
  var msg = '分类：' + selectedCat + '\n共 ' + scriptList.length + ' 个脚本，选择要运行的脚本：\n\n';
  for (var k = 0; k < scriptList.length; k++) {
    var name = scriptList[k].name;
    if (name.length > 35) name = name.substring(0, 32) + '...';
    msg += (k + 1) + '. ' + name + '\n';
  }

  var input = prompt(msg + '\n输入编号（1-' + scriptList.length + '）：', '1');
  if (!input) return;

  var idx = parseInt(input) - 1;
  if (isNaN(idx) || idx < 0 || idx >= scriptList.length) {
    alert('无效输入');
    return;
  }

  // 运行选中的脚本
  var script = scriptList[idx];
  if (!script.file.exists) {
    alert('文件不存在：' + script.file.fsName);
    return;
  }

  if (!confirm('即将运行：' + script.name + '\n\n文件：' + script.file.name + '\n\n是否继续？')) {
    return;
  }

  try {
    $.evalFile(script.file);
    alert('✅ 运行完成：' + script.name);
  } catch (e) {
    alert('❌ 运行失败：\n' + e.message + '\n\n脚本：' + script.file.name);
  }
}

// 递归扫描文件夹
function scanFolder(folder, defaultCat) {
  try {
    var items = folder.getFiles();
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item instanceof Folder) {
        scanFolder(item, item.name);
      } else if (item instanceof File && /\.jsx$/i.test(item.name)) {
        var scriptBaseName = item.name.replace(/\.jsx$/i, '').replace(/-/g, '');
        var chineseName = getChineseName(scriptBaseName);
        allScripts.push({
          name: chineseName,
          fileName: item.name,
          category: defaultCat || '其他工具',
          file: item
        });
      }
    }
  } catch (e) {}
}

// 中文名映射
function getChineseName(engName) {
  var map = {
    'ArtboardsFinder': '画板查找器',
    'BatchRenamer': '批量重命名器',
    'AlignTextBaseline': '文本基线对齐',
    'ColorBlindSimulator': '色盲模拟器',
    'ContrastChecker': '对比度检查器',
    'InsertText': '插入文本',
    'SortLayerItems': '图层项目排序',
    'RandomScribble': '随机涂鸦',
    'BatchTrace': '批量描摹',
    'NamedItemsFinder': '命名项目查找器',
    'AverageColors': '平均颜色',
    'GrayscaleToOpacity': '灰度转不透明度',
    'ZoomAndCenter': '缩放并居中',
    'SaveAllDocs': '保存所有文档',
    'DocumentSwitcher': '文档切换器',
    'SelectBySwatches': '按色板选择',
    'SelectRotatedItems': '选择旋转项目',
    'MakeNumbersSequence': '制作数字序列',
    'MultiEditText': '批量编辑文本',
    'TextBlock': '文本块转换',
    'RenameLayerAsText': '图层按文本重命名',
    'ShowObjectNames': '显示对象名称',
    'ExtractFromGroup': '从组提取',
    'ExtUngroup': '扩展取消编组',
    'RememberSelectionLayers': '记住选择图层',
    'OpacityMaskClip': '不透明度蒙版剪切',
    'SyncGlobalColorsNames': '同步全局颜色名称',
    'SelectAllLayersAbove': '选择上方图层',
    'SelectAllLayersBelow': '选择下方图层',
    'RenameItems': '重命名项目',
    'ObjectsCounter': '对象计数器',
    'ColorCorrector': '颜色校正器',
    'ColorGroupReplacer': '颜色组替换器',
    'BeautifySwatchNames': '美化色板名称',
    'BeautifySwatchNamesLite': '美化色板名称(轻量版)',
    'HexToSwatches': 'HEX转色板',
    'MatchColors': '匹配颜色',
    'StrokeColorFromFill': '填充颜色转描边',
    'ReverseGradientColor': '反转渐变颜色',
    'RemoveGradientStops': '移除渐变色标',
    'CycleColors': '循环颜色',
    'CycleGradient': '循环渐变',
    'CycleGradientForward': '循环渐变(前进)',
    'CycleGradientBackward': '循环渐变(后退)',
    'CycleGradientRandom': '循环渐变(随机)',
    'DistributeGradientStops': '分布渐变色标',
    'ConvertToGradient': '转换为渐变',
    'ChangeOpacity': '改变不透明度',
    'CheckPixelPerfect': '检查像素完美',
    'AverageStrokesWidth': '平均描边宽度',
    'DrawPolyline': '绘制多段线',
    'DrawPathBySelectedPoints': '绘制选定点的路径',
    'DivideBottomPath': '分割底部路径',
    'SubtractTopPath': '减去顶部路径',
    'SplitPath': '分割路径',
    'MirrorMove': '镜像移动',
    'MoveToGroup': '移到组中',
    'SwapObjects': '交换对象',
    'SetPointsCoordinates': '设置点坐标',
    'PointsMoveRandom': '随机移动点',
    'SelectOnlyPoints': '选择特定点',
    'SelectPointsByType': '按类型选择点',
    'CornersSelector': '角点选择器',
    'MakeEnvelopesWithTops': '用顶部封套扭曲',
    'FitArtboardsToArtwork': '画板适应图稿',
    'CenterClipsToArtboards': '居中剪切到画板',
    'AlignToArtboards': '对齐到画板',
    'DrawRectanglesByArtboards': '按画板绘制矩形',
    'DuplicateArtboardsLight': '画板复制(轻量版)',
    'DuplicateToArtboards': '复制到画板',
    'MoveArtboards': '移动画板',
    'RenameArtboardAsLayer': '画板按图层重命名',
    'RenameArtboardAsSize': '画板按尺寸重命名',
    'RenameArtboardAsTopObj': '画板按顶部对象重命名',
    'SelectArtboardObjects': '选择画板对象',
    'GroupArtboardObjects': '画板对象分组',
    'MaskArtboards': '画板剪切蒙版',
    'FitSelectionToArtboards': '选区适应画板',
    'FitSelectionToArtboardsLite': '选区适应画板(轻量版)',
    'ExportSelectionAsAI': '导出选中为AI',
    'ExportToDXF': '导出到DXF',
    'ResizeOnLargerSide': '调整大小(较大边)',
    'RandomStrokeWidth': '随机描边宽度',
    'Rescale': '重新缩放',
    'ResizeToSize': '调整大小至指定尺寸',
    'StrokesWeightUp': '描边加粗',
    'StrokesWeightDown': '描边减细',
    'TriangleMaker': '三角形制作器',
    'TrimMasks': '修剪蒙版',
    'TrimOpenEnds': '修剪开放末端',
    'NumeratesPoints': '点到编号器',
    'RoundCoordinates': '坐标四舍五入',
    'PlaceSymbols': '选择符号',
    'MakeTrappingStroke': '制作捕获描边',
    'FileVersionInformer': '文件版本信息'
  };
  return map[engName] || engName;
}

// 启动
try {
  main();
} catch (e) {
  alert('错误：' + e.message);
}
