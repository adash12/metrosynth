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
// distance between ports
var d = 40;
// create cells
var i = 0;
var createCell = function(x, y, label) {
    var newCell = cells[i-1].clone();
    newCell.translate(x,y);
    newCell.attr('.label/text', label);
    i++;
    return newCell;
}

// --- Oscillators ------------------------------------------------------------
// must be first 6 cells
// first cell corresponds to oscillator 0 (red)
cells[0] = new joint.shapes.devs.Model({
  type: 'devs.Model',
  position: {x: d, y: d},
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
cells[i].translate(d, d); // move cell 0 a little bit
idDict[cells[i++].id] = new Tone.Synth(); // add corresponding audio
// osc 1 (blue)
cells[i] = createCell(d, d, 'Osc1');
idDict[cells[i-1].id] = new Tone.FMSynth();
// osc 2 (yellow)
cells[i] = createCell(d, d, 'Osc2');
idDict[cells[i-1].id] = new Tone.Synth();
// osc 3 (orange)
cells[i] = createCell(d, d, 'Osc3');
idDict[cells[i-1].id] = new Tone.Synth();
// osc 4 (green)
cells[i] = createCell(d, d, 'Osc4');
idDict[cells[i-1].id] = new Tone.Synth();
// osc 5 (silver)
cells[i] = createCell(d, d, 'Osc5');
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
// --- Effects ----------------------------------------------------------------
// effect 1
cells[i] = createCell(d, d, 'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(10, 0.5).start();
// effect 2
cells[i] = createCell(d, d, 'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: 0.6,
    wet: 0.5
});
// idDict[cells[i++].id].wet = 0.2;
// --- Outputs ----------------------------------------------------------------
// must be last 6 cells
// out 0

// cells[i] = cells[i-1].clone();
// cells[i].translate(d, 10);
// cells[i].attr('.label/text', 'Out0');
cells[i] = createCell(d, d, 'Out0');
idDict[cells[i-1].id] = Tone.Master; 
// out 1
cells[i] = createCell(d, d, 'Out1');
idDict[cells[i-1].id] = Tone.Master; 
// out 2
cells[i] = createCell(d, d, 'Out2');
idDict[cells[i-1].id] = Tone.Master; 
// out 3
cells[i] = createCell(d, d, 'Out3');
idDict[cells[i-1].id] = Tone.Master; 
// out 4
cells[i] = createCell(d, d, 'Out4');
idDict[cells[i-1].id] = Tone.Master; 
// out 5
cells[i] = createCell(d, d, 'Out5');
idDict[cells[i-1].id] = Tone.Master; 
graph.addCells(cells);

delete i;