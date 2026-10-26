// How-to video 1.3: a tour of the screen, on the sample project.
import { view, around } from '../helpers.mjs';

export default {
  id: '1.3-screen-tour',
  steps: [
    { before: view('fit'),
      say: "Here's the Keyguard Designer, with a project open." },
    { highlight: '#viewport',
      page: "The 3D view shows the keyguard. Drag to turn it, scroll to zoom, and right-drag to slide it.",
      say: "The big area is the 3D view. It shows the keyguard, and redraws it about half a second " +
           "after you change a setting. Drag to turn it, scroll to zoom, and right-drag to slide it." },
    { highlight: '#viewport-toolbar',
      page: "The toolbar runs along the bottom of the 3D view.",
      say: "The toolbar runs along the bottom of the view." },
    { ringBox: around('#view-fit', '#view-right'),
      say: "View All fits the whole keyguard in the view. The cube buttons look at it from the " +
           "top, the bottom, and each side." },
    { ringBox: around('#view-axes', '#view-grid'),
      say: "These show the directions, and a grid the size of your printer's build plate." },
    { highlight: '#openings-btn',
      say: "This one opens Custom Openings, for openings the grid can't make." },
    { ringBox: around('#export-stl', '#export-png'),
      page: "These buttons save the design as a file: STL for a 3D printer, SVG for a laser cutter.",
      say: "These save the design as a file: S T L for a 3D printer, and S V G for a laser cutter. " +
           "P N G saves a picture of the view." },
    { ringBox: around('#undo-btn', '#redo-btn'),
      say: "Undo and Redo take back a change to the settings, or put it back." },
    { ringBox: around('#help-btn', '#settings-btn'),
      page: "The question mark opens the Help menu, and the gear opens Settings.",
      say: "The question mark opens the Help menu, and the gear opens Settings." },
    { highlight: '#right',
      page: "The Customizer holds the project, your saved designs, and the settings that make up the keyguard.",
      say: "On the right is the Customizer. At the top are the project and your saved designs. " +
           "Below them are the settings that make up the keyguard, in sections." },
    { highlight: '#console-wrap',
      page: "The Console keeps a record of what the app is doing, and says why when something goes wrong.",
      say: "Under the view is the Console, a running record of what the app is doing. When " +
           "something goes wrong, it usually says why." },
    { say: "That's the whole screen. {next}" },
  ],
};
