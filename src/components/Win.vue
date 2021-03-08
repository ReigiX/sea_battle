<template>
    <div class="total">
        <h1>Победитель: {{winner}}</h1>
        <router-link to="/start/" tag="button" class="re">Начать сначала</router-link>
    </div>
</template>

<script>
export default {
    props: ['winner']
}
</script>

<style>
.total {
    margin-top: 17%;
	font-family: 'Amatic SC', cursive;
	text-transform: capitalize;
	font-size: 20pt;
	text-align: center;
    color: rgb(248, 161, 47);
}
.re {
    border-radius: 12px;
    background-color: rgb(142, 142, 218);
    border: 0;
    width: auto;
    height: 46px;
    font-size: 22pt;
    font-family: 'Amatic SC', cursive;
    outline: none !important;
    border: none;
    font-weight: 600;
    color: white;
    padding: 0px 11px;
}
.re:hover {
    color: rgb(202, 200, 200);
    background-color: rgb(98 98 176);
    cursor: pointer;
}
.re:active {
    margin-top: 10px;
}

</style>