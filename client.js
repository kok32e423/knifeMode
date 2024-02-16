try {

       /*  𝖐𝖓𝖎𝖋𝖊 | резня - 2 0 2 4 | ver 1.0f.
	        -----------------------------------
	        mode for Pixel Combats 2.
	        by me   */

    const n = '\n', ADMIN = 'EC76560AA6B5750B',
        RANKS = [
            {
                name: 'новичёк',
                target: 25
            },
            {
                name: 'черпак',
                target: 45
            },
            {
                name: 'каструля',
                target: 60
            },
            {
                name: 'чайник',
                target: 89
            },
            {
                name: 'говноед',
                target: 115
            },
            {
                name: 'жидктор',
                target: 145
            },
            {
                name: 'мастер',
                target: 160
            },
            {
                name: 'mr.krieg',
                target: 195
            },
            {
                name: 'танкито',
                target: 215
            },
            {
                name: 'storm',
                target: 245
            },
            {
                name: 'фраер',
                target: 278
            },
            {
                name: 'саймон',
                target: 325
            },
            {
                name: 'loshka',
                target: 360
            },
            {
                name: 'странник',
                target: 395
            },
            {
                name: 'босс',
                target: '∞'
            }
        ],
        PROPERTIES = [{
            name: ['wins', 'looses'],
            value: [0, 0]
        }, {
            name: ['next', 'experience', 'level', 'rank'],
            value: [RANKS[0].target, 0, 1, RANKS[0].name]
        }],
        prop = Properties.GetContext(),
        state = prop.Get('state'),
        round = prop.Get('round'),
        locked = prop.Get('locked').Value,
        duel = prop.Get('duel').Value,
        inv = Inventory.GetContext(),
        main = Timers.GetContext().Get('main'),
        mode = Timers.GetContext().Get('mode'),
        update = Timers.GetContext().Get('update'),
        spawn = Spawns.GetContext(),
        con_prop = contextedProperties.GetContext(),
        BLACKLIST = '2F5C420A6D9AC5DE|FC31765F7E136211|C002224F3666744D|596D1288BD7F8CF7|C925816BE50844A9|9B94CBC25664BD6D|2F665AF97FA6F0EF|E24BE3448F7DF371|CBCE0678C099C56E|3F24586B534D937D';
    let
        plrs = [];

    const _Initialization = function(index) {
        PROPERTIES[index].name.forEach(function(element1, element2) {
            for (let e = index == 0 ? Teams.GetEnumerator() : Players.GetEnumerator(); e.MoveNext();) index == 0 ? e.Current.Properties.Get(element1).Value = PROPERTIES[index].value[element2] : prop.Get(e.Current.Id + element1).Value = PROPERTIES[index].value[element2];
        });
    }

    const _Add = function(identifier, name, color, spawn) {
        let team = Teams.Get(identifier);
        Teams.Add(identifier, '<b><size=20>' + name.up.substring(0, 1) + '</size><size=17>' + name.up.substring(1) + '</size></b>' + n + '<size=17>' + name.down.substring(0, 1) + '</size>' + name.down.substring(1), _Color(color));
        team.Spawns.SpawnPointsGroups.Add(spawn);
        return team;
    }

    const _Color = function(string) {
        let hex = string.replace('#', ''),
            max = 3;

        hex.length == max ? hex = hex.replace(/(.)/g, '$1$1') : null;
        return {
            r: parseInt(hex.substring(0, 2), 16) / 255,
            g: parseInt(hex.substring(2, 4), 16) / 255,
            b: parseInt(hex.substring(4, 6), 16) / 255
        }
    }

    const _Found = function(string, identifier, separator) {
        array = string.split(separator);
        for (var index = 0; index < array.length; index++) {
            if (identifier === array[index]) {
                return true;
                break;
            }
        }
    }

    const _Update = function() {
        if (state.Value !== 'game') return;
            if (_Alive(red) > 0 && _Alive(blue) <= 0) return _End(red);
            else if (_Alive(blue) > 0 && _Alive(red) <= 0) return _End(blue);
            else if (_Alive(blue) <= 0 && _Alive(red) <= 0) return _End();
    }

    update.OnTimer.Add(_Update);

    const _Spawn = function() {
        for (e = Players.GetEnumerator(); e.MoveNext();) if (e.Current.Spawns.IsSpawned && !e.Current.Inventory.Secondary.Value) e.Current.Spawns.Spawn();
    }

    const _Text = function(text) {
        for (e = Teams.GetEnumerator(); e.MoveNext();)
            if (e.Current != null) text == 'reset' ? e.Current.Ui.Hint.Reset() : e.Current.Ui.Hint.Value = text;
    }

    const _Rand = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const _Another = function(t) {
        if (t == blue) return red;
        else return blue;
    }

    const _Alive = function(t) {
        count = 0;
        for (e = Players.GetEnumerator(); e.MoveNext();)
            if (e.Current.Team == t && e.Current.Spawns.IsSpawned && e.Current.IsAlive) count++;
        return count;
    }

    round.Value = 360;

    const _Game = function() {
        state.Value = 'game';
        _Spawn();
        main.Restart(115);
    }

    const _End = function(t) {
        state.Value = 'end';
        round.Value--;
        if (t) {
            for (e = Players.GetEnumerator(); e.MoveNext();)
                if (e.Current.Team == t) e.Current.Properties.Get('Scores').Value += 1;
            t.Properties.Get('wins').Value += 1, _Another(t).Properties.Get('looses').Value += 1;
        }
        main.Restart(5);
    }

    const _View = function(name, tag, color, bool) {
        let view = AreaViewService.GetContext().Get(name);
        view.Tags = tag;
        view.Color = _Color(color);
        view.Enable = bool || false;
        return view;
    }

    const _Trigger = function(name, tag, bool, enter, exit) {
        let trigger = AreaPlayerTriggerService.Get(name);
        trigger.Tags = tag;
        trigger.Enable = bool || false;
        trigger.OnExit.Add(exit) || null;
        trigger.OnEnter.Add(enter) || null;
        return trigger;
    }

    const _States = function() {
        state.Value == 'game' ? _End() : _Game();
    }

    main.OnTimer.Add(_States);

    const _Show = function(p) {
        if (prop.Get(p.Id + 'experience').Value >= prop.Get(p.Id + 'next').Value && prop.Get(p.Id + 'rank').Value != RANKS[RANKS.length - 1].name) prop.Get(p.Id + 'level').Value++, prop.Get(p.Id + 'next').Value = RANKS[prop.Get(p.Id + 'level').Value - 1].target, prop.Get(p.Id + 'rank').Value = RANKS[prop.Get(p.Id + 'level').Value - 1].name, p.contextedProperties.MaxHp.Value += 5;
        p.Team.Properties.Get(p.Id + 'info1').Value = '<color=#FFFFFF>  Звание: ' + String(prop.Get(p.Id + 'rank').Value) + '  ' + n + '' + n + '   level: ' + String(prop.Get(p.Id + 'level').Value) + ', exp: ' + String(prop.Get(p.Id + 'experience').Value) + ' <size=58.5>/ ' + String(prop.Get(p.Id + 'next').Value) + '</size></color>  ';
    }

    const _Refresh = function(t) {
        plrs = [];
        for (e = Players.GetEnumerator(); e.MoveNext();)
            if (e.Current.Team == t && e.Current.Spawns.IsSpawned && e.Current.IsAlive && !e.Current.Properties.Get('inarea').Value && !e.Current.Inventory.Secondary.Value) plrs.push(e.Current.IdInRoom);
    }

    const _Reset = function(p) {
        p.Ui.Hint.Reset();
    }

    const _Skin = function(p) {
        if (p.Team != red) return p.contextedProperties.SkinType.Value = 0;
        random = _Rand(1, 3);
        if (random != 3) return p.contextedProperties.SkinType.Value = 0;
        p.contextedProperties.SkinType.Value = 2;
    }

    LeaderBoard.PlayerLeaderBoardValues = [{
            Value: 'Kills',
            ShortDisplayName: '<size=11.9><b>ᴋ</b></size>'
        },
        {
            Value: 'Deaths',
            ShortDisplayName: '<size=11.9><b>ᴅ</b></size>'
        }
    ];

    LeaderBoard.TeamWeightGetter.Set(function(team) {
        return team.Properties.Get('looses').Value;
    });

    LeaderBoard.PlayersWeightGetter.Set(function(p) {
        return p.Properties.Get('Kills').Value;
    });

    spawn.RespawnEnable = false, BreackGraph.Damage = false, Ui.GetContext().MainTimerId.Value = main.Id;
    TeamsBalancer.IsAutoBalance = true;

    const blue = _Add('blue', {
            up: 'спецназовцы ᵏⁿⁱᶠᵉᵉ',
            down: ''
        }, '#7351FF', 1),
        red = _Add('red', {
            up: 'террористы ᵏⁿⁱᶠᵉᵉ',
            down: ''
        }, '#FF2C7B', 2);

    // init
    _Initialization(1);

    Teams.OnRequestJoinTeam.Add(function(p, team) {
        if (state.Value === 'end' || _Found(BLACKLIST, p.Id, '|')) return;
        team.Add(p);
        p.Properties.Get('index').Value = 0;
    });

    Teams.OnPlayerChangeTeam.Add(function(p) {
        if (!p.Spawns.IsSpawned || p.IsAlive) p.Spawns.Spawn();
        p.Ui.TeamProp2.Value = {
            Team: p.Team.Id,
            Prop: p.Id + 'info1'
        };
        _Show(p);
        _Skin(p);
    });

    Teams.OnAddTeam.Add(function(team) {
        _Initialization(0);
        team.Properties.Get('info2').Value = '  <color=#FFFFFF> Счёт команды:  ' + n + n + '  wins: ' + team.Properties.Get('wins').Value + ', looses: ' + team.Properties.Get('looses').Value + '  </color>';
        team.Ui.TeamProp1.Value = {
            Team: team.Id,
            Prop: 'info2'
        };
    });

    Properties.OnTeamProperty.Add(function(context, value) {
        team = context.Team;
        if (value.Name === 'wins' || value.Name === 'looses') team.Properties.Get('info2').Value = '  <color=#FFFFFF> Счёт команды:  ' + n + n + '  wins: ' + team.Properties.Get('wins').Value + ', looses: ' + team.Properties.Get('looses').Value + '  </color>';
    });

    BreackGraph.OnOptions.Add(function() {
        if (BreackGraph.Damage) BreackGraph.Damage = false;
    });

    Timers.OnPlayerTimer.Add(function(t) {
        let p = t.Player,
            id = t.Id;
        switch (id) {
            case 'Immo':
                p.Properties.Immortality.Value = false;
                break;
            case 'invite':
                if (p.Properties.Get('inarea').Value) p.Properties.Get('1').Value = true, p.Ui.Hint.Value = 'приглашение на дуэль отправлено!';
                else p.Properties.Get('2').Value = true, p.SetPositionAndRotation({ x: 91, y: 12, z: 48 }, { x: 0, y: 0 }), p.Ui.Hint.Value = 'вам пришло приглашение на дуэль!';
                break;
        }
    });

    Spawns.OnSpawn.Add(function(p) {
        p.Properties.Get('Immortality').Value = true;
        p.Properties.Get('inarea').Value = false;
        p.Timers.Get('Immo').Restart(3);
        _Reset(p);
        if (p.Inventory.Secondary.Value) p.Inventory.Secondary.Value = false;
    });

    Spawns.OnDespawn.Add(function(p) {
        p.Spawns.Enable = true;
        p.Spawns.Spawn();
        _Reset(p);
    });

    Damage.OnDeath.Add(function(p) {
        update.Restart(1);
        p.Properties.Get('Deaths').Value += 1;
    });

    Damage.OnKill.Add(function(p, vic) {
        if (vic.Team == p.Team) return;
        pos = p.Position.x - vic.Position.x + p.Position.y - vic.Position.y + p.Position.z - vic.Position.z; // 
        if (pos != 0 && pos <= 13) vic.Ui.Hint.Value = p.NickName + ' убил вас с расстояния ' + Math.abs(pos.toFixed(2)) + ' блоков!';
        p.Properties.Get('Kills').Value += 1;
        prop.Get(p.Id + 'experience').Value += _Rand(2, 6);
        _Show(p);
        if (vic.Inventory.Secondary.Value) p.Spawns.Spawn();
    });

    Players.OnPlayerConnected.Add(function(p) {
        PROPERTIES[1].name.forEach(function(element1, element2) {
            if (prop.Get(p.Id + element1).Value == null) prop.Get(p.Id + element1).Value = PROPERTIES[1].value[element2];
        });
    });

    Players.OnPlayerDisconnected.Add(function(p) {
        p.Team.Properties.Get(p.Id + 'info1').Value = null;
    });

    inv.Main.Value = false;
    inv.Secondary.Value = false;
    inv.Explosive.Value = false;
    inv.Build.Value = false;
    
    const inv_red_v = _View('inv_red_v', ['inv_red_tr'], '#FFD966', true),
    inv_red_tr = _Trigger('inv_red_tr', ['inv_red_tr'], true, function (p, a) {
    	if (locked || state.Value === 'end') return;
    	_Refresh (red);
        index = p.Properties.Get('index');
        if (index.Value < plrs.length - 1) index.Value++;
        else index.Value = 0;
        p2 = Players.GetByRoomId(plrs[index.Value]);
        p.Timers.Get('invite').Restart(5), p2.Timers.Get('invite').Restart(5);
        p.Ui.Hint.Value = 'ждите 5 сек чтобы отправить приглашение на дуэль игроку: ' + p2.NickName;
        p.Properties.Get('inarea').Value = true;
        locked = true;
    }, function (p, a) {
    	if (p.Properties.Get('inarea').Value) {
            locked = false;
            p.Timers.Get('invite').Stop();
            p2.Timers.Get('invite').Stop();
            p.Properties.Get('inarea').Value = false;
        }
        _Reset(p);
    }),
    accept_v = _View('accept_v', ['accept'], '#ADF4C2', true),
    accept_tr = _View('accept_tr', ['accept'], true, function (p, a) {
        for (e = Players.GetEnumerator(); e.MoveNext();) {
        	if (e.Current.Properties.Get('1').Value) e.Current.Inventory.Secondary.Value = true, e.Current.SetPositionAndRotation({ x: 122, y: 14, z: 40 }, { x: 0, y: - 90 }), e.Current.Properties.Get('1').Value = false;
            if (e.Current.Properties.Get('2').Value) e.Current.Inventory.Secondary.Value = true, e.Current.SetPositionAndRotation({ x: 116, y: 14, z: 82 }, { x: 0, y: 90 }), e.Current.Properties.Get('2').Value = false;
        }
    }),
    decline_v = _View('decline_v', ['decline'], '#BF3952', true),
    decline_tr = _View('decline_tr', ['decline'], true, function (p, a) {
        for (e = Players.GetEnumerator(); e.MoveNext();) {
        	if (e.Current.Properties.Get('1').Value) e.Current.Spawns.Spawn(), e.Current.Properties.Get('1').Value = false, e.Current.Ui.Hint.Value = 'приглашение отклонено!';
            if (e.Current.Properties.Get('2').Value) e.Current.Spawns.Spawn(), e.Current.Properties.Get('2').Value = false, e.Current.Ui.Hint.Value = 'приглашение отклонено!';
        }
    }); 

    _Game();
    con_prop.MaxHp.Value = 35;

} catch (err) {
    msg.Show(err.name + ' ' + err.message);
}