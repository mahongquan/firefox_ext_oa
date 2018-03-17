//记录鼠标离开位置
var states = 0;
var idArray = [];
/**
 * 人员对应的操作菜单项定义
 */
function MemberMenuItem(menuId, menuName, menuAction, menuTarget){
	this.menuId = menuId;
	this.menuName = menuName;
	this.menuAction = menuAction;
	this.menuTarget = menuTarget;
}

function showPerCard(rid,attrId){
	if(idArray.indexOf(attrId)==-1){
		idArray.push(attrId);
		$("#"+attrId).PeopleCardMini({memberId:rid});
	}
}

/**
 * 设置人员操作菜单项
 */
function setMemberMenu(menuList, style){
	var str = new StringBuffer();
	str.append("<table width='100%' border='0' cellspacing='0' cellpadding='0' onmouseover='divOver()' onmouseout='divLeave()'>")
    for(var i = 0; i < menuList.size(); i ++){
        var menuItem = menuList.get(i);
            str.append("<tr>");
            str.append(" <td height='20'>");
            if(menuItem.menuTarget){
				str.append("  <a " + style + " title=\"" + menuItem.menuName + "\" href=\"" + menuItem.menuAction + "\" target=\"" + menuItem.menuTarget +"\">");
            }else{
            	str.append("  <a " + style + " title=\"" + menuItem.menuName + "\" href=\"" + menuItem.menuAction + "\">");
            }
            str.append(menuItem.menuName);
            str.append("  </a>");
            str.append(" </td>");
            str.append("</tr>");
    }
    str.append("</table>");
    return str;
}

/**
 * 离开人员
 */
function leave(){
	setTimeout("hide()", 400);
}

/**
 * 隐藏人员操作菜单
 */
function hide(){
	if(this.states == 0){
		var divObj = document.getElementById("memberMenuDIV") || parent.document.getElementById("memberMenuDIV");
		divObj.style.display = "none";
	}
}

/**
 * 进入人员操作菜单
 */
function divOver(){
	this.states = 1;
}

/**
 * 离开人员操作菜单
 */
function divLeave(){
	this.states = 0;
	leave();
}

function sendMail(email){
	getA8Top().main.location.href = "/seeyon/webmail.do?method=create&defaultaddr=" + email;
}

function sendColl(id){
	getA8Top().main.location.href = "/seeyon/collaboration/collaboration.do?method=newColl&from=relatePeople&memberId=" + id;
}

/**
 * 人员操作菜单
 */
function showMemberMenu(rId, rName, rEmail, hasSendColl, hasSendMsg, hasSendMail, openType, target){
	var memberMenuArray = new ArrayList();
	if(hasSendColl == "true"){
	    memberMenuArray.add(new MemberMenuItem(rId, v3x.getMessage("MainLang.section_send_coll"), "javascript:sendColl('" + rId + "')", null));
	}
	if(hasSendMsg == "true"){
		memberMenuArray.add(new MemberMenuItem(rId, v3x.getMessage("MainLang.section_send_message"), "javascript:getA8Top().sendUCMessage('" + rName + "', '" + rId + "')", openType));
	}
    if(hasSendMail == "true"){
		memberMenuArray.add(new MemberMenuItem(rId, v3x.getMessage("MainLang.section_send_email"), "javascript:sendMail('" + rEmail + "')", null));    	
    }
    memberMenuArray.add(new MemberMenuItem(rId, v3x.getMessage("MainLang.section_info_member"), "javascript:showV3XMemberCard('" + rId + "')", openType));    	
    var str = setMemberMenu(memberMenuArray);
    var divObj = document.getElementById("memberMenuDIV");
	divObj.innerHTML = str;
	
//    var posX = target.offsetLeft;
//    var posY = target.offsetTop;
//    
//    var aBox = target;//需要获得位置的对象
//    do {
//        aBox = aBox.offsetParent;
//        posX += aBox.offsetLeft;
//        posY += aBox.offsetTop;
//    }
//    while (aBox.tagName != "BODY");
//    
//    posX -= 2;
//    posY += 5;
//    var right_div_portal_sub_temp = document.getElementById('right_div_portal_sub');
//    if(!v3x.isMSIE9 && !v3x.isMSIE8 && !v3x.isMSIE7 && v3x.isMSIE6 && right_div_portal_sub_temp){
//    	posY-=parseInt(right_div_portal_sub_temp.scrollTop);
//    }
	
	var posX = target.getBoundingClientRect().left;
	var posY = target.getBoundingClientRect().top;
	
	posX -= 2;
	posY += 10;
	divObj.style.left = posX+"px";
	divObj.style.top = posY+"px";
	
	divObj.style.display = "block";
}

/**
 * 时间安排操作菜单
 */
function showTimingMenu(time, e){
	var memberMenuArray = new ArrayList();
	if(hasNewMeeting == "true"){
		memberMenuArray.add(new MemberMenuItem("", v3x.getMessage("MainLang.new_meeting_label"), "javascript:newMeeting('" + meetingUrl + "', '" + time + "');"));
	}
	if(hasNewPlan == "true"){
		memberMenuArray.add(new MemberMenuItem("", v3x.getMessage("MainLang.new_plan_label"), "javascript:newPlan('" + planUrl + "', '2', '" + time + "');"));
	}
	if(hasNewTask == "true"){
		memberMenuArray.add(new MemberMenuItem("", v3x.getMessage("MainLang.new_task_label"), "javascript:newTask('" + taskManageUrl + "', '" + time + "');"));
	}
	if(hasNewCal == "true"){
		memberMenuArray.add(new MemberMenuItem("", v3x.getMessage("MainLang.new_cal_label"), "javascript:newCal('" + calUrl + "', '" + time + "');"));
	}
	
    var str = setMemberMenu(memberMenuArray, "style='color:#ffffff;'");
    var divObj = document.getElementById("memberMenuDIV");
	divObj.innerHTML = str;
	e = e || event;
	var divLeft = e.clientX;
	var divTop = e.clientY;
	if((divLeft + 90) >= document.body.clientWidth){
		divLeft = divLeft - 90;
	}
	if((divTop + 90) >= document.body.clientHeight){
		divTop = divTop - 90;
	}
	
	divObj.style.left = divLeft + "px";
	divObj.style.top = divTop + "px";
	divObj.style.display = "block";
}

/**
 * 显示操作图标
 */
function showEditImage(id){
	var element = document.getElementById(id +　"Img");
	if(element){
		element.src="/seeyon/apps_res/peoplerelate/images/button.gif";
	}
}

/**
 * 隐藏操作图标
 */
function removeEditImage(id){
	var element = document.getElementById(id +　"Img");
	if(element){
		element.src="/seeyon/common/images/space.gif";
	}
}
	