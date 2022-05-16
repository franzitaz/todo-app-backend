import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entity/todo.entity';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoEntity)
        private readonly todoRepository: Repository<TodoEntity>) {}

    //=====> listar todas as tarefas <=====//
    async findAll() {
        return await this.todoRepository.find();
    }

    //=====> exibe detalhes de uma tarefa <=====//
    async findOneOrFail(id: string) {
        try{
            return await this.todoRepository.findOneOrFail(id);
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    //=====> cria uma tarefa <=====//
    async create(data: CreateTodoDto) {
        return await this.todoRepository.save(this.todoRepository.create(data));
    }

    //=====> atualiza uma tarefa <=====//
    async update(id: string, data: UpdateTodoDto) {
        const todo = await this.findOneOrFail(id);
        
        this.todoRepository.merge(todo, data);
        return await this.todoRepository.save(todo);
    }

    //=====> deleta uma tarefa <=====//
    async deletedById(id: string) {
        await this.findOneOrFail(id);
        await this.todoRepository.softDelete(id);
    }
}
