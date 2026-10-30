// How-to video 2.4: filling in the keyguard data form. The form is the one made in October
// 2026 to match the Customizer (Ken, 30 Oct 2026), Documents/Keyguard Data Form.docx, built
// by scripts/doc-generators/generate-data-form.py. Its pictures, and where each part of it is
// in them, come from scripts/doc-generators/data-form-pictures.py; run that after changing
// the form, and the rings follow. Each step shows one part of a page close up, so it can be
// read, with a ring around it.
import fs from 'node:fs';
import path from 'node:path';
import { all, view, closeSections } from '../helpers.mjs';
import { PROJECT } from '../../lib/sample-project.mjs';

const FORM = JSON.parse(fs.readFileSync(path.join(PROJECT, 'Documents', 'video-pictures', 'data-form-boxes.json'), 'utf8'));
const [PW, PH] = FORM.size;

// A part of the form by its name, or by its question's first words.
function part(name) {
  const p = FORM.parts[name] || Object.entries(FORM.parts).find(([k]) => k.startsWith(name))?.[1];
  if (!p) throw new Error(`STOPPING - the data form has no part called ${name}; run data-form-pictures.py`);
  return p;
}

// A step showing some parts of one page: a ring around them, and the page cropped to them,
// always the page's full width (a small part zoomed further cut the lines off), widened to
// the video's shape and kept on the page where it can be.
function show(...names) {
  const ps = names.map(part);
  const x0 = Math.min(...ps.map((p) => p.box[0])), y0 = Math.min(...ps.map((p) => p.box[1]));
  const x1 = Math.max(...ps.map((p) => p.box[0] + p.box[2])), y1 = Math.max(...ps.map((p) => p.box[1] + p.box[3]));
  let w = Math.max(x1 - x0 + 160, PW - 60), h = y1 - y0 + 120;
  if (w / h < 16 / 9) w = h * 16 / 9; else h = w * 9 / 16;
  const cx = w >= PW ? (PW - w) / 2 : Math.min(Math.max((x0 + x1) / 2 - w / 2, 0), PW - w);
  const cy = h >= PH ? (PH - h) / 2 : Math.min(Math.max((y0 + y1) / 2 - h / 2, 0), PH - h);
  return { image: FORM.pictures[ps[0].page - 1], ring: [x0, y0, x1 - x0, y1 - y0], crop: [cx, cy, w, h] };
}

export default {
  id: '2.4-data-form',
  trouble: [
    "If you send a screenshot, check it's full size: some ways of sending a picture make it smaller.",
  ],
  steps: [
    { ...show('title'),
      page: "The keyguard data form collects everything a keyguard needs. It's on volksswitch.org, as a PDF or a Word file.",
      say: "The keyguard data form collects everything a keyguard needs, in one place. It's on " +
           "volksswitch.org, on the Keyguard Designer documents page. You can type into it on the " +
           "computer, as a PDF or in Word, or print it." },
    { ...show('intro'),
      page: "Fill in what you know. Measure in millimeters. A screenshot of the app is the most useful thing to send.",
      say: "Fill in what you know, and leave the rest blank. Measure in millimeters. The most useful " +
           "thing you can send with it is a screenshot of the app." },
    { ...show('About this keyguard'),
      say: "Give the design a name you'll recognize, and say who filled in the form, and how to reach " +
           "them. If you're designing for someone else, send them the form." },
    { ...show('The tablet'),
      say: "Then the tablet: its exact model, how the student holds it, and whether the home button and " +
           "the camera stay uncovered." },
    { ...show('The case'),
      say: "Then the case. Measure the opening around the screen with a ruler, in millimeters, and how far " +
           "the screen sits below the front of the case." },
    { ...show('The AAC app'),
      page: "For the app, send a screenshot of each page, and say which bars to reach and which buttons to cover, join or outline.",
      say: "For the app, send a screenshot of each page that needs a keyguard. Then say which bars the " +
           "student needs to reach, and which buttons to cover, join, or outline with a ridge. Marking " +
           "them on the screenshot is fine." },
    { ...show('Without a screenshot: how tall', 'Without a screenshot: the size'),
      page: "The rows shaded yellow come from measuring the app. With a screenshot, skip them.",
      say: "The rows shaded yellow come from measuring the app with a ruler. If you send a screenshot, " +
           "skip them: the screenshot gives them more accurately." },
    { ...show('How the student uses it'),
      say: "How the student touches the screen helps decide how thick the keyguard is, and how its " +
           "openings are shaped." },
    { ...show('Making and attaching it'),
      page: "Then how it's made, how it attaches, and a favorite color. Not sure how it attaches? Say so.",
      say: "Then whether it's printed or laser-cut, how it attaches, and a favorite color. If you're not " +
           "sure how it should attach, say so, and the designer can suggest one." },
    { ...show('Words and braille', 'Anything else'),
      say: "Add any words to engrave, such as the student's name, and any braille labels. Anything else " +
           "goes at the end." },
    { before: all(closeSections(), view('fit')), highlight: '#right',
      page: "Whoever designs the keyguard enters the values in the Customizer, and saves them as a preset.",
      say: "Send the form, with the screenshots, to whoever is designing the keyguard. Under each question, " +
           "in small type, is the setting it fills in, so they can enter it in the Customizer and save it " +
           "as a preset. {next}" },
  ],
};
