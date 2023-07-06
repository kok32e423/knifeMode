// функция добавления команд
function addteam(tag, name, color, sp){
	let team = Teams.Get(tag);
   Teams.Add(tag, name, color);
    team.Spawns.SpawnPointsGroups.Add(sp);
    return team;
}
// player hint
function HintPlayer(player, hint){
  player.ui.Hint.Value = hint;
}
// функция вывода значений вверху
function TeamProp(team1, team2, prop){
  ui.TeamProp1.Value = { Team: team1, Prop: prop };
  ui.TeamProp2.Value = { Team: team2, Prop: prop };
}
// room hint
function HintRoom(hint){
  ui.Hint.Value = hint;
}
// добавляем команды
var blueTeam = addteam('blue', 'синие', { b: 0.7 }, 1);
var redTeam = addteam('red', 'красные', { r: 0.7 }, 2);
// константы
const prop = Properties.GetContext();
const roomHp = 35;
const roomInventory = Inventory.GetContext(); 
const ui = Ui.GetContext(); 
const stateProp = prop.Get("State");
const maxKills = 45;
const roomContextedProp = contextedProperties.GetContext();
const spawn = Spawns.GetContext();
const gameTimer = Timers.GetContext().Get('gtim');
const banned = '596D1288BD7F8CF7/C002224F3666744D/EC76560AA6B5750B';
// параметры
ui.MainTimerId.Value = gameTimer.Id;
TeamsBalancer.IsAutoBalance = true;
prop.GameModeName.Value = "GameModes/Knife";
spawn.RespawnTime.Value = 3;
BreackGraph.WeakBlocks = GameMode.Parameters.GetBool('LoosenBlocks');
Map.Rotation = GameMode.Parameters.GetBool("MapRotation");
// переменные
var gameWinner = 'ничья!';
var gameTime = 525;
var restartTime = 15;
// инициализация значений команд
function initTeams(){
for(e = Teams.GetEnumerator();e.MoveNext();){
     let teamProp = Properties.GetContext(e.Current);
     // убийства команд
     teamProp.Get('teamKills').Value = 0;
     }
}    
// поиск в строке
function src(str, el) {
    return str.search(el);
}
// события
Teams.OnPlayerChangeTeam.Add(function(player){
player.Spawns.Spawn();
}); 
Teams.OnRequestJoinTeam.Add(function(player,team){
team.Add(player);
});
// чото
Properties.OnTeamProperty.Add(function(context, value){
let contextTProp = context.Team.Properties;
contextTProp.Get('colorK').Value = '<color='+context.Team.Id+'>'+contextTProp.Get('teamKills').Value+'</color>';
if(value.Name !== 'teamKills')return;
if(value.Value >= maxKills)endOfGame(); return;
}); 
// игрок выходит
Players.OnPlayerDisconnected.Add(function(player){
if(stateProp.Value !== 'gameState')return;
save(player);
});
// игрок заходит
Players.OnPlayerConnected.Add(function(player){
player.Ui.Hint.Value = player + ' чья команда наберет больше очков, та и победит!';
if(stateProp.Value !== 'gameState')return;
load(player);
  if (src(banned, p.id) >= 0) ban(p);
      // функция бана
      function ban(p)
    {
        p.Spawns.Enable = false;
        blueTeam.Add(p);
        p.Ui.Hint.Value = 'ты забанен.'
        p.Spawns.Despawn();    
    } 
});
// сохр
function save(player){ 
  let propPlr = player.Properties;
  prop.Get(player.id + 'Kills').Value = propPlr.Kills.Value;
  prop.Get(player.id + 'Deaths').Value = propPlr.Deaths.Value;
}
// загрузка сохр
function load(player){
  let propPlr = player.Properties;
  propPlr.Kills.Value = prop.Get(player.id + 'Kills').Value; 
  propPlr.Deaths.Value = prop.Get(player.id + 'Deaths').Value;
}
// выводим киллы наверху
TeamProp('red', 'blue', 'colorK');
// делаем щит при спавне
spawn.OnSpawn.Add(function(player){
  player.Properties.Immortality.Value=true;
  player.Timers.Get('immo').Restart(3);
});
Timers.OnPlayerTimer.Add(function(timer){
  if(timer.Id!= 'immo')return;
  timer.Player.Properties.Immortality.Value=false;
});
Damage.OnKill.Add(function(player, killed){
if(killed.Team == player.Team)return;
  player.Properties.Get('Kills').Value++;
  player.Team.Properties.Get('teamKills').Value++;
});
Damage.OnDeath.Add(function(player){
  player.Properties.Get('Deaths').Value++;
});
Damage.OnDamage.Add(function(player1, player2, damage){
if(player2.Team == player1.Team) return;
player1.Properties.Scores.Value += Math.floor(damage);
});
// значения в лидерборде
LeaderBoard.PlayerLeaderBoardValues = [
 { Value: 'Kills', ShortDisplayName: 'к' },
 { Value: 'Deaths', ShortDisplayName: 'с' }
];
//смена состояний
function switchStates(){
switch (stateProp.Value){
    case 'gameState': 
         endOfGame();
         break;
    case 'endOfGame': 
         gameMode();
         break;
       }
}
gameTimer.OnTimer.Add(switchStates);
// состояния игры
initTeams();
gameMode();
function gameMode(){
  stateProp.Value = 'gameState'; 
     spawn.Enable = true;
     // despawn
     spawn.Despawn();
	 SpawnTeams();
	 gameTimer.Restart(gameTime); 
}

function endOfGame(){
  stateProp.Value = 'endOfGameState';
    hintReset();
    Damage.GetContext().DamageIn.Value = false;
    // определяем победителя игры
    if(blueTeam.Properties.Get('teamKills').Value > redTeam.Properties.Get('teamKills').Value)gameWinner = 'синие побеждают!';
    if(redTeam.Properties.Get('teamKills').Value > blueTeam.Properties.Get('teamKills').Value)gameWinner = 'красные побеждают!';
    // выводим в подсказки
    HintRoom('игра закончена. ' + gameWinner);
    // вешаем рестарт
    gameTimer.OnTimer.Add(restartGame);
    gameTimer.Restart(restartTime); 
}
// инвентарь в комнате
roomInventory.Main.Value = false;
roomInventory.Secondary.Value = false;
if (GameMode.Parameters.GetBool('IsExplosive')) {
     roomInventory.ExplosiveInfinity.Value = true;
     roomInventory.Explosive.Value = true;
} else {
	 roomInventory.ExplosiveInfinity.Value = true;
}
roomInventory.Build.Value = false;
// хп в комнате
roomContextedProp.MaxHp.Value = roomHp;
// спавн команд
function SpawnTeams(){
	var e = Teams.GetEnumerator();
	    while (e.moveNext()){
		Spawns.GetContext(e.Current).Spawn();
	 }
}
// рестарт
function restartGame(){
	Game.RestartGame(); 
}
//убираем хинты
function hintReset(){
for(e= Players.GetEnumerator();e.MoveNext();)e.Current.ui.Hint.Reset();
}
// пон
for(e=Players.GetEnumerator();e.MoveNext();)e.Current.ui.Hint.Value= e.Current + ' чья команда наберет больше очков, та и победит!';



	
