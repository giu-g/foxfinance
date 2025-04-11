document.getElementById('cadastroGastos').addEventListener('submit', function (e) {
    e.preventDefault();

    // Pegando os valores do formulário
    const categoriaId = parseInt(document.getElementById('categoria').value); // ID da categoria
    const descricao = document.getElementById('descricao').value.trim();
    const valor = parseFloat(document.getElementById('valor').value.replace(',', '.'));  // Garantir que seja um número válido
    const data = document.getElementById('data').value.trim();

    // Função para formatar a data para o formato esperado pelo banco de dados (YYYY-MM-DD)
    function formatDate(date) {
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`;  // Formato correto para o banco de dados
    }

    // Verificando se todos os campos estão preenchidos corretamente
    if (!descricao || isNaN(valor) || !data || isNaN(categoriaId)) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Formatando a data
    const formattedDate = formatDate(data);


    //************************ */
    // Aqui perguntamos ao usuário o ID ou email para associar o gasto a ele
    const usuarioId = prompt("Por favor, informe o seu ID de usuário para associar este gasto:", "");

    // Se o usuário não fornecer o ID, vamos interromper a requisição
    if (!usuarioId) {
        alert("ID de usuário é necessário para registrar o gasto.");
        return;
    }

    // Validando os IDs de usuário e categoria
    if (isNaN(usuarioId) || usuarioId <= 0) {
        alert("Por favor, forneça um ID de usuário válido.");
        return;
    }

    if (isNaN(categoriaId) || categoriaId <= 0) {
        alert("Por favor, forneça um ID de categoria válido.");
        return;
    }

    // Criando o objeto da categoria e usuário como no seu exemplo
    const categoria = {
        id_categoria: categoriaId,
        tipo: document.getElementById('categoria').options[document.getElementById('categoria').selectedIndex].text  // Nome da categoria
    };

    const usuario = {
        id_usuario: usuarioId,
        email: "paola@gmail",  // Substitua com o email real, se necessário
        objetivo: "Poupar",    // Substitua com o objetivo real, se necessário
        nome: "Paola",         // Substitua com o nome real, se necessário
        senha: "123456"        // Substitua com a senha real, se necessário
    };

    // Enviar para a API de cadastro de gastos
    fetch('http://localhost:8080/gastos/criar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            valor: valor,
            tipo_gastos: descricao,
            dataa: formattedDate,
            categoria: categoria,
            usuario: usuario
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Resposta do servidor:', data);  // Verifique a resposta aqui
            alert('Gasto cadastrado com sucesso!');
            document.getElementById('cadastroGastos').reset();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao cadastrar gasto');
        });
});
