import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

// Permitir cualquier origen
app.use(cors({ origin: '*' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/who', async (req, res) => {
  const { indicator, country, year } = req.query;
  if (!indicator || !country) {
    return res.status(400).json({ error: 'Faltan parámetros: indicator y country' });
  }

  let url = `https://ghoapi.azureedge.net/api/${encodeURIComponent(indicator)}?$filter=SpatialDim eq '${encodeURIComponent(country)}'`;
  if (year) {
    url += ` and TimeDim eq ${encodeURIComponent(year)}`;
  }

  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log(`✅ Proxy WHO en http://localhost:3000/who`));