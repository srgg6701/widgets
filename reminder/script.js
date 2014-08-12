window.onload = function () {
    var controls=function(){
            return{
                range:  'range',    // ползунок
                intrvl: 'intrvl',   // ячейка
                start:  'start'     // кнопка
            }
        },
        // вернуть либо ячейку со значением интервала, либо само значение
        getTimeCell = function(value) {
            var cell=document.getElementById(controls().intrvl);
            return (value)? cell.value:cell;
        },
        // синхронизировать значение интервала между ячейкой и ползунком
        syncValues = function(inpToId) {
            if(!inpToId) inpToId='range';
            document.getElementById(inpToId).value = getTimeCell(true);
        },
        timeCell = getTimeCell();
    // синхронизировать значение интервала между ячейкой и ползунком
    syncValues();
    // инициализировать значение интервала нулём
    initTimeGoneBox();
    var tm,
    /**
      основная функция
     */
    callReminder = (function () {
        var manageControls = function (freeze) {
                for(var opt in controls())
                    document.getElementById(controls()[opt]).disabled = (freeze)? true:false;
            },
            timeRestProgressBar = document.querySelector('#rest-bar >div');
        return function (command) {
            if (command === true) {
                clearTimeout(tm); //console.log('21: clear interval');
                manageControls(); // разморозить элементы управления
            } else {
                var min = getTimeCell(true);
                manageControls(true); // зaморозить элементы управления
                var time_rest_in_seconds_init = min * 60,
                    time_rest_in_seconds = time_rest_in_seconds_init,    // инициализация значения, далее будет уменьшаться
                    timeRestBox = getTimeGoneBox(),
                    timeRestInfo,
                    time_record;
                // рассчитать и отобразить оставшееся время (запускается через интервал)
                var showTime = function () {
                    // динамически установить ширину прогресс-бара
                    timeRestProgressBar.style.width = (time_rest_in_seconds / time_rest_in_seconds_init * 100) + '%';
                    //console.log('showTime, time_rest_in_seconds: '+time_rest_in_seconds+', time_rest_in_seconds_init: '+time_rest_in_seconds_init);
                    // если не меньше минуты, покажем их
                    if (time_rest_in_seconds >= 60) {
                        timeRestInfo = Math.floor(time_rest_in_seconds / 60) + ' мин. ' + (time_rest_in_seconds % 60);
                    } else {
                        timeRestInfo = time_rest_in_seconds;
                    }
                    timeRestInfo += ' сек.';
                    if(time_rest_in_seconds == time_rest_in_seconds_init)
                        time_record = timeRestInfo;
                            // отобразить запись остатка времени
                    timeRestBox.innerHTML = timeRestInfo;
                    //console.log('timeRestInfo: '+timeRestInfo+', rest: '+(time_rest_in_seconds/time_rest_in_seconds_init*100)+'%, seconds: '+time_rest_in_seconds);
                    if (time_rest_in_seconds == 0) {
                        var ntm = new Date(),
                            reminder_history = document.getElementById('stats'),
                            content = reminder_history.innerHTML;
                        reminder_history.innerHTML = '<div>' + ntm.toLocaleString() + ', ' + time_record + '</div>' + content;
                        clearInterval(tm); //console.log('51: clear interval');
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
    /**
     - вызвать callReminder
     - назначить обработчиков изменения интервала */
    (function(callback){
        /**
         назначить вызов callReminder(остановка_выполнения) по событиям:
         - явная установка
         - изменение значения интервала */
        var btns=['stop',controls().intrvl,controls().range];
        for(var i in btns)
            document.getElementById(btns[i]).onclick = function () {
                callback(true);
            };
        var pointers = document.querySelectorAll('#time_less, #time_more');
        // изменить значение интервала
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
                    syncValues();
                });
        }
    }(callReminder));
    /**
     ОБРАБОТАТЬ СОБЫТИЯ ЭЛЕМЕНТОВ
     */
    // обработать значение интервала в ячейке
    timeCell.onblur = function(){
        timeCell.value=timeCell.value.replace(',','.');
        timeCell.value=timeCell.value.replace(/\s/g,'');
        syncValues();
    };
    // Кнопка "Старт"
    document.getElementById('start').onclick = function (event) {
        if(!timeCell.value||timeCell.value=='0'){
            alert('Укажите интервал');
        }else{
            if(/[^0-9\.]/.test(timeCell.value)){
                alert('Недопустимые символы в поле для интервала');
            }else{
                callReminder();
                event.currentTarget.disabled = true;
            }
        }
    };
    // Синхронизировать значения:
    // - Ячейка со значением интервала
    document.getElementById('intrvl').oninput = function () {
        syncValues('intrvl');
    };
    // - Ползунок с интервалом
    document.getElementById('range').oninput = function () {
        syncValues();
    };
    // Блокоировать выделение на блоке с элементами управления
    document.getElementById('controls').onselectstart = function () {
        return false;
    };
    // "Корзина"
    document.getElementById('clear-time-trash').onclick = clear;
    /**
     ФУНКЦИИ
     */
    // инициализировать значение интервала
    function initTimeGoneBox() {
        getTimeGoneBox().innerHTML = '0';
    }
    // остановить и очистить всё
    function clear() {
        callReminder(true);
        getTimeCell(true).value = '0';
        initTimeGoneBox();
        syncValues();
    }
    // получить элемент для отображения остатка времени
    function getTimeGoneBox() {
        return document.getElementById('tmrest');
    }
};