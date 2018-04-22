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
    // Turn off interactivity while stations are being created
    interactive : false,
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

        // todo: Prevent links that don't connect to anything 
        // (?) doesn't seem to work
        //      always says cellViewS,T is connected to "object Object"
        // out("[mS, mT] = [" + magnetS + ", " + magnetT + "]");

        // Prevent links to ports that already have an inbound link
        if(magnetT === undefined) return false; // prevents typeError
        var port = magnetT.getAttribute('port');
        var links = graph.getConnectedLinks(cellViewT.model, { inbound: true });
        var portLinks = _.filter(links, function(o) {
            try{
                return o.get('target').port == port;
            }
            catch(e){
                return 0;
            }

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
    },
    // Enable link snapping within 75px lookup radius
    // this destroys everything
    // snapLinks: { radius: 10 }
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
// osc 0 (red) - chord
idDict[cells[i++].id] = new Tone.Synth({
    oscillator : {
        type : "fatsquare",
        count : 3,
        spread : 10
    },
    envelope : {
        attack : 0.04
    }
}); // add corresponding audio
// osc 1 (blue) - Melody 
cells[i] = createCell(cells[0], 3, 21, 'Osc1');
idDict[cells[i-1].id] = new Tone.FMSynth();
// osc 2 (yellow) - Sequence
cells[i] = createCell(cells[0], 13, 1.5, 'Osc2');
idDict[cells[i-1].id] = new Tone.Synth();
// osc 3 (orange) - kick
cells[i] = createCell(cells[0], -2, 12, 'Osc3');
idDict[cells[i-1].id] = new Tone.MembraneSynth({
    octaves : 4,
    envelope : {
        decay : 0.6,
        sustain : 0.05
    }
});
// osc 4 (green) - Drone
cells[i] = createCell(cells[0], 14, 1.5, 'Osc4');
idDict[cells[i-1].id] = new Tone.Synth({
    oscillator : {
        type : "sine"
    },
    envelope : {
        attack : 0.5,
        decay : 0.5,
        sustain : 0.5,
        release : 1
    }
});
// osc 5 (silver) - hihat
cells[i] = createCell(cells[3], 0, -3, 'Osc5');
idDict[cells[i-1].id] = new Tone.MetalSynth({
    frequency: 150 ,
    envelope: {
        attack: 0.001 ,
        decay: 0.12 ,
        release: 0.2,
    },
    modulationIndex: 20,
    resonance: 200,
    volume: -15
});
// - Effects ------------------------------------------------------------------
// --- red line (0) -----------------------------------------------------------
// diagonal part
cells[i] = createCell(cells[0], 2, 2, 'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(20*Math.random(), Math.random()).start();
cells[i] = createCell(cells[i-1], 2, 2, 'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: 0.6,
    wet: 0.5
});
cells[i] = createCell(cells[i-1], 2, 2, 'LFO');
idDict[cells[i-1].id] = new Tone.Tremolo({
    frequency : "4n", 
    type: "sawtooth",
    depth: 1,
    spread: 0
}).start();
// effect ...
cells[i] = createCell(cells[i-1], 2, 2, 'Vibrato');
idDict[cells[i-1].id] = new Tone.Vibrato(20*Math.random(), 0.5*Math.random());
// go down
// effect ...
cells[i] = createCell(cells[i-1], 0, 3, 'Phaser');
idDict[cells[i-1].id] = new Tone.Phaser(5*Math.random(), Math.floor(5*Math.random()));
// go across
// effect ...
cells[i] = createCell(cells[i-1], 3, 0, 'LPF');
idDict[cells[i-1].id] = new Tone.Filter(1000*Math.random()+500, "lowpass");
// effect ...
cells[i] = createCell(cells[i-1], 1, 0, 'Reverb');
idDict[cells[i-1].id] = new Tone.Freeverb(Math.random(), 4000*Math.random()+1000);
// effect ...
cells[i] = createCell(cells[i-1], 2, 0, 'BitCrush');
idDict[cells[i-1].id] = new Tone.BitCrusher(Math.round(5*Math.random())+1);
// go up
// effect ...
cells[i] = createCell(cells[i-1], 0, -4, 'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(20*Math.random(), Math.random()).start();
// up diagonal
// effect ...
cells[i] = createCell(cells[i-1], -2, -2, 'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n+8n", 
    feedback: Math.random(),
    wet: 0.5*Math.random()
});
cells[i] = createCell(cells[i-1], -2, -2, 'HPF');
idDict[cells[i-1].id] = new Tone.Filter(500*Math.random()+500, "highpass");
// up
cells[i] = createCell(cells[i-1], 0, -1.5, 'Chorus');
idDict[cells[i-1].id] = new Tone.Chorus("1n", 1+5*Math.random(), Math.random());
// store last station
lastStations[0] = i;

// --- blue line (1) ----------------------------------------------------------
//diagonal
cells[i] = createCell(cells[1],1,-1,'HPF');
idDict[cells[i-1].id] = new Tone.Filter(500*Math.random()+500, "highpass");
//right
cells[i] = createCell(cells[i-1],1.5,0,'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(20*Math.random(), Math.random()).start();
//intersect with yellow
//up diagonal
cells[i] = createCell(cells[i-1],-2,-5,'Chorus');
idDict[cells[i-1].id] = new Tone.Chorus("1n", 1+5*Math.random(), Math.random());
//jump to right
cells[i] = createCell(cells[i-1],15,-4,'Vibrato');
idDict[cells[i-1].id] = new Tone.Vibrato(20*Math.random(), 0.5*Math.random());
cells[i] = createCell(cells[i-1],1.5,0,'Phaser');
idDict[cells[i-1].id] = new Tone.Phaser(5*Math.random(), Math.floor(5*Math.random()));
// store last station
lastStations[1] = i;
lastStations[5] = i;

// --- yellow line (2) --------------------------------------------------------
// go down
cells[i] = createCell(cells[2], 0,1.5,'HPF');
idDict[cells[i-1].id] = new Tone.Filter(500*Math.random()+500, "highpass");
cells[i] = createCell(cells[i-1],-2,1,'Phaser');
idDict[cells[i-1].id] = new Tone.Phaser(5*Math.random(), Math.floor(5*Math.random()));
//intersect with red
cells[i] = createCell(cells[i-1],-2,2,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "8n+16n", 
    feedback: Math.random(),
    wet: 0.5*Math.random()
});

//diagonal
cells[i] = createCell(cells[i-1],1,1,'BitCrush');
idDict[cells[i-1].id] = new Tone.BitCrusher(Math.round(5*Math.random())+1);
//down
cells[i] = createCell(cells[i-1],0,2,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "4n", 
    feedback: Math.random(),
    wet: 0.5*Math.random()
});
//intersect with red
cells[i] = createCell(cells[i-1],0,4,'LFO');
idDict[cells[i-1].id] = new Tone.Tremolo({
    frequency : "8n", 
    type: "square",
    depth: 1,
    spread: 0
}).start();
//left
cells[i] = createCell(cells[i-1],0,2,'Reverb');
idDict[cells[i-1].id] = new Tone.JCReverb(Math.random());
//diagonal down
cells[i] = createCell(cells[i-1],-4,2,'Phaser');
idDict[cells[i-1].id] = new Tone.Phaser(5*Math.random(), Math.floor(5*Math.random()));
//right
cells[i] = createCell(cells[i-1],1,1,'Vibrato');
idDict[cells[i-1].id] = new Tone.Vibrato(20*Math.random(), 0.5*Math.random());
//down
cells[i] = createCell(cells[i-1],0,1,'LFO');
idDict[cells[i-1].id] = new Tone.Tremolo({
    frequency : "1n", 
    type: "sine",
    depth: 1,
    spread: 0
}).start();
cells[i] = createCell(cells[i-1],0,1,'BitCrush');
idDict[cells[i-1].id] = new Tone.BitCrusher(Math.round(5*Math.random())+1);

