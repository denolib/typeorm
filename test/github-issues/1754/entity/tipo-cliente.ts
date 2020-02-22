import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "../../../../src/index.ts";
import { Cliente } from "./cliente.ts";

@Entity()
export class TipoCliente {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: String, name: "tipo"})
    descricao: string;

    @OneToMany(() => Cliente, c => c.tipo)
    clientes: Cliente[];

}
