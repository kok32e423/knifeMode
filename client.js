TeamsBalancer.IsAutoBalance = true;
const n = '\n', properties = [
   ['wins', 0], ['kills', 0]
], 
pidoras = 'C002224F3666744D|596D1288BD7F8CF7|C925816BE50844A9|9B94CBC25664BD6D|2F665AF97FA6F0EF|E24BE3448F7DF371|CBCE0678C099C56E';

const Add = function (tag, name, color, spawn) { 
   let team = Teams.Get(tag);
   Teams.Add( 
   tag , 
     '<b><size=23>' + name.up.substring(0, 1) + '</size><size=17>' + name.up.substring(1) + '</size></b>' + n + '<size=17>' + name.down.substring(0, 1) + '</size>' + name.down.substring(1) ,
        Hex (color)
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

const Hex = function (hex) {
   let hex = hex.replace ('#', ''), 
   max = 3;

   if (hex.length == max) hex = hex.replace (/(.)/g, '$1$1'), one = parseInt (hex.substring(0, 2), 16), two = parseInt (hex.substring(2, 4), 16), three = parseInt (hex.substring(4, 6), 16); 
   return { r: one / 255, g: two / 255, b: three / 255 };
}

BreackGraph.Damage = false; 