//图表类型常量
var ChartType = new Object();
ChartType.column = 1;
ChartType.bar = 2;
ChartType.line_vertical = 3;
ChartType.line_horizontal = 4;
ChartType.spline_vertical = 5;
ChartType.spline_horizontal = 6;
ChartType.pie = 7;
ChartType.doughnut = 8;
ChartType.area_vertical = 9;
ChartType.area_horizontal = 10;
ChartType.radar = 11;
ChartType.marker_vertical = 12;
ChartType.marker_horizontal = 13;
ChartType.column_cylinder = 14;
ChartType.bar_cylinder = 15;
ChartType.gauges_circular = 101;//圆形仪表图
 
//用于保存当前页面所有图的html_id的变量
var currentSeeyonChartList = new Array();

if(window.attachEvent){
	/**协同V5.0 OA-39357
	window.attachEvent("onbeforeunload", function() {
        removeCurrentSeeyonChart();
    });* 
     */
    window.attachEvent("onunload", function() {
        removeCurrentSeeyonChart();
    });
}else{
	/**
	window.addEventListener("onbeforeunload", function() {
        removeCurrentSeeyonChart();
    });* 
     */
    window.addEventListener("onunload", function() {
        removeCurrentSeeyonChart();
    });
}




function inputSeeyonChart(htmlId,chart){
	if(currentSeeyonChartList != null){
        for(var i=0;i<currentSeeyonChartList.length;i++){
        	if(currentSeeyonChartList[i].htmlId == htmlId){
        		removeSeeyonChart(currentSeeyonChartList[i],false);
        		currentSeeyonChartList.splice(i,1);
        		break;
        	}
        }
        var chartObj = new Object();
        chartObj.htmlId = htmlId;
        chartObj.seeyonChart = chart;
        currentSeeyonChartList.push(chartObj);
    }
}

function removeSeeyonChart(chartArray,canEmpty){
	//防内存泄漏
	if(canEmpty == false){
	}else{
		try{//如果删除不了，至少保证不报flash_removecallback的错误!
            $("#"+chartArray.htmlId).empty();
        }catch(e){}
	}
	try{
		chartArray.seeyonChart.chart.remove();
	}catch(e){}
	chartArray.seeyonChart = null;
	chartArray = null;
	if($.browser.msie){
		CollectGarbage();
	}
}

/**
 * 销毁当前页面的所有Flash图表
 */
function removeCurrentSeeyonChart(){
	if(currentSeeyonChartList != null){
		for(var i=0;i<currentSeeyonChartList.length;i++){
			removeSeeyonChart(currentSeeyonChartList[i]);
		}
	}
	currentSeeyonChartList = null;
}

//堆叠图等功能常量
var Scalemode = new Object();
Scalemode.normal = "Normal";//默认格式
Scalemode.stacked = "Stacked";//堆叠图，适用所有常规图(Bar, Line, Area, etc.)
Scalemode.percentStacked = "PercentStacked";//百分比堆叠图，适用所有常规图(Bar, Line, Area, etc.)
Scalemode.overlay = "Overlay";//重叠图，仅适用于Bar
Scalemode.sortedOverlay = "SortedOverlay";//排序叠加图，仅适用于Bar, Bubble

// 图表渲染格式（flash/html5）
var ChartRenderType = new Object();
// 只通过FLASH渲染
ChartRenderType.FLASH_ONLY = "FLASH_ONLY";
// 只通过HTML5渲染
ChartRenderType.SVG_ONLY = "SVG_ONLY";
// 优先FLASH渲染，不支持则切换HTML5渲染
ChartRenderType.FLASH_PREFERRED = "FLASH_PREFERRED";
// 优先HTML5渲染，不支持则切换FLASH渲染
ChartRenderType.SVG_PREFERRED = "SVG_PREFERRED";

//实例化drawChartManager
var chartAjaxManager;

//TODO 常规图构造函数
function SeeyonChart(options){
  if(chartAjaxManager == undefined){
    chartAjaxManager = new drawChartManager();
  }
  
  //首先初始化参数
  this.initParams(options);
  
  this.refreshChart();
  
}

