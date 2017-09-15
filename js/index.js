// H5 plus事件处理
		var strWhereDom=document.getElementById('strWhere');
		function plusReady(){
			var onLine=document.getElementById('onLine');
			var showDom=document.getElementById('showDom');
			if(showDom.innerHTML=='在科'){
				onLine.setAttribute('tag','0');
			}else if(showDom.innerHTML=='全部'){
				onLine.setAttribute('tag','');
			}else if(showDom.innerHTML=='空床'){
				onLine.setAttribute('tag','1');
			}
			strWhereDom.value='';
			mui.init(); 
			var DeptCode=JSON.parse(localStorage.getItem('loginInfo')).DeptCode; 
//			获取列表数据
			sendAjax(strWhereDom.value,'GetBedList','0');
//			点击搜索按钮,查找数据
			document.getElementById('searchBtn').addEventListener('tap',function(){
					var tag=onLine.getAttribute('tag');
					sendAjax(strWhereDom.value,'GetBedList',tag);			
				});
//			搜索数据
			function sendAjax(strWhere,ajaxName,tag){
					mui.ajax({
					url:url,
					type:'get',
					data:{
						msgBody:JSON.stringify({
	                   		DeptCode:DeptCode,//deptCode
	                    	StrWhere:strWhere,
	                    	Tag:tag
	                	}),                   
	                	msgHeader:JSON.stringify({
	                    	ServerName:ajaxName,
	                    	Format: 'json',
	                    	CallOperator: '',
	                    	Certificate:'123456'})
					},
					dataType:'json',
					beforeSend:function(){
						plus.nativeUI.showWaiting('加载中…');
					},
					success:function(data){
						if(data.Code==0){	
							setTimeout(function(){
								plus.nativeUI.closeWaiting();   
							for(var i=0;i<data.Contents.length;i++){
								if(data.Contents[i].PatientName==''){
									data.Contents[i].PatientName='空床';
								}
							}
							var html=template('bedListTpl',{list:data.Contents});
							document.getElementById('bedListId').innerHTML=html;
							var beds=document.getElementsByClassName('bed');
							for(var i=0;i<beds.length;i++){
								beds[i].addEventListener('tap',function(){
									var thisMRN=this.getAttribute('MRN');
									var thisName=this.getAttribute('PatientName');
									var thisNumber=this.getAttribute('PatientNumber');
									var thisBed=this.getAttribute('PatientBed');
									mui.openWindow({
										url:'views/detail_main.html',
										id:'detail_main.html',
										extras:{
											MRN:thisMRN,
											PatientName:thisName,
											PatientNumber:thisNumber,
											PatientBed:thisBed
										},
										show:{
											aniShow:'none'
										}
									});
								})
							}
							
								var names=document.getElementsByClassName('name');
								for(var i=0;i<names.length;i++){
									if(names[i].innerHTML=='空床'){
										names[i].style.color='#ccc';
										names[i].parentNode.style.color='#ccc';
										names[i].style.fontSize='0.36rem';
									}
									
								}
							},2000);
							
							}
					}
				})
			}
		//		在科和空床的切换
		var outArr=['全部','空床'];
		
		var showHtml='';
		var ps=document.getElementsByClassName('down')[0].getElementsByTagName('p');
		mui('.rightOnline').on('tap','#onLine',function(e){			
			e.stopPropagation();
			document.getElementById('outLogin').style.display='none';
			document.getElementById('userIconId').classList.remove('show');
			var that=this;
			showHtml=that.firstElementChild.innerHTML;
			if(this.classList.contains('down')){
				document.getElementById('downContent').style.display='none';
				this.classList.remove('down');		
			}else{
				document.getElementById('downContent').style.display='block';
				this.classList.add('down');				
				for(var n=0;n<outArr.length;n++){
					ps[n].innerHTML=outArr[n];
					
				}
				
			}			
		})
		for(var i=0;i<ps.length;i++){
					ps[i].addEventListener('tap',function(){				
						onLine.firstElementChild.innerHTML=this.innerHTML;
						if(this.innerHTML=='在科'){
							onLine.setAttribute('tag','0');
						}else if(this.innerHTML=='全部'){
							onLine.setAttribute('tag','');
						}else if(this.innerHTML=='空床'){
							onLine.setAttribute('tag','1');
						}
						for(var j=0;j<outArr.length;j++){
							if(outArr[j]==this.innerHTML){
								outArr.splice(j,1);
							}
						}
						outArr.push(showHtml);
						sendAjax(strWhereDom.value,'GetBedList',onLine.getAttribute('tag'));
					})
			}

		}
		if(window.plus){
			plusReady();
		}else{
			document.addEventListener("plusready",plusReady,false);
		}
			//		退出登录
		mui('.leftUser').on('tap','#userIconId',function(e){
			e.stopPropagation();
			document.getElementById('onLine').classList.remove('show');
			document.getElementById('downContent').style.display='none';
			document.getElementById('onLine').classList.remove('down');
			if(this.classList.contains('show')){
				var that=this;
				document.getElementById('outLogin').style.display='none';
					that.classList.remove('show');				
			}else{
				document.getElementById('outLogin').style.display='block';
				this.classList.add('show');
			}
		})
		mui('.leftUser').on('tap','#outLogin',function(e){
			e.stopPropagation();
			window.localStorage.removeItem('loginInfo');
			mui.openWindow({
				url:'views/login.html',
				id:'login.html',
				show:{
						aniShow:'none'
					}
			})
		});
		document.addEventListener('tap',function(e){
			e.stopPropagation();
			document.getElementById('onLine').classList.remove('show');
			document.getElementById('downContent').style.display='none';
			document.getElementById('onLine').classList.remove('down');
			document.getElementById('outLogin').style.display='none';
			document.getElementById('userIconId').classList.remove('show');	
		})
		
//		底部导航栏的切换
		var aObj=document.getElementsByTagName('nav')[0].children;
		for(var i=0;i<aObj.length;i++){
			aObj[i].addEventListener('tap',(function(n){
					return function(){
						for(var j=0;j<aObj.length;j++){
						aObj[j].classList.remove('active');
						}
						this.classList.add('active');	
					}
				
			})(i));
		}
//		设置文本框的显示和隐藏
	var footer=document.getElementsByClassName('footer')[0];
	strWhereDom.addEventListener('focus',function(){
		footer.style.display='none';
	})
	strWhereDom.addEventListener('blur',function(){
		footer.style.display='table';
	})