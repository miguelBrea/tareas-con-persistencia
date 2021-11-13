import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../model/task';
import { TasksService } from '../services/tasks.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})

export class EditPage implements OnInit {

  task: Task = {title: '', description: ''}

  constructor(
    public tasksService: TasksService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    const taskID = parseInt( this.activatedRoute.snapshot.paramMap.get('id') )
    const currentTask = await this.tasksService.getTaskFromStorage(taskID)

    /*
      En el caso de que la tarea tiene un id no sea Nan, quiere decir
      que no estamos creando una nueva tarea, sino editando una tarea
      Para ello necesitamos completar los inputs con sus correspondientes
      valores.
      Le pasamos el valor almacenado, y como estamos usando la directiva ngModel
      en el template se mostrara inmediatamente los datos almacenados.
    */
    if (!isNaN(taskID)) this.task = {...currentTask}
  }

  //Datos guardados
  saveTask() {
    this.tasksService.saveTask(this.task)
    this.router.navigateByUrl('/home')
  }

}
