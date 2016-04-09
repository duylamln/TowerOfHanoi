(function() {
    "strict";

    


    //var canvas = new fabric.Canvas("tower");
    //var rect1 = new fabric.Rect({
    //    width: 75,
    //    height: 50,
    //    left: 100,
    //    top: 100,
    //    fill: 'blue',
    //    selectable: true
    //});

    //var rect2 = new fabric.Rect({
    //    width: 75,
    //    height: 50,
    //    left: 250,
    //    top: 100,
    //    fill: 'blue',
    //    selectable: true
    //});

    //var rect3 = new fabric.Rect({
    //    width: 75,
    //    height: 50,
    //    left: 400,
    //    top: 100,
    //    fill: 'blue',
    //    selectable: true
    //});

    //drawBackground(canvas);
    //initKeyboard();


    //function drawBackground(canvas) {
    //    var topLine = new fabric.Line([0, 100, 1000, 100], {
    //        stroke: 'blue',
    //        strokeWidth: 2,
    //    });
    //    var bottomLine = new fabric.Line([0, 450, 1000, 450], {
    //        stroke: 'blue',
    //        strokeWidth: 2,
    //    });
    //    canvas.add(topLine);
    //    canvas.add(bottomLine);

    //    canvas.add(rect1);
    //    canvas.add(rect2);
    //    canvas.add(rect3);
    //    canvas.setActiveObject(rect1);

    //}

    //function initKeyboard() {
    //    document.onkeydown = function (event) {
    //        var key = window.event ? window.event.keyCode : event.keyCode;
    //        switch (key) {

    //            case 37: // left
    //                if (canvas.getActiveObject() == rect1) {
    //                    canvas.setActiveObject(rect2);
    //                } else {
    //                    canvas.setActiveObject(rect3);
    //                }
    //            case 39: // right
    //                if (canvas.getActiveObject() == rect1) {
    //                    canvas.setActiveObject(rect2);
    //                } else {
    //                    canvas.setActiveObject(rect3);
    //                }
    //            case 38: // up
    //                //currentRect.setTop(0);
    //                //canvas.renderAll();
    //                //break;
    //            case 40: // down
    //                //currentRect.setTop(450);
    //                //canvas.renderAll();
    //                //break;

    //        }
    //    };
    //}

})();
