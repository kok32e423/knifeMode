try {
	
 
         const n = '\n', PROPERTIES = { NAMES: ['wins', 'looses'], VALUES: [0, 0] }, RANKS = [
             { name: 'черпак', exp: 25 },         
             { name: 'каструля', exp: 40 },
             { name: 'мастер', exp: 65 },
             { name: 'говноед', exp: 85 },
             { name: 'stormtro', exp: 115 },
             { name: 'lololoshk', exp: 140 },
             { name: 'странник', exp: 160 },
             { name: 'босс', exp: 185 }
         ], P_PROPERTIES = { NAMES: ['next', 'experience', 'level', 'rank'], VALUES: [RANKS[0].exp, 0, 1, 'новичёк'] }, prop = Properties.GetContext(), s = prop.Get('state'), main = Timers.GetContext().Get('main'), ui = Ui.GetContext(), spawn = Spawns.GetContext(), c_prop = contextedProperties.GetContext(), BLACKLIST = 'C002224F3666744D|596D1288BD7F8CF7|C925816BE50844A9|9B94CBC25664BD6D|2F665AF97FA6F0EF|E24BE3448F7DF371|CBCE0678C099C56E', ADMIN_ID = 'EC76560AA6B5750B';
        
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
            { Value: 'Deaths', ShortDisplayName: '<size=11.9><b>ᴅ</b></size>' },
         ];

         Teams.OnRequestJoinTeam.Add (function (p, t) 
         {
             if (s.Value == 'end' || found (BLACKLIST, p.Id, '|')) return;
             if (p.Team == null) {
                      P_PROPERTIES.NAMES.forEach (function (name, el) {
                          let arr = prop.Get(p.Id + 'saved').Value;
                          p.Properties.Get(name).Value = arr [el];
                     });                             
             }
             t.Add (p);    
         });
         
         Teams.OnPlayerChangeTeam.Add (function (p) { p.Ui.TeamProp2.Value = { Team: p.Team.Id, Prop: p.Id + 'info1' }, p.Spawns.Spawn (); });           
         Teams.OnAddTeam.Add (function (t) { t.Ui.TeamProp1.Value = { Team: t.Id, Prop: 'info2' }; });
         
         P_PROPERTIES.NAMES.forEach (function (name, el) { for (let e = Players.GetEnumerator (); e.MoveNext();) e.Current.Properties.Get(name).Value = P_PROPERTIES.VALUES[el]; });  
         PROPERTIES.NAMES.forEach (function (name, el) { for (let e = Teams.GetEnumerator (); e.MoveNext();) e.Current.Properties.Get(name).Value = PROPERTIES.VALUES[el]; });
                                         
         Properties.OnPlayerProperty.Add (function (context, e) 
         {
             let p = context.Player;
             p.Team.Properties.Get(p.Id + 'info1').Value = '<color=#FFFFFF>  Звание: ' + p.Properties.Get('rank').Value + '  ' + n + '' + n + '   level: ' + p.Properties.Get('level').Value + ', exp: ' + p.Properties.Get('experience').Value + ' <size=58.5>/ ' + p.Properties.Get('next').Value + '</size></color>  ';
             if (e.Name == 'experience' && e.Value >= p.Properties.Get('next').Value) 
             p.Properties.Get('level').Value += 1,
             p.Properties.Get('next').Value = RANKS[p.Properties.Get('level').Value - 1].exp,
             p.Properties.Get('rank').Value = RANKS[p.Properties.Get('level').Value - 2].name || RANKS[p.Properties.Get('level').Value - 1].name;       
         }); 
         
         Properties.OnTeamProperty.Add (function (context, e) 
         {
             let t = context.Team;
             t.Properties.Get('info2').Value = '<color=#FFFFFF>Счёт команды:' + n + n + 'wins: ' + t.Properties.Get('wins').Value + ', looses: ' + t.Properties.Get('looses').Value + '</color>'; 
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
        
        Damage.OnDeath.Add(function (p) 
        {
            Update (p);
            p.Properties.Get('Deaths').Value += 1;
            p.Properties.Get('experience').Value += 25;
        }); 
        
        Damage.OnKill.Add(function (p, vic) 
        {
           if (vic.Team == p.Team) return;
           pos = p.PositionIndex.x - vic.PositionIndex.x + p.PositionIndex.y - vic.PositionIndex.y + p.PositionIndex.z - vic.PositionIndex.z;
           if (pos != 0) vic.Ui.Hint.Value = p.NickName + ' убил вас с расстояния ' + Math.abs (pos) + ' блоков!';
           p.Properties.Get('Kills').Value += 1;
           p.Properties.Get('experience').Value += Rand (2, 8);
       });  

       Players.OnPlayerDisconnected.Add(function (p) 
       {   
          Update (p);        
          let arr = [];
          P_PROPERTIES.NAMES.forEach (function (name) {
             arr.push (p.Properties.Get(name).Value);
          });
          prop.Get(p.Id + 'saved').Value = arr;
       }); 

       Players.OnPlayerConnected.Add(function (p) 
       { 
          //
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
 
 