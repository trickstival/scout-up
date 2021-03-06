export default {
    retornaProvider(tipo, auth){
        switch(tipo){
            case 'facebook': return new auth.FacebookAuthProvider()
            case 'google': return new auth.GoogleAuthProvider()
        }
    },
    montarObjUsuarioParaDatabaseComObjetoDoAuth(resultadoDoAuth){
        //, tipo tipoUsuario
        var nome, email, baseMsgErr='Impossível adquirir o seguinte campo do provedor de autenticação: ';
        if(resultadoDoAuth.displayName){
            nome = resultadoDoAuth.displayName
        } else if(resultadoDoAuth.user){
            nome = resultadoDoAuth.user
        } else {
            console.error(baseMsgErr+'nome de usuário')
            return false
        }

        if(resultadoDoAuth.email){
            email = resultadoDoAuth.email
        } else{
            console.error(baseMsgErr+'email')
            return false
        }

        return {nome: nome, email: email}
        //tipo: tipoUsuario
  }
}
