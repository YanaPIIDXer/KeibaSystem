import { fetchHorseData } from './business/horse_data';
import { fetchRaceList } from './business/race_list';
import app from './server';

app.get('/race/list/:date', async (req, res) => {
  const response = await fetchRaceList(req.params.date);
  res.json(response);
});

app.get('/horse/:id', async (req, res) => {
  const response = await fetchHorseData(req.params.id);
  res.json(response);
});

app.listen(3000, () => {
  console.log('Start Scrape Server');
});
