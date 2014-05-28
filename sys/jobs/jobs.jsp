<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h"%>
<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f"%>
<%@ taglib uri="https://ajax4jsf.dev.java.net/ajax" prefix="a4j"%>
<%@ taglib uri="/WEB-INF/GWallTag" prefix="g"%>

<html>
	<head>
		<title>作业调度</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="作业调度">
		<link href="<%=request.getContextPath()%>/css/style.css"
			rel="stylesheet" type="text/css" />
		<script type="text/javascript" src="jobs.js"></script>
		<script type="text/javascript"
			src='<%=request.getContextPath()%>/js/Gbase.js'></script>
		<script type="text/javascript"
			src='<%=request.getContextPath()%>/js/Gwallwin.js'></script>
	</head>

	<body id=mmain_body onload="init()">
		<div id=mmain>
			<f:view>
				<h:form id="list">
					<div id=mmain_opt>
						<a4j:commandButton id="saveButton" value="新增" onclick="addDiv();"
							onmouseover="this.className='a4j_over'"	onmouseout="this.className='a4j_buton'" styleClass="a4j_but"/>
						<a4j:commandButton id="startButton" value="启动" type="button"
							action="#{jobsMB.start}" onclick="if(!setState(gtable2,'start')){return false};"
							reRender="outTable,msg" oncomplete="endDo();" requestDelay="50"
							onmouseover="this.className='a4j_over'"	onmouseout="this.className='a4j_buton'" styleClass="a4j_but" />
						<a4j:commandButton id="stopButton" value="终止" type="button"
							action="#{jobsMB.stop}" onclick="if(!setState(gtable2,'stop')){return false};"
							reRender="outTable,msg" oncomplete="endDo();" requestDelay="50"
							onmouseover="this.className='a4j_over'"	onmouseout="this.className='a4j_buton'" styleClass="a4j_but" />
						<a4j:commandButton id="pauseButton" value="暂停" type="button"
							action="#{jobsMB.pause}" onclick="if(!setState(gtable2,'pause')){return false};"
							reRender="outTable,msg" oncomplete="endDo();" requestDelay="50"
							onmouseover="this.className='a4j_over'"	onmouseout="this.className='a4j_buton'" styleClass="a4j_but" />
						<a4j:commandButton id="resumeButton" value="恢复" type="button"
							action="#{jobsMB.resume}" onclick="if(!setState(gtable2,'resume')){return false};"
							reRender="outTable,msg" oncomplete="endDo();" requestDelay="50"
							onmouseover="this.className='a4j_over'" onmouseout="this.className='a4j_buton'" styleClass="a4j_but" />
						<a4j:commandButton id="runBtn" value="执行" type="button"
							action="#{jobsMB.run}" onclick="if(!setState(gtable2,'run')){return false};" 
							reRender="outTable,msg" oncomplete="endDo();" requestDelay="50"
							onmouseover="this.className='a4j_over'" onmouseout="this.className='a4j_buton'" styleClass="a4j_but" />
						<a4j:commandButton id="synchronousBtn" value="同步" type="button"
							action="#{jobsMB.synchronousJob}" onclick="startDo()" 
							reRender="outTable,msg" oncomplete="endDo('yes');" requestDelay="50"
							onmouseover="this.className='a4j_over'" onmouseout="this.className='a4j_buton'" styleClass="a4j_but" />
						<a4j:commandButton id="delButton" value="删除" type="button"
							action="#{jobsMB.delete}" onclick="if(!deleteAll(gtable2)){return false};"
							reRender="outTable,msg" oncomplete="endDo();" requestDelay="50"
							rendered="#{jobsMB.DEL}" onmouseover="this.className='a4j_over'"
							onmouseout="this.className='a4j_buton'" styleClass="a4j_but" />
					</div>
					<a4j:outputPanel id="outTable">
						<g:GTable gid="gtable2" gtype="grid" gversion="2"
							gselectsql="select id,joid,jogn,jona,joty,jotm,jopm,stat,uptm,nttm,rema,ctna,cttm From jobs "
							gpage="(pagesize = 20)"
							gcolumn="gcid = id(headtext = selcheckbox,name = selcheckbox,width = 30,headtype = checkbox,align = center,type = checkbox,datatype=string);
								gcid = 0(headtext = 序号,name = rowid,width = 30,headtype = sort,align = center,type = text,datatype=string);
								gcid = -1(headtext = 操作,name = opt,width = 30,headtype = sort,align = center,type = link,linktype = script,typevalue = javascript:viewFun(gcolumn[1]),value = 详细);
								gcid = joid(headtext = 编码,name = joid,width = 60,headtype = sort,align = center,type = text);
								gcid = jogn(headtext = 所在组,name = jogn,width = 90,headtype = sort,align = center,type = text);
								gcid = jona(headtext = 名称,name = jona,width = 90,headtype = sort,align = center,type = text);
								gcid = joty(headtext = 动作,name = joty,width = 120,headtype = sort,align = center,type = text);
								gcid = jotm(headtext = 间隔,name = jotm,width = 100,headtype = sort,align = center,type = text);
								gcid = stat(headtext = 状态,name = stat,width = 40,headtype = sort,align = center,type = mask,typevalue={1:运行中/0:已暂停/-1:已终止});
								gcid = uptm(headtext = 上次运行,name = uptm,width = 120,headtype = sort,align = center,type = text);
								gcid = nttm(headtext = 下次运行,name = nttm,width = 120,headtype = sort,align = center,type = text);
								gcid = ctna(headtext = 创建人,name = ctna,width = 60,headtype = sort,align = center,type = text);
								gcid = cttm(headtext = 创建时间,name = cttm,width = 120,headtype = sort,align = center,type = text);
								" />
					</a4j:outputPanel>
					<h:inputHidden id="sellist" value="#{jobsMB.sellist}"></h:inputHidden>
				</h:form>
				<div id="edit" style="display: none">
					<h:form id="edit">
						<h:inputHidden id="selid" value="#{jobsMB.selid}" />
						<div id=mmain_hide>
							<a4j:commandButton id="view" value="查看"
								action="#{jobsMB.getJobsinfo}" reRender="outTable,msg,editarea"
								oncomplete="view_show();" requestDelay="50" />
						</div>
						<a4j:outputPanel id="editarea">
							<table align="center">
								<tr>
									<td bgcolor="#efefef">
										编码:
									</td>
									<td>
										<h:inputText id="joid" value="#{jobsMB.bean.joid}"
											styleClass="inputtext" />
									</td>

									<td bgcolor="#efefef">
										所在组:
									</td>
									<td>
										<h:inputText id="jogn" value="#{jobsMB.bean.jogn}"
											styleClass="inputtext" />
									</td>
									<td bgcolor="#efefef">
										名称:
									</td>
									<td>
										<h:inputText id="jona" value="#{jobsMB.bean.jona}"
											styleClass="inputtext" />
									</td>
								</tr>
								<tr>
									<td bgcolor="#efefef">
										状态:
									</td>
									<td>
										<h:selectOneMenu id="stat" value="#{jobsMB.bean.stat}" styleClass="selectItem">
											<f:selectItem itemLabel="启动" itemValue="1" /><!-- 这里只是在新增的时候用到.1创建0就不创建 -->
											<f:selectItem itemLabel="暂停" itemValue="0" />
										</h:selectOneMenu>
									</td>
									<td bgcolor="#efefef">
										动作:
									</td>
									<td colspan="2">
										<h:inputHidden id="joty" value="#{jobsMB.bean.joty}"/>
										<span id="actionAdd">
											<input type="checkbox" id="joty1" checked name="joty" value="Run" onclick="this.checked=true;"/><label for="joty1">后台执行</label>
											<input type="checkbox" id="joty2" name="joty" onchange="this.checked ? ToEmail.style.display='' : ToEmail.style.display='none';" value="Email"/><label for="joty2">邮件通知</label>
										</span>
										<span id="actionView" style="display:none"></span>
									</td>
								</tr>
								<tr>
									<td bgcolor="#efefef">
										间隔:
									</td>
									<td colspan="5">
										<h:inputHidden id="jotm" value="#{jobsMB.bean.jotm}"/>
										<span id="SelectTime_span">
									        <label for="select"></label>
									        <select name="time_m" id="time_m" onchange="getSelect()">
									           <option value="*">不限制</option>
									        <%for(int i=0;i<60;i++){%>
									        <option value="<%=i%>"><%=i%></option>
									        <%} %>
									        </select>
									        秒
									        <select name="time_f" id="time_f" onchange="getSelect()">
									           <option value="*">不限制</option>
									         <%for(int i=0;i<60;i++){%>
									        <option value="<%=i%>"><%=i%></option>
									        <%} %>
									        </select>
									        分
									        <select name="time_h" id="time_h" onchange="getSelect()">
									        <option value="*">不限制</option>
									         <%for(int i=0;i<24;i++){%>
									        <option value="<%=i%>"><%=i%></option>
									        <%} %>
									        </select>
									        时
									        <select name="time_r" id="time_r" onchange="getSelect()">
									         <option value="?">不限制</option>
									         <%for(int i=1;i<32;i++){%>
									        <option value="<%=i%>"><%=i%></option>
									        <%} %>
									      </select>
									        日
									        <select name="time_y" id="time_y" onchange="getSelect()">
									        <option value="*">不限制</option>
									         <%for(int i=1;i<13;i++){%>
									        <option value="<%=i%>"><%=i%></option>
									        <%} %>
									        </select>
									        月
									        <select name="time_z" id="time_z" onchange="getSelect()">
									        <option value="?">不限制</option>
									         <%for(int i=1;i<7;i++){%>
									        <option value="<%=i%>"><%=i%></option>
									        <%} %>
									        <option value="0">7</option>
									        </select>
									        周 </span>
									     	<span id="InputTime_span" style="display:none;">
									        <input type="text" name="inputTime" id="inputTime" size="50" onblur="getTimeMsg(this.value)"/>
									       <a href="javascript:void();" title="格式为6段:秒 分 时 日 月 周,以空格分隔<br>
