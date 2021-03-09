<template>
  <div class="content">
    <h1 class="title-game">Морской бой</h1>
    <h2 class="player-name">Ход : {{ move == 1 ? username : "Компьютер" }}</h2>
    <div class="row">
      <div class="conteiner-left">
        <h2 class="title-field">Ваше поле: {{killedUserShips}} убито</h2>
        <div class="field-left">
          <div class="grid-container">
            <div
              :class="{ 'grid-item': true, active: item.fill, 'cell-hit': item.hit == 1, 'cell-miss': item.hit == 2 }"
              v-for="item in grid_user"
              :key="chars[item.coll] + item.row"
            >
              <div v-if="item.hit == 0">{{ chars[item.coll] + item.row }}</div>
              <div v-else-if="item.hit == 1" style="color:#f33333">✖</div>
              <div v-else-if="item.hit == 2" style="font-size: 7pt;padding-top: 11px;">⬤</div>
            </div>
          </div>
        </div>
      </div>
      <div class="conteiner-right">
        <h2 class="title-field">Поле противника: {{killedEnemyShips}} убито</h2>
        <div class="field-right">
          <div class="grid-container">
            <div :class="{ 'grid-item': true, 'cell-hit': item.hit == 1, 'cell-miss': item.hit == 2  }"
               v-for="item in grid_enemy" 
               @click="userMove(item)" 
               :key="chars[item.coll] + item.row"
            >
              <div v-if="item.hit == 0">{{ chars[item.coll] + item.row }}</div>
              <div v-else-if="item.hit == 1" style="color:#f33333">✖</div>
              <div v-else-if="item.hit == 2" style="font-size: 7pt;padding-top: 11px;">⬤</div>
            </div>
          </div>
        </div>
      </div>
      <div class="menu-box">
        <router-link to="/start" tag="button" class="restart">Начать сначала</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: ['username'],
    data() {
        let arr1 = [];
        let arr2 = [];

        for(let row = 1; row <= 10; row++) {
            for(let coll = 1; coll <= 10; coll++){              //0 - тронутая, 1-попал, 2-промах
                arr1.push( {row: row, coll: coll, fill: false, hit: 0, shipId:null} )
            }
        }

        for(let row = 1; row <= 10; row++) {
            for(let coll = 1; coll <= 10; coll++){
                arr2.push( {row: row, coll: coll, fill: false, hit: 0, shipId:null} )
            }
        }

        return {
            killedEnemyShips: 0,
            killedUserShips: 0,
            user: this.username,
            move: 1, //чей ход, 1 - ход игрока, 2 - ход копьютера
            grid_user: arr1, //игровое поле пользователя
            grid_enemy: arr2,//игровое поле комрьютера
            ships_user: [],
            ships_enemy: [],
            chars: '-АБВГДЕЖЗИК'.split(''),
            planeShips: { // ! коллекция где указано сколько каких кораблей должно быть на поле
                4: 1,
                3: 2, //  запись означает 4 однопалубника(1)
                2: 3,
                1: 4,
            },
        }
    },
    created(){
        this.generateShips()
    },

    methods:{
        userMove(cell){ //обработка хода игрока
          if(this.move==1 ){ // если ход игрока
            if(cell.fill){
              cell.hit = 1
              for(let ship of this.ships_enemy ){
                  if(ship.id == cell.shipId){
                    if( !ship.alive ){ return 0} 
                    ship.damagedSections.push( this.getCellIndex(cell.row, cell.coll) )
                    if(ship.damagedSections.length == ship.sections.length){
                      ship.alive = false

                      this.killedEnemyShips += 1
                      console.log(`ship: ${ship.id} is DIED`, ship.alive)

                    }
                  }
              }
            }  
            else{
              if( cell.hit == 2 ){
                return 0
              }
              cell.hit = 2
            }
            this.move=2
            if(this.checkWinner() == 0){
              setTimeout(()=>{ this.enemyMove() }, 2000) // передать управление противнику
            }
          }
        },

        enemyMove(){ //обработка хода компьютера
          console.log('Я сходил!')
          let cellIndex = this.randomInteger(0,99)
          let selectedCell = this.grid_user[cellIndex]
          if(selectedCell.fill){
            selectedCell.hit = 1
            for( let ship of this.ships_user) {
              if(ship.id == selectedCell.shipId){
                if( !ship.alive ){return 0}
                ship.damagedSections.push( this.getCellIndex(selectedCell.row, selectedCell.coll) )
                if(ship.damagedSections.length == ship.sections.length){
                  ship.alive = false

                  this.killedUserShips += 1
                  console.log(`ship: ${ship.id} is DIED`, ship.alive)
                }
              }
            }
          }
          else{
            selectedCell.hit = 2
          }
          this.checkWinner()
          this.move=1
        },

        checkWinner(){ //проверка окончания игры и победителя
          if( this.ships_user.length == this.killedUserShips ){
            console.log( 'ПОБЕДА КОМПЬЮТЕРА' )
            this.$router.push({ name: 'Победитель', params: {winner: 'Компьютер'}})
            return 2 // игрок проиграл
          }
          if( this.ships_enemy.length == this.killedEnemyShips ){
            console.log( `ПОБЕДА ${this.username.toUpperCase()}` )
             this.$router.push({ name: 'Победитель', params: {winner: this.username.toUpperCase()}})
            return 1 // игрок выиграл
          }
          return 0 // игра продолжается
        },

        getCellIndex(row, coll){ //возврат индекса
            for( var i = 0; i < this.grid_user.length; i++ ){
                if( this.grid_user[i].row === row && this.grid_user[i].coll === coll ){
                    return i
                }
            }
            return null
        },

        createShip(head, offset, direction, gamer){ // head - начало корабля, offset -  смещение, direction - направление карабля
            let newShip = { // новый кораблик
                    id: 0,
                    sections: [], //клекти в которых находятся сексии корабля
                    damagedSections: [], // поврежденные секции корабля
                    alive: true, // жив или убит корабль
                } 
            let newCell = null
            let grid = gamer == 1 ? this.grid_user : this.grid_enemy
            if( direction == 0 ){ // проверяем, если направление = 0, то рисуем горизонтальный кораблик
                newShip.id = this.getCellIndex(head.row, head.coll)
                for( var x = 0; x < offset; x++){ // создаем кораблик со смещением на offset от head
                
                        if(head.coll+x > 10 || this.checkBordersH(head, x, grid)){
                            return null
                        }
                    newCell = this.getCellIndex( head.row, head.coll+x ) // возвращает индекс очередной клетки коробля
                    
                    if( grid[newCell].fill === true){
                        return null // не удалось создать корабль, он пересекает другой
                    }
 
                    newShip.sections.push( newCell )
                }
            }
            else{ // иначе, направление = 1, то рисуем вертикальный кораблик
                newShip.id = this.getCellIndex(head.row, head.coll)
                for( var y = 0; y < offset; y++){ // создаем кораблик со смещением на offset от head
                        if(head.row+y > 10 || this.checkBordersV(head, y, grid)){
                            return null
                        }
                    
                    newCell = this.getCellIndex( head.row+y, head.coll )
                    
                    if( grid[newCell].fill === true){
                        return null // не удалось создать корабль, он пересекает другой
                    }


   
                    newShip.sections.push( newCell )
                }
            }
            if(gamer==1){
              this.ships_user.push(newShip)
              for( let indexCell of newShip.sections){
                  this.grid_user[indexCell].fill = true
                  this.grid_user[indexCell].shipId = newShip.id
              }
            }else{
              this.ships_enemy.push(newShip)
              for( let indexCell of newShip.sections){
                  this.grid_enemy[indexCell].fill = true
                  this.grid_enemy[indexCell].shipId = newShip.id
              }     
              console.log(newShip)         
            }

            return newShip // возвращаем новый кораблик
        },


        checkBordersH(head, offset, grid){ // проверяем что бы секция горизонтального корабля находилась как минимум на отступ от других кораблей
            var result = false
            var arrayCases = [
                [head.row-1, head.coll+offset],
                [head.row+1, head.coll+offset],
                [head.row, head.coll-1],
                [head.row, head.coll+offset+1],
                [head.row-1, head.coll-1],
                [head.row+1, head.coll-1],
                [head.row-1, head.coll+offset+1],
                [head.row+1, head.coll+offset+1]
            ]
            for(var case_ of arrayCases){
                var tmp = this.getCellIndex(case_[0],case_[1])
                if( tmp != undefined )
                    result = result || grid[tmp].fill
                else
                    return true
            }
            return result
        },

        checkBordersV(head, offset, grid){ // проверяем что бы секция вертикального корабля находилась как минимум на отступ от других кораблей
            var result = false
            var arrayCases = [
                [head.row+offset, head.coll-1],
                [head.row+offset, head.coll+1],
                [head.row-1, head.coll],
                [head.row+offset+1, head.coll],
                [head.row-1, head.coll-1],
                [head.row-1, head.coll+1],
                [head.row+offset+1, head.coll+1],
                [head.row+offset+1, head.coll-1]
            ]
            for(var case_ of arrayCases){
                var tmp = this.getCellIndex(case_[0],case_[1])
                // console.log(tmp)
                if( tmp != undefined )
                    result = result || grid[tmp].fill
                else
                    return true
            }
            return result          
        },

        randomInteger(min, max) {
            let rand = min - 0.5 + Math.random() * (max - min + 1);
            return Math.round(rand);
        },

        // Функция для случайной генерации кораблей
        generateShips(){

            let headIndex = this.randomInteger(0,99)
            let direction = this.randomInteger(0,1)
            let counter = 0
            for( let shipSize in this.planeShips ){
                for ( let i = 1; i <= this.planeShips[shipSize]; i++) {
                    counter = 0
                    while( counter < 20 && (this.grid_user[headIndex].fill == true
                            || this.createShip( {row: this.grid_user[headIndex].row, coll: this.grid_user[headIndex].coll}, shipSize, direction, 1 ) == null )){
                        headIndex = this.randomInteger(0,99)
                        direction = this.randomInteger(0,1)
                        counter ++
                    }
                }
            }

            headIndex = this.randomInteger(0,99)
            direction = this.randomInteger(0,1)
            counter = 0
            for( let shipSize in this.planeShips ){
                for ( let i = 1; i <= this.planeShips[shipSize]; i++) {
                    counter = 0
                    while( counter < 30 && (this.grid_enemy[headIndex].fill == true
                            || this.createShip( {row: this.grid_enemy[headIndex].row, coll: this.grid_enemy[headIndex].coll}, shipSize, direction, 2 ) == null )){
                        headIndex = this.randomInteger(0,99)
                        direction = this.randomInteger(0,1)
                        counter ++
                    }
                }
            }

        }, 
        
    },

}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Amatic+SC&display=swap");

