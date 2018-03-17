var _parent = null;
var currentEntityId = null;
var docSection = "docFolderSection"; //指定文档夹栏目，部分地方需要特殊处理
var currentSpaceType = "personal";
var formReportSection = "singleBoardFormReportResultTableSection";
var formReportChartSection = "singleBoardFormReportResultChartSection";
function addFragment(div,y,x,width,ids,names,singleBoards){
	var div = document.getElementById(div);
	if(div){
		//加载参数
		var allId = "";
		for(var i =0;i< ids.length;i++){
			if(i!=0){
				allId +=",";
			}
			allId += ids[i];
		}
		var loadParams = loadParam(allId);
		var column = div.parentNode;
		var next = div.nextSibling;
		var cacheDiv = new ArrayList();
		while(next){
			cacheDiv.add(div.nextSibling.innerHTML);
			div.parentNode.removeChild(div.nextSibling);
			next = div.nextSibling;
		}
		var cacheFragment = fragments[y];
		fragments[y] = [];
		
		function getExistHTML(sectionId,singleBoardId,alls){
			if(!alls)return null;
			for(var j = 0 ; j < alls.length;j++){
				if(alls[j]){
					var secions = alls[j].properties.get("sections");
					if(secions == sectionId){
						if(singleBoardId){
							var bord = alls[j].properties.get("singleBoardId:0");
							if(bord != singleBoardId){
								continue;
							}
						}
						var html = cacheDiv.get(j);
						if(html){
							return [html,alls[j]];
						}
					}
				}
			}
			return null;
		}
		
		for(var i = 0 ; i<ids.length;i++){
			var x = i;
			var existFrag = getExistHTML(ids[i],singleBoards[i],cacheFragment);
			var html = "";
			if(existFrag){
				existFrag.x = x;
				fragments[y][x] = existFrag[1];
				html = existFrag[0];
			}else{
				var prop = new Properties();
				prop.put("sections",ids[i]);
				prop.put("columnsName:0", names[i]);
				prop.put("showtitleName:0", names[i]);
				if(singleBoards[i] != ""){
					prop.put("singleBoardId:0" , singleBoards[i]);
				}
				else{
					prop.put("singleBoardId:0", "");
				}
				var fraId = "new_"+x+"_"+y;
				var fragment = new Fragment(fraId,x,y,[names[i]],prop);
				
				fragments[y][x] = fragment;
				html = fragments[y][x].toNewTable(width,true);
			}
			
			//TODO 先不判断是否可以编辑
			var newDiv = document.createElement("div");
			column.appendChild(newDiv);
			
			newDiv.id=fragments[y][x].id+"_allDiv";
			newDiv.className ="portal-layout-cell cell-edit";
			newDiv.innerHTML = html;
			newDiv.style.cursor = "pointer";
		}
		sortFragment(div);
	}
	portalSectionHander.evalMethodAfterToHTML();
}
function sortFragment(div){
	var column = div.nextSibling;
	var i = 0;
	while(column){
		var first = column.firstChild;
		if(first){
			var fragmentId = first.getAttribute("fragmentId");
			var fragment = getFragmentById(fragmentId);
			if(fragment){
				fragment.x =i;
				document.getElementById("X_"+fragmentId).value = i;
				i++;
			}
		}
		column = column.nextSibling;
	}
}
function removeFragment(fragmentId,x,y){
	var table = document.getElementById("Table_"+fragmentId);
	fragments[y].splice(parseInt(x),parseInt(x));
	var cell = table.parentNode;
	var column = cell.parentNode;
	column.removeChild(cell);
	sortFragment(column.firstChild);
}
String.prototype.startWith = function(str){
	if(str==null||str==""||this.length==0||str.length>this.length){
		return false;
	}
	return this.substr(0,str.length)==str;
}
function selectPortlet(entityId, x, y, width,columnAdd,single) {
	if(document.getElementById("toDefault").value == "true"){
		return false;
	}
	var spaceType = document.getElementById("type").value;
	currentSpaceType = spaceType;
	var count = 0;
	if(columnAdd){
		count = -1;
	}
	var showBanner = false;
	if(single){
		count = 1;
		if(x == 0){
			showBanner = true;
		}
	}
 	var returnval = v3x.openWindow({
			url : spacePortalURL + "&method=portletSelector&entityId=" + entityId + "&spaceType=" + spaceType + "&x=" + x + "&y=" + y + "&width=" + width+"&count="+count+"&showBanner="+showBanner+"&single="+single,
			width : "630",
			height : "460",
			scrollbars : "false"
		});
	if(returnval){
		var ids = arrayToArray(returnval[0]); //SectionIds
		var names = arrayToArray(returnval[1]); //SectionNames
		var singleBoards = arrayToArray(returnval[2]); //SingleBoards
		if(columnAdd){
			addFragment(entityId,y,x,width,ids,names,singleBoards);
			return ;
		}
		var sectionObj = document.getElementById("S_" + entityId);
		var contentTD = document.getElementById("Content" + entityId+"_continer");
		if(sectionObj){
			var fragment = fragments[y][x];
			fragment.names = names;
			var props = fragment.properties;
			props.put("sections",ids[0]);
			props.put("columnsName:0", names[0]);
			props.put("showtitleName:0", names[0]);
			if(singleBoards[i] != ""){
				props.put("singleBoardId:0", singleBoards[0]);
			}
			else{
				props.put("singleBoardId:0", "");
			}
			
			var oldSectionsValue = sectionObj.value;
			sectionObj.value = ids.join(","); //更改Fragment栏目值
			var innerStr = "";
			var widthTemp = 100/ids.length+'%';
			for(var i=0; i<ids.length; i++){
				//栏目未更改
				var oldIndex = indexOfSections(ids[i], oldSectionsValue, singleBoards[i], props); //调整顺序前的索引号
				if(i == oldIndex){
					var spanObj = document.getElementById("SPAN_" + entityId + "_" + ids[i] + "_" + oldIndex);
					spanObj.style.width=widthTemp;
					if(spanObj){
						innerStr += spanObj.outerHTML;
					}
				}
				//栏目替换了 删除旧栏目 创建新栏目
				else{
					
					//不存在配置
					var hasParam = true;
					for(var m=0; m<noParamSections.length; m++){
						if(ids[i] == noParamSections[m]){
							hasParam = false;
							break;
						}
					}
					var sectionPro = sectionPros.get(ids[i]);
					if(hasParam && !sectionPro){
						loadParam(ids[i]);
						var pro = sectionPros.get(ids[i]);
						if(!pro || pro.isReadOnly){
							hasParam = false;
							noParamSections[noParamSections.length] = ids[i];
						}
					}
					contentTD.innerHTML = "";
					//定义了一个全局变量，记录是否有参数,这里更新这个参数
					if(hasParam){
						try{
							var configSectionTip = _("sysMgrLang.space_edit_section_tip");
							innerStr += "<div style='width:"+widthTemp+"' id=\"SPAN_" + entityId + "_" + ids[i] + "_" + i + "\" title=\""+ configSectionTip +"\" class=\"canEdit\" onclick=\"showEditPage(this,'" + entityId + "', '"+ ids[i] +"', "+ i +")\">" + names[i] + "</div>";
							
							var divStr = "<div id=\"EditDIV"+ entityId +"_" + ids[i] + "_" + i + "\" class=\"scrollList edit\" style=\"display:none;\">";
							divStr += param2HTML(entityId, ids[i], i);
							divStr += "</div>";
							if(contentTD){
								contentTD.innerHTML = divStr;
							}
						}
						catch(e){}
					}else{
						innerStr += "<span style='width:"+widthTemp+"' id=\"SPAN_" + entityId + "_" + ids[i] + "_" + i + "\">" + names[i] + "</span>";
					}
				}
			}
			//删除了栏目
			if(innerStr == ''){
				innerStr = "&nbsp;&nbsp;";
				contentTD.innerHTML = "";
			}
			document.getElementById("Title" + entityId).innerHTML = innerStr;
			//alert(document.getElementById("Title" + entityId).parentNode.parentNode.parentNode.innerHTML)
		}
		displayEditPage(fragment);
		var str = "";
		for(var i = 0; i < ids.length; i++) {
			if(singleBoards[i] != ""){
				str += "<input type='hidden' name='P_" + entityId + "_" + ids[i] + "_" + i + "' value='singleBoardId'>";
				str += "<input type='hidden' name='N_" + entityId + "_" + ids[i] + "_" + i + "_singleBoardId' value='" + singleBoards[i] + "'>";
				props.put("singleBoardId:" + i, singleBoards[i]);
			}
			else{
				props.put("singleBoardId:" + i, "");
			}
		}
		props.put("sections", ids.join(","));
		fragment.properties = props;
		var singleBoardHelper = document.getElementById("singleBoardHelperDiv" + entityId);
		if(singleBoardHelper && str != ""){
			singleBoardHelper.innerHTML = str;
		}
		showDefaultEditPage(fragment);
		document.getElementById("submitBtn").disabled = false;
	}
}
//是否存在第i个参数的div,存在 返回
function getParamDiv(contentTD,i,entityId){
	if(contentTD){
		var childs = contentTD.children;
		for(var j = 0; j < childs.length;j++){
			var idStr = childs[j].id;
			if(idStr){
				if(idStr.indexOf("Edit") == 0 && idStr.indexOf(entityId)>0 && idStr.lastIndexOf(i+"") == idStr.length-1){
					return childs[j];
				}
			}
		}
	}
	return null;
}
function arrayToArray(array){
	var r = [];
	if(array != null){
		for(var i = 0; i < array.length; i++) {
			r[i] = array[i];
		}
	}
	return r;
}
function loadParam(sectionId){
	var requestCaller = new XMLHttpRequestCaller(this, "ajaxSectionRegisterManager", "getSectionPreferences", false);
	var sections = sectionId.split(",");
	var str = "";
	for(var i = 0 ; i <sections.length ;i++){
		if(!sectionPros.get(sections[i])){
			if(str != ""){
				str +=",";
			}
			str += sections[i];
		}
	}
	if(str){
		requestCaller.addParameter(1, "String", str);
		var spaceType = $("#type").val();
		requestCaller.addParameter(2, "String", spaceType);
		var paramsList = requestCaller.serviceRequest();
		if(paramsList){
			eval(paramsList);
		}
	}
}
//下拉框中更改部门的跳转
function changeDepartment() {
	var deptId = "";
	var selectObj = document.getElementById("departmentIdSelect");
	if(selectObj){
		deptId = selectObj.value;
	}
	
	location.href = spacePortalURL + "&method=showDepartmentSpace&type=department&departmentId="+deptId;
}

