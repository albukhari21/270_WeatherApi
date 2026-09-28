const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Melayani file statis dari folder public maupun root
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname));

// Helper deskripsi cuaca berdasarkan WMO code
function getWeatherDescription(code) {
  const codes = {
    0: { desc: "Cerah", icon: "☀️" },
    1: { desc: "Cerah Berawan", icon: "🌤️" },
    2: { desc: "Sebagian Berawan", icon: "⛅" },
    3: { desc: "Berawan Tebal", icon: "☁️" },
    45: { desc: "Berkabut", icon: "🌫️" },
    48: { desc: "Kabut Tebal", icon: "🌫️" },
    51: { desc: "Gerimis Ringan", icon: "🌦️" },
    53: { desc: "Gerimis Sedang", icon: "🌧️" },
    55: { desc: "Gerimis Lebat", icon: "🌧️" },
    61: { desc: "Hujan Ringan", icon: "🌧️" },
    63: { desc: "Hujan Sedang", icon: "🌧️" },
    65: { desc: "Hujan Deras", icon: "⛈️" },
    80: { desc: "Hujan Singkat", icon: "🌦️" },
    81: { desc: "Hujan Sedang", icon: "🌧️" },
    82: { desc: "Hujan Lebat", icon: "⛈️" },
    95: { desc: "Badai Petir", icon: "⚡" },
    96: { desc: "Badai Petir & Es", icon: "⛈️" },
    99: { desc: "Badai Petir Kuat", icon: "⛈️" }
  };
  return codes[code] || { desc: "Berawan", icon: "⛅" };
}

app.get("/api/lokasi", async (req, res) => {
  const kota = req.query.kota;
  const latQuery = req.query.lat;
  const lonQuery = req.query.lon;
  const apiKey = "TmW3n2IbOKaZxkghOoYB";

  let url = "";
  if (latQuery && lonQuery) {
    // Reverse geocoding berdasarkan koordinat latitude & longitude
    url = `https://api.maptiler.com/geocoding/${encodeURIComponent(lonQuery)},${encodeURIComponent(latQuery)}.json?key=${apiKey}`;
  } else {
    // Forward geocoding berdasarkan nama kota/lokasi
    const targetKota = kota || "Jakarta";
    url = `https://api.maptiler.com/geocoding/${encodeURIComponent(targetKota)}.json?key=${apiKey}`;
  }

  try {
    const response = await axios.get(url);
    const data = response.data;
    const feature = data.features?.[0];

    if (!feature) {
      return res.status(404).json({
        status: "error",
        message: `Lokasi '${kota || `${latQuery},${lonQuery}`}' tidak ditemukan.`
      });
    }

    const [lon, lat] = feature.center || [null, null];

    // Ekstraksi konteks wilayah (negara, provinsi, kabupaten, kecamatan)
    const countryObj = feature.context?.find(c => c.id.startsWith("country"));
    const regionObj = feature.context?.find(c => c.id.startsWith("region"));
    const countyObj = feature.context?.find(c => c.id.startsWith("county"));
    const subdistrictObj = feature.context?.find(c =>
      c.id.startsWith("joint_municipality") ||
      c.id.startsWith("subdistrict") ||
      c.id.startsWith("district") ||
      c.id.startsWith("locality")
    );

    const negara = countryObj ? countryObj.text : (feature.place_type?.includes("country") ? feature.text : "Indonesia");
    const provinsi = regionObj ? regionObj.text : (feature.place_type?.includes("region") ? feature.text : "-");
    const kabupaten = countyObj ? countyObj.text : (feature.place_type?.includes("county") ? feature.text : "-");

    let kecamatan = "-";
    if (feature.place_type?.includes("joint_municipality") || feature.place_type?.includes("locality") || feature.place_type?.includes("subdistrict")) {
      kecamatan = feature.text;
    } else if (subdistrictObj) {
      kecamatan = subdistrictObj.text;
    } else if (kabupaten !== "-" && feature.text !== kabupaten) {
      kecamatan = feature.text;
    }

    // Ambil data cuaca (suhu, kondisi, kelembaban, angin) dari Open-Meteo Weather API
    let suhu = "-";
    let kondisi = "Tidak Diketahui";
    let icon = "🌡️";
    let kelembaban = "-";
    let kecepatanAngin = "-";

    if (lat !== null && lon !== null) {
      try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
        const weatherRes = await axios.get(weatherUrl);
        const current = weatherRes.data?.current;
        if (current) {
          suhu = current.temperature_2m;
          kelembaban = current.relative_humidity_2m;
          kecepatanAngin = current.wind_speed_10m;
          const weatherMeta = getWeatherDescription(current.weather_code);
          kondisi = weatherMeta.desc;
          icon = weatherMeta.icon;
        }
      } catch (weatherErr) {
        console.warn("Gagal mengambil data cuaca:", weatherErr.message);
      }
    }

    return res.json({
      status: "success",
      query: kota || `${lat}, ${lon}`,
      lokasi: feature.place_name || feature.text || (kota || "Lokasi Saat Ini"),
      kota: feature.text || kota,
      negara,
      provinsi,
      kecamatan,
      kabupaten,
      suhu,
      kondisi,
      icon,
      kelembaban,
      kecepatan_angin: kecepatanAngin,
      longitude: lon,
      latitude: lat,
      koordinat: [lon, lat]
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil data dari MapTiler / Weather API"
    });
  }
});

// Alias /api/cuaca
app.get("/api/cuaca", (req, res) => {
  const kota = req.query.kota || "Jakarta";
  res.redirect(`/api/lokasi?kota=${encodeURIComponent(kota)}`);
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
