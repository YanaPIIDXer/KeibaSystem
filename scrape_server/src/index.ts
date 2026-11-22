import { fetchHorseData } from './business/horse_data';
import { fetchRaceDetail } from './business/race_detail';
import { fetchRaceList } from './business/race_list';
import app from './server';

app.get('/race/list/:date', async (req, res) => {
  const response = await fetchRaceList(req.params.date);
  res.json(response);
});

app.get('/race/:id', async (req, res) => {
  const response = await fetchRaceDetail(req.params.id);
  console.log(response);
  res.json(response);
});

app.get('/horse/:id', async (req, res) => {
  const response = await fetchHorseData(req.params.id);
  res.json(response);
});

app.listen(3000, () => {
  console.log('Start Scrape Server');
});
