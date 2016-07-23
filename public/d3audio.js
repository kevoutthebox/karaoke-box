// imports D3MusicFrequency object
function D3MusicFrequency(color) {
  this.mainSvg = null;
  this.mainSvgHeight = 300;
  this.mainSvgWidth = 1200;
  this.barPadding = '1';
  this.analyser = null; // analyser node that writes frequencyData
  this.frequencyData = null; // sync frequencyData 8bit or 32bit array to D3Music

  this.createMainSvg = function(parent) {
    this.mainSvg = d3.select(parent).append('svg').attr('height', this.mainSvgHeight).attr('width', this.mainSvgWidth);
  };

  this.bind = function(analyser,frequencyData) {
    this.analyser = analyser;
    this.frequencyData = frequencyData;
  };

  this.createFrequencies = function() {
    this.mainSvg
      .selectAll('rect')
      .data(this.frequencyData)
      .enter()
      .append('rect')
      .attr('x',(d, i) => {
        return i * (this.mainSvgWidth / this.frequencyData.length);
      })
      .attr('width', this.mainSvgWidth / this.frequencyData.length - this.barPadding);
  };

  this.renderFrequencies = function() {
    // requestAnimationFrame(this.renderFrequencies);
    this.analyser.getByteFrequencyData(this.frequencyData); // now frequencyData array has data

    this.mainSvg.selectAll('rect')
      .data(this.frequencyData)
      .attr('y', (d) => {
        return this.mainSvgHeight - d;
      })
      .attr('height', (d) => {
        return d;
      })
      .attr('fill', (d) => {
        if (color === 'purple') {
          return 'rgb(' + d +  ',' + 30 + ',' + 200 + ')';
        } else if (color === 'lightPurple') {
          return 'rgb(' + d +  ',' + 45 + ',' + 170 + ')';
        } else if (color === 'green') {
          return 'rgb(' + 100 +  ',' + 200 + ',' + d + ')';
        } else if (color === 'greenPink') {
          return 'rgb(' + 255 - d +  ',' + 0 + ',' + 0 + ')';
        } else if (color === 'neonYellow') {
          return 'rgb(' + (d + 50) +  ',' + 255 + ',' + 0 + ')';
        } else if (color === 'blackRed') {
          return 'rgb(' + (d + 50) +  ',' + 0 + ',' + 0 + ')';
        } else if (color === 'redBlack') {
          return 'rgb(' + (255 - d) +  ',' + 0 + ',' + 0 + ')';
        } else if (color === 'orange') {
          return 'rgb(' + Math.floor( d * 0.6 + 70) +  ',' + 120 + ',' + Math.floor(0) + ')';
        } else if (color === 'darkPurple') {
          return 'rgb(' + Math.floor( d * 0.90 + 70)  +  ',' + 40 + ',' + 230 + ')';
        }
      });
  };

  this.remove = function() {
    this.mainSvg.remove(); // this might not work! it hasnt bee tested!
  };
}

// ############################################################

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var displayScore = $('#display-score');

function karaokeScoring(audioMaxIndex, micMaxIndex) {
  var score = 0;
  var iterations = 0;
  var scorePercent = 0;
  var scoreInterval = 0;
  // closure
  return function (audioMaxIndex, micMaxIndex) {
    if (audioMaxIndex === null || micMaxIndex === null) {
      // console.log('either the mic or the audio is not on');
      return;
    }
    if (scoreInterval <= 5) {
      scoreInterval++;
      return;
    }
    scoreInterval = 0;
    if (audioMaxIndex === micMaxIndex) {
      // console.log('match');
      // console.log('percentage: ' + score/iterations);
      score++;
      iterations++;
      scorePercent = (score/iterations).toFixed(3);
      console.log(scorePercent);
      displayScore.html(scorePercent);
    } else {
      iterations++;
      scorePercent = (score/iterations).toFixed(3);
      console.log(scorePercent);
      displayScore.html(scorePercent);
    }
  };
}
var karaokeScoring = karaokeScoring();

// can only have 1 of these window on loads
window.onload = function() {
  var startMic = $('#start-mic');
  var stopMic = $('#stop-mic');

  var localAudioStream;
  var isMic = false;
  startMic.on('click', function() {
    if (navigator.getUserMedia && isMic === false) {
      isMic = true;
      navigator.getUserMedia({video: false, audio: true}, success, error);
    }
  });

  // tracks the freq with the highest amplitude. used in scoring
  var audioMaxIndex = null;
  var micMaxIndex = null;

  // AUDIO
  var audioContext = new AudioContext();
  var audio = document.getElementById('myAudio');
  var audioSource = audioContext.createMediaElementSource(audio);
  var audioAnalyser = audioContext.createAnalyser();

  audioAnalyser.fftSize = 4096;
  audioAnalyser.minDecibels = -95;
  // audioAnalyser.smoothingTimeConstant = 0.85;

  audioSource.connect(audioAnalyser);
  audioSource.connect(audioContext.destination);

  // var audioProcessor = context.createScriptProcessor(4096, 2, 1)

  var audioFrequencyData = new Uint8Array(audioAnalyser.frequencyBinCount/15);

  var d3MusicFrequencyAudio = new D3MusicFrequency('lightPurple');
  d3MusicFrequencyAudio.bind(audioAnalyser, audioFrequencyData);
  d3MusicFrequencyAudio.createMainSvg('body');
  d3MusicFrequencyAudio.createFrequencies();

  var audioFreqHandle = null;
  audio.addEventListener('play', function() {
    d3MusicFrequencyAudio.renderFrequencies(audioAnalyser, audioFrequencyData);

    audioFreqHandle = setInterval(function() {
      // compares the max freq value in a slice of the array for
      // freq hz 150 to 1500, the vocal ranges for avg singers
      var audioFrequencyDataAvg = audioFrequencyData.slice(15, 150);
      var max = audioFrequencyDataAvg[0];
      var maxIndex = 0;
      for (var i = 0; i < audioFrequencyDataAvg.length; i++) {
        if (audioFrequencyDataAvg[i] > max) {
          max = audioFrequencyDataAvg[i];
          maxIndex = i;
        }
      }
      audioMaxIndex = maxIndex;
      karaokeScoring(audioMaxIndex, micMaxIndex);
      d3MusicFrequencyAudio.renderFrequencies(audioAnalyser, audioFrequencyData);
    }, 5);
  });

  // audio.addEventListener('pause', function() {
  //   if (audioFreqHandle) {
  //     // clearInterval(audioFreqHandle);
  //   }
  // });


  // MIRCOPHONE
  var streamContext = new AudioContext();

  function success(stream) {
    window.stream = stream;
    var streamSource = streamContext.createMediaStreamSource(stream);
    var streamAnalyser = streamContext.createAnalyser();
    streamAnalyser.fftSize = 4096;
    streamAnalyser.minDecibels = -90;
    streamAnalyser.maxDecibels = -20;
    // streamAnalyser.smoothingTimeConstant = 0.50;

    streamSource.connect(streamAnalyser);
    var streamFrequencyData = new Uint8Array(streamAnalyser.frequencyBinCount/15);

    var d3MusicFrequencyStream = new D3MusicFrequency('purple');
    d3MusicFrequencyStream.bind(streamAnalyser, streamFrequencyData);
    d3MusicFrequencyStream.createMainSvg('body');
    d3MusicFrequencyStream.createFrequencies();

    stopMic.on('click', function() {
      isMic = false;
      // streamSource.disconnect(); // this doesn twork
      stream.getAudioTracks().map( s => {
        return s.stop;
      });
    });
    var streamFreqHandle = null;
    d3MusicFrequencyStream.renderFrequencies();
    streamFreqHandle = setInterval(function() {
      var streamFrequencyDataAvg = streamFrequencyData.slice(15, 150);
      var max = streamFrequencyDataAvg[0];
      var maxIndex = 0;
      for (var i = 0; i < streamFrequencyDataAvg.length; i++) {
        if (streamFrequencyDataAvg[i] > max) {
          max = streamFrequencyDataAvg[i];
          maxIndex = i;
        }
      }
      micMaxIndex = maxIndex;
      // console.log('max ' + max);
      // console.log('max index ' + maxIndex);
      d3MusicFrequencyStream.renderFrequencies();
    }, 5);

  }

  function error(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

};
