// menu steps 
document.addEventListener('DOMContentLoaded', function() {
  let progress = document.querySelector(".progress span");
  let steps = document.querySelectorAll(".step");
  let btnNext = document.querySelector(".btn-next");
  let btnPrev = document.querySelector(".btn-prev");
  let countSteps = steps.length;
  let step = 1;

  btnNext.addEventListener("click", () => {
      let widthProgress = (step / (countSteps - 1)) * 100;
      btnPrev.classList.remove("disabled");
      btnPrev.removeAttribute("disabled");
      if (step + 1 <= countSteps) {
          step++;
          let newStep = document.querySelector(`[data-step="${step}"]`);
          progress.style.width = `${widthProgress}%`;
          newStep.classList.add("active");

          if (step === countSteps) {
              document.querySelector('.main_menu_content').style.display = 'none';
              document.querySelector('#second_menu_overview').style.display = 'block';
              btnNext.classList.add("disabled");
              btnNext.setAttribute("disabled", "disabled");
          }
      }
  });

  btnPrev.addEventListener("click", () => {
      btnNext.classList.remove("disabled");
      btnNext.removeAttribute("disabled");
      if (step > 1) {
          let newStep = document.querySelector(`[data-step="${step}"]`);
          newStep.classList.remove("active");
          step--;
          let widthProgress = ((step - 1) / (countSteps - 1)) * 100;
          progress.style.width = `${widthProgress}%`;

          if (step < countSteps) {
              document.querySelector('.main_menu_content').style.display = 'flex';
              document.querySelector('#second_menu_overview').style.display = 'none';
          }
      }
      if (step === 1) {
          btnPrev.classList.add("disabled");
          btnPrev.setAttribute("disabled", "disabled");
      }
  });
});


