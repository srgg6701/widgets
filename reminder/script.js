window.onload = function () {
    const audioBox = document.querySelector('#audio-box audio');
    var controls = function () {
        return {
            range: 'range',    // ползунок
            interval: 'interval', // ячейка
            start: 'start'     // кнопка
        }
    },
        cellRange = document.getElementById(controls().range),
        cellInterval = document.getElementById(controls().interval),
        // синхронизировать значение интервала между ячейкой и ползунком
        syncValues = function (inpToId) {
            if (inpToId === controls().range)
                cellInterval.value = cellRange.value;
            else
                cellRange.value = cellInterval.value;
        },
        // остановить и очистить всё
        clear = function () {
            callReminder(true);
            cellInterval.value = '0';
            initTimeGoneBox();
            syncValues(controls().interval);
        };
    // синхронизировать значение интервала между ячейкой и ползунком
    syncValues(controls().interval);
    // инициализировать значение интервала нулём
    initTimeGoneBox();
    var tm,
        /**
          основная функция
         */
        callReminder = (function () {
            var manageControls = function (freeze) {
                for (var opt in controls())
                    document.getElementById(controls()[opt]).disabled = (freeze) ? true : false;
            },
                timeRestProgressBar = document.querySelector('#rest-bar >div');
            return function (command) {
                if (command === true) {
                    clearTimeout(tm); //console.log('21: clear interval');
                    manageControls(); // разморозить элементы управления
                } else {
                    var min = cellInterval.value;
                    manageControls(true); // зaморозить элементы управления
                    var time_rest_in_seconds_init = min * 60,
                        time_rest_in_seconds = time_rest_in_seconds_init,    // инициализация значения, далее будет уменьшаться
                        timeRestBox = getTimeGoneBox(),
                        timeRestInfo,
                        time_record,
                        // рассчитать и отобразить оставшееся время (запускается через интервал)
                        showTime = function () {
                        // динамически установить ширину прогресс-бара
                        timeRestProgressBar.style.width = (time_rest_in_seconds / time_rest_in_seconds_init * 100) + '%';
                        //console.log('showTime, time_rest_in_seconds: '+time_rest_in_seconds+', time_rest_in_seconds_init: '+time_rest_in_seconds_init);
                        // если не меньше минуты, покажем их
                        timeRestInfo = (time_rest_in_seconds >= 60)
                            ? Math.floor(time_rest_in_seconds / 60) + ' мин. ' + (time_rest_in_seconds % 60)
                            : time_rest_in_seconds;
                        timeRestInfo += ' сек.';
                        if (time_rest_in_seconds == time_rest_in_seconds_init)
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
                            
                            audioBox.parentNode.classList.add('active');
                            audioBox.play();
                            if (confirm("Продолжить?")) {
                                callReminder();
                            } else {
                                manageControls();
                            }
                            audioBox.pause();
                            audioBox.parentNode.classList.remove('active');
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
    (function (callback) {
        /**
         назначить вызов callReminder(остановка_выполнения) по событиям:
         - явная установка
         - изменение значения интервала */
        var btns = ['stop', controls().interval, controls().range];
        for (var i in btns)
            document.getElementById(btns[i]).onclick = function () {
                callback(true);
            };
        // var pointers = document.querySelectorAll('#time_less, #time_more');
        // изменить значение интервала кликом по указателю
        document.querySelectorAll('#time_less, #time_more')
            .forEach(span => span.addEventListener('click', event => {
                const element = event.currentTarget;
                if (element.id == 'time_less' && cellInterval.value > 0) {
                    if (!cellInterval.disabled) cellInterval.value--;
                }
                if (element.id == 'time_more') {
                    if (!cellInterval.disabled) cellInterval.value++;
                }
                syncValues(controls().interval);
            }));
    }(callReminder));
    /**
     ОБРАБОТАТЬ СОБЫТИЯ ЭЛЕМЕНТОВ
     */
    // обработать значение интервала в ячейке
    cellInterval.onblur = function () {
        cellInterval.value = cellInterval.value.replace(',', '.');
        cellInterval.value = cellInterval.value.replace(/\s/g, '');
        syncValues(controls().range);
    };
    // Кнопка "Старт"
    document.getElementById('start').onclick = function (event) {
        if (!cellInterval.value || cellInterval.value == '0') {
            alert('Укажите интервал');
        } else {
            if (/[^0-9\.]/.test(cellInterval.value)) {
                alert('Недопустимые символы в поле для интервала');
            } else {
                callReminder();
                event.currentTarget.disabled = true;
            }
        }
    };
    // Синхронизировать значения:
    // - Ячейка со значением интервала
    cellInterval.oninput = function () {
        syncValues(controls().interval);
    };
    // - Ползунок с интервалом
    cellRange.oninput = function () {
        syncValues(controls().range);
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
    // получить элемент для отображения остатка времени
    function getTimeGoneBox() {
        return document.getElementById('tmrest');
    }
};