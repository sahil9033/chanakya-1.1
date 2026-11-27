export type LearnBlock =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'quote'; text: string; cite?: string }

export type LearnSection = {
  heading: string
  blocks: LearnBlock[]
}

export type LearnArticle = {
  slug: string
  title: string
  metaTitle: string
  description: string
  kicker: string
  intro: string
  readMinutes: number
  updated: string
  sections: LearnSection[]
  faq: { q: string; a: string }[]
  cta: { href: string; label: string; blurb: string }
  related: string[]
}

export const LEARN_ARTICLES: LearnArticle[] = [
  {
    slug: 'sama-dama-bheda-danda',
    title: 'Sama, Dama, Bheda, Danda: The Four Upāyas Explained',
    metaTitle: 'Sama, Dama, Bheda, Danda — The Four Upāyas Explained',
    description:
      'The four upāyas of the Arthashastra — sama, dama, bheda and danda — explained in plain English, with the order in which Kautilya says to use them.',
    kicker: 'Arthashastra',
    intro:
      'Kautilya\u2019s Arthashastra treats every conflict as a problem of influence. Instead of one blunt method, it offers four graded instruments \u2014 the upāyas \u2014 and a rule for choosing between them: begin with the gentlest, and escalate only when it fails.',
    readMinutes: 6,
    updated: '2026-11-27',
    sections: [
      {
        heading: 'What the four upāyas are',
        blocks: [
          {
            kind: 'p',
            text: 'The upāyas (\u0909\u092a\u093e\u092f, \u201cmeans\u201d or \u201cexpedients\u201d) are the four ways one party can bend another to its purpose. In the Arthashastra they appear together as sāma, dāma, bheda and daṇḍa \u2014 conciliation, gifts, division and force.',
          },
          {
            kind: 'list',
            items: [
              'Sāma \u2014 conciliation. Winning someone over with words: praise, reason, a sympathetic hearing, an appeal to shared interest. It costs nothing but attention, and it preserves the relationship.',
              'Dāma \u2014 gifts. Offering something of value: money, a favour, a concession, a position. It buys goodwill quickly, but it also sets a price and invites the other side to ask for more.',
              'Bheda \u2014 division. Weakening a united front by working its seams: private assurances, separate deals, exploiting rivalry between allies. It is the subtlest method and the most resented if discovered.',
              'Daṇḍa \u2014 force. The open exercise of power: sanctions, penalties, escalation, coercion. It settles matters fast and is the hardest to take back.',
            ],
          },
        ],
      },
      {
        heading: 'Why Kautilya insists on order',
        blocks: [
          {
            kind: 'p',
            text: 'The four are not equal alternatives, they are a sequence. Used in order, each gentler step makes the next more credible: an opponent who has already refused a fair hearing and a fair deal knows the next instrument is real. Used out of order, force looks like bullying and gifts look like weakness.',
          },
          {
            kind: 'p',
            text: 'Escalation is also expensive. Sāma preserves a relationship you may need again. Daṇḍa spends it. That is why Kautilya places force last and treats it as a failure of the earlier three, not the first move of a strong party.',
          },
        ],
      },
      {
        heading: 'The upāyas in a modern negotiation',
        blocks: [
          {
            kind: 'p',
            text: 'Take a salary conversation. Sāma is opening with the value you create and asking what would make a yes possible. Dāma is a concession you can afford \u2014 taking on a defined extra responsibility, or a split across two review cycles. Bheda is finding the interest inside the other side that is not the headline number: their need to keep a budget line flat, or to be seen as fair. Daṇḍa is the competing offer you are genuinely prepared to accept.',
          },
          {
            kind: 'p',
            text: 'Notice that the competing offer is daṇḍa whether or not you name it. Its power comes from being real, not from being threatened.',
          },
        ],
      },
      {
        heading: 'The most common mistake',
        blocks: [
          {
            kind: 'p',
            text: 'People reach for daṇḍa first because it feels decisive. Kautilya\u2019s counsel runs the other way: exhaust sāma, then dāma, then bheda \u2014 and let the quiet existence of daṇḍa be the reason the earlier three succeed.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'What does sama dama bheda danda mean?',
        a: 'These are the four upāyas, the methods of influence from the Arthashastra. Sama is conciliation by words, dama is winning support with gifts, bheda is dividing an opponent or their alliance, and danda is the use of force or punishment. They are meant to be used in that order, escalating only if the gentler method fails.',
      },
      {
        q: 'What is the difference between sama and dama?',
        a: 'Sama persuades through words and shared interest and costs nothing material. Dama persuades by giving something of value \u2014 a gift, a favour or a concession \u2014 which buys goodwill but also sets a precedent and a price.',
      },
      {
        q: 'Does the Arthashastra say to use force first?',
        a: 'No. Kautilya places danda last. Force is reserved for when conciliation, gifts and division have failed, precisely because it is costly and irreversible and destroys the relationship you may need later.',
      },
    ],
    cta: {
      href: '/chat',
      label: 'Ask Chanakya',
      blurb: 'Bring a real negotiation to Vedhh AI and ask which upāya fits the situation.',
    },
    related: ['chanakya-niti-negotiation', 'chanakya-leadership-quotes'],
  },
  {
    slug: 'chanakya-niti-negotiation',
    title: 'Chanakya Niti for Negotiation: Five Rules That Still Work',
    metaTitle: 'Chanakya Niti for Negotiation — Five Rules That Still Work',
    description:
      'Five negotiation principles from Chanakya Niti and the Arthashastra \u2014 leverage, timing, alliances, information, and the discipline to walk away.',
    kicker: 'Chanakya Niti',
    intro:
      'Chanakya Niti is not a book of polite maxims. Read closely, it is a manual for dealing with people who have their own interests, and it assumes you will be outmatched unless you choose your ground. Five rules run through it.',
    readMinutes: 7,
    updated: '2026-11-27',
    sections: [
      {
        heading: 'Know your own strength before you sit down',
        blocks: [
          {
            kind: 'p',
            text: 'Kautilya begins with relative power, not with clever talk. A party that misjudges its own position negotiates from a fantasy. Before any conversation, be honest about what you can actually do without the other side\u2019s agreement \u2014 that is your real leverage.',
          },
          {
            kind: 'p',
            text: 'If you are clearly weaker, the counsel is not to posture but to avoid the head-on contest, gather allies, and wait for a better ground.',
          },
        ],
      },
      {
        heading: 'Gather information; the uninformed are easy to fool',
        blocks: [
          {
            kind: 'p',
            text: 'The Arthashastra spends more words on intelligence than on almost anything else. The reason is practical: you cannot offer someone what they want until you know what they want, and you cannot see the trap until you know who set it.',
          },
          {
            kind: 'p',
            text: 'In a negotiation this means knowing the other side\u2019s constraints \u2014 their deadline, their budget, the person they must answer to \u2014 before you name your terms.',
          },
        ],
      },
      {
        heading: 'Choose the ground and the moment',
        blocks: [
          {
            kind: 'p',
            text: 'Timing is a form of strength. The same request made when the other side is rushed, distracted or dependent lands very differently. Kautilya\u2019s king waits for the season; so should you. Never negotiate when you are the one who is desperate.',
          },
        ],
      },
      {
        heading: 'Build alliances you can afford to keep',
        blocks: [
          {
            kind: 'p',
            text: 'The Arthashastra\u2019s mandala theory is often reduced to \u201cthe enemy of my enemy is my friend\u201d, but the point is sharper than that. Each neighbour is placed by position and interest, not sentiment, and a friend who is also the friend of your rival is not your friend.',
          },
          {
            kind: 'p',
            text: 'In practice: pick allies whose interests genuinely align with the outcome, and be suspicious of allies who profit from the conflict continuing.',
          },
        ],
      },
      {
        heading: 'Be willing to walk away \u2014 and mean it',
        blocks: [
          {
            kind: 'p',
            text: 'The strongest position in any negotiation is the one you can leave. If you can genuinely accept no deal, no threat is needed; your calm does the work. If you cannot, everyone can tell, and your terms will drift toward theirs.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'What does Chanakya Niti say about negotiation?',
        a: 'It treats negotiation as applied statecraft: establish your real leverage, gather intelligence on the other side\u2019s needs and constraints, choose your timing, build only alliances whose interests truly align, and keep the ability to walk away. Force and threats come last, not first.',
      },
      {
        q: 'What is Chanakya\u2019s advice if you are the weaker party?',
        a: 'Do not force a direct contest you will lose. The Arthashastra advises avoiding the head-on confrontation, building alliances, improving your position, and waiting for a more favourable ground and moment before you engage.',
      },
      {
        q: 'Why does Chanakya emphasise information so heavily?',
        a: 'Because influence depends on knowing what the other party actually wants and what constrains them. Without that, offers miss and traps go unseen, so the Arthashastra treats intelligence gathering as a precondition for any successful move.',
      },
    ],
    cta: {
      href: '/chat',
      label: 'Pressure-test your plan',
      blurb: 'Describe your negotiation to Vedhh AI and ask where your leverage is weakest.',
    },
    related: ['sama-dama-bheda-danda', 'chanakya-leadership-quotes'],
  },
  {
    slug: 'chanakya-leadership-quotes',
    title: 'Chanakya on Leadership: What the Arthashastra Actually Says',
    metaTitle: 'Chanakya on Leadership — What the Arthashastra Actually Says',
    description:
      'Chanakya\u2019s leadership doctrine from the Arthashastra: the ruler exists for the people, discipline comes before comfort, and conduct is the first instrument of governance.',
    kicker: 'Arthashastra',
    intro:
      'Most \u201cChanakya quotes\u201d circulating online are unattributed aphorisms. The real doctrine is in the Arthashastra, and it is more demanding than the memes suggest: leadership is a duty, and the ruler\u2019s own conduct is the first instrument of governance.',
    readMinutes: 6,
    updated: '2026-11-27',
    sections: [
      {
        heading: 'The king exists for the people, not the reverse',
        blocks: [
          {
            kind: 'quote',
            text: 'In the happiness of his subjects lies the king\u2019s happiness; in their welfare his welfare.',
            cite: 'Arthashastra 1.19',
          },
          {
            kind: 'p',
            text: 'This is the load-bearing sentence of Kautilya\u2019s political thought. Authority is justified by the welfare it produces, which makes the leader\u2019s own comfort a lower priority, not a higher one.',
          },
        ],
      },
      {
        heading: 'Discipline before comfort',
        blocks: [
          {
            kind: 'p',
            text: 'The Arthashastra describes the ruler\u2019s day in almost tedious detail \u2014 set hours for counsel, for inspection, for rest. The message is that a leader who is ruled by appetite cannot rule well. Self-discipline is treated as infrastructure, not virtue.',
          },
        ],
      },
      {
        heading: 'Conduct is policy',
        blocks: [
          {
            kind: 'p',
            text: 'Kautilya assumes that whatever the leader does, the people will copy. A leader who cuts corners teaches the whole organisation to cut corners. This is why the text judges a ruler by personal conduct as much as by decrees: example is the cheapest and most durable enforcement.',
          },
        ],
      },
      {
        heading: 'The seven limbs a leader must hold together',
        blocks: [
          {
            kind: 'p',
            text: 'Kautilya describes the state as saptāṅga \u2014 seven limbs \u2014 and a leader\u2019s job is to keep all of them sound at once: the ruler, the ministers, the territory and people, the fortified capital, the treasury, the army, and the allies. Weaken any one and the others strain.',
          },
          {
            kind: 'list',
            items: [
              'Svāmī \u2014 the ruler, and the quality of their judgement.',
              'Amātya \u2014 the ministers and the machinery of counsel.',
              'Janapada \u2014 the land and the people who work it.',
              'Durga \u2014 the defended capital and infrastructure.',
              'Kośa \u2014 the treasury that funds everything else.',
              'Daṇḍa \u2014 the army and the legitimate use of force.',
              'Mitra \u2014 the allies whose support multiplies reach.',
            ],
          },
        ],
      },
      {
        heading: 'What modern leaders take from this',
        blocks: [
          {
            kind: 'p',
            text: 'Strip away the kingship and the shape remains: define your duty by the welfare of those you lead, keep your own discipline in order, remember that your conduct is your most-read policy, and hold your \u201climbs\u201d \u2014 people, resources, funding, allies \u2014 in balance rather than over-investing in one.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'What did Chanakya say about leadership?',
        a: 'That a ruler exists for the welfare of the people, that personal discipline comes before personal comfort, that a leader\u2019s conduct is copied by everyone below and is therefore a form of policy, and that the state rests on seven limbs (ruler, ministers, people, capital, treasury, army and allies) that must be kept in balance.',
      },
      {
        q: 'What are the seven limbs (saptanga) of the state?',
        a: 'Svami (the ruler), amatya (ministers), janapada (territory and people), durga (fortified capital), kosha (treasury), danda (army and force) and mitra (allies). Kautilya treats them as interdependent, so strength in one cannot compensate for neglect of another.',
      },
      {
        q: 'Did Chanakya believe the king ruled for himself?',
        a: 'No. The Arthashastra states that the king\u2019s happiness lies in the happiness of his subjects and his welfare in theirs, making authority a duty justified by the welfare it produces rather than a privilege.',
      },
    ],
    cta: {
      href: '/chat',
      label: 'Ask for counsel',
      blurb: 'Bring a leadership dilemma to Vedhh AI and ask how the Arthashastra would frame it.',
    },
    related: ['sama-dama-bheda-danda', 'chanakya-niti-negotiation'],
  },
  {
    slug: 'lahiri-ayanamsa',
    title: 'Lahiri Ayanamsa, Explained: Why Vedic Charts Are Sidereal',
    metaTitle: 'Lahiri Ayanamsa Explained — Why Vedic Charts Are Sidereal',
    description:
      'What the Lahiri (Chitrapaksha) ayanamsa is, why Vedic astrology uses a sidereal zodiac, and how that shifts every sign roughly 24 degrees from the tropical one.',
    kicker: 'Jyotish',
    intro:
      'If your Vedic rāśi sometimes contradicts the sun sign you grew up with, the cause is a single correction: the ayanamsa. Traditional Vedic astrology is sidereal \u2014 it measures the zodiac against the fixed stars, not the spring equinox \u2014 and the Lahiri ayanamsa is the one in official use in India.',
    readMinutes: 5,
    updated: '2026-11-27',
    sections: [
      {
        heading: 'Tropical and sidereal: two ways to place the zodiac',
        blocks: [
          {
            kind: 'p',
            text: 'Western astrology typically uses the tropical zodiac, which anchors 0\u00b0 Aries to the spring equinox. Because the Earth\u2019s axis slowly wobbles (precession), the equinox drifts backward against the stars. Vedic astrology instead anchors the zodiac to the fixed stars \u2014 a sidereal zodiac \u2014 so a sign keeps its place among the constellations.',
          },
        ],
      },
      {
        heading: 'What the ayanamsa is',
        blocks: [
          {
            kind: 'p',
            text: 'The ayanamsa is the running gap between those two starting points. It is about 24 degrees today and grows by roughly 50 arcseconds each year, so the Vedic and tropical longitudes of a planet differ by that amount.',
          },
          {
            kind: 'p',
            text: 'That 24-degree offset is large. It is close to a full sign, which is exactly why the two systems can disagree about which sign the Moon or a planet occupies.',
          },
        ],
      },
      {
        heading: 'Why \u201cLahiri\u201d?',
        blocks: [
          {
            kind: 'p',
            text: 'Several ayanamsas exist, differing by a fraction of a degree. The Lahiri ayanamsa, also called Chitrapaksha, fixes the zodiac so that the star Chitrā (Spica) holds a stable longitude. India\u2019s Calendar Reform Committee adopted it in 1955, and it has been the standard for most Indian ephemerides and panchāṅgas since.',
          },
        ],
      },
      {
        heading: 'What it changes in practice',
        blocks: [
          {
            kind: 'p',
            text: 'For a Kundali, the ayanamsa determines the exact degrees of every planet, the house cusps, which nakshatra the Moon falls in, and therefore which Vimshottari dasha you begin with. A chart calculated with the wrong ayanamsa is not merely slightly off \u2014 its timing can be wrong by years.',
          },
        ],
      },
      {
        heading: 'Why Vedhh AI uses Lahiri',
        blocks: [
          {
            kind: 'p',
            text: 'Because it is the standard the Indian tradition and its panchāṅgas use, and because reproducibility matters more than novelty. A chart you can check against a printed ephemeris is a chart you can trust.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'What is Lahiri ayanamsa?',
        a: 'It is the standard sidereal correction used in Indian astrology, also called Chitrapaksha. It measures the roughly 24-degree gap between the tropical zodiac (fixed to the spring equinox) and the sidereal zodiac (fixed to the stars), so that Vedic planetary positions match the actual sky.',
      },
      {
        q: 'Why is my Vedic sign different from my Western sun sign?',
        a: 'Because Vedic astrology is sidereal and Western astrology is usually tropical. The two systems are offset by the ayanamsa, about 24 degrees, which is close to one full sign. For many people this moves the Sun or Moon into the neighbouring sign.',
      },
      {
        q: 'Is Lahiri the same as sidereal?',
        a: 'Lahiri is one particular sidereal ayanamsa. Sidereal simply means the zodiac is measured from the fixed stars; Lahiri (Chitrapaksha) is the specific sidereal reference adopted as standard in India in 1955.',
      },
    ],
    cta: {
      href: '/astrology',
      label: 'Calculate your Kundali',
      blurb: 'Generate a free sidereal chart with the Lahiri ayanamsa, calculated from your exact birth details.',
    },
    related: ['vimshottari-dasha', 'read-your-kundali'],
  },
  {
    slug: 'vimshottari-dasha',
    title: 'What Is Vimshottari Dasha? A Plain-English Guide',
    metaTitle: 'What Is Vimshottari Dasha? A Plain-English Guide',
    description:
      'Vimshottari dasha explained simply: the 120-year cycle of nine planetary periods, how your Moon\u2019s nakshatra sets the sequence, and what a mahadasha means.',
    kicker: 'Jyotish',
    intro:
      'Vimshottari dasha is Vedic astrology\u2019s timing system. It divides a life into a 120-year cycle of planetary periods, and your birth chart fixes exactly where in that cycle you begin. It is how Jyotish answers \u201cwhen\u201d, not only \u201cwhat\u201d.',
    readMinutes: 6,
    updated: '2026-11-27',
    sections: [
      {
        heading: 'The idea: the planets take turns',
        blocks: [
          {
            kind: 'p',
            text: 'Rather than treating a chart as a single frozen snapshot, Vimshottari gives each of the nine grahas a turn at the wheel. While a planet\u2019s period is running, the themes it governs in your chart are the ones most likely to be active.',
          },
        ],
      },
      {
        heading: 'The nine periods and their lengths',
        blocks: [
          {
            kind: 'list',
            items: [
              'Ketu \u2014 7 years',
              'Venus (Śukra) \u2014 20 years',
              'Sun (Sūrya) \u2014 6 years',
              'Moon (Chandra) \u2014 10 years',
              'Mars (Maṅgala) \u2014 7 years',
              'Rahu \u2014 18 years',
              'Jupiter (Guru) \u2014 16 years',
              'Saturn (Śani) \u2014 19 years',
              'Mercury (Budha) \u2014 17 years',
            ],
          },
          {
            kind: 'p',
            text: 'Those nine add up to exactly 120 years, which is the full cycle. When one completes, the sequence begins again.',
          },
        ],
      },
      {
        heading: 'Where you start: the Moon\u2019s nakshatra',
        blocks: [
          {
            kind: 'p',
            text: 'Your starting point is set at birth by the Moon. The zodiac is divided into 27 nakshatras of 13\u00b020\u2032 each, and every nakshatra is ruled by one of the nine planets in a repeating order. The lord of the nakshatra your Moon occupied at birth rules your first mahadasha.',
          },
          {
            kind: 'p',
            text: 'If the Moon was partway through that nakshatra, only the remaining portion of that first period falls to you \u2014 which is why two people born an hour apart can begin under different planets.',
          },
        ],
      },
      {
        heading: 'Mahadasha, antardasha, pratyantar',
        blocks: [
          {
            kind: 'p',
            text: 'The system nests. Each mahadasha (major period) is divided into nine antardashas (sub-periods), one for each planet, and each antardasha divides again into pratyantar dashas. This is how a Jyotishi narrows a broad theme to a specific window.',
          },
        ],
      },
      {
        heading: 'Reading a dasha honestly',
        blocks: [
          {
            kind: 'p',
            text: 'A dasha shows which themes are switched on \u2014 not a script of events. A \u201cgood\u201d planet does not guarantee good outcomes unless it is well placed in your chart, and a difficult lord is not automatically a bad period. The dasha is a timing layer read on top of the chart.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'What is Vimshottari dasha in simple terms?',
        a: 'It is a 120-year cycle of nine planetary periods used in Vedic astrology to time events. Each of the nine grahas rules a period, your birth chart fixes which one you start in, and while a period runs, that planet\u2019s themes are most active.',
      },
      {
        q: 'How is Vimshottari dasha calculated?',
        a: 'From the Moon\u2019s nakshatra at birth. The 27 nakshatras are each ruled by one of the nine planets in a fixed repeating order, and the lord of your Moon\u2019s nakshatra begins your first mahadasha. The fraction of that nakshatra already elapsed sets how much of the period remains.',
      },
      {
        q: 'How long is a Vimshottari dasha cycle?',
        a: 'The nine periods total 120 years: Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19 and Mercury 17. After the full cycle the sequence repeats.',
      },
    ],
    cta: {
      href: '/astrology',
      label: 'See your dasha',
      blurb: 'Vedhh AI calculates your Vimshottari dasha from your exact birth chart and interprets the timing.',
    },
    related: ['lahiri-ayanamsa', 'read-your-kundali'],
  },
  {
    slug: 'read-your-kundali',
    title: 'How to Read Your Kundali: Lagna, Houses and Planets',
    metaTitle: 'How to Read Your Kundali — Lagna, Houses and Planets',
    description:
      'A beginner\u2019s guide to reading a Vedic birth chart (Kundali): the Lagna, the twelve houses, the nine grahas and the twenty-seven nakshatras.',
    kicker: 'Kundali',
    intro:
      'A Kundali is not a horoscope column \u2014 it is a map of the sky at the moment of your birth, drawn in a fixed format. Once you know the four things it encodes, most of the strangeness falls away.',
    readMinutes: 7,
    updated: '2026-11-27',
    sections: [
      {
        heading: '1. The Lagna: the whole chart hangs on it',
        blocks: [
          {
            kind: 'p',
            text: 'The Lagna, or ascendant, is the sign rising on the eastern horizon at your birth. It sets the first house and therefore the numbering of all twelve. It is also the most birth-time-sensitive part of the chart: a difference of a few minutes can move the Lagna, which is why an exact birth time matters more than anything else.',
          },
        ],
      },
      {
        heading: '2. The twelve houses (bhāvas)',
        blocks: [
          {
            kind: 'p',
            text: 'Each house carries a domain of life. Counted from the Lagna:',
          },
          {
            kind: 'list',
            items: [
              '1 \u2014 self, body, vitality',
              '2 \u2014 wealth, family, speech',
              '3 \u2014 siblings, courage, effort',
              '4 \u2014 home, mother, inner peace',
              '5 \u2014 children, intellect, creativity',
              '6 \u2014 obstacles, health, adversaries',
              '7 \u2014 partnership, marriage, business',
              '8 \u2014 longevity, transformation, the hidden',
              '9 \u2014 fortune, dharma, father',
              '10 \u2014 career, standing, action',
              '11 \u2014 gains, networks, fulfilment of desire',
              '12 \u2014 loss, foreign lands, liberation',
            ],
          },
        ],
      },
      {
        heading: '3. The nine grahas',
        blocks: [
          {
            kind: 'p',
            text: 'Seven planets \u2014 Sun, Moon, Mars, Mercury, Jupiter, Venus and Saturn \u2014 plus the two lunar nodes, Rahu and Ketu. Each sits in a sign and a house, and that placement, not the planet alone, carries the meaning. A Jupiter in the tenth house is a different story from a Jupiter in the eighth.',
          },
        ],
      },
      {
        heading: '4. The twenty-seven nakshatras',
        blocks: [
          {
            kind: 'p',
            text: 'Beneath the twelve signs lies a finer division: 27 lunar mansions, each 13\u00b020\u2032 wide, each with its own lord and character. The nakshatra is where Vedic astrology gets its precision \u2014 it sharpens the Moon\u2019s meaning and drives the Vimshottari dasha that sets the timing of your life.',
          },
        ],
      },
      {
        heading: 'Reading it as a whole',
        blocks: [
          {
            kind: 'p',
            text: 'No single factor decides anything. A reading weighs a planet\u2019s sign, house, strength, the houses it rules and the aspects it receives, then layers the running dasha on top. That is why Vedhh AI calculates the whole chart deterministically before it writes a single sentence \u2014 interpretation should follow the astronomy, never replace it.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'What do I need to read a Kundali?',
        a: 'Your date of birth, an exact time of birth, and the place of birth. The time is the most important, because it fixes the Lagna and the house positions; even a few minutes can change the chart.',
      },
      {
        q: 'What is the Lagna in a Kundali?',
        a: 'The Lagna or ascendant is the zodiac sign rising on the eastern horizon at your birth. It becomes the first house and sets the numbering of the other eleven, so the entire chart is read relative to it.',
      },
      {
        q: 'Are Rahu and Ketu planets?',
        a: 'Not in the astronomical sense. Rahu and Ketu are the two points where the Moon\u2019s orbit crosses the ecliptic, called the lunar nodes. Vedic astrology treats them as grahas because of their strong effect in timing, especially in the Vimshottari dasha.',
      },
    ],
    cta: {
      href: '/astrology',
      label: 'Read your chart',
      blurb: 'Generate your free Kundali and get each of these layers interpreted from your actual chart.',
    },
    related: ['lahiri-ayanamsa', 'vimshottari-dasha'],
  },
]

export function getArticle(slug: string): LearnArticle | undefined {
  return LEARN_ARTICLES.find((a) => a.slug === slug)
}
