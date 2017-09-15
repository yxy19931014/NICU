var aObj=document.getElementsByTagName('nav')[0].children;
var jumpArr=['observation.html','bedOperate.html','out.html','in.html','life.html'];
		for(var i=0;i<aObj.length;i++){
			aObj[i].addEventListener('tap',(function(n){
					return function(){
						for(var j=0;j<aObj.length;j++){
						aObj[j].classList.remove('active');
						}
						this.classList.add('active');
						var subPage=plus.webview.getWebviewById("bedOperSub");
						plus.webview.close(subPage);
						location.href=jumpArr[n]+'?MRN='+MRN+'&PatientName='+ escape(patientName)+'&PatientNumber='+patientNumber;	
					}
				
			})(i));
		}