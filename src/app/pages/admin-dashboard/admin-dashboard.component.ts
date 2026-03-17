import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: []
})
export class AdminDashboardComponent implements OnInit {
  activeView: string = 'home';

  users: any[] = [];
  tasks: any[] = [];
  totalUsers = 0;
  totalTasks = 0;
  completedTasks = 0;

  task: any = { title: '', description: '', status: 'Pending', dueDate: '' };

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadTasks();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((res: any) => {
      this.users = res;
      this.totalUsers = res.length;
    });
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((res: any) => {
      this.tasks = res;
      this.totalTasks = res.length;
      this.completedTasks = res.filter((t: any) => t.status === 'Completed').length;
    });
  }

  getUserName(userId: number): string {
    const user = this.users.find((u: any) => u.userId === userId);
    return user ? user.name : 'Unknown';
  }

  getBadge(status: string): string {
    if (status === 'Completed') return 'badge-completed';
    if (status === 'In Progress') return 'badge-progress';
    return 'badge-pending';
  }

  openAddTask() {
    this.task = { title: '', description: '', status: 'Pending', dueDate: '' };
    this.activeView = 'add-task';
  }

  editTask(t: any) {
    this.task = { ...t };
    this.activeView = 'edit-task';
  }

  saveTask() {
    if (this.task.taskId) {
      this.taskService.updateTask(this.task.taskId, this.task).subscribe(() => {
        alert('Task updated successfully.');
        this.loadTasks();
        this.activeView = 'tasks';
      });
    } else {
      this.taskService.createTask(this.task).subscribe(() => {
        alert('Task created successfully.');
        this.loadTasks();
        this.activeView = 'tasks';
      });
    }
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}