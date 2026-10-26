// How-to video 2.4: filling in the keyguard data form. The pictures are the blank form from
// volksswitch.org (Keyguard/data form/keyguard-data-form.pdf), at 200 dpi, in
// Documents/video-pictures/; the boxes are in those pictures' pixels. From the website page
// "Collecting Data About Your Custom Keyguard".
import { all, view, closeSections } from '../helpers.mjs';

const P1 = 'Documents/video-pictures/data-form-1.png';
const P2 = 'Documents/video-pictures/data-form-2.png';

export default {
  id: '2.4-data-form',
  steps: [
    { image: P1, ring: [90, 90, 1520, 110],
      page: "The keyguard data form collects everything a keyguard needs. It's on volksswitch.org.",
      say: "The keyguard data form collects everything a keyguard needs, in one place. It's on " +
           "volksswitch.org, as a Word file or a PDF." },
    { image: P1, ring: [90, 215, 900, 60],
      page: "Give it a name you'll recognize: the app, the tablet and the case.",
      say: "Give it a name you'll recognize, such as the student's app, tablet and case." },
    { image: P1, ring: [90, 560, 1520, 500],
      page: "The first part is for whoever is closest to the student: the tablet, the case and the app.",
      say: "The first part is for the person closest to the student. They know the tablet, the case, the " +
           "app, and how the keyguard might attach. If you're designing for someone else, email them " +
           "the form." },
    { image: P1, ring: [90, 1055, 1520, 210],
      page: "The highlighted values come from measuring the app. With a screenshot, you can skip them.",
      say: "The highlighted values come from measuring the app. If you have a screenshot of the app, you " +
           "can skip them: the screenshot gives them more accurately." },
    { image: P2, ring: [90, 820, 1540, 330],
      page: "Special Instructions is for favorite colors, or words to engrave.",
      say: "Special Instructions is the place for the student's favorite colors, or words to engrave on " +
           "the keyguard." },
    { image: P2, ring: [90, 1265, 1000, 370],
      page: "The last part is for whoever prints the keyguard.",
      say: "The last part is for whoever prints the keyguard." },
    { before: all(closeSections(), view('fit')), highlight: '#right',
      page: "Enter the values in the Customizer, and save them as a preset.",
      say: "Then enter the values in the Customizer, and save them as a preset. {next}" },
  ],
};
