import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2023-05-03' });

const translations = {
  "OaXqxzD07CB4OornBc88aa": "Quetta Club Interior",
  "OaXqxzD07CB4OornBc8FSO": "DHA Quetta Gates",
  "OaXqxzD07CB4OornBc8HLU": "Masjid Bait-us-Salam",
  "OaXqxzD07CB4OornBc8Iv4": "OPF Mosque",
  "a71xIW6xFsMjl4V0ac84wJ": "Hafeez Residence",
  "a71xIW6xFsMjl4V0ac85un": "Rizvi Residence",
  "a71xIW6xFsMjl4V0ac86d9": "Sheikh Zia-ul-Haq Residence",
  "a71xIW6xFsMjl4V0ac86xJ": "Multan Hospital",
  "a71xIW6xFsMjl4V0ac87rl": "Wajahat Residence",
  "a71xIW6xFsMjl4V0ac88S3": "Aahni Serai Attabad",
  "a71xIW6xFsMjl4V0ac8DYa": "Burhan Residence",
  "a71xIW6xFsMjl4V0ac8E4q": "Khalid Villa Doha Qatar",
  "a71xIW6xFsMjl4V0ac8Hwl": "Staples",
  "a71xIW6xFsMjl4V0ac8JJR": "Bahawalpur Jafri Residence",
  "t6gIDz548GQeB4ZkbmgiAf": "Mator Villa",
  "t6gIDz548GQeB4ZkbmgihZ": "Gymkhana Mosque",
  "t6gIDz548GQeB4Zkbmgo0b": "Irfan Residence",
  "t6gIDz548GQeB4ZkbmgrIb": "Garrison Mess",
  "t6gIDz548GQeB4Zkbmgrfd": "Al-Faisal Mall Haripur",
  "t6gIDz548GQeB4Zkbmgszt": "Burki Haveli",
  "t6gIDz548GQeB4ZkbmgvAn": "Broadway Lahore",
  "t6gIDz548GQeB4ZkbmgwiD": "Mazhar Residence",
  "t6gIDz548GQeB4Zkbmh3Bd": "Quetta Mosque",
  "t6gIDz548GQeB4Zkbmh45Z": "Aahni Gilgit Serai",
  "t6gIDz548GQeB4Zkbmh4Sb": "Aahni Hunza Rooms",
  "t6gIDz548GQeB4Zkbmh6N3": "Cycle Piala",
  "t6gIDz548GQeB4Zkbmh7uT": "Sialkot Markaz",
  "t6gIDz548GQeB4ZkbmhBWD": "Attabad Serai",
  "t6gIDz548GQeB4ZkbmhCQ9": "Al-Shifa Hospital Gilgit",
  "t6gIDz548GQeB4ZkbmhCx3": "Darul Uloom Faisalabad Mosque"
};

async function run() {
  for (const [id, newTitle] of Object.entries(translations)) {
    try {
      await client.patch(id).set({ title: newTitle }).commit();
      console.log(`Updated ${id} -> ${newTitle}`);
    } catch (e) {
      console.error(`Failed to update ${id}: ${e.message}`);
    }
  }
}

run().catch(console.error);
