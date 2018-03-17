/// <reference path="../scriptes/jquery.js" />
/**
 *
 * @author macj
 */
function MxtTab(options){
    this.id = options.id;
    this.width = options.width ? options.width : null;
    this.height = options.height ? options.height : null;
    this.parentId = options.parentId ? options.parentId : null;
    this.refreashTab = options.refreashTab ? options.refreashTab : false;
    this.hideTabHeight = options.hideTabHeight ? options.hideTabHeight : false;
    this.init();
}

MxtTab.prototype.init = function(){
    this.tabs_head = $('#' + this.id+'_head');
    this.tabs_body = $('#' + this.id + '_body');
    //获取客户端页面宽高
    var _client_width = document.body.clientWidth;
    var _client_height = document.documentElement.clientHeight;
    
	if(this.width==null){
		this.width = _client_width-2;
	}
	if(this.height == null){
	    this.height = _client_height - this.tabs_head.height() - 2;
	}
	if (this.parentId != null) {
	    this.width = $("#" + this.parentId).width() - 2;
	    this.height = $("#" + this.parentId).height() - this.tabs_head.height() - 2;
	}
	if (this.hideTabHeight) {
	    this.height = this.height - this.tabs_head.height();
	}
	this.tabs_head.css('width',this.width);
	this.tabs_body.css({'width':this.width,'height':this.height});
	
	this.tabs = $('#' + this.id+'_head a');
    var self = this;
    this.tabs.each(function (i) {
		var target = $(this).attr('tgt');
		$('#' + target).css('height', self.height);
        //把iframe的src清空,保存到hSrc,然后触发时在设置src,以解决iframe中js宽度计算错误
		if ($('#' + target)[0]) {
		    if (i != 0 && $('#' + target)[0].tagName.toLowerCase() == "iframe" && self.tabs_body.find("iframe").size() != 1) {
		        if(!$('#' + target).attr("hSrc"))  $('#' + target).attr("hSrc", $('#' + target).attr("src"));
		        $('#' + target).attr("src", "");
		    }
		}
		$(this).click(function () {
		    if ($('#' + target)[0]) {
		        $(this).parent().addClass('current').siblings().removeClass('current');
		        $('#' + target).removeClass('hidden').addClass("show").siblings().removeClass('show').addClass("hidden");
		        if (($('#' + target).attr("src") == ""||self.refreashTab) && $('#' + target)[0].tagName.toLowerCase() == "iframe" && self.tabs_body.find("iframe").size() != 1) {
		            $('#' + target).attr("src", $('#' + target).attr("hSrc"));
		        }
		    }
		})
    });
}
MxtTab.prototype.disabled = function(tgt){
	this.tabs.each(function(i){
		var target = $(this).attr('tgt');
		if(target == tgt){
			$(this).addClass('disable').unbind("click");
		}
	});
}
MxtTab.prototype.enable = function(tgt){
	this.tabs.each(function(i){
		var target = $(this).attr('tgt');
		if(target == tgt){
			$(this).removeClass('disable').click(function(){
				$(this).parent().addClass('current').siblings().removeClass('current');
				$('#'+target).removeClass('hidden').addClass("show").siblings().removeClass('show').addClass("hidden");
			});
		}
	});
}
MxtTab.prototype.setCurrent = function (tgt) {
    var self = this;
	this.tabs.each(function(i){
		var target = $(this).attr('tgt');
		if(target == tgt){
			$(this).parent().addClass('current').siblings().removeClass('current');
			$('#' + target).removeClass('hidden').addClass("show").siblings().removeClass('show').addClass("hidden");
			if ($('#' + target)[0]) {
			    if ($('#' + target)[0].tagName.toLowerCase() == "iframe" && self.tabs_body.find("iframe").size() != 1) {
			        var _obj = $('#' + target);
			        var _src = _obj.attr("src");
			        _obj.attr("src", "");
			        _obj.attr("src", _src);
			    }
			}
		}
	});
}
MxtTab.prototype.setMouseOver = function () {
    var self = this;
	this.tabs.each(function(i){
	    var target = $(this).attr('tgt');
	    if ($('#' + target)[0]) {
	        if (i != 0 && $('#' + target)[0].tagName.toLowerCase() == "iframe" && self.tabs_body.find("iframe").size() != 1) {
	            $('#' + target).attr("hSrc", $('#' + target).attr("src"));
	            $('#' + target).attr("src", "");
	        }
	    }
		$(this).unbind("click").mouseover(function(){
			if ($('#' + target)[0]) {
			    $(this).parent().addClass('current').siblings().removeClass('current');
			    $('#' + target).removeClass('hidden').addClass("show").siblings().removeClass('show').addClass("hidden");
			    if ($('#' + target).attr("src") == "" && $('#' + target)[0].tagName.toLowerCase() == "iframe" && self.tabs_body.find("iframe").size() != 1) {
			        $('#' + target).attr("src", $('#' + target).attr("hSrc"));
			    }
			}
		})
	});
}
MxtTab.prototype.setClick = function () {
    var self = this;
	this.tabs.each(function(i){
	    var target = $(this).attr('tgt');
	    if ($('#' + target)[0]) {
	        if (i != 0 && $('#' + target)[0].tagName.toLowerCase() == "iframe" && self.tabs_body.find("iframe").size() != 1) {
	            $('#' + target).attr("hSrc", $('#' + target).attr("src"));
	            $('#' + target).attr("src", "");
	        }
	    }
		$(this).unbind("mouseover").click(function () {
			if ($('#' + target)[0]) {
			    $(this).parent().addClass('current').siblings().removeClass('current');
			    $('#' + target).removeClass('hidden').addClass("show").siblings().removeClass('show').addClass("hidden");
			    if ($('#' + target).attr("src") == "" && $('#' + target)[0].tagName.toLowerCase() == "iframe" && self.tabs_body.find("iframe").size() != 1) {
			        $('#' + target).attr("src", $('#' + target).attr("hSrc"));
			    }
			}
		})
	});
}
///重新设置大小
MxtTab.prototype.resetSize = function (json) {
    if (this.width == null) {
        this.width = _client_width - 2;
    }
    if (this.height == null) {
        this.height = _client_height - this.tabs_head.height() - 2;
    }
    if (this.parentId != null) {
        this.width = $("#" + this.parentId).width() - 2;
        this.height = $("#" + this.parentId).height() - this.tabs_head.height() - 2;
    }
    if (this.hideTabHeight) {
        this.height = this.height - this.tabs_head.height();
        alert(this.height)
    }
    var json = json;
    if (json == null) {
        json = [];
    }
    if (json.width != null) {
        this.width = json.width;
    }
    if (json.height != null) {
        this.height = json.height;
    }
    this.tabs_head.css('width', this.width);
    this.tabs_body.css({ 'width': this.width, 'height': this.height });
    this.tabs_body.children().css({ 'width': this.width, 'height': this.height });
}