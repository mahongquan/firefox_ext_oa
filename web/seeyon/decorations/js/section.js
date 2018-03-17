var genericURL = '/seeyon';

var default_link = "javascript:void(null)";

var regExp = "^[a-zA-z0-9]+:(\/\/|\\\\)";
var regExp1 = "^(javascript|mailto):";
var regExp_JSI18N = "^\\$\\{(.+)\\}$";
//当前所选栏目ID
var currentSectionId = null;

function getSectionLoadingHTML(){
	var sectionLoadingHTML  = "";
	sectionLoadingHTML += "<table style='' align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n";
	sectionLoadingHTML += "  <tr>\n";
	sectionLoadingHTML += "    <td class=\"text_overflow section-loading\">" + $.i18n("section.loading") + "</td>\n";
	sectionLoadingHTML += "  </tr>\n";
	sectionLoadingHTML += "</table>\n";
	
	return sectionLoadingHTML;
}
	
var ua = navigator.userAgent;
var opera = /opera [56789]|opera\/[56789]/i.test(ua);
var ie = !opera && /MSIE/.test(ua);
var ie50 = ie && /MSIE 5\.[01234]/.test(ua);
var ie6 = ie && /MSIE [6789]/.test(ua);
var ieBox = ie && (document.compatMode == null || document.compatMode != "CSS1Compat");
var moz = !opera && /gecko/i.test(ua);
var nn6 = !opera && /netscape.*6\./i.test(ua);

var frontPageOutUtilsJS = true;

var sectionWidths = [];

function initSectionWidths(){
	if(decoration == "fontPage4Dep"){
		decoration = "D2_3-4_4_2"
	}
	else if(decoration == "fontPage4Group" || decoration == "fontPage"){
		decoration = "D2_2-5_5"
	}
	
	if(sectionWidths == null){
		sectionWidths = [0, 0, 0, 0];
		try {
			var _sectionWidths = decoration.substring(1).split("-")[1].split("_");
			for(var i = 0; i < _sectionWidths.length; i++) {
				sectionWidths[i] = parseInt(_sectionWidths[i], 10);
			}
		}
		catch (e) {
		}
	}
}

/**
 * 取得窗口的宽度、高度
 */