/**
 * 将参数转换为对象
 * @param options
 */
SeeyonChart.prototype.initParams = function(options){
  //TODO 参数初始化
  var anyChart = null;
  if(options.chartJson != undefined){
    anyChart = options.chartJson;
  }else{
    anyChart = new Object();
  }
  
  //图类型,默认柱状
  anyChart.chartType = options.chartType ? options.chartType : (anyChart.chartType ? anyChart.chartType : ChartType.column);
  
  if(anyChart.chartType == ChartType.gauges_circular){
    //仪表盘、温度计核心配置
    anyChart.circulars = options.circulars ? options.circulars: (anyChart.circulars ? anyChart.circulars : null);
  }else{//常规图
    //是否3D，默认不是  boolean
    if(options.is3d != undefined){
      anyChart.is3d = options.is3d;
    }else if(anyChart.is3d == undefined){
      anyChart.is3d = false;
    }
    //是否动画效果,默认显示动画 boolean
    if(options.animation != undefined){
      anyChart.animation = options.animation;
    }else if(anyChart.animation == undefined){
      anyChart.animation = false;
    }
    //x轴标题 string
    anyChart.xTitle = options.xTitle ? options.xTitle : (anyChart.xTitle ? anyChart.xTitle : "");
    //y轴标题 string
    anyChart.yTitle = options.yTitle ? options.yTitle : (anyChart.yTitle ? anyChart.yTitle : "");
    //副标题 string
    anyChart.subtitle = options.subtitle ? options.subtitle : (anyChart.subtitle ? anyChart.subtitle : "");
    //脚注 string
    anyChart.footer = options.footer ? options.footer : (anyChart.footer ? anyChart.footer : "");
    //冒泡提示 string
    anyChart.toolTip = options.toolTip ? options.toolTip : (anyChart.toolTip ? anyChart.toolTip : "");
    //在图上显示文字 string
    anyChart.insideLabel = options.insideLabel ? options.insideLabel : (anyChart.insideLabel ? anyChart.insideLabel : "");
    //在图内显示文字string
    anyChart.outsideLabel = options.outsideLabel ? options.outsideLabel : (anyChart.outsideLabel ? anyChart.outsideLabel : "");
    //图内/图外文字字体大小
    anyChart.labelFontSize = options.labelFontSize ? options.labelFontSize : (anyChart.labelFontSize ? anyChart.labelFontSize : "");
    //X轴的字段是否竖直显示，默认不竖直显示string
    anyChart.xRotate = options.xRotate ? options.xRotate : (anyChart.xRotate ? anyChart.xRotate:"");
    //X轴显示滚动条，定义一次性显示多少条字段 int
    if(options.xZoom != undefined){
      anyChart.xZoom = options.xZoom;
    }
    //X轴文字宽度，超过则换行
    anyChart.xLabelWidth = options.xLabelWidth ? options.xLabelWidth : (anyChart.xLabelWidth ? anyChart.xLabelWidth:"");
    //在右边显示分类说明 string
    if(options.legend != undefined){
      anyChart.legend = options.legend;
    }else if(anyChart.legend == undefined){
      anyChart.legend = "";
    }
    //点击图是否展开（针对圆饼图）
    if(options.explodeOnClick != undefined){
      anyChart.explodeOnClick = options.explodeOnClick;
    }else if(anyChart.explodeOnClick == undefined){
      anyChart.explodeOnClick = true;
    }
    //x轴scale
    if(options.xScale != undefined){
      anyChart.xScale = options.xScale;
    }
    //y轴scale
    if(options.yScale != undefined){
      anyChart.yScale = options.yScale;
    }
    //y轴文字自定义化
    if(options.yLabels != undefined){
      anyChart.yLabels = options.yLabels;
    }
    //特殊线配置
    if(options.lines != undefined){
      anyChart.lines = options.lines;
    }
    //图例
    if(options.legendNode != undefined){
      anyChart.legendNode = options.legendNode;
    }
    //多序列多toolTip提示
    anyChart.extraSeriesTooltip = options.extraSeriesTooltip ? options.extraSeriesTooltip : (anyChart.extraSeriesTooltip ? anyChart.extraSeriesTooltip : null);
    //多轴操作
    anyChart.extraYaxisNodeList = options.extraYaxisNodeList ? options.extraYaxisNodeList : (anyChart.extraYaxisNodeList ? anyChart.extraYaxisNodeList : null);
    //多轴对应值
    anyChart.extraYaxisNameList = options.extraYaxisNameList ? options.extraYaxisNameList : (anyChart.extraYaxisNameList ? anyChart.extraYaxisNameList : null);
    //该序列的图表类型
    anyChart.seriesTypes = options.seriesTypes ? options.seriesTypes : (anyChart.seriesTypes ? anyChart.seriesTypes : null);
    //该序列的图表名称
    anyChart.seriesNames = options.seriesNames ? options.seriesNames : (anyChart.seriesNames ? anyChart.seriesNames : null);
    //X轴数据集和
    anyChart.indexNames = options.indexNames ? options.indexNames : (anyChart.indexNames ? anyChart.indexNames : null);
    //Y轴数据集合
    anyChart.dataList = options.dataList ? options.dataList : (anyChart.dataList ? anyChart.dataList : null);
    //Y轴数据ID集合
    anyChart.dataIdList = options.dataIdList ? options.dataIdList : (anyChart.dataIdList ? anyChart.dataIdList : null);
    //Y轴数据自定义颜色集合
    anyChart.dataColorList = options.dataColorList ? options.dataColorList : (anyChart.dataColorList ? anyChart.dataColorList : null);
    //该序列的图表ID名称
    anyChart.seriesIdNames = options.seriesIdNames ? options.seriesIdNames : (anyChart.seriesIdNames ? anyChart.seriesIdNames : null);
  }
  //标题 string
  anyChart.title = options.title ? options.title: (anyChart.title ? anyChart.title : "");
  //图与flash边框的距离（似乎只有负数才能紧贴边框）
  anyChart.marginAll = options.marginAll ? options.marginAll: (anyChart.marginAll ? anyChart.marginAll : "-10");
  //无数据
  if(options.noData){
  	anyChart.noData = options.noData;
  }
  //是否显示图表边框，默认显示
  if(options.border != undefined){
    anyChart.border = options.border;
  }else if(anyChart.border == undefined){
    //默认不显示边框
    anyChart.border = false;
  }
  //图类型 对应ChartCatgoryEnum
  anyChart.chartCatgory = options.chartCatgory ? options.chartCatgory : (anyChart.chartCatgory ? anyChart.chartCatgory : null);
  //将anyChart放入对象中
  this.params = anyChart;
  
  //被渲染的标签ID
  this.htmlId = options.htmlId ? options.htmlId : "";
  //宽度
  this.width = options.width ? options.width : "100%";
  //高度（这是一个显而易见确没发现的错误，吾将height后两位写反了，为了保证以前调用能继续使用，果断容错处理了）
  if(options.heigth != undefined){
    this.height = options.heigth;
  }else if(options.height != undefined){
    this.height = options.height;
  }else{
    this.height = "100%";
  }
  
  //图表渲染类型
  this.renderingType = options.renderingType ? options.renderingType : ChartRenderType.FLASH_PREFERRED;
  //图表XML值
  this.xmlData = options.xmlData ? options.xmlData : null;
  
  //point节点事件
  this.event = options.event ? options.event : null;
  //后台是否打印图形数据
  this.debugge = options.debugge ? options.debugge : false;
  
  //TODO 针对报表模块，对图表进行特殊处理
  if(options.fromReport == true || this.params.chartCatgory == 1){
    this.initReport(this.params);
  }else if(this.params.chartCatgory == 2){//TODO 针对表单统计进行特殊处理
  	this.initFormReport(this.params);
  }
  if(!$.isNull(this.params.chartXML)){
    this.xmlData = this.params.chartXML;
  } 
  
};

