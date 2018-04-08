// joint.js setup
var canvas = $('#canvas');
var cells = [];
var graph = new joint.dia.Graph();
var paper = new joint.dia.Paper({ 
	el: $('#canvas'), 
	width: canvas.outerWidth(), 
	height: 650, 
	gridSize: 1, 
	model: graph,
    // add arrowheads on target side of link
    // how to have several kinds of links??
    defaultLink: new joint.dia.Link({
        attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z', 'stroke-width': 0 }, 
                '.connection': {
                    'stroke-width': 5,
                    'stroke-dasharray': '10,10'
                }
            }
    }),

    defaultRouter: { name: 'metro' },
	validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {

        // Prevent links that don't connect to anything 
        // (?) doesn't seem to work
        //      always says cellViewS,T is connected to "object Object"
        // out("[mS, mT] = [" + magnetS + ", " + magnetT + "]");

        // Prevent links to ports that already have an inbound link
        if(magnetT === undefined) return false; // prevents typeError
        var port = magnetT.getAttribute('port');
        var links = graph.getConnectedLinks(cellViewT.model, { inbound: true });
        var portLinks = _.filter(links, function(o) {
            return o.get('target').port == port;
        })
        if(portLinks.length > 0) return false;//|| indexOf(cellView.model.id,))
        
        return cellViewS && cellViewT;
	},
    validateMagnet: function(cellView, magnet){
        // Prevent links from ports that already have an outbound link
        // Need to have only one link to/from source, sink
        // Need to have two links for effects
        // check outbound links
        var port = magnet.getAttribute('port');
        var links = graph.getConnectedLinks(cellView.model, { outbound: true });
        var portLinks = _.filter(links, function(o) {
            return o.get('source').port == port;
        });
        if(portLinks.length > 0) return false;
        return magnet.getAttribute('magnet') !== 'passive';
    }
});

// colors: red, blue, yellow, orange, green, silver
var colorArr = ['#be1337', '#0795d3', '#f5d415', '#da8707', '#00b050', '#a2a4a1'];

// tone.js setup
// create dictionary of toneJS objects
var idDict = {};
// create cells
// --- Oscillators ------------------------------------------------------------
// must be first 6 cells
// first cell corresponds to oscillator 0 (red)
cells[0] = new joint.shapes.devs.Model({
  type: 'devs.Model',
  position: {x: 20, y: 20},
  size: { width: 1, height: 1 },
  inPorts: ['in1'],
  // outPorts: ['out1'],
  ports: {
        groups: {
            'in': {
                position: { // doesn't do anything?
                    name: 'bottom'
                },
                attrs: {
                    '.port-body': {
                        fill: '#16A085'
                    }
                }                
            },
            'out': {
                attrs: {
                    '.port-body': {
                        fill: '#E74C3C'
                    }
                }
            }
        }
    },
    attrs: {
        '.label': { text: 'Osc0'},
        rect: { 'stroke-width':1 }
    }
});
// add to dictionary, place, annotate cells
var i = 0;
cells[i].translate(40, 30); // move cell 0 a little bit
idDict[cells[i++].id] = new Tone.Synth(); // add corresponding audio
// osc 1 (blue)
cells[i] = cells[i-1].clone();
cells[i].translate(20, 10);
cells[i].attr('.label/text', 'Osc1');
idDict[cells[i++].id] = new Tone.FMSynth();
graph.addCells(cells);
// osc 2 (yellow)
cells[i] = cells[i-1].clone();
cells[i].translate(20, 10);
cells[i].attr('.label/text', 'Osc2');
idDict[cells[i++].id] = new Tone.Synth();
graph.addCells(cells);
// osc 3 (orange)
cells[i] = cells[i-1].clone();
cells[i].translate(20, 10);
cells[i].attr('.label/text', 'Osc3');
idDict[cells[i++].id] = new Tone.Synth();
graph.addCells(cells);
// osc 4 (green)
cells[i] = cells[i-1].clone();
cells[i].translate(20, 10);
cells[i].attr('.label/text', 'Osc4');
idDict[cells[i++].id] = new Tone.Synth();
graph.addCells(cells);
// osc 5 (silver)
cells[i] = cells[i-1].clone();
cells[i].translate(20, 10);
cells[i].attr('.label/text', 'Osc5');
idDict[cells[i++].id] = new Tone.MetalSynth({
    frequency: 150 ,
    envelope: {
        attack: 0.03 ,
        decay: 0.8 ,
        release: 0.2,
    },
    modulationIndex: 20,
    resonance: 200
});
graph.addCells(cells);
// --- Effects ----------------------------------------------------------------
// effect 1
cells[i] = cells[i-1].clone();
cells[i].translate(20, 10);
cells[i].attr('.label/text', 'Tremolo');
idDict[cells[i++].id] = new Tone.Tremolo(10, 0.5).start();
graph.addCells(cells);
// effect 2
cells[i] = cells[i-1].clone();
cells[i].translate(20, 10);
cells[i].attr('.label/text', 'Delay');
idDict[cells[i++].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: 0.6,
    wet: 0.5
});
// idDict[cells[i++].id].wet = 0.2;
graph.addCells(cells);
// --- Outputs ----------------------------------------------------------------
// must be last 6 cells
// out 0
cells[i] = cells[i-1].clone();
cells[i].translate(20, 10);
cells[i].attr('.label/text', 'Out0');
idDict[cells[i++].id] = Tone.Master; 
graph.addCells(cells);
// out 1
cells[i] = cells[i-1].clone();
cells[i].translate(20, 10);
cells[i].attr('.label/text', 'Out1');
idDict[cells[i++].id] = Tone.Master; 
graph.addCells(cells);
// out 2
cells[i] = cells[i-1].clone();
cells[i].translate(20, 10);
cells[i].attr('.label/text', 'Out2');
idDict[cells[i].id] = Tone.Master; 
graph.addCells(cells);
// out 3
cells[i] = cells[i-1].clone();
cells[i].translate(20, 10);
cells[i].attr('.label/text', 'Out3');
idDict[cells[i++].id] = Tone.Master; 
graph.addCells(cells);
// out 4
cells[i] = cells[i-1].clone();
cells[i].translate(20, 10);
cells[i].attr('.label/text', 'Out4');
idDict[cells[i++].id] = Tone.Master; 
graph.addCells(cells);
// out 5
cells[i] = cells[i-1].clone();
cells[i].translate(20, 10);
cells[i].attr('.label/text', 'Out5');
idDict[cells[i++].id] = Tone.Master; 
graph.addCells(cells);

