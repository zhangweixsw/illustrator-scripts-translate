#target "illustrator"

// 翻译映射表
var translations = {
    'Error': '错误',
    'Open a document and try again': '打开文档后重试',
    'No documents': '没有文档',
    'Script error': '脚本错误',
    'Wrong application': '错误的应用程序',
    'Run script from Adobe Illustrator': '请从Adobe Illustrator中运行脚本',
    'Cancel': '取消',
    'OK': '确定',
    'Close': '关闭',
    'Save': '保存',
    'Load': '加载',
    'Reset': '重置',
    'Delete': '删除',
    'Add': '添加',
    'Edit': '编辑',
    'Yes': '是',
    'No': '否',
    'Artboard': '画板',
    'Object': '对象',
    'Select': '选择',
    'Color': '颜色',
    'Text': '文本',
    'Layer': '图层',
    'Path': '路径',
    'Export': '导出',
    'Import': '导入',
    'Width': '宽度',
    'Height': '高度'
};

// 需要扫描的目录
var targetFolder = new Folder("E:/Windows 10 System/WeiLi syc/ALL IN ONE/Github Files/illustrator-scripts-translate/illustrator-scripts-translate/jsx");

// 统计信息
var stats = {
    totalFiles: 0,
    modifiedFiles: 0,
    processedFiles: 0,
    modifiedFileList: []
};

// 递归获取所有.jsx文件
function getAllJsxFiles(folder) {
    var jsxFiles = [];
    try {
        var files = folder.getFiles();
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file instanceof Folder) {
                // 递归处理子目录
                var subFiles = getAllJsxFiles(file);
                jsxFiles = jsxFiles.concat(subFiles);
            } else if (file instanceof File && file.name.match(/\.jsx$/i)) {
                jsxFiles.push(file);
            }
        }
    } catch (e) {
        $.writeln("Error reading folder: " + folder.fsName + " - " + e.message);
    }
    return jsxFiles;
}

// 翻译字符串内容（处理引号的转义）
function translateString(str) {
    var result = str;
    var keys = Object.keys(translations);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = translations[key];
        // 使用正则表达式替换，确保只替换字符串内容
        var regex = new RegExp(escapeRegExp(key), 'g');
        result = result.replace(regex, value);
    }
    return result;
}

// 转义正则表达式特殊字符
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 处理单个文件
function processFile(file) {
    stats.totalFiles++;
    $.writeln("Processing: " + file.fsName);

    try {
        // 读取文件内容
        file.open('r');
        var content = file.read();
        file.close();

        var originalContent = content;

        // 翻译SCRIPT.name的值
        content = content.replace(/(SCRIPT\.name\s*=\s*['"])([^'"]+)(['"])/g, function(match, prefix, name, suffix) {
            return prefix + translateString(name) + suffix;
        });

        // 翻译alert和confirm中的文本
        content = content.replace(/(alert\s*\(\s*['"])([^'"]+)(['"])/g, function(match, prefix, text, suffix) {
            return prefix + translateString(text) + suffix;
        });
        content = content.replace(/(confirm\s*\(\s*['"])([^'"]+)(['"])/g, function(match, prefix, text, suffix) {
            return prefix + translateString(text) + suffix;
        });

        // 翻译对话框标题 (window.title 或 win.text)
        content = content.replace(/(window\.title\s*=\s*['"])([^'"]+)(['"])/g, function(match, prefix, title, suffix) {
            return prefix + translateString(title) + suffix;
        });
        content = content.replace(/(win\.text\s*=\s*['"])([^'"]+)(['"])/g, function(match, prefix, title, suffix) {
            return prefix + translateString(title) + suffix;
        });
        content = content.replace(/(\.text\s*=\s*['"])([^'"]+)(['"])/g, function(match, prefix, text, suffix) {
            return prefix + translateString(text) + suffix;
        });

        // 翻译静态文本 (staticText: 或 {name: '...', type: 'statictext'})
        content = content.replace(/(staticText\s*:\s*['"])([^'"]+)(['"])/gi, function(match, prefix, text, suffix) {
            return prefix + translateString(text) + suffix;
        });

        // 翻译按钮文本
        content = content.replace(/(button\s*:\s*['"])([^'"]+)(['"])/gi, function(match, prefix, text, suffix) {
            return prefix + translateString(text) + suffix;
        });

        // 翻译下拉列表选项
        content = content.replace(/(items\s*:\s*\[)([^\]]+)(\])/g, function(match, prefix, items, suffix) {
            var translatedItems = items.replace(/['"]([^'"]+)['"]/g, function(itemMatch, item) {
                return "'" + translateString(item) + "'";
            });
            return prefix + translatedItems + suffix;
        });

        // 检查是否有修改
        if (content !== originalContent) {
            // 写回文件
            file.open('w');
            file.write(content);
            file.close();
            stats.modifiedFiles++;
            stats.modifiedFileList.push(file.name);
            $.writeln("  -> Modified: " + file.name);
        }

        stats.processedFiles++;
    } catch (e) {
        $.writeln("  -> Error processing " + file.name + ": " + e.message);
    }
}

// 主函数
function main() {
    $.writeln("========================================");
    $.writeln("Illustrator Scripts Translation Tool");
    $.writeln("========================================");
    $.writeln("");

    if (!targetFolder.exists) {
        alert("Target folder does not exist: " + targetFolder.fsName);
        return;
    }

    $.writeln("Scanning directory: " + targetFolder.fsName);
    var jsxFiles = getAllJsxFiles(targetFolder);
    $.writeln("Found " + jsxFiles.length + " .jsx files");
    $.writeln("");

    // 处理每个文件
    for (var i = 0; i < jsxFiles.length; i++) {
        $.writeln("[" + (i + 1) + "/" + jsxFiles.length + "]");
        processFile(jsxFiles[i]);
        $.writeln("");
    }

    // 生成报告
    $.writeln("========================================");
    $.writeln("TRANSLATION REPORT");
    $.writeln("========================================");
    $.writeln("Total files found: " + stats.totalFiles);
    $.writeln("Files processed: " + stats.processedFiles);
    $.writeln("Files modified: " + stats.modifiedFiles);
    $.writeln("");

    if (stats.modifiedFileList.length > 0) {
        $.writeln("Modified files:");
        for (var j = 0; j < stats.modifiedFileList.length; j++) {
            $.writeln("  - " + stats.modifiedFileList[j]);
        }
    } else {
        $.writeln("No files were modified.");
    }

    $.writeln("");
    $.writeln("Translation complete!");

    // 显示完成提示
    alert("翻译完成！\n\n处理了 " + stats.processedFiles + " 个文件\n修改了 " + stats.modifiedFiles + " 个文件\n\n详细信息请查看控制台输出。");
}

// 运行脚本
main();
