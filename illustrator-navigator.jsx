//@target illustrator
#target illustrator

/*
  Illustrator 脚本导航器 v32.0 - 稳定版（使用dialog窗口）
  功能：直接调用jsx/目录下的原脚本，中文界面，多列列表，搜索+分类
  使用方法：文件 > 脚本 > illustrator-navigator
*/

app.preferences.setBooleanPreference('ShowExternalJSXWarning', false);

// 硬编码中文分类
var CATEGORIES = ['全部', '画板管理', '对象操作', '颜色工具', '文本处理', '图层管理', '选择查找', '导出导入', '其他工具'];

// 文件夹名→分类映射
var FOLDER_TO_CAT = {
  '画板管理': '画板管理', '对象操作': '对象操作', '颜色工具': '颜色工具',
  '文本处理': '文本处理', '图层管理': '图层管理', '选择查找': '选择查找',
  '导出导入': '导出导入', '其他工具': '其他工具'
};

// 脚本名称映射
var SCRIPT_NAME_MAP = {
  'ArtboardsFinder': '画板查找器', 'BatchRenamer': '批量重命名器', 'AlignTextBaseline': '文本基线对齐',
  'ColorBlindSimulator': '色盲模拟器', 'ContrastChecker': '对比度检查器', 'InsertText': '插入文本',
  'SortLayerItems': '图层项目排序', 'RandomScribble': '随机涂鸦', 'BatchTrace': '批量描摹',
  'NamedItemsFinder': '命名项目查找器', 'AverageColors': '平均颜色', 'GrayscaleToOpacity': '灰度转不透明度',
  'Zoom-and-center': '缩放并居中', 'SaveAllDocs': '保存所有文档', 'DocumentSwitcher': '文档切换器',
  'SelectBySwatches': '按色板选择', 'SelectRotatedItems': '选择旋转项目', 'MakeNumbersSequence': '制作数字序列',
  'MultiEditText': '批量编辑文本', 'TextBlock': '文本块转换', 'RenameLayerAsText': '图层按文本重命名',
  'ShowObjectNames': '显示对象名称', 'ExtractFromGroup': '从组提取', 'ExtUngroup': '扩展取消编组',
  'RememberSelectionLayers': '记住选择图层', 'OpacityMaskClip': '不透明度蒙版剪切', 'SyncGlobalColorsNames': '同步全局颜色名称',
  'SelectAllLayersAbove': '选择上方图层', 'SelectAllLayersBelow': '选择下方图层', 'RenameItems': '重命名项目',
  'ObjectsCounter': '对象计数器', 'ColorCorrector': '颜色校正器', 'ColorGroupReplacer': '颜色组替换器',
  'BeautifySwatchNames': '美化色板名称', 'BeautifySwatchNames-Lite': '美化色板名称(轻量版)',
  'HexToSwatches': 'HEX转色板', 'MatchColors': '匹配颜色', 'StrokeColorFromFill': '填充颜色转描边',
  'ReverseGradientColor': '反转渐变颜色', 'RemoveGradientStops': '移除渐变色标', 'CycleColors': '循环颜色',
  'CycleGradient': '循环渐变', 'CycleGradientForward': '循环渐变(前进)', 'CycleGradientBackward': '循环渐变(后退)',
  'CycleGradientRandom': '循环渐变(随机)', 'DistributeGradientStops': '分布渐变色标', 'ConvertToGradient': '转换为渐变',
  'ChangeOpacity': '改变不透明度', 'CheckPixelPerfect': '检查像素完美', 'AverageStrokesWidth': '平均描边宽度',
  'DrawPolyline': '绘制多段线', 'DrawPathBySelectedPoints': '绘制选定点的路径', 'DivideBottomPath': '分割底部路径',
  'SubtractTopPath': '减去顶部路径', 'SplitPath': '分割路径', 'MirrorMove': '镜像移动',
  'MoveToGroup': '移到组中', 'SwapObjects': '交换对象', 'SetPointsCoordinates': '设置点坐标',
  'PointsMoveRandom': '随机移动点', 'SelectOnlyPoints': '选择特定点', 'SelectPointsByType': '按类型选择点',
  'CornersSelector': '角点选择器', 'MakeEnvelopesWithTops': '用顶部封套扭曲', 'FitArtboardsToArtwork': '画板适应图稿',
  'CenterClipsToArtboards': '居中剪切到画板', 'AlignToArtboards': '对齐到画板', 'DrawRectanglesByArtboards': '按画板绘制矩形',
  'DuplicateArtboardsLight': '画板复制(轻量版)', 'DuplicateToArtboards': '复制到画板', 'MoveArtboards': '移动画板',
  'RenameArtboardAsLayer': '画板按图层重命名', 'RenameArtboardAsSize': '画板按尺寸重命名', 'RenameArtboardAsTopObj': '画板按顶部对象重命名',
  'SelectArtboardObjects': '选择画板对象', 'GroupArtboardObjects': '画板对象分组', 'MaskArtboards': '画板剪切蒙版',
  'FitSelectionToArtboards': '选区适应画板', 'FitSelectionToArtboards-Lite': '选区适应画板(轻量版)',
  'Export-selection-as-AI': '导出选中为AI', 'ExportToDXF': '导出到DXF', 'ResizeOnLargerSide': '调整大小(较大边)',
  'RandomStrokeWidth': '随机描边宽度', 'Rescale': '重新缩放', 'ResizeToSize': '调整大小至指定尺寸',
  'StrokesWeightUp': '描边加粗', 'StrokesWeightDown': '描边减细', 'TriangleMaker': '三角形制作器',
  'TrimMasks': '修剪蒙版', 'TrimOpenEnds': '修剪开放末端', 'NumeratesPoints': '点到编号器',
  'RoundCoordinates': '坐标四舍五入', 'PlaceSymbols': '选择符号', 'MakeTrappingStroke': '制作捕获描边',
  'FileVersionInformer': '文件版本信息'
};

