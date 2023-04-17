// button
function original_button(){
    document.getElementById("pic").src = document.getElementById("content").value;
}
function processed_button(){
    document.getElementById("pic").src = document.getElementById("output").value;
}
function pixel_button(){
    pixel_function_all_s();
}

// drag and drop
function handleDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy';
    }
var dropZone = document.querySelector('#content');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

var fileInput = document.querySelector('#fileInput_content');
fileInput.addEventListener('change', handleFileSelect, false);

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var new_id = "";
    var old_id = String(event.target.id);
    if(old_id.includes("fileInput")){
        var file = evt.target.files[0];
        if(old_id.includes("content"))new_id = "content";
    }
    else{
        var file = evt.dataTransfer.files[0];
        new_id = old_id;
    }
    var file_name = file.name;

    if(file_name.includes(".png")||file_name.includes(".jpg")){
        cutImageBase64(file, null, 900, 0.7, new_id);
        // generateBlurPreview(file, -1, -1, 0.2, 2, "preview");
        // pixelateImage(file, 4, "pic");
        // kMeansColorSegmentation(file, 32, 'pic');
    }
    else{
        var reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById(new_id).value = event.target.result;
        };
        reader.readAsText(file);
    }
    clearAllInput();
}
function clearAllInput(){
var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        if(inputs[i].id.includes("file"))inputs[i].value = "";
    }
}

// image
function cutImageBase64(m_this,id,wid,quality, output_id) {
    var file = m_this;
    var URL = window.URL || window.webkitURL;
    var blob = URL.createObjectURL(file);
    var base64;
    var img = new Image();
    img.src = blob;
    img.onload = function() {
        var that = this;
        //size
        var w = that.width,
            h = that.height,
            scale = w / h;
            w = wid || w;
            h = w / scale;
        //generate canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(that, 0, 0, w, h);
        // generate base64
        if(file.name.includes('.jpg'))base64 = canvas.toDataURL('image/jpeg', quality || 0.9);
        else if(file.name.includes('.png'))base64 = canvas.toDataURL('image/png', quality || 0.9);
        document.getElementById("pic").src = base64;
        document.getElementById(output_id).value = base64;
    };
}
function setBase64Image(base64){
    document.getElementById("pic").src=base64;
    document.getElementById("sz").innerHTML = parseInt(base64.length/2014,0) + "kb";
}
function generateBlurPreview(input, width, height, quality, scale, output_id) {
    // quality is 0~1
    // scale 1 means normal, 2 means 1/2 size
    const img = new Image();
    if(typeof input == "string"){
        img.src = base64String;
    }
    else{
        const reader = new FileReader();
        reader.readAsDataURL(input);
        reader.onload = function (event) {
        img.src = event.target.result;
        };
    }

    img.onload = function () {
        if (width==-1 && height == -1){
            const canvas = document.createElement('canvas');
            canvas.width = img.width/scale;
            canvas.height = img.height/scale;
            const ctx = canvas.getContext('2d');
            ctx.filter = 'blur(5px)';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // return the preview as a base64 string
            const preview = canvas.toDataURL('image/jpeg', quality);
            document.getElementById(output_id).src = preview;
        }
        else{
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.filter = 'blur(5px)';
            ctx.drawImage(img, 0, 0, width, height);
            // return the preview as a base64 string
            const preview = canvas.toDataURL('image/jpeg', quality);
            document.getElementById(output_id).src = preview;
        }
    };
};

// pixel
function pixelateImage(input, pixelSize, outputId) {
    const img = new Image();
    if(typeof input == "string"){
        if(input == "content"||input == "output"){
            img.src = document.getElementById(input).value;
        }
        else if(input == "pic")img.src = document.getElementById(input).src;
        else img.src = base64String;
    }
    else{
        const reader = new FileReader();
        reader.readAsDataURL(input);
        reader.onload = function(event) {
        img.src = event.target.result;
        };
    }
    img.onload = function() {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Calculate the number of pixels in each row and column
      const numPixelsX = Math.ceil(canvas.width / pixelSize);
      const numPixelsY = Math.ceil(canvas.height / pixelSize);

      // Create a new canvas to draw the pixelated image
      const pixelCanvas = document.createElement("canvas");
      pixelCanvas.width = numPixelsX;
      pixelCanvas.height = numPixelsY;
      const pixelCtx = pixelCanvas.getContext("2d");

      // Iterate through each pixel and draw the corresponding section of the original image
      for (let y = 0; y < numPixelsY; y++) {
        for (let x = 0; x < numPixelsX; x++) {
          const sx = x * pixelSize;
          const sy = y * pixelSize;
          const sw = pixelSize;
          const sh = pixelSize;
          const dx = x;
          const dy = y;
          const dw = 1;
          const dh = 1;
          pixelCtx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        }
      }

        // Create a new canvas to draw the final pixelated image with original size
        const pixelatedCanvas = document.createElement("canvas");
        pixelatedCanvas.width = img.width;
        pixelatedCanvas.height = img.height;
        const finalCtx = pixelatedCanvas.getContext("2d");

        // Scale up the pixelated image to the original size
        finalCtx.imageSmoothingEnabled = false;
        finalCtx.drawImage(pixelCanvas, 0, 0, img.width, img.height);

        // Convert the pixelated image to a Base64 encoded string and display it
        const pixelatedImg = new Image();
        pixelatedImg.src = pixelatedCanvas.toDataURL("image/png");
        document.getElementById(outputId).src = pixelatedImg.src;
        document.getElementById("output").value = pixelatedImg.src;
    };
};


// kmeans
function kMeansColorSegmentation(input, k, output_id) {
    // load image
    var img = new Image();
    if(typeof input == "string"){
        if(input == "content"||input == "output"){
            img.src = document.getElementById(input).value;
        }
        else if(input == "pic")img.src = document.getElementById(input).src;
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

