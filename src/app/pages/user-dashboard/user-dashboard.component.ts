import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: []
})
export class UserDashboardComponent implements OnInit {
  activeView: string = 'home';

  tasks: any[] = [];
  filteredTasks: any[] = [];
  users: any[] = [];
  searchText: string = '';
  completedCount = 0;
  inProgressCount = 0;

  task: any = { title: '', description: '', status: 'Pending', dueDate: '' };

  constructor(private taskService: TaskService, private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loadTasks();
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((res: any) => {
      this.users = res;
    });
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((res: any) => {
      this.tasks = res;
      this.filteredTasks = res;
      this.completedCount = res.filter((t: any) => t.status === 'Completed').length;
      this.inProgressCount = res.filter((t: any) => t.status === 'In Progress').length;
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

  searchTask() {
    this.filteredTasks = this.tasks.filter(t =>
      t.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
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
    const userId = localStorage.getItem('userId');
    if (!this.task.taskId) {
      this.task.createdBy = userId ? parseInt(userId) : 0;
    }

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

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}