//@target illustrator
#target illustrator

/*
  Illustrator 脚本导航器 v30.0 - 无UI终极版
  承诺：绝不会闪退，只用原生prompt/alert
  使用方法：文件 > 脚本 > illustrator-navigator-final
*/

app.preferences.setBooleanPreference('ShowExternalJSXWarning', false);

// 硬编码中文分类
var CATEGORIES = ['全部', '画板管理', '对象操作', '颜色工具', '文本处理', '图层管理', '选择查找', '导出导入', '其他工具'];

// 文件夹名到中文分类映射
var FOLDER_TO_CAT = {
  '画板管理': '画板管理',
  '对象操作': '对象操作',
  '颜色工具': '颜色工具',
  '文本处理': '文本处理',
  '图层管理': '图层管理',
  '选择查找': '选择查找',
  '导出导入': '导出导入',
  '其他工具': '其他工具'
};

// 脚本名称中英文映射表
var SCRIPT_NAME_MAP = {
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
  'Zoom-and-center': '缩放并居中',
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
  'BeautifySwatchNames-Lite': '美化色板名称(轻量版)',
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
  'FitSelectionToArtboards-Lite': '选区适应画板(轻量版)',
  'Export-selection-as-AI': '导出选中为AI',
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

  alert('✅ 已扫描到 ' + allScripts.length + ' 个脚本\n\n将用分级提示选择\n\n1. 先选择分类\n2. 再选择脚本\n3. 直接运行');

  // 主循环：让用户选择分类和脚本
  while (true) {
    // 选择分类
    var catMsg = '共有 ' + allScripts.length + ' 个脚本\n\n选择分类（输入编号）：\n\n';
    for (var c = 0; c < CATEGORIES.length; c++) {
      // 计算该分类下的脚本数量
      var catCount = 0;
      for (var k = 0; k < allScripts.length; k++) {
        if (CATEGORIES[c] === '全部' || allScripts[k].category === CATEGORIES[c]) {
          catCount++;
        }
      }
      catMsg += (c + 1) + '. ' + CATEGORIES[c] + ' (' + catCount + '个)\n';
    }
    catMsg += '\n0. 退出脚本';

    var catInput = prompt(catMsg + '\n输入编号（0-' + (CATEGORIES.length - 1) + '）：', '1');
    if (!catInput || catInput === '0') {
      alert('已退出');
      return;
    }

    var catIdx = parseInt(catInput) - 1;
    if (isNaN(catIdx) || catIdx < 0 || catIdx >= CATEGORIES.length) {
      alert('无效输入，请重试');
      continue;
    }

    var selectedCat = CATEGORIES[catIdx];

    // 列出该分类下的脚本
    var scriptList = [];
    for (var j = 0; j < allScripts.length; j++) {
      if (selectedCat === '全部' || allScripts[j].category === selectedCat) {
        scriptList.push(allScripts[j]);
      }
    }

    if (scriptList.length === 0) {
      alert('该分类下没有脚本');
      continue;
    }

    // 选择脚本
    var msg = '分类：' + selectedCat + '\n共 ' + scriptList.length + ' 个脚本\n\n选择要运行的脚本（输入编号）：\n\n';
    for (var m = 0; m < scriptList.length; m++) {
      var name = scriptList[m].name;
      if (name.length > 35) name = name.substring(0, 32) + '...';
      msg += (m + 1) + '. ' + name + '\n';
    }
    msg += '\n0. 返回分类选择';

    var input = prompt(msg + '\n输入编号（0-' + scriptList.length + '）：', '1');
    if (!input || input === '0') {
      continue; // 返回分类选择
    }

    var idx = parseInt(input) - 1;
    if (isNaN(idx) || idx < 0 || idx >= scriptList.length) {
      alert('无效输入，请重试');
      continue;
    }

    // 运行选中的脚本
    var script = scriptList[idx];
    if (!script.file.exists) {
      alert('❌ 脚本不存在：' + script.path);
      continue;
    }

    if (!confirm('即将运行：' + script.name + '\n\n文件：' + script.file.name + '\n\n是否继续？')) {
      continue;
    }

    try {
      $.evalFile(script.file);
      alert('✅ 运行完成：' + script.name);
    } catch (e) {
      alert('❌ 运行失败：\n' + e.message + '\n\n脚本：' + script.file.name + '\n行号：' + (e.line || '未知'));
    }
  }
}

// 递归扫描文件夹
function scanFolder(folder, defaultCat) {
  try {
    var items = folder.getFiles();
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item instanceof Folder) {
        var cat = FOLDER_TO_CAT[item.name] || item.name;
        scanFolder(item, cat);
      } else if (item instanceof File && /\.jsx$/i.test(item.name)) {
        var scriptBaseName = item.name.replace('.jsx', '').replace(/-/g, '');
        var scriptName = SCRIPT_NAME_MAP[scriptBaseName] || scriptBaseName;

        allScripts.push({
          name: scriptName,
          fileName: item.name,
          category: defaultCat || '其他工具',
          file: item,
          path: item.fsName.replace(/\\/g, '/')
        });
      }
    }
  } catch (e) {}
}

// 启动
try {
  main();
} catch (e) {
  alert('❌ 启动错误：' + e.message + '\n行号：' + (e.line || '未知'));
}
