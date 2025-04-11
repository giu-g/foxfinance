function isEmailValid(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  
  function validateSenha(senha, minDigits) {
    return senha.length >= minDigits;
  }
  
  document.getElementById('cadastro-form')?.addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const nome = document.getElementById('cadastro-nome').value;
    const email = document.getElementById('cadastro-email').value;
    const senha = document.getElementById('cadastro-senha').value;
    const objetivo = document.getElementById('cadastro-objetivo').value;
  
    if (!nome) {
      alert("Preencha o seu nome");
      return;
    }
  
    if (!email || !isEmailValid(email)) {
      alert("Por favor, preencha o email corretamente");
      return;
    }
  
    if (!validateSenha(senha, 6)) {
      alert("Preencha a senha com no mínimo 6 dígitos");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8080/usuarios/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, objetivo })
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao cadastrar usuário');
      }
  
      const data = await response.json();
      const id_usuario = data.id_usuario;
  
      if (!id_usuario) {
        throw new Error('ID do usuário não encontrado na resposta da API');
      }
  
      alert(`O ID do usuário é: ${id_usuario}`);
      window.location.href = "index.html";
  
    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert("Erro ao cadastrar. Tente novamente.");
    }
  });

  document.getElementById('gerenciarConta-formBuscarId').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('idUsuario').value;
    // Busca o usuário
    // ...
    document.getElementById('gerenciarConta-formEditarUsuario').style.display = 'flex';
  });
  
  document.getElementById('gerenciarConta-formEditarUsuario').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('idUsuario').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const objetivo = document.getElementById('objetivo').value;
    // Atualiza o usuário
    // ...
  });
  
  document.getElementById('gerenciarConta-deletarUsuario').addEventListener('click', async () => {
    const id = document.getElementById('idUsuario').value;
    if (!id) return alert("ID inválido");
    // Confirmação e deleção
    // ...
  });
  