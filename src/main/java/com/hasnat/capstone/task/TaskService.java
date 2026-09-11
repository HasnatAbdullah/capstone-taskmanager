package com.hasnat.capstone.task;

import com.hasnat.capstone.task.dto.TaskRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository repo;

    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public List<Task> findAll(TaskStatus status) {
        return status == null ? repo.findAll() : repo.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public Task findById(Long id) {
        return repo.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
    }

    @Transactional
    public Task create(TaskRequest req) {
        Task t = new Task();
        apply(t, req);
        return repo.save(t);
    }

    @Transactional
    public Task update(Long id, TaskRequest req) {
        Task t = findById(id);
        apply(t, req);
        return repo.save(t);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new TaskNotFoundException(id);
        repo.deleteById(id);
    }

    private void apply(Task t, TaskRequest req) {
        t.setTitle(req.title());
        t.setDescription(req.description());
        if (req.status() != null) t.setStatus(req.status());
        t.setDueDate(req.dueDate());
    }
}