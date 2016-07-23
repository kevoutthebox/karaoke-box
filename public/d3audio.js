// imports D3MusicFrequency object

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
      console.log('either the mic or the audio is not on');
      return;
    }
    if (scoreInterval <= 5) {
      scoreInterval++;
      return;
    }
    scoreInterval = 0;
    if (audioMaxIndex === micMaxIndex) {
      // console.log('match');
      console.log('percentage: ' + score/iterations);
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

window.onload = function() {
  var audioMaxIndex = null;
  var micMaxIndex = null;

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

  // displays frequency data of sources

  // AUDIO
  var audioContext = new AudioContext();
  var audio = document.getElementById('myAudio');
  var audioSource = audioContext.createMediaElementSource(audio);
  var audioAnalyser = audioContext.createAnalyser();

  audioAnalyser.fftSize = 4096;
  audioAnalyser.minDecibels = -95;
  audioAnalyser.smoothingTimeConstant = 0.85;

  audioSource.connect(audioAnalyser);
  audioSource.connect(audioContext.destination);

  // var audioProcessor = context.createScriptProcessor(4096, 2, 1)

  var audioFrequencyData = new Uint8Array(audioAnalyser.frequencyBinCount/15);

  var d3MusicFrequencyAudio = new D3MusicFrequency();
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
    }, 10);
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
    streamAnalyser.smoothingTimeConstant = 0.50;

    streamSource.connect(streamAnalyser);
    var streamFrequencyData = new Uint8Array(streamAnalyser.frequencyBinCount/15);

    var d3MusicFrequencyStream = new D3MusicFrequency(streamAnalyser, streamFrequencyData);
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
    }, 10);

  }

  function error(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

};