//部门空间配置恢复默认
 function deptSpaceToDefaultSetting(methodName) {
	this.disabledButton();
 	var deptId = "";
	var deptObj = document.getElementById("departmentId");
	if(deptObj){
		deptId = deptObj.value;
	}
    location.href = spacePortalURL + "&method=" + methodName + "&toDefault=true&departmentId="+deptId;
    getCtpTop().startProc('');
 }
 
//恢复默认
function toDefaultSetting(methodName){
	this.disabledButton();
	var editKeyId = frames['editSpacePage'].document.getElementById("editKeyId").value;
	location.href = spacePortalURL + "&method=" + methodName + "&toDefault=true&"+"showSpace="+$("#showSpace").val()+"&space_id="+$("#space_id").val()+"&showFlag=edit&editKeyId="+editKeyId;
} 
//选择频道 
//点击确定按钮 
 function okClicked(){
	var sectionIds = document.getElementById("sections").options;
	var names = [];
	var ids = [];
	var singleBoards = [];
	var entityIds = [];
	var ordinals = [];
	for(var i = 0; i < sectionIds.length; i++) {
		var s = sectionIds.item(i);
    	ids[ids.length] = s.value;
    	names[names.length] = s.text;
		var singleBoardId = s.getAttribute("singleBoardId");
		if(singleBoardId){
	    	singleBoards[singleBoards.length] = singleBoardId;
		}
		else{
			singleBoards[singleBoards.length] = "";
		}
		var entityId = s.getAttribute("entityId");
		if(entityId){
			entityIds[entityIds.length] = entityId;
		}else{
			entityIds[entityIds.length] = "";
		}
		var ordinal = s.getAttribute("ordinal");
		if(entityId){
			ordinals[ordinals.length] = ordinal;
		}else{
			ordinals[ordinals.length] = "";
		}
	}
	window.returnValue = [ids, names, singleBoards,entityIds,ordinals];
	window.close();
 }
 
//点击取消按钮 
function  cancelClicked(){
    if(!window.returnValue){
      window.returnValue = null;
    }
    window.close();
}

//校验是否已选择该栏目
function checkIsContainerSection(sectionIds, currentEntityId, singleBoards){
	for(var i = 0; i < fragments.length; i++) {
		for(var j = 0; j < fragments[i].length; j++) {
			if(currentEntityId == fragments[i][j].id){
				continue;
			}
			var sectionObj = document.getElementById("S_" + fragments[i][j].id);
			if(!sectionObj){
				continue;
			}
			var sections = sectionObj.value.split(",");
			for(var l = 0; l < sections.length; l++) {
				for(var m = 0; m < sectionIds.length; m++) {
					if(sections[l] == sectionIds[m]){
						if(!sections[l].startWith("singleBoard") || singleBoards[m]==fragments[i][j].properties.get("singleBoardId:" + l)){
							return m;
						}
					}
				}
			}
		}
	}
	
	return -1;
}


function indexOfSections(theSection, oldSections, singleBoardId, props){
	var s = oldSections.split(",");
	for(var i=0; i<s.length; i++){
		if(theSection == s[i]){
			if(singleBoardId){
				for(var temp=0; temp<3; temp++){
					var oldSingleId = props.get("singleBoardId:" + temp);
					if(oldSingleId && oldSingleId==singleBoardId){
						return temp;
					}
				}
			}
			else{
				return i;
			}
		}
	}
	return -1;
}

function selectOne(){
	var s  = document.getElementById("sections").options;
	if(sectionMaxNumber > 0 && s.length >= sectionMaxNumber){
		alert($.i18n("space.alertSection1_3", sectionMaxNumber, s.length));
		return;
	}
	
	if(selectedPanel == "common"){
		checkOp(document.getElementById("sections1").options);
	}else{
		var rootNode;
		if(selectedPanel == "timeManagement"){
			rootNode = root1;
		}else if(selectedPanel == "publicInformation"){
			rootNode = publicInformationFrame.root2;
		}else if(selectedPanel == "doc"){
			rootNode = docFrame.root;
		}else if(selectedPanel == "formbizconfigs"){
			rootNode = formbizconfigsFrame.root3;
		}else if(selectedPanel == "forum"){
			rootNode = forumFrame.root4;
		}
		
		try{
			var selectedNode = rootNode.getSelected();
			if(selectedNode){
				var nodeId = selectedNode.businessId;
				var nodeName = selectedNode.text;
				if(nodeId){
					var o;
					if(selectedPanel == "doc") {
						if(selectedNode.properties.get("sectionCategory") && selectedNode.properties.get("sectionCategory") == "common"){
							o = new Option(nodeName, nodeId);
						}else{
							o = new Option(nodeName, docSection);
							o.setAttribute("singleBoardId", nodeId);
						}
						s.add(o);
					}else if(selectedPanel == "formbizconfigs" && (nodeId == formReportSection || nodeId == formReportChartSection)){
						var rv = v3x.openWindow({
							url : spaceURL + "?method=getFormReportToFormSection&sectionType=" + encodeURI(selectedNode.properties.get("sectionType")) + 
								"&refAppformMainId=" + encodeURI(selectedNode.properties.get("refAppformMainId")) + 
								"&reportId=" + encodeURI(selectedNode.properties.get("reportId")),
							width : "370",
							height : "200",
							scrollbars : "false"
						});
						
						if(rv){
							window.close();
						}
					}else{
						o = new Option(nodeName, nodeId);
						if(selectedNode.properties.get("singleBoardId")){
							o.setAttribute("singleBoardId", selectedNode.properties.get("singleBoardId"));
						}
						s.add(o);
					}
				}
			}
		}catch(e){}
	}
	
	function checkOp(obj){
		for (var i = 0; i < obj.length; i ++) {
			var item = obj.item(i);
			if(item.selected){
				var o = new Option(item.text, item.value);
				if(s.length < sectionMaxNumber || sectionMaxNumber < 0){
					s.add(o);
				}else{
					alert($.i18n("space.alertSection1_3", sectionMaxNumber, s.length));
					return;
				}
			}
		}
	}
}

function removeOne(){
	var s1  = document.getElementById("sections");
	for(var i = 0; i < s1.length; i++) {
		var item = s1.item(i);
		if(item.selected){
			s1.removeChild(s1.options[i]);
			i--;
		}
	}
}

