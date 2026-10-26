// How-to video 3.5: sloped edges and the app's bars.
import { all, view, openSection, setParam, row, skill } from '../helpers.mjs';

export default {
  id: '3.5-slopes-bars',
  trouble: [
    "If cell edge slope isn't in the list, set the skill level to Advanced.",
  ],
  steps: [
    { before: all(openSection('Bar Info'), view('top')), highlight: '.section[data-section="Bar Info"]',
      page: "In Bar Info, choose which of the app's bars get an opening.",
      say: "Most AAC apps have bars across the screen: a status bar, a message bar, command bars. In " +
           "Bar Info, choose which of them get an opening." },
    { highlight: row('expose_upper_message_bar'),
      say: "The message bar usually gets one, so it can be tapped to speak the message." },
    { before: all(setParam('bar_edge_slope', 90), view('fit')), highlight: row('bar_edge_slope'),
      page: "Bar edge slope tilts the sides of a bar's opening. 90 is straight down.",
      say: "Bar edge slope tilts the sides of a bar's opening. At 90, they go straight down." },
    { before: all(setParam('bar_edge_slope', 30), view('fit')), highlight: '#viewport',
      say: "A smaller angle slopes them, so a finger slides in more easily. This design uses 30." },
    { before: all(skill('advanced'), openSection('Grid Special Settings'), setParam('cell_edge_slope', 60), view('fit')),
      highlight: row('cell_edge_slope'),
      page: "At the Advanced skill level, cell edge slope does the same for every cell.",
      say: "At the Advanced skill level, cell edge slope does the same for every cell. Sloped sides " +
           "guide the finger toward the middle of the button." },
    { highlight: '#viewport',
      say: "Cell top edge slope and cell bottom edge slope set the top and bottom sides on their own. {next}" },
  ],
};
