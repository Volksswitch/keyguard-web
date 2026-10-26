// How-to video 4.3: when a keyguard update is offered.
// Its project folder holds an older keyguard designer file (Documents/video-samples/update/,
// version 91, from this repository's history), so the app offers the current one.
import { all, click } from '../helpers.mjs';
import { settled } from '../../lib/sample-project.mjs';

export default {
  id: '4.3-update-offered',
  project: { dir: 'Documents/video-samples/update', open: false },
  trouble: [
    "If you're never offered updates, run Check my setup. Your network may be blocking the app's address.",
  ],
  steps: [
    { before: async (page) => { await page.click('#open-project-btn'); await page.waitForSelector('#update-modal', { state: 'visible', timeout: 60000 }); },
      highlight: '#update-modal',
      page: "When a newer keyguard designer file is published, the app offers it as you open a project.",
      say: "When a newer keyguard designer file is published, the app offers it as you open your project." },
    { highlight: '#update-msg',
      say: "It shows the version you have, the new one, and what changed." },
    { highlight: '#update-now',
      page: "Update now replaces the file in your folder, carries your designs forward, and reopens the project.",
      say: "Update now downloads the new file, replaces the old one in your folder, carries your " +
           "designs forward, and opens the project again." },
    { highlight: '#update-snooze',
      page: "Remind me in a week keeps your file and asks again in a week. Skip keeps it for now.",
      say: "Remind me in a week keeps your file, and asks again in a week. Skip keeps it for now." },
    { before: async (page) => {
        await page.click('#update-now');
        await page.waitForFunction(() => /keyguard_v92/.test(document.getElementById('project-folder-label')?.textContent || ''), null, { timeout: 90000 });
        await settled(page, 3000);
      },
      highlight: '#project-folder-label',
      page: "After the update, the project shows the new version. Your designs are unchanged.",
      say: "After the update, the project shows the new version, and your designs come through unchanged. {next}" },
  ],
};
