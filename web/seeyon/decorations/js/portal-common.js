var portletParams = [];
var sectionPros    = new Properties();
var noParamSections = [];
var afterLoad = new ArrayList();
/**
 * 首页控制
 * 1.栏目菜单控制（比如栏目缩放与展开，最大化，删除，前端对栏目进行配置等操作）
 * 2.栏目拖拽功能.
 * based on V3X.js,jquery.js,section.js
 */
function SectionProperties(sectionId){
	this.properties = new ArrayList();
	this.sectionId = sectionId;
	this.isReadOnly = false;
}
SectionProperties.prototype.addProperty = function(property){
	this.properties.add(property);
}
SectionProperties.prototype.hasParam = function(){
	return !this.properties.isEmpty();
}
SectionProperties.prototype.searchRef = function(paramName){
	for(var i = 0 ; i < this.properties.size();i++){
		var pro = this.properties.get(i);
		for(var j = 0 ; j < pro.sectionReference.size();j++){
			var refs= pro.sectionReference.get(j);
			if(refs.name == paramName){
				return refs;
			}
		}
	}
}

/**
 * 日程事件portal改变栏目样式。例如修改栏目样式为日历，则显示数据、显示字段都应该不可编辑
 */
function calEventViewChange(obj, paramName, isOnload){
	if(obj.value == 0){ //日历
		$("#"+paramName+"columnscount").attr("disabled","disabled");
		$("#"+paramName+"columnscount").val("8");
		$("#"+paramName+"columnproperty1").attr("disabled","disabled");
		$("#"+paramName+"columnproperty2").attr("disabled","disabled");
		$("#"+paramName+"columnproperty3").attr("disabled","disabled");
	}else if(obj.value == 1){ //列表
		$("#"+paramName+"columnscount").removeAttr("disabled");
		$("#"+paramName+"columnproperty1").removeAttr("disabled");
		$("#"+paramName+"columnproperty2").removeAttr("disabled");
		$("#"+paramName+"columnproperty3").removeAttr("disabled");
	}
}

/**
 * 时间视图portal改变栏目样式。例如修改栏目样式为月视图，则让显示高度不可编辑
 */
function timeViewChange(obj, paramName, isOnload){
  if(obj.value == 0){ //周视图
    $("#"+paramName+"columnHeight").removeAttr("disabled");
  }else if(obj.value == 1){ //月视图
    $("#"+paramName+"columnHeight").attr("disabled","disabled");
    $("#"+paramName+"columnHeight").val("208");
  }
}

/**
 * 输出配置信息
 * @param valuePro 值，如果没有，一切按照默认来说
 * @param isEdit   是否是在编辑状态
 */
SectionProperties.prototype.toHTML = function(valuePro,fragmentId,index,isEdit){
	if(this.isReadOnly){
		return "";
	}
	var result = new StringBuffer();
	result.append("<table width=\"100%\">");
	for(var i = 0 ; i < this.properties.size();i++){
	  if(i==0){
	    result.append("<tr><td colspan='2' style='height:5px;font-size:1px;'><hr style=height:1px;overflow:hidden;background:#ededed;border:0px;margin:0px;'/></td></tr>");
	  }
		var property = this.properties.get(i);
		for(var j = 0 ; j < property.sectionReference.size();j++){
			var pro = property.sectionReference.get(j);
			result.append(pro.toHTML(valuePro,fragmentId,this.sectionId,index,isEdit));
		}
		if(i != this.properties.size()-1){
			result.append("<tr heigth='1'><td colspan='2'><hr style=height:1px;overflow:hidden;background:#d2d2d2;border:0px;'/></td></tr>");
		}
	}
	result.append("</table>");
	return result.toString();
}
function SectionProperty(){
	this.sectionReference = new ArrayList();
}
SectionProperty.prototype.addReference = function(reference){
	this.sectionReference.add(reference);
}
function SectionReference(name,subject,valueType,defaultValue,isReadOnly,validate,validateStr,panelSetUrl,singleBeanId,changeMethod,changeValue){
	this.name = name;//input name
	this.subject = subject;//lable
	this.valueType = valueType;
	this.defaultValue = defaultValue;//defaultValue
	this.isReadOnly = isReadOnly;//isReadonly
	this.validate = validate;
	this.validateStr = validateStr;
	this.panelSetUrl = panelSetUrl;
	this.singleBeanId = singleBeanId;
	this.valueRange = new ArrayList();
	this.hiddenValue;
	
	this.changeMethod = changeMethod;
	this.changeValue = changeValue;
}
SectionReference.prototype.addValueRange = function(subject,value,panelValue,panelSetUrl,isBackUp,isReadOnly){
	var range = new ValueRange(subject,value,panelValue,panelSetUrl,isBackUp,isReadOnly);
	this.valueRange.add(range);
}
function ValueRange(subject,value,panelValue,panelSetUrl,isBackUp,isReadonly){
	this.subject = subject;
	this.value = value;
	this.panelValue = panelValue;
	this.panelSetUrl = panelSetUrl;
	this.isBackUp = isBackUp;
	this.isReadOnly = isReadonly;
	this.isSingle = false;
	this.tempValue = this.value;
}
ValueRange.prototype.toHTML = function(id,paramName,selectValue,disabledStr,valuePro,index){
	var result = "";
	var panelName =this.subject;
	var panelValue = this.panelValue;
	if(valuePro){
	  //数据来源名称320前可更改，350后不可更改
		//panelName = valuePro.get(this.value+"_name:"+index)||panelName;
		panelValue = valuePro.get(this.value+"_value:"+index)||panelValue;
	}
	var click = "onclick='panelNotNull(this,\""+paramName+"\");'";
	var check = isValueInString(this.value,selectValue)?'checked':'';
	var displayText = isValueInString(this.value,selectValue)?'':'none';
	
	result += "<tr height='23px' id='"+id+"_tr' onmouseover='showChangePanel(\""+id+"\",true)' onmouseout='showChangePanel(\""+id+"\",false)'><td width='98%' nowrap=\"nowrap\"><label for='"+id+"'>";
	//if(this.isReadOnly){
		//result += "<input type='checkbox' checked='checked' disabled='disabled'><input id='"+ id+"'  type='hidden' select='true' name=\"" + paramName + "\" value=\""+ escapeStringToHTML(this.value,false) +"\">";
	//} else {
		result += "<input id='"+ id+"' "+click+" type='radio' name=\"" + paramName + "\" value=\""+ escapeStringToHTML(this.value,false) +"\" "+check+" " + disabledStr +">";
	//}
	
	result += "<span class='normal'>"+ panelName+"</span><input type='hidden' name='"+paramName+"_"+this.value+"' value='name'><input type='hidden' name='"+paramName+"_"+this.value+"_name' id='"+paramName+"_"+this.value+"_name' value='"+panelName+"'></label>" ;
	if(this.panelSetUrl){
		var valueLength = panelValue?panelValue.split(",").length:0;
		result+=" <input type='text' style=\"display:"+displayText+"\" value='"+$.i18n((valueLength > 0 ? 'section.hasSet' : 'section.hasNoSet'))+"' id='"+paramName+"_"+this.value+"_setvalue' style='width:90px;cursor:pointer;' readonly='readonly' "+disabledStr+" onclick='setPanelValue(this,\""+paramName+"\",\""+this.panelSetUrl+"\",\""+this.value+"\");this.blur();'>" 
				+"<input type='hidden' name='"+paramName+"_"+this.value+"_value' id='"+paramName+"_"+this.value+"_value' value='"+panelValue+"'><input type='hidden' name='"+paramName+"_"+this.value+"' value='value'>";
	}
	result += "</td></tr>";
	//result +="<td width='40%'><span  id='"+ id +"_name' onmouseover='setNameOnfocus(\""+id+"\",true)' onmouseout='setNameOnfocus(\""+id+"\",false)' class='normal hidden'>";
	//删除
	//if(!this.isReadOnly){
	//	result+="<a href=\"javascript:deleteLabel('"+id+"')\">"+$.i18n("remove")+"</a>&nbsp;" ;
	//}
	//修改名称
	//result +="<a href=\"javascript:changeLabelName('"+id+"','"+paramName+"','"+this.value+"')\">"+$.i18n("changeName")+"</a>" ;
	//result += "&nbsp;<span class='normal like-a' title='"+$.i18n("sort_up")+"' onclick='swapRow(this,-1)' style='font-weight:normal;background:url("+v3x.baseURL+"/apps_res/v3xmain/images/up.gif) no-repeat 90% center'>&nbsp;</span>&nbsp;<span class='normal like-a' title='"+$.i18n("sort_down")+"' onclick='swapRow(this,1)' style='font-weight:normal;background:url("+v3x.baseURL+"/apps_res/v3xmain/images/down.gif) no-repeat 90% center'>&nbsp;</span>" +//上移 下移
	//		"</span>" ;
	
	//如果是有类型的页签
	//if(this.isBackUp){
	//	result+="<input type='hidden' name='"+paramName+"_"+this.value+"' value='type'><input type='hidden' name='"+paramName+"_"+this.value+"_type' value='"+escapeStringToHTML(this.tempValue,false)+"'>";
	//}
	//result +="</td></tr>";
	return result;
}
ValueRange.prototype.toOnlyInputHTML = function(id,paramName,selectValue,disabledStr,valuePro,index){
  var result = "";
  var panelName =this.subject;
  var panelValue = this.panelValue;
  if(valuePro){
    //数据来源名称320前可更改，350后不可更改
    //panelName = valuePro.get(this.value+"_name:"+index)||panelName;
    panelValue = valuePro.get(this.value+"_value:"+index)||panelValue;
  }
  var click = "onclick='panelNotNull(this,\""+paramName+"\");'";
  var check = isValueInString(this.value,selectValue)?'checked':'';
  var displayText = isValueInString(this.value,selectValue)?'':'none';
  
  result += "<tr height='23px' id='"+id+"_tr' onmouseover='showChangePanel(\""+id+"\",true)' onmouseout='showChangePanel(\""+id+"\",false)'><td width='100%' nowrap=\"nowrap\"><label for='"+id+"'>";
  
  result += "<input id='"+ id+"' "+click+" type='hidden' name=\"" + paramName + "\" value=\""+ escapeStringToHTML(this.value,false) +"\" "+check+" " + disabledStr +">";
  
  result += "<input type='hidden' name='"+paramName+"_"+this.value+"' value='name'><input type='hidden' name='"+paramName+"_"+this.value+"_name' id='"+paramName+"_"+this.value+"_name' value='"+panelName+"'></label>" ;
  if(this.panelSetUrl){
    var valueLength = panelValue?panelValue.split(",").length:0;
    result+=" <input type='text' style=\"display:"+displayText+"\" value='"+$.i18n((valueLength > 0 ? 'section.hasSet' : 'section.hasNoSet'))+"' id='"+paramName+"_"+this.value+"_setvalue' style='width:90px;cursor:pointer;' readonly='readonly' "+disabledStr+" onclick='setPanelValue(this,\""+paramName+"\",\""+this.panelSetUrl+"\",\""+this.value+"\");this.blur();'>" 
        +"<input type='hidden' name='"+paramName+"_"+this.value+"_value' id='"+paramName+"_"+this.value+"_value' value='"+panelValue+"'><input type='hidden' name='"+paramName+"_"+this.value+"' value='value'>";
  }
  result += "</td></tr>";
  return result;
}
ValueRange.prototype.toSingleHTML = function(id,paramName,valuePro,isCheck){
	var result = "";
	var panelName = this.subject;
	if(valuePro){
		panelName = valuePro.get(this.value+"_name:0") || panelName;
	}
	var check = isCheck? 'checked':'';
	var click = "onclick = 'panelNotNull(this,\""+paramName+"\");'";
	result += "<tr height='23px' id='"+id+"_tr' onmouseover='showChangePanel(\""+id+"\",true)' onmouseout='showChangePanel(\""+id+"\",false)'><td width='98%'><label for='"+id+"'>";
	//if(this.isReadOnly){
	//	result += "<input type='checkbox' id='"+ id+"' checked disabled><input type='hidden' name=\"" + paramName + "\" value=\""+ escapeStringToHTML(this.value,false) +"\">";
	//}else{
		result += "<input id='"+ id+"' \""+click+"\" type='radio' name=\"" + paramName + "\" "+check+" value=\""+ this.value +"\">";
	//}
	result += "<span class='normal'>"+ panelName+"</span>" ;
	if(!this.isSingle){
		result += "<input type='hidden' name='"+paramName+"_"+this.value+"' value='name'><input type='hidden' name='"+paramName+"_"+this.value+"_name' id='"+paramName+"_"+this.value+"_name' value='"+panelName+"'>";
	}
	result += "</label>" 
	result += "</td></tr>";
	//result +="<td width='35%'> <span  id='"+ id +"_name' onmouseover='setNameOnfocus(\""+id+"\",true)' onmouseout='setNameOnfocus(\""+id+"\",false)' class='normal hidden'>";
	//if(this.isSingle){
	//	result+="<a href=\"javascript:deleteLabel('"+id+"')\">"+$.i18n("remove")+"</a>&nbsp;";
	//}
	//if(!this.isSingle){
	//	result += "<a href=\"javascript:changeLabelName('"+id+"','"+paramName+"','"+this.value+"')\">"+$.i18n("changeName")+"</a>&nbsp;" ;
	//}
	//result += "<span class='normal like-a' title='"+$.i18n("sort_up")+"' onclick='swapRow(this,-1)' style='font-weight:normal;background:url("+v3x.baseURL+"/apps_res/v3xmain/images/up.gif) no-repeat 90% center'>&nbsp;&nbsp;</span>&nbsp;<span class='normal like-a' title='"+$.i18n("sort_down")+"' onclick='swapRow(this,1)' style='font-weight:normal;background:url("+v3x.baseURL+"/apps_res/v3xmain/images/down.gif) no-repeat 90% center'>&nbsp;&nbsp;</span>" +//上移 下移
	//		"</span></td></tr>";
	return result;
}
/**
 * 得到选择\没有被选择择的页签
 */
