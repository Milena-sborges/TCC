-- =====================================================
-- PROJETO: Biblioteca Emocional
-- Curso: Análise e Desenvolvimento de Sistemas
-- Banco de Dados do TCC


- Este script cria toda a estrutura do banco de dados,
-- incluindo tabelas, relacionamentos e dados iniciais.


-- Autoras:
-- Maria Luiza Melo
-- Milena Borges
-- =====================================================


-- =====================================================
-- CRIAÇÃO DO BANCO DE DADOS
-- =====================================================

CREATE DATABASE biblioteca_emocional_bd;

USE biblioteca_emocional_bd;


-- CRIAÇÃO DAS TABELAS

-- =====================================================
-- TABELA LIVRO
-- =====================================================
CREATE TABLE Livro (
id_livro INT AUTO_INCREMENT PRIMARY KEY,
titulo VARCHAR(255) NOT NULL,
autor VARCHAR(150) NOT NULL,
genero VARCHAR(100) NOT NULL,
sinopse TEXT NOT NULL,
ano_publicacao INT,
capa_url VARCHAR(500),
link_leitura VARCHAR(500)
);

-- =====================================================
-- TABELA TAG_EMOCIONAL
-- =====================================================
CREATE TABLE Tag_Emocional (
    id_tag INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

-- =====================================================
-- TABELA LIVRO_TAG
-- =====================================================
CREATE TABLE Livro_Tag (
    id_livro INT NOT NULL,
    id_tag INT NOT NULL,

    PRIMARY KEY (id_livro, id_tag),

    FOREIGN KEY (id_livro)
        REFERENCES Livro(id_livro),

    FOREIGN KEY (id_tag)
        REFERENCES Tag_Emocional(id_tag)
);


-- INSERÇÃO DAS TAGS EMOCIONAIS

-- =====================================================
-- INSERÇÃO DAS EMOÇÕES
-- =====================================================
INSERT INTO Tag_Emocional (nome, descricao) VALUES
('Felicidade', 'Livros que reforçam sentimentos positivos ou ajudam a manter um estado emocional alegre.'),
('Tristeza', 'Livros voltados para reflexão, acolhimento ou superação de momentos difíceis.'),
('Ansiedade', 'Livros capazes de acolher ou redirecionar sentimentos de preocupação e tensão.'),
('Tédio', 'Livros envolventes que despertam curiosidade, aventura e interesse.'),
('Neutro', 'Livros indicados para momentos sem uma emoção predominante.');

-- =====================================================
-- INSERÇÃO DOS LIVROS
-- =====================================================

INSERT INTO Livro
(titulo, autor, genero, sinopse, ano_publicacao, capa_url, link_leitura)
VALUES

(
'Pollyanna',
'Eleanor H. Porter',
'Romance infantojuvenil',
'"Pollyanna", de Eleanor H. Porter, é um romance publicado em 1913. Quando Pollyanna, uma órfã de onze anos, chega para morar com sua severa tia Polly em uma pequena cidade de Vermont, ela traz consigo "O Jogo da Alegria" — encontrar algo positivo em cada situação, por mais difícil que seja. Seu otimismo contagiante começa a transformar a vida dos habitantes mais problemáticos da cidade. Mas quando a tragédia acontece, até mesmo a alegria inabalável de Pollyanna enfrenta seu maior teste.',
1913,
'https://gutenberg.org/cache/epub/1450/images/cover.jpg',
'https://gutenberg.org/cache/epub/1450/pg1450-images.html'
),

(
'Jane Eyre: Uma Autobiografia',
'Charlotte Brontë',
'Romance',
'"Jane Eyre: Uma Autobiografia", de Charlotte Brontë, é um romance publicado em 1847. A obra narra a vida de Jane Eyre, desde sua infância opressiva até sua educação e a vida adulta, quando se torna governanta em Thornfield Hall e se apaixona pelo misterioso Sr. Rochester. Contada em primeira pessoa, esta obra inovadora de formação explora o desenvolvimento moral e espiritual, abordando temas como classe social, religião, sexualidade e feminismo. A história se desenrola em cinco fases distintas, cada uma moldando a jornada de Jane rumo à independência e ao sentimento de pertencimento.',
1847,
'https://www.gutenberg.org/cache/epub/1260/pg1260.cover.medium.jpg',
'https://gutenberg.org/cache/epub/1260/pg1260-images.html'
),

(
'O Jardim Secreto',
'Frances Hodgson Burnett',
'Romance',
'"O Jardim Secreto", de Frances Hodgson Burnett, é um romance infantil publicado pela primeira vez em 1911. Quando a órfã Mary Lennox chega à sombria mansão de seu tio em Yorkshire, ela descobre um jardim trancado, abandonado há dez anos. Ao explorar esse mundo oculto, Mary desvenda segredos de família e encontra um companheiro inesperado: seu primo Colin, que está acamado. Juntamente com um menino amante da natureza chamado Dickon, as crianças trazem o jardim esquecido de volta à vida, transformando-se no processo.',
1911,
'https://www.gutenberg.org/cache/epub/113/pg113.cover.medium.jpg',
'https://gutenberg.org/cache/epub/113/pg113-images.html'
),

(
'Drácula',
'Bram Stoker',
'Romance Gótico',
'"Drácula", de Bram Stoker, é um romance gótico de terror publicado em 1897. Narrada por meio de cartas, entradas de diário e artigos de jornal, a história acompanha o encontro aterrador do advogado Jonathan Harker com o Conde Drácula na Transilvânia. Quando o vampiro viaja para a Inglaterra e começa a atacar vítimas em Whitby, um pequeno grupo liderado pelo Professor Abraham Van Helsing precisa caçá-lo. Esta obra seminal da ficção gótica tornou-se a peça central da literatura vampírica, moldando profundamente a concepção popular de vampiros por gerações. ',
1897,
'https://www.gutenberg.org/cache/epub/345/pg345.cover.medium.jpg',
'https://gutenberg.org/cache/epub/345/pg345-images.html'
),

(
'Anne de Green Gables',
'L. M. Montgomery',
'Romance',
'"Anne de Green Gables", de L. M. Montgomery, é um romance publicado em 1908. Quando a órfã Anne Shirley, de onze anos, chega por engano à fazenda Green Gables, os irmãos Cuthbert haviam solicitado um menino para ajudar nos trabalhos agrícolas. Imaginativa, falante e ansiosa por pertencer àquele lugar, Anne precisa provar que merece ficar. A história acompanha suas aventuras na vila de Avonlea — fazendo amigos, se destacando na escola, entrando em conflito com o rival Gilbert Blythe e transformando a vida de todos ao seu redor. ',
1908,
'https://www.gutenberg.org/cache/epub/45/pg45.cover.medium.jpg',
'https://gutenberg.org/cache/epub/45/pg45-images.html'
),

(
'Alice no País das Maravilhas',
'Lewis Carroll',
'Fantasia',
'"Alice no País das Maravilhas", de Lewis Carroll, é um romance infantil publicado em 1865. Quando uma menina curiosa chamada Alice avista um Coelho Branco com um relógio de bolso, ela cai em uma toca de coelho e entra em um extraordinário mundo de fantasia repleto de criaturas antropomórficas peculiares. Esta obra pioneira de nonsense literário brinca com a lógica e a linguagem, criando um conto fantasioso que encanta tanto crianças quanto adultos. Ilustrada por John Tenniel, a obra ajudou a transformar a literatura infantil, de um instrumento didático para puro entretenimento.',
1865,
'https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg',
'https://gutenberg.org/cache/epub/11/pg11-images.html'
),

(
'A Ilha do Tesouro',
'Robert Louis Stevenson',
'Aventura',
'"A Ilha do Tesouro", de Robert Louis Stevenson, é um romance de aventura publicado em 1883. Quando o jovem Jim Hawkins descobre um misterioso mapa do tesouro no baú de um pirata morto, ele parte com uma tripulação para encontrar o lendário ouro enterrado do Capitão Flint. Mas a bordo do navio Hispaniola, o perigo espreita: o charmoso cozinheiro de uma perna só, Long John Silver, lidera um bando de piratas amotinados com seus próprios planos mortais. Em uma ilha remota repleta de traições e violência, Jim precisa navegar por alianças instáveis e ameaças mortais para sobreviver a essa perigosa busca por fortuna. ',
1883,
'https://www.gutenberg.org/cache/epub/120/pg120.cover.medium.jpg',
'https://gutenberg.org/cache/epub/120/pg120-images.html'
),

(
'Orgulho e Preconceito',
'Jane Austen',
'Romance',
'"Orgulho e Preconceito", de Jane Austen, é um romance publicado em 1813. A história acompanha Elizabeth Bennet, que precisa aprender a enxergar além das primeiras impressões e julgamentos precipitados. Com cinco filhas e uma propriedade que só pode ser herdada por homens, a família Bennet enfrenta a pressão financeira de fazer bons casamentos. Quando o rico Sr. Darcy chega à região rural onde vivem, seu orgulho e o preconceito de Elizabeth criam o cenário para mal-entendidos, verdades ocultas e revelações inesperadas sobre caráter e amor.',
1813,
'https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg',
'https://gutenberg.org/cache/epub/1342/pg1342-images.html'
),

(
'A Máquina do Tempo',
'H. G. Wells',
'Ficção Científica',
'"A Máquina do Tempo", de H. G. Wells, é uma novela de ficção científica publicada em 1895. Um cientista da era vitoriana, conhecido como o Viajante do Tempo, viaja para o ano 802.701, onde descobre que a humanidade evoluiu para duas espécies distintas: os Eloi, semelhantes a crianças, e os Morlocks, selvagens. Esta obra inovadora popularizou o conceito de viagem no tempo e cunhou o termo "máquina do tempo". Wells cria uma visão assombrosa do futuro que explora as divisões de classe e a desigualdade social, levando os leitores a uma aventura inesquecível pelas possibilidades mais sombrias do tempo.',
1895,
'https://www.gutenberg.org/cache/epub/35/pg35.cover.medium.jpg',
'https://gutenberg.org/cache/epub/35/pg35-images.html'
);

-- =====================================================
-- INSERÇÃO DO RELACIONAMENTO LIVRO × TAG
-- =====================================================
INSERT INTO Livro_Tag (id_livro, id_tag)
VALUES
(1, 2),
(2, 2),
(3, 2),
(4, 3),
(5, 2),
(6, 4),
(7, 4),
(8, 5),
(9, 5);