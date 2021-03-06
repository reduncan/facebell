const socket = io();

/**
   * Access the device camera to capture image.
   * Credits to beaufortfrancois' GoogleChrome on github.
   */
const input = document.querySelector('input[type="range"]');
let totalMatchFace = 0
var imageCapture;

navigator.mediaDevices.getUserMedia({ video: true })
  .then(mediaStream => {
    document.querySelector('video').srcObject = mediaStream;

    const track = mediaStream.getVideoTracks()[0];
    imageCapture = new ImageCapture(track);

    return imageCapture.getPhotoCapabilities();
  })
  .then(photoCapabilities => {
    const settings = imageCapture.track.getSettings();

    input.min = photoCapabilities.imageWidth.min;
    input.max = photoCapabilities.imageWidth.max;
    input.step = photoCapabilities.imageWidth.step;

    return imageCapture.getPhotoSettings();
  })
  .then(photoSettings => {
    input.value = photoSettings.imageWidth;
  })
  .catch(error => console.log(error.name || error));

/**
   * Capture the image, draw the image on canvas, then call face-api function.
   * Credits to beaufortfrancois' GoogleChrome on github.
   */
function onTakePhotoButtonClick() {
  imageCapture.takePhoto({ imageWidth: input.value })
    .then(blob => createImageBitmap(blob))
    .then(imageBitmap => {
      drawCanvas(imageBitmap);
      run();
    })
    .catch(error => console.log(error));
}

document.querySelector('video').addEventListener('play', function () {
  document.querySelector('#takePhotoButton').disabled = false;
});

/**
   * Take image capture and render on canvas
   * Credits to beaufortfrancois' GoogleChrome on github
   */
function drawCanvas(img) {
  const canvas = document.querySelector('canvas');
  canvas.width = getComputedStyle(canvas).width.split('px')[0];
  canvas.height = getComputedStyle(canvas).height.split('px')[0];
  let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
  let x = (canvas.width - img.width * ratio) / 2;
  let y = (canvas.height - img.height * ratio) / 2;
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
    x, y, img.width * ratio, img.height * ratio);
    
}


document.querySelector('#takePhotoButton').addEventListener('click', onTakePhotoButtonClick);

/**
  * -Uses keyup to identify when the enter or space key are pressed
  * -On keyup initiates takePhoto()
  * -Sets timeout for actual photo capture
  */
$('body').keyup(function(event) {
  keypress = event.keyCode;
  if ( keypress === 13 || keypress === 32 ) {
    takePhoto();
    setTimeout(onTakePhotoButtonClick, 3000);
    setTimeout(autoCapture, 3000);
  } 
});

/**
  * -Handles DOM manipulation once their is a keypress
  */
const takePhoto = function () {
  $('header').hide();
  $('.ring').hide();
  $('#face').show();
  $('#face').css("display", "flex")
};

/**
  * -Hadles DOM manipulation once the photo has been captured
  */
const autoCapture = function () {
  $('#takePhotoButton').hide();
  $('video').hide();
  $('.lds-ellipsis').removeClass('hide')
}

/**
  * -Handled the DOM manipulation once the server responds with content from the emaiil account
  */
socket.on('emit-unlock', function () {
  $('.denied').hide();
  $('.success').show();
});