function exchangeList3Item(direction){
    var oSelect = document.getElementById("sections");
    var selectCount = 0;
    for(var selIndex=0; selIndex<oSelect.options.length; selIndex++){
        if(oSelect.options[selIndex].selected){
        	selectCount++;
        }
    }
    var selLength = oSelect.options.length;
	if(direction == "up"){
	    //如果是多选------------------------------------------------------------------
	    if(selectCount > 1){
	        for(var selIndex=0; selIndex<oSelect.options.length; selIndex++){
	            if(oSelect.options[selIndex].selected){
	                if(selIndex > 0){
	                    if(!oSelect.options[selIndex - 1].selected){
	                    	var textTemp = oSelect.options[selIndex-1].text;
	                    	var valueTemp = oSelect.options[selIndex-1].value;
	                    	var singleBoardId = oSelect.options[selIndex-1].getAttribute("singleBoardId");
							var title = oSelect.options[selIndex-1].getAttribute("title");
							var ordinal = oSelect.options[selIndex-1].getAttribute("ordinal");
							var columnsName = oSelect.options[selIndex-1].getAttribute("columnsName");
							var entityId = oSelect.options[selIndex-1].getAttribute("entityId");
							
	                    	oSelect.options[selIndex-1].text = oSelect.options[selIndex].text;
	                    	oSelect.options[selIndex-1].value = oSelect.options[selIndex].value;
	                    	if(oSelect.options[selIndex].getAttribute("singleBoardId")){
	                    		oSelect.options[selIndex-1].setAttribute("singleBoardId", oSelect.options[selIndex].getAttribute("singleBoardId"));
	                    	}else if(oSelect.options[selIndex-1].getAttribute("singleBoardId")){
	                    		oSelect.options[selIndex-1].removeAttribute("singleBoardId");
	                    	}
	                    	if(oSelect.options[selIndex].getAttribute("title")){
	                    		oSelect.options[selIndex-1].setAttribute("title", oSelect.options[selIndex].getAttribute("title"));
	                    	}else if(oSelect.options[selIndex-1].getAttribute("title")){
	                    		oSelect.options[selIndex-1].removeAttribute("title");
	                    	}
	                    	if(oSelect.options[selIndex].getAttribute("ordinal")){
	                    		oSelect.options[selIndex-1].setAttribute("ordinal", oSelect.options[selIndex].getAttribute("ordinal"));
	                    	}else if(oSelect.options[selIndex-1].getAttribute("ordinal")){
	                    		oSelect.options[selIndex-1].removeAttribute("ordinal");
	                    	}
	                    	if(oSelect.options[selIndex].getAttribute("columnsName")){
	                    		oSelect.options[selIndex-1].setAttribute("columnsName", oSelect.options[selIndex].getAttribute("columnsName"));
	                    	}else if(oSelect.options[selIndex-1].getAttribute("columnsName")){
	                    		oSelect.options[selIndex-1].removeAttribute("columnsName");
	                    	}
	                    	if(oSelect.options[selIndex].getAttribute("entityId")){
	                    		oSelect.options[selIndex-1].setAttribute("entityId", oSelect.options[selIndex].getAttribute("entityId"));
	                    	}else if(oSelect.options[selIndex-1].getAttribute("entityId")){
	                    		oSelect.options[selIndex-1].removeAttribute("entityId");
	                    	}
	                    	
	                    	oSelect.options[selIndex].text = textTemp;
	                    	oSelect.options[selIndex].value = valueTemp;
	                    	
	                    	if(singleBoardId){
	                    		oSelect.options[selIndex].setAttribute("singleBoardId", singleBoardId);
	                    	}else if(oSelect.options[selIndex].getAttribute("singleBoardId")){
	                    		oSelect.options[selIndex].removeAttribute("singleBoardId");
	                    	}
	                    	if(title){
	                    		oSelect.options[selIndex].setAttribute("title", title);
	                    	}else if(oSelect.options[selIndex].getAttribute("title")){
	                    		oSelect.options[selIndex].removeAttribute("title");
	                    	}
	                    	if(ordinal){
	                    		oSelect.options[selIndex].setAttribute("ordinal", ordinal);
	                    	}else if(oSelect.options[selIndex].getAttribute("ordinal")){
	                    		oSelect.options[selIndex].removeAttribute("ordinal");
	                    	}
	                    	if(columnsName){
	                    		oSelect.options[selIndex].setAttribute("columnsName", columnsName);
	                    	}else if(oSelect.options[selIndex].getAttribute("columnsName")){
	                    		oSelect.options[selIndex].removeAttribute("columnsName");
	                    	}
	                    	if(entityId){
	                    		oSelect.options[selIndex].setAttribute("entityId", entityId);
	                    	}else if(oSelect.options[selIndex].getAttribute("entityId")){
	                    		oSelect.options[selIndex].removeAttribute("entityId");
	                    	}
	                    	
	                    	oSelect.options[selIndex-1].selected = true;
	                    	oSelect.options[selIndex].selected = false;
                    	}
	                }
	            }
	        }
	    }
	    //如果是单选--------------------------------------------------------------------
	    else if(selectCount == 1)
	    {
	        var selIndex = oSelect.selectedIndex;
	        if(selIndex > 0){
	        	var textTemp = oSelect.options[selIndex-1].text;
	        	var valueTemp = oSelect.options[selIndex-1].value;
	        	var singleBoardId = oSelect.options[selIndex-1].getAttribute("singleBoardId");
	        	var title = oSelect.options[selIndex-1].getAttribute("title");
				var ordinal = oSelect.options[selIndex-1].getAttribute("ordinal");
				var columnsName = oSelect.options[selIndex-1].getAttribute("columnsName");
				var entityId = oSelect.options[selIndex-1].getAttribute("entityId");
	        	
	        	oSelect.options[selIndex-1].text = oSelect.options[selIndex].text;
	        	oSelect.options[selIndex-1].value = oSelect.options[selIndex].value;
	        	if(oSelect.options[selIndex].getAttribute("singleBoardId")){
            		oSelect.options[selIndex-1].setAttribute("singleBoardId", oSelect.options[selIndex].getAttribute("singleBoardId"));
            	}else if(oSelect.options[selIndex-1].getAttribute("singleBoardId")){
            		oSelect.options[selIndex-1].removeAttribute("singleBoardId");
            	}
	        	if(oSelect.options[selIndex].getAttribute("title")){
            		oSelect.options[selIndex-1].setAttribute("title", oSelect.options[selIndex].getAttribute("title"));
            	}else if(oSelect.options[selIndex-1].getAttribute("title")){
            		oSelect.options[selIndex-1].removeAttribute("title");
            	}
            	if(oSelect.options[selIndex].getAttribute("ordinal")){
            		oSelect.options[selIndex-1].setAttribute("ordinal", oSelect.options[selIndex].getAttribute("ordinal"));
            	}else if(oSelect.options[selIndex-1].getAttribute("ordinal")){
            		oSelect.options[selIndex-1].removeAttribute("ordinal");
            	}
            	if(oSelect.options[selIndex].getAttribute("columnsName")){
            		oSelect.options[selIndex-1].setAttribute("columnsName", oSelect.options[selIndex].getAttribute("columnsName"));
            	}else if(oSelect.options[selIndex-1].getAttribute("columnsName")){
            		oSelect.options[selIndex-1].removeAttribute("columnsName");
            	}
            	if(oSelect.options[selIndex].getAttribute("entityId")){
            		oSelect.options[selIndex-1].setAttribute("entityId", oSelect.options[selIndex].getAttribute("entityId"));
            	}else if(oSelect.options[selIndex-1].getAttribute("entityId")){
            		oSelect.options[selIndex-1].removeAttribute("entityId");
            	}
	        	oSelect.options[selIndex].text = textTemp;
	        	oSelect.options[selIndex].value = valueTemp;
	        	if(singleBoardId){
            		oSelect.options[selIndex].setAttribute("singleBoardId", singleBoardId);
            	}else if(oSelect.options[selIndex].getAttribute("singleBoardId")){
            		oSelect.options[selIndex].removeAttribute("singleBoardId");
            	}
	        	if(title){
            		oSelect.options[selIndex].setAttribute("title", title);
            	}else if(oSelect.options[selIndex].getAttribute("title")){
            		oSelect.options[selIndex].removeAttribute("title");
            	}
            	if(ordinal){
            		oSelect.options[selIndex].setAttribute("ordinal", ordinal);
            	}else if(oSelect.options[selIndex].getAttribute("ordinal")){
            		oSelect.options[selIndex].removeAttribute("ordinal");
            	}
            	if(columnsName){
            		oSelect.options[selIndex].setAttribute("columnsName", columnsName);
            	}else if(oSelect.options[selIndex].getAttribute("columnsName")){
            		oSelect.options[selIndex].removeAttribute("columnsName");
            	}
            	if(entityId){
            		oSelect.options[selIndex].setAttribute("entityId", entityId);
            	}else if(oSelect.options[selIndex].getAttribute("entityId")){
            		oSelect.options[selIndex].removeAttribute("entityId");
            	}
	        	oSelect.options[selIndex-1].selected = true;
	        	oSelect.options[selIndex].selected = false;
	        }
	    }
	}
	else if(direction == "down"){
	    //如果是多选------------------------------------------------------------------
	    if(selectCount > 1)
	    {
	        for(var selIndex=oSelect.options.length - 1; selIndex>= 0; selIndex--)
	        {
	           if(oSelect.options[selIndex].selected){
	                if(selIndex < selLength - 1) {
	                    if(!oSelect.options[selIndex + 1].selected){
	                    	var textTemp = oSelect.options[selIndex+1].text;
	                    	var valueTemp = oSelect.options[selIndex+1].value;
	                    	var singleBoardId = oSelect.options[selIndex+1].getAttribute("singleBoardId");
	                    	var title = oSelect.options[selIndex+1].getAttribute("title");
							var ordinal = oSelect.options[selIndex+1].getAttribute("ordinal");
							var columnsName = oSelect.options[selIndex+1].getAttribute("columnsName");
							var entityId = oSelect.options[selIndex+1].getAttribute("entityId");
							
	                    	oSelect.options[selIndex+1].text = oSelect.options[selIndex].text;
	                    	oSelect.options[selIndex+1].value = oSelect.options[selIndex].value;
	                    	if(oSelect.options[selIndex].getAttribute("singleBoardId")){
	                    		oSelect.options[selIndex+1].setAttribute("singleBoardId", oSelect.options[selIndex].getAttribute("singleBoardId"));
	                    	}else if(oSelect.options[selIndex+1].getAttribute("singleBoardId")){
	                    		oSelect.options[selIndex+1].removeAttribute("singleBoardId");
	                    	}
	                    	if(oSelect.options[selIndex].getAttribute("title")){
	                    		oSelect.options[selIndex+1].setAttribute("title", oSelect.options[selIndex].getAttribute("title"));
	                    	}else if(oSelect.options[selIndex+1].getAttribute("title")){
	                    		oSelect.options[selIndex+1].removeAttribute("title");
	                    	}
	                    	if(oSelect.options[selIndex].getAttribute("ordinal")){
	                    		oSelect.options[selIndex+1].setAttribute("ordinal", oSelect.options[selIndex].getAttribute("ordinal"));
	                    	}else if(oSelect.options[selIndex+1].getAttribute("ordinal")){
	                    		oSelect.options[selIndex+1].removeAttribute("ordinal");
	                    	}
	                    	if(oSelect.options[selIndex].getAttribute("columnsName")){
	                    		oSelect.options[selIndex+1].setAttribute("columnsName", oSelect.options[selIndex].getAttribute("columnsName"));
	                    	}else if(oSelect.options[selIndex+1].getAttribute("columnsName")){
	                    		oSelect.options[selIndex+1].removeAttribute("columnsName");
	                    	}
	                    	if(oSelect.options[selIndex].getAttribute("entityId")){
	                    		oSelect.options[selIndex+1].setAttribute("entityId", oSelect.options[selIndex].getAttribute("entityId"));
	                    	}else if(oSelect.options[selIndex+1].getAttribute("entityId")){
	                    		oSelect.options[selIndex+1].removeAttribute("entityId");
	                    	}
	                    	oSelect.options[selIndex].text = textTemp;
	                    	oSelect.options[selIndex].value = valueTemp;
	                    	if(singleBoardId){
            					oSelect.options[selIndex].setAttribute("singleBoardId", singleBoardId);
            				}else if(oSelect.options[selIndex].getAttribute("singleBoardId")){
	                    		oSelect.options[selIndex].removeAttribute("singleBoardId");
	                    	}
	                    	if(title){
	                    		oSelect.options[selIndex].setAttribute("title", title);
	                    	}else if(oSelect.options[selIndex].getAttribute("title")){
	                    		oSelect.options[selIndex].removeAttribute("title");
	                    	}
	                    	if(ordinal){
	                    		oSelect.options[selIndex].setAttribute("ordinal", ordinal);
	                    	}else if(oSelect.options[selIndex].getAttribute("ordinal")){
	                    		oSelect.options[selIndex].removeAttribute("ordinal");
	                    	}
	                    	if(columnsName){
	                    		oSelect.options[selIndex].setAttribute("columnsName", columnsName);
	                    	}else if(oSelect.options[selIndex].getAttribute("columnsName")){
	                    		oSelect.options[selIndex].removeAttribute("columnsName");
	                    	}
	                    	if(entityId){
	                    		oSelect.options[selIndex].setAttribute("entityId", entityId);
	                    	}else if(oSelect.options[selIndex].getAttribute("entityId")){
	                    		oSelect.options[selIndex].removeAttribute("entityId");
	                    	}
	                    	oSelect.options[selIndex+1].selected = true;
	                    	oSelect.options[selIndex].selected = false;
	                    }
	                }
	            }
	        }
	    }
	    //如果是单选--------------------------------------------------------------------
	    else if(selectCount == 1){
	        var selIndex = oSelect.selectedIndex;
	        if(selIndex < selLength - 1){
	        	var textTemp = oSelect.options[selIndex+1].text;
	        	var valueTemp = oSelect.options[selIndex+1].value;
	        	var singleBoardId = oSelect.options[selIndex+1].getAttribute("singleBoardId");
	        	var title = oSelect.options[selIndex+1].getAttribute("title");
				var ordinal = oSelect.options[selIndex+1].getAttribute("ordinal");
				var columnsName = oSelect.options[selIndex+1].getAttribute("columnsName");
				var entityId = oSelect.options[selIndex+1].getAttribute("entityId");
				
	        	oSelect.options[selIndex+1].text = oSelect.options[selIndex].text;
	        	oSelect.options[selIndex+1].value = oSelect.options[selIndex].value;
	        	if(oSelect.options[selIndex].getAttribute("singleBoardId")){
            		oSelect.options[selIndex+1].setAttribute("singleBoardId", oSelect.options[selIndex].getAttribute("singleBoardId"));
            	}else if(oSelect.options[selIndex+1].getAttribute("singleBoardId")){
            		oSelect.options[selIndex+1].removeAttribute("singleBoardId");
            	}
	        	if(oSelect.options[selIndex].getAttribute("title")){
            		oSelect.options[selIndex+1].setAttribute("title", oSelect.options[selIndex].getAttribute("title"));
            	}else if(oSelect.options[selIndex+1].getAttribute("title")){
            		oSelect.options[selIndex+1].removeAttribute("title");
            	}
            	if(oSelect.options[selIndex].getAttribute("ordinal")){
            		oSelect.options[selIndex+1].setAttribute("ordinal", oSelect.options[selIndex].getAttribute("ordinal"));
            	}else if(oSelect.options[selIndex+1].getAttribute("ordinal")){
            		oSelect.options[selIndex+1].removeAttribute("ordinal");
            	}
            	if(oSelect.options[selIndex].getAttribute("columnsName")){
            		oSelect.options[selIndex+1].setAttribute("columnsName", oSelect.options[selIndex].getAttribute("columnsName"));
            	}else if(oSelect.options[selIndex+1].getAttribute("columnsName")){
            		oSelect.options[selIndex+1].removeAttribute("columnsName");
            	}
            	if(oSelect.options[selIndex].getAttribute("entityId")){
            		oSelect.options[selIndex+1].setAttribute("entityId", oSelect.options[selIndex].getAttribute("entityId"));
            	}else if(oSelect.options[selIndex+1].getAttribute("entityId")){
            		oSelect.options[selIndex+1].removeAttribute("entityId");
            	}
	        	oSelect.options[selIndex].text = textTemp;
	        	oSelect.options[selIndex].value = valueTemp;
	        	if(singleBoardId){
					oSelect.options[selIndex].setAttribute("singleBoardId", singleBoardId);
				}else if(oSelect.options[selIndex].getAttribute("singleBoardId")){
            		oSelect.options[selIndex].removeAttribute("singleBoardId");
            	}
	        	if(title){
            		oSelect.options[selIndex].setAttribute("title", title);
            	}else if(oSelect.options[selIndex].getAttribute("title")){
            		oSelect.options[selIndex].removeAttribute("title");
            	}
            	if(ordinal){
            		oSelect.options[selIndex].setAttribute("ordinal", ordinal);
            	}else if(oSelect.options[selIndex].getAttribute("ordinal")){
            		oSelect.options[selIndex].removeAttribute("ordinal");
            	}
            	if(columnsName){
            		oSelect.options[selIndex].setAttribute("columnsName", columnsName);
            	}else if(oSelect.options[selIndex].getAttribute("columnsName")){
            		oSelect.options[selIndex].removeAttribute("columnsName");
            	}
            	if(entityId){
            		oSelect.options[selIndex].setAttribute("entityId", entityId);
            	}else if(oSelect.options[selIndex].getAttribute("entityId")){
            		oSelect.options[selIndex].removeAttribute("entityId");
            	}
	        	oSelect.options[selIndex+1].selected = true;
	        	oSelect.options[selIndex].selected = false;
	        }
	    }
	}
	else{
		alert('The direction ' + direction + ' is not defined.');
	}
}

