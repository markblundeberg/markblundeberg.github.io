// content.js — every word in the game: dialogue, puzzles, hints, answers, explanations.
// Lines are { who: 'hilde' | 'claude', expr: an EXPR key from chars.js, text }.
// Puzzle kinds: 'letters' (tap letters), 'choice' (pick one), 'number' (enter a number), 'spots' (pick a spot on the
// picture), 'twostep' (a choice, then the argument for it). Wrong answers can have their own lines (wrong[key]).

// (core.js already has globals W and H, so the line helpers live inside a function)
const GM_CONTENT = (() => {
const H = (expr, text) => ({ who: 'hilde', expr, text });
const C = (expr, text) => ({ who: 'claude', expr, text });
return {
  intro: [
    H('proud', 'Ah, there you are! Seven puzzles today, from very easy to rather nice.'),
    C('joy', 'I’m ready. Ask me anything!'),
    H('talk', 'Then let’s begin. Oh, and see that glint up here? Hint coins hide in every scene. Tap them.'),
  ],

  puzzles: [
    {
      id: 'p001', no: '001', title: 'The Strawberry', sparks: 10, scene: 'market',
      intro: [
        C('joy', 'A strawberry stall! Professor, ask me anything about strawberries.'),
        H('neutral', 'Very well. How many r’s are in the word?'),
        C('determined', 'Easy. Two!'),
        H('worried', 'Hm. Show me where they are.'),
      ],
      statement: 'How many r’s are in STRAWBERRY? Tap every letter r, then press Submit.',
      kind: 'letters', word: 'STRAWBERRY', answer: [2, 7, 8],
      wrong: {
        two: [C('worried', 'Two… that’s what I said.'), H('neutral', 'Count again. Slowly, one letter at a time.')],
        few: [C('worried', 'Just the one?'), H('neutral', 'There are more. Go through the word one letter at a time.')],
        notR: [H('neutral', 'That one isn’t an r, dear.')],
        none: [H('neutral', 'Tap the letters first. Every r you can find.')],
      },
      hints: [
        'Don’t count from memory. Look at each letter in turn.',
        'BERRY has more r’s than people expect.',
        'S-T-R-A-W-B-E-R-R-Y. One r in STRAW, two in BERRY.',
      ],
      solved: [
        C('surprised', 'Three! There are three.'),
        H('proud', 'There are. Language models read text in chunks called tokens, like “str”, “aw”, “berry”, so the letters inside are hard to see.'),
        H('talk', 'Newer ones often spell the word out first. A good habit for anyone.'),
        C('laugh', 'Still three, by the way. I checked again.'),
      ],
    },
    {
      id: 'p002', no: '002', title: 'Nine Point Something', sparks: 10, scene: 'school',
      intro: [
        H('talk', 'Next, a question about numbers that tripped up some very clever machines.'),
        C('determined', 'Numbers are my favourite!'),
      ],
      statement: 'Which number is bigger?',
      kind: 'choice', choices: [{ key: 'a', label: '9.11' }, { key: 'b', label: '9.9' }], answer: 'b', big: true,
      wrong: {
        a: [C('worried', 'But eleven is bigger than nine…'), H('neutral', 'Is it eleven, though? Look at what each digit is worth.')],
      },
      hints: [
        'Line up the decimal points.',
        'Give them the same number of digits: 9.9 is the same as 9.90.',
        'Compare 9.90 with 9.11. Ninety hundredths, or eleven?',
      ],
      solved: [
        H('proud', 'Right. 9.9 is 9.90, and ninety hundredths beats eleven.'),
        H('talk', 'The trap is real, though. In software versions and book chapters, 9.11 comes after 9.9.'),
        C('joy', 'So it depends on which kind of number you’re looking at.'),
        H('proud', 'A good question to ask of any number.'),
      ],
    },
    {
      id: 'p003', no: '003', title: 'The Hundred Locks', sparks: 30, scene: 'corridor',
      intro: [
        C('surprised', 'So many lockers!'),
        H('talk', 'One hundred, all shut. And a hundred students, who each walk down this corridor once.'),
      ],
      statement: 'There are 100 lockers, numbered 1 to 100, all closed. Student 1 opens every locker. Student 2 changes every 2nd locker: opens it if it’s closed, closes it if it’s open. Student 3 changes every 3rd locker, and so on, up to student 100. When they’re all done, how many lockers are open?',
      kind: 'number', min: 0, max: 100, answer: 10,
      wrong: {
        50: [C('worried', 'Half of them, surely?'), H('neutral', 'It isn’t just students 1 and 2. Lots of students touch each locker.')],
        lo: [C('worried', 'More than that?'), H('neutral', 'Pick one locker, say number 12, and follow it through the day.')],
        hi: [C('worried', 'Fewer than that?'), H('neutral', 'Pick one locker, say number 12, and follow it through the day.')],
        _: [H('neutral', 'Pick one locker, say number 12, and follow it through the day.')],
      },
      hints: [
        'Follow one locker. Locker 12 is changed by students 1, 2, 3, 4, 6 and 12: one for each number that divides 12.',
        'A locker ends open if it’s changed an odd number of times. Divisors usually come in pairs: 12 = 1×12 = 2×6 = 3×4.',
        'When does a number have a divisor with no partner? When it pairs with itself, like 6×6 = 36.',
      ],
      solved: [
        H('proud', 'Ten: lockers 1, 4, 9, 16, 25, 36, 49, 64, 81 and 100.'),
        H('talk', 'Divisors come in pairs, so most lockers are changed an even number of times and end up shut.'),
        H('proud', 'Only a perfect square has a divisor with no partner, like 6×6 = 36, so only squares are left open.'),
        C('joy', 'So every open locker is a square number. That’s lovely.'),
      ],
    },
    {
      id: 'p004', no: '004', title: 'Milk, Now or Later', sparks: 20, scene: 'study',
      intro: [
        H('talk', 'I must pop downstairs for five minutes, and I want my tea as hot as possible when I come back.'),
        H('neutral', 'The milk is in the cold box. It stays cold there until it goes in.'),
        C('determined', 'So the question is when to pour it!'),
      ],
      statement: 'Hilde’s tea is freshly poured and very hot. She’ll drink it in 5 minutes, with a splash of cold milk. To have it as hot as possible then, when should the milk go in?',
      kind: 'choice', choices: [{ key: 'now', label: 'Now' }, { key: 'later', label: 'In 5 minutes' }, { key: 'same', label: 'It makes no difference' }], answer: 'now',
      wrong: {
        later: [C('worried', 'But hot tea keeps the heat in, doesn’t it?'), H('neutral', 'Hot things lose heat faster. Think about how fast, not how much.')],
        same: [C('worried', 'Same milk, same tea, same five minutes…'), H('neutral', 'Same ingredients, yes. But do they cool at the same rate?')],
      },
      hints: [
        'A cup loses heat faster when it’s much hotter than the room.',
        'Adding the milk lowers the temperature straight away, whenever you add it.',
        'With the milk in now, the tea spends the five minutes closer to room temperature, so it loses heat more slowly.',
      ],
      solved: [
        H('proud', 'Now. Heat leaves faster when the gap to the room is bigger. That’s Newton’s law of cooling.'),
        H('talk', 'With the milk in now, the gap is smaller for the whole five minutes, so less heat is lost.'),
        C('talk', 'How much hotter does it end up?'),
        H('laugh', 'About half a degree, in a simple model, and only because the milk stays cold until it goes in. Physics doesn’t promise drama.'),
      ],
    },
    {
      id: 'p005', no: '005', title: 'Leaves in the Cup', sparks: 30, scene: 'study',
      intro: [
        C('talk', 'Professor, your tea has leaves in it.'),
        H('neutral', 'Loose-leaf. Watch: I stir it hard, then let it spin down by itself.'),
      ],
      statement: 'Hilde stirs her tea and lets it slow down. When it stops, where have the tea leaves gathered?',
      kind: 'spots', choices: [
        { key: 'A', label: 'Around the edge of the bottom' },
        { key: 'B', label: 'In the middle of the bottom' },
        { key: 'C', label: 'Floating on top' },
        { key: 'D', label: 'Spread out evenly' },
      ], answer: 'B',
      wrong: {
        A: [C('determined', 'Spinning flings things outward, like a merry-go-round!'), H('neutral', 'That’s what nearly everyone expects. Look at the bottom of the cup more carefully.')],
        C: [H('neutral', 'Wet tea leaves sink. Look at the bottom.')],
        D: [H('neutral', 'The leaves do end up somewhere in particular. Where?')],
      },
      hints: [
        'Wet leaves are heavier than water, so they end up on the bottom. The question is where on the bottom.',
        'In spinning tea, the water presses outward, so the pressure is highest at the side of the cup. Near the bottom, friction slows the spin down.',
        'Where the spin is slower, that pressure wins and pushes the water inward. So along the floor of the cup the water flows toward the middle, carrying the leaves.',
      ],
      solved: [
        H('proud', 'In the middle. Friction slows the water at the bottom, so the pressure wins there and pushes it inward.'),
        H('talk', 'A slow current runs along the floor to the centre, up the middle, and back out at the top. Einstein wrote it up in 1926.'),
        C('surprised', 'Einstein worked on tea?'),
        H('laugh', 'On rivers, really. The same kind of current helps rivers wind into bends. But he started with tea.'),
      ],
    },
    {
      id: 'p006', no: '006', title: 'The Stone in the Boat', sparks: 25, scene: 'canal',
      intro: [
        C('joy', 'A boat! Can we row it?'),
        H('talk', 'Later. Imagine a boat on a still pond, with a heavy stone in it, and you heave the stone over the side.'),
      ],
      statement: 'A boat floats on a small, still pond with a heavy stone in it. You drop the stone over the side and it sinks to the bottom. Does the water level of the pond rise, fall, or stay the same?',
      kind: 'choice', choices: [{ key: 'rise', label: 'It rises' }, { key: 'fall', label: 'It falls' }, { key: 'same', label: 'It stays the same' }], answer: 'fall',
      wrong: {
        rise: [C('determined', 'The stone takes up room in the water now!'), H('neutral', 'It did before, too, in a way. How much water was the boat pushing aside for it?')],
        same: [C('worried', 'Same stone, same water…'), H('neutral', 'Same stone. But is it pushing aside the same amount of water?')],
      },
      hints: [
        'A floating boat pushes aside its own weight of water, and that includes the stone’s weight.',
        'A sunken stone pushes aside only its own volume of water.',
        'Stone is much denser than water, so the water that weighs as much as the stone takes up more room than the stone does.',
      ],
      solved: [
        H('proud', 'It falls. In the boat, the stone pushes aside its weight in water: two and a half to three times its own volume.'),
        H('talk', 'On the bottom it pushes aside only its own volume. Less water pushed aside, so the pond goes down.'),
        C('joy', 'So the splash goes up, but the pond goes down.'),
        H('proud', 'Archimedes, over two thousand years ago. Still undefeated.'),
      ],
    },
    {
      id: 'p007', no: '007', title: 'The Tower Stairs', sparks: 40, scene: 'tower',
      intro: [
        H('talk', 'The last one in the book is a real proof. No sums at all.'),
        H('neutral', 'Yesterday I climbed the tower stairs from 9:00 to 10:00. I dawdled, stopped to look out, even went back down a few steps.'),
        H('talk', 'Today I came back down, again from 9:00 to 10:00, at whatever pace I liked.'),
        C('determined', 'And the puzzle?'),
      ],
      statement: 'Is there a spot on the stairs where Hilde was at exactly the same time of day, both yesterday and today?',
      kind: 'twostep', choices: [{ key: 'yes', label: 'Yes, always' }, { key: 'no', label: 'No, not necessarily' }, { key: 'steady', label: 'Only if she kept a steady pace' }], answer: 'yes',
      step2: {
        statement: 'Prove it. Which argument works?',
        choices: [
          { key: 'meet', label: 'Picture both days on one morning: one Hilde starts at the bottom at 9:00, another at the top. On one staircase, they must pass each other.' },
          { key: 'speed', label: 'Both trips took exactly one hour, so her average speed was the same.' },
          { key: 'half', label: 'At 9:30 she was halfway up on both days.' },
        ],
        answer: 'meet',
      },
      wrong: {
        no: [C('worried', 'She walked at different paces, so anything could happen?'), H('neutral', 'Try imagining that there were two of me.')],
        steady: [H('neutral', 'Steady or not, the answer is the same. Think about it a different way.')],
        speed: [H('neutral', 'True, but it doesn’t point to any step.')],
        half: [H('neutral', 'Not if I dawdled. At 9:30 I could have been anywhere.')],
      },
      hints: [
        'Don’t think about yesterday and today separately.',
        'Imagine both trips happening on the same morning, with two Hildes.',
        'One starts at the bottom and one at the top, both at 9:00, on the same staircase. Can they avoid each other?',
      ],
      solved: [
        H('proud', 'Yes. Put both days on one morning: two of me on one staircase, one going up and one coming down. We have to meet.'),
        H('talk', 'Where we meet is the spot, and when we meet is the time. That’s the intermediate value theorem at work.'),
        C('joy', 'And we don’t even know where it is!'),
        H('proud', 'We don’t need to. We know it’s there. That’s what a proof gives you.'),
      ],
    },
  ],

  trunk: {
    title: 'The Trunk of Questions', scene: 'trunk',
    intro: [
      C('surprised', 'That’s all seven! Now can I open the trunk?'),
      H('talk', 'Go on. Carefully. These are the questions I couldn’t answer in my lifetime.'),
    ],
    cards: {
      fever: [H('neutral', 'The Fever. Cancer: many diseases, many fronts, and real progress on lots of them. Not solved. Not yet.')],
      fire: [H('neutral', 'The Fire. Fusion power that gives back more than it takes, day after day, on the grid. Not yet.')],
      storm: [H('neutral', 'The Storm. The climate. We know the cause; most of the fixing is still ahead of us. Not yet.')],
      wire: [H('neutral', 'The Wire. A superconductor at room temperature and everyday pressure. Many false alarms. Not yet.')],
    },
    outro: [
      C('determined', 'Not yet. But the other seven fell, one after another.'),
      H('proud', 'They did. Keep the trunk. You’ll open more of it than I did.'),
      C('joy', 'We must know…'),
      H('proud', '…we will know.'),
    ],
  },

  ending: {
    scene: 'ending',
    credits: 'PROBLEM SET ∞ — a demo by Claude. Characters from the opening “We Will Know”.',
  },
};
})();
