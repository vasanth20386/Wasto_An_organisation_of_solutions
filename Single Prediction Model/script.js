var canvas;
var predictionLabel;
var model = null;
var classes;

var modelLoaded = false;

window.onload = function () {
  classes = ['Aluminium', 'Packaging', 'Glass', 'Organic', 'Other Plastics', 'Paper and Cardboard', 'Plastic', 'Textiles', 'Wood'];
  canvas = document.getElementById('canvas');
  predictionLabel = document.getElementById("predictionLabel");

  canvas.width = 256;
  canvas.height = 256;

  document.getElementById("predictButton").onclick = function () {
    if (modelLoaded) {
      predictionLabel.innerHTML = "Predicting waste class...";
      predict();
    } else {
      alert("The model hasn't loaded yet.");
    }
  };

  document.getElementById('inputFile').onchange = function (e) {
    var img = new Image();
    img.onload = uploadImage;
    img.src = URL.createObjectURL(this.files[0]);
  };

  (async () => {
    console.log("Loading model");
    model = await tf.loadGraphModel("/model.json");

    predictionLabel.innerHTML = "The model has been successfully loaded. Please choose an image.";
    modelLoaded = true;
    document.getElementById("predictButton").className = "center-text btn btn-lg btn-success rounded-5";
    document.getElementById("predictButton").style.backgroundColor = "#17de8f";
    console.log("Model loaded");
  })();
};

function predict() {
  var canvasImage = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
  let tensor = tf.browser.fromPixels(canvasImage);
  const resized = tf.image.resizeNearestNeighbor(tensor, [256, 256]).toFloat();
  const batched = resized.expandDims(0);
  var predictions = model.predict(batched).dataSync();

  console.log(predictions);
  console.log(predictions.indexOf(Math.max.apply(null, predictions)));

  predictionLabel.innerHTML = 'Prediction: <span style="color:#17de8f">' + classes[predictions.indexOf(Math.max.apply(null, predictions))] + "</span>";
}

function uploadImage() {
  canvas.width = this.width;
  canvas.height = this.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(this, 0, 0);

  var canvasImage = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
  let tensor = tf.browser.fromPixels(canvasImage);
  const resized = tf.image.resizeNearestNeighbor(tensor, [512, 512]).toFloat();
  canvas.width = 512;
  canvas.height = 512;

  const [height, width] = resized.shape;
  const buffer = new Uint8ClampedArray(width * height * 4);
  const imageData = new ImageData(width, height);
  const data = resized.dataSync();

  var i = 0;
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var pos = (y * width + x) * 4;      // position in buffer based on x and y
      buffer[pos] = data[i]             // some R value [0, 255]
      buffer[pos + 1] = data[i + 1]           // some G value
      buffer[pos + 2] = data[i + 2]           // some B value
      buffer[pos + 3] = 255;                // set alpha channel
      i += 3
    }
  }

  imageData.data.set(buffer);
  ctx.putImageData(imageData, 0, 0);
}