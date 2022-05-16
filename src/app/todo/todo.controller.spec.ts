import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entity/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

/*É válido lembrar que estes testes são testes unitários. Então os testes
são mocados e separados em cenários, ou seja, os testes não são feitos no
banco de dados, mas sim, feitos "aqui", dentro de cenários preparados. */

const todoEntityList: TodoEntity[] = [
  new TodoEntity({id: '1', task: 'task-1', isDone: 0}),
  new TodoEntity({id: '2', task: 'task-2', isDone: 0}),
  new TodoEntity({id: '3', task: 'task-3', isDone: 0}),
];

const newTodoEntity = new  TodoEntity({task: 'new task', isDone: 0})

const updatedTodoEntity = new TodoEntity({task: 'task-1', isDone: 1});

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          /*Aqui vamos "mockar" as funções do TodoService (o constructor na linha 17 
          do to 'todo.controller.ts') com funções jest (jest.fn()). As funções que
          está sendo utilizado juntamente no todoService no arquivo 
          "todo.controller.ts".*/
          useValue: {
            findAll: jest.fn().mockResolvedValue(todoEntityList),
            create: jest.fn().mockResolvedValue(newTodoEntity),
            findOneOrFail: jest.fn().mockResolvedValue(todoEntityList),
            update: jest.fn().mockResolvedValue(updatedTodoEntity),
            deletedById: jest.fn().mockResolvedValue(undefined),
          }
        }
      ]
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  //=====> index <=====//
  //Depois que definimos o "todoService", agora vamos testar as funções
  describe('index', () => {
    it('should return todo list entity successfully', async ()=> {
      //Arrange, preparação dos dados.

      //Act, onde roda o teste.
      const result = await todoController.index();

      //Assert, é onde garante que as coisas sejam de uma forma.
      expect(result).toEqual(todoEntityList);
      expect(typeof result).toEqual('object');
      expect(result[0].id).toEqual(todoEntityList[0].id);
      expect(todoService.findAll).toHaveBeenCalledTimes(1);
    });

    //Outro cenário de teste é caso do repositório quebrar
    it('should throw an exception', ()=> {
      //Arrange, preparação de dados
      /*Com o spyOn, o valor definido no findAll irá mudar. E o 
      'mockRejectedValueOnce' reseta para o valor original. Se não estiver usando
      o "Once", isso irá afetar os outros testes.*/
      jest.spyOn(todoService, 'findAll').mockRejectedValueOnce(new Error());

      //Assert, é onde garante que as coisas sejam de uma forma.
      expect(todoController.index()).rejects.toThrowError();
    });
  });

  //=====> create <=====//
  describe('create', ()=> {
    it('should create a new todo item successfully', async ()=> {
      //Arrange, preparação dos dados.
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0
      }

      //Act, onde roda o teste
      const result = await todoController.create(body);

      //Assert, garante que os testes aconteçam de uma forma.
      expect(result).toEqual(newTodoEntity);
      expect(todoService.create).toHaveBeenCalledTimes(1);
      expect(todoService.create).toHaveBeenCalledWith(body);
    });

    it('should throw an exception', () => {
      //Arrange, preparação dos dados
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0
      };

      jest.spyOn(todoService, 'create').mockRejectedValueOnce(new Error());

      //Assert, garante que os testes aconteçam de uma forma.
      expect(todoController.create(body)).rejects.toThrowError();
    })
  });

  //=====> show details <=====//
  describe('show', ()=> {
    it('should get a todo item successfully', async ()=> {
      //Act, onde roda o teste.
      const result = await todoController.show('1');

      //Assert, garante que os testes aconteçam de uma forma.
      expect(result[0]).toEqual(todoEntityList[0]);
      expect(todoService.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(todoService.findOneOrFail).toHaveBeenCalledWith('1');
    });

    it('should throw an exception', ()=> {
      //Arrange, preparação dos dados.
      jest.spyOn(todoService, 'findOneOrFail').mockRejectedValueOnce(new Error());

      //Assert, garante que os testes aconteçam de uma forma.
      expect(todoController.show('1')).rejects.toThrowError();
    })
  });

  //=====> update <=====//
  describe('update', ()=> {
    it('should update a todo item successfully', async ()=> {
      //Arrange, preparação dos dados.
      const body: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1
      };

      //Act, onde roda o teste.
      const result = await todoController.update('1', body);

      //Assert, garante que os testes aconteçam de uma forma.
      expect(result).toEqual(updatedTodoEntity);
      expect(todoService.update).toHaveBeenCalledTimes(1);
      expect(todoService.update).toHaveBeenCalledWith('1', body);
    });

    it('should throw an exception', ()=> {
      //Arrange, preparação de dados.
      const body: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1
      };

      jest.spyOn(todoService, 'update').mockRejectedValueOnce(new Error());

      //Assert, garante que os testes acontençam de uma forma.
      expect(todoController.update('1', body)).rejects.toThrowError();
    });
  });

  //=====> delete <=====//
  describe('destroy', ()=> {
    it('should delete a todo item successfully', async ()=> {
    //Act, onde roda o teste.
    const result = await todoController.destroy('1');

    //Assert, forma onde os testes acontecem.
    expect(result).toBeUndefined();
    });

    it('should throw an exception', ()=> {
      //Arrange, preparação dos dados.
      jest.spyOn(todoService, 'deletedById').mockRejectedValueOnce(new Error());

      //Assert, forma onde os testes acontecem.
      expect(todoController.destroy('1')).rejects.toThrowError();
    });
  });
});
