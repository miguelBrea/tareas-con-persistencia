import { Component } from '@angular/core';
import { Task } from '../model/task';
import { TasksService } from '../services/tasks.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private tasksService: TasksService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async presentAlertConfirm(t: Task) {
    console.log('alerta');
    const alert = await this.alertController.create({
      header: 'Borrar tarea',
      message: `¿Estás seguro que quieres borrar la tarea <strong> ${t.title}</strong>?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: () => {
            this.deleteTask(t.id);
          },
        },
      ],
    });
    await alert.present();
  }

  goEditTask(id: number) {
    this.router.navigateByUrl(`/edit${id !== undefined ? '/' + id : ''}`);
  }
  deleteTask(id: number) {
    this.tasksService.deleteTask(id);
  }
}
