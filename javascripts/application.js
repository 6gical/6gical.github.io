$(function() {
  var NUM_TRACK = 10;
  var PLAY_DELAY_DURATION = 100; // avoid glitch
  var ANIMATION_END =  ['animationend',
                        'webkitAnimationEnd',
                        'oanimationend',
                        'MSAnimationEnd'].join(' ');
  var currentAudio   = null;
  var $currentButton = null;
  var audios = audiojs.createAll();
  var isAnimating = false;

  $('.audiojs').hide();
  $('.play-button').click(function(e) {
    if (isAnimating) return;
    var index = parseInt($(this).attr('data-index')) - 1;
    playTrialSong(index);
  });

  function pauseCurrentSong($button) {
    var $icon = $button.find('span');
    currentAudio.pause();
    currentAudio = null;
    showPauseIcon($icon);
    $button.one(ANIMATION_END, function() {
      $button.removeClass('playing-transition');
    });
    $button.addClass('playing-transition');
  }

  function playTrialSong(index) {
    var $button = $('.play-button').slice(index, index+1);
    if (currentAudio === audios[index]) {
      currentAudio.pause();
      currentAudio = null;
      showPauseIcon($button.find('span'));
      $currentButton = null;
      return;
    }
    if (currentAudio !== null) {
      pauseCurrentSong($currentButton);
    }

    currentAudio = audios[index];
    playAudio(currentAudio);

    setTimeout(function() {
      currentAudio.setVolume(1);
    }, PLAY_DELAY_DURATION);
    var $currentIcon = $button.find('span');
    showPlayIcon($currentIcon);
    $button.one(ANIMATION_END, function() {
      $button.removeClass('playing-transition');
      currentAudio.trackEnded = function(e) {
        playTrialSong((index + 1) % NUM_TRACK);
      };
      isAnimating = false;
    });
    $button.addClass('playing-transition');
    $currentButton = $button;
    isAnimating = true;
  }

  function playAudio(audio) {
    try {
      audio.skipTo(0.000001);
      audio.setVolume(0);
    } catch (e) {
      console.log('Failed to seek to start');
    }

    audio.play();
    setTimeout(function() {
      audio.setVolume(1);
    }, PLAY_DELAY_DURATION);
  }

  function showPlayIcon($icon) {
//    $icon.removeClass('octicon-primitive-square');
    $icon.addClass('octicon octicon-playback-play track-playing-icon');
  };
  function showPauseIcon($icon) {
    $icon.removeClass('octicon octicon-playback-play track-playing-icon');
//    $icon.addClass('octicon-primitive-square');
  };
});
