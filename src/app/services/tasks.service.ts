import { Injectable, OnInit } from '@angular/core';
import { Task } from '../model/task';
import { Observable, of } from 'rxjs';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root',
})
export class TasksService{
  tasks: Task[] = [];
  taskCounter = 0;

  constructor() {
    this.getTasksFromStorage().then(data => this.tasks = data);
  }

  //para obtener todas las tareas disponibles
  public getTasks(): Task[] {
    return this.tasks;
  }

  //obtenemos una tarea segun el id pasado por parametro
  public getTask(id: number): Task {
    //importarte los ... delante ya que sino se pone pasarias el num de referencia no los valores de la instancia
    return { ...this.tasks.filter((t) => t.id === id)[0] };
  }

  //metodo que te borra la tarea especificada por el id
  public deleteTask(id: number) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  /*###############################################
    ####                                       ####
    ####         METODOS PARA STORAGE          ####
    ####                                       ####
    ###############################################*/

  /*
    Metodo para guardar una tarea
    Recordemos: El objeto Promise (Promesa) es usado para computaciones asíncronas.
    Una promesa representa un valor que puede
    estar disponible ahora, en el futuro, o nunca.
  */
  async saveTask(t: Task): Promise<boolean> {
    if (t.id === undefined) {
      // tarea nueva
      t.id = this.taskCounter++;
      this.tasks.push(t);
    } else {
      // edición de una tarea existente
      this.deleteTask(t.id);
      this.tasks.push(t);
    }
    await this.saveTasksIntoStorage();
    await this.saveTasksCounterIntoStorage();

    return true;
  }

  /*
    Este metodo lo que hace es recorrer nuestro Storage para ir obteniendo todas
    las tareas almacenadas
    Recordemos: El objeto Promise (Promesa) es usado para computaciones asíncronas.
    Una promesa representa un valor que puede
    estar disponible ahora, en el futuro, o nunca.
  */
  async getTasksFromStorage(): Promise<Task[]> {
    const ret = await Storage.get({ key: 'tasks' });
    return JSON.parse(ret.value) ? JSON.parse(ret.value) : [];
  }

  //Devuelve el valor de taskCounter que indica el numero de tareas existentes
  async getTasksCounterFromStorage(): Promise<number> {
    const count = await Storage.get({ key: 'taskCounter' });
    return Number.isInteger(+count.value) ? +count.value : 0;
    // el + convierte en número el count en JS, en java habría que hacer un parseInt
  }

  //Método que guarda la tarea dentro de la base de datos
  async saveTasksIntoStorage(): Promise<boolean> {
    await Storage.set({
      key: 'tasks',
      value: JSON.stringify(this.tasks), //JSON.stringify parsea a string
    });
    return true;
  }

  //Método que guarda el id que tendra cada tarea
  async saveTasksCounterIntoStorage(): Promise<boolean> {
    await Storage.set({
      key: 'taskCounter',
      value: '' + this.taskCounter,
    });
    return true;
  }

  //obtenemos el id maximo de nuestras tareas almacenada, de esta forma
  //si tomamos este valor y le incrementamos en uno , nunca se repite el id
  async getMaxTaskID(): Promise<number>  {
    const tasks = await this.getTasksFromStorage();
    const tasksIDs = tasks.map(task => task.id);
    const id = Math.max(...tasksIDs);

    return id ?? 0;
  }
}
