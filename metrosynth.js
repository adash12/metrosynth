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
    // console.log(time);
    // Red
    idDict[oscArr[0]].triggerAttackRelease('C2', '1n');
    idDict[oscArr[0]].triggerAttackRelease('E2', '1n', '+1n');
    idDict[oscArr[0]].triggerAttackRelease('F2', '1n', '+1n+1n');
    idDict[oscArr[0]].triggerAttackRelease('G2', '1n', '+1n+1n+1n');
    // Blue
    idDict[oscArr[1]].triggerAttackRelease('G4', '4n');
    idDict[oscArr[1]].triggerAttackRelease('E4', '4n', '+4n');
    idDict[oscArr[1]].triggerAttackRelease('B4', '4n', '+3n');
    idDict[oscArr[1]].triggerAttackRelease('G4', '4n', '+2n');
    idDict[oscArr[1]].triggerAttackRelease('C4', '4n', '+2n+16n');
    idDict[oscArr[1]].triggerAttackRelease('G4', '4n', '+2m');
    idDict[oscArr[1]].triggerAttackRelease('E4', '4n', '+2m+4n');
    idDict[oscArr[1]].triggerAttackRelease('B4', '4n', '+2m+3n');
    idDict[oscArr[1]].triggerAttackRelease('D4', '4n', '+2m+2n');
    idDict[oscArr[1]].triggerAttackRelease('E4', '4n', '+2m+2n+3n');
    idDict[oscArr[1]].triggerAttackRelease('A4', '4n', '+3m');


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
    idDict[oscArr[5]].triggerAttackRelease('32n', '+16n');
    idDict[oscArr[5]].triggerAttackRelease('64n', '+16n+32n');
    idDict[oscArr[5]].triggerAttackRelease('32n', '+8n+16n');
    idDict[oscArr[5]].triggerAttackRelease('32n', '+4n');
    idDict[oscArr[5]].triggerAttackRelease('8n', '+4n+8n');
    // idDict[oscArr[5]].triggerAttackRelease('16n', '+2n');
    idDict[oscArr[5]].triggerAttackRelease('32n', '+2n+16n');
    idDict[oscArr[5]].triggerAttackRelease('16n', '+2n+8n+16n');
    idDict[oscArr[5]].triggerAttackRelease('32n', '+2n+4n');
    idDict[oscArr[5]].triggerAttackRelease('64n', '+2n+4n+32n');
    idDict[oscArr[5]].triggerAttackRelease('64n', '+2n+4n+16n+32n');
    // idDict[oscArr[5]].triggerAttackRelease('64n', '+2n+4n+16n+32n+64n');
    idDict[oscArr[5]].triggerAttackRelease('8n', '+2n+4n+8n');
    idDict[oscArr[5]].triggerAttackRelease('64n', '+2n+4n+8n+32n');
    idDict[oscArr[5]].triggerAttackRelease('64n', '+2n+4n+8n+32n+64n');
    idDict[oscArr[5]].triggerAttackRelease('16n', '+2n+4n+8n+16n');
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
// called when a link changes source
// is no longer called
graph.on('change:source', function(link){

});

// called when a link changes target
// is no longer called
graph.on('change:target', function(link) {
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
        if(sourceId == targetId){
            link.remove();
            return;
        }
        var inboundLinks = [link];
        var myElement;
        while(inboundLinks.length > 0){
            myElement = inboundLinks[0].get('source');
            if( graph.getCell(myElement.id).attr('.label/text').includes("Out") ){
                alert("Whoops, you can't connect FROM that! :'(");
                link.remove();
                return;
            }
            inboundLinks = graph.getConnectedLinks(myElement, { inbound: true });
        }
        var oscElement = myElement;
        var outboundLinks = [link]
        while(outboundLinks.length > 0){
            myElement = outboundLinks[0].get('target');
            if( graph.getCell(myElement.id).attr('.label/text').includes("Osc") ){
                alert("Whoops, you can't connect TO that! :'(");
                link.remove();
                return;
            }
            outboundLinks = graph.getConnectedLinks(myElement, { outbound: true });
        }

        // out("source = " + oscElement.id);
        // determine which line
        var line;
        var color;
        var i = oscArr.indexOf(oscElement.id);
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
        line.push(oscElement.id);
        outboundLinks = graph.getConnectedLinks(oscElement, { outbound: true });

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

            // Check if oscillator and output are both part of chain, i.e. complete chain
            if(line.length >= 2 && i >= 0 && idDict[line[line.length-1]] instanceof Tone.Panner){
                idDict[line[line.length-2]].connect(waveforms[i])
                // console.log(waveforms[i].getValue())
                trains[i].isActive = true;
                for(train_num in trains){
                    setTrainPosition(train_num,0)
                }
            }
        };
        out("line = "+ line);
    };

    // out(m);

    /*for output in outArr{
        if(output.numberOfInputs > 0){

        }
    }*/
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

        // If line had a train animation, turn it off
        var line_num = colorArr.indexOf(cell.attributes.attrs['.connection'].stroke)
        if(trains[line_num] != null){
            trains[line_num].isActive = false;
            setTrainPosition(line_num, 0);
        }
    }
})

