import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({name: 'todos'})
export class TodoEntity {
    @PrimaryGeneratedColumn('uuid')
    //O decorator @ApiProperty mapeia a propriedade para o swagger
    @ApiProperty()
    id: string;

    @Column()
    @ApiProperty()
    task: string;

    @Column({name: 'is_done', type: 'tinyint', width: 1})
    @ApiProperty()
    isDone: number;

    @CreateDateColumn({name: 'created_at'})
    @ApiProperty()
    createdAt: string;

    @UpdateDateColumn({name: 'updated_at'})
    @ApiProperty()
    updatedAt: string;

    @DeleteDateColumn({name: 'deleted_at'})
    @ApiProperty()
    deletedAt: string;

    /*Para facilitar os testes, é importante criar este construtor, pois será
    necessário "mockar" muita informação. E iremos usar a entidade porque ela
    representa as tabelas do banco de dados. E com esse constructor iremos
    "imputar"/colocar algumas informações.*/
    /*Todos os parâmetros do construtor DEVEM ser opcionais, pois, o TypeORM,
    irá instanciar esses parâmetros e, com isso, estes precisam ser opcionais
    para que haja flexibilidade do valor ser nulo.*/
    /*Tudo o que for passado no construtor está sendo atribuído como 
    propriedade de class. */
    constructor(todo?: Partial<TodoEntity>) {
      this.id = todo?.id;
      this.task = todo?.task;
      this.isDone = todo?.isDone;
      this.createdAt = todo?.createdAt;
      this.updatedAt = todo?.updatedAt;
      this.deletedAt = todo?.deletedAt;
    }
}