function shoebox() {
    function createCanvas() {
	
	var wallCanvasContainer = document.getElementById("wall-canvas-container");
        wallCanvasContainer.className = "";   
        //var wallCanvasFabric = new fabric.Canvas("wall-canvas");
        wallCanvasFabric.setWidth(document.getElementById("wall-width").value);
        wallCanvasFabric.setHeight(document.getElementById("wall-height").value);	    
	wallCanvasFabric.renderAll();
    }

    function blockDragStart(e) {
	[].forEach.call(wallBlocks, function(block) {
            block.classList.remove("current-img-dragged");
	});
        this.classList.add("current-img-dragged");

        var dragImage = new Image();

	if (this.id == "block1x1") {
	    dragImage.src = "block1x1.png";
	}
	else if (this.id == "block1x2") {
	    dragImage.src = "block1x2.png";
	}
	else if (this.id == "block2x2") {
	    dragImage.src = "block2x2.png";
	}
	e.dataTransfer.setDragImage(dragImage, this.offsetWidth / 2, this.offsetHeight / 2);
    }

    function blockDrag(e) {
	var canvasRect = wallCanvas.getBoundingClientRect();

        var block = document.querySelector("img.current-img-dragged");

	if (e.clientX - canvasRect.left < block.offsetWidth / 2) {
            var blockLeft = canvasRect.left; 
        }
        else if (canvasRect.right - e.clientX < block.offsetWidth / 2) {
            var blockLeft = canvasRect.right - block.offsetWidth / 2;
        }
        else {
            var blockLeft = e.clientX - block.offsetWidth / 2;	
        }

        if (e.clientY - canvasRect.top < block.offsetHeight / 2) {
            var blockTop = canvasRect.top;
        }
        else if (canvasRect.bottom - e.clientY < block.offsetHeight / 2) {
            var blockTop = canvasRect.bottom - block.offsetWidth / 2;
        }
        else {
            var blockTop = e.clientY - block.offsetHeight / 2;
        }
        var blockBottom = blockTop + block.offsetHeight;
        var blockRight = blockLeft + block.offsetWidth;

        var hasCollide = false;

	wallCanvasFabric.forEachObject(function(element) {
            var imgTop = element.getBoundingRect().top + canvasRect.top;
            var imgBottom = element.getBoundingRect().top + element.getBoundingRect().height + canvasRect.top;
	    var imgLeft = element.getBoundingRect().left + canvasRect.left;
	    var imgRight = element.getBoundingRect().left + element.getBoundingRect().width + canvasRect.left;

	    if (!(blockTop > imgBottom || blockBottom < imgTop || blockLeft > imgRight || blockRight < imgLeft)) {
	        hasCollide = true;
	    }
        });
	if (hasCollide) {
	    collide = true;
	}
	else {
	    collide = false;
	}
	hasCollide = false;
    }

    function blockDragOver(e) {
	e.preventDefault();
    }

    function blockDragEnter(e) {
    }

    function blockDragLeave(e) {
    }

    function blockDrop(e) {
        var block = document.querySelector("img.current-img-dragged");

        var canvasRect = wallCanvas.getBoundingClientRect();

        var dropX;
	var dropY;

	if (e.clientX - canvasRect.left < block.offsetWidth / 2) {
 	    dropX = 0;
	} // deal with left border, let block snap in
	else if (canvasRect.right - e.clientX < block.offsetWidth / 2) {
	    dropX = wallCanvasContainer.offsetWidth - block.offsetWidth; 
	} // deal with right border, let block snap in
	else {
	    dropX = e.clientX - block.offsetWidth / 2 - canvasRect.left;
	}
	if (e.clientY - canvasRect.top < block.offsetHeight / 2) {
            dropY = 0; 
	} // deal with top border, let block snap in
	else if (canvasRect.bottom - e.clientY < block.offsetHeight / 2) {
	    dropY = wallCanvasContainer.offsetHeight - block.offsetHeight;
	} // deal with bottom border, let block snap in
	else {
	    dropY = e.clientY - block.offsetHeight / 2 - canvasRect.top;
	}

        if (collide == false) {
	    var newImage = new fabric.Image(block, {
                width: block.width,
	        height: block.height,
	        left: dropX,
	        top: dropY,
	        hasControls: false
	});

	wallCanvasFabric.add(newImage);
	}
    }

    function blockDragEnd(event) {
    }

    function setObjPosition(distX, distY, curObj, obj) {
	if (Math.abs(distX) > Math.abs(distY)) {
	    if (distX > 0) {
		if (obj.getTop() + obj.getHeight() + curObj.getHeight() <= wallCanvasContainer.offsetHeight) { 
	            curObj.setTop(obj.getTop() + obj.getHeight());
		    return;
		} // set new position only when still within canvas boundary
	    } // curObj at obj's bottom, set curObj to touch the bottom of obj
	    else {
		if (obj.getTop() - curObj.getHeight() >= 0) {
		    curObj.setTop(obj.getTop() - curObj.getHeight());
		    return;
		} // set new position only when still within canvas boundary
	    } // curObj at obj's top, set curObj to touch the top of obj
	    // if curObj new position out of canvas bound
	    if (curObj.getLeft() <= obj.getLeft()) {
		if (obj.getLeft() - curObj.getWidth() >= 0) {    
		    curObj.setLeft(obj.getLeft() - curObj.getWidth());
		} // if new position at obj's left is not out of bound, move to new position
		else {
		    curObj.setLeft(obj.getLeft() + obj.getWidth());
		} // if new position at obj's left is out of bound, move to obj's right
	    } // if curObj current position is at left of obj
	    else if (curObj.getLeft() >= obj.getLeft()) {
		if (obj.getLeft() + obj.getWidth() + curObj.getWidth() <= wallCanvasContainer.offsetWidth) {
	            curObj.setLeft(obj.getLeft() + obj.getWidth());
	        }
		else {
		    curObj.setLeft(obj.getLeft() - curObj.getWidth());
		}
	    } // if curObj current position is at right of obj
	} // curObj is closer to obj's Y axis, thus should be at top or bottom side of obj
	else {
	    if (distY > 0) {
                if (obj.getLeft() + obj.getWidth() + curObj.getWidth() <= wallCanvasContainer.offsetWidth) {
	            curObj.setLeft(obj.getLeft() + obj.getWidth());
		    return;
	        }	    
	    } // curObj at obj's right
	    else {
		if (obj.getLeft() - curObj.getWidth() >= 0) {
		    curObj.setLeft(obj.getLeft() - curObj.getWidth());
	            return;
		}
	    } // curObj at obj's left
            // if curObj new position out of canvas bound
	    if (curObj.getTop() <= obj.getTop()) {
		if (obj.getTop() - curObj.getHeight() >= 0) {    
		    curObj.setTop(obj.getTop() - curObj.getHeight());
		}
		else {
		    curObj.setTop(obj.getTop() + obj.getHeight());
		}
	    } // if out of bound and at top of obj
	    else if (curObj.getTop() >= obj.getTop()) {
		if (obj.getTop() + obj.getHeight() + curObj.getHeight() <= wallCanvasContainer.offsetHeight) {
		    curObj.setTop(obj.getTop() + obj.getHeight());
		}
		else {
		    curObj.setTop(obj.getTop() - curObj.getHeight());
		}
	    }
	} // curObj is closer to obj's X axis, thus should be at left or right side of obj	
    }

    var collide = false;
    var wallCanvas = document.getElementById("wall-canvas");
    var genWallCanvas = document.getElementById("gen-wall-canvas");
   
    genWallCanvas.addEventListener("click", createCanvas, false);

    var wallCanvasFabric = new fabric.Canvas("wall-canvas");

    var wallCanvasContainer = document.getElementById("wall-canvas-container");

    var wallBlocks = document.getElementsByClassName("wall-block"); 

    [].forEach.call(wallBlocks, function (block) { 
        block.addEventListener("dragstart", blockDragStart, false);
    	block.addEventListener("dragend", blockDragEnd, false);
        block.addEventListener("drag", blockDrag, false);	
    });

    wallCanvasContainer.addEventListener("dragenter", blockDragEnter, false);
    wallCanvasContainer.addEventListener("dragover", blockDragOver, false);
    wallCanvasContainer.addEventListener("dragleave", blockDragLeave, false);
    wallCanvasContainer.addEventListener("drop", blockDrop, false);

    wallCanvasFabric.on("object:moving", function(options) {
        var curObj = options.target;
        curObj.setCoords();
        
        if (curObj.getLeft() < 0) {
            curObj.setLeft(0);
        } // blocks cannot be moved beyond canvas left border

        if (curObj.getTop() < 0 ) {
            curObj.setTop(0);
	} // blocks cannot be moved beyond canvas top border

        if (curObj.getLeft() + curObj.getWidth() > wallCanvasContainer.offsetWidth) {
            curObj.setLeft(wallCanvasContainer.offsetWidth - curObj.getWidth());
        } // blocks cannot be moved beyond canvas right border

        if (curObj.getTop() + curObj.getHeight() > wallCanvasContainer.offsetHeight) {
            curObj.setTop(wallCanvasContainer.offsetHeight - curObj.getHeight());
        } // blocks cannot be moved beyond canvas bottom border 

        wallCanvasFabric.forEachObject(function(obj) {
            if (curObj == obj) {
                return;
            }
            if (curObj.intersectsWithObject(obj) || curObj.isContainedWithinObject(obj) || obj.isContainedWithinObject(curObj)) {
                var xAxisObj = obj.getTop() + obj.getHeight() / 2;
	        var xAxisCurObj = curObj.getTop() + curObj.getHeight() / 2;
	        var yAxisObj = obj.getLeft() + obj.getWidth() / 2;
	        var yAxisCurObj = curObj.getLeft() + curObj.getWidth() / 2;
	        var distX = xAxisCurObj - xAxisObj;
	        var distY = yAxisCurObj - yAxisObj;
		setObjPosition(distX, distY, curObj, obj);
	    }
	});
        // if curObj still overlap with objs after first round reposition, apply the following:

        curObj.setCoords();

        var collideCount = 0;
        var stillCollide = true;

	var outerBoundLeft = null,
	    outerBoundRight = null,
	    outerBoundTop = null,
	    outerBoundBottom = null;
	while (stillCollide == true) {
	    wallCanvasFabric.forEachObject(function(obj){
                var intersectArea = null, // overlap on happens when this value is greater than 0
	            intersectWidth = null, // for calculate intersectArea
	            itersectHeight = null, // for calculate intersectArea
	            intersectLeft = null, 
	            intersectRight = null,
	            intersectTop = null,
                    intersectBottom = null;

                var curObjLeft = curObj.getLeft(),
	        curObjRight = curObjLeft + curObj.getWidth(),
	        curObjTop = curObj.getTop(),
	        curObjBottom = curObjTop + curObj.getHeight(),
	        objLeft = obj.getLeft(),
	        objRight = objLeft + obj.getWidth(),
	        objTop = obj.getTop(),
	        objBottom = objTop + obj.getHeight();
	        
	        if (curObj == obj) {
	            return;
                }

	        if (curObj.intersectsWithObject(obj) || curObj.isContainedWithinObject(obj) || obj.isContainedWithinObject(curObj)) {
			
		    //console.log("curObjLeft: ");
                    //console.log(curObjLeft);
		    //console.log("objLeft: ");
	            //console.log(objLeft);	    
		    if (curObjLeft >= objLeft && curObjLeft <= objRight) {
                        intersectLeft = curObjLeft;
	    	        intersectWidth = obj.getWidth() - (curObjLeft - objLeft);
	    	    }
	    	    else if (curObjRight <= objRight && curObjRight >= objLeft) {
	    	        intersectRight = curObjRight;
	    	        intersectWidth = obj.getWidth() - (objRight - curObjRight);
	    	    }
                    if (curObjTop >= objTop && curObjTop <= objBottom) {
	    	        intersectTop = curObjTop;
	    	        intersectHeight = obj.getHeight() - (curObjTop - objTop);
	    	    }
                    else if (curObjBottom <= objBottom && curObjBottom >= objTop) {
	    	        intersectBottom = curObjBottom;
	    	        intersectHeight = obj.getHeight() - (objBottom - curObjBottom);
	    	    }
		    if (objLeft >= curObjLeft && objRight <= curObjRight) {
		        intersectLeft = objLeft;
		        intersectRight = objRight;
		        intersectWidth = intersectRight - intersectLeft;	
		    } // if obj is contained in curObj
		    if (objTop >= curObjTop && objBottom <= curObjBottom) {
		        intersectTop = objTop;
			intersectBottom = objBottom;
			intersectHeight = intersectBottom - intersectTop;
		    }

	    	    if (intersectWidth > 0 && intersectHeight > 0) {
	    	        intersectArea = intersectWidth * intersectHeight;
	    	    }
		    //console.log(intersectWidth);
		    //console.log(intersectHeight);
                    if (objLeft < intersectLeft || outerBoundLeft == null) {
	    	        outerBoundLeft = objLeft;
	    	    }
	    	    if (objTop < intersectTop || outerBoundTop == null) {
	    	        outerBoundTop = objTop;
	    	    }
	    	    if (objRight > intersectLeft + intersectWidth || outerBoundRight == null) {
	    	        outerBoundRight = objRight;
	    	    }
	    	    if (objBottom > intersectTop + intersectHeight || outerBoundBottom == null) {
	    	        outerBoundBottom = objBottom;
	    	    }
	    	    if (intersectArea) {
			collideCount += 1;    
			var xAxisOuterBound = (outerBoundTop + outerBoundBottom) / 2;
	    	        var yAxisOuterBound = (outerBoundLeft + outerBoundRight) / 2;
	    	        var xAxisCurObj = (curObjTop + curObjBottom) / 2;
	    	        var yAxisCurObj = (curObjLeft + curObjRight) / 2;
	    	        var distX = xAxisCurObj - xAxisOuterBound;
			var distY = yAxisCurObj - yAxisOuterBound;
			//console.log(distX);
			//console.log(distY);
	    	        setObjPosition(distX, distY, curObj, obj);
			curObj.setCoords();
		    }
		}
	    });	
	    //console.log(collideCount);
		
	    if (collideCount != 0) {
	        stillCollide = true;
	        collideCount = 0;
	    }
	    else {
	        stillCollide = false;
	    }
	    //console.log(stillCollide);
        };	    
    });
}

$(document).ready(shoebox);