SectionReference.prototype.getSelectPanel = function(value,selected){
	var result = new ArrayList();
	for(var i = 0 ; i < this.valueRange.size();i++){
		var r = this.valueRange.get(i);
		if(isValueInString(r.value,value)){
			if(selected)
				result.add(r);
		}else{
			if(!selected && !r.isBackUp)
				result.add(r);
		}
	}
	return result;
}
/**
 * 得到备选的页签
 */
SectionReference.prototype.getBackUpPanel = function(){
	var result = new ArrayList();
	for(var i = 0 ; i < this.valueRange.size();i++){
		var r = this.valueRange.get(i);
		if(r.isBackUp){
			result.add(r);
		}
	}
	return result;
}

SectionReference.prototype.toHTML = function(valuePro,fragmentId,sectionId,index,isEdit){
  var changeMethodParam = "N_" + fragmentId + "_" + sectionId + "_" + index + "_";
	var paramName = changeMethodParam + this.name;
	var paramNameH = paramName + "_H";
	
	//记录显示值是否为默认值，显示样式为非默认的情况下显示条数输入为空回显对应样式的默认值
	var valueIsDefault = "true";
	
	var referValue = $.i18n(this.defaultValue) || this.defaultValue;
	if(valuePro){
		var v = valuePro.get(this.name + ":" + index);
		if (v && v != ''&&v.toLowerCase()!='null') {
			valueIsDefault = "false";
			referValue = v;
		}
		if (this.name == "slogan" && typeof v != "undefined" &&( v == "" || v.toLowerCase() == "null")) {
      valueIsDefault = "false";
      referValue = v;
    }
	}
	
	var readOnly = this.isReadOnly == true || this.isReadOnly == 'true' || isEdit == false || isEdit == 'false';
	var readOnlyStr = readOnly ? " readOnly " : "";
	var disabledStr = readOnly ? " disabled " : "";
	
	var hiddenStr = "";
	if(this.hiddenValue){
		var hidValue = referValue || this.hiddenValue.defaultValue;
		hiddenStr = "<input type='hidden' name='"+this.hiddenValue.name+"' id='"+this.hiddenValue.name+"' value='"+escapeStringToHTML(hidValue,false)+"'>";
	}
	var vali = " ";
	if(this.validate){
		vali =" validate=\""+this.validate+"\" validates=\""+this.validate+"\" "+(this.validateStr?this.validateStr:'')
	}
	
	var result = "<tr>"
	result	   +=" <td align='right' valign='top' style='width:20%;padding:5px;' id='"+paramName+"_showSubjectTd'>";
	if(this.valueType == 4 && !this.isReadOnly && readOnlyStr==''){
		result +="<a href=\"javascript:addParamImage('"+paramName+"','"+this.hiddenValue.name+"')\">"+this.subject+hiddenStr+"</a>:";
	}else{
		result += ((this.subject != null && this.subject != 'null'&& this.subject != '')?(this.subject+":"):"")+hiddenStr;
	}
	result	   +="</td><td>"
	var clickMethodAndValue = "";
	var clickMethodValue = "";
	if(this.changeMethod){
		clickMethodAndValue = this.changeMethod+"(this,\""+changeMethodParam+"\",false)";
		if(this.changeValue){
			clickMethodValue =" "+this.changeValue;
		}
		afterLoad.add(this.changeMethod+"(document.getElementById('"+paramName+"'),'"+changeMethodParam+"',true)")
	}
	switch(parseInt(this.valueType)){
		//下拉单选
		case 0:
			result += "<select name=\"" + paramName + "\" id=\"" + paramName + "\" class='input-80per' " + disabledStr +vali +" onchange='"+clickMethodAndValue+"' "+clickMethodValue+">";
			for(var i = 0 ; i < this.valueRange.size();i++){
				var range = this.valueRange.get(i);
				var checkStr = range.value == referValue?'selected':'';
				result +="<option value='"+range.value+"' "+checkStr+">"+range.subject+"</option>";
			}
			result += "</select>";
		break;
		//多选checkbox
		case 1:
			for(var i = 0 ; i < this.valueRange.size();i++){
				var range = this.valueRange.get(i);
				var isCheckedStr = isValueInString(range.value, referValue)==true? "checked " : " ";
				var appendStr = "";
				if(range.isReadOnly === true){
					appendStr = " checked disabled ";
				}
				result += "<label for='"+ paramName+i +"' style='margin-bottom:5px;display:block'>";
				var click = "onclick = 'chooseOne(\""+paramName+"\","+this.valueRange.size()+",this,\""+this.valueType+"\",\"\");"+clickMethodAndValue+"' "+clickMethodValue;
				result += "<input style='margin-right:5px' id='"+ paramName +i+"' "+click+" type='checkbox' name=\"" + paramName + "\" value=\""+ escapeStringToHTML(range.value,false) +"\" "+ appendStr+" "+ isCheckedStr + disabledStr +">"+ range.subject;
				if(appendStr){
					result += "<input  type='hidden' name=\"" + paramName + "\" value=\""+ escapeStringToHTML(range.value,false) +"\">";
				}
				result += "</label>";
				if(i != this.valueRange.size()-1){
					//result +="<br>";
				}
			}
		break;
		//input text
		case 2:
			var hiddenName = '';
			if(this.hiddenValue){
				hiddenName = this.hiddenValue.name;
			}
			result += "<input type='text' class='input-80per' valueIsDefault=\"" + valueIsDefault + "\" id=\"" + paramName + "\" name=\"" + paramName + "\" value=\"" + escapeStringToHTML(referValue,false) + "\" " + disabledStr +vali+ " inputName=\""+this.subject+"\" onblur=\"setHiddenValue(this,'"+hiddenName+"');"+clickMethodAndValue+"\" "+clickMethodValue+">";
			result += "<input type='hidden' name=\"" + paramNameH + "\" value=\"" + escapeStringToHTML(referValue,false) + "\">";
		break;
		//input textarea
		case 7:
			result += "<textarea rows='5' class='input-80per' id=\"" + paramName + "\" name=\"" + paramName + "\" " + vali + " inputName=\"" + this.subject + "\">" + referValue + "</textarea>";
		break;
		//日期段-日期选择器（只有月份）
		case 8:
			var beginDate = "";
			var endDate = "";
			if(referValue){
				var dates = referValue.split(",");
				beginDate = dates[0];
				endDate = dates[1];
			}
			result += "<input type=\"text\" id=\"" + paramName + "_S\" name=\"" + paramName + "\" value=\"" + beginDate + "\" class=\"input-date cursor-hand\" onclick=\"selectDates(this, '" + paramName + "')\" readonly>";
			result += " - <input type=\"text\" id=\"" + paramName + "_E\" name=\"" + paramName + "\" value=\"" + endDate + "\" class=\"input-date cursor-hand\" onclick=\"selectDates(this, '" + paramName + "')\" readonly>";
		break;
		case 3:
			result += "<input type='text' class='input-80per cursor-hand' title=\""+ $.i18n("space_section_notSelectLinkSystem") +"\" name=\"Helper_" + paramName + "\" value=\"" + escapeStringToHTML(referValue,false) + "\" onclick=\"selectLinkSystem(this, '"+ paramName +"')\" readOnly>";
			result += "<input type='hidden' id=\"" + paramName + "\" name=\"" + paramName + "\" value=\"" + referValue + "\">";
			break;
		case 4:
			var value = referValue;
			if(value == this.defaultValue){
				value = v3x.baseURL+referValue;
			}else{
				//TODO 这里传过来的是一个long的str
				var values = value.split(",");
				if(values.length == 2){
				  value = v3x.baseURL+"/fileUpload.do?method=showRTE&fileId="+values[0]+"&createDate="+values[1] + "&type=image";
				} else {
				  value = v3x.baseURL + value;
				}
			}
			imgSrc = value;
			var showName = paramName;
			if(this.isReadOnly == true){
				showName = ""
			}
			result +="<iframe name=\"" + paramName + "_show\" id=\"" + paramName + "_show\" class='input-80per' height='95' src='"+ v3x.baseURL+"//showImg.html'></iframe><input type='hidden' id=\"" + showName + "\" name=\"" + showName + "\" value=\"" + referValue + "\">";
			break;
		case 5://页签
			//1.判断是否有缓存的页签。如果有，添加按钮。并且缓存div。2.输出选中的页签。3.输出没有被选中的页签。
			//var backUpList = this.getBackUpPanel();
			
			//这里得到的是已经定义好的页签
			//var checkList  = this.getSelectPanel(referValue,true);
			//得到已经定义。但是没有选择的页签
			//var unCheckList = this.getSelectPanel(referValue,false);
			/*if(!backUpList.isEmpty() && readOnlyStr==''){
				result +="<p id='"+paramName+"_p'>&nbsp;<a href='javascript:showBackUpPanel(\""+fragmentId+"\",\""+sectionId+"\",\""+this.name+"\",\""+paramName+"\")'>"+$.i18n("addPanel")+"</a></p>";
			}*/
			var k = 0;
			result +="<table id='"+paramName+"_table' width='100%'>";
			for(var i=0; i < this.valueRange.size(); i++){
				var range = this.valueRange.get(i);
				var valueRangeReadOnly = range.isReadOnly == true || range.isReadOnly == 'true' || isEdit == false || isEdit == 'false';
			  var valueRangeDisabledStr = valueRangeReadOnly ? " disabled " : "";
				result += range.toHTML(paramName +k,paramName,referValue,valueRangeDisabledStr,valuePro,index);
				k++;
			}
			/*var sp = referValue.split(",");
			for(var i = 0 ; i <sp.length ;i++){
				var isNormal = false;
				for(var j = 0 ; j < checkList.size();j++){
					var range = checkList.get(j);
					if(range.value == sp[i]){
						isNormal = true;
						result += range.toHTML(paramName +k,paramName,referValue,disabledStr,valuePro);
						k++;
					}
				}
				//备选弹出来的页签。
				if(!isNormal){
					var type = valuePro.get(sp[i]+"_type:0");
					if(type){
						for(var kk = 0 ; kk < backUpList.size();kk++){
							var theBackRange = backUpList.get(kk);
							if(theBackRange.value == type){
								var tempValue = theBackRange.value ;
								theBackRange.value = sp[i];
								result += theBackRange.toHTML(paramName +k,paramName,referValue,disabledStr,valuePro);
								theBackRange.value = tempValue;
								k++;
							}
						}
					}
				}
			}
			for(var i = 0 ; i < unCheckList.size();i++){
				var range = unCheckList.get(i);
				result += range.toHTML(paramName +k,paramName,'',disabledStr);
				k++;
			}*/
			result +="</table>";
			break;
		case 6://特殊页签 就是不是系统默认的，自动添加的
			//result+="<p id=\""+paramName+"_p\" setUrl=\""+this.panelSetUrl+"\">&nbsp;<a href='javascript:addSinglePanel(\""+paramName+"\",\""+this.subject+"\")'>"+$.i18n("addPanel")+"</a>";
			var singleValue = valuePro.get("singleBoardPanelValue:"+index);
			result +="<table  width='100%'><tbody id='"+paramName+"_table'>";
			if(singleValue){
				try{
					singleValue = eval(singleValue);
					var allDefault = new ArrayList();
					for(var i = 0 ; i < singleValue.length;i++){
						var single = singleValue[i];
						var range = singlePanel2Range(single,this);
						if(range){
							if(single.isNormal){
								allDefault.add(range);
							}
							//result += range.toSingleHTML(paramName +i,paramName,valuePro,true);
						}
					}
					//追加备选项
					for(var j = 0 ; j < this.valueRange.size();j++){
						var range = this.valueRange.get(j);
						var contain = false;
						for(var i = 0 ; i < allDefault.size();i++){
							var trange = allDefault.get(i);
							 if(trange.value == range.value){
							 	contain = true;
							 	break;
							 }
						}
						if(!contain){
							result += range.toSingleHTML(paramName + j,paramName,valuePro,false);
						}else{
							result += range.toSingleHTML(paramName + j,paramName,valuePro,true);
						}
					}
				}catch(e){}
			}else{
				for(var j = 0 ; j < this.valueRange.size();j++){
					var range = this.valueRange.get(j);
					if(range.value == this.defaultValue){
						result += range.toSingleHTML(paramName + j,paramName,valuePro,true);
					}else{
						result += range.toSingleHTML(paramName + j,paramName,valuePro,false);
					}
				}
			}
			result += "<input type='hidden' name=\""+paramName+"_extends\" value=\""+this.singleBeanId+"\">";
			result +="<tbody></table>";
			break;
		case 9://可点击的input框
      var k = 0;
      result +="<table id='"+paramName+"_table' width='100%'>";
      for(var i=0; i < this.valueRange.size(); i++){
        var range = this.valueRange.get(i);
        var valueRangeReadOnly = range.isReadOnly == true || range.isReadOnly == 'true' || isEdit == false || isEdit == 'false';
        var valueRangeDisabledStr = valueRangeReadOnly ? " disabled " : "";
        result += range.toOnlyInputHTML(paramName +k,paramName,referValue,valueRangeDisabledStr,valuePro,index);
        k++;
      }
      result +="</table>";
      break;
	}
	result += "<input type='hidden' name=\"P_" + fragmentId + "_" + sectionId + "_" + index + "\" value=\"" + this.name + "\">";
	result	  +="  </td>"
	result    += "</tr>";
	function singlePanel2Range(single,refs){
		var range = null;
		if(!single.isNormal){
			if(single.subject){
				range = new ValueRange(single.subject,single.value,'','',false,false);
				range.isSingle = true;
			}
		}else{
			for(var j = 0 ; j < refs.valueRange.size();j++){
				var tempR = refs.valueRange.get(j);
				if(tempR.value == single.value){
					range = new ValueRange(tempR.subject,single.value,'','',false,tempR.isReadOnly);
				}
			}
		}
		return range;
	}
	return result;
}
function panelNotNull(checkbox,paramName){
	var allPanel = document.getElementsByName(paramName);
	if(checkbox && allPanel){
		var count = 0;
		for(var i = 0 ; i < allPanel.length;i++){
			if(allPanel[i].checked || allPanel[i].getAttribute("select")=="true"){
				var value = allPanel[i].value;
				var inputText = document.getElementById(paramName+"_"+value+"_setvalue");
				if(inputText){
					inputText.style.display = "";
				}
				count++;
			}else{
				var value = allPanel[i].value;
				var inputText = document.getElementById(paramName+"_"+value+"_setvalue");
				if(inputText){
					inputText.value = $.i18n("section.hasNoSet");
					inputText.style.display = "none";
				}
				var inputHiddenText = document.getElementById(paramName+"_"+value+"_value");
				if(inputHiddenText){
					inputHiddenText.value = "";
				}
			}
		}
		if(count == 0){
			alert($.i18n("space.must.chooseone"));
			checkbox.checked = "checked";
		}else if( count > 7 ){
			alert($.i18n("panel_length",7));
			checkbox.checked = false;
		}
	}
}
function addSinglePanel(paramName,subject){
	var spaceType = $("#type").val();
	var url = _ctxPath + $('#' + paramName + "_p").attr("setUrl") + "&spaceType=" + spaceType;
	var p = v3x.getElementPosition(document.getElementById(paramName+"_p"));
	var allCheckBox = document.getElementsByName(paramName);
	var singlePanelValue = [];
	if(allCheckBox){
		for(var i = 0;i< allCheckBox.length;i++){
			if(allCheckBox[i].checked){
				singlePanelValue[singlePanelValue.length] = allCheckBox[i].value;
			}			
		}		
	}
	getCtpTop().singlePanelValue = singlePanelValue;
	var valueWindow = $.dialog({
		id: 'addSinglePanel_id',
		title:subject,
		width:560,
		height:450,
		isDrag:true,
		left:450,
		top :150,
		url	:url,
		targetWindow : window.parent,
		buttons:[
			{
				id:"ok",
				text:$.i18n("common.button.ok.label"),
				handler:function(){
					var rv = valueWindow.getReturnValue();
					if(rv && rv[0].length ==0){
						alert($.i18n("space.must.chooseone"));
						return false;
					}else{
						var ids = rv[0];
						var subject = rv[1];
						var table = document.getElementById(paramName+"_table");
						var selectedLength = allCheckBox.length;
						for(var j = 0; j < allCheckBox.length; j++) {
							if(allCheckBox[j].type == 'checkbox' && allCheckBox[j].checked == false) {
								selectedLength --;
							}
						}
						var totalLength = ids.length + selectedLength;
						for(var i = 0 ; i < ids.length;i++){
							if(allCheckBox){
								var hasExists = false;
								for(var j = 0 ; j < allCheckBox.length;j++){
									if(allCheckBox[j].value == ids[i]){
										hasExists = allCheckBox[j].checked;
										break;
									}
								}
								if(hasExists){
									totalLength--;
								}
							}
						}
						if(totalLength >5){
							alert($.i18n("hasSelectOverFlow",selectedLength,(5 - selectedLength)));
							return false;
						}
						for(var i = 0 ; i < ids.length;i++){
							if(allCheckBox){
								var hasExists = false;
								for(var j = 0 ; j < allCheckBox.length;j++){
									if(allCheckBox[j].value == ids[i]){
										hasExists = true;
										allCheckBox[j].checked = 'checked';
										break;
									}
								}
								if(hasExists){
									continue;
								}
							}
							var range = new ValueRange(escapeStringToHTML(subject[i],false),ids[i],'','',false,false);
							range.isSingle = true;
							$(table).append(range.toSingleHTML(paramName +(totalLength+i),paramName,new Properties(),true));
						}
						
						// 清除未选中的原先页签项
						for(var j = 0 ; j < allCheckBox.length;j++){
							if(allCheckBox[j].type == 'checkbox' && allCheckBox[j].checked == false){
								deleteLabel(allCheckBox[j].id);
							}
						}
					}
					valueWindow.close();
				}
			},
			{
				id:"cancel",
				text:$.i18n("common.button.cancel.label"),
				handler:function(){
					valueWindow.close();
				}
			}
		]
	})
}
function checkParam(ele){
	var vf = $(ele).attr("validates");
	if(vf){
		var vs = vf.split(",");
		for(var i = 0 ; i < vs.length ;i++){
			var result = eval(vs[i]+"(ele)");
			if(!result){
				return false;
			}
		}
	}
	return true;
}
function swapRow(el,idx){
	var tb = el.parentNode.parentNode.parentNode.parentNode;
    var row = el.parentNode.parentNode.parentNode.rowIndex;
    idx += row;
    if(idx<0) return false;
    if(idx>=tb.rows.length) false;
    if(tb.rows[Math.max(row,idx)] && tb.rows[Math.min(row,idx)]){
	    tb.insertBefore(tb.rows[Math.max(row,idx)], tb.rows[Math.min(row,idx)]);
    }
}
function addPanel(paramName,vals,sectionId,name,backList){
	//如果已经显示，那么就直接选中，如果没有，就直接添加
	var tableBody = document.getElementById(paramName+"_table").firstChild;
	var trLength = tableBody.children.length;
	
	var result = "";
	for(var j = 0;j<backList.size();j++){
		var range = backList.get(j);
		for(var i = 0;i < vals.length;i++){
			if(range.value == vals[i]){
				var tempValue = range.value;
				range.value = getUUID();
				result += range.toHTML(paramName+trLength,paramName,range.value,'','');
				range.value = tempValue;
			}
		}
	}
	$(tableBody).append(result);
}
/**
 * 查看备选的页签
 */