* 表示什么值都可以<br>
? 只能放在日和周上<br>
, 表示可以是多个值<br>
/ 表示在前者基础上增加后者数量<br>
- 表示取值范围<br>
L 只能用在日和周上,表示此域上的最后一个值<br>
# 只能用在周上,表示第(后者)周的星期(前者-1)<br>
1/5 8 * * * 1<br>
表示星期一的每个小时过8分钟第1秒执行,之后第6秒执行<br>
1 * 1-3 1 * ?<br>
表示每个月的1号晚上1点到3点的每分钟的第一秒执行<br>
1 * 1,5 1 * ?<br>
表示每个月的1号晚上1点和5点的每分钟的第一秒执行">帮助</a>
									      	</span>
									      	<a4j:commandButton id="jotmBtn" value="输入" onclick="InputTimeFun(event);"
							onmouseover="this.className='a4j_over'"	onmouseout="this.className='a4j_buton'" styleClass="a4j_but"
							/>
									</td>
								</tr>
								<tr>
									<td bgcolor="#efefef">
										含义:
									</td>
									<td colspan="5">
										<span id="sjhy"><font color="red" size=1>请选择间隔!</font></span>
									</td>
								</tr>
								<tr>
									<td bgcolor="#efefef">
										调用:
									</td>
									<td colspan="5">
										<h:inputHidden id="jopm" value="#{jobsMB.bean.jopm}"/>
										<textarea id="classPath" rows="5" cols="100" onblur="AddClass(this,true)"></textarea>
										<a href="javascript:void()" title="这里的值是用于指定调用类的方法.以;分隔多个类路径.方法,如:com.Aclass.A(3,2).B('ABCD').C(43.23).D()表示创建一个Aclass对象并调用其中的A,B,C,D方法,参数注意类型!;如果使用
										com.Aclass.A(3,2);com.Aclass.B('ABCD');这样就是创建一个Aclass对象调用A方法.再创建一个Aclass对象调用B方法.请认真填写,这个验证不严格!!!">提醒</a>
									</td>
								</tr>
								<tr>
									<td bgcolor="#efefef">
										邮件:
									</td>
									<td colspan="5" height="85">
										<span id="ToEmail" style="display:none">
											<textarea rows="5" cols="100" id="emailAddress" onblur="AddEmail(this,true)"></textarea>
											<a href="javascript:void()" title="这里的值是任务执行完成后,以邮件方式通知哪些邮箱地址.以;分隔多个邮箱地址.">提醒</a>
										</span>
									</td>
								</tr>
								<tr>
									<td bgcolor="#efefef">
										备注:
									</td>
									<td colspan="5">
										<h:inputHidden id="rema" value="#{jobsMB.bean.rema}"/>
										<textarea id="rema" rows="3" cols="100"></textarea>
										<a href="javascript:void()" title="请填写此作业的说明.">提醒</a>
									</td>
								</tr>
								<tr>
									<td colspan="6" align="center">
										<input id="userName" type="hidden" value="<%=session.getAttribute("username")%>"/>
										<h:inputHidden id="ctna" value="#{jobsMB.bean.ctna}"/>
										<h:inputHidden id="updateflag" value="#{jobsMB.updateflag}" />
										<a4j:commandButton id="saveBtn" action="#{jobsMB.save}" value="保存"
											reRender="outTable,msg"
											onclick="if(!formCheck()){return false};"
											oncomplete="endDo();" onmouseover="this.className='a4j_over'"
											onmouseout="this.className='a4j_buton'" styleClass="a4j_but" />
										<a4j:commandButton onmouseover="this.className='a4j_over'"
											onmouseout="this.className='a4j_buton'" styleClass="a4j_but"
											value="返回" onclick="hideDiv();" />
										<h:inputHidden id="msg" value="#{jobsMB.msg}"></h:inputHidden>
									</td>
								</tr>
								<tr>
								</tr>
							</table>
						</a4j:outputPanel>
					</h:form>
				</div>
			</f:view>
		</div>
		<%
		Double total = (Runtime.getRuntime().totalMemory()) / (1024.0 * 1024);
		Double max = (Runtime.getRuntime().maxMemory()) / (1024.0 * 1024);
		Double free = (Runtime.getRuntime().freeMemory()) / (1024.0 * 1024);
		%>
	<div>当前JVM最大可用内存: <%=max.longValue() %> MB</div>
	<div>当前JVM占用内存总数: <%=total.longValue()%> MB</div>
	<div>当前JVM空闲内存数量: <%=free.longValue()%> MB</div>
	<div>当前JVM实际可用内存: <%=(max.longValue() - total.longValue() + free.longValue()) %> MB</div>
	</body>
</html>