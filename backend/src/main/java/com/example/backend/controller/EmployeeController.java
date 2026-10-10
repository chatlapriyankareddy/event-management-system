package com.example.backend.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;

import com.example.backend.entity.Employee;
import com.example.backend.service.EmployeeService;

@RestController
@RequestMapping("/employee")
public class EmployeeController {
    @Autowired
    private EmployeeService service;
    
    @PostMapping("/add")
    public Employee saveEmployee(@RequestBody Employee employee){
        return service.saveEmployee(employee);
    }
    @GetMapping("/get")
    public List<Employee> getEmployees() {

        return service.getEmployees();

    }
    @DeleteMapping("/delete/{id}")
    public String deleteEmployee(@PathVariable Long id){
        service.deleteEmployee(id);
        return "Employee deleted Successfully";
    }
    @PutMapping("/update/{id}")
    public Employee updateEmployee(@PathVariable Long id,@RequestBody Employee employee)
    {
        return service.updateEmployee(id,employee);
    }
}
