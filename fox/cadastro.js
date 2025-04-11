// Função que valida um email
function isEmailValid(email) {
    const emailRegex = new RegExp(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    );
    return emailRegex.test(email);
}

// Função que valida a senha
function validateSenha(senha, minDigits) {
    return senha.length >= minDigits;
}

// Função para cadastrar o usuário
document.getElementById('form').addEventListener('submit', cadastrarUsuario);

// Função para cadastrar o usuário
async function cadastrarUsuario(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const objetivo = document.getElementById('objetivo').value;     

    // Verifica se o nome está vazio
    if (nome === "") {
        alert("Preencha o seu nome");
        return;
    }

    // Verifica se o email está vazio e se é válido
    if (email === "" || !isEmailValid(email)) {
        alert("Por favor, preencha o email corretamente");
        return;
    }

    // Verifica se a senha está preenchida e com no mínimo 6 dígitos
    if (!validateSenha(senha, 6)) {
        alert("Preencha a senha com no mínimo 6 dígitos");
        return;
    }

    // Primeiro try-catch para o cadastro via POST
    try {
        const response = await fetch('http://localhost:8080/usuarios/criar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },    
            body: JSON.stringify({ nome, email, senha, objetivo }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Erro no cadastro:', errorResponse);
            throw new Error(errorResponse.message || 'Erro ao cadastrar usuário');
        }

        // Resposta do cadastro - Obtendo os dados do novo usuário, incluindo o ID
        const responseData = await response.json();
        console.log('Resposta da API:', responseData);  // Verifica a resposta

        const id_usuario = responseData.id_usuario;  // Agora usamos o id_usuario em vez de id

        // Verifique se o ID foi retornado
        if (!id_usuario) {
            throw new Error('ID do usuário não encontrado na resposta da API');
        }

        console.log('Usuário cadastrado com sucesso, ID:', id_usuario);
        
        // Exibe o ID gerado para o usuário
       /*  alert(`Cadastro realizado com sucesso! Seu ID é: ${id_usuario}`); */

        // Limpa o formulário após o cadastro
        document.getElementById('form').reset();

        // Agora, chama a função para obter os dados do usuário
        obterIdUsuario(id_usuario); // Passa o id_usuario gerado para obter os dados

    } catch (error) {
        console.error('Erro no cadastro:', error);
    }
}

// Função para recuperar os dados do usuário via GET
async function obterIdUsuario(id_usuario) {
    if (!id_usuario) {
        console.error('ID de usuário inválido:', id_usuario);
        return;
    }

    try {
        const userResponse = await fetch(`http://localhost:8080/usuarios/${id_usuario}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!userResponse.ok) {
            throw new Error('Erro ao recuperar os dados do usuário');
        }

        const userData = await userResponse.json();

        // Exibindo o ID do usuário com o alert
        alert(`O ID do usuário é: ${userData.id_usuario}`);

        // Redireciona para index.html após o alerta
        window.location.href = "index.html";

    } catch (error) {
        console.error('Erro:', error);
    }
}
