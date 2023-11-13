let video = document.getElementById("movie");
let numOfImages = 6;
let currentSectionNumber = null; // Store the current sectionNumber
let handIsOpen = true; // Track the state of the hand (initially open)

function draw(predictions) {
  let polli = document.getElementById("image");
  let widthCanvas = document.getElementById("canvas").width;
  let heightCanvas = document.getElementById("canvas").height;
  let widthWindow = window.innerWidth;
  let heightWindow = window.innerHeight;

  // img
  let img = document.querySelector("#img");

  if (predictions.length > 0) {
    let open = predictions.filter((item) => item.label === "open");
    let close = predictions.filter((item) => item.label === "closed");

    if (open.length >= 1) {
      let xClose = open[0].bbox[0];
      let yClose = open[0].bbox[1];

      const centerX = widthCanvas / 2;

      // Function to update the filter values based on mouseX and mouseY positions
      function updateFilterValues(xClose, yClose) {
        const maxBlur = 10; // Maximum blur value
        const maxDistanceX = centerX; // Maximum distance from the center (X)
        const distanceX = Math.abs(xClose - centerX);
        const maxDistanceXBlur = centerX;
        const blur = (distanceX / maxDistanceXBlur) * maxBlur;

        // Adjust the range of brightness values based on your canvas or video height
        const maxBrightness = 100; // Maximum brightness
        const minDistanceY = 0; // Minimum distance from the top (adjust if necessary)
        const maxDistanceY = heightCanvas; // Maximum distance from the top (adjust if necessary)

        // Calculate brightness based on hand position
        const brightness = 100 - mapRange(yClose, minDistanceY, maxDistanceY, 0, maxBrightness);

        console.log(brightness);
        console.log(blur);
        image.style.filter = `blur(${blur}px) brightness(${brightness}%)`;
      }
      updateFilterValues(xClose, yClose);

      if (!handIsOpen) {
        handIsOpen = true; // Hand state is now open
      }
    }

    if (close.length >= 1 && handIsOpen) {
      takeScreenshot(); // Call the function to take a screenshot
      handIsOpen = false; // Hand state is now closed
    }
  }
}

// Function to take a screenshot using html2canvas
function takeScreenshot() {
  html2canvas(document.body).then(function (canvas) {
    // Convert the canvas to a data URL
    const dataURL = canvas.toDataURL("image/png");

    // Create a link to download the screenshot as a PNG file
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "screenshot.png";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}

// Function to map a value from one range to another
function mapRange(value, a, b, c, d) {
  value = (value - a) / (b - a);
  return c + value * (d - c);
}
