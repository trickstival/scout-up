<script>
import Validador from './Validador'

    var vm = {
        firebase() {
            return {
                estados: this.retornaDatabase.ref('/estados/'),
                grupos: this.retornaDatabase.ref('/grupo/')
            }
        },
        data(){
            return {
                txtNome: '',
                estadoSelecionado: '',
                cidadesDoEstado: '',
                cidadeSelecionada: ''
            }
        },
        computed: {
            retornaUsuarioDatabase(){
                return this.$store.state.usuarioDatabase
            },
            retornaDatabase(){
                return this.$store.state.firebase.database()
            }
        },
        methods: {
            cadastrarGrupo(){
                if(!this.estadoSelecionado || !this.cidadeSelecionada)
                    return Validador.emitirAlert("Selecione um estado.")

                let self = this   
                let grupo = {
                    nome: this.txtNome.replace(/(?:^|\s)\S/g, l => l.toUpperCase()),
                    estado: this.estadoSelecionado.nome,
                    cidade: this.cidadeSelecionada,
                        criador: {
                            chave: this.retornaUsuarioDatabase['.key'], 
                            nome: this.retornaUsuarioDatabase['nome']
                        },
                    timeStamp: this.$store.state.firebase.database.ServerValue.TIMESTAMP
                }
                if(!Validador.validar(grupo))
                    return
                this.$firebaseRefs.grupos.push(grupo).then(snapshot => {
                    this.retornaDatabase.ref('/usuario/'+this.retornaUsuarioDatabase['.key']).update({
                        grupo: snapshot.key
                    })
                }).then(result => self.$router.replace('/usuarios/'+this.$store.state.usuarioDatabase['.key']))
            }
        },
        watch: {
            'estadoSelecionado'(){
                if(this.estadoSelecionado){
                    this.cidadesDoEstado = this.estadoSelecionado['cidades']
                    this.cidadeSelecionada = this.cidadesDoEstado[0]
                }

            }
        },
        created(){
            console.log(this.$store.state.firebase.database.ServerValue.TIMESTAMP)
        }
    }
    export default vm
</script>

<template>
    <div class="container container-main">
        <div class="row" v-if="!retornaUsuarioDatabase">
            <div class="col-xs-12">
                <h1 class="carregando text-center"><i class="fa fa-spinner fa-spin"></i></h1>
            </div>
        </div>
        <div class="row" v-else>
            <div class="row text-center">
                <h1 class="titulo">CADASTRE SEU GRUPO</h1>
            </div>
            <div class="row">
                <div class="panel panel-warning">
                    <div class="panel-heading">
                        Informações do Grupo
                    </div>
                    <div class="panel-body">
                        <form>
                            <div class="form-group col-xs-12">
                                <label class="text-warning" for="txtNomeGrupo">Nome</label>
                                <input v-model="txtNome" id="txtNomeGrupo" class="form-control" type="text" placeholder="Digite o nome do Grupo">
                            </div>
                            <div class="form-group col-xs-3">
                                <label class="text-warning" for="cmbEstadoGrupo">Estado</label>
                                <select v-model="estadoSelecionado" class="form-control" id="cmbEstadoGrupo">
                                    <option disabled>Selecione um Estado</option>
                                    <template v-for="estado in estados">
                                        <option :value="estado">{{estado.sigla}}</option>
                                    </template>
                                </select>
                            </div>
                            <div class="form-group col-xs-3">
                                <label class="text-warning" for="cmbCidadeGrupo">Cidade</label>
                                <select v-model="cidadeSelecionada" id="cmbCidadeGrupo" class="form-control">
                                    <template v-for="cidade in cidadesDoEstado">
                                        <option :value="cidade">{{cidade}}</option>
                                    </template>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="panel-footer">
                        <div class="row">
                            <div class="btn-toolbar pull-right">
                                <button @click="cadastrarGrupo()" class="btn btn-success">Cadastrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>


<style>
    h1.carregando{
        color:#B9C159;
        font-family: claire, Helvetica, sans-serif;
        font-size: 90px;
    }
    h1.titulo{
        font-family: claire, Helvetica, sans-serif;
        color: rgb(234,207,155);
        font-size: 60px;
    }
    .btn-toolbar{
        padding-right: 10px;
    }
</style>
