package com.example.backend.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.entity.Employee;
import com.example.backend.repository.EmployeeRepo;
@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepo repo;
    public Employee saveEmployee(Employee employee){
        return repo.save(employee);
    }
    public List<Employee> getEmployees(){
        return repo.findAll();
    }
    public void deleteEmployee(Long id){
        repo.deleteById(id);
    }
    public Employee updateEmployee(Long id, Employee newEmployee) {

    Employee existingEmployee = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee Not Found"));

    existingEmployee.setName(newEmployee.getName());
    existingEmployee.setEmail(newEmployee.getEmail());
    existingEmployee.setPassword(newEmployee.getPassword());

    return repo.save(existingEmployee);
}
}