// store last station
lastStations[2] = i;

// --- orange line (3) --------------------------------------------------------
// go right
cells[i] = createCell(cells[3],2,0,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion(Math.random());
cells[i] = createCell(cells[i-1],2,0,'Wah');
idDict[cells[i-1].id] = new Tone.AutoWah(600, 7, -20);
cells[i] = createCell(cells[i-1],2,0,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "8n", 
    feedback: Math.random(),
    wet: 0.5*Math.random()
});
//up!
cells[i] = createCell(cells[i-1],0,-1,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion(Math.random());
//diagonal
cells[i] = createCell(cells[i-1],1,-1,'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(20*Math.random(), Math.random()).start();
//right
cells[i] = createCell(cells[i-1],1,0,'HPF');
idDict[cells[i-1].id] = new Tone.Filter(500*Math.random()+500, "highpass");
cells[i] = createCell(cells[i-1],3,0,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion(Math.random());
//down
cells[i] = createCell(cells[i-1],0,3,'Wah');
idDict[cells[i-1].id] = new Tone.AutoWah(600, 7, -20);
//right
cells[i] = createCell(cells[i-1],3,0,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion(Math.random());
cells[i] = createCell(cells[i-1],2,0,'LPF');
idDict[cells[i-1].id] = new Tone.Filter(1000*Math.random()+500, "lowpass");
//diagonal
cells[i] = createCell(cells[i-1],1,-2,'Distortion');
idDict[cells[i-1].id] = new Tone.Distortion(Math.random());
//right
cells[i] = createCell(cells[i-1],2,0,'LFO');
idDict[cells[i-1].id] = new Tone.Tremolo({
    frequency : "6n", 
    type: "sine",
    depth: 1,
    spread: 0
}).start();
//diagonal
cells[i] = createCell(cells[i-1],1.5,-1.5,'Reverb');
idDict[cells[i-1].id] = new Tone.Freeverb(Math.random(), 4000*Math.random()+1000);
cells[i] = createCell(cells[i-1],1.5,-1.5,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "8n+16n", 
    feedback: Math.random(),
    wet: 0.5*Math.random()
});
// cells[i] = createCell(cells[i-1],1,-1,'Distortion');
// idDict[cells[i-1].id] = new Tone.Distortion(Math.random());
// store last station
lastStations[3] = i;

// --- green line (4) ---------------------------------------------------------
//jump to bottom
cells[i] = createCell(cells[4],-3,14.5,'HPF');
idDict[cells[i-1].id] = new Tone.Filter(1000*Math.random()+500, "highpass");
//right
cells[i] = createCell(cells[i-1],1,0,'Vibrato');
idDict[cells[i-1].id] = new Tone.Vibrato(20*Math.random(), 0.5*Math.random());
//diagonal
cells[i] = createCell(cells[i-1],1.5,1.5,'Delay');
idDict[cells[i-1].id] = new Tone.FeedbackDelay({
    delayTime: "8n+16n", 
    feedback: Math.random(),
    wet: 0.5*Math.random()
});
cells[i] = createCell(cells[i-1],1.5,1.5,'Tremolo');
idDict[cells[i-1].id] = new Tone.Tremolo(20*Math.random(), Math.random()).start();
//diagonal
cells[i] = createCell(cells[i-1],1,-1,'Phaser');
idDict[cells[i-1].id] = new Tone.Phaser(5*Math.random(), Math.floor(5*Math.random()));
// store last station
lastStations[4] = i;

// --- silver line (5) --------------------------------------------------------
// down right
cells[i] = createCell(cells[5],1,1,'LPF');
idDict[cells[i-1].id] = new Tone.Filter(1000*Math.random()+500, "lowpass");
cells[i] = createCell(cells[i-1],1,1,'HPF');
idDict[cells[i-1].id] = new Tone.Filter(500*Math.random()+500, "highpass");

// --- Outputs ----------------------------------------------------------------
// must be last 6 cells
// out 0 (red)
cells[i] = createCell(cells[lastStations[0]-1], 0, -1.5, 'Out0');
cells[i-1].attr('circle/fill', '#000000');
idDict[cells[i-1].id] = new Tone.Panner(0.1).connect(Tone.Master); 
// out 1 (blue)
cells[i] = createCell(cells[lastStations[1]-1], 1.5, 0, 'Out1');
cells[i-1].attr('circle/fill', '#000000');
idDict[cells[i-1].id] = new Tone.Panner(-0.5).connect(Tone.Master); 
// out 2 (yellow)
cells[i] = createCell(cells[lastStations[2]-1], 0, 1, 'Out2');
cells[i-1].attr('circle/fill', '#000000');
idDict[cells[i-1].id] = new Tone.Panner(0.5).connect(Tone.Master); 
// out 3 (orange)
cells[i] = createCell(cells[lastStations[3]-1], 1.5, -1.5, 'Out3');
cells[i-1].attr('circle/fill', '#000000');
idDict[cells[i-1].id] = new Tone.Panner(0).connect(Tone.Master); 
// out 4 (green)
cells[i] = createCell(cells[lastStations[4]-1], 2, 2, 'Out4');
cells[i-1].attr('circle/fill', '#000000');
idDict[cells[i-1].id] = new Tone.Panner(1).connect(Tone.Master); 
// out 5 (silver)
cells[i] = createCell(cells[lastStations[5]-1], 1.5, 1, 'Out5');
cells[i-1].attr('circle/fill', '#000000');
idDict[cells[i-1].id] = new Tone.Panner(-1).connect(Tone.Master); 

for (color = 0; color < colorArr.length; color++) {
    cells[color].attr('circle/stroke', colorArr[color]);
    cells[color].attr('circle/fill', colorArr[color]);
}

graph.addCells(cells);

// allow interactivity for future added things
paper.options.interactive = true;

delete i;