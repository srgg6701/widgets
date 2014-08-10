function syncValues(inpToId,inpFrom){
	if(!inpFrom) inpFrom=document.getElementById('intrvl');
	document.getElementById(inpToId).value=inpFrom.value;
}
window.onload=function(){	
	syncValues('range');
	var callReminder = (function (){
		var tm, tm_rest, activateButton=function(){
            document.getElementById('start').disabled=false;
        };
		return function(command){
			if(command===true){
				clearTimeout(tm);
                activateButton();
			}else{
                var min=document.getElementById('intrvl').value;
                tm_rest=min*60;
                var showTime=function(){
                    var info;
                    if(tm_rest>=60){
                        info=((tm_rest/60).toFixed(0)-1) + ' мин. '
                            + (tm_rest%60);
                    }else{
                        info=tm_rest;
                    }
                    info+=' сек.';
                    document.getElementById('tmrest').innerHTML=info;
                    if(tm_rest==0){
                        var ntm=new Date();
                        var dt=document.getElementById('stats');
                        var content = dt.innerHTML;
                        dt.innerHTML='<div>'+ntm.toLocaleString()+'</div>'+content;
                        clearInterval(tm);
                        if(confirm("Продолжить?")) callReminder();
                        else activateButton();
                    }
                    tm_rest-=1;
                };
                showTime();
                tm=setInterval(showTime,1000);
			}
		};
	}());
	document.getElementById('start').onclick=function(event){
		callReminder();
		event.currentTarget.disabled=true;
	};
	document.getElementById('stop').onclick=function(event){		
		callReminder(true);
	};
	document.getElementById('intrvl').onfocus=function(){callReminder(true);};
	document.getElementById('range').onfocus=function(){callReminder(true);};
};