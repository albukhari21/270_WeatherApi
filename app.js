const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/lokasi", async (req, res) => {
  const kota = "jakarta";
  const apiKey = "TmW3n2IbOKaZxkghOoYB";
  const url = `https://api.maptiler.com/geocoding/${kota}.json?key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    const feature = data.features?.[0];

    if (!feature) {
      return res.status(404).json({ message: "Lokasi tidak ditemukan" });
    }

    const lokasi = feature.matching_text || kota;
    const koordinat = feature.center || null;

    return res.json({
      kota: lokasi,
      koordinat
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Gagal mengambil data dari MapTiler"
    });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
