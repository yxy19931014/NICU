//选择患者 
var address=location.pathname.split("").reverse().join("");
var tempIndex=parseInt(address.indexOf('/'));
var newAddress=address.substring(0,tempIndex).split("").reverse().join("");
var popover=document.getElementById('popover');
var search=document.getElementsByClassName('search')[0];
var historyData=document.getElementsByClassName('historyData')[0];

var DeptCode=GetRequest(location.search).DeptCode?GetRequest(location.search).DeptCode:JSON.parse(localStorage.getItem('loginInfo')).DeptCode;
var strWhereDom=document.getElementById('strWhere');
strWhereDom.setAttribute('placeholder','可输入患者姓名、床号、病历号');
strWhereDom.value='';

mui('.mui-title').on('tap','#downSelect',function(){
	var mask = mui.createMask(function(){
		popover.style.display='none';
		popover.classList.remove('hasLoaded');
		document.body.style.overflow='auto';
		});
	if(popover.classList.contains('hasLoaded')){
		var masks=document.getElementsByClassName('mui-backdrop');
		for(var i=0;i<masks.length;i++){
			masks[i].style.display='none';
		}
		document.body.style.overflow='auto';
		var subPage=plus.webview.getWebviewById("bedOperSub");
		popover.style.display='none';
		popover.classList.remove('hasLoaded');
		plus.webview.show(subPage);
		return;
	}else {
		mask.show();
		popover.style.display='block';
		popover.classList.add('hasLoaded');
		document.body.style.overflow='hidden';
		var subPage=plus.webview.getWebviewById("bedOperSub");
		plus.webview.hide(subPage);
		sendAjax(strWhereDom.value);
	}		
	mui('.pullBox').on('tap','#pull',function(){
		mask.close();
		popover.style.display='none';
		popover.classList.remove('hasLoaded');
		document.body.style.overflow='auto';
	})
	
}); 

document.getElementById('searchBtn').addEventListener('tap',function(){
	sendAjax(strWhereDom.value);			
});
function sendAjax(strWhere){
	mui.ajax({
		url:url,
		type:'post',
		data:{
			msgBody:JSON.stringify({
                DeptCode:DeptCode,//deptCode
                StrWhere:strWhere,
                tag:'0'
            }),                   
            msgHeader:JSON.stringify({
                ServerName:'GetInPatientList',
                Format: 'json',
                CallOperator: '',
                Certificate:'123456'
            })
		},
		dataType:'json',
		success:function(data){
			console.log(data);
			if(data.Code==0){
				var datas=data.Contents;
				var html=template('selectPatient',{list:datas});
				document.getElementById('historyData').innerHTML=html;
				var singleBoxs=document.getElementsByClassName('singleBox');
				for(var j=0;j<singleBoxs.length;j++){
					if(singleBoxs[j].getAttribute('MRN')==MRN){
						singleBoxs[j].classList.add('selected');
					}
				}
				for(var i=0;i<datas.length;i++){
					document.getElementsByClassName('singleBox')[i].addEventListener('tap',function(){
						var thisMRN=this.getAttribute('MRN');
						var thisName=this.getAttribute('PatientName');
						var thisNumber=this.getAttribute('PatientNumber');
						var thisBed=this.getAttribute('PatientBed');
						var subPage=plus.webview.getWebviewById("bedOperSub");
						plus.webview.hide(subPage);
						location.href=newAddress+'?MRN='+thisMRN+'&PatientName='+ escape(thisName)+'&PatientNumber='+thisNumber+'&PatientBed='+thisBed;
					})
				}					
			}
				
		}
	})

			}
