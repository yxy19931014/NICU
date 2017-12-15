// H5 plus事件处理
var strWhereDom = document.getElementById('strWhere');

function plusReady() {
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
			document.body.setAttribute('sysDate', tempTime);

		},
		error: function() {
			mui.toast('连接超时');
		}
	})

	var onLine = document.getElementById('onLine');
	var showDom = document.getElementById('showDom');
	if(showDom.innerHTML == '在科') {
		onLine.setAttribute('tag', '0');
	} else if(showDom.innerHTML == '全部') {
		onLine.setAttribute('tag', '');
	} else if(showDom.innerHTML == '空床') {
		onLine.setAttribute('tag', '1');
	}
	strWhereDom.value = '';
	mui.init();
	var DeptCode = JSON.parse(localStorage.getItem('loginInfo')).DeptCode;
	//			获取列表数据
	sendAjax(strWhereDom.value, 'GetBedList', '0');
	//			点击搜索按钮,查找数据
	strWhereDom.addEventListener('focus', function() {
		document.addEventListener('keydown', function(e) {
			if(e.keyCode == 13) {
				var tag = onLine.getAttribute('tag');
				sendAjax(strWhereDom.value, 'GetBedList', tag);
			}
		})
	})
	document.getElementById('searchBtn').addEventListener('tap', function() {
		var tag = onLine.getAttribute('tag');
		sendAjax(strWhereDom.value, 'GetBedList', tag);
	});
	//		扫码
	//				手动扫描获取二维码打开页面,获取药品
	var context = plus.android.importClass('android.content.Context'); //上下文
	var main = plus.android.runtimeMainActivity(); //获取activity
	var receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
		onReceive: doReceive //实现onReceiver回调函数
	});
	var IntentFilter = plus.android.importClass('android.content.IntentFilter');
	var Intent = plus.android.importClass('android.content.Intent');
	var filter = new IntentFilter();

	filter.addAction("lachesis_barcode_value_notice_broadcast"); //监听扫码状态
	main.registerReceiver(receiver, filter); //注册监听
	window.addEventListener('registerScan',function(){
		main.registerReceiver(receiver, filter);
	})
	function doReceive(context, intent) {
		var intentCode = intent.getStringExtra("lachesis_barcode_value_notice_broadcast_data_string");
		if(/^\d{7}$/.test(intentCode)) {
			mui.ajax({
				url: url,
				type: 'get',
				data: {
					msgBody: JSON.stringify({

						"OrderNo": intentCode
					}),
					msgHeader: JSON.stringify({
						ServerName: 'ScanSearch',
						Format: 'json',
						CallOperator: '',
						Certificate: '123456'
					})
				},
				dataType: 'json',
				beforeSend: function() {
				plus.nativeUI.showWaiting('数据加载中…');
			},
				success: function(data) {
					plus.nativeUI.closeWaiting();
					if(data.Code == 0) {
						//	status为0,扫患者
						data.intentCode = intentCode;
						var scanData = JSON.stringify(data);
						
						mui.openWindow({
							url: 'detail_main.html',
							id: 'detail_main.html',
							extras: {
								MRN: data.MRN,
								PatientName: data.Name,
								PatientNumber: data.PATIENTNUMBER,
								PatientBed: data.BedNo,
								isScan:true,
								scanData:scanData
							},
							show: {
								aniShow: 'none'
							}
						});
						
						main.unregisterReceiver(receiver);

					} else {
						mui.toast('当前扫描的信息不存在');
						plus.nativeUI.closeWaiting();

					}
				},
				error: function() {
					plus.nativeUI.closeWaiting();

				}
			})

		} else {
			mui.toast('请扫描正确的二维码');
		}
	}
	//			搜索数据
	function sendAjax(strWhere, ajaxName, tag) {
		mui.ajax({
			url: url,
			type: 'get',
			data: {
				msgBody: JSON.stringify({
					DeptCode: DeptCode, //deptCode
					StrWhere: strWhere,
					Tag: tag
				}),
				msgHeader: JSON.stringify({
					ServerName: ajaxName,
					Format: 'json',
					CallOperator: '',
					Certificate: '123456'
				})
			},
			dataType: 'json',
			beforeSend: function() {
				plus.nativeUI.showWaiting('加载中…');
			},
			tiemOut: 20000,
			success: function(data) {
				if(data.Code == 0) {
					setTimeout(function() {
						plus.nativeUI.closeWaiting();

						for(var i = 0; i < data.Contents.length; i++) {
							if(data.Contents[i].PatientName == '') {
								data.Contents[i].PatientName = '空床';
							}
						}
						var html = template('bedListTpl', {
							list: data.Contents
						});
						document.getElementById('bedListId').innerHTML = html;
						var names = document.getElementsByClassName('name');
						for(var i = 0; i < names.length; i++) {
							if(names[i].innerHTML == '空床') {
								names[i].style.color = '#ccc';
								names[i].parentNode.style.color = '#ccc';
								names[i].style.fontSize = '0.36rem';
							}
						}
						var beds = document.getElementsByClassName('bed');
						for(var i = 0; i < beds.length; i++) {
							beds[i].addEventListener('tap', function() {
								if(this.getElementsByClassName('name')[0].innerHTML == '空床') {
									mui.toast('无法对空床进行相关操作');
									return;
								}
								var thisMRN = this.getAttribute('MRN');
								var thisName = this.getAttribute('PatientName');
								var thisNumber = this.getAttribute('PatientNumber');
								var thisBed = this.getAttribute('PatientBed');
								main.unregisterReceiver(receiver);
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
										var currentDateInnerHTML = tempTime;
										//										获取系统时间并同步医嘱
										mui.ajax({
											url: url,
											type: 'get',
											data: {
												msgBody: JSON.stringify({
													PatientMRN: thisMRN,
													startTime: currentDateInnerHTML + ' 07:00:01',
													endTime: getNextDay(currentDateInnerHTML) + ' 07:00:00'
												}),
												msgHeader: JSON.stringify({
													ServerName: 'SynchronizeOrderStart',
													Format: 'json',
													CallOperator: '',
													Certificate: '123456'
												})
											},
											dataType: 'json',
											tiemOut: 10000,
											success: function(data) {
												if(data.Code == 0) {
													console.log('同步医嘱成功');
												} else {
													console.log('同步医嘱失败');
												}
											},
											error: function() {
												mui.toast('连接超时，同步医嘱失败');
											}
										})

									},
									error: function() {
										mui.toast('连接超时');
									}
								})

								mui.openWindow({
									url: 'detail_main.html',
									id: 'detail_main.html',
									extras: {
										MRN: thisMRN,
										PatientName: thisName,
										PatientNumber: thisNumber,
										PatientBed: thisBed
									},
									show: {
										aniShow: 'none'
									}
								});
							})
						}

					}, 1000);

				} else {
					plus.nativeUI.closeWaiting();
					mui.toast('没有查找到该条记录');

				}
			}
		})
	}
	//		在科和空床的切换
	var outArr = ['全部', '空床'];

	var showHtml = '';
	var ps = document.getElementsByClassName('down')[0].getElementsByTagName('p');
	mui('.rightOnline').on('tap', '#onLine', function(e) {
		e.stopPropagation();
		document.getElementById('outLogin').style.display = 'none';
		document.getElementById('userIconId').classList.remove('show');
		var that = this;
		showHtml = that.firstElementChild.innerHTML;
		if(this.classList.contains('down')) {
			document.getElementById('downContent').style.display = 'none';
			this.classList.remove('down');
		} else {
			document.getElementById('downContent').style.display = 'block';
			this.classList.add('down');
			for(var n = 0; n < outArr.length; n++) {
				ps[n].innerHTML = outArr[n];

			}

		}
	})
	for(var i = 0; i < ps.length; i++) {
		ps[i].addEventListener('tap', function() {
			onLine.firstElementChild.innerHTML = this.innerHTML;
			if(this.innerHTML == '在科') {
				onLine.setAttribute('tag', '0');
			} else if(this.innerHTML == '全部') {
				onLine.setAttribute('tag', '');
			} else if(this.innerHTML == '空床') {
				onLine.setAttribute('tag', '1');
			}
			for(var j = 0; j < outArr.length; j++) {
				if(outArr[j] == this.innerHTML) {
					outArr.splice(j, 1);
				}
			}
			outArr.push(showHtml);
			sendAjax('', 'GetBedList', onLine.getAttribute('tag'));
			strWhereDom.value = '';
		})
	}
	var SynchronizePatientBtn = document.getElementById('SynchronizePatient');
	SynchronizePatientBtn.addEventListener('tap', function() {
		mui.ajax({
			url: url,
			type: 'get',
			data: {
				msgBody: JSON.stringify({
					DeptCode: DeptCode, //deptCode
					StrWhere: strWhere
				}),
				msgHeader: JSON.stringify({
					ServerName: 'SynchronizePatient',
					Format: 'json',
					CallOperator: '',
					Certificate: '123456'
				})
			},
			dataType: 'json',
			success: function(data) {
				console.log(JSON.stringify(data))
				if(data.Code == 0) {
					sendAjax('', 'GetBedList', onLine.getAttribute('tag'));
				}
			}
		})
	})
	
}
if(window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}
//		退出登录
mui('.leftUser').on('tap', '#userIconId', function(e) {
	e.stopPropagation();
	document.getElementById('onLine').classList.remove('show');
	document.getElementById('downContent').style.display = 'none';
	document.getElementById('onLine').classList.remove('down');
	if(this.classList.contains('show')) {
		var that = this;
		document.getElementById('outLogin').style.display = 'none';
		that.classList.remove('show');
	} else {
		document.getElementById('outLogin').style.display = 'block';
		this.classList.add('show');
	}
})
mui('.leftUser').on('tap', '#outLogin', function(e) {
	e.stopPropagation();
	window.localStorage.removeItem('loginInfo');
	plus.webview.open('login.html', 'login.html', {
		top: 0
	}, {
		aniShow: 'none'
	}, {
		duration: '1ms'
	}, function() {
		var currentBedList = plus.webview.currentWebview();
		plus.webview.close(currentBedList);
	});
});
document.addEventListener('tap', function(e) {
	e.stopPropagation();
	document.getElementById('onLine').classList.remove('show');
	document.getElementById('downContent').style.display = 'none';
	document.getElementById('onLine').classList.remove('down');
	document.getElementById('outLogin').style.display = 'none';
	document.getElementById('userIconId').classList.remove('show');
})

//		底部导航栏的切换
var aObj = document.getElementsByTagName('nav')[0].children;
for(var i = 0; i < aObj.length; i++) {
	aObj[i].addEventListener('tap', (function(n) {
		return function() {
			if(n != 0) {
				mui.toast('功能开发中...');
			}
		}

	})(i));
}
//		设置文本框的显示和隐藏
var footer = document.getElementsByClassName('footer')[0];
window.onresize = function() {
	var windowHeight = document.documentElement.clientHeight;
	if(windowHeight > 500) {
		footer.style.display = 'table';
	} else if(windowHeight < 500) {
		footer.style.display = 'none';
	}
}