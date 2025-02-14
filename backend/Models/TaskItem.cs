using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool Completed { get; set; }



    }


    public class TaskDB{
    private static List<TaskItem> tasks = new List<TaskItem>{
        new TaskItem{Id=1, Title="Task 1", Completed=true},
        new TaskItem{Id=2, Title="Task 2", Completed=false},
        new TaskItem{Id=3, Title="Task 3", Completed=false},
        new TaskItem{Id=4, Title="Task 4", Completed=false},
        new TaskItem{Id=5, Title="Task 5", Completed=false},
    };

    public static List<TaskItem> GetTasks(){
        return tasks;
    }

    public static TaskItem GetTask(int id){
        return tasks.SingleOrDefault(t => t.Id == id);
    }

    public static TaskItem addTask(TaskItem task){
        task.Id = tasks.Max(t => t.Id) + 1;
        tasks.Add(task);
        return task;
    }

    public static TaskItem updateTask(TaskItem task){
        var taskToUpdate = tasks.SingleOrDefault(t => t.Id == task.Id);
        if(taskToUpdate != null){
            taskToUpdate.Title = task.Title;
            taskToUpdate.Completed = task.Completed;
        }
        return taskToUpdate;
    }

    public static TaskItem deleteTask(int id){
        var taskToDelete = tasks.SingleOrDefault(t => t.Id == id);
        if(taskToDelete != null){
            tasks.Remove(taskToDelete);
        }
        return taskToDelete;
    }
}
}