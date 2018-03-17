/*
 * jQuery Json Form Submit Plugin @requires jQuery v1.1 or later, json plugin
 * and form plugin @author Andy
 */
(function($) {
/**
 * 栏目编辑页面提交，单点使用
 */
$.fn.jsonFormSubmit = function(options) {
    var settings = {
      validate : true
    };
    options = $.extend(settings, options);
    var action = options.action || this.attr("action");
    if (action == null || $.trim(action) == "") {
      alert("you don't set action attribute!");
      return;
    }
    if (typeof options.callback == 'function') {
      var tempIframe = $(
          '<iframe id="_js_frmsubmit" src="" name="_js_frmsubmit" style="display:none;"></iframe>'
          );
      $("body", this[0].ownerDocument).append(tempIframe);
      tempIframe.load(function() {
        var response = $(this).contents().find("body pre").html();
        if(!response){
          response = $(this).contents().find("body").html();
        }
        options.callback(response);
        $(this).remove();
      });
      tempIframe = null;
      this.attr('target', '_js_frmsubmit');
    } else if (options.target) {
      this.attr('target', options.target);
    }
    this.submit();
  };
})(jQuery);
/**
 * 空间栏目编辑状态的拖拽方法
 */
//显示编辑模式
function showEditModel(){
	$("#submitButton").css("display","");
	$("#layout-select").css("display","");
	/*$("div[id^='add_section_div']").each(function(i,obj){
		$(obj).css("display","");
	});*/
	//为空容器填充占位符
	$.each($("div .portal-layout-column"),function(i,obj){
		//var container = $(obj).children("div .portal-layout-cell");
		//初始化数据，空容器填充占位符
		//if(container.children("div .portal-layout-cell_head").length <= 0&&container.children("div .portal-layout-cell-banner").length<=0&&$(obj).children(".placeholder").length<=0){
			$(obj).append("<div class='placeholder'><p>"+$.i18n("portal.sort.dragPortletHere")+"</p></div>");
			//$(obj).children(".placeholder").height("32px");
		//}
	});
	
	//去除栏目展开按钮
	if($("#showState").val()!="edit"){
		$("#showState").val("personEdit");
		//最小化每个栏目
	}
	minSizeFragment();
	//为每个容器内的栏目添加拖拽功能
	$("div .portal-layout-column").sortable({
		cursor : 'move',//鼠标样式
		items : '.portal-layout-cell',//可拖拽的栏目集合
		opacity : '0.6',//当前拖拽目标的透明度
		connectWith : '.portal-layout-column',//允许多容器间互相拖拽，此为样式
		placeholder : 'placeholder',//拖拽目的地的占位符
		tolerance : 'pointer',
		start : function(event, ui) {
			ui.placeholder.html("<p>"+$.i18n("portal.sort.dragPortletHere")+"</p>");
			//ui.placeholder.height(ui.item.height());
		},
		out : function(event,ui){
			//容器内Item被拖拽为空时，添加占位符
			//var senderSize = ui.sender.children("div .portal-layout-cell").children("div .portal-layout-cell_head").length;
			//var senderBannerSize = ui.sender.children("div .portal-layout-cell").children("div .portal-layout-cell-banner").length;
			//if(senderSize <= 0 &&senderBannerSize<=0 && ui.item.parent().children(".placeholder").length<=0){
			if(ui.item.parent().children(".placeholder").length<=0){
				ui.sender.append("<div class='placeholder'><p>"+$.i18n("portal.sort.dragPortletHere")+"</p></div>");
				//ui.sender.children(".placeholder").height(ui.item.height());
			}
		},
		receive : function(event,ui){
			//容器被拖拽Item时，消除占位符
			//var receiverContainer =  ui.item.parent().children("div .portal-layout-cell");
			//var targetSize = receiverContainer.children("div .portal-layout-cell_head").length;
			//var targetBannerSize = receiverContainer.children("div .portal-layout-cell-banner").length;
			//if((targetSize >0 || targetBannerSize >0 )&&  ui.item.parent().children(".placeholder").length>0){
			var swidth = ui.item.parent().children(".fragment").attr("swidth");
			var y = ui.item.parent().children(".fragment").attr("y");
			var panelId = ui.item.children("input[id^='PanelId_']").val();
			var panel = sectionHandler.allSectionPanels[panelId];
			var nodeId = panel.nodeId;
			if(swidth&&panel&&nodeId){
				resizeSectionTitle(nodeId,swidth,y);
			}
			if(ui.item.parent().children(".placeholder").length>0){
				 ui.item.parent().children(".placeholder").remove();
			}
			ui.item.parent().append("<div class='placeholder'><p>"+$.i18n("portal.sort.dragPortletHere")+"</p></div>");
			
		},
		stop : function(event,ui){
			sortIndex();
			//拖动后添加频道按钮消失
			/*$("div[id^='add_section_div']").each(function(i,obj){
				$(obj).show();
			});*/
			//最小化每个栏目
			minSizeFragment();
		}
	});
}
/**
 * 显示状态的拖拽方法，拖拽完成保存拖拽坐标
 */
