// =========================
    // Graphique en ligne
    // =========================

    const dashboardData = window.dashboardData || {
      publishedCount: 0,
      draftCount: 0,
      categoryLabels: [],
      categoryData: []
    };

    const lineCtx = document.getElementById('lineChart');

    const isPublishedHigher = dashboardData.publishedCount > dashboardData.draftCount;
    const lineColor = isPublishedHigher ? '#16a34a' : '#ef4444';
    const backgroundLineColor = isPublishedHigher ? 'rgba(22, 163, 74, 0.25)' : 'rgba(239, 68, 68, 0.2)';

    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['Publiés', 'Brouillons'],
        datasets: [
          {
            label: 'Statut des articles',
            data: [dashboardData.publishedCount, dashboardData.draftCount],
            borderColor: lineColor,
            backgroundColor: backgroundLineColor,
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });


    // =========================
    // Graphique Donut
    // =========================

    const donutCtx = document.getElementById('donutChart');
    const categoryLabels = dashboardData.categoryLabels.length ? dashboardData.categoryLabels : ['Aucune catégorie'];
    const categoryData = dashboardData.categoryData.length ? dashboardData.categoryData : [1];

    new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: categoryLabels,
        datasets: [{
          data: categoryData,
          backgroundColor: [
            '#ff4d4d',
            '#2f80ed',
            '#f2c94c',
            '#bb6bd9',
            '#56ccf2',
            '#828282',
            '#34d399',
            '#fb7185'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });