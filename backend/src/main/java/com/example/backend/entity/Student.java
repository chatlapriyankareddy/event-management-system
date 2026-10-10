package com.example.backend.entity;

public class Student {
    private int age;
    private String name;
    private String course;
    public Student(int a,String n,String c){
        this.name = n;
        this.age = a;
        this.course = c;
    }
    public String getName(){
        return this.name;
    }
    public String getCourse(){
        return this.course;
    }
    public int getAge(){
        return this.age;
    }
    public void setName(String n){
        this.name = n;
    }
    public void setAge(int a){
        this.age = a;
    }
    public void setCourse(String c){
        this.course = c;
    }
    public Student(){
        
    }
}