var selectedScript = null;

function main() {
  if (!/illustrator/i.test(app.name)) {
    alert('请在Adobe Illustrator中运行此脚本');
    return;
  }

  var scriptFile = new File($.fileName);
  var jsxRoot = new Folder(scriptFile.path.replace(/\\/g, '/') + '/jsx');
  if (!jsxRoot.exists) {
    alert('找不到jsx目录：' + jsxRoot.fsName);
    return;
  }

  var allScripts = [];
  scanFolder(jsxRoot, '');

  if (allScripts.length === 0) {
    alert('未在jsx目录中找到任何脚本文件');
    return;
  }

  // 提取分类
  var categories = ['全部'];
  var catMap = {};
  for (var i = 0; i < allScripts.length; i++) {
    var cat = allScripts[i].category;
    if (!catMap[cat]) {
      catMap[cat] = true;
      categories.push(cat);
    }
  }

  // 创建dialog窗口（模态，更稳定）
  var win = new Window('dialog', '脚本导航器 v32.0（共' + allScripts.length + '个脚本）');
  win.orientation = 'column';
  win.alignChildren = ['fill', 'fill'];
  win.preferredSize.width = 650;
  win.preferredSize.height = 500;

  // 顶部：搜索+分类
  var topGroup = win.add('group');
  topGroup.orientation = 'row';
  topGroup.add('statictext', undefined, '搜索：');
  var searchBox = topGroup.add('edittext', undefined, '');
  searchBox.characters = 20;
  topGroup.add('statictext', undefined, '分类：');
  var catDrop = topGroup.add('dropdownlist', undefined, categories);
  catDrop.selection = 0;

  // 列表框（单列，避免多列崩溃）
  var listBox = win.add('listbox', undefined, '', {
    numberOfColumns: 1,
    showHeaders: false
  });
  listBox.preferredSize.height = 350;

  // 信息栏
  var descText = win.add('statictext', undefined, '共 ' + allScripts.length + ' 个脚本');
  descText.alignment = ['fill', 'top'];

  // 按钮区
  var btnGroup = win.add('group');
  btnGroup.alignment = ['fill', 'bottom'];
  var btnRun = btnGroup.add('button', undefined, '运行脚本');
  btnRun.enabled = false;
  btnRun.preferredSize.width = 100;
  var btnClose = btnGroup.add('button', undefined, '关闭');
  btnClose.alignment = ['right', 'center'];

  // 填充列表
  function populateList() {
    listBox.removeAll();
    var filterCat = catDrop.selection.text;
    var filterText = searchBox.text.toLowerCase();
    var count = 0;
    for (var i = 0; i < allScripts.length; i++) {
      var s = allScripts[i];
      var matchCat = (filterCat === '全部' || s.category === filterCat);
      var matchText = !filterText || s.name.toLowerCase().indexOf(filterText) !== -1;
      if (matchCat && matchText) {
        var item = listBox.add('item', s.name);
        item.scriptData = s;
        count++;
      }
    }
    descText.text = '共 ' + count + ' 个脚本（双击运行）';
  }

  populateList();

  // 事件
  searchBox.onChanging = populateList;
  catDrop.onChange = populateList;

  listBox.onChange = function() {
    if (this.selection) {
      selectedScript = this.selection.scriptData;
      btnRun.enabled = true;
    }
  };

  listBox.onDoubleClick = function() {
    if (listBox.selection) {
      runScript(listBox.selection.scriptData);
    }
  };

  btnRun.onClick = function() {
    if (selectedScript) {
      runScript(selectedScript);
    }
  };

  btnClose.onClick = function() {
    win.close();
  };

  // 运行脚本
  function runScript(script) {
    if (!script.file.exists) {
      alert('文件不存在：' + script.path);
      return;
    }
    win.visible = false;
    try {
      script.file.open('r');
      var content = script.file.read();
      script.file.close();
      // 移除#target行以避免冲突
      content = content.replace(/#target\s+.*?[\r\n]/g, '');
      content = content.replace(/\/\/@target\s+.*?[\r\n]/g, '');
      eval(content);
      alert('✅ 运行完成：' + script.name);
    } catch (e) {
      alert('❌ 运行失败：' + e.message + '\n脚本：' + script.fileName);
    } finally {
      win.visible = true;
    }
  }

  // 扫描文件夹
  function scanFolder(folder, defaultCat) {
    try {
      var items = folder.getFiles();
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item instanceof Folder) {
          scanFolder(item, FOLDER_TO_CAT[item.name] || item.name);
        } else if (item instanceof File && /\.jsx$/i.test(item.name)) {
          var baseName = item.name.replace('.jsx', '').replace(/-/g, '');
          var scriptName = SCRIPT_NAME_MAP[baseName] || baseName;
          allScripts.push({
            name: scriptName,
            fileName: item.name,
            category: defaultCat || '其他工具',
            file: item,
            path: item.fsName.replace(/\\/g, '/')
          });
        }
      }
    } catch(e) {}
  }

  win.center();
  win.show();
}

try {
  main();
} catch(e) {
  alert('错误：' + e.message);
}
