try {

      /*  𝖐𝖓𝖎𝖋𝖊 | резня - 2 0 2 4.
	        ----------------------------------
	        mode for Pixel Combats 2.
	        by me  */

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
                name: 'мастер',
                target: 115
            },
            {
                name: 'говноед',
                target: 145
            },
            {
                name: 'жидктор',
                target: 160
            },
            {
                name: 'mr.krieg',
                target: 195
            },
            {
                name: 'storm',
                target: 215
            },
            {
                name: 'фраер',
                target: 245
            },
            {
                name: 'саймон',
                target: 278
            },
            {
                name: 'loshka',
                target: 325
            },
            {
                name: 'странник',
                target: 360
            },
            {
                name: 'босс',
                target: '∞'
            }
        ],
        Properties.GetContext()ERTIES = [{
            name: ['wins', 'looses'],
            value: [0, 0]
        }, {
            name: ['next', 'experience', 'level', 'rank'],
            value: [RANKS[0].target, 0, 1, RANKS[0].name]
        }],
        state = Properties.GetContext()erties.GetContext().Get('state'),
        inv = Inventory.GetContext(),
        main = Timers.GetContext().Get('main'),
        update = Timers.GetContext().Get('update'),
        ui = Ui.GetContext(),
        spawn = Spawns.GetContext(),
        con_Properties.GetContext() = contextedProperties.GetContext()erties.GetContext(),
        BLACKLIST = '2F5C420A6D9AC5DE|FC31765F7E136211|C002224F3666744D|596D1288BD7F8CF7|C925816BE50844A9|9B94CBC25664BD6D|2F665AF97FA6F0EF|E24BE3448F7DF371|CBCE0678C099C56E';
    let
        plrs = [];

    const _Initialization = function(index) {
        Properties.GetContext()ERTIES[index].name.forEach(function(element1, element2) {
            for (let e = index == 0 ? Teams.GetEnumerator() : Players.GetEnumerator(); e.MoveNext();) index == 0 ? e.Current.Properties.GetContext()erties.Get(element1).Value = Properties.GetContext()ERTIES[index].value[element2] : Properties.GetContext().Get(e.Current.Id + element1).Value = Properties.GetContext()ERTIES[index].value[element2];
        });
    }

    const _Add = function(tag, name, color, spawn) {
        let team = Teams.Get(tag);
        Teams.Add(tag, '<b><size=22>' + name.up.substring(0, 1) + '</size><size=17>' + name.up.substring(1) + '</size></b>' + n + '<size=17>' + name.down.substring(0, 1) + '</size>' + name.down.substring(1), _Color(color));
        team.Spawns.SpawnPointsGroups.Add(spawn);
        return team;
    }

    const _Color = function(h) {
        let hex = h.replace('#', ''),
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
        if (state.Value === 'game') {
            if (_Alive(red) > 0 && _Alive(blue) <= 0) return _End(red);
            else if (_Alive(blue) > 0 && _Alive(red) <= 0) return _End(blue);
            else if (_Alive(blue) <= 0 && _Alive(red) <= 0) return _End();
        }
    }

    update.OnTimer.Add(_Update);

    const _Spawn = function() {
        for (e = Teams.GetEnumerator(); e.MoveNext();) e.Current.Spawns.Spawn();
    }

    const _Text = function(txt) {
        for (e = Teams.GetEnumerator(); e.MoveNext();)
            if (e.Current != null) txt == 'reset' ? e.Current.Ui.Hint.Reset() : e.Current.Ui.Hint.Value = txt;
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

    const _Game = function() {
        s.Value = 'game', _Spawn(), main.Restart(115);
    }

    const _End = function(t) {
        s.Value = 'end';
        if (t) {
            for (e = Players.GetEnumerator(); e.MoveNext();)
                if (e.Current.Team == t) e.Current.Properties.GetContext()erties.Get('Scores').Value += 1;
            t.Properties.GetContext()erties.Get('wins').Value += 1, _Another(t).Properties.GetContext()erties.Get('looses').Value += 1;
        }
        main.Restart(10);
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
        s.Value == 'game' ? _End() : _Game();
    }
    
    main.OnTimer.Add(_States);

    const _Show = function(p) {
        if (Properties.GetContext().Get(p.Id + 'experience').Value >= Properties.GetContext().Get(p.Id + 'next').Value && Properties.GetContext().Get(p.Id + 'rank').Value != RANKS[RANKS.length - 1].name) Properties.GetContext().Get(p.Id + 'level').Value++, Properties.GetContext().Get(p.Id + 'next').Value = RANKS[Properties.GetContext().Get(p.Id + 'level').Value - 1].target, Properties.GetContext().Get(p.Id + 'rank').Value = RANKS[Properties.GetContext().Get(p.Id + 'level').Value - 1].name, p.contextedProperties.GetContext()erties.MaxHp.Value += 2;
        p.Team.Properties.GetContext()erties.Get(p.Id + 'info1').Value = '<color=#FFFFFF>  Звание: ' + String(Properties.GetContext().Get(p.Id + 'rank').Value) + '  ' + n + '' + n + '   level: ' + String(Properties.GetContext().Get(p.Id + 'level').Value) + ', exp: ' + String(Properties.GetContext().Get(p.Id + 'experience').Value) + ' <size=58.5>/ ' + String(Properties.GetContext().Get(p.Id + 'next').Value) + '</size></color>  ';
    }

    const _Refresh = function(t) {
        plrs = [];
        for (e = Players.GetEnumerator(); e.MoveNext();)
            if (e.Current.Team == t && e.Current.Spawns.IsSpawned && e.Current.IsAlive) plrs.push(e.Current.IdInRoom);
    }

    const _Reset = function(p) {
        p.Ui.Hint.Reset();
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
        return team.Properties.GetContext()erties.Get('looses').Value;
    });

    LeaderBoard.PlayersWeightGetter.Set(function(p) {
        return p.Properties.GetContext()erties.Get('Kills').Value;
    });

    spawn.RespawnEnable = false, BreackGraph.Damage = false, ui.MainTimerId.Value = main.Id;
    TeamsBalancer.IsAutoBalance = true;

    const blue = _Add('blue', {
            up: 'спецназовцы ᵏⁿⁱᶠᵉᵉ',
            down: ''
        }, '#476AEC', 1),
        red = _Add('red', {
            up: 'террористы ᵏⁿⁱᶠᵉᵉ',
            down: ''
        }, '#FE5757', 2);

    // init
    _Initialization(0), _Initialization(1);

    Teams.OnRequestJoinTeam.Add(function(p, team) {
        if (s.Value === 'end' || _Found(BLACKLIST, p.Id, '|')) return;
        team.Add(p);
        p.Properties.GetContext()erties.Get('Index').Value = 0;
    });

    Teams.OnPlayerChangeTeam.Add(function(p) {
        if (!p.Spawns.IsSpawned || p.IsAlive) p.Spawns.Spawn();
        p.Ui.TeamProperties.GetContext()2.Value = {
            Team: p.Team.Id,
            Properties.GetContext(): p.Id + 'info1'
        };
        _Show(p);
    });

    Teams.OnAddTeam.Add(function(team) {
        team.Ui.TeamProperties.GetContext()1.Value = {
            Team: team.Id,
            Properties.GetContext(): 'info2'
        };
    });

    Properties.GetContext()erties.OnTeamProperties.GetContext()erty.Add(function(context) {
        let team = context.Team;
        team.Properties.GetContext()erties.Get('info2').Value = '  <color=#FFFFFF> Счёт команды:  ' + n + n + '  wins: ' + team.Properties.GetContext()erties.Get('wins').Value + ', looses: ' + team.Properties.GetContext()erties.Get('looses').Value + '  </color>';
    });

    BreackGraph.OnOptions.Add(function() {
        if (BreackGraph.Damage) BreackGraph.Damage = false;
    });

    Timers.OnPlayerTimer.Add(function(t) {
        let p = t.Player,
            id = t.Id;
        switch (id) {
            case 'Immo':
                p.Properties.GetContext()erties.Immortality.Value = false;
                break;
        }
    });

    Spawns.OnSpawn.Add(function(p) {
        p.Properties.GetContext()erties.Get('Immortality').Value = true;
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
        p.Properties.GetContext()erties.Get('Deaths').Value += 1;
    });

    Damage.OnKill.Add(function(p, vic) {
        if (vic.Team == p.Team)
            return;
        pos = p.Position.x - vic.Position.x + p.Position.y - vic.Position.y + p.Position.z - vic.Position.z; // 
        if (pos != 0) vic.Ui.Hint.Value = p.NickName + ' убил вас с расстояния ' + Math.abs(pos.toFixed(2)) + ' блоков!';
        p.Properties..Get('Kills').Value += 1;
        Properties.GetContext().Get(p.Id + 'experience').Value += _Rand(2, 6);
        _Show(p);
    });

    Players.OnPlayerConnected.Add(function(p) {
        PROPERTIES[1].name.forEach(function(element1, element2) {
            if (Properties.GetContext().Get(p.Id + element1).Value == null) Properties.GetContext().Get(p.Id + element1).Value = PROPERTIES[1].value[element2];
        });
        p.contextedProperties.MaxHp.Value = Properties.GetContext().Get(p.Id + 'hp').Value || 35;
    });

    Players.OnPlayerDisconnected.Add(function(p) {
        p.Team.Properties.Get(p.Id + 'info1').Value = null;
        Properties.GetContext().GetContext().Get(p.Id + 'hp').Value = p.contextedProperties.GetContext()erties.MaxHp.Value;
        update.Restart(1);
    });

    inv.Main.Value = false;
    inv.Secondary.Value = false;
    inv.Explosive.Value = false;
    inv.Build.Value = false;
    
    _Game();
    con_prop.MaxHp.Value = 35;


} catch (err) {
    msg.Show(err.name + ' ' + err.message);
}