/**
 * 针对表单统计进行滚动条设置以及换行设置
 */
SeeyonChart.prototype.initFormReport = function(options){
	if($.isNull(options.xZoom)){
  		this.initFormScroll(options);
  	}else if(options.xZoom == -1){
  		this.initFormScroll(options);
  	}
}

/**
 * TODO 针对T7/F8报表图表标准进行特别处理
 */
SeeyonChart.prototype.initReport = function(options){
  //所有图形初始时尽量使用动态效果
  if(options.animation == null){
  	options.animation = true;
  }
  
  //在保障清晰的前提下，优先对图中的数值使用label
  if(options.chartType == ChartType.pie){
    //饼状图默认3D
    if(options.is3d == null){
    	options.is3d = true;
    }
    if($.isNull(options.insideLabel)){
    	options.insideLabel = "true";
    }
  }else{
  	if($.isNull(options.outsideLabel)){
  		options.outsideLabel = "report_true";
  	}
  }
  //打开toolTip
  if(options.seriesNames != undefined && options.seriesNames.length > 0){
    options.toolTip = options.toolTip ? options.toolTip : "{%Name}-{%SeriesName}-{%Value}{trailingZeros:false}";
  }else{
    options.toolTip = options.toolTip ? options.toolTip : "{%Name}-{%Value}{trailingZeros:false}";
  }
  
  //至少要使用图例
  if(options.seriesNames != undefined && options.seriesNames.length > 1){
    options.legend =  options.legend != null ? options.legend : "true";
  }else{
    options.legend =  options.legend != null ? options.legend : "points_true";
  }
  //不需要蓝色边框
  if(options.border == undefined){
    options.border = false;
  }
  
  //自动识别滚动条功能
  if($.isNull(options.xZoom)){
  	this.initScroll(options);
  }else if(options.xZoom == -1){
  	this.initScroll(options);
  }
};

