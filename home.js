// Função para formatar valores monetários no formato BRL (Real Brasileiro)
function formatMoney(amount) {
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency', // Define o estilo como moeda
        currency: 'BRL',    // Define a moeda como Real Brasileiro
    });
    return formatter.format(amount); // Retorna o valor formatado
}

// Adiciona um ouvinte de evento ao botão "Carregar Dashboard"
document.querySelector("#botaodash").addEventListener("click", getUserDashboard);

// Função que busca e exibe os dados financeiros do usuário
function getUserDashboard() {
    const usuarioId = prompt("Digite o ID do Usuário para exibir:");

    if (usuarioId) {
        // Busca os gastos do usuário com base no ID
        fetch(`http://localhost:8080/gastos/lista/${usuarioId}`)
            .then(response => response.json())
            .then(gastosData => {
                // Busca os dados de receitas (renda)
                fetch(`http://localhost:8080/receitas/all`)
                    .then(response => response.json())
                    .then(rendaData => {
                        console.log("usuarioId:", usuarioId);
                        console.log("Renda Data:", rendaData);
                        // Eu substituí renda.usuario.usuarioId por renda.usuario.id_usuario
                        // Verifica se o filtro está correto, usando o campo 'id_usuario'
                        const userRenda = rendaData.filter(renda => 
                            renda.usuario && String(renda.usuario.id_usuario) === String(usuarioId)
                        );

                        
                        // Soma todas as rendas (caso haja múltiplos registros)
                        const totalRenda = userRenda.reduce((acc, item) => acc + parseFloat(item.renda), 0);

                        // Soma todos os gastos (sem agrupamento por categoria)
                        const totalGastos = gastosData.reduce((acc, gasto) => acc + parseFloat(gasto.valor), 0);

                        // Calcula o saldo (renda - gastos)
                        const saldo = totalRenda - totalGastos;

                        // Calcula a porcentagem do saldo em relação à renda
                        const saldoPercentage = (saldo / totalRenda) * 100;

                        // Determina a classificação financeira com base na porcentagem do saldo
                        const status = getStatusClass(saldoPercentage);

                        // Exibe os resultados na página HTML
                        const resultContainer = document.getElementById('resultContainer');
                        resultContainer.innerHTML = "";  // Limpa os resultados anteriores

                        // Exibe os totais de entrada (renda), saída (gastos) e o saldo
                        resultContainer.innerHTML += `
                            <div class="result-box-container">
                                <div class="result-box entrada">
                                    <span class="label">ENTRADA</span>
                                    <span class="number">${formatMoney(totalRenda)}</span>
                                </div>
                                 
                                <div class="result-box saida">
                                    <span class="label">SAÍDA</span>
                                    <span class="number">${formatMoney(totalGastos)}</span>
                                </div>

                                <div class="result-box saldo">
                                    <span class="label">SALDO</span>
                                    <span class="number">${formatMoney(saldo)}</span>
                                </div>

                                <div class="result-box status">
                                    <span class="label">SUA SAÚDE FINANCEIRA ESTÁ:</span>
                                    <span class="status-message ${status.class}">${status.message}</span>
                                </div>
                            </div>`;

                        // Criação do gráfico de pizza para gastos por categoria
                        createGastosChart(gastosData);

                        // Criação do gráfico de barras para a comparação entre renda, gastos e saldo
                        createBarChart(totalRenda, totalGastos, saldo);
                    })
                    .catch(error => {
                        console.error('Erro ao buscar dados de renda:', error);
                        alert('Falha ao carregar dados de renda.');
                    });
            })
            .catch(error => {
                console.error('Erro ao buscar dados de gastos:', error);
                alert('Falha ao carregar dados de gastos.');
            });
    } else {
        alert("Por favor, digite um ID de Usuário válido.");
    }
}

// Função que retorna o status financeiro do usuário com base na porcentagem do saldo
function getStatusClass(saldoPercentage) {
    if (saldoPercentage > 90) {
        return { class: "excellent", message: "EXCELENTE" };
    } else if (saldoPercentage >= 75 && saldoPercentage < 90) {
        return { class: "good", message: "BOA" };
    } else if (saldoPercentage >= 50 && saldoPercentage < 75) {
        return { class: "stable", message: "ESTÁVEL" };
    } else if (saldoPercentage >= 30 && saldoPercentage < 50) {
        return { class: "bad", message: "RUIM" };
    } else if (saldoPercentage <= 30) {
        return { class: "poor", message: "PREOCUPANTE" };
    }
}

// Função que cria o gráfico de pizza para os gastos por categoria
function createGastosChart(gastosData) {
    const categories = [
        { id: 1, name: 'Pessoal' },
        { id: 2, name: 'Transporte' },
        { id: 3, name: 'Lazer' },
        { id: 4, name: 'Compras' },
        { id: 5, name: 'Educação' },
        { id: 6, name: 'Saúde' },
        { id: 7, name: 'Alimentação' },
        { id: 8, name: 'Casa' },
        { id: 9, name: 'Outros' }
    ];

    // Calcula o total de gastos por categoria
    const categoryTotals = categories.map(category => {
        const totalCategory = gastosData.filter(gasto => gasto.categoria.id_categoria === category.id)
            .reduce((sum, gasto) => sum + parseFloat(gasto.valor), 0);
        return {
            name: category.name,
            value: totalCategory
        };
    });

    // Dados para o gráfico de pizza
    const chartData = {
        labels: categoryTotals.map(item => item.name),
        datasets: [{
            data: categoryTotals.map(item => item.value),
            backgroundColor: [
                '#28a745', '#dc3545', '#ffc107', '#007bff', '#17a2b8', '#fd7e14', '#6610f2', '#6c757d', '#f8f9fa'
            ],
            borderWidth: 1
        }]
    };

    // Opções para personalizar o gráfico
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return formatMoney(tooltipItem.raw); // Formata o valor com a função formatMoney
                    }
                }
            }
        }
    };

    // Criação do gráfico de pizza usando Chart.js
    const ctx = document.getElementById('gastosChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',  // Tipo de gráfico (pizza)
        data: chartData,
        options: options
    });
}

// Função para criar o gráfico de barras para renda, gastos e saldo
function createBarChart(totalRenda, totalGastos, saldo) {
    const chartData = {
        labels: ['Renda', 'Gastos', 'Saldo'],
        datasets: [{
            label: 'Valores',
            data: [totalRenda, totalGastos, saldo],
            backgroundColor: [
                '#28a745', '#dc3545', '#c6c5c5'
            ],
            borderColor: [
                '#28a745', '#dc3545', '#c6c5c5'
            ],
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return formatMoney(tooltipItem.raw); // Formata o valor com a função formatMoney
                    }
                }
            }
        }
    };

    // Criação do gráfico de barras usando Chart.js
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',  // Tipo de gráfico (barras)
        data: chartData,
        options: options
    });
}