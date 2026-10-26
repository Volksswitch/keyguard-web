// How-to video 1.5: checking a design against a screenshot of the AAC app.
import { all, view, openSection, setParam, row, closeSections } from '../helpers.mjs';

export default {
  id: '1.5-check-screenshot',
  trouble: [
    "If no screenshot appears, check that the picture is in the project folder, as a PNG or " +
    "JPEG file, and that include screenshot is yes.",
    "If the screenshot is the wrong size for the keyguard, it was taken on a different tablet, " +
    "or in the other orientation.",
  ],
  steps: [
    { before: all(openSection('Special Actions and Settings'), setParam('include_screenshot', 'no'), view('top')),
      say: "Before you print a keyguard, check it against a screenshot of the AAC app, taken on " +
           "the tablet itself." },
    { highlight: '#project-folder-label',
      page: "Put the screenshot in the project folder, as a PNG or JPEG file.",
      say: "Put the screenshot in the project folder, as a P N G or JPEG file. The app finds it " +
           "on its own." },
    { before: setParam('include_screenshot', 'yes'), highlight: row('include_screenshot'),
      page: "In Special Actions and Settings, set include screenshot to yes.",
      say: "Then, in Special Actions and Settings, set include screenshot to yes." },
    { before: all(closeSections(), view('top')), highlight: '#viewport',
      page: "Click the Top view button. Each opening should sit over its button.",
      say: "The screenshot appears under the keyguard. Click the Top view button to look straight " +
           "down. Each opening should sit over its button." },
    { before: all(openSection('Grid Info'), setParam('number_of_rows', 5), view('top')), highlight: '#viewport',
      page: "If the openings drift from the buttons, check the rows and columns, the bar heights and the case opening.",
      say: "When something's off, it shows. With five rows instead of six, the openings drift away " +
           "from the buttons. Check the rows and columns, the bar heights, and the case opening." },
    { before: all(setParam('number_of_rows', 6), view('top')), highlight: '#viewport',
      say: "Put the right number back, and they line up again." },
    { say: "When every opening lines up, the design is ready to export. {next}" },
  ],
};
