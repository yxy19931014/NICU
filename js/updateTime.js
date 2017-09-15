// H5 plus事件处理

		function pickTime(){
		var two=document.getElementsByClassName('two')[0];
		var MRN=plus.webview.currentWebview().MRN;
		var changeIndex=two.getAttribute('index');
		plus.nativeUI.pickTime( function(e){
			var d=e.date;
			var h=d.getHours()<10?'0'+d.getHours():d.getHours();
			var m=d.getMinutes()<10?'0'+d.getMinutes():d.getMinutes();
			two.previousElementSibling.value=h+":"+m;
			two.innerHTML=h+':'+m;
			mui.ajax({
				url:url,
				type:'get',
				data:{
					msgBody:JSON.stringify({                   				
		                Time:currentDate.innerHTML+" "+two.innerHTML,
		                ColumnID:parseInt(two.getAttribute('index'))+3+'',
		                PatientMRN:MRN
		            }),                   
		            msgHeader:JSON.stringify({
				        ServerName:'UpdateTime',
				        Format: 'json',
				        CallOperator: '',
				        Certificate:'123456'
			        })
				},
				dataType:'json',
				success:function(data){
					if(data.Code==0){
						mui.toast('时间修改成功');
						
						timeArr[changeIndex]=two.innerHTML;
						two.innerHTML=two.previousElementSibling.value;
						two.style.display='block';				
					}				
				},
				error:function(){
					mui.toast('服务器异常，请稍后再试');
				}
			})
		},function(e){
			timeArr[changeIndex]=two.innerHTML;
			two.style.display='block';	
			console.log( "未选择时间："+e.message );
		});
		}
		function selectTime(id){
				plus.nativeUI.pickTime( function(e){
					var d=e.date;
					var h=d.getHours()<10?'0'+d.getHours():d.getHours();
					var m=d.getMinutes()<10?'0'+d.getMinutes():d.getMinutes();
					document.getElementById(id).value=" "+h+":"+m;
				},function(e){
					console.log( "未选择时间："+e.message );
				});
			}	
		function addTimes(id){
			plus.nativeUI.pickTime( function(e){
			var d=e.date;
			var h=d.getHours()<10?'0'+d.getHours():d.getHours();
			var m=d.getMinutes()<10?'0'+d.getMinutes():d.getMinutes();
			var newTime=document.createElement('span');
			newTime.classList.add('singleTime');
			newTime.innerHTML=h+":"+m
			document.getElementById(id).appendChild(newTime);
			document.getElementById(id).previousElementSibling.style.border='none';
			document.getElementById(id).style.display='block';
		},function(e){
			console.log( "未选择时间："+e.message );
		});
		
		}
		function updateTime(id){
			plus.nativeUI.pickTime( function(e){
					var d=e.date;
					var h=d.getHours()<10?'0'+d.getHours():d.getHours();
					var m=d.getMinutes()<10?'0'+d.getMinutes():d.getMinutes();
					document.getElementById(id).value=" "+h+":"+m;
					var code=document.getElementsByClassName('sureUpdate')[0];
					var totalCode=document.getElementById('total');
					var intakecode=totalCode?totalCode.getAttribute('IntakeCode'):code.getAttribute('IntakeCode');
								mui.ajax({
									url:url,
									type:'get',
									data:{
										msgBody: JSON.stringify({
											IntakeCode:intakecode,
//											OperateTime:new Date().Format("yyyy-MM-dd")+document.getElementById(id).value+':00',
       										OperateTime:getPreDay('2017-09-15 ')+document.getElementById(id).value+':00',
       										OperateStatus:'1'
										}),
										msgHeader: JSON.stringify({
											ServerName: 'GetIntakeNumber',
											Format: 'json',
											CallOperator: '',
											Certificate: '123456'
										})
									},dataType:'json',
									success:function(data){
										if(data.Code==0){
											if(document.getElementById('isComplete') && document.getElementById('isComplete').checked){
												
											}else {
												if(document.getElementById('actualNum')){
													document.getElementById('actualNum').value=data.Msg;
												}else if(document.getElementsByClassName(id)[0]){
													document.getElementsByClassName(id)[0].value=data.Msg;
												}
											
											}									
										}else {
											mui.toast(''+data.Msg);
										}
									}
								})

				},function(e){
					console.log( "未选择时间："+e.message );
				});
		}
