import React, { useState, useEffect } from 'react';
import 'milligram';

import { ch_join, ch_push,
         ch_login, ch_reset } from './socket';

function GameOver(props) {
  //let reset = props['reset'];
  let {reset} = props;

  // On GameOver screen,
  // set page title to "Game Over!"

  return (
    <div className="row">
      <div className="column">
        <h1>Game Over!</h1>
        <p>
          <button onClick={reset}>
            Reset
          </button>
        </p>
      </div>
    </div>
  );
}

function Controls({guess, reset}) {
  // WARNING: State in a nested component requires
  // careful thought.
  // If this component is ever unmounted (not shown
  // in a render), the state will be lost.
  // The default choice should be to put all state
  // in your root component.
  const [text, setText] = useState("");

  function updateText(ev) {
    let vv = ev.target.value;
//    let cc = vv[vv.length - 1];
    setText(vv);
  }

  function keyPress(ev) {
    if (ev.key == "Enter") {
      guess(text);
    }
  }

  return (
    <div className="row">
      <div className="column">
        <p>
          <input type="text"
                 value={text}
                 onChange={updateText}
                 onKeyPress={keyPress} />
        </p>
      </div>
      <div className="column">
        <p>
          <button onClick={() => guess(text)}>Guess</button>
        </p>
      </div>
      <div className="column">
        <p>
          <button onClick={reset}>
            Reset
          </button>
        </p>
      </div>
    </div>
  );
}

function reset() {
  console.log("Time to reset");
  ch_reset();
}

function Play({state}) {
  let {word, guesses, name} = state;
  let bullsCows = calcBullsCows(word, guesses);
  // let bullsCows = calcBullsCows("1234", "5324");

  // returns an array of bulls and cows that corresponds to the recorded guesses
  function calcBullsCows(word, guesses) {
    let answ = word.split("").slice(0, 4);
    let bullsCows = [];
    for (let i = 0; i < guesses.length; i++) {
      let guess = guesses[i].split("").slice(0, 4);
      bullsCows[i] = calcBullsCowsHelper(answ, guess);
    }
    return bullsCows;
  }

  // returns a string representing the number of bulls and cows in a given guess
  function calcBullsCowsHelper(a, g) {
    // calculating bulls
    let bulls = 0;
    for (let i = 0; i < 4; i++) {
      if (a[i] === g[i]) {
        bulls++;
      }
    }
    // calculating cows
    let cows = 0;
    for (let i = 0; i < 4; i++) {
      if (a.includes(g[i])) {
        cows++;
      }
    }
    cows = cows - bulls;
    return "" + bulls + "B" + cows + "C";
  }

  // checks that guess is composed of only numbers
  function onlyNumbers(text) {
    let arr = text.split("").slice(0, 4);
    let noLetters = true;
    for (let i = 0; i < arr.length; i++) {
      if (!(arr[i] <= '9' && arr[i] >= '0')) {
        noLetters = false;
      }
    }
    return noLetters;
  }

  // displays given warning in a popup
  function displayWarning(warning) {
    window.alert(warning);
  }

  function reload() {
    window.location.reload();
  }

  function guess(text) {
    // Inner function isn't a render function

    // checking that input is valid
    if (text.length !== 4) {
      displayWarning("Guess must 4 numbers long.");
    } else if ((text.charAt(0) === text.charAt(1))
            || (text.charAt(0) === text.charAt(2))
            || (text.charAt(0) === text.charAt(3))
            || (text.charAt(1) === text.charAt(2))
            || (text.charAt(1) === text.charAt(3))
            || (text.charAt(2) === text.charAt(3))) {
      displayWarning("Cannot have duplicates in your guess.")
    } else if (!(onlyNumbers(text))) {
      displayWarning("Guess must only contain numbers.")
    } else if (text.charAt(0) === '0') {
      displayWarning("Guess cannot start with 0.")
    } else { // input is valid!
      ch_push({letter: text});
    }
  }

  let view = word.split('');
  let bads = [];

  // FIXME: Correct guesses shouldn't count.
  let lives = 8 - guesses.length;

  // if the user has won the game...
  if (bullsCows[bullsCows.length - 1] === "4B0C") {
    return (
      <div className="App">
        <h1>You Win!</h1>
        <p>
          <button onClick={() => reload()}>Reset</button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="row">
        <div className="column">
          <p>Word: {view.join(' ')}</p>
        </div>
        <div className="column">
          <p>Name: {name}</p>
        </div>
      </div>
      <div className="row">
        <div className="column">

            <table className="GuessTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Guess</th>
                  <th>B & C</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>{guesses[0]}</td>
                  <td>{bullsCows[0]}</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>{guesses[1]}</td>
                  <td>{bullsCows[1]}</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>{guesses[2]}</td>
                  <td>{bullsCows[2]}</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>{guesses[3]}</td>
                  <td>{bullsCows[3]}</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>{guesses[4]}</td>
                  <td>{bullsCows[4]}</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>{guesses[5]}</td>
                  <td>{bullsCows[5]}</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>{guesses[6]}</td>
                  <td>{bullsCows[6]}</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>{guesses[7]}</td>
                  <td>{bullsCows[7]}</td>
                </tr>
              </tbody>
            </table>
        </div>
        <div className="column">
          <p>Lives: {lives}</p>
        </div>
      </div>
      <Controls reset={reset} guess={guess} />
    </div>
  );
}

function Login() {
  const [name, setName] = useState("");

  return (
    <div className="row">
      <div className="column">
        <input type="text"
               value={name}
               onChange={(ev) => setName(ev.target.value)} />
      </div>
      <div className="column">
        <button onClick={() => ch_login(name)}>
          Login
        </button>
      </div>
    </div>
  );
}

function Hangman() {
  // render function,
  // should be pure except setState
  const [state, setState] = useState({
    name: "",
    word: "",
    guesses: [],
  });

  useEffect(() => {
    ch_join(setState);
  });

  let body = null;

  if (state.name === "") {
    body = <Login />;
  }
  // FIXME: Correct guesses shouldn't count.
  else if (state.guesses.length < 8) {
    body = <Play state={state} />;
  }
  else {
    body = <GameOver reset={reset} />;
  }

  return (
    <div className="container">
      {body}
    </div>
  );
}

export default Hangman;
