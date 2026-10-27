// How-to video 6.2: telling us about a problem. The email and save buttons hand off to the
// clinician's own email and the browser's Save box, so the video points at them only.
import { all, click, sleep } from '../helpers.mjs';

const write = (text) => async (page) => {
  await page.fill('#ts-what', text);
  await page.locator('#ts-what').dispatchEvent('input');
  await sleep(600);
};

export default {
  id: '6.2-report-problem',
  // The live address, so the report shows the released app and its address, and the
  // default skill level.
  base: 'live',
  project: { skill: null },
  trouble: [
    "If Email report doesn't open a message, click Copy report and paste the report into an email to ken@volksswitch.org.",
  ],
  steps: [
    { before: click('#help-btn'), highlight: '#help-menu [data-help="report"]',
      page: "Click the question mark, then Report a problem.",
      say: "If something goes wrong that isn't on the known issues page, tell us. Click the question " +
           "mark, then Report a problem." },
    { before: all(click('#help-menu [data-help="report"]'), write("The keyguard didn't change after I set the rows to 6.")),
      highlight: '#ts-what',
      page: "Write a line about what happened.",
      say: "Write a line about what happened, in your own words." },
    { highlight: '#ts-report',
      page: "The app adds what we need, and shows the whole report so you can read it first.",
      say: "The app adds what we need to see the problem: the app's release, your keyguard file's " +
           "version, your browser, and the design's settings. The whole report is shown, so you can " +
           "read it first." },
    { highlight: '#ts-report',
      say: "It leaves out folder, file and design names, and any words engraved on the keyguard become X's." },
    { highlight: '#ts-email',
      page: "Email report opens a message to Volksswitch in your own email. Copy and Save are there too.",
      say: "Email report copies it, and opens a message to Volksswitch in your own email. Copy report " +
           "and Save report are there too. The app sends nothing itself. {next}" },
  ],
};
