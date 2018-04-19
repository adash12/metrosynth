var linesArr = []; // 2-D array of all models each line
var oscArr = []; // array of all sources / instruments
var outArr = []; // array of all sinks / outputs
// create lines
for (var i = 0; i < 6; i++) {
    linesArr[i] = [cells[i].id];
    oscArr[i] = cells[i].id;
    outArr[i] = cells[cells.length-i-1].id;
};

// set loop for 4 measures
var t4m = Tone.Time("4m");
// t.mult(4); // multiply that value by 4
// t.toNotation();
var loop4m = new Tone.Loop(function(time){
    //triggered every four whole notes. 
    console.log(time);
    // Red
    idDict[oscArr[0]].triggerAttackRelease('C3', '1n');
    idDict[oscArr[0]].triggerAttackRelease('E3', '1n', '+1n');
    idDict[oscArr[0]].triggerAttackRelease('F3', '1n', '+1n+1n');
    idDict[oscArr[0]].triggerAttackRelease('G3', '1n', '+1n+1n+1n');
    // Blue
    idDict[oscArr[1]].triggerAttackRelease('G4', '4n');
    idDict[oscArr[1]].triggerAttackRelease('E4', '4n', '+4n');
    idDict[oscArr[1]].triggerAttackRelease('G4', '4n', '+2n');
    idDict[oscArr[1]].triggerAttackRelease('C4', '4n', '+2n+16n');
    idDict[oscArr[1]].triggerAttackRelease('B4', '4n', '+3n');
    // todo: add some more stuff


    // Green
    // todo: add melody


}, t4m).start(0);

// set loop for full measure
var t1m = Tone.Time("1m")
var loop1m = new Tone.Loop(function(time){
    // Orange
    idDict[oscArr[3]].triggerAttack(40);
    idDict[oscArr[3]].triggerAttack(40, '+8n+16n', 0.7);
    idDict[oscArr[3]].triggerAttack(40, '+4n');
    idDict[oscArr[3]].triggerAttack(40, '+2n');
    idDict[oscArr[3]].triggerAttack(40, '+2n+8n+16n');
    idDict[oscArr[3]].triggerAttack(40, '+2n+4n+16n');
    idDict[oscArr[3]].triggerAttack(40, '+2n+4n+8n+16n', 0.7);

    // Green

    // Silver
    idDict[oscArr[5]].triggerAttackRelease('16n');
    idDict[oscArr[5]].triggerAttackRelease('8n', '+16n');
    idDict[oscArr[5]].triggerAttackRelease('16n', '+8n+16n');
    idDict[oscArr[5]].triggerAttackRelease('8n', '+4n');
    idDict[oscArr[5]].triggerAttackRelease('8n', '+4n+8n');
    idDict[oscArr[5]].triggerAttackRelease('16n', '+2n');
    idDict[oscArr[5]].triggerAttackRelease('8n', '+2n+16n');
    idDict[oscArr[5]].triggerAttackRelease('16n', '+2n+8n+16n');
    idDict[oscArr[5]].triggerAttackRelease('32n', '+2n+4n');
    idDict[oscArr[5]].triggerAttackRelease('16n', '+2n+4n+32n');
    idDict[oscArr[5]].triggerAttackRelease('64n', '+2n+4n+16n+32n');
    idDict[oscArr[5]].triggerAttackRelease('64n', '+2n+4n+16n+32n+64n');
    idDict[oscArr[5]].triggerAttackRelease('8n', '+2n+4n+8n');
}, t1m).start(0);

// set loop for half measure
var t2n = Tone.Time("2n");
var loop2n = new Tone.Loop(function(time){
    //triggered every four whole notes. 
    // console.log(time);
    // Yellow
    idDict[oscArr[2]].triggerAttackRelease('C5','16n');
    idDict[oscArr[2]].triggerAttackRelease('D5','16n', '+16n');
    idDict[oscArr[2]].triggerAttackRelease('E5','16n', '+8n');
    idDict[oscArr[2]].triggerAttackRelease('G5','16n', '+8n+16n');
    idDict[oscArr[2]].triggerAttackRelease('B5','16n', '+4n');
    idDict[oscArr[2]].triggerAttackRelease('G5','16n', '+4n+16n');
    idDict[oscArr[2]].triggerAttackRelease('E5','16n', '+4n+8n');
    idDict[oscArr[2]].triggerAttackRelease('B4','16n', '+4n+8n+16n');

    // Green
    idDict[oscArr[4]].triggerAttackRelease('F5', '2n');

}, t2n).start(0);

// set BPM
Tone.Transport.bpm.value = 120;
Tone.Transport.start();


// --- event handlers ---------------------------------------------------------

