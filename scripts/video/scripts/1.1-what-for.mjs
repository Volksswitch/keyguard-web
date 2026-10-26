// How-to video 1.1: what the Keyguard Designer is for.
//
// The real app with the sample project open (the WordPower 42 design), shown in the
// states the narration describes. The cost figures are from the interview study, as in
// the Product Overview.
//
// A step's `say` is spoken; its `page` wording, where it has one, goes on the one-page
// guide with that step's picture. `highlight` names what the ring points at; if nothing
// on screen matches it, the render stops.

const click = (sel) => (page) => page.click(sel);
const openSection = (name) => async (page) => {
  const sec = page.locator(`.section[data-section="${name}"]`);
  if (!(await sec.evaluate((el) => el.classList.contains('open')))) {
    await sec.locator('.section-header').click();
  }
};

export default {
  id: '1.1-what-for',
  trouble: [
    "If the app won't open a folder, or asks you to use Chrome or Edge, open " +
    "keyguard.volksswitch.org in Chrome or Edge. Safari and Firefox can't open a project folder.",
  ],
  steps: [
    { before: click('#view-fit'),
      say: "The Keyguard Designer helps you make keyguards for people who use AAC on a tablet." },
    { before: click('#view-top'),
      page: "A keyguard is a plastic plate over the tablet's screen, with an opening over each " +
            "button of the AAC app.",
      say: "A keyguard is a plastic plate that sits over the screen. Each opening sits over one " +
           "button of the AAC app, so a hand can rest on the plate and still press one button " +
           "at a time." },
    { say: "A keyguard from a specialist company costs about a hundred dollars, and takes weeks " +
           "to arrive. Printed, it costs about a dollar fifty in plastic, and it's ready the " +
           "same day. So you can try a second version, or a third, until it fits." },
    { before: openSection('Grid Info'), highlight: '#cust-sections',
      page: "You describe the keyguard with settings: the tablet, its case, and the app's rows " +
            "and columns.",
      say: "You describe the keyguard with settings: the tablet, its case, and the rows and " +
           "columns of the app." },
    { highlight: '#viewport',
      page: "The keyguard redraws over a screenshot of the app, so you can see each opening line " +
            "up with its button.",
      say: "The keyguard redraws as you go, over a screenshot of the app, so you can see each " +
           "opening line up with its button." },
    { before: async (page) => { await page.click('#openings-btn'); await page.click('#oge-add-rect'); },
      highlight: '#oge-bar',
      page: "You draw the openings a grid can't make straight onto the keyguard.",
      say: "For openings a grid can't make, you draw them right onto the keyguard." },
    { before: async (page) => {
        await page.click('#openings-cancel');
        const discard = page.locator('button', { hasText: 'Discard' });
        if (await discard.count()) await discard.first().click();
      },
      highlight: '#export-stl',
      page: "You save a file for a 3D printer or a laser cutter.",
      say: "When it looks right, you save a file for your 3D printer, or for a laser cutter." },
    { before: click('#view-fit'), highlight: '#project-folder-label',
      page: "It runs in Chrome or Edge with nothing to install, and your designs stay in a " +
            "folder on your own computer.",
      say: "It all runs in Chrome or Edge, with nothing to install, and your designs stay in a " +
           "folder on your own computer." },
    { say: "That's the Keyguard Designer. {next}" },
  ],
};