var allBoards = new Properties();
var allBoardSections = new Properties();
allBoardSections.put("3", "singleCustomBoardBulSection");
allBoardSections.put("4", "singleCustomBoardNewsSection");
allBoardSections.put("5", "singleCustomBoardBbsSection");
allBoardSections.put("6", "singleCustomBoardInquirySection");
allBoardSections.put("7", "singleBoardBulSection");
allBoardSections.put("8", "singleBoardNewsSection");
allBoardSections.put("9", "singleBoardBbsSection");
allBoardSections.put("10", "singleBoardInquirySection");
allBoardSections.put("groupBul", "singleBoardGroupBulletinSection");
allBoardSections.put("groupNews", "singleBoardGroupNewsSection");
allBoardSections.put("groupBbs", "singleBoardGroupBbsSection");
allBoardSections.put("groupInquiry", "singleBoardGroupInquirySection");
allBoardSections.put("rss","singleBoardRssSection");
allBoardSections.put("link", "singleBoardLinkSection");
allBoardSections.put("ssoWebcontent", "ssoWebcontentSection");
allBoardSections.put("ssoIframe", "ssoIframeSection");
allBoardSections.put("iframe", "iframeSection");
allBoardSections.put("dee", "deeSection");

var allBoardMethods = new Properties();
allBoardMethods.put("3", "getCustomBulBoard");
allBoardMethods.put("4", "getCustomNewBoard");
allBoardMethods.put("5", "getCustomBbsBoard");
allBoardMethods.put("6", "getCustomInquiryBoard");
allBoardMethods.put("7", "getBulBoard");
allBoardMethods.put("8", "getNewBoard");
allBoardMethods.put("9", "getBbsBoard");
allBoardMethods.put("10", "getInquiryBoard");
allBoardMethods.put("groupBul", "getGroupBulBoard");
allBoardMethods.put("groupNews", "getGroupNewsBoard");
allBoardMethods.put("groupBbs", "getGroupBbsBoard");
allBoardMethods.put("groupInquiry", "getGroupInquiryBoard");
allBoardMethods.put("rss" ,"getRssMessages") ;
allBoardMethods.put("link", "getLinkCategory");
allBoardMethods.put("ssoWebcontent", "getSectionDefinitionOfSSOWebcontent");
allBoardMethods.put("ssoIframe", "getSectionDefinitionOfSSOIframe");
allBoardMethods.put("iframe", "getSectionDefinitionOfIframe");
allBoardMethods.put("dee", "getDeeSection");

var allBoardPNodes = new Properties();
allBoardPNodes.put("3", "aa17");
allBoardPNodes.put("4", "aa18");
allBoardPNodes.put("5", "aa19");
allBoardPNodes.put("6", "aa20");
allBoardPNodes.put("7", "aa21");
allBoardPNodes.put("8", "aa22");
allBoardPNodes.put("9", "aa23");
allBoardPNodes.put("10", "aa24");
allBoardPNodes.put("groupBul", "aa25");
allBoardPNodes.put("groupNews", "aa26");
allBoardPNodes.put("groupBbs", "aa27");
allBoardPNodes.put("groupInquiry", "aa28");
allBoardPNodes.put("rss", "aa41");
allBoardPNodes.put("link", "aa42");
allBoardPNodes.put("ssoWebcontent", "aa43");
allBoardPNodes.put("ssoIframe", "aa44");
allBoardPNodes.put("iframe", "aa45");
allBoardPNodes.put("dee", "aa46");

/**
 * 	bulletin(7), // 公告
	news(8), // 新闻
	bbs(9), // 讨论
	inquiry(10), // 调查
 */
function loadBoard(type){
	var boards = allBoards.get(type);
	if(!boards){
		var method = allBoardMethods.get(type);
		var request = new XMLHttpRequestCaller(this, "ajaxValidateBoardNameManager", method, false);
		if(type == "ssoWebcontent" || type == "ssoIframe" || type == "iframe"){
			request.addParameter(1, "String", currentSpaceType);
		}
		boards = request.serviceRequest();
		
		if(boards){
			allBoards.put(type, boards);
		}
		else{
			allBoards.put(type, null);
		}
	}
	
	if(boards){
		for(var i = 0; i < boards.length; i++) {
			var b = boards[i];
			
			var node = new WebFXTreeItem(allBoardSections.get(type), b[1], "", "parent.selectOne()");
			node.properties.put("singleBoardId", b[0]);
			var pNode = eval("" + allBoardPNodes.get(type));
			pNode.add(node);
		}
	}
}

/**
 * 自定义单位/集团空间
 */
function loadCustomBoard(type, spaceType, spaceId){
	var boards = allBoards.get(type);
	if(!boards){
		var method = allBoardMethods.get(type);
		var request = new XMLHttpRequestCaller(this, "ajaxValidateBoardNameManager", method, false);
		request.addParameter(1, "String", spaceType);
		request.addParameter(2, "String", spaceId);
		boards = request.serviceRequest();
		if(boards){
			allBoards.put(type, boards);
		}
		else{
			allBoards.put(type, null);
		}
	}
	if(boards){
		for(var i = 0; i < boards.length; i++) {
			var b = boards[i];
			var node = new WebFXTreeItem(allBoardSections.get(type), b[1], "", "parent.selectOne()");
			node.properties.put("singleBoardId", b[0]);
			var pNode = eval("" + allBoardPNodes.get(type));
			pNode.add(node);
		}
	}
}

