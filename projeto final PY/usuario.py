class Usuario:
    def __init__(self, username, senha, data_cadastro):
        self.username = username
        self.senha = senha
        self.data_cadastro = data_cadastro
    
    def verificar_senha(self, senha_fornecida):
         return self.senha == senha_fornecida
    
    def __str__(self):
        return f"Usuário: {self.username} (cadastrado em {self.data_cadastro})"
