//@target illustrator
#target "illustrator"

/*
  批量翻译辅助工具 - 用于快速翻译jsx脚本中的英文UI文本
  使用方法：在Illustrator中运行此脚本，选择要翻译的jsx文件
*/

app.preferences.setBooleanPreference('ShowExternalJSXWarning', false);

function main() {
  if (!/illustrator/i.test(app.name)) {
    alert('请在Illustrator中运行');
    return;
  }

  // 选择要翻译的jsx文件
  var files = File.openDialog('选择要翻译的JSX文件（可多选）', '*.jsx', true);
  if (!files || files.length === 0) {
    alert('未选择文件');
    return;
  }

  var translatedCount = 0;
  
  for (var f = 0; f < files.length; f++) {
    var file = files[f];
    if (!file.exists) continue;
    
    // 读取文件内容
    file.open('r');
    var content = file.read();
    file.close();
    
    if (!content) continue;
    
    var originalContent = content;
    
    // 常见翻译映射表（可扩展）
    var translations = [
      // 对话框和面板
      [/('Error\\n[^']*')/g, function(match) { return match.replace(/Error\\n/, '错误\\n'); }],
      [/('Cancel'/g, "'取消'"],
      [/('Ok'/g, "'确定'"],
      [/('Preview'/g, "'预览'"],
      [/('Close'/g, "'关闭'"],
      [/('Export'/g, "'导出'"],
      [/('Import'/g, "'导入'"],
      [/('Open'/g, "'打开'"],
      [/('Save'/g, "'保存'"],
      
      // 常见UI文本
      [/('Name'/g, "'名称'"],
      [/('Width'/g, "'宽度'"],
      [/('Height'/g, "'高度'"],
      [/('Number'/g, "'编号'"],
      [/('Found'/g, "'找到'"],
      [/('Search'/g, "'搜索'"],
      [/('Filter'/g, "'筛选'"],
      [/('Options'/g, "'选项'"],
      [/('Settings'/g, "'设置'"],
      
      // 提示信息
      [/('Please select'/g, "'请选择'"],
      [/('Select'/g, "'选择'"],
      [/('Processing'/g, "'处理中'"],
      [/('Done'/g, "'完成'"],
      [/('Failed'/g, "'失败'"],
      [/('Success'/g, "'成功'"],
      
      // 脚本名称（部分）
      [/name:\s*'Artboards Finder'/g, "name: '画板查找器'"],
      [/name:\s*'Batch Renamer'/g, "name: '批量重命名器'"],
      [/name:\s*'Color Blind Simulator'/g, "name: '色盲模拟器'"],
      [/name:\s*'Contrast Checker'/g, "name: '对比度检查器'"],
      [/name:\s*'Insert Text'/g, "name: '插入文本'"],
      [/name:\s*'Sort Layer Items'/g, "name: '图层项目排序'"],
      [/name:\s*'Random Scribble'/g, "name: '随机涂鸦'"],
      [/name:\s*'Batch Trace'/g, "name: '批量描摹'"]
    ];
    
    // 执行翻译
    for (var i = 0; i < translations.length; i++) {
      try {
        content = content.replace(translations[i][0], translations[i][1]);
      } catch(e) {}
    }
    
    // 如果有修改，保存文件
    if (content !== originalContent) {
      file.open('w');
      file.write(content);
      file.close();
      translatedCount++;
    }
  }
  
  alert('翻译完成！\n\n处理了 ' + files.length + ' 个文件\n成功翻译 ' + translatedCount + ' 个文件');
}

try {
  main();
} catch(e) {
  alert('错误：' + e.message);
}
