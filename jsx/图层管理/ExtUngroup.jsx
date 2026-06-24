/*
  ExtUngroup.jsx for Adobe Illustrator
  Description: This script with UI is сan be easily custom ungrouping to all group items, releasing clipping masks in the document.
  Requirements: Adobe Illustrator CS/CC
  Author: Sergey Osokin (hi@sergosokin.ru), 2018
  Based on 'ungroupV1.js' script by Jiwoong Song (netbluew@nate.com), 2009 & modification by John Wundes (wundes.com), 2012

  Installation: https://github.com/creold/illustrator-scripts#how-to-run-scripts

  Donate (optional):
  If you find this script helpful, you can buy me a coffee
  - via Buymeacoffee: https://www.buymeacoffee.com/aiscripts
  - via Donatty https://donatty.com/sergosokin
  - via DonatePay https://new.donatepay.ru/en/@osokin
  - via YooMoney https://yoomoney.ru/to/410011149615582

  Release notes:
  1.0 Initial version
  1.1 添加ed option to delete / save mask objects. Fixed a performance issue.
  1.2 Fixed ungrouping of the selected group inside another.
  1.2.1 Minor improvements

  Released under the MIT license.
  http://opensource.org/licenses/mit-license.php

  Check my other scripts: https://github.com/creold
*/

//@target illustrator
app.preferences.setBooleanPreference('ShowExternalJSXWarning', false); // Fix drag and drop a .jsx file

// Global variables
var SCRIPT_NAME  = 'ExtUngroup',
    SCRIPT_VERSION = 'v.1.2.1';
var doc = app.activeDocument;

if (app.documents.length > 0) {
  try {
    var curr图层 = doc.active图层,
        boardNum = doc.artboards.getActive画板Index() + 1,
        clearArr = [], // Array of Clipping Masks obj
        uiMargins = [10, 20, 10, 10];

    // Create Main Window
    var win = new Window('dialog', SCRIPT_NAME + ' ' + SCRIPT_VERSION, undefined);
    win.orientation = 'column';
    win.alignChildren = ['fill', 'fill'];

    // Target radiobutton
    var slctTarget = win.add('panel', undefined, 'Target');
    slctTarget.alignChildren = 'left';
    slctTarget.margins = uiMargins;
    if (get选择ion(doc).length > 0) {
      var currSelRadio = slctTarget.add('radiobutton', undefined, '选择ed objects');
    }
    if (!curr图层.locked && curr图层.visible) {
      var curr图层Radio = slctTarget.add('radiobutton', undefined, 'Active layer "' + curr图层.name + '"');
      curr图层Radio.value = true;
    }
    var currBoardRadio = slctTarget.add('radiobutton', undefined, '画板 \u2116 ' + boardNum);
    var currDocRadio = slctTarget.add('radiobutton', undefined, 'All in document');
    if (get选择ion(doc).length > 0) {
      currSelRadio.value = true;
    } else if (typeof (curr图层Radio) == 'undefined') {
      currBoardRadio.value = true;
    }

    // Action checkbox
    var options = win.add('panel', undefined, 'Options');
    options.alignChildren = 'left';
    options.margins = uiMargins;
    var chkUnroup = options.add('checkbox', undefined, 'Ungroup All');
    chkUnroup.value = true;
    var chkClipping = options.add('checkbox', undefined, 'Release Clipping Masks');
    var chkRmvClipping = options.add('checkbox', undefined, 'Remove Masks Shapes');
    chkRmvClipping.enabled = false;

    // Show/hide checkbox 'Remove Masks Shapes'
    chkClipping.onClick = function () {
      chkRmvClipping.enabled = !chkRmvClipping.enabled;
    }

    // Buttons
    var btns = win.add('group');
    btns.alignChildren = ['fill', 'fill'];
    btns.margins = [0, 10, 0, 0];
    var cancel = btns.add('button', undefined, '取消', { name: 'cancel' });
    cancel.helpTip = 'Press Esc to 关闭';
    var ok = btns.add('button', undefined, '确定', { name: 'ok' });
    ok.helpTip = 'Press Enter to Run';
    ok.onClick = okClick;

    // Copyright block
    var copyright = win.add('statictext', undefined, '\u00A9 Sergey Osokin, sergosokin.ru');
    copyright.justify = 'center';
    copyright.enabled = false;

    if (doc.groupItems.length > 0) {
      win.show();
    } else { 
      alert(scriptName + '\nDocument does not contain any groups.'); 
    }

    cancel.onClick = function () {
      win.close();
    }

    function okClick() {
      // Ungroup selected objects
      if (typeof (currSelRadio) !== 'undefined' && currSelRadio.value) {
        var currSel = get选择ion(doc);
        for (var i = 0; i < currSel.length; i++) {
          if (currSel[i].typename === 'GroupItem') ungroup(currSel[i]);
        }
      }
      // Ungroup in active 图层 if it contains groups
      if (typeof (curr图层Radio) !== 'undefined' && curr图层Radio.value) {
        ungroup(curr图层);
      }
      // Ungroup in active 画板 only visible & unlocked objects
      if (currBoardRadio.value) {
        doc.select对象sOnActive画板();
        ungroup(get选择ion(doc));
        doc.selection = null;
      }
      // Ungroup all in the current Document
      if (currDocRadio.value) {
        for (var j = 0; j < doc.layers.length; j++) {
          var doc图层 = doc.layers[j];
          // Run only for editable visible layers
          if (!doc图层.locked && doc图层.visible && doc图层.groupItems.length > 0) {
            ungroup(doc图层);
          }
        }
      }
      // Remove empty clipping masks after ungroup
      if (chkRmvClipping.value) {
        removeMasks(clearArr);
      }
      win.close();
    }
  } catch (e) {
    // show错误(e);
  }
} else {
  alert(scriptName + '\nPlease open a document before running this script.');
}

