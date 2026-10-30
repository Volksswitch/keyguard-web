// How-to video 1.2: opening the app and starting a project.
//
// It starts from the app as a first-time visitor sees it. The computer's folder box and the
// browser's question about editing files belong to them, not the page, so they're shown as
// the generic stand-ins in file-dialog.mjs. The empty folder is then handed to the app the
// way sample-project.mjs does, and from there the app does its own work: it offers to set
// the folder up, and opens the project.
import { all, click, folder, ready, around, inDialog } from '../helpers.mjs';

// Documents, as the folder box shows it: a few folders of the clinician's own, and the new
// one she makes for this project.
const FOLDERS = [['Forms', 'folder'], ['keyguard design', 'folder'], ['Photos', 'folder']];
const PICK = { kind: 'folder', path: ['Documents'], items: FOLDERS };

export default {
  id: '1.2-open-and-start',
  project: { none: true },
  trouble: [
    "If nothing happens when you click Open Project, or the app asks you to use Chrome or " +
    "Edge, you're in another browser. Safari and Firefox can't open a project folder.",
    "If the browser asks again for access to the folder, choose Allow, or Allow on every visit.",
  ],
  steps: [
    { page: "Open keyguard.volksswitch.org in Chrome or Edge. There's nothing to install.",
      say: "Open the Keyguard Designer in Chrome or Edge, at keyguard dot volksswitch dot org. " +
           "There's nothing to install, and no account to make." },
    { say: "You can install it from the browser, too, so it opens in its own window. Look for the " +
           "install icon at the end of the address bar." },
    { highlight: '#open-project-btn',
      say: "Your work lives in a project folder on your computer, one for each project. Click Open Project." },
    { dialog: { ...PICK, items: FOLDERS.filter(([n]) => n !== 'keyguard design') }, highlight: inDialog('newfolder'),
      page: "Click Open Project. In the box that opens, make a new, empty folder with New folder.",
      say: "Your computer's box for choosing a folder opens. It looks a little different on every " +
           "computer. Make a new, empty folder for the project, with New folder, and give it a name " +
           "you'll recognize." },
    { dialog: { ...PICK, selected: 'keyguard design' }, highlight: inDialog('ok'),
      page: "Choose the new folder, and click Select Folder.",
      say: "Choose the new folder, and click Select Folder." },
    { dialog: { kind: 'permission', folder: 'keyguard design' }, highlight: inDialog('always'),
      say: "Then your browser asks whether the app may edit the files in that folder. Allow it. If it " +
           "offers Allow on every visit, choose that, and it won't ask again." },
    { before: all(folder({ empty: true }), click('#open-project-btn')), highlight: '#setup-modal',
      page: "The folder is empty, so the app offers to set it up. Click Set it up.",
      say: "The folder is empty, so the app offers to set it up. It names the folder, so you can " +
           "catch one chosen by mistake. Click Set it up." },
    { before: all(click('#setup-go'), ready({ preset: null, skill: null })), highlight: '#project-folder-label',
      page: "The app adds the keyguard designer file and a file for extra openings, then opens the project.",
      say: "The app adds the keyguard designer file, and a file for extra openings. It never " +
           "replaces anything already in the folder. Then it opens the project." },
    { highlight: '#viewport',
      say: "The keyguard you see is the design default values: a simple grid keyguard to start from." },
    { highlight: '#open-project-btn',
      page: "Next time, the app remembers the folder. Click the same button to open it again.",
      say: "Next time, the app remembers the folder. Click this button to open it again, or to " +
           "switch to another project." },
    { say: "Put the screenshots of the AAC app in this folder too. The app finds them on its own. {next}" },
  ],
};
