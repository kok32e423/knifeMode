
const n = '\n', PROPERTIES = { NAMES: ['wins', 'looses'], VALUES: [0, 0] }, RANKS = [
     { name: 'черпак', target: 25 },         
     { name: 'каструля', target: 40 },
     { name: 'мастер', target: 65 },
     { name: 'говноед', target: 85 },
     { name: 'stormtro', target: 115 },
     { name: 'странник', target: 140 }
],  P_PROPS = { NAMES: ['next', 'experience', 'level', 'rank'], VALUES: [RANKS[0].target, 0, 1, 'новичёк'] }, PROP = Properties.GetContext(), s = PROP.Get('state'), main = Timers.GetContext().Get('main'), ui = Ui.GetContext(), sp = Spawns.GetContext(), CON = contextedProperties.GetContext(), BLACKLIST = 'C002224F3666744D|596D1288BD7F8CF7|C925816BE50844A9|9B94CBC25664BD6D|2F665AF97FA6F0EF|E24BE3448F7DF371|CBCE0678C099C56E';

const Add = function (tag, name, color, spawn) 
{ 
   let team = Teams.Get(tag);
   Teams.Add (tag, '<b><size=22>' + name.up.substring(0, 1) + '</size><size=17>' + name.up.substring(1) + '</size></b>' + n + '<size=17>' + name.down.substring(0, 1) + '</size>' + name.down.substring(1), Color (color));
   team.Spawns.SpawnPointsGroups.Add(spawn);
   return team;
} 

sp.RespawnEnable = false, TeamsBalancer.IsAutoBalance = true;

const found = function (string, identifier, separator) 
{
   array = string.split (separator);
   for (var index = 0; index < array.length; index++) {
      if (identifier === array[index]) {
           return true;
              break; 
      }
   }  
}

const Inv = function (el) 
{ 
   el.type.forEach(function (name) { el.context [name].Value = el.bool; }); 
}

const Color = function (hex) 
{
   let hex = hex.replace ('#', ''), 
   max = 3;
  
   hex.length == max ? hex = hex.replace (/(.)/g, '$1$1') : null; 
   return {
      r : parseInt (hex.substring(0, 2), 16) / 255, g : parseInt (hex.substring(2, 4), 16) / 255, b : parseInt (hex.substring(4, 6), 16) / 255 
   };
}

const Rand = function (min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min; 
}

const Update = function (p) 
{
   if (s.Value != 'game') return;
   if (p.Team.GetAlivePlayersCount() == 0 && Another(p.Team).GetAlivePlayersCount() > p.Team.GetAlivePlayersCount()) return End (Another(p.Team));
   if (p.Team.GetAlivePlayersCount() == 0 && Another(p.Team).GetAlivePlayersCount() == 0) return End (null);
}

const Another = function (t)
{
   if (t == blue) return red;
   else return blue;
}

const Spawn = function () 
{
   for (let e = Teams.GetEnumerator(); e.MoveNext();) e.Current.Spawns.Spawn(); 
}
 
LeaderBoard.PlayerLeaderBoardValues = [
  { Value: 'Kills', ShortDisplayName: '<size=11.9><b>ᴋ</b></size>' },
  { Value: 'Deaths', ShortDisplayName: '<size=11.9><b>ᴅ</b></size>' },
];

ui.MainTimerId.Value = main.Id;  
  
const blue = Add ('blue', { up: 'спецназовцы ᵏⁿⁱᶠᵉᵉ', down: '' }, '#476AEC', 1),
red = Add ('red', { up: 'террористы ᵏⁿⁱᶠᵉᵉ', down: '' }, '#FE5757', 2);

Teams.OnRequestJoinTeam.Add(function (p, t) {
   if (s.Value == 'end' || found (BLACKLIST, p.Id, '|')) return;
   t.Add (p);    
});  

