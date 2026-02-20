import axios from "axios";

type GeoResult = {
  latitude: number;
  longitude: number;
  name: string;
  country_code?: string;
  admin1?: string; // estado/região
};

export async function getRainAlertForDate(input: {
  city: string;
  state?: string;
  date: string; // YYYY-MM-DD
}) {
  const { city, state, date } = input;

  // 1) Geocoding (cidade -> lat/lon)
  const geoUrl = "https://geocoding-api.open-meteo.com/v1/search";
  const geoResp = await axios.get(geoUrl, {
    timeout: 8000,
    params: {
      name: city,
      count: 5,
      language: "pt",
      format: "json",
    },
  });

  const results: GeoResult[] = geoResp.data?.results ?? [];
  if (!results.length) {
    const err = new Error("City not found in geocoding");
    (err as any).statusCode = 404;
    throw err;
  }

  // tenta escolher o melhor match (se state vier, tenta bater)
  const pick =
    (state
      ? results.find((r) => (r.admin1 || "").toLowerCase().includes(state.toLowerCase()))
      : undefined) ?? results[0];

  const { latitude, longitude } = pick;

  // 2) Forecast daily (probabilidade de precipitação)
  const forecastUrl = "https://api.open-meteo.com/v1/forecast";
  const forecastResp = await axios.get(forecastUrl, {
    timeout: 8000,
    params: {
      latitude,
      longitude,
      daily: "precipitation_probability_max,precipitation_sum",
      timezone: "America/Sao_Paulo",
      start_date: date,
      end_date: date,
    },
  });

  const daily = forecastResp.data?.daily;
  const prob = daily?.precipitation_probability_max?.[0]; // 0..100
  const sum = daily?.precipitation_sum?.[0]; // mm

  // regra do MVP: chuva se prob >= 50 OU precipitação prevista > 0
  const probability = typeof prob === "number" ? prob : 0;
  const precipitationMm = typeof sum === "number" ? sum : 0;

  const rainAlert = probability >= 50 || precipitationMm > 0;

  const summary = `Rain chance: ${probability}% | Expected precipitation: ${precipitationMm} mm`;

  return { rainAlert, summary, probability, precipitationMm, latitude, longitude };
}
