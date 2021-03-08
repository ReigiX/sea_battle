<template>

  <div class="start-game">
    <input :class="{'user-name': true, 'warning-input':  warn}" placeholder="Введите Ваше имя" v-model="userName"/>
    <router-link :to='"/game/"+userName' class="start" tag="button">Старт</router-link>
  </div>
</template>

<script>
export default {
    data(){
        return {
            userName: '',
            warn: false
        }
    },
    beforeRouteLeave (to, from, next) {
        console.log(to.params)
        if(this.userName == ''){
            this.warn = true
            next(false)
        }
        else{
            this.warn = false
            next(true)
        }
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Amatic+SC&display=swap');
.start-game {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    align-content: center;
    justify-content: center;
    /* margin-top: 20%; */
    height: 700px;
    margin: 0px auto;
}
.start {
    border-radius: 12px;
    background-color: rgb(142, 142, 218);
    border: 0;
    width: 102px;
    height: 41px;
    font-size: 22pt; 
    font-family: 'Amatic SC', cursive;
    outline: none !important;
    border: none;
    font-weight: 600;
    color: white;
}
.start:hover {
    color: rgb(202, 200, 200);
    background-color: rgb(98 98 176);
    cursor: pointer;
}
.start:active {
    margin-top: 10px;
}
.user-name {
	margin-bottom: 10px;
	width: 235px;
	height: 28px;
	border-radius: 12px;
	border: 3px solid rgb(174, 153, 185);
	outline: none !important;
	font-family: 'Amatic SC', cursive;
	text-transform: capitalize;
	font-size: 20pt;
	text-align: center;
}

.warning-input{
    border: 3px solid rgb(207, 42, 20);
    background: rgb(255 212 212 / 43%);
}

</style>