Teams.OnPlayerChangeTeam.Add(function (p) {
   p.Spawns.Spawn();
   p.Team.Ui.TeamProp1.Value = { Team: p.Team.Id, Prop: 'info2' };
   p.Ui.TeamProp2.Value = { Team: p.Team.Id, Prop: p.Id + 'info1' };
})

Properties.OnPlayerProperty.Add(function (c, v) {
   let p = c.Player, nam = v.Name; 
   if (nam != 'info1') p.Team.Properties.Get(p.Id + 'info1').Value = '<color=#FFFFFF>  Звание: ' + p.Properties.Get('rank').Value + '  ' + n + '' + n + '   level: ' + p.Properties.Get('level').Value + ', exp: ' + p.Properties.Get('experience').Value + ' <size=58.5>/ ' + p.Properties.Get('next').Value  + '</size></color>  '; // ------------------------
});

Properties.OnTeamProperty.Add(function (c, v) {
   let t = c.Team, nam = v.Name; 
   if (nam != 'info2') t.Properties.Get('info2').Value = '<color=#FFFFFF>Счёт команды:' + n + n + 'wins: ' + t.Properties.Get('wins').Value + ', looses: ' + t.Properties.Get('looses').Value + '</color>'; 
});

Spawns.OnSpawn.Add(function (p) 
{
   p.Properties.Immortality.Value = true;
   p.Timers.Get('immo').Restart (3);
   p.Ui.Hint.Reset ();
});

Damage.OnDeath.Add(function (p) 
{
   Update (p), p.Properties.Get('Deaths').Value += 1;
});

Damage.OnKill.Add(function (p, vic) 
{
   if (vic.Team == p.Team) return;
   pos = p.PositionIndex.x - vic.PositionIndex.x + p.PositionIndex.y - vic.PositionIndex.y + p.PositionIndex.z - vic.PositionIndex.z;
   if (pos != 0) vic.Ui.Hint.Value = p.NickName + ' убил вас с расстояния ' + Math.abs (pos) + ' блоков!';
   p.Properties.Get('Kills').Value += 1;  
   p.Properties.Get('experience').Value += Math.abs (pos);
   p.Team.Properties.Get('kills').Value += 1; 
});  

Players.OnPlayerDisconnected.Add(function (p) 
{
   Update (p);
}); 

Timers.OnPlayerTimer.Add(function (t) { 
   let p = t.Player,
   id = t.Id;   
   switch (id) {
        case 'immo' :
        p.Properties.Immortality.Value = false; 
        break;
   }
}); 

const Main = function () {
   switch (s.Value) {
        case 'game' : 
        End (null);
        break;
        case 'end':        
        Game ();
        break;
   }
}

main.OnTimer.Add(function () {
   Main (); 
});

const Game = function ()
{
   s.Value = 'game', Spawn ();
   main.Restart (115); 
} 

const End = function (team)
{
   s.Value = 'end'; 
   if (team != null) 
   {
       for (let e = Players.GetEnumerator(); e.MoveNext();) if (e.Current.Team == team) e.Current.Properties.Get('Scores').Value += 1;
       team.Properties.Get('wins').Value += 1, Another(team).Properties.Get('looses').Value += 1;
   }
   main.Restart (10); 
} 

BreackGraph.Damage = false, Inv ({ 
  context: Inventory.GetContext(), type: ['Main', 'Secondary', 'Explosive', 'Build'], bool: false 
});

Game ();

PROPERTIES.NAMES.forEach(function (prop, el) { 
  for (let e = Teams.GetEnumerator(); e.MoveNext();) e.Current.Properties.Get(prop).Value = PROPERTIES.VALUES[el];  
});

Map.OnLoad.Add(function () 
{
    P_PROPS.NAMES.forEach(function (prop, el) { 
        for (let e = Players.GetEnumerator(); e.MoveNext();) e.Current.Properties.Get(prop).Value = P_PROPS.VALUES[el];
    });
});

CON.MaxHp.Value = 35;