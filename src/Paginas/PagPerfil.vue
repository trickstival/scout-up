<script>
    import StTopBarLogado from './../layout/TopBars/TopBarLogado.vue'
    import StMain from './../layout/Perfil/Main.vue'
    import {EventBus} from './../eventBus'
    export default{
        components: {
            StMain
        },
        beforeCreate(){
            document.body.className = 'home'
        },
        created(){
            EventBus.$on('usuarioDaPagExiste', usuarioDaPagExiste => {
                console.log('usuarioDaPagExiste pagPerfil', usuarioDaPagExiste)
                if(!usuarioDaPagExiste){
                    this.$router.go(-1)
                }
            })
        }
    }

</script>
<template>
    <st-main></st-main>
</template>

<style>
    body.home{
        background-image: url('../assets/paisagem-background.png')
    }
</style>