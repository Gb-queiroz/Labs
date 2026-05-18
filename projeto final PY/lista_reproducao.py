class ListaReproducao:
    def __init__(self, nome, data_criacao):

        self.nome = nome
        self.videos = []  
        self.data_criacao = data_criacao
    
    def adicionar_video(self, video):

        for v in self.videos:
            if v.id == video.id:
                return False  
        
        self.videos.append(video)
        return True
    
    def remover_video(self, id_video):

        for i, video in enumerate(self.videos):
            if video.id == id_video:
                self.videos.pop(i)
                return True
        return False
    
    def obter_duracao_total(self):

        total = sum(video.duracao for video in self.videos)
        return total
    
    def listar_videos(self):

        if not self.videos:
            return f"A lista '{self.nome}' está vazia"
        
        resultado = f"\nLista: {self.nome}\n"
        resultado += f"Criada em: {self.data_criacao}\n"
        resultado += f"Total de filmes: {len(self.videos)}\n"
        resultado += f"Duração total: {self.obter_duracao_total()} minutos\n"
        resultado += "-" * 60 + "\n"
        
        for i, video in enumerate(self.videos, 1):
            resultado += f"{i}. {video.titulo}\n"
            resultado += f"   Gênero: {video.genero} | Duração: {video.duracao}min\n"
            resultado += f"   Descrição: {video.descricao}\n"
        
        return resultado
    
    def __str__(self):
        return f"Lista '{self.nome}' com {len(self.videos)} Filmes"