/**
 * TODO 自动调整X轴文字角度
 */
SeeyonChart.prototype.getMaxXLabel = function(options,indexName){
  var indexNameList = options.indexNames;
  
  if(!indexName && options.seriesNames != undefined && options.seriesNames.length > 1){
    indexNameList = options.seriesNames;
  }else{
    indexNameList = options.indexNames;
  }
  var maxLength = 0;
  var currentLength = 0;
  if(indexNameList != undefined && indexNameList.length>0){
    for(var i=0;i<indexNameList.length;i++){
      currentLength = this.getStringWidth(indexNameList[i]);
      if(maxLength < currentLength){
        maxLength = currentLength;
      }
    }
  }
  return maxLength;
};

/**
 * 计算文字个数，1个中文占两个，其余占1个
 * @param str
 * @returns
 */
SeeyonChart.prototype.getStringWidth = function(str){
  var width = len = str.length;
  for(var i=0; i < len; i++) {
      if(str.charCodeAt(i) >= 255) {
          width++;
      }
  }
  return width;
};

/**
 * 处理表单统计的换行和滚动条
 */
SeeyonChart.prototype.initFormScroll = function(options){
	var oneBarWidth = 1146/18;
	var div_width = $("#"+this.htmlId).width();   //宽度
	var minBarNums = div_width/oneBarWidth;
	
	var dataList = options.dataList;
  	var seriesTypes = options.seriesTypes;
	if(dataList != undefined && dataList.length>0){
    	var indexNums = dataList[0].length; //X轴指标数量
    	var seriesNums = 1;   //每个指标值数量
		if(seriesTypes != undefined && seriesTypes.length>1){
      		for(var i=1;i<seriesTypes.length;i++){
        		if($.isNull(seriesTypes[i]) && this.isBar(options.chartType)){
          			//如果类型为空并且默认类型为柱状则自增
          			seriesNums++;
        		}else if(this.isBar(seriesTypes[i])){
          			//如果类型就是柱状则自增
          			seriesNums++;
        		}
      		}//end of for
   	 	}else if(seriesTypes == undefined && dataList.length > 1){
      		//如果没有配置seriesType并且数据集超过1个则根据默认类型判断
      		for(var i=1;i<dataList.length;i++){
        		if(this.isBar(options.chartType)){
       		   		seriesNums++;
        		}
      		}
    	}//end of else if
    
    	if(options.yScale != undefined){
    	  	//多图堆叠递增
    	  	seriesNums = 1;
   		}
	
		var allChartNums = indexNums*seriesNums;//柱子总条数
		if(allChartNums > minBarNums){//柱子总数超出了最小柱子范围则出滚动条
			options.xZoom = minBarNums/seriesNums+""; //设置滚动条
			options.xLabelWidth = "50";
			options.xLabelFormat = "{%Value}{maxChar:8,maxCharFinalChars:...}";
		}else{//文字换行的问题
			options.xLabelWidth = "80";
		}
		
	}//end of if(dataList != undefined
}

