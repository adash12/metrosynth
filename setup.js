// joint.js setup
var canvas = $('#canvas');
var cells = [];
var graph = new joint.dia.Graph();
var paper = new joint.dia.Paper({ 
	el: $('#canvas'), 
	width: canvas.outerWidth(), 
	height: 900, 
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
var lastStations = [];

// tone.js setup
// create dictionary of toneJS objects
var idDict = {};
// distance between ports
var distance = 40;
// create cells
var i = 0;
var createCell = function(cell, x, y, label) {
    var newCell = cell.clone();
    newCell.translate(distance*x,distance*y);
    newCell.attr('.label/text', label);
    i++;
    return newCell;
}

// --- Oscillators ------------------------------------------------------------
// must be first 6 cells
// first cell corresponds to oscillator 0 (red)
cells[0] = new joint.shapes.devs.Model({
  type: 'devs.Model',
  position: {x: 3*distance, y: distance},
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
        '.label': { text: 'Osc0', 'text-anchor':'right'},
        rect: { 'stroke-width':1 },
        circle: {r:6}
    }
});


// add to dictionary, place, annotate cells
// cells[i].translate(d, d); // move cell 0 a little bit
idDict[cells[i++].id] = new Tone.Synth(); // add corresponding audio
// osc 1 (blue)
cells[i] = createCell(cells[0], 4, 20, 'Osc1');
idDict[cells[i-1].id] = new Tone.FMSynth();
// osc 2 (yellow)
cells[i] = createCell(cells[0], 13, 1, 'Osc2');
idDict[cells[i-1].id] = new Tone.Synth();
// osc 3 (orange)
cells[i] = createCell(cells[0], -2, 12, 'Osc3');
idDict[cells[i-1].id] = new Tone.Synth();
// osc 4 (green)
cells[i] = createCell(cells[0], 14, 1, 'Osc4');
idDict[cells[i-1].id] = new Tone.Synth();
// osc 5 (silver)
cells[i] = createCell(cells[3], 0, -3, 'Osc5');
idDict[cells[i-1].id] = new Tone.MetalSynth({
    frequency: 150 ,
    envelope: {
        attack: 0.03 ,
        decay: 0.8 ,
        release: 0.2,
    },
    modulationIndex: 20,
    resonance: 200
});
// - Effects ------------------------------------------------------------------
// --- red line (0) -----------------------------------------------------------
// diagonal part
cells[i] = createCell(cells[0], 2, 2, 'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(10, 0.5).start();
cells[i] = createCell(cells[i-1], 2, 2, 'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: 0.6,
    wet: 0.5
});
cells[i] = createCell(cells[i-1], 2, 2, 'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(10, 0.5).start();
// effect ...
cells[i] = createCell(cells[i-1], 2, 2, 'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(10, 0.5).start();
// go down
// effect ...
cells[i] = createCell(cells[i-1], 0, 3, 'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(10, 0.5).start();
// go across
// effect ...
cells[i] = createCell(cells[i-1], 3, 0, 'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(10, 0.5).start();
// effect ...
cells[i] = createCell(cells[i-1], 1, 0, 'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(10, 0.5).start();
// effect ...
cells[i] = createCell(cells[i-1], 2, 0, 'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(10, 0.5).start();
// go up
// effect ...
cells[i] = createCell(cells[i-1], 0, -4, 'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(10, 0.5).start();
// up diagonal
// effect ...
cells[i] = createCell(cells[i-1], -2, -2, 'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(10, 0.5).start();
cells[i] = createCell(cells[i-1], -2, -2, 'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(10, 0.5).start();
// up
cells[i] = createCell(cells[i-1], 0, -1.5, 'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(10, 0.5).start();
// store last station
lastStations[0] = i;

// --- blue line (1) ----------------------------------------------------------
//diagonal
cells[i] = createCell(cells[1],1,-1,'Vibrato');
idDict[cells[i-1].id] = new Tone.Vibrato();
//right
cells[i] = createCell(cells[i-1],1.5,0,'Vibrato');
idDict[cells[i-1].id] = new Tone.Vibrato();
//intersect with yellow
//up
cells[i] = createCell(cells[i-1],-0.5,-5,'Vibrato');
idDict[cells[i-1].id] = new Tone.Vibrato();
//diagonal
cells[i] = createCell(cells[i-1],-1,-1,'Vibrato');
idDict[cells[i-1].id] = new Tone.Vibrato();
//jump to right
cells[i] = createCell(cells[i-1],13,-2,'Vibrato');
idDict[cells[i-1].id] = new Tone.Vibrato();
//right
cells[i] = createCell(cells[i-1],1,0,'Vibrato');
idDict[cells[i-1].id] = new Tone.Vibrato();
cells[i] = createCell(cells[i-1],1,0,'Vibrato');
idDict[cells[i-1].id] = new Tone.Vibrato();
// store last station
lastStations[1] = i;
lastStations[5] = i;

// --- yellow line (2) --------------------------------------------------------
// go down
cells[i] = createCell(cells[2], 0,1,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: 0.6,
    wet: 0.5
});
cells[i] = createCell(cells[i-1],-2,2,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: 0.6,
    wet: 0.5
});
//intersect with red
cells[i] = createCell(cells[i-1],-2,2,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: 0.6,
    wet: 0.5
});

//diagonal
cells[i] = createCell(cells[i-1],1,1,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: 0.6,
    wet: 0.5
});
//down
cells[i] = createCell(cells[i-1],0,2,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: 0.6,
    wet: 0.5
});
//intersect with red
cells[i] = createCell(cells[i-1],0,4,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: 0.6,
    wet: 0.5
});
//left
cells[i] = createCell(cells[i-1],-2,1,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: 0.6,
    wet: 0.5
});
//diagonal down
cells[i] = createCell(cells[i-1],-2,1,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: 0.6,
    wet: 0.5
});
//right
cells[i] = createCell(cells[i-1],2,1,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: 0.6,
    wet: 0.5
});
//down
cells[i] = createCell(cells[i-1],0,1.5,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: 0.6,
    wet: 0.5
});
cells[i] = createCell(cells[i-1],0,1.5,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: 0.6,
    wet: 0.5
});

