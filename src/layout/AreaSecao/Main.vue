<script>
import {mapGetters} from 'vuex'
import StCabecalhoSecao from './CabecalhoSecao.vue'
import StPanelRealizarPost from '../Areas/PanelRealizarPost.vue'
import StPostsPanel from '../PostsPanel/PostsPanel.vue'
import StPanelInformacoes from '../Areas/PanelInformacoes.vue'
import StPanelMembros from '../Areas/PanelMembros.vue'
import StPanelPatrulhas from './PanelPatrulhas.vue'
import StPanelSolicitacoes from './PanelSolicitacoes.vue'
var vm = {
    firebase(){
        return {
            grupo: {
                source: this.database.ref('/grupo/'+this.$route.params.idGrupo),
                asObject: true
            },
            secao: {
                source: this.database.ref('/grupo/'+this.$route.params.idGrupo+'/secoes/')
                                        .orderByChild( "nome")
                                        .equalTo(this.$route.params.idSecao
                                        .replace('_', ' ')),
                asObject: false
            }
        }
    },
    components: {
        StCabecalhoSecao,
        StPanelRealizarPost,
        StPostsPanel,
        StPanelInformacoes,
        StPanelMembros,
        StPanelPatrulhas,
        StPanelSolicitacoes
    },
    computed: {
        ...mapGetters({usuarioDatabase: 'getUsuarioDatabase', database: 'getDatabase'}),
        getGrupo(){
            if(this.grupo && this.grupo['.key']){
                console.log('getGrupo', this.grupo)
                return this.grupo
            }
            return false
        },
        getSecao(){
            if(this.secao[0] && this.secao[0]['.key']){
                console.log('getSecao', this.secao)
                return this.secao[0]
            }
            return false
        },
        ehDessaSecao(){
            //O usuário tem uma seção?
            if(!this.getSecao){
                //O usuário não é dessa seção
                return false
            }
            if(!this.usuarioDatabase.secao){
                //O usuário não tem uma seção
                return false
            }
            //A chave da seção do usuário é igual a chave da seção sendo exibida?
            if(this.usuarioDatabase.secao.chave == this.getSecao['.key']){
                //O usuário é dessa seção
                return true
            }
            if(this.usuarioDatabase['.key'] == this.getSecao.criador.chave){
                //O usuário criou essa seção
                return true
            }
            //O usuário não é dessa seção
            return false
        },
        pathParaSecao(){
            return '/grupo/'+this.$route.params.idGrupo+'/secoes/'+this.getSecao['.key']
        },
        ehEscotistaDessaSecao(){
            if(!this.ehDessaSecao || this.usuarioDatabase.tipo != 'escotista'){
                return false
            }
            return true
        }
    },
    methods: {
        desinscreverse(){
            bootbox.confirm(
                'Você tem certeza que deseja sair dessa seção?', confirmacao => {
                    if(!confirmacao) return
                    this.database.ref('usuario').child(this.usuarioDatabase['.key']).child('secao').remove()
                })
        },
        excluirSecao(){
          let self = this
            bootbox.confirm('Você tem certeza que quer excluir essa seção?', quer => {
                if(!quer) return
                if(!this.secao){
                    bootbox.alert('Erro ao tentar excluir a seção. Nenhuma seção encontrada...')
                    return
                }
                this.$firebaseRefs.secao.remove().then(snapR => self.$router.replace('/usuarios/'+self.usuarioDatabase['.key']))
            })
        }
    }
}
export default vm
</script>

<template>
    <div class="container area">
        <div v-if="!usuarioDatabase || !usuarioDatabase.grupo">
            <h1 class="text-center carregando"><i class="fa fa-spinner fa-spin"></i></h1>
        </div>
        <div v-else>
            <div class="row">
                <st-cabecalho-secao :secao="getSecao" :grupo="getGrupo"></st-cabecalho-secao>
            </div>
            <div class="row">
                <st-panel-informacoes @excluirArea="excluirSecao()" @desinscreverse="desinscreverse()" :ehDessaArea="ehDessaSecao" :ehEscotistaDaArea="ehEscotistaDessaSecao" :area="getSecao"></st-panel-informacoes>
            </div>
            <div class="row">
                <div class="col-xs-12 col-sm-10 col-sm-offset-1">
                    <div class="col-xs-12 col-sm-6 membros-box">
                        <div class="row">
                            <st-panel-membros :ehEscotistaDaArea="ehEscotistaDessaSecao" :area="getSecao" tipoArea="secao"
                                class="panel-eq-height"></st-panel-membros>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 patrulhas-box">
                        <div class="row">
                            <st-panel-patrulhas :pathParaSecao="pathParaSecao" :secao="getSecao" class="panel-eq-height"></st-panel-patrulhas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" v-if="ehEscotistaDessaSecao && secao.solicitacoes">
                <div class="col-xs-10 col-xs-offset-1">
                    <st-panel-solicitacoes :secao="getSecao"></st-panel-solicitacoes>
                </div>
            </div>
            <div v-if="ehDessaSecao" class="row">
                <st-panel-realizar-post :pathParaArea="pathParaSecao"></st-panel-realizar-post>
            </div>
            <div class="row">
                <hr class="realizar-separator">
            </div>
            <div class="row">
                <st-posts-panel :ehDessaArea="ehDessaSecao" :area="getSecao" :pathParaArea="pathParaSecao"></st-posts-panel>
            </div>
        </div>
    </div>
</template>

<style>
@media(min-width: 768px){
    .membros-box{
        right:10px;
    }
    .patrulhas-box{
        left:10px;
    }
}
.area{
  background-color: rgba(86,64,46, .5);
  border-radius: 10px;
  padding: 40px;
  color: #eacf9b;
  margin-top: 250px;
}
.realizar-separator{
    margin-bottom:30px;
}
.panel-eq-height{
    height: 250px;
    overflow:scroll;
}
.panel-eq-height::-webkit-scrollbar-thumb{
    background-color: #9bd4ef;
}
</style>