//按照y取得y上的所有栏目 将栏目添加到已选。
//点击确定后，删除已选。并且重新生成fragment。注意删除内存。避免造成内存泄露。
function loadTheSection(y,x,isShowBanner){
	var _parent = window.dialogArguments;
	if(!_parent){
		_parent = window.opener;
	}
	if(_parent){
		var frags = [];
		if(isShowBanner == 'true'){
			if(_parent.fragments[y][x]){
				frags = _parent.fragments[y][x];
			}
			var value = frags.properties.get("sections");
			var fragNames = frags.names;
			var propsKeys = frags.properties.keys();
			var tempOrdinals = [];
			for(var j = 0; j < propsKeys.size(); j++) {
				var key = propsKeys.get(j);
				var _key = key.split(":");
				if(_key.length == 2&&_key[0]=='ordinal'){
					var ordinal = frags.properties.get(key);
					if(ordinal == '0'){
						tempOrdinals[0] = ordinal;
					}else if(ordinal == '1'){
						tempOrdinals[1] = ordinal;
					}else if(ordinal == '2'){
						tempOrdinals[2] = ordinal;
					}
				}
			}
			var ordinals = new Array();
			var index = 0;
			for(var n=0; n < tempOrdinals.length; n++){
				if(tempOrdinals[n]){
					ordinals[index++]=tempOrdinals[n];
				}
			}
			var values = value.split(",");
			for(var m=0; m<values.length;m++){
				if(fragNames[m]!=''&&fragNames[m]!=null&&fragNames[m]!='null'){
					var _title = fragNames[m];
					var _name = fragNames[m].getLimitLength(32).toString();
					var o = new Option(_name,values[m]);
					o.setAttribute("title", _title);
					//var propsKeys = frags.properties.keys();
					for(var j = 0; j < propsKeys.size(); j++) {
						var key = propsKeys.get(j);
						var _key = key.split(":");
						if(_key.length == 2&&_key[1]==ordinals[m]){
							o.setAttribute(_key[0], frags.properties.get(key));
						}
					}
					document.getElementById("sections").options.add(o);
				}
			}
		}else{
			frags = _parent.fragments;
			if(frags && frags.length !=0){
				for(var i = 0; i < frags.length&&i<=y;i++){
					if(!frags[i]){
						continue;
					}
					for(var n = 0; n < frags[i].length; n++){
						var _fragSection = frags[i][n];
						if(!_fragSection){
							continue;
						} 
						//<option value='sectionId' singleBoardId=''>name</option>
						var value = _fragSection.properties.get("sections");
						if(!value || !_fragSection.names[0]){
							continue;
						}
						var fragNames = _fragSection.names;
						var values = value.split(",");
						var _title = "";
						var _name = "";
						for(var j=0;j<fragNames.length;j++){
							_title +=fragNames[j];
							_name += fragNames[j].getLimitLength(32).toString();
							if(j!=fragNames.length-1){
								_title +=" | ";
								_name +=" | ";
							}
						}
						//显示空间内的栏目列表时，多频道栏目只显示第一个
						var o = new Option(_name,values[0]);
						o.setAttribute("title", _title);
						var propsKeys = _fragSection.properties.keys();
						var tempOrdinals = new Object();
						for(var j = 0; j < propsKeys.size(); j++) {
							var key = propsKeys.get(j);
							var _key = key.split(":");
							if(_key.length == 2&&_key[0]=='ordinal'){
								var ordinal = _fragSection.properties.get(key);
								if(ordinal == '0'){
									tempOrdinals['0'] = ordinal;
								}else if(ordinal == '1'){
									tempOrdinals['1'] = ordinal;
								}else if(ordinal == '2'){
									tempOrdinals['2'] = ordinal;
								}
							}
						}
						if(tempOrdinals['0']){
							for(var j = 0; j < propsKeys.size(); j++) {
								var key = propsKeys.get(j);
								var _key = key.split(":");
								if(_key.length == 2&&_key[1]==0){
									o.setAttribute(_key[0], _fragSection.properties.get(key));
								}
							}
						}else if(tempOrdinals['1']){
							for(var j = 0; j < propsKeys.size(); j++) {
								var key = propsKeys.get(j);
								var _key = key.split(":");
								if(_key.length == 2&&_key[1]==1){
									o.setAttribute(_key[0], _fragSection.properties.get(key));
								}
							}
						}else if(tempOrdinals['2']){
							for(var j = 0; j < propsKeys.size(); j++) {
								var key = propsKeys.get(j);
								var _key = key.split(":");
								if(_key.length == 2&&_key[1]==2){
									o.setAttribute(_key[0], _fragSection.properties.get(key));
								}
							}
						}
						document.getElementById("sections").options.add(o);
					}
				}
			}
		}
	}
}
/**
	ordinal=1
	sections=pendingSection,trackSection
	layoutType=TwoColumns
	* @deprecated 废弃掉了。采用根据y坐标取得所选择的栏目。
 */
function initSection(entityId){
	currentEntityId = entityId;
	_parent = window.dialogArguments;
	if(!_parent){
		_parent = window.opener;
	}
	
	var fragment = _parent.getFragmentById(entityId);
	if(!fragment){
		return;
	}
	
	var _selectSections = fragment.properties.get("sections");
	if(!_selectSections){
		return;
	}
	
	var selectSections = _selectSections.split(",");
	var names = fragment.names;
	
	for(var i = 0; i < selectSections.length; i++){
		if(names[i] == null || names[i] == ""){
			continue;
		}
		
		var o = new Option(names[i], selectSections[i]);
		
		var propsKeys = fragment.properties.keys();
		for(var j = 0; j < propsKeys.size(); j++) {
			var key = propsKeys.get(j);
			var _key = key.split(":");
			if(_key.length == 2 && parseInt(_key[1], 10) == i){
				o.setAttribute(_key[0], fragment.properties.get(key));
			}
		}
		
		document.getElementById("sections").options.add(o);
	}
}

function getFragmentById(id){
	for(var i = 0; i < fragments.length; i++) {
		if(fragments[i]){
			for(var j = 0; j < fragments[i].length; j++) {
				if(fragments[i][j]){
					if(fragments[i][j].id == id){
						return fragments[i][j];
					}
				}
			}
		}
	}
	
	return null;
}

/**
 * @param x 行
 * @param y 列
 */
