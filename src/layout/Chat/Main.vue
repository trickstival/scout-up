
<script>
import {mapGetters} from 'vuex'
import Chat from './Chat.vue'

var vm = {
  components:{
    Chat
  },
  firebase(){
    return { }
  },
  watch:{
    usuarioDatabase() {
      if(this.usuarioDatabase){
        this.$bindAsArray('amigos', this.database.ref("/usuario/"+this.usuarioDatabase['.key']+"/amigos"))
        this.$bindAsArray('usuarioConversas', this.database.ref("/usuario/"+this.usuarioDatabase['.key']+"/conversas"))
      }
      this.$bindAsArray('conversas', this.database.ref("conversas"))
    },
    amigos(){
      if(this.amigos){
        this.amigosOnline = this.amigos.filter(amigo => amigo.status == 'online')
        this.amigosOffline = this.amigos.filter(amigo => amigo.status == 'offline')
        this.amigosOrdenado = this.amigosOnline.concat(this.amigosOffline)
        console.log("this.amigosOrdenado", this.amigosOrdenado)

      }
    }
  },
  data(){
    return {
      mostrarChat: false,
      conversaSelecionada: null,
      chaveConversa: null,
      amigoSelecionado: null,
      amigosOrdenado: [],
      amigos: null,
      amigosOnline:null,
      amigosOffline:null,
      usuarioConversas: null,
      conversas: null
    }
  },
  methods: {
    checkSignedInWithMessage() {
      if (this.auth.currentUser) {
        return true;
      }
    },
    conversaJaExiste(chaveAmigo){
      let isCriado = false;
      this.$firebaseRefs.usuarioConversas.on('value', snapshot =>{
        snapshot.forEach(childSnap => {
          console.log(childSnap.val())
          if(childSnap.val().outroUser === chaveAmigo){
            isCriado = true;
            this.chaveConversa = childSnap.val().chave
          }
        });
      })
      console.log(isCriado)
      return isCriado
    },
    abrirChat(amigo){    
      this.conversaJaExiste(amigo.chave)
      // if(!this.conversaJaExiste(amigo.chave)){
        
      // }
      this.conversaSelecionada = this.$firebaseRefs.conversas.child(this.chaveConversa)
      this.amigoSelecionado = amigo
      this.mostrarChat = !this.mostrarChat
    }
    
  },
  computed: {
    ...mapGetters({usuarioDatabase: 'getUsuarioDatabase', auth: 'getAuth', database: 'getDatabase', usuario: 'getUsuario',
                            firebase: 'getFirebase'}),
    getCountAmigosOnline(){
      if(this.amigosOnline && this.amigosOnline != null){
        var count = 0
        this.amigosOnline.forEach(amigo =>{
          console.log("aloalo")
          if(amigo.chave){
            count++
          }
        })
        return count
      }
    }
  }
}
export default vm

</script>

<template>
<div v-if="usuarioDatabase && amigosOrdenado.length>0" class="root">
  <div data-toggle="collapse" data-target="#corpo-friendlist" class="text-center friendlist-minimizado">
      Lista de Amigos
    <span class="badge">{{ getCountAmigosOnline }}</span>
  </div>
  <div id="corpo-friendlist" class="collapse">
    <div class="list-group">
      <li v-for="amigo in amigosOrdenado" v-if="amigo.chave" class="item-lista list-group-item" @click="abrirChat(amigo)">
          <i v-if="amigo.status == 'online'" class="fa fa-circle text-success" aria-hidden="true"></i>
          <i v-else-if="amigo.status == 'offline'" class="fa fa-circle text-danger" aria-hidden="true"></i>
          {{ amigo.nome }}
      <span v-if="amigo.countMensagensNaoLidas != 0" class="badge">{{amigo.countMensagensNaoLidas}}</span>
      </li>
  </div>
  </div>
  <chat @fecharChat="mostrarChat = false" v-if="mostrarChat" :amigo="amigoSelecionado" :conversaRef="conversaSelecionada"></chat>
</div>
</template>


<style>

.friendlist-minimizado{
  background-color: #56402E;
  height: 30px;
  position: fixed;
  bottom: 0;
  right: 15px;
  width: 200px;
  padding: 5px;
  color: white;
  z-index: 5;
  border-radius: 5px;
  cursor: pointer;
}

.item-lista{
  background-color: #eacf9b ;
  color: black;
  cursor: pointer;
}
#corpo-friendlist{
  background-color: transparent;
  max-height: 500px;
  position: fixed;
  border-radius: 15px 15px 0px  0px !important ;
  bottom: 10px;
  right: 15px;
  width: 200px;
  color:white;
}
</style>
