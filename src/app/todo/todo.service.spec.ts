import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArgumentOutOfRangeError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entity/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

/*É válido lembrar que estes testes são testes unitários. Então os testes
são mocados e separados em cenários, ou seja, os testes não são feitos no
banco de dados, mas sim, feitos "aqui", dentro de cenários preparados. */

const todoEntityList: TodoEntity[] = [
  new TodoEntity({ task: 'task-1', isDone: 0 }),
  new TodoEntity({ task: 'task-2', isDone: 0 }),
  new TodoEntity({ task: 'task-3', isDone: 0 })
]

const updatedTodoEntityItem = new TodoEntity({ task: 'task-1', isDone: 1 });

describe('TodoService', () => {
  let todoService: TodoService;
  let todoRepository: Repository<TodoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          /*Primeiro Vamos mockar a injeção de repositório do 'todo.service.ts'
          na linha 11. Aqui estou criando a minha própria injeção. MAD SCIENTIST.
          O TypeORM fornece a função 'getRepositoryToken' para indicarmos quem é
          a nossa entidade (TodoEntity)*/
          provide: getRepositoryToken(TodoEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(todoEntityList),
            findOneOrFail: jest.fn().mockResolvedValue(todoEntityList[0]),
            /*O create não retorna uma promise, mas sim retorna um objeto.
            O create e save são usados juntos.*/
            create: jest.fn().mockReturnValue(todoEntityList[0]),
            save: jest.fn().mockResolvedValue(todoEntityList[0]),
            //O merge faz a fusão do dado e entidade recebido.
            merge: jest.fn().mockResolvedValue(updatedTodoEntityItem),
            softDelete: jest.fn().mockResolvedValue(undefined),
          }
        }
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<TodoEntity>>(getRepositoryToken(TodoEntity));
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  //====> findAll <=====//
  describe('findAll', () => {
    it('should return a todo list entity successfully', async () => {
      //Act, onde roda o teste.
      const result = await todoService.findAll();

      //Assert, forma onde os testes acontecem.
      expect(result).toEqual(todoEntityList);
      expect(todoRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      //Arrange, prepara os dados.
      jest.spyOn(todoRepository, 'find').mockRejectedValueOnce(new Error());

      //Assert
      expect(todoService.findAll()).rejects.toThrowError();
    });
  });

  //====> findOneOrFail <=====//
  describe('findOneOrFail', () => {
    it('should return a todo entity item successfully', async () => {
      //Act, onde roda o test
      const result = await todoService.findOneOrFail('1');

      //Assert, forma onde os testes acontecem.
      expect(result).toEqual(todoEntityList[0]);
      expect(todoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('should thrown a not found exception', () => {
      //Arrange, prepara os dados.
      jest.spyOn(todoRepository, 'findOneOrFail').mockRejectedValueOnce(new Error());

      //Assert, forma onde os testes acontecem.
      expect(todoService.findOneOrFail('1')).rejects.toThrowError(NotFoundException)
    });
  });

  //====> create <=====//
  describe('create', () => {
    it('should create a new todo entity item successfully', async () => {
      //Arrange, prepara os dados.
      const data: CreateTodoDto = {
        task: 'task-1',
        isDone: 0
      };

      //Act, onde o teste roda.
      const result = await todoService.create(data);

      //Assert, forma onde os testes acontecem.
      expect(result).toEqual(todoEntityList[0]);
      expect(todoRepository.create).toHaveBeenCalledTimes(1);
      expect(todoRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      //Arrange, prepara os dados.
      const data: CreateTodoDto = {
        task: 'task-1',
        isDone: 0
      };

      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());

      //Assert, forma onde os testes acontecem.
      expect(todoService.create(data)).rejects.toThrowError();
    })
  });

  //====> update <=====//
  describe('update', ()=> {
    it('should update a todo entity item successfully', async ()=> {
      //Arrange, prepara os dados.
      const data: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1
      };

      /*O 'save' está mockado como 'todoEntityList[0]', e por isso
      é necessário que peçamos para o test injetar o 'updateTodoEntityItem', pois 
      nesse caso, o 'save' está retornando o 'todoEntityList[0], mas queremos que o
      'update' + 'save' retornem o 'updatedTodoEntityItem'. */
      jest.spyOn(todoRepository, 'save').mockResolvedValueOnce(updatedTodoEntityItem);

      //Act, onde roda o teste
      const result = await todoService.update('1', data);

      //Assert, forma onde os testes acontecem.
      expect(result).toEqual(updatedTodoEntityItem);
    });

    it('should throw a not found exception', ()=> {
      //Arrange, prepara os dados.
      const data: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1
      };

      jest.spyOn(todoRepository, 'findOneOrFail').mockRejectedValueOnce(new Error());

      //Assert, forma onde os testes acontecem.
      expect(todoService.update('1', data)).rejects.toThrowError(NotFoundException);
    });

    it('should throw an exception', ()=> {
      //Arrange, prepara os dados.
      const data: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1
      };

      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());

      //Assert, forma onde os testes acontecem.
      expect(todoService.update('1', data)).rejects.toThrowError();
    });
  });

  //====> delete <=====//
  describe('deleteById', ()=> {
    it('should delete a todo entity item successfully', async ()=> {
      //Act, onde roda o teste.
      const result = await todoService.deletedById('1');

      //Assert, forma onde os testes acontecem.
      expect(result).toBeUndefined();
      expect(todoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(todoRepository.softDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw a not found exception', ()=> {
      //Arrange, prepara os dados.
      jest.spyOn(todoRepository, 'findOneOrFail').mockRejectedValueOnce(new Error());

      //Assert
      expect(todoService.deletedById('1')).rejects.toThrowError(NotFoundException);
    });

    it('should throw an expcetion', ()=>  {
      //Arrange, prepara os dados.
      jest.spyOn(todoRepository, 'softDelete').mockRejectedValueOnce(new Error());

      //Assert, forma onde os testes acontecem.
      expect(todoService.deletedById('1')).rejects.toThrowError();
    })
  });
});
