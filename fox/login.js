document.getElementById('form').addEventListener('submit', loginUsuario);

function cadastrarUsuario(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;


    fetch('http://localhost:8080/usuarios/criar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
    })
        .then(response => response.json())
        .then(data => {
            alert('Usuário cadastrado com sucesso!');
            document.getElementById('form').reset();
            console.log('chamou o cadastro');
        })
        .catch(error => {
            console.error('Erro ao cadastrar usuário:', error);
            console.log('não chamou o cadastro');
        });
}