async function carregarGastos() {
    try {
        // Solicita ao usuário o ID do usuário através de um prompt
        const id_usuario = prompt("Por favor, insira o ID do usuário:");

        // Verifica se o ID do usuário foi informado
        if (!id_usuario) {
            alert("Você precisa informar um ID de usuário.");
            return;
        }

        // Exibe um alerta com o ID do usuário antes de realizar a requisição
        alert(`Buscando os gastos para o usuário com ID: ${id_usuario}`); 

        // Realiza a requisição para buscar os dados dos gastos do usuário
        const response = await fetch(`http://localhost:8080/gastos/lista/${id_usuario}`);

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Não foi possível carregar os gastos.');
        }

        const gastos = await response.json();

        // Obtém a referência para a tabela onde os dados serão carregados
        const tabelaGastos = document.getElementById('tabela-gastos');
        tabelaGastos.innerHTML = ''; // Limpa a tabela antes de adicionar os novos dados

        // Verifica se há gastos e preenche a tabela com os dados
        if (gastos.length === 0) {
            alert("Nenhum gasto encontrado para este usuário.");
        } else {
            gastos.forEach(gasto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${gasto.dataa}</td>
                    <td>${gasto.tipo_gastos}</td>
                    <td>${gasto.valor}</td>
                `;
                tabelaGastos.appendChild(row);
            });
        }

    } catch (error) {
        console.error('Erro ao carregar os gastos:', error);
        alert("Erro ao carregar os gastos.");
    }
}

async function carregarGastosPorUsuarioEData() {
    try {
        // Obtém os valores do ID do usuário e a data do filtro de data
        const id_usuario = document.getElementById('idUsuarioFiltro').value;  // ID do usuário fornecido no input
        const dataFiltro = document.getElementById('dataFiltro').value;  // Data selecionada no input

        // Verifica se ambos os campos foram preenchidos
        if (!id_usuario || !dataFiltro) {
            alert("Você precisa informar o ID do usuário e selecionar uma data.");
            return;
        }

        // Exibe um alerta com o ID do usuário e a data antes de realizar a requisição
        alert(`Buscando os gastos para o usuário com ID: ${id_usuario} na data ${dataFiltro}`); 

        // Realiza a requisição para buscar os dados dos gastos do usuário na data fornecida
        const response = await fetch(`http://localhost:8080/gastos/buscarPorUsuarioEData/${id_usuario}/${dataFiltro}`);

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Não foi possível carregar os gastos.');
        }

        const gastos = await response.json();

        // Obtém a referência para a tabela onde os dados serão carregados
        const tabelaGastos = document.getElementById('tabela-gastos');
        tabelaGastos.innerHTML = ''; // Limpa a tabela antes de adicionar os novos dados

        // Verifica se há gastos e preenche a tabela com os dados
        if (gastos.length === 0) {
            alert("Nenhum gasto encontrado para este usuário e data.");
        } else {
            gastos.forEach(gasto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${gasto.dataa}</td>
                    <td>${gasto.tipo_gastos}</td>
                    <td>${gasto.valor}</td>
                `;
                tabelaGastos.appendChild(row);
            });
        }

    } catch (error) {
        console.error('Erro ao carregar os gastos:', error);
        alert("Erro ao carregar os gastos.");
    }
}

// Carrega os dados assim que a página for carregada
document.addEventListener('DOMContentLoaded', carregarGastos);
// Obtém os elementos
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');

// Adiciona evento de clique no ícone do hambúrguer
hamburger.addEventListener('click', () => {
    navbar.classList.toggle('active'); // Alterna a classe 'active' para mostrar/ocultar o menu
    hamburger.classList.toggle('active'); // Alterna o estilo do hambúrguer
});