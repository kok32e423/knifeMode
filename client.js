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

const Color = function (hex) {
   let hex = hex.replace ('#', ''), 
   max = 3;
  
   if (hex.length == max) hex = hex.replace (/(.)/g, '$1$1');
   r = parseInt (hex.substring(0, 2), 16), g = parseInt (hex.substring(2, 4), 16), b = parseInt (hex.substring(4, 6), 16);

   return { r: r / 255, g: g / 255, b: b / 255 };
}

var two = Add('two', { up: 'красные', down: 'за короля!' }, '#336b42', 2);

BreackGraph.Damage = false; 