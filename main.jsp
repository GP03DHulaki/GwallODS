<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h"%>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f"%>

<html>
	<head>
		<title>系统登录...</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<link href="skin/login.css" rel="stylesheet" type="text/css" />
	</head>
	<script type="text/javascript">
			function load(){
				var skin = getCookie("GwallSkin");
				if(skin == null)skin = "skin_blue";
				document.getElementById("backGroundImg").className = skin+"_bg";
				document.getElementById("pagebody").className = skin+"_ct";
				document.getElementById("form1:nv_userid").focus();
				if(document.getElementById("form1:errorinfo")!=null && document.getElementById("form1:errorinfo").innerText.length>0){
					var msgs=document.getElementById("form1:errorinfo").innerText;
	        		alert(msgs);
					document.getElementById("form1:errorinfo").innerText="";
				}
				document.getElementById("form1:nv_userid").value="";
				document.getElementById("form1:nv_userid").focus();
			}
			function getCookie(name){
				var nameCK = name + "=";
				var ca = document.cookie.split(';');
				for(var i=0;i < ca.length;i++){
					var c = ca[i];
					while (c.charAt(0)==' ') c = c.substring(1,c.length);
					if (c.indexOf(nameCK) == 0) return c.substring(nameCK.length,c.length);
				}
				return null;
			}
			function checkInfo(){
				var nv_userid=document.getElementById("form1:nv_userid").value;
				var passWord=document.getElementById("form1:passWord").value;
				if(nv_userid.indexOf("-")>=0){
					alert("用户名不能包括'-'号！");
					return false;
				}
				if(passWord.indexOf("-")>=0){
					alert("密码不能包括'-'号！");
					return false;
				}
				if(nv_userid.indexOf(".")>=0){
					alert("用户名不能包括'.'号！");
					return false;
				}
				if(passWord.indexOf(".")>=0){
					alert("密码不能包括'.'号！");
					return false;
				}
				if(nv_userid==""){
					alert("用户名不能为空！");
					return false;
				}
				if(passWord==""){
					alert("密码不能为空！");
					return false;
				}
			}
			
			function reset(){
				document.getElementById("form1:nv_userid").value = "";
				document.getElementById("form1:passWord").value = "";
				return true;
			}
	</script>

	<body onload="load();">
		<f:view>
			<h:form id="form1">
				<div id="backGroundImg">
					<TABLE border=0 cellSpacing=0 cellPadding=0 width="100%" height="100%">
						<tr>
							<td align=center>
								<div id="pagebody" >
									<div class="loginimg">
										<div class="label_1"></div>
										<div class="textbox_1">
											<h:inputText id="nv_userid" value="#{LoginMB.userid}"
												style="width:135px" 
												onkeypress="if(event.keyCode==13){document.getElementById('form1:nv_userid').focus();}"
												onfocus="this.select();" />
										</div>
										<div class="clear"></div>
										<div class="label_2"></div>
										<div class="textbox_2">
											<h:inputSecret id="passWord" value="#{LoginMB.password}"
												style="width:135px"
												onkeypress="if (event.keyCode==13){return checkInfo();}" 
												onfocus="this.select()" />
										</div>
										<div class="clear"></div>
										<div class="label_4">
											<span style="padding-right:5px;">
												<h:commandButton styleClass="login" image="images/login1.gif"
													onclick="return checkInfo();" action="#{LoginMB.login}" />
											</span>
											<span style="padding-left:5px;">
												<h:commandButton styleClass="reset" image="images/login2.gif" onclick="reset();" />
											</span>
										</div>
									</div>
								
							</td>
						</tr>
					</TABLE>
				</div>
				<h:messages style="display:none;" id="errorinfo" />
			</h:form>
		</f:view>
		<div style="POSITION: absolute; right: 30px; bottom: 20px;">
			&copy; 2008-2012 深圳市巨软科技开发有限公司
		</div>
	</body>
</html>