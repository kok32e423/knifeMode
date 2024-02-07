// Параметры
BreackGraph.Damage = false;
Spawns.GetContext().RespawnTime.Value = 0;

// Переменные
var NeedHearts = [80, 70, 30, 5, 35, 40, 65];
var IsDamageEffect = true;
var Rounds = NeedHearts.length;

var endTimer = Timers.GetContext().Get("end");
endTimer.OnTimer.Add(function(){
	Game.RestartGame();
});
Ui.GetContext().MainTimerId.Value = endTimer.Id;

// Команды
Teams.Add("Players", "<b><size=100><color=#ff8f00>ᴘ</color><color=#ff7d00>ʟ</color><color=#ff6b00>ᴀ</color><color=#ff5900>ʏ</color><color=#ff4700>ᴇ</color><color=#ff3500>ʀ</color><color=#ff2300>s</color></size></b>", { r: 120, g: 0, b: 0 });
Teams.Get("Players").Spawns.SpawnPointsGroups.Add(1);

// зоны
var Default = AreaPlayerTriggerService.Get("DefaultTrigger")
Default.Tags = ["def"];
Default.Enable = true;
Default.OnEnter.Add(function(player) {
	player.Ui.Hint.Value = "раунд " + (player.Properties.Get("round").Value + 1) + " - " +  NeedHearts[player.Properties.Get("round").Value] + " здоровья";
	if(player.Properties.Get("hearts").Value == NeedHearts[player.Properties.Get("round").Value]){
		player.Properties.Get("round").Value++;
		player.Ui.Hint.Value = 'уровень пройден, выйдите из зоны чтобы восстановить здоровье';
		player.Properties.Get("iswin").Value = true;
	}
    if(player.Properties.Get("round").Value == Rounds){
		player.Ui.Hint.Reset();
		EndGame(player);
	}
});
Default.OnExit.Add(function(player){
	if(player.Properties.Get("iswin").Value) player.Spawns.Spawn();
	player.Ui.Hint.Reset();
    player.Properties.Get("iswin").Value = false;
});

var DefaultView = AreaViewService.GetContext().Get("DefaultView");
DefaultView.Color = { g: 1 };
DefaultView.Tags = ["def"];
DefaultView.Enable = true;

// лидерборд
LeaderBoard.PlayerLeaderBoardValues = [
	{
		Value: "round",
		DisplayName: "У",
		ShortDisplayName: "У"
	}
];
LeaderBoard.PlayersWeightGetter.Set(function (player) {
	return player.Properties.Get('round').Value;
});

// события
Teams.OnRequestJoinTeam.Add(function(player, team){
    team.add(player);
});

Teams.OnPlayerChangeTeam.Add(function(player) {
	player.Properties.Get("round").Value = 0;
    player.Spawns.Spawn();
});

Spawns.OnSpawn.Add(function(player){	
    player.Properties.Get("hearts").Value = 100;
    player.Properties.Get("iswin").Value = false;
});

Damage.OnDamage.Add(function(player, player2, damage){
	player2.Properties.Get("hearts").Value -= Math.ceil(damage);
    if(IsDamageEffect){
    	player2.Properties.Scores.Value += Math.ceil(damage);;
    }
});

var inventory = Inventory.GetContext();
inventory.Main.Value = false;
inventory.Secondary.Value = false;
inventory.Melee.Value = true;
inventory.Explosive.Value = false;
inventory.Build.Value = false;

// функции
function EndGame(player){
	Ui.GetContext().Hint.Value = "выиграл игрок " + player + "!";
	Damage.GetContext().DamageIn.Value = false;
	DefaultView.Color = { r: 1 };
	Default.Enable = false;
	endTimer.Restart(16);
	Teams.Get("Players").Spawns.Spawn();
}