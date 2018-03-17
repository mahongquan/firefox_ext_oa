// 为支持动态加载ckeditor依赖的js，需定义此变量，否则ckeditor无法定位
var CKEDITOR_BASEPATH =  _ctxPath + "/common/ckeditor/";
function FCKeditor_OnComplete( editorInstance ){
    $('#' + editorInstance.Name ).attr('editorReadyState','complete');
    $('#' + editorInstance.Name ).trigger('editorReady');
}
(function($) {
  // 根据浏览器版本确定使用FckEditor还是CkEditor
  var useFckEditor = $.browser.msie  && (parseInt($.browser.version, 10)<7);

  $.messageBox = function(options) {
    return new MxtMsgBox(options);
  };

  $.alert = function(msg) {
    var options = null;
    if(typeof(msg) == "object"){
        options = msg;
    }
    options = options == null ? {} : options;
    options.title = options.title ? options.title : $.i18n('system.prompt.js');
    options.type = options.type ? options.type : 0;
    options.imgType = options.imgType ? options.imgType : 2;
    options.close_fn = options.close_fn ? options.close_fn : null;
    if (typeof(msg) != "object") {
        options.msg = msg;
    }
    return new MxtMsgBox(options);
  };
  $.infor = function(msg) {
    var options = null;
    if(typeof(msg) == "object"){
        options = msg;
    }
    var options = options == undefined ? {} : options;
    options.title = $.i18n('system.prompt.js');
    options.type = 0;
    if (typeof(msg) != "object") {
        options.msg = msg;
    }
    options.imgType = options.imgType ? options.imgType : 0;
    options.close_fn = options.close_fn ? options.close_fn : null;
    return new MxtMsgBox(options);
  };
  $.confirm = function(options) {
    var options = options == undefined ? {} : options;
    options.title = options.title ? options.title : $.i18n('system.prompt.js');
    options.type = 1;
    options.imgType = options.imgType ? options.imgType : 4;
    options.close_fn = options.close_fn ? options.close_fn : null;
    return new MxtMsgBox(options);
  };
  /**
   * $.success = function (msg) { var options = options==undefined?{}:options;
   * options.title = options.title ? options.title : "成功"; options.type =
   * options.type ? options.type : 0; options.imgType = options.imgType ?
   * options.imgType : 0; options.msg = msg; return new MxtMsgBox(options); };
   * $.warning = function (msg) { var options = options==undefined?{}:options;
   * options.title = options.title ? options.title : "警告"; options.type =
   * options.type ? options.type : 0; options.imgType = options.imgType ?
   * options.imgType : 2; options.msg = msg; return new MxtMsgBox(options); };
   */
  $.error = function(msg) {
    var options = null;
    if(typeof(msg) == "object"){
        options = msg;
    }
    var options = options == undefined ? {} : options;
    options.title = options.title ? options.title : $.i18n('system.prompt.js');
    options.type = options.type ? options.type : 0;
    options.imgType = options.imgType ? options.imgType : 1;
    options.close_fn = options.close_fn ? options.close_fn : null;
    if (typeof(msg) != "object") {
        options.msg = msg;
    }
    return new MxtMsgBox(options);
  };
  $.progressBar = function(options) {
    if (options == undefined) {
      options = {}
    }
    return new MxtProgressBar(options)
  }
  $.dialog = function(options) {
    return new MxtDialog(options);
  };
  $.PeopleCard = function (options) {
      insertScriptP();
      return PeopleCard(options);
  }
  $.PeopleCardMini = function (options) {
    //flash people card
      var _options = insertScript(options);
      return new PeopleCardMini_flash(_options);
  }
  $.fn.PeopleCardMini = function (options) {
      var _options = insertScript(options);
      return new PeopleCardMini(_options, this);
  }
  $.metadata = function(data) {
    function Metadata(data) {
      this.data = data;
      function getColumnByProperty(tableName, columnName, propertyName) {
        var table = data[tableName];
        var columns = table['columns'];
        if (columns != null) {
          for ( var i = 0; i < columns.length; i++) {
            if (columns[i][propertyName] == columnName)
              return columns[i];
          }
        }
        return null;
      }
      /**
       * 按表名称和字段名称取字段实体。
       */
      this.getColumn = function(tableName, columnName) {
        return getColumnByProperty(tableName, columnName, 'name');
      };
      this.getColumnByAlias = function(tableName, columnName) {
        return getColumnByProperty(tableName, columnName, 'alias');
      };
      this.getColumns = function(tableName) {
        var table = data[tableName];
        return table['columns'];
      };
    }
    ;
    return new Metadata(data);
  };
  $.renderMetadata = function() {

  }
  /**
   * 按metadata数据渲染组件。
   */
  $.metadataForm = function(container, tableName, options) {
    // var manager = new metadataManager();
    // var data = manager.toJSON();
    var data = serverMetadata;

    var html = [];

    function buildControl(column) {
      var component = column.component;
      if (component == 'codecfg') {
        return buildCodeCfg(column);
      }
      var compHtml = '';
      var validation = '';
      var rule = column.rule;
      if (component != null) {
        rule = rule == null ? '' : ',' + rule;
        compHtml = ' class="comp" comp="type:' + "'" + component + "'" + rule
            + '"';
      } else if (rule != null) {
        // component的rule是comp的补充，否则为校验规则
        validation = ' class="validate" validate="' + rule + '"';
      }
      return '<input type="text" ' + buildIdNameHtml(column.name) + compHtml
          + validation + '/>';
    }
    function buildIdNameHtml(name) {
      var nameHtml = 'name="' + name + '"';
      var idHtml = ' id="' + name + '"';
      return idHtml + nameHtml;
    }
    function buildCodeCfg(column) {
      var compHtml = '';
      var rule = column.rule;

      rule = rule == null ? '' : rule;
      compHtml = ' class="codecfg" codecfg="' + rule + '"';

      return '<select ' + buildIdNameHtml(column.name) + compHtml
          + '><option value="">' + $.i18n('pleaseSelect')
          + '...</option></select>';
    }
    ;
    var columns = options ? options.columns : null;

    var position = options ? options.position : 'in';
    var metadata = $.metadata(data);
    var allColumns = [];
    if (columns) {
      $.each(columns, function(i, name) {
        var column = metadata.getColumnByAlias(tableName, name);
        if (column) {
          allColumns.push(column);
        } else {
          column = metadata.getColumn(tableName, name);
          if (column)
            allColumns.push(column);
        }
      });
    } else {
      allColumns = metadata.getColumns(tableName);
    }
    $.each(allColumns, function(i, column) {
      var label = column.label;
      var input = buildControl(column);
      html
          .push('<tr><th nowrap="nowrap"><label class="margin_r_10" for="'
              + column.name + '">' + label + ':</label></th>'
              + '<td><div class="common_txtbox_wrap">' + input
              + '</div></td></tr>');
    });
    if (position == 'after') {
      $(container).after(html.join(''));
    } else if (position == 'before') {
      $(container).before(html.join(''));
    } else {
      $(container).html(html.join(''));
    }
  };
  /**
   * 面包屑：当前位置
   */
  function showBreadcrumb(div, options) {
    var code = options.code;
    var type = options.type;
    var suffix = options.suffix;
    function showLocation(html){
      var top = getA8Top();
      if(top){
        //首页显示当前位置
        top.showLocation(html);
      }else{
        div.addClass('common_crumbs');
        div.html(html);
      }
    }
    if(options.html){
        showLocation(html);
    }
    function buildResourceMenuMap(menus, parentMenu, map) {
      for ( var i = 0; i < menus.length; i++) {
        var menu = menus[i];
        menu.parentMenu = parentMenu;
        var resourceCode = menu.resourceCode;
        if (resourceCode != null) {
          map[resourceCode] = menu;
        }
        if (menu.items) {
          buildResourceMenuMap(menu.items, menu, map);
        }
      }
      ;
    }
    ;
    function findMenu(code) {
      var ctpTop = getCtpTop ? getCtpTop() : parent ;
      if (ctpTop) {
        var allmenu = $(ctpTop.memberMenus);
        if (allmenu) {
          var cacheKey = 'resourceMenuCache';
          var cache = ctpTop.$.data(ctpTop.document.body, cacheKey);
          if (cache == undefined) {
            cache = new Array();
            buildResourceMenuMap(allmenu, null, cache);
            ctpTop.$.data(ctpTop.document.body, cacheKey, cache);
          }
          ;
          var result = [];
          var menu = cache[code];
          if (menu != undefined) {
            while (menu != null) {
              result.push(menu);
              menu = menu.parentMenu;
            }
            ;
          }
          ;
          return result.reverse();
        }
        ;
      }
      ;
      return [];
    }
    ;
    var menus = findMenu(code);
    if (menus.length > 0) {
      var html = '<span class="margin_r_10">'+$.i18n('seeyon.top.nowLocation.label')+'</span>';
      var items = [];
      for ( var i = 0; i < menus.length; i++) {
    	if(menus[i].url){
          items.push('<a href="###" onclick="showMenu(\'' + _ctxPath+menus[i].url + '\')">' + escapeStringToHTML(menus[i].name,false) + '</a>');
        }else{
          items.push('<a style="color:#888;" class="color_gray2_nohover">' + escapeStringToHTML(menus[i].name,false) + '</a>');
        }
      }
      ;
      html += items
          .join('<span class="common_crumbs_next margin_lr_5">-</span>');
      if(suffix){
          html += '<span class="common_crumbs_next margin_lr_5">-</span>' + suffix;
      }
      showLocation(html);
    }
  }
  ;
  $.fn.tooltip = function(options) {
    return ___tooltip(options, 1, $(this));
  };
  $.tooltip = function(options) {
    return ___tooltip(options, 0);
  };
  function ___tooltip(options, n, obj) {
    // n用来区分不同方法,1:$.fn.tooltip 和 0: $.tooltip
    var options = options;
    var mtt;
    if (n == 1) {
        var _targetId = obj.attr("id").replace("#", "");
        $.extend(options, { event: true, targetId: _targetId });
        mtt = new MxtToolTip(options);
        obj.mouseenter(function () {
            mtt.setPoint(null,null);
            mtt.show();
        }).mouseleave(function() {
            mtt.hide();
        });
    } else {
        mtt = new MxtToolTip(options);
    }
    return mtt;
  }
  var layoutIdx = 1;
  $.fn.layout = function() {
    var t = $(this), lo = t.attrObj("_layout");
    if (lo)
      return lo;
    var i = layoutIdx, id = t[0].id, nor = $("#" + id + " > .layout_north"), ea = $("#"
        + id + " > .layout_east"), we = $("#" + id + " > .layout_west"), sou = $("#"
        + id + " > .layout_south"), cen = $("#" + id + " > .layout_center"), cfg = {
      id : id
    }, co, cs, cl;

    nor.each(function() {
      this.id = this.id ? this.id : ("north" + i);
      co = {
        id : this.id
      };
      cl = $(this).attr("layout");
      cs = cl ? $.parseJSON("{" + cl + "}") : {};
      co = $.extend(co, cs);
      cfg.northArea = co;
    });

    ea.each(function() {
      this.id = this.id ? this.id : ("east" + i);
      co = {
        id : this.id
      };
      cl = $(this).attr("layout");
      cs = cl ? $.parseJSON("{" + cl + "}") : {};
      co = $.extend(co, cs);
      cfg.eastArea = co;
    });

    we.each(function() {
      this.id = this.id ? this.id : ("west" + i);
      co = {
        id : this.id
      };
      cl = $(this).attr("layout");
      cs = cl ? $.parseJSON("{" + cl + "}") : {};
      co = $.extend(co, cs);
      cfg.westArea = co;
    });

    sou.each(function() {
      this.id = this.id ? this.id : ("south" + i);
      co = {
        id : this.id
      };
      cl = $(this).attr("layout");
      cs = cl ? $.parseJSON("{" + cl + "}") : {};
      co = $.extend(co, cs);
      cfg.southArea = co;
    });

    cen.each(function() {
      this.id = this.id ? this.id : ("center" + i);
      co = {
        id : this.id
      };
      cl = $(this).attr("layout");
      cs = cl ? $.parseJSON("{" + cl + "}") : {};
      co = $.extend(co, cs);
      cfg.centerArea = co;
    });
    t.attrObj("_layout", new MxtLayout(cfg));
    layoutIdx++;
  };
  $.fn.compThis = function(options) {
    var t = this;
    if (t.attrObj("_comp"))
      t = t.attrObj("_comp");
    var tc = t.attr("comp"), tj, tp;
    if (tc) {
      tj = $.parseJSON('{' + tc + '}');
      if (options) {
        tj = $.extend(tj, options);
        var com = $.toJSON(tj);
        t.attr("comp", com.substring(1, com.length - 1));
      }
      tp = tj.type;
      t.attr('compType', tp);
      switch (tp) {
        case 'onlyNumber':{
            t.onlyNumber(tj);
            break;
        }
        case 'calendar':
          t.calendar(tj);
          break;
        case 'layout':
          t.layout();
          break;
        case 'tab':
          t.tab(tj);
          break;
        case 'fileupload':
          initFileUpload(t, tj);
          break;
        case 'attachlist':
          fileList(t);
          break;
        case 'showattachlist':
          showFileList(t, tj);
          break;
        case 'assdoc':
          assdoc(t, tj);
          break;
        case 'selectPeople':
          tj.srcElement = t;
          t.selectPeople(tj);
          break;
        case 'editor':
          t.showEditor(tj);
          break;
        case 'tooltip':
          t.tooltip(tj);
          break;
        case 'slider':
          var _temp = $("<div id='"+t.attr('id')+"'></div>");
          t.replaceWith(_temp);
          t = _temp;
          t.slider(tj);
          break;
        case 'workflowEdit':
          var cu = $.ctx.CurrentUser;
          if (tj.isTemplate) {//模板流程：协同、表单、公文等
            if (tj.isView) {
              t.click(function() {
                showWFTDiagram(getCtpTop(), tj.workflowId, window,cu.name,cu.loginAccountName);
              });
            } else {
              t.click(function() {
                createWFTemplate(
                	getCtpTop(),
                    tj.moduleType, 
                    tj.formApp, //非表单模板，请传-1
                    tj.formId,//非表单模板，请传-1
                    tj.workflowId, 
                    window,
                    tj.defaultPolicyId,//默认节点权限
                    cu.id, 
                    cu.name, 
                    cu.loginAccountName,
                    tj.flowPermAccountId,
                    tj.operationName,//非表单模板，请传-1
                    tj.startOperationName,//非表单模板，请传-1
                    tj.defaultPolicyName
                );
              });
            }
          } else {//非模板流程
            if (tj.isView) {
              t.click(function() {
                showWFCDiagram(getCtpTop(),tj.caseId,tj.workflowId,false,false,null,null,"collaboration");
              });
            }else{
              t.click(function() {
                createWFPersonal(
                	getCtpTop(),
                    tj.moduleType,
                    cu.id, 
                    cu.name,
                    cu.loginAccountName,
                    tj.workflowId,
                    window,
                    tj.defaultPolicyId,
                    cu.loginAccount,
                    tj.defaultPolicyName
                 );
              }
              );
            }
          }
          break;
        case 'correlation_form':
          showInput(t, tp, tj);
          break;
        case 'affix':
          showInput(t, tp, tj);
          break;
        case 'associated_document':
          showInput(t, tp, tj);
          break;
        case 'insert_pic':
          showInput(t, tp, tj);
          break;
        case 'correlation_project':
          showInput(t, tp, tj);
          break;
        case 'data_task':
          showInput(t, tp, tj);
          break;
        case 'search':
          showInput(t, tp, tj);
          break;
        case 'breadcrumb':
          if(!tj.code) {
            tj.code = _resourceCode;
          }
          showBreadcrumb(t, tj);
          break;
        case 'autocomplete':
          if(t.autocomplete)t.autocomplete(tj);
          break;  
        case 'office':
          t.showOffice(tj);
          break;
        case 'PeopleCardMini':
          t.PeopleCardMini(tj);
          break;
        case 'htmlSignature':
          t.htmlSignature(t,tj);
          break;
        case 'chooseProject':
            t.chooseProject(tj);
            break;
      }
    }
  };
  $.fn.comp = function(options) {
    $(".comp", this).add(this).each(function(i) {
      $(this).compThis(options);
    });
  };
  $.fn.chooseProject = function(jsonObj) {
      var input = $(this);
      var width = input.width();
      var id = input.attr("id");
      input.attr("id",id+"_txt");
      input.attr("name",id+"_txt");
      var htmlStr = $("<input id='"+id+"' name='"+id+"' type='hidden'/>");
      if(typeof(jsonObj.text)!='undefined'){
          input.val(jsonObj.text);
      }
      if(typeof(jsonObj.value)!='undefined'){
          htmlStr.val(jsonObj.value);
      }
      input.before(htmlStr);
      var spanStr=$("<span class='ico16 correlation_project_16'></span>");
      input.after(spanStr);
      if(htmlStr.height()!=0){
          input.height(htmlStr.height());
      }
	  width = width-spanStr.outerWidth(true)-8;
	  if(width>0){
		  input.width(width);
	  }else{
		  //IE7 下input.width()可能为0,只能延时后再获取。
		  setTimeout(function(){
			  width=input.width()-spanStr.outerWidth(true)-8;
			  input.width(width);
		  },300);
	  }
          
      spanStr.unbind("click").bind("click",function(){
          var selectId = input.prev().val();
          var resetCallback = jsonObj.resetCallback;
          var OkCallback = jsonObj.okCallback;
          var chooseProjectdialog = $.dialog({
             url : _ctxPath+'/project.do?method=getAllProjectList&isFormRel=true&selectId='+selectId,
             title : $.i18n('form.base.relationProject.title'),
             width : 700,
             height : 450,
             targetWindow : getCtpTop(),
             buttons : [ {
               text : $.i18n('common.button.reset.label'),
               handler : function() {
                   input.val("");
                   input.prev().val("");
                   if(resetCallback!=undefined){
                       resetCallback(spanStr);
                   }
                   chooseProjectdialog.close();
               }
             }, {
               text : $.i18n('common.button.ok.label'),
               handler : function() {
                   var retObj = chooseProjectdialog.getReturnValue();
                   if(retObj.value==''){
                       $.alert($.i18n('form.base.relationProject.chooseItem'));
                       return;
                   }else{
                       input.val(retObj.name);
                       input.prev().val(retObj.value);
                       if(OkCallback!=undefined){
                           OkCallback(spanStr);
                       }
                       chooseProjectdialog.close();
                   }
               }
             }, {
                 text : $.i18n('common.button.cancel.label'),
                 handler : function() {
                   chooseProjectdialog.close();
                 }
               }]
           });
      });
  }; 
  $.fn.showEditor = function(options) {
    var input = $(this);
    if (options.contentType == 'html') {
      var contextPath = _ctxPath;
      var settings = $.extend({}, {
        toolbarSet : 'Basic',
        category : '1',
        maxSize : 1048576
      }, options);
      input.attr('editorReadyState','loading');
      $.ajaxSetup({
        cache: true
      });      
      if(useFckEditor){
          $.getScript(contextPath + "/common/RTE/fckeditor.js", function() {
            var sBasePath = contextPath + "/common/RTE/";
    
            var oFCKeditor = new FCKeditor(input[0].id);
            oFCKeditor.BasePath = sBasePath;
            oFCKeditor.Config["DefaultLanguage"] = _locale.replace('_', '-')
                .toLowerCase();
            oFCKeditor.ToolbarSet = settings.toolbarSet;
    
            oFCKeditor.Config["ImageUploadURL"] = contextPath
                + '/fileUpload.do?method=processUpload&type=1&applicationCategory='
                + settings.category + '&extensions=jpg,gif,jpeg,png&maxSize='
                + settings.maxSize;
            oFCKeditor.Config["FlashUploadURL"] = contextPath
                + '/fileUpload.do?method=processUpload&type=1&applicationCategory='
                + settings.category + '&extensions=swf,fla&maxSize='
                + settings.maxSize;
            oFCKeditor.Config["ImageUploadMaxFileSize"] = "1M";
            oFCKeditor.ReplaceTextarea();
          });
      }else{
          var path = "/common/ckeditor";
          var bv = parseInt($.browser.version, 10);
          if(bv==11  && navigator.userAgent.match(/Trident\/7\./)){
            // ie 11使用4.3
            path = path + "43";
            CKEDITOR_BASEPATH = CKEDITOR_BASEPATH.replace('ckeditor','ckeditor43');
          }        
          $.getScript(contextPath + path + '/ckeditor.js', function() {
            CKEDITOR.basePath = contextPath + path + '/';
            CKEDITOR.baseHref = CKEDITOR.basePath;
            if (CKEDITOR.instances[input[0].id]) {
                CKEDITOR.instances[input[0].id].destroy();
            }
            CKEDITOR.replace(input[0].id,{
                height : '100%',
                startupFocus : true,
                toolbar : settings.toolbarSet,
                on : {
                    instanceReady : function( ev ) { 
                        input.attr('editorReadyState','complete');
                        input.trigger('editorReady',ev);
                        function resizeEditor(){
                            //OA-22421 修复正文由html切换到office时的resize事件空值异常
                            var cts = CKEDITOR.instances[input.attr('id')].ui.space( 'contents' );
                            if(cts) {
                              var height = $(document).height() - $(cts.$).offset().top - 5;
                              height = height<0 ? 0 : height;
                              try {
                                if(_fckEditorDecentHeight) {
                                  height -= 20;
                                }
                              }catch(e){}
                              cts.setStyle( 'height', height +'px' );
                            }
                        }
                        resizeEditor();
                        window.onresize = function(event) {
                            resizeEditor();
                        }
                        $(input[0]).parent().resize(function(){
                            resizeEditor();
                        });
                        // 为了避免onbeforeunload弹出提示，必须对a作特殊处理
                        if(v3x && v3x.isMSIE){
                          ev.editor.on('dialogShow', 
                              function(dialogShowEvent){
                                var allHref = dialogShowEvent.data._.element.$.getElementsByTagName('a');
                                for (var i = 0; i < allHref.length; i++) {
                                  var href = allHref[i].getAttribute('href');
                                  if(href && href.indexOf('void(0)')>-1){
                                    allHref[i].removeAttribute('href');
                                  }
                                };

                          });      
                        }   
                    }
                }
            });
          });      
      }
      $.ajaxSetup({
        cache: false
      }); 
    }
  };
  /**
   * 取得编辑器的内容。
   */
  $.fn.getEditorContent = function(options) {
    var input = $(this);
    var tc = input.attr('comp');
    if (tc) {
      var tj = $.parseJSON('{' + tc + '}')
      if (tj.type == 'editor' && tj.contentType == 'html') {
        if(useFckEditor){
          return FCKeditorAPI.GetInstance(this.attr('id')).GetHTML();
        }else{
          return CKEDITOR.instances[this.attr('id')].getData();
        }
      }
    }
    return null;
  }
  function setCkEditorData(name,value){
    if(this.CKEDITOR){
      var editor = CKEDITOR.instances[name];
      editor.setData(value);  
    }
    $('#'+name).bind('editorReady',function(){
      var editor = CKEDITOR.instances[name];
      editor.setData(value);      
    });
  }
  $.fn.setEditorContent = function(value) {
    var input = $(this);
    var tc = input.attr('comp');
    if (tc) {
      var tj = $.parseJSON('{' + tc + '}')
      if (tj.type == 'editor' && tj.contentType == 'html') {
        if(useFckEditor){
          FCKeditorAPI.GetInstance(this.attr('id')).SetHTML(value);
        }else{
          setCkEditorData(this.attr('id'),value);
        }        
        return null;
      }
    }
    if (input.val)
      input.val(value);
    return null;
  }
  $.fn.selectPeople = function(options) {
    var input = $(this), id = input.attr('id'), inited = input.attr('_inited'), delSize = 28;
    var valueInputName = id, valueInput, btp, btcl, bth, btn, showbtn = options.showBtn != undefined ? options.showBtn
        : false;
    if (inited) {
      valueInput = input.next();
      valueInputName = valueInput.attr("id");
      btp = valueInput.next(), btcl = btp.attrObj("tmpclone"), bth = btp
          .attr("_hide");
      btp.remove();
      valueInput.remove();
    } else {
      input.attr('id', id + '_txt');
      input.attr('name', id + '_txt');
      input.attr('readonly', 'readonly');
      if (showbtn&&!options.extendWidth&&input.width()!=0)
        input.width(input.width() - delSize);
      input.attr('_inited', 1);
    }
    if(options.text){
      input.val(options.text);
      input.attr('title',options.text);
    }
    valueInput = $('<input type="hidden" />');
    valueInput.attr('id', valueInputName);
    valueInput.attr('name', valueInputName);
    valueInput.attrObj('_comp', input);
    if(options.value){
      valueInput.val(options.value);
    }
    input.after(valueInput);
    if (showbtn) {
      var multiSelect = !(options.maxSize===1);
      var selectTypes = {'Account' : 'account',
        'Department' : 'dept',
        'Team' : 'team',
        'Post' : 'post',
        'Level' : 'level',    
        'Member' : 'people'     
      };
      var selectType = selectTypes[options.selectType];
      selectType = selectType ? selectType : 'people';
      btn = $('<span></span>');
      input.attrObj("_rel", btn);// for enable/disable using
      btn.attr('_isrel', 1);
      btn.attr('class', 'ico16 '+ (multiSelect?'check':'radio')  +'_'+selectType+'_16');
      btn.addClass('_autoBtn');

      if (btcl)
        btn.attrObj('tmpclone', btcl);
      if (bth == 1)
        btn.hide();
      valueInput.after(btn);
    } else {
      btn = input;
      btn.css("cursor", "pointer");
    }
    //继承原有input的宽度
    if(options.extendWidth){
    	if(!$.browser.msie || ($.browser.msie && (parseInt($.browser.version, 10)>=9))){//非ie ie9 ie10
	        var oldDisp = valueInput.css("display");
	        valueInput.css("display","block");
	        if(valueInput.css("width").indexOf("%")!=-1){
	            input.css("width",valueInput.css("width"));
	        }else{
	            if(valueInput.width()>0){
	                input.width(valueInput.width());
	            }
	        }
	        valueInput.css("display",oldDisp);
    	}
    	if (showbtn){
			var w = input.width()*2-input.outerWidth(true)-btn.outerWidth(true)-1;
			if(w>0){
    			input.width(w);
    		}
        }
    }
    function setValue(ret){
        input.val(ret.text);
        input.attr('title',ret.text);
        // 缓存以解决returnValueNeedType为false时的值传递问题
        if(ret.obj && (options.returnValueNeedType===false)){
          input.data('obj',ret.obj);
        }
        valueInput.val(ret.value);     
        // 将中间选择的结果记录到comp中，避免再次调用.comp方法回到初始状态
        var tc = input.attr("comp");
        if (tc) {
          var tj = $.parseJSON('{' + tc + '}');
          tj.value = ret.value;
          tj.text = ret.text;
          var com = $.toJSON(tj);
          input.attr("comp",com.substring(1, com.length - 1));
        }           
    }
    if(options.excludeElements){
        
    }
    options.id = input.attr('id');
    if (options.mode != 'modal') {
      options.callbk = function(ret) {
        setValue(ret);
        input.focus(); // for trigger validate component
      };
    }
    if (!options.params)
      options.params = {};
    btn.unbind("click").click(function() {
      options.params.value = valueInput.val();
      options.params.text = input.val();
      if(!options.elements){
        var obj = input.data('obj');
        // 如果没有在options中显式传入elements，取缓存的obj对象传入
        if(obj){
          options.elements = obj;
        }
      }      
      var ret = $.selectPeople(options);
      if (ret) {
        setValue(ret);
      }
    });
  };
  $.selectPeople = function(options) {
    var settings = {
      mode : 'div'
    };
    
    function cloneArray(ary) {
        var newAry = [];
        for(var i=0; i<ary.length; i++){
            if(Object.prototype.toString.call(ary[i]) == '[object Array]') {
                newAry.push(cloneArray(ary[i]));
            } else{
                newAry.push(ary[i]);
            }
        }
        return newAry;
    }
    
    options._window = window;
    options = $.extend(settings, options);
    var url = _ctxPath + '/selectpeople.do', ret;
    if (options.mode == 'modal') {
      if (options.preCallback)
        options.preCallback(options);
      // 弹出新窗口
      var retv = window.showModalDialog(url + "?isFromModel=true", options, 'dialogWidth=708px;dialogHeight=568px');
      if(retv != null && (typeof retv == "object")){
          retv.obj = cloneArray(retv.obj);
      }
      else if(retv == -1) {
        return;
      }
      if (retv) {
        ret = retv;
        if (options.callback)
          options.callback(retv, options);
      }
    } else {
      if (options.preCallback)
        options.preCallback(options);
      var dialog = $
          .dialog({
            id : "SelectPeopleDialog",
            url : url,
            width : 708,
            height : 530,
            title : $.i18n("selectPeople.page.title"),
            checkMax:true,
            transParams : options,
            targetWindow : getCtpTop(),
            buttons : [ {
              text : $.i18n('common.button.ok.label'),
              handler : function() {
                var retv = dialog.getReturnValue(),cl = true;
                if (retv == -1) {
                  return;
                }
                if (retv) {
                  if (options.callback && options.callback(retv, options))
                    cl = false;
                  if (options.callbk && options.callbk(retv))
                    cl = false;
                }
                if(cl)
                  dialog.close();
              }
            }, {
              text : $.i18n('common.button.cancel.label'),
              handler : function() {
                dialog.close();
              }
            } ],

            bottomHTML : "<table id=\"flowTypeDiv\" class=\"hidden\" width=\"\" border=\"0\" height=\"100%\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\">\r\n"
                + "  <tr>\r\n"
                + "    <td id=\"concurrentType\">&nbsp;&nbsp;&nbsp;&nbsp;\r\n"
                + "      <label for=\"concurrent\">\r\n"
                + "        <input id=\"concurrent\" name=\"flowtype\" type=\"radio\" value=\"1\" checked>&nbsp;<span>"
                + $.i18n("selectPeople.flowtype.concurrent.lable")
                + "</span>\r\n"
                + "      </label>&nbsp;&nbsp;&nbsp;\r\n"
                + "    </td>\r\n"
                + "    <td id=\"sequenceType\">\r\n"
                + "      <label for=\"sequence\">\r\n"
                + "        <input id=\"sequence\" name=\"flowtype\" type=\"radio\" value=\"0\">&nbsp;<span>"
                + $.i18n("selectPeople.flowtype.sequence.lable")
                + "</span>\r\n"
                + "      </label>&nbsp;&nbsp;&nbsp;\r\n"
                + "    </td>\r\n"
                + "    <td id=\"multipleType\">\r\n"
                + "      <label for=\"multiple\">\r\n"
                + "        <input id=\"multiple\" name=\"flowtype\" type=\"radio\" value=\"2\">&nbsp;<span>"
                + $.i18n("selectPeople.flowtype.multiple.lable")
                + "</span>\r\n"
                + "      </label>&nbsp;&nbsp;&nbsp;\r\n"
                + "    </td>\r\n"
                + "    <td id=\"colAssignType\">\r\n"
                + "      <label for=\"colAssign\">\r\n"
                + "        <input id=\"colAssign\" name=\"flowtype\" type=\"radio\" value=\"3\">&nbsp;<span>"
                + $.i18n("selectPeople.flowtype.colAssign.lable")
                + "</span>\r\n"
                + "      </label>\r\n"
                + "    </td>\r\n"
                + "  </tr>\r\n" + "</table>"
          });
    }
    return ret;
  };
  $.fn.showOffice = function(options) {
    var settings = {
      webRoot : _ctxServer
    };
    options = $.extend(settings, options);
    //如果指定类型无法打开，则尝试使用另一种类型打开 如果都不支持的话对office控件类型进行提示
    var typeReplace = [];
    typeReplace['.doc'] = '.wps';
    typeReplace['.wps'] = '.doc';
    typeReplace['.et'] = '.xls';
    typeReplace['.xls'] = '.et';
    var f = $.ctx.isOfficeEnabled(options.fileType);
    if(!f && typeReplace[options.fileType]){
        f = $.ctx.isOfficeEnabled(typeReplace[options.fileType]);
        if(f){
            options.fileType = typeReplace[options.fileType];
        }
    }
    if(f) {
      var od = $('<div id="officeFrameDiv" style="display:none;height:100%"><iframe src="" name="officeEditorFrame" id="officeEditorFrame" frameborder="0" width="100%" height="100%"></iframe></div>');
      this.replaceWith(od);
      createOCX(options);
      if(typeof officeSupportCallback != "undefined") {
        officeSupportCallback();
      }
    }else {
      this.replaceWith($('<center><font color="red" style="font-weight:bold">' + $.i18n('common.body.type.officeNotSupported') + '</font></center>'));
      if(typeof officeNotSupportCallback != "undefined") {
        officeNotSupportCallback();
      }
    }
  };
  $.fn.tab = function(tj) {
    var tb = this.attrObj("tabObj");
    if (tb)
      return tb;
    tj.id = this.attr('id');
    tb = new MxtTab(tj);
    this.attrObj("tabObj", tb);
    if (tj.mode && 'mouseOver' === tj.mode)
      tb.setMouseOver();
  };
  $.fn.tabEnable = function(tgt) {
    var tab = this.attrObj("tabObj");
    if (tab)
      tab.enable(tgt);
  };

  $.fn.tabDisable = function(tgt) {
    var tab = this.attrObj("tabObj");
    if (tab)
      tab.disabled(tgt);
  };

  $.fn.tabCurrent = function(tgt) {
    var tab = this.attrObj("tabObj");
    if (tab)
      tab.setCurrent(tgt);
  };

  $.fn.toolbar = function(options) {
    var par = {
      contextPath : _ctxPath,
      render : this[0].id
    };
    par = $.extendParam(par, options);
    var myBar = new WebFXMenuBar(par), toolbarOpt = options.toolbar;
    this.attrObj("toolbarObj", myBar);
    if (toolbarOpt) {
      if (!_isDevelop) {
        var toolbarOptTmp = [];
        $.each(toolbarOpt, function(n, val) {
          var rc = val.resCode, pi = val.pluginId, ps = false;
          $.privCheck(rc, pi, function() {
            toolbarOptTmp.push(val);
            ps = true;
          });
          if (ps && val.subMenu) {
            var smOpt = [];
            $.each(val.subMenu, function(ns, sm) {
              rc = sm.resCode, pi = sm.pluginId;
              $.privCheck(rc, pi, function() {
                smOpt.push(sm);
              });
            });
            val.subMenu = smOpt;
          }
        });
        toolbarOpt = toolbarOptTmp;
      }
      $.each(toolbarOpt, function(n, val) {
        var pm = $.extendParam({}, val);
        if (val.items)
          pm.items = val.items; // select的option
        if (val.subMenu)
          pm.subMenu = initSubMenu(val.subMenu);
        pm.id = pm.id ? pm.id : ("mb_" + n);
        myBar.add(new WebFXMenuButton(pm));
      });
    }
    function initSubMenu(sm) {
      var tm = new WebFXMenu();
      $.each(sm, function(n, val) {
        var pm = $.extendParam({}, val), mi;
        pm.id = pm.id ? pm.id : ("mi_" + n);
        mi = new WebFXMenuItem(pm);
        tm.add(mi);
        // doesn't support hirachy menu currently
        // if (val.subMenu)
        // mi.add(initSubMenu(val.subMenu));
      });
      return tm;
    }

    myBar.show();
    return myBar;
  };

  $.fn.toolbarEnable = function(tgt) {
    var tb = this.attrObj("toolbarObj");
    if (tb)
      tb.enabled(tgt);
  };

  $.fn.toolbarDisable = function(tgt) {
    var tb = this.attrObj("toolbarObj");
    if (tb)
      tb.disabled(tgt);
  };

  $.fn.menu = function(options) {
    var par = $.extendParam({
      render : this[0].id
    }, options);
    var menubar = new MxtMenuBar(par);

    if (options.menus) {
      $.each(options.menus, function(n, val) {
        var pm = $.extendParam({}, val);
        var menu = new MxtMenu(pm);
        if (val.items) {
          $.each(val.items, function(m, it) {
            menu.add(initMenuItem(it));
          });
        }
        menubar.add(menu);
      });
    }
    function initMenuItem(mi) {
      var pm = $.extendParam({}, mi);
      var mit = new MxtMenuItem(pm);
      if (mi.items) {
        var sm = new MxtSubMenu({});
        mit.add(sm);
        $.each(mi.items, function(n, is) {
          sm.add(initMenuItem(is));
        });
      }
      return mit;
    }

    menubar.show();

  };
  
  $.fn.htmlSignature = function(t,tj) {
    if(!$.v3x.isMSIE) {
      t.after($('<center><font color="red" style="font-weight:bold">' + $.i18n('common.isignaturehtml.notSupported') + '</font></center>'));
    }else { 
      if(t.length>0&&t[0].tagName.toLowerCase()==="input"){
          var twidth = 0;
          if(t.css("width")==="100%"||t.width()==0){
              twidth = t.parent("div").width();
          }else{
              twidth = t.width();
          }
          
          var theight = t.height();
          if(twidth==0){
              twidth = 100;
          }
          if(theight==0){
              theight = 20;
          }
          if(tj.showButton == true){
              var button = $("<span></span>");
              button.attr("id","signButton");
              button.attr("class",tj.buttonClass ? tj.buttonClass : "ico16 signa_16");
              if(tj.enabled===1){
                  button.unbind("click").bind("click",function(){
                      handWrite(tj.recordId,tj.signObj,false);
                  });
              }
              t.after(button);
              twidth = twidth-button.width()-2;
          }
          t[0].initWidth = twidth+"";
          t[0].initHeight = theight+"";
          t.attr("initWidth",twidth+"");
          t.attr("initHeight",theight+"");
      }
      tj.signObj = t[0];
      initHandWriteData(tj);
    }
  };
  
  function initFileUpload(t, tj) {
    t.attrObj("_attachShow") ? t.attrObj("_attachShow").remove() : null;
    downloadURL = _ctxPath
        + "/fileUpload.do?type="
        + ((tj.customType == undefined) ? 0 : tj.customType)
        + ((tj.firstSave == undefined) ? '' : ("&firstSave=" + tj.firstSave))
        + "&applicationCategory="
        + tj.applicationCategory
        + "&extensions="
        + ((tj.extensions == undefined) ? '' : tj.extensions)
        + ((tj.quantity == undefined) ? '' : ("&quantity=" + tj.quantity))
        + "&maxSize="
        + ((tj.maxSize == undefined) ? '' : tj.maxSize)
        + "&isEncrypt="
        + ((tj.isEncrypt == undefined) ? '' : tj.isEncrypt)
        + "&popupTitleKey="
        + ((tj.attachmentTrId == undefined) ? ''
            : ("&attachmentTrId=" + tj.attachmentTrId))
         + ((tj.embedInput == undefined) ? ''
            : ("&embedInput=" + tj.embedInput))
        + ((tj.showReplaceOrAppend == undefined) ? ''
            : ("&selectRepeatSkipOrCover=" + tj.showReplaceOrAppend))
        + ((tj.callMethod == undefined) ? '' : ("&callMethod=" + tj.callMethod))
          + ((tj.isShowImg == undefined) ? '' : ("&isShowImg=" + tj.isShowImg))
        + ((tj.takeOver == undefined) ? '' : ("&takeOver=" + tj.takeOver));
    
    //精灵上传附件
    var isA8geniusAdded=false;
    try{
      var ufa = new ActiveXObject('UFIDA_Upload.A8Upload.2');
      ufa.SetLimitFileSize(1024);
      isA8geniusAdded = true;
    }catch(e){
      isA8geniusAdded = false;
    }
    downloadURL += ((!isA8geniusAdded) ? '' : ("&isA8geniusAdded=" + isA8geniusAdded));

    var  formVisible=((tj.displayMode == undefined) ? "auto;" :  tj.displayMode) ;
    var styleStr = "style=\"overflow: "+formVisible+";height: auto;\"";
    if(tj.isShowImg){
        styleStr = " ";
    }
    var showAreaDiv = "<div id='attachmentArea"+ (tj.attachmentTrId ? tj.attachmentTrId : '') + "' "+styleStr+" requrl='" + downloadURL + "'></div>";
    if ($("#downloadFileFrame").length == 0) {
      showAreaDiv = showAreaDiv
          + "<div style=\"display:none;\"><iframe name=\"downloadFileFrame\" id=\"downloadFileFrame\" frameborder=\"0\" width=\"0\" height=\"0\"></iframe></div>";
    }
    if(tj.embedInput){
        t.append('<input type="text" style="display:none" id="'+(tj.embedInput ? tj.embedInput : '')+'" name="'+(tj.embedInput ? tj.embedInput : '')+'" value="">');
    }
    
    showAreaDiv = $(showAreaDiv);
    t.after(showAreaDiv);
    t.hide();
    t.attrObj("_attachShow", showAreaDiv);

    initAttData(t, tj, true,  (tj.embedInput ? tj.embedInput : ''));
    
    if(t.attr("attsdata")!=""){
        setTimeout(function(){
            var tempAtts = $.parseJSON(t.attr("attsdata"));
            //自适应图片的宽度和高度
            if(tempAtts!=null&&tj.isShowImg&&tempAtts.length>0){
                for(var i=0;i<tempAtts.length;i++){
                    if(tempAtts[i].subReference==tj.attachmentTrId){
                        var hiddenInput = $("#"+tj.embedInput);
                        hiddenInput.parent("div").css("display","block");
                        hiddenInput.css("display","block");
                        var displayDiv = $('#attachmentDiv_' + tempAtts[i].fileUrl);
                        var delSpanWidth=displayDiv.find(".ico16").width()+2;
                        displayDiv.width(hiddenInput.width()).height(hiddenInput.height());
                        displayDiv.find("img").width(hiddenInput.width()-delSpanWidth).height(hiddenInput.height());
                        hiddenInput.css("display","none");
                        hiddenInput.parent("div").css("display","none");
                        break;
                    }
                }
            }
        },300);
    }
  }
  function initAttData(t, tj, isAtt, embedInput) {
    var atts = tj.attsdata ? tj.attsdata : t.attr("attsdata") ? $.parseJSON(t
        .attr("attsdata")) : null;
    if (atts && atts instanceof Array) {
      var att;
      for ( var i = 0; i < atts.length; i++) {
        att = atts[i];
        if (isAtt) {
          if (att.type == 2)
            continue;
        } else {
          if (att.type != 2)
            continue;
        }
        var canFavourite=true;
        var  isShowImg=false;
        if(tj.canFavourite  != undefined) canFavourite=tj.canFavourite;
        if(tj.isShowImg  != undefined) isShowImg=tj.isShowImg;
        
        if (tj.attachmentTrId){
            if(att.reference !=att.subReference && tj.attachmentTrId!=att.subReference)
            continue;
          addAttachmentPoi(att.type, att.filename, att.mimeType,
              att.createdate ? att.createdate.toString() : null, att.size,
              att.fileUrl, tj.canDeleteOriginalAtts, tj.originalAttsNeedClone,
              att.description, att.extension, att.icon, tj.attachmentTrId,
              att.reference, att.category, false,null,embedInput,true, att.officeTransformEnable, att.v, canFavourite,isShowImg,att.id);
        }else
          addAttachment(att.type, att.filename, att.mimeType,
              att.createdate ? att.createdate.toString() : null, att.size,
              att.fileUrl, tj.canDeleteOriginalAtts, tj.originalAttsNeedClone,
              att.description, att.extension, att.icon, att.reference,
              att.category, false,null,true, att.officeTransformEnable, att.v,canFavourite);
      }
    }
  }

  function fileList(t) {
    theToShowAttachments = new ArrayList();
    var downloadURL = _ctxPath + "/fileUpload.do";
    var atts = t.attr("attsdata");
    if (atts != null && atts != '') {
      atts = $.parseJSON(atts);
    }
    var att;
    for ( var i = 0; i < atts.length; i++) {
      att = atts[i];
      theToShowAttachments.add(new Attachment(att.id, att.reference,
          att.subReference, att.category, att.type, att.filename, att.mimeType,
          att.createdate.toString(), att.size, att.fileUrl, '', null,
          att.extension, att.icon, true, 'true'));
    }
  }
  function showFileList(t, tj) {
    showAttachment(tj.subRef, tj.atttype, tj.attachmentTrId, tj.numberDivId);
  }

  function assdoc(t, tj) {
    t.after($('<div id="attachment2Area'
        + (tj.attachmentTrId ? tj.attachmentTrId : '') + '" poi="'
        + (tj.attachmentTrId ? tj.attachmentTrId : '') + '"  ' +(tj.embedInput ? ' embedInput="'+tj.embedInput+'"' : '')+(tj.callMethod ? ' callMethod="'+tj.callMethod+'"' : '')+' requestUrl="'
        + _ctxPath + '/ctp/common/associateddoc/assdocFrame.do?isBind='
        + (tj.modids ? tj.modids : '') 
        +'&referenceId='+(tj.referenceId ? tj.referenceId : '') 
        +'&applicationCategory='+(tj.applicationCategory ? tj.applicationCategory : '') 
        + '&poi='
        + (tj.attachmentTrId ? tj.attachmentTrId : '')
        + ('" style="overflow: '+((tj.displayMode == undefined) ? "auto;max-height: 36px":  tj.displayMode)+'min-height: 20px;"></div>')));
    
    if(tj.embedInput){
    t.append('<input type="hidden" id="'+(tj.embedInput ? tj.embedInput : '')+'" name="'+(tj.embedInput ? tj.embedInput : '')+'" value="">');
    }
    initAttData(t, tj, false, (tj.embedInput ? tj.embedInput : ''));
  }
  // 替换页面input
  function showInput(t, cls, tj) {
    var obj = $(t[0]);
    obj.width(obj.width() - 21);
    var html = "<span class=\"margin_l_5 ico16 " + cls + "_16\"";
    tj.fun ? html += " onclick='" + tj.fun + "()'" : null;
    tj.fun ? html += " title='" + tj.title + "'" : null;
    html += "></span> ";
    obj.after(html);
  }
//var onlyNumber = {
//    start : /^[.]|[^0123456789.-]+|[.-]{2,}|[-]$/g,
//    end : /^[.]|[^0123456789.-]+|[.-]{2,}|[.-]$/g,
//    type :/^[-+\d]+$/, 
//    nonNumber : /[.-]+/g
//}
//限制输入框只能输入小数
/**
 * 自己的clone方法jquery is so bad
 */
$.fn.ctpClone = function(){
	if(this){
		return $.ctpClone($(this));
	}
}
$.ctpClone = function(jqObj){
	if(jqObj && jqObj.size()>0){
	    var cloneObj;
	    if(jqObj[0].outerHTML){
	        //****ie7下jquery的clone方法复制出来的对象有问题，因为如果对复制出来的对象设置attr自定义属性的时候会将老对象的attr给修改了,jquery is so bad！
	        cloneObj = $(jqObj[0].outerHTML.replace(/jQuery\d+="\d+"/g,""));
	    }else{
	        cloneObj = jqObj.clone();
	    }
	    return cloneObj;
	}
}
function onlyInputNumber(e){
    var tempThis = $(this);
    var value = tempThis.val();
    if(value.length>0){
        var onlyNumber = e.data;
        if(isNaN(value) || !onlyNumber.type.test(value)){
            value = value.replace(onlyNumber.start,"");
            if(value!="-" && value!="+" && isNaN(value)){
                value = value.replace(onlyNumber.nonNumber,"");
            }
        }
        if(onlyNumber.decimalDigit!=null){
        	var dotIndex = value.indexOf("."), allLength = value.length;
        	if(dotIndex>-1){
        		if(onlyNumber.decimalDigit<=0){
        			value = value.substr(0,dotIndex);
        		}else{
        			value = value.substr(0,dotIndex+onlyNumber.decimalDigit+1);
        		}
        	}
        }
        tempThis.val(value);
    }
    tempThis = null;
}
function deleteNonNumber(e){
    var tempThis = $(this);
    var value = tempThis.val();
    if(value.length>0){
        var onlyNumber = e.data;
        if(isNaN(value) || !onlyNumber.type.test(value)){
            //焦点移开时，将非法字符全部转换
            value = value.replace(onlyNumber.end,"");
            if(value!="-" && value!="+" && isNaN(value)){
                value = value.replace(onlyNumber.nonNumber,"");
            }
        }
        if(onlyNumber.decimalDigit!=null){
        	var dotIndex = value.indexOf("."), allLength = value.length;
        	if(dotIndex>-1){
        		if(onlyNumber.decimalDigit<=0){
        			value = value.substr(0,dotIndex);
        		}else{
        			value = value.substr(0,dotIndex+onlyNumber.decimalDigit+1);
        		}
        	}
        }
        tempThis.val(value);
    }
    tempThis = null;
}
function percentFunctionKeyUp(e){
    var tempThis = $(this);
    var value = tempThis.val();
    if(value.length>0){
        var index = value.lastIndexOf("%");
        var numberValue = value;
        if(index>-1){
            numberValue = value.sub(0, index);
        }
        if(isNaN(numberValue) || !/^[-+]?\d+(\.\d*)?$/.test(value)){
            if(!$.isANumber(numberValue)){
                numberValue = numberValue.replace(/[^\d]+/g,"");
            }
            tempThis.val(numberValue);
        }
    }
    tempThis = null;
}
function percentFunctionBlur(e){
    var tempThis = $(this);
    var value = tempThis.val();
    if(value.length>0){
        var index = value.lastIndexOf("%");
        var numberValue = value;
        if(index>-1){
            numberValue = value.sub(0, index);
        }
        if(isNaN(numberValue) || !/^\d+(\.\d+)?$/.test(value)){
            if(!$.isANumber(numberValue)){
                numberValue = numberValue.replace(/[^\d]+/g,"");
            }
            tempThis.val(numberValue+"%");
        }
    }
    tempThis = null;
}
function thousandthFunctionKeyUp(e){
	var tempThis = $(this);
    var value = tempThis.val();
    if(value.length>0){
		var numberValue = value;
    	if(value.length<=3){
    		if(isNaN(numberValue) || !/^[-+]?\d+$/.test(value)){
	            if(!$.isANumber(numberValue)){
	                numberValue = numberValue.replace(/[^\d]+/g,"");
	            }
	            tempThis.val(numberValue);
	        }
    	} else {
    		var tempReg = /^\d\d\d(,\d\d\d)*,\d{0,3}$/;
	        if(!tempReg.test(value)){
	        	numberValue = numberValue.match(/\d\d\d(,\d\d\d)*(,\d{0,3})?/);
	        	if(numberValue==null){
	        		numberValue = "";
	        	}else{
	        		numberValue = numberValue[0];
	        	}
	        	tempThis.val(numberValue);
	        }
    	}
    }
    tempThis = null;
}
function thousandthFunctionBlur(e){
	var tempThis = $(this);
    var value = tempThis.val();
    if(value.length>0){
		var numberValue = value;
    	if(value.length<=3){
    		if(isNaN(numberValue) || !/^[-+]?\d+$/.test(value)){
	            if(!$.isANumber(numberValue)){
	                numberValue = numberValue.replace(/[^\d]+/g,"").substr(0,3);
	            }
	            tempThis.val(numberValue);
	        }
    	} else {
	        var tempReg = /^\d\d\d(,\d\d\d)*$/;
	        if(!tempReg.test(value)){
	        	numberValue = numberValue.match(/\d\d\d(,\d\d\d)*/);
	        	if(numberValue==null){
	        		numberValue = "";
	        	}else{
	        		numberValue = numberValue[0];
	        	}
	        	tempThis.val(numberValue);
	        }
    	}
    }
    tempThis = null;
}
$.fn.extend({
    onlyNumber : function (obj){
        //限制为只给输入框绑定事件。
        if(this[0] && this[0].nodeName  && this[0].nodeName.toUpperCase() == "INPUT"){
            if(this.prop("type")=="text"){
                var type = obj.numberType, decimalDigit = obj.decimalDigit;
                if(isNaN(decimalDigit)){
                	decimalDigit = null;
                }
                if(type=="delete"){
                    this.unbind("keyup",onlyInputNumber).unbind("blur",deleteNonNumber);
                }else{
                    if(type=='percent'){
                        this.unbind("keyup",percentFunctionKeyUp).unbind("blur",percentFunctionBlur);
                        this.bind("keyup",percentFunctionKeyUp).bind("blur",percentFunctionBlur);
                    }else if(type=="thousandth"){
                        this.unbind("keyup",thousandthFunctionKeyUp).unbind("blur",thousandthFunctionBlur);
                        this.bind("keyup",thousandthFunctionKeyUp).bind("blur",thousandthFunctionBlur);
                    }else{
                        var onlyNumber = {};
                        switch(type){
                            case "int" : {
                                onlyNumber.start = /[^0123456789-]+|[-]{2,}|[-]$/g;
                                onlyNumber.end = /[^0123456789-]+|[-]{2,}|[-]$/g;
                                onlyNumber.nonNumber = /[-]+/g;
                                onlyNumber.type = /^[-+]?\d+$/;
                                onlyNumber.decimalDigit = decimalDigit;
                                break;
                            };
                            case "float" : {
                                onlyNumber.start = /^[.]|[^0123456789.-]+|[.-]{2,}/g;
                                onlyNumber.end = /^[.]|[^0123456789.-]+|[.-]{2,}|[.-]$/g;
                                onlyNumber.nonNumber = /[.-]+/g;
                                onlyNumber.type = /^[-+]?\d+(\.\d+)?$/;
                                onlyNumber.decimalDigit = decimalDigit;
                                break;
                            };
                            default : {
                                onlyNumber.start = /^[.]|[^0123456789.-]+|[.-]{2,}/g;
                                onlyNumber.end = /^[.]|[^0123456789.-]+|[.-]{2,}|[.-]$/g;
                                onlyNumber.nonNumber = /[.-]+/g;
                                onlyNumber.type = /^[-+]?\d+$/;
                                onlyNumber.decimalDigit = decimalDigit;
                                break;
                            };
                        }
                        this.unbind("keyup",onlyInputNumber).unbind("blur",deleteNonNumber);
                        this.bind("keyup",onlyNumber,onlyInputNumber)
                            .bind("blur",onlyNumber,deleteNonNumber);
                    }
                }
            }
        }
    }
});
})(jQuery);