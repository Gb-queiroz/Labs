import os
import sys
from datetime import datetime
from usuario import Usuario
from video import Video
from lista_reproducao import ListaReproducao

ARQUIVO_USUARIOS = "usuarios.txt"
ARQUIVO_VIDEOS = "videos.txt"
ARQUIVO_CURTIDAS = "curtidas.txt"
ARQUIVO_FAVORITOS = "favoritos.txt"

class FEItv:
    def __init__(self):
        self.usuario_logado = None 
        self.usuarios = {} 
        self.videos = {}
        self.carregar_dados()
    
    def carregar_dados(self):

        print("Carregando")
        self.carregar_usuarios()
        self.carregar_videos()
        print("Pronto\n")
    
    def carregar_usuarios(self):

        if not os.path.exists(ARQUIVO_USUARIOS):
            return
        
        with open(ARQUIVO_USUARIOS, "r", encoding="utf-8") as arquivo:
            for linha in arquivo:
                linha = linha.strip()
                if linha: 
                    partes = linha.split("|")
                    if len(partes) == 3:
                        username, senha, data = partes
                        usuario = Usuario(username, senha, data)
                        self.usuarios[username] = usuario
    
    def carregar_videos(self):

        if not os.path.exists(ARQUIVO_VIDEOS):
            return
        
        with open(ARQUIVO_VIDEOS, "r", encoding="utf-8") as arquivo:
            for linha in arquivo:
                linha = linha.strip()
                if linha:
                    partes = linha.split("|")
                    if len(partes) == 6:
                        id_video, titulo, descricao, genero, duracao, data = partes
                        video = Video(int(id_video), titulo, descricao, genero, int(duracao), data)
                        
                        video.curtidas = self.contar_curtidas(int(id_video))
                        
                        self.videos[int(id_video)] = video
    
    def contar_curtidas(self, id_video):

        if not os.path.exists(ARQUIVO_CURTIDAS):
            return 0
        
        contagem = 0
        with open(ARQUIVO_CURTIDAS, "r", encoding="utf-8") as arquivo:
            for linha in arquivo:
                linha = linha.strip()
                if linha:
                    partes = linha.split("|")
                    if len(partes) == 2 and partes[1] == str(id_video):
                        contagem += 1
        return contagem
    
    def salvar_usuarios(self):

        with open(ARQUIVO_USUARIOS, "w", encoding="utf-8") as arquivo:
            for usuario in self.usuarios.values():
                arquivo.write(f"{usuario.username}|{usuario.senha}|{usuario.data_cadastro}\n")
    
    def salvar_videos(self):

        with open(ARQUIVO_VIDEOS, "w", encoding="utf-8") as arquivo:
            for video in self.videos.values():
                arquivo.write(f"{video.id}|{video.titulo}|{video.descricao}|{video.genero}|{video.duracao}|{video.data_criacao}\n")
    
    def exibir_menu_inicio(self):
        while True:
            print("\n" + "="*50)
            print("Queiroga´s tv")
            print("="*50)
            print("1. Login")
            print("2. Cadastrar usuário")
            print("3. Sair")
            print("="*50)
            
            opcao = input("Escolha uma opção: ").strip()
            
            if opcao == "1":
                self.fazer_login()
            elif opcao == "2":
                self.cadastrar_usuario()
            elif opcao == "3":
                print("\nSair")
                sys.exit()
            else:
                print("Erro")
    
    def fazer_login(self):

        username = input("\nDigite seu usuário: ").strip()
        senha = input("Digite sua senha: ").strip()
        
        if username in self.usuarios and self.usuarios[username].verificar_senha(senha):
            self.usuario_logado = self.usuarios[username]
            print(f"\n {username} entrou")
            self.menu_principal()
        else:
            print("\nUsuário ou senha incorretos")
    
    def cadastrar_usuario(self):

        username = input("\nDigite o nome de usuário: ").strip()
        
        if username in self.usuarios:
            print("Esse usuário já existe")
            return
        
        if len(username) < 1:
            print("tem que ter pelo menos 1 caracter")
            return
        
        senha = input("Digite uma senha: ").strip()
        if len(senha) < 1:
            print("tem que ter pelo menos 1 caracter")
            return
        
        data_hoje = datetime.now().strftime("%Y-%m-%d")
        novo_usuario = Usuario(username, senha, data_hoje)
        self.usuarios[username] = novo_usuario
        
        self.salvar_usuarios()
        print(f"\n '{username}' criado")
    
    def menu_principal(self):
        while True:
            print("\n" + "="*50)
            print(f"Inicio - {self.usuario_logado.username}")
            print("="*50)
            print("1. Buscar filme")
            print("2. Meus favoritos")
            print("3. Listar todos os filmes")
            print("4. Sair")
            print("="*50)
            
            opcao = input("Escolha uma opção: ").strip()
            
            if opcao == "1":
                self.buscar_videos()
            elif opcao == "2":
                self.gerenciar_favoritos()
            elif opcao == "3":
                self.listar_todos_videos()
            elif opcao == "4":
                self.usuario_logado = None
                print("\n Desconectado")
                break
            else:
                print("Erro")
    
    def listar_todos_videos(self):
        if not self.videos:
            print("\nNenhum filme disponível!")
            return
        
        print("\n" + "="*80)
        print("filmes disponiveis")
        print("="*80)
        
        for id_video, video in sorted(self.videos.items()):
            print(f"\nID: {video.id}")
            print(f"Título: {video.titulo}")
            print(f"Descrição: {video.descricao}")
            print(f"Gênero: {video.genero}")
            print(f"Duração: {video.duracao} min")
            print(f"Curtidas: {video.curtidas}")
            print("-"*80)
    
    def buscar_videos(self):
 
        termo = input("\nDigite o nome do vídeo para buscar: ").strip().lower()
        resultados = []
        
        for video in self.videos.values():
            if termo in video.titulo.lower():
                resultados.append(video)
        
        if not resultados:
            print(f"\nNenhum filme encontrado com '{termo}'!")
            return
        
        print(f"\nEncontrados {len(resultados)} filme:")
        print("-"*80)
        
        for i, video in enumerate(resultados, 1):
            print(f"\n{i}. {video.titulo}")
            print(f"   Descrição: {video.descricao}")
            print(f"   Gênero: {video.genero} | Duração: {video.duracao}min")
            print(f"   curtidas: {video.curtidas}")
        
        print("\n" + "-"*80)
        try:
            escolha = int(input("Selecione um filme (ID) ou 0 para voltar: "))
            
            if escolha == 0:
                return
            
            if 1 <= escolha <= len(resultados):
                video_selecionado = resultados[escolha - 1]
                self.exibir_detalhes_video(video_selecionado)
            else:
                print("Erro")
        except ValueError:
            print("Erro")
    
    def exibir_detalhes_video(self, video):

        while True:
            print("\n" + "="*80)
            print(f"{video.titulo.upper()}")
            print("="*80)
            print(f"Descrição: {video.descricao}")
            print(f"Gênero: {video.genero}")
            print(f"Duração: {video.duracao} minutos")
            print(f"Data: {video.data_criacao}")
            print(f"Curtidas: {video.curtidas}")
            print("="*80)
            print("1. Curtir filme")
            print("2. Remover curtida")
            print("3. Adicionar aos favoritos")
            print("4. Voltar")
            print("="*80)
            
            opcao = input("Escolha uma opção: ").strip()
            
            if opcao == "1":
                self.curtir_video(video)
            elif opcao == "2":
                self.remover_curtida(video)
            elif opcao == "3":
                self.adicionar_aos_favoritos(video)
            elif opcao == "4":
                break
            else:
                print("Erro")
    
    def curtir_video(self, video):

        if self.usuario_ja_curtiu(self.usuario_logado.username, video.id):
            print("Você já curtiu")
            return
        
        with open(ARQUIVO_CURTIDAS, "a", encoding="utf-8") as arquivo:
            arquivo.write(f"{self.usuario_logado.username}|{video.id}\n")
        
        video.curtidas += 1
        print(f"Vídeo curtido. {video.curtidas} curtidas")
    
    def remover_curtida(self, video):

        if not self.usuario_ja_curtiu(self.usuario_logado.username, video.id):
            print("Você não curtiu esse")
            return
        
        curtidas = []
        if os.path.exists(ARQUIVO_CURTIDAS):
            with open(ARQUIVO_CURTIDAS, "r", encoding="utf-8") as arquivo:
                for linha in arquivo:
                    linha = linha.strip()
                    if linha:
                        partes = linha.split("|")
                        if not (partes[0] == self.usuario_logado.username and partes[1] == str(video.id)):
                            curtidas.append(linha)
        
        with open(ARQUIVO_CURTIDAS, "w", encoding="utf-8") as arquivo:
            for curtida in curtidas:
                arquivo.write(curtida + "\n")
        
        video.curtidas -= 1
        print(f"Curtida removida Total: {video.curtidas} curtidas")
    
    def usuario_ja_curtiu(self, username, id_video):

        if not os.path.exists(ARQUIVO_CURTIDAS):
            return False
        
        with open(ARQUIVO_CURTIDAS, "r", encoding="utf-8") as arquivo:
            for linha in arquivo:
                linha = linha.strip()
                if linha:
                    partes = linha.split("|")
                    if len(partes) == 2 and partes[0] == username and partes[1] == str(id_video):
                        return True
        return False
    
    def adicionar_aos_favoritos(self, video):
        listas = self.carregar_listas_usuario()
        
        if not listas:
            print("\n não tem listas de favoritos")
            print("quer criar?")
            if input("S/N: ").upper() == "S":
                self.criar_lista_reproducao()
            return
        
        print("\nSuas listas de favoritos:")
        for i, nome in enumerate(listas, 1):
            print(f"{i}. {nome}")
        
        try:
            escolha = int(input("Selecione uma lista: "))
            if 1 <= escolha <= len(listas):
                lista_selecionada = listas[escolha - 1]
                self.adicionar_video_lista(lista_selecionada, video)
            else:
                print("Erro")
        except ValueError:
            print("Erro")
    
    def carregar_listas_usuario(self):

        listas = []
        if not os.path.exists(ARQUIVO_FAVORITOS):
            return listas
        
        with open(ARQUIVO_FAVORITOS, "r", encoding="utf-8") as arquivo:
            for linha in arquivo:
                linha = linha.strip()
                if linha:
                    partes = linha.split("|")
                    if len(partes) >= 2 and partes[0] == self.usuario_logado.username:
                        if partes[1] not in listas:
                            listas.append(partes[1])
        
        return listas
    
    def criar_lista_reproducao(self):

        nome_lista = input("Digite o nome da lista: ").strip()
        
        if not nome_lista:
            print("Erro")
            return
        
        listas = self.carregar_listas_usuario()
        if nome_lista in listas:
            print("já existe")
            return
        
        with open(ARQUIVO_FAVORITOS, "a", encoding="utf-8") as arquivo:
            arquivo.write(f"{self.usuario_logado.username}|{nome_lista}|\n")
        
        print(f"Lista '{nome_lista}' criada")
    
    def adicionar_video_lista(self, nome_lista, video):
        linhas = []
        video_adicionado = False
        
        if os.path.exists(ARQUIVO_FAVORITOS):
            with open(ARQUIVO_FAVORITOS, "r", encoding="utf-8") as arquivo:
                for linha in arquivo:
                    linha = linha.strip()
                    if linha:
                        partes = linha.split("|")
                        
                        if (len(partes) >= 2 and 
                            partes[0] == self.usuario_logado.username and 
                            partes[1] == nome_lista):
                            
                            videos_ids = partes[2].split(",") if partes[2] else []
                            
                            if str(video.id) not in videos_ids:
                                videos_ids.append(str(video.id))
                                video_adicionado = True
                            
                            linha = f"{partes[0]}|{partes[1]}|{','.join(videos_ids)}"
                        
                        linhas.append(linha)
        
        with open(ARQUIVO_FAVORITOS, "w", encoding="utf-8") as arquivo:
            for linha in linhas:
                arquivo.write(linha + "\n")
        
        if video_adicionado:
            print(f"Vídeo adicionado à lista '{nome_lista}'!")
        else:
            print("já está nesta lista")
    
    def gerenciar_favoritos(self):
        while True:
            print("\n" + "="*50)
            print("Ver favoritos")
            print("="*50)
            print("1. Ver lista de favoritos")
            print("2. Criar nova lista")
            print("3. Excluir lista")
            print("4. Voltar")
            print("="*50)
            
            opcao = input("Escolha uma opção: ").strip()
            
            if opcao == "1":
                self.visualizar_lista_favoritos()
            elif opcao == "2":
                self.criar_lista_reproducao()
            elif opcao == "3":
                self.excluir_lista()
            elif opcao == "4":
                break
            else:
                print("Erro")
    
    def visualizar_lista_favoritos(self):
        listas = self.carregar_listas_usuario()
        
        if not listas:
            print("\n não tem lista de favoritos")
            return
        
        print("\nSuas listas:")
        for i, nome in enumerate(listas, 1):
            print(f"{i}. {nome}")
        
        try:
            escolha = int(input("Selecione uma lista: "))
            if 1 <= escolha <= len(listas):
                self.exibir_videos_lista(listas[escolha - 1])
            else:
                print("Erro")
        except ValueError:
            print("Erro")
    
    def exibir_videos_lista(self, nome_lista):
        if not os.path.exists(ARQUIVO_FAVORITOS):
            return
        
        print(f"\n" + "="*80)
        print(f" Lista: {nome_lista}")
        print("="*80)
        
        encontrou = False
        with open(ARQUIVO_FAVORITOS, "r", encoding="utf-8") as arquivo:
            for linha in arquivo:
                linha = linha.strip()
                if linha:
                    partes = linha.split("|")
                    if (len(partes) >= 3 and 
                        partes[0] == self.usuario_logado.username and 
                        partes[1] == nome_lista):
                        
                        videos_ids = partes[2].split(",") if partes[2] else []
                        
                        if not videos_ids or not videos_ids[0]:
                            print("A lista está vazia!")
                            return
                        
                        encontrou = True
                        for id_str in videos_ids:
                            if id_str:
                                id_video = int(id_str)
                                if id_video in self.videos:
                                    video = self.videos[id_video]
                                    print(f"\n• {video.titulo}")
                                    print(f"  Descrição: {video.descricao}")
                                    print(f"  Gênero: {video.genero} | Duração: {video.duracao}min")
                                    print(f"  ID: {video.id}")
                        
                        print("\n" + "="*80)
                        if input("Remover algum vídeo? (S/N): ").upper() == "S":
                            self.remover_video_lista(nome_lista)
        
        if not encontrou:
            print("Lista não encontrada")
    
    def remover_video_lista(self, nome_lista):
        try:
            id_video = int(input("Digite o ID do vídeo a remover: "))
            
            linhas = []
            with open(ARQUIVO_FAVORITOS, "r", encoding="utf-8") as arquivo:
                for linha in arquivo:
                    linha = linha.strip()
                    if linha:
                        partes = linha.split("|")
                        
                        if (len(partes) >= 3 and 
                            partes[0] == self.usuario_logado.username and 
                            partes[1] == nome_lista):
                            
                            videos_ids = partes[2].split(",") if partes[2] else []
                            videos_ids = [v for v in videos_ids if v and int(v) != id_video]
                            linha = f"{partes[0]}|{partes[1]}|{','.join(videos_ids)}"
                        
                        linhas.append(linha)
            
            with open(ARQUIVO_FAVORITOS, "w", encoding="utf-8") as arquivo:
                for linha in linhas:
                    arquivo.write(linha + "\n")
            
            print("Vídeo removido")
        
        except ValueError:
            print("Erro")
    
    def excluir_lista(self):
        listas = self.carregar_listas_usuario()
        
        if not listas:
            print("\n não tem listas")
            return
        
        print("\nSuas listas:")
        for i, nome in enumerate(listas, 1):
            print(f"{i}. {nome}")
        
        try:
            escolha = int(input("Selecione a lista que deseja excluir: "))
            if 1 <= escolha <= len(listas):
                nome_lista = listas[escolha - 1]
                
                if input(f"Tem certeza? (S/N): ").upper() == "S":
                    linhas = []
                    with open(ARQUIVO_FAVORITOS, "r", encoding="utf-8") as arquivo:
                        for linha in arquivo:
                            linha = linha.strip()
                            if linha:
                                partes = linha.split("|")
                                if not (len(partes) >= 2 and 
                                       partes[0] == self.usuario_logado.username and 
                                       partes[1] == nome_lista):
                                    linhas.append(linha)
                    
                    with open(ARQUIVO_FAVORITOS, "w", encoding="utf-8") as arquivo:
                        for linha in linhas:
                            arquivo.write(linha + "\n")
                    
                    print(f"Lista '{nome_lista}' excluida")
            else:
                print("Erro")
        except ValueError:
            print("Erro")
    
    def iniciar(self):
        self.exibir_menu_inicio()


if __name__ == "__main__":
    app = FEItv()
    app.iniciar()