/**
 * TODO 自动增加滚动条功能
 */
SeeyonChart.prototype.initScroll = function(options){
  var div_width = $("#"+this.htmlId).width();   //宽度
  var dataList = options.dataList;
  var seriesTypes = options.seriesTypes;
  if(dataList != undefined && dataList.length>0){
    var indexNums = dataList[0].length; //X轴指标数量
    var seriesNums = 1;   //每个指标值数量
    
    if(seriesTypes != undefined && seriesTypes.length>1){
      for(var i=1;i<seriesTypes.length;i++){
        if($.isNull(seriesTypes[i]) && this.isBar(options.chartType)){
          //如果类型为空并且默认类型为柱状则自增
          seriesNums++;
        }else if(this.isBar(seriesTypes[i])){
          //如果类型就是柱状则自增
          seriesNums++;
        }
      }//end of for
    }else if(seriesTypes == undefined && dataList.length > 1){
      //如果没有配置seriesType并且数据集超过1个则根据默认类型判断
      for(var i=1;i<dataList.length;i++){
        if(this.isBar(options.chartType)){
          seriesNums++;
        }
      }
    }
    
    if(options.yScale != undefined){
      //多图堆叠递增
      seriesNums = 1;
    }
    var formula_min = 79;
    //运算公式:  div_width:indexNums*seriesNums
    var eachWidth = 20; 
    var eachWidth_ = 10;
    var maxLegend = this.getMaxXLabel(options,false);
    var seriesNumsIndex = seriesNums == 1 ? seriesNums : seriesNums/2;
    var formula = div_width/(indexNums*seriesNumsIndex + maxLegend/eachWidth_);
    var hasScroll = false;
    if(formula < formula_min){
      hasScroll = true;
      var xZoom = div_width/(formula_min*seriesNumsIndex + formula_min*(maxLegend/eachWidth) );
      if(xZoom < indexNums){//防护
      	options.xZoom = xZoom;
      }
    }
    
    if(!$.isNull(this.params.chartXML)){
        if(options.xZoom != null && options.xZoom != -1){
            options.chartXML = options.chartXML.replace("zoomEnableFlag","true");
            options.chartXML = options.chartXML.replace("zoomFlag",options.xZoom);
        }else{
            options.chartXML = options.chartXML.replace("zoomEnableFlag","false");
            options.chartXML = options.chartXML.replace("zoomFlag","-1");
        }
    }
    
    //斜线运算式
    var maxXLabel = this.getMaxXLabel(options,true);
    var xLabelWidth = null;
    
    if(seriesNums*indexNums < ((maxXLabel*indexNums+maxLegend)/eachWidth_)){
    	if(hasScroll){
    		options.xLabelWidth = "60";
    	}else{
    		options.xLabelWidth = "80";
    	}
    }
    if(!$.isNull(this.params.chartXML)){
    	if(options.xLabelWidth != null){
    		options.chartXML = options.chartXML.replace("xLabelWidthFlag",options.xLabelWidth);
    	}else{
    		options.chartXML = options.chartXML.replace("xLabelWidthFlag","-1");
    	}
    }
    
    if(hasScroll){
    	options.xZoom = Math.floor(options.xZoom);
    }
    
  }
};

