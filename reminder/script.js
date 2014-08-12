function getTimeCell() {
    return document.getElementById('intrvl');
}
function syncValues(inpToId, inpFrom) {
    if (!inpFrom) inpFrom = getTimeCell();
    document.getElementById(inpToId).value = inpFrom.value;
}
window.onload = function () {
    syncValues('range');
    var controls={range:'range',intrvl:'intrvl',start:'start'},
        tm,
    callReminder = (function () {
        var manageControls = function (freeze) {
                for(var opt in controls)
                    document.getElementById(controls[opt]).disabled = (freeze)? true:false;
            },
            innerBar = document.querySelector('#rest-bar >div');
        return function (command) {
            if (command === true) {
                clearTimeout(tm);
                manageControls(); // разморозить элементы управления
            } else {
                var min = document.getElementById(controls.intrvl).value;
                manageControls(true); // зaморозить элементы управления
                var time_rest_in_seconds_init = min * 60,
                    time_rest_in_seconds = time_rest_in_seconds_init,    // инициализация значения, далее будет уменьшаться
                    timeRestBox = getTimeGoneBox(),
                    timeRestInfo;
                var showTime = function () {
                    // скорректировать ширину прогресс-бара
                    innerBar.style.width = (time_rest_in_seconds / time_rest_in_seconds_init * 100) + '%';
                    // если не меньше минуты, покажем их
                    if (time_rest_in_seconds >= 60) {
                        timeRestInfo = Math.floor(time_rest_in_seconds / 60) + ' мин. ' + (time_rest_in_seconds % 60);
                    } else {
                        timeRestInfo = time_rest_in_seconds;
                    }
                    timeRestInfo += ' сек.';
                    // отобразить запись остатка времени
                    timeRestBox.innerHTML = timeRestInfo;
                    //console.log('timeRestInfo: '+timeRestInfo+', rest: '+(time_rest_in_seconds/time_rest_in_seconds_init*100)+'%, seconds: '+time_rest_in_seconds);
                    if (time_rest_in_seconds == 0) {
                        var ntm = new Date(),
                            reminder_history = document.getElementById('stats'),
                            content = reminder_history.innerHTML;
                        reminder_history.innerHTML = '<div>' + ntm.toLocaleString() + '</div>' + content;
                        clearInterval(tm);
                        if (confirm("Продолжить?")) callReminder();
                        else manageControls();
                    }
                    time_rest_in_seconds -= 1;
                };
                showTime();
                tm = setInterval(showTime, 1000);
            }
        };
    }());

    var pointers = document.querySelectorAll('#time_less, #time_more'),
        timeCell = document.getElementById(controls.intrvl);

    document.getElementById('start').onclick = function (event) {
        if(timeCell.value=='0'){
            alert('Укажите интервал');
        }else{
            callReminder();
            event.currentTarget.disabled = true;
        }
    };
    document.getElementById('stop').onclick = function (event) {
        callReminder(true);
    };
    document.getElementById('intrvl').onfocus = function () {
        callReminder(true);
    };
    document.getElementById('range').onfocus = function () {
        callReminder(true);
    };
    for (var i in pointers) {
        if (pointers[i].hasOwnProperty('innerHTML')) //console.dir(pointers[i]);
            pointers[i].addEventListener('click', function (event) {
                var element = event.currentTarget;
                var timeCell = getTimeCell();
                if (element.id == 'time_less' && timeCell.value > 0){
                    if(!timeCell.disabled) timeCell.value--;
                }
                if (element.id == 'time_more'){
                    if(!timeCell.disabled) timeCell.value++;
                }
                syncValues('range');
            });
    }
    document.getElementById('controls').onselectstart = function () {
        return false;
    };
    document.getElementById('clear-time').onclick = clear;

    function initTimeGoneBox() {
        getTimeGoneBox().innerHTML = '0';
    }

    initTimeGoneBox();

    function clear() {
        callReminder(true);
        getTimeCell().value = '0';
        initTimeGoneBox();
        syncValues('range');
    }

    function getTimeGoneBox() {
        return document.getElementById('tmrest');
    }
};