TeamsBalancer.IsAutoBalance = true;
const n = '\n', properties = [
   ['wins', 0], ['looses', 0]
], 
pidoras = 'C002224F3666744D|596D1288BD7F8CF7|C925816BE50844A9|9B94CBC25664BD6D|2F665AF97FA6F0EF|E24BE3448F7DF371|CBCE0678C099C56E';

const Add = function (tag, name, color, spawn) { 
   let team = Teams.Get(tag);
   Teams.Add ( 
   tag , 
     '<b><size=22>' + name.up.substring(0, 1) + '</size><size=17>' + name.up.substring(1) + '</size></b>' + n + '<size=17>' + name.down.substring(0, 1) + '</size>' + name.down.substring(1) ,
        Color (color)
   );
   team.Spawns.SpawnPointsGroups.Add(spawn);
   return team;
} 

const found = function (string, identifier, separator) {
   array = string.split(separator);
   for (var index = 0; index < array.length; index++) {
      if (identifier === array[index]) {
           return true;
              break; 
      }
   }  
}

const s = Properties.GetContext().Get('state'), main = Timers.GetContext().Get('main'), ui = Ui.GetContext(), sp = Spawns.GetContext(), p_props = [ 
   ['next', 35],
   ['experience', 0],
   ['level', 1],
   ['rank', 'новичёк']
];
sp.RespawnEnable = false;

const prop = function (par) 
{ 
   par.type.forEach(function (index) { par.context[index].Value = par.bool; }); 
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

const Another = function (p)
{
   if (p.Team == blue) return red;
   else return blue;
}

const Spawn = function () 
{
   let e = Teams.GetEnumerator ();
   while (e.MoveNext ()) e.Current.Spawns.Spawn();
}

contextedProperties.GetContext().MaxHp.Value = 35;
 
LeaderBoard.PlayerLeaderBoardValues = [
  { Value: 'Kills', ShortDisplayName: '<size=11.9><b>ᴋ</b></size>' },
  { Value: 'Deaths', ShortDisplayName: '<size=11.9><b>ᴅ</b></size>' },
];

ui.MainTimerId.Value = main.Id;  
  
const blue = Add ('blue', { up: 'спецназовцы ᵏⁿⁱᶠᵉᵉ', down: '' }, '#476AEC', 1),
red = Add ('red', { up: 'террористы ᵏⁿⁱᶠᵉᵉ', down: '' }, '#FE5757', 2);

Teams.OnRequestJoinTeam.Add(function (p, t)
{
   if (found (pidoras, p.Id, '|')) return p.Ui.Hint.Value = 'ты забанен.';   
   t.Add (p); 
});  

Teams.OnPlayerChangeTeam.Add(function (p) 
{
   if (s.Value == 'end') return;
   p.Spawns.Spawn ();
})

Properties.OnPlayerProperty.Add(function (c, v) 
{
   let p = c.Player, 
   nam = v.Name; 
   if (v.Name == 'experience' && p.Properties.Get('experience').Value > p.Properties.Get('next').Value) {
   p.Properties.Get('level').Value += 1;
   p.Properties.Get('next').Value += 19;
   }
   if (nam != 'info1') p.Team.Properties.Get('info1').Value = '<color=#FFFFFF>  Звание: ' + p.Properties.Get('rank').Value + '  ' + n + '' + n + '   level: ' + p.Properties.Get('level').Value + ', exp: ' + p.Properties.Get('experience').Value + ' <size=58.5>/ ' + p.Properties.Get('next').Value  + '</size></color>  '; // ------------------------
});

Spawns.OnSpawn.Add(function (p) 
{
   p.Properties.Immortality.Value = true;
   p.Timers.Get('immo').Restart(3);
   p.Ui.Hint.Reset();
   p.Ui.TeamProp2.Value = { Team: p.Team.Id, Prop: 'info1' };
   if (p.Properties.Get('&').Value) return;
   p.Properties.Get('level').Value = 1; 
   p.Properties.Get('next').Value = 35; 
   p.Properties.Get('experience').Value = 0; 
   p.Properties.Get('rank').Value = 'новичёк'; 
   p.Properties.Get('&').Value = true; 
});

Damage.OnDeath.Add(function (p) 
{
   Update (p), p.Properties.Get('Deaths').Value += 1;
});

Damage.OnKill.Add(function (p, vic) 
{
   if (vic.Team == p.Team) return;
   pos = Math.abs (p.PositionIndex.x - vic.PositionIndex.x + p.PositionIndex.y - vic.PositionIndex.y + p.PositionIndex.z - vic.PositionIndex.z);
   if (pos != 0) vic.Ui.Hint.Value = p.NickName + ' убил вас с расстояния ' + pos + ' блоков!';
   p.Properties.Get('Kills').Value += 1;  
   p.Team.Properties.Get('kills').Value += 1;  
   p.Properties.Get('experience').Value += pos - 1;
});  

Players.OnPlayerDisconnected.Add(function (p) 
{
   Update (p);
   p_props.forEach(function (cur) { Properties.GetContext().Get(cur[0] + p.Id).Value = p.Properties.Get(cur[0]).Value });
   Properties.GetContext().Get('&'+ p.Id).Value = p.Properties.Get('&').Value;
}); 

Players.OnPlayerConnected.Add(function (p) 
{
   p_props.forEach(function (cur) { p.Properties.Get(cur[0]).Value = Properties.GetContext().Get(cur[0] + p.Id).Value });   
   p.Properties.Get('&').Value = Properties.GetContext().Get('&'+ p.Id).Value;
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
   s.Value = 'game';
   sp.Despawn ();
   Spawn ();
   main.Restart (115); 
} 

const End = function (team)
{
   s.Value = 'end'; 
   if (team != null) 
   {
      team.Properties.Get('wins').Value += 1; 
      let e = Players.GetEnumerator(); 
      while (e.MoveNext()) {
          e.Current.Team == team ? e.Current.Properties.Get('Scores').Value += 1 : null;
      }
   }
   main.Restart (10); 
} 

BreackGraph.Damage = false, prop ({ 
  context: Inventory.GetContext(), type: ['Main', 'Secondary', 'Explosive', 'Build'], bool: false 
});

Game ();



properties.forEach(function (index) { 
   let e = Teams.GetEnumerator();
   while (e.MoveNext ()) {
       e.Current.Properties.Get(index[0]).Value = index[1];
   }
});
