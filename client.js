TeamsBalancer.IsAutoBalance = true;
const n = '\n', properties = [
   ['wins', 0], ['kills', 0]
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

const Prop = function (para) { 
   para.type.forEach(function (index) { para.context[index].Value = para.bool; }); 
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

properties.forEach(function (index) { 
   let e = Teams.GetEnumerator();
   while (e.MoveNext()) {
       e.Current.Properties.Get(index[0]).Value = index[1];
   }
});

const Rand = function (min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min; 
}

LeaderBoard.PlayerLeaderBoardValues = [
  { Value: 'Kills', ShortDisplayName: '<size=10><b>ᴋ</b></size>' },
  { Value: 'Deaths', ShortDisplayName: '<size=10><b>ᴅ</b></size>' },
];

const blue = Add ('blue', { up: 'спецназовцы ᵏⁿⁱᶠᵉᵉ', down: '' }, '#476AEC', 1),
red = Add ('red', { up: 'террористы ᵏⁿⁱᶠᵉᵉ', down: '' }, '#FE5757', 2);

Teams.OnRequestJoinTeam.Add(function (p, t) {
   if (found (pidoras, p.Id, '|')) return;
   else t.Add(p);
});  

Teams.OnPlayerChangeTeam.Add(function (p) {
   if (found (pidoras, p.Id, '|')) return;
   else p.Spawns.Spawn();
});

Spawns.OnSpawn.Add(function (p) {
   p.Properties.Immortality.Value = true, p.Timers.Get('immo').Restart(3);
});

Timers.OnPlayerTimer.Add(function (t) { 
   p = t.Player;
   switch (t.Id) {
   	case 'immo' :
       p.Properties.Immortality.Value = false; 
       break;
       case 'add' :
       if (blue.Count > red.Count) red.Add(p); 
           else if (red.Count > blue.Count) blue.Add(p);
                else return red.Add(p);
       break;     
   }
}); 

BreackGraph.Damage = false, Prop ({ 
   context: Inventory.GetContext(), type: ['Main', 'Secondary', 'Explosive', 'Build'], bool: false 
});

