var select = document.getElementById('color');
var color = select.options[select.selectedIndex].value;

// array for each "line"/osc of element IDs
var oscArr = [cells[0].id];

// set loop for 4 whole notes (?)
var t = Tone.Time("1n"); //encodes a whole note
t.mult(4); // multiply that value by 4
t.toNotation(); //returns "1m"
var loop = new Tone.Loop(function(time){
    //triggered every four whole notes. 
    console.log(time);
    idDict[oscArr[0]].triggerAttackRelease('C4', '1n');
}, t).start(0);
// set BPM
Tone.Transport.bpm.value = 120;
Tone.Transport.start();


// --- event handlers ---------------------------------------------------------

// called when a link changes source or target
// fixme: dragging from one node to another does not work... 
//      then there is an extra oscArr element
//      need to make sure that link is changed from one source to another,
//      then the appropriate oscArr element is removed
graph.on('change:source change:target', function(link) {
    link.attr({'.connection': {stroke:color}});
    link.attr({'.marker-target': {fill:color}});

    var sourcePort = link.get('source').port;
    var sourceId = link.get('source').id;
    var sourceLabel = link.get('source').label;

    var targetPort = link.get('target').port;
    var targetId = link.get('target').id;
    var targetLabel = link.get('target').label;

    var m = [
        'The port ' + sourcePort,
        // ' of element with label ' + sourceLabel,
        // ' is connected to port ' + targetPort,
        // ' of element with label ' + targetLabel,
        ' of element with ID ' + idDict[sourceId],
        ' is connected to port ' + targetPort,
        ' of element with ID ' + idDict[targetId],
    ].join('');
    
    
    if (sourceId && targetId) {
        // do not allow non-contiguous links to be added
        if (oscArr.indexOf(sourceId) < 0) {
            link.disconnect(); // works better than link.remove() ??
            return;
        };
        // add to oscArr
        var myElement = cells[0];
        var outboundLinks = graph.getConnectedLinks(myElement, { outbound: true });
        oscArr.length = 0;
        oscArr.push(myElement.id);
        while(outboundLinks.length > 0) {
            out(outboundLinks);
            myElement = outboundLinks[0].get('target');
            oscArr.push(myElement.id);
            connectAudioNode(oscArr, idDict);
            outboundLinks = graph.getConnectedLinks(myElement, { outbound: true });
        };
        out(oscArr);
    };

    out(m);
});

// called when a link is removed
graph.on('remove', function(cell, collection, opt) {
    if (cell.isLink()) {
        // a link was removed  (cell.id contains the ID of the removed link)
        out("link " + cell.id + " was removed");
        var sourceId = cell.get('source').id;
        var targetId = cell.get('target').id;
        if( !sourceId || !targetId){ 
            // link needs both source and target to remove from oscArr
            return;
        }
        // remove from oscArr
        // var index = oscArr.indexOf(targetId);
        // oscArr.splice(index, 1);
        out("node removed (" + oscArr.length + "): " + 
            oscArrToString(oscArr, idDict));  
        // should call "removeAudioNode" but I'm not sure exactly 
        // what should go there
        idDict[sourceId].disconnect();
    }
})

// --- tonejs functions -------------------------------------------------------
// used to remove tone.js audio nodes when link is removed
function removeAudioNode(oscArr, idDict){
    // ?? 
}

// used to add tone.js audio nodes when link is connected
function connectAudioNode(oscArr, idDict) {
    // go through each element, get the corresponding tone.js element
    // then connect current tone.js element to the next one
    // todo: clear elements when links are removed
    for (var i = 0; i < oscArr.length-1; i++) {
        idDict[oscArr[i]].connect(idDict[oscArr[i+1]]);
    };
    idDict[oscArr[0]].triggerAttackRelease('C4', '1n');
    
};

// --- other functions --------------------------------------------------------
function out(m) {
    console.log(m);
}

function oscArrToString(oscArr, idDict){
    var string;
    for (var i = 0; i < oscArr.length; i++) {
        string = string + idDict[oscArr[i]];
        string = string + " ";
    };
    return string;
}

$("#color").on("change", function() {
    color = select.options[select.selectedIndex].value;
    var text = select.options[select.selectedIndex].text;

    
});