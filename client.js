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
var blueTeam = addteam('blue', '<b>синие</b>', { b: 0.7 }, 1);
var redTeam = addteam('red', '<b>красные</b>', { r: 0.7 }, 2);
// константы
const prop = Properties.GetContext();
const roomHp = 35;
const needPlayers = 2;
const roomInventory = Inventory.GetContext(); 
const ui = Ui.GetContext(); 
const stateProp = prop.Get("State");
const maxRounds = 30;
const roomContextedProp = contextedProperties.GetContext();
const spawn = Spawns.GetContext();
const gameTimer = Timers.GetContext().Get('gtim');
const waitingTimer = Timers.GetContext().Get('wtim');
const roundWinTeamIdProp = prop.Get("rWinTeam");
const admin = 'EC76560AA6B5750B';
const last_lightning = prop.Get("lig");

// параметры
BreackGraph.Damage = false; 
ui.MainTimerId.Value = gameTimer.Id;
TeamsBalancer.IsAutoBalance = true;
prop.GameModeName.Value = "GameModes/Knife";
// переменные
var gameWinner = 'draw!';
var gameTime = 180;
// инициализация значений команд
function initTeams(){
var e = Teams.GetEnumerator();
     while (e.moveNext()){
     let teamProp = Properties.GetContext(e.Current);
     // раунды
     teamProp.Get('winRounds').Value = 0;
     // убийства команд
     teamProp.Get('teamKills').Value = 0;
     }
}    
// события
Teams.OnPlayerChangeTeam.Add(function(player){
player.Spawns.Spawn();
}); 
Teams.OnRequestJoinTeam.Add(function(player,team){
team.Add(player);
if (player.Id === admin) player.Inventory.Secondary.Value = true, player.Inventory.Melee.Value = false;
});
// изменение значений
Properties.OnTeamProperty.Add(function(context, value){
  let contextTeamProp = context.Team.Properties;
  if(value.Name === 'winRounds' || value.Name === 'teamKills')contextTeamProp.Get('info').Value = 'wRounds: ' + contextTeamProp.Get('winRounds').Value + '\n' + 'Kills: ' + contextTeamProp.Get('teamKills').Value;
  if(contextTeamProp.Get('winRounds').Value >= maxRounds && value.Name == 'winRounds') endOfGame();
});
// делаем щит при спавне
spawn.OnSpawn.Add(function(player){
  player.Properties.Immortality.Value=true;
  player.Timers.Get('immo').Restart(3);
});



Timers.OnPlayerTimer.Add(function(t) {
   p = t.Player
   switch (t.Id) {
      case 'immo':
        p.Properties.Immortality.Value = false;
      break;
      case 'hook':
        p.Inventory.Secondary.Value = true;
        p.Inventory.Melee.Value = false;
        p.Ui.Hint.Value = 'Ваша Способность доступна!!';
        p.Timers.Get('res').Restart(3);
      break;
      case 'res':
        p.Ui.Hint.Reset();
      break;
      case 'l':
        AreaService.Get('l' + last_lightning).Tags.Remove();
        
        last_lightning++;
      break;
   }    
}); 

Damage.OnKill.Add(function(player, killed){
if(killed.Team == player.Team) return;
  player.Properties.Get('Kills').Value++;
  player.Team.Properties.Get('teamKills').Value++;
});
Damage.OnDeath.Add(function(player){
  player.Properties.Get('Deaths').Value++;
});

last_lightning = 0;

Damage.OnDamage.Add(function(player, victim){
if(victim.Team != player.Team && player.Inventory.Secondary.Value) {
    player.Inventory.Secondary.Value = false;
    player.Inventory.Melee.Value = false;
    player.Inventory.Melee.Value = true;
    player.Position = {x: victim.Position.x, y: victim.Position.y, z: victim.Position.z - 4 }
    player.Timers.Get('hook').Restart(60);
    player.Ui.Hint.Value = 'Способность перезарядится через: 60 сек';
    victim.Ui.Hint.Value = 'Игрок ' + player.NickName + ' использовал на вас способность hook';
    victim.Properties.Immortality.Value = true;
    victim.Timers.Get('immo').Restart(1);
    victim.Timers.Get('res').Restart(4);
    player.Timers.Get('res').Restart(4);
    AreaService.Get('l' + last_lightning).Ranges.Add({Start: player.PositionIndex, End: {x: player.PositionIndex.x + 1, y: player.PositionIndex.y + 999, z: player.PositionIndex.z + 1}});
    AreaService.Get('l' + last_lightning).Tags.Add('lightning');
    player.Timers.Get('l').Restart(1);
}
});