// called when a link changes source or target
graph.on('change:source change:target', function(link) {
    var sourcePort = link.get('source').port;
    var sourceId = link.get('source').id;
    var sourceLabel = link.get('source').label;

    var targetPort = link.get('target').port;
    var targetId = link.get('target').id;
    var targetLabel = link.get('target').label;

    // var m = [
    //     'The port ' + sourcePort,
    //     // ' of element with label ' + sourceLabel,
    //     // ' is connected to port ' + targetPort,
    //     // ' of element with label ' + targetLabel,
    //     ' of element with ID ' + idDict[sourceId],
    //     ' is connected to port ' + targetPort,
    //     ' of element with ID ' + idDict[targetId],
    // ].join('');
    
    
    if (sourceId && targetId) {
        // determine which line is being changed
        // trace links back to first node (oscillator)
        var inboundLinks = [link];
        var myElement;
        while(inboundLinks.length > 0){
            myElement = inboundLinks[0].get('source');
            if( graph.getCell(myElement.id).attr('.label/text').includes("Out") ){
                alert("You can't connect from that! :'(");
                link.remove();
                return;
            }
            inboundLinks = graph.getConnectedLinks(myElement, { inbound: true });
        }
        // out("source = " + myElement.id);
        // determine which line
        var line;
        var color;
        var i = oscArr.indexOf(myElement.id);
        if(i >= 0){
            line = linesArr[i];
            color = colorArr[i];
        }
        else{
            // do not allow non-contiguous links to be added
            // to musical line
            return;
        }
        // todo: add "elbow"/node thing at or near the position of the target
        // station. This generally makes things look better, forces diagonal 
        // lines


        // recreate line
        try {
            line.length = 0; // clear line
        }
        catch(e) {
            return;
        }
        line.push(myElement.id);
        var outboundLinks = graph.getConnectedLinks(myElement, { outbound: true });
        while(outboundLinks.length > 0) {
            // out(outboundLinks);
            // get node, add to line and audio arrays
            myElement = outboundLinks[0].get('target');
            line.push(myElement.id);
            if( !connectAudioNode(line, idDict) ){
                link.remove();
                return;
            }
            // change link appearance
            outboundLinks[0].attr({'.connection': {stroke:color}});
            outboundLinks[0].attr({'.connection': {'stroke-dasharray': '0,0'}});
            outboundLinks[0].attr({'.marker-target': {fill:color}});
            if( graph.getCell(myElement.id).attr('.label/text').includes("Out") ){
                graph.getCell(myElement.id).attr('circle/stroke', color);
                graph.getCell(myElement.id).attr('circle/fill', color);
            }
            // get next link(s)
            outboundLinks = graph.getConnectedLinks(myElement, { outbound: true });
        };
        out("line = "+ line);
    };

    // out(m);
});

// todo: also remove things in line when links are dragged away

// called when a link is removed
graph.on('remove', function(cell, collection, opt) {
    if (cell.isLink()) {
        // a link was removed  (cell.id contains the ID of the removed link)
        // out("link " + cell.id + " was removed");
        var sourceId = cell.get('source').id;
        var targetId = cell.get('target').id;
        if( !sourceId || !targetId){ 
            // link needs both source and target to remove from line
            return;
        }
        // make all lines after removed line dashed
        var myElement = cell.get('target');
        var outboundLinks = graph.getConnectedLinks(myElement, { outbound: true });
        if( graph.getCell(myElement.id).attr('.label/text').includes("Out") ){
            graph.getCell(myElement.id).attr('circle/stroke', '#000000');
            graph.getCell(myElement.id).attr('circle/fill', '#000000');
        } 
        while(outboundLinks.length > 0) {
            // out(outboundLinks);
            // get node, add to line and audio arrays
            myElement = outboundLinks[0].get('target');
            // change link appearance
            outboundLinks[0].attr({'.connection': {stroke:'#000000'}});
            outboundLinks[0].attr({'.connection': {'stroke-dasharray': '10,10'}});
            outboundLinks[0].attr({'.marker-target': {fill:'#000000'}});
            if( graph.getCell(myElement.id).attr('.label/text').includes("Out") ){
                graph.getCell(myElement.id).attr('circle/stroke', '#000000');
                graph.getCell(myElement.id).attr('circle/fill', '#000000');
            }
            // get next link(s)
            outboundLinks = graph.getConnectedLinks(myElement, { outbound: true });
        };

        // remove from line - if not Tone.Master
        if( !graph.getCell(cell.get('source')).attr('.label/text').includes("Out") ){
            idDict[sourceId].disconnect();
        }
    }
})

// --- tonejs functions -------------------------------------------------------
// used to remove tone.js audio nodes when link is removed
function removeAudioNode(line, idDict){
    // will need this if there's support for LFO's, etc 
}

// used to add tone.js audio nodes when link is connected
function connectAudioNode(line, idDict) {
    // go through each element, get the corresponding tone.js element
    // then connect current tone.js element to the next one
    // todo: clear elements when links are removed
    for (var i = 0; i < line.length-1; i++) {
        // todo: use instanceof to add LFO, other effects that can't be 
        // connected together?
        try{
            idDict[line[i]].connect(idDict[line[i+1]]);
        }
        catch(e){
            alert("Whoops, you can't connect to that! :'(");
            return false;
        }

    };
    // idDict[line[0]].triggerAttackRelease('C4', '1n');
    return true;
};

// --- other functions --------------------------------------------------------
function out(m) {
    console.log(m);
}

function lineToString(line, idDict){
    var string;
    for (var i = 0; i < line.length; i++) {
        string = string + idDict[line[i]];
        string = string + " ";
    };
    return string;
}
