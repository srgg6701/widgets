function getTimeCell(){
    return document.getElementById('intrvl');
}
function syncValues(inpToId,inpFrom){
	if(!inpFrom) inpFrom=getTimeCell();
	document.getElementById(inpToId).value=inpFrom.value;
}
window.onload=function(){	
	syncValues('range');
	var callReminder = (function (){
		var activateButton=function(){
                document.getElementById('start').disabled=false;
            },
            innerBar=document.querySelector('#rest-bar >div');
		return function(command){
			if(command===true){
				clearTimeout(tm);
                activateButton();
			}else{
                var min=document.getElementById('intrvl').value;
                var tm,tmcount,
                    tm_rest=min*60,
                    time_start=tm_rest,
                    tm_rest_fixed=(tm_rest/60).toFixed(0),
                    timeBox = document.getElementById('tmrest'),
                    info,
                    percentage;
                var showTime=function(){
                    // если первый запуск
                    if(time_start){
                        tmcount=tm_rest_fixed; // отобразить первое значение, как установочное
                        time_start=null; // удалить метку начала
                    }else{
                        tmcount=tm_rest_fixed-1;
                    }
                    if(tm_rest>=60){
                        info=tmcount + ' мин. '
                            + (tm_rest%60);
                    }else{
                        info=tm_rest;
                    }
                    info+=' сек.';
                    timeBox.innerHTML=info;
                    percentage = tm_rest/(min*60)*100;
                    innerBar.style.width=percentage+'%';
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
    var pointers=document.querySelectorAll('#time_less, #time_more');
    console.dir(pointers);
    for(var i in pointers){
        if(pointers[i].hasOwnProperty('innerHTML')) //console.dir(pointers[i]);
            pointers[i].addEventListener('click', function(event) {
                var element = event.currentTarget;
                console.dir(event.currentTarget);
                var timeCell = getTimeCell();
                if (element.id == 'time_less') timeCell.value--;
                else if (element.id == 'time_more') timeCell.value++;
                syncValues('range');
            });
    }
    document.getElementById('controls').onselectstart=function(){return false;};
};