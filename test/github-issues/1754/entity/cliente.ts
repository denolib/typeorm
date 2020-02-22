import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "../../../../src/index.ts";
import { TipoCliente } from "./tipo-cliente.ts";

@Entity()
export class Cliente {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    nome: string;

    @ManyToOne(() => TipoCliente, tc => tc.clientes)
    @JoinColumn({name: "tipoCliente"})
    tipo: TipoCliente;

}