SeeyonChart.prototype.isBar = function(chartType){
  return chartType == ChartType.column || chartType == ChartType.bar || chartType == ChartType.column_cylinder || chartType == ChartType.bar_cylinder;
};

/**
 * TODO AJAX获取XML数据同时渲染图形
 */
SeeyonChart.prototype.ajaxGetData = function(){

  var thisObj = this;
  var manager = chartAjaxManager;
  if(this.params.chartType == ChartType.gauges_circular){
    //仪表盘、温度计核心配置
    manager.parseGaugesToXML(this.debugge, this.params,{
      success:function(xmlNode){
        thisObj.renderChart(xmlNode.xmlStr);
      }
    });
    //this.renderChart(manager.parseGaugesToXML(this.debugge, this.params).xmlStr);
  }else{
    //常规图
    manager.parseToXML(this.debugge,this.params,{
      success:function(xmlNode){
        thisObj.renderChart(xmlNode.xmlStr);
      }
    });
    //this.renderChart(manager.parseToXML(this.debugge,this.params).xmlStr);
  }
};

/**
 * 设置图表渲染类型
 */
SeeyonChart.prototype.setChartRenderType = function(){
  if(this.renderingType == ChartRenderType.FLASH_ONLY){
    AnyChart.renderingType = anychart.RenderingType.FLASH_ONLY;
  }else if(this.renderingType == ChartRenderType.SVG_ONLY){
    AnyChart.renderingType = anychart.RenderingType.SVG_ONLY;
  }else if(this.renderingType == ChartRenderType.FLASH_PREFERRED){
    AnyChart.renderingType = anychart.RenderingType.FLASH_PREFERRED;
  }else if(this.renderingType == ChartRenderType.SVG_PREFERRED){
    AnyChart.renderingType = anychart.RenderingType.SVG_PREFERRED;
  }
};

var url_anyChart = _ctxPath+"/common/report/chart/swf/AnyChart.swf";
var url_anyChart_preloader = _ctxPath+"/common/report/chart/swf/Preloader.swf";


SeeyonChart.prototype.refreshChart = function(){
  if(this.xmlData == null){
    this.ajaxGetData();
  }else{
    this.renderChart();
  }
};

/**
 * 渲染显示图形
 */
SeeyonChart.prototype.renderChart = function(xmlData){
  //错误提示
  if(xmlData == undefined && this.xmlData == undefined){
    $.error("图表数据格式不正确，无法显示指定图表!");
    return;
  }
  //设置渲染类型
  this.setChartRenderType();
  if(this.chart == undefined){
    this.chart = new AnyChart(url_anyChart,url_anyChart_preloader);
  }
  this.setEvent(this.event);
  this.chart.width = this.width;
  this.chart.height = this.height;
  this.chart.setXMLData(xmlData ? xmlData : this.xmlData);
  this.chart.wMode = "transparent"; //flash不透明，防层遮罩
  try{
  	this.chart.write(this.htmlId);
    
    var chart = this.chart;
    var htmlId = this.htmlId;
    var obj = this;
    
    inputSeeyonChart(htmlId,obj);
    //this.chart.addEventListener('draw', function(e){
        
    //});
  }catch(e){}
  
};

SeeyonChart.prototype.setEvent = function(event){
  if(this.chart != undefined && this.event != null){
    for(var i=0 ;i < event.length ; i++){
      var eventObj = event[i];
      //防止重复事件
      this.chart.removeEventListener(eventObj.name,eventObj.func);
      this.chart.addEventListener(eventObj.name, eventObj.func);
    }
  }
};

SeeyonChart.prototype.clear = function(){
  if(this.chart != undefined){
    this.params.seriesNames = null;
    this.params.indexNames = null;
    this.dataList = null;
    this.chart.clear();
  }
};

/**
 * 打印图表
 */
SeeyonChart.prototype.printChart = function(){
  if(this.chart != undefined){
    this.chart.printChart();
  }
};

/**
 * 另存为图片
 */
SeeyonChart.prototype.saveAsImage = function(){
  if(this.chart != undefined){
    this.chart.saveAsImage();
  }
};