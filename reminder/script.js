function syncValues(inpToId,inpFrom){
	if(!inpFrom) inpFrom=document.getElementById('intrvl');
	document.getElementById(inpToId).value=inpFrom.value;
}
window.onload=function(){	
	syncValues('range');
	var makeDecition = (function (){
		var tm, tm_rest,
			stp=false,
			gotm = false,
            getVal = function(){
                return document.getElementById('intrvl').value;
            },
			sttm = function(cancel){
				if(cancel) console.log('%ccancel: '+cancel,'color:violet');
				var min=getVal();
                tm=setTimeout(makeDecition,min*60*1000);
                tm_rest=min*60;
                //console.log('tm_rest start: '+tm_rest);
                var tm2=setInterval(function(){
                    var info;
                    tm_rest-=1;
                    if(tm_rest>=60){
                        info=((tm_rest/60).toFixed(0)-1) + ' мин. '
                            + (tm_rest%60);
                    }else
                        info=tm_rest;
                    info+=' сек.';
                    document.getElementById('tmrest').innerHTML=info;
                    //console.log('tm_rest? = '+tm_rest);
                },1000);
            };
		return function(command){
			//console.dir(cancel);
			if(command===true){
				stp=false;
				gotm=null;
				clearTimeout(tm);
			}else{
				if(gotm){
					//console.log('gotm = '+gotm+', stp = '+stp);
					if(!stp){
						var ntm=new Date();
						var dt=document.getElementById('stats');
						var content = dt.innerHTML;
						dt.innerHTML='<div>'+ntm.toLocaleString()+'</div>'+content;
						if(!confirm("Продолжить?")) gotm=null;
					}
				}else{ //console.log('makeDecition is run once!');
					stp=false;		
					gotm=true;						
				}								
				if (gotm!==null) sttm();			
			}
			if(gotm===null) document.getElementById('start').disabled=false;
		};
	}());
	document.getElementById('start').onclick=function(event){
		makeDecition();
		event.currentTarget.disabled=true;
	};
	document.getElementById('stop').onclick=function(event){		
		makeDecition(true);
	};
	document.getElementById('intrvl').onfocus=function(){makeDecition(true);};
	document.getElementById('range').onfocus=function(){makeDecition(true);};
};