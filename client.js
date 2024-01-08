try {
	
	 // константы.
    const n = '\n', PROPERTIES = [
       ['wins', 0], ['looses', 0]
    ], PLAYER_PROPS = [ 
       ['next', 25],
       ['experience', 0],
       ['level', 1],
       ['rank', '-']
   ], PROPS = Properties.GetContext(), s = PROPS.Get('state'), main = Timers.GetContext().Get('main'), ui = Ui.GetContext(), sp = Spawns.GetContext(), BLACKLIST = 'C002224F3666744D|596D1288BD7F8CF7|C925816BE50844A9|9B94CBC25664BD6D|2F665AF97FA6F0EF|E24BE3448F7DF371|CBCE0678C099C56E';
    
    // параметры.
   sp.RespawnEnable = false, TeamsBalancer.IsAutoBalance = true, ui.MainTimerId.Value = main.Id, contextedProperties.GetContext().MaxHp.Value = 35, BreackGraph.Damage = false;
    
    // инструменты.
   const Add = function (tag, name, color, spawn) { 
          let team = Teams.Get (tag);
          Teams.Add (tag, '<b><size=22>' + name.up.substring(0, 1) + '</size><size=17>' + name.up.substring(1) + '</size></b>' + n + '<size=17>' + name.down.substring(0, 1) + '</size>' + name.down.substring(1), Color (color));
          team.Spawns.SpawnPointsGroups.Add (spawn);
          return team;
   }
    
   const Found = function (string, identifier, separator) {
         let array = string.split(separator);
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
  
         hex.length == max ? hex = hex.replace (/(.)/g, '$1$1') : null; 
         return { r : parseInt (hex.substring(0, 2), 16) / 255, g : parseInt (hex.substring(2, 4), 16) / 255, b : parseInt (hex.substring(4, 6), 16) / 255 }
   }
    
    /*
    const Update = function (p) {
         if (s.Value != 'game') return;
     
    }
    */
    const Another = function (p) {
         if (p.Team == one) return two;
         else return one;
    }
        
    const Spawn = function () { for (let e = Teams.GetEnumerator(); e.MoveNext();) e.Current.Spawns.Spawn(); }

     LeaderBoard.PlayerLeaderBoardValues = [
        { Value: 'Kills', ShortDisplayName: '<size=11.9><b>ᴋ</b></size>' },
        { Value: 'Deaths', ShortDisplayName: '<size=11.9><b>ᴅ</b></size>' }
    ];

    // создание команд.
    const one = Add ('blue', { up: 'спецназовцы ᵏⁿⁱᶠᵉᵉ', down: '' }, '#476AEC', 1),
    two = Add ('red', { up: 'террористы ᵏⁿⁱᶠᵉᵉ', down: '' }, '#FE5757', 2);
    
   
    // события.
    Teams.OnRequestJoinTeam.Add(function (p, t) {
        if (Found (BLACKLIST, p.Id, '|')) return p.Ui.Hint.Value = 'ты забанен.';   
        t.Add (p);    
    });  
    
    
    // инициализация.
    //['Main', 'Secondary', 'Explosive', 'Build'].forEach(function (indx) { Inventory.GetContext() [indx].Value = false; });

    PROPERTIES.forEach(function (indx) { 
        for (let e = Teams.GetEnumerator(); e.MoveNext();) e.Current.Properties.Get(indx[0]).Value = indx[1];  
    });
 
