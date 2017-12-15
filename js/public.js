//子页面input获取焦点后底部选项卡和保存按钮的显示状态
if(window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}

function plusReady() {
	var detailPage = plus.webview.getWebviewById('detail_main.html');
	var thisID = plus.webview.currentWebview();
	var Inputs = document.getElementsByTagName('input');
	window.onresize = function() {
		var windowHeight = document.documentElement.clientHeight;
		if(windowHeight > 400) {
			for(var i = 0; i < Inputs.length; i++) {
				Inputs[i].blur();

			}
			var width = window.screen.width;
			var t = width / 750 * 100 + 'px';
			thisID.setStyle({
				bottom: t
			});
			if(document.getElementById('nextPre')) {
				document.getElementById('nextPre').style.display = 'none';
			}
			if(document.body.querySelector('.saveBack')) {
				document.body.querySelector('.saveBack').style.display = 'block';
			}
		} else if(windowHeight < 400) {

			if(document.getElementById('nextPre')) {
				document.getElementById('nextPre').style.display = 'flex';
			}
			if(document.body.querySelector('.saveBack')) {
				document.body.querySelector('.saveBack').style.display = 'none';
				thisID.setStyle({
					bottom: t
				});
			}
		}

	}
}

//时间控件显示	
var currentDate = document.getElementById('currentDate');
var currentDateTime='';
		mui.ajax({
			url: url,
			type: 'get',
			data: {
				msgBody: JSON.stringify({}),
				msgHeader: JSON.stringify({
					ServerName: 'GetSysDate',
					Format: 'json',
					CallOperator: '',
					Certificate: '123456'
				})
			},
			dataType: 'json',
			tiemOut: 10000,
			success: function(data) {
				var tempTime = data.Msg.split(' ')[0];
				document.body.setAttribute('sysDate',tempTime)

			},
			error: function() {
				mui.toast('连接超时');
			}
		})
