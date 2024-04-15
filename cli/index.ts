import cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { flag, code, name, countries } from "country-emoji";

interface Entry {
  country: string;
  countryCode: string;
  countryFlag: string;
  url: string;
  artistName: string;
  artistImage: string;
  artistDescription: string;
  songName: string;
  songEmbedUrl: string;
  score: number;
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url);
  return await response.text();
}

async function scrapeEurovision2024() {
  const baseUrl = "https://eurovision.tv";
  const participantsUrl = `${baseUrl}/event/malmo-2024/participants`;

  try {
    const html = await fetchHtml(participantsUrl);
    const $ = cheerio.load(html);

    const entries: Entry[] = [];

    for (const element of $(".watch-item").toArray()) {
      const $entry = $(element);

      const countryElement = $entry.find(".watch-item__country a");
      const country = countryElement.find("span:last-child").text().trim();
      const countryCode =
        countryElement.attr("href")?.split("/").pop()?.toUpperCase() || "";
      const countryFlag = flag(countryCode);
      const url = baseUrl + $entry.find(".watch-item__title a").attr("href");
      const artistName = $entry.find(".watch-item__title a span").text().trim();
      const songName = $entry.find(".watch-item__subtitle").text().trim();
      const artistImage =
        baseUrl + $entry.find(".watch-item__image img").attr("src");

      const participantHtml = await fetchHtml(url);
      const $participant = cheerio.load(participantHtml);
      const songEmbedUrl =
        $participant('.field-name:contains("Song") + .field-content a').attr(
          "href"
        ) || "";
      const artistDescription = $participant(".intro").text().trim();

      const entry: Entry = {
        country,
        countryCode,
        countryFlag,
        url,
        artistName,
        artistImage,
        artistDescription,
        songName,
        songEmbedUrl,
        score: 0
      };

      entries.push(entry);
    }

    const countriesDir = path.join(__dirname, "..", "_data", "countries");
    if (!fs.existsSync(countriesDir)) {
      fs.mkdirSync(countriesDir, { recursive: true });
    }

    for (const entry of entries) {
      const countryName = entry.country.toLowerCase().replace(/\s/g, "-");
      const filePath = path.join(countriesDir, `${countryName}.json`);

      fs.writeFileSync(filePath, JSON.stringify(entry, null, 2));
      console.log(`Saved entry for ${entry.country} to ${filePath}`);
    }

    console.log("Scraping completed successfully.");
  } catch (error) {
    console.error("An error occurred during scraping:", error);
  }
}

scrapeEurovision2024();
