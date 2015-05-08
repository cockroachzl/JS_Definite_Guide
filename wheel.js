/**
 * Created by zhangliang on 5/6/2015.
 */
// Enclose the content element in a frame or viewport of the specified width
// and height (minimum 50x50). The optional contentX and contentY arguments
// specify the initial offset of the content relative to the frame. (If
// specified, they must be <= 0.) The frame has mousewheel event handlers that
// allow the user to pan the element, and to shrink or enlarge the frame.
function enclose(content, framewidth, frameheight, contentX, contentY) {
    // These arguments aren't just the initial values: they maintain the
    // current state and are used and modified by the mousewheel handler.
    framewidth = Math.max(framewidth, 50);
    frameheight = Math.max(frameheight, 50);
    contentX = Math.min(contentX, 0) || 0;
    contentY = Math.min(contentY, 0) || 0;

    // Create the frame element and set a CSS classname and styles
    var frame = document.createElement("div");
    frame.className = "enclosure"; // So we can define styles in a stylesheet
    frame.style.width = framewidth + "px";       // Set the frame size.
    frame.style.height = frameheight + "px";
    frame.style.overflow = "hidden";             // No scrollbars, no overflow
    frame.style.boxSizing = "border-box";        // Border-box simplifies the
    frame.style.webkitBoxSizing = "border-box";  // calculations for resizing
    frame.style.MozBoxSizing = "border-box";     // the frame.

    // Put the frame in the document and move the content elt into the frame.
    content.parentNode.insertBefore(frame, content);
    frame.appendChild(content);

    // Position the element relative to the frame
    content.style.position = "relative";
    content.style.left = contentX + "px";
    content.style.top = contentY + "px";

    // Register mousewheel event handlers.
    frame.onwheel = wheelHandler;       // Future browsers
    frame.onmousewheel = wheelHandler;  // Most current browsers

    function wheelHandler(event) {
        // Extract the amount of rotation from the event object, looking
        // for properties of a wheel event object, a mousewheel event object
        // (in both its 2D and 1D forms), and the Firefox DOMMouseScroll event.
        // Scale the deltas so that one "click" toward the screen is 30 pixels.
        // If future browsers fire both "wheel" and "mousewheel" for the same
        // event, we'll end up double-counting it here. Hopefully, however,
        // cancelling the wheel event will prevent generation of mousewheel.
        var deltaX = e.deltaX*-30;  // wheel event
        var deltaY = e.deltaY*-30;  // wheel event

        // Get the current dimensions of the content element
        var contentbox = content.getBoundingClientRect();
        var contentwidth = contentbox.right - contentbox.left;
        var contentheight = contentbox.bottom - contentbox.top;

        if (e.altKey) {  // If Alt key is held down, resize the frame
            if (deltaX) {
                framewidth -= deltaX; // New width, but not bigger than the
                framewidth = Math.min(framewidth, contentwidth);  // content
                framewidth = Math.max(framewidth,50);   // and no less than 50.
                frame.style.width = framewidth + "px";  // Set it on frame
            }
            if (deltaY) {
                frameheight -= deltaY;  // Do the same for the frame height
                frameheight = Math.min(frameheight, contentheight);
                frameheight = Math.max(frameheight-deltaY, 50);
                frame.style.height = frameheight + "px";
            }
        }
        else { // Without the Alt modifier, pan the content within the frame
            if (deltaX) {
                // Don't scroll more than this
                var minoffset = Math.min(framewidth-contentwidth, 0);
                // Add deltaX to contentX, but don't go lower than minoffset
                contentX = Math.max(contentX + deltaX, minoffset);
                contentX = Math.min(contentX, 0);     // or higher than 0
                content.style.left = contentX + "px"; // Set new offset
            }
            if (deltaY) {
                var minoffset = Math.min(frameheight - contentheight, 0);
                // Add deltaY to contentY, but don't go lower than minoffset
                contentY = Math.max(contentY + deltaY, minoffset);
                contentY = Math.min(contentY, 0);     // Or higher than 0
                content.style.top = contentY + "px";  // Set the new offset.
            }
        }

        // Don't let this event bubble. Prevent any default action.
        // This stops the browser from using the mousewheel event to scroll
        // the document. Hopefully calling preventDefault() on a wheel event
        // will also prevent the generation of a mousewheel event for the
        // same rotation.
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        e.cancelBubble = true;  // IE events
        e.returnValue = false;  // IE events
        return false;
    }
}