// sf
Damage.OnDeath.Add(getRoundWinner);
Players.OnPlayerDisconnected.Add(getRoundWinner);
// значения в лидерборде
LeaderBoard.PlayerLeaderBoardValues = [
 { Value: 'Kills', ShortDisplayName: 'к' },
 { Value: 'Deaths', ShortDisplayName: 'с' }];
//смена состояний
function switchStates(){
let players = Players.Count;
switch (stateProp.Value){
    case 'gameState': 
         endOfRound();
         break;
    case 'endOfRoundState': 
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
     HintRoom('убейте всех врагов, чтобы выиграть раунд!');
     // выводим инфу наверху
     TeamProp('red', 'blue', 'info');
     // запрещяем респавн
     spawn.RespawnEnable = false;
     // despawn
     spawn.Despawn();
     spawn.Enable = true;
         SpawnTeams();
         gameTimer.Restart(115); // 115
}

function endOfRound(teamGetWinProp){
  stateProp.Value = 'endOfRoundState';
    var teamGetWinProp = Teams.Get(roundWinTeamIdProp.Value);   
    if(teamGetWinProp !== null){
    HintRoom('раунд закончен, ' + teamGetWinProp + ' wins!');
    // прибавляем winRounds
    var winProp = teamGetWinProp.Properties.Get('winRounds');
    if(winProp.Value == null) winProp.Value = 1;
    else winProp.Value = winProp.Value + 1;
 }
  else HintRoom('раунд закончен, draw!'); 
    // запрещаем спавны
    spawn.Enable = false;
    gameTimer.Restart(10); 
}

function endOfGame(){
  stateProp.Value = 'endOfGameState';
    // определяем победителя игры
    if(blueTeam.Properties.Get('winRounds').Value > redTeam.Properties.Get('winRounds').Value)gameWinner = 'blue Team wins!';
    if(redTeam.Properties.Get('winRounds').Value > blueTeam.Properties.Get('winRounds').Value)gameWinner = 'red Team wins!';
    // выводим в подсказки
    HintRoom('игра закончена, ' + gameWinner);
    spawn.Enable = false;
    // вешаем рестарт
    gameTimer.OnTimer.Add(restartGame);
    gameTimer.Restart(10); 
}
// инвентарь в комнате
roomInventory.Main.Value = false;
roomInventory.Secondary.Value = false;
roomInventory.Explosive.Value = false;
roomInventory.Build.Value = false;
// хп в комнате
roomContextedProp.MaxHp.Value = roomHp;
// spawntm
function SpawnTeams(){
        var e = Teams.GetEnumerator();
            while (e.moveNext()){
                Spawns.GetContext(e.Current).Spawn();
         }
}
// res
function restartGame(){
        Game.RestartGame();
}
// определяем победителя
function getRoundWinner(){
roundWinnerTeam = null;
wins = 0;
alifeCount = 0;
hasEmptyTeam = false;
if(stateProp.value !== 'gameState')return;
for (e = Teams.GetEnumerator(); e.moveNext();){
      let teamProp = Properties.GetContext(e.Current);
            // хз чо ето 
            alifeCount += e.Current.GetAlivePlayersCount();
            if(e.Current.GetAlivePlayersCount() > 0){ 
            // эсли в команде есть живые, прибавляем wins
            ++wins; 
            roundWinnerTeam = e.Current;
         }
            if(e.Current.Count == 0) hasEmptyTeam = true;
         }
          if(!hasEmptyTeam && alifeCount > 0 && wins === 1){
                     roundWinTeamIdProp.Value = roundWinnerTeam.Id;
                     endOfRound(roundWinnerTeam);
                     return;
              }
               if(alifeCount == 0){
                     roundWinTeamIdProp.Value = null;
                     endOfRound(null);
              }
               if(!gameTimer.IsStarted){
                     roundWinTeamIdProp.Value = null;
                     endOfRound(null);
              }
}

groza = 
AreaViewService.GetContext().Get('View');
groza.Enable = true;
groza.Tags = ['lightning'];
groza.Color = { r: 1, g: 1, b: 1 };