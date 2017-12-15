		 if(window.plus) {
		 	plusReady();
		 } else {
		 	document.addEventListener("plusready", plusReady, false);

		 }

		 function plusReady() {

		 	plus.webview.currentWebview().addEventListener("loading", checkVersion(), false);
		 	//监测版本
		 	function checkVersion() {

		 		var version;
		 		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
		 			version = inf.version;
		 			mui.ajax("http://10.244.200.142:8080/NICUupdate/checkUpdate", {
		 				data: {
		 					str: version
		 				},
		 				dataType: 'json', //服务器返回json格式数据
		 				type: 'post', //HTTP请求类型
		 				timeout: 5000, //超时时间设置为5秒；
		 				headers: {
		 					'Content-Type': 'application/json'
		 				},
		 				success: function(data) {
		 					if(data.status == 200) {
		 						plus.nativeUI.showWaiting("检测到新版本，正在下载...");
		 						createDownload(data.data);

		 					} else {
		 						refresh();
		 					}
		 				},
		 				error: function(xhr, type, errorThrown) {
		 					refresh();
		 				}
		 			});
		 		})
		 	}

		 	// 创建下载任务，下载apk文件
		 	function createDownload(path) {
				
		 		//delFile("_downloads/");
		 		var dtask = plus.downloader.createDownload(path, {
		 			method: 'GET',
		 			filename: '_downloads/',
		 			timeout: 10
		 		}, function(d, status) {
		 			// 下载完成
		 			if(status == 200) {
		 				plus.nativeUI.closeWaiting();
		 				plus.nativeUI.alert("下载完成！正在安装...", function() {
		 					installWgt(d.filename);
		 				});
		 			} else {
		 				alert("Download failed: " + status);
		 				refresh();
		 			}
		 		});
		 		dtask.start();
		 	}

		 	// 更新应用
		 	function installWgt(fileName) {
		 
		 		plus.runtime.install(fileName, {

		 		}, function() {
		 			plus.nativeUI.closeWaiting();
		 			//plus.runtime.restart();
					plus.runtime.quit();
		 		}, function(e) {
		 			plus.nativeUI.closeWaiting();
		 			console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
		 			plus.nativeUI.alert("安装wgt文件失败[" + e.code + "]：" + e.message);
		 			 
		 			refresh();
		 		});

		 	}

		 	function refresh() {
		 		//刷新页面
		 		setTimeout(function() {
		 			//					if(!localStorage.getItem('loginInfo')) {

		 			nw = plus.webview.open('views/login.html', 'login.html', {
		 				top: 0
		 			}, {
		 				aniShow: 'none'
		 			}, {
		 				duration: '1ms'
		 			}, function() {

		 				var currentBedList = plus.webview.currentWebview();
		 				plus.webview.close(currentBedList);

		 			});
		 			//					} else {
		 			//						
		 			//						plus.webview.open('views/bedList.html', 'bedList.html', {
		 			//							top: 0
		 			//						}, {
		 			//							aniShow: 'none'
		 			//						}, {
		 			//							duration: '1ms'
		 			//						}, function() {
		 			//							var currentBedList = plus.webview.currentWebview();
		 			//							plus.webview.close(currentBedList);
		 			//						});
		 			//					}
		 		}, 2000);
		 	}

		 	/*删除指定文件
		 	function delFile(relativePath) {
		 		plus.io.resolveLocalFileSystemURL(
		 			relativePath,
		 			function(entry) {

		 				entry.removeRecursively(function(entry) {

		 					console.log("文件删除成功==" + relativePath);
		 				}, function(e) {
		 					console.log("文件删除失败=" + relativePath);
		 				});

		 			},
		 			function(e) {
		 				console.log(e.message)
		 			});
		 	}*/
		 }