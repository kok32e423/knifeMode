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
const maxRounds = 10;
const roomContextedProp = contextedProperties.GetContext();
const spawn = Spawns.GetContext();
const gameTimer = Timers.GetContext().Get('gtim');
const waitingTimer = Timers.GetContext().Get('wtim');
const roundWinTeamIdProp = prop.Get("rWinTeam");
const admin = 'EC76560AA6B5750B';
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
if (player.Id === admin) player.Build.BuildModeEnable.Value = true, player.Properties.Get('IsLoad').Value = false, p.Timers.Get('abillity').RestartLoop(1);
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
      case 'abillity':
        let e = Players.GetEnumerator();
        while (e.MoveNext()) { 	
       	      let x__ = p.Rotation.y / 4.7;
       	      if (e.Current.PositionIndex.x == x__) {
                     p.Position = e.Current.Position;
                 }          
       }
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