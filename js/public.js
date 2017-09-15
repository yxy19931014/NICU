//子页面input获取焦点后底部选项卡和保存按钮的显示状态
if(window.plus){
		plusReady();
	}else{
		document.addEventListener("plusready",plusReady,false);
	}
	function plusReady(){
		var detailPage=plus.webview.getWebviewById('detail_main.html');
		var inputs=document.getElementsByTagName('input');
			for(var i=0;i<inputs.length;i++){
				inputs[i].addEventListener('focus',function(){
					if(document.body.querySelector('.saveBack')){
						document.body.querySelector('.saveBack').style.display='none';
						mui.fire(detailPage,'footerHide');
					}
				})
				inputs[i].addEventListener('blur',function(){
					if(document.body.querySelector('.saveBack')){
						document.body.querySelector('.saveBack').style.display='block';
						mui.fire(detailPage,'footerShow');
					}
				})
			}
	}

//时间控件显示	
var currentDate=document.getElementById('currentDate');
currentDate.innerHTML=new Date().Format("yyyy-MM-dd");

//选择患者