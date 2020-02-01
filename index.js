const BUTTON_MAPPINGS = {
  '57e-2009-Pro Controller': {
    '0': { name: 'B', id: 'b-button', colour: 'red' },
    '1': { name: 'A', id: 'a-button', colour: 'red' },
    '2': { name: 'Y', id: 'y-button', colour: 'red' },
    '3': { name: 'X', id: 'x-button', colour: 'red' },
    '4': { name: 'L', id: 'bumper', colour: 'orange' },
    '5': { name: 'R', id: 'bumper', colour: 'orange' },
    '6': { name: 'ZL', id: 'bumper', colour: 'orange' },
    '7': { name: 'ZR', id: 'bumper', colour: 'orange' },
    '8': { name: '-', id: 'minus-button', colour: 'pink' },
    '9': { name: '+', id: 'plus-button', colour: 'pink' },
    '10': { name: 'LS', id: 'ls-button', colour: 'grey' },
    '11': { name: 'RS', id: 'rs-button', colour: 'grey' },
    '12': { name: '🏚', id: 'home-button', colour: 'pink' },
    '13': { name: '📷', id: 'screenshot-button', colour: 'pink' }
  }
};

let gamepad;
let interval;
let axesInterval;
let previousAxes;

function gamepadHandler(event, connecting) {
  let text;
  if (connecting) {
    gamepad = event.gamepad;
    text = `Gamepad connected: ${gamepad.id}`;
  } else {
    text = gamepad.id ? `Gamepad disconnected: ${gamepad.id}` : 'Please connect a gamepad and press a button to start!';
    delete gamepad;
  }
  document.getElementById('gamepad-state').innerHTML = text;
}

function pollGamepad() {
  if (gamepad) {
    const buttons = BUTTON_MAPPINGS[gamepad.id];

    const pressed = gamepad.buttons.map((button, index) => {
      if (button.pressed) {
        return buttons[`${index}`];
      }
    }).filter(n => n);

    const notPressed = gamepad.buttons.map((button, index) => {
      if (!button.pressed) {
        return buttons[`${index}`];
      }
    }).filter(n => n);

    notPressed.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) element.style = 'fill: black;';
    });

    pressed.forEach(({ id, colour }) => {
      const element = document.getElementById(id);
      if (element) element.style = `fill: ${colour};`;
    });

    // Handle button presses
    if (pressed.length > 0) {
      document.getElementById('button-state').innerHTML = `
        <div>
          ${
            pressed.map(({ name, colour }) => {
              return `
                <div
                  style='
                    background-color: ${colour};
                    color: white;
                    border-radius: 50%;
                    padding: 15px;
                    width: 30px;
                    height: 30px;
                    text-align: center;
                    border: 2px solid black;
                    display: inline-block;
                    margin: 10px;
                  '
                >
                  ${name}
                </div>
              `
            }).join('')
          }
        </div>
      `;
    } else {
      document.getElementById('button-state').innerHTML = '';
    }
  }
}

window.addEventListener('gamepadconnected', (e) => gamepadHandler(e, true));
window.addEventListener('gamepaddisconnected', (e) => gamepadHandler(e, false));

interval = setInterval(pollGamepad, 100);
