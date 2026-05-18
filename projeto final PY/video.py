class Video:
    def __init__(self, id, titulo, descricao, genero, duracao, data_criacao):

        self.id = id
        self.titulo = titulo
        self.descricao = descricao
        self.genero = genero
        self.duracao = duracao
        self.data_criacao = data_criacao
        self.curtidas = 0 
    
    def aumentar_curtidas(self):
        self.curtidas += 1
    
    def diminuir_curtidas(self):
        if self.curtidas > 0:
            self.curtidas -= 1
    
    def obter_info(self):

        return f"""
        ID: {self.id}
        Título: {self.titulo}
        Descrição: {self.descricao}
        Gênero: {self.genero}
        Duração: {self.duracao} minutos
        Data: {self.data_criacao}
        Curtidas: {self.curtidas}
        """
    
    def __str__(self):
        return f"{self.titulo} ({self.genero}) - {self.duracao}min"
