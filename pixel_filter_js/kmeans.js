// kmeans
function kMeansColorSegmentation(input, k, output_id) {
    // load image
    var img = new Image();
    if(typeof input == "string"){
        if(input == "content"){
            img.src = document.getElementById("content").value;
        }
        else img.src = base64String;
    }
    else{
        const reader = new FileReader();
        reader.readAsDataURL(input);
        reader.onload = function(event) {
        img.src = event.target.result;
        };
    }

  // recall, after image load it will active
  img.onload = function() {
    // create canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    // set canvas size to image size
    canvas.width = img.width;
    canvas.height = img.height;

    // draw image on canvas
    ctx.drawImage(img, 0, 0);

    // load pixel data from canvas
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = imageData.data;

    // turn data into 2d array
    var pixelArray = new Array(canvas.height);
    for (var i = 0; i < pixelArray.length; i++) {
      pixelArray[i] = new Array(canvas.width);
      for (var j = 0; j < pixelArray[i].length; j++) {
        var index = (i * canvas.width + j) * 4;
        pixelArray[i][j] = [pixels[index], pixels[index + 1], pixels[index + 2]];
      }
    }

    // make 2d array to 1d array
    var data = new Array(canvas.width * canvas.height);
    var c = 0;
    for (var i = 0; i < pixelArray.length; i++) {
      for (var j = 0; j < pixelArray[i].length; j++) {
        data[c] = pixelArray[i][j];
        c++;
      }
    }

    // k-means
    var centers = new Array(k);
    for (var i = 0; i < k; i++) {
      centers[i] = data[Math.floor(Math.random() * data.length)];
    }
    var labels = new Array(data.length);
    for (var i = 0; i < 10; i++) {
      var sums = new Array(k);
      var counts = new Array(k);
      for (var j = 0; j < k; j++) {
        sums[j] = [0, 0, 0];
        counts[j] = 0;
      }
      for (var j = 0; j < data.length; j++) {
        var dists = new Array(k);
        for (var l = 0; l < k; l++) {
          dists[l] = Math.pow(data[j][0] - centers[l][0], 2) + Math.pow(data[j][1] - centers[l][1], 2) + Math.pow(data[j][2] - centers[l][2], 2);
        }
        var minDist = Math.min.apply(null, dists);
        var label = dists.indexOf(minDist);
        labels[j] = label;
        sums[label][0] += data[j][0];
        sums[label][1] += data[j][1];
        sums[label][2] += data[j][2];
        counts[label]++;
      }
      for (var j = 0; j < k; j++) {
        centers[j][0] = Math.floor(sums[j][0] / counts[j]);
        centers[j][1] = Math.floor(sums[j][1] / counts[j]);
    centers[j][2] = Math.floor(sums[j][2] / counts[j]);
  }
}

// palette
var palette = new Array(k);
for (var i = 0; i < k; i++) {
  palette[i] = "rgb(" + centers[i][0] + "," + centers[i][1] + "," + centers[i][2] + ")";
}

// generate new image
var newCanvas = document.createElement("canvas");
var newCtx = newCanvas.getContext("2d");
newCanvas.width = canvas.width;
newCanvas.height = canvas.height;
for (var i = 0; i < pixelArray.length; i++) {
  for (var j = 0; j < pixelArray[i].length; j++) {
    var index = (i * canvas.width + j) * 4;
    var label = labels[i * canvas.width + j];
    var color = centers[label];
    newCtx.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
    newCtx.fillRect(j, i, 1, 1);
  }
}

    // display new image
    document.getElementById(output_id).src = newCanvas.toDataURL("image/png");
    };
}
