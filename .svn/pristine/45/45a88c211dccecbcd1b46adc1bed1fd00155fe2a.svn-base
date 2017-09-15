//获取参数
function GetRequest(url) {   
   var theRequest = new Object();   
   if (url.indexOf("?") != -1) {   
      var str = url.substr(1);   
      strs = str.split("&");   
      for(var i = 0; i < strs.length; i ++) {   
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
      }   
   }   
   return theRequest;   
}   

//时间格式化
function getPreDay(str){
        var d = new Date(str);
        d = d - 1000*60*60*24;
        d = new Date(d);
        var m=d.getMonth()+1<10?'0'+parseInt(d.getMonth()+1):d.getMonth();
        var day=d.getDate()<10?'0'+d.getDate():d.getDate();
        return d.getFullYear()+"-"+m+"-"+day;      
   }
function getNextDay(){
        var d = new Date();
        d = +d + 1000*60*60*24;
        d = new Date(d);
        var m=d.getMonth()+1<10?'0'+parseInt(d.getMonth()+1):d.getMonth();
        var day=d.getDate()<10?'0'+d.getDate():d.getDate();
        return d.getFullYear()+"-"+m+"-"+day;      
   }
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
