const vscode = require('vscode');
/**
 * @description 判断是否是object
 * @param {Object} object
 */
function isObj(object){
    return object && typeof (object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";
};

/**
 * @description 获取跟主题相匹配的颜色
 *   - fontFamily           字体
 *   - fontSize             字号
 *   - background           背景色
 *   - fontColor            字体颜色
 *   - liHoverBackground    li类元素，悬停背景色
 *   - inputBgColor         输入框背景色
 *   - inputLineColor       输入框线条颜色
 *   - lineColor            其它线条颜色
 *   - scrollbarColor       滚动条颜色
 * @param {String} area - HBuilderX区域，当area=undefinded，返回编辑器区域的背景色；当area=siderBar时，返回项目管理器背景色
 * @return {Object}
 */
export function getHBuilderXThemeData(area) {
    let background;
    let fontColor;
    let liHoverBackground;
    let inputBgColor;
    let inputLineColor;
    let lineColor;
    let scrollbarColor;
		
		let HoverTextColor;
		let HoverPropColor;
		let HoverNumColor;
		let HoverUnitColor;

    let config = vscode.workspace.getConfiguration();
		console.log('==== config :', config);
    let colorScheme = config.get('editor.colorScheme');
    let colorcustomColorsizations = config.get('workbench.colorCustomizations');


    // 获取HBuilderX编辑器字体大小
    let fontSize = config.get('editor.fontSize');
    if (fontSize == undefined) {
        fontSize = 14;
    };
// 代码助手
// 名称	描述
// editorSuggestWidget.background	助手弹窗背景颜色
// editorSuggestWidget.border	助手弹窗边框颜色
// editorSuggestWidget.selectedBackground	助手弹窗选中条目时背景颜色
// editorSuggestWidget.link	助手链接颜色
    // 获取HBuilderX编辑器字体
    let fontFamily = config.get("editor.fontFamily");
    if (fontFamily) {
        fontFamily = "Monaco"
    };

    // 获取当前主题
    if (colorScheme == undefined) {
        colorScheme = 'Default';
    };

    // 处理用户自定义的颜色
    let customColors = {};
    try{
        customColors = colorcustomColorsizations[`[${colorScheme}]`];
        if (!isObj(customColors)) {
            customColors = {};
        };
    }catch(e){};

    // 根据参数，返回编辑器、或项目管理器背景色
    let viewBackgroundOptionName = area == 'siderBar' ? 'sideBar.background' : 'editor.background';
    let viewFontOptionName = area == 'siderBar' ? 'list.foreground' : undefined;
    let viewLiHoverBgOptionName = area == 'siderBar' ? 'list.hoverBackground' : 'list.hoverBackground';

    switch (colorScheme){
        case "Monokai":
            background = 'rgb(39,40,34)';
            fontColor = 'rgb(179,182,166)';
            liHoverBackground = 'rgb(78,80,73)';
            inputBgColor = '#2E2E2E';
            inputLineColor = 'rgb(81,140,255)';
            lineColor = 'rgb(23,23,23)';
            scrollbarColor = '#6F6F6F';
						
						HoverPropColor = 'rgb(85, 170, 255)';
						HoverTextColor = 'rgb(184, 199, 205)';
						HoverNumColor = 'rgb(213, 162, 132)';
						HoverUnitColor = 'rgb(117, 188, 109)';
            break;
        case "Atom One Dark":
            background = 'rgb(40,44,53)';
            fontColor = 'rgb(171,178,191)';
            liHoverBackground = 'rgb(44,47,55)';
            inputBgColor = '#2E2E2E';
            inputLineColor = 'rgb(81,140,255)';
            lineColor = 'rgb(33,37,43)';
            scrollbarColor = '#6F6F6F';
						
						HoverPropColor = 'rgb(85, 170, 255)';
						HoverTextColor = 'rgb(184, 199, 205)';
						HoverNumColor = 'rgb(213, 162, 132)';
						HoverUnitColor = 'rgb(117, 188, 109)';
            break;
        default:
            background = 'rgb(255,250,232)';
            fontColor = '#243237';
            liHoverBackground = 'rgb(224,237,211)';
            inputBgColor = 'rgb(255,254,250)';
            inputLineColor = 'rgb(65,168,99)';
            lineColor = 'rgb(225,212,178)';
            scrollbarColor = 'rgb(207,181,106)';
						
						HoverPropColor = 'rgb(65,168,99)';
						HoverTextColor = '#243237';
						HoverNumColor = 'rgb(255, 170, 127)';
						HoverUnitColor = 'rgb(117, 188, 109)';
            break;
    };
     
    if (customColors != undefined) {
        if (customColors[viewBackgroundOptionName] && viewBackgroundOptionName in customColors) {
            background = customColors[viewBackgroundOptionName];
        };
        if (customColors[viewFontOptionName] && viewFontOptionName in customColors) {
            fontColor = customColors[viewFontOptionName];
						HoverPropColor = fontColor;
						HoverTextColor = fontColor;
						HoverNumColor = fontColor;
						HoverUnitColor = fontColor;
        };
        if (customColors[viewLiHoverBgOptionName] && viewLiHoverBgOptionName in customColors) {
            liHoverBackground = customColors[viewLiHoverBgOptionName];
        };
    };

    return {
        fontFamily,
        fontSize,
        background,
        fontColor,
        liHoverBackground,
        inputLineColor,
        inputBgColor,
        lineColor,
        scrollbarColor,
				HoverPropColor,
				HoverTextColor,
				HoverNumColor ,
				HoverUnitColor
    };
};