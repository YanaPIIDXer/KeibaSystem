import { fetchHorseData } from './business';
import app from './server';

app.get('/horse/:id', async (req, res) => {
  const response = await fetchHorseData(req.params.id);
  res.json(response);
});

app.listen(3000, () => {
  console.log('Start Scrape Server');
});