function Fragment(id, x, y, _names, _properties,sectionMutiple){
	this.id = id;
	this.x = x;
	this.y = y;
	this.names = _names || [];
	this.properties = _properties || new Properties();
	//是否支持一个fragment上选择多个section
	this.sectionMutiple = sectionMutiple || '';
	this.width = -1;
}
function makePortalParam(params,fragmentId,id,index){
	var result = [];
	if(params != null)
	for(var m=0; m<params.length; m++){
		if(params[m][2]){
			var valueType = parseInt(params[m][2], 10);
			var isReadOnly = params[m][4]=='true';
			var newParams = new PortletParam(fragmentId, id, index, params[m][0], params[m][1], valueType, params[m][3], isReadOnly, params[m][5],'','',params[m][6]);
			result[result.length] = newParams;
		}
	}
	return result;
}
Fragment.prototype.toTable = function(width, isPageCanEdit,isSingle){
	var sectionValue = this.properties.get("sections") || "";
	this.width = width;
	var theSections = [];
	if(sectionValue != null && sectionValue != ""){
		theSections = sectionValue.split(",");
		//当由复杂模板像简单模板转化时候，不能将banner赋值给这里
		var tempSection = "";
		for(var i = 0 ; i < theSections.length;i++){
			if(!isSingle){
				if(theSections[i] =='banner' || theSections[i] =='footer'){
					continue;
				}
			}else{
				if(theSections[i] =='banner' || theSections[i] =='footer'){
					tempSection = theSections[i];
					break;
				}
			}
			if(tempSection !=''){
				tempSection +=",";
			}
			tempSection += theSections[i];
		}
		if(isSingle && (tempSection != 'banner' || tempSection != 'footer')){
			theSections = [theSections[0]];
			sectionValue = theSections[0];
			this.properties.put("sections",sectionValue);
		}else{
			theSections = tempSection.split(",");
			sectionValue = tempSection;
		}
		if(!this.names[0]){
			theSections = [];
			sectionValue = "";
		}
	}
	var strBuffer = new StringBuffer();
	strBuffer.append("<table width=\"100%\" fragmentId='"+this.id+"' id='Table_"+this.id+"' class=\"fragmentTable ellipsis\" cellpadding=\"0\" cellspacing=\"0\">\n");
	strBuffer.append("	<tr>\n");
	strBuffer.append("		<td class=\"head\">\n");
	strBuffer.append("<div class='title' id=\"Title" + this.id + "\">\n");
	//判断是否有的栏目部可用
	var availableSectionsLength = 0;
	for(var i=0; i<theSections.length; i++){
		if(this.names[i]){
			availableSectionsLength++;
		}
	}
	if(availableSectionsLength==0)availableSectionsLength=1;
	for(var i=0; i<theSections.length; i++){
		if(this.names[i]){
			var canEdit = checkIsCanEdit(theSections[i]);
			if(canEdit && (isPageCanEdit ==true || isPageCanEdit=='true')){
				var configSectionTip = _("sysMgrLang.space_edit_section_tip");
				strBuffer.append("<span style='width:"+(100/availableSectionsLength)+"%' id=\"SPAN_" + this.id + "_" + theSections[i] + "_" + i + "\" title=\""+ configSectionTip +"\" class=\"canEdit\" onClick=\"showEditPage(this,'" + this.id + "', '"+ theSections[i] +"'," + i + ")\">").append(this.names[i]).append("</span>");
			}
			else{
				strBuffer.append("<span style='width:"+(100/availableSectionsLength)+"%' id=\"SPAN_" + this.id + "_" + theSections[i] + "_" + i + "\">").append(this.names[i]).append("</span>");
			}
		}
	}
	strBuffer.append("&nbsp;</div>\n");
	strBuffer.append("</td>\n");
	
	if(isPageCanEdit == false || isPageCanEdit == 'false' || document.getElementById("toDefault").value == "true"){
		strBuffer.append("<td align=\"right\" class=\"head\" width=\"1\">&nbsp;\n");		
	}
	else if(isSingle){
		strBuffer.append("<td align=\"right\" class=\"head\" width=\"100\" ><span class='like-a' onClick=\"selectPortlet('" + this.id + "', '" + this.x + "', '" + this.y + "', '" + width + "',false,true)\">["+_("MainLang.setSection")+"]</span>");
	}
	else 
	{
		strBuffer.append("<td align=\"right\" class=\"head addSection\" width=\"80\" onClick=\"selectPortlet('" + this.id + "', '" + this.x + "', '" + this.y + "', '" + width + "')\">\n");
		strBuffer.append(" + " + v3x.getMessage("sysMgrLang.space_button_selectChannel"));
	}
	strBuffer.append("	</td>\n");
	strBuffer.append("	</tr>\n");
	strBuffer.append("	<tr>\n");
	strBuffer.append("<td id=\"Content"+ this.id +"\" colspan=\"2\" align=\"left\">");
	strBuffer.append("<div id=\"Content"+ this.id +"_continer\">");
	//for(var i=0; i<theSections.length; i++){
		strBuffer.append("<div id=\"EditDIV"+ this.id +"_" + theSections[0] + "_" + 0 + "\" class=\"edit\"  style=\"display:none;\">");
		strBuffer.append(param2HTML(this.id, theSections[0], 0));
		strBuffer.append("</div>\n");
	//}
	strBuffer.append("</div>");
	strBuffer.append("<input type='hidden' name='fragmentId' value='" + this.id + "'>");
	strBuffer.append("<input type='hidden' id=='X_" + this.id + "' name='X_" + this.id + "' value='" + this.x + "'>");
	strBuffer.append("<input type='hidden' id='Y_" + this.id + "' name='Y_" + this.id + "' value='" + this.y + "'>");
	strBuffer.append("<input type='hidden' id='S_" + this.id + "' name='S_" + this.id + "' value='" + sectionValue + "'>");
	strBuffer.append("<input type='hidden' id='Name_" + this.id + "' name='Name_" + this.id + "' value='" + this.names[0] + "'>");
	strBuffer.append("<div class=\"hidden\" id=\"singleBoardHelperDiv" + this.id + "\">");
	for(var i=0; i<theSections.length; i++){
		if(docSection == theSections[i] || theSections[i].startWith("singleBoard") || theSections[i].startWith("sso") || theSections[i].startWith("iframe")){
			var fragment = getFragmentById(this.id);
			if(fragment){
				var boardIdValue = fragment.properties.get("singleBoardId:" + i);
				strBuffer.append("<input type='hidden' name='P_" + this.id + "_" + theSections[i] + "_" + i + "' value='singleBoardId'>");
				strBuffer.append("<input type='hidden' name='N_" + this.id + "_" + theSections[i] + "_" + i + "_singleBoardId' value='" + boardIdValue + "'>");
			}
		}
	}
	strBuffer.append("	</div></td>\n");
	strBuffer.append("	</tr>\n");
	strBuffer.append("</table>\n");
	return strBuffer.toString();
}
Fragment.prototype.toNewTable = function(width, isPageCanEdit){
	var sectionValue = this.properties.get("sections");
	this.width = width;
	var theSections = [];
	if(sectionValue != null && sectionValue != ""){
		theSections = sectionValue.split(",");
		theSections = [theSections[0]];
		sectionValue = theSections[0];
		if(!this.names[0]){
			return "";
		}
	}else{
		return "";
	}
	var strBuffer = new StringBuffer();
	strBuffer.append("<table width=\"100%\" fragmentId='"+this.id+"' id='Table_"+this.id+"' class=\"fragmentTable ellipsis\" cellpadding=\"0\" cellspacing=\"0\">\n");
	strBuffer.append("	<tr class='sectionTitleTr'>\n");
	strBuffer.append("		<td class=\"head\">\n");
	strBuffer.append("<div class='title' id=\"Title" + this.id + "\">\n");
	var canEdit = checkIsCanEdit(theSections[0]);
	for(var i=0; i<theSections.length; i++){
		if(this.names[0]){
			strBuffer.append("<span style='width:100%' id=\"SPAN_" + this.id + "_" + theSections[0] + "_" + 0 + "\" title=\""+this.names[i]+"\">").append(this.names[i]).append("</span>");
		}
	}
	strBuffer.append("&nbsp;</div>\n");
	strBuffer.append("</td>\n");
	if(isPageCanEdit == false || isPageCanEdit == 'false' || document.getElementById("toDefault").value == "true"){
		strBuffer.append("<td align=\"right\" class=\"head\" width=\"1\">&nbsp;\n");		
	}else{
		strBuffer.append("<td align=\"right\" width=\"40\" class='like-a' onclick=\"javascript:showEditPage1(this,'" + this.id + "', '"+ theSections[0] +"',0)\">");
		//strBuffer.append("<span class='like-a' title='"+_("MainLang.sort_up")+"' onclick='sortDiv(\""+this.id+"\",1,\""+this.y+"\")' style='font-weight:normal;background:url("+v3x.baseURL+"/apps_res/v3xmain/images/up.gif) no-repeat 90% center'>&nbsp;</span>&nbsp;<span class='normal like-a' title='"+_("MainLang.sort_down")+"' onclick='sortDiv(\""+this.id+"\",-1,\""+this.y+"\")'  style='font-weight:normal;background:url("+v3x.baseURL+"/apps_res/v3xmain/images/down.gif) no-repeat 90% center'>&nbsp;</span>");
		
		if(canEdit){
			strBuffer.append("["+_("MainLang.edit")+"]");
		}
		//strBuffer.append("<span class='like-a' onclick='removeFragment(\""+this.id+"\",\""+this.x+"\",\""+this.y+"\")'><img src='"+v3x.baseURL+"/common/images/close.gif'></span>");
	}
	
	strBuffer.append("	</td>\n");
	strBuffer.append("	</tr>\n");
	strBuffer.append("	<tr>\n");
	strBuffer.append("<td id=\"Content"+ this.id +"\" colspan=\"2\" align=\"left\">");
	for(var i=0; i<theSections.length; i++){
		strBuffer.append("<div id=\"EditDIV"+ this.id +"_" + theSections[i] + "_" + i + "\"  class=\"edit\" style='display:none'>");
		strBuffer.append(param2HTML(this.id, theSections[i], i));
		strBuffer.append("</div>\n");
	}
	strBuffer.append("<input type='hidden' name='fragmentId' value='" + this.id + "'>");
	strBuffer.append("<input type='hidden' id='X_" + this.id + "' name='X_" + this.id + "' value='" + this.x + "'>");
	strBuffer.append("<input type='hidden' id='Y_" + this.id + "' name='Y_" + this.id + "' value='" + this.y + "'>");
	strBuffer.append("<input type='hidden' id='S_" + this.id + "' name='S_" + this.id + "' value='" + sectionValue + "'>");
	strBuffer.append("<input type='hidden' id='Name_" + this.id + "_0' name='Name_" + this.id + "_0' value='" + this.names[0] + "'>");
	strBuffer.append("<div class=\"hidden\" id=\"singleBoardHelperDiv" + this.id + "\">");
	for(var i=0; i<theSections.length; i++){
		if(docSection == theSections[i] || theSections[i].startWith("singleBoard") || theSections[i].startWith("sso") || theSections[i].startWith("iframe")){
			var fragment = getFragmentById(this.id);
			if(fragment){
				var boardIdValue = fragment.properties.get("singleBoardId:" + i);
				strBuffer.append("<input type='hidden' name='P_" + this.id + "_" + theSections[i] + "_" + i + "' value='singleBoardId'>");
				strBuffer.append("<input type='hidden' name='N_" + this.id + "_" + theSections[i] + "_" + i + "_singleBoardId' value='" + boardIdValue + "'>");
			}
		}
	}
	strBuffer.append("	</div></td>\n");
	strBuffer.append("	</tr>\n");
	strBuffer.append("</table>\n");
	return strBuffer.toString();
}
function getAllSelectSection(){
	var framentIds = document.getElementsByName("fragmentId");
	if(framentIds && framentIds.length != 0){
		var result = [];
		for(var i = 0 ; i <framentIds.length;i++){
			var sectionValue = document.getElementById("S_"+framentIds[i].value).value;
			var sections = sectionValue.split(",");
			for(var j=0;j<sections.length;j++){
				var singleId = document.getElementById("N_"+framentIds[i].value+"_"+sections[j]+"_"+j);
				if(singleId){
					singleId = singleId.value;
				}else{
					singleId = "";
				}
				result[result.length] = [sections[j]+"|"+singleId,framentIds[i].value];
			}
		}
		return result;
	}
	return [];
}
function isSectionInChanel(section,singleBoardId){
	var all = getAllSelectSection();
	singleBoardId = singleBoardId ||"";
	for(var i = 0 ;i<all.length;i++){
		if(section+"|"+singleBoardId == all[i][0]){
			return all[i][1];
		}
	}
	return null;
}
function showDefaultEditPage(fragment){
	if(!fragment.properties){
		return ;
	}
	var sectionValue = fragment.properties.get("sections");
	var theSections = [];
	if(sectionValue != null && sectionValue != ""){
		theSections = sectionValue.split(",");
	}
	for(var i = 0 ; i < theSections.length;i++){
		var canEdit = checkIsCanEdit(theSections[i]);
		if(canEdit){
			var canEditPage = document.getElementById('SPAN_'+fragment.id+"_"+theSections[i]+"_"+i);
			if(canEditPage){
				if(canEditPage.className == "canEditCursor"){
					return;
				}
				showEditPage(canEditPage,fragment.id, theSections[i],i);
			}
			break;
		}
	}
}
//更新portletParams数组的值，用于回显数据
/**
function updatePortletParams(properties, fragmentId, sectionId, index){
	for(var j = 0; j < properties.keys().size(); j++) {
		var key = properties.keys().get(j);
		var keySub = key;
		var newkey ;
		if(key.indexOf(":") > 0){
			newkey = key.split(":") ;
			keySub = key.substring(0, key.indexOf(":"));
		}
		for(var k = 0; k < portletParams.length; k++){
			var ParamObj = portletParams[k];
			if(ParamObj.fragmentId==fragmentId && ParamObj.sectionId==sectionId &&　ParamObj.name==keySub){
				  if(key.indexOf(":") > 0){
                      if( ParamObj.index == index && newkey[1] == index) {
						  portletParams[k].index =　index; 
						  portletParams[k].paramValue = properties.get(key); 	//参数的值进行更新							  	
					  }
				  } else {
                      if( ParamObj.index == index) {
						  portletParams[k].index =　index; 
						  portletParams[k].paramValue = properties.get(key); 	//参数的值进行更新							  	
					  }
				  }
			}
		}
	}
}
function updatePortletParamsRep(ParamObj ,oldIndex,paramValue,newIndex) {
	var obj = ParamObj ;
	if( obj && obj.index == oldIndex){
		obj.index = newIndex ;
		obj.paramValue = paramValue ;
	}
}
**/

//从已有的PortletParams中拷贝一份
function copyPortletParams(fragmentId, sectionId, index){
	var srcFragmentId = "";
	for(var k = 0; k < portletParams.length; k++){
		var ParamObj = portletParams[k];
		if(ParamObj.sectionId==sectionId){
			if(srcFragmentId == ""){
				srcFragmentId = ParamObj.fragmentId;
			}
			if(ParamObj.fragmentId == srcFragmentId){
				var newParams = new PortletParam(fragmentId, sectionId, index, ParamObj.name, ParamObj.subject, ParamObj.valueType, ParamObj.defaultValue, ParamObj.isReadOnly, ParamObj.valueRange, '');
				portletParams[portletParams.length] = newParams;
			}
		}
	}
}

