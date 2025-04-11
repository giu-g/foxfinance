// Ao enviar o formulário de busca de ID
document.getElementById('buscarIdForm').addEventListener('submit', buscarDadosUsuario);

async function buscarDadosUsuario(event) {
    event.preventDefault();

    const idUsuario = document.getElementById('idUsuario').value;

    // Verifica se o ID foi informado
    if (!idUsuario) {
        alert("Por favor, informe o seu ID");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/usuarios/${idUsuario}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Usuário não encontrado');
        }

        const userData = await response.json();

        // Preenche os campos com os dados do usuário
        document.getElementById('nome').value = userData.nome;
        document.getElementById('email').value = userData.email;
        document.getElementById('senha').value = userData.senha;
        document.getElementById('objetivo').value = userData.objetivo;

        // Salva o ID do usuário para uso posterior
        document.getElementById('editarUsuarioForm').setAttribute('data-user-id', userData.id_usuario);

        // Oculta o formulário de ID
        document.getElementById('formBuscarId').style.display = 'none';

        // Exibe o formulário de edição
        document.getElementById('formEditarUsuario').style.display = 'block';
    } catch (error) {
        alert(error.message);
    }
}

// Ao enviar o formulário de edição de dados
document.getElementById('editarUsuarioForm').addEventListener('submit', atualizarDadosUsuario);

async function atualizarDadosUsuario(event) {
    event.preventDefault();

    const idUsuario = document.getElementById('editarUsuarioForm').getAttribute('data-user-id'); // ID do usuário
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const objetivo = document.getElementById('objetivo').value;

    // Verifica se todos os campos estão preenchidos
    if (!nome || !email || !senha || !objetivo) {
        alert("Todos os campos são obrigatórios");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/usuarios/${idUsuario}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, email, senha, objetivo })
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar os dados do usuário');
        }

        const updatedUserData = await response.json();
        alert(`Dados atualizados com sucesso para o usuário com ID: ${updatedUserData.id_usuario}`);

        // Opcional: esconder o formulário ou redirecionar
        document.getElementById('formEditarUsuario').style.display = 'none';
        document.getElementById('formBuscarId').style.display = 'block'; // Exibe novamente o formulário de ID
    } catch (error) {
        alert(error.message);
    }
}

// Função para deletar o usuário
document.getElementById('deletarUsuario').addEventListener('click', deletarUsuario);
async function deletarUsuario() {
    const idUsuario = document.getElementById('editarUsuarioForm').getAttribute('data-user-id'); 

    if (!idUsuario) {
        alert("ID do usuário não encontrado");
        return;
    }

    const confirmDelete = confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.");

    if (confirmDelete) {
        try {
            const response = await fetch(`http://localhost:8080/usuarios/deletar/${idUsuario}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir o usuário');
            }

            alert("Usuário excluído com sucesso!");

            // Redireciona para a página de cadastro após deletar
            window.location.href = 'cadastro.html';
        } catch (error) {
            alert(error.message);
        }
    }
}
