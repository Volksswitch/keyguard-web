// How-to video 6.3: getting IT on board. It runs against the live address, so Check my setup
// shows what a clinician's browser reports: keyguard.volksswitch.org and the released app.
// The letter is a picture of the IT Request Letter's first page (Documents/video-pictures/it-letter.png).
import { all, click, sleep } from '../helpers.mjs';

export default {
  id: '6.3-it-on-board',
  base: 'live',
  project: { skill: null },
  trouble: [
    "If the app won't open at all on a school computer, ask IT to allow keyguard.volksswitch.org, " +
    "and give them the letter.",
  ],
  steps: [
    { before: click('#help-btn'), highlight: '#help-menu [data-help="check"]',
      page: "Click the question mark, then Check my setup.",
      say: "On a school or hospital computer, the app may need help from your IT department. Check my " +
           "setup shows what's missing. Click the question mark, then Check my setup." },
    { before: all(click('#help-menu [data-help="check"]'), async () => sleep(9000)), highlight: '#ts-checks',
      page: "It checks the browser, the folder, the app's address, the keyguard file and the 3D drawing.",
      say: "It checks the browser, the project folder, the app's address, the keyguard file and the 3D " +
           "drawing. Anything wrong comes with what to do, including what to ask IT for." },
    { highlight: '#ts-checks',
      say: "Usually, IT only needs to allow one web address: keyguard dot volksswitch dot org." },
    { image: 'Documents/video-pictures/it-letter.png', ring: [0, 0, 1700, 2200],
      page: "Forward IT the one-page letter, with your Check my setup results pasted in.",
      say: "Volksswitch has a one-page letter you can forward to IT, with a box for these results. A " +
           "security overview for IT reviewers goes with it. {next}" },
  ],
};