//显示编辑页面
function showEditPage(spanObj, fragmentId, sectionId, index){
	var sectionsArray = [];
	var sections = document.getElementById("S_" + fragmentId);
	if(sections){
		sectionsArray = sections.value.split(",");
	}
	var editDIVObj = document.getElementById("EditDIV" + fragmentId + "_" + sectionId + "_" + index);
	if(spanObj.className == "canEdit"){
		spanObj.className = "canEditCursor";
		if(editDIVObj){
			editDIVObj.style.display = "";
		}
		for(var i=0; i<sectionsArray.length; i++){
			if(index != i){
				var spanObj = document.getElementById("SPAN_" + fragmentId + "_" + sectionsArray[i] + "_" + i); 
				if(spanObj){
					if(spanObj.className == "canEditCursor"){
						spanObj.className = "canEdit";
						var obj = document.getElementById("EditDIV" + fragmentId + "_" + sectionsArray[i] + "_" + i);
						if(obj)
							obj.style.display = "none";
					}
				}
			}
		}
	}
	else{
		spanObj.className = "canEdit";
		if(editDIVObj){
			editDIVObj.style.display = "none";
		}
	}
}
function showEditPage1(spanObj, fragmentId, sectionId, index){
	$("#EditDIV" + fragmentId + "_" + sectionId + "_" + index).toggle();	
}
function displayEditPage(fragment){
	var sectionValue = fragment.properties.get("sections");
	var theSections = [];
	if(sectionValue != null && sectionValue != ""){
		theSections = sectionValue.split(",");
	}
	for(var i = 0 ; i < theSections.length;i++){
		var canEdit = checkIsCanEdit(theSections[i]);
		if(canEdit){
			var canEditPage = document.getElementById("SPAN_" + fragment.id + "_" + theSections[i] + "_" + i);
			if(canEditPage){
				canEditPage.className = 'canEdit';
			}
			var canEditPageContent = document.getElementById('EditDIV'+fragment.id+"_"+theSections[i]+"_"+i);
			if(canEditPageContent){
				canEditPageContent.style.display = 'none';
			}
		}
	}
}
//这里只校验现有栏目，新增加的用AJAX校验
function checkIsCanEdit(sectionId){
	var section = sectionPros.get(sectionId);
	if(section != null && section.isReadOnly){
		return false;
	}
	return section != null;
}

var imgSrc=null;
//Portlet参数转换成HTML
function param2HTML(fragmentId, sectionId, index){
	var fragment = getFragmentById(fragmentId);
	var properties = fragment.properties;
	var sectionProp = sectionPros.get(sectionId);
	if(sectionProp){
		return sectionProp.toHTML(properties,fragmentId,index,pageCanEdit);
	}
}
/**
 * 二维数组
 */
var fragments = [];
var bannerFragment = [];
var currentLayout = "";
var isLoading = false;
function chanageLayoutTypeRadio(layout, decoration, index, canEditFlag){
	if(canEditFlag == "false" || document.getElementById("toDefault").value == "true"){
		return;
	}
	if(isLoading || currentLayout==index){
		if(document.getElementById('layout-'+currentLayout)){
			document.getElementById('layout-'+currentLayout).checked=true;
		}
		return false;
	}
	isLoading = true;
	currentLayout=index
	try{
		for(var i=1;i<8;i++){
			document.getElementById('layout-'+i).disabled=true;
		}
	}catch(e){
		
	}
	if(document.getElementById('layout-'+index)){
		document.getElementById('layout-'+index).checked=true;
	}
	document.getElementById("layoutType").value = layout;
	document.getElementById("decoration").value = decoration;
	
	chanageLayoutType(layout, decoration);
	
}
function chanageLayoutType(layout, decoration){
	getDecorationHTML(decoration,$('pagePath').val());
	document.getElementById("submitBtn").disabled = false;
}

/**
 * 
 */
function showFragments(isPageCanEditFlag){
	var frag = $('.fragment');

	var curDecoration = document.getElementById('curDecoration').value;
	var decoration = document.getElementById('decoration').value;
	
	var oldBanners = null;
	if(curDecoration != decoration){
		oldBanners = fragments.pop(); //因为原模板的Banner位置和新模板的不一致，所以把原fragment的Banner去掉（banner都在最后一个）
	}
	
	for(var i = 0 ; i <frag.length;i++){
		var x = parseInt(frag[i].getAttribute("x"));
		var y = parseInt(frag[i].getAttribute("y"));
		var f = document.getElementById("fragment_"+y+"_"+x);
		if(!f){
			continue;
		}
		var tdWidth = f.getAttribute("sWidth");
		var cellAdd = f.getAttribute("cellAdd");
		var isSingle =  f.getAttribute("isSingle");
		var isBanner = f.getAttribute("isBanner");
		//窄栏目
		if(!fragments[y] || (curDecoration != decoration && tdWidth<= 4)){
			fragments[y] = [];
		}
		if(cellAdd == "true"){
			columnAdd(f,fragments[y],tdWidth,y,isPageCanEditFlag)
			continue;
		}
		if(!fragments[y][x] || (curDecoration != decoration && tdWidth<= 4)){
			fragments[y][x] = new Fragment("new_" + x + "_" + y, x, y);
		}
		if("true" == isSingle && x =='0'){
			if(curDecoration != decoration){
				//修改
				var oldBanner0 = oldBanners[0];
				oldBanner0.x = x;
				oldBanner0.y = y;
				fragments[y][x] = oldBanner0;
			}else{
				initBannerFragment(fragments[y][x]);
			}
		}
		var str = fragments[y][x].toTable(tdWidth, isPageCanEditFlag,isSingle);
		f.outerHTML = str;
		showDefaultEditPage(fragments[y][x]);
	}
	portalSectionHander.evalMethodAfterToHTML();
}
function initBannerFragment(frag){
	if(frag){
		var sectionValue = frag.properties.get("sections");
		if(sectionValue == "banner"){
			for(var i = 0 ; i < bannerFragment.length;i++){
				if(bannerFragment.id != frag.id){
					bannerFragment[i] = frag;
				}				
			}
		}
	}
}
function loadBannerFragment(x,y){
	if(bannerFragment.length < parseInt((x+1),10)){
		/**
		var param = loadParam("banner");
		var fraId = "Banner_"+x;
		var pa = makePortalParam(param[0],fraId,"banner",0);
		if(pa && pa.length != 0){
			for(var m=0; m<pa.length; m++){
				portletParams[portletParams.length] = pa[m];
			}
		}
		var prop = new Properties();
		prop.put("sections","banner");
		props.put("columnsName:0", "banner");
		var fragment = new Fragment(fraId,x,y,["banner"],prop);
		* **/
		bannerFragment[bannerFragment.length] =  new Fragment("new_" + x + "_" + y, x, y);;
	}
	bannerFragment[x].y = y;
	return bannerFragment[x];
}
function columnAdd(f,fra,tdWidth,y,isEdit){
	var str =""
	
	if((isEdit == 'true' || isEdit == true )&& document.getElementById("toDefault").value != "true"){
		str = "<div style='height:30px;width:100%' id=\"column_"+y+"\"><div style='float:right'><span  class='like-a' onclick=\"selectPortlet('column_"+y+"', '','"+y+"', '"+tdWidth+"',true)\">["+_("MainLang.addSection")+"]</span></div></div>";
	}
	for(var i = 0 ;i < fra.length ;i++){
		if(!fra[i])continue;
		var sectionValue = fra[i].properties.get("sections");
		var theSections = [];
		if(sectionValue != null && sectionValue != ""){
			theSections = sectionValue.split(",");
			//控制 不让这里面显示banner
			if(theSections.length <1 || theSections[0] == "banner"){
				continue;
			}
		}else{
			continue;
		}
		if(fra[i].names[0]){
			str +="<div id=\""+fra[i].id+"_allDiv\" class=\"portal-layout-cell cell-edit\">";
			str +=fra[i].toNewTable(tdWidth, isEdit);
			str +="</div>";
		}
	}
	f.outerHTML = str;
}
function sortDiv(id,path,y){
	var fragDiv = document.getElementById(id+"_allDiv");
	if(fragDiv){
		if(path > 0){
			var pre = fragDiv.previousSibling;
			if(pre && pre.className =='portal-layout-cell cell-edit'){
				fragDiv.parentNode.insertBefore(fragDiv,fragDiv.previousSibling);
			}
		}else{
			if(fragDiv.nextSibling)
				fragDiv.parentNode.insertBefore(fragDiv.nextSibling,fragDiv);
		}
		var div = document.getElementById("column_"+y);
		sortFragment(div);
	}
}
/**
 * 将提交按钮和恢复默认按钮置灰
 */
function disabledButton(){
	var submitBtn = document.getElementById("submitBtn");
	var toDefaultBtn = document.getElementById("toDefultBtn");
	if(submitBtn){
		submitBtn.disabled = true;
	}
	if(toDefaultBtn){
		toDefaultBtn.disabled = true;
	}
}
/**
 * 获取表单业务配置栏目配置的ID，以便对其进行必要的解析和处理，同时将取消按钮也一并置灰
 */
function setFormBizConfigIds(from){
	var bizConfigIds = "";
	for (var i = 0; i < fragments.length; i++) {
		for (var j = 0; j < fragments[i].length; j++) {
			if(!fragments[i][j])continue;
			var sectionValue = fragments[i][j].properties.get("sections");
			var theSections = [];
			if (sectionValue != null && sectionValue != "") {
				theSections = sectionValue.split(",");
				for (var k = 0; k < theSections.length; k++) {
					if (theSections[k] == 'singleBoardFormBizConfigSection') {					
						bizConfigIds += fragments[i][j].properties.get("singleBoardId:" + k) + ",";
					}
				}
			}
		}
	}
	document.getElementById("formBizConfigIds").value = bizConfigIds;	
	if (from == 'formBizConfig') {
		var cancelBtn = document.getElementById("cancelBtn");
		if (cancelBtn) {
			cancelBtn.disabled = true;
		}
		var submitBtn = document.getElementById("submitBtn");
		if(submitBtn){
			submitBtn.disabled = true;
		}
	}
	return true;
}
/**
 * 校验通过再置灰
 */
function checkFromAndDisabledBtn(formObj){
	if(checkForm(formObj)){
		var state = 0;
		var states = document.getElementsByName("isEnabled");
		if(states){
			for(var i = 0 ; i <states.length ;i++){
				if(states[i].checked){
					state = states[i].value=="true"?0:1;
				}
			}
		}
		var spaceId = formObj.space_id.value;
		if(!spaceId){
			spaceId = -1;
		}
		if($("#toDefault").val()!="true"){
			if(checkSpace(formObj.spaceName.value,state,$("#showSpace").val(),spaceId)){
				disabledButton();
				return true;
			}
		}else{
			return true;
		}
	}
	return false;
}

function checkSpace(spaceName,state,showSpace,spaceId){
	var requestCaller = new XMLHttpRequestCaller(this, "ajaxSpaceManager", "checkSpace", false);
	requestCaller.addParameter(1, "String", spaceName);
	requestCaller.addParameter(2, "Integer", state);
	requestCaller.addParameter(3, "String",showSpace);
	requestCaller.addParameter(4, "Long", spaceId);
	var result = requestCaller.serviceRequest();
	if(result != "true"){
		if(result == "sameName"){
			alert(_("sysMgrLang.already_exists_same_space",spaceName));
		}else if(result == "using"){
			alert(_("sysMgrLang.space_is_used",spaceName));
		}
		return false;
	}
	return true;
}
function checkUsingSpace(spaceName,state,showSpace,spaceId){
	var requestCaller = new XMLHttpRequestCaller(this, "ajaxSpaceManager", "checkSpace", false);
	requestCaller.addParameter(1, "String", spaceName);
	requestCaller.addParameter(2, "Integer", state);
	requestCaller.addParameter(3, "String",showSpace);
	requestCaller.addParameter(4, "Long", spaceId);
	var result = requestCaller.serviceRequest();
	if(result != "true"){
		if(result == "using"){
			alert(_("sysMgrLang.space_is_used",spaceName));
			return false;
		}
	}
	return true;
}