// store last station
lastStations[2] = i;

// --- orange line (3) --------------------------------------------------------
// go right
cells[i] = createCell(cells[3],2,0,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion();
cells[i] = createCell(cells[i-1],2,0,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion();
cells[i] = createCell(cells[i-1],2,0,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion();
//up!
cells[i] = createCell(cells[i-1],0,-1,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion();
//diagonal
cells[i] = createCell(cells[i-1],1,-1,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion();
//right
cells[i] = createCell(cells[i-1],1,0,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion();
cells[i] = createCell(cells[i-1],3,0,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion();
//down
cells[i] = createCell(cells[i-1],0,2,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion();
//right
cells[i] = createCell(cells[i-1],3,0,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion();
cells[i] = createCell(cells[i-1],2,0,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion();
//diagonal
cells[i] = createCell(cells[i-1],1,-1,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion();
//right
cells[i] = createCell(cells[i-1],2,0,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion();
//diagonal
cells[i] = createCell(cells[i-1],1,-1,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion();
cells[i] = createCell(cells[i-1],1,-1,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion();
cells[i] = createCell(cells[i-1],1,-1,'Distortion');
// store last station
lastStations[3] = i;

// --- green line (4) ---------------------------------------------------------
//jump to bottom
cells[i] = createCell(cells[4],-3,13,'Phaser');
idDict[cells[i-1].id] = new Tone.Phaser();
//right
cells[i] = createCell(cells[i-1],1,0,'Phaser');
idDict[cells[i-1].id] = new Tone.Phaser();
//diagonal
cells[i] = createCell(cells[i-1],1,1,'Phaser');
idDict[cells[i-1].id] = new Tone.Phaser();
cells[i] = createCell(cells[i-1],1,1,'Phaser');
idDict[cells[i-1].id] = new Tone.Phaser();
//diagonal
cells[i] = createCell(cells[i-1],1,-1,'Phaser');
idDict[cells[i-1].id] = new Tone.Phaser();
// store last station
lastStations[4] = i;

// --- silver line (5) --------------------------------------------------------
// down right
cells[i] = createCell(cells[5],1,1,'LPF');
idDict[cells[i-1].id] = new Tone.Filter(1000, "lowpass");
cells[i] = createCell(cells[i-1],1,1,'HPF');
idDict[cells[i-1].id] = new Tone.Filter(300, "highpass");

// --- Outputs ----------------------------------------------------------------
// must be last 6 cells
// out 0 (red)
cells[i] = createCell(cells[lastStations[0]-1], 0, -1.5, 'Out0');
idDict[cells[i-1].id] = Tone.Master; 
// out 1 (blue)
cells[i] = createCell(cells[lastStations[1]-1], 1, 0, 'Out1');
idDict[cells[i-1].id] = Tone.Master; 
// out 2 (yellow)
cells[i] = createCell(cells[lastStations[2]-1], 0, 1, 'Out2');
idDict[cells[i-1].id] = Tone.Master; 
// out 3 (orange)
cells[i] = createCell(cells[lastStations[3]-1], 1, -1, 'Out3');
idDict[cells[i-1].id] = Tone.Master; 
// out 4 (green)
cells[i] = createCell(cells[lastStations[4]-1], 1, 1, 'Out4');
idDict[cells[i-1].id] = Tone.Master; 
// out 5 (silver)
cells[i] = createCell(cells[lastStations[5]-1], 1, 1, 'Out5');
idDict[cells[i-1].id] = Tone.Master; 
graph.addCells(cells);

delete i;