// --- tonejs functions -------------------------------------------------------
// used to remove tone.js audio nodes when link is removed
function removeAudioNode(line, idDict){
    // will need this if there's support for LFO's, etc
    // todo: clear elements when links are removed 
}

// used to add tone.js audio nodes when link is connected
function connectAudioNode(line, idDict) {
    // go through each element, get the corresponding tone.js element
    // then connect current tone.js element to the next one
    for (var i = 0; i < line.length-1; i++) {
        // first make sure nothing is connected
        idDict[line[i]].disconnect(); 
        idDict[line[i]].connect(idDict[line[i+1]]);
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





// Visualization Component begins
// Should eventually be moved to another file
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *    Wave oscillators by Ken Fyrstenberg Nilsen
 *    http://abdiassoftware.com/
 *
 *    CC-Attribute 3.0 License
*/
var ctx = vis.getContext('2d'),
    w, h;

vis.width = w = window.innerWidth * 0.3;
vis.height = h = 75*6;

var waveforms = []
var visualizations = []
var points = []
var count = 100,
    step = Math.ceil(w / count);
var buffer = new ArrayBuffer(count * 4)
    //points = new Array(count);

for(var i = 0; i < 6; i++){
    waveforms.push(new Tone.Waveform());
    visualizations.push(new osc());
    visualizations[i].max = h/6*0.4;
    visualizations[i].line = i;
    visualizations[i].offset = i*h/6 + h/2/6;
    points[i] = new Float32Array(new ArrayBuffer(count * 4));
    for(var j = 0; j < count; j++) {
        points[i][j] = visualizations[i].offset;
    }
}

ctx.lineWidth = 5;
ctx.strokeStyle = '#000';
ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';

function loop() {
    var i, j;
    
    /// move points to the left
    for(i = 0; i < 6; i++){
        for(j = 0; j < count - 1; j++) {
            points[i][j] = points[i][j + 1];
        }    
        /// get a new point
        points[i][count - 1] = visualizations[i].getAmp();
        
    }

    ctx.fillRect(0, 0, w, h);
    for(i = 0; i < 6; i++){
        ctx.strokeStyle = colorArr[i]
        //ctx.clearRect(0, 0, w, h);
        
        
        /// render wave
        ctx.beginPath();
        ctx.moveTo(0, points[i][0]);
        
        for(j = 1; j < count; j++) {
            ctx.lineTo(j * step, points[i][j]);
        }
        
        ctx.stroke();
    }

    requestAnimationFrame(loop);
}
loop();

/// oscillator object
function osc() {

    var t = 0
    
    this.variation = 0.4;
    this.max = 50;
    this.speed = 0.02;
    this.line = 0;
    this.offset = 0;
    
    var me = this,
        t;

    this.getAmp = function() {
        
        t %= 2048
        var this_val = waveforms[this.line].getValue()[Math.floor(t/2)];
        var next_val = waveforms[this.line].getValue()[Math.floor(t/2 + 1) % 1024]
        var amp = 0;

        if(t % 2 == 0){
            amp = this_val;
        }
        else{
            amp = (this_val + next_val) / 2;
        }
        t++;

        return this.max * waveforms[this.line].getValue()[0] + this.offset;
        //return this.max*amp + this.offset;
    }

    return this;    
}

trains = [];
for(var i = 0; i < 6; i++){
    trains.push({
        'isActive': false,
        'position': 0
    })
}
// To be used with setInterval as an animation for the train images
function moveTrain(){
    for(train_num in trains){
        if(trains[train_num].isActive){
            setTrainPosition(train_num, 5 - trains[train_num].position)
        }
    }
}
setInterval(moveTrain, 500)

// Moves train image to desired offset
function setTrainPosition(train_num, position){
    var train_el = document.getElementById('train-'+train_num);    
    train_el.style.bottom = position + 'px';
    trains[train_num].position = position;
}