function showBackUpPanel(fragmentId,sectionId,name,paramName){
	
	//判断已经添加的页签
	var sectionPro = sectionPros.get(sectionId);
	var checkBox = document.getElementsByName(paramName);
	var checkList = new ArrayList();
	for(var i = 0 ; i < checkBox.length;i++){
		if(checkBox[i].checked || checkBox[i].getAttribute("select")=="true"){
			checkList.add(checkBox[i].value)
		}
	}
	if(checkList.size()>=7){
		alert($.i18n("panel_length",7));
		return ;
	}
	var p = v3x.getElementPosition(document.getElementById(paramName+"_p"));
	if(sectionPro){
		var refs = sectionPro.searchRef(name);
		if(refs){
			var backList = refs.getBackUpPanel();
			var height = 100+(backList.size() * 20);
			var html = "<ul>";
			for(var i = 0;i<backList.size();i++){
				var range = backList.get(i);
				html +="<li style='list-style:none'>";
				var check = (i==0)?'checked':'';
				html +="<label for='backUpPanel"+i+"'><input type='radio' "+check+" name='backUpPanle' id='backUpPanel"+i+"' value=\""+range.value+"\">"+range.subject+"</lable>";
				html +="</li>";
			}
			html +="</ul>";
			var nameWindow = new MxtWindow({
				id: 'showBackUpPanel_id',
				title:$.i18n("addPanel"),
				width:220,
				height:height,
				left:p.x,
				top :p.y,
				html:html,
				isDrag:true,
				model:true,
				buttons:[
					{
						id:"ok",
						text:$.i18n("MainLang.okbtn"),
						handler:function(){
							var selectValue = document.getElementsByName("backUpPanle");
							var values = [];
							for(var i = 0 ; i < selectValue.length;i++){
								if(selectValue[i].checked){
									values[values.length] = selectValue[i].value;
								}
							}
							addPanel(paramName,values,sectionId,name,backList);
							nameWindow.close();
						}
					},
					{
						id:"cancel",
						text:$.i18n("cancelbtn"),
						handler:function(){
							nameWindow.close();
						}
					}
				]
			});
		}
	}
}
function isValueInString(checkStr, allStr){
	var arr = allStr.split(",");
	for(var i=0; i<arr.length; i++){
		if(arr[i] == checkStr||arr[i]==$.i18n(checkStr)){
			return true;
		}
	}
	return false;
}
function setNameOnfocus(id,isFocus){
	var a = $("#"+id+"_name");
	if(isFocus){
		a.attr("f","true");
	}else{
		a.attr("f","false");
	}
}
/**
 * 修改页签名称
 */
