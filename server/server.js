const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const fetch = require('node-fetch');

const apiKey = '3dd8e1898b3ed7eab5dd0ee539a601d8';
const baseUrl = 'https://fortnite-api.theapinetwork.com';

app.get('/stats/:platform/:id', (request, response) => {
  getUserStats(request.params.id, request.params.platform)
    .then(data => response.json(data));
});

function getUserStats(username, platform) {
  return getUserId(username)
    .then(userId => {
      return fetch(`${baseUrl}/users/public/br_stats?user_id=${userId}&platform=${platform}`, { headers: { 'Authorization': apiKey }})
        .then(response => response.json())
        .then(data => {
          return getFilteredStats(data);
        })
    });
}

function getUserId(username) {
  return fetch(`${baseUrl}/users/id?username=${username}`, { headers: { 'Authorization': apiKey }})
    .then(response => response.json())
    .then(data => data.data.uid);
}

function getFilteredStats(data) {
  console.log(data);
  let stats = data.stats;

  return {
    username: data.username,
    stats: {
      total: {
        kills: data.totals.kills,
        wins: data.totals.wins,
        matchesPlayed: data.totals.matchesplayed,
        winRate: data.totals.winrate,
        kd: data.totals.kd
      },
      solos: {
        kills: stats.kills_solo,
        wins: stats.placetop1_solo,
        matchesPlayed: stats.matchesplayed_solo,
        winRate: stats.winrate_solo,
        kd: stats.kd_solo
      },
      duos: {
        kills: stats.kills_duo,
        wins: stats.placetop1_duo,
        matchesPlayed: stats.matchesplayed_duo,
        winRate: stats.winrate_duo,
        kd: stats.kd_duo
      },
      squads: {
        kills: stats.kills_squad,
        wins: stats.placetop1_squad,
        matchesPlayed: stats.matchesplayed_squad,
        winRate: stats.winrate_squad,
        kd: stats.kd_squad
      }
    }
  };
}

app.listen(port, () => {
  console.log('Running server on port ' + port);
})