delete i;

var linesArr = []; // 2-D array of all models each line
var oscArr = []; // array of all sources / instruments
var outArr = []; // array of all sinks / outputs
// create lines
for (var i = 0; i < 6; i++) {
    linesArr[i] = [cells[i].id];
    oscArr[i] = cells[i].id;
    outArr[i] = cells[cells.length-i-1].id;
};

// set loop for 4 measures notes
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
    // Orange

    // Green

    // Silver

}, t4m).start(0);
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
    // Orange

    // Green

    // Silver
    idDict[oscArr[5]].triggerAttackRelease('8n');
    idDict[oscArr[5]].triggerAttackRelease('16n', '+8n+16n');
    idDict[oscArr[5]].triggerAttackRelease('16n', '+4n');
    idDict[oscArr[5]].triggerAttackRelease('16n', '+4n+16n');
    idDict[oscArr[5]].triggerAttackRelease('16n', '+4n+8n+16n');
}, t2n).start(0);

// set BPM
Tone.Transport.bpm.value = 120;
Tone.Transport.start();


// --- event handlers ---------------------------------------------------------

// called when a link changes source or target
// fixme: dragging from one node to another does not work... 
//      then there is an extra redLine element
//      need to make sure that link is changed from one source to another,
//      then the appropriate redLine element is removed
graph.on('change:source change:target', function(link) {
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
        for (var i = 0; i < linesArr.length; i++) {
            if(linesArr[i].indexOf(sourceId) >= 0){
                break;
            }
            else if(i == 6){
                return;
            }
        };
        // if (redLine.indexOf(sourceId) < 0 && blueLine.indexOf(sourceId) < 0) {
        //     link.disconnect(); // works better than link.remove() ??
        //     return;
        // };

        // determine which line is being changed
        // trace links back to first node (oscillator)
        var inboundLinks = [link];
        var myElement;
        while(inboundLinks.length > 0){
            myElement = inboundLinks[0].get('source');
            inboundLinks = graph.getConnectedLinks(myElement, { inbound: true });
        }
        // determine which line
        var line;
        var color;
        for (var i = 0; i < linesArr.length; i++) {
            if(linesArr[i].indexOf(myElement.id) >= 0){
                line = linesArr[i];
                color = colorArr[i];
                break;
            }
            else if(i == 6){
                return;
            }
        };
        // recreate line
        line.length = 0;
        line.push(myElement.id);
        var outboundLinks = graph.getConnectedLinks(myElement, { outbound: true });
        while(outboundLinks.length > 0) {
            out(outboundLinks);
            // get node, add to line and audio arrays
            myElement = outboundLinks[0].get('target');
            line.push(myElement.id);
            connectAudioNode(line, idDict);
            // change link appearance
            outboundLinks[0].attr({'.connection': {stroke:color}});
            outboundLinks[0].attr({'.connection': {'stroke-dasharray': '0,0'}});
            outboundLinks[0].attr({'.marker-target': {fill:color}});
            // get next link(s)
            outboundLinks = graph.getConnectedLinks(myElement, { outbound: true });
        };
        out(line);
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
            // link needs both source and target to remove from redLine
            return;
        }
        // remove from redLine
        // var index = redLine.indexOf(targetId);
        // redLine.splice(index, 1);
        // out("node removed (" + redLine.length + "): " + 
        //     lineToString(redLine, idDict));  
        // should call "removeAudioNode" but I'm not sure exactly 
        // what should go there
        idDict[sourceId].disconnect();
    }
})

// --- tonejs functions -------------------------------------------------------
// used to remove tone.js audio nodes when link is removed
function removeAudioNode(line, idDict){
    // ?? 
}

// used to add tone.js audio nodes when link is connected
function connectAudioNode(line, idDict) {
    // go through each element, get the corresponding tone.js element
    // then connect current tone.js element to the next one
    // todo: clear elements when links are removed
    for (var i = 0; i < line.length-1; i++) {
        idDict[line[i]].connect(idDict[line[i+1]]);
    };
    // idDict[line[0]].triggerAttackRelease('C4', '1n');
    
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