function showChangePanel(li,hidden){
	var a = $("#"+li+"_name");
	if(hidden){
		a.show();
	}else{
		setTimeout("hiddenPanel('"+li+"')",100);
	}
}
function hiddenPanel(id){
	var a = $("#"+id+"_name");
	if(a.attr("f") != "true"){
		a.hide();
	}
}

//删除页签
function deleteLabel(id){
	var tr = document.getElementById(id+"_tr");
	var tbody = tr.parentNode;
	tbody.removeChild(tr);
}
/**
 * 修改页签名称
 */
function changeLabelName(id,paramName,value){
	var ele = document.getElementById(id+"_name");
	var p = v3x.getElementPosition(ele.parentNode.parentNode);
	var name =$("#"+paramName+"_"+value+"_name").val();
	var html = "<div style='margin:10px'><input class='input-60per' name='setName' id='setName' maxLength='6' value="+name+"></div>";
	var nameWindow = $.dialog(
	{
		id: 'changeLabelName_id',
		title:$.i18n("changeName"),
		width:220,
		height:120,
		left:p.x,
		target:window,
		top:p.y,
		isDrag:true,
		html:html,
		buttons:[
			{
				id:"ok",
				text:$.i18n("common.button.ok.label"),
				handler:function(){
					var v = $("#setName").val();
					if(v.getBytesLength > 10){
						alert($.i18n("name_limit_size",5));
						return false;
					}
					$(ele.parentNode.previousSibling).find("span").text(v);
					$("#"+paramName+"_"+value+"_name").val(v);
					nameWindow.close();
				}
			},
			{
				id:"cancel",
				text:$.i18n("common.button.cancel.label"),
				handler:function(){
					nameWindow.close();
				}
			}
		]
	});
}
/** 绩效分析 **/
function trim(str){  
	if(!str || typeof str != 'string') 
		return null;   
	return str.replace(/^[\s]+/,'').replace(/[\s]+$/,'').replace(/[\s]{2,}/,' ');
}
//项目进度统计样式
function gChange(obj, paramName, isOnload){
	if(obj.value == 2){
		$("#"+paramName+"showNumber").removeAttr("disabled");
	}else{
		$("#"+paramName+"showNumber").attr("disabled","disabled");
	}
}
/** 绩效分析结束 **/
var paramValue;
function setPanelValue(ele,paramName,setUrl,panelValue){
	var entityId = ele.form.entityId.value;
	var ordinal = ele.form.tab.value;
	if(!setUrl) return ;
	if(setUrl.indexOf("deeSectionController")!=-1){
		setUrl = setUrl+"&entityId="+entityId+"&ordinal="+ordinal;
	}
	setUrl = setUrl.startsWith("/")?setUrl:'/'+setUrl;
	var url = _ctxPath +setUrl;
	var p = v3x.getElementPosition(ele);
	var title = $("#"+paramName+"_showSubjectTd").text();
	paramValue = $("#"+paramName+"_"+panelValue+"_value").val();
	getCtpTop().paramValue = paramValue;
	var width = 570;
	var height = 470;
	var tempSelectFlag = false;
	//选人界面调整选人界面的高宽
	if(setUrl.indexOf("SelectPeople")!=-1){
	  var params = setUrl.split("&");
	  var panels;
	  var selectType;
	  var showMe;
	  if(params!=null&&params.length>0){
	    for(var i=0; i<params.length; i++){
  	    var param = params[i];
  	    if(param.indexOf("Panels")>=0){
  	      panels = param.split("=")[1];
  	    }
  	    
  	    if(param.indexOf("SelectType")>=0){
  	      selectType = param.split("=")[1];
  	    }
  	    
  	    if(param.indexOf("ShowMe")>=0){
  	      showMe = "true" == (param.split("=")[1]);
  	    }
	    }
	  }
		$.selectPeople({
		  panels: panels,
		  selectType : selectType,
		  showMe : showMe,
	    params : {
	      value : paramValue
	    },
	    callback : function(ret) {
	      $("#"+paramName+"_"+panelValue+"_value").val(ret.value);
        $("#"+paramName+"_"+panelValue+"_setvalue").val($.i18n((ret.text ? "section.hasSet" : "section.hasNoSet")));
	    }
		});
		return;
	}
	if(setUrl.indexOf("/taskmanage/taskshowinfo.do?method=showImportantProgram")!=-1){
        width = 550;
        height = 100;
    }
    if(setUrl.indexOf("/taskmanage/taskshowinfo.do?method=showRoleInfo") != -1){
        width = 290;
        height = 122;
    }
    if(setUrl.indexOf("/taskmanage/taskshowinfo.do?method=appointTask") != -1){
        width = 900;
    }
    //协同立方/协同360°选人设置
    if(setUrl.indexOf("/colCube/colCube.do?method=goCollCubePortal") != -1){
        width = 692;
		height = 530;
    }
	//绩效分析基础保镖和综合报表
	if(setUrl.indexOf("/performanceReport/performanceQuery.do?method=queryMain")!=-1){
		width=700;
		height=250;
		if(paramValue.indexOf("reportId")!=-1){
			var reportIdStr= paramValue.substring(paramValue.indexOf("reportId")).split("=");
			if(!$.isNull(reportIdStr)){
				var reportId=reportIdStr[1];
				//任务燃尽图/项目进度统计
				if(reportId==2922611975991610507||reportId==9081960473256084643){
					width=550;
					height=140;
				}
				//知识增长趋势
				if(reportId==8963724485985847875){
					width=550;
				}
			}
		}
		url+="&paramValue="+paramValue+"&fromPortal=1&ordinal="+ordinal+"&entityId="+entityId;
	}
	//绩效分析流程绩效
	if(setUrl.indexOf("/performanceReport/performanceSectionController.do?method=performanceProcess")!=-1){
		width=700;
		height=300;
		url+="&ordinal="+ordinal+"&entityId="+entityId;
	}
	if(setUrl.indexOf("plan.do?method=showConditionPanel")!=-1){
    width = 500;
    height = 200;
  }

	if(setUrl.indexOf("collaboration")!=-1 || setUrl.indexOf("edoc")!=-1 || setUrl.indexOf("templete.do?method=showPortalCatagory")!=-1 || setUrl.indexOf("project.do?method=showDesignated")!=-1 || setUrl.indexOf("relateMember.do?method=showDesignated")!=-1) {
		width = 400;
		height = 300;
	}
	
	var valueDialog = $.dialog({
      id: 'setPanelValue_id',
      url: url,
      title: title,
      width:width,
      height:height,
      transParams:paramValue,
      targetWindow : window.parent,
      buttons: [{
          id:"ok",
          text: $.i18n('common.button.ok.label'),
          handler: function () {
            var rv = valueDialog.getReturnValue();
            if(rv && rv!=null && rv.length>0){
              if(rv[0].length < 1){
                alert($.i18n("space.must.chooseone"));
                return;
              }
              
              if(rv[0].length > 100){
                alert($.i18n("overSlelect",rv[0].length));
                return;
              }
              var value = rv[0].join(",");
              $("#"+paramName+"_"+panelValue+"_value").val(value);//key
              $("#"+paramName+"_"+panelValue+"_setvalue").val($.i18n((rv[0].length > 0 ? "section.hasSet" : "section.hasNoSet")));
              valueDialog.close();
            }
          }
        }, {
          id:"cancel",
          text: $.i18n('common.button.cancel.label'),
          handler: function () {
            valueDialog.close();
          }
      }]
    });
}
/**
* Portlet参数类
* @Deprecated
*/
function PortletParam(fragmentId, sectionId, index, name, subject, valueType, defaultValue, isReadOnly, valueRange, paramValue,id,hiddenValue){
	this.fragmentId = fragmentId;
	this.sectionId = sectionId;
	this.index = index;
	this.name = name;
	this.subject = subject;
	this.valueType = valueType;
	this.defaultValue = defaultValue;
	this.isReadOnly = isReadOnly || false;
	this.valueRange = valueRange;
	this.paramValue = paramValue || "";
	this.id = id;//文档栏目增加 文档id
	this.hiddenValue = hiddenValue ||"";
}
var pageCanEdit;
//@Deprecated
PortletParam.prototype.toHTML = function(){
	var paramName = "N_" + this.fragmentId + "_" + this.sectionId + "_" + this.index + "_" + this.name;
	var valueStr = this.paramValue;
	if(valueStr == null || valueStr == ""){
		valueStr = $.i18n(this.defaultValue) ||this.defaultValue ;
	}
	var readOnlyStr = this.isReadOnly || (pageCanEdit && pageCanEdit=='false') || $("#toDefault").val() == "true"? "readOnly" : "";			
	var disabledStr = this.isReadOnly || (pageCanEdit && pageCanEdit=='false') || $("#toDefault").val() == "true"? "disabled" : "";

	//隐藏的值
	var hiddenValueStr = "";
	var hiddenName = "";
	if(this.hiddenValue){
		var strs = this.hiddenValue.split("|");
		hiddenName = strs[0];
		if(hiddenName){
			var hiddenValue = valueStr || strs[1] ;
			hiddenValueStr +="<input type='hidden' id='"+hiddenName+"' name='"+hiddenName+"' value='"+hiddenValue+"'>";
		}
	}
	var str = "<tr><td align='right' class='param-name'>"  ;
	if(this.valueType == 4){
		if(!this.isReadOnly && readOnlyStr=='')
			str +="<a href=\"javascript:addParamImage('"+paramName+"','"+hiddenName+"')\">"+this.subject+"</a>:";
	}else{
		str += ((this.subject != null && this.subject != 'null'&& this.subject != '')?(this.subject+":"):"");
	}
	str	+= " </td><td>";
	switch(this.valueType){
		case 0://单选
			str += "<select name=\"" + paramName + "\" class='input-100per' " + disabledStr + ">";
			var allOptions = this.valueRange.split(",");
			for(var j=0; j<allOptions.length; j++){
				var temp = allOptions[j].split("|");
				var isCheckStr = temp[1]==valueStr? "selected" : "";
				str += "<option value=\""+ temp[1] +"\" "+ isCheckStr +">"+ temp[0] +"</option>";
			}
			str += "</select>";
			break;
		case 5:
			str+=hiddenValueStr;
		case 1://多选
			var options = this.valueRange.split(",");
			var showName = paramName;
			if(this.isReadOnly == true){
				showName = "_"
			}
			for(var j=0; j<options.length; j++){
				var temp = options[j].split("|");
				var isCheckedStr = isValueInString(temp[1], valueStr)==true? "checked " : " ";
				str += "<label for='"+ paramName+j +"'>";
				var click = "onclick = 'chooseOne(\""+paramName+"\","+options.length+",this,\""+this.valueType+"\",\""+hiddenName+"\");'";
				str += "<input id='"+ paramName +j+"' "+click+" type='checkbox' name=\"" + showName + "\" value=\""+ temp[1] +"\" "+ isCheckedStr + disabledStr +">"+ temp[0];
				str += "</label>&nbsp;&nbsp;";
			}
			break;
		case 2://输入框
			var showName = paramName;
			if(this.isReadOnly == true){
				showName = ""
			}
			str += "<input type='text' class='input-100per' name=\"" + showName + "\" value=\"" + valueStr + "\" " + readOnlyStr + " onblur=\"setHiddenValue(this,'hiddenName')\">";
			str +=hiddenValueStr;
			break;
		case 3://弹出选择关联系统
			str += "<input type='text' class='input-100per cursor-hand' title=\""+ _("sysMgrLang.space_section_notSelectLinkSystem") +"\" name=\"Helper_" + paramName + "\" value=\"" + valueStr + "\" onclick=\"selectLinkSystem(this, '"+ paramName +"')\" readOnly>";
			str += "<input type='hidden' id=\"" + paramName + "\" name=\"" + paramName + "\" value=\"" + valueStr + "\">";
			break;
		case 4:
			var value = valueStr;
			if(value == this.defaultValue){
				value = v3x.baseURL+valueStr;
			}else{
				//TODO 这里传过来的是一个long的str
				var values = value.split(",");
				value = v3x.baseURL+"/fileUpload.do?method=showRTE&fileId="+values[0]+"&createDate="+values[1] + "&type=image";
			}
			imgSrc = value;
			var showName = paramName;
			if(this.isReadOnly == true){
				showName = ""
			}
			str +="<iframe name=\"" + paramName + "_show\" id=\"" + paramName + "_show\" width='490' height='95' src='"+ v3x.baseURL+"//showImg.html'></iframe><input type='hidden' id=\"" + showName + "\" name=\"" + showName + "\" value=\"" + valueStr + "\">";
			str +=hiddenValueStr;
	}
	str += "<input type='hidden' name=\"P_" + this.fragmentId + "_" + this.sectionId + "_" + this.index + "\" value=\"" + this.name + "\">";
	if(this.isReadOnly == true){
		str +="<input type='hidden' name='"+paramName+"' value='"+valueStr+"'>";
	}
	str += "</td></tr>";
	//判断某个值是否在字符串中
	function isValueInString(checkStr, allStr){
		var arr = allStr.split(",");
		for(var i=0; i<arr.length; i++){
			if(arr[i] == checkStr){
				return true;
			}
		}
		return false;
	}
	return str;
}
function setHiddenValue(input,hiddenName){
	 if(hiddenName)
		$('#'+hiddenName).val(input.value);
}
function addParamImage(id,hiddenName){
	 fileUploadQuantity = 1;
	 insertAttachment();
	 if(fileUploadAttachments.isEmpty())
   	 {
       return ;
     }
     var imgAtt = fileUploadAttachments.values().get(0);
     var value = "/fileUpload.do?method=showRTE&fileId="+imgAtt.fileUrl+"&createDate="+imgAtt.createDate.substring(0, 10) + "&type=image";
	 var imgURL = v3x.baseURL+"/fileUpload.do?method=showRTE&fileId="+imgAtt.fileUrl+"&createDate="+imgAtt.createDate.substring(0, 10) + "&type=image";
     fileUploadAttachments.clear();
     imgSrc = imgURL;
     document.getElementById(id + "_show").contentWindow.location.reload(true);
     $('#'+id).val(imgAtt.fileUrl+","+imgAtt.createDate.substring(0, 10));
     if(hiddenName)
     	$('#'+hiddenName).val(imgAtt.fileUrl+","+imgAtt.createDate.substring(0, 10));
     
}
	//复选框必须选择一个
