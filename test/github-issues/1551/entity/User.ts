import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Chat} from "./Chat.ts";
import {Message} from "./Message.ts";
import {Recipient} from "./Recipient.ts";

export interface UserConstructor {
  username?: string;
  password?: string;
  name?: string;
  picture?: string;
  phone?: string;
}

@Entity()
export class User {
  constructor({username, password, name, picture, phone}: UserConstructor = {}) {
    if (username) {
      this.username = username;
    }
    if (password) {
      this.password = password;
    }
    if (name) {
      this.name = name;
    }
    if (picture) {
      this.picture = picture;
    }
    if (phone) {
      this.phone = phone;
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  username: string;

  @Column({ type: String })
  password: string;

  @Column({ type: String })
  name: string;

  @Column({type: String, nullable: true})
  picture?: string;

  @Column({type: String, nullable: true})
  phone?: string;

  @ManyToMany(type => Chat, chat => chat.allTimeMembers)
  allTimeMemberChats: Chat[];

  @ManyToMany(type => Chat, chat => chat.listingMembers)
  listedMemberChats: Chat[];

  @ManyToMany(type => Chat, chat => chat.actualGroupMembers)
  actualGroupMemberChats: Chat[];

  @ManyToMany(type => Chat, chat => chat.admins)
  adminChats: Chat[];

  @ManyToMany(type => Message, message => message.holders)
  holderMessages: Message[];

  @OneToMany(type => Chat, chat => chat.owner)
  ownerChats: Chat[];

  @OneToMany(type => Message, message => message.sender)
  senderMessages: Message[];

  @OneToMany(type => Recipient, recipient => recipient.user)
  recipients: Recipient[];
}
