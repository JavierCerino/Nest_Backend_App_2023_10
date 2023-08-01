/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { User } from './user';

@Injectable()
export class UserService {
    
    private ids = 43;

    private users: User[] = [
        // Creamos un usuario para admin, permiso de lectura, permiso escritura, permiso eliminación
        new User(1, "producto.all", "productoAdmin", ["adminProducto"]),
        new User(3, "producto.read", "productoRead", ["readProducto"]),
        new User(4, "producto.write", "productoWrite", ["writeProducto"]),
        new User(5, "producto.delete", "productoDelete", ["deleteProducto"]),
        new User(6, "promocion.all", "promocionAdmin", ["adminPromocion"]),
        new User(7, "promocion.read", "promocionRead", ["readPromocion"]),
        new User(8, "promocion.write", "promocionWrite", ["writePromocion"]),
        new User(9, "promocion.delete", "promocionDelete", ["deletePromocion"]),
        new User(10, "menu.all", "menuAdmin", ["adminMenu"]),
        new User(11, "menu.read", "menuRead", ["readMenu"]),
        new User(12, "menu.write", "menuWrite", ["writeMenu"]),
        new User(13, "menu.delete", "menuDelete", ["deleteMenu"]),
        new User(14, "reserva.all", "reservaAdmin", ["adminReserva"]),
        new User(15, "reserva.read", "reservaRead", ["readReserva"]),
        new User(16, "reserva.write", "reservaWrite", ["writeReserva"]),
        new User(17, "reserva.delete", "reservaDelete", ["deleteReserva"]),
        new User(18, "usuario.all", "usuarioAdmin", ["adminUsuario"]),
        new User(19, "usuario.read", "usuarioRead", ["readUsuario"]),
        new User(20, "usuario.write", "usuarioWrite", ["writeUsuario"]),
        new User(21, "usuario.delete", "usuarioDelete", ["deleteUsuario"]),
        new User(22, "resenia.all", "reseniaAdmin", ["adminResenia"]),
        new User(23, "resenia.read", "reseniaRead", ["readResenia"]),
        new User(24, "resenia.write", "reseniaWrite", ["writeResenia"]),
        new User(25, "resenia.delete", "reseniaDelete", ["deleteResenia"]),
        new User(26, "cliente.all", "clienteAdmin", ["adminCliente"]),
        new User(27, "cliente.read", "clienteRead", ["readCliente"]),
        new User(28, "cliente.write", "clienteWrite", ["writeCliente"]),
        new User(29, "cliente.delete", "clienteDelete", ["deleteCliente"]),
        new User(30, "administradorEstablecimiento.all", "administradorEstablecimientoAdmin", ["adminAdministradorEstablecimiento"]),
        new User(31, "administradorEstablecimiento.read", "administradorEstablecimientoRead", ["readAdministradorEstablecimiento"]),
        new User(32, "administradorEstablecimiento.write", "administradorEstablecimientoWrite", ["writeAdministradorEstablecimiento"]),
        new User(33, "administradorEstablecimiento.delete", "administradorEstablecimientoDelete", ["deleteAdministradorEstablecimiento"]),
        new User(34, "establecimiento.all", "establecimientoAdmin", ["adminEstablecimiento"]),
        new User(35, "establecimiento.read", "establecimientoRead", ["readEstablecimiento"]),
        new User(36, "establecimiento.write", "establecimientoWrite", ["writeEstablecimiento"]),
        new User(37, "establecimiento.delete", "establecimientoDelete", ["deleteEstablecimiento"]),
        new User(38, "tag.all", "tagAdmin", ["adminTag"]),
        new User(39, "tag.read", "tagRead", ["readTag"]),
        new User(40, "tag.write", "tagWrite", ["writeTag"]),
        new User(41, "tag.delete", "tagDelete", ["deleteTag"]),
        new User(42, "userGod", "userGod", ["adminProducto","adminPromocion","adminMenu","adminReserva","adminUsuario","adminResenia","adminCliente","adminAdministradorEstablecimiento","adminEstablecimiento","adminTag"])
    ];

    async create(usuario:{"nombre","contrasenia"}): Promise<string> {
        try {
            const nombre = usuario.nombre; 
            const contrasenia = usuario.contrasenia
            const newUsuer = new User(this.ids, nombre, contrasenia, ["adminProducto","adminPromocion","adminMenu","adminReserva","adminUsuario","adminResenia","adminCliente","adminAdministradorEstablecimiento","adminEstablecimiento","adminTag"]);
            this.ids++;
            this.users.push(newUsuer);
            return "Ok"
        } catch {
            return "Error"
        }
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
}