function chooseOne(paramName,count,resource,valueType,hiddenName){
	var checkedCount = 0;
	for(var i = 0 ; i < count ; i ++){
		var param = document.getElementById(paramName+i);
		if(param.checked){
			checkedCount ++;
			break;
		}
	}
	if(checkedCount == 0){
		if(valueType != "5"){
			alert($.i18n("space.must.chooseone"));
			resource.checked = true;
			return false;
		}else{
			if(hiddenName){
				$('#'+hiddenName).val("");
			}
		}
	}else{
		if(hiddenName){
			$('#'+hiddenName).val("1");
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
			url : v3x.baseURL + "/space.do&method=linkSystemSelector&id=" + linkSystemId,
			width : "360",
			height : "480",
			scrollbars : "false"
		});
	if(returnval){
		paramNameInput.value = returnval[0];
		obj.value = returnval[1];
	}
}
/*******显示下拉菜单*********/
var portalSectionHander = {
	currentEditSection :"",
	
	showSectionMenu : function (id){
		//判断是否可以进行操作
		portalSectionHander.currentEditSection = id;
		var position = v3x.getElementPosition(document.getElementById("show_edit_div"+id));
		if(document.getElementById("show_edit_div"+id)){document.getElementById("show_edit_div"+id).className='sectionTitleMenu_sel';}
		var container = portalSectionHander.getMenuDiv();
		container.innerHTML = portalSectionHander.getMenuHTML(id);
		$(container).css("left", (position.x-58)+"px");
		$(container).css("top", (position.y+23)+"px");
		$(container).show();
		var ss = document.getElementById("show_edit_div"+id);
		ss.onmouseout = function(){
			if(document.getElementById("show_edit_div"+portalSectionHander.currentEditSection)){document.getElementById("show_edit_div"+portalSectionHander.currentEditSection).className='sectionTitleMenu';}
			var menuDiv_protal = document.getElementById("menuDiv_protal");
			menuDiv_protal.style.display = "none";
		}
	},
	getMenuDiv		: function(){
		var menuDivId = "menuDiv_protal";
		var div = document.getElementById(menuDivId);
		if(!div){
			var div = document.createElement("div");
			div.id = menuDivId;
			div.className = "section-menu_div";
			div.style.height = "50px";
			div.onmouseout = function(){
				if(document.getElementById("show_edit_div"+portalSectionHander.currentEditSection)){document.getElementById("show_edit_div"+portalSectionHander.currentEditSection).className='sectionTitleMenu';}
				this.style.display = "none";
			}
			div.onmouseover = function(){
				if(document.getElementById("show_edit_div"+portalSectionHander.currentEditSection)){document.getElementById("show_edit_div"+portalSectionHander.currentEditSection).className='sectionTitleMenu_sel';}
				this.style.display = "";
			}
			document.body.appendChild(div);
		}
		return div;
	},
	//得到栏目可以操作的菜单
	getMenuHTML	   : function(id){
		var str = "";
		var sectionPanel = sectionHandler.allSectionPanels[id];
		if(sectionPanel){
			str+="<table align='center' cellspacing='0' cellpadding='0' width='100%'>";
			str+="<tr><td class='downMenu_t_l' height='6'>&nbsp;</td><td class=''><div class='downMenu_t_m' style='width:53px;float:left;'></div></td><td class='downMenu_r'>&nbsp;</td></tr>";
			str+="<tr><td class='downMenu_l' bgcolor='#ffffff'>&nbsp;</td><td><table width='100%' align='center' cellspacing='0' cellpadding='0' bgcolor='#ffffff'>";
			//section编辑
			if(sectionPanel.isReadOnly.toString()=="false" && sectionPanel.hasParam =="true"){
				str+="<tr><td height='25' onmouseover=\"javascript:this.className='cell_menu_item_bg'\" onclick=\"portalSectionHander.loadSectionPro('"+id+"')\" onmouseout=\"javascript:this.className='cell_menu_item_bg_null'\"  align='center'>"+$.i18n("edit")+"</td></tr>";
			}
			//section删除
			str+="<tr><td  height='25' onmouseover=\"javascript:this.className='cell_menu_item_bg'\" onclick=\"portalSectionHander.deleteFragment('"+id+"')\" onmouseout=\"javascript:this.className='cell_menu_item_bg_null'\" align='center'>"+$.i18n("remove")+"</td></tr>";
			str+="</table><td class='downMenu_r' bgcolor='#ffffff'>&nbsp;</td></tr>";
			str+="<tr><td class='downMenu_b_l'>&nbsp;</td><td class='downMenu_b_m'>&nbsp;</td><td class='downMenu_b_r'>&nbsp;</td></tr>";
			str+="</table>"
			
			/**
			
			str += "<ul style='list-style:none;'>";
			if(sectionPanel.isReadOnly.toString()=="false" && sectionPanel.hasParam =="true"){
				str	+="<li style='margin:5px;'><a href=\"javascript:portalSectionHander.loadSectionPro('"+id+"')\">"+$.i18n("edit")+"</a></li>";
			}
			str	+="<li style='margin:5px;'><a href=\"javascript:portalSectionHander.deleteFragment('"+id+"')\">"+$.i18n("remove")+"</a></li>";
			str +="</ul>";
			**/
			
			
		}
		return str;
	},
	toggleSection : function(nodeId){
	  if($("#editDiv"+nodeId).html() == ""){
	    //如果不是编辑状态
  		$("#"+nodeId).toggle();
  		$("#footer"+nodeId).toggle();
  		$("#section_show"+nodeId).toggleClass("show hide");
	  }
//		try{
//			var objTemp = document.getElementById("editDiv"+nodeId);
//			if(objTemp){
//				if(objTemp.innerHTML!=''){return;}
//			}
//		}catch(e){}
//		var className = $("#section_show"+nodeId).attr("class");
//		if(className == "section-show-hidden"){
//			$("#section_show"+nodeId).attr("class","section-show-show");
//		}else{
//			$("#section_show"+nodeId).attr("class","section-show-hidden");
//		}
//		$("#panelDiv"+nodeId).toggle();
//		$("#"+nodeId).toggle();
	},
	loadSectionPro:function(id){
		var panel = sectionHandler.allSectionPanels[id];
		var nodeId = panel.nodeId;
		var tagertPanelId = null;
		var tagertIndex = null;
		if(panel.len>1){
			$("li[id^='section_name_total"+panel.nodeId+"']").each(function(i,obj){
				var currentSpanId = "Text"+panel.nodeId+"_"+i;
				var css = $(obj).attr("class");
				if(css.indexOf('current')>=0){
					tagertIndex = i;
					tagertPanelId = $("#"+panel.nodeId+"_"+i).attr("panelId");
				}else{
					var nPanelId = $("#"+panel.nodeId+"_"+i).attr("panelId");
					var hideSection = sectionHandler.allSections[nPanelId];
					if(!hideSection) return;
					var nEditDiv = $("#editDiv"+hideSection.nodeId);
					if(nEditDiv.children().length > 0){
						nEditDiv.children().remove();
					}
				}
			});
		}else{
			tagertIndex = 0;
			tagertPanelId = $("#"+panel.nodeId+"_"+tagertIndex).attr("panelId");
		}
		
		
		var section = sectionHandler.allSections[tagertPanelId];
		if(!section){
			var tagertPanel = sectionHandler.allSectionPanels[tagertPanelId];
			section = new Section(tagertPanel.id, tagertPanel.sectionId, tagertPanel.sectionBeanId, tagertPanel.nodeId, tagertPanel.index, tagertPanel.len, tagertPanel.entityId, tagertPanel.ordinal, tagertPanel.x, tagertPanel.y,tagertPanel.singleBoardId);
			sectionHandler.allSections[tagertPanelId] = section;
		}
		try{
			var className = $("#section_show"+section.nodeId).attr("class");
			if(className == "hide"){
				$("#section_show"+section.nodeId).attr("class","show");
			}
		}catch(e){}
		var editDiv = $("#editDiv"+section.nodeId);
		$("#panelDiv"+section.nodeId).hide();
		$("#"+section.nodeId).hide();
		$("#editDiv"+section.nodeId).show();
		/*if(editDiv.children().length !=0){
			$("#editDiv"+section.nodeId).show();
			return;
		}*/
		var sectionRegisterMgr = new sectionRegisterManager();
		var existsSection = true;
    if(sectionPros.get(section.sectionBeanId)){
      existsSection = false;
    }
		sectionRegisterMgr.getFragmentProp(section.entityId,section.sectionBeanId,spaceType,existsSection,ownerId,{
		  success : function(result){
		    if(result){
		      try{
		        eval(result);
		        var action = _ctxPath + "/portal/spaceController.do?method=updateProperty";
		        var sectionPro = sectionPros.get(section.sectionBeanId);
		        var paramHTML ="<form action=\""+action+"\" id=\"EditForm_"+section.entityId+"_\" method='post' >";
		        paramHTML+= sectionPro.toHTML(property,section.entityId,section.ordinal,true);
		        var hiddenValueStr = "<input type='hidden' name='S_"+section.entityId+"' value='"+property.get("sections")+"'>";
		        hiddenValueStr+="<input type='hidden' name='entityId'  value='"+section.entityId+"'>";
		        hiddenValueStr+="<input type='hidden' name='spaceId'  value='"+spaceId+"'>";
		        hiddenValueStr+="<input type='hidden' name='spaceType' value='"+trueSpaceType+"'>";
		        hiddenValueStr+="<input type='hidden' name='x' value='"+section.x+"'>";
		        hiddenValueStr+="<input type='hidden' name='y' value='"+section.y+"'>";
		        hiddenValueStr+="<input type='hidden' name='tab' value='"+section.ordinal+"'>";
		        hiddenValueStr+="<input type='hidden' name='showState' value='"+$("#showState").val()+"'>";
		        hiddenValueStr+="<input type='hidden' name='editKeyId' value='"+$("#editKeyId").val()+"'>";
		        //增加一个隐藏的无意义的文本框来阻止自动提交表单
		        hiddenValueStr+="<input type='text' style='display:none;'>";
		        if(property.get("singleBoardId:"+section.ordinal)){
		          hiddenValueStr+="<input type='hidden' name='P_" + section.entityId + "_" + section.sectionBeanId + "_"+section.ordinal+"' value='singleBoardId'>";
		          hiddenValueStr+="<input type='hidden' name='N_" + section.entityId + "_" + section.sectionBeanId + "_"+section.ordinal+"_singleBoardId' value='" + escapeStringToHTML(property.get("singleBoardId:"+section.ordinal),false) + "'>";
		        }
		        paramHTML +="<table width='100%' style='border-top:1px #d2d2d2 solid;'><tr><td align='right' style='padding:5px;'>"+hiddenValueStr+"<input class='button-default-2' type='button' id='"+section.entityId+"_submit' onclick=\"portalSectionHander.updateFrameProp('"+section.entityId+"','"+section.id+"')\" value='"+$.i18n("common.button.ok.label")+"'>&nbsp;&nbsp;&nbsp;<input class='button-default-2' id='"+section.entityId+"_cancel' type='button' onclick=\"portalSectionHander.cancelEdit('"+id+"')\" value='"+$.i18n("common.button.cancel.label")+"'></td></tr></table>";
		        paramHTML +="</form>";
		        $("#editDiv"+section.nodeId).html(paramHTML);
		        portalSectionHander.evalMethodAfterToHTML();
		        $("#footer"+section.nodeId).hide();
		      }catch(e){
		        alert(e);
		      }
		    }
	    }
		});
	},
	cancelEdit : function(id){
		var section = sectionHandler.allSections[id];
		$("#editDiv"+section.nodeId).html("");
		$("#editDiv"+section.nodeId).hide();
    	$("#panelDiv"+section.nodeId).show();
    	if($("#showState").val()!="show"){
    		$("#"+section.nodeId).hide();
    		$("#footer"+section.nodeId).hide();
    	}else{
    		$("#"+section.nodeId).show();
    		$("#footer"+section.nodeId).show();
    	}
		
	},
	updateFrameProp : function(fragmentId,id){
		//前台个性化操作，先确认空间是否存在
		  var result = isThisSpaceExist();
		  if(!result){
			  return;
		  }
		var updateForm = $('#EditForm_'+fragmentId+"_");
		var textInputs = $(":text,textarea", updateForm);
		for (var i=0; i<textInputs.length; i++) {
			if (!checkParam(textInputs[i])) {
				return;
			}
		}
		$('#'+fragmentId+"_submit").attr("disabled","disabled");
		$('#'+fragmentId+"_cancel").attr("disabled","disabled");
		//startProc("");
		var isChangedIndex = $("#isChangedIndex").val();
		if(isChangedIndex=="changed"){
			ajaxUpdateLayoutIndex();
		}
		updateForm.jsonFormSubmit({callback:function(data){
		  var section = sectionHandler.allSections[id];
      var jsonData = $.parseJSON(data);
      var showState = $("#showState").val();
      if(jsonData.result == 'true'){
        if(showState=="show"){
          showSection(id,true);
          $("#section_show"+section.nodeId).removeClass("hide").addClass("show");
          $("#"+section.nodeId).show();
          $("#footer"+section.nodeId).show();
          $("#editDiv"+section.nodeId).hide();
        }else{
          $("#editKeyId").val(jsonData.editKeyId);
          //栏目缩放图标显示为收缩
          document.location.href=pagePath+"?showState="+showState+"&spaceId="+spaceId+"&editKeyId="+jsonData.editKeyId+"&decorationId="+$("#decorationId").val()+"&isChangedIndex="+$("#isChangedIndex").val()+"&d="+(new Date());
        }
        //删除form
        updateForm.remove();
      }else{
        if(spaceType == "cooperation_work" || spaceType == "objective_manage" || spaceType == "edoc_manage" || spaceType == "meeting_manage" || spaceType == "performance_analysis" || spaceType == "form_application"){
          document.location.href=jsonData.pagePath+"?showState="+showState+"&d="+(new Date());
        } else {
          getCtpTop().refreshNavigation(spaceId);
        }
      }
      //getA8Top().endProc();
		}});
	},
	/**
	 * 前端删除
	 */
	deleteFragment:function(id){
		//前台个性化操作，先确认空间是否存在
		  var result = isThisSpaceExist();
		  if(!result){
			  return;
		  }
		var showState = $("#showState").val();
		//var result = confirm($.i18n("resource.del.confirm"));
		//var result = false;
		 $.confirm({
		    'msg': $.i18n("resource.del.confirm"),
		    ok_fn: function () { 

  		var isChangedIndex = $("#isChangedIndex").val();
  		if(isChangedIndex=="changed"){
  			ajaxUpdateLayoutIndex();
  		}
		//if(result){
			var panel = sectionHandler.allSectionPanels[id];
			var section = sectionHandler.allSections[id];
			var panels = [];
			var entityId = panel.entityId;
			var x = panel.x;
			var y = panel.y;
			//var fragment = fragments[y][x];
			var nodeId = panel.nodeId;
			var tagertPanelId = null;
			var tagertIndex = null;
			if(panel.len>1){
				$("li[id^='section_name_total"+panel.nodeId+"']").each(function(i,obj){
					var currentSpanId = "Text"+panel.nodeId+"_"+i;
					var css = $(obj).attr("class");
					if(css.indexOf('current')>=0){
						tagertIndex = i;
						tagertPanelId = $("#"+panel.nodeId+"_"+i).attr("panelId");
					}else{
						var downIndexPanelId = $("#"+panel.nodeId+"_"+i).attr("panelId");
					}
				});
			}else{
				tagertIndex = 0;
				tagertPanelId = $("#"+panel.nodeId+"_"+tagertIndex).attr("panelId");
			}
			var tagertPanel = sectionHandler.allSectionPanels[tagertPanelId];
			$.ajax({
				  url:_ctxPath + "/portal/spaceController.do?method=deleteFrament&entityId="+entityId+"&spaceType="+trueSpaceType+"&spaceId="+spaceId+"&x="+x+"&y="+y+"&pagePath="+pagePath+"&showState="+showState+"&editKeyId="+$("#editKeyId").val()+"&index="+tagertPanel.ordinal,
				  type:'POST',
				  success:function(obj){
					var json = jQuery.parseJSON(obj);
					if(showState=="show"){
					  if(spaceType == "cooperation_work" || spaceType == "objective_manage" || spaceType == "edoc_manage" || spaceType == "meeting_manage" || spaceType == "performance_analysis" || spaceType == "form_application"){
		          document.location.href=json.pagePath+"?showState="+showState+"&d="+(new Date());
		        } else {
		          if(pagePath != json.pagePath){
	              getCtpTop().refreshNavigation(spaceId);
	            }else{
	              document.location.href=json.pagePath+"?showState="+showState+"&d="+(new Date());
	            }
		        }
					}else	if(showState=="view"){
						document.location.href=json.pagePath+"?showState="+showState+"&d="+(new Date());
					}else{
						document.location.href=json.pagePath+"?showState="+$("#showState").val()+"&editKeyId="+json.editKeyId+"&isChangedIndex="+$("#isChangedIndex").val()+"&decorationId="+$("#decorationId").val()+"&d="+(new Date());
					}
				  }
				});
		//}
      }
		 });
	},
	evalMethodAfterToHTML:function(){
		for(var i = 0 ; i <afterLoad.size();i++){
			var m = afterLoad.get(i);
			try{
				eval(m);
			}catch(e){}
		}
		afterLoad.clear();
	},
	//为fragment添加section
	addSectionsToFrag:function(id){
		//前台个性化操作，先确认空间是否存在
		  var result = isThisSpaceExist();
		  if(!result){
			  return;
		  }
		var showState = $("#showState").val();
		//ajax保存布局数据
		if("show"!=showState){
		  ajaxUpdateLayoutIndex();
		}
		//section.entityId为fragmentId,section.nodeId为显示页面的Div的Id
		var panel = sectionHandler.allSectionPanels[id];
		var entityId = panel.entityId;
		var x = panel.x;
		var y = panel.y;
		var isMulti = true;
		var single = false;
		var sectionSelectDialog = $.dialog({
      url : _ctxPath + "/portal/spaceController.do?method=portletSelector&x="+x+"&y="+y+"&count=3&entityId="+entityId+"&spaceType="+spaceType+"&isMulti="+isMulti+"&single="+single+"&pagePath="+pagePath+"&spaceId="+spaceId+"&ownerId="+ownerId,
      width : 710,
      height : 460,
      title : $.i18n('menu.space.personalConfig'),
      targetWindow : getCtpTop(),
      buttons : [ {
        text : $.i18n('common.button.ok.label'),
        handler : function() {
          var returnval = sectionSelectDialog.getReturnValue();
          if(returnval){
            var ids = arrayToArray(returnval[0]); //SectionIds
            var names = arrayToArray(returnval[1]); //SectionNames
            var singleBoards = arrayToArray(returnval[2]); //SingleBoards
            var entityIds = arrayToArray(returnval[3]);
            var ordinals = arrayToArray(returnval[4]);
            var properties = arrayToArray(returnval[5]);
            var data ='{"sectionIds":"'+ids+'",';
            for(var i=0; i<ids.length;i++){
              if(names!=null){
                data +='"columnsName_'+i+'":"'+names[i].escapeHTML()+'",';
              }
              if(singleBoards!=null){
                data +='"singleBoardId_'+i+'":"'+singleBoards[i]+'",';
              }
              if(entityIds!=null){
                data +='"entityId_'+i+'":"'+entityIds[i]+'",';
              }
              if(ordinals!=null){
                data +='"ordinal_'+i+'":"'+ordinals[i]+'",';
              }
              if(properties != null){
                if(properties[i]==""){
                  data +='"property_'+i+'":"0",';
                }else{
                  var props = properties[i];
                  var length = 0;
                  for(var key in props){
                    var value = props[key];
                    data += '"property_'+i+'_'+length+'_key":"'+key+'",';
                    data +='"property_'+i+'_'+length+'_value":"'+value+'",';
                    length++;
                  }
                  data +='"property_'+i+'":"'+length+'",';
                }
              }
            }
            data += '"size":"'+ids.length+'","entityId":"'+entityId+'","spaceId":"'+spaceId+'","editKeyId":"'+$("#editKeyId").val()+'","showState":"'+$("#showState").val()+'"';
            data +="}";
            var sectionData = $.parseJSON(data);
            $.ajax({
              url:_ctxPath + "/portal/spaceController.do?method=updateSectionsToFragment",
              type:'POST',
              data:sectionData,
              success:function(result){
                if(result){
                  var data = $.parseJSON(result);
                  if(data.editKeyId){
                    //编辑状态
                    $("#editKeyId").val(data.editKeyId);
                    document.location.href=pagePath+"?spaceId="+spaceId+"&showState="+showState+"&editKeyId="+data.editKeyId+"&decorationId="+$("#decorationId").val()+"&isChangedIndex="+$("#isChangedIndex").val()+"&toDefault="+$("#toDefault").val()+"&d="+(new Date());
                  }else if(data.pagePath){
                    //显示状态
                    //空间未个性化
                    if(spaceType == "cooperation_work" || spaceType == "objective_manage" || spaceType == "edoc_manage" || spaceType == "meeting_manage" || spaceType == "performance_analysis" || spaceType == "form_application"){
                       document.location.href=data.pagePath+"?showState="+showState+"&d="+(new Date());
                    } else {
                      if(pagePath!=data.pagePath){
                        getCtpTop().refreshNavigation(spaceId);
                      }else{
                        document.location.href=data.pagePath+"?&d="+(new Date());
                      }
                    }
                  }
                }
              }
            });
          }
          sectionSelectDialog.close();
        }
      }, {
        text : $.i18n('common.button.cancel.label'),
        handler : function() {
          sectionSelectDialog.close();
        }
      } ]
    });
	}
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
function setPortalLayoutCenterDiv(){
	try{
		var browser=navigator.appName 
		var b_version=navigator.appVersion 
		var version=b_version.split(";"); 
		var trim_Version=version[1].replace(/[ ]/g,""); 
		var right_div_portal_sub = document.getElementById('right_div_portal_sub');
		var rightChildList = null;
		var contentHeight = 0;
		var isScroll = false;
		if(right_div_portal_sub){
			right_div_childList = right_div_portal_sub.getElementsByTagName('div');
			var right_div_portal_childs = right_div_portal_sub.childNodes;
			rightChildList = new Array();
			if(right_div_portal_childs.length>0){
				for(var i = 0;i<right_div_portal_childs.length;i++){
					var tempobj = right_div_portal_childs[i];
					if(tempobj!=null && tempobj!=undefined && tempobj.tagName!=null && tempobj.tagName.toUpperCase() == 'DIV'){
						contentHeight+=parseInt(tempobj.clientHeight);
						rightChildList.push(tempobj);
					}
				}
			}
		}
		if(rightChildList.length>0){
			if(contentHeight>document.body.clientHeight){isScroll = true;}
			if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0"){ 
				document.body.style.width="100%";
				right_div_portal_sub.style.width = parseInt(document.body.clientWidth);
				for(var j = 0; j<rightChildList.length; j++){
					var temp = rightChildList[j];
					if(isScroll){
						temp.style.width = parseInt(document.body.clientWidth)-23;
					}else{
						temp.style.width = parseInt(document.body.clientWidth)-3;
					}
				}
			}else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0"){ 
				right_div_portal_sub.style.width = parseInt(document.body.clientWidth)-1;
				for(var j = 0; j<rightChildList.length; j++){
					var temp = rightChildList[j];
					if(isScroll){
						temp.style.width = parseInt(document.body.clientWidth)-20;
					}else{
						temp.style.width = parseInt(document.body.clientWidth)-13;
					}
				}
			}else{
				right_div_portal_sub.style.width = parseInt(document.body.clientWidth)-1;
				for(var j = 0; j<rightChildList.length; j++){
					var temp = rightChildList[j];
					if(isScroll){
						temp.style.width = parseInt(document.body.clientWidth)-23;
					}else{
						temp.style.width = parseInt(document.body.clientWidth)-3;
					}
				}
			} 
		}
		hideMask();
	}catch(e){
	  hideMask();
	}
}
function addportalLayoutResize(){
	var right_div_portal_sub = document.getElementById('right_div_portal_sub');
	if(document.all){
		if(right_div_portal_sub)right_div_portal_sub.attachEvent("onresize",setPortalLayoutCenterDiv);
		//if(right_div_portal_sub)right_div_portal_sub.attachEvent("onfocus",setPortalLayoutCenterDiv);
		window.attachEvent("onresize",setPortalLayoutCenterDiv);
		//window.attachEvent("onfocus",setPortalLayoutCenterDiv);
    }else{
    	if(right_div_portal_sub)right_div_portal_sub.addEventListener("resize",setPortalLayoutCenterDiv,false);
    	//if(right_div_portal_sub)right_div_portal_sub.addEventListener("focus",setPortalLayoutCenterDiv,false);
    	window.addEventListener("resize",setPortalLayoutCenterDiv,false);
    	//window.addEventListener("focus",setPortalLayoutCenterDiv,false);
	}
}
function initPortalLayout(){
  showMask();
	addportalLayoutResize();
	setTimeout(function(){setPortalLayoutCenterDiv();},500);
	//check the space show state
	var showState = $("#showState").val();
	if(showState == "edit" || showState == "personEdit"){
		showEditModel();
	}else if(showState == "view"){
		minSizeFragment();
	}else if(showState == "show"&&(checkSpaceAllowDefined()==true||checkSpaceAllowDefined()=="true")){
	  typeToSortable();
	}
    //>>>滚动条顶部，加渐变遮罩层
	if (showState == "show") {
	    var maskHTML = "<div class='portalScrollMask hidden'></div>";
	    $("body").append(maskHTML);
	    var ssObj = $("#right_div_portal_sub");
	    var maskObj = $(".portalScrollMask");
	    ssObj.scroll(function () {
	        if (ssObj.scrollTop() * 1 > 85) {
	            maskObj.show();
	        } else {
	            maskObj.hide();
	        }
	    });
	}
    //<<<滚动条顶部，加渐变遮罩层
}

