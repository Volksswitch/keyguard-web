// How-to video 4.2: sharing a design. The buttons open the computer's own file boxes, shown
// as the generic stand-ins in file-dialog.mjs: Save As for the design's own file, with the
// name the app suggests, and Open in the colleague's folder. An Open box shows only the
// kind of file it asks for, so that folder shows its own presets file and the one sent.
import { all, view, closeSections, inDialog } from '../helpers.mjs';

const THEIRS = [['keyguard.json', 'JSON file'], ['WordPower 42.json', 'JSON file']];

export default {
  id: '4.2-sharing',
  trouble: [
    "Many designs are named after students. Check the name before you share a file outside your team.",
  ],
  steps: [
    { before: all(closeSections(), view('fit')), highlight: '#preset-input',
      say: "To send a design to a colleague or a maker, first choose it in the preset box." },
    { highlight: '#export-preset-btn',
      page: "This button saves the chosen design as a file of its own.",
      say: "Then click this button. It saves the design as a file of its own." },
    { dialog: { kind: 'save', name: 'WordPower 42.json', type: 'JSON file (*.json)', faded: true },
      highlight: inDialog('name'),
      say: "Your computer's Save As box opens, in your project folder, with the design's name filled in. " +
           "It looks a little different on every computer. Click Save." },
    { highlight: '#project-folder-label',
      page: "Send it with the screenshot, and the openings file if the design uses it.",
      say: "Send that file with the screenshot, and with the openings and additions file if the design uses it." },
    { highlight: '#import-preset-btn',
      page: "They add it to their own project with this button.",
      say: "They put the files in a project folder of their own, and add your design to their presets " +
           "with this button." },
    { dialog: { kind: 'open', path: ['Documents', 'shared keyguard'], items: THEIRS, selected: 'WordPower 42.json',
        type: 'JSON preset file (*.json)' }, highlight: inDialog('selected'),
      page: "In the Open box, they choose your file and click Open.",
      say: "In the Open box, they choose the file you sent, and click Open." },
    { highlight: '#open-json-btn',
      say: "This one opens a different file of presets instead. Saving then updates that file." },
    { highlight: '#export-stl',
      page: "If they only need to print it, send the STL file instead.",
      say: "If they only need to print it, send the S T L file instead." },
    { say: "Many designs are named after students, so check the name before you share it outside your team. {next}" },
  ],
};
