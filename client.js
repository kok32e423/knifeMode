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
            ], P_PROPERTIES = { NAMES: ['next', 'experience', 'level', 'rank'], VALUES: [RANKS[0].exp, 0, 1, RANKS[0].name] }, props = Properties.GetContext(), state = props.Get('state'), last_round = props.Get('lzt_round'), main = Timers.GetContext().Get('main'), ui = Ui.GetContext(), spawn = Spawns.GetContext(), con_prop = contextedProperties.GetContext(), BLACKLIST = 'C002224F3666744D|596D1288BD7F8CF7|C925816BE50844A9|9B94CBC25664BD6D|2F665AF97FA6F0EF|E24BE3448F7DF371|CBCE0678C099C56E', ADMIN_ID = 'EC76560AA6B5750B';
         
            const _Add = function (tag, name, color, spawn) {    	
                      let team = Teams.Get (tag);
                      Teams.Add (tag, '<b><size=22>' + name.up.substring(0, 1) + '</size><size=17>' + name.up.substring(1) + '</size></b>' + n + '<size=17>' + name.down.substring(0, 1) + '</size>' + name.down.substring(1), _Color (color));
                      team.Spawns.SpawnPointsGroups.Add(spawn);
                      return team;
            }   
         
            const _Color = function (h) { 
                      let hex = h.replace ('#', ''), 
                      max = 3; 
   
                      hex.length == max ? hex = hex.replace (/(.)/g, '$1$1') : null; 
                      return { r : parseInt (hex.substring(0, 2), 16) / 255, g : parseInt (hex.substring(2, 4), 16) / 255, b : parseInt (hex.substring(4, 6), 16) / 255 }      
            }
         
            const _Found = function (string, identifier, separator) {
                     array = string.split (separator);
                     for (var index = 0; index < array.length; index++) {
                         if (identifier === array[index]) {
                               return true;
                                  break; 
                      }
                 }  
            }
            
            const _Update = function (p) {
                	if (state.Value != 'game') return;
                    if (p.Team.GetAlivePlayersCount() == 0 && _Another(p.Team).GetAlivePlayersCount() > p.Team.GetAlivePlayersCount()) return End (_Another(p.Team));
                    if (p.Team.GetAlivePlayersCount() == 0 && _Another(p.Team).GetAlivePlayersCount() == 0) return End (null);
            }
                  
            const _Spawn = function () { 
                    for (let e = Teams.GetEnumerator(); e.MoveNext();) e.Current.Spawns.Spawn(); 
            } 
 
            const _Rand = function (min, max) { 
                    return 
                         Math.floor(Math.random() * (max - min + 1)) + min; 
            }
          
            const _Another = function (t) {
                   if (t == blue) return red;
                   else return 
                           blue;
            }
            
            spawn.RespawnEnable = false, BreackGraph.Damage = false, ui.MainTimerId.Value = main.Id;  
         
            LeaderBoard.PlayerLeaderBoardValues = [
                   { Value: 'Kills', ShortDisplayName: '<size=11.9><b>ᴋ</b></size>' },
                   { Value: 'Deaths', ShortDisplayName: '<size=11.9><b>ᴅ</b></size>' }
            ];
            
            const blue = _Add ('blue', { up: 'спецназовцы ᵏⁿⁱᶠᵉᵉ', down: '' }, '#476AEC', 1),
            red = _Add ('red', { up: 'террористы ᵏⁿⁱᶠᵉᵉ', down: '' }, '#FE5757', 2);
            
            Teams.OnRequestJoinTeam.Add (function (p, t) {
                   if (state.Value == 'end' || _Found (BLACKLIST, p.Id, '|')) return;
                   t.Add (p);  
            });
               
            Teams.OnPlayerChangeTeam.Add (function (p) { p.Spawns.Spawn (), p.Team.Properties.Get(p.Id + 'info1').Value = '<color=#FFFFFF>  Звание: ' + String(props.Get(p.Id + 'rank').Value) + '  ' + n + '' + n + '   level: ' + String(props.Get(p.Id + 'level').Value) + ', exp: ' + String(props.Get(p.Id + 'experience').Value) + ' <size=58.5>/ ' + String(props.Get(p.Id + 'next').Value) + '</size></color>  ', p.Ui.TeamProp2.Value = { Team: p.Team.Id, Prop: p.Id + 'info1' }; });     
            
            Teams.OnAddTeam.Add (function (t) { 
            	   PROPERTIES.NAMES.forEach (function (name, index) { t.Properties.Get(name).Value = PROPERTIES.VALUES[index]; });
                   t.Ui.TeamProp1.Value = { Team: t.Id, Prop: 'info2' };               
            });
                     
            Properties.OnTeamProperty.Add (function (context, e) {
                   let t = context.Team;
                   t.Properties.Get('info2').Value = '  <color=#FFFFFF> Счёт команды:  ' + n + n + '  wins: ' + t.Properties.Get('wins').Value + ', looses: ' + t.Properties.Get('looses').Value + '  </color>'; 
            });                                                                       
           
            Timers.OnPlayerTimer.Add (function (t) { 
                  let p = t.Player,
                  id = t.Id;   
                  switch (id) {
                        case 'Immo':
                            p.Properties.Immortality.Value = false; 
                        break;
                 }
            });                    
            
            Spawns.OnSpawn.Add (function (p) {
              	p.Ui.Hint.Reset ();
                  p.Properties.Get('Immortality').Value = true;
                  p.Timers.Get('Immo').Restart (3);   
            }); 
                   
            Damage.OnDeath.Add (function (p) {
            	  _Update (p);
                  p.Properties.Get('Deaths').Value += 1;
            }); 
            
            Damage.OnKill.Add (function (p, vic) {
                  if (vic.Team == p.Team)
                        return;
                   let pos = p.PositionIndex.x - vic.PositionIndex.x + p.PositionIndex.y - vic.PositionIndex.y + p.PositionIndex.z - vic.PositionIndex.z;   
                        if (pos != 0) vic.Ui.Hint.Value = p.NickName + ' убил вас с расстояния ' + Math.abs(pos) + ' блоков!';
                        p.Properties.Get('Kills').Value += 1;
                        props.Get(p.Id + 'experience').Value += Math.abs(pos) <= 3 ? _Rand(2, 5) : (Math.abs(pos) + _Rand(1, 3));
                        if (props.Get(p.Id + 'experience').Value >= props.Get(p.Id + 'next').Value) props.Get(p.Id + 'level').Value ++, props.Get(p.Id + 'next').Value = RANKS[props.Get(p.Id + 'level').Value - 1].exp, props.Get(p.Id + 'rank').Value = RANKS[props.Get(p.Id + 'level').Value - 1].name, p.PopUp('Ты достиг уровня:' + props.Get(p.Id + 'level').Value + '!\nтвоё звание теперь: ' + props.Get(p.Id + 'rank').Value);
                        p.Team.Properties.Get(p.Id + 'info1').Value = '<color=#FFFFFF>  Звание: ' + String(props.Get(p.Id + 'rank').Value) + '  ' + n + '' + n + '   level: ' + String(props.Get(p.Id + 'level').Value) + ', exp: ' + String(props.Get(p.Id + 'experience').Value) + ' <size=58.5>/ ' + String(props.Get(p.Id + 'next').Value) + '</size></color>  ';            
            });  
            
            Players.OnPlayerConnected.Add (function (p) { P_PROPERTIES.NAMES.forEach(function (name, index) { if (props.Get(p.Id + name).Value == null) props.Get(p.Id + name).Value = P_PROPERTIES.VALUES[index]; }); }); 
       
            main.OnTimer.Add (function () {
                  	switch (state.Value) {
                             case 'game': 
                              _End (null);
                             break;
                             case 'end':        
                              _Game ();
                             break;
                 }
            });
            
            last_round.Value = 0;
              
            const _Game = function () {
                   state.Value = 'game';
                   Spawn ();
                   last_round.Value ++;
                   ui.Hint.Value = n + '..:: round - ' + last_round.Value + ' ::..';
                   main.Restart (115); 
            }   
 
            const _End = function (team) { 
                   state.Value = 'end', ui.Hint.Reset (), main.Restart (10);          
                   if (team != null) {
                   for (let e = Players.GetEnumerator(); e.MoveNext();) {
                          if (e.Current.Team == team) e.Current.Properties.Get('Scores').Value += 1;
                          team.Properties.Get('wins').Value += 1, Another(team).Properties.Get('looses').Value += 1;      
                   }
               }
           } 
             
           ['Main', 'Secondary', 'Explosive', 'Build'].forEach (function (el) { Inventory.GetContext()[el].Value = false; });
           _Game ();
           con_prop.MaxHp.Value = 35; 
         
           P_PROPERTIES.NAMES.forEach (function (name, indx) { for (let e = Players.GetEnumerator(); e.MoveNext();) props.Get(e.Current.Id + name).Value = P_PROPERTIES.VALUES[indx]; });
            
                 
} catch (err) { msg.Show (err.name + ' ' + err.message); }
 
 