//generator functionality:
document.addEventListener('DOMContentLoaded', function() {
  
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const warningMessageElement = document.getElementById('warningMessage');
  const padding = 30;
  const tileDimension = 0.4;
  const maxDimension = 25;

  function drawArrow(context, fromx, fromy, tox, toy) {
    var headlen = 15; // Länge des Pfeilkopfes
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
  }

  function drawMeasurements(context, width, height, pixelsPerMeter) {
    // Zeichnen der Maße für Breite
    context.fillStyle = '#FFFFFF';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = '16px sans-serif';
    
    // Berechnung der Position für die Breitenbeschriftung
    const widthTextPositionX = canvas.width / 2;
    const widthTextPositionY = canvas.height - 30; // 30 Pixel Abstand vom unteren Rand
  
    // Zeichnen des Textes für die Breite
    context.fillText(width + ' m', widthTextPositionX, widthTextPositionY);
  
    // Zeichnen der Maße für Tiefe
    context.save();
    const heightTextPositionX = 30; // 30 Pixel Abstand vom linken Rand
    const heightTextPositionY = canvas.height / 2;
    
    context.translate(heightTextPositionX, heightTextPositionY);
    context.rotate(-Math.PI / 2);
    context.fillText(height + ' m', 0, 0);
    context.restore();
  }

  function showArea(width, depth) {
    const area = width * depth; // Flächeninhalt berechnen
    document.getElementById('flaeche').textContent = `Fläche: ${area} m²`;
  }
  
  document.getElementById('generateTiles').addEventListener('click', () => {
    const breite = parseFloat(document.getElementById('breite').value);
    const tiefe = parseFloat(document.getElementById('tiefe').value);

    if (breite > maxDimension || tiefe > maxDimension) {
      warningMessageElement.textContent = "Unser Konfigurator lässt nur Größen bis 25m zu. Gerne planen wir mit Ihnen auch größere Flächen, nehmen Sie hierfür gerne Kontakt mit uns auf.";
      return;
    } else {
      warningMessageElement.textContent = "";
      showArea(breite, tiefe); // Flächeninhalt anzeigen
    }

    const numTilesWideVisible = breite / tileDimension;
    const numTilesHighVisible = tiefe / tileDimension;
    const numTilesWide = Math.ceil(numTilesWideVisible);
    const numTilesHigh = Math.ceil(numTilesHighVisible);

    const pixelsPerMeter = 700 * tileDimension / Math.max(breite, tiefe);
    canvas.width = Math.floor(numTilesWideVisible * pixelsPerMeter) + (2 * padding);
    canvas.height = Math.floor(numTilesHighVisible * pixelsPerMeter) + (2 * padding);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // SVG-Bild laden
    const img = new Image();
    img.onload = function() {
      for (let x = 0; x < numTilesWide; x++) {
        for (let y = 0; y < numTilesHigh; y++) {
          ctx.drawImage(img, x * pixelsPerMeter + 60, y * pixelsPerMeter + 60, pixelsPerMeter, pixelsPerMeter);
        }
      }
      // Pfeile für Breite und Tiefe hinzufügen
      ctx.beginPath();
      drawArrow(ctx, 20, canvas.height - 40 - 20, canvas.width - 20, canvas.height - 40 - 20); // unten horizontal
      drawArrow(ctx, canvas.width - 20, canvas.height - 40 - 20, 20, canvas.height - 40 - 20); // unten horizontal
      drawArrow(ctx, 20, 20 + 40, 20, canvas.height - 40 - 20); // links vertikal
      drawArrow(ctx, 20, canvas.height - 40 - 20, 20, 20 + 40); // links vertikal
      ctx.stroke();
      
      // Maße hinzufügen
      drawMeasurements(ctx, breite, tiefe, pixelsPerMeter);

    };
    img.src = 'data:image/svg+xml;base64,PHN2ZyBpZD0iRWJlbmVfMSIgZGF0YS1uYW1lPSJFYmVuZSAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyODMiIGhlaWdodD0iMjgzIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmlld0JveD0iMCAwIDI4My40NiAyODMuNDYiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDpub25lO30uY2xzLTJ7Y2xpcC1wYXRoOnVybCgjY2xpcC1wYXRoKTt9LmNscy0ze2ZpbGw6IzVjNWQ1YTt9LmNscy00e2ZpbGw6Izc0NzU3Mjt9LmNscy01e2ZpbGw6IzkwOTE4ZTt9PC9zdHlsZT48Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1NSAtMjc5Ljg5KSI+PHBvbHlnb24gY2xhc3M9ImNscy0xIiBwb2ludHM9IjE1NSAyNzkuODkgMTU1IDU2My4zNSA0MzguNDYgNTYzLjM1IDQzOC40NiAyNzkuODkgMTU1IDI3OS44OSAxNTUgMjc5Ljg5Ii8+PC9jbGlwUGF0aD48L2RlZnM+PGcgY2xhc3M9ImNscy0yIj48cG9seWdvbiBjbGFzcz0iY2xzLTMiIHBvaW50cz0iMjgzLjQ2IDI4My40NiAwIDI4My40NiAwIDAgMjgzLjQ2IDAgMjgzLjQ2IDI4My40NiAyODMuNDYgMjgzLjQ2Ii8+PHBhdGggY2xhc3M9ImNscy00IiBkPSJNNDM4LjQ2LDQyMS42MnYtNUwzMDEuNzQsMjc5Ljg5aC01djE1bDEyNi43LDEyNi43Wk0zMTUuODgsMjc5Ljg5LDQzOC40Niw0MDIuNDd2LTIwTDMzNS45MiwyNzkuODlabTM0LjE4LDAsODguNCw4OC40di0yMEwzNzAuMSwyNzkuODlabTM0LjE4LDAsNTQuMjIsNTQuMjJ2LTIwbC0zNC4xOC0zNC4xOFptMzQuMTgsMCwyMCwyMHYtMjBaTTI5Ni43Myw0MTEuNmwtMTAsMTAsMTAsMTAsMTAtMTAtMTAtMTBabTAsMzQuMTgtMjQuMTYtMjQuMTZoLTIwbDQ0LjIsNDQuMnYtMjBabTAsMzQuMTgtNTguMzQtNTguMzRoLTIwTDI5Ni43Myw1MDBWNDgwWm0wLDM0LjE4LTkyLjUyLTkyLjUyaC0yMEwyOTYuNzMsNTM0LjE4di0yMFptMCwzNC4xOEwxNzAsNDIxLjYySDE1NXY1TDI5MS43Miw1NjMuMzVoNXYtMTVabS0xOS4xNSwxNUwxNTUsNDQwLjc3djIwTDI1Ny41NCw1NjMuMzVabS0zNC4xNywwTDE1NSw0NzV2MjBsNjguMzYsNjguMzZabS0zNC4xOCwwTDE1NSw1MDkuMTN2MjBsMzQuMTgsMzQuMThabS0zNC4xOSwwLTIwLTIwdjIwWk0yOTYuNzMsMzk3LjQ2bDI0LjE2LDI0LjE2aDIwLjA1bC00NC4yMS00NC4ydjIwWm0wLTM0LjE4LDU4LjM0LDU4LjM0aDIwLjA1bC03OC4zOS03OC4zOHYyMFptMC0zNC4xOCw5Mi41Miw5Mi41Mkg0MDkuM0wyOTYuNzMsMzA5LjA2djIwWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1NSAtMjc5Ljg5KSIvPjxwYXRoIGNsYXNzPSJjbHMtNSIgZD0iTTQzOC40Niw1NjMuMzV2LTIwbC0yMCwyMFptLTM0LjE3LDAsMzQuMTctMzQuMTh2LTIwbC01NC4yMiw1NC4yMlptLTM0LjE5LDBMNDM4LjQ2LDQ5NVY0NzVsLTg4LjQsODguNFptLTM0LjE4LDBMNDM4LjQ2LDQ2MC44MXYtMjBMMzE1Ljg4LDU2My4zNVptLTM0LjE4LDBMNDM4LjQ2LDQyNi42M3YtNWgtMTVsLTEyNi43LDEyNi43djE1Wm0tNS0yOS4xN0w0MDkuMjksNDIxLjYyaC0yMGwtOTIuNTIsOTIuNTJ2MjBabTAtMzQuMTgsNzguMzgtNzguMzhoLTIwTDI5Ni43Myw0ODB2MjBabTAtMzQuMTgsNDQuMjEtNDQuMkgzMjAuODlsLTI0LjE2LDI0LjE2djIwWm0tMjQuMTYtNDQuMiwyNC4xNi0yNC4xNnYtMjBsLTQ0LjIsNDQuMlptLTM0LjE4LDAsNTguMzQtNTguMzR2LTIwbC03OC4zOCw3OC4zOFptLTM0LjE4LDAsOTIuNTItOTIuNTJ2LTIwTDE4NC4xNyw0MjEuNjJabS0zNC4xOCwwLDEyNi43LTEyNi43di0xNWgtNUwxNTUsNDE2LjYxdjVabS0xNS0xOS4xNUwyNzcuNTgsMjc5Ljg5aC0yMEwxNTUsMzgyLjQzdjIwWm0wLTM0LjE4LDg4LjQtODguNGgtMjBMMTU1LDM0OC4yNXYyMFptMC0zNC4xOCw1NC4yMy01NC4yMmgtMjBMMTU1LDMxNC4wN3YyMFptMC0zNC4xOCwyMC4wNS0yMEgxNTV2MjBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTU1IC0yNzkuODkpIi8+PC9nPjwvc3ZnPg=='; //Base 64
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Funktion zum Ersetzen von Kommas durch Punkte
  function replaceCommaWithDot(event) {
    // Überprüfen, ob die Eingabe ein Komma enthält
    if (event.target.value.includes(',')) {
      const input = event.target;
      input.value = input.value.replace(/,/g, '.');
    }
  }

  // EventListener für beide Inputfelder hinzufügen
  document.getElementById('breite').addEventListener('input', replaceCommaWithDot);
  document.getElementById('tiefe').addEventListener('input', replaceCommaWithDot);
});




