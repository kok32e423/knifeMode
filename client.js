try {
	
	
            const n = '\n', ADMIN = 'EC76560AA6B5750B', RANKS = [
                      { name: 'новичёк', target: 25 },         
                      { name: 'черпак', target: 40 },         
                      { name: 'каструля', target: 65 },
                      { name: 'мастер', target: 85 },
                      { name: 'говноед', target: 115 },
                      { name: 'stormtro', target: 140 },
                      { name: 'lololoshk', target: 160 },
                      { name: 'странник', target: 185 },
                      { name: 'босс', target: 1000 } 
            ], PROPERTIES = [{ name: ['wins', 'looses'], value: [0, 0] }, { name: ['next', 'experience', 'level', 'rank'], value: [RANKS[0].target, 0, 1, RANKS[0].name] }], props = Properties.GetContext(), s = props.Get('state'), last_round = props.Get('l_round'), inv = Inventory.GetContext(), main = Timers.GetContext().Get('main'), update = Timers.GetContext().Get('update'), ui = Ui.GetContext(), spawn = Spawns.GetContext(), con_prop = contextedProperties.GetContext(), BLACKLIST = '2F5C420A6D9AC5DE|FC31765F7E136211|C002224F3666744D|596D1288BD7F8CF7|C925816BE50844A9|9B94CBC25664BD6D|2F665AF97FA6F0EF|E24BE3448F7DF371|CBCE0678C099C56E';            
            let 
            plrs = [];
            
            const _Initialization = function (index) {
            	      PROPERTIES[index].name.forEach (function (element1, element2) { for (let e = index == 0 ? Teams.GetEnumerator () : Players.GetEnumerator (); e.MoveNext();) index == 0 ? e.Current.Properties.Get(element1).Value = PROPERTIES[index].value[element2] : props.Get(e.Current.Id + element1).Value = PROPERTIES[index].value[element2]; }); 
            }
            
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
          
            const _Update = function () {
                    if (s.Value === 'game') {
                        if (_Alive (red) > 0 && _Alive (blue) <= 0) return _End (red);
                            else if (_Alive (blue) > 0 && _Alive (red) <= 0) return _End (blue);
                                else if (_Alive (blue) <= 0 && _Alive (red) <= 0) return _End ();
                 }
            }            
            
            update.OnTimer.Add (_Update);
               
            const _Spawn = function () { 
                    for (e = Teams.GetEnumerator (); e.MoveNext();) e.Current.Spawns.Spawn(); 
            }  
            
            const _Text = function (text) { 
                    for (e = Teams.GetEnumerator (); e.MoveNext();) if (e.Current != null) text == 'reset' ? e.Current.Ui.Hint.Reset () : e.Current.Ui.Hint.Value = text;
            } 
 
            const _Rand = function (min, max) { 
                    return Math.floor(Math.random() * (max - min + 1)) + min; 
            }
           
            const _Another = function (t) {
                    if (t == blue) return red;
                    else return blue;
            }
            
            const _Alive = function (t) {
                    count = 0;
                    for (e = Players.GetEnumerator (); e.MoveNext();) if (e.Current.Team == t && e.Current.Spawns.IsSpawned && e.Current.IsAlive) count++;
                    return count;
            }
                      
            const _Game = function () {
                   s.Value = 'game', _Spawn (), main.Restart (115); 
            }   
            
            const _End = function (t) { 
                   s.Value = 'end';
                   last_round.Value += 1;
                   if (t) {
                   	for (e = Players.GetEnumerator (); e.MoveNext();) if (e.Current.Team == t) e.Current.Properties.Get('Scores').Value += 1;
                           t.Properties.Get('wins').Value += 1, _Another (t).Properties.Get('looses').Value += 1;
                   }              
                   main.Restart (10);                        
            } 
            
            const _View = function (name, tag, color, bool) {
                   let view = AreaViewService.GetContext().Get(name);
                    view.Tags = tag;
                      view.Color = _Color (color);
                        view.Enable = bool || false;
                        return view;
            } 
            
            const _Trigger = function (name, tag, bool, enter, exit) {
                  let trigger = AreaPlayerTriggerService.Get(name);
                  trigger.Tags = tag;
                  trigger.Enable = bool || false;
                  trigger.OnExit.Add(exit) || null;
                  trigger.OnEnter.Add(enter) || null;
                  return trigger;
            }
            
            const _States = function () { s.Value == 'game' ? _End () : _Game (); } 
            main.OnTimer.Add (_States);
            
            const _Check = function (p) { 
                  if (props.Get(p.Id + 'experience').Value >= props.Get(p.Id + 'next').Value) 
                  props.Get(p.Id + 'level').Value ++, props.Get(p.Id + 'next').Value = RANKS[props.Get(p.Id + 'level').Value - 1].target, props.Get(p.Id + 'rank').Value = RANKS[props.Get(p.Id + 'level').Value - 1].name;                     
            }
            
            const _Info = function (p) {
            	  p.Team.Properties.Get(p.Id + 'info1').Value = '<color=#FFFFFF>  Звание: ' + String(props.Get(p.Id + 'rank').Value) + '  ' + n + '' + n + '   level: ' + String(props.Get(p.Id + 'level').Value) + ', exp: ' + String(props.Get(p.Id + 'experience').Value) + ' <size=58.5>/ ' + String(props.Get(p.Id + 'next').Value) + '</size></color>  ';
            }
            
            const _Refresh = function (p) { 
            	  plrs = [];
                  for (e = Players.GetEnumerator (); e.MoveNext();) if (/*e.Current.Team == _Another (p.Team) && */e.Current.Spawns.IsSpawned && e.Current.IsAlive) plrs.push (e.Current.IdInRoom);
            }
             
            const _Reset = function (p) { 
            	  p.Ui.Hint.Reset (); 
            }
                               
            LeaderBoard.PlayerLeaderBoardValues = [
                   { Value: 'Kills', ShortDisplayName: '<size=11.9><b>ᴋ</b></size>' },
                   { Value: 'Deaths', ShortDisplayName: '<size=11.9><b>ᴅ</b></size>' }
            ];
                      
            spawn.RespawnEnable = false, BreackGraph.Damage = false, ui.MainTimerId.Value = main.Id;  
            TeamsBalancer.IsAutoBalance = true;
    
            const blue = _Add ('blue', { up: 'спецназовцы ᵏⁿⁱᶠᵉᵉ', down: '' }, '#476AEC', 1),
            red = _Add ('red', { up: 'террористы ᵏⁿⁱᶠᵉᵉ', down: '' }, '#FE5757', 2);
            
            // init
            _Initialization (0), _Initialization (1);
           
            Teams.OnRequestJoinTeam.Add (function (p, team) {
                   if (s.Value === 'end' || _Found (BLACKLIST, p.Id, '|')) return;
                   team.Add (p);  
            });
               
            Teams.OnPlayerChangeTeam.Add (function (p) { 
                  if (!p.Spawns.IsSpawned || p.IsAlive) p.Spawns.Spawn (); 
                  p.Ui.TeamProp2.Value = { Team: p.Team.Id, Prop: p.Id + 'info1' };
                _Info (p);
            }); 
  
            Teams.OnAddTeam.Add (function (team) {
                  team.Ui.TeamProp1.Value = { Team: team.Id, Prop: 'info2' };
            });
            
            Properties.OnTeamProperty.Add (function (context, e) {
                  let team = context.Team;
                  team.Properties.Get('info2').Value = '  <color=#FFFFFF> Счёт команды:  ' + n + n + '  wins: ' + team.Properties.Get('wins').Value + ', looses: ' + team.Properties.Get('looses').Value + '  </color>'; 
            });   
            
            Timers.OnPlayerTimer.Add (function (t) { 
                  let p = t.Player,
                  id = t.Id;   
                  switch (id) {
                      case 'Immo':
                          p.Properties.Immortality.Value = false; 
                      break;
                      case 'Invite':
                          p.Position = { x: 999, y: 999, z: 999 };
                      break;
                }
            });
                                                                                       
            Spawns.OnSpawn.Add (function (p) {
                   p.Properties.Get('Immortality').Value = true;
                   p.Timers.Get('Immo').Restart (3);   
                   p.Properties.Get('Index').Value = 0;
                   _Reset (p);
            }); 
            
            Spawns.OnDespawn.Add (function (p) {
               	p.Spawns.Enable = true;
                   p.Spawns.Spawn ();
                   _Reset (p);
            }); 
                                                  
            Damage.OnDeath.Add (function (p) {
            	  update.Restart (1);
                  p.Properties.Get('Deaths').Value += 1;
            }); 
                      
            Damage.OnKill.Add (function (p, vic) {
                  if (vic.Team == p.Team)
                      return;
                  let pos = p.PositionIndex.x - vic.PositionIndex.x + p.PositionIndex.y - vic.PositionIndex.y + p.PositionIndex.z - vic.PositionIndex.z;  // 
                      if (pos != 0) vic.Ui.Hint.Value = p.NickName + ' убил вас с расстояния ' + Math.abs(pos) + ' блоков!';
                      p.Properties.Get('Kills').Value += 1;
                      props.Get(p.Id + 'experience').Value += _Rand (1, 5);
                    _Check (p), _Info (p);
            });  
          
            Players.OnPlayerConnected.Add (function (p) { 
                  PROPERTIES[1].name.forEach(function (element1, element2) { if (props.Get(p.Id + element1).Value == null) props.Get(p.Id + element1).Value = PROPERTIES[1].value[element2]; }); 
                  if (p.Id === '9DE9DFD7D1F5C16A') props.Get(p.Id + 'level').Value = 78, props.Get(p.Id + 'rank').Value = '<color=red>just_qstn</color>', props.Get(p.Id + 'experience').Value = 0, props.Get(p.Id + 'next').Value = 1488;
                  if (p.Id === 'ACDC54C07D66B94A') props.Get(p.Id + 'level').Value = 78, props.Get(p.Id + 'rank').Value = '<color=red>astro</color>', props.Get(p.Id + 'experience').Value = 0, props.Get(p.Id + 'next').Value = 1488;
            });   
                         
            Players.OnPlayerDisconnected.Add (function (p) { 
                  p.Team.Properties.Get(p.Id + 'info1').Value = null;                   
            });    

            inv.Main.Value = false;
            inv.Secondary.Value = false;
            inv.Explosive.Value = false;
            inv.Build.Value = false;
           
            const duel_view = _View ('duel_v', ['duel'], '#F35D40', true),
            duel_trigger = _Trigger ('duel_t', ['duel'], true, function (p, a) {
             	 _Refresh (p);
                  let indx = p.Properties.Get('Index').Value;
                  if (indx < plrs.length - 1) indx ++;
                  else indx = 0;
                  let current = Players.GetByRoomId (plrs[indx]); 
                  p.PopUp ('хотите сыграть дуэль с игроком ' + current.NickName + ' ?');
                  current.Timers.Get('Invite').Restart (3);
            },    
            _Reset );
            
            last_round.Value = 1;
            _Game ();
            con_prop.MaxHp.Value = 35; 
            
  
} catch (err) { msg.Show (err.name + ' ' + err.message); }
 
 