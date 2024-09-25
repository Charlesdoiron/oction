import { PrismaClient } from "@prisma/client";

function getLatLonFromGoogleMapsUrl(url: string) {
  // Regular expression to match the latitude and longitude pattern
  const regex = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;

  // Try to match the pattern in the URL
  const match = url.match(regex);

  // If a match is found, return an object with lat and lon
  if (match) {
    return {
      lat: parseFloat(match[1]),
      lon: parseFloat(match[2]),
    };
  }

  return null;
}

async function getLatLong() {
  const prisma = new PrismaClient();
  try {
    const ads = await prisma.ad.findMany({
      where: {
        location: { not: undefined },
        lat: { equals: null },
        lon: { equals: null },
      },
    });

    console.log(`Found ${ads.length} ads to process.`);

    let processedCount = 0;
    for (const ad of ads) {
      try {
        const latLong = getLatLonFromGoogleMapsUrl(ad.location);
        if (!latLong) {
          console.log(`No latitude and longitude found for ad: ${ad.id}`);
          continue;
        }

        const API_URL_REVERSE = `https://api-adresse.data.gouv.fr/reverse/?lon=${latLong.lon}&lat=${latLong.lat}`;

        const response = await fetch(API_URL_REVERSE);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        await prisma.ad.update({
          where: { id: ad.id },
          data: {
            lat: latLong.lat,
            lon: latLong.lon,
            address: data.features?.[0]?.properties.name,
            city: data.features?.[0]?.properties.city,
            postCode: data.features?.[0]?.properties.postcode,
            cityCode: data.features?.[0]?.properties.citycode,
          },
        });

        processedCount++;
        console.log(
          `Processed ${processedCount}/${ads.length} ads. Updated ad: ${ad.id}`
        );
      } catch (error) {
        console.error(`Error processing ad ${ad.id}:`, error);
      }
    }

    console.log("All ad locations have been processed.");
  } catch (error) {
    console.error("Error updating ad locations:", error);
  } finally {
    await prisma.$disconnect();
  }
}

getLatLong();
