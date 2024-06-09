const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

// Configurar o middleware CORS
app.use(cors());

// Rota para obter a lista de aplicativos da Steam
app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/?key=C9B31D042AEDB38D20EE49A56D354BE1&type_filter=game');
    let listGames = response.data.applist.apps;

    // Mapear os dados para a estrutura definida na interface GamesProps
    const mappedGames = listGames.map(game => ({
      idGame: game.appid,
      name: game.name
    }));

    // Ordenar os jogos em ordem alfabética
    const sortedGames = mappedGames.sort((a, b) => a.name.localeCompare(b.name));

    // Enviar a resposta como JSON com a lista ordenada
    res.json({ sortedGames });
  } catch (error) {
    console.error('Erro ao obter lista de aplicativos da Steam:', error);
    res.status(500).json({ error: 'Erro ao obter lista de aplicativos da Steam' });
  }
});

app.get('/game/:id', async (req, res) => {
  try {
    const gameId = req.params.id
    const response = await axios.get(`http://store.steampowered.com/api/appdetails?appids=${gameId}`)
    res.json(response.data)
  }
  catch (error) {
    console.log(error)
  }
})


app.listen(port, () => {
  console.log(`Servidor proxy rodando em http://localhost:${port}`);
});
