// How-to video 3.1: covering and merging cells, on the sample keyguard.
// Cells are numbered from the bottom-left corner, along each row, then up the rows
// (checked in the app: covering 1 and 9 closes "your" and "is").
import { all, view, openSection, setParam, row } from '../helpers.mjs';

export default {
  id: '3.1-cover-merge',
  trouble: [
    "If the wrong cell closes, count again from the bottom-left corner, along the bottom row first.",
    "If these settings aren't in the list, set the skill level to Intermediate.",
  ],
  steps: [
    { before: all(openSection('Grid Special Settings'), view('top')),
      say: "A grid keyguard doesn't have to open every cell. You can cover cells, or join two into " +
           "one opening. Both are in Grid Special Settings." },
    { highlight: row('cover_these_cells'),
      page: "Cells are numbered from the bottom-left corner, along each row, then up the rows.",
      say: "Cells are numbered from the bottom-left corner, along the bottom row, then up the rows." },
    { before: all(setParam('cover_these_cells', '1,9'), view('top')), highlight: '#viewport',
      page: "To cover cells, list their numbers in cover these cells, with commas between them.",
      say: "To cover cells, list their numbers in cover these cells, with commas between them. Here, " +
           "cells 1 and 9 are closed." },
    { highlight: '#viewport',
      page: "Covered cells let a keyguard open up as a student learns more words, with the layout unchanged.",
      say: "Covering cells is how a keyguard can open up as a student learns more words. The layout " +
           "stays the same, and you open cells over time." },
    { before: all(setParam('cover_these_cells', ''), setParam('merge_cells_horizontally_starting_at', '1'), view('top')),
      highlight: '#viewport',
      page: "Merge cells horizontally joins a cell with the one to its right.",
      say: "To join a cell with the one to its right, put its number in merge cells horizontally " +
           "starting at. Cells 1 and 2 become one opening." },
    { before: all(setParam('merge_cells_horizontally_starting_at', ''), setParam('merge_cells_vertically_starting_at', '7'), view('top')),
      highlight: '#viewport',
      page: "Merge cells vertically joins a cell with the one above it.",
      say: "Merge cells vertically joins a cell with the one above it. Here, cell 7 joins cell 14." },
    { say: "Each of these can list several cells, with commas between them. {next}" },
  ],
};