function getScreenRect(el) {	
	try{
		var xScroll, yScroll;
		if (window.innerHeight && window.scrollMaxY) {	
			xScroll = window.innerWidth + window.scrollMaxX;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight){
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else {
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}
		var windowWidth, windowHeight;
		if (self.innerHeight) {	// all except Explorer
			if(document.documentElement.clientWidth){
				windowWidth = document.documentElement.clientWidth; 
			} else {
				windowWidth = self.innerWidth;
			}
			windowHeight = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) { 
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) { // other Explorers
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}	
		if(yScroll < windowHeight){
			pageHeight = windowHeight;
		} else { 
			pageHeight = yScroll;
		}
		if(xScroll < windowWidth){	
			pageWidth = xScroll;		
		} else {
			pageWidth = windowWidth;
		}
		return {
			width:pageWidth,
			height:pageHeight
		}
	}
	catch(e) {
	}
}

var defaultFullLength = 80;
//Width : [80%, 60px, 70px, 60px]
var layoutTypeConstants = {
	D2_2W8_2 : {
		datetimePattern : "yyyy/MM/dd HH:mm", //时间格式
		defaultPanelTitleLength : 21, //栏目标题显示的字数，有总数
		defaultPanelTitleLengthWithoutTotal : 28, //栏目标题显示的字数，没有总数
		defaultMemberNameLength : 18, //人名字数
		
		multiRowFourColumnTempleteColumnWidth : [70, 60, 70, 70], //四列模板的列宽度
		calendarFourColumnTempleteColumnWidth : [70, 70, 80, 60], //四列日程模板的列宽度
		multiRowThreeColumnTempleteColumnWidth : [60, 20, 20] //三列模板的列宽度
	},
	
	//4频道
	D2_2W5_5 : {
		datetimePattern : "MM/dd HH:mm", //时间格式
		defaultPanelTitleLength : 11, //栏目标题显示的字数，有总数
		defaultPanelTitleLengthWithoutTotal : 15, //栏目标题显示的字数，没有总数
		defaultMemberNameLength : 9, //人名字数
		
		multiRowFourColumnTempleteColumnWidth : [60, 50, 50, 36], //四列模板的列宽度
		calendarFourColumnTempleteColumnWidth : [60, 65, 90, 50], //四列日程模板的列宽度
		multiRowThreeColumnTempleteColumnWidth : [60, 20, 20] //三列模板的列宽度
	},
	//6频道
	D2_3W4_4_2 : {
		datetimePattern : "MM/dd HH:mm",
		defaultPanelTitleLength : 8,
		defaultPanelTitleLengthWithoutTotal : 14,
		defaultMemberNameLength : 8,
		
		multiRowFourColumnTempleteColumnWidth : [50, 60, 65, 65],
		calendarFourColumnTempleteColumnWidth : [60, 65, 90, 50], //四列日程模板的列宽度
		multiRowThreeColumnTempleteColumnWidth : [60, 20, 20] //三列模板的列宽度
	}
}

layoutTypeConstants.fontPage4Group = layoutTypeConstants.D2_2W5_5;
layoutTypeConstants.fontPage4Dep = layoutTypeConstants.D2_2W5_5;
layoutTypeConstants.fontPage = layoutTypeConstants.D2_2W5_5;
layoutTypeConstants.D3_2W5_5 = layoutTypeConstants.D2_2W5_5;

var bodyWidth = document.documentElement.clientWidth;

var chessboardLayoutFixLength = {
	D1_M_T : {
		layout_0 : 0,
		layout_0_width : 99
	},
	D2_M_3_7_T : {
		layout_0 : 0,
		layout_1 : 7,
		layout_2 : 7,
		layout_3 : 0,
		layout_0_width : 29.5,
		layout_1_width : 69.5,
		layout_2_width : 69.5,
		layout_3_width : 99
	},
	D2_M_5_5_T : {
		layout_0 : 0,
		layout_1 : 0,
		layout_2 : 5,
		layout_3 : 0,
		layout_0_width : 99,
		layout_1_width : 49.5,
		layout_2_width : 49.5,
		layout_3_width : 99
	},
	D2_M_7_3_T : {
		layout_0 : 0,
		layout_1 : 0,
		layout_2 : 5,
		layout_3 : 0,
		layout_0_width : 69.5,
		layout_1_width : 69.5,
		layout_2_width : 29.5,
		layout_3_width : 99
	},
	D3_M_3_4_3_N : {
		layout_0 : 0,
		layout_1 : 0,
		layout_2 : 5,
		layout_3 : 5,
		layout_4 : 0,
		layout_0_width : 99,
		layout_1_width : 29,
		layout_2_width : 39.5,
		layout_3_width : 29.5,
		layout_4_width : 99
	},
	D3_M_3_4_3_T : {
		layout_0 : 0,
		layout_1 : 5,
		layout_2 : 5,
		layout_3 : 5,
		layout_4 : 0,
		layout_0_width : 29,
		layout_1_width : 69.5,
		layout_2_width : 39.5,
		layout_3_width : 28,
		layout_4_width : 99
	},
	D3_M_4_4_2_T : {
		layout_0 : 0,
		layout_1 : 0,
		layout_2 : 5,
		layout_3 : 5,
		layout_4 : 0,
		layout_0_width : 99,
		layout_1_width : 39,
		layout_2_width : 39.5,
		layout_3_width : 20,
		layout_4_width : 99
	}
}
function getChessboardTemplateFixLength(y,width){
	var _decoration = decoration.replace("-", "_");
	while(_decoration.indexOf("-") >=0){
		_decoration = _decoration.replace("-", "_");
	}
	var fixLength;
	var fixLengthWidth;
	eval("fixLength = chessboardLayoutFixLength."+_decoration+".layout_"+y);
	eval("fixLengthWidth = chessboardLayoutFixLength."+_decoration+".layout_"+y+"_width");
	if(!fixLength){
		fixLength = 0;
	}
	if(!fixLengthWidth){
		fixLengthWidth = width / 10;
	}else{
		fixLengthWidth = fixLengthWidth / 100;
	}
	var divWidth = (bodyWidth - 22) * fixLengthWidth - fixLength;
	return parseInt(divWidth);
}
function getLayoutPanelWidth(y){
	var  panelWidthFlag = sectionWidths[y];
	var  multiPanelWidth = getChessboardTemplateFixLength(y,panelWidthFlag) - 90;
	if ($.browser.msie && ($.browser.version == '8.0' || $.browser.version == '7.0' || $.browser.version == '6.0')) {
		multiPanelWidth = multiPanelWidth - 2;
	}
	return multiPanelWidth;
}
/**
 * 获取常量(根据布局) 
 */
function getLayoutTypeConstant(variableName){
	var _decoration = decoration.replace("-", "W");
	while(_decoration.indexOf("-") >=0){
		_decoration = _decoration.replace("-", "W");
	}
	eval(" if(!layoutTypeConstants." + _decoration + "){" +
			"layoutTypeConstants." + _decoration + " = layoutTypeConstants.D2_2W5_5"+
			"}")
	
	return eval("layoutType = layoutTypeConstants." + _decoration + "." + variableName);
}

/**
 * 默认的行数
 */
var default_row_number = 8;

String.prototype.makeFirstUppercase = function(){
	var c = this.charAt(0);
	return c.toUpperCase() + this.substring(1);
}


/**
 * 栏目页签对象
 */
function SectionPanel(id, nodeId, sectionId, sectionBeanId, title, total, totalUnit, entityId, ordinal, icon,width,delay,readOnly,hasParam){
	this.id = id;
	this.nodeId = nodeId;
	this.sectionId = sectionId;
	this.sectionBeanId = sectionBeanId;
	this.title = $.i18n(title) || title;
	this.total = total;
	this.totalString = (total != null) ? (totalUnit ? "(" + total + totalUnit + ")" : $.i18n("section.title.total", total)) : "";
	this.index = -1;
	this.len = -1;
	this.entityId = entityId;
	this.ordinal = ordinal;
	this.icon = icon || null;
	
	var entityXY = eval(("entityXY_" + entityId).replace("-", "_"));
	
	this.x = entityXY.x;
	this.y = entityXY.y;
	//this.ordinal = ordinal;
	this.delay = delay;//是否切换空间时候不刷新
	
	this.isReadOnly = readOnly;
	this.hasParam   = hasParam;
	
	sectionWidths[this.y]= width|| sectionWidths[this.y];
	
	sectionHandler.allSectionPanels[id] = this;
}
var sectionPanelLoadOder = 0;

/**
 * 显示页签
 */
function showSectionPanel(nodeId, panels){
	var str = "";
	var len = panels.length;
	if(len == 0){
		return;
	}
	
	if(len == 1){
		//单频道
		str = showSinglePanel(panels[0]);
	}
	else{
		//多频道
		str = showMultiPanel(panels);
	}

	document.getElementById("title" + nodeId).innerHTML = str;
		
	var panel0 = panels[0];
	var entityId = panel0.entityId;
	document.getElementById("PanelId_"+entityId).value=panel0.id;
	//显示数据加载等待条
	document.getElementById(nodeId).innerHTML = getSectionLoadingHTML();
	//延迟加载数据
	window.setTimeout("showSection('" + panel0.id + "')", (sectionPanelLoadOder++) * 120);
	
	var showState = $("#showState").val();
	if(showState == "edit"){	
		$("#panelDiv"+nodeId).css("display","none");
		$("#"+nodeId).css("display","none");
	}
}

function showMultiPanel(panels){
	var showState = $("#showState").val();
	var len = panels.length;
	len = len > 3 ? 3 : len; //最多3个
	var str = new StringBuffer();
	//默认操作第一个panel
	var panel = panels[0];
	var nId = panel.nodeId + "_" + 0;

	 //动态计算panel可以显示的字符长度

	var  multiPanelWidth = getLayoutPanelWidth(panel.y);
	
	str.append("<div class=\"common_tabs index_tabs\">");
  str.append("<ul style='float:left;'><li>");
  if(showState == "show"){
    str.append("<a class=\"show color_black_nohover\"  id='section_show"+panel.nodeId+"' onclick=\"portalSectionHander.toggleSection('"+panel.nodeId+"')\"><span class=\"left margin_5\"> </span></a>");
  }else{
    str.append("<a class=\"show color_black_nohover\"></a>");
  }
  str.append("</li>");
  
  for(var i = 0; i < len; i++) {
    panel = panels[i];
    panel.index = i;
    panel.len   = len;
    var titleLen = parseInt(multiPanelWidth/panel.len);
    var showTitleNum = parseInt((titleLen - 20)/7);
    
    var totalStr = panel.totalString;
    var len = panel.len;
    if(sectionWidths[panel.y]&&sectionWidths[panel.y]==2){
      totalStr = "";
    }
	showTitleNum = showTitleNum - totalStr.length;
	if(showTitleNum <= 0){
    	showTitleNum = 1;
    }
 	var limitTitle = panel.title.getLimitLength(showTitleNum);

    nId = panel.nodeId + "_" + i;
    var current = "current";
    if(i!=0){
      current = "";
    }
    str.append("<li class=\""+current+"\" id='section_name_total"+panel.nodeId+"'  onclick=\"changPanels('"+nId+"','"+panel.id+"','"+panels[0].id+"');showSection('" + panel.id + "', true)\">");
      str.append("<a class=\"color_black_nohover\">");
      str.append("<span id=\"Text" + nId + "\" title=\"" + panel.title.escapeHTML() + "\" >" + limitTitle.escapeHTML() + "</span>");
      if(showState == "show"){
        str.append("<span id=\"Total" + nId + "\" class='sectionTitleTotal'>" + totalStr + "</span>");
      }
      str.append("</a>");
    str.append("</li>");
    str.append("<div style='display:none;' nowrap id=\"" + nId + "\" panelId='" + panel.id + "' sectionId=\"" + panel.sectionId + "\"></div>");
  }
  str.append("</ul>");
  str.append("</div>");
	
	//--------------下拉箭头功能-----------------//
	if(showState != 'view' && (checkSpaceAllowDefined()=='true') || checkEditPermis()||showState=='edit'){
		str.append("<div class='sectionAdd' title="+$.i18n("portal.button.sectionAdd")+" style='float:right;display:none;' id=\"add_section_div"+panel.nodeId+"\" onclick=\"portalSectionHander.addSectionsToFrag('"+panels[0].id+"')\"></div>");
		str.append("<div class='sectionDel' title="+$.i18n("portal.button.sectionDel")+" style='float:right;display:none;' id=\"del_section_div"+panel.nodeId+"\" onclick=\"portalSectionHander.deleteFragment('"+panels[0].id+"')\"></div>");
		str.append("<div class='sectionEdit' title="+$.i18n("portal.button.sectionEdit")+" style='float:right;display:none;' id=\"edit_section_div"+panel.nodeId+"\" onclick=\"portalSectionHander.loadSectionPro('"+panels[0].id+"')\"></div>");
	}else{
		str.append("    <div class='sectionTitleMenu-null' id=\"show_edit_div"+panels[0].id+"\"></div>");
	}
	str.append("  	</div>");
	//str.append("</div>");
	return str.toString();
}
function changPanels(tabId,panelId,id){
	var showState = $("#showState").val();
	if(showState=='view'){
		return;
	}
	var panel = sectionHandler.allSectionPanels[panelId];
	var nodeId = panel.nodeId;
	//tab change
	var selectedSpanId = "Text"+tabId;
	$("span[id^='Text"+panel.nodeId+"']").each(function(i,obj){
		var currentSpanId = "Text"+panel.nodeId+"_"+i;
		if(currentSpanId==selectedSpanId){
			//切换频道切换样式
			$(obj).parent().parent().addClass("current");
		}else{
			//切换频道切换样式
			$(obj).parent().parent().removeClass("current");
		}
	});
	//切换频道切换编辑按钮状态
	var editDiv = $("#editDiv"+panel.nodeId);
	if(panel.isReadOnly.toString()=="false" && panel.hasParam =="true"){
		$("#edit_section_div"+nodeId).show();
		//当同频道的栏目处于编辑状态时，切换频道自动切换编辑状态
		if(editDiv.children().length>0){
			portalSectionHander.loadSectionPro(id);
		}
	}else{
		$("#edit_section_div"+nodeId).hide();
		if(editDiv.children().length>0){
			editDiv.children().hide();
		}
	}
}
function checkEditPermis(){
	var hasRight = false;
	try{
		if(trueSpaceType =="department"){
			if(getCtpTop().contentFrame.topFrame.managerDepartments.contains(departmentSpaceId)){
				return true;
			}
		}else{
			if(spaceId && getCtpTop().contentFrame.topFrame.managerDepartments.contains(spaceId)){
				hasRight = true;
			}
		}
	}catch(e){}
	return hasRight;
}
function checkSpaceAllowDefined(){
	if(typeof isAllowdefined != 'undefined'){
		return isAllowdefined;
	}else{
		return false;
	}
}
function showSinglePanel(panel){
	var showState = $("#showState").val();
	var nId = panel.nodeId + "_" + 0;
	panel.index = 0;
	panel.len   = 1;
	//动态计算panel可以显示的字符长度
	var  multiPanelWidth = getLayoutPanelWidth(panel.y);
	var  totalStr = panel.totalString;
	var showTitleNum = parseInt((multiPanelWidth - 20)/7);
	if(totalStr){
		showTitleNum = showTitleNum - totalStr.length;
	}
	if(showTitleNum <= 0){
    	showTitleNum = 1;
    }
	
	var str = new StringBuffer();
	str.append("<div class=\"common_tabs index_tabs\">");
	str.append("<ul style='float:left;'><li>");
	if(showState == "show"){
		str.append("<a class=\"show color_black_nohover\"  id='section_show"+panel.nodeId+"' onclick=\"portalSectionHander.toggleSection('"+panel.nodeId+"')\"><span class=\"left margin_5\"> </span></a>");
	}else{
		str.append("<a class=\"show color_black_nohover\"></a>");
	}
	str.append("</li>");
	str.append("<li class=\"current\" id='section_name_total"+panel.nodeId+"'  onclick=\"showSection('" + panel.id + "', true)\">");
	str.append("<a class=\"color_black_nohover\" >");
	
	str.append("<span id=\"Text" + nId + "\" title=\"" + panel.title.escapeHTML() + "\">" + panel.title.getLimitLength(showTitleNum).escapeHTML() + "</span>");
	
	if(showState == "show"){
		str.append("<span id=\"Total" + nId + "\" class='sectionTitleTotal'>" + panel.totalString + "</span>");
	}
	
	str.append("</a>");
	str.append("<div nowrap id=\"" + nId + "\" panelId='" + panel.id + "' sectionId=\"" + panel.sectionId + "\"></div>");
	str.append("</li></ul>");
	str.append("</div>");
	//str.append("<span class=\"max right\"> </span>");
	//str.append("<span class=\"edit right\"> </span>");
	if(showState != 'view' && ((checkSpaceAllowDefined()=='true') || checkEditPermis()||showState=='edit')){
	  str.append("<span class=\"sectionAdd\" title="+$.i18n("portal.button.sectionAdd")+" style='float:right;display:none;' id=\"add_section_div"+panel.nodeId+"\" onclick=\"portalSectionHander.addSectionsToFrag('"+panel.id+"')\"></span>");
		str.append("<span class=\"sectionDel\" title="+$.i18n("portal.button.sectionDel")+" style='float:right;display:none;' id=\"del_section_div"+panel.nodeId+"\" onclick=\"portalSectionHander.deleteFragment('"+panel.id+"')\"></span>");
		str.append("<span class=\"sectionEdit\" title="+$.i18n("portal.button.sectionEdit")+" style='float:right;display:none;' id=\"edit_section_div"+panel.nodeId+"\" onclick=\"portalSectionHander.loadSectionPro('"+panel.id+"')\"></span>");
	}else{
		str.append("<span class='sectionTitleMenu-null' id=\"show_edit_div"+panel.id+"\"></span>");
	}
	return str.toString();
}
/**
* 栏目title的事件，状态切换，废弃
 */
function changeSpaceState(id, state){
	try{
		if(document.getElementById(id).className=='sectionTitleMiddel'){
			return false;
		}else{
			if(state=='over'){
				document.getElementById('Left'+id).className = 'sectionTitleLeftOver';
				document.getElementById(id).className = 'sectionTitleMiddelOver';
				document.getElementById('Right'+id).className = 'sectionTitleRightOver';
			}else{
				document.getElementById('Left'+id).className = 'unSectionTitleLeft';
				document.getElementById(id).className = 'unSectionTitleMiddel';
				document.getElementById('Right'+id).className = 'unSectionTitleRight';
			}
		}
	}catch(e){}
}
/**
 * 栏目title的事件，用于显示栏目数据
 * @param id 栏目id
 * @param isLoadFromServer是否从服务器端得到
 * @param labelId 页签id
 */
function showSection(id, isLoadFromServer){
	var showState = $("#showState").val();
	var panel = sectionHandler.allSectionPanels[id];
	var section = sectionHandler.allSections[id];
	//当前所选栏目ID
	currentSectionId = panel.sectionId;
	if(section == null || isLoadFromServer == true){
		//缓存currentPanelId
		var currentPanel = "";
		if(section){
			currentPanel = section.index;
		}else{
			currentPanel = panel.index;
		}
		section = new Section(panel.id, panel.sectionId, panel.sectionBeanId, panel.nodeId, panel.index, panel.len, panel.entityId, panel.ordinal, panel.x, panel.y,panel.singleBoardId);
		sectionHandler.allSections[id] = section;
		section.currentPanel = currentPanel;
		if(showState=='show'){
			section.loadData();
		}
	}
	else{
		document.getElementById(section.nodeId).innerHTML = section.html;
		document.close();
	}
	if(showState=='show'){
  	try{
  		if(currentSectionId=='NCPendingSection')
  		{
  			getCtpTop().reloadNCApplet();
  		}
  	}catch(e){
  		getCtpTop().refreshHomePageForNC();
  	}
	}
	
	section.updateTitle();
}

//任务详情
function viewTaskInfo(id,sourceFeedback,sectionId) {
	    var res = parent.accessManagerData(id ,"task");
	    if (res != null && res.length > 0) {
	       $.alert({
	           'msg' : res,
	           ok_fn : function() {
	               sectionHandler.reload(sectionId,true);
	           }
	       });
	       return;
	    }
        var title = $.i18n("taskmanage.content");
        dialog = $.dialog({
        	        id : 'viewPortalTask',
                    url : _ctxPath
                            + '/taskmanage/taskinfo.do?method=taskDetailIndex&id='
                            + id+'&sourceFeedback='+sourceFeedback,
                    width : $(getCtpTop()).width() - 100,
                    height : $(getCtpTop()).height() - 100,
                    title : title,
                    targetWindow : getCtpTop(),
		            closeParam:{
		                'show':true,
		                autoClose:false,
		                handler:function(){
		                	try {
		                		dialog.getClose({'dialogObj' : dialog ,'runFunc' : refreshTaskPortlet ,'sectionId' : sectionId});
		                    } catch (e){}
		                }
		            },
		            buttons: [{
		                text: $.i18n("common.button.close.label"),
		                handler: function () {
		                	try {
		                		dialog.getClose({'dialogObj' : dialog ,'runFunc' : refreshTaskPortlet ,'sectionId' : sectionId});
		                	} catch (e){}
		                }
		            }]
		        });
    }
//刷新任务栏目    
function refreshTaskPortlet(sectionId) {
	if(sectionId != undefined) {
	   if(sectionId != null || sectionId != "null") {
	       sectionHandler.reload(sectionId , true);
	   }
	} else {
		sectionHandler.reload('taskMySection' , true);
	}
	setTimeout("getCtpTop().timeLineObjReset(getCtpTop().timeLineObj)",0);
}

//弹出新建任务页面
function newTaskInfo(sectionId){
	    var isContinuous = false;
        var dialog = $.dialog({
            id : 'new_task',
            url : _ctxPath + '/taskmanage/taskinfo.do?method=newTaskInfo&from=Personal&optype=new&flag=1',
            width : 600,
            height : 500,
            title : $.i18n('menu.taskmanage.new'),
            targetWindow : getCtpTop(),
            bottomHTML : '<div class="common_checkbox_box clearfix "><label class="margin_r_10 hand" for="continuous_add"><input id="continuous_add" class="radio_com" name="continuous" value="0" type="checkbox">&nbsp;&nbsp;'+ $.i18n("taskmanage.add.continue") +'</label></div>',
            closeParam:{
                'show':true,
                handler:function(){
                    if(isContinuous == true || isContinuous == "true") {
                        refreshTaskPortlet(sectionId);
                    }
                }
            },
            buttons : [ {
                text : $.i18n('common.button.ok.label'),
                handler : function() {
                    var isChecked = dialog.getObjectById("continuous_add")[0].checked;
                    var ret = dialog.getReturnValue({'dialogObj' : dialog , 'isChecked' : isChecked , 'runFunc' : refreshTaskPortlet});
                    if(isChecked == true || isChecked == "true") {
                        if(ret == true || ret == "true") {
                            isContinuous = true;
                        }
                    }
                }
            }, {
                text : $.i18n('common.button.cancel.label'),
                handler : function() {
                    if(isContinuous == true || isContinuous == "true") {
                        refreshTaskPortlet(sectionId);
                    }
                    dialog.close();
                }
            } ]
        });
    }


/**
 * 栏目对象
 */
function Section(id, sectionId, sectionBeanId, nodeId, index, len, entityId, ordinal, x, y,singleBordId){
	this.id = id;
	this.sectionId = sectionId;
	this.sectionBeanId = sectionBeanId;
	this.nodeId = nodeId;
	this.index = index;
	this.len = len;
	this.entityId = entityId;
	this.ordinal = ordinal;
	this.x = x;
	this.y = y;
	
	this.html = "";
	
	this.attemptNum = 0;
	this.singleBordId = singleBordId;
	//当前显示页签
	this.currentPanel = "";
	this.panels =[];
	
	this.currentPage = 0;
	this.maxPage = 0;
}
/**
 * 显示总数
 */
Section.prototype.showTotal = function(total, TotalUnit){
	if(typeof total != 'undefined' && total != null){
		var nId = this.nodeId + "_" + this.index;
		document.getElementById("Total" + nId).innerHTML = TotalUnit ? "( " + total + TotalUnit + " )" : $.i18n("section.title.total", total);
	}
}
/**
 * 显示名称
 */
Section.prototype.showName = function(name){
	if(total){
		var nId = this.nodeId + "_" + this.index;
		document.getElementById("Text" + nId).innerHTML = name;
	}
}


/**
 * 定义回调函数
 */
Section.prototype.mergeLink = function(link){
	
	if(link.match(regExp1)){
		return link;
	}
	
	if(link.match(regExp)){
		return link;
	}
	
	return "javascript:openLink('"+genericURL + link+"')";
	
}
Section.prototype.invoke = function(result) {
	try {
		if(result){
			if(typeof result == "string"){
				if(result.indexOf("[LOGOUT]") == 0){
					getCtpTop().logout();
					return;
				}
				else{
					this.showExceptionInfo("");
				}
				
				return;
			}
			var err = result.error;
			if(err){
				sectionHandler.reloadSpace();
				return ;
			}
			var total = result.Total;
			var TotalUnit = result.TotalUnit;
			var data = result.Data;
					
			//加载资源文件
			/*var resource = data.sectionResources;
			if(resource && resource.length > 0){
				sectionHandler.loadResource(resource);
			}*/
			var resolveFun = data.resolveFunction;
			var titleName = result.Name;
			if(titleName){
				titleName = $.i18n(titleName) || titleName;
				//动态计算panel可以显示的字符长度
				var  multiPanelWidth = getLayoutPanelWidth(this.y);
	
				var limitTitle = titleName;
				var len = this.len;
				var titleLen = parseInt(multiPanelWidth / len);
				
				var showTitleNum = parseInt((titleLen - 20)/7);

				if(sectionWidths[this.y]&&sectionWidths[this.y] > 2){
          			if(total || total == 0){
          				var totalStr = TotalUnit ? "( " + total + TotalUnit + " )" : $.i18n("section.title.total", total);
            			this.showTotal(total, TotalUnit);
            			showTitleNum = showTitleNum - totalStr.length;
        			}
        		}
        		if(showTitleNum <= 0){
			    	showTitleNum = 1;
			    }
        		limitTitle = titleName.getLimitLength(showTitleNum);
        		
				$("#"+this.nodeId + "_"+this.index).attr("title",titleName);
				$("#Text"+this.nodeId + "_" + this.index).attr("title",titleName);
				$("#Text"+this.nodeId + "_" + this.index).text(limitTitle);
			}
			//panel
			/*var panels = data.get("panels");
			if(panels && panels.length > 1){
				//判断是否需要进行页签替换
				var needRelpacePanel = true;
				if(this.panels && this.panels.length >0){
					if(this.panels.length == panels.length){
						var ress = false;
						for(var i=0; i<this.panels.length; i++){
							if(this.panels[i].get("id") != panels[i].get("id")){
								ress = true;
								break;
							}
						}
						if(!ress){
							needRelpacePanel = false;
						}
					}
				}
				if(needRelpacePanel){
					var panelStr = sectionHandler.showPanels(panels,this.id);
					this.panels = panels;
					$("#panelDiv"+this.nodeId).html(panelStr);		
				}
			}else{*/
				$("#panelDiv"+this.nodeId).html("");	
			//}
		  
		   if(data.showBottomButton == true && data.bottomButtons){
		       var bottomButtonsStr = sectionHandler.showBottomButtons(data.bottomButtons,this.nodeId);
		       $("#footer"+this.nodeId+"_button").html(bottomButtonsStr).addClass("color_blue").show();
		   }else{
		       $("#footer"+this.nodeId+"_button").hide();
		   }
		   
			var sectionDivWidth = $("#"+this.nodeId).width();	
			if(resolveFun){
				var str = eval("sectionHandler.resolveFunction." + resolveFun + "(data, this.sectionBeanId, this.x, this.y,this.id,sectionWidths[this.y],sectionDivWidth)");
				if(str){
					this.html = str.toString();
					if(this.sectionBeanId=='guestbookSection'){
						 set_innerHTML(this.nodeId, this.html, 0);
					}else{
						 document.getElementById(this.nodeId).innerHTML = this.html;
					}
					document.close();
				}
			}
			this.attemptNum = 0;
		}
	}
	catch(e) {
		this.showExceptionInfo(e.message);
	}
}
/**
 * 加载栏目数据
 */
Section.prototype.loadData = function(param){
  var sectionMgr = new sectionManager();
  this.attemptNum++;
  this.showLoading();
  if(!sectionWidths[this.y])sectionWidths[this.y] = 10;
  //页签
  var panelId = this.currentPanel;
  
  var key = [];
  var value = [];
  if(param && param instanceof Properties){
    var keys = param.keys();
    for(var i = 0 ;i< keys.size();i++){
      var kk =  keys.get(i);
      key[key.length] = kk;
      value[value.length] = param.get(kk);
    }
  }
  var obj = new Object();
  obj['sectionBeanId'] = this.sectionBeanId;
  obj['entityId'] = this.entityId;
  obj['ordinal'] = this.ordinal;
  obj['spaceType'] = spaceType;
  obj['spaceId'] = spaceId;
  obj['ownerId'] = ownerId;
  obj['x'] = this.x;
  obj['y'] = this.y;
  obj['width'] = sectionWidths[this.y];
  obj['panelId'] = panelId;
  obj['paramKeys'] = key;
  obj['paramValues'] = value;
  var sectionImpl = this;
  sectionMgr.doProjection(obj,{
    success : function(jsonObj){
      var result;
      if (typeof jsonObj === 'string'){
        result = $.parseJSON(jsonObj); 
      }else{
        result = jsonObj;
      }
      sectionImpl.invoke(result);
    },
    error : function(request,settings,e){
      if(request.status==200){
        sectionImpl.invoke($.parseJSON(request.responseText));
      }else{
    	  //去除空白提示框
        //alert(e);
      }
    }
  });
}
/**
 * 显示栏目
 * 1、加载栏目数据
 * 2、将栏目Title置为被选择
 * 3、讲同频道的其它栏目Title值为未选择
 */
Section.prototype.updateTitle = function(){
	//var currentTitleNodeId = this.nodeId + "_" + this.index;
	//var currentTitleNode = $("#"currentTitleNodeId);
  var currentIndex = this.index;
	$("li[id^='section_name_total"+this.nodeId+"']").each(function(i,obj){
    if(i==currentIndex){
      $(obj).attr("class","current");
    }else{
      $(obj).attr("class","");
    }
  });
	for(var i = 0; i < this.len; i++) {		
		if(i == this.index){
			//selectSectionTitle(i, this.nodeId);
			sectionHandler.currentShowTitleIds.addSingle(this.nodeId + "_" + i);
		}
		else{
			//unSelectSectionTitle(i, this.nodeId);
			sectionHandler.currentShowTitleIds.remove(this.nodeId + "_" + i);
		}
	}
}

/**
 * 显示loading图标
 */
Section.prototype.showLoading = function(){
  try{
    //在iframe销毁前清理掉iframe中的内容（特别是flash）
      if($("#"+this.nodeId+" iframe")){
        $("#"+this.nodeId+" iframe").contents().find("body").empty();
      }
    }catch(e){
  }

	document.getElementById(this.nodeId).innerHTML = getSectionLoadingHTML();
	document.close();
}

/**
 * 
 */
Section.prototype.showExceptionInfo = function(message){	
	if(this.attemptNum < -1){//如果失败了，不再重试，可以手工重试
		this.loadData();
		return;
	}
	
	var str = $.i18n("section.excption");
	if(message){
		str += "<br>" + message;
	}
	
	document.getElementById(this.nodeId).innerHTML = "<div class=\"exceptionInfo\">" + str + "</div>";
	document.close();
}

function selectSectionTitle(index, nodeId){
	//document.getElementById("Left" + nodeId + "_" + index).className = "sectionTitleLeft";
	//document.getElementById(nodeId + "_" + index).className = "sectionTitleMiddel";	
	//document.getElementById("Right" + nodeId + "_" + index).className = "sectionTitleRight";
		
	//document.getElementById("Text" + nodeId + "_" + index).className = "sectionTitle";
	document.close();
}

function unSelectSectionTitle(index, nodeId){
	//document.getElementById("Left" + nodeId + "_" + index).className = "unSectionTitleLeft";
	//document.getElementById(nodeId + "_" + index).className = "unSectionTitleMiddel";	
	//document.getElementById("Right" + nodeId + "_" + index).className = "unSectionTitleRight";
		
	//document.getElementById("Text" + nodeId + "_" + index).className = "sectionTitleUnSelected";
	document.close();
}

/********************************************************************************************************/
/******************************************* 以下是首页栏目的解析脚本 ****************************************/
/********************************************************************************************************/

/**
 * 解析木板的参数依次是
 * @param result 数据集
 * @param titleId 所在当前页面的sectionPanel的titleId, 用于弹出窗口返回true值时，刷新栏目
 */
function ResolveFunction(){
	this.name = name;
}
/**
 * 多页签模版
 */
ResolveFunction.prototype.multiTabTemplate = function(result, titleId, x, y,id){
  var templeteNameList = result.templeteNameList || [];
  var templeteList = result.templeteList || [];
  var tabNameList = result.tabNameList || [];
  var str = new StringBuffer();
  var tdNum = templeteNameList.length;

  str.append("<div comp=\"type:'tab',width:100%,height:200\" class=\"comp\" id=\"tabs"+id+"\" comptype=\"tab\">");
  str.append("<div class=\"common_tabs clearfix\" id=\"tabs"+id+"_head\" style=\"width: 100%;\">");
  str.append("<ul class=\"left\">");
  for(var i=0; i<tabNameList.length; i++){
  	var tabName = tabNameList[i];
  	var current = i == 0? "current":"";
  	str.append("<li class=\""+current+"\" id=\"tab_"+i+"_panel\" tgt=\"tab_"+i+"_div\"><a href=\"javascript:showCurrentTab('tabs"+id+"','tab_"+i+"_panel')\"><span>"+tabName+"</span></a></li>");
  }
  str.append("</ul>");
  str.append("</div>");
  str.append("<div class=\"common_tabs_body border_all\" id=\"tabs"+id+"_body\" style=\"height: 200px;\">");
  for(var i=0; i<templeteNameList.length; i++){
  	var show = i == 0 ? "" : "hidden";
  	var templeteName = templeteNameList[i];
    var dataHtml = eval("sectionHandler.resolveFunction." + templeteName + "(templeteResult, titleId, this.x, this.y,this.id)");
  	str.append("<div id=\"tab_"+i+"_div\" style=\"height: 200px;\" class=\""+show+"\">"+dataHtml+"</div>");
  }
  str.append("</div>");
  str.append("</div>");
  return str;
}
/**
 * 多页签模板切换
 */
function showCurrentTab(tabId,tabDivId){
  $.each($("#"+tabId).find("li"),function(i,obj){
    var objId = $(obj).attr("id");
    var targetDivId = $(obj).attr("tgt");
    if(objId == tabDivId){
      $(obj).attr("class","current");
      $("#"+targetDivId).show();
    }else{
      $(obj).attr("class","");
      $("#"+targetDivId).hide();
    }
  });
}
/**
 * 多列表模版
 */
ResolveFunction.prototype.multiListTemplete = function(result, titleId, x, y,id,width,divWidth){
  var templeteNameList = result.templeteNameList || [];
  var templeteList = result.templeteList || [];
  var widthList = result.widthList || [];
  var str = new StringBuffer();
  var tdNum = templeteNameList.length;
  var tableWidth = 200;

  if(width&&width==10){
    tableWidth = 100;
  }
  
  var marginWidth = 0;
  if(tdNum>0){
    marginWidth = (tdNum*1)-1;
    columnWidth = (100-marginWidth)/tdNum;
    divWidth = parseInt(divWidth / tdNum);
  }
  str.append("<div style='overflow:auto;width:100%;height:100%'><table width=\""+tableWidth+"%\"><tr>");
  for(var i=0; i<templeteNameList.length; i++){
    var templeteName = templeteNameList[i];
    var templeteResult = templeteList[i];
    if(widthList.length>0){
		columnWidth = widthList[i];
    }
    str.append("<td class='' width=\""+columnWidth+"%\">");
    var dataHtml = eval("sectionHandler.resolveFunction." + templeteName + "(templeteResult, titleId, x, y,id,width,divWidth)");
    str.append(dataHtml);
    str.append("</td>");
    if(i<templeteNameList.length-1){
      str.append("<td width=\"1\" class='text_overflow border_r' style='front-size:0'>&nbsp;</td>");
      str.append("<td width=\"1\" class='text_overflow' style='front-size:0'>&nbsp;</td>");
    }
  }
  str.append("</tr>");
  str.append("</table></div>");
  return str;
}
/**
 * 多行4列：四列依次是：subject createDate createMemberName category
 */
ResolveFunction.prototype.multiRowFourColumnTemplete = function(result, titleId, x, y,sectionId,width,divWidth){
	var todayFirstTime = result.todayFirstTime;
	var rows = result.rows || [];
	
	var str = new StringBuffer();
	
	str.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	var i = 0;
	var columnWidth = getLayoutTypeConstant("multiRowFourColumnTempleteColumnWidth");
	
	var subjectLength;
	if(width){
		 subjectLength = defaultFullLength * (width / 10) * columnWidth[0] / 100 -5;
	}else{
		 subjectLength = defaultFullLength * (sectionWidths[y] / 10) * columnWidth[0] / 100 -5;
	}
	
	var memberNameLength = getLayoutTypeConstant("defaultMemberNameLength");
	var rowList = result.rowList;
	if(!rowList){
		rowList = ['subject','receiveTime','sendUser','clickNumber','category'];
	}
	var theRowList = new ArrayList();
	theRowList.addAll(rowList);
	//数据显示
	for(i = 0; i < rows.length; i++) {
		var r = rows[i];
		var createDate = "";
		if(r.createDate){
			createDate = sectionHandler.showDatetime(r.createDate,r.createDateTime,todayFirstTime);
		}
		//var createDate = r.createDate;
		
		var link = r.link || default_link;
		var openType = parseInt(r.openType|| "0", 10);
		link = sectionHandler.mergeLinkOfOpenType(openType, link, titleId);
		
		var createMemberName = r.createMemberName || "&nbsp;";
		var createMemberAlt = createMemberName;
		
		var clickNumber = r.clickNumber;
		var clickNumberAlt = clickNumber;
		
		if(r.createMemberAlt){
			createMemberAlt = r.createMemberAlt;
		}
		if(r.clickNumberAlt){
		    clickNumberAlt = r.clickNumberAlt;
        }
		var className = "defaulttitlecss";
		
		var categoryLabel = "";
		var applicationCategoryKey = r.applicationCategoryKey;
		var applicationSubCategoryKey = r.applicationSubCategoryKey;
		
		if(applicationCategoryKey){
			var suffix = "";
			/**
			 * TODO:版本判断
			 */
			/*if(typeof(getCtpTop().isGov)!='undefined' && getCtpTop().isGov) {
				if(applicationCategoryKey == 22 || applicationCategoryKey == 23 || applicationCategoryKey == 24) {//待签收->收文签收
					suffix = "GOV";
				}
			}*/
			categoryLabel = $.i18n("application_" + applicationCategoryKey + suffix + (applicationSubCategoryKey ? "_" + applicationSubCategoryKey : "") + "_label");
		}
		else{
			categoryLabel = r.categoryLabel;
		}
		
		categoryLabel = categoryLabel || " ";
		
		var categoryLink = r.categoryLink;
		
		var alt = r.alt|| "";
		var subject = r.subject|| "";
		var subjectHTML = r.subjectHTML;
		
		var title = "";
		if(subjectHTML){
			title = subjectHTML;
		}
		else{
			var bodyType = r.bodyType;
			var importantLevel = r.importantLevel;
			var hasAttachments = r.hasAttachments;
			var extIcons = r.extIcons;
			var isAgent = r.agent == "true";
			var isDistinct = r.distinct == "true";
		
			alt = alt || subject;
			/*
			if(isDistinct){
				className = "distinct";
			}
			else if(isAgent){
				className = "agent";
				subjectLength = subjectLength == null ? null : subjectLength - 6;
			}
			else{
				className = "defaulttitlecss";
			}*/
			title = sectionHandler.mergeSubject(subject, subjectLength, bodyType, importantLevel, hasAttachments, extIcons);
			if(isAgent){
				title += $.i18n("agent_label");
			}
		}
		
		str.append("  <tr>");
		var classPrev = "";
        if((subject&&subject!="")||(subjectHTML&&subjectHTML!="")){
            classPrev = "sectionSubjectIcon";
        }
        
		//单位讨论、集团讨论情况下，需要使用区分已阅和未读信息的css样式:title-more-visited added by Meng Yang 2009-05-19
		if(r.className=="ReadDifferFromNotRead") {
			str.append("    <td class='tr-bottom text_overflow padding_lr_5 ").append(classPrev).append("' width='100%' title=\"").append(alt).append("\"><a class='title-more-visited' href=\"").append(link).append("\">").append(title).append("</a>");
		} else if(r.className=="AlreadyReadByCurrentUser") {
			str.append("    <td class='tr-bottom text_overflow padding_lr_5 ").append(classPrev).append("' width='100%' title=\"").append(alt).append("\"><a class='title-already-visited' href=\"").append(link).append("\">").append(title).append("</a>");
		} else {
			str.append("    <td class='tr-bottom text_overflow padding_lr_5 ").append(classPrev).append("' style='overflow:hidden;' width='100%' title=\"").append(alt).append("\"><a href=\"").append(link).append("\" class=\"").append(className).append("\">").append(title).append("</a>");
		}
		var id = r.id;
		if(id){
			var objectId = r.objectId;
			str.append("<input type='hidden' name='data_"+x+"_"+y+"' value='"+id+"' objectId='"+objectId+"' category='"+applicationCategoryKey+"' subject=\""+subject+"\">");
		}
		str.append("</td>");
		
		if(theRowList.contains("receiveTime") || theRowList.contains("publishDate")){
		  str.append("<td class=\"tr-bottom text_overflow padding_lr_5 color_gray\" nowrap=\"nowrap\" title=\""+createDate+"\">").append(createDate).append("</td>");			
		}
		if(theRowList.contains("clickNumber")&&clickNumber){
	          str.append("    <td class=\"tr-bottom text_overflow padding_lr_5 color_gray\" nowrap=\"nowrap\" title=\"").append(clickNumberAlt).append("\">").append(clickNumber).append("</td>");
	    }
		if(theRowList.contains("sendUser")){
		  str.append("    <td class=\"tr-bottom text_overflow padding_lr_5\" nowrap=\"nowrap\" title=\"").append(createMemberAlt).append("\">").append(createMemberName).append("</td>");
		}
		if(theRowList.contains("category")){
			str.append("    <td class=\"tr-bottom text_overflow padding_lr_5\" nowrap=\"nowrap\" title=\"").append(categoryLabel).append("\">");
			var categoryStr = categoryLabel;
            if (categoryLabel.length > 7) {
                categoryStr = categoryLabel.substring(0,7)+"...";
            }
			if(categoryLink){
				str.append("<a href=\"").append(sectionHandler.mergeLink(categoryLink)).append("\">").append(categoryStr).append("</a>");
			}
			else{
				str.append(categoryStr);
			}
			str.append("</td>");
		}
		if(theRowList.contains("policy")){
			var policy = r.policyName || "  ";
			str.append("    <td class=\"tr-bottom text_overflow padding_lr_5\" nowrap=\"nowrap\" title=\"").append(policy).append("\">"+policy);
			str.append("</td>");
		}
		str.append("  </tr>");
	}
	
	/*for(; i < default_row_number; i++) {
		str.append("  <tr>");
		str.append("    <td class=\"text_overflow padding_l_10 \" colspan='"+rowList.length+"'>&nbsp;</td>");
		str.append("  </tr>");
	}*/
	
	/*if(result.showBottomButton == "true"){
		str.append("  <tr>");
		str.append("    <td class=\"\" colspan='"+rowList.length+"' x='"+x+"' y='"+y+"'>&nbsp;");
		
		str.append(sectionHandler.showBottomButtons(result.bottomButtons));
		
		str.append("    </td>");
		str.append("  </tr>");
	}*/
	str.append("</table>");
	return str;
}

/**
 * 多行3列：3列依次是：subject createDate category
 */
ResolveFunction.prototype.multiRowThreeColumnTemplete = function(result, titleId, x, y,sectionId,width,divWidth){
	var todayFirstTime = result.todayFirstTime;
	var rows = result.rows || [];

	var columnWidth = getLayoutTypeConstant("multiRowThreeColumnTempleteColumnWidth");
	var subjectLength;
	if(width){
		 subjectLength = defaultFullLength * (width / 10) * columnWidth[0] / 100;
	}else{
	     subjectLength = defaultFullLength * (sectionWidths[y] / 10) * columnWidth[0] / 100;
	}
	
	var str = new StringBuffer();
	str.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	var rowList = result.rowList;
	if(!rowList){
		rowList = ['subject','publishDate','type'];
	}
	var theRowList = new ArrayList();
	theRowList.addAll(rowList);
	var i = 0;
	for(i = 0; i < rows.length; i++) {
		var r = rows[i];
		var createDate = "";
    if(r.createDate){
      createDate = sectionHandler.showDatetime(r.createDate,r.createDateTime, todayFirstTime);
    }
		//var createDate = sectionHandler.showDatetime(r.createDate, todayFirstTime);
		//var createDate = r.createDate || "";
		
		var link = r.link || default_link;
		var openType = parseInt(r.openType|| "0", 10);
		link = sectionHandler.mergeLinkOfOpenType(openType, link, titleId);
		
		var createMemberName = r.createMemberName||"&nbsp;";
		
		var categoryLabel = "";
		var applicationCategoryKey = r.applicationCategoryKey;
		
		if(applicationCategoryKey){
			var suffix = "";
			/**
			 * TODO:版本判断
			 */
			/*if(typeof(getCtpTop().isGov)!='undefined' && getCtpTop().isGov) {
				if(applicationCategoryKey == 22 || applicationCategoryKey == 23 || applicationCategoryKey == 24) {//待签收->收文签收
					suffix = "GOV";
				}
			}*/
			categoryLabel = $.i18n("application_" + applicationCategoryKey + suffix + "_label");
		}
		else{
			categoryLabel = r.categoryLabel;
		}
		
		categoryLabel = categoryLabel || "";
		
		var categoryLink = r.categoryLink;
		
		var alt = r.alt||"";
		var subject = r.subject||"";
		var subjectHTML = r.subjectHTML;
		
		var title = "";
		if(subjectHTML){
			title = subjectHTML;
		}
		else{
			var bodyType = r.bodyType;
			var importantLevel = r.importantLevel;
			var hasAttachments = r.hasAttachments;
			var extIcons = r.extIcons;
			
			alt = alt || subject;
			title = sectionHandler.mergeSubject(subject, subjectLength, bodyType, importantLevel, hasAttachments, extIcons);
		}
		
		str.append("  <tr>");
		
		var classPrev = "";
		if((subject&&subject!="")||(subjectHTML&&subjectHTML!="")){
		    classPrev = "sectionSubjectIcon";
		}
		
		//单位最新新闻、最新公告、最新调查、集团最新新闻、最新公告、最新调查需区分已阅和未阅，在此加入一个判断 added by Meng Yang 2009-05-19
		//单位最新新闻、最新公告、集团最新新闻、最新公告需要永久区分已阅和未读信息
		if(r.className=="ReadDifferFromNotRead") {  //已阅和未读区分css样式：title-more-visited
			str.append("    <td class='tr-bottom text_overflow padding_lr_5 ").append(classPrev).append("' width='100%' title=\"").append(alt).append("\"><a class='title-more-visited' href=\"").append(link).append("\">").append(title).append("</a></td>");
		} else if(r.className=="AlreadyReadByCurrentUser") {  //已阅的新闻和公告其已阅标识需要永久保持
			str.append("    <td class='tr-bottom text_overflow padding_lr_5  ").append(classPrev).append("' width='100%' title=\"").append(alt).append("\"><a class='title-already-visited' href=\"").append(link).append("\">").append(title).append("</a></td>");
		} else { //在以上情况之外的则使用普通样式，不区分已阅和未读
			str.append("    <td class='tr-bottom text_overflow padding_lr_5  ").append(classPrev).append("' width='100%' title=\"").append(alt).append("\"><a class='defaulttitlecss' href=\"").append(link).append("\">").append(title).append("</a></td>");
		}
		if(theRowList.contains("publishDate")){
			str.append("    <td class='tr-bottom text_overflow padding_lr_5  time' nowrap=\"nowrap\" width='20%' title=\""+createDate+"\">").append(createDate).append("</td>");
		}
		if(theRowList.contains("type")){
			str.append("<td class='tr-bottom text_overflow padding_lr_5 ' nowrap=\"nowrap\" width='20%' title=\"").append(categoryLabel).append("\">");
			if(categoryLink){
				str.append("<a href=\"").append(sectionHandler.mergeLink(categoryLink)).append("\">");
			}
			var categoryStr = categoryLabel;
			if (categoryLabel.length > 7) {
			    categoryStr = categoryLabel.substring(0,7)+"...";
			}
			str.append(categoryStr);
			if(categoryLink){
				str.append("</a>");
			}
			str.append("</td>");
		}
		str.append("  </tr>");
	}
	
	/*for(; i < default_row_number; i++) {
		str.append("  <tr>");
		str.append("    <td class='text_overflow padding_l_10 ' colspan='4'>&nbsp;</td>");
		str.append("  </tr>");
	}*/
	
	/*if(result.showBottomButton == "true"){
		str.append("  <tr>");
		str.append("    <td class='' colspan='4'>&nbsp;");
		
		str.append(sectionHandler.showBottomButtons(result.bottomButtons));
		
		str.append("    </td>");
		str.append("  </tr>");
	}*/
	str.append("</table>");

	return str;
}

/**
 * 多行3列滚动式
 * 3列依次是：subject createDate category
 * 滚动效果：从下到上连续滚动
 */
ResolveFunction.prototype.moveMultiRowThreeColumnTemplete = function(result, titleId, x, y, sectionId,width,divWidth){
	var todayFirstTime = result.todayFirstTime;
	var rows = result.rows || [];
	var rowsHeight = 26 * rows.length;
	var speed = result.speed || '';
	//rowsHeight = rowsHeight < 208 ? 208 : rowsHeight;
	var columnWidth = getLayoutTypeConstant("multiRowThreeColumnTempleteColumnWidth");
	var subjectLength;
	if(width){
		 subjectLength = defaultFullLength * (width / 10) * columnWidth[0] / 100;
	}else{
	     subjectLength = defaultFullLength * (sectionWidths[y] / 10) * columnWidth[0] / 100;
	}
	
	var rowList = result.rowList;
	if(!rowList){
		rowList = ['subject', 'publishDate', 'type'];
	}
	var theRowList = new ArrayList();
	theRowList.addAll(rowList);
	var column = theRowList.size();
	
	var str = new StringBuffer();
	str.append("<div id='marqueeBox" + sectionId + "' style='height:" + rowsHeight + "px;line-height:25px;overflow:hidden;'>");
	str.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	
	var j = 0;
	for(; j < rows.length; j++) {
		str.append("<tr>");
		str.append("<td class='tr-bottom text_overflow padding_l_10 '>&nbsp;</td>");
		if(theRowList.contains("publishDate")){
			str.append("<td class='tr-bottom text_overflow padding_l_10 ' nowrap=\"nowrap\">&nbsp;</td>");
		}
		if(theRowList.contains("type")){
			str.append("<td class='tr-bottom text_overflow padding_l_10 ' nowrap=\"nowrap\">&nbsp;</td>");
			str.append("</td>");
		}
		str.append("</tr>");
	}
	/*for(; j < default_row_number; j ++){
		str.append("<tr><td class='text_overflow padding_l_10 ' colspan='" + column + "'>&nbsp;</td></tr>");
	}*/
	
	var i = 0;
	for(; i < rows.length; i++) {
		var r = rows[i];
		var createDate = "";
    if(r.createDate){
      createDate = sectionHandler.showDatetime(r.createDate, r.createDateTime, todayFirstTime);
    }
		//var createDate = sectionHandler.showDatetime(parseInt(r.get("createDate"), 10), todayFirstTime);
		//var createDate = r.createDate;
		
		var link = r.link || default_link;
		var openType = parseInt(r.openType || "0", 10);
		link = sectionHandler.mergeLinkOfOpenType(openType, link, titleId);
		
		var categoryLabel = r.categoryLabel || " ";
		var categoryLink = r.categoryLink;
		
		var alt = r.alt || "";
		var subject = r.subject || "";
		var subjectHTML = r.subjectHTML;
		
		var title = "";
		if(subjectHTML){
			title = subjectHTML;
		}else{
			var bodyType = r.bodyType;
			var importantLevel = r.importantLevel;
			var hasAttachments = r.hasAttachments;
			var extIcons = r.extIcons;
			
			alt = alt || subject;
			title = sectionHandler.mergeSubject(subject, subjectLength, bodyType, importantLevel, hasAttachments, extIcons);
		}
		
		str.append("<tr>");
		
		var classPrev = "";
		if((subject&&subject!="")||(subjectHTML&&subjectHTML!="")){
		    classPrev = "sectionSubjectIcon";
		}
		
		if(r.className=="ReadDifferFromNotRead") {
			str.append("<td class='tr-bottom text_overflow padding_l_10  ").append(classPrev).append("' width='100%' title=\"").append(alt).append("\"><a class='title-more-visited' href=\"").append(link).append("\">").append(title).append("</a></td>");
		} else if(r.className=="AlreadyReadByCurrentUser") {
			str.append("<td class='tr-bottom text_overflow padding_l_10  ").append(classPrev).append("' width='100%' title=\"").append(alt).append("\"><a class='title-already-visited' href=\"").append(link).append("\">").append(title).append("</a></td>");
		} else {
			str.append("<td class='tr-bottom text_overflow padding_l_10  ").append(classPrev).append("' width='100%' title=\"").append(alt).append("\"><a class='defaulttitlecss' href=\"").append(link).append("\">").append(title).append("</a></td>");
		}
		if(theRowList.contains("publishDate")){
			str.append("<td class='tr-bottom text_overflow padding_l_10  time' nowrap=\"nowrap\" title=\""+createDate+"\">").append(createDate).append("</td>");
		}
		if(theRowList.contains("type")){
			str.append("<td class='tr-bottom text_overflow padding_l_10 ' nowrap=\"nowrap\" title=\"").append(categoryLabel).append("\">");
			if(categoryLink){
				str.append("<a href=\"").append(sectionHandler.mergeLink(categoryLink)).append("\">");
			}
			str.append(categoryLabel);
			if(categoryLink){
				str.append("</a>");
			}
			str.append("</td>");
		}
		str.append("</tr>");
	}
	
	/*for(; i < default_row_number; i ++){
		str.append("<tr><td class='text_overflow padding_l_10 ' colspan='" + column + "'>&nbsp;</td></tr>");
	}*/
	
	str.append("</table>");
	str.append("</div>");
	
	/*str.append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	if(result.showBottomButton == "true"){
		str.append("<tr><td class='' colspan='" + column + "'>&nbsp;");
		str.append(sectionHandler.showBottomButtons(result.bottomButtons));
		str.append("</td></tr>");
	}
	str.append("</table>");*/
	var movespeed = 100;
	switch(speed){
        case 'speed1':
            movespeed = 60;
            break;
        case 'speed2':
            movespeed = 100;
            break;
        case 'speed3':
            movespeed = 130;
            break;
        default:
            movespeed = 100;
	}
	setTimeout(function(){startMarquee(25, movespeed, 0, sectionId)}, 2000);
	return str;
}

/**
 * 文字滚动
 * height 文字一次向上滚动的距离或高度
 * speed  滚动速度
 * delay  滚动停顿的时间间隔
 * index  可以使封装后的函数应用于页面当中不同的元素
 * startmarquee(25, 100, 3000, 0);//带停顿效果
 * startmarquee(25, 100, 0, 1);//不间断滚动
 */
function startMarquee(height, speed, delay, index){
	var t;
	var o = document.getElementById("marqueeBox" + index);//滚动区域对象
	try{
		o.scrollTop = 0;//文字内容顶端与滚动区域顶端的距离，初始值为0
	}catch(e){}
	
	var p = false;//true鼠标滑过，停止滚动；false鼠标离开，开始滚动
	try{
		o.onmouseover = function(){
			p = true;
		}
		o.onmouseout = function(){
			p = false;
		}
	}catch(e){
		
	}
	
	function start(){
		try{
			t= setInterval(scrolling, speed);
			if(!p){
				o.scrollTop += 1;
			}
		}catch(e){
			clearInterval(t);
		}
	}
	
	function scrolling(){
		try{
			if(p){
				return;
			}
			
			if(o.scrollTop % height != 0){
				o.scrollTop += 1;
				if(o.scrollTop >= o.scrollHeight / 2){
					setTimeout(function(){o.scrollTop = 0;}, 1000);
				}
			}else{
				clearInterval(t);
				setTimeout(start, delay);
			}
		}catch(e){
			clearInterval(t);
		}
	}

	setTimeout(start, delay);
}

/**
 * 棋盘式的
 * 左边小图标(16*16)+右边标题
 * 上边大图标(32*32)+下边标题
 * 标题可以有浮动菜单
 *//*
ResolveFunction.prototype.chessboardTemplete = function(result, titleId, x, y){
	var items = result.items || [];
	var newLine = parseInt(result.columnNumber, 10); //列数
	var rowNumber = parseInt(result.rowNumber, 10); //行数
	var maxLength = defaultFullLength * sectionWidths[y] / 10 / newLine;
	var width = 100 / newLine;
	var height = parseInt(170 / rowNumber);
	var hasNewMail = result.hasNewMail;
	var hasNewColl = result.hasNewColl;
	var position = result.position;
	var iconWidth = result.iconWidth;
	var iconHeight = result.iconHeight;
	var tdHeight = result.tdHeight;
	
	var str = new StringBuffer();
	str.append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	str.append("<tr>");
	var tdClass = (position == "top" ? "height='" + tdHeight + "'" : "class=''");
	
	if(position == "left"){
		maxLength -= iconWidth / 6;
	}
	
	var i = 0;
	for(; i < items.length; i++) {
		var item = items[i];
		if(item.maxLength != null){
			maxLength = item.maxLength;
		}
		var icon = item.icon;
		var name = item.name || " ";
		var nameMaxLength = name;
		var title = item.title || name;
		var link = item.link || default_link;
		var hasAttachments = item.hasAttachments;
		var showOption = item.showOption;
		var optionId = item.optionId;
		var realId = optionId + x + "_" + y;
		var optionEmail = item.optionEmail || "";
		
		var openType = parseInt(item.openType || "0", 10);
		link = sectionHandler.mergeLinkOfOpenType(openType, link, titleId);
		
		str.append("<td title=\"").append(title.escapeXML()).append("\" " + tdClass + " width=\"").append(width).append("%\">");
		str.append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
		
		var hasLink = (link != default_link);
		var contentStr = new StringBuffer();
		if(showOption == "1"){
			contentStr.append(" onmouseover='showEditImage(\"" + realId + "\")' onmouseout='removeEditImage(\"" + realId + "\")'>");
			contentStr.append("<a class=\"defaulttitlecss\" href=\"").append(link).append("\">").append(nameMaxLength).append("</a>").append("<img onclick='showMemberMenu(\"" + optionId + "\", \"" + name + "\", \"" + hasNewMail + "\", \"" + optionEmail + "\", \"_self\", \"" + hasNewColl + "\", this)' onMouseLeave='leave()' id='" + realId + "Img" + "' src='/seeyon/common/images/space.gif' border='0'>");
		}else if(showOption == "2"){
			contentStr.append(">");
			contentStr.append("<span>").append(nameMaxLength).append("</span>");
		}else{
			contentStr.append(">");
			if(hasLink){
				contentStr.append("<a class=\"defaulttitlecss\" href=\"").append(link).append("\">").append(nameMaxLength).append("</a>");
			}else{
				contentStr.append("<span>").append(nameMaxLength).append("</span>");
			}
		}
		
		if(hasAttachments == 'true'){
			contentStr.append("<span class=\"attachment_table_true\"></span>");
		}
		contentStr.append("</td>");
		
		if(position == "top"){
			str.append("<tr>");
			if(showOption == "1" || hasLink){
				str.append("<td align='center' valign='top' style='padding-top:5px;'><a class=\"defaulttitlecss\" href=\"" + link + "\">");
			}else{
				str.append("<td align='center' valign='top' style='padding-top:5px;'>");
			}
			if(icon){
				str.append("<img src='").append(contextPath).append(icon).append("' border='0' align='absmiddle' width='" + iconWidth + "' height='" + iconHeight + "'>&nbsp;");
			}
			if(showOption == "1" || hasLink){
				str.append("</a></td>");
			}else{
				str.append("</td>");
			}
			str.append("</tr>");
			
			str.append("<tr>");
			str.append("<td align='center' valign='bottom' style='padding-bottom:5px;'" + contentStr.toString());
			str.append("</tr>");
		}else{
			str.append("<tr>");
			str.append("<td width='20' align='center' valign='middle'>");
			if(icon){
				str.append("<img src='").append(contextPath).append(icon).append("' border='0' align='absmiddle' width='" + iconWidth + "' height='" + iconHeight + "'>&nbsp;");
			}
			str.append("</td>");
			str.append("<td valign='middle'" + contentStr.toString());
			str.append("</tr>");
		}
		str.append("</table>");
		str.append("</td>");
		
		if(i % newLine == newLine - 1){
			str.append("</tr>");
			str.append("<tr>");
		}
	}
	
	for(; i < newLine * rowNumber; i++) {
		str.append("<td " + tdClass + ">&nbsp;</td>");
		if(i % newLine == newLine - 1){
			str.append("</tr>");
			str.append("<tr>");
		}
	}
	
	str.append("</tr>");
	
	if(result.showBottomButton == "true"){
		str.append("<tr><td class='' colspan='").append(newLine).append("'>&nbsp;");
		str.append(sectionHandler.showBottomButtons(result.bottomButtons));
		str.append("</td></tr>");
	}
	
	var extendHTML = result.extendHTML;
	if(extendHTML){
		str.append("<tr><td colspan='").append(newLine).append("'>").append(extendHTML).append("</td></tr>");
	}
	
	str.append("</table>");
	
	var memberMenuDIV = document.getElementById('memberMenuDIV');
	if(memberMenuDIV==null){
		var memberMenuDIVObj = document.createElement('div');
		memberMenuDIVObj.id='memberMenuDIV';
		memberMenuDIVObj.onMouseOver = divOver;
		memberMenuDIVObj.onMouseOut = divLeave;
		memberMenuDIVObj.style.cssText = "width:82px; height:80px; padding-left:5px; border:#ccc 1px solid; background-color:#fff; display:none; position:absolute; line-height:20px;";
		document.body.appendChild(memberMenuDIVObj);
	}
	//str.append("<div id='memberMenuDIV' onMouseOver='divOver()' onMouseOut='divLeave()' style=''></div>");
	return str;
}*/
/**
 * 棋盘式的
 * 左边小图标(16*16)+右边标题
 * 上边大图标(32*32)+下边标题
 * 标题可以有浮动菜单
 */
ResolveFunction.prototype.chessboardTemplete = function(result, titleId, x, y,id,layoutWidthFlag,divWidth){
  var items = result.items || [];
  var newLine = parseInt(result.columnNumber, 10); //列数
  var rowNumber = parseInt(result.rowNumber, 10); //行数
  var maxLength = defaultFullLength * sectionWidths[y] / 10 / newLine;
  var width = 100 / newLine;
  var height = parseInt(170 / rowNumber);
  var hasNewMail = result.hasNewMail;
  var hasNewColl = result.hasNewColl;
  var position = result.position;
  var iconWidth = result.iconWidth;
  var iconHeight = result.iconHeight;
  var tdHeight = result.tdHeight;
  
  var str = new StringBuffer();
  str.append("<div style='height:100%;width:100%;'>");
  //str.append("<tr>");
  var tdClass = (position == "top" ? "height='" + tdHeight + "'" : "class=''");
  
  if(position == "left"){
    maxLength -= iconWidth / 6;
  }
	var cellWidth = 260;
	if (titleId == "relateMemberSection" || titleId == "departmentMembersSection" || titleId == "customMembersSection" || titleId == "newLinkSystemSection" || titleId == "singleBoardLinkSection") {
		if(position == "top"){
			cellWidth = 100;
		}else{
			cellWidth = 125;
		}
	}
	var divWidth = getChessboardTemplateFixLength(y,layoutWidthFlag);
	var needRowShowNum = (divWidth / cellWidth < 2) ? 2 : (divWidth / cellWidth);
	needRowShowNum = parseInt(needRowShowNum);
	cellWidth = divWidth / needRowShowNum;
	if ($.browser.msie && ($.browser.version == '8.0' || $.browser.version == '7.0' || $.browser.version == '6.0')) {
		cellWidth = cellWidth - 2;
	}

  var i = 0;
  for(; i < items.length; i++) {
    var item = items[i];
    if(item.maxLength != null){
      maxLength = item.maxLength;
    }
    var icon = item.icon;
    var name = item.name || " ";
    var nameMaxLength = name;
    var title = item.title || name;
    var link = item.link || default_link;
    var hasAttachments = item.hasAttachments;
    var showOption = item.showOption;
    var optionId = item.optionId;
    var realId = optionId + x + "_" + y;
    var optionEmail = item.optionEmail || "";
    var random = Math.floor(Math.random() * 100000000);
    var openType = parseInt(item.openType || "0", 10);
    
    if((hasAttachments === 'true' || hasAttachments === true)&&name.length>5){
      nameMaxLength = name.substring(0,5)+"...";
    }
    
    
    if (titleId == "relateMemberSection" || titleId == "departmentMembersSection" || titleId == "customMembersSection") {
      str.append("<table style='' width=\"" + cellWidth + "\" id=\"chess_"+titleId+"_"+random+"\" class='chessboardtable' border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
    }else{
      str.append("<table style='' width=\"" + cellWidth + "\" id=\"chess_"+titleId+"_"+random+"\" class='chessboardtable' border=\"0\" cellspacing=\"0\" cellpadding=\"0\" title=\""+title.escapeXML().trim()+"\">");
    }
    link = sectionHandler.mergeLinkOfOpenType(openType, link, titleId);
    var hasLink = (link != default_link);
    var contentStr = new StringBuffer();
    if(showOption == "1"){
    	contentStr.append(" onmouseover='showEditImage(\"" + realId + "\")' onmouseout='removeEditImage(\"" + realId + "\")'>");
		  contentStr.append("&nbsp;<a class=\"defaulttitlecss\" href=\"").append(link).append("\">").append(nameMaxLength).append("</a>").append("<img onclick='showMemberMenu(\"" + optionId + "\", \"" + name + "\", \"" + hasNewMail + "\", \"" + optionEmail + "\", \"_self\", \"" + hasNewColl + "\", this)' onMouseLeave='leave()' id='" + realId + "Img" + "' src='/seeyon/common/images/space.gif' border='0'>");
    }else if(showOption == "2"){
      contentStr.append(">");
      contentStr.append("&nbsp;<span>").append(nameMaxLength).append("</span>");
    }else if(showOption=="3"){
    	 contentStr.append(" onmouseover='' onmouseout=''>");
         contentStr.append("&nbsp;<a class=\"defaulttitlecss\" class=\"comp\"  id=\"panlees\"  onmouseover=\"showPerCard('"+optionId+"','chess_"+titleId+"_"+random+"')\" href=\"").append(link).append("\">").append(nameMaxLength).append("</a>");
    }else if(showOption == "Project"){
    	contentStr.append(" onmouseout='closeProjectDetailDialog()' onmouseover='showProjectDetail(\""+titleId+"_"+random+"\",\""+optionId+"\")'>");
    	if(hasLink){
           contentStr.append("&nbsp;<a class=\"defaulttitlecss\" href=\"").append(link).append("\">").append(nameMaxLength).append("</a>");
        }else{
           contentStr.append("&nbsp;<span>").append(nameMaxLength).append("</span>");
        }
    }else{
      contentStr.append(">");
      if(hasLink){
        contentStr.append("&nbsp;<a class=\"defaulttitlecss\" href=\"").append(link).append("\">").append(nameMaxLength).append("</a>");
      }else{
        contentStr.append("&nbsp;<span>").append(nameMaxLength).append("</span>");
      }
    }
    if(hasAttachments === 'true' || hasAttachments === true){
      contentStr.append("<span class=\"ico16 affix_16\"></span>");
    }
    contentStr.append("</td>");
    
    if(position == "top"){
      str.append("<tr>");
      if(showOption == "1" || hasLink){
        str.append("<td class='text_overflow padding_l_10 ' align='center' valign='top' style='padding-top:5px;'><a class=\"defaulttitlecss\" href=\"" + link + "\">");
      }else{
        str.append("<td class='text_overflow padding_l_10 ' align='center' valign='top' style='padding-top:5px;'>");
      }
      str.append("<span style='height:" + iconHeight + "px;' class='display_inline-block'>");
      if(icon){
        str.append("<img src='").append(icon).append("' border='0' align='absmiddle' width='" + iconWidth + "' height='" + iconHeight + "'>&nbsp;");
      }else{
    	  str.append("&nbsp;");
      }
      str.append("</span>");
      if(showOption == "1" || hasLink){
        str.append("</a></td>");
      }else{
        str.append("</td>");
      }
      str.append("</tr>");
      
      var paddingBottom = "";
      if (titleId == "newLinkSystemSection" || titleId == "singleBoardLinkSection") {
    	  paddingBottom = "padding-bottom:7px;";
    	  if (i < needRowShowNum) {
    		  paddingBottom = "padding-bottom:8px;";
    	  }
      }
      
      str.append("<tr>");
      str.append("<td class='text_overflow padding_l_10 ' align='center' valign='bottom' style='" + paddingBottom +"'" + contentStr.toString());
      str.append("</tr>");
    }else{
      str.append("<tr>");
      if(icon){
        str.append("<td class='text_overflow tr-bottom padding_l_10 ' width='22' align='center' valign='middle'>");
        str.append("<img src='").append(icon).append("' border='0' align='absmiddle' width='" + iconWidth + "' height='" + iconHeight + "'>&nbsp;");
        str.append("</td>");
      }
      str.append("<td class='tr-bottom' valign='middle'" + contentStr.toString());
      str.append("</tr>");
    }
    str.append("</table>");
    //str.append("</td>");
    /**
    if(i % newLine == newLine - 1){
      str.append("</tr>");
      str.append("<tr>");
    }**/
  }
  
  /**
  for(; i < newLine * rowNumber; i++) {
    str.append("<td " + tdClass + ">&nbsp;</td>");
    if(i % newLine == newLine - 1){
      str.append("</tr>");
      str.append("<tr>");
    }
  }
  **/
  //str.append("</tr>");
  
  /*if(result.showBottomButton == "true"){
    str.append("<tr><td class='' colspan='").append(newLine).append("'>&nbsp;");
    str.append(sectionHandler.showBottomButtons(result.bottomButtons));
    str.append("</td></tr>");
  }*/
  
  /**
  var extendHTML = result.extendHTML;
  if(extendHTML){
    str.append("<tr><td colspan='").append(newLine).append("'>").append(extendHTML).append("</td></tr>");
  }
  **/
  str.append("</div>");
  
  var memberMenuDIV = document.getElementById('memberMenuDIV');
  if(memberMenuDIV==null){
    var memberMenuDIVObj = document.createElement('div');
    memberMenuDIVObj.id='memberMenuDIV';
    memberMenuDIVObj.onMouseOver = divOver;
    memberMenuDIVObj.onMouseOut = divLeave;
    memberMenuDIVObj.style.cssText = "width:82px; height:80px; padding-left:5px; border:#ccc 1px solid; background-color:#fff; display:none; position:absolute; line-height:20px;";
    document.body.appendChild(memberMenuDIVObj);
  }
  //str.append("<div id='memberMenuDIV' onMouseOver='divOver()' onMouseOut='divLeave()' style=''></div>");
  return str;
};
/**
 * 棋盘式、多行三列式－－－文档夹
 */
ResolveFunction.prototype.chessMultiRowThreeColumnTemplete = function(result, titleId, x, y,sectionId,width,divWidth){
	
	var items = result.items || []; //棋盘数据
	var rows = result.rows || []; //行数据
	
	var todayFirstTime = result.todayFirstTime; //当前时间
	var newLine = parseInt(result.columnNumber, 10); //列数
	var rowNumber = parseInt(result.rowNumber, 10); //行数
	var width = 100 / newLine;
	var height = parseInt(170 / rowNumber);
	
	var haveRow = 0;
	
	var str = new StringBuffer();
	
	str.append("<table style='' width='100%' border='0' cellspacing='0' cellpadding='0'>");
	str.append("<tr>");
	
	var columnWidth = getLayoutTypeConstant("multiRowFourColumnTempleteColumnWidth");
	
	var subjectLength;
	if(width){
		 subjectLength = defaultFullLength * (width / 10) * columnWidth[0] / 100;
	}else{
		 subjectLength = defaultFullLength * (sectionWidths[y] / 10) * columnWidth[0] / 100;
	}
	
	var i = 0;
	for(; i < items.length; i++) {
		var item = items[i];
		
		var icon = item.icon;
		var name = item.name || " ";
		var link = item.link || default_link;
		var title = item.title || name;
		if(item.maxLength != null){
			maxLength = item.maxLength;
		}
		var hasAttachments = item.hasAttachments;
		var openType = parseInt(item.openType || "0", 10);
		link = sectionHandler.mergeLinkOfOpenType(openType, link, titleId);
		
		str.append("<td class='tr-bottom text_overflow padding_l_10 '  width='").append(width).append("%'>");

		if(icon){
			str.append("<img src='").append(contextPath).append(icon).append("' border='0' align='absmiddle'>&nbsp;");
		}
		
		str.append("<a class='defaulttitlecss' href=\"").append(link).append("\" title=\"").append(title).append("\">").append(name).append("</a>");
		if(hasAttachments === 'true' || hasAttachments === true){
			str.append("<span class='attachment_table_true'></span>");
		}
		
		str.append("</td>");
		
		if(i % newLine == newLine - 1){
			str.append("</tr>");
			str.append("<tr>");
		}
	}
	
	for(; i < Math.ceil(items.length / newLine) * newLine; i++) {
		str.append("<td class='tr-bottom text_overflow padding_l_10 ' width='").append(width).append("%'>&nbsp;</td>");
		if(i % newLine == newLine  - 1){
			str.append("</tr>");
			str.append("<tr>");
		}
	}
	
	str.append("</tr>");
	str.append("</table>");
	
	haveRow = Math.ceil(items.length / newLine);

	str.append("<table style='' width='100%' border='0' cellspacing='0' cellpadding='0'>");
	
	var leftRow = rows.length < (rowNumber - Math.ceil(items.length / newLine)) ? rows.length : (rowNumber - Math.ceil(items.length / newLine));
	
	var rowList = result.rowList;
	if(!rowList){
		rowList = ['frName','lastUpdate','lastUserId'];
	}
	var theRowList = new ArrayList();
	theRowList.addAll(rowList);
	
	for(j = 0; j < leftRow; j++) {
		var row = rows[j];
		
		var icon = row.icon;
		var subject = row.subject || "";
		var link = row.link || default_link;
		var title = row.title || subject;
		if(row.maxLength != null){
			maxLength = row.maxLength;
		}
		var hasAttachments = row.hasAttachments;
		var createDate = "";
		if(row.createDate){
	      createDate = sectionHandler.showDatetime(row.createDate,row.createDateTime, todayFirstTime);
	    }
		var createMemberName = row.createMemberName;
		var openType = parseInt(row.openType || "0", 10);
		link = sectionHandler.mergeLinkOfOpenType(openType, link, titleId);
		
		str.append("<tr>");
		
		str.append("<td class='tr-bottom text_overflow' width='100%'>");
		var classPrev = "";
		if(subject&&subject!=""){
		    classPrev = " sectionSubjectIcon";
		}
		str.append("<span class='padding_l_10 ").append(classPrev).append(" '>");

		if(icon){
			str.append("<img src='").append(contextPath).append(icon).append("' border='0' align='absmiddle'>&nbsp;");
		}

		str.append("<a class='defaulttitlecss' href=\"").append(link).append("\" title=\"").append(title).append("\">").append(subject).append("</a>");
		if(hasAttachments === 'true' || hasAttachments === true){
			str.append("<span class='attachment_table_true'></span>");
		}
		str.append("</span>");
		str.append("</td>")
		
		if(theRowList.contains("lastUpdate")){
      if(createDate){
        str.append("<td class='tr-bottom text_overflow  time' nowrap='nowrap'>").append(createDate).append("</td>");
      }else{
        str.append("<td class='tr-bottom text_overflow  time' nowrap='nowrap'>&nbsp;</td>");
      }
        }
    
    if(theRowList.contains("lastUserId")){
      if(createMemberName){
        str.append("<td class='tr-bottom text_overflow padding_lr_10 ' nowrap='nowrap' title='").append(createMemberName).append("'>").append(createMemberName).append("</td>");
      }else{
        str.append("<td class='tr-bottom text_overflow padding_lr_10 ' nowrap='nowrap' >&nbsp;</td>");
      }
    }
		
		str.append("</tr>");
	}
	
	str.append("</table>");
	
	str.append("<table style='' width='100%' border='0' cellspacing='0' cellpadding='0'>");
	
	for(k = 0; k < rowNumber - haveRow - leftRow; k++) {
		str.append("<tr><td class='tr-bottom text_overflow '  width='100%'>&nbsp;</td></tr>");
	}
	
	str.append("</table>");

	/*str.append("<table width='100%' border='0' cellspacing='0' cellpadding='0'>");
	
	if(result.showBottomButton == 'true'){
		str.append("<tr>");
		str.append("<td class=''>&nbsp;");
		str.append(sectionHandler.showBottomButtons(result.bottomButtons));
		str.append("</td>");
		str.append("</tr>");
	}
	
	str.append("</table>");*/
	
	return str;
}

/*
 * 图片滚动模式
 */
var time = 4000 ; //换图片的时间
var imageHeight = 140 ;
var imageWidth = 390 ;
var MaxImg = 0 ;
var all ;
ResolveFunction.prototype.onePictureTemplete = function(result, titleId, x, y){
var NowImg = 0;
var bStart = 0;
var bStop =0;

	var items = result.items ||[] ;
	all = items ;
	MaxImg = items.length-1;
	var pictureNum = parseInt(result.pictureNum,10);  //一次显示图片的张数
	var speed = 5 ;       //移动的速度
	var width = parseInt(defaultFullLength/pictureNum) ;    //宽度
    var str = new StringBuffer();
    str.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	str.append("<tr width='100%' height='100%'>");
    str.append("<td align='center' width='").append(imageWidth).append("' height='").append(imageHeight).append("'>") ;
    str.append("<DIV id=oTransContainer  " +
    		"style='FILTER: progid:DXImageTransform.Microsoft.Wipe(GradientSize=1.0,wipeStyle=0, motion='forward'); " +
    		"WIDTH: 220px; HEIGHT: 145px'>") ;
    for(var i = 0 ; i<items.length ; i++){
      var item = items[i];
    	var link = item.link || default_link; 
    	var title = item.title || name;
		var openType = parseInt(item.openType || "0", 10);
    	   
        link = sectionHandler.mergeLinkOfOpenType(openType, link, titleId);
	    str.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" >");
	    str.append("<tr width='100%' height='100%'>");
	    str.append("<td align='center' valign='center'>") ;
	    var src = (item.path) ; //图片
	    src = src.substr(0,src.length-2) ;
	    src = src + " style='border: 1px #999999 solid;' onload = changeImage(this,"+item.id+") id=image_"+i+"_"+item.id ; 
	    if(i==0){
	    	src = src + " style=DISPLAY:block;" ;
	    }else {
	    	src = src + " style=DISPLAY:none;" ;
	    }  
	    src = src+"/>";
	    str.append("<a class='defaulttitlecss' href=\"").append(link).append("\">") ;
	    str.append(src) ;
	    str.append("</a>") ;
	    str.append("</td>") ;
	    str.append("</tr>") ;
	    str.append("<tr width='100%' height=''>") ;
	    str.append("<td align='center' valign='bottom' height=''>") ;
	      var pictureName = item.name;  //图片名称
	      if(i==0){
		       	 str.append("<div style='over-flow:hidden;' id='name_"+i+"_"+item.id+"' class=''>") ;
		       	 str.append("<a class='defaulttitlecss' href=\"").append(link).append("\">") ;
		       	 try{
			       	 str.append(pictureName.split(".")[0]) ;       	 	
		       	 }catch(e){	
		       	 }
		       	 str.append("</a>") ;
		       	 str.append("</div>") ;
	       }else{
		       	 str.append("<div id=name_"+i+"_"+item.id+" class='hidden'>") ;
		       	 try{
		       	 	str.append(pictureName.split(".")[0]) ;       	 	
		       	 }catch(e){
		       	 }
		       	 str.append("</div>") ;
	       }
	    str.append("</td>") ;
	    str.append("</tr>") ;
	    str.append("</table>") ;
    }
    str.append("</div>") ;
    str.append("</td>") ;
    str.append("</tr>") ;

    str.append("<tr>");
    str.append("<td style='border-bottom: 1px dotted #cccccc;' height ='1' width='100%' align='right'>") ;
  
    str.append("<table>");
    str.append("<tr>");
    for(var i = 1 ; i<=items.length ; i++){  
       str.append("<td>") ;
       str.append("</td>") ;
    }
    str.append("</tr>");
    str.append("</table>");
    
    str.append("</td>") ;
    str.append("</tr>") ;

	/*if(result.showBottomButton == "true"){
		str.append("  <tr>");
		str.append("   <td class=\"\" colspan='").append("'>&nbsp;");
		
		str.append(sectionHandler.showBottomButtons(result.bottomButtons));
		
		str.append("    </td>");
		str.append("  </tr>");
	}*/
	 
    str.append("</table>") ;
    if(items.length>0){
      fnToggle(NowImg,bStart,bStop,MaxImg,items) ;
    }
   
    return str ;
}
/**
 * 点击的时候控制图片的滚动
 */
function toggleTo (nowPage ,len){
	document.images['image_'+(nowPage-1)].style.display = "";
	for(var i = 0 ; i <len ; i++){
		if(i == (nowPage-1)){
			continue ;
		}
		document.images['image_'+i].style.display = "none"; 
	}
	document.getElementById("name_"+(nowPage-1)).style.display = "block";
	for(var j = 0 ; j < len ; j++){
		if(j == (nowPage-1)){
			continue ;
		}
		document.getElementById("name_"+j).style.display = "none"; 
	}			
		
}

/**
 * 控制图片的大小
 */
function changeImage(obj,divId){
	var newWidth = 140 ;
	var newHeight = 120 ;
	var widthNum = 0 ;
	var heightNum = 0;
	var imageObj = obj ;
		if(imageObj){
			imageObj.style.display="";
			var oldWidth = imageObj.width ;
			var oldHeiget = imageObj.clientHeight ;
			if(obj.id != ("image_0_"+divId))
			imageObj.style.display="none";
			if(oldWidth>newWidth ) {          //倍数
				widthNum = oldWidth/newWidth ;
			}
			if(oldHeiget>newHeight){          //倍数
				heightNum = oldHeiget/newHeight ;
			}
			if(heightNum > widthNum){
				widthNum =  heightNum ;
			}
			if(widthNum >1){
				newWidth =  parseInt(oldWidth/widthNum) ;
				newHeight = parseInt(oldHeiget/widthNum) ;				
			}	
			imageObj.style.width = newWidth+'px';
			imageObj.style.height = 145+'px';				
	}

}

/*
 * 图片滚动
 */
function fnToggle(NowImg,bStart,bStop,MaxImg) {

	try{
		  
			var next = NowImg + 1;
			if(next == MaxImg + 1) {
				NowImg = MaxImg;
				next = 0;
			}
			if(bStop!=1){
				if(bStart == 0){
					bStart = 1;		
					setTimeout("fnToggle("+NowImg+","+bStart+","+bStop+","+MaxImg+")", time);
					return;
				}else{
					//oTransContainer.filters[0].Apply();
					document.images['image_'+next+'_'+all[next].get('id')].style.display = "";
					for(var i = 0 ; i <= MaxImg ; i++){
						if(i == next){
							continue ;
						}
						document.images['image_'+i+'_'+all[i].get('id')].style.display = "none"; 
					}
					document.getElementById("name_"+next+"_"+all[next].get('id')).style.display = "block";
					for(var j = 0 ; j <= MaxImg ; j++){
						if(j == next){
							continue ;
						}
						document.getElementById("name_"+j+"_"+all[j].get('id')).style.display = "none"; 
					}			
					//oTransContainer.filters[0].Play(duration=2);
					if(NowImg == MaxImg) 
						NowImg = 0;
					else
						NowImg++;
				}
				setTimeout("fnToggle("+NowImg+","+bStart+","+bStop+","+MaxImg+")", time);
			}
	}catch(e){	
	}
}

/**
function setPicture(){
	var image = document.getElementsByTagName("img") ;
	if(!image)
	 return  ;
	 for(var i=0; i<image; i++) {
	 	imgs[i].style.width = defaultFullLength;
	 	imgs[i].style.height = 50;
	 }

}
**/
/**
 * 多行的，显示标题和摘要，常用新闻、公告
 */
ResolveFunction.prototype.MultiSubjectSummary = function(result, titleId, x, y){
	var items = result.entries || [];
	var number = parseInt(result.number, 10);
	
	var str = new StringBuffer();
	str.append("<table style='' width=\"100%\" height=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	
	var i = 0;
	var summaryHeight = ((200 - 40) / 2) - 40;
	
	for(; i < items.length; i++) {
		var item = items[i];
		var subject = item.subject || "";
		var summary = item.summary || "";
		var hasSummary = false;
		if(summary){
			try {
				eval("summary = '" + summary + "';");
				hasSummary = true;
			} catch (e) {
				summary = "&nbsp;";
			}
		}
		else{
			summary = "&nbsp;";
		}
		
		var link = item.link || default_link;
		var openType = parseInt(item.openType || "0", 10);
		link = sectionHandler.mergeLinkOfOpenType(openType, link, titleId);
		
		var createMemberName = item.createMemberName;
		var createDate = new Date(parseInt(item.createDate, 10)).format(layoutTypeConstants.D2_2W5_5.datetimePattern);
		                 
		var subjectMaxLength = 36;
		if(createMemberName){
			subjectMaxLength -= layoutTypeConstants.D2_2W5_5.defaultMemberNameLength;
		}
		subject = sectionHandler.mergeSubject(subject, subjectMaxLength, null, null, item.hasAttachment);
		
		str.append("  <tr>");
		str.append("    <td class='text_overflow ' height='20'>");
		str.append("     <div width='60%' style='float:left;'>");
		str.append("      <a class='defaulttitlecss' href=\"").append(link).append("\"><span class='MultiSubjectSummary-subject'>").append(subject).append("</span></a>");
		str.append("     </div>");
		str.append("     <div width='40%' align='right' style='float:right;padding-right:12px;'>");
		if(createMemberName){
			str.append("&nbsp;").append(createMemberName);
		}
		str.append("&nbsp;&nbsp;&nbsp;&nbsp;<span class='MultiSubjectSummary-createDate'>").append(createDate).append("</span>");
		str.append("     </div>");
		str.append("    </td>");
		str.append("  </tr>");        
		str.append("  <tr>");
		str.append("    <td class='text_overflow MultiSubjectSummary-summary' height='").append(summaryHeight).append("'>").append(summary);

		if(hasSummary){
			str.append("      &nbsp;&nbsp;<a href=\"").append(link).append("\">");
			str.append("       <").append($.i18n("group_section_particular")).append(">");
			str.append("       </a>");
		}
		
		str.append("  </tr>");
		if(number > 1){
			if( i >= 0 && i < number-1){			  
				  str.append("<tr>");
				  str.append(" <td><table style='' height='48' border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width='100%'><tr><td class='tr-bottom'>&nbsp;</td></tr><tr><td>&nbsp;</td></tr></table></td>");
				  str.append("</tr>");			  	  
			}
		}
		
	}
	
	for(; i < number; i++) {		
		if(number > 1){
		  if( i >= 0 && i < number-1){
			str.append("  <tr>");
			str.append("    <td class='tr-bottom text_overflow ' height='88'>&nbsp;</td>");
			str.append("  </tr>");
		  }
		}
		str.append("  <tr>");
		str.append("    <td class='text_overflow MultiSubjectSummary-summary' height='").append(summaryHeight).append("'>&nbsp;</td>");
		str.append("  </tr>");
	}

	/*if(result.showBottomButton == "true"){
		str.append("  <tr>");
		str.append("    <td class=\"\">&nbsp;");
		str.append(sectionHandler.showBottomButtons(result.bottomButtons));
		str.append("    </td>");
		str.append("  </tr>");
	}*/
	str.append("</table>");
	
	return str;
}

/**
 * 多行的，图标，分类，文本的展现形式<br>
 * 图表是32px * 32px的，在左边，右边的上面是分类(Category),下面是若干个项
 */ 
ResolveFunction.prototype.multiIconCategoryItem = function(result, titleId, x, y){
	var entries = result.entries || [];
	var number = parseInt(result.number, 10);
	var isItemTextIconSameRow = result.isItemTextIconSameRow;
	isItemTextIconSameRow = isItemTextIconSameRow != "false" ? true : false;
	var str = new StringBuffer();
	str.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	
	var i = 0;
	for(; i < entries.length; i++) {
		var entry = entries[i];
		var icon = entry.icon;
		var category = sectionHandler.resolveJSI18N(entry.category);
		var categoryLink = entry.categoryLink;
		var newLine = entry.newLine;
		var items = entry.items || [];
		
		if(newLine < 1){
			newLine = items.length;
		}
		
		var height = parseInt(208 / number, 10);
		
		if(category){
			str.append("<tr>");
			if(icon){
				str.append("<td rowspan='2'><img src='").append(contextPath).append(icon).append("' border='0' align='absmiddle'></td>");
			}
			str.append("  <td height='26'>");
			if(categoryLink){
				str.append("<a class=\"defaulttitlecss\" href=\"").append(sectionHandler.mergeLink(categoryLink)).append("\">").append(category).append("</a>");
			}
			else{
				str.append("<span style='color: #1039B2'>").append(category).append("</span>");
			}
			
			str.append("  </td>");
			str.append("</tr>");
			
			height -= 26;
		}
		str.append("<tr valign='top'>");
		str.append("  <td height='").append(height).append("' class='multiIconCategoryItem-category-bottom'><table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
		str.append("    <tr>");

		if(items){
			var width = parseInt(100 / newLine);
			var maxLength = sectionHandler.getExpansionLength(12);
			var k = 0;
			var rowCounter = 1;
			var rowHeight = sectionHandler.isNarrow(x, y) ? 26 : 64;
			for(; k < items.length; k++) {
				var item = items[k];
				
				var e = 0;
				var name = item[e++];
				var link = item[e++];
				var target = item[e++];
				var icon = item[e++];
				var iconX = item[e++];
				
				str.append("<td height='" + rowHeight + "' width='").append(width).append("%' align='" + (isItemTextIconSameRow ? "left" : "center") + "'>");
				if(target == "" || target =="_self"){
					str.append("<a class=\"defaulttitlecss\" title=\"").append(name).append("\" href=\"").append(sectionHandler.mergeLink(link)).append("\">");
				}else{
					str.append("<a class=\"defaulttitlecss\" title=\"").append(name).append("\" href=\"").append(sectionHandler.a8Link(link)).append("\" target=\"").append(target).append("\">");
				}
				if(icon){
					str.append("<img src=\"").append(contextPath).append(icon).append("\" width=\"").append(iconX).append("\" height=\"").append(iconX).append("\" border='0' align='absmiddle'>");
				}				
				if(!isItemTextIconSameRow){ //换行显示
					str.append("<div style='padding: 2px 0px 0px 0px'>").append(name).append("</div>");
				}
				else{
					str.append("&nbsp;&nbsp;").append(name);
				}				
				str.append("</a>");
				str.append("</td>");
				
				if(newLine > 0 && k % newLine == newLine - 1){
					str.append("  </tr>");
					str.append("  <tr>");
					rowCounter++;
				}
			}
			
			for(; k < newLine * rowCounter; k++) {
				str.append("<td heigth='26'>&nbsp;</td>");
				if(k % newLine == newLine  - 1){
					str.append("  </tr>");
					str.append("  <tr>");
				}
			}
		}
		str.append("    </tr>");
		str.append("  </table></td>");
		str.append("</tr>");
	}
	
	/*for(; i < number; i++) {
		str.append("  <tr>");
		str.append("    <td height='26'>&nbsp;</td>");
		str.append("  </tr>");
		str.append("  <tr>");
		str.append("    <td height='26'>&nbsp;</td>");
		str.append("  </tr>");
	}
*/
	/*if(result.showBottomButton == "true"){
		str.append("  <tr>");
		str.append("    <td class=\"\">&nbsp;");
		str.append(sectionHandler.showBottomButtons(result.bottomButtons));
		str.append("    </td>");
		str.append("  </tr>");
	}*/
	str.append("</table>");
	
	return str;
}

/**
 * 日程事件多行4列模板：四列依次是：subject beginDate endDate state
 */
ResolveFunction.prototype.calendarFourColumnTemplete = function(result, titleId, x, y){
	var rows = result.rows || [];
	var windowWidth = 640;
	var windowHeight = 560;
	var columnWidth = getLayoutTypeConstant("calendarFourColumnTempleteColumnWidth");
	var subjectLength = parseInt((columnWidth[0] / 100) * (sectionWidths[y] / 10) * defaultFullLength);
	//sectionHandler.getExpansionLength(getLayoutTypeConstant("calendarFourColumnTempleteSubjectLength"));
	var str = new StringBuffer();
	str.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	var i = 0;
	for(; i < rows.length; i++) {
		var r = rows[i];
		var subject = r.subject || "";
		var beginDate =r.beginDate;
		var endDate = r.endDate;
		var link = r.link || default_link;
		var hasAttachments = r.hasAttachments;
		var state = r.state;
		var stateLink = r.stateEditLink || default_link;
		var title = sectionHandler.mergeSubject(subject, subjectLength, '','' , hasAttachments,'');
		
		var classPrev = "";
		if(subject&&subject!=""){
		    classPrev = "sectionSubjectIcon";
		}
		
		str.append("  <tr>");
		str.append("    <td width='100%' class=\"tr-bottom text_overflow  ").append(classPrev).append("\" title=\"").append(subject).append("\"><a class='defaulttitlecss' href=\"").append(sectionHandler.mergeDlgLinkWithCustomSize(link, titleId, windowWidth, windowHeight)).append("\" >").append(title).append("</a></td>");
		str.append("    <td width='100%' class=\"tr-bottom text_overflow  time\" nowrap='nowrap' title=\""+beginDate+"\">").append(beginDate).append("</td>");
		str.append("    <td width='100%' class=\"tr-bottom text_overflow  time\" nowrap='nowrap' title=\""+endDate+"\">").append(endDate).append("</td>");
		str.append("    <td width='100%' class=\"tr-bottom text_overflow \" align='right' nowrap='nowrap' title=\""+state+"\">");
		str.append(stateLink==default_link ? state : "<a href=\"" + sectionHandler.mergeDlgLinkWithCustomSize(stateLink, titleId, windowWidth, windowHeight) + "\" >" + state + "</a>");
		str.append("  </td>");
		str.append("  </tr>");
	}
	
	/*for(; i < default_row_number; i++) {
		str.append("  <tr>");
		str.append("    <td class=\"text_overflow \" colspan='5'>&nbsp;</td>");
		str.append("  </tr>");
	}*/
	
	/*if(result.showBottomButton == "true"){
		str.append("  <tr>");
		str.append("    <td class=\"\" colspan='5'>&nbsp;");
		str.append(sectionHandler.showBottomButtons(result.bottomButtons));
		str.append("    </td>");
		str.append("  </tr>");
	}*/
	str.append("</table>");

	return str;
}

/**
 * 月历式
 */
ResolveFunction.prototype.MonthCalendarTemplate = function(result, titleId, x, y){
	var days = result.days || new Properties();
	var today = new Date(result.today);
	var str = new StringBuffer();
	str.append(HS_calender(today, days));
	/*str.append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	if(result.showBottomButton == "true"){
		str.append("<tr><td class=''>&nbsp;");
		str.append(sectionHandler.showBottomButtons(result.bottomButtons));
		str.append("</td></tr>");
	}
	str.append("</table>");*/
	return str;
}

var htmlTempleteContent = {};
var htmlTempleteContentKey = 0;

/**
 * 直接输出HTML代码片断模板
 */
ResolveFunction.prototype.htmlTemplete = function(result, titleId, x, y){
	var html = result.html || "";
	var model = result.model || "inner";
	var bottomButtons = result.bottomButtons;
	var defaultHeight = bottomButtons == null ? "234" : "208";
	var height = result.height || defaultHeight;
	if(height.indexOf("px")>0){
		height = height.substring(0, height.length - 2);
	}
	if(height == "100%" || parseInt(height) < 208) {
		height = defaultHeight;
	}
	
	var str = new StringBuffer();
	var content = "";
	var key = htmlTempleteContentKey++;
	
	if(model == "block"){
		content = html;
	}
	else if(model == "inner"){
		htmlTempleteContent[key] = html;
		content = "<iframe src=\"" + contextPath + "/main/section/genericHTMLSection.jsp?key=" + key + "\" frameborder=\"0\" height=\"98%\" width=\"100%\" scrolling=\"auto\" marginheight=\"0\" marginwidth=\"0\"></iframe>";
	}
	
	var style = "border-bottom: 1px solid #EFEFEF;" + 
        		"height: " + (parseInt(height)) + "px; /* FF */" + 
        		"height: " + (parseInt(height) - 1) + "px\\0; /* IE9 */";
	
	str.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	str.append("  <tr>");
	str.append("    <td id=\"htmlTempleteOfIframe" + key + "\" style=\"" +  style+ "\">" + content + "</td>");
	str.append("  </tr>");
		
	/*if(result.showBottomButton == "true"){
		str.append("  <tr>");
		str.append("    <td class=\"\">&nbsp;");
		str.append(sectionHandler.showBottomButtons(result.bottomButtons));
		str.append("    </td>");
		str.append("  </tr>");
	}*/
	str.append("</table>");
	
	return str;
}
/**
 * TODO：该方法由表单组迁移
 */
/** 栏目挂接相关JS方法 Start **/
function showDiv(innerHtmlContent, bizConfigId,tar){
	var sb = new StringBuffer();
	var a = innerHtmlContent.split("|");
	var len = a.length;
	for(var i=0; i<len; i++) {
		var idAndSubject = a[i];
		if(a[i]=='' || a[i].length==0) {
			continue;
		}
		var idAndSubject = a[i].split(",");
		var url = "javascript:getCtpTop().main.location.href = " +
		"'/seeyon/collaboration/collaboration.do?method=newColl&templateId=" + idAndSubject[1]+"'";
		if(idAndSubject[0] == "false"){
		  url="javascript:$.alert('"+$.i18n('bizconfig.use.authorize.template')+"')";
		}
		sb.append("<a onClick=\"" + url + "\" title=\"" + escapeStringToHTML(idAndSubject[2]) + "\">" + escapeStringToHTML(idAndSubject[2]) + "</a><br>");		
	}
	var postionX = parseInt(v3x.getEvent().clientX) - 80;
	var postionY = parseInt(v3x.getEvent().clientY) - 15 * len;
	var oDiv = document.getElementById('showPositionDiv');
	oDiv.style.position = "fixed";
  oDiv.style.top = postionY + "px";
	oDiv.style.left = postionX + "px";
	oDiv.innerHTML = sb.toString();
	showTemp();
}
function showTemp() {
	document.getElementById('showPositionDiv').style.display = "block";
}
function hideTemp() {
	document.getElementById('showPositionDiv').style.display = "none";
}
function showResult(type, formId, bizConfigId, queryOrReportName) {
	var openUrl = _ctxPath+"/report/queryReport.do?method=goIndexRight&&type=query&fromPortal=true&reportId="+formId+"&reportName";
	if("query" == type){
	openUrl = _ctxPath+"/form/queryResult.do?method=queryExc&type=query&queryId="+formId+"&queryName";
	}
	openUrl += encodeURIComponent(queryOrReportName) + "&formid=" +formId + "&bizConfigId=" + bizConfigId;
	if(formId.trim()=='' || formId.trim().length==0 || queryOrReportName.trim()=='' || queryOrReportName.trim().length==0) {
		alert($.i18n("MainLang.no_right_to_use_query_or_stat_temp"));
		getCtpTop().reFlesh();
		return false;
	}
	v3x.openWindow( {
		url : openUrl,
		workSpace : 'true',
		resizable : false, 
		dialogType : 'modal'
	}
	);				
}
/** 栏目挂接相关JS方法 End **/

/**
 * 成倍行不定列模板
 */
ResolveFunction.prototype.multiRowVariableColumnTemplete = function(result, titleId, x, y,sectionId,width,divWidth){
   var rows = result.rows || [];
   var i = 0;
   var columnsNum = 0; //列数
   var str = new StringBuffer();
   
   str.append("<table  style=''  width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
   for(i = 0; i < rows.length; i++) {
	    str.append("<tr>");
	    var cells = rows[i].cells || [];
	    columnsNum = cells.length;
	    
	    for(var j = 0; j < columnsNum; j++){
		     var cell = cells[j] || [];
		     var cellWidth = parseInt(cell.cellWidth, 10);
		     var cellContentWidth = 100;
		     
		     if (j == 0) {
		    	 cellWidth = 100;
		     }
		     
		     if(cell.cellContentWidth){
		    	 cellContentWidth = parseInt(cell.cellContentWidth,10);
		     }else{
		    	 cellContentWidth = cellWidth;
		     }
		     
		     var link = cell.linkURL;
		     var className = cell.className || "";
		     var cellPadding = (j == columnsNum - 1) ? "padding_r_10" : "";
		     var alt = cell.alt || "";
		     
		     var bodyType = cell.bodyType || null;
		     
 		     var cellContent = cell.cellContent || "";
		     var cellContentHTML = cell.cellContentHTML;
		     var fiexed = cell.fiexed;
		     
		     fiexed = (fiexed == "true") ? true : false;
		     
		     var content = "";
		     var hasAttachments = cell.hasAttachments;
		     
 		     if(cellContentHTML){
		     	content = cellContentHTML;
		     	if(hasAttachments){//attachment_table_true
		     		content += "<span class='attachment_table_" + hasAttachments + " inline-block'></span>";
		     	}
		     }
		     else{
		     	var extIcons = cell.extIcons;
		     	var extClasses = cell.extClasses;
		     	var extPreClasses = cell.extPreClasses;
		     	alt = alt || cellContent;
				var subjectLength;
				if(width){
				     subjectLength = parseInt((defaultFullLength * width / 10) * cellContentWidth / 100, 10);
				}else{
				     subjectLength = parseInt((defaultFullLength * sectionWidths[y] / 10) * cellContentWidth / 100, 10);
				}
		     	//var subjectLength = parseInt((defaultFullLength * sectionWidths[y] / 10) * cellWidth / 100, 10);
		     	if(j == 0) {
	     			content = sectionHandler.mergeSubject(cellContent, subjectLength, bodyType, null, hasAttachments, extIcons, extClasses, extPreClasses);
		     	}else{
		     		if(subjectLength || subjectLength > 0){ 
		     		  subjectLength = sectionHandler.getExpansionLength(subjectLength);
		     		}
		     		content = cellContent;
		     	}
		    }
 		    //空行去除前置图标
 		    if(j == 0 && ((cellContent && cellContent != "") ||(cellContentHTML && cellContentHTML != ""))){
				className += " sectionSubjectIcon";
			  }
		    if((cellContent != "" || cellContentHTML != "") && (cellWidth > 45 || j == 0)){
				str.append("<td width=\""+cellWidth+"%\" class=\"tr-bottom text_overflow padding_l_10 ").append(className).append("\" title=\"").append(alt.escapeHTML()).append("\">");
		    }
		    else{
		    	str.append("<td nowrap=\"nowrap\" width='"+cellWidth+"%'").append(" class='tr-bottom text_overflow padding_l_10 ").append(cellPadding + " ").append(className).append("' title=\"").append(alt.escapeHTML()).append("\">");		    	
		    }
		    if(link){
		    	var openType = parseInt(cell.openType || "0", 10);
				link = sectionHandler.mergeLinkOfOpenType(openType, link, titleId);
				//部门公告和部门讨论需要使用显示已阅和未读的标识区分css样式：title-more-visited added by Meng Yang 2009-05-19
				//部门公告需要永久区分已阅和未读信息
				if(cell.className=="ReadDifferFromNotRead") {  //区分已阅和未读
					str.append("<a class='title-more-visited' href=\"").append(link).append("\" title='").append(alt.escapeHTML()).append("'>").append(content).append("</a>");
				} else if(cell.className=="AlreadyReadByCurrentUser") {   //部门公告已阅的样式需要永久保持
					str.append("<a class='title-already-visited' href=\"").append(link).append("\" title='").append(alt.escapeHTML()).append("'>").append(content).append("</a>");
				} else if(cell.className == "like-a"){
					str.append("<a class='like-a' href=\"").append(link).append("\" title='").append(alt.escapeHTML()).append("'>").append(content).append("</a>");
				} else {
		     		str.append("<a class='defaulttitlecss' href=\"").append(link).append("\" title='").append(alt.escapeHTML()).append("'>").append(content).append("</a>");
				}
		    }
		    else{
		     	if(content == null || content == ""){
		    		str.append("&nbsp;");
		    	}else{
		    		str.append(content);
		    	}
		    }
		    str.append("</td>");
	    }
	    str.append("</tr>");
	}
	
	/*for(; i < default_row_number; i++) {
		str.append("  <tr>");
		str.append("    <td class=\"text_overflow padding_l_10 \" colspan='").append(columnsNum).append("'>&nbsp;</td>");
		str.append("  </tr>");
	}*/
	
	/*if(result.showBottomButton == "true"){
		str.append("  <tr>");
		str.append("    <td class=\"\" colspan='").append(columnsNum).append("'>&nbsp;");
		str.append(sectionHandler.showBottomButtons(result.bottomButtons));
		str.append("    </td>");
		str.append("  </tr>");
	}*/
	
	str.append("</table>");
	str.append("<div id=\"showPositionDiv\" style=\"position:absolute;z-index:500;padding:5px;clear:both;width:160px;border:1px #000000 solid;display:none;background:#ffffff;\" onMouseOver=\"showTemp()\"  onMouseOut=\"hideTemp()\"  ></div>");
 	return str;
}

/**
 * 成倍行不定列模板
 * 重写了multiRowVariableColumnTemplete模板，为了满足需求增加了一些特性
 * Author： xiangfan
 */
ResolveFunction.prototype.multiRowVariableColumnCustomTemplete = function(result, titleId, x, y,sectionId,width,divWidth){
   var rows = result.rows || [];
   var i = 0;
   var columnsNum = 0; //列数
   var str = new StringBuffer();
   
   var rowList = result.rowList;
   if(!rowList){
       rowList = ['subject','receiveTime','sendUser','category'];
       if(rows[i] && rows[i].cells.length == 4)//已发事项
        rowList = ['subject','createDate','category'];
   }
   //所有的字段（已办事项）
   var AllRowList = ['subject','receiveTime','edocMark','sendUnit','sendUser','placeOfMeeting','theConferenceHost','category'];
   if(rows[i] && rows[i].cells.length == 4){//已发事项
       AllRowList = ['subject','createDate','edocMark','category'];
   }else if(rows[i] && rows[i].cells.length == 6){//跟踪事项&督办事项
       AllRowList = ['subject','receiveTime','edocMark','sendUnit','sendUser','category'];
   }
   var theRowList = new ArrayList();
   theRowList.addAll(rowList);
   
   str.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
   for(i = 0; i < rows.length; i++) {
        str.append("<tr>");
        var cells = rows[i].cells || [];
        columnsNum = cells.length;
        
        for(var j = 0; j < columnsNum; j++){
             var endCellPaddingClass = "";
        	   if(j == columnsNum-1){
				       endCellPaddingClass = " padding_r_10";
             }
             var cell = cells[j] || [];
             var cellWidth = parseInt(cell.cellWidth, 10);
             
             var link = cell.linkURL;
             
             var applicationCategoryKey = cell.applicationCategoryKey;
             var categoryLabel = "";
             var categoryLink = cell.categoryLink;
             
             var className = cell.className || "";
             var alt = cell.alt || "";
             
             var bodyType = cell.bodyType || null;
             
             var deadLine = cell.deadLine || "";
             
             var cellContent = cell.cellContent || "";
             var cellContentHTML = cell.cellContentHTML;
             var fiexed = cell.fiexed;
             
             fiexed = (fiexed == "true") ? true : false;
             
             var content = "";
             var hasAttachments = cell.hasAttachments;
             
             if(applicationCategoryKey){
                var suffix = "";
                categoryLabel = $.i18n("application_" + applicationCategoryKey + suffix +  "_label");
             }
             
             if(cellContentHTML){
                content = cellContentHTML;
                if(hasAttachments){
                    content += "<span class='attachment_" + hasAttachments + " inline-block'></span>";
                }
             }
             else{
                var extIcons = cell.extIcons;
                alt = alt || cellContent;
                //var subjectLength = parseInt((defaultFullLength * sectionWidths[y] / 10) * cellWidth / 100, 10);
				if(width){
					 subjectLength = parseInt((defaultFullLength * width / 10) * cellWidth / 100, 10);
				}else{
					 subjectLength = parseInt((defaultFullLength * sectionWidths[y] / 10) * cellWidth / 100, 10);
				}
                if(j == 0){
                  var importantLevel = cell.importantLevel;
                  var workFlowState = cell.workFlowState;
                  content = sectionHandler.mergeSubject(cellContent, subjectLength, bodyType, importantLevel, hasAttachments, extIcons);
                  if(workFlowState) 
                    content = "<span title='" + deadLine + "' class='ico16 extended_"+ workFlowState + "_16' ></span>" + content;
                }else{
                    if(subjectLength || subjectLength > 0){ 
                      subjectLength = sectionHandler.getExpansionLength(subjectLength);
                    }
                    content = cellContent
                }
            }
            if(j == 0 && ((cellContent && cellContent != "") || (cellContentHTML && cellContentHTML != ""))){
                className += " sectionSubjectIcon";
            }
            if((cellContent != "" || cellContentHTML != "") && (j == 0)){
            	str.append("<td width='"+cellWidth+"%' class='tr-bottom text_overflow padding_l_10 ").append(className).append(endCellPaddingClass).append("' title=\"").append(alt).append("\">");
            }else{
            	if(theRowList.contains(AllRowList[j])){
            		if(AllRowList[j] == "category"){
            			str.append("    <td class=\"tr-bottom text_overflow padding_l_10 ").append(endCellPaddingClass).append(" \" nowrap=\"nowrap\" title=\"").append(categoryLabel).append("\">");
			            categoryLabel = categoryLabel;
			            if(categoryLink){
			                str.append("<a href=\"").append(sectionHandler.mergeLink(categoryLink)).append("\">").append(categoryLabel).append("</a>");
			            }else if(categoryLabel){
			            	str.append(categoryLabel);
			            }
			            //str.append("&nbsp;</td>");
            		}else{
                        str.append("<td nowrap=\"nowrap\" width='"+cellWidth+"%'").append(" class='tr-bottom padding_l_10 text_overflow ").append(className).append(endCellPaddingClass).append("' title=\"").append(alt).append("\">");
            		}
            	}else{
            		className = "";
            		alt = "";
            		content = "";
            		str.append("<td nowrap=\"nowrap\" width='"+cellWidth+"%'").append(" class='tr-bottom text_overflow padding_l_10 ").append(className).append(endCellPaddingClass).append("' title=\"").append(alt).append("\">");
            	}              
            }
            if(link){
                var openType = parseInt(cell.openType || "0", 10);
                link = sectionHandler.mergeLinkOfOpenType(openType, link, titleId);
                //部门公告和部门讨论需要使用显示已阅和未读的标识区分css样式：title-more-visited added by Meng Yang 2009-05-19
                //部门公告需要永久区分已阅和未读信息
                if(cell.className=="ReadDifferFromNotRead") {  //区分已阅和未读
                    str.append("<a class='title-more-visited' href=\"").append(link).append("\" title='").append(alt).append("'>").append(content).append("</a>");
                } else if(cell.className=="AlreadyReadByCurrentUser") {   //部门公告已阅的样式需要永久保持
                    str.append("<a class='title-already-visited' href=\"").append(link).append("\" title='").append(alt).append("'>").append(content).append("</a>");
                } else if(cell.className == "like-a"){
                    str.append("<a class='like-a' href=\"").append(link).append("\" title='").append(alt).append("'>").append(content).append("</a>");
                } else {
                    str.append("<a class='defaulttitlecss' href=\"").append(link).append("\" title='").append(alt).append("'>").append(content).append("</a>");
                }
            }else if(AllRowList[j] != "category"){
                str.append(content);
            }
            str.append("</td>");
        }
        str.append("</tr>");
    }
    
   /* for(; i < default_row_number; i++) {
        str.append("  <tr>");
        str.append("    <td class=\"text_overflow padding_l_10 \" colspan='").append(columnsNum).append("'>&nbsp;</td>");
        str.append("  </tr>");
    }*/
    
    /*if(result.showBottomButton == "true"){
        str.append("  <tr>");
        str.append("    <td class=\"tr-bottom-button\" colspan='").append(columnsNum).append("'>&nbsp;");
        str.append(sectionHandler.showBottomButtons(result.bottomButtons));
        str.append("    </td>");
        str.append("  </tr>");
    }*/
    
    str.append("</table>");
    str.append("<div id=\"showPositionDiv\" style=\"position:absolute;z-index:500;padding:5px;clear:both;width:160px;border:1px #000000 solid;display:none;background:#ffffff;\" onMouseOver=\"showTemp()\"  onMouseOut=\"hideTemp()\"  ></div>");
    return str;
}

/**
 * 第一条带摘要，其余多个列表
 */
ResolveFunction.prototype.oneSummaryAndMultiList = function(result, titleId, x, y){
	var constants = {
		Up : {
			subjectLength : 40,
			columnWidth : [70, 15, 15],
			datetimePattern : layoutTypeConstants.D2_2W5_5.datetimePattern
		},
		Down : {
			subjectLength : 40,
			columnWidth : [70, 15, 15],
			datetimePattern : layoutTypeConstants.D2_2W5_5.datetimePattern
		},
		Left : {
			subjectLength : 26,
			columnWidth : [55, 20, 25],
			datetimePattern : layoutTypeConstants.D2_2W5_5.datetimePattern
		},
		Right : {
			subjectLength : 26,
			columnWidth : [55, 20, 25],
			datetimePattern : layoutTypeConstants.D2_2W5_5.datetimePattern
		}
	}
	var rows = result.rows || [];
	var first = result.first || [];
	var leastSize = parseInt(result.leastSize, 10);
	var firstType = result.firstType;
	
	var i = 0;
	var first_subject = first[i++] || "";
	var first_summary = first[i++] || "";
	var first_link = first[i++] || default_link;
	var first_date = first[i++] || "";
	var first_categoryLabel = first[i++] || "";
	var first_categoryLink = first[i++] || default_link;
	var first_photo = first[i++];
	var first_hasAttachments = first[i++];
	var first_extIcons = first[i++];
	
	var first_openType = parseInt(result.firstOpenType || "0", 10);
		first_link = sectionHandler.mergeLinkOfOpenType(first_openType, first_link, titleId);
	if(first_date){
		first_date = new Date(parseInt(first_date, 10)).format(getLayoutTypeConstant("datetimePattern"));
	}
	
	var hasFirstSummary = false;
	if(first_summary != "" && first_summary != "null" && first_summary != null){
		try {
			eval("first_summary = '" + first_summary + "';");
			hasSummary = true;
		} catch (e) {
			first_summary = "&nbsp;";
		}
	}
	else{
		first_summary = "&nbsp;";
	}
	
	var subjectLength = eval("constants." + firstType + ".subjectLength");
	var first_subjectTitle = sectionHandler.mergeSubject(first_subject, subjectLength, null, null, first_hasAttachments, first_extIcons)

	var first_HTML = new StringBuffer();
	if(firstType == "Up" || firstType == "Down"){
		first_HTML.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style='padding: 6px 0px 5px 0px'>");
		first_HTML.append("  <tr valign='top'>");
		if(first_photo){
			first_HTML.append("  <td rowspan='2' width='114' height='84' style='padding:6px 12px 10px 6px;'><div style='border:1px solid #A4A4A4;'><img src=\"" + contextPath + first_photo + "\" border='0' width='112' height='82'></div></td>");
		}
		first_HTML.append("    <td height='20'>");
		first_HTML.append("        <div width='65%' style='float:left'>");
		first_HTML.append("        <a  href=\"" + first_link + "\"><span class='oneSummaryAndMultiList-title'>" + first_subjectTitle + "</span></a>");
		first_HTML.append("        </div>");
		first_HTML.append("        <div width='35%' style='float:right;padding-right:18px;'>");
		first_HTML.append("        <span class='oneSummaryAndMultiList-date'>&nbsp;&nbsp;" + first_date + "&nbsp;&nbsp;<a href=\"" + sectionHandler.mergeLink(first_categoryLink) + "\">" + first_categoryLabel + "</a></span>");
		first_HTML.append("        </div>");
		first_HTML.append("    </td>");
		first_HTML.append("  </tr>");
		first_HTML.append("  <tr>");
		first_HTML.append("    <td height='65' valign='top' class='oneSummaryAndMultiList-summary'>");
		first_HTML.append(first_summary);
		if(hasFirstSummary){
			first_HTML.append("     &nbsp;&nbsp;<a href=\"" + first_link + "\">");
			first_HTML.append("          <" + $.i18n("group_section_particular")+">");
			first_HTML.append("        </a>");
		}
		first_HTML.append("    </td>");		
		first_HTML.append("  </tr>");	
		first_HTML.append("</table>");
	}
	else if(firstType == "Left" || firstType == "Right"){
		first_HTML.append("<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"  style='padding: 6px 0px 5px 0px'>");
		first_HTML.append("  <tr valign='top'>");
		first_HTML.append("    <td class=\"text_overflow column-leftright-bgcolor\">");
		first_HTML.append("      <div style='height:20px;'><a href=\"" + first_link + "\"><span class='oneSummaryAndMultiList-title'>" + first_subjectTitle + "</span></a></div>");
		first_HTML.append("      <div class='oneSummaryAndMultiList-date'>" + first_date + "&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"" + sectionHandler.mergeLink(first_categoryLink) + "\">" + first_categoryLabel + "</a></div>");
		first_HTML.append("      <div class='oneSummaryAndMultiList-summary' style='padding-right:6px;' >" + first_summary);
		if(hasFirstSummary){
		   first_HTML.append("        &nbsp;&nbsp;<a href=\"" + first_link + "\">"+"<"+$.i18n("group_section_particular")+">"+"</a>");
		}
		first_HTML.append("      </div>");
		first_HTML.append("    </td>");
		first_HTML.append("  </tr>");
		first_HTML.append("</table>");
	}
	
	var rows_HTML = new StringBuffer();
	rows_HTML.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	var i = 0;
	for(i = 0; i < rows.length; i++) {
		var r = rows[i];
		var createDate = new Date(parseInt(r.createDate, 10)).format(constants[firstType].datetimePattern);
		var subject = r.subject || "";
		var link = r.link || default_link;
	    var openType = parseInt(r.openType || "0", 10);
		link = sectionHandler.mergeLinkOfOpenType(openType, link, titleId);
		
		//var className = r.get("className", "");
		var className = "defaulttitlecss";
		var categoryLabel = "";
		var applicationCategoryKey = r.applicationCategoryKey;
		
		if(applicationCategoryKey) {
			var suffix = "";
			/*if(typeof(getCtpTop().isGov)!='undefined' && getCtpTop().isGov) {
				if(applicationCategoryKey == 22 || applicationCategoryKey == 23 || applicationCategoryKey == 24) {//待签收->收文签收
					suffix = "GOV";
				}
			}*/
			categoryLabel = $.i18n("application_" + applicationCategoryKey + suffix + "_label");
		}
		else{
			categoryLabel = r.categoryLabel;
		}
		
		categoryLabel = categoryLabel || " ";
		var categoryLink = r.categoryLink || default_link;
		
		var bodyType = r.bodyType;
		var importantLevel = r.importantLevel;
		var hasAttachments = r.hasAttachments;
		var extIcons = r.extIcons;
		
		var title = sectionHandler.mergeSubject(subject, constants[firstType].subjectLength, bodyType, importantLevel, hasAttachments, extIcons);
		
		rows_HTML.append("  <tr>");
		rows_HTML.append("    <td class=\"tr-bottom text_overflow  oneSummaryAndMultiList-subject\" width=\"" + constants[firstType].columnWidth[0] + "%\" title=\"" + subject + "\"><a href=\"" + link + "\" class=\"" + className + "\">" + title + "</a></td>");
		rows_HTML.append("    <td class=\"tr-bottom text_overflow \" width=\"" + constants[firstType].columnWidth[1] + "%\">" + createDate + "</td>");
		rows_HTML.append("    <td class=\"tr-bottom text_overflow \" width=\"" + constants[firstType].columnWidth[2] + "%\" title=\"" + categoryLabel + "\"><a  href=\"" + sectionHandler.mergeLink(categoryLink) + "\">" + "&nbsp;&nbsp;" + categoryLabel + "</a></td>");
		rows_HTML.append("  </tr>");
	}
	
	for(; i < leastSize; i++) {
		rows_HTML.append("  <tr>");
		rows_HTML.append("    <td class=\"tr-bottom text_overflow \" colspan='3'>&nbsp;</td>");
		rows_HTML.append("  </tr>");
	}
	
	/*rows_HTML.append("  <tr>");
	rows_HTML.append("    <td class=\"\" colspan='3'>&nbsp;");
	
	rows_HTML.append(sectionHandler.showBottomButtons(result.bottomButtons));
	
	rows_HTML.append("    </td>");
	rows_HTML.append("  </tr>");*/
	rows_HTML.append("</table>");
	
	var str = new StringBuffer();
	if(firstType == "Up"){
		str.append(first_HTML).append(rows_HTML);
	}
	else if(firstType == "Down"){
		str.append(rows_HTML).append(first_HTML);
	}
	else if(firstType == "Left"){
		str.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
		str.append("  <tr valign='top'>");
		str.append("    <td class=\"text_overflow column-leftright-bgcolor\" width=\"38%\">" + first_HTML + "</td>");
		str.append("    <td class='text_overflow ' width=\"62%\" style='padding-left:8px;'>" + rows_HTML + "</td>");
		str.append("  </tr>");
		str.append("</table>");
	}
	else if(firstType == "Right"){
		str.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
		str.append("  <tr valign='top'>");
		str.append("    <td class='text_overflow '>" + rows_HTML + "</td>");
		str.append("    <td class='text_overflow oneSummaryAndMultiList-first-right'>" + first_HTML + "</td>");
		str.append("  </tr>");
		str.append("</table>");
	}
	
	return str;
}

/**
 * 两行展现一条数据记录的模板
 * 适用于 集团调查 类似栏目
 */ 
ResolveFunction.prototype.oneItemUseTwoRowTemplete = function(result, titleId, x, y){
	var rows = result.rows || [];
	var str = new StringBuffer();
	str.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	var i = 0;
	var maxNumber = 6;
	var subjectLength = 28;
	for(i = 0; i < rows.length; i++) {
		var r = rows[i];
		var createDate = new Date(parseInt(r.createDate, 10)).format(getLayoutTypeConstant("datetimePattern"));
		var subject = r.subject || "";
		var link = r.link || default_link;
		var openType = parseInt(r.openType || "0", 10);
		link = sectionHandler.mergeLinkOfOpenType(openType, link, titleId);
		
		var categoryLabel = r.categoryLabel;
		var categoryLink = r.categoryLink || default_link;;
		var hasAttachments = r.hasAttachments;
		var extIcons = r.extIcons;
		
		var title = sectionHandler.mergeSubject(subject, subjectLength, null, null, hasAttachments, extIcons);
		
		var classPrev = "";
		if(subject&&subject!=""){
		    classPrev = "sectionSubjectIcon";
		}
		
		str.append("  <tr>");
		str.append("    <td colspan='2' height='22' class=\"text_overflow padding_l_10 ").append(classPrev).append("\" width=\"96%\" title=\"" + subject + "\"><a class='defaulttitlecss' href=\"" + link + "\">" + title + "</a></td>");
		str.append("  </tr>");
		str.append("  <tr>");
		str.append("    <td class=\"tr-bottom text_overflow padding_l_10 \" width=\"50%\" title=\"" + categoryLabel + "\"><a class='defaulttitlecss' href=\"" + sectionHandler.mergeLink(categoryLink) + "\">" + categoryLabel + "</a>&nbsp;</td>");
		str.append("    <td class=\"tr-bottom text_overflow padding_l_10 \" width=\"50%\" style='color:#A4A4A4;'>" + createDate + "</td>");
		str.append("  </tr>");
	}
	
	for(; i < maxNumber; i++) {
		str.append("<tr>");
		str.append(" <td colspan='2' class='text_overflow padding_l_10 ' height='22'>&nbsp;</td>");
		str.append("<tr>");		
		str.append(" <td colspan='2' class=\"tr-bottom text_overflow padding_l_10 \">&nbsp");
		str.append("</tr>");
	}
	
	/*str.append("  <tr>");
	str.append("    <td class=\"\" colspan='2'>&nbsp;");
	
	str.append(sectionHandler.showBottomButtons(result.bottomButtons));
	
	str.append("    </td>");
	str.append("  </tr>");*/
	str.append("</table>");

	return str;
}

ResolveFunction.prototype.iframeTemplete = function(result, titleId, x, y, sectionId){
	var bottomButtons = result.bottomButtons;
	var defaultHeight = bottomButtons == null ? "231" : "208";
	var url = result.url;
	var height = result.height || defaultHeight;
	if(height.endsWith("px")){
		height = height.substring(0, height.length - 2);
	}
	if(height == "100%" || parseInt(height) < 208) {
		height = defaultHeight;
	}
	
	var style = "overflow:hidden;font-size:0px;" + 
        		"height: " + (parseInt(height)) + "px; /* FF */" + 
        		"height: " + (parseInt(height) - 1) + "px\\0; /* IE9 */";
	
	var str = new StringBuffer();
	str.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	str.append("  <tr>");
	str.append("    <td id='" + sectionId + "TD' style=\"" +  style+ "\">");
	if(titleId == "pendingSection"){
		str.append('      <iframe  ' + (url ? 'src="' + url + "&sectionId="+ sectionId + '"' : '') + ' sectionId="' + sectionId + '" name="IframeSectionTemplete" frameborder="' + (result.frameborder ? result.frameborder : "0") + '" height="100%" width="100%" scrolling="' + (result.scrolling ? result.scrolling : "no") + '" marginheight="0" marginwidth="0"></iframe>');
	}else{
		str.append('      <iframe ' + (url ? 'src="' + url + '"' : '') + ' sectionId="' + sectionId + '" name="IframeSectionTemplete" frameborder="' + (result.frameborder ? result.frameborder : "0") + '" height="100%" width="100%" scrolling="' + (result.scrolling ? result.scrolling : "no") + '" marginheight="0" marginwidth="0"></iframe>');
	}
	str.append("    </td>");
	str.append("  </tr>");
	
	/*if(bottomButtons){
		str.append("  <tr>");
		str.append("    <td class=\"\" colspan='2'>&nbsp;");
		
		str.append(sectionHandler.showBottomButtons(result.bottomButtons));
		
		str.append("    </td>");
		str.append("  </tr>");
	}*/
	str.append("</table>");
	
	return str;
}
ResolveFunction.prototype.nullDataTemplete = function(result, titleId, x, y,sectionId){
	return "<table style='' width='100%'><tr><td width='100%' align='center'>"+$.i18n("data_null_warning")+"</td></tr></table>";
}

ResolveFunction.prototype.defaultNoPictureTemplete = function(result, titleId, x, y,sectionId){
	var width = sectionPictureHandler.getSectionWidth(y);
	var hasButton = result.showBottomButton == true && result.bottomButtons;
	var height = hasButton ? 208 : 229.69;
	var str = new StringBuffer();
	str.append("<table style='' width=\"100%\" height=\"" + height + "\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bgcolor=\"#d2dae1\"><tr><td width=\"20%\">");
	str.append("</td><td width=\"60%\" align=\"center\" style=\"background:url(/seeyon/apps_res/v3xmain/images/defaultNo.jpg) center no-repeat\">")
	//str.append("<img src=\"\\seeyon\\apps_res\\v3xmain\\images\\defaultNo.jpg\">");
	//str.append("<div style=\"width:203px; height:158px;background-image:url(/seeyon/apps_res/v3xmain/images/defaultNo.jpg)\">");
	str.append("<br/><br/><br/><br/><br/><br/><br/><span style=\"color:#999999;\">"+$.i18n("data_null_warning")+"</span>");
	//str.append("</div>");
	str.append("</td><td width=\"20%\"></td>");
	str.append("</td></tr></table>");
	return str;
}
ResolveFunction.prototype.onPictureTemplete =  function(result, titleId, x, y,sectionId){
	var str = new StringBuffer();
	if(result){
	  var pictures = result.pictures;
		var data = pictures[0];
		var width = sectionPictureHandler.getSectionWidth(y);
		var height = 208;
		str.append("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" height=\"198\">");
		str.append(" <tr><td height='178' align='center' class='padding_tb_5'>");
		var  src="/seeyon/fileUpload.do?method=showRTE&fileId="+data.id+"&createDate="+data.createDate+"&type=image&showType=small";
		str.append(" <img src='"+src+"' width='"+(width-10)+"' height='"+height+"' onload='sectionPictureHandler.changeImage(this,"+y+",false)'>");
		str.append(" </td></tr>");
		str.append(" <tr><td height='20' valign='middle' align='center'>");
		str.append(" <a href=\""+data.link+"\">"+data.subject+"</a></td>");
		str.append(" </tr>");
		str.append("</table>");
	}
	return str;
};

ResolveFunction.prototype.pictureTemplete = function(result, titleId, x, y,sectionId){
	var str = new StringBuffer();
	var width = sectionPictureHandler.getSectionWidth(y) - 40;
	var height = 208;
	var perHeight = (26*8-40) / 3;
	if(result){
		var section = sectionHandler.allSections[sectionId];
		if(section){
			var totalPage = result.totalPage;
			if(totalPage){
				section.maxPage = parseInt(totalPage,10);
			}
		}
		var pictureWh = sectionPictureHandler.getMax(y,false);
		var pictures = result.pictures;
		var model = result.model;
		if(model == "rightIcon"){// rightIcon
			str.append("<table style='' border=\"0\" width=\"100%\" height=\"100%\" cellspacing=\"0\" cellpadding=\"0\">");
			str.append(" <tr>");
			str.append("  <td width=\"" + pictureWh.width + "\">");
			str.append("	<table  border=\"0\" height='188' width=\"100%\" style=\"word-wrap:break-word;\" cellspacing=\"0\" cellpadding=\"0\">");
			str.append("      <tr>");
			str.append("		<td height='168' align=\"center\" valign=\"middle\"  id='imageShow"+sectionId+"' style=\"padding-top:10px;\">");
			var thisDisplayImage = null;
			if(pictures && pictures.length >0){
				thisDisplayImage = pictures[0];
				var id = thisDisplayImage.id;
				var createDate = thisDisplayImage.createDate;
				var src =_ctxPath+thisDisplayImage.url;
				if(!thisDisplayImage.url){
				  src=_ctxPath+"/fileUpload.do?method=showRTE&fileId="+id+"&createDate="+createDate+"&type=image&showType=small";
				}
				str.append("<a href=\""+thisDisplayImage.link+"\"> <img style=\"padding:0px; border:0px solid #cccccc\" src='"+src+"' width='"+pictureWh.width+"' height='"+(perHeight*3)+"' onload='sectionPictureHandler.changeImage(this,"+y+",false)'></a>");
			}else{
				str.append(" <img src='/seeyon/common/skin/default/images/space/loading.gif'>");
			}
			str.append("		</td>");
			str.append("	  </tr>");
			str.append("<tr><td height='20' align=\"center\" valign=\"middle\">");
			if(thisDisplayImage){
				var title = thisDisplayImage.subject;
				str.append("<span id='subjectShow"+sectionId+"'><a href=\""+thisDisplayImage.link+"\">"+title+"</a></span>");
				str.append("</td></tr>");
			}
			str.append("    </table>");
			str.append("  </td>");
			str.append("  <td valign='top' width=\"" + (width - pictureWh.width) + "\">");
			str.append("    <table style='' border='0' height='188' width=\"100%\ cellspacing=\"0\" cellpadding=\"0\">");
			str.append("     <tr height=\"10\" valign='top'>");
			str.append("       <td  align='center'><div onclick='sectionPictureHandler.prev(\""+sectionId+"\");' style='width:60px;cursor:pointer;' onmouseover='this.className=\"onPerviewImage\"' onmouseout='this.className=\"perviewImage\"' class='perviewImage'></div></td>");
			str.append("     </tr>");
			str.append("     <tr height=\"100%\">");
			str.append("   		<td >");
			str.append("   			<table style='' border='0' width='100%' height='100%' cellspacing=\"0\" cellpadding=\"0\">");
			
			var pictureWh = sectionPictureHandler.getMax(y,true);
			var subDistence  = 7;
			var subDistenceMore  = 7;
			//浏览器判断
			var bro=$.browser;
			if(bro.msie){
				if((bro.msie && bro.version == '6.0') || bro.chrome || bro.isSafari){
					subDistence = 4;
					subDistenceMore = 5;
				}
			}
			if((pictures && pictures.length >1) || section.currentPage !=0){
				for(var i = 0 ; i < pictures.length;i++){
					var pic = pictures[i];
					var id = pic.id;
					var createDate = pic.createDate;
					var cla = i==0?"class='wendang-td-select'":'';
					var src = _ctxPath+pic.url;
					if(!pic.url){
					  src= _ctxPath+"/fileUpload.do?method=showRTE&fileId="+id+"&createDate="+createDate+"&type=image&showType=small";
					}
					str.append("   			  <tr height='" + (perHeight - subDistence) + "'>");
					str.append("   			 	<td style=\"padding:0px; border:0px solid #cccccc\" align='center' "+cla+" valign=\"middle\" isImage='true' title=\""+pic.subject+"\" link=\""+pic.link+"\" id=\"mini_"+sectionId+"_"+i+"\" sectionId=\""+sectionId+"\" src=\""+src+"\" y=\""+y+"\">");
					str.append(" <a href=\"javascript:taskRunning.stopRun('"+sectionId+"');sectionPictureHandler.showImage('mini_"+sectionId+"_"+i+"')\"><img src='"+src+"' id='image_"+sectionId+i+"' width='"+pictureWh.width+"' height='"+(perHeight-10)+"' style='border:0px' onload='sectionPictureHandler.changeImage(this,"+y+",true)' class='wendang-image'></a>");
					str.append("   			 	</td>");
					str.append("   			  </tr>");
				}
				if(pictures.length < 3){
					for(var i = 0 ; i < 3-pictures.length;i++){
						str.append("   		<tr height='"+(perHeight-subDistenceMore)+"'>");
						str.append("   			<td align='center' style='border:1px solid #000000;cursor:pointer;' valign=\"middle\">"+_("MainLang.no_image_to_display"));
						str.append("   			</td>");
						str.append("   		</tr>");
					}
				}
				taskRunning.stopRun(sectionId);
				if(pictures.length>1){
					var task = new TaskObject(sectionId,'showImages','mini_'+sectionId+'_1',5);
					taskRunning.addTask(task);
					taskRunning.run(sectionId);
				}
				
			}else if(pictures && pictures.length ==1){//只有一张图片，单张显示
				return this.onPictureTemplete(result,titleId,x,y,sectionId);	
			}
			else{
				return this.defaultNoPictureTemplete(result, titleId, x, y,sectionId);
			}
			str.append("   			</table>");
			str.append("    	</td>");
			str.append("     </tr>");
			str.append("     <tr height=\"10\" valign='top'>");
			str.append("       <td align='center' valign='top' width=\"100%\"><div  onclick='sectionPictureHandler.next(\""+sectionId+"\");' style='width:60px;cursor:pointer;' onmouseover='this.className=\"onNextImage\"' onmouseout='this.className=\"nextImage\"' class='nextImage'></div></td>");
			str.append("     </tr>");
			str.append("   </table>");
			str.append("  </td></tr>");
			str.append("</table>");
		}else if(model == "index"){ //index
			var firstImage = null;
			eval("len" + sectionId + " = 0;"); 
			if(pictures && pictures.length > 0){
				firstImage = pictures[0];
				var len = pictures.length;
				eval("len" + sectionId + " = " + len + ";");
				eval("num" + sectionId + " = 0;");
				eval("subjectLength" + sectionId + " = " + parseInt(((parseInt(width) * 0.6) / 6)) + ";");
				for(var i = 0 ; i < len; i ++){
					var thisDisplayImage = pictures[i];
					var id = thisDisplayImage.id;
					var createDate = thisDisplayImage.createDate;
					var src = _ctxPath + "/fileUpload.do?method=showRTE&fileId=" + id + "&createDate=" + createDate + "&type=image&showType=small";
					eval("image" + sectionId + i + " = new Image();");
					eval("image" + sectionId + i + ".src = src;");
					eval("image" + sectionId + i + ".setAttribute(\"subject\",\"" + thisDisplayImage.subject.escapeJavascript() + "\");");
					eval("image" + sectionId + i + ".setAttribute(\"link\",\"" + thisDisplayImage.link + "\");");
				}
				
				str.append("<div style=\"height:" + height + "px;text-align:center;overflow:hidden;text-overflow:clip;margin:0 auto;\" id=\"" + sectionId + "\">");
				
				str.append("<div style=\"background-color: #fff;height:" + (height-30) + "px;text-align:center;\">");
				str.append("<div style=\"width:" + (width - 20) + "px;height:" + (height - 35) + "px;position:relative;_position:static;margin:auto;\">");
				str.append("<a id=\"url" + sectionId + "\" href=\"" + firstImage.link + "\"><img id=\"pic" + sectionId + "\" src=\"" + _ctxPath + "/fileUpload.do?method=showRTE&fileId=" + firstImage.id + "&createDate=" + firstImage.createDate + "&type=image&showType=small\" width=\"" + (width - 20) + "\" height=\"" + (height - 35) + "\" style=\"border:0px;filter:progid:dximagetransform.microsoft.wipe(gradientsize=1.0, wipestyle=4, motion=forward)\" onload='imageOnload(this, " + width + ", " + (height - 35) +")'></a>");
				if(len > 1){
					str.append("<div style=\"height:22px;_height:14px;position:absolute;_position:static;right:0px;bottom:0px;_text-align:right;\">");
					for(var i = 0; i < len; i ++){
						str.append("<a style=\"_padding:2px;\" href=\"javascript:taskRunning.pauseRun('" + sectionId + "');changeImg(" + i + ", '" + sectionId + "');taskRunning.run('" + sectionId + "');\" id=\"img" + sectionId + i +"\" class=\"axx\">" + eval(i+1) + "</a>");
					}
					str.append("</div>");
				}
				str.append("</div>");
				str.append("</div>");
				
				str.append("<table style='' border=\"0\" width=\"100%\" height=\"30\" cellspacing=\"0\" cellpadding=\"0\">");
				str.append("<tr>");
				str.append("<td id=\"subjectDiv" + sectionId + "\" align=\"center\">");
				str.append("<a href=\"" + firstImage.link + "\" style=\"font-weight:bold;\" title=\"" + firstImage.subject + "\">" + firstImage.subject+ "</a>");
				str.append("</td>");
				str.append("</tr>");
				str.append("</table>");
				
				str.append("</div>");
				taskRunning.stopRun(sectionId);
				
				if(pictures.length > 1){
					var task = new TaskObject(sectionId, 'change_img', '' + sectionId + '', 5);
					taskRunning.addTask(task);
					taskRunning.run(sectionId);
				}
			}else{
				return this.defaultNoPictureTemplete(result, titleId, x, y, sectionId);
			}
		}else if(model == "leftScroll"){ //leftScroll
			var hasButton = result.showBottomButton == true && result.bottomButtons;
			var defaultHeight = hasButton ? "200" : "234";
			if(pictures && pictures.length > 0){
				str.append("<table style='' width=\"100%\" height=\"" + defaultHeight + "\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
				str.append("<tr><td class=\"tr-bottom\" align=\"center\">");
				
				str.append("<div id=\"imageMarqueeBox" + sectionId + "\" style=\"overflow:hidden; width:" + width + "px;\">");
				str.append("<table style='' height=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tr>");
				str.append("<td id=\"imageMarqueeBoxTD1" + sectionId + "\" width=\"100\">");
				str.append("<table style='' height=\"100%\" border=\"0\" cellspacing=\"2\" cellpadding=\"0\">");
				for(var i = 0 ; i < pictures.length; i ++){
					var thisDisplayImage = pictures[i];
					str.append("<td title=\"" + thisDisplayImage.subject + "\"><table style='' height=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
					str.append("<tr><td><a href=\"" + thisDisplayImage.link + "\"><img src=\"" + _ctxPath + "/fileUpload.do?method=showRTE&fileId=" + thisDisplayImage.id + "&createDate=" + thisDisplayImage.createDate + "&type=image&showType=small\" width=\"" + (width - 25) + "\" height=\"" + (defaultHeight - 25) + "\" style=\"border:0px;filter:progid:dximagetransform.microsoft.wipe(gradientsize=1.0, wipestyle=4, motion=forward)\" onload=\"imageOnload(this, " + (width - 25) + ", " + (defaultHeight - 25) + ")\"></a></td></tr>");
					str.append("<tr><td align=\"center\" height=\"18\"><a href=\"" + thisDisplayImage.link + "\">" + thisDisplayImage.subject + "</a></td></tr>");
					str.append("</table></td>");
				}
				str.append("</table>");
				str.append("</td>");
				str.append("<td id=\"imageMarqueeBoxTD2" + sectionId + "\"></td>");
				str.append("</tr></table>");
				str.append("</div>");
				
				str.append("</td></tr>");
				/*if(result.showBottomButton == "true"){
					str.append("<tr><td class=\"\">&nbsp;");
					str.append(sectionHandler.showBottomButtons(result.bottomButtons));
					str.append("</td></tr>");
				}*/
				str.append("</table>");
				setTimeout(function(){startImageMarquee(30, sectionId)}, 2000);
			}else{
				return this.defaultNoPictureTemplete(result, titleId, x, y, sectionId);
			}
		}
	}
	return str.toString();
}

/**
 * 图片向左滚动
 * speed 滚动速度
 * sectionId 栏目ID
 */
function startImageMarquee(speed, sectionId){
	var imageMarqueeBoxDiv = $("#imageMarqueeBox" + sectionId);
	var imageMarqueeBoxTD1 = $("#imageMarqueeBoxTD1" + sectionId);
	var imageMarqueeBoxTD2 = $("#imageMarqueeBoxTD2" + sectionId);
	if (imageMarqueeBoxTD1.width() <= imageMarqueeBoxDiv.width()) {
		return;
	}
    imageMarqueeBoxTD2.html(imageMarqueeBoxTD1.html());
    
    var p = false;//true鼠标滑过，停止滚动；false鼠标离开，开始滚动
    
    imageMarqueeBoxDiv.mouseover(function(){
    	p = true;
    });
    
    imageMarqueeBoxDiv.mouseout(function(){
    	p = false;
    });
	
	function imageMarquee(){
		try{
			if(p){
				return;
			}
			
			if(imageMarqueeBoxDiv.scrollLeft() >= imageMarqueeBoxTD1.width()){
	        	imageMarqueeBoxDiv.scrollLeft(0);
	        }else{
	            imageMarqueeBoxDiv.scrollLeft(imageMarqueeBoxDiv.scrollLeft() + 1);
	        }
		}catch(e){
		}
    }
    
	var imageMarqueeInterval = null;
	try{
		imageMarqueeInterval = setInterval(imageMarquee, speed);
	}catch(e){
	}
}

function imageOnload(img,maxWidth,maxHeight){
	var image = new Image();
	image.src = img.src;
	var height = 0;
	var width = 0;
		
	var oWidth = image.width;
	var oHeight = image.height;
	if (oWidth == 0) {
		oWidth = maxWidth;
	}
	if (oHeight == 0) {
		oHeight = maxHeight;
	}
	var destWH = maxWidth/maxHeight;
	var oWH = oWidth/oHeight;
		
	if(oWH == destWH){
		width = maxWidth;
		height = maxHeight;
	} else if(oWH > destWH){ // 宽幅图片
		width = maxWidth;
		height = maxWidth/oWH;
	} else if(oWH < destWH){
		width = oWH * maxHeight;
		height = maxHeight;
	}
		
	img.width = width;
	img.height = height;
	img.parentNode.parentNode.style.width = width;
	img.parentNode.parentNode.style.height = height;
}
function change_img(sectionId) {
	try {
		document.getElementById("pic" + sectionId).filters[0].Apply();
		document.getElementById("pic" + sectionId).filters[0].Play(duration=2);
	} catch (e) {
		
	}
	
	var num = eval("num" + sectionId);
	var img = eval('image' + sectionId + num);
	document.getElementById("pic" + sectionId).src=img.src;
	var len = eval("len" + sectionId);
	for (var i = 0;i < len; i++){
		document.getElementById("img" + sectionId + i).className='axx';
	}
	document.getElementById("img" + sectionId + num).className='bxx';
	var url = img.getAttribute("link");
	var title = img.getAttribute("subject");
	document.getElementById("subjectDiv" + sectionId).innerHTML = "<a href=\"" + url + "\" style=\"font-weight:bold;\" title=\"" + title + "\">"+title+"</a>";
	document.getElementById("url" + sectionId).setAttribute("href",url);
	num++;
	eval("num" + sectionId + " = " + num + ";");
	if(num > (len-1)){
		eval("num" + sectionId + " = 0;");
	}
	return sectionId;
}

function changeImg(n, sectionId){
	eval("num" + sectionId + " = " + n + ";");
	change_img(sectionId);
}
function showImages(id){
	var td = $("#"+id);
	var result = id;
	if(td.attr("isImage") =='true'){
		if(td.attr("sectionId")){
			sectionPictureHandler.showImage(id);
		}
		var trs = td.parent().eq(0).next();
		if(trs.length !=0 && trs.children(0).attr("isImage") == 'true'){
			return trs.children(0).attr("id");
		}else{
			return td.parent().eq(0).parent().eq(0).children(0).children(0).attr("id");
		}
	}
	return result;
}
function TaskObject(id,fun,param,time){
	this.id = id;
	this.fun = fun;
	this.param = param;
	this.time = time;//单位 s
}
var taskRunning = {
	allTaskObject:new Properties(),
	addTask      :function(taskObj){
		if(taskObj){
			taskRunning.allTaskObject.put(taskObj.id,taskObj);
		}
	},
	allRunningObj:new Properties(),
	run:function(id){
		var obj = taskRunning.allTaskObject.get(id);
		if(obj){
			var running = setInterval("taskRunning.execute('"+id+"')",obj.time * 1000);
			taskRunning.allRunningObj.put(id,running);
		}
	},
	execute:function(id){
		var obj = taskRunning.allTaskObject.get(id);
		var param =obj.param;
		try{
			eval("param="+obj.fun+"(param)")
		}catch(e){
			//alert(e);
		}
		obj.param = param;
	},
	stopRun:function(id){
		var running = taskRunning.allRunningObj.get(id);
		clearInterval(running);
		taskRunning.allRunningObj.remove(id);
		taskRunning.allTaskObject.remove(id);
	},
	pauseRun:function(id){//暂停，调用run即可启动
		var running = taskRunning.allRunningObj.get(id);
		clearInterval(running);
	}
	
}
/**
 * 图片栏目展现
 * 思想：
 * 得到图片的宽度 高度 16:9
 * 得到缩略图的宽度
 **/
var sectionPictureHandler = {
	maxWidth:"",//最大宽度
	getSectionWidth:function(y){
		var expan = sectionHandler.widthExpansion();
		var sectionWidth = sectionWidths[y]*84*expan*1.1;
		if(!ie){
			sectionWidth = sectionWidths[y]*80*expan*1.1;
		}
		return sectionWidth;
	},
	getMax:function(y,mini){//得到图片(缩略图)最大宽度和高度.
		var resultX = 0;
		var resultY = 0;
		var sectionWidth = sectionPictureHandler.getSectionWidth(y);
		if(mini){
			resultX = (sectionWidth-20)*0.2;
		}else{
			resultX = (sectionWidth-50)*0.8;
		}
		resultY = mini?39:170;
		return {width:resultX,height:resultY};
	},
	getMiddle:function(y){
		var sectionWidth = sectionPictureHandler.getSectionWidth(y);
		var resultX = sectionWidth*0.25;
		var resultY = (resultX*9/16);//
		return {width:resultX,height:resultY};
	},
	getImageWidth:function(img,maxWidth,maxHeight){
		var image = new Image();
		image.src = img.src;
		var oldwidth = image.width;oldheight=image.height;
		var resultX = 0;resultY = 0;
		/**
		if(image.width > maxHeight){
	       if(image.width > maxWidth)
	       {
	          oldwidth = image.width;
	          resultY = image.height * (maxWidth/oldwidth);
	          resultX = maxWidth;
	          if(resultY > maxHeight){
	          	resultX = resultX *(maxHeight/resultY);
	          	resultY = maxHeight;
	          }
	       }
	   }else{
	       if(img.height > maxHeight)
	       {
	          oldheight = image.height;
	          resultX = image.width * ( maxHeight/oldheight);
	          resultY = maxHeight;
	          if(resultX > maxWidth){
	          	resultY = resultY *(maxWidth/resultX);
	          	resultX = maxWidth;
	          }
	       }
	   }
	   if(resultX == 0){
	      return {width:oldwidth,height:oldheight};
	   }**/
	   var oWH = oldwidth/oldheight;
	   var destWH = maxWidth/maxHeight;
	   
	   if(oWH >= destWH){
		   if(oldwidth > maxWidth){// 宽幅图片
			   resultX = maxWidth;
			   resultY = parseInt(maxWidth/oWH);
		   } else {
			   resultX = oldwidth;
		   	   resultY = oldheight;
		   }
	    } else {
	    	if(oldheight > maxHeight){
				resultX = parseInt(oWH * maxHeight);
				resultY = maxHeight;
	    	} else {
	    		resultX = oldwidth;
			   	resultY = oldheight;
	    	}
		}
	   return{width:resultX,height:resultY};
	},
	changeImage:function(img,y,mini){
		var pictureWh = sectionPictureHandler.getMax(y,mini);
		var finalWh = sectionPictureHandler.getImageWidth(img,pictureWh.width,pictureWh.height);
	    img.width = finalWh.width;
	    img.height = finalWh.height;
	},
	addToChange:function(id,maxWidth,maxHeight){
		$("#"+id).ready(function(){
			var doma = $("#"+id)[0];
			if(doma){
				sectionPictureHandler.changeImageWidth(doma,maxWidth,maxHeight);
			}
		}
		);
	},
	/**
	 * 改变图片大小。
	 */
	changeImageWidth:function(img,maxWidth,maxHeight){
		var finalWh = sectionPictureHandler.getImageWidth(img,maxWidth,maxHeight);
	    img.width = finalWh.width;
	    img.height = finalWh.height;
	},
	showImage:function(id){
		var td = $("#"+id);
		var titleId = td.attr("sectionId");
		var src = td.attr("src");
		var y = td.attr("y");
		var allTd = td.parent().eq(0).parent().eq(0).find("td");
		allTd.removeClass("wendang-td-select");
		td.addClass("wendang-td-select");
		
		$("#imageShow"+titleId).html("");
		var img = new Image();
		img.src = src;
		var pictureWh = sectionPictureHandler.getMax(y,false);
		var finalWh = sectionPictureHandler.getImageWidth(img,pictureWh.width,pictureWh.height);
		img.width = finalWh.width;
		img.height = finalWh.height;
		var link = td.attr("link");
		$("#imageShow"+titleId).html("<a href=\""+link+"\"><img style=\"padding:0px; border:0px solid #cccccc\" src='"+src+"' width='"+finalWh.width+"' height='"+finalWh.height+"'></a>");
		var title = td.attr("title");
		$("#subjectShow"+titleId).html("<a href=\""+link+"\">"+title+"</a>");
	},
	prev:function(sectionId){
		var section = sectionHandler.allSections[sectionId];
		if(section){
			if(section.currentPage==0){
				return;
			}
			var param = new Properties();
			param.put("currentPage",(--section.currentPage));
			section.loadData(param);
		}
	},
	next:function(sectionId){
		var section = sectionHandler.allSections[sectionId];
		if(section){
			if((section.currentPage+1) >= section.maxPage){
				return ;
			}
			var param = new Properties();
			param.put("currentPage",(++section.currentPage));
			section.loadData(param);
		}
	}
}

ResolveFunction.prototype.oneImageAndListTemplete = function(result, titleId, x, y,sectionId){
	var todayFirstTime = result.todayFirstTime;
	var columnWidth = getLayoutTypeConstant("multiRowThreeColumnTempleteColumnWidth");
	var subjectLength = defaultFullLength * (sectionWidths[y] / 10) * columnWidth[0] / 100;
	
	var rowList = result.rowList;
	if(!rowList){
		rowList = ['subject','publishDate','type'];
	}

	var theRowList = new ArrayList();
	theRowList.addAll(rowList);
	
	var str = new StringBuffer();
	str.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	
	var firstRow = result.firstRow;
	var first = 0;
	if(firstRow){
		first += 4;
		str.append("<tr><td colspan='3'>");
		str.append("<table style='' border=\"0\" width=\"100%\" height=\"100%\" cellspacing=\"0\" cellpadding=\"0\">");
		
		str.append("<tr>");
		var id = firstRow.imageId;
		if(id){
			var pictureWh = sectionPictureHandler.getMiddle(y);
			str.append("<td align=\"center\" style=\"padding:1px; border:1px solid #cccccc;\" width=\"" + pictureWh.width + "\" height=\"" + (pictureWh.height - 15) + "\">");
			/**
			 * TODO:获取正文编辑器传参存在异常
			 */
			str.append("<div style='height:"+(pictureWh.height + 10)+"px;margin-top:9px;'><img alt=\"\" id=\"myshowImage\" width=\"" + (pictureWh.width - 10) + "\" height=\"" + (pictureWh.height - 10) + "\" onload='sectionPictureHandler.changeImageWidth(this, " + pictureWh.width + "," + pictureWh.height + ")' src=\"" + _ctxPath + "/fileUpload.do?method=showRTE&fileId=" + id + "&createDate=" + firstRow.imageDate + "&type=image&showType=small\"></div>");
      str.append("</td>");
		}
		
		str.append("<td valign=\"top\" style=\"padding-left:6px;\">");
		str.append("<table style='' border=\"0\" width=\"100%\" height=\"100%\">");
		
		var title = firstRow.title;
		str.append("<tr>");
		str.append("<td valign=\"top\" width='100%' title='" + title + "' style='font-weight: bold;font-size:14px;'>");
		var link = firstRow.link;
		var openType = parseInt(firstRow.openType || "0", 10);
		if(link){
			var theUrl = sectionHandler.mergeLinkOfOpenType(openType, link, '');
			str.append("<a href=\"" + theUrl + "\">");
		}
		
		if(title){
			str.append(sectionHandler.mergeSubject(title, subjectLength, null, null, null, null));
		}
		
		if(link){
			str.append("</a>");
		}
		str.append("</td>");
		var createDate = "";

	    if(firstRow.createDate){
	      createDate = sectionHandler.showDatetime(firstRow.createDate,firstRow.createDateTime, todayFirstTime);
	    }
		//var createDate = sectionHandler.showDatetime(parseInt(firstRow.createDate, 10), todayFirstTime);
		//var createDate = firstRow.createDate;
		
		var categoryLabel = firstRow.categoryLabel || "";
		var categoryLink = firstRow.categoryLink;
		
		var j = 1;
		if(theRowList.contains("publishDate")){
			j += 1;
			str.append("<td class='time padding_lr_5' style='border:0px' align='right' nowrap=\"nowrap\">").append(createDate).append("</td>");
		}
		
		if(theRowList.contains("type")){
			j += 1;
			str.append("<td class=\"padding_lr_5\" nowrap=\"nowrap\" align='right' width='60' title=\"").append(categoryLabel).append("\">");
			if(categoryLink){
				str.append("<a href=\"").append(sectionHandler.mergeLink(categoryLink)).append("\">");
			}
			str.append(categoryLabel);
			if(categoryLink){
				str.append("</a>");
			}
			str.append("</td>");
		}
		str.append("</tr>");
		
		str.append("<tr height=\"47px\"><td valign=\"top\" class='color6' colspan='" + j + "' style=\"word-wrap:break-word;word-break:break-all;\">");
		var abs = firstRow.abStr;
		if(abs){
			var briefLength = subjectLength * 5;
			str.append(abs);
		}
		str.append("</td></tr>");
		
		str.append("</table>");
		str.append("</td>");
		str.append("</tr>");
		
		str.append("</table>");
		str.append("</td></tr>");
	}
	
	var rows = result.rows || [];
	var i = 0;
	for(; i < rows.length; i++) {
		var r = rows[i];
		
		var link = r.link || default_link;
		var openType = parseInt(r.openType || "0", 10);
		link = sectionHandler.mergeLinkOfOpenType(openType, link, titleId);
		
		var createDate = "";
		if(r.createDate){
	      createDate = sectionHandler.showDatetime(r.createDate,r.createDateTime, todayFirstTime);
	    }
		//var createDate = sectionHandler.showDatetime(parseInt(r.get("createDate"), 10), todayFirstTime);
		//var createDate = r.createDate;
		
		var categoryLabel = r.categoryLabel || "";
		var categoryLink = r.categoryLink;
		
		var alt = r.alt || "";
		var subject = r.subject || "";
		var subjectHTML = r.subjectHTML;
		
		var title = "";
		if(subjectHTML){
			title = subjectHTML;
		}else{
			var bodyType = r.bodyType;
			var importantLevel = r.importantLevel;
			var hasAttachments = r.hasAttachments;
			var extIcons = r.extIcons;
			
			alt = alt || subject;
			title = sectionHandler.mergeSubject(subject, subjectLength, bodyType, importantLevel, hasAttachments, extIcons);
		}
		
		str.append("<tr>");
		
		var classPrev = "";
		if((subject&&subject!="")||(subjectHTML&&subjectHTML!="")){
		    classPrev = "sectionSubjectIcon";
		}
		
		if(r.className=="ReadDifferFromNotRead"){
			str.append("<td class='tr-bottom ").append(classPrev).append("' width='100%' title=\"").append(alt).append("\"><a class='title-more-visited' href=\"").append(link).append("\">").append(title).append("</a></td>");
		}else if(r.className=="AlreadyReadByCurrentUser"){
			str.append("<td class='tr-bottom ").append(classPrev).append("' width='100%' title=\"").append(alt).append("\"><a class='title-already-visited' href=\"").append(link).append("\">").append(title).append("</a></td>");
		}else{
			str.append("<td class='tr-bottom ").append(classPrev).append("' width='100%' title=\"").append(alt).append("\"><a class='defaulttitlecss' href=\"").append(link).append("\">").append(title).append("</a></td>");
		}
		
		if(theRowList.contains("publishDate")){
			str.append("<td class='tr-bottom time padding_lr_5' align='right' nowrap=\"nowrap\">").append(createDate).append("</td>");
		}
		
		if(theRowList.contains("type")){
			str.append("<td class='tr-bottom padding_lr_5' width='60' align='right' nowrap=\"nowrap\" title=\"").append(categoryLabel).append("\">");
			if(categoryLink){
				str.append("<a href=\"").append(sectionHandler.mergeLink(categoryLink)).append("\">");
			}
			str.append(categoryLabel);
			if(categoryLink){
				str.append("</a>");
			}
			str.append("</td>");
		}
		
		str.append("</tr>");
	}
	
	
	/*for(i += first; i < default_row_number; i++){
		str.append("<tr><td class='' colspan='3'>&nbsp;</td></tr>");
	}*/
	
	/*if(result.showBottomButton == "true"){
		str.append("<tr>");
		str.append("<td class='' colspan='3'>&nbsp;");
		str.append(sectionHandler.showBottomButtons(result.bottomButtons));
		str.append("</td>");
		str.append("</tr>");
	}*/
	str.append("</table>");

	return str;
}
/**
 * 图片+标题+摘要模板
 */
ResolveFunction.prototype.pictureTitleAndBriefTemplete = function(result, titleId, x, y,sectionId,width,divWidth){
  var str = new StringBuffer();
  var datas = result.datas || [];
  str.append("<table style='' width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
  if(datas.length > 0){
    var rowList = result.rowList;
    if(!rowList){
      rowList = ['subject','publishDate'];
    }
    var theRowList = new ArrayList();
    theRowList.addAll(rowList);
    var columnWidth = getLayoutTypeConstant("multiRowFourColumnTempleteColumnWidth");
    var subjectLength = defaultFullLength * (sectionWidths[y] / 10) * columnWidth[0] / 100;
    var subjectLength;
    if(width){
       subjectLength = defaultFullLength * (width / 10) * columnWidth[0] / 100;
    }else{
       subjectLength = defaultFullLength * (sectionWidths[y] / 10) * columnWidth[0] / 100;
    }
    for(var i = 0 ; i <datas.length;i++){
      var data = datas[i];
      str.append(" <tr>");
      str.append("   <td>");
      str.append("   <table width=\"100%\" height=\"100%\" border=\"0\" cellspacing=\"1\" cellpadding=\"1\">");
      str.append("     <tr>");
      var picture = data.picture;
      var subject = data.subject || "";
      var title = "";
      
      var pictureWh = sectionPictureHandler.getMiddle(y);
      var hasAttachment = data.hasAttachment;
      var titleLength = subjectLength;
      
      var link = data.link;
      var openType = parseInt(data.openType || "0", 10);
      var theUrl = "";
      if(link){
        theUrl = sectionHandler.mergeLinkOfOpenType(openType, link, '');
      }
      if(picture && picture.picId){
        var imageUrl = theUrl;
        var imageLink = picture.link;
        if(imageLink){
          var openType = parseInt(picture.openType || "0", 10);
          imageUrl = sectionHandler.mergeLinkOfOpenType(openType, imageLink, '');
        }
        title = sectionHandler.mergeSubject(subject, subjectLength, '', '', hasAttachment, '')
        str.append("       <td valign='middle' align=\"center\" width=\"" + pictureWh.width + "\" height=\"" + pictureWh.height + "\" style=\"padding:1px; border:1px solid #cccccc\">");//image
        if(imageUrl){
          str.append("<a href=\""+imageUrl+"\">");
        }
        str.append("    <img style=\"padding:0px; border:0px solid #cccccc\" id=\"myshowImage\" width=\""+pictureWh.width+"\" height=\""+pictureWh.height+"\" onload='sectionPictureHandler.changeImageWidth(this,"+pictureWh.width+","+pictureWh.height+")' src=\""+_ctxPath+"/fileUpload.do?method=showRTE&fileId="+picture.picId+"&createDate="+picture.createDate+"&type=image&showType=small\">");
        if(imageUrl){
          str.append("</a>");
        }
        str.append("       </td>");
      }else{
        titleLength = parseInt(subjectLength+pictureWh.width/15);
        title = sectionHandler.mergeSubject(subject, titleLength, '', '', hasAttachment, '')
      }
      str.append("       <td valign='top'>");
      str.append("       <table style=''  width=\"100%\" border=\"0\" class=\"ellipsis_select\" cellspacing=\"0\" cellpadding=\"0\">");
      str.append("      <tr height='20px'>");
      str.append("       <td  style=\"padding-left:6px;\" class='select'>");//subject 
      str.append("<span title='"+subject+"' style='padding-left:5px;font-weight: bold;font-size:14px;'>");
      if(theUrl){
        str.append("<a href=\""+theUrl+"\">"+title+"</a>");
      }else{
        str.append(title);
      }
      str.append("</span>");
      str.append("       </td>");
      if(theRowList.contains("publishDate")){
        str.append("       <td style=\"padding:0 6px;\" width='70' class=\"time\" nowrap=\"nowrap\" class='select'>");//subject 
        str.append(data.createDate);
        str.append("       </td>");
      }
      if(theRowList.contains("type")){
        str.append("             <td style=\"padding:0 6px;\" width='50' nowrap=\"nowrap\" class='select' title='" + data.type + "'>");
        if(data.typeLink){
          str.append("             <a href=\"" + sectionHandler.mergeLink(data.typeLink) + "\">");
        }
        str.append(data.type);
        if(data.typeLink){
          str.append("             </a>");
        }
        str.append("             </td>");
      }
      str.append("      </tr>"); 
      var briefLength = titleLength *4;
      var brief = data.brief;
      if(brief != null && $.trim(brief).length > 0){
        var lastDataPadding = "";
        if(i == datas.length -1){
          lastDataPadding = "padding-bottom:2px;"
        }       
        str.append("      <tr>");
        str.append("       <td colspan=\"" + theRowList.size() + "\" class='color6' style=\"padding-left:6px;"+lastDataPadding+"\">");//brief
        str.append("<div>"+brief.substring(0,briefLength)+"</div>");
        str.append("       </td>");
        str.append("      </tr>");
      }
      str.append("       </table>");
      str.append("       </td>");
      str.append("     </tr>");
      str.append("   </table>");
      str.append("   </td>");
      str.append(" </tr>");
    }
  }else{
    /*for(var i = 0; i < default_row_number; i++) {
      str.append("  <tr>");
      str.append("    <td class=''>&nbsp;</td>");
      str.append("  </tr>");
    }*/
  }
  
  /*if(result.showBottomButton == "true"){
    str.append("  <tr>");
    str.append("    <td class=''>&nbsp;");
    str.append(sectionHandler.showBottomButtons(result.bottomButtons));
    str.append("    </td>");
    str.append("  </tr>");
  }*/
  str.append("</table>");
  return str;
}
/********************************************************************************************************/
/**************************************** 以下是首页栏目的工具脚本 *******************************************/
/********************************************************************************************************/
var sectionHandler = {
	allSections : {},
	
	allSectionPanels : {},
	
	//是否是窄栏目
	isNarrow : function(x, y){
		return sectionWidths[y] < 4;
	},
	
	//当前显示的栏目，存的栏目名称的nodeId  
	currentShowTitleIds : new ArrayList(),
	
	/**
	 * 根据栏目的id: PendingSection刷新所有的栏目
	 */
	reload : function(sectionId, isForce){
		var temp = this.currentShowTitleIds;
		var size = temp.size();
		for(var i = 0; i < size; i++) {
			var titleId = temp.get(i);
			var sectionTitleNode = document.getElementById(titleId);
			if(sectionTitleNode && sectionTitleNode.getAttribute("sectionId").indexOf(sectionId)!=-1){
				try{
					var sectionPanel = sectionHandler.allSectionPanels[sectionTitleNode.getAttribute("panelId")];
					if(isForce != true && sectionPanel.delay =="0"){
						return ;
					}
					portalSectionHander.cancelEdit(sectionTitleNode.getAttribute("panelId"));
					showSection(sectionTitleNode.getAttribute("panelId"), true);
				}
				catch(e){
				}
			}
		}
	},
	realodSection : function(sectionId,param){
		sectionHandler.allSections[sectionId].loadData(param);
	},
	//栏目解析对象
	resolveFunction : new ResolveFunction(),
	/**
	 * 显示底部按钮
	 */
	showBottomButtons : function(bottomButtons,nodeId){
		var str = "&nbsp;";
		if(bottomButtons){
			for(var j = 0; j < bottomButtons.length; j++) {
				var button = bottomButtons[j];
				var labelKey = $.i18n(button.label) || button.label;
				var target = button.target || "";
				if(target=="_self" || target ==""){
					target = "mainFrame";
				}
				var link = button.link || default_link;
				var linkStr = link.split("%");
				//标识从表单业务配置过来的情况，需要通过onClick获得鼠标点击坐标，以显示出现的表单上报框的定位
				if(linkStr.length>0 && linkStr[0]=='FormBizConfig') {
					if(target == "" || target=="_self"){
						str += "&nbsp;<a onClick=\"" + escapeStringToHTML(this.a8Link(linkStr[1])) + "\" >[" + labelKey + "]</a>";
					}else{
						str += "&nbsp;<a onClick=\"" + escapeStringToHTML(this.mergeLink(linkStr[1])) + "\" target=\"" + target + "\">[" + labelKey + "]</a>";
					}
				}else if(linkStr.length>0 && (linkStr[2]=='FormReport' || linkStr[2]=='FormQuery')) {
					//表单的查询或统计的更多链接的处理
			    	str += "&nbsp;<a onClick=\"javascript:openQueryLink('" + this.a8Link(linkStr[0]) + "','" + linkStr[1] + "')\">[" + labelKey + "]</a>";
			  }
				/*else if(labelKey==$.i18n('common_more_label')){
			    str += "&nbsp;<a href=\"javascript:moreSections('" + nodeId+"','"+link+"')\">[" + labelKey + "]</a>";
			  }*/
				else{
					str += "&nbsp;<a onClick=\"" + this.mergeLink(link) +  ";"+this.addBorder()+"\">[" + labelKey + "]</a>";
				}
			}
		}
		return str;
	},
	
	/**
	 * 解析国际化
	 */
	resolveJSI18N : function(subject){
		try{
			var result = subject.match(regExp_JSI18N);
			if(result && result[1]){
				return $.i18n(result[1]);;
			}
		}
		catch(e){
		}
		
		return subject;
	},
	
	convertPortalBodyType :  function(bodyType) {
		var bodyTypeClass = "html_16";
		if("FORM"==bodyType || "20"==bodyType) {
			bodyTypeClass = "form_text_16";
		} else if("TEXT"==bodyType || "30"==bodyType) {
			bodyTypeClass = "txt_16";
		} else if("OfficeWord"==bodyType || "41"==bodyType) {
			bodyTypeClass = "doc_16";
		} else if("OfficeExcel"==bodyType || "42"==bodyType) {
			bodyTypeClass = "xls_16";
		} else if("WpsWord"==bodyType || "43"==bodyType) {
			bodyTypeClass = "wps_16";
		} else if("WpsExcel"==bodyType || "44"==bodyType) {
			bodyTypeClass = "xls2_16";
		} else if("Pdf" == bodyType || "45"==bodyType) {
			bodyTypeClass = "pdf_16";
		} else if("videoConf" == bodyType) {
			bodyTypeClass = "bodyType_videoConf";
		}
		return bodyTypeClass;
	},
	
	/**
	 * 将重要程度、是否有附件、正文类型图标拼凑到标题
	 */
	mergeSubject : function(subject, maxLength, bodyType, importantLevel, hasAttachments, extIcons, extClasses, extPreClasses){
		if(maxLength || maxLength > 0){ 
			maxLength = this.getExpansionLength(maxLength);
			if(hasAttachments == true || hasAttachments == "true"){
				maxLength -= 3;
			}
			if(bodyType && bodyType != "HTML"){
				maxLength -= 3;
			}
			if(importantLevel && importantLevel > 1){
				maxLength -= 3;
			}
			if(extIcons){
				maxLength -= extIcons.length * 2;
			}
			if(extClasses){
				maxLength -=extClasses.length * 2;
			}
			if(extPreClasses){
				maxLength -=extPreClasses.length * 2;
			}
			//maxLength -= 6;
			if(subject.length > maxLength){
		        subject = subject.substring(0,maxLength)+"...";
		      }
		}
    
		subject = subject.escapeHTML();
		
		var str = new StringBuffer();
		//重要程度
		if(importantLevel && importantLevel > 1){
			str.append("<span class='importance_").append(importantLevel).append(" inline-block margin_r_5'></span>");
		}
		//其他定制图标
		if(extPreClasses){
			for(var i=0 ; i < extPreClasses.length; i++){
				str.append("<span class= \" ").append(extPreClasses[i]).append(" margin_r_5\" ></span>");
			}
		}
		//标题
		str.append("<span class='inline-block'>" + subject + "</span>");
		//附件
		str.append("<span class='attachment_table_").append(hasAttachments).append(" inline-block margin_l_5'></span>");
		//str.append("<span class='bodyType_").append(bodyType).append(" inline-block'></span>");
		
		var bodyTypeClass = "";
		if(bodyType != null && bodyType != "HTML") {
			bodyTypeClass = sectionHandler.convertPortalBodyType(bodyType);
			if (bodyTypeClass !="html_16") {
			    str.append("<span class='ico16 ").append(bodyTypeClass).append(" inline-block margin_l_5'></span>");
			}
		}
		//后置图标
		if(extIcons){
			for(var i = 0; i < extIcons.length; i++) {
				str.append("<img src=\"").append(contextPath).append(extIcons[i]).append("\" border='0' align='absmiddle'>");
			}
		}
		//后置图标
		if(extClasses){
			for(var i=0 ; i < extClasses.length; i++){
				str.append("<span class= \" ").append(extClasses[i]).append(" margin_l_5\" ></span>");
			}
		}
		
		return str.toString();
	},
	
	mergeLinkOfOpenType : function(openType, link, titleId){
		if(link.match(regExp1)){
			return link;
		}
		
		if(link.match(regExp)){
			return link;
		}
		switch (openType) {
			case 0: //openWorkSpace
				link = sectionHandler.mergeSubjectLink(link, titleId, "workSpace");
				break;
			case 1: //openWorkSpaceRight
				link = sectionHandler.mergeSubjectLink(link, titleId, "workSpaceRight");
				break;
			case 2 ://href
				var link = sectionHandler.mergeLink(link);
				break;
			case 3 ://href_blank
				//link = "javascript:window.open('" + link + "');"
				var hrefLink = sectionHandler.a8Link(link);
				link = "javascript:openBlank('" + hrefLink + "','workSpaceRight');"
				break;
			default:
				link = sectionHandler.mergeLink(link);
				break;
		}
		
		return link;
	},
	a8Link:function(link){
		return genericURL + link;
	},
	/**
	 * 生产链接：直接链接
	 */
	mergeLink : function(link){
		if(link.match(regExp1)){
			return link;
		}
		
		if(link.match(regExp)){
			return link;
		}
		
		return "javascript:openLink('"+genericURL + link+"')";
	},
	 addBorder : function(){
	    return "getCtpTop().showMainBorder();";
	 },
	/**
	 * 生产标题的链接, 采用弹出式
	 */
	mergeSubjectLink : function(link, titleId, workSpaceType){
		if(link.match(regExp1)){
			return link;
		}
		
		if(link.match(regExp)){
			return link;
		}
		
		link = genericURL + link;
		
		titleId = titleId || "";
		
		if("pendingSection" == titleId || "doneSection" == titleId ||"sentSection" == titleId ||"waitSendSection" == titleId 
		    ||"superviseSection" == titleId || "trackSection" == titleId || "meetingDoneSection" == titleId){
		  return "javascript:_openDlgDetail('" + link + "', '" + titleId + "', '" + workSpaceType + "')";
		}
		return "javascript:openDetail('" + link + "', '" + titleId + "', '" + workSpaceType + "')";
	},
	
	/**
	 * 生产弹出式链接，指定弹出窗口的大小
	 */
	mergeDlgLinkWithCustomSize : function(link, titleId, windowWidth, windowHeight) {
		if(link.match(regExp1)){
			return link;
		}
		
		if(link.match(regExp)){
			return link;
		}		
		titleId = titleId || "";
		
		return "javascript:openDetailInDlg('" + link + "', '" + titleId + "','" + windowWidth + "','" + windowHeight + "')";
	},
	
	widthExpansionScale : null,
	
	//单元格 伸缩比例
	widthExpansion : function(){
		if(this.widthExpansionScale == null){
			var scale = getScreenRect().width / 1024;
			this.widthExpansionScale = scale < 1 ? scale : scale * 1.1;
		}

		return this.widthExpansionScale;
	},
	
	//获得扩展长度
	getExpansionLength : function(len){
		return parseInt(len * this.widthExpansion(), 10);
	},
	
	/**
	 * 显示格式
	 * 1. 当日信息显示为：今日14:29
	 * 2.往日信息显示为：2010-05-12
	 * @param datetime 要显示的时间戳
	 * @param todayFirstTime 今天第一时间的时间戳
	 * @param endtime
	 */
	showDatetime: function(createDate,createDateTime,todayFirstTime){

	  var tomorrow = parseInt(todayFirstTime,10) + 86400000;//明天
    var ttomorrow = tomorrow + 86400000;//后天
    
    if(createDateTime < todayFirstTime || createDateTime > ttomorrow){
      createDate = createDate.substring(0,10);
    }else if(createDateTime < tomorrow){
      createDate = $.i18n("calendar_today") + (createDate.substring(11,16));
    }else{
      createDate = $.i18n("calendar_tomorrow") + (createDate.substring(11,16));
    }
  
    return createDate;
	},
	is_space_reload:false,
	reloadSpace : function(){
		if(!sectionHandler.is_space_reload){
			is_space_reload = true;
			document.location.href = document.location.href;
		}
	},
	//左移动 显示一个页签。
	leftMove:function(containerId,sectionId){
		var section = sectionHandler.allSections[sectionId];
		var container = document.getElementById(containerId);
		var  currnetPanel = container.getAttribute("currentPanel");
		var allWidth = container.getAttribute("allPanelWidth");
		var widths = allWidth.split(",");
		currnetPanel = (parseInt(currnetPanel)+1) ;
		if(currnetPanel >= widths.length){
			return;
		}
		var leftMar = widths[currnetPanel];
		var px = (container.style.marginLeft+"").split("px")
		var left = (parseInt( px[0]?px[0]:0)-parseInt(leftMar))+"px";
		container.style.marginLeft = left;
		container.setAttribute("currentPanel",currnetPanel);
	},
	//右移动 多显示一个页签
	rightMove:function(containerId,sectionId){
		var section = sectionHandler.allSections[sectionId];
		var container = document.getElementById(containerId);
		var  currnetPanel = container.getAttribute("currentPanel");
		var allWidth = container.getAttribute("allPanelWidth");
		var widths = allWidth.split(",");
		
		var px = (container.style.marginLeft+"").split("px");
		if(parseInt( px[0]?px[0]:0) >=0){
			return;
		}
		currnetPanel = (parseInt(currnetPanel)-1) ;
		var leftMar = widths[currnetPanel];
		var right = (parseInt( px[0]?px[0]:0)+parseInt(leftMar));
		if(right >0){
			right = 0;
		}
		container.style.marginLeft = right+"px";
		container.setAttribute("currentPanel",currnetPanel);
	},
	//得到栏目的宽度。是栏目左边框和右边框决定的
	getSectionWidth:function(sectionId){
		var section = sectionHandler.allSections[sectionId];
		if(section){
			var left = document.getElementById("section_show"+ section.nodeId);
			var right = document.getElementById("show_edit_div"+ section.id);
			var nameTotalDiv = document.getElementById("section_name_total"+ section.nodeId);
			var nameLength = 0;
			if(nameTotalDiv && nameTotalDiv.innerText){
				nameLength = (nameTotalDiv.innerText.length+3)*14;
			}
			if(left && right){
				return v3x.getElementPosition(right).x - v3x.getElementPosition(left).x -nameLength;
			}
		}
		return 0;
	},
	showPanels : function(panels,sectionId){
		var result = "";
		if(panels){
			 function getPanelWidth(panelName){
			 	var ll = 0;
			 	//添加扩展的
			 	var byteLength = panelName.getBytesLength();
			 	for(var i =0;i < byteLength;i++){
			 		if (panelName.charCodeAt(i) > 255){
			 			ll ++;
			 		}else{
			 			ll +=0.5;
			 		}
			 	}
			 	return ll * 6+ 50;
			 }
			 
			/**
			 * 页签滚动的思路：
			 * 如果是窄栏目，不显示页签
			 * 
			 * 1.判断页签的总宽度panelTotalWidth 是否超过Section的宽度sectionWidth。
			 *    if(panelTotalWidth > sectionWidth)
			 *    	显示两边的按钮。
			 * 2.显示页签也是很有讲究的
			 *	
			 */
			 var section = sectionHandler.allSections[sectionId];
			 var sectionWidth = sectionWidths[section.y];
			 if(sectionWidth < 4) return "";
			 
			 //计算页签总宽度
			 var panelStr = "";
			 var totalLength = 0;
			 var allPanelWidthStr = "";
			 for(var i = 0 ; i < panels.length;i++){
			 	var sel = "";
				var panelId = panels[i].get("panelId");
				if(section.currentPanel){
					if( section.currentPanel ==panelId){
						sel = "-sel";
					}
				}else{
					if(i ==0){
						sel = "-sel";
					}
				}
				var panelName = ($.i18n(panels[i].get("subject"))||panels[i].get("subject"));
				var showName = panelName;
				panelName = panelName;
				panelStr +="<div class=\"portal-tab-tag-left"+sel+"\" id='"+sectionId+"_"+panelId+"_left'></div>";
				panelStr +="<div class=\"portal-tab-tag-middel"+sel+" cursor-hand\" title="+showName+" id='"+sectionId+"_"+panelId+"_center' onclick=\"sectionHandler.reloadPanelSection('"+sectionId+"','"+panelId+"')\">"+panelName+"</div>";
				panelStr +="<div class=\"portal-tab-tag-right"+sel+"\" id='"+sectionId+"_"+panelId+"_right'></div>";
			 	var panelWidth = getPanelWidth(panelName);
			 	
			 	panels[i].put("width",panelWidth);
			 	totalLength +=panelWidth;
			 	if(i !=0){
			 		allPanelWidthStr +=',';
			 	}
			 	allPanelWidthStr += panelWidth+"";
			 }
			 var sect = sectionHandler.getSectionWidth(sectionId);
			 
			 if(sect < totalLength){
			 	var length4panel = 0;
			 	var currentPanel = 0;
			 	for(var i = 0 ; i < panels.length;i++){
			 	 	var pW = parseInt(panels[i].get("width"));
			 	 	if(length4panel + pW +20>(sect)){
			 	 		currentPanel = i-1;
			 	 		break;
			 	 	}
			 	 	length4panel += pW;
			 	}
			 	result+= "<table width='"+sect+"' height='100%' style='' >";
				result+= "<tr><td width='10px'><div class='panel-2-left' onclick=\"sectionHandler.rightMove('panel_div_container_"+sectionId+"','"+sectionId+"')\">&nbsp;&nbsp;</div>";
				// 添加左边的
				result+= "</td><td nowrap='nowrap' width='"+(length4panel)+"' align='center' style='white-space:nowrap;overflow-x: hidden;'>";
				result+="<div class='panel_tab_div' allPanelWidth=\""+allPanelWidthStr+"\" currentPanel=\""+currentPanel+"\" id='panel_div_container_"+sectionId+"' style='white-space:nowrap;overflow: hidden; height: 26px; line-height: 26px; text-align: left;'>";
				result += panelStr;
				result += "</div>";
				result+= "</td><td width='10px' ><div class='panel-2-right' onclick=\"sectionHandler.leftMove('panel_div_container_"+sectionId+"','"+sectionId+"')\">&nbsp;&nbsp;</div>";
				// 添加右边的
				result+="</td></tr>";
				result+="</table>";
			 } else {
			 	result +=panelStr;
			 }
		}
		return result;
	},
	reloadPanelSection:function(sectionId,panelId){
		var section = sectionHandler.allSections[sectionId];
		if(section){
			var panels = section.panels;
			section.currentPanel =panelId;
			section.currentPage=0;
			for(var i = 0 ; i < panels.length;i++){
				var divId = sectionId+"_"+panels[i].get("panelId")+"_";
				var sel = "-sel";
				if(panelId != panels[i].get("panelId")){
					sel = "";
				}
				document.getElementById(divId+"left").className = "portal-tab-tag-left"+sel;
				document.getElementById(divId+"center").className = "portal-tab-tag-middel"+sel;
				document.getElementById(divId+"right").className = "portal-tab-tag-right"+sel;
			}
			setTimeout("sectionHandler.realodSection(\""+sectionId+"\")",10);
		}
	},
	loadResource : function(sourceList){
		if(sourceList && sourceList.length >0){
			for(var i = 0 ; i <sourceList.length;i++){
				var source = sourceList[i];
				var id = source.get("id");
				if(document.getElementById(id)){
					return;
				}
				var url = _ctxPath + source.get("url");
				
				if(source.get("type") =="JS"){
					var link = document.createElement("script");
					link.language = "javascript";
					link.type = "text/javascript";
					link.id = id;
					link.src = url;
					link.charset = "UTF-8";
					document.getElementsByTagName("head")[0].appendChild(link);
				}else if(source.get("type") == "CSS"){
					var link = document.createElement("link");
					link.rel = "stylesheet";
					link.type = "text/css";
					link.id = id;
					link.href = url;
					document.getElementsByTagName("head")[0].appendChild(link);
				}
			}
		}
	},
	getAllNodeIds: function(){
		var allPanels = sectionHandler.allSectionPanels;
		var ids = new Array();
		for(var id in allPanels){
			var panel = sectionHandler.allSectionPanels[id];
			var nodeId = panel.nodeId;
			if(ids.indexOf(nodeId)<0){
				ids[ids.length] = nodeId;
			}
		}
		return ids;
	},
	checkEditSection:function(){
		var allPanels = sectionHandler.allSectionPanels;
		for(var id in allPanels){
			var panel = sectionHandler.allSectionPanels[id];
			var nodeId = panel.nodeId;
			if($("#editDiv"+nodeId).children().length>0){
				$("#editDiv"+nodeId).focus();
				$.alert($.i18n("section.needsave.label"));
				return false;
			}
		}
	}
}

/******************************************************************************************************/
/******************************************* 以下是各应用的脚本 ******************************************/
/******************************************************************************************************/
function openBlank(link,workSpaceType){
	var openArgs = {};
	openArgs["url"] = link;
	openArgs["dialogType"] = "open";
	openArgs["resizable"] = "yes";
	openArgs[workSpaceType] = "yes";
	if(link.indexOf("linkSystemController") != -1){
		openArgs["closePrevious"] = "no";
	}
	var rv = v3x.openWindow(openArgs);
}
function openDetail(link, sectionId, workSpaceType) {
  var openArgs = {};
  openArgs["url"] = link;
  openArgs[workSpaceType] = "yes";
  if(v3x.getBrowserFlag('sectionOpenDetail') == false){
    openArgs["dialogType"] = "open";
  }
  
    var rv = v3x.openWindow(openArgs);
  if(!rv){
    if(sectionId.indexOf("pendingSection") != -1 && link.indexOf("inquirybasic.do?method=showInquiryFrame") != -1){
      sectionHandler.reload(sectionId, true);
    }
    return;
  }
  if((typeof rv == "string" && rv == "true") || (typeof rv == "boolean" && rv == true)){
    if(sectionId){
        sectionHandler.reload(sectionId, true);
      }
  }
}
var sectionOpenDetailDialog;
function _openDlgDetail(link, sectionId, workSpaceType) {
	sectionOpenDetailDialog = $.dialog({
		title : " ",
		width: $(getCtpTop().document).width() - 100,
    height: $(getCtpTop().document).height() - 50,
    url : link,
    id:'dialogDealColl',
		targetWindow:getCtpTop(),
		transParams:{
		  sectionId:sectionId,
		  callback:sectionCloseAndFresh,
		  callbackOfPendingSection:sectionCloseAndFresh,
		  pwindow:window
		  },
		closeParam: {
      'show':true, 
      autoClose:false, 
      handler:function(){
        sectionOpenDetailDialog.close();
      }
    }
	});
}

function sectionCloseAndFresh(sectionId){
  sectionOpenDetailDialog.close();
    sectionHandler.reload(sectionId,true);
}
var dealCollDialog;
function _collOpenDetail(link,title,openType,_iframeSectionId,_selectChartId,_dataNameTemp) {
  if(openType == '2') {
    openLink(link);
  } else {
    var _url = _ctxPath+link;
    var width = $(getCtpTop().document).width() - 60;
    var height = $(getCtpTop().document).height() - 50;
    dealCollDialog = $.dialog({
          url: _url,
          width: width,
          height: height,
          title: title,
          id:'dialogDealColl',
          targetWindow:getCtpTop(),
          transParams:{
          	sectionId:'pendingSection',
          	callbackOfPendingSection:_collCloseAndFresh,
          	callback:_collCloseAndFresh,
          	iframeSectionId:_iframeSectionId,
          	selectChartId:_selectChartId,
          	dataNameTemp:_dataNameTemp,
          	pwindow:window
          },
        closeParam: {
              'show':true, 
              autoClose:false, 
              handler:function(){
            	  if(link.indexOf("inquirybasic.do?method=showInquiryFrame") != -1){
                      sectionHandler.reload("pendingSection", true);
                    }
            	  dealCollDialog.close();
            }
          }
      });
  }
}
function _collCloseAndFresh(ifsectionId,selectChartId,dataNameTemp){
	var iframeObj;
	$("iframe[name = 'IframeSectionTemplete']").each(function(i,obj){
		if($(obj).attr("sectionId")==ifsectionId){
			iframeObj = obj;
		}
	});
	if(iframeObj&&dataNameTemp!=""){
		var iframeObjTemp = iframeObj.contentWindow;
		if(iframeObjTemp){
			iframeObjTemp.initChart(selectChartId);
			iframeObjTemp.showLeftList(dataNameTemp,selectChartId);
		}
	}else{
	    sectionHandler.reload("pendingSection",true);
	}
	dealCollDialog.close();
}
function openLink(link){
	setTimeout(function() {getCtpTop().main.location.href = link;
	/**
	 *TODO：增加页面缓存时修改 
	 */
	//getCtpTop().showContentPage();
	},0);
}
/**
 * 用于表单查询统计的更多链接
 */
function openQueryLink(link, param){
	setTimeout(function() {getCtpTop().main.location.href = link + encodeURIComponent(param);
	/**
   *TODO：增加页面缓存时修改 
   */
	//getCtpTop().showContentPage();
	},0);
}
/**
 * 弹出窗口的打开链接
 */
function openSubjectDetail(link, sectionId){
	link = genericURL + link;
	openDetail(link, sectionId, "workSpace");
}

/**
 * 打开RSS的链接
 */
function openRSSURL(url,channelId,channelItemId){
    var requestCaller = new XMLHttpRequestCaller(this, "ajaxRssManagerController", "markReaded", false);
    requestCaller.addParameter(1, "Long", channelId);
    requestCaller.addParameter(2, "Long", channelItemId);
    requestCaller.needCheckLogin = true;
    var result = requestCaller.serviceRequest();
	window.open(url);
}

/**
 * 直接超链
 */
function hrefSubjectDetail(link){
	getCtpTop().contentFrame.LeftRightFrameSet.cols="0,*";
	setTimeout(function() {getCtpTop().contentFrame.mainFrame.location.href = genericURL + link},0);
}

/**
 * 检测模板是否存在或有权限调用
 */
function callTemplete(link, templeteId){
	//校验模板是否存在
	var requestCaller = new XMLHttpRequestCaller(this, "ajaxTempleteManager", "checkTempleteIsExist", false);
	requestCaller.addParameter(1, "long", templeteId);
	requestCaller.needCheckLogin = true;
	var result = requestCaller.serviceRequest();
	if(result == "false"){
		alert(_("MainLang.templete_alertNotExist"));
		sectionHandler.reload("templeteSection", true);    			
		return;
	}
	
	getCtpTop().contentFrame.mainFrame.location.href = genericURL + link;
}

/**
 * 日程事件----Dialog方式打开页面
 */
var dialogCalendarSure;
var dialogCalendarUpdate;

function dialogClose(id,reloadDate,setionID) {
  if(id=="hasError"){
    dialogCalendarSure.enabledBtn("sure");
  }else{
      if (id == -1) {
        dialogCalendarSure.close();   
      } else {
        dialogCalendarUpdate.close();
      }
      if(reloadDate == 'true'){
        sectionHandler.reload(setionID,true);
      }
      if(parent.timeLineObj){
        setTimeout("getCtpTop().timeLineObjReset(getCtpTop().timeLineObj)",0);
      }
 }
}

function showBtn() {
  dialogCalendarUpdate.showBtn("sure");
  dialogCalendarUpdate.hideBtn("update");
}
/**
 * 
 * @param id 当前事件ID
 * @param shareType 共享类型
 * @param receiveMemberId 共享人员ID
 * @param isHasUpdate 是否具有修改权限
 * @return
 */
function openCalEvent(id,shareType,receiveMemberId,isHasUpdate,sectionID){
  var res = parent.accessManagerData(id ,"event");
  var isReceiveMember = false;
  var receiveList  = receiveMemberId.split(",");
  for(var i=0;i<receiveList.length;i++){
      receiveList[i] = receiveList[i].substring(7);
      if(receiveList[i]==$.ctx.CurrentUser.id){
          isReceiveMember=true;
      }
  }
  if (res != null && res != "") {
    $.alert({
      'msg' : res,
      ok_fn : function() {
        sectionHandler.reload(sectionID,true);
      }
    });
  }else{
      var height = 600;
      if (shareType == 1 && receiveMemberId == "null") {
        height = 500;
      }
      dialogCalendarUpdate = $.dialog({
        url : _ctxPath
            + '/calendar/calEvent.do?method=editCalEvent&id='
            + id,
        width : 600,
        height : height,
        targetWindow : getCtpTop(),
        checkMax:true,
        transParams : {
        diaClose : dialogClose,
          showButton : showBtn,
          isview : "true",
          sectionID : sectionID
        },
        title : $.i18n('calendar.event.search.title'),
        buttons : [ {
          id : "sure",
          text : $.i18n('common.button.ok.label'),
          handler : function() {
          dialogCalendarUpdate.getReturnValue();
          }
        }, {
          id : "update",
          text : $.i18n('common.button.modify.label'),
          handler : function() {
          dialogCalendarUpdate.getReturnValue("update");
          }
        }, {
          id : "cancel",
          text : $.i18n('common.button.cancel.label'),
          handler : function() {
          dialogCalendarUpdate.close();
          }
        },
      {
        id : "btnClose",
        text : $.i18n('calendar.close'),
        handler : function() {
          dialogCalendarUpdate.close();
        }
      } ]
      });
      dialogCalendarUpdate.hideBtn("sure");
      dialogCalendarUpdate.hideBtn("btnClose");
      dialogCalendarUpdate.hideBtn("update");
      dialogCalendarUpdate.hideBtn("cancel");
      if (isHasUpdate == "false"&&(isReceiveMember=="false"||isReceiveMember==false)) {
        dialogCalendarUpdate.showBtn("btnClose");
      }else{
        dialogCalendarUpdate.showBtn("update");
        dialogCalendarUpdate.showBtn("cancel");
      }
  }
}

/**
 * 计划回复人数详情
 */
var replyCard,planReplyObj;
function showPlanReplyDetail(planId,entityId){
  //Type: M:myplan  O:othersPlan D:departmentPlan
  var url = _ctxPath+"/plan/plan.do?method=showReplyDetail&entityId="+entityId+"&planId="+planId;
  if (replyCard) replyCard.close();
  planReplyObj = $("#P_"+entityId+"_"+ planId);
    replyCard = $.dialog({
      id:"replyDetailDialog",
        width: 239,
        height: 188,
        type: 'panel',
        targetId:"P_"+entityId+"_"+ planId,
        url: url,
        checkMax:true,
        shadow:false,
      panelParam:{
        'show':false,
        'margins':false
      }
    });
}

function mouseOutOfReply(){
  if (replyCard) {
        var dialog = $("#" + replyCard.id);
        mouseBind(dialog, planReplyObj, replyCard, "replyDetailDialog");
   }
}


/**
 * 控制大小的弹出窗口，如：日程事件的标题连接
 */
function openDetailInDlg(link, sectionId, windowWidth, windowHeight) {
	link = genericURL + link + "&random="+parseInt(Math.random()*10000);
	if(v3x.getBrowserFlag('OpenDivWindow')){
	    var rv = getCtpTop().v3x.openWindow({
	        url: link,
	        width: windowWidth,
	        height: windowHeight,
	        scrollbars:"no"
	    });
	    if(!rv){
			return;
		}
		if((typeof rv=="string" && rv=="true") || (typeof rv=="boolean" && rv==true)){
			if(sectionId){
				sectionHandler.reload(sectionId, true);    			
	    	}
		}
	}else{
	  var win_openDetailInDlg = new MxtWindow({
		    id: '2',
		    title: '',
		    url: link,
		    width: windowWidth,
		    height: windowHeight,
			type:'window',
			isDrag:false,
		    buttons: [{
				id:'btn1',
		        text: _("MainLang.okbtn"),
		        handler: function(){
		    		var rv = win_openDetailInDlg.getReturnValue();
	        	}
		    }, {
				id:'btn2',
		        text: _("MainLang.cancelbtn"),
		        handler: function(){
		    		win_openDetailInDlg.close();
		        }
		    }]

		});
	}
}
/**
 * 日程事件：修改事件
 */
function openDialogCalEventState(id,sectionID){
  dialogCalendarUpdate = $.dialog({
      url : _ctxPath
          + '/calendar/calEvent.do?method=openDialogCalEventState&id='
          + id,
      width : 300,
      height : 120,
      targetWindow : getCtpTop(),
      checkMax:true,
      title :  $.i18n('calendar.completion'),
      buttons : [ {
        id : "sure",
        text : $.i18n('common.button.ok.label'),
        handler : function() {
        var fValidate = dialogCalendarUpdate.getReturnValue();
        if(fValidate){
        sectionHandler.reload(sectionID,true);
          dialogCalendarUpdate.close();
        }
        }
      }, {
        id : "cancel",
        text : $.i18n('common.button.cancel.label'),
        handler : function() {
        dialogCalendarUpdate.close();
        }
      } ]
    });
}
/**
 * 日程事件：新建事件
 */
function newCalEvent(sectionID){
  dialogCalendarSure = $
  .dialog({
	id:"dialogCalEventAdd",
    url : _ctxPath
        + '/calendar/calEvent.do?method=createCalEvent',
    width : 600,
    height : 480,
    targetWindow : getCtpTop(),
    checkMax:true,
    transParams : {
      diaClose : dialogClose,
      isview : "true",
      sectionID :sectionID
    },
    title : $.i18n('calendar.event.view.add'),
    buttons : [
        {
          id : "sure",
          text : $.i18n('common.button.ok.label'),
          handler : function() {
            var isFalse = dialogCalendarSure.getReturnValue();
            if(isFalse){
              dialogCalendarSure.disabledBtn("sure");
            }
          }
        },
        {
          id : "cancel",
          text : $.i18n('common.button.cancel.label'),
          handler : function() {
          dialogCalendarSure
                .close();
          }
        } ]
  });
}
/******计划方法*********/
function openPlan(planId,sectionId){
   var toSrc = _ctxPath+"/plan/plan.do?method=initPlanDetailFrame&planId="+planId;
   var planViewdialog=$.dialog({
        id: 'showPlan',
        url: toSrc,
        width: $(getCtpTop().document).width() - 100,
        height: $(getCtpTop().document).height() - 100,
        title: $.i18n('plan.dialog.showPlanTitle'),
        closeParam:{
          'show':true,
          handler:function(){
            var rv = planViewdialog.getReturnValue();
            planViewdialog.close();
            if(rv!=="view"){
                sectionHandler.reload(sectionId,true);
            }
          }
        },
        targetWindow:getCtpTop(),
        buttons: [{
            text: $.i18n('plan.dialog.close'),
            handler: function () {
        		var rv = planViewdialog.getReturnValue();
        		planViewdialog.close();
        		if(rv!=="view"){
		            sectionHandler.reload(sectionId,true);
        		}
            }
        }]
     });
}
function changePlanStatus(planId,sectionId){
  var src = _ctxPath+"/plan/plan.do?method=showChangeStatusPage&planId="+planId;
  var statusDialog = $.dialog({
    id: 'changePlanDialog',
        url: src,
        width: 280,
        height: 180,
        title: $.i18n('plan.dialog.changeStatus'),
        targetWindow:getCtpTop(),
        buttons: [
           {
              id : "sure",
              text : $.i18n('common.button.ok.label'),
              handler : function() {
                    var rv = statusDialog.getReturnValue();
                    if(!!rv){
	                    statusDialog.close();
	                    sectionHandler.reload(sectionId,true);
                    }
                  }
              },
            {
                id : "cancel",
                text : $.i18n('common.button.cancel.label'),
                handler : function() {
                        statusDialog.close();
                      }
            } 
        ]
  });
}
/******计划方法结束*********/
function openDeeSectionMore(link){
	getCtpTop().startProc();
	getCtpTop().contentFrame.mainFrame.location.href = genericURL+link;
	getCtpTop().showContentPage();
}
function openNCPending(id, a, b){
	try{
		//刷新NC待办事项
		this.onfocus = function(){
			sectionHandler.reload("NCPendingSection",true);
			window.onfocus = function(){};
		};
		getCtpTop().openNCPending(id, a, b);
	}
	catch(e){
		//alert(e.message)
	}
}
function folderOpenFunById(id,frType){
	location.href = _ctxPath+"/doc.do?method=docHomepageIndex&docResId=" + id + "&frType=" + frType + "&t="+new Date();
}
/**
 * 查看文档 验证权限
 */
function openDocLink(link,all,edit,add,readonly,browse,list){
//	if(!hasOpenAcl(all,edit,add,readonly,browse,list)){
//		return;
//	}
	openDetail(genericURL+link,'docFolderSection','workSpace')
}

function hasOpenAcl(all,edit,add,readonly,browse,list){
 	if('true' == all || 'true' == edit || 'true' == readonly || 'true' == browse)
 		return true;
 	else{
 		alert($.i18n('doc_open_no_acl_alert'))
 		return false;
 	}
 } 
function showErrorMessage(messageLabel){
 	if(messageLabel){
	 	var message = $.i18n(messageLabel) || messageLabel;
 		alert(message);
 	}
}
function batchPending(x,y){
	var data = document.getElementsByName("data_"+x+"_"+y);
	if(data && data.length >0){
		var process = new BatchProcess();
		for(var i = 0 ; i < data.length;i++){
			var d = data[i];
			var affairId = d.value;
			var subject = d.getAttribute("subject");
			var colId = d.getAttribute("objectId");
			var app =  d.getAttribute("category")||"1";
			process.addData(affairId,colId,app,subject);
		}
		process.doBatch("sectionHandler.reload('pendingSection'); ");
	}else{
		alert("没有合适的数据");
	}
}

/******月历式栏目-开始******/
function HS_calender(now, allEvents){
	var lis = "";
	var nowStr = now.getFullYear() + "-" + now.getMonth() + "-01";
	var lastMonthDate = WeekDay(nowStr);
	var lastMonthEndDate = HS_DateAdd("d", "-1", nowStr).getDate();
	var thisMonthLastDate = HS_DateAdd("d", "-1", now.getFullYear() + "-" + (parseInt(now.getMonth()) + 1).toString() + "-01");
	var thisMonthEndDate = thisMonthLastDate.getDate();
	var thisMonthEndDay = thisMonthLastDate.getDay();
	var todayObj = new Date();
	var today = todayObj.getFullYear() + "-" + todayObj.getMonth() + "-" + todayObj.getDate();
	
	var count = 0;
	for(var i = 0; i < lastMonthDate; i ++){ //上一个月的日期
		lis = "<td class='lastMonthDate border-right border-bottom'>" + lastMonthEndDate + "</td>\n" + lis;
		lastMonthEndDate --;
		if(count ++ % 7 == 6){
			lis += "</tr>\n<tr class='calenderBody'>\n";
		}
	}
	
	for(var i = 1; i <= thisMonthEndDate; i ++){ //本月的日期
		var isToday = today == now.getFullYear() + "-" + now.getMonth() + "-" + i;
		
		var currentMonth = now.getMonth() + 1;
		if(currentMonth < 10){
			currentMonth = "0" + currentMonth;
		}
		var currentDay = i;
		if(currentDay < 10){
			currentDay = "0" + currentDay;
		}
		var currentDate = now.getFullYear() + "-" + currentMonth + "-" + currentDay;
		
		var content = "";
		var events = allEvents.currentDate;
		var hasEvent = events != null;
		if(hasEvent){
			content = events.join("\n");
		}
		
		if(hasEvent){
			lis += "<td class='today-" + isToday + " "  + " hasEvent-" + hasEvent + " border-right border-bottom' title='"+ content +"' " + 
				"onclick=\"javascript:openLink('" + getCtpTop().contentFrame.topFrame.calEventURL + "?method=day&selectedDate=" + currentDate + "');\" >" + i + "</td>\n";
		}else{
			lis += "<td class='today-" + isToday + " "  + " hasEvent-" + hasEvent + " border-right border-bottom' title='"+ content +"'>" + i + "</td>\n";		
		}
		
		if(count ++ % 7 == 6){
			lis += "</tr>\n<tr class='calenderBody'>\n";
		}
	}
	
	var j = 1;
	for (var i = thisMonthEndDay; i < 6; i ++){ //下一个月的日期
		lis += "<td class='nextMonthDate border-right border-bottom'>" + j + "</td>\n";
		j++;
		if(count ++ % 7 == 6){
			lis += "</tr>\n<tr class='calenderBody'>\n";
		}
	}
	
	var CalenderBox = "<table  width=\"100%\" height=\"208\" style=\"border-left: 1px #cdcdcd solid;\" cellspacing=\"0\" cellpadding=\"0\">\n" + 
		"<tr class='calenderHeader'>\n" + 
		"<td class='border-right border-bottom'>" + $.i18n("calendar_weeks0") + "</td>\n" + 
		"<td class='border-right border-bottom'>" + $.i18n("calendar_weeks1") + "</td>\n" + 
		"<td class='border-right border-bottom'>" + $.i18n("calendar_weeks2") + "</td>\n" + 
		"<td class='border-right border-bottom'>" + $.i18n("calendar_weeks3") + "</td>\n" + 
		"<td class='border-right border-bottom'>" + $.i18n("calendar_weeks4") + "</td>\n" + 
		"<td class='border-right border-bottom'>" + $.i18n("calendar_weeks5") + "</td>\n" + 
		"<td class='border-right border-bottom'>" + $.i18n("calendar_weeks6") + "</td>\n" + 
		"</tr>\n" + 
		"<tr class='calenderBody'>" + lis + "</tr>\n" + 
		"</table>";
	
	return CalenderBox;
}

function HS_DateAdd(interval, number, date){
	number = parseInt(number);
	if (typeof(date) == "string"){
		var date = new Date(date.split("-")[0],date.split("-")[1],date.split("-")[2])
	}
	if (typeof(date) == "object"){
		var date = date
	}
	switch(interval){
		case "y":
			return new Date(date.getFullYear() + number, date.getMonth(), date.getDate());
			break;
		case "m":
			return new Date(date.getFullYear(), date.getMonth() + number, checkDate(date.getFullYear(), date.getMonth() + number, date.getDate()));
			break;
		case "d":
			return new Date(date.getFullYear(), date.getMonth(), date.getDate() + number);
			break;
		case "w":
			return new Date(date.getFullYear(), date.getMonth(), 7 * number + date.getDate());
			break;
	}
}

function checkDate(year, month, date){
	var returnDate = "";
	var enddate = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];
	if(year % 4 == 0){
		enddate[1] = "29";
	}
	if(date > enddate[month]){
		returnDate = enddate[month];
	}else{
		returnDate = date;
	}
	return returnDate;
}

function WeekDay(date){
	var theDate;
	if (typeof(date) == "string"){
		var str = date.split("-");
		theDate = new Date(str[0], str[1], str[2]);
	}
	if (typeof(date) == "object"){
		theDate = date;
	}
	return theDate.getDay();
}
/******月历式栏目-结束******/

/******关联项目开始***********/
var projectDetailDialog,projectObj;
function showProjectDetail(tableId,projectId){
	projectObj = $('#chess_'+tableId);
	projectDetailDialog = $.dialog({
			id:'projectDetailDialog',
		    width:200,
		    height:100,
		    type: 'panel',
		    url: _ctxPath+'/project.do?method=showProjectDetail&projectId='+projectId,
		    targetId: 'chess_'+tableId,
			shadow:false,
			panelParam:{
				'show':false,
				'margins': false,
				'inside':true
			}
		});
}
function closeProjectDetailDialog(){
	if (projectDetailDialog) {
        var dialog = $("#" + projectDetailDialog.id);
        mouseBind(dialog, projectObj, projectDetailDialog, "projectDetailDialog");
   }
	
}
/******关联项目结束***********/

