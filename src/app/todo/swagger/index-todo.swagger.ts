import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { TodoEntity } from "../entity/todo.entity";

/*ocumentação do retorno da api, ou seja, quais são as propriedades e seus tipos que
irão vir quando o endpoint for executado.*/
//Entidade completa.
export class IndexTodoSwagger extends TodoEntity {}

/*O método ou atributo OmitType omite as propriedades citadas para que não retorne quando a api. Por exemplo,
quando houver a listagem das tarefas e quero omitir o 'createdAt' e etc. */ 
//export class IndexTodoSwagger extends OmitType(TodoEntity, ['createdAt', 'updatedAt', 'deletedAt']) {}

/*O atributo PartialType permite com que as propriedades fiquem opcionais na api*/
//export class IndexTodoSwagger extends PartialType(TodoEntity) {}

/*Também posso combinar ambos os métodos ou atributos "OmitType" e "PartialType" */
//export class IndexTodoSwagger extends PartialType(OmitType(TodoEntity, ['createdAt', 'updatedAt', 'deletedAt'])) {}

/*Podemos ter um cenário onde precisamos retornar uma propriedade "items" e que essa propriedade irá receber
o TodoEntity no padrão array: */
/*export class IndexTodoSwagger {
    //Mapeia a propriedade items
    @ApiProperty({type: TodoEntity, isArray: true})
    items: TodoEntity[];
}*/