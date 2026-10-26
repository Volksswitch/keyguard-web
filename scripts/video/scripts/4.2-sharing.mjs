// How-to video 4.2: sharing a design. The buttons open the browser's own file boxes, which
// can't be photographed, so the video points at each one and says what it does.
import { all, view, closeSections } from '../helpers.mjs';

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
    { highlight: '#project-folder-label',
      page: "Send it with the screenshot, and the openings file if the design uses it.",
      say: "Send that file with the screenshot, and with the openings and additions file if the design uses it." },
    { highlight: '#import-preset-btn',
      page: "They add it to their own project with this button.",
      say: "They put the files in a project folder of their own, and add your design to their presets " +
           "with this button." },
    { highlight: '#open-json-btn',
      say: "This one opens a different file of presets instead. Saving then updates that file." },
    { highlight: '#export-stl',
      page: "If they only need to print it, send the STL file instead.",
      say: "If they only need to print it, send the S T L file instead." },
    { say: "Many designs are named after students, so check the name before you share it outside your team. {next}" },
  ],
};