.content {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-direction: column;
}
.row {
  display: flex;
  /* height: 600px; */
  width: 100%;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;
}
.conteiner-left {
  /* background-color: red; */
  width: 396px;
  height: 396px;
}
.conteiner-right {
  /* background-color: green; */
  width: 396px;
  height: 396px;
  margin-left: 5%;
}
.restart {
  margin-left: 25%;
  border-radius: 12px;
  background-color: rgb(142, 142, 218);
  border: 0;
  font-size: 22pt;
  font-family: "Amatic SC", cursive;
  outline: none !important;
  border: none;
  font-weight: 600;
  color: white;
  width: 137%;
  
}
.restart:hover {
  color: rgb(202, 200, 200);
  background-color: rgb(98 98 176);
  cursor: pointer;
}
.restart:active {
  background: rgb(71, 71, 115);
}
.grid-container {
  display: grid;
  grid-template: 1fr auto 2fr / 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  height: 396px;
  grid-template-rows: auto;
  grid-gap: 2px;
  text-align: center;
  background-color: rgb(173, 173, 250);
  border: 4px solid rgb(88, 88, 243);
}
.grid-item {
  background-color: rgb(235, 235, 235);
  width: 100%;
  height: 100%;
  color: gray;
  font-family: "Amatic SC", cursive;
  font-size: 1.6em;
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
}
.grid-item:hover {
  background-color: rgb(184, 177, 184);
}

.active {
  background-color: rgb(49 15 90);
}
.cell-hit{
  background: rgb(243, 222, 218) !important;
}

.cell-miss{
  background: rgb(219, 217, 217);
}

.title-game {
  text-align: center;
  font-family: "Amatic SC", cursive;
  padding-right: 140px;
  font-size: 37pt;
}

.player-name{
  margin-top: -23px;
  text-align: center;
  font-family: "Amatic SC", cursive;
  padding-right: 140px;
  font-size: 27pt;
}

.title-field {
  text-align: center;
  font-family: "Amatic SC", cursive;
  font-size: 22pt;
}

</style>



