import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2023-05-03' });

const updates = {
  "OaXqxzD07CB4OornBc88aa": {
    "title": "Quetta Club \u2014 Scouts Hall",
    "description": "Part of the broader Quetta Club complex, this hall was designed for multi-use assembly \u2014 scouting activities, institutional gatherings, light sports. The interior is column-free, which matters when the programme changes from week to week. Robust finishes, good ventilation through high-level louvres, and a straightforward structural system that keeps the long-term maintenance manageable."
  },
  "OaXqxzD07CB4OornBc8FSO": {
    "title": "APPI DHA",
    "description": "A residential and institutional development within a Defence Housing Authority framework. The programme combines housing with community facilities \u2014 a configuration that DHA schemes across Pakistan have deployed successfully for decades. MKA's involvement spans architectural and structural design, with the layout following DHA's planning standards while introducing considered building forms at the street and block level."
  },
  "OaXqxzD07CB4OornBc8HLU": {
    "title": "Masjid Bait-us-Salam",
    "description": "A congregational mosque where the name \u2014 House of Peace \u2014 is reflected in the architecture. The prayer hall is column-free, achieved with a spanning roof structure that also creates the main form of the building. Natural light enters through clerestory glazing on the qibla side, washing the mihrab wall in diffuse daylight at prayer times. The forecourt, shaded by a colonnaded veranda, is where the community actually gathers before and after prayers."
  },
  "OaXqxzD07CB4OornBc8Iv4": {
    "title": "Masjid OIBF",
    "description": "A mosque commissioned through an institutional charitable framework, designed to a clear programme: prayer hall for a stated congregation size, ablution facilities, and a minaret that reads from the street. The design works within a tight budget by concentrating the architectural effort where it matters \u2014 the qibla wall, the entrance portal, and the minaret proportions. The rest is well-built and unpretentious."
  },
  "a71xIW6xFsMjl4V0ac84wJ": {
    "title": "Hafiz Manzil",
    "description": "A family home on a standard urban plot in Lahore, where the challenge \u2014 as it always is on tight sites \u2014 was fitting a full programme without the house feeling compressed. The solution here uses a double-height drawing room to give the ground floor a sense of scale, with the upper-floor rooms more intimate. The front garden is small but treated carefully; the rear terrace is the better outdoor space."
  },
  "a71xIW6xFsMjl4V0ac85un": {
    "title": "Rizvi Manzil",
    "description": "A private residence where the plot orientation dictated a north-south long axis, and the plan takes advantage of this: living rooms face south for winter sun, bedrooms are on the quieter north side, and the kitchen and services are organised on the east to free up the main elevations. A house designed by thinking through how a family actually uses it across the seasons."
  },
  "a71xIW6xFsMjl4V0ac86d9": {
    "title": "Sheikh Zia-ul-Haq Complex",
    "description": "An institutional complex where the design had to serve both a public and a civic function. The building sits with some authority on its site \u2014 a well-considered entrance sequence, a facade that reads clearly at street scale, and interior spaces that can accommodate formal gatherings. The structural system is straightforward flat-slab construction, well-executed."
  },
  "a71xIW6xFsMjl4V0ac86xJ": {
    "title": "Multan Hospital",
    "description": "A healthcare facility in Multan where the design takes the clinical programme seriously: clean circulation between outpatient, inpatient, and support zones, good daylighting in the waiting areas, and a facade that communicates institution without being oppressive. Patient rooms on upper floors are oriented for privacy and cross-ventilation \u2014 important in a city with Multan's climate."
  },
  "a71xIW6xFsMjl4V0ac87rl": {
    "title": "Wajabat Manzil",
    "description": "A residential project where the design is organised around a top-lit stairwell that brings daylight into the centre of the plan. The rooms are arranged to either side, each with its own window aspect. The result is a house that feels larger and brighter than its floor area suggests. Finished in off-white render with dark window surrounds \u2014 simple, but correctly proportioned."
  },
  "a71xIW6xFsMjl4V0ac88S3": {
    "title": "APPI Sarai, Attabad",
    "description": "A tourism rest-stop at Attabad Lake in Hunza \u2014 one of the most dramatic landscapes in Pakistan. The sarai provides clean accommodation, food facilities, and rest areas for travellers on the Karakoram Highway, designed to sit in the landscape without competing with it. Stone and timber construction, pitched roofs to handle the snow load, and windows oriented toward the lake. The programme is modest; the setting is anything but."
  },
  "a71xIW6xFsMjl4V0ac8DYa": {
    "title": "Barban Manzil",
    "description": "A residential project where the client wanted a house that worked as well for entertaining as for daily family life. The plan is organised around two distinct zones \u2014 a formal guest suite on the ground floor and private family floors above \u2014 with a service core that keeps both running independently. The exterior is composed in brick with projecting window bays that break up what would otherwise be a flat facade."
  },
  "a71xIW6xFsMjl4V0ac8E4q": {
    "title": "Khalid Villa, Doha, Qatar",
    "description": "A private residence in Qatar \u2014 one of a small number of MKA's international commissions. The design responds to the Gulf climate and the cultural preferences of the client: a formal majlis suite accessible directly from the entrance, private family rooms behind it, and a landscaped courtyard that provides outdoor space without sacrificing privacy. The exterior is clean-lined and contemporary, appropriate to the neighbourhood typology in the client's chosen location."
  },
  "a71xIW6xFsMjl4V0ac8Hwl": {
    "title": "Stellar",
    "description": "A commercial development where the brief pushed toward a more contemporary expression than MKA's typical commercial vocabulary. The facade uses a glass-and-panel curtain wall system, with floor plates stacked on a clear structural grid. The ground-floor retail is set back slightly to create a covered pedestrian zone \u2014 small, but effective at the street level. A building designed for the market it's in and the tenants who'll occupy it."
  },
  "a71xIW6xFsMjl4V0ac8JJR": {
    "title": "Jafari Manzil, Bahawalpur",
    "description": "A private residence in Bahawalpur designed for the city's particular residential culture \u2014 generous formal rooms for receiving guests, a clearly separated private family area, and a courtyard that mediates between the two. Bahawalpur's climate demands thick walls, shaded openings, and good roof insulation; all three are incorporated. The exterior draws on the local Mughal-influenced tradition without being a replica of it."
  },
  "t6gIDz548GQeB4ZkbmgiAf": {
    "title": "Matore Villa, Lahore",
    "description": "6,217 sq ft. The brief was for a family house with the character of a Spanish courtyard villa, and the design delivers exactly that. A central cortile organises the living areas around a shaded outdoor room \u2014 usable in Lahore's winters, sheltered in its summers. Arched openings, terracotta tones, and a planted courtyard centre make the house cooler and quieter than its neighbours. The interiors read as generous without being oversized."
  },
  "t6gIDz548GQeB4ZkbmgihZ": {
    "title": "Jamkhana Masjid",
    "description": "A neighbourhood mosque designed around congregational dignity. The plan organises prayer hall, ablution spaces, and minaret into a compact footprint without sacrificing spatial quality. Brick detailing on the facade references the local building tradition, while the interior achieves the calm that a mosque should \u2014 without ornamental excess. Built to serve a community, not to announce itself."
  },
  "t6gIDz548GQeB4Zkbmgo0b": {
    "title": "Irfan Manzil",
    "description": "A family residence built on a generous plot, designed so that the ground floor public rooms can receive guests independently from the upper-floor family spaces. The exterior uses brick and plaster in combination \u2014 a restrained palette that holds up over time. The garden-facing rooms on the rear are the best spaces in the house: full height glazing, direct access to the lawn, and good afternoon light."
  },
  "t6gIDz548GQeB4ZkbmgrIb": {
    "title": "Garrison Mess, Quetta",
    "description": "12,257 sq ft. A military mess hall where the institutional brief and the need for a certain formality in the dining and reception rooms had to be balanced against comfort and practical operations. The existing building was retained as a reference \u2014 proposed renders show the improvements in fa\u00e7ade expression and interior layout, with the final construction matching the design intent closely. One of MKA's more photogenic institutional completions."
  },
  "t6gIDz548GQeB4Zkbmgrfd": {
    "title": "Al-Faisal Mall, Burewala",
    "description": "A multi-storey shopping centre designed for a secondary city market, where the commercial formula \u2014 retail on lower floors, leisure or food above \u2014 has to work without the footfall density of Lahore or Karachi. The design solves this with an atrium that draws natural light deep into the plan and keeps circulation visible from every level. Anchored tenants are placed to pull shoppers through, with smaller units filling the routes between them."
  },
  "t6gIDz548GQeB4Zkbmgszt": {
    "title": "Burki Haveli, Rawalpindi",
    "description": "11,549 sq ft. The haveli type is one of the most demanding residential programmes in South Asian architecture \u2014 it has to be grand enough to justify the name while remaining liveable. This one in Rawalpindi gets both right. A crescent-shaped central courtyard with a pool organises the main living areas, with guest and family wings anchored to each arm. The Mughal-colonial vocabulary is applied with precision: proportioned arches, bracketed overhangs, and a street facade that could only be from this region."
  },
  "t6gIDz548GQeB4ZkbmgvAn": {
    "title": "Broadway Lahore",
    "description": "A mixed-use commercial development on one of Lahore's main commercial corridors. Ground floor retail with offices above \u2014 the formula is standard, but the execution here pays attention to the street elevation in a way that many similar buildings in the area do not. The facade is gridded and regular, with enough material variation to avoid looking flat. Built to a commercial budget, designed with architectural discipline."
  },
  "t6gIDz548GQeB4ZkbmgwiD": {
    "title": "Mazhar Manzil, Islamabad",
    "description": "5,393 sq ft. The most thoroughly documented residential project in the MKA portfolio. Designed in a European manor idiom \u2014 steeply pitched roofs, stone-effect base, symmetrical fa\u00e7ade \u2014 the house was built in Islamabad with real construction photography at every stage of the work. The exterior reads as considered and confident. Interior spaces are generous, with high ceilings in the main reception rooms and a formal staircase that deserves the attention it receives."
  },
  "t6gIDz548GQeB4Zkbmh3Bd": {
    "title": "Masjid, Quetta",
    "description": "A mosque designed for Quetta's urban fabric, where the climate is dramatically different from Lahore's. Thick masonry walls, deeply recessed windows, and a shaded colonnade around the prayer hall manage the heat without mechanical systems. The mihrab wall is the one element that gets architectural elaboration; everywhere else, the design is quiet and structural. A masjid that earns its place in the streetscape."
  },
  "t6gIDz548GQeB4Zkbmh45Z": {
    "title": "APPI Sarai, Gilgit",
    "description": "22,200 sq ft. A hotel and chalet complex in Gilgit, designed for the growing number of tourists using the city as a base for expeditions into the Karakoram and Hindukush ranges. Thirty-eight chalet units are arranged across a sloped site, with the main hotel block at the entry. Tennis and badminton courts sit on the level ground. The riverside site gives most rooms a view of the Gilgit River, and the aerial render captures how the complex settles into its geography without dominating it."
  },
  "t6gIDz548GQeB4Zkbmh4Sb": {
    "title": "APPI Parda Rooms",
    "description": "Private accommodation units designed for families travelling in northern Pakistan, where separate men's and women's spaces are a functional requirement rather than a planning preference. The layout places shared facilities at the centre with independently accessible wings on either side. Each room is compact but complete: proper bed geometry, adequate storage, and a bathroom that fits without feeling like an afterthought. Simple construction, built for durability."
  },
  "t6gIDz548GQeB4Zkbmh6N3": {
    "title": "Skardu Biyaal",
    "description": "A tourism facility in the Skardu district, designed for visitors to one of Pakistan's most visited mountain destinations. The brief combines overnight accommodation with food and rest facilities for travellers arriving from the Karakoram Highway. The architecture uses local stone and timber, keeps its roofline low against the mountain backdrop, and positions terraces to take advantage of the river and peak views. The Skardu River Resort, completed in 2020, is MKA's strongest single body of work in this category."
  },
  "t6gIDz548GQeB4Zkbmh7uT": {
    "title": "Sialkot Markaz",
    "description": "A commercial and civic centre for Sialkot \u2014 a city with active industry and an international profile that its urban buildings hadn't always reflected. The design puts a disciplined facade on a practical brief: retail, offices, and public amenity in a multi-storey building that can hold its ground on a busy intersection. The Sialkot Dry Port Trust, one of Pakistan's better-run institutions, was among MKA's clients in this city."
  },
  "t6gIDz548GQeB4ZkbmhBWD": {
    "title": "Attabad Sarai",
    "description": "A larger rest-and-accommodation facility near Attabad Lake, intended for tourist groups and organised expeditions rather than individual travellers. The complex includes a dining hall, bedroom wings, a fuel and vehicle service point, and a covered outdoor space for briefings and staging. The construction uses masonry with a metal roof \u2014 durable, practical, and appropriate to a site at altitude where maintenance access is seasonal."
  },
  "t6gIDz548GQeB4ZkbmhCQ9": {
    "title": "Al-Shifa Hospital, Gilgit",
    "description": "A hospital in Gilgit built to serve a region where the nearest comparable facility has historically been hours away. The design takes the clinical brief seriously: clear zoning between emergency, outpatient, and inpatient functions; good daylighting in the wards; and a facade that communicates institutional confidence without being cold. Four storeys, well-proportioned, and set to handle the patient volumes that a mountain city of Gilgit's size generates."
  },
  "t6gIDz548GQeB4ZkbmhCx3": {
    "title": "Darul Uloom, Faisalabad",
    "description": "A large Islamic educational institution in Faisalabad, where the campus programme includes classrooms, a library, a mosque, residential hostels for students, and administrative facilities. The master plan organises these functions around a central open space that serves both as a civic courtyard and a circulation hub. The architecture is institutional in scale but not impersonal \u2014 the mosque is the architectural anchor, and the surrounding buildings defer to it appropriately."
  }
};

async function run() {
  for (const [id, data] of Object.entries(updates)) {
    try {
      await client.patch(id).set({ title: data.title, description: data.description }).commit();
      console.log(`Updated ${id} -> ${data.title}`);
    } catch (e) {
      console.error(`Failed to update ${id}: ${e.message}`);
    }
  }
}

run().catch(console.error);