/**
 * 月份选择器
 */
function selectDates(obj, id){
	var returnValue = v3x.openWindow({
	    url:"/seeyon/genericController.do?ViewPage=hr/viewSalary/calendarFrame&showClearButton=true",
	    left:event.screenX - 120,
	    top:event.screenY + 20,
	    width:"180",
	    height:"160",
	    resizable:"0",
	    scrollbars:"false",
	    dialogType:"modal"
    });
    
    if(returnValue != undefined && returnValue != null){
    	obj.value = returnValue;
    	
		var beginTimeStr = $("#" + id + "_S").val();
		var endTimeStr = $("#" + id + "_E").val();
		
		if(beginTimeStr && beginTimeStr != '' && endTimeStr && endTimeStr != ''){
			var beginTimeStrs = beginTimeStr.split("-");
			var beginTime = new Date();
			beginTime.setFullYear(beginTimeStrs[0], (beginTimeStrs[1] - 1), "01");
			var endTimeStrs = endTimeStr.split("-");
			var endTime = new Date();
			endTime.setFullYear(endTimeStrs[0], (endTimeStrs[1] - 1), "01");
		}
		
		if(endTime < beginTime){
			alert(v3x.getMessage("V3XLang.calendar_endTime_startTime"));
			obj.value = "";
			return;
		}
    }
}

