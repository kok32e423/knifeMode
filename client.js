try {
	
 
         const n = '\n', PROPERTIES = { NAMES: ['wins', 'looses'], VALUES: [0, 0] }, RANKS = [
             { name: 'новичёк', exp: 25 },         
             { name: 'черпак', exp: 40 },         
             { name: 'каструля', exp: 65 },
             { name: 'мастер', exp: 85 },
             { name: 'говноед', exp: 115 },
             { name: 'stormtro', exp: 140 },
             { name: 'lololoshk', exp: 160 },
             { name: 'странник', exp: 185 },
             { name: 'босс', exp: 1000 }
         ], P_PROPERTIES = { NAMES: ['next', 'experience', 'level', 'rank'], VALUES: [RANKS[0].exp, 0, 1, RANKS[0].name] }, Prop = Properties.GetContext(), s = Prop.Get('state'), main = Timers.GetContext().Get('main'), ui = Ui.GetContext(), spawn = Spawns.GetContext(), c_prop = contextedProperties.GetContext(), BLACKLIST = 'C002224F3666744D|596D1288BD7F8CF7|C925816BE50844A9|9B94CBC25664BD6D|2F665AF97FA6F0EF|E24BE3448F7DF371|CBCE0678C099C56E', ADMIN_ID = 'EC76560AA6B5750B';
        
         const Add = function (tag, name, color, spawn)
         {    	
             let team = Teams.Get (tag);
             Teams.Add (tag, '<b><size=22>' + name.up.substring(0, 1) + '</size><size=17>' + name.up.substring(1) + '</size></b>' + n + '<size=17>' + name.down.substring(0, 1) + '</size>' + name.down.substring(1), Color (color));
             team.Spawns.SpawnPointsGroups.Add(spawn);
             return team;
         } 
         
         const Color = function (hex)
         { 
             let hex = hex.replace ('#', ''), 
             max = 3;
  
             hex.length == max ? hex = hex.replace (/(.)/g, '$1$1') : null; 
             return {
                 r : parseInt (hex.substring(0, 2), 16) / 255, g : parseInt (hex.substring(2, 4), 16) / 255, b : parseInt (hex.substring(4, 6), 16) / 255 
             }
         }
         
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
                     
         const Update = function (p) 
         {
            if (s.Value != 'game') return;
            if (p.Team.GetAlivePlayersCount() == 0 && Another(p.Team).GetAlivePlayersCount() > p.Team.GetAlivePlayersCount()) return End (Another(p.Team));
            if (p.Team.GetAlivePlayersCount() == 0 && Another(p.Team).GetAlivePlayersCount() == 0) return End (null);
         }
                  
         const Spawn = function () 
         { 
            for (let e = Teams.GetEnumerator(); e.MoveNext();) e.Current.Spawns.Spawn(); 
         } 
 
         const Rand = function (min, max) 
         { 
            return Math.floor(Math.random() * (max - min + 1)) + min; 
         }
          
         const Another = function (t)
         {
            if (t == blue) return red;
            else return blue;
         }
         
         spawn.RespawnEnable = false, TeamsBalancer.IsAutoBalance = true, ui.MainTimerId.Value = main.Id;  
         
         const blue = Add ('blue', { up: 'спецназовцы ᵏⁿⁱᶠᵉᵉ', down: '' }, '#476AEC', 1),
         red = Add ('red', { up: 'террористы ᵏⁿⁱᶠᵉᵉ', down: '' }, '#FE5757', 2);
              
         LeaderBoard.PlayerLeaderBoardValues = [
            { Value: 'Kills', ShortDisplayName: '<size=11.9><b>ᴋ</b></size>' },
            { Value: 'Deaths', ShortDisplayName: '<size=11.9><b>ᴅ</b></size>' }
         ];

         Teams.OnRequestJoinTeam.Add (function (p, t) 
         {
             if (s.Value == 'end' || found (BLACKLIST, p.Id, '|')) return;
             t.Add (p);    
         });
         
         Teams.OnPlayerChangeTeam.Add (function (p) { p.Ui.TeamProp2.Value = { Team: p.Team.Id, Prop: p.Id + 'info1' }, p.Spawns.Spawn (); });     
         Teams.OnAddTeam.Add (function (t) { t.Ui.TeamProp1.Value = { Team: t.Id, Prop: 'info2' }; });
         
         //P_PROPERTIES.NAMES.forEach (function (name, el) { for (let e = Players.GetEnumerator(); e.MoveNext();) e.Current.Properties.Get(name).Value = P_PROPERTIES.VALUES[el]; });   
         PROPERTIES.NAMES.forEach (function (name, el) { for (let e = Teams.GetEnumerator(); e.MoveNext();) e.Current.Properties.Get(name).Value = PROPERTIES.VALUES[el]; });
           
         Players.OnPlayerDisconnected.Add (function () 
         {
         	p.Team.Properties.Get(p.Id + 'info1').Value = null;
         });
                                                                          
         Properties.OnTeamProperty.Add (function (context, e) 
         {
             let t = context.Team;
             t.Properties.Get('info2').Value = '<color=#FFFFFF>Счёт команды:' + n + n + 'wins: ' + t.Properties.Get('wins').Value + ', looses: ' + t.Properties.Get('looses').Value + '</color>'; 
         });
         
         Properties.OnPlayerProperty.Add (function (context, e) 
         {
         	/*
             let p = context.Player,
                level = p.Team.Properties.Get (p.Id + 'level').Value, rank = p.Team.Properties.Get (p.Id + 'rank').Value, next = p.Team.Properties.Get (p.Id + 'next').Value,
             experience = p.Team.Properties.Get (p.Id + 'experience').Value;   
             
             p.Team.Properties.Get(p.Id + 'info1').Value = '<color=#FFFFFF>  Звание: ' + String(rank) + '  ' + n + '' + n + '   level: ' + String(level) + ', exp: ' + String(experience) + ' <size=58.5>/ ' + String(next) + '</size></color>  ';
             */
         });
    
         Timers.OnPlayerTimer.Add (function (t) 
         { 
             let p = t.Player,
             id = t.Id;   
             switch (id) {
                 case 'Im' :
                    p.Properties.Immortality.Value = false; 
                 break;
            }
         }); 
        
         Spawns.OnSpawn.Add (function (p) 
         {
            p.Properties.Get('Immortality').Value = true;
            p.Timers.Get('Im').Restart (3);   
            p.Ui.Hint.Reset ();
        });
        
        Damage.OnDeath.Add (function (p) 
        {
            Update (p);
            p.Properties.Get('Deaths').Value += 1;
            p.Team.Properties.Get(p.Id + 'experience').Value += 25;
        }); 
        
        Damage.OnKill.Add (function (p, vic) 
        {
           if (vic.Team == p.Team)
               return;
           let pos = p.PositionIndex.x - vic.PositionIndex.x + p.PositionIndex.y - vic.PositionIndex.y + p.PositionIndex.z - vic.PositionIndex.z,             
                if (pos != 0) vic.Ui.Hint.Value = p.NickName + ' убил вас с расстояния ' + Math.abs (pos) + ' блоков!';
                p.Properties.Get('Kills').Value += 1;
       });  
       
       main.OnTimer.Add (function () {
      	switch (s.Value) {
              case 'game' : 
              End (null);
              break;
              case 'end' :        
              Game ();
              break;
          }
      });
                 
      const Game = function ()
      {
          s.Value = 'game';
          Spawn ();
          main.Restart (115); 
      } 

      const End = function (t)
      { 
          s.Value = 'end', main.Restart (10); 
          if (t != null) {
          for (let e = Players.GetEnumerator(); e.MoveNext();) if (e.Current.Team == t) e.Current.Properties.Get('Scores').Value += 1;
              t.Properties.Get('wins').Value += 1, Another(t).Properties.Get('looses').Value += 1;      
          }
      } 
             
      BreackGraph.Damage = false, ['Main', 'Secondary', 'Explosive', 'Build'].forEach(function (el) { Inventory.GetContext()[el].Value = false; });
      Game ();
      c_prop.MaxHp.Value = 35; 
         
                  
} catch (e) { msg.Show (e.name + ' ' + e.message); }
 
 