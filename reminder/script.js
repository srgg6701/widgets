function getTimeCell(){
    return document.getElementById('intrvl');
}
function syncValues(inpToId,inpFrom){
	if(!inpFrom) inpFrom=getTimeCell();
	document.getElementById(inpToId).value=inpFrom.value;
}
window.onload=function(){	
	syncValues('range');
	var tm, callReminder = (function (){
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
                var time_rest_in_seconds_init=min*60,
                    time_rest_in_seconds=time_rest_in_seconds_init,    // инициализация значения, далее будет уменьшаться
                    timeRestBox = getTimeGoneBox(),
                    timeRestInfo;
                var showTime=function(){
                    // скорректировать ширину прогресс-бара
                    innerBar.style.width=(time_rest_in_seconds/time_rest_in_seconds_init*100)+'%';
                    // если не меньше минуты, покажем их
                    if(time_rest_in_seconds>=60){
                        timeRestInfo = Math.floor(time_rest_in_seconds/60) + ' мин. ' + (time_rest_in_seconds%60);
                    }else{
                        timeRestInfo=time_rest_in_seconds;
                    }
                    timeRestInfo+=' сек.';
                    // отобразить запись остатка времени
                    timeRestBox.innerHTML=timeRestInfo;
                    //console.log('timeRestInfo: '+timeRestInfo+', rest: '+(time_rest_in_seconds/time_rest_in_seconds_init*100)+'%, seconds: '+time_rest_in_seconds);
                    if(time_rest_in_seconds==0){
                        var ntm=new Date(),
                            reminder_history=document.getElementById('stats'),
                            content = reminder_history.innerHTML;
                        reminder_history.innerHTML='<div>'+ntm.toLocaleString()+'</div>'+content;
                        clearInterval(tm);
                        if(confirm("Продолжить?")) callReminder();
                        else activateButton();
                    }
                    time_rest_in_seconds-=1;
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
    for(var i in pointers){
        if(pointers[i].hasOwnProperty('innerHTML')) //console.dir(pointers[i]);
            pointers[i].addEventListener('click', function(event) {
                var element = event.currentTarget;
                var timeCell = getTimeCell();
                if (element.id == 'time_less') timeCell.value--;
                else if (element.id == 'time_more') timeCell.value++;
                syncValues('range');
            });
    }
    document.getElementById('controls').onselectstart=function(){return false;};
    document.getElementById('clear-time').onclick=clear;

    function initTimeGoneBox(){
        getTimeGoneBox().innerHTML='0';
    }

    initTimeGoneBox();

    function clear(){
        callReminder(true);
        getTimeCell().value='0';
        initTimeGoneBox();
        syncValues('range');
    }

    function getTimeGoneBox(){
        return document.getElementById('tmrest');
    }
};