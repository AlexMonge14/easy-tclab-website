const socket = io.connect("http://127.0.0.1:5000");

const charts = {
    Q1: createChart('Q1Chart', 'Q1 (Heater 1)', 'blue'),
    Q2: createChart('Q2Chart', 'Q2 (Heater 2)', 'blue'),
    T1: createChart('T1Chart', 'T1 (Temperature 1)', 'red'),
    T2: createChart('T2Chart', 'T2 (Temperature 2)', 'red'),
};

start = 0;

window.addEventListener('click', function(event) {
    const dropdowns = document.getElementsByClassName("dropdown");
    for (let dropdown of dropdowns) {
        const dropdownButton = dropdown.querySelector('button');
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.style.display = "none";
        }
    }
});

socket.on("tclab_status", (data) => {
    const h1 = document.getElementById("response");
    const statusText = data.connected ? "System Connected  :)" : "System Not found  :(";
    const statusColor = data.connected ? "#00FF7F" : "red";

    h1.innerHTML = statusText;
    h1.style.color = statusColor;

    document.querySelectorAll(".heater").forEach(button => button.disabled = !data.connected);

    if (data.connected) socket.emit("update_data");
});

socket.on("server_status", (data) => {
    logMessage(data.connected);
});

socket.on("heater_status", (data) => {
    logMessage(data.status);
});


socket.on("tclab_data", (data) => {
    const time = new Date().getTime();
    console.log(data);
    updateChart(charts.Q1, data.Q1, time);
    updateChart(charts.Q2, data.Q2, time);
    updateChart(charts.T1, data.T1, time);
    updateChart(charts.T2, data.T2, time);
});

function logMessage(message) {
    const consoleElement = document.getElementById("log");
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0'); 
    const minutes = String(now.getMinutes()).padStart(2, '0'); 
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    const formattedMessage = `[${timeString}] ${message}`;
    const newMessage = document.createElement("div");
    newMessage.textContent = formattedMessage;
    consoleElement.appendChild(newMessage);
    consoleElement.scrollTop = consoleElement.scrollHeight;
}

function selectHeat(temp, dropdownId) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let dropdown of dropdowns) {
        dropdown.style.display = "none";
    }
    socket.emit('set_heater', {percentage: temp, heater: dropdownId});
}

function showDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = "block";
}

function createChart(elementId, label, borderColor) {
    return new Chart(document.getElementById(elementId), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: borderColor,
                backgroundColor: borderColor,
                fill: false,
                tension: 0.1,
                pointRadius: 2,
                pointHoverRadius: 5,
            }]
        },
        options: {
            responsive: false,
            animation: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#567aeb',
                        font: {
                            size: 14
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Time',
                        color: '#567aeb',
                    },
                    ticks: {
                        color: 'white',
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: label.split(" ")[0],
                        color: '#567aeb',
                    },
                    ticks: {
                        color: 'white',
                    }
                }
            }
        }
    });
}

function updateChart(chart, value, time) {
    if(chart.data.datasets[0].data.length === 0)
        start = time
    chart.data.labels.push((time - start) / 1000);
    chart.data.datasets[0].data.push(value);
    chart.update();
}