//弹出选择关联系统
function selectLinkSystem(obj, paramName){
	var linkSystemId = "";
	var paramNameInput = document.getElementById(paramName);
	if(paramNameInput){
		linkSystemId = paramNameInput.value;
	}
	var returnval = v3x.openWindow({
			url : sectionDefinitionURL + "?method=linkSystemSelector&linkSystemId=" + linkSystemId,
			width : "360",
			height : "480",
			scrollbars : "false"
		});
		
	if(returnval){
		paramNameInput.value = returnval[0];
		obj.value = returnval[1];
	}
}

function selLinkSystemOK(){
	var selValue = "";
	var selName = "";
	var objs = document.getElementsByName("systemId");
	for(var i = 0; i<objs.length; i++){
		var obj = objs[i];
		if(obj.checked){
			selValue = obj.value;
			selName = obj.extendAtt;
			break;
		}
	}
	if(selValue == ""){
		alert(_("sysMgrLang.space_section_notSelectLinkSystem"));
		return;
	}
	window.returnValue = [selValue, selName];
	window.close();
}

//切換下拉框时显示对应Table
function switchTableDisplay(selectObj){
	var maxNum = selectObj.options.length;
	for(var i=0; i<maxNum; i++){
		var obj = document.getElementById("Table" + i);
		if(i == selectObj.selectedIndex){
			obj.style.display = "";
		}
		else{
			obj.style.display = "none";
		}
	}
}

//设置排序
function setSpaceSort(){
	var result = "";
	var disResult = "";
	try{
		var oSelectOptions = document.getElementById("spaceTargetSelect").options;
		for(var i=0; i<oSelectOptions.length; i++){
			if(result == ""){
				result = oSelectOptions[i].value;
			}
			else{
				result += "|" + oSelectOptions[i].value;
			}
		}
		var disOption = document.getElementById("spaceSourceSelect").options;
		for(var i=0; i<disOption.length; i++){
			//验证是否是已经存在的
			var notDeleted = true;
			for(var j = 0 ; j < oSelectOptions.length ; j++){
				if(disOption[i].value == oSelectOptions[j].value){
					notDeleted = false;
				}
			}
			if(!notDeleted){
				continue;
			}
			if(disResult == ""){
				disResult = disOption[i].value;
			}
			else{
				disResult += "|" + disOption[i].value;
			}
		}
		document.getElementById("sortResult").value = result;
		document.getElementById("disResult").value = disResult;
	}catch(e){}
}

function getCheckedBoxId(){
	var spaceIds = document.getElementsByName('id');
	for(var i=0; i<spaceIds.length; i++){
		var idCheckBox = spaceIds[i];
		if(idCheckBox.checked){
			if(idCheckBox.isSystem == "true"){
				alert(v3x.getMessage("sysMgrLang.space_alert_cannotDeleteSystemSpace"));
				return false;
			}
			return idCheckBox.value;
		}
	}
	
	var count = validateCheckbox("id");
	switch(count){
		case 0:
				alert(v3x.getMessage("sysMgrLang.choose_item_from_list"));  
				return false;
				break;
		case 1:
				var id = this.getSelectId();
				
				parent.detailFrame.location.href = menuManagerURL + "?method=editMenuPopedom&id=" + id + "&disabled=" + disabled;
				break;
		default:
				alert(v3x.getMessage("sysMgrLang.choose_one_only"));
				return false;			
	}
	
}

//新建
function createFn(noOutWorkerFlag,showSpace) {
	var createURL = spacePortalURL + "&method=showSpace&type=custom&showFlag=new"
	if(noOutWorkerFlag){
		createURL += "&noOutworker=true";
	}
	showSpace = showSpace || '';
	createURL +="&showSpace="+showSpace;
	parent.detailFrame.location.href = createURL;
}

//修改
function modifyFn(showSpace) {
	var spaceId = "";
	var spaceType = "";
	var spaceIds = document.getElementsByName('id');
	var count = 0;
	for(var i=0; i<spaceIds.length; i++){
		var idCheckBox = spaceIds[i];
		if(idCheckBox.checked){
			if(count >= 1){
				alert(v3x.getMessage("sysMgrLang.choose_one_only"));
				return;
			}
			spaceId = idCheckBox.value;
			spaceType = idCheckBox.getAttribute("typeAtt");
			count++;
		}
	}
	if(count == 0){
		alert(v3x.getMessage("sysMgrLang.choose_item_from_list"));  
		return;
	}
	var editURL = spacePortalURL + "&method=showSpace&space_id="+ spaceId +"&type="+ spaceType +"&showFlag=edit&showSpace="+showSpace;
	parent.detailFrame.location.href = editURL;
}

//删除空间
function deleteFn() {
	var spaceIds = document.getElementsByName('id');
	var count = 0;
	var form = document.getElementById("listForm");
	var showSpace = $("#showSpace").val();
	for(var i=0; i<spaceIds.length; i++){
		var idCheckBox = spaceIds[i];
		if(idCheckBox.checked){
			if(idCheckBox.getAttribute("isSystem") == "true"){
				alert(v3x.getMessage("sysMgrLang.space_alert_cannotDeleteSystemSpace"));
				return false;
			}
			/*if(idCheckBox.getAttribute("path") && idCheckBox.getAttribute("path").indexOf("DeptManager") != -1){
				alert(v3x.getMessage("sysMgrLang.space_alert_cannotDeleteSystemSpaceData"));
				return false;
			}*/
			if(idCheckBox.state != 'invalidation'){
				alert($.i18n("space.alert_is_normal"));
				return false;
			}
			//个人空间验证是否可以停用
			if(showSpace =='personal'){
				var state = idCheckBox.getAttribute("state")=='invalidation'?1:0;
				if(!checkUsingSpace(idCheckBox.getAttribute("nameStr"),state,showSpace,idCheckBox.value)){
					return false;
				}
			}
			var spaceId = document.createElement('<input type="hidden" id="space_id" name="space_id" value="'+idCheckBox.value+'">');
			var spaceType = document.createElement('<input type="hidden" id="type" name="type" value="'+idCheckBox.typeAtt+'">');
			form.appendChild(spaceId);
			form.appendChild(spaceType);
			count++;
		}
	}
	if(count == 0){
		alert(v3x.getMessage("sysMgrLang.choose_item_from_list"));  
		return;
	}
	if(confirm(v3x.getMessage("sysMgrLang.delete_sure"))){
		form.action = spacePortalURL + "&method=deleteSpace";
		form.method = "post";
		form.target="_self";
		form.submit();
	}
}

//自定义空间新建时的取消，需要删除创建的PSML
function deleteCustomSpace(isRefresh){
	if(beDeleteCustomSpace.length > 0){
		var requestCaller = new XMLHttpRequestCaller(this, "ajaxSpaceManager", "deleteCustomSpaces4AJAX", false);
		requestCaller.addParameter(1, "String[]", beDeleteCustomSpace);
		requestCaller.addParameter(2, "String", spaceAccountId);
		var params = requestCaller.serviceRequest();
		if(params){
			beDeleteCustomSpace = [];
		}
	}
	if(isRefresh){
		location.reload(true);
	}
}

//显示详细
function showDetailFn(spaceId, spaceType,showSpace) {
	parent.detailFrame.location.href = 
	spacePortalURL + "&method=showSpace&space_id="+ spaceId +"&type="+ spaceType +"&showFlag=show&showSpace="+showSpace;
}

//编辑详细
function editDetailFn(spaceId, spaceType, showSpace) {
	var editURL = spacePortalURL + "&method=showSpace&space_id="+ spaceId +"&type="+ spaceType +"&showFlag=edit";
	if(showSpace){
		editURL += "&showSpace="+showSpace;
	}
	parent.detailFrame.location.href = editURL;
}
function returnOk(){
	var spaceAlgin = document.getElementById("spaceAlgin");
	var sortResult = document.getElementById("sortResult");
	var delResult  = document.getElementById("disResult");
	if(spaceAlgin!=null && sortResult!=null && delResult != null){
		setSpaceSort();
		window.returnValue = sortResult.value+";"+spaceAlgin.value+";"+delResult.value;
		window.close();
	}else{
		window.close();
	}
}
function openSort(){
	var resule = v3x.openWindow({
		url: sSorpPopupUrl,
		width : 450,
		height : 380,
		top:10,
		resizable: "no"
	});
	if(resule){
		var aArray = resule.split(';'); 
		var sortResult = document.getElementById("sortResult");
		var spaceAlgin = document.getElementById("spaceAlgin");
		var delResult  = document.getElementById("disResult");
		if(spaceAlgin!=null && sortResult!=null){
			sortResult.value = aArray[0];
			spaceAlgin.value = aArray[1];
			delResult.value  = aArray[2]
		}else{
			window.location.reload();
		}
	}
}
function getDecorationHTML(decorationId,pagePath){
	$.ajax({
	url:pagePath+"?edit=edit&showState=edit&decorationId="+decorationId+"&d="+(new Date()),
	success:function(data){
			var pattern = /<link rel=\"stylesheet\" type=\"text\/css\" media=\"screen, projection\" href=\".*\"\s+\/>/;
			var styles = data.match(pattern);
			if(styles != null){
				for(var i =0;i<styles.length;i++){
					var href = /href=\".*\"/;
					var v    = styles[i].match(href);
					if(v != null){
						v = v[0].substring(6,v[0].length-1);
						loadStyle(v);
					}
				}
			}
			document.getElementById("fragmentTr").innerHTML = data;
			setTimeout("initFragment()",200);
		}
	});
}
function loadStyle(href){
	var link = document.getElementById("spaceEditStyle");
	if(link){
		document.body.removeChild(link);
	}
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.type = "text/css";
	link.id = "spaceEditStyle";
	link.href = href;
	document.body.appendChild(link);
}
function initFragment(){
	showFragments(pageCanEdit);
	initDragFun();
	try{
		if(pageCanEdit=="true"){
			for(var i=1;i<8;i++){
				document.getElementById('layout-'+i).disabled=false;
			}
		}
		isLoading = false;
	}catch(e){}
}
function initDragFun(){
	
}