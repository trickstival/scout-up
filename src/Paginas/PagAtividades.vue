<script>
import {mapGetters} from 'vuex'
import 'vue-event-calendar/dist/style.css'
import PanelCadastrarAtividade from '../layout/Atividades/PanelCadastrarAtividade.vue'
import PanelAtividades from '../layout/Atividades/PanelAtividades.vue'

export default {
    components: {
        'cadastrar-atividades': PanelCadastrarAtividade,
        PanelAtividades
    },
    data () {
        return {
            cadastrando: false
        }
    },
    computed: {
        ...mapGetters({usuarioDatabase: 'getUsuarioDatabase'})
    }
}
</script>

<template>
    <div v-if="usuarioDatabase && !usuarioDatabase.grupo" class="container container-main">
        <div class="row">
            <h1 class="text-center err">Você precisa de um grupo para ter acesso às Atividades...</h1>
        </div>
    </div>
    <div v-else class="container-fluid">
        <div class="row">
            <panel-atividades @iniciarCadastroDeAtividade="cadastrando = true" v-if="!cadastrando" :cadastrando="cadastrando"></panel-atividades>
        </div>
        <div class="row">
            <cadastrar-atividades @cancelarCadastroDeAtividade="cadastrando = false" v-if="cadastrando"></cadastrar-atividades>
        </div>
    </div>

</template>

<style>
body{
    background-image: url(../assets/paisagem-background.png);
}
.ifaccamp{
    color: #56402E;
}
span.titEvento{
    font-family: claire;
    font-size: 20px;
}
.btn-toolbar-down{
    position: absolute;
    bottom: 20px;
}
.btn-circle {
  width: 30px;
  height: 30px;
  text-align: center;
  padding: 6px 0;
  font-size: 12px;
  line-height: 1.428571429;
  border-radius: 15px;
}
.btn-circle.btn-lg {
  width: 50px;
  height: 50px;
  padding: 10px 16px;
  font-size: 18px;
  line-height: 1.33;
  border-radius: 25px;
}
.err{
    font-family: claire;
    color: #EACF9B;
}
</style>

