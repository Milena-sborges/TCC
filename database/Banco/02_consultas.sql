-- =====================================================
-- PROJETO: Biblioteca Emocional
-- Curso: Análise e Desenvolvimento de Sistemas
-- Banco de Dados do TCC


-- Este script mostra todas as consultas feitas 
--no Banco de Dados


-- Autoras:
-- Maria Luiza Melo
-- Milena Borges
-- =====================================================

-- =====================================================
-- BUSCAR TODOS OS LIVROS - consulta_01
-- =====================================================

SELECT * FROM Livro;

-- =====================================================
-- BUSCAR UM LIVRO ESPECÍFICO - consulta_02
-- =====================================================

SELECT *
FROM Livro
WHERE id_livro = 3;

-- =====================================================
-- BUSCAR LIVROS POR EMOÇÃO - consulta_03
-- =====================================================

SELECT l.*
FROM Livro l
JOIN Livro_Tag lt ON l.id_livro = lt.id_livro
JOIN Tag_Emocional t ON lt.id_tag = t.id_tag
WHERE t.nome='Tristeza';

-- =====================================================
-- BUSCAR POR GÊNERO - consulta_04
-- =====================================================

SELECT *
FROM Livro
WHERE genero='Romance';

-- =====================================================
-- QUANTIDADE DE LIVROS - consulta_05
-- =====================================================

SELECT COUNT(*)
FROM Livro;

-- =====================================================
-- QUANTOS LIVROS EXISTEM POR EMOÇÃO - consulta_06
-- =====================================================

SELECT
t.nome,
COUNT(*) AS quantidade
FROM Livro_Tag lt
JOIN Tag_Emocional t
ON lt.id_tag=t.id_tag
GROUP BY t.nome;

