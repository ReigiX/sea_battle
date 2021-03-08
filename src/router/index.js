import Vue from 'vue'
import VueRouter from 'vue-router'
import Game from '../components/Game.vue'
import Start from '../components/Start.vue'
import Win from '../components/Win.vue'

Vue.use(VueRouter)

// Создаем роуты для страниц 
const routes = [ 
    {
        path: '/',
        redirect: '/start',
        name: 'Начало'      
    },
    {
        path: '/game/:username',
        name: 'Морской бой',
        component: Game,  
        props: true     
    },
    {
        path: '/start',
        name: 'Начать игру',
        component: Start
    },
    {
        path: '/win/:winner',
        name: 'Победитель',
        component: Win,
        props: true
    }

]

const router = new VueRouter({  routes })

export default router