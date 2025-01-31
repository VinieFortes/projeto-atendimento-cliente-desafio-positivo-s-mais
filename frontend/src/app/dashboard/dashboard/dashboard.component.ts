import { Component, OnInit } from '@angular/core';
import { DashboardService, Estatisticas, Atendimento } from '../dashboard.service';
import { DatePipe, CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  providers: [DatePipe],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Estatísticas
  totalAtendimentos: number = 0;
  atendimentosEmAndamento: number = 0;
  atendimentosRespondidos: number = 0;
  atendimentosFinalizados: number = 0;
  mediaFeedback: number = 0;

  // Histórico de Atendimentos
  historicoAtendimentos: Atendimento[] = [];

  // Dados dos Gráficos
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true
      },
    }
  };
  public pieChartType: 'pie' = 'pie';
  public pieChartLabels: string[] = ['Abertos', 'Respondidos', 'Finalizados'];
  public pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [
      { data: [0, 0, 0] }
    ]
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.carregarEstatisticas();
    this.carregarHistorico();
  }

  carregarEstatisticas() {
    this.dashboardService.getEstatisticas().subscribe({
      next: (stats: Estatisticas) => {
        this.totalAtendimentos = stats.totalContatos;
        this.atendimentosEmAndamento = stats.abertos;
        this.atendimentosRespondidos = stats.respondidos;
        this.atendimentosFinalizados = stats.finalizados;
        this.mediaFeedback = stats.mediaFeedback;

        // Atualizar dados do gráfico
        this.pieChartData = {
          labels: this.pieChartLabels,
          datasets: [
            { data: [
                this.atendimentosEmAndamento,
                this.atendimentosRespondidos,
                this.atendimentosFinalizados
              ]}
          ]
        };
      },
      error: () => console.error('Erro ao carregar estatísticas')
    });
  }

  carregarHistorico() {
    this.dashboardService.getHistoricoAtendimentos().subscribe({
      next: (historico: Atendimento[]) => this.historicoAtendimentos = historico,
      error: () => console.error('Erro ao carregar histórico de atendimentos')
    });
  }
}