/**
 * 会议统计栏目编辑'统计内容'事件 --xiangfan
 */
function onChangeMtStatContent(obj, paramName, isOnload){
	var displayContent = document.getElementById(paramName + "displayContent1_tr");
	if(displayContent){
	   displayContent = displayContent.childNodes[0];
	}
	if(obj.value=="mtRole" && displayContent){
		var radioObj = document.getElementById(paramName + "displayContent0");
	    displayContent.style.display = "none";
	    if(radioObj)
	       radioObj.checked = true;
	}else if(obj.value=="mtReply" && displayContent){
		displayContent.style.display = "block";
	}
}

/**
 * 公共信息栏目样式联动
 */
function changeDefaultValue4News(obj, paramName, isOnload){
	var objValue = obj.value;
	var countObj = document.getElementById(paramName + "count");
	var rowList = document.getElementsByName(paramName + "rowList");
	var speed = document.getElementById(paramName + "speed");
	var countMin = obj.getAttribute("countMin");
	var countMax = obj.getAttribute("countMax");
	var imageLeftCountMax = obj.getAttribute("imageLeftCountMax");
	var listCountD = obj.getAttribute("listCountD");
	var listCountD2 = obj.getAttribute("list2Count");
	var imageandlistCountD = obj.getAttribute("imageandlistCountD");
	var imageandtitleCountD = obj.getAttribute("imageandtitleCountD");
	var moveCountD = obj.getAttribute("moveCountD");
	var imageCountD = obj.getAttribute("imageCountD");
	var imageLeftCountD = obj.getAttribute("imageLeftCountD");
	
	var valueIsDefault = countObj.getAttribute("valueIsDefault");
	if(valueIsDefault == true || valueIsDefault == 'true'){
		if(objValue == "list"){
			countObj.value = listCountD;
		}else if(objValue == "list2"){
			countObj.value = listCountD2;
		}else if(objValue == "imageandlist"){
			countObj.value = imageandlistCountD;
		}else if(objValue == "imageandtitle"){
			countObj.value = imageandtitleCountD;
		}else if(objValue == "move"){
			countObj.value = moveCountD;
		}else if(objValue == "image"){
			countObj.value = imageCountD;
		}else if(objValue == "imageLeft"){
			countObj.value = imageLeftCountD;
		}
	}
	
	if(objValue == "image" || objValue == "imageLeft"){
		if (objValue == "image") {
			countObj.disabled = "disabled";
		}
		if (objValue == "imageLeft") {
			countObj.disabled = "";
			countMax = imageLeftCountMax;
		}
		if(rowList[2]){
			rowList[2].checked = "";
			rowList[2].disabled = "disabled";
		}
		if(rowList[3]){
			rowList[3].checked = "";
			rowList[3].disabled = "disabled";
		}
	}else{
		countObj.disabled = "";
		if(rowList[2]){
			rowList[2].disabled = "";
		}
		if(rowList[3]){
			rowList[3].disabled = "";
		}
	}
	
	if(objValue != "image") {
		countObj.setAttribute("min", countMin);
		countObj.setAttribute("max", countMax);
	}
	
	if(!isOnload){
		if(objValue == "list"){
			if(rowList[2]){
				rowList[2].checked = "checked";
			}
			if(rowList[3]){
				rowList[3].checked = "checked";
			}
			countObj.value = listCountD;
		}else if(objValue == "list2"){
			if(rowList[2]){
				rowList[2].checked = "checked";
			}
			if(rowList[3]){
				rowList[3].checked = "checked";
			}
			countObj.value = listCountD2;
		}else if(objValue == "imageandlist"){
			if(rowList[2]){
				rowList[2].checked = "checked";
			}
			if(rowList[3]){
				rowList[3].checked = "";
			}
			countObj.value = imageandlistCountD;
		}else if(objValue == "imageandtitle"){
			if(rowList[2]){
				rowList[2].checked = "checked";
			}
			if(rowList[3]){
				rowList[3].checked = "";
			}
			countObj.value = imageandtitleCountD;
		}else if(objValue == "move"){
			if(rowList[2]){
				rowList[2].checked = "checked";
			}
			if(rowList[3]){
				rowList[3].checked = "checked";
			}
			countObj.value = moveCountD;
		}else if(objValue == "image"){
			if(rowList[2]){
				rowList[2].checked = "";
			}
			if(rowList[3]){
				rowList[3].checked = "";
			}
			countObj.value = imageCountD;
		}else if(objValue == "imageLeft"){
			if(rowList[2]){
				rowList[2].checked = "";
			}
			if(rowList[3]){
				rowList[3].checked = "";
			}
			countObj.value = imageLeftCountD;
		}
	}
	
	if(speed){
		speed.disabled = true;
		if(objValue == "move"){
			speed.disabled = false;
		}
	}
}
/**
 * 首页待办栏目样式联动
 */
function pendingColumnStyle(obj, paramName, isOnload){
  var objValue = obj.value;
  var graphical_table = $("#"+paramName+"graphical_table").parent().parent("tr");
  if(objValue=='doubleList'||objValue=='orderList'){
    if(graphical_table){
      graphical_table.hide();
      graphical_table.next().hide();
    }
  }else{
    if(graphical_table){
      graphical_table.show();
      graphical_table.next().show();
    }
  }
}


/**
 * 关联人员、关联系统栏目样式联动
 */
function changeDefaultValue4LinkSystem(obj, paramName, isOnload){
	var objValue = obj.value;
	var countObj = document.getElementById(paramName + "count");
	var listCountD = obj.getAttribute("listCountD");
	var pictureCountD = obj.getAttribute("pictureCountD");
	
	var valueIsDefault = countObj.getAttribute("valueIsDefault");
	if(valueIsDefault == true || valueIsDefault == 'true'){
		if(objValue == "list"){
			countObj.value = listCountD;
		} else if(objValue == "picture"){
			countObj.value = pictureCountD;
		}
	}
	
	if(!isOnload){
		if(objValue == "list"){
			countObj.value = listCountD;
		} else if(objValue == "picture"){
			countObj.value = pictureCountD;
		}
	}
}

/**
 *关联项目栏目样式联动
 */
function changeDefaultValue4Project(obj, paramName, isOnload){
}

/**
 * 日程事件栏目样式联动
 */
function changeDefaultValue4Calendar(obj, paramName, isOnload){
	var objValue = obj.value;
	var countObj = document.getElementById(paramName + "count");
	var rowList = document.getElementsByName(paramName + "rowList");
	
	if(objValue == "calendar"){
		countObj.disabled = "disabled";
		if(rowList[2]){
			rowList[2].checked = "";
			rowList[2].disabled = "disabled";
		}
		if(rowList[3]){
			rowList[3].checked = "";
			rowList[3].disabled = "disabled";
		}
		if(rowList[4]){
			rowList[4].checked = "";
			rowList[4].disabled = "disabled";
		}
	}
	
	if(!isOnload){
		if(objValue == "list"){
			countObj.disabled = "";
			if(rowList[2]){
				rowList[2].checked = "checked";
				rowList[2].disabled = "";
			}
			if(rowList[3]){
				rowList[3].checked = "checked";
				rowList[3].disabled = "";
			}
			if(rowList[4]){
				rowList[4].checked = "";
				rowList[4].disabled = "";
			}
		}else if(objValue == "calendar"){
			countObj.disabled = "disabled";
			if(rowList[2]){
				rowList[2].checked = "";
				rowList[2].disabled = "disabled";
			}
			if(rowList[3]){
				rowList[3].checked = "";
				rowList[3].disabled = "disabled";
			}
			if(rowList[4]){
				rowList[4].checked = "";
				rowList[4].disabled = "disabled";
			}
		}
	}
}

/**
 * 我的收藏栏目样式联动
 */ 
function changeDefaultValue4DocCollect(obj, paramName, isOnload){
  var objValue = obj.value;
  var listNumTd = $("#"+paramName + "listNum_showSubjectTd");
  
  var countObjTd = $("#"+paramName + "count_showSubjectTd");
  
  var rowListTd = $("#"+paramName + "rowList_showSubjectTd");
  if(objValue == "0") {
	  $("#"+paramName + "listNum").val(16);
    //栏目行数_显示
    countObjTd.parent("tr").show();
    //栏目个数_隐藏
    listNumTd.parent("tr").hide();
    //显示字段_显示
    rowListTd.parent("tr").show();
  }else if (objValue == "1") {
	  $("#"+paramName + "count").val(8);
    //栏目行数_隐藏
    countObjTd.parent("tr").hide();
    //栏目个数_显示
    listNumTd.parent("tr").show();
    //显示字段_隐藏
    rowListTd.parent("tr").hide();
  }
}

