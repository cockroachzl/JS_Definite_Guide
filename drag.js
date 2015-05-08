/**
 * Drag.js: drag absolutely positioned HTML elements.
 *
 * This module defines a single drag() function that is designed to be called
 * from an onmousedown event handler. Subsequent mousemove events will
 * move the specified element. A mouseup event will terminate the drag.
 * This implementation works with both the standard and IE event models.
 * It requires the getScrollOffsets() function from elsewhere in this book.
 *
 * Arguments:
 *
 *   elementToDrag: the element that received the mousedown event or
 *     some containing element. It must be absolutely positioned. Its
 *     style.left and style.top values will be changed based on the user's
 *     drag.
 *
 *   event: the Event object for the mousedown event.
 **/
function drag(elementToDrag, event) {
    // The initial mouse position, converted to document coordinates
    //var scroll = getScrollOffsets();  // A utility function from elsewhere
    var startX = event.clientX + window.pageXOffset;
    var startY = event.clientY + window.pageYOffset;

    // The original position (in document coordinates) of the element
    // that is going to be dragged.  Since elementToDrag is absolutely
    // positioned, we assume that its offsetParent is the document body.
    var origX = elementToDrag.offsetLeft;
    var origY = elementToDrag.offsetTop;

    // Compute the distance between the mouse down event and the upper-left
    // corner of the element. We'll maintain this distance as the mouse moves.
    var deltaX = startX - origX;
    var deltaY = startY - origY;

    // Register the event handlers that will respond to the mousemove events
    // and the mouseup event that follow this mousedown event.
    // Register capturing event handlers on the document
    document.addEventListener("mousemove", moveHandler, true);
    document.addEventListener("mouseup", upHandler, true);

    // We've handled this event. Don't let anybody else see it.
    event.stopPropagation();  // Standard model

    // Now prevent any default action.
    event.preventDefault();   // Standard model


    /**
     * This is the handler that captures mousemove events when an element
     * is being dragged. It is responsible for moving the element.
     **/
    function moveHandler(e) {

        // Move the element to the current mouse position, adjusted by the
        // position of the scrollbars and the offset of the initial click.
        elementToDrag.style.left = (e.clientX + window.pageXOffset - deltaX) + "px";
        elementToDrag.style.top = (e.clientY + window.pageYOffset - deltaY) + "px";

        // And don't let anyone else see this event.
        e.stopPropagation();  // Standard
    }

    /**
     * This is the handler that captures the final mouseup event that
     * occurs at the end of a drag.
     **/
    function upHandler(e) {
        // Unregister the capturing event handlers.
        document.removeEventListener("mouseup", upHandler, true);
        document.removeEventListener("mousemove", moveHandler, true);

        // And don't let the event propagate any further.
        e.stopPropagation();  // Standard model
    }
}