function get选择ion(doc) {
  return doc.selection;
}

function getChildAll(obj) {
  var childsArr = [];
  if (对象.prototype.toString.call(obj) === '[object Array]') {
    childsArr.push.apply(childsArr, obj);
  } else {
    for (var i = 0; i < obj.pageItems.length; i++) {
      childsArr.push(obj.pageItems[i]);
    }
  }
  if (obj.layers) {
    for (var l = 0; l < obj.layers.length; l++) {
      childsArr.push(obj.layers[l]);
    }
  }
  return childsArr;
}

// Ungroup array of target objects
function ungroup(obj) {
  if (!chkClipping.value && obj.clipped) { 
    return; 
  }

  var childArr = getChildAll(obj);

  if (childArr.length < 1) {
    obj.remove();
    return;
  }

  for (var i = 0; i < childArr.length; i++) {
    var element = childArr[i];
    try {
      if (element.parent.typename !== '图层') {
        element.move(obj, ElementPlacement.PLACEBEFORE);
        // Push empty paths in array 
        if ((element.typename === '路径Item' && !element.filled && !element.stroked) ||
          (element.typename === 'Compound路径Item' && !element.pathItems[0].filled && !element.pathItems[0].stroked) ||
          (element.typename === '文本Frame' && element.textRange.fill颜色 == '[否颜色]' && element.textRange.stroke颜色 == '[否颜色]'))
          clearArr.push(element);
      }
      if (element.typename === 'GroupItem' || element.typename === '图层') {
        ungroup(element);
      }
    } catch (e) { }
  }
}

// Remove empty clipping masks after ungroup
function removeMasks(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].remove();
  }
}

function show错误(err) {
  if (confirm(scriptName + ': an unknown error has occurred.\n' +
    'Would you like to see more information?', true, 'Unknown 错误')) {
    alert(err + ': on line ' + err.line, 'Script 错误', true);
  }
}