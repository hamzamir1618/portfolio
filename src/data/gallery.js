// Source of truth for the design gallery.
// `src` is relative to "Graphic Design XP/". scripts/build-assets.mjs turns each entry into
// optimised files under public/media and records their dimensions in gallery.generated.json.

export const categories = [
  { id: 'digital-art', label: 'Digital Art' },
  { id: 'promotional', label: 'Promotional' },
  { id: 'ui-ux', label: 'UI/UX' },
  { id: 'sketches', label: 'Sketches' },
  { id: 'game-design', label: 'Game Design' },
  { id: 'ms-paint', label: 'MS Paint' },
  { id: 'video-edits', label: 'Video Edits' },
];

export const gallery = [
  // Digital art
  { cat: 'digital-art', src: 'Digital Art/fwb_viltrumites_alt.png', title: 'Viltrumites Fan Art' },
  { cat: 'digital-art', src: 'Digital Art/mary_final.png', title: 'Mary — Digital Portrait' },
  { cat: 'digital-art', src: 'Digital Art/reyna.png', title: 'Reyna — Character Art' },
  { cat: 'digital-art', src: 'Digital Art/submission.png', title: 'Submission' },

  // Promotional
  { cat: 'promotional', src: 'Promotional/V.E.A.R. poster.png', title: 'V.E.A.R. Poster' },
  { cat: 'promotional', src: 'Promotional/innovation_hub poster.png', title: 'Innovation Hub' },
  { cat: 'promotional', src: 'Promotional/poetry slam poster-2(4).png', title: 'Poetry Slam' },
  { cat: 'promotional', src: 'Promotional/AniCon Tile-2.png', title: 'AniCon Tile' },
  { cat: 'promotional', src: 'Promotional/CRANE December Issue.png', title: 'CRANE Magazine' },
  { cat: 'promotional', src: 'Promotional/FLS GuestSpeakerPost.png', title: 'FLS Guest Speaker' },
  { cat: 'promotional', src: 'Promotional/Recruitments.png', title: 'Recruitments' },
  { cat: 'promotional', src: 'Promotional/noor amir-english post-darker text-2.png', title: 'Noor Amir Post' },
  { cat: 'promotional', src: 'Promotional/wp-poster.png', title: 'WP Poster' },
  { cat: 'promotional', src: 'Promotional/bootha edit-4.png', title: 'Bootha Edit' },
  { cat: 'promotional', src: 'Promotional/birb on da crossguard (3) extended 1080x1080.png', title: 'Birb on the Crossguard' },
  { cat: 'promotional', src: 'Promotional/book club poster logo on corner and name.png', title: 'Book Club' },
  { cat: 'promotional', src: 'Promotional/logo ss.png', title: 'Logo Design' },

  // UI/UX
  { cat: 'ui-ux', src: 'UI-UX/Full-Homepage.png', title: 'Full Homepage' },
  { cat: 'ui-ux', src: 'UI-UX/Best-Sellers-Page.png', title: 'Best Sellers Page' },
  { cat: 'ui-ux', src: 'UI-UX/Login.png', title: 'Login Screen' },
  { cat: 'ui-ux', src: 'UI-UX/Cart.png', title: 'Shopping Cart' },
  { cat: 'ui-ux', src: 'UI-UX/Checkout.png', title: 'Checkout' },
  { cat: 'ui-ux', src: 'UI-UX/Signup-1.png', title: 'Signup — Step 1' },
  { cat: 'ui-ux', src: 'UI-UX/Signup-2.png', title: 'Signup — Step 2' },
  { cat: 'ui-ux', src: 'UI-UX/Home_HF.png', title: 'Home (Hi-Fi)' },
  { cat: 'ui-ux', src: 'UI-UX/Menu_HF.png', title: 'Menu (Hi-Fi)' },
  { cat: 'ui-ux', src: 'UI-UX/Calming Screen_HF.png', title: 'Calming Screen (Hi-Fi)' },
  { cat: 'ui-ux', src: 'UI-UX/Items in Cart_HF.png', title: 'Items in Cart (Hi-Fi)' },
  { cat: 'ui-ux', src: 'UI-UX/Order Confirmation_HF.png', title: 'Order Confirmation' },
  { cat: 'ui-ux', src: 'UI-UX/Track Progress_HF.png', title: 'Track Progress' },

  // Sketches
  { cat: 'sketches', src: 'Sketches/armor design w chainmail.JPG', title: 'Armor w/ Chainmail' },
  { cat: 'sketches', src: 'Sketches/armor design.JPG', title: 'Armor Design' },
  { cat: 'sketches', src: 'Sketches/containment suit design.JPG', title: 'Containment Suit' },
  { cat: 'sketches', src: 'Sketches/suit design.JPG', title: 'Suit Design' },

  // Game design (video)
  { cat: 'game-design', src: 'Game Design/pacman assembly demo.mp4', title: 'Pacman Assembly Demo', video: true },
  { cat: 'game-design', src: 'Game Design/spaceshooter demo.mp4', title: 'Space Shooter Demo', video: true },

  // MS Paint
  { cat: 'ms-paint', src: 'MS Paint (old)/Blue Knight.png', title: 'Blue Knight', pixel: true },
  { cat: 'ms-paint', src: 'MS Paint (old)/Ciro.png', title: 'Ciro', pixel: true },
  { cat: 'ms-paint', src: 'MS Paint (old)/DEUS-X.png', title: 'DEUS-X', pixel: true },
  { cat: 'ms-paint', src: 'MS Paint (old)/Dark Crusader mask.png', title: 'Dark Crusader', pixel: true },
  { cat: 'ms-paint', src: 'MS Paint (old)/Dead Zone.png', title: 'Dead Zone', pixel: true },
  { cat: 'ms-paint', src: 'MS Paint (old)/Kid Muscle UH.png', title: 'Kid Muscle', pixel: true },
  { cat: 'ms-paint', src: 'MS Paint (old)/Law.png', title: 'Law', pixel: true },
  { cat: 'ms-paint', src: 'MS Paint (old)/Muscle Brain.png', title: 'Muscle Brain', pixel: true },
  { cat: 'ms-paint', src: 'MS Paint (old)/My Future Ninja Suit.png', title: 'Future Ninja Suit', pixel: true },
  { cat: 'ms-paint', src: 'MS Paint (old)/Red Lightning.png', title: 'Red Lightning', pixel: true },
  { cat: 'ms-paint', src: 'MS Paint (old)/RukAng.png', title: 'RukAng', pixel: true },
  { cat: 'ms-paint', src: 'MS Paint (old)/Silver Knight.png', title: 'Silver Knight', pixel: true },
  { cat: 'ms-paint', src: 'MS Paint (old)/Ultimatus.png', title: 'Ultimatus', pixel: true },
  { cat: 'ms-paint', src: 'MS Paint (old)/White Knight.png', title: 'White Knight', pixel: true },
  { cat: 'ms-paint', src: 'MS Paint (old)/osiris.png', title: 'Osiris', pixel: true },

  // Video edits
  { cat: 'video-edits', src: 'Video Edits/book friend promo reel draft.mp4', title: 'Book Friend Promo Reel', video: true },
  { cat: 'video-edits', src: 'Video Edits/FwB Sticker Recreation.mp4', title: 'FwB Sticker Recreation', video: true },
];

export const slugify = (s) =>
  s.toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