function typeToSortable(){
  //初始化拖拽前，缩小栏目显示，初始化拖拽完成以后，放大
  minSizeFragment();
  //显示栏目添加和布局切换图标
  $("#AddPortletAndChangeLayout").show();
  //为每个容器内的栏目添加拖拽功能
  $("div .portal-layout-column").sortable({
    cursor : 'move',//鼠标样式
    items : '.portal-layout-cell',//可拖拽的栏目集合
    handle : '.content_area_head,.portal-layout-cell-banner',//限定只能在栏目标题行进行拖拽
    opacity : '0.6',//当前拖拽目标的透明度
    connectWith : '.portal-layout-column',//允许多容器间互相拖拽，此为样式
    placeholder : 'placeholder',//拖拽目的地的占位符
    tolerance : 'intersect',//intersect:拖拽对象进入50%触发recive;pointer:鼠标进入触发;前端显示时使用intersect,编辑页面拖拽使用pointer
    start : function(event, ui) {
      minSizeFragment();
      $.each($("div .portal-layout-column"),function(i,obj){
        if($(obj).children(".placeholder").length<=0){
          $(obj).append("<div class='placeholder'><p>"+$.i18n("portal.sort.dragPortletHere")+"</p></div>");
        }
      });
      //ui.placeholder.height(ui.item.height());
    },
    out : function(event,ui){
      //容器内Item被拖拽为空时，添加占位符
      if(ui.item.parent().children(".placeholder").length<=0){
        ui.sender.append("<div class='placeholder'><p>"+$.i18n("portal.sort.dragPortletHere")+"</p></div>");
        ui.sender.children(".placeholder").height(ui.item.height());
      }
    },
    receive : function(event,ui){
      //容器被拖拽Item时，消除占位符
      var swidth = ui.item.parent().children(".fragment").attr("swidth");
      var panelId = ui.item.children("input[id^='PanelId_']").val();
      var y = ui.item.parent().children(".fragment").attr("y");
      var swidth = ui.item.parent().children(".fragment").attr("swidth");
      if(panelId){
        var panel = sectionHandler.allSectionPanels[panelId];
        var section = sectionHandler.allSections[panelId];
        var nodeId = panel.nodeId;
        panel.y = y-0;
        section.y = y-0;
        if(swidth&&panel&&nodeId){
        	resizeSectionTitle(nodeId,swidth,y);
        }
        //var sectionBeanId = panel.sectionBeanId;
        showSection(panel.id,true);
      }
      if(ui.item.parent().children(".placeholder").length>0){
         ui.item.parent().children(".placeholder").remove();
      }
      ui.item.parent().append("<div class='placeholder'><p>"+$.i18n("portal.sort.dragPortletHere")+"</p></div>");
    },
    stop : function(event,ui){
      /**前端排序，重新定位坐标**/
      sortIndex();
      $.each($("div .portal-layout-column"),function(i,obj){
        if($(obj).children(".placeholder").length>0){
          $(obj).children(".placeholder").remove();
        }
      });
      /**前端保存**/
      updateLayoutIndex();
      maxSizeFragment();
    }
  });
  //初始化拖拽前，缩小栏目显示，初始化拖拽完成以后，放大
  maxSizeFragment();
}
//最小化每个栏目
function minSizeFragment(){
	var ids = sectionHandler.getAllNodeIds();
	for(var i=0; i<ids.length; i++){
		var nodeId = ids[i];
		/*var showIco = $("#section_show"+nodeId);
		if(showIco){
			var className = showIco.attr("class");
			if(className == "section-show-hidden"){
				showIco.attr("class","section-show-show");
			}
		}*/
		$("#editDiv"+nodeId).hide();
		$("#"+nodeId).hide();
		$("#footer"+nodeId).hide();
	}
}
//最大化每个栏目
function maxSizeFragment(){
	var ids = sectionHandler.getAllNodeIds();
	for(var i=0; i<ids.length; i++){
		var nodeId = ids[i];
		/*var showIco = $("#section_show"+nodeId);
		if(showIco){
			var className = showIco.attr("class");
			if(className == "section-show-show"){
				showIco.attr("class","section-show-hidden");
			}
		}*/
		if($("#editDiv"+nodeId).children().length>0){
		  $("#editDiv"+nodeId).show();
		}else{
		  $("#"+nodeId).show();
		  $("#footer"+nodeId).show();
		}
	}
}
//正常显示模式
function showNormal(){
	$("#submitButton").hide();
	$("#layout-select").hide();
	/*$("div[id^='add_section_div']").each(function(i,obj){
		$(obj).hide();
	});*/
	//移除所有占位符
	$("div .placeholder").remove();
	//解决拖拽过程中导致栏目样式更改不能统一打开栏目的问题
	/*$.each($("div .section-show-hidden"),function(i,obj){
		$(obj).removeClass("section-show-hidden").addClass("section-show-show");
	});*/
	//最大化每个栏目
	maxSizeFragment();
	//设置showState值调整栏目编辑后的栏目显示状态
	if($("#showState").val()=="personEdit"){
		$("#showState").val("view");
	}
	$("div .portal-layout-column").sortable("destroy");
}
//添加栏目到空间
function addPortlet(){
	var result = isThisSpaceExist();
	if(!result){
		  return;
	}
	
	var showState = $("#showState").val();
	//ajax保存布局数据
	var isChangedIndex = $("#isChangedIndex").val();
	if(isChangedIndex=="changed"){
		ajaxUpdateLayoutIndex(); 
	}
	//添加的栏目在那个容器的定义
	var decorationId= $("#decorationId").val();
	var y = 0;
	if(decorationId){
		if(decorationId.indexOf("D1")>=0){
			y = 0;
		}else if(decorationId.indexOf("D2")>=0){
			y = 3;
		}else if(decorationId.indexOf("D3")>=0){
			y = 4;
		}
	}
	//添加栏目到空间标记，showBanner：false;添加栏目到频道标记,showBanner:true
	var showBanner = false;
	var single = true;
	var sectionSelectDialog = $.dialog({
	      url : _ctxPath + "/portal/spaceController.do?method=portletSelector&y="+y+"&spaceType="+spaceType+"&showBanner="+showBanner+"&single="+single+"&pagePath="+pagePath+"&spaceId="+spaceId+"&ownerId="+ownerId+"&editKeyId="+$("#editKeyId").val(),
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
	            if(ids!=null){
	              var data ='{';
	              if(ids.length>0){
	                for(var i=0; i<ids.length;i++){
	                  data +='"sections_'+i+'":"'+ids[i]+'",';
	                  if(names!=null){
	                    data +='"columnsName_'+i+'":"'+names[i].escapeJavascript()+'",';
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
	              }
	              data += '"size":"'+ids.length+'","pagePath":"'+pagePath+'","space_id":"'+spaceId+'","editKeyId":"'+$("#editKeyId").val()+'","decorationId":"'+decorationId+'"';
	              data +="}";
	              var sectionData = $.parseJSON(data);
	              $.ajax({
	                url:_ctxPath + "/portal/spaceController.do?method=updateSpacePortlets",
	                data:sectionData,
	                type:'POST',
	                success:function(editKeyId){
  	                if(editKeyId){
  	                  $("#editKeyId").val(editKeyId);
  	                    document.location.href=pagePath+"?showState="+showState+"&spaceId="+spaceId+"&editKeyId="+editKeyId+"&decorationId="+decorationId+"&isChangedIndex="+$("#isChangedIndex").val()+"&d="+(new Date());
  	                }
	                }
	              });
	            }
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
function addPortletByFront(){
  //前台个性化操作，先确认空间是否存在
  var result = isThisSpaceExist();
  if(!result){
	  return;
  }
  //添加的栏目在那个容器的定义
  var decorationId= $("#decorationId").val();
  var y = 0;
  if(decorationId){
    if(decorationId.indexOf("D1")>=0){
      y = 0;
    }else if(decorationId.indexOf("D2")>=0){
      y = 3;
    }else if(decorationId.indexOf("D3")>=0){
      y = 4;
    }
  }
  //添加栏目到空间标记，showBanner：false;添加栏目到频道标记,showBanner:true
  var showBanner = false;
  var single = true;
  var sectionFrontSelectDialog = $.dialog({
        url : _ctxPath + "/portal/spaceController.do?method=portletSelector&y="+y+"&spaceType="+spaceType+"&showBanner="+showBanner+"&single="+single+"&pagePath="+pagePath+"&spaceId="+spaceId+"&ownerId="+ownerId+"&editKeyId="+$("#editKeyId").val(),
        width : 710,
        height : 460,
        title : $.i18n('menu.space.personalConfig'),
        targetWindow : getCtpTop(),
        buttons : [ {
          text : $.i18n('common.button.ok.label'),
          handler : function() {
            var returnval = sectionFrontSelectDialog.getReturnValue();
            if(returnval){
              var ids = arrayToArray(returnval[0]); //SectionIds
              var names = arrayToArray(returnval[1]); //SectionNames
              var singleBoards = arrayToArray(returnval[2]); //SingleBoards
              var entityIds = arrayToArray(returnval[3]);
              var ordinals = arrayToArray(returnval[4]);
              var properties = arrayToArray(returnval[5]);
              if(ids!=null){
                var data ='{';
                if(ids.length>0){
                  for(var i=0; i<ids.length;i++){
                    data +='"sections_'+i+'":"'+ids[i]+'",';
                    if(names!=null){
                      data +='"columnsName_'+i+'":"'+names[i].escapeJavascript()+'",';
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
                }
                data += '"size":"'+ids.length+'","pagePath":"'+pagePath+'","space_id":"'+spaceId+'","decorationId":"'+decorationId+'"';
                data +="}";
                var sectionData = $.parseJSON(data);
                $.ajax({
                  url:_ctxPath + "/portal/spaceController.do?method=updateSpacePortlets",
                  data:sectionData,
                  type:'POST',
                  success:function(path){
                    if(spaceType == "cooperation_work" || spaceType == "objective_manage" || spaceType == "edoc_manage" || spaceType == "meeting_manage" || spaceType == "performance_analysis" || spaceType == "form_application"){
                      document.location.href=path+"?showState=show&d="+(new Date());
                    } else {
                      getCtpTop().refreshNavigation(spaceId);
                    }
                  }
                });
              }
            }
            sectionFrontSelectDialog.close();
          }
        }, {
          text : $.i18n('common.button.cancel.label'),
          handler : function() {
            sectionFrontSelectDialog.close();
          }
        } ]
      });
}

//拖拽时同步坐标数据
function sortIndex(){
	$.each($("div .portal-layout-column"),function(i,obj){
		if($(obj).children("div .portal-layout-cell").children("div .common_content_area").length > 0||$(obj).children("div .portal-layout-cell").children("div .portal-layout-cell-banner").length > 0){
			var Y = $(obj).children(".fragment").attr("Y");
			$.each($(obj).children("div .portal-layout-cell"),function(j,o){
				var sectionId = $(o).children("input[id^='S_']").val();
				/**更改判断坐标移动的模式，横幅栏目不在前端缓存的allSectionPanels数组中**/
				var _x = $("#X_"+sectionId).val();
				var _y = $("#Y_"+sectionId).val();
				//var id = $("#PanelId_"+sectionId).val();
				//var panel = sectionHandler.allSectionPanels[id];
				if(_x!=j||_y!=Y){
					$("#isChangedIndex").val("changed");
					$("#toDefault").val("");
				}
				$("#X_"+sectionId).val(j);
				$("#Y_"+sectionId).val(Y);
			});
		}
	});
}
//布局数据隐藏域赋值
function addLayoutDataToForm(){
	var isChangedIndex = $("#isChangedIndex").val();
	if(isChangedIndex=="changed"){
		ajaxUpdateLayoutIndex();
	}
	var editKeyId = $("#editKeyId").val();
	var decorationId = $("#decorationId").val();
	var toDefault = $("#toDefault").val();
	parent.document.getElementById("editKeyId").value=editKeyId;
	parent.document.getElementById("decoration").value=decorationId;
	parent.document.getElementById("toDefault").value=toDefault;
}
function ajaxUpdateLayoutIndex(){
	//添加栏目保存布局数据
	var state = false;
	var data = '{';
	$.each($("input[id^='S_']"),function(i,obj){
		state = true;
		var sectionId = $(obj).val();
		var x = $("#X_"+sectionId).val();
		var y = $("#Y_"+sectionId).val();
		data+='"sectionId_'+i+'":"'+sectionId+'","x_'+i+'":"'+x+'","y_'+i+'":"'+y+'",';
	});
	if(state){
		var size = $("input[id^='S_']").length;
		data +='"space_id":"'+spaceId+'","pagePath":"'+pagePath+'","size":"'+size+'","editKeyId":"'+$("#editKeyId").val()+'"}';
		var indexData = jQuery.parseJSON(data);
		$.ajax({
			  url:_ctxPath + "/portal/spaceController.do?method=updateLayoutIndex",
			  type:'POST',
			  data:indexData,
			  async:false,
			  success:function(editKeyId){
  				if(editKeyId){
  					$("#editKeyId").val(editKeyId);
  				}
			  }
			});
	}
}
//前端拖拽更新布局数据到数据库
function updateLayoutIndex(){
	//前台个性化操作，先确认空间是否存在
	  var result = isThisSpaceExist();
	  if(!result){
		  return;
	  }
	  
  var isChangedIndex = $("#isChangedIndex").val();
  if(isChangedIndex!="changed"){
    return;
  }
	var showState = $("#showState").val();
	var state = false;
	var data = '{';
	$.each($("input[id^='S_']"),function(i,obj){
		state = true;
		var sectionId = $(obj).val();
		var x = $("#X_"+sectionId).val();
		var y = $("#Y_"+sectionId).val();
		data+='"sectionId_'+i+'":"'+sectionId+'","x_'+i+'":"'+x+'","y_'+i+'":"'+y+'",';
	});
	if(state){
		var size = $("input[id^='S_']").length;
		data +='"space_id":"'+spaceId+'","pagePath":"'+pagePath+'","size":"'+size+'"}';
		var indexData = jQuery.parseJSON(data);
		$.ajax({
			  url:_ctxPath + "/portal/spaceController.do?method=updateLayoutIndex",
			  type:'POST',
			  data:indexData,
			  success:function(path){
			    if(pagePath!=path){
			      getCtpTop().refreshNavigation(spaceId);
			      //document.location.href=path+"?showState=show&d="+(new Date());
			    }
			  }
			});
	}
}
//更换布局
function changLayoutTypeForDD(decoration, index){
	//前台个性化操作，先确认空间是否存在
	  var result = isThisSpaceExist();
	  if(!result){
		  return;
	  }
	var showState = $("#showState").val();
	var isChangedIndex = $("#isChangedIndex").val();
	if(isChangedIndex=="changed"){
		ajaxUpdateLayoutIndex();
	}
	//check the current layout
	$.each($("input[type=radio][id^='layout']"),function(i,obj){
		if(++i==index){
			obj.checked = true;
		}else{
			obj.checked = false;
		}
	});
	document.location.href = pagePath+"?spaceId="+spaceId+"&showState="+showState+"&decorationId="+decoration+"&editKeyId="+$("#editKeyId").val();
}
//前端个人类型空间恢复默认
function toDefaultPersonal(){
	$.ajax({
		url:_ctxPath+"/portal/spaceController.do?method=toDefaultPersonalSpace&spaceType="+trueSpaceType+"&spaceId="+spaceId+"&editKeyId="+$("#editKeyId").val()+"&decorationId="+$("#decorationId").val(),
		type:'POST',
		success:function(data){
			var json = jQuery.parseJSON(data);
			$("#editKeyId").val(json.editKeyId);
			$("#toDefault").val(json.toDefault);
			if(json.decorationId){
				$("#decorationId").val(json.decorationId);
			}
			document.location.href=pagePath+"?showState="+$("#showState").val()+"&editKeyId="+json.editKeyId+"&isChangedIndex="+$("#isChangedIndex").val()+"&toDefault="+$("#toDefault").val()+"&decorationId="+json.decorationId+"&d="+(new Date());
		}
	});
}
//前端取消
function cancelPersonalEdit(){
  window.location.reload();
  //getContentFrame().topFrame.showCurrentPage(pagePath);
  //document.location.href=pagePath+"?spaceId="+spaceId+"&showState="+$("#showState").val()+"&d="+(new Date());
}
//进入编辑状态
function personalEdit(){
	return pagePath+"?spaceId="+spaceId+"&showState=personEdit&d="+(new Date());
}
//显示编辑按钮
function showEditButton(nodeId){
	var showState = $("#showState").val();
	var panelId = $("#"+nodeId+"_"+0).attr("panelId");
	var panel = sectionHandler.allSectionPanels[panelId];
	var tagertIndex = null;
	var tagertPanelId = null;
	if(panel.len>1){
		$("li[id^='section_name_total"+panel.nodeId+"']").each(function(i,obj){
			//var currentSpanId = "Text"+panel.nodeId+"_"+i;
			var css = $(obj).attr("class");
			if(css.indexOf('current')>=0){
				tagertIndex = i;
				tagertPanelId = $("#"+panel.nodeId+"_"+i).attr("panelId");
			}
		});
	}else{
		tagertIndex = 0;
		tagertPanelId = panelId;
	}
	var tagertPanel = sectionHandler.allSectionPanels[tagertPanelId];
	//if(showState!="show"){
		var editButton = $("#edit_section_div"+nodeId);
		var delButton = $("#del_section_div"+nodeId);
		var addbutton = $("#add_section_div"+nodeId);
		if(tagertPanel.isReadOnly.toString()=="false" && tagertPanel.hasParam =="true"){
			editButton.attr("style","float:right;cursor:pointer;");
			editButton.show();
		}
		delButton.attr("style","float:right;cursor:pointer;");
		delButton.show();
		if(showState!="view"&&tagertPanel.sectionBeanId!='banner'){
			addbutton.attr("style","float:right;cursor:pointer;");
			addbutton.show();
		}
	//}
}
//隐藏编辑按钮
function hiddeEditButton(nodeId){
	var showState = $("#showState").val();
	//if(showState!="show"){
		var editButton = $("#edit_section_div"+nodeId);
		var delButton = $("#del_section_div"+nodeId);
		var addbutton = $("#add_section_div"+nodeId);
		var moreButton = $("#more_section_div"+nodeId);
		editButton.attr("style","float:right;");
		editButton.hide();
		delButton.attr("style","float:right;");
		delButton.hide();
		addbutton.attr("style","float:right;");
		addbutton.hide();
		moreButton.attr("style","float:right;");
		moreButton.hide();
	//}
}
//前端提交更新
function updateSpace(){
	var isChangedIndex = $("#isChangedIndex").val();
	var checkResult = sectionHandler.checkEditSection();
    if(checkResult == false){
  	  return;
    }
	if(isChangedIndex=="changed"){
		ajaxUpdateLayoutIndex();
	}
	$.ajax({
		url:_ctxPath+"/portal/spaceController.do?method=updateSpaceByFront&showState="+$("#showState").val()+"&editKeyId="+$("#editKeyId").val()+"&spaceId="+spaceId+"&decorationId="+$("#decorationId").val()+"&toDefault="+$("#toDefault").val(),
		type:'POST',
		success:function(data){
			var json = jQuery.parseJSON(data);
			$("#editKeyId").val("");
			if(spaceType == "cooperation_work" || spaceType == "objective_manage" || spaceType == "edoc_manage" || spaceType == "meeting_manage" || spaceType == "performance_analysis" || spaceType == "form_application"){
			  getCtpTop().showMenu(json.path+"?showState=show&d="+new Date());
      } else {
        getCtpTop().refreshNavigation(json.spaceId);
      }
		}
	});
}
function publishFormBizSection(id){
	var isChangedIndex = $("#isChangedIndex").val();
	if(isChangedIndex=="changed"){
		ajaxUpdateLayoutIndex();
	}
	parent.document.forms[0].action = _ctxPath+"/portal/spaceController.do?method=configPublishColumn&showState=personEdit&editKeyId="+$("#editKeyId").val()+"&spaceId="+spaceId+"&decorationId="+$("#decorationId").val()+"&id="+id;
	parent.document.forms[0].submit();
}
function resizeSectionTitle(nodeId,swidth,y){
	if(nodeId&&swidth){
		var allPanels = sectionHandler.allSectionPanels;
		for(var id in allPanels){
			var panel = sectionHandler.allSectionPanels[id];
			var len = panel.len;
			if(!len){
				len = 3;
			}
			if(panel.nodeId == nodeId){
				//更新前端栏目坐标
				var section = sectionHandler.allSections[panel.id];
				if(!section){
					section = new Section(panel.id, panel.sectionId, panel.sectionBeanId, panel.nodeId, panel.index, panel.len, panel.entityId, panel.ordinal, panel.x, panel.y,panel.singleBoardId);
					sectionHandler.allSections[id] = section;
				}
				section.y = y-0;
				panel.y = y-0;
				
				var title = panel.title;
				var index = panel.index;
				var txt = $("#Text"+nodeId+"_"+index);
				if(title){
					var  multiPanelWidth = getLayoutPanelWidth(y);
					multiPanelWidth = parseInt(multiPanelWidth / len);
					var showTitleNum = parseInt((multiPanelWidth - 20)/7);
					var totalStr = panel.totalString;
				    if(sectionWidths[y]&&sectionWidths[y]==2){
				      totalStr = "";
				    }
					showTitleNum = showTitleNum - totalStr.length;
					if(showTitleNum <= 0){
						showTitleNum = 1;
					}
					txt.text(title.getLimitLength(showTitleNum).toString());
				}
			}
		}
	}
}
//前端显示时切换布局
function showSpaceLayout(){
  var layoutDialog = $.dialog({
    id : "html",
    url : _ctxPath+"/portal/spaceController.do?method=showSpaceLaoutByFront&decorationId="+decoration,
    targetWindow : getCtpTop(),
    width : 880,
    height : 140,
    title : $.i18n("channel.selectLayout.label"),
    buttons : [ {
      text : $.i18n("common.button.ok.label"),
      handler : function() {
        var _decoration = layoutDialog.getReturnValue();
        $.ajax({
          url:_ctxPath+"/portal/spaceController.do?method=changeFrontLayout&decorationId="+_decoration+"&spaceId="+spaceId,
          type:'POST',
          success:function(path){
            layoutDialog.close();
            if(spaceType == "cooperation_work" || spaceType == "objective_manage" || spaceType == "edoc_manage" || spaceType == "meeting_manage" || spaceType == "performance_analysis" || spaceType == "form_application"){
              document.location.href=path+"?showState=show&d="+(new Date());
            } else {
              getCtpTop().refreshNavigation(spaceId);
            }
          }
        });
      }
    },{
      text : $.i18n("common.button.cancel.label"),
      handler : function() {
        layoutDialog.close();
      }
    } ]
  });
}
/**
 *同步请求判断空间是否存在并可编辑
 */
function isThisSpaceExist(){
	var showState = $("#showState").val();
	if(showState == "edit" || showState == "view"){
		return true;
	}
	var sectionMgr = new sectionManager();
	var result = sectionMgr.isThisSpaceExist(pagePath);
	if(result == false){
		alert($.i18n("space.notExist.label"));
		getCtpTop().onbeforunloadFlag = false;
        getCtpTop().isOpenCloseWindow = false;
        getCtpTop().isDirectClose = false;
		getCtpTop().location.href = _ctxPath+"/main.do?method=changeLoginAccount&login.accountId="+$.ctx.CurrentUser.loginAccount;
		return false;
	}else{
		return true;
	}
}
function moreSections(nodeId,link){
  seeyonHide("normalDiv");
  seeyonShow("maxDiv");
  var panelId = $("#"+nodeId+"_"+0).attr("panelId");
  var panel = sectionHandler.allSectionPanels[panelId];
  var tagertIndex = null;
  var tagertPanelId = null;
  if(panel.len>1){
    $("li[id^='section_name_total"+panel.nodeId+"']").each(function(i,obj){
      var css = $(obj).attr("class");
      if(css.indexOf('current')>=0){
        tagertIndex = i;
        tagertPanelId = $("#"+panel.nodeId+"_"+i).attr("panelId");
      }
    });
  }else{
    tagertIndex = 0;
    tagertPanelId = panelId;
  }
  var tagertPanel = sectionHandler.allSectionPanels[tagertPanelId];
  var title = tagertPanel.title;
  $("#sectionMoreTitle").find("a").text(title);
  $("#sectionMoreTitle").attr("title",title);
  $("#mainSectionFrame").attr("src",_ctxPath+link);
}
function normalSection(){
  seeyonHide("maxDiv");
  seeyonShow("normalDiv");
}
function seeyonHide(id){
  //Blind
  //Bounce
  //Clip
  //Drop
  //Explode
  //Fold
  //Highlight
  //Puff
  //Pulsate
  //Scale
  //Shake
  //Size
  //Slide
  //var selectedEffect = $("#effectTypes" ).val();
  var selectedEffect = "blind";
  // most effect types need no options passed by default
  var options = {};
  // some effects have required parameters
  if ( selectedEffect === "scale" ) {
    options = { percent: 0 };
  } else if ( selectedEffect === "size" ) {
    options = { to: { width: 1200, height: 800 } };
  }

  // run the effect
  $( "#"+id ).hide( selectedEffect, options, 1000, callback(id) );
}
function seeyonShow(id){
  //Blind
  //Bounce
  //Clip
  //Drop
  //Explode
  //Fold
  //Highlight
  //Puff
  //Pulsate
  //Scale
  //Shake
  //Size
  //Slide
  //var selectedEffect = $( "#effectTypes" ).val();
  var selectedEffect = "blind";
  //most effect types need no options passed by default
  var options = {};
  // some effects have required parameters
  if ( selectedEffect === "scale" ) {
    options = { percent: 100 };
  } else if ( selectedEffect === "size" ) {
    options = { to: { width: 280, height: 185 } };
  }

  // run the effect
  $( "#"+id ).show( selectedEffect, options, 500, callback(id) );

}
//callback function to bring a hidden box back
function callback(id) {
  setTimeout(function(id) {
    $( "#"+id+":visible" ).removeAttr( "style" ).fadeOut();
    $("#maxDiv .content_area_body").height($(document).height()-108);
  }, 1000 );
  
};