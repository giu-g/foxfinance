// Função para enviar a receita (renda) do usuário
document.getElementById('formReceita').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio do formulário de forma padrão
    const salario = document.getElementById('renda').value;  // Corrigir se for o valor do salário
    let id_usuario = prompt("Por favor, insira o ID do usuário:");
    
     // Verifica se o nome está vazio
     if (id_usuario === "") {
        alert("Preencha um usuário");
        let id_usuario = prompt("Por favor, insira o ID do usuário:");
        return;
    }
   
    if (!salario || isNaN(salario) || parseFloat(salario) <= 0) {
        alert('Por favor, insira um valor de salário válido.');
        return;
    }

    // Primeiro, buscar o usuário pelo ID
    try {
        const usuarioResponse = await fetch(`http://localhost:8080/usuarios/${id_usuario}`);
        
        if (!usuarioResponse.ok) {
            const errorResponse = await usuarioResponse.json();
            console.error('Erro ao buscar o usuário:', errorResponse);
            throw new Error('Usuário não encontrado');
        }

        const usuarioData = await usuarioResponse.json();
        console.log("Usuário encontrado:", usuarioData);

        // Agora, enviar a receita associada ao usuário
        const receitaResponse = await fetch('http://localhost:8080/receitas/criar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                renda: parseFloat(salario),  // Envia o valor da renda
                usuario: usuarioData,         // Associa o usuário à receita
            }),
        });

        if (!receitaResponse.ok) {
            const errorResponse = await receitaResponse.json();
            console.error('Erro ao salvar a receita:', errorResponse);
            throw new Error(errorResponse.message || 'Erro ao salvar a receita');
        }

        const receitaData = await receitaResponse.json();
        alert('Receita salva com sucesso!'); // Exibe uma mensagem de sucesso

        // Limpa o campo após o envio
        document.getElementById('formReceita').reset();

    } catch (error) {
        console.error('Erro no envio:', error);
        alert('Erro ao salvar receita. Tente novamente.');
